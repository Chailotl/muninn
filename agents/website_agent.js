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

	async receiveSignal()
	{
		var response = await fetch(this.options.url);
		this.sendEvent(await response.text());
	}
}