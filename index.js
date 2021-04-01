const alfy = require('alfy');
const {readdir, untilde, run} = require('./utils');

function getBunchesFolder () {
	const cmd = '/usr/bin/defaults read $HOME/Library/Preferences/com.brettterpstra.Bunch.plist configDir';
	return run(cmd).then(untilde);
}

getBunchesFolder()
	.then(readdir)
	.then(res => {
		res = alfy.inputMatches(res, 'title');
		alfy.output(res);
	})
	.catch(() => {});
