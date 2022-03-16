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
	'Alexander': "“铁拳”亚历山大",
	'Iron Fist Alexander': '“铁拳”亚历山大',
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

	//武器类型
	"Dagger": "短剑",
	"Straight Sword": "直剑",
	"Greatsword": "大剑",
	"Colossal Sword": "特大剑",
	"Curved Sword": "曲剑",
	"Curved Greatsword": "大曲剑",
	"Katana": "刀",
	"Twinblade": "双头剑",
	"Thrusting Sword": "刺剑",
	"Heavy Thrusting Sword": "重刺剑",
	"Axe": "斧",
	"Greataxe": "大斧",
	"Hammer": "槌",
	"Warhammer": "大槌",
	"Flail": "连枷",
	"Spear": "矛",
	"Great Spear": "大矛",
	"Halberd": "戟",
	"Reaper": "镰刀",
	"Fist": "拳头",
	"Claw": "钩爪",
	"Colossal Weapon": "特大武器",
	"Light Bow": "小弓",
	"Bow": "长弓",
	"Greatbow": "大弓",
	"Crossbow": "弩",
	"Ballista": "弩炮",
	"Glintstone Staff": "手杖",
	"Sacred Seal": "圣印记",
	"Small Shield": "小盾",
	"Medium Shield": "中盾",
	"Greatshield": "大盾",
	"Whip": "软鞭",
	"Arrow": "箭",
	"Greatarrow": "大箭",
	"Bolt": "弩箭",
	"Greatbolt": "大弩箭",
	"Torch": "火把",
	//伤害类型
	'Standard Damage': '普通伤害',
	'Strike Damage': '打击伤害',
	'Slash Damage': '斩击伤害',
	'Pierce Damage': '突刺伤害',
	'Magic Damage': '魔力伤害',
	'Fire Damage': '火焰伤害',
	'Lightning Damage': '雷电伤害',
	'Holy Damage': '圣伤害',
	'Critical Damage': '致命一击伤害',

	'Standard': '普通',
	'Strike': '打击',
	'Slash': '斩击',
	'Pierce': '突刺',
	'Magic': '魔力',
	'Fire': '火焰',
	'Lightning': '雷电',
	'Holy': '圣',
	'Critical': '致命一击',

	'Incantation': '祷告',
	'Sorceries': '魔法',
	//item type
	'Key Items': '贵重物品',
	'Crafting Materials': '制作道具的材料',
	'Great Runes': '大卢恩',
	'Remembrance': '追忆',
	'Multiplayer': '多人联机游玩',
	'Consumables': '消耗道具',
	'Upgrade Materials': '强化用材料',//Bolstering Materials
	'Cookbooks': '制作笔记',
	'Crystal Tears': '结晶露滴',
	'Arrows and Bolts': "箭／弩箭",
	'Bell Bearings': '铃珠',

	//
	'Great Epee': '大重剑',//Great Épée
};
main();