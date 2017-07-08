module.exports = class Params {

	constructor(client, msg, cmd, args) {
		this.client = client;
		this.msg = msg;
		this.cmd = cmd;
		this.args = args;
		this.params = [];
		this.reprompted = false;
		this._currentUsage = {};
		this._repeat = false;
	}

	async validateArgs() {
		if (this.params.length >= this.cmd.parsedUsage.tags.length && this.params.length >= this.args.length) {
			return this.params;
		} else if (this.cmd.parsedUsage.tags[this.params.length]) {
			if (this.cmd.parsedUsage.tags[this.params.length].type !== 'repeat') {
				this._currentUsage = this.cmd.parsedUsage.tags[this.params.length];
			} else if (this.cmd.parsedUsage.tags[this.params.length].type === 'repeat') {
				this._currentUsage.type = 'optional';
				this._repeat = true;
			}
		} else if (!this._repeat) {
			return this.params;
		}
		if (this._currentUsage.type === 'optional' && (this.args[this.params.length] === undefined || this.args[this.params.length] === '')) {
			if (this.cmd.parsedUsage.tags.slice(this.params.length).some(usage => usage.type === 'required')) {
				this.args.splice(this.params.length, 0, undefined);
				this.args.splice(this.params.length, 1, null);
				throw 'Missing one or more required arguments after end of input.';
			} else {
				return this.params;
			}
		} else if (this._currentUsage.type === 'required' && this.args[this.params.length] === undefined) {
			this.args.splice(this.params.length, 1, null);
			throw this._currentUsage.possibles.length === 1 ?
                `${this._currentUsage.possibles[0].name} is a required argument.` :
                `Missing a required option: (${this._currentUsage.possibles.map(poss => poss.name).join(', ')})`;
		} else if (this._currentUsage.possibles.length === 1) {
			if (this.client.argResolver[this._currentUsage.possibles[0].type]) {
				return this.client.argResolver[this._currentUsage.possibles[0].type](this.args[this.params.length], this._currentUsage, 0, this._repeat, this.msg)
					.then((res) => {
						if (res !== null) {
							this.params.push(res);
							return this.validateArgs();
						}
						this.args.splice(this.params.length, 0, undefined);
						this.params.push(undefined);
						return this.validateArgs();
					})
					.catch((err) => {
						this.args.splice(this.params.length, 1, null);
						throw err;
					});
			}
			this.client.emit('log', 'Unknown Argument Type encountered', 'warn');
			return this.validateArgs();
		} else {
			return this.multiPossibles(0, false);
		}
	}

	async multiPossibles(possible, validated) {
		if (validated) {
			return this.validateArgs();
		} else if (possible >= this._currentUsage.possibles.length) {
			if (this._currentUsage.type === 'optional' && !this._repeat) {
				this.args.splice(this.params.length, 0, undefined);
				this.params.push(undefined);
				return this.validateArgs();
			}
			this.args.splice(this.params.length, 1, null);
			throw `Your option didn't match any of the possibilities: (${this._currentUsage.possibles.map(poss => poss.name).join(', ')})`;
		} else if (this.client.argResolver[this._currentUsage.possibles[possible].type]) {
			return this.client.argResolver[this._currentUsage.possibles[possible].type](this.args[this.params.length], this._currentUsage, possible, this._repeat, this.msg)
				.then((res) => {
					if (res !== null) {
						this.params.push(res);
						return this.multiPossibles(++possible, true);
					}
					return this.multiPossibles(++possible, validated);
				})
				.catch(() => this.multiPossibles(++possible, validated));
		} else {
			this.client.emit('log', 'Unknown Argument Type encountered', 'warn');
			return this.multiPossibles(++possible, validated);
		}
	}

};
