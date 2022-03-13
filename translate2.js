//@ts-check
//使用官方文本来翻译词条

const fs = require('fs');

const USE_FILES = fs.readdirSync('mix_translations').filter(x => x.toLowerCase().endsWith('name.json'));

/*
已知的不一致翻译：
eng=Lightning Spear, chn = 雷电枪(item_GoodsName.json),雷电矛(item_WeaponName.json)
eng=Cathedral of Dragon Communion, chn = 龙飨大教堂(item_NpcName.json),大龙飨教堂(item_PlaceName.json),大龙飨教堂(item_PlaceName.json)
eng=Old Altus Tunnel, chn = 亚坛古坑道(item_PlaceName.json),旧亚坛坑道(item_PlaceName.json)
eng=Capital Outskirts, chn = 王城外围(item_PlaceName.json),王城城墙外(item_PlaceName.json)
*/
const TRANS = open_translation_data();
const PATTERNS = [
	pattern1,
	pattern2,
	pattern3,
	pattern4,
	pattern5,
	pattern6,
	pattern7,
	pattern8
];
function main() {
	const english_words = JSON.parse(fs.readFileSync('english_data.json', { encoding: 'utf-8' })).map(x => x.name);
	const SPECIALS = {};
	const RESULT = {};
	const UNTRANSLATED = [];
	for (let word of english_words) {
		word = word.trim();
		if (TRANS[word]) {
			RESULT[word] = TRANS[word].value;
		}
		else {
			let found = false;
			for (const p of PATTERNS) {
				let ret = p(word);
				if (ret) {
					found = true;
					SPECIALS[word] = ret;
					RESULT[word] = ret;
				}
			}

			if (!found) {
				console.warn('not find word: ', JSON.stringify(word));
				UNTRANSLATED.push(word);
			}
		}
	}
	console.log('total untranslated = ', UNTRANSLATED.length);
	console.log('total translated = ', Object.keys(RESULT).length);
	fs.writeFileSync('output\\translateObject.json',JSON.stringify(RESULT),{encoding:'utf-8'});
}


function translate_except(word, except_p) {
	if (TRANS[word]) return TRANS[word].value;
	for (const pp of PATTERNS) {
		if (pp !== except_p) {
			let ret = pp(word);
			if (ret) return ret;
		}
	}
}

function try_map(x) {
	if (TRANS[x]) return TRANS[x].value;
}


function pattern1(word) {
	const res = [
		/^(.+) \([0-9]+\)$/,//XXXX (1)
		/^(.+) \([A-Z]\)$/,//XXXX (A)
		/^(.+) *\([0-9]+\) [A-Z]$/,//XXXX (1) A
		/^(.+) [A-Z]$/,//XXXX A
		/^(.+) [a-z]$/,//XXXX a
	];
	for (let re of res) {
		const m = re.exec(word);
		if (m && m[1] && TRANS[m[1]]) {
			return word.replace(m[1], TRANS[m[1]].value);
		}
	}
	return null;
}

function pattern2(word) {
	//Somber Smithing Stone (2) 转换成 Somber Smithing Stone [2] 然后尝试所有的pattern
	//因为地图上用错符号了
	let has_replaced = false;
	const w2 = word.replace(/\(([0-9]+)\)/, function (m, p1) {
		if (p1) {
			has_replaced = true;
			return `[${p1}]`;
		}
		return m;
	});


	//if (word.indexOf('Grave Glovewort') >= 0) {
	//	console.log('try pattern2:', w2);
	//}

	if (w2 !== word && has_replaced) {

		if (TRANS[w2]) return TRANS[w2].value;
		for (const p of PATTERNS) {
			if (p !== pattern2) {
				let ret = p(w2);
				if (ret) return ret;
			}
		}
		//console.warn('WILL TRY and not find:', JSON.stringify(w2));
	}
}

function pattern3(word) {
	// xxxxx (xxxxx)
	const m = /^(.+) \((.+)\)$/.exec(word);
	if (m && m[1] && m[2]) {
		if (TRANS[m[1]] && TRANS[m[2]]) {
			return `${TRANS[m[1]].value} (${TRANS[m[2]].value})`;
		}
	}
}

