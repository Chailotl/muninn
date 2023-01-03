const Agent = require('./agent.js');
const fetch = require('node-fetch');

// Emitter
// This agent fetches HTML from a url

module.exports = class WebsiteAgent extends Agent
{
	checksum = '';

	constructor(name, options)
	{
		super(name, options ?? {
			url: ''
		});
	}

	receiveSignal()
	{
		fetch(this.options.url).then(res =>
		{
			var contentType = res.headers.get('content-type');

			if (contentType && contentType.indexOf('application/json') != -1)
			{
				res.json().then(json => this.sendEvent(json));
			}
			else
			{
				res.text().then(text => this.sendEvent(text));
			}
		});
	}
}