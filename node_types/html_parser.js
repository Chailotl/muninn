const Node = require('../node.js');
const HTMLParser = require('node-html-parser');

module.exports = class HTMLParserNode extends Node
{
	getDescription()
	{
		return `This node parses HTML from string events into object events.

The extract config should be a JSON object where each named property contains an HTML query and attribute to be extracted. innerHTML and innerText are valid attribute values.

{
	title: { query: '#comic img', attribute: 'alt' },
	imageurl: { query: '#comic img', attribute: 'src' },
	hovertext: { query: '#comic img', attribute: 'title' },
	url: { query: 'br + a', attribute: 'href' }
}`;
	};
	getDefaultConfig() { return { extract: {} }; }
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		if (this.expectString(event)) { return; }

		let root = HTMLParser.parse(event.payload);
		let payload = {};

		Object.entries(this.config.extract).forEach(([key, value]) =>
		{
			let elm = root.querySelector(value.query);

			if (elm)
			{
				let attribute = value.attribute;

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
					payload[key] = elm.getAttribute(attribute);
				}
			}
		});

		event.payload = payload;
		this.sendEvent('output', event);
	}
}