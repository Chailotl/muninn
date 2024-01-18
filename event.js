module.exports = class Event
{
	path = [];
	payload = null;

	constructor(payload)
	{
		this.payload = payload;
	}

	addPath(name)
	{
		this.path.push(name);
	}

	clone()
	{
		const stringified = JSON.stringify(this);
		const parsed = JSON.parse(stringified);

		let event = new Event(parsed.payload);
		event.path = parsed.path;

		return event;
	}
}