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

const db = require('./db.js');
const chatbot = require('./chatbot/botserver.js');

let serverState = 0;
let webserverBooted = false;
let   chatbotBooted = false;
let    cliBotBooted = false;

bootMonitor();
runWebServer();
runChatBot();
console.log(TEXTBAR_SINGLE);

// express bits
function runWebServer() {
  if(WEBSERVER_ENABLED) {
  	const express = require('express');
  	const webApp = express();
  	const PORT = 3000;
  	const router = require('./server/webserver');
  	webApp.set('view engine', 'ejs')
  
  	webApp.listen(PORT, () => {
  		console.log('\x1b[32m%s\x1b[0m%s\x1b[7m%s\x1b[0m',
  			' ✓',
  			' Webserver listening on port ', PORT);
  		webserverBooted = true;
  	})
  	webApp.use(router);
  	console.log('  Webserver app initializing...');
  }
}


function runChatBot() {
  if(CHATBOT_ENABLED) {
  	if(DISCORDCLIENT_ENABLED) {
  		const Discord = require('discord.js');
  		const client = new Discord.Client();
  		const token = process.env.DBOT_TOKEN;
  
  		client.on('ready', () => {
  			console.log('\x1b[32m%s\x1b[0m%s\x1b[7m%s\x1b[0m',
  				' ✓',' Discord Bot logged in under ', client.user.tag
  				);
  			chatbotBooted = true;
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
  	}
  }
}

function runCLIBot() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\x1b[35m  |>\x1b[0m '
  });
  
  rl.on('line', (line) => {
    console.log(`Received: ${line}`);
    rl.prompt();
  });
  
  console.log('\x1b[32m%s\x1b[0m%s\x1b[0m',
  				' ✓',' CLI Bot Now Active'
  				);
  cliBotBooted = true;
  return rl;
}

// serverState
// 0: booting
// 1: boot complete, if CONSOLE_CHAT_OVERRIDE  is enabled, active as a chat interface, awaiting user input
// 2: thinking

function bootMonitor() {
	const intervalObj = setInterval(() =>{
		switch (serverState) {
			case 0:
				let serverReady = (!WEBSERVER_ENABLED || (WEBSERVER_ENABLED && webserverBooted))
				let chatbotReady =(!DISCORDCLIENT_ENABLED   || (DISCORDCLIENT_ENABLED   && chatbotBooted  ))
				let databaseReady = db.databaseReady();
				if( serverReady && chatbotReady && databaseReady){
					if(CONSOLE_CHAT_OVERRIDE) rl = runCLIBot();
					console.log("\n Everything booted correctly!")
					console.log(TEXTBAR_SINGLE)
					if(CONSOLE_CHAT_OVERRIDE) console.log('\x1b[35m%s\x1b[0m'," Chat Override Enabled: now parsing non-user-specific commands:");
          serverState = 1;
					
					rl.prompt();

					// Exit interval
					clearInterval(intervalObj);
				}
				else {
				  
				}
					// console.log( serverReady + ' '+ chatbotReady +' '+ databaseReady)
				break;
			case 1:
				break;
			case 2:
			  break;
			default:
				break;
		}
	}, 500);
}

