const Command = require('../classes/Command');

module.exports = class Restart extends Command {

	constructor(...args) {
		super(...args, 'restart', {
			aliases: ['reboot'],
			description: 'Reboots the bot.'
		});
	}

	async run(msg) {
		await msg.edit('Rebooting...').catch(console.error);
		process.exit();
	}

};
