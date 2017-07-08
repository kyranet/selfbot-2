const Command = require('../classes/Command');

module.exports = class Reload extends Command {

	constructor(...args) {
		super(...args, 'reload', {
			description: 'Reloads a command.',
			usage: '<CommandName:str>'
		});
	}

	async run(msg, [name]) {
		if (this.client.commands.reload(name)) return msg.alert(`Reloaded: ${name}`);
		return msg.alert(`Couldn't find: ${name}`);
	}

};
