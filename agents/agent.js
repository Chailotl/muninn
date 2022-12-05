module.exports = class Agent
{
	type = '';	// blueprint used to create this agent
	name = '';
	options = {};
	autoSignal = true;	// if true, this agent will send a signal alongside the event
	eventTargets = [];
	signalTargets = [];

	eventQueue = [];

	constructor(name, options)
	{
		this.name = name;
		this.options = options ?? {};
	}

	// this runs when the program is started
	// by default it sets up event and signal emitter readers
	run()
	{
		eventEmitter.on(this.name, event =>
		{
			this.eventQueue.push(event);
		});
		signalEmitter.on(this.name, () =>
		{
			this.receiveSignal();
		});
	}

	// this runs when it is signaled and there is an event in the queue
	receiveEvent(event) { }

	// this runs when it receives a signal
	// by default it reads the first event in the queue
	receiveSignal()
	{
		if (this.eventQueue.length > 0)
		{
			this.receiveEvent(this.eventQueue.shift());
		}
	}

	// this will send an event to every event target
	sendEvent(event)
	{
		this.eventTargets.forEach(target =>
		{
			eventEmitter.emit(target, event);

			if (this.autoSignal)
			{
				signalEmitter.emit(target);
			}
		});
	}

	// this will send a signal to every signal target
	sendSignal()
	{
		this.signalTargets.forEach(target =>
		{
			signalEmitter.emit(target);
		});
	}

	connectToAgent(agent, event, signal)
	{
		if (event)
		{
			this.eventTargets.push(agent);
		}
		if (signal)
		{
			this.signalTargets.push(agent);
		}
	}

	disconnectFromAgent(agent, event, signal)
	{
		var index = this.eventTargets.indexOf(agent);

		if (event)
		{
			this.eventTargets.splice(index, 1);
		}
		if (signal)
		{
			this.signalTargets.splice(index, 1);
		}
	}

	// this serializes the agent to a flat file
	// this should be overridden if storing additional data
	serialize()
	{
		return {
			type: this.type,
			name: this.name,
			options: this.options,
			autoSignal: this.autoSignal,
			eventTargets: this.eventTargets,
			signalTargets: this.signalTargets,
			eventQueue: this.eventQueue
		};
	}

	// this deserializes the agent from a flat file
	// this should be overriden alongside serialize()
	deserialize(serial)
	{
		this.type = serial.type;
		this.name = serial.name;
		this.options = serial.options;
		this.autoSignal = serial.autoSignal;
		this.eventTargets = serial.eventTargets;
		this.signalTargets = serial.signalTargets;
		this.eventQueue = serial.eventQueue;
	}
}