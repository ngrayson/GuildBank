"use strict";

// all functions and logic for instances of characters and about singleton characters

const util = require('../util/util.js');
const log = util.log;
const db = require('./db.js');
const mongoose = db.mongoose;
const Schema = mongoose.Schema;
const ROLE_LIST = ['Admin', 'DM']

/* Schema */
const schemaOptions = {
  toJSON: { virtuals: true },
  timestamps: true,
  versionKey: 'version'
};

const userSchema = new Schema({
  connections: {
    discord: {
    	discord_id: String,
    	discord_handle: String
    },
    google: String
  },
  isDeleted: Boolean,
  last_seen: Date,
  email: String,
  handle: String,
  is_active_player: Boolean,
  defaultCharacter: mongoose.ObjectId,
  name: {
    first: String,
    last: String
  },
  current_system: String,
  scopes: []
}, schemaOptions);

/* Virtuals */



// Concat user's first + last name
userSchema.virtual('fullName').get( function() {
  return this.name.first + ' ' + this.name.last;
});
 
// Return true if user is admin
userSchema.virtual('isAdmin').get( function() {
  let isAdmin = false;
  // If user is Logan, admin is true
  // !TODO Don't do this LOL
  if ( this.connections.discord && this.connections.discord === '153983024411836416' ) {
    isAdmin = true;
  }
  // find admin scope
  let foundAdmin = this.scopes.find( scope => {
    return scope === 'Admin'
  });
  // If admin found within scopes, admin is true
  if (foundAdmin) isAdmin = true;
  return isAdmin;
});
 
// Return true if user is Dm
userSchema.virtual('isDm').get( function() {
  let isDm = false;
  // If user is Logan, Dm is true
  // !TODO Don't do this LOL
  if ( this.connections.discord && this.connections.discord === '153983024411836416' ) {
    isDm = true;
  }
  // find Dm scope
  let foundDm = this.scopes.find( scope => {
    return scope === 'Dm'
  });
  // If Dm found within scopes, Dm is true
  if (foundDm) isDm = true;
  return isDm;
});

userSchema.virtual('isPlayer').get( function() {
  if(this.is_active_player) return true
  else return false
})


// returns true or false based on basic validation critera. players need to provide their name, etc.
userSchema.virtual('isSetup').get( function() {
  return true;
});

userSchema.virtual('numCharacters').get( function() {
  return true;
});
 
/* Static Methods */
userSchema.statics.listUsers = function() {
	return new Promise((resolve,reject) => {
		User.find().then(res => {
			let txt = `__**${res.length} user${res.length == 1 ? '' : 's'} currently initialized:**__\n`;
      let index = 1;
      res.forEach( user => {
        txt += index + '. ' +
        (user.handle ? user.handle : user.connections.discord.discord_handle) + '\n';
        index++;
      })
			resolve(txt)
		}).catch( err => {
			log('error finding users', true)
			reject(err);
		})
	})
}

userSchema.statics.fromDiscordId = async function(discord_id){
  return (await User.find({'connections.discord.discord_id': discord_id }))[0]
}

userSchema.statics.fromUserId = function(mongooseId){
  return User.findById(mongooseId);
}

/* Methods */
 
userSchema.methods.setMain = function(character){
  if(character.constructor.collection.name != 'characters')
  throw 'setMain requires an object of class Character!'
  let charUId = character.userId.toString();
  let userId = this._id.toString();
  log(`User.setMain:\nuserUserId: ${userId } type ${typeof userId }\n`
                    +`charUserId: ${charUId} type ${typeof charUId}`)
  log(`They are ${charUId == userId? 'identical':'different'}.`)
  log(`User.setmain: setting ${character.fullName} as default for ${User.handle}`,true)
  if(charUId == userId) {
    this.defaultCharacter = character._id;
    log(`default character is now ${this.defaultCharacter}`,true)
    return this.save();
  }
  else throw `cannot set a character not belongning to this user as his main`
}

userSchema.methods.grantRole = function(role){
  if(typeof role != 'string') throw 'User.grantRole Error: role must be a string, not ' + typeof role;
  if(!ROLE_LIST.includes(role)) throw `User.grantRole Error: '${role}' is not a valid role`;
  return new Promise((resolve,reject) => {
    if(!this.scopes.includes(role)) {
      this.scopes.push(role)
      this.save();
      resolve(this)
      log(this,true)
    }
    else{
      let txt = `grantAdmin Warning: ${this.handle} was already an admin`;
      log(txt,true)
      reject(txt)
    }
  })
}
 
userSchema.methods.removeRole = function(role){
  if(typeof role != 'string') throw 'User.grantRole Error: role must be a string, not ' + typeof role;
  if(!ROLE_LIST.includes(role)) throw `User.grantRole Error: '${role}' is not a valid role`;
  return new Promise((resolve,reject) => {
    let adminIndex = this.scopes.findIndex((element) => {
      return element == role
    })
    if(adminIndex != -1) {
      this.scopes.splice(adminIndex,1)
      this.save()
      resolve(this)
    }
    else{
      let txt = `removeAdmin Warning: ${this.handle} was not an admin to begin with`;
      log(txt,true)
      reject(txt)
    }
  })
}
 
/* Compile Model */
let User = mongoose.model('User', userSchema);
 
/* Public */
 
/* Private */
function _loginUserSync(user) {
  user.last_seen = Date.now();
  user.save();
}
 
/* Exports */
module.exports = User









 
/*
 * Create or Find
 * @param {object} profile The profile object from Passport Oauth
 */
function findOrCreate(profile) {
  return new Promise( (resolve, reject) => {
    let user = undefined;
    let provider = profile.provider;
    let date = Date.now();
    let newUser = new User({
      created_at: date
    });
 
    // Oauth provider details
    switch(provider) {
      case 'discord':
        newUser.connections.discord = profile.id;
 
        newUser.email = profile.email;
        newUser.handle = profile.username;
        User.find( { "connections.discord": profile.id } , ( err, docs ) => {
          // If user doesn't exist
          if(!docs || docs.length == 0) {
            newUser
              .save()
              .then( () => {
                console.log('New user: ' + newUser.email);
              });
            user = newUser;
          }
          // Else if user does exist
          else {
            console.log('User logged in: ' + newUser.email);
            user = docs[0];
            _loginUserSync(user);
          }
        })
        .then( () => {
          resolve(user);
        })
        .catch( (err) => {
          reject(err);
        });
        break;
      case 'google':
        newUser.connections.google = profile.id;
        newUser.email = profile.emails[0].value;
        newUser.handle = profile.displayName;
        newUser.name.first = profile.name.givenName;
        newUser.name.last = profile.name.familyName;
        User.find( { "connections.google": profile.id } , ( err, docs ) => {
          // If user doesn't exist
          if(!docs || docs.length == 0) {
            newUser
              .save()
              .then( () => {
                console.log('New user: ' + newUser.email);
              });
            user = newUser;
          }
          // Else if user does exist
          else {
            // TODO if new provider but same email, add new connection info
            console.log('User logged in: ' + newUser.email);
            user = docs[0];
            _loginUserSync(user);
          }
        })
        .then( () => {
          resolve(user);
        })
        .catch( (err) => {
          reject(err);
        });
        break;
      default:
    }
 
  });
}
