const Command = require('../classes/Command');
const { inspect } = require('util');

module.exports = class Eval extends Command {

	constructor(...args) {
		super(...args, 'eval', {
			aliases: ['ev'],
			botPerms: ['EMBED_LINKS'],
			usage: '<expression:str>',
			description: 'Evaluates arbitrary Javascript.'
		});
	}

	async run(msg, [expression]) {
		const client = this.client;
		if (expression === '') return msg.say('doh!');
		if (/token/gi.test(msg.content)) return msg.say('doh!');
		try {
			let evaled = eval(expression);
			if (evaled instanceof Promise) evaled = await evaled;
			const type = typeof evaled;
			const insp = inspect(evaled, { depth: 0 });

			if (evaled.toString().includes(client.token) || insp.toString().includes(client.token)) return msg.say('dumbass');

			if (evaled === null) evaled = 'null';
			if (evaled === undefined) evaled = 'undefined';
			if (evaled === '') evaled = '\u200b';
			if (insp === '[]') evaled = '\u200b';
			if (insp === '{}') evaled = '\u200b';

			const embed = new client.RichEmbed()
				.setColor(0x00ff00)
				.addField('EVAL:', this.codeBlock('js', expression))
				.addField('Evaluates to:', evaled);

			if (evaled instanceof Object) embed.addField('Inspect:', this.codeBlock('js', insp));
			else embed.addField('Type:', type);

			return msg.alert({ embed });
		} catch (err) {
			if (err.toString().includes(client.token)) return msg.say('dumbass');

			const embed = new client.RichEmbed()
				.setColor(0xff0000)
				.addField('EVAL:', expression)
				.addField('Error:', err);

			return msg.alert({ embed });
		}
	}

};
