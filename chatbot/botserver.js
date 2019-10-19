function message(msg) {
	console.log('recieved message:\n  ' + msg);
}

function rootMessage(msg) {
	if(typeof msg != 'string')
		throw 'a root message was passed that wasn\'t a string but was of type '+ typeof msg+', are you sure you meant to use rootMessage for this?'
	console.log('rootmessage')
	console.log(msg);
}

module.exports = {
	message,
	rootMessage
}
