const { Client, RichEmbed } = require('discord.js');
const ArgResolver = require('./ArgResolver');
const CommandStore = require('./CommandStore');
const Loader = require('./Loader');

module.exports = class AoBot extends Client {

	constructor(options) {
		super(options.discord);
		this.config = options.config;
		this.commands = new CommandStore(this);
		this.loader = new Loader(this);
		this.argResolver = new ArgResolver(this);
		this.RichEmbed = RichEmbed;
		this.once('ready', this._ready.bind(this));
		this.on('message', this._message.bind(this));
	}

	async login(token) {
		await this.loader.loadAll();
		return super.login(token);
	}

	_ready() {
		console.log(`Ready: ${this.guilds.size} guilds, ${this.channels.size} channels, ${this.users.size} users.`);
	}

	_message(msg) {
		if (msg.author.id !== this.user.id || !msg.content.startsWith(this.config.prefix)) return;
		const args = msg.content.slice(this.config.prefix.length).trim().split(' ');
		const commandName = args.shift().toLowerCase();
		const command = this.commands.get(commandName);
		if (command) command._run(msg, args.join(' '));
	}

};

process.on('unhandledRejection', (err) => {
	if (!err) return;
	console.error(`Uncaught Promise Error: \n${err.stack || err}`);
});
