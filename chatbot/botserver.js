const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.DBOT_TOKEN;

client.on('ready', () => {
	console.log('\x1b[32m%s\x1b[0m%s\x1b[7m%s\x1b[0m',
		' ✓',' Discord Bot logged in under ', client.user.tag
		);
});

client.login(token)
  .then(console.log('  Discord client logging in...'))
  .catch(console.error);
