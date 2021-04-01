const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const os = require('os');

function run (cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (err, stdout, stderr) => {
			if (err) return reject(err);
			resolve(stdout || stderr);
		});
	});
}


function readdir (dir) {
	return fs
		.readdir(dir)
		.then(res => {
			return res
				.filter(f => path.extname(f) === '.bunch')
				.map(f => {
					const name = path.basename(f, '.bunch');
					return {
						title: name.replace(/-/g, ' '),
						arg: `x-bunch://${name}`,
						subtitle: path.join(dir, f)
					};
				});
		});
}

function untilde (dir) {
	return dir.trim().replace('~', os.homedir);
}

module.exports = {
	path,
	readdir,
	run,
	untilde,
};
