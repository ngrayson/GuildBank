"use strict";

const log = require('./util/util.js').log;
const db = require('./db/db.js');

const levelThresholds = [
 0,      300,    900,    2700,   6500,
 14000,  23000,  34000,  48000,  64000,
 85000,  100000, 120000, 140000, 165000, 
 195000, 225000, 265000, 305000, 355000];

const classList = [
	'Barbarian',
	'Bard',
	'Cleric',
	'Druid',
	'Fighter',
	'Monk',
	'Paladin',
	'Ranger',
	'Rogue',
	'Sorcerer',
	'Warlock',
	'Wizard'];

const subclassList = [
	'Arcane Trickster'];
	
let characters = [];

class Character {


	// nameFull = '';
	// playerId = '';
	// nameShort = null;
	// dateCreated = new Date();
	// experience = 0;
	// moneyCp = 0;
	// charClass = null;
	// charSubclass = null;
	// currentActivity = null;


	constructor(nameFull,playerId) {
		// check to make sure namefull is a string
		// check to make sure playerid is a string

		// all of these should be functions that read from the db

		this.nameFull = nameFull;
		this._playerId = playerId; // make this private
		this.nameShort = nameFull[0]; 
		this.dateCreated = new Date(); // make this private
		this.experience = 0; // make this private
		this.moneyCp = 0; // make this private
		this.charClass = -1; // make this private
		this.charSubclass = -1; // make this private
		this.currentActivity = -1; // make this private

		characters.push(this);
		sendCharacter(this);

	}

	// constructor(characterFromDB){

	// 	characters.push(this);
	// }
	
	// getters?
	get moneyString() {
		let moneyString = '';
		let money = 14922; //this.moneyCp;
		let gold = Math.floor(money/100);
		money -= gold*100;
		
		let silver = Math.floor(money/10);
		money -= silver*10;
		
		let copper = money;

		moneyString += gold + ' gp, '
		moneyString += silver + ' sp, '
		moneyString += copper + ' cp'

		return moneyString
	}

	// example static method
	// call with Character.levelFromexperience(experience)
	static levelFromExperience(experience) {
		return levelFromExperience(experience);
	}

	static fetchAllCharacters() {

	}

	static allCharacters() {
		return characters
	}

	static getByName(string) {

	}

	// all other methods
	
	addExperience(amount) {
		this.experience += amount;
		return this.experience;
	}

	addResonite(amount){
		log('the addResonite function is unfinished',true);
		// get player( this.playerid)
		// player.addresonite		
	}
	
	removeResonite(amount){
		log('the removeResonite function is unfinished',true);
		// get player( this.playerid)
		// player.removeresonite	
	}

	level(){
		return levelFromExperience(this.experience);
	}

	set playerId(playerId){ //interrupt the setting of playerId
		if(this.playerId)
			throw 'Illegal operation, cannot chaneg playerId';
		else
			this._playerId = playerId;
	}
}

function levelFromExperience(experience){
	if (typeof experience != int)
		throw 'cannot find level from a non-integer amount of experience'
	else {
		 return levelThresholds.findIndex((element => element > experience)) + 1;
	}
}

function sendCharacter(character) {
	log('sendCharacter:')
	log('character class instance:',true)
	log(character,true);
	log('character object:',true)
	let charObj = char2Object(character);
	log(charObj,true)
	log('character_name_full: ' + charObj.character_name_full ,true)
	log(typeof charObj.character_name_full, true)
	log('character_name_short: ' + charObj.character_name_short ,true)
	log(typeof charObj.character_name_short, true)
	log('player_id: ' + charObj.player_id ,true)
	log(typeof charObj.player_id, true)
	log('date_created: ' + charObj.date_created ,true)
	log(typeof charObj.date_created, true)
	log('experience: ' + charObj.experience ,true)
	log(typeof charObj.experience, true)
	log('moneyCp: ' + charObj.moneyCp ,true)
	log(typeof charObj.moneyCp, true)
	log('class: ' + charObj.class ,true)
	log(typeof charObj.class, true)
	log('subclass: ' + charObj.subclass ,true)
	log(typeof charObj.subclass, true)
	log('current_activity: ' + charObj.current_activity ,true)
	log(typeof charObj.current_activity, true)
	db.addEntry(charObj,'characters');
}

//turns a character class entity into an object, for storing in the database
function char2Object(charClass) {
	let charObj = {
		character_name_full: charClass.nameFull,
		character_name_short: charClass.nameShort,
		player_id: charClass._playerId,
		date_created: charClass.dateCreated,
		experience: charClass.experience,
		moneyCp: charClass.moneyCp,
		class: charClass.charClass,
		subclass: charClass.charSubclass,
		current_activity: charClass.currentActivity	
	}
	return charObj;
}
		
module.exports = {
	classList,
	subclassList,
	Character
}
/*
so I am writing a discord bot which uses mongoDB as a database
I have a Player class for doing Player things (like add experience)
in my mongoDB I have a Player collection so I can keep all that information up to date
how do I decide what to store in memmory vs the database?
I want the database to be the source of truth in case the server crashes or something happens
but then I am worried that im missing out on a lot of time gains.

I guess part of this is figuring out if I want push or pull based?

I don't see a reason for there to be multiple servers (maybe multiple clients)

can I make the server memmory master and the DB slave while the server is online?
would that be stupid?

This is such a high level infrastructure/architectural decision that I am not comfortable just doing something that works
*/
