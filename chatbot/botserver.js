const log = require('../util/util.js').log;

require('dotenv').config({path: '/../.env'})
const Discord = require('discord.js');
const fs = require('fs');
const CHATBOT_ENABLED = process.env.CHATBOT_ENABLED == 1;
const guildManager = require('./guildManager.js');
const roleChange = require('./events/roleChange.js') // if more events are added this should be abstracted out
const token = process.env.DBOT_TOKEN;

let chatbotReady = false;

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();


// initialize commands

fs.readdir('./chatbot/cmds/', (err, files) => {
	if(err) throw err;

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0) {
		log("No commands to load!", true);
		return;
	}

	log(`    Loading ${jsfiles.length} commands!`,true);

	jsfiles.forEach((f, i) => {
		let props = require(`./cmds/${f}`);
		log(`      command ${i+1}: ${f} loaded!`,true);
		bot.commands.set(props.help.name, props);
	});
})


function run() {
  if(CHATBOT_ENABLED) {

		bot.on('ready', () => {
			log('\x1b[32m'+
				' ✓' +
				'\x1b[0m'+
				' Discord Bot logged in under ' +
				'\x1b[7m'+
				bot.user.tag+
				'\x1b[0m',
				true);
			chatbotReady = true;
			log('bot.commands:');
			log(bot.commands);
		});

		bot.on('message', async msg => {
			message(msg);
		})

		bot.on('guildMemberUpdate', (oldMember,newMember) => {
			memberUpdate(oldMember,newMember);
		})

		bot.on('error', err => {
			log('\x1b[31m',true)
			log(err.error, true)
			if(Object.entries(err.error)[0][1] == 'SELF_SIGNED_CERT_IN_CHAIN') {
				log('\nBot was blocked by a certificate issue, may be a firewall problem.' +
					'\n shutting bot down.', true)
				// bot.destroy().then(() => {
				// 	log(' Discord bot bot shut down successful.', true)
				// });
			}
			log('\x1b[0m',true)
		});

		bot.on('reconnecting', msg => {
			log('Discord Bot attempting to reconnect...',true)
		})

		bot.login(token)
		  .then(log('  Discord bot logging in...',true))
		  .catch(console.error);

  }
}

function isReady() {
  return chatbotReady;
}

function checkSetup() {
	chatbotReady = false;
	guildManager.checkGuilds(bot).then(chatbotReady = true);
}

function message(msg) {

	let prefix = '!';

	if (msg.author.bot) return;
	// if (msg.channel.type === "dm") return;

	let messageArray = msg.content.split(/\s+/g);
	let command = messageArray[0];
	let args = messageArray.slice(1);
	if(!command.startsWith(prefix)) return;

	let cmd = bot.commands.get(command.slice(prefix.length));

	log('recieved Discord message from ' + msg.author.username + ':',true);
	log('  |' + msg.content,true)

	if(cmd){
		// check to see if user has permissions
		// get user role
		// get permissions from command
		let cmdUserPerm = cmd.permissions.userPermissions;
		// check to see if location has permissions
			// get location 
		let location = msg.channel.type;
			// get permissions from command
		let cmdLocationPerm = cmd.permissions.locationPermissions;
		if(location == "dm") {
			// msg was recieved in a DM
			if(cmdLocationPerm.directMessage) 
				cmd.run(bot, msg, args);
		} else if (location == "text") {
			// msg was recieved in a text channel in a guild
			cmd.run(bot, msg, args);
		}
	} 
}

function memberUpdate(oldMember,newMember){
	if(!oldMember.roles.equals(newMember.roles)) {
		// the member update was a change in rolls
		if(oldMember.roles.array().length < newMember.roles.array().length)
			roleChange.newRole(oldMember,newMember);
		else
			roleChange.removedRole(oldMember,newMember);
	}
	// find difference in roles
	// if DnD player role was added, initialize player
	// if DnD player role was removed, mark player as inactive.

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
