const log = require('../util/util.js').log;

require('dotenv').config({path: '/../.env'})
const Discord = require('discord.js');
const CHATBOT_ENABLED = process.env.CHATBOT_ENABLED == 1;
const guildManager = require('./guildManager.js');

let chatbotReady = false;

const client = new Discord.Client();

function run() {
  if(CHATBOT_ENABLED) {
		const token = process.env.DBOT_TOKEN;

		client.on('ready', () => {
			log('\x1b[32m'+
				' ✓' +
				'\x1b[0m'+
				' Discord Bot logged in under ' +
				'\x1b[7m'+
				client.user.tag+
				'\x1b[0m',
				true);
			chatbotReady = true;
		});

		client.on('message', msg => {
			message(msg);
		})

		client.on('error', err => {
			log('\x1b[31m',true)
			log(err.error, true)
			if(Object.entries(err.error)[0][1] == 'SELF_SIGNED_CERT_IN_CHAIN') {
				log('\nBot was blocked by a certificate issue, may be a firewall problem.' +
					'\n shutting bot down.', true)
				// client.destroy().then(() => {
				// 	log(' Discord bot client shut down successful.', true)
				// });
			}
			log('\x1b[0m',true)
		});

		client.on('reconnecting', msg => {
			log('Discord Bot attempting to reconnect...',true)
		})

		client.login(token)
		  .then(log('  Discord client logging in...',true))
		  .catch(console.error);

  }
}

function isReady() {
  return chatbotReady;
}

function checkSetup() {
	chatbotReady = false;
	guildManager.checkGuilds(client).then(chatbotReady = true);
}

function message(msg) {
	log('recieved Discord message from ' + msg.author.username + ':',true);
	log('  |' + msg.content,true)
}

function rootMessage(msg) {
	if(typeof msg != 'string')
		throw 'a root message was passed that wasn\'t a string but was of type '+ typeof msg+', are you sure you meant to use rootMessage for this?'
	log('rootmessage', true)
	log(msg, true);
}



module.exports = {
	message,
	rootMessage,
	run,
	isReady,
	checkSetup
}
