const Character = require('../db/Character.js');
const User = require('../db/User.js');
const log = require('../util/util.js').log;

async function userStatsBlurb(user){
  let txt = "";
  let handle = user.handle;
  let resonite = 0;
  let numCharacters = 0; // querey all characters by user's mongooseID
  let character = 0; // primary character
  let adventures = 0; // querey all adventures including user's mongooseID
  // get character
  txt += `__**stats for ${handle}**__\n`;
  txt += "```ml\n"
  txt += `${resonite} Resonite\n`;
  txt += `${numCharacters} Characters\n`;
  txt += `default character: {character.name}\n`;
  txt += `> lvl {character.level} {character.race} {character.subclass} {character.class}\n`;
  txt += `> {character.xpToLevel} xp until lvl {character.level+1}\n`;
  txt += `> HP: {character.currentHp}/{character.maxHp}\n`;
  txt += `> Hit Dice: {character.hitDiceCurrent}/{character.hitDiceMax}\n`;
  txt += `> Currently {character.activity} in {character.location}\n`;
  txt += `> {character.moneyToString}\n`;
  txt += `> Conditions:\n`;
  txt += `> {character.conditions}\n`;
  txt += `Adventures: - planned\n`;
  txt += `> Next Adventure: adventure.name\n`;
  txt += `> {adventure.date}, {adventure.time}, {adventure.location}\n`;
  txt += '```'
  // stats for: player name
  // 45623 Resonite
  // Characters: n active/m total
  // default character: char name
  // > lvl 4 Gnomish Ice Wizard
  // > (300 xp till lvl 5)
  // > HP: 43/56
  // > Hit Dice: 3/4
  // > Currently fishing in Foxbarrow (Autumnshade Pinensula)
  // > 231 gp 9 sp 3 cp
  // > Conditions:
  // >  - Swamp Sickness
  // >  - Broken Toenail
  // Adventures: 3 planned
  // > Next Adventure: Bullywug Breakout
  // > 4/13/2020, 6pm, @Warchief
  return txt;
}

module.exports = {
    userStatsBlurb
}