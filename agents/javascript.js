const Agent = require('./../agent.js');
const vm = require('vm');

// Transformer
// This runs custom javascript when it receives a signal or event

module.exports = class JavaScriptAgent extends Agent
{
	getOptions() { return ['code']; }

	getEventInputs() { return ['input']; }

	getEventOutputs() { return ['output']; }

	onRun()
	{
		if (!this.options.code)
		{
			this.options.code = 'return "Hello world!";';
		}
	}

	onEvent(input, event)
	{
		this.runVM(event);
	}

	/*receiveSignal()
	{
		this.runVM();
	}*/

	runVM(event = null)
	{
		try
		{
			var result = vm.runInNewContext(`function run() {${this.options.code}}; run();`, { event: event }, { timeout: 2000, displayErrors: true, require: { external: true, root: './' } });

			if (result)
			{
				this.sendEvent('output', result);
			}
		}
		catch (err)
		{
			//console.log(err);
			this.log(err.toString());
		}
	}
}