// start with npm run dev to run in development mode (refresh on save)
require('dotenv').config()

const WEBSERVER_ENABLED = process.env.WEBSERVER_ENABLED == 1;
const CHATBOT_ENABLED = process.env.CHATBOT_ENABLED == 1;
const DISCORDCLIENT_ENABLED = process.env.DISCORDCLIENT_ENABLED == 1;
const CONSOLE_CHAT_OVERRIDE = process.env.CONSOLE_CHAT_OVERRIDE == 1;

const TEXTBAR_DOUBLE = '\x1b[36m==================================================\x1b[0m';
const TEXTBAR_SINGLE = '\x1b[36m--------------------------------------------------\x1b[0m';

console.log('\x1b[36m%s','\n\n');
console.log(TEXTBAR_DOUBLE);
console.log(' Starting Loom...\n');



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
	const chatbot = require('./chatbot/botserver.js');
	if(DISCORDCLIENT_ENABLED) {
		const Discord = require('discord.js');
		const client = new Discord.Client();
		const token = process.env.DBOT_TOKEN;

		client.on('ready', () => {
			console.log('\x1b[32m%s\x1b[0m%s\x1b[7m%s\x1b[0m',
				' ✓',' Discord Bot logged in under ', client.user.tag
				);
		});

		client.on('message', msg => {
			chatbot.message(msg);
		})

		client.on('error', err => {
			console.log('\x1b[31m')
			console.log(err.error)
			if(Object.entries(err.error)[0][1] == 'SELF_SIGNED_CERT_IN_CHAIN') {
				console.log('Bot was blocked by a certificate issue, may be a firewall problem.' + 
					'\n shutting bot down.')
				client.destroy().then(() => {
					console.log(' Discord bot client shut down successful.')
				});
			}
			console.log('\x1b[0m')
		});

		client.on('reconnecting', msg => {
			console.log('Discord Bot attempting to reconnect...')
		})

		client.login(token)
		  .then(console.log('  Discord client logging in...'))
		  .catch(console.error);
		console.log(TEXTBAR_SINGLE);
	}
}
	
console.log(TEXTBAR_SINGLE);
