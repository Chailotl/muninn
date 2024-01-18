const Node = require('../node.js');
const fs = require('fs');
const path = require('path');
const luainjs = require('lua-in-js')
const logger = require('../logger');

module.exports = class LuaNode extends Node
{
	getDescription() { return 'This node runs sandboxed Lua code.'; }
	getDefaultConfig() { return { code: 'return "Hello world!"' }; }
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		// We don't want to catch the error here, we have a better error catcher downstream
		let result = JSON.parse(luainjs.createEnv({
			fileExists: p => fs.existsSync(path.join('./node_types/', p)),
			loadFile: p => fs.readFileSync(path.join('./node_types/', p), { encoding: 'utf8' }),
		}).parse(`json = require "json"\npayload = json.decode('${JSON.stringify(event.payload)}')\nfunction run()\n${this.config.code}\nend\nreturn json.encode(run())`).exec());

		if (result)
		{
			event.payload = result;
			this.sendEvent('output', event);
		}
	}
}