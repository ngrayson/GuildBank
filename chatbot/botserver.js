const Discord = require('discord.js');
const client = new Discord.Client();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const token = process.env.DBOT_TOKEN;
console.log('\ntoken: \n '+token)

// client.on('ready', () => {
// 	console.log('Discord Bot logged in as ' + client.user.tag +'!');
// });

client.on('error', console.error);

client.login(token).then(result => {
	console.log(result);
}, err => {
	console.log(err)
});