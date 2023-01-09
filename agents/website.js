const Agent = require('./../agent.js');
const fetch = require('node-fetch');

// Emitter
// This agent fetches HTML from a url

module.exports = class WebsiteAgent extends Agent
{
	getOptions() { return ['url']; }
	
	getTriggerInputs() { return ['trigger']; }

	getEventOutputs() { return ['output']; }

	onTrigger(input)
	{
		fetch(this.options.url).then(res =>
		{
			var contentType = res.headers.get('content-type');

			if (contentType && contentType.indexOf('application/json') != -1)
			{
				res.json().then(json => this.sendEvent('output', json));
			}
			else
			{
				res.text().then(text => this.sendEvent('output', text));
			}
		});
	}
}