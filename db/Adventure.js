"use strict";

const util = require('../util/util.js');
const log = util.log;
const db = require('./db.js');
const mongoose = db.mongoose;
const greenCheck = '\x1b[32m ✓ \x1b[0m';

let adventureSchema = new mongoose.Schema({
    options: Boolean
},
{
    timestamps: true,
    versionKey: 'version'
})

adventureSchema.statics.test = async function(adventureObj) {

}

adventureSchema.statics.newAdventure = function(adventureObj) {

}

let Adventure = mongoose.model('Adventure', adventureSchema)

module.exports = Adventure