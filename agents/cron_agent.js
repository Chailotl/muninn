const Agent = require('./agent.js');
const cron = require('node-cron');

// Auto-emitter
// This emits signals using a cron

module.exports = class CronAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			cron: '* * * * *',
			timezone: ''
		});
	}

	run()
	{
		if (cron.validate(this.options.cron))
		{
			var options = {};

			if (this.options.timezone)
			{
				options.timezone = this.options.timezone;
			}

			cron.schedule(this.options.cron, () =>
			{
				this.sendSignal()
			}, options);
		}
		else
		{
			this.log(`Invalid cron expression ${this.options.cron}`);
		}
	}
}