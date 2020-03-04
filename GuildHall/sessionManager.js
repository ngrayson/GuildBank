Session = require('../db/Session.js');
User = require(`../db/User.js`)

async function newSession (dmId, date) {
    let dmUserObj = await User.fromDiscordId(dmId);
    if (typeof date != "Date") throw `new session needs a Date, not a ${typeof date}`
    let newSession = Session.newSession({
        dmId: dmUserObj._id,
        date: date
    })
    return newSession;
}

// looks at all sessions in DB and syncs them to the calendar
function syncCalToDb(){

}
module.exports = {
    newSession
};