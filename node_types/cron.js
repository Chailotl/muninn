const Node = require('../node.js');
const Event = require('../event.js');
const cron = require('node-cron');
const logger = require('../logger');

module.exports = class CronNode extends Node
{
	getDescription()
	{
		return `This node will emit triggers at the specified cron schedule expression and timezone.

You can use this cron editor to write cron expression: https://crontab.guru/
Valid values for the timezone can be found here: https://www.iana.org/time-zones`;
	}
	getDefaultConfig() { return { cron: '* * * * *', timezone: '' }; }
	getOutputs() { return ['trigger']; }

	onActivate()
	{
		if (cron.validate(this.config.cron))
		{
			this.task = cron.schedule(this.config.cron, () => this.sendEvent('trigger', new Event(null)), { timezone: this.config.timezone });
		}
		else
		{
			logger.warn(`Invalid cron expression "${this.config.cron}"`);
		}
	}

	onDeactivate()
	{
		if (this.task)
		{
			this.task.stop();
		}
	}
}