const Node = require('../node.js');
const Event = require('../event.js');
const { Events } = require('discord.js');

module.exports = class DiscordSendNode extends Node
{
	getDescription() { return 'This node will receive Discord messages from the configured channels and users and will emit them as an event.'; };
	getDefaultConfig() { return { channelIds: [], userIds: [], advancedOutput: false }; }
	getOutputs() { return ['output']; }

	onActivate()
	{
		let discord = global.services.discord;

		if (!discord)
		{
			logger.warn('No Discord token provided');
			return true;
		}

		discord.on(Events.MessageCreate, msg =>
		{
			let channelIds = this.config.channelIds;
			let userIds = this.config.userIds;

			if (msg.author.id == discord.user.id)
			{
				// Always ignore self
				return;
			}
			else if (channelIds.length > 0 && !channelIds.includes(msg.channelId))
			{
				// Ignore channels not on whitelist
				return;
			}
			else if (userIds.length > 0 && !userIds.includes(msg.author.id))
			{
				// Ignore users not on whitelist
				return;
			}

			let payload = msg.cleanContent;

			if (this.config.advancedOutput)
			{
				payload = {
					message: {
						id: msg.id,
						content: msg.content,
						cleanContent: msg.cleanContent,
						url: msg.url
					},
					author: {
						id: msg.author.id,
						username: msg.author.username,
						displayName: msg.author.displayName,
						bot: msg.author.bot,
						avatarUrl: msg.author.avatarURL()
					},
					channel: {
						id: msg.channelId,
						name: msg.channel.name,
						topic: msg.channel.topic,
						nsfw: msg.channel.nsfw,
						url: msg.channel.url
					},
				};

				if (msg.guild)
				{
					payload.guild = {
						id: msg.guildId,
						name: msg.guild.name,
						description: msg.guild.description,
						ownerId: msg.guild.ownerId,
						partnered: msg.guild.partnered,
						verified: msg.guild.verified
					};
				}
			}

			this.sendEvent('output', new Event(payload));
		});
	}
}