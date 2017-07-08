const fs = require('fs-nextra');
const { resolve } = require('path');

module.exports = class Loader {

	constructor(client) {
		this.client = client;
		this.commandsFolder = resolve(__dirname, '..', 'commands');
	}

	loadAll() {
		return Promise.all([this.loadCommands()]);
	}

	async loadCommands() {
		const files = await fs.readdir(this.commandsFolder);
		return Promise.all(files.map(file => {
			const path = resolve(this.commandsFolder, file);
			const Command = require(path);
			const command = new Command(this.client, path);
			this.client.commands.register(command);
			delete require.cache[require.resolve(path)];
			return command;
		}));
	}

};
