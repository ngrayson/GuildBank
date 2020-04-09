"use strict";

// all functions and logic for instances of characters and about singleton characters

const util = require('../util/util.js');
const log = util.log;
const db = require('./db.js');
const mongoose = db.mongoose;
const greenCheck = '\x1b[32m ✓ \x1b[0m';

let baseItemSchema = new mongoose.Schema({
	name: String,
	rarity: Number,
	cumberance: Number,
	isDistinct: Boolean,
	tags: [Object],
	isCreated: Boolean,
	maxDurability: Number
},
{ 
	timestamps: true,
	versionKey: 'version'
});

// static constructor method, does validation of baseItemObj,
//  if everything looks good then saves the character and passes it back
baseItemSchema.statics.newBaseItem = function(baseItemObj) {
	return new Promise((resolve,reject) => {
		log('attempting to create new Base Item...',true)
		let newBaseItemCheck = checkNewBaseItem(baseItemObj);

		newBaseItemCheck.then( (res) => {
			if(res) {
				log(` >> making new baseItem: '${baseItemObj.name}'`,true)
				let newBaseItemObj = initializeFields(baseItemObj)
				let newBaseItem = new BaseItem(newBaseItemObj)
				newBaseItem.save().then(() => {
					BaseItem.find({
						name: baseItemObj.name
					}).then( res => {
						log(`${greenCheck}new base item '${res[0].name}' successfully made`,true)
						resolve(newBaseItem);
					});
				}).catch(err => {
					if(err) { 
						log(err,true)
						reject(err)
					}
				})
			}
		}).catch( err => {
			log('Error from checkBaseItem:',true)
			log(err,true)
			reject(err)
		})
	})
}

baseItemSchema.virtual('baseItemString').get( function() {
	return `${this.name}, a basic item of ${this.rarity} rarity that is as difficult to carry as ${this.cumberance} stones`
})

/* Methods */

baseItemSchema.methods.updateCumberance = async function(amount) {
	if (typeof amount != 'number') throw `BaseItem.updateCumberance ERROR: ${amount} is not a number`
	this.cumberance = amount;
	return this.save();
}

// /* Statics */
// baseItemSchema.statics.listCharacters = function() {
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

let BaseItem = mongoose.model('BaseItem', baseItemSchema)

/* Private Methods */

async function checkNewBaseItem(baseItemObj){
	log('checking baseItem...',true)
	if(!(baseItemObj.name)) throw 'baseItem must have a name'
	
	// check to make sure that the baseItem has a unique name
	let charOK = true;

	if(baseItemObj.name.length < 3) {
		throw `the name "${baseItemObj.name.length}" is too short. Character names must be at least 3 characters.`
		return null
	}
	else if(baseItemObj.name.length >= 32) {
		throw `the name "${baseItemObj.name.length}" is too long. Character names cant be over 32 characters.`
		return null
	}
	else {
		log(`the name '${baseItemObj.name.length}' passes length requirements`)
	}

	let namePromise = BaseItem.find({
		name: baseItemObj.name.length
	}).then( res => {
		log(`BaseItem name search for ${baseItemObj.firstName} ${baseItemObj.lastName}:`,true)
		log(res,true);

		log(res.length + ' baseItem(s) found',true);
		if(res.length > 0) {
			log('rejecting...',true)
			charOK = false;
			throw 'BaseItem with that name already exists';
		}
	}).catch( err => {
		if(err) {
			charOK = false;
			throw err; 
		}
	})

	await namePromise;

	if(charOK) {
		log('BaseItem passes all checks',true)
		return true;
	}
}


function initializeFields(baseItemObj){
	log('initializeFields(baseItemObj):')
	log(baseItemObj)
	// let newBaseItemObj = {
	// 	firstName: 	     typeof baseItemObj.firstName       == 'undefined' ? 'DEFAULT' : baseItemObj.firstName,
	// 	lastName:        typeof baseItemObj.lastName        == 'undefined' ? 'DEFAULT' : baseItemObj.lastName,
	// 	nickName:        typeof baseItemObj.nickName        == 'undefined' ? 'DEFAULT' : baseItemObj.nickName,
	// 	nameShort:       typeof baseItemObj.nameShort       == 'undefined' ? 'DEFAULT' : baseItemObj.nameShort,
	// 	experience:      typeof baseItemObj.experience      == 'undefined' ? 0 : baseItemObj.experience,
	// 	charRace:        typeof baseItemObj.charRace        == 'undefined' ? 'Waxoid' : baseItemObj.charRace,
	// 	charGender:      typeof baseItemObj.charGender      == 'undefined' ? 'agender' : baseItemObj.charGender,
	// 	charClass:       typeof baseItemObj.charClass       == 'undefined' ? 'Peasant' : baseItemObj.charClass,
	// 	charSubclass:    typeof baseItemObj.charSubclass    == 'undefined' ? 'Filthy' : baseItemObj.charSubclass,
	// 	currentActivity: typeof baseItemObj.currentActivity == 'undefined' ? 'Waiting' : baseItemObj.currentActivity,
	// 	moneyCp:         typeof baseItemObj.moneyCp         == 'undefined' ? 1000 : baseItemObj.moneyCp,
	// 	location:        typeof baseItemObj.location        == 'undefined' ? 'Foxbarrow Farms' : baseItemObj.location,
	// 	inventory:       typeof baseItemObj.inventory       == 'undefined' ? {} : baseItemObj.inventory,
	// 	hitDieCurrent:   typeof baseItemObj.hitDieCurrent   == 'undefined' ? 1 : baseItemObj.hitDieCurrent,
	// 	hpMax:           typeof baseItemObj.hpMax           == 'undefined' ? 5 : baseItemObj.hpMax,
	// 	hpCurrent:       typeof baseItemObj.hpCurrent       == 'undefined' ? 5 : baseItemObj.hpCurrent,
	// 	skills:          typeof baseItemObj.skills          == 'undefined' ? {} : baseItemObj.skills,
	// 	reputations:     typeof baseItemObj.reputations     == 'undefined' ? {} : baseItemObj.reputations,
	// 	conditions:		 typeof baseItemObj.conditions		== 'undefined' ? {} : baseItemObj.conditions,
	// 	userId:          baseItemObj.userId,
	// 	isDead:  	false,
	// 	isDeleted:	false
	// }
	return baseItemObj;
}
		
module.exports = BaseItem
