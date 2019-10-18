// start with npm run dev to run in development mode (refresh on save)
const TEXTBAR_DOUBLE = '\x1b[36m==================================================\x1b[0m';
const TEXTBAR_SINGLE = '\x1b[36m--------------------------------------------------\x1b[0m';

console.log('\x1b[36m%s','\n\n');
console.log(TEXTBAR_DOUBLE);
console.log(' Starting Loom...\n');

require('dotenv').config()

const WEBSERVER_ENABLED = true;
const CHATBOT_ENABLED = true;
const CONSOLE_CHAT_OVERRIDE = true;

// express bits
if(WEBSERVER_ENABLED) {
	const express = require('express');
	const webApp = express();
	const PORT = 3000;
	const router = require('./server/webserver');
	webApp.set('view engine', 'ejs')

	webApp.listen(PORT, () => {
		console.log('\x1b[32m%s\x1b[0m%s\x1b[7m%s\x1b[0m',
			' ✓',
			' Webserver listening on port ', PORT) ;
	})
	webApp.use(router);
	console.log('  Webserver app initializing...');

}


if(CHATBOT_ENABLED) {
	const Discord = require('discord.js');
	const client = new Discord.Client();
	const token = process.env.DBOT_TOKEN;
	const chatbot = require('./chatbot/botserver.js');

	client.on('ready', () => {
		console.log('\x1b[32m%s\x1b[0m%s\x1b[7m%s\x1b[0m',
			' ✓',' Discord Bot logged in under ', client.user.tag
			);
	});

	client.on('message', msg => {
		chatbot.message(msg);
	})

	client.login(token)
	  .then(console.log('  Discord client logging in...'))
	  .catch(console.error);
	console.log(TEXTBAR_SINGLE);
}
	
