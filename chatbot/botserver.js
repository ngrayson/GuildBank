function message(msg) {
	console.log('recieved message:\n  ' + msg);
}

function rootMessage(msg) {
	if(typeof rootMessage != String)
		throw 'a root message was passed that wasn\'t a string, are you sure you meant to use rootMessage for this?'
	console.log(rootMessage);
}

module.exports = {
	message,
	rootMessage
}
