const { token, pinChannel, prefix } = require('../conf');
const AoBot = require('./classes/Client');
const client = new AoBot({
	discord: {},
	config: { prefix, pinChannel }
});

client.login(token);
