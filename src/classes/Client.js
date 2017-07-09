require('./Extendables');
const { Client, RichEmbed } = require('discord.js');
const rethink = require('rethinkdbdash');
const moment = require('moment');
const chalk = require('chalk');
const clk = new chalk.constructor({ enabled: true });
const ArgResolver = require('./ArgResolver');
const CommandStore = require('./CommandStore');
const Loader = require('./Loader');

module.exports = class AoBot extends Client {

	constructor(options) {
		super(options.discord);
		this.db = rethink(options.rethink);
		this.config = null;
		this.commands = new CommandStore(this);
		this.loader = new Loader(this);
		this.argResolver = new ArgResolver(this);
		this.RichEmbed = RichEmbed;
		this.truelyReady = false;
		this.once('ready', this._ready.bind(this));
		this.on('message', this._message.bind(this));
		this.on('log', this._log.bind(this));
		this.on('error', data => this._log(data, 'error'));
		this.on('warn', data => this._log(data, 'warn'));
		// this.on('debug', data => this._log(data, 'debug'));
	}

	async login(token) {
		this.config = await this.db.table('config').get(1);
		await this.loader.loadAll();
		return super.login(token);
	}

	async _ready() {
		this.commands.commands.forEach(command => command.init());
		this.truelyReady = true;
		this._log(`Ready: ${this.guilds.size} guilds, ${this.channels.size} channels, ${this.users.size} users.`);
	}

	_message(msg) {
		if (!this.truelyReady || msg.author.id !== this.user.id || !msg.content.startsWith(this.config.prefix)) return;
		const args = msg.content.slice(this.config.prefix.length).trim().split(' ');
		const commandName = args.shift().toLowerCase();
		const command = this.commands.get(commandName);
		if (!command) return;
		command._run(msg, args.join(' '));
		this.emit('log', `${commandName}(${args.join(' ')})`);
	}

	_log(data, type = 'log') {
		type = type.toLowerCase();

		data = data.stack || data.message || data;
		if (typeof data === 'object' && typeof data !== 'string' && !Array.isArray(data)) data = require('util').inspect(data, { depth: 0, colors: true });
		if (Array.isArray(data)) data = data.join['\n'];

		const timestamp = colorize[type](`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`);
		if (type === 'debug') type = 'log';
		// eslint-disable-next-line no-console
		console[type](data.split('\n').map(str => `${timestamp} ${str}`).join('\n'));
	}

};

const colorize = {
	debug: (data) => clk.bgMagenta(data),
	warn: (data) => clk.bgYellow(data),
	error: (data) => clk.bgRed(data),
	log: (data) => clk.bgBlue(data)
};

process.on('unhandledRejection', (err) => {
	if (!err) return;
	console.error(`Uncaught Promise Error: \n${err.stack || err}`);
});
