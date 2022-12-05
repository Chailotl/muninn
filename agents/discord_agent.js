const Agent = require('./agent.js');
const { Client, Events, GatewayIntentBits } = require('discord.js');

const token = require('./../config.json').discord_token;

// Auto-emitter/consumer
// This emits events from Discord messages

module.exports = class DiscordAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			channelId: '',
			userId: '',
			advancedOutput: false
		});
	}

	run()
	{
		super.run();
		if (!token)
		{
			this.log('No Discord token provided');
			return;
		}

		client.on(Events.MessageCreate, msg =>
		{
			var channelId = this.options.channelId;
			var userId = this.options.userId;

			if (msg.author.id == client.user.id ||
				channelId && channelId != msg.channelId ||
				userId && userId != msg.author.id)
			{
				return;
			}

			var event = msg.cleanContent;

			if (this.options.advancedOutput)
			{
				event = {
					content: msg.content,
					author: msg.author.id,
					channel: msg.channelId
				};
			}

			this.sendEvent(event);
		});
	}

	receiveEvent(event)
	{
		if (!token)
		{
			this.log('No Discord token provided');
			return;
		}
		else if (!this.options.channelId)
		{
			this.log('No channel ID provided');
			return;
		}

		client.channels.fetch(this.options.channelId)
			.then(channel =>
			{
				channel.send(event);
			});
	}
}

// login to discord
if (!token) { return; }

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

client.once(Events.ClientReady, c =>
{
	console.log(`Discord: Ready! Logged in as ${c.user.tag}`);
});

client.login(token);