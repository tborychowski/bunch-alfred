const alfy = require('alfy');
const {readdir, untilde, run} = require('./utils');

function getBunchesFolder () {
	const beta = process.env.beta === 'true' ? 'Beta' : '';
	const cmd = '/usr/bin/defaults read ' +
		`$HOME/Library/Preferences/com.brettterpstra.Bunch${beta}.plist ` +
		'configDir';
	return run(cmd).then(untilde);
}

function print (items) {
	if (!items || !items.length) return;
	// items = alfy.inputMatches(items, 'title'); // for speed, matching is done in alfred
	alfy.output(items);
}

function refresh () {
	getBunchesFolder()
		.then(readdir)
		.then(res => {
			alfy.cache.set('bunches', res, { maxAge: 10000 });
			print(res);
		})
		.catch(() => {});
}


const bunches = alfy.cache.get('bunches');
if (bunches && bunches.length) print(bunches);
else refresh();
