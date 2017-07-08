const Command = require('../classes/Command');

module.exports = class Restart extends Command {

	constructor(...args) {
		super(...args, 'restart', {
			aliases: ['reboot'],
			description: 'Reboots the bot.'
		});
	}

	async run(msg) {
		await msg.say('Rebooting...');
		await msg.delete(1000);
		process.exit();
	}

};
