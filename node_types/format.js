const Node = require('../node.js');

module.exports = class FormatNode extends Node
{
	getDescription()
	{
		return `This node formats string/object events into different string/object events. Any instance of {{obj}} will be replaced with object properties using the JavaScript property accessor.

"I received: {{obj}}"

"Hello {{obj.name}}, your favorite food is {{obj.foods[0]}}"

{
	username: "xkcd",
	avatar_url: "http://i.imgur.com/L2EiqZH.png",
	embeds: [
		{
			title: "{{obj.title}}",
			url: "{{obj.url}}",
			image: { url: "https:{{obj.imageurl}}" },
			footer: { text: "{{obj.hovertext}}" },
			color: 9873608
		}
	]
}`;
	}
	getDefaultConfig() { return { format: '', parseAsJson: false }; }
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		let format = this.config.format;
		let isObject = this.config.parseAsJson;
		if (typeof format === 'object')
		{
			isObject = true;
			format = JSON.stringify(format)
		};

		format.match(/{{obj.*?}}/g).forEach(match =>
		{
			let replacedMatch = match.replace('{{obj', '').replace('}}', '');
			let obj = event.payload;

			// Traverse down obj using match
			while (replacedMatch.length > 0)
			{
				let regex = null;
				let isNumericalIndex = false;

				if (replacedMatch.startsWith('.'))
				{
					regex = /^\.(\w*)/;
				}
				else if (replacedMatch.startsWith('["'))
				{
					regex = /^\["(\w*)"\]/;
				}
				else if (replacedMatch.startsWith('['))
				{
					regex = /^\[(\d*)\]/;
					isNumericalIndex = true;
				}
				else
				{
					break; // Emergency
				}

				let index = replacedMatch.match(regex)[1];
				if (isNumericalIndex) { index = parseInt(index); }

				obj = obj[index];
				replacedMatch = replacedMatch.replace(regex, '');
			}

			let str = JSON.stringify(obj);
			if (str.startsWith('"') && str.endsWith('"'))
			{
				str = str.slice(1, str.length - 1);
			}
			format = format.replace(match, str);
		});

		event.payload = isObject ? JSON.parse(format) : format;
		this.sendEvent('output', event);
	}
}