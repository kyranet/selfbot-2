const { Message } = require('discord.js');
const { promisify } = require('util');
const sleep = promisify(setTimeout);


class Extendables {

	async nuke(time = 0) {
		if (time === 0) return this.delete();
		const count = this.edits.length;
		await sleep(time);
		const msg = this.channel.messages.get(this.id);
		if (msg && msg.edits.length !== count) return this.nuke(time);
		else if (msg) return this.delete();
		return false;
	}

	async alert(data) {
		await this.edit(data);
		return this.nuke(this.client.config.alertTime);
	}

	say(data) {
		const msg = this.channel.messages.get(this.id);
		if (msg) return this.edit(data);
		return this.channel.send(data);
	}

}

const applyToClass = (structure, props) => {
	for (const prop of props) {
		Object.defineProperty(structure.prototype, prop, Object.getOwnPropertyDescriptor(Extendables.prototype, prop));
	}
};

applyToClass(Message, ['nuke', 'alert']);
