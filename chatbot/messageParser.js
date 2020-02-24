const DEV_MODE = process.env.DEV_MODE == 1;
const userManager = require('../GuildHall/userManager')
const log = require('../util/util.js').log;
const INVALID_MSG_DELAY_MS = 5000;
const util = require('../util/util.js');

/* This file handles parsing of discord Messages */

function message(bot,msg) {
    if(bot.constructor.name != 'Client') {
        throw `messageRouter.message Error: must pass a Discord Client to respond with`
    }
    if(msg.constructor.name != 'Message'){
        throw `messageRouter.message Error: must pass a Message to parse`
    }

	let prefix = '!';

	if (msg.author.bot) return;
	// if (msg.channel.type === "dm") return;

	let messageArray = msg.content.split(/\s+/g);
	let command = messageArray[0];
	let args = messageArray.slice(1);
	if(!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));

	log('recieved Discord message from ' + msg.author.username + ':',true);
    log(' | ' + msg.content,true)
    
	/* Dev Mode Feature */
    if(DEV_MODE && command == "!!" && lastCommandMsg && lastCommandMsg.content != '!!') {
        msg.channel.send('running last command:\n`'+lastCommandMsg.content+'`');
        let reloadPromise = util.reloadBotCommands(bot);
        reloadPromise.then( value => {
            log(`reload completed ${value}, calling ${lastCommandMsg.content}`,true)
        }).then(res => {
            message(bot,lastCommandMsg)
        });
    }
    else if(cmd){
		log('a valid command!',true)
        // update last commmand message
        lastCommandMsg = msg;
        log(`lastCommand set to ${msg.content}`,true)
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
	} else {
		// msg was not a valid command
		log(`'${msg.content}' is not a valid command`,true )
		invalidCommand(msg);
	}
}

async function invalidCommand(msg) {
    let response = await msg.channel.send(`\`${msg.content}\` is not a valid command\nFor help type !help`)
    response.delete(INVALID_MSG_DELAY_MS);
    return true;
}

module.exports = {
    message
}