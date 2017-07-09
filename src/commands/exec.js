const Command = require('../classes/Command');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = class Exec extends Command {

	constructor(...args) {
		super(...args, 'exec', {
			aliases: [],
			description: 'Executes a command line arg.',
			botPerms: ['EMBED_LINKS'],
			usage: '<command:str>'
		});
	}

	async run(msg, [command]) {
		const { stdout, stderr } = await exec(command);

		const embed = new this.client.RichEmbed()
            .setTitle('Exec')
            .addField('STDOUT', this.codeBlock('prolog', stdout))
            .addField('STDERR', this.codeBlock('prolog', stderr))
            .setTimestamp()
            .setFooter('', msg.author.avatarURL);

		return msg.alert({ embed });
	}

};
