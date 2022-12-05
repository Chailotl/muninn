const Agent = require('./agent.js');
const os = require('os');

// Emitter
// This emits system data such as uptime, memory usage, and CPU load average

module.exports = class SystemMonitorAgent extends Agent
{
	receiveSignal()
	{
		var event = {
			uptime: os.uptime(),
			freeMemory: os.freemem(),
			usedMemory: os.totalmem() - os.freemem(),
			totalMemory: os.totalmem(),
			cpuLoadAverage: os.loadavg(),
			cpus: os.cpus()
		};

		this.sendEvent(event);
	}
}