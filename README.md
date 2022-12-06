# muninn
 A hackable automation system that uses agents and events.

# Agents

## Checksum

This is a filter agent that only lets events through if their MD5 hash was different from the previous event.

## Cron

This agent emits signals scheduled with cron.

| Option | Value |
| ------ | ----- |
| `cron` | A cron string such as `* * * * *` |

## Custom Event

This agent emits a custom event when it receives a signal. It is useful for testing.

| Option | Value |
| ------ | ----- |
| `payload` | Any string or json object |

## Delay

This agent will delay events and signals by a configurable amount of time.

| Option | Value |
| ------ | ----- |
| `delay` | In seconds |

## Discord

This agent can emit Discord channel messages as events as well as send messages to a channel if it receives an event.

If `advancedOutput` is turned on, it will emit this event object:
```
{
	content: <message content>,
	author: <user ID>,
	channel: <channel ID>
}
```

| Option | Value |
| ------ | ----- |
| `channelId` | If set, it will only listen to this channel |
| `userId` | If set, it will only listen to messages from this user |
| `advancedOutput` | If toggled, it will output the aforementioned event object |

## File

This agent will read a file and emit it as an event when signaled.

| Option | Value |
| ------ | ----- |
| `filepath` | A filepath |

## File Change

This agent will monitor a file or directory for changes and emit both an event describing the change and a signal.

The event object is formatted as follows:
```
{
	event: <either rename or change>,
	filename: <the filename>
}
```

| Option | Value |
| ------ | ----- |
| `filepath` | A filepath |

## Format

This agent will transform a json object event into a different json object. Any instances of `{{event.property}}` will be replaced with values from the original event.

For example you have this input event:
```
{
	foo: "Hello world",
	bar: [ 1, 2, 3 ]
}
```
You can reformat it as follows:
```
{
	baz: "{{event.foo}}",
	qux: {{event.bar[0]}}
}
```

| Option | Value |
| ------ | ----- |
| `format` | A json object  |

## HTML Parser

This agent will parse an HTML event, scraping data through a sequence of queries and attributes. If you want to scrap the `innerHTML` or `innerText` you can type those into the attribute property.

Here is an example:
```
{
	title: { query: '#comic img', attribute: 'alt' },
	imageurl: { query: '#comic img', attribute: 'src' },
	hovertext: { query: '#comic img', attribute: 'title' },
	url: { query: 'br + a', attribute: 'href' }
}
```

| Option | Value |
| ------ | ----- |
| `extract` | A json object formatted like the above example |

## Javascript

This agent will run a sandboxed JavaScript environment with the event being put into a local `event` variable. Anything that is returned will be emitted as an event.

| Option | Value |
| ------ | ----- |
| `code` | Valid JavaScript code |

## Log

This agent will simply log any event it receives to the console. This is useful for testing and debugging agents.

## Options

This agent will modify the options of any targeted agent using the input event.

## RegEx

This agent can either capture and return matches in a string event using regex, or it can filter string events out.

| Option | Value |
| ------ | ----- |
| `regex` | A regex string in the format `/pattern/modifiers` |
| `filter` | Whether the agent should behave as a filter instead of returning matches |
| `negateSignal` | Whether the agent should output a signal if an event doesn't pass the filter |

## System Monitor

This agent will emit system data such as uptime, memory usage, and CPU load average in an event when signaled.

This is the event object it will emit:
```
{
	uptime: <seconds>,
	freeMemory: <bytes>,
	usedMemory: <bytes>,
	totalMemory: <bytes>,
	cpuLoadAverage: <Unix load avg>,
	cpus: <cpu info>
}
```

## Weather

When given a valid [OpenWeather API key](https://openweathermap.org/api), it will emit weather data when signaled.

This is the event object it will emit:
```
{
	temp: <degrees>,
	humidity: <% humidity>,
	pressure: <hectopascals>,
	description: <weather description>,
	weathercode: <weather codes>,
	rain: <% rain>
}
```
[OpenWeather Weather Codes](https://openweathermap.org/weather-conditions)

| Option | Value |
| ------ | ----- |
| `cityId` | An [OpenWeather](https://openweathermap.org/) city ID |
| `units` | Either `metric` or `imperial` |
| `language` | A langauge code such as `en` |

## Webhook

This agent can both send and receive webhooks at `ip:port/webhook?agent=<id>`.

| Option | Value |
| ------ | ----- |
| `url` | The url to send webhooks to |
| `id` | The query parameter to listen for webhooks |

## Website

This agent will fetch the HTML from a URL and emit it as an event.

| Option | Value |
| ------ | ----- |
| `url` | A website url |
