const Agent = require('./../agent.js');
const fetch = require('node-fetch');

const token = require('./../config.json').pushBullet_token;

// Consumer
// Pushes notes to a PushBullet device

module.exports = class PushBulletCreatePushAgent extends Agent
{
	getOptions() { return ['deviceId', 'type', 'title', 'body', 'url']; }

	getEventInputs() { return ['input']; }
	getTriggerInputs() { return ['trigger']; }

	onRun()
	{
		if (!this.options.type)
		{
			this.options.type = 'note';
		}
		if (!this.options.title)
		{
			this.options.title = 'Muninn';
		}
	}

	onTrigger(input)
	{
		this.onEvent('input', {});
	}

	onEvent(input, event)
	{
		// Encapsulate in an object
		if (typeof event != 'object')
		{
			event = { body: event };
		}

		fetch('https://api.pushbullet.com/v2/pushes', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'Access-Token': token
			},
			body: JSON.stringify({
				device_iden: event.deviceId ?? this.options.deviceId,
				type: event.type ?? this.options.type,
				title: event.title ?? this.options.title,
				body: event.body ?? this.options.body,
				url: event.url ?? this.options.url
			})
		})
	}
}