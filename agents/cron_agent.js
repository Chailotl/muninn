const Agent = require('./agent.js');
const cron = require('node-cron');

// Auto-emitter
// This emits signals using a cron

module.exports = class TestAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			cron: '* * * * *'
		});
	}

	run()
	{
		cron.schedule(this.options.cron, () =>
		{
			this.sendSignal()
		});
	}
}