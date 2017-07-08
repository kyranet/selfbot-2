const { Collection } = require('discord.js');
const Command = require('./Command');

module.exports = class CommandStore {

	constructor(client) {
		this.client = client;
		this.commands = new Collection();
		this.aliases = new Collection();
	}

	get(name) {
		return this.commands.get(name) || this.commands.get(this.aliases.get(name));
	}

	has(name) {
		return this.commands.has(name) || this.aliases.has(name);
	}

	register(command) {
		this.commands.set(command.name, command);
		command.aliases.forEach(alias => this.aliases.set(alias, command.name));
	}

	unregister(name) {
		const command = this.resolve(name);
		if (!command) return false;
		this.commands.delete(command.name);
		command.aliases.forEach(alias => this.aliases.delete(alias));
		return true;
	}

	reload(name) {
		const command = this.resolve(name);
		if (!command) return false;
		this.unregister(command);
		const path = command.dir;
		const Cmd = require(path);
		const cmd = new Cmd(this.client, path);
		this.register(cmd);
		if (cmd.init) cmd.init();
		delete require.cache[require.resolve(path)];
		return true;
	}

	resolve(name) {
		if (name instanceof Command) return name;
		return this.get(name);
	}

};
