const log = require('../util/util.js').log;
const util = require('../util/util.js');

const reloadBotCommands = require('../util/util.js').reloadBotCommands;

require('dotenv').config({path: '/../.env'})
const Discord = require('discord.js');

const CHATBOT_ENABLED = process.env.CHATBOT_ENABLED == 1;
const DEV_MODE = true;
const guildManager = require('./guildManager.js');
const userManager = require('./../GuildHall/userManager')
const token = process.env.DBOT_TOKEN;

const roleChange = require('./events/roleChange.js') // if more events are added this should be abstracted out
const nameChange = require('./events/nameChange.js')

let chatbotReady = false;

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
reloadBotCommands(bot);

let lastCommandMsg 
// initialize commands


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

	/* Dev Mode Feature */
	if(DEV_MODE){
		if(command == "!!" && lastCommandMsg) {
			msg.channel.send('running last command:\n`'+lastCommandMsg.content+'`');
			let reloadPromise = util.reloadBotCommands(bot);
			reloadPromise.then( value => {
				log(`reload completed ${value}, calling ${lastCommandMsg.content}`,true)
			}).then(res => {
				message(lastCommandMsg)
			});
		}
		else {
			lastCommandMsg = msg;
			log(`lastCommand set to ${msg.content}`,true)
		}
	}

	let cmd = bot.commands.get(command.slice(prefix.length));

	log('recieved Discord message from ' + msg.author.username + ':',true);
	log(' | ' + msg.content,true)

	if(cmd){
		log('a valid command!',true)
		// check to see if location has permissions
			// get location 
		let location = msg.channel.type;
			// get permissions from command
		let cmdLocationPerm = cmd.permissions.locationPermissions;
		if(location == "dm") {
			// msg was recieved in a DM
			if(!cmdLocationPerm.directMessage)
				msg.channel.send('that command is not available in direct messages');
				return
		} else if (location == "text") {
			// msg was recieved in a text channel in a guild

			// unfinished
		}

		userManager.getUserByDiscordId(msg.author.id).then( user => {
			if(!user){
				log('command sent by a non-user, ignoring them',true)
				msg.author.createDM().then( channel => {
					channel.send(`You are not an initialized user, so you may not send commands`);
				})
				// return;
			}

			// check to see if user has permissions
			log('user:',true)
			log(user,true)
			// get user role
			let userPermFlags = 0;
			if (user.isAdmin) userPermFlags += 4;
			if (user.isDm) userPermFlags += 2;
			if (user.isPlayer) userPermFlags += 1;

			// get permissions from command
			let cmdUserPerm = cmd.permissions.userPermissions;
			log('cmdUserPerm')
			log(cmdUserPerm)

			let cmdUserPermFlags =0;
			if (cmdUserPerm.admin) cmdUserPermFlags += 4;
			if (cmdUserPerm.dm) cmdUserPermFlags += 2;
			if (cmdUserPerm.player) cmdUserPermFlags += 1;

			log('userPermFlags:')
			log('cmdUserPermFlags:')
			log(userPermFlags)
			log(cmdUserPermFlags)

			if(true || userPermFlags & cmdUserPermFlags > 1) {
				// if you get an error here, make sure the run function in the cmd file is async
				log(`${msg.content} was ran by ${util.name(msg.member)}`,true)
				cmd.run(bot, msg, args).catch( err => {
					log('something went wrong with that command... ',true)
					log(err,true)
				});
			} else {
				msg.author.createDM().then( channel => {
					channel.send(`*${msg.content}* is not a valid command for your permission level`)
				})
				log(`${msg.content} was attempted to be ran by ${util.name(msg.member)}, but they lack the correct permissions`,true)

			}
		});
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
	else if(oldMember.nickname != newMember.nickname){
		nameChange(oldMember, newMember);
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
