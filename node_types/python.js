const Node = require('../node.js');
const { PythonShell } = require('python-shell')
const logger = require('../logger');

module.exports = class PythonNode extends Node
{
	getDescription() { return 'This node runs sandboxed Python code.'; }
	getDefaultConfig() { return { code: 'return "Hello world!"' }; }
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		// We don't want to catch the error here, we have a better error catcher downstream
		let code = this.config.code.replaceAll('\n', '\n\t');

		PythonShell.runString(`import sys, json\npayload=sys.argv[1]\ndef run():\n\t${code}\nprint(json.dumps(run()))`, { mode: 'json', args: event.payload }).then(messages =>
		{
			event.payload = messages[0];
			this.sendEvent('output', event);
		});
	}
}