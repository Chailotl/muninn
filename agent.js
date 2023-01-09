if (!global.structuredClone)
{
	global.structuredClone = function structuredClone(objectToClone)
	{
		const stringified = JSON.stringify(objectToClone);
		const parsed = JSON.parse(stringified);
		return parsed;
	}
}

module.exports = class Agent
{
	type = '';	// agent template
	name = ''; // filename
	options = {}; // behavior options
	data = {}; // persistent data

	// event and trigger targets
	eventTargets = {};
	triggerTargets = {};

	/*{
		output: [
			{ name: '', input: '' }
		]
	}*/

	constructor(type, name)
	{
		this.type = type;
		this.name = name;

		// populate options
		this.getOptions().forEach(option =>
		{
			this.options[option] = '';
		});

		// set up inputs
		this.getEventInputs().forEach(input =>
		{
			eventEmitter.on(`${this.name}/${input}`, event =>
			{
				this.onEvent(input, event);
			});
		});

		this.getTriggerInputs().forEach(input =>
		{
			triggerEmitter.on(`${this.name}/${input}`, () =>
			{
				this.onTrigger(input);
			});
		});

		// set up outputs
		this.getEventOutputs().forEach(output =>
		{
			this.eventTargets[output] = [];
		});

		this.getTriggerOutputs().forEach(output =>
		{
			this.triggerTargets[output] = [];
		});
	}

	// what options this agent has
	getOptions() { return []; }

	// what inputs this agent has
	getEventInputs() { return []; }
	getTriggerInputs() { return []; }

	// what outputs this agent has
	getEventOutputs() { return []; }
	getTriggerOutputs() { return []; }

	// this runs after all agents have been loaded
	onRun() { }

	// this runs when it receives an event
	onEvent(input, event) { }

	// this runs when it is triggered
	onTrigger(input) { }


	// this will send an event to every event target
	sendEvent(output, event)
	{
		this.eventTargets[output].forEach(target =>
		{
			eventEmitter.emit(`${target.name}/${target.input}`, structuredClone(event));
		});
	}

	// this will trigger every trigger target
	sendTrigger(output)
	{
		this.triggerTargets[output].forEach(target =>
		{
			triggerEmitter.emit(`${target.name}/${target.input}`);
		});
	}

	/*{
		output: [
			{ name: '', input: '' }
		]
	}*/

	// this pipes events to the target agent
	pipe(output, name, input, isTrigger)
	{
		if (isTrigger)
		{
			this.triggerTargets[output].push({ name: name, input: input });
		}
		else
		{
			this.eventTargets[output].push({ name: name, input: input });
		}
	}

	// this disconnects the agent from a target
	unpipe(output, name, input, isTrigger)
	{
		if (isTrigger)
		{
			this.triggerTargets[output].filter(target =>
			{
				return target.name != name || target.input != input;
			});
		}
		else
		{
			this.eventTargets[output].filter(target =>
			{
				return target.name != name || target.input != input;
			});
		}
	}

	// this serializes the agent to a flat file
	serialize()
	{
		var serial = { agent: this.type };

		if (Object.keys(this.options).length > 0)
		{
			serial.options = this.options;
		}
		if (Object.keys(this.data).length > 0)
		{
			serial.data = this.data;
		}
		if (Object.keys(this.eventTargets).length > 0)
		{
			serial.eventTargets = this.eventTargets;
		}
		if (Object.keys(this.triggerTargets).length > 0)
		{
			serial.triggerTargets = this.triggerTargets;
		}

		return serial;
	}

	// this deserializes the agent from a flat file
	deserialize(serial)
	{
		this.type = serial.agent;
		this.options = serial.options ?? {};
		this.data = serial.data ?? {};
		this.eventTargets = serial.eventTargets ?? {};
		this.triggerTargets = serial.triggerTargets ?? {};
	}

	log(message)
	{
		if (typeof message === 'object')
		{
			message = JSON.stringify(message);
		}

		console.log(`${this.name}: ${message}`);
	}
}