const Node = require('../node.js');
const logger = require('../logger.js');

module.exports = class WebhookSendNode extends Node
{
	getDescription() { return 'This node sends webhooks to the configured URL.The input must be an object or JSON string.'; }
	getDefaultConfig() { return { url: '' }; }
	getInputs() { return ['input']; }

	onEvent(input, event)
	{
		let body = event.payload;

		if (typeof body === 'string')
		{
			// Checking if the string is valid JSON
			try
			{
				JSON.parse(str);
			}
			catch (e)
			{
				logger.warn('Invalid JSON');
				return;
			}
		}
		else
		{
			body = JSON.stringify(body);
		}

		fetch(this.config.url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: body
		});
	}
}