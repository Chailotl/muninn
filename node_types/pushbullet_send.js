const Node = require('../node.js');

const token = require('../config.json').pushbullet_token;

module.exports = class PushbulletSendNode extends Node
{
	getDescription() { return 'This node lets you send push notifications to any of your devices using Pushbullet.'; }
	getDefaultConfig() { return { deviceId: '', title: 'Muninn', body: '' }; }
	getInputs() { return ['trigger', 'input']; }

	onEvent(input, event)
	{
		if (!token)
		{
			logger.warn('No Pushbullet token provided');
			return true;
		}

		let body = this.config.body;

		if (input == 'input')
		{
			if (this.expectString(event)) { return; }

			body = event.payload;
		}

		fetch('https://api.pushbullet.com/v2/pushes', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'Access-Token': token
			},
			body: JSON.stringify({
				device_iden: this.config.deviceId,
				type: 'note',
				title: this.config.title,
				body: body
			})
		});
	}
}