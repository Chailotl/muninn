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
		let code = this.config.code.replaceAll('\n', '\n\t');

		try
		{
			PythonShell.runString(`import sys, json\npayload=sys.argv[1]\ndef run():\n\t${code}\nprint(json.dumps(run()))`, { mode: 'json', args: event.payload }).then(messages =>
			{
				event.payload = messages[0];
				this.sendEvent('output', event);
			});
		}
		catch (err)
		{
			logger.error(err.toString());
		}
	}
}