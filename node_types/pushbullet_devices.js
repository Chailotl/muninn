const Node = require('../node.js');

const token = require('../config.json').pushBullet_token;

module.exports = class PushBulletListDevicesNode extends Node
{
	getDescription() { return 'This node returns your Pushbullet device list.'; }
	getInputs() { return ['trigger']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		if (!token)
		{
			logger.warn('No Pushbullet token provided');
			return true;
		}

		fetch('https://api.pushbullet.com/v2/devices', {
			headers: { 'Access-Token': token }
		}).then(res =>
		{
			res.json().then(json =>
			{
				event.payload = json.devices;
				this.sendEvent('output', event);
			});
		});
	}
}