"use strict";

// all functions and logic for instances of characters and about singleton characters

const util = require('../util/util.js');
const log = util.log;
const db = require('./db.js');
const mongoose = db.mongoose;
const greenCheck = '\x1b[32m ✓ \x1b[0m';

let specialItemSchema = new mongoose.Schema({
	specialItem: mongoose.ObjectId,
	nickName: String,
	durability: Number,
	tags: [Object],
	source: Object,
	location: Object
},
{ 
	timestamps: true,
	versionKey: 'version'
});

// static constructor method, does validation of specialItemObj,
//  if everything looks good then saves the character and passes it back
specialItemSchema.statics.newSpecialItem = function(specialItemObj) {
	return new Promise((resolve,reject) => {
		log('attempting to create new Special Item...',true)
		let newSpecialItemCheck = checkNewSpecialItem(specialItemObj);

		newSpecialItemCheck.then( (res) => {
			if(res) {
				log(` >> making new specialItem: '${specialItemObj.name}'`,true)
				let newSpecialItemObj = initializeFields(specialItemObj)
				let newSpecialItem = new SpecialItem(newSpecialItemObj)
				newSpecialItem.save().then(() => {
					SpecialItem.find({
						name: specialItemObj.name
					}).then( res => {
						log(`${greenCheck}new special item '${res[0].name}' successfully made`,true)
						resolve(newSpecialItem);
					});
				}).catch(err => {
					if(err) { 
						log(err,true)
						reject(err)
					}
				})
			}
		}).catch( err => {
			log('Error from checkSpecialItem:',true)
			log(err,true)
			reject(err)
		})
	})
}

specialItemSchema.virtual('specialItemString').get( function() {
	return `${this.nickname}, a trusty item of ${this.rarity} rarity that is as difficult to carry as ${this.cumberance} stones`
})

/* Methods */

specialItemSchema.methods.updateCumberance = async function(amount) {
	if (typeof amount != 'number') throw `SpecialItem.updateCumberance ERROR: ${amount} is not a number`
	this.cumberance = amount;
	return this.save();
}

// /* Statics */
// specialItemSchema.statics.listCharacters = function() {
// 	return new Promise((resolve,reject) => {
// 		Character.find().then(res => {
// 			let txt = `__**${res.length} character${res.length == 1 ? '' : 's'} currently initialized:**__\n`;
// 			res.forEach( character => {
// 				txt += character.fullName + '\n';
// 				log(character,true)
// 			})
// 			resolve(txt)
// 		}).catch( err => {
// 			log('error finding characters', true)
// 			reject(err);
// 		})
// 	})
// }

let SpecialItem = mongoose.model('SpecialItem', specialItemSchema)

/* Private Methods */

async function checkNewSpecialItem(specialItemObj){
	log('checking specialItem...',true)
	if(!(specialItemObj.firstName)) throw 'specialItem must have a name'
	
	// check to make sure that the specialItem has a unique name
	let charOK = true;

	if(specialItemObj.name.length < 3) {
		throw `the name "${specialItemObj.name.length}" is too short. Character names must be at least 3 characters.`
		return null
	}
	else if(specialItemObj.name.length >= 32) {
		throw `the name "${specialItemObj.name.length}" is too long. Character names cant be over 32 characters.`
		return null
	}
	else {
		log(`the name '${specialItemObj.name.length}' passes length requirements`)
	}

	let namePromise = SpecialItem.find({
		name: specialItemObj.name.length
	}).then( res => {
		log(`SpecialItem name search for ${specialItemObj.firstName} ${specialItemObj.lastName}:`,true)
		log(res,true);

		log(res.length + ' specialItem(s) found',true);
		if(res.length > 0) {
			log('rejecting...',true)
			charOK = false;
			throw 'SpecialItem with that name already exists';
		}
	}).catch( err => {
		if(err) {
			charOK = false;
			throw err; 
		}
	})

	await namePromise;

	if(charOK) {
		log('SpecialItem passes all checks',true)
		return true;
	}
}


function initializeFields(specialItemObj){
	log('initializeFields(specialItemObj):')
	log(specialItemObj)
	// let newSpecialItemObj = {
	// 	firstName: 	     typeof specialItemObj.firstName       == 'undefined' ? 'DEFAULT' : specialItemObj.firstName,
	// 	lastName:        typeof specialItemObj.lastName        == 'undefined' ? 'DEFAULT' : specialItemObj.lastName,
	// 	nickName:        typeof specialItemObj.nickName        == 'undefined' ? 'DEFAULT' : specialItemObj.nickName,
	// 	nameShort:       typeof specialItemObj.nameShort       == 'undefined' ? 'DEFAULT' : specialItemObj.nameShort,
	// 	experience:      typeof specialItemObj.experience      == 'undefined' ? 0 : specialItemObj.experience,
	// 	charRace:        typeof specialItemObj.charRace        == 'undefined' ? 'Waxoid' : specialItemObj.charRace,
	// 	charGender:      typeof specialItemObj.charGender      == 'undefined' ? 'agender' : specialItemObj.charGender,
	// 	charClass:       typeof specialItemObj.charClass       == 'undefined' ? 'Peasant' : specialItemObj.charClass,
	// 	charSubclass:    typeof specialItemObj.charSubclass    == 'undefined' ? 'Filthy' : specialItemObj.charSubclass,
	// 	currentActivity: typeof specialItemObj.currentActivity == 'undefined' ? 'Waiting' : specialItemObj.currentActivity,
	// 	moneyCp:         typeof specialItemObj.moneyCp         == 'undefined' ? 1000 : specialItemObj.moneyCp,
	// 	location:        typeof specialItemObj.location        == 'undefined' ? 'Foxbarrow Farms' : specialItemObj.location,
	// 	inventory:       typeof specialItemObj.inventory       == 'undefined' ? {} : specialItemObj.inventory,
	// 	hitDieCurrent:   typeof specialItemObj.hitDieCurrent   == 'undefined' ? 1 : specialItemObj.hitDieCurrent,
	// 	hpMax:           typeof specialItemObj.hpMax           == 'undefined' ? 5 : specialItemObj.hpMax,
	// 	hpCurrent:       typeof specialItemObj.hpCurrent       == 'undefined' ? 5 : specialItemObj.hpCurrent,
	// 	skills:          typeof specialItemObj.skills          == 'undefined' ? {} : specialItemObj.skills,
	// 	reputations:     typeof specialItemObj.reputations     == 'undefined' ? {} : specialItemObj.reputations,
	// 	conditions:		 typeof specialItemObj.conditions		== 'undefined' ? {} : specialItemObj.conditions,
	// 	userId:          specialItemObj.userId,
	// 	isDead:  	false,
	// 	isDeleted:	false
	// }
	return specialItemObj;
}
		
module.exports = Character
