const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const events = require('events');
const dgram = require('dgram');

const { port } = require('./config.json');

var activeAgents = [];

function createAgent(type, name, options = null)
{
	if (agents[type])
	{
		var agent = new agents[type](name, options);
		agent.type = type;
		activeAgents.push(agent);
		return agent;
	}
	else
	{
		console.log(`ERROR: agent "${type}" not found`);
	}
}

function getAgent(name)
{
	return activeAgents.find((agent) =>
	{
		return agent.name == name;
	});
}

function removeAgent(name)
{
	var index = activeAgents.findIndex((agent) =>
	{
		return agent.name == name;
	});

	if (index != -1)
	{
		activeAgents.splice(2, 1);
	}
}

function saveAgents()
{
	try
	{
		fs.mkdirSync('./serial');
	}
	catch (e) { }

	activeAgents.forEach(agent =>
	{
		var serial = agent.serialize();
		var json = JSON.stringify(serial);
		fs.writeFileSync(`./serial/${serial.name}.json`, json, 'utf-8');
	});
}

// CLI bullshit
var s = dgram.createSocket('udp4');
s.on('message', function (msg, rinfo)
{
	var json = JSON.parse(msg.toString());
	var command = json.input[0];
	var flags = json.flags;
	var result = 'Unknown error';

	var name = flags.name;

	switch (command)
	{
		case 'create':
			var type = flags.type;

			if (!type)
			{
				result = 'Missing agent type';
			}
			else if (!agents[type])
			{
				result = `Agent type "${type}" does not exist`;
			}
			else if (!name)
			{
				result = 'Missing agent name';
			}
			else if (getAgent(name))
			{
				result = `Name "${name}" already used by another agent`;
			}
			else
			{
				createAgent(type, name);
				result = `Agent "${name}" of type "${type}" created`;
				saveAgents();
			}
			break;

		case 'remove':
			if (!name)
			{
				result = 'Missing agent name';
			}
			else
			{
				if (!getAgent(name))
				{
					result = `Agent "${name}" does not exist`;
				}
				else
				{
					removeAgent(name);
					result = `Agent "${name}" removed`;
					saveAgents();
				}
			}
			break;

		case 'options':
			var key = flags.key;
			var value = flags.value;

			if (!getAgent(name))
			{
				result = `Agent "${name}" does not exist`;
			}
			else if (!key)
			{
				result = 'Missing "key"';
			}
			else if (!value)
			{
				result = 'Missing "value"';
			}
			else
			{
				getAgent(name).options[key] = value;

				result = `Option "${key}" changed to "${value}" in agent "${name}"`;
				saveAgents();
			}
			break;

		case 'view':
			result = 'This command is unfinished';
			break;

		case 'connect':
			var to = flags.to;
			var from = flags.from;
			var event = flags.event;
			var signal = flags.signal;

			if (!from)
			{
				result = 'Missing "from"';
			}
			else if (!to)
			{
				result = 'Missing "to"';
			}
			else if (!event && !signal)
			{
				result = 'Neither "event" nor "signal" was specified';
			}
			else if (!getAgent(from))
			{
				result = `Agent "${from}" does not exist`;
			}
			else if (!getAgent(to))
			{
				result = `Agent "${to}" does not exist`;
			}
			else
			{
				var agent = getAgent(from);
				var str = '';

				agent.connectToAgent(to, event, signal);

				if (event && signal)
				{
					str = 'events and signals';
				}
				else
				{
					str = event ? 'events' : 'signals';
				}

				result = `Agent "${from}" sending ${str} to agent "${to}"`; saveAgents();
			}
			break;

		case 'disconnect':
			var to = flags.to;
			var from = flags.from;
			var event = flags.event;
			var signal = flags.signal;

			if (!from)
			{
				result = 'Missing "from"';
			}
			else if (!to)
			{
				result = 'Missing "to"';
			}
			else if (!event && !signal)
			{
				result = 'Neither "event" nor "signal" was specified';
			}
			else if (!getAgent(from))
			{
				result = `Agent "${from}" does not exist`;
			}
			else if (!getAgent(to))
			{
				result = `Agent "${to}" does not exist`;
			}
			else
			{
				var agent = getAgent(from);
				var str = '';

				agent.disconnectFromAgent(to, event, signal);

				if (event && signal)
				{
					str = 'events and signals';
				}
				else
				{
					str = event ? 'events' : 'signals';
				}

				result = `Agent "${from}" no longer sending ${str} to agent "${to}"`;
				saveAgents();
			}
			break;

		case 'signal':
			var agent = getAgent(name);
			if (!agent)
			{
				result = `Agent "${name}" does not exist`;
			}
			else
			{
				agent.receiveSignal();
				result = `Sending signal to agent "${name}"`;
			}
			break;

		case 'serialize':
			var agent = getAgent(name);
			if (!agent)
			{
				result = `Agent "${name}" does not exist`;
			}
			else
			{
				result = JSON.stringify(agent.serialize());
			}
			break;

		case 'save':
			saveAgents();

			result = 'All agents saved to disk';
			break;
	}

	s.send(result, 63136, 'localhost');
});
s.bind(63036, 'localhost', () =>
{
	console.log('CLI listening on port 63036');
});


// Web server
const app = express();
global.webhookEmitter = new events.EventEmitter();
global.eventEmitter = new events.EventEmitter();
global.signalEmitter = new events.EventEmitter();

app.use(bodyParser.json());
app.listen(port, () => console.log(`Server running on port ${port}`));
app.post('/webhook', (req, res) =>
{
	res.status(200).end();

	webhookEmitter.emit(req.query.agent, req.body);
});


// Loading agent blueprints
console.log('Loading agent blueprints...');

var i = 0;
var agents = {};

fs.readdirSync('./agents/').forEach((file) =>
{
	if (file != 'agent.js' && file.endsWith('.js'))
	{
		console.log(`- ${file}`);
		++i;
		agents[file.replace('.js', '')] = require(`./agents/${file}`);
	}
});

console.log(`Loaded ${i} agent blueprints\n`);


// Loading agents
console.log('Loading agents...');

i = 0;

fs.readdirSync('./serial/').forEach((file) =>
{
	if (file.endsWith('.json'))
	{
		console.log(`- ${file}`);
		++i;

		var serial = JSON.parse(fs.readFileSync(`./serial/${file}`, 'utf-8'));
		createAgent(serial.type, serial.name).deserialize(serial);
	}
});

console.log(`Loaded ${i} agents\n`);

// Run all agents
for (var agent of activeAgents)
{
	agent.run();
}