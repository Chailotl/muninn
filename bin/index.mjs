#! /usr/bin/env node
import meow from 'meow';
import dgram from 'dgram';

const cli = meow(`
	Usage
	  $ muninn create --type <type> --name <name>
	  $ muninn remove --name <name>
	  $ muninn options --name <name> --key <key> --value <value>
	  $ muninn connect --from <name> --to <name> --event
	  $ muninn disconnect --from <name> --to <name> --signal
`, {
	importMeta: import.meta,
	flags: {
		help: {
			type: 'boolean',
			alias: 'h'
		},
		name: {
			type: 'string',
			alias: 'n'
		},
		key: {
			type: 'string',
			alias: 'k'
		},
		value: {
			type: 'string',
			alias: 'v'
		},
		from: {
			type: 'string',
			alias: 'f'
		},
		to: {
			type: 'string',
			alias: 't'
		}
	}
});

//console.log(cli.input);
//console.log(cli.flags);

var s = dgram.createSocket('udp4');
s.on('message', function (msg, rinfo)
{
	console.log(msg.toString());
	process.exit();
});
s.bind(63136, 'localhost');

s.send(JSON.stringify({ input: cli.input, flags: cli.flags }), 63036, 'localhost');