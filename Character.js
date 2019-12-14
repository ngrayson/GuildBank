"use strict";


levelThresholds = 
[0,      300,    900,    2700,   6500,
 14000,  23000,  34000,  48000,  64000,
 85000,  100000, 120000, 140000, 165000, 
 195000, 225000, 265000, 305000, 355000];

charClass = {
	BARBARIAN: 1,
	BARD: 2
}

charSubclass = {
	BARBARIAN: {
		ZEALOT: 1,
		BATTLERAGER: 2
	}
}

class Character {

	static characters[];

	nameFull = nameFull;
	playerId = playerId;
	nameShort = null;
	dateCreated = new Date();
	exp = 0;
	moneyCp = 0;
	charClass = null;
	charSubclass = null;
	currentActivity = null;


	constructor(nameFull,playerId) {
		// check to make sure namefull is a string
		// check to make sure playerid is a string

		// all of these should be functions that read from the db

		this.nameFull = nameFull;
		this.playerId = playerId; // make this private

		this.nameShort = null; 
		this.dateCreated = new Date(); // make this private
		this.exp = 0; // make this private
		this.moneyCp = 0; // make this private
		this.charClass = null; // make this private
		this.charSubclass = null; // make this private
		this.currentActivity = null; // make this private

		characters.push(this);
	}

	constructor(characterFromDB){

		characters.push(this);
	}
	
	// getters?
	get moneyString() {
		let moneyString = '';
		let money = 14922; //this.moneyCp;
		let gold = Math.floor(money/100);
		money -= gold*100;
		
		let silver = Math.floor(money/10);
		money -= silver*10;
		
		let copper = money;

		moneyString += gold + ' gp'
		moneyString += silver + ' sp'
		moneyString += copper + ' cp'
	}

	// example static method
	// call with Character.levelFromExp(exp)
	static levelFromExp(exp) {
		return levelFromExp(exp);
	}

	static fetchAllCharacters() {

	}

	// all other methods
	
	addExp(amount) {
		this.exp += amount;
		return this.exp;
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
		return levelFromExp(this.exp);
	}

	set playerId(){ //interrupt the setting of playerId
		throw 'cannot set playerId';
	}
}

function levelFromExp(exp){
	if (typeof exp != int)
		throw 'cannot find level from a non-integer amount of exp'
	else {
		 return levelThresholds.findIndex((element => element > exp)) + 1;
	}
}

module.exports = {
	charClass,
	charSubclass,
	Character
}
/*
so I am writing a discord bot which uses mongoDB as a database
I have a Player class for doing Player things (like add exp)
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

