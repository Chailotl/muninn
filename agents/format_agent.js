const Agent = require('./agent.js');

// Transformer
// This agent can reformat JSON objects as a different JSON object
/*
format: {
	username: "xkcd",
	avatar_url: "http://i.imgur.com/L2EiqZH.png",
	embeds: [
		{
			title: "{{event.title}}",
			url: "{{event.url}}",
			image: { url: "https:{{event.imageurl}}" },
			footer: { text: "{{event.hovertext}}" },
			color: 9873608
		}
	]
}
*/

module.exports = class FormatAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			format: ''
		});
	}

	receiveEvent(event)
	{
		var format = this.options.format;
		if (typeof format === 'object') { format = JSON.stringify(format) };

		var matches = format.match(/{{event.*?}}/g);

		for (var match of matches)
		{
			var replacedMatch = match.replace('{{event', '').replace('}}', '');
			var obj = event;

			// Traverse down obj using match
			while (replacedMatch.length > 0)
			{
				var regex = null;
				var isNumericalIndex = false;

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

				var index = replacedMatch.match(regex)[1];
				if (isNumericalIndex) { index = parseInt(index); }

				obj = obj[index];
				replacedMatch = replacedMatch.replace(regex, '');
			}

			var str = JSON.stringify(obj);
			if (str.startsWith('"') && str.endsWith('"'))
			{
				str = str.slice(1, str.length - 1);
			}
			format = format.replace(match, str);
		}

		// Try to send as json object
		try
		{
			this.sendEvent(JSON.parse(format));
		}
		catch
		{
			this.sendEvent(format);
		}
	}
}