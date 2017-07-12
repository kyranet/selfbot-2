const Command = require('../classes/Command');
const os = require('os');
const moment = require('moment');
const Discord = require('discord.js');

module.exports = class Info extends Command {

	constructor(...args) {
		super(...args, 'info', {
			aliases: ['uptime'],
			botPerms: ['EMBED_LINKS'],
			description: 'Displays info and stats about the selfbot.'
		});
	}

	async run(msg) {
		delete require.cache[require.resolve('../../package.json')];
		const memUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
		const totalMem = Math.round(os.totalmem() / 1024 / 1024);
		const percentUsed = Math.round((memUsed / totalMem) * 100);
		const embed = new this.client.RichEmbed()
			.setColor(msg.guild ? msg.member.highestRole.color : 'RANDOM')
			.addField('__Resources:__', [
				`**RAM:** ${memUsed} MB (${percentUsed}%)`
			], true)
			.addField('__Status:__', [
				`**Uptime:** ${moment(Date.now() - (process.uptime() * 1000)).toNow(true)}.`
			], true)
			.addField('__Connected to:__', [
				`**Guilds:** ${this.client.guilds.size.toLocaleString()}`,
				`**Channels:** ${this.client.channels.filter(chan => chan.type === 'text').size.toLocaleString()}`,
				`**DM Channels:** ${this.client.channels.filter(chan => chan.type === 'dm').size.toLocaleString()}`,
				`**Users:** ${this.client.users.size.toLocaleString()}`
			], true)
			.setFooter(`Running AoBot v${require('../../package.json').version} based on Discord.JS v${Discord.version}`, this.client.user.avatarURL);

		return msg.alert({ embed });
	}

};