function pattern4(word) {
	// x3 之类开头的
	let m = /^(x[0-9] )|^([0-9]x )/.exec(word);
	if (m) {
		const w = word.substr(m[0].length);
		let ret = translate_except(w, pattern4);
		if (ret) {
			let ret2 = `${m[0]} ${ret}`;
			//console.log(`pattern4: ${word} -> ${ret2}`);
			return ret2;
		}
		else {
			console.log('not find pattern4: ', word);
		}
	}

	//x4结尾
	let m2 = / x[1-9]$/.exec(word);
	if (m2) {
		const w = word.substr(0, word.length - m2[0].length);
		let ret = translate_except(w, pattern4);
		if (ret) {
			let ret2 = `${ret} ${m2[0]}`;
			return ret2;
		}
	}
}

function pattern5(word) {
	const S = 'Waygate to ';
	if (word.startsWith(S)) {
		const w2 = word.substr(S.length);
		const ret = translate_except(w2, pattern5);
		if (ret) {
			return `通往"${ret}"的道路`;
		}
	}
}

function pattern6(word) {
	// xxx - xxx
	let m = /^(.+) - (.+)$/.exec(word);
	if (m) {
		const t1 = try_map(m[1])
		const t2 = try_map(m[2])
		if (t1 && t2) return `${t1} - ${t2}`;
	}

	// xxx - x1 - xxx
	m = null;
	m = m || /^(.+) - (x[1-9]) - (.+)$/i.exec(word);
	m = m || /^(.+) - ([1-9]x) - (.+)$/i.exec(word);
	if (m) {
		const t1 = try_map(m[1]);
		const t2 = try_map(m[3]);//'Cave of The Forlorn','Cave of the Forlorn'
		if (t1 && t2) return `${t1} - ${m[2]} - ${t2}`;
	}

	// xxx A - x1 - xxx
	m = null;
	m = m || /^(.+) ([A-Z]) - (x[1-9]{1,2}) - (.+)$/i.exec(word);
	m = m || /^(.+) ([A-Z]) - ([1-9]{1,2}x) - (.+)$/i.exec(word);
	if (m) {
		const t1 = try_map(m[1]);
		const t2 = try_map(m[4]);
		if (t1 && t2) return `${t1} ${m[2]} - ${m[3]} - ${t2}`;
	}

	// xxx - x1 xxxx
	m = null;
	m = m || /^(.+) - +(x[1-9]) \(?(.+)\)?$/i.exec(word);
	m = m || /^(.+) - +([1-9]x) \(?(.+)\)?$/i.exec(word);
	if (m) {
		const t1 = try_map(m[1]);
		const t2 = try_map(m[3]);
		if (t1 && t2) return `${t1} - ${m[2]} - ${t2}`;
	}

	// xxx x1 - xxxx
	m = null;
	m = m || /^(.+) (x[1-9]) - (.+)$/i.exec(word);
	m = m || /^(.+) ([1-9]x) - (.+)$/i.exec(word);
	if (m) {
		const t1 = try_map(m[1]);
		const t2 = try_map(m[3]);
		if (t1 && t2) return `${t1} - ${m[2]} - ${t2}`;
	}
}

function pattern7(word) {
	//各种套装
	if (word.endsWith(' Set')) {
		//xxx套装
		let name = word.substr(0, word.length - 4);
		const armor = name + ' Armor'
		if (TRANS[armor] && TRANS[armor].value.endsWith('铠甲')) {
			const v = TRANS[armor].value;
			return v.substr(0, v.length - 2) + '套装';
		}
		const golves = name + ' Gloves';
		if (TRANS[golves] && TRANS[golves].value.endsWith('手套')) {
			const v = TRANS[golves].value;
			return v.substr(0, v.length - 2) + '套装';
		}

		const robe = name + ' Robe';
		if (TRANS[robe] && TRANS[robe].value.endsWith('长袍')) {
			const v = TRANS[robe].value;
			return v.substr(0, v.length - 2) + '套装';
		}

	}
}

