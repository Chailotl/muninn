const Agent = require('./agent.js');
const fetch = require('node-fetch');

// Auto-emitter/consumer
// This agent can either react to HTML posts to the /webhook url, or emit its own webhooks
// ip:port/webhook?agent=id

module.exports = class WebhookAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			url: '',
			id: ''
		});
	}

	run()
	{
		super.run();
		webhookEmitter.on(this.options.id, json =>
		{
			this.sendEvent(json);
		});
	}

	receiveEvent(event)
	{
		if (typeof event === 'object')
		{
			fetch(this.options.url, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify(event)
			}).then(res =>
			{
				log(res);
			});
		}
	}
}