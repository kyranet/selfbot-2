const Command = require('../classes/Command');
const { Collection } = require('discord.js');

module.exports = class Emote extends Command {

	constructor(...args) {
		super(...args, 'emote', {
			aliases: ['tag'],
			usage: '[add|remove] <emote:str> [message:str]',
			usageDelim: ', ',
			description: 'Shows tags.'
		});
		this.emotes = null;
	}

	async run(msg, [config, emote, suffix]) {
		msg.delete();
		if (config) return msg.channel.send(this[config](emote, suffix));
		if (emote === 'list') return msg.channel.send(this.emotes.keyArray().join(', '));
		const tag = this.emotes.get(emote);
		if (tag) return msg.channel.send(`${tag} ${suffix || ''}`);
		return null;
	}

	add(name, message) {
		this.emotes.set(name, message);
		this.client.db.table('tags').insert({ tag: name, data: message }).run();
		return `Added \`${name}\` tag as: \`\`\`${message}\`\`\``;
	}

	remove(name) {
		this.emotes.delete(name);
		this.client.db.table('tags').getAll(name, { index: 'tag' }).delete().run();
		return `Removed \`${name}\` tag`;
	}

	async init() {
		const emotes = await this.client.db.table('tags').pluck('tag', 'data');
		this.emotes = new Collection(emotes.map(val => [val.tag, val.data]));
	}

};
