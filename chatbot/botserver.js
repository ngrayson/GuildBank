require('dotenv').config({path: '/../.env'})
const Discord = require('discord.js');
const CHATBOT_ENABLED = process.env.CHATBOT_ENABLED == 1;

let chatbotReady = false;

function run() {
  if(CHATBOT_ENABLED) {
		const client = new Discord.Client();
		const token = process.env.DBOT_TOKEN;

		client.on('ready', () => {
			console.log('\x1b[32m%s\x1b[0m%s\x1b[7m%s\x1b[0m',
				' ✓',' Discord Bot logged in under ', client.user.tag
				);
			chatbotReady = true;
		});

		client.on('message', msg => {
			message(msg);
		})

		client.on('error', err => {
			console.log('\x1b[31m')
			console.log(err.error)
			if(Object.entries(err.error)[0][1] == 'SELF_SIGNED_CERT_IN_CHAIN') {
				console.log('\nBot was blocked by a certificate issue, may be a firewall problem.' +
					'\n shutting bot down.')
				// client.destroy().then(() => {
				// 	console.log(' Discord bot client shut down successful.')
				// });
			}
			console.log('\x1b[0m')
		});

		client.on('reconnecting', msg => {
			console.log('Discord Bot attempting to reconnect...')
		})

		client.login(token)
		  .then(console.log('  Discord client logging in...'))
		  .catch(console.error);

  }
}

function isReady() {
  return chatbotReady;
}

function message(msg) {
	console.log('recieved Discordd message:');
	console.log(msg)
}

function rootMessage(msg) {
	if(typeof msg != 'string')
		throw 'a root message was passed that wasn\'t a string but was of type '+ typeof msg+', are you sure you meant to use rootMessage for this?'
	console.log('rootmessage')
	console.log(msg);
}

module.exports = {
	message,
	rootMessage,
	run,
	isReady
}
