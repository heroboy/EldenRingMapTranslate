//@ts-check
//translations里的翻译合并到一个文件，方便中英文对照
const fs = require('fs');

function main() {
	try { fs.mkdirSync('mix_translations'); } catch (e) { }

	const files = [];
	for (var x of fs.readdirSync('translations')) {
		let m = /(.*)\.eng\.json/.exec(x);
		if (m) {
			if (files.indexOf(m[1])) files.push(m[1]);
		}
	}
	for (const file of files) {
		if (file === 'ngword_GR_NGWord') continue;
		let english_file = JSON.parse(fs.readFileSync(`translations\\${file}.eng.json`, { encoding: 'utf-8' }));
		let chinese_file = JSON.parse(fs.readFileSync(`translations\\${file}.chn.json`, { encoding: 'utf-8' }));

		let touched = new Set();
		let result = [];
		for (let item of english_file) {
			let item2 = chinese_file.find(x => x.Id == item.Id);
			if (!item2) {
				console.warn(`[${file}]Not translate: id=${item.Id}, text = "${shorten(item.Value)}"`);
				continue;
			}

			result.push({
				id: item.Id,
				eng: item.Value,
				chn: item2.Value,
			});
			touched.add(item2);
		}
		for (let item of chinese_file) {
			if (!touched.has(item)) {
				console.warn(`[${file}]Not translate(chn): id=${item.Id}, text = "${shorten(item.Value)}"`);
			}
		}
		const text = JSON.stringify(result, null, '\t');
		fs.writeFileSync(`mix_translations\\${file}.json`, text, { encoding: 'utf-8' });
	}
}

function shorten(s) {
	if (s.length < 40 && s.indexOf('\n') < 0) return s;
	s = s.substr(0, 40);
	s = s.replace(/\n/g, '');
	return s;
}

main();