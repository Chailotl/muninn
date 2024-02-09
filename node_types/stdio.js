const Node = require('../node.js');
const Event = require('../event.js');
const capcon = require('capture-console');

module.exports = class StdioNode extends Node
{
	getDescription() { return 'This node will capture stdout and sterr and emit them as string events.'; }
	getOutputs() { return ['stdout', 'stderr', 'stdout_ansi', 'stderr_ansi']; }

	onActivate()
	{
		capcon.startCapture(process.stdout, stdout =>
		{
			this.sendEvent('stdout_ansi', new Event(stdout));

			stdout = this.filterAnsiEscapeSeq(stdout);

			this.sendEvent('stdout', new Event(stdout));
		});

		capcon.startCapture(process.stderr, stderr =>
		{
			this.sendEvent('stderr_ansi', new Event(stderr));

			stderr = this.filterAnsiEscapeSeq(stderr);

			this.sendEvent('stderr', new Event(stderr));
		});
	}

	onDeactivate()
	{
		capcon.stopCapture(process.stdout);
		capcon.stopCapture(process.stderr);
	}

	filterAnsiEscapeSeq(text)
	{
		return text.replaceAll(/(\x9B|\x1B\[)[0-?]*[ -\/]*[@-~]/g, '');
	}
}