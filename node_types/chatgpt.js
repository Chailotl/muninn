const Node = require('../node.js');

module.exports = class ChatGPTNode extends Node
{
	getDescription() { return 'This node will send a prompt to ChatGPT (gpt-3.5) and return its response. UNTESTED'; };
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		let chatgpt = global.services.chatgpt;

		if (!chatgpt)
		{
			logger.warn('No ChatGPT API key provided');
			return true;
		}

		if (this.expectString(event)) { return; }

		chatgpt.sendMessage(event.payload).then(res =>
		{
			event.payload = res.text;
			this.sendEvent('output', event);
		});
	}
}