const Agent = require('./../agent.js');
const HTMLParser = require('node-html-parser');

// Transformer
// This parses html and passes it along as a json object
/*
extract: {
	title: { query: '#comic img', attribute: 'alt' },
	imageurl: { query: '#comic img', attribute: 'src' },
	hovertext: { query: '#comic img', attribute: 'title' },
	url: { query: 'br + a', attribute: 'href' }
}
*/

module.exports = class HTMLParserAgent extends Agent
{
	getOptions() { return ['extract']; }

	getEventInputs() { return ['input']; }

	getEventOutputs() { return ['output']; }

	onEvent(input, event)
	{
		var root = HTMLParser.parse(event);
		var payload = {};

		for (var key in this.options.extract)
		{
			var value = this.options.extract[key];

			var elm = root.querySelector(value.query);

			if (elm)
			{
				var attribute = value.attribute;

				if (attribute == 'innerHTML')
				{
					payload[key] = elm.innerHTML;
				}
				else if (attribute == 'innerText')
				{
					payload[key] = elm.innerText;
				}
				else if (elm.hasAttribute(attribute))
				{
					payload[key] = elm.getAttribute(value.attribute);
				}
			}
		}

		this.sendEvent('output', payload);
	}
}