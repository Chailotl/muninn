const Agent = require('./../agent.js');
const fetch = require('node-fetch');

// Auto-emitter/consumer
// This agent can either react to HTML posts to the /webhook url, or emit its own webhooks
// ip:port/webhook?agent=id

module.exports = class WebhookAgent extends Agent
{
	getOptions() { return ['url']; }

	getEventInputs() { return ['input']; }

	getEventOutputs() { return ['output']; }

	onRun()
	{
		webhookEmitter.on(this.name, json => this.sendEvent('output', json));
	}

	onEvent(input, event)
	{
		if (typeof event === 'object')
		{
			fetch(this.options.url, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify(event)
			});
		}
	}
}