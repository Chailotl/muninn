const logger = require('./logger');
const fs = require('fs');
const events = require('events');

const NODE_TYPES_FOLDER = './node_types';
const SERVICES_FOLDER = './services';
const SERIAL_FOLDER = './serial';

if (!global.eventEmitter)
{
	global.eventEmitter = new events.EventEmitter();
	global.graphEmitter = new events.EventEmitter();
}

module.exports = class Graph
{
	nodes = {};
	nodeTypes = {};

	constructor()
	{
		global.services = {};

		this.loadNodeTypes();
		this.loadServices();

		global.graphEmitter.on('save node', node =>
		{
			logger.debug(`Saved node "${node.name}"`);

			if (!fs.existsSync(SERIAL_FOLDER))
			{
				fs.mkdirSync(SERIAL_FOLDER);
			}

			let serial = node.serialize();
			let json = JSON.stringify(serial);
			fs.writeFileSync(`${SERIAL_FOLDER}/${node.name}.json`, json, 'utf-8');
		});
	}

	createNode(type, name)
	{
		if (!this.nodeTypes[type])
		{
			logger.warn(`Node type "${type}" not found`);
			return;
		}

		if (this.nodes[name])
		{
			logger.warn(`Node name "${name}" is already taken`);
			return;
		}

		let node = new this.nodeTypes[type](type, name);
		this.nodes[name] = node;
		return node;
	}

	deleteNode(name)
	{
		if (!this.nodes[name])
		{
			logger.warn(`Node "${name}" doesn't exist`);
			return;
		}

		delete this.nodes[name];
	}

	getNode(name)
	{
		if (!this.nodes[name])
		{
			logger.warn(`Node "${name}" doesn't exist`);
			return;
		}

		return this.nodes[name];
	}

	activateNode(name)
	{
		let node = this.getNode(name);

		if (node && !node.active)
		{
			node.active = true;
			node.onActivate();
		}
	}

	deactivateNode(name)
	{
		let node = this.getNode(name);

		if (node && node.active)
		{
			node.active = false;
			node.onDeactivate();
		}
	}

	pipeNode(from, output, to, input)
	{
		if (!this.getNode(from) || !this.getNode(to)) { return; }

		let node = this.getNode(from);

		node.pipe(output, to, input);
	}

	unpipeNode(from, output, to, input)
	{
		if (!this.getNode(from) || !this.getNode(to)) { return; }

		let node = this.getNode(from);

		node.unpipe(output, to, input);
	}

	activateNodes()
	{
		Object.entries(this.nodes).forEach(([, node]) =>
		{
			if (node.active)
			{
				node.onActivate();
			}
		});
	}

	loadNodeTypes()
	{
		logger.debug('Loading node types...');

		if (!fs.existsSync(NODE_TYPES_FOLDER))
		{
			logger.error('Node types folder is missing');
			process.exit(1);
		}

		let i = 0;

		fs.readdirSync(NODE_TYPES_FOLDER).forEach(file =>
		{
			if (file.endsWith('.js'))
			{
				logger.debug(`- ${file}`);
				++i;

				this.nodeTypes[file.replace('.js', '')] = require(`${NODE_TYPES_FOLDER}/${file}`);
			}
		});

		logger.info(`Loaded ${i} node types`);
	}

	loadServices()
	{
		logger.debug('Loading services...');

		if (!fs.existsSync(SERVICES_FOLDER))
		{
			logger.error('Services folder is missing');
			return;
		}

		let i = 0;

		fs.readdirSync(SERVICES_FOLDER).forEach(file =>
		{
			if (file.endsWith('.js'))
			{
				logger.debug(`- ${file}`);
				++i;

				global.services[file.replace('.js', '')] = require(`${SERVICES_FOLDER}/${file}`);
			}
		});

		logger.info(`Loaded ${i} services`);
	}

	loadNodes()
	{
		logger.debug('Loading nodes...');

		if (!fs.existsSync(SERIAL_FOLDER))
		{
			logger.warn('Serial folder missing');
			return;
		}

		let i = 0;

		fs.readdirSync(SERIAL_FOLDER).forEach(file =>
		{
			if (file.endsWith('.json'))
			{
				logger.debug(`- ${file}`);
				++i;

				let serial = JSON.parse(fs.readFileSync(`${SERIAL_FOLDER}/${file}`, 'utf-8'));
				this.createNode(serial.type, file.replace('.json', '')).deserialize(serial);
			}
		});

		logger.info(`Loaded ${i} nodes`);
	}

	saveNodes()
	{
		logger.debug('Saving nodes...');

		if (!fs.existsSync(SERIAL_FOLDER))
		{
			fs.mkdirSync(SERIAL_FOLDER);
		}

		Object.entries(this.nodes).forEach(([, node]) =>
		{
			let serial = node.serialize();
			let json = JSON.stringify(serial);
			fs.writeFileSync(`${SERIAL_FOLDER}/${node.name}.json`, json, 'utf-8');
		});

		logger.info('Saved nodes');
	}
};