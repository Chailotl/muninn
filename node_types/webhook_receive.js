const Node = require('../node.js');
const Event = require('../event.js');

module.exports = class WebhookReceiveNode extends Node
{
	getDescription() { return 'This node receives webhooks at ip:port/webhook?node=name'; }
	getOutputs() { return ['output']; }

	onActivate()
	{
		global.webhookEmitter.on(this.name, this.listener = json => this.sendEvent('output', new Event(json)));
	}

	onDeactivate()
	{
		global.webhookEmitter.off(this.name, this.listener, false);
	}
}