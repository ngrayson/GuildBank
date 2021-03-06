const util = require('../util/util.js');
const log = util.log;

const User = require('../db/User.js')
const Character = require('../db/Character.js')
const db = require('../db/db.js');


// getUser
async function getUserByDiscordId(id){
	log('getting user by discord ID..')
	let user = await User.fromDiscordId(id);
	log(user)
	return user;
}

async function newUser(handle, connection) {
	
	if(typeof handle != 'string') throw `userManager.newUser Error: handle must be of type string, not ${typeof handle}`
	if(connection.discord && connection.discord.discordId) {}
	else if(false) {}
	else throw `no valid connections found, users must be connected to something`
	let newUser = await User.newUser({
		handle: handle,
		connections: connection
	})
	return newUser;
}

function initializeUser(newUser){
	if (!newUser.hasOwnProperty('discordId')) throw 'Users require a valid discord Id';

	log('user to be initialized')
	log(newUser)

	return new Promise((resolve, reject) => {

		//check to see if User already exists
		getUser(newUser.discordId).catch( err => {
			log(err, true)
		}).then(user => {
			log('user:',true)
			log(user,true)
			if(user)
				reject(`LOOMERROR: user already initialized: ${user.discordHandle}`)
			else{
				log( `\ntypeof ${typeof user.discordId}`,true)

				let newUserDoc = new User({
					name: {
						first: 'name' in newUser ? newUser.name : 'null'
					},
					connections:{
						discord: {
							discord_handle: 'discordHandle' in newUser ? newUser.discordHandle : 'null',
							discordId: newUser.discordId
						}
					},
					is_active: true
				})
				
				newUserDoc.save((err, user) => {
					if(err){
						log(err,true);
						reject(err);
						log('ERROR initializing user:',true)
						log(user,true)
					}
					else{
						log(`successfully initialized user ${user.discordId}[${user.discordHandle}]`)
						resolve(user);
					}
				})
			}
		})
	})
}


async function updateUserNameById(id, name){
	let UserSearch = await db.getElementIn({discordId: id} ,'Users') 
	if(!UserSearch)
		throw `no User with id: ${id}`
	else {
		log(UserSearch, true);
		db.editEntry('Users', {discordId: id}, { $set: {discordHandle: name}})
	}
}


// updates a User's permissions where the permissions Object is of format
// permissions: {
// 	admin: true,
// 	dm: false
// }
// either can be omitted, must be true or false
async function updateUserPermissionsById(id,permissions){
	let UserSearch = await db.getElementIn({discordId: id} ,'Users') 
	if(UserSearch.length == 0)
		throw `no User with id: ${id}`
	else {
		oldPerms = UserSearch[0].permissions;
		let newPerms = {
			// if permissions has a boolean, use that, otherwise use prior value
			admin: typeof permissions.admin == 'boolean' ? permissions.admin : oldPerms.admin,
			dm: typeof permissions.dm == 'boolean' ? permissions.dm : oldPerms.dm
		}
		return db.editEntry('Users', {discordId: id}, { $set: {permissions: newPerms}});
	}
}

async function isInitialized(id){
	let UserSearch = await db.getElementIn({discordId: id} ,'Users') 

	log(`checking if User with id ${id} is initialized..`)
	log(UserSearch)
	log(UserSearch.length > 0)

	return UserSearch.length > 0
}

async function permissions(id){
	let UserSearch = await db.getElementIn({discordId: id} ,'Users') 

	log(UserSearch)
	log(UserSearch.length > 0)

	return UserSearch[0].permissions;
}

module.exports = {
	getUserByDiscordId,
	initializeUser,
	newUser
}