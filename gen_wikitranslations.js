const fs = require('fs');

const FILES = [
	'item_WeaponName.json',
	'item_PlaceName.json',
	'item_NpcName.json',
	'item_GoodsName.json',
	'item_ProtectorName.json',
	'item_GemName.json',
	'item_ArtsName.json',
	'item_AccessoryName.json',
];

function main() {
	const RESULT = {};
	for (const f of FILES) {
		let arr = JSON.parse(fs.readFileSync(`mix_translations/${f}`, { encoding: 'utf8' }));
		for (const { eng, chn } of arr) {
			let key = eng.toLowerCase();
			if (RESULT[key] && RESULT[key] !== chn) {
				console.warn('duplicate:', key);
			}
			RESULT[key] = chn;
		}
	}
	for (const key in PATCH) {
		RESULT[key.toLowerCase()] = PATCH[key];
	}
	fs.writeFileSync('output\\wiki_translation_data.json', JSON.stringify(RESULT));
}
const PATCH = {
	'Raya Lucaria Academy': '雷亚卢卡利亚学院',
	'Walking Mausoleum': '漫步灵庙',
	'Boil Prawn Shack': '煮虾子的破屋',
	"Isolated Merchant's Shack (Dragonbarrow)": '隐居商人的破屋 (龙墓)',
	"Stargazer's Ruins": '观星废墟',
	'Minor Erdtree (Weeping Peninsula)': '小黄金树 (啜泣半岛)',
	'Minor Erdtree (Mistwood)': '小黄金树 (雾林)',
	'Minor Erdtree (Liurnia Southwest)': '小黄金树 (利耶尼亚西南)',
	'Enia': "“解指”恩雅",
	'Thops': '托普斯',
	'Isolated Merchants': '单独的流浪商人',
	'Corhyn': '柯林',
	'Gurranq Beast Clergyman': '“野兽祭司”古兰格',
	'Nomadic Merchants': '流放民族的商人',
	'Alexander': "“战士壶”亚历山大",
	'Bloody Finger Hunter Yura': '“血指猎人”尤拉',
	'Renna': '魔女蕾娜',
	'White-Faced Varre': '“白面具”梵雷',
	'Fia': '“死眠少女”菲雅',
	'Edgar': '“复仇者”艾德格',
	'Irina': '摩恩的伊蕾娜',
	'Kenneth Haight': '“领主的嫡长子”肯尼斯·海德',
	'Queen Marika': '玛莉卡女王',
	'Diallos': '骑士狄亚罗斯',
	'Frustrated Spirit': 'Frustrated Spirit', //todo
	'Hyetta': '海妲',
	'Tanith': '“火山官邸之主”塔妮丝',
	'Rya': '“招募者”菈雅',
	'Blaidd': '“半狼”布莱泽',
	'Gowry': '贤者格威',
	'Latenna': '白金之子勒缇娜',
	'Ensha': '“王骸”恩夏',
	'Goldmask': '金面具',
	'The Great-Jar': '大壶骑士',
	//https://eldenring.wiki.fextralife.com/World+Information
	'Locations': '地点',
	'Sites of Grace': '赐福',
	'Merchants': '流浪商人',
	'Creatures & Enemies': '生物与敌人',
	'Bosses': 'Bosses',
	//
	"Isolated Merchant Raya Lucaria": "雷亚卢卡利的流浪商人",
	"Saint Trina's Arrow ": '托莉娜箭', //修复一下名字St Trina's Arrow
	'Storm Arrow': 'Storm Arrow',//不知道叫什么
	'Carian Greatsword Skill': '卡利亚大剑(技能)',

	'Rennala Queen of the Full Moon': '“满月女王”蕾娜菈',//wiki中有时候没有逗号
	'Crystalian Ringblade': '结晶人（圆刃刀）',
	'Crystalian Spear & Crystalian Staff ': '结晶人（矛） & 结晶人（手杖）',
	'Crystalian': '结晶人',
	'Raya Lucaria Crystal Cave': '雷亚卢卡利亚结晶坑道',//wiki redirect
	//https://eldenring.wiki.fextralife.com/Spirit+Ashes
	// 'Ancient Dragon Knight Kristoff Ashes': '“古龙骑士”克里斯托福的骨灰',
	// 'Banished Knight Engvall Ashes': 'Banished Knight Engvall Ashes',
	// 'Battlemage Hugues Ashes': 'Battlemage Hugues Ashes',
	// 'Banished Knight Oleg Ashes': 'Banished Knight Oleg Ashes',
	// 'Blackflame Monk Amon Ashes': 'Blackflame Monk Amon Ashes',
	// 'Cleanrot Knight Finlay Ashes': 'Cleanrot Knight Finlay Ashes',
	// 'Depraved Perfumer Carmaan Ashes': 'Depraved Perfumer Carmaan Ashes',
	// 'Redmane Knight Ogha Ashes': 'Redmane Knight Ogha Ashes',
};
main();