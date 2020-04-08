"use strict";

const util = require('../util/util.js');
const log = util.log;
const db = require('./db.js');
const mongoose = db.mongoose;
const greenCheck = '\x1b[32m ✓ \x1b[0m';

let sessionSchema = new mongoose.Schema({
    date: Date,
    characterIds: [mongoose.SchemaTypes.ObjectId],
    dmIds: [mongoose.SchemaTypes.ObjectId],
    Adventure: {
        sessionName: String,
        startingTown: String,
        endingTown: String
    },
    playLocation: String,
    maxPlayers: Number,
    recappingUserId: mongoose.SchemaTypes.ObjectId, 
    status: String
},
{
    timestamps: true,
    versionKey: 'version'
})

sessionSchema.statics.newSession = function(sessionObj) {
    return new Promise((resolve,reject) => {
        log('Session.newSession: attempting to create new Character...', true)
        let newSessionCheck = checkNewSession(sessionObj);

        newSessionCheck.then((res) => {
            if(res) {
                log(` >> making new session '${newSessionCheck.sessionName}'`,true)
                let newSessionObj = initializeFields(sessionObj)
                let newSession = new Session(newSessionObj)
                newSession.save().then(() => {
                    Session.find({
                        
                    }).then( res => {
                        log(`Session.newSession: ${greenCheck}new session successfully created`,true)
                    })
                }).catch( e => {
                    log('Session.newSession: ERROR Saving Session:',true)
                    log(e,true)
                    reject(e)
                })
            }
        }).catch( e => {
            log(`Session.newSession: Error from checkCharacter`,true)
            log(e,true)
            reject(e)
        })
    })
}

async function checkNewSession(sessionObj) {
    return true;
}

function initializeFields(sessionObj) {
    return sessionObj;
}

let Session = mongoose.model('Session', sessionSchema)

module.exports = Session