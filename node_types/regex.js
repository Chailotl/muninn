const Node = require('../node.js');

module.exports = class RegExNode extends Node
{
	getDescription()
	{
		return `This node will filter string events using a regex. It will also emit a new event of any matches found.

You can use this regex editor to write regexes: https://regex101.com/`;
	};
	getDefaultConfig() { return { regex: '' }; }
	getInputs() { return ['input']; }
	getOutputs() { return ['matches', 'match', 'no match']; }

	onEvent(input, event)
	{
		if (this.expectString(event)) { return; }

		let [, pattern, flags] = this.config.regex.split('/');
		let regex = new RegExp(pattern, flags);
		let matches = event.payload.match(regex);

		if (matches.length > 0)
		{
			this.sendEvent('match', event);
			event.payload = matches;
			this.sendEvent('matches', event);
		}
		else
		{
			this.sendEvent('no match', event);
		}
	}
}