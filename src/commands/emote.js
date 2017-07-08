const Command = require('../classes/Command');

module.exports = class Emote extends Command {

	constructor(...args) {
		super(...args, 'emote', {
			usage: '<emote:str> [message:str] [...]',
			usageDelim: ' ',
			description: 'Reboots the bot.'
		});
		this.emotes = {
			konami: ':arrow_up: :arrow_up: :arrow_down: :arrow_down: :arrow_left: :arrow_right: :arrow_left: :arrow_right: :b: :a:',
			lenny: '( ͡° ͜ʖ ͡°)',
			shrug: '¯\\_(ツ)_/¯',
			justright: '✋😩👌',
			tableflip: '(╯°□°）╯︵ ┻━┻',
			unflip: '┬──┬﻿ ノ( ゜-゜ノ)',
			shades: '(⌐■_■)',
			shadeflip: '(⌐■_■)╯︵ ┻━┻',
			spaghetti: '\\ev function decode() {\n		return String.fromCharCode(message[1], message[2], message[3], message[4], message[5], message[6], message[7]);\n}\nvar message = [];\nfor(var i=0; i<8; i++) {\n		message[i] = Math.round(-0.533333488*Math.pow(i, 6) + 12.72500372*Math.pow(i, 5) - 119.6250353*Math.pow(i, 4) + 561.9585003*Math.pow(i, 3) - 1375.842075*Math.pow(i, 2) + 1645.317147*i - 641.0002156);\n}\ndecode();',
			sniper: '▄︻̷̿┻̿═━一',
			doubleflip: '┻━┻︵ (°□°)/ ︵ ┻━┻'
		};
	}

	async run(msg, [emote, ...suffix]) {
		msg.delete();
		const postSuffix = suffix.join(' ');
		if (emote in this.emotes) msg.channel.sendMessage(`${this.emotes[emote]} ${postSuffix}`);
	}

};
