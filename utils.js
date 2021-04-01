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

// ---
// title: TITLE
// ---
function getTitleFromFile (file) {
	const r = new RegExp('(---\n)(.*)(\n---\n)', 'g');
	return fs
		.readFile(file, 'UTF-8')
		.then(res => {
			let [,,title] = r.exec(res);
			if (title) title = title.replace(/title:/, '').trim();
			return title;
		});
}

function improveTitle (item) {
	return getTitleFromFile(item.subtitle).then(res => {
		if (res) item.title = res;
		return item;
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
					const subtitle = path.join(dir, f);
					const title = name.replace(/-/g, ' ');
					return { title, subtitle, arg: `x-bunch://${name}` };
				});
		})
		.then(res => Promise.all(res.map(improveTitle)));
}


function untilde (dir) {
	return dir.trim().replace('~', os.homedir);
}

module.exports = {
	readdir,
	run,
	untilde,
};
