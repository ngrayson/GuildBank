const BAR_WIDTH = 50;

const BAR_PLUS   = '\x1b[36m' + '+'.repeat(BAR_WIDTH) + '\x1b[0m';
const BAR_SINGLE = '\x1b[36m' + '-'.repeat(BAR_WIDTH) + '\x1b[0m';
const BAR_DOUBLE = '\x1b[36m' + '='.repeat(BAR_WIDTH) + '\x1b[0m';

function log(str,logToCLI) {
	// write to file
	// write to verbose log channel in admin server
	if(logToCLI){
		console.log(str);
		// write to nonverbose log channel in admin server
	}
}

function logBar(style, logToCLI) {
	let str
	switch (style) {
		case 0:
			str = BAR_PLUS;
			break;
		case 1:
			str = BAR_SINGLE;
			break;
		case 2:
			str = BAR_DOUBLE;
			break;
		default:
			str = BAR_PLUS;
			break;
	}

	// write to file
	// write to log channel in admin server
	if(logToCLI) console.log(str);
}

module.exports = {
	log,
	logBar
}