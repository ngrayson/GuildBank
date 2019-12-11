// avatar.js
module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("generating server icon...")

	if(!message.guild.iconURL) return msg.edit('This server has no icon')

	await message.channel.send({files: [
		{
			attachment: message.author.guild.iconURL,
			name: "icon.png"
		}
	]})

	msg.delete();
}

module.exports.help = {
	name: 'icon'
}

module.exports.permissions = {
	admin: true,
	dm: true,
	player: true
}