const Command = require('../classes/Command');

module.exports = class Quote extends Command {
	constructor(...args) {
		super(...args, 'quote', {
			aliases: ['pin'],
			description: 'Takes note of the message based on id',
			usage: '<Quote:msg> [Message:str]',
			usageDelim: ', '
		});
	}

	async run(msg, [quote, content]) {
		const embed = new this.client.RichEmbed()
			.setAuthor(quote.member ? quote.member.displayName : quote.author.username, quote.author.avatarURL)
			.setColor(quote.member ? quote.member.highestRole.color : 'RANDOM')
			.setDescription(quote.content)
			.setTimestamp(quote.createdAt);
		return msg.say(content || '', { embed });
	}
};
