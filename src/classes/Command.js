const ParsedUsage = require('./ParsedUsage');
const Params = require('./Params');

module.exports = class Command {

	constructor(client, dir, name, { aliases = [], botPerms = [], description, usage = '', usageDelim = undefined }) {
		this.client = client;
		this.dir = dir;
		this.name = name;
		this.aliases = aliases;
		this.botPerms = botPerms;
		this.description = description;
		this.usage = usage;
		this.usageDelim = usageDelim;
		this.parsedUsage = new ParsedUsage(client, this);
	}

	async _run(msg, args) {
		try {
			await this.hasPermissions(msg);
			const params = await new Params(this.client, msg, this, args.split(this.usageDelim)).validateArgs();
			await this.run(msg, params);
		} catch (err) {
			msg.say(err.stack ? Command.codeBlock('prolog', err.stack) : err);
		}
	}

	async hasPermissions(msg) {
		const missing = msg.channel.permissionsFor(this.client.user).missing(this.botPerms);
		if (missing.length === 0) return;
		throw `Missing the following permissions: ${missing.join(', ')}`;
	}

	run() {
		// Defined in extension Classes
	}

	init() {
		// Optionally defined in extension Classes
	}

	static codeBlock(lang, expression) {
		return `\`\`\`${lang}\n${expression || '\u200b'}\`\`\``;
	}

};
