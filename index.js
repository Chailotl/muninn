require('fix-esm').register();
const express = require('express');
const events = require('events');
const Graph = require('./graph');
const logger = require('./logger');

const app = express();
const { port } = require('./config.json');
global.webhookEmitter = new events.EventEmitter();

app.use(require('body-parser').json());
app.listen(port, () => logger.info(`Server running on port ${port}`));
app.post('/webhook', (req, res) =>
{
	res.status(200).end();

	webhookEmitter.emit(req.query.node, req.body);
});

const graph = new Graph();

graph.loadNodes();

/*graph.createNode('startup', 'startup');
graph.createNode('custom_payload', 'custom');
graph.createNode('checksum', 'checksum');
graph.createNode('log', 'log');

graph.pipeNode('startup', 'output', 'custom', 'trigger');
graph.pipeNode('custom', 'output', 'checksum', 'input');
graph.pipeNode('checksum', 'change', 'log', 'input');*/

//graph.createNode('stdio', 'stdio');
//graph.pipeNode('stdio', 'stdout', 'discord_send', 'message');
//graph.pipeNode('pushbullet_list_devices', 'output', 'log', 'input');

graph.activateNodes();

graph.saveNodes();