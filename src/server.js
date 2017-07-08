const { token, rethink } = require('../conf');
const AoBot = require('./classes/Client');
const client = new AoBot({
	discord: {},
	rethink
});

client.login(token);
