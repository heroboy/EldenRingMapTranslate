const fs = require('fs');
const undici = require('undici');
const PATCH = require('./patch').patch;
const CHINESE_DATA_URL = 'https://project-test.gamersky.com/Gamersky.InteractiveMap/InteractiveMap/GetAllMarker';
const CATEGORY_MAP_E2C = {
	'Materials': '制作材料',
	'Consumables': '道具',
	'Upgrade Materials': '强化用材料',
	'Site of Grace': '赐福',
	'Locations': '地点',
	'Key': '贵重物品',
	'Bosses': 'BOSS',
	'Spells': '法术',
	'Spirit Ashes': '骨灰',
	'NPC': 'NPC',
	'NPC Invader': '入侵的NPC',
	'Weapons': '武器',
	'Talismans': '护符',
	'Ashes of War': '战灰',
	'Shields': '盾牌',
	'Armor': '防具',
	'Flask Upgrades': '圣杯瓶强化道具',
	'Waygates': '传送门',
	'Maps': '地图碎片'
};
async function fetchChineseData()
{
	let resp = await undici.fetch(CHINESE_DATA_URL, { method: 'POST' });
	return await resp.json();
}

async function main()
{
	try
	{
		fs.mkdirSync('output');
	}
	catch (e)
	{

	}

	let english_data = JSON.parse(fs.readFileSync('english_data.json', { encoding: 'utf-8' }));
	fs.writeFileSync('output\\english_data.json', JSON.stringify(english_data, null, '\t'), { encoding: 'utf-8' });
	let raw_chinese_data = await fetchChineseData();
	fs.writeFileSync('output\\chinese_data.json', JSON.stringify(raw_chinese_data, null, '    '), { encoding: 'utf-8' });
	let chinese_data = raw_chinese_data.mapMarkers;
	function findNearItems(obj)
	{
		const dist = (obj, o) => (Math.pow(+obj.x - +o.x, 2) + Math.pow(+obj.y - +o.y, 2));
		const arr = chinese_data.filter(o =>
		{
			return Math.abs(+obj.x - +o.x) < 2 &&
				Math.abs(+obj.y - +o.y) < 2;
		});
		arr.sort((a, b) =>
		{
			let d1 = dist(obj, a);
			let d2 = dist(obj, b);
			return d1 - d2;
		});
		return arr;
	}
	function findChineseItem(obj)
	{
		let arr = chinese_data.filter(o =>
		{
			return Math.abs(+obj.x - +o.x) < 0.001 &&
				Math.abs(+obj.y - +o.y) < 0.001;
		});

		if (arr.length === 1)
		{
			if (CATEGORY_MAP_E2C[obj.category] !== arr[0].category)
			{
				let co = arr[0];
				console.warn(`类型不同：english={name: ${obj.name}, category=${obj.category}}, chinese={name: ${co.name}, category=${co.category}}`);
			}
		}
		else if (arr.length > 0)
		{
			const arr2 = arr.filter(co => CATEGORY_MAP_E2C[obj.category] === co.category);
			if (arr2.length === 0)
			{
				console.warn(`限制类型后，数量变成0了：english={name: ${obj.name}, category=${obj.category}}`);
			}
		}

		return arr;
	}
	function isAllSameName(arr)
	{
		return arr.every(x => x.name === arr[0].name);
	}
	let found = 0, notfound = 0;
	//const catalog = {};
	const translateObject = {};
	const result_meta = {
		notFoundItems: [],
		multiFoundItems: [],
		unusedChineseItems: [],
	};
	const usedChineseItems = new Set();
	for (let obj of english_data)
	{
		let cdata = findChineseItem(obj);
		if (cdata.length === 0)
		{
			if (PATCH[obj.name])
			{
				++found;
				translateObject[obj.name] = PATCH[obj.name].name;
			}
			else
			{
				++notfound;
				result_meta.notFoundItems.push({
					name: obj.name,
					category: obj.category,
					description: obj.description,
					nearItems: findNearItems(obj).map(x => ({ name: x.name, category: x.category, description: x.description })),
				});
			}

		}
		else if (cdata.length > 1)
		{
			if (isAllSameName(cdata))
			{
				//catalog[obj.category] = cdata[0].category;
				++found;
				translateObject[obj.name] = cdata[0].name;
			}
			else
			{
				result_meta.multiFoundItems.push({
					name: obj.name,
					chinese_items: [...cdata],
				});
			}
			for (const c of cdata)
			{
				usedChineseItems.add(c);
			}
		}
		else
		{
			//catalog[obj.category] = cdata[0].category;
			++found;
			translateObject[obj.name] = cdata[0].name;
			usedChineseItems.add(cdata[0]);
		}
	}

	for (const c of chinese_data)
	{
		if (!usedChineseItems.has(c))
			result_meta.unusedChineseItems.push(c);
	}

	fs.writeFileSync('output\\translateObject.json', JSON.stringify(translateObject), { encoding: 'utf-8' });
	fs.writeFileSync('output\\translateMeta.json', JSON.stringify(result_meta, null, '    '), { encoding: 'utf-8' });


	console.log(`found=${found}，notfound=${notfound}, englishdata=${english_data.length}, chinesedata=${chinese_data.length}`);
	//console.log(catalog);
}

main().catch(console.error);


