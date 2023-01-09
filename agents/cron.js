const Agent = require('./../agent.js');
const cron = require('node-cron');

// Auto-emitter
// This emits triggers using a cron

module.exports = class CronAgent extends Agent
{
	getOptions() { return ['cron', 'timezone']; }

	getTriggerOutputs() { return ['trigger']; }

	onRun()
	{
		if (cron.validate(this.options.cron))
		{
			var options = {};

			if (this.options.timezone)
			{
				options.timezone = this.options.timezone;
			}

			cron.schedule(this.options.cron, () => this.sendTrigger('trigger'), options);
		}
		else
		{
			this.log(`Invalid cron expression "${this.options.cron}"`);
		}
	}
}