function pattern8(word) {
	//地图碎片
	if (word.startsWith('Map ')) {
		let w = word.substr(4);
		w = w.replace('(', '').replace(')', '');
		w = 'Map: ' + w;
		if (TRANS[w]) return TRANS[w];
	}
}

function open_translation_data() {
	let result = {};
	for (let f of USE_FILES) {
		let arr = JSON.parse(fs.readFileSync(`mix_translations\\${f}`, { encoding: 'utf-8' }));
		for (const { eng, chn } of arr) {
			if (result[eng]) {
				const item = result[eng];
				if (item.value !== chn) {
					item.others = item.others || [];
					item.others.push({ value: chn, file: f });
				}
			}
			else {
				result[eng] = {
					value: chn,
					file: f,
				};
			}
		}
	}


	for (let key in result) {
		if (result[key].others) {
			//console.log(`DUPLICATE: eng=${key}, chn = ${[result[key], ...result[key].others].map(x => `${x.value}(${x.file})`).join(',')}`)
		}
	}
	//patchs
	const MyPatchs = {
		'Sites of Grace': '赐福',
		'Site of Grace': '赐福',
		'First Location': '第一处位置',
		'Second Location': '第二处位置',
		'Third Location': '第三处位置',
		'Fourth Location': '第四处位置',
		'Fifth Location': '第五处位置',
		'Sixth Location': '第六处位置',
		'1st Location': '第一处位置',
		'2nd Location': '第二处位置',
		'1st location': '第一处位置',
		'2nd location': '第二处位置',
		'Abductor Virgins': '掳人少女人偶',
		'Bloody Finger Hunter Yura': '“血指猎人”尤拉',
		'Spell': '魔法',
		//'Zamor Set': '萨米尔套装',
		'White-Faced Varre': '“白面具”梵雷',
		'Yelough Anix Tunnel Site of Grace': '耶罗·亚尼斯坑道(赐福)', // 源文本是错误的
		'Walking Mausoleum': '漫步灵庙',//没有单独的词条
		'Church of Irith Graveyard': '伊利斯教堂的墓地',//只有：Church of Irith
		'Thops': '托普斯',                              //没有单独的词条
		'Thops (Deceased)': '托普斯(死亡)',
		//'White Reed': '待殓套装',
		'Traveler Set': '旅行套装',//装备名都是 Traveler's xxx
		'Rya': '“招募者”菈雅',//全称是：Rya the Scout,
		'Iron Fist Alexander': '“铁拳”亚历山大',
		'Raya Lucaria Crystal Tunnels': '雷亚卢卡利亚结晶坑道',//多了个s
		'Blaidd': '布莱泽',
		'Goldmask': '金面具',
		'MORNE TUNNEL': '摩恩坑道',//大小写问题
		'Leyndell Royal Capital': '王城罗德尔',//"Leyndell, Royal Capital",
		'CASTLE MORNE': '摩恩城',
		'Caelid Treasure': '盖利德宝箱',
		"Guardian's Garrison": '监视者要塞',//should be : Guardians' Garrison
		'Sanguine Set': '鲜血贵族套装',//写错了，Sanguine Noble XXX
		'Albus': '艾尔帕斯',//should be: Old Albus
		'Ancient Dragon Knight Kristoff Ashes': '“古龙骑士”克里斯托福骨灰',// no "Ashes"
		'Consecrated Snowfield Boss Drop': '化圣雪原BOSS掉落',
		'Hyetta': '海胆',
		"Lenne's Rise.": '雷恩魔法师塔',//
		'Spectral': '幻影',
		'Cave of The Forlorn': '安身洞窟',//the => The
		'Cave of Forlorn': '安身洞窟',
		'Dragonbarrow': '龙墓',
		'Liurnia Northeast': '利耶尼亚(东北)',
		'Liurnia Southwest': '利耶尼亚(西南)',
		'Mountaintops East': '山顶(东)',
		'Misericorde': '慈悲短剑'

	};
	for (let key in MyPatchs) {
		result[key] = { value: MyPatchs[key], file: 'patch' };
	}
	return result;
}


main();