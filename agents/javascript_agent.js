const Agent = require('./agent.js');
const vm = require('vm');

// Transformer
// This runs custom javascript when it receives a signal or event

module.exports = class JavaScriptAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			code: 'return "Hello world!";'
		});
	}

	receiveEvent(event)
	{
		this.runVM(event);
	}

	receiveSignal()
	{
		this.runVM();
	}

	runVM(event = null)
	{
		try
		{
			var result = vm.runInNewContext(`function run() {${this.options.code}}; run();`, { event: event }, { timeout: 2000, displayErrors: true, require: { external: true, root: './' } });

			if (result)
			{
				this.sendEvent(result);
			}
		}
		catch (err)
		{
			log(err);
		}
	}
}