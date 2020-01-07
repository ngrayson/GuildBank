const util = require('../util/util.js');
const log = util.log;

const db = require('./db.js');

util.logBar(0,true);
log(db,true);
util.logBar(0,true);


async function initializePlayer(newPlayer){

	if (!newPlayer.hasOwnProperty('discordId')) throw 'players require a valid discord Id';

	log(newPlayer,true)

	let player = {
		name: 'name' in newPlayer ? newPlayer.name : 'null',
		discordHandle: 'discordHandle' in newPlayer ? newPlayer.discordHandle : 'null',
		discordId: newPlayer.discordId,
		active: true
	}

	//check to see if player already exists
	if(await isInitialized( player.discordId)) {
		throw `LOOMERROR: player already initialized: ${player.discordHandle}`;
	}
	else{
		try{
			log( `\ntypeof ${typeof player.discordId}`,true)
			let res = await db.addEntry(player, 'players')//.catch(log('an error happened',true))
			log(res,true)
			if(await res)
				log(`successfully initialized player ${player.discordId}[${player.discordHandle}]`)
		}catch (err) {	
			log('ERROR initializing player:',true)
			log(player,true)
			throw err;
		}
	}
}

async function updatePlayerNameById(id, name){
	let playerSearch = await db.getElementIn({discordId: id} ,'players') 
	if(!playerSearch)
		throw `no player with id: ${id}`
	else {
		log(playerSearch, true);
		db.editEntry('players', {discordId: id}, { $set: {discordHandle: name}})
	}
}

async function isInitialized(id){
	let playerSearch = await db.getElementIn({discordId: id} ,'players') 

	log(`checking if player with id ${id} is initialized..`)
	log(playerSearch)
	log(playerSearch.length > 0)

	return playerSearch.length > 0
}

async function permissions(id){
	let playerSearch = await db.getElementIn({discordId: id} ,'players') 

	log(playerSearch)
	log(playerSearch.length > 0)

	return playerSearch[0].permissions;
}

module.exports = {
	initializePlayer,
	isInitialized,
	updatePlayerNameById,
	permissions
}