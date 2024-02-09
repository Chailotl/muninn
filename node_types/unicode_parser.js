const Node = require('../node.js');

module.exports = class UnicodeParserNode extends Node
{
	getDescription() { return 'This node parses Unicode codepoints in string events.'; };
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		if (this.expectString(event)) { return; }

		event.payload = event.payload.replace(/\\u([0-9a-fA-F]{4})/g, (m, cc) => String.fromCharCode("0x" + cc)).replaceAll('\\n', '\n').replaceAll('\\r', '\r');
		this.sendEvent('output', event);
	}
}