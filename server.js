// start with npm run dev to run in development mode (refresh on save)
require('dotenv').config()
const express = require('express');

const CHATBOT_ENABLED = process.env.CHATBOT_ENABLED == 1;
const CONSOLE_CHAT_OVERRIDE = process.env.CONSOLE_CHAT_OVERRIDE == 1;
const WEBSERVER_ENABLED = process.env.WEBSERVER_ENABLED == 1;

const TEXTBAR_DOUBLE = '\x1b[36m==================================================\x1b[0m';
const TEXTBAR_SINGLE = '\x1b[36m--------------------------------------------------\x1b[0m';

console.log('\x1b[36m%s','\n\n');
console.log(TEXTBAR_DOUBLE);
console.log(' Starting Loom...\n');

const db = require('./db.js');
const chatbot = require('./chatbot/botserver.js');
const webserver = require('./server/webserver.js');

let serverState = 0;

bootMonitor();
webserver.run();
chatbot.run();
console.log(TEXTBAR_SINGLE);


// serverState
// 0: booting
// 1: boot complete, if CONSOLE_CHAT_OVERRIDE  is enabled, active as a chat interface, awaiting user input
// 2: thinking

function bootMonitor() {
	const intervalObj = setInterval(() =>{
		switch (serverState) {
			case 0:
				let serverOK = (!WEBSERVER_ENABLED || (WEBSERVER_ENABLED && webserver.isReady()))
				let chatbotOK =(!CHATBOT_ENABLED   || (CHATBOT_ENABLED   && chatbot.isReady()))
				let databaseOK = db.databaseReady();
				if( serverOK && chatbotOK && databaseOK){
					if(CONSOLE_CHAT_OVERRIDE) rl = runCLIBot();
					console.log("\n Everything booted correctly!")
					console.log(TEXTBAR_SINGLE)
					if(CONSOLE_CHAT_OVERRIDE) console.log('\x1b[35m%s\x1b[0m'," Chat Override Enabled: now parsing non-user-specific commands:");
          serverState = 1;
					rl.prompt();
					// Exit interval
					clearInterval(intervalObj);
				}
					// console.log( serverOK + ' '+ chatbotOK +' '+ databaseOK)
				break;
			default:
				break;
		}
	}, 500);
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
