const Command = require('../classes/Command');

module.exports = class Help extends Command {

	constructor(...args) {
		super(...args, 'help', { description: 'Lists the command help.' });
	}

	async run(msg) {
		return msg.edit(this.codeBlock('asciidoc', this.client.commands.help.map(entry => `= ${entry.name} =\nUsage:: ${entry.usage}\nDescription:: ${entry.description}\n`).join('\n')));
	}

};
