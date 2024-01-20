const logger = require('./logger');

module.exports = class Node
{
	type = '';
	name = '';
	active = true;
	config = {};
	persistent = {};

	outputs = {};

	constructor(type, name)
	{
		this.type = type;
		this.name = name;

		this.config = this.getDefaultConfig();
		this.persistent = this.getDefaultPersistent();

		this.getInputs().forEach(input =>
		{
			global.eventEmitter.on(`${this.name}/${input}`, event =>
			{
				// Do not run if inactive
				if (!this.active)
				{
					return;
				}

				// We don't want to crash, just report the error and ignore
				try
				{
					this.onEvent(input, event);
				}
				catch (err)
				{
					logger.error(`Node "${this.name}" threw an error`);
					logger.debug(event);
					console.error(err);
				}
			});
		});

		this.getOutputs().forEach(output =>
		{
			this.outputs[output] = [];
		});
	};

	// To be modified by subclasses
	getDescription() { return 'No description'; }
	getDefaultConfig() { return {}; }
	getDefaultPersistent() { return {}; }
	getInputs() { return []; }
	getOutputs() { return []; }

	onActivate() { }
	onDeactivate() { }
	onEvent(input, event) { }

	sendEvent(output, event)
	{
		// Add self to event's path for debugging
		event.addPath(this.name);

		this.outputs[output].forEach(target =>
		{
			global.eventEmitter.emit(`${target.name}/${target.input}`, event.clone());
		});
	}

	pipe(output, name, input)
	{
		this.outputs[output].push({ name: name, input: input });
	}

	unpipe(output, name, input)
	{
		this.outputs[output] = this.outputs[output].filter(target =>
		{
			return !(target.name == name && target.input == input);
		});
	}

	save()
	{
		global.graphEmitter.emit('save node', this);
	}

	serialize()
	{
		let serial = { type: this.type, active: this.active };

		if (Object.keys(this.config).length > 0)
		{
			serial.config = this.config;
		}
		if (Object.keys(this.persistent).length > 0)
		{
			serial.persistent = this.persistent;
		}
		if (Object.keys(this.outputs).length > 0)
		{
			serial.outputs = this.outputs;
		}

		return serial;
	}

	deserialize(serial)
	{
		if (serial.active != undefined)
		{
			this.active = serial.active;
		}
		if (serial.config != undefined)
		{
			this.config = serial.config;
		}
		if (serial.persistent != undefined)
		{
			this.persistent = serial.persistent;
		}
		if (serial.outputs != undefined)
		{
			this.outputs = serial.outputs;
		}
	}

	expectNumber(event)
	{
		if (typeof event.payload !== 'number')
		{
			logger.warn('Expected number');
			return true;
		}
		return false;
	}

	expectString(event)
	{
		if (typeof event.payload !== 'string')
		{
			logger.warn('Expected string');
			return true;
		}
		return false;
	}

	expectObject(event)
	{
		if (typeof event.payload !== 'object')
		{
			logger.warn('Expected object');
			return true;
		}
		return false;
	}

	error(err, event)
	{
		logger.error(`Node "${this.name}" threw an error`);
		logger.debug(event);
		console.error(err);
	}
}