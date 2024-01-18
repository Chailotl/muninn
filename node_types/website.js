const Node = require('../node.js');

module.exports = class WebsiteNode extends Node
{
	getDescription() { return 'This node will read the URL and emit it as a string event. If the content type is JSON, it will emit it as an object event.'; }
	getDefaultConfig() { return { url: '' }; }
	getInputs() { return ['trigger', 'url']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		let url = this.config.url;

		if (input == 'url')
		{
			if (this.expectString(event)) { return; }

			url = event.payload;
		}

		fetch(url).then(res =>
		{
			let contentType = res.headers.get('content-type');

			if (contentType && contentType.indexOf('application/json') != -1)
			{
				res.json().then(json =>
				{
					event.payload = json;
					this.sendEvent('output', event);
				});
			}
			else
			{
				res.text().then(text =>
				{
					event.payload = text;
					this.sendEvent('output', event);
				});
			}
		});
	}
}