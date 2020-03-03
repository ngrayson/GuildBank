"use strict";

const util = require('../util/util.js');
const log = util.log;
const db = require('./db.js');
const mongoose = db.mongoose;
const greenCheck = '\x1b[32m ✓ \x1b[0m';
const calendarApi = require('../google/calAPI.js')

let adventureSchema = new mongoose.Schema({
    options: Boolean
},
{
    timestamps: true,
    versionKey: 'version'
})

adventureSchema.statics.test = async function(adventureObj) {
    try {
        let calendar = await calendarApi();
        calendar.events.list({
            maxAttendees: 8,
            maxResults: 10,
            orderBy: 'date',
            singleEvents:true
        }).then( res => {
            log(res,true)
        })
    }
    catch(e) {
        log(e,true)
    }
}

adventureSchema.statics.newAdventure = function(adventureObj) {

}

let Adventure = mongoose.model('Adventure', adventureSchema)

module.exports = Adventure