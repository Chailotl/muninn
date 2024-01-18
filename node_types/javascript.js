const Node = require('../node.js');
const vm = require('vm');
const logger = require('../logger');

module.exports = class JavaScriptNode extends Node
{
	getDescription() { return 'This node runs sandboxed JavaScript code.'; }
	getDefaultConfig() { return { code: 'return "Hello world!";' }; }
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		try
		{
			let result = vm.runInNewContext(`function run() {${this.config.code}}; run();`, { payload: event.payload }, { timeout: 2000, displayErrors: true, require: { external: true, root: './' } });

			if (result)
			{
				event.payload = result;
				this.sendEvent('output', event);
			}
		}
		catch (err)
		{
			logger.error(err.toString());
		}
	}
}