const Agent = require('./../agent.js');
const fetch = require('node-fetch');

const token = require('./../config.json').pushBullet_token;

// Emitter
// Emits the list of devices from PushBullet

module.exports = class PushBulletListDevicesAgent extends Agent
{
	getTriggerInputs() { return ['trigger']; }

	getEventOutputs() { return ['output']; }

	onTrigger(input)
	{
		fetch('https://api.pushbullet.com/v2/devices', {
			headers: { 'Access-Token': token }
		}).then(res =>
		{
			res.json().then(json => this.sendEvent('output', json.devices));
		});
	}
}