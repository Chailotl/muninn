const token = require('../config.json').discord_token;

if (!token) { return; }

const { Client, Events, GatewayIntentBits } = require('discord.js');
const logger = require('../logger');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

client.once(Events.ClientReady, c =>
{
	logger.info(`Discord: Ready! Logged in as ${c.user.tag}`);
});

client.login(token);

module.exports = client;