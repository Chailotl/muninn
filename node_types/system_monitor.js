const Node = require('../node.js');
const os = require('os');

module.exports = class SystemMonitorNode extends Node
{
	getDescription()
	{
		return `This node will emit an object event of the system's uptime (seconds), memory usage (bytes), and CPU load average (%).

Load average is a Unix-specific concept.

{
	uptime: 189214.156,
	freeMem: 17594851328,
	usedMem: 16682725376,
	totalMem: 34277576704,
	loadAvg1Min: 15.87158203125,
	loadAvg5Min: 14.193359375,
	loadAvg15Min: 13.3652343750
}`;
	};
	getInputs() { return ['trigger']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		let loadAvg = os.loadavg();

		event.payload = {
			uptime: os.uptime(),
			freeMem: os.freemem(),
			usedMem: os.totalmem() - os.freemem(),
			totalMem: os.totalmem(),
			loadAvg1Min: loadAvg[0],
			loadAvg5Min: loadAvg[1],
			loadAvg15Min: loadAvg[2]
		};
		this.sendEvent('output', event);
	}
}