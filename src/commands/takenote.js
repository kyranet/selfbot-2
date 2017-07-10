const Command = require('../classes/Command');

module.exports = class Takenote extends Command {

	constructor(...args) {
		super(...args, 'takenote', {
			description: 'Takes note of the message based on id',
			usage: '<Message:msg>'
		});
		this.pinChannel = null;
	}

	async run(msg, [message]) {
		msg.delete();

		const embed = new this.client.RichEmbed()
			.setAuthor(message.member ? message.member.displayName : message.author.username, message.author.avatarURL)
			.setColor(message.member ? message.member.highestRole.color : 'RANDOM')
			.setDescription(message.content)
			.setTimestamp(message.createdAt);

		return this.pinChannel.send({ embed });
	}

	async init() {
		this.pinChannel = this.client.channels.get(this.client.config.pinChannel);
	}

};
