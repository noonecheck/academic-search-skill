export type Safety = 'look-only' | 'cultivated-ok' | 'toxic-teach'

export type Mushroom = {
  id: string
  name: string
  pinyin: string
  chars: string[]
  funFact: string
  safety: Safety
  safetyNote: string
  habitat: string
  colors: { h: number; s: number; l: number }[]
  svgTone: 'amber' | 'ivory' | 'crimson' | 'slate' | 'honey' | 'ink'
}

/** 儿童识字图鉴：只看不吃。颜色用于本地粗匹配，不是食用鉴定。 */
export const mushrooms: Mushroom[] = [
  {
    id: 'xianggu',
    name: '香菇',
    pinyin: 'xiāng gū',
    chars: ['香', '菇'],
    funFact: '伞盖像一把小伞，闻起来有淡淡木香。',
    safety: 'cultivated-ok',
    safetyNote: '超市里的香菇可以吃；野外长得像的，一律不采不吃。',
    habitat: '木头上、潮湿的林边',
    colors: [
      { h: 28, s: 42, l: 38 },
      { h: 30, s: 25, l: 55 },
      { h: 35, s: 18, l: 72 },
    ],
    svgTone: 'amber',
  },
  {
    id: 'pinggu',
    name: '平菇',
    pinyin: 'píng gū',
    chars: ['平', '菇'],
    funFact: '菌盖像扇子，常常一丛丛叠在一起。',
    safety: 'cultivated-ok',
    safetyNote: '菜市场常见；野外相似菌类不要采。',
    habitat: '木头、栽培袋',
    colors: [
      { h: 45, s: 18, l: 78 },
      { h: 40, s: 12, l: 62 },
      { h: 90, s: 8, l: 70 },
    ],
    svgTone: 'ivory',
  },
  {
    id: 'jizong',
    name: '鸡枞',
    pinyin: 'jī zōng',
    chars: ['鸡', '枞'],
    funFact: '名字里有「鸡」，是因为它口感有点像鸡肉传说～',
    safety: 'look-only',
    safetyNote: '只做观察识字；真正采食要请当地专家，孩子绝不采。',
    habitat: '蚁巢附近的土里',
    colors: [
      { h: 38, s: 48, l: 58 },
      { h: 42, s: 35, l: 72 },
      { h: 30, s: 20, l: 40 },
    ],
    svgTone: 'honey',
  },
  {
    id: 'amanita',
    name: '毒蝇伞',
    pinyin: 'dú yíng sǎn',
    chars: ['毒', '蝇', '伞'],
    funFact: '红帽子上有白点，像童话插画——但千万别碰口。',
    safety: 'toxic-teach',
    safetyNote: '教孩子认识「毒」字：漂亮≠能吃。只看照片，不采不摸口。',
    habitat: '针叶林下',
    colors: [
      { h: 4, s: 78, l: 48 },
      { h: 0, s: 0, l: 96 },
      { h: 35, s: 20, l: 70 },
    ],
    svgTone: 'crimson',
  },
  {
    id: 'baidu',
    name: '白毒伞',
    pinyin: 'bái dú sǎn',
    chars: ['白', '毒', '伞'],
    funFact: '全身几乎全白，看起来「干净」，其实很危险。',
    safety: 'toxic-teach',
    safetyNote: '用来学「白」「毒」「伞」。颜色素不等于安全。',
    habitat: '阔叶林土中',
    colors: [
      { h: 60, s: 8, l: 92 },
      { h: 50, s: 5, l: 85 },
      { h: 40, s: 6, l: 78 },
    ],
    svgTone: 'ivory',
  },
  {
    id: 'muyuer',
    name: '木耳',
    pinyin: 'mù ěr',
    chars: ['木', '耳'],
    funFact: '软软的，长在木头上，像小耳朵。',
    safety: 'cultivated-ok',
    safetyNote: '干木耳泡发后常见于餐桌；野生长相似的不要采。',
    habitat: '腐木',
    colors: [
      { h: 10, s: 35, l: 18 },
      { h: 15, s: 25, l: 28 },
      { h: 20, s: 15, l: 40 },
    ],
    svgTone: 'ink',
  },
  {
    id: 'songrong',
    name: '松茸',
    pinyin: 'sōng róng',
    chars: ['松', '茸'],
    funFact: '名字有「松」，喜欢和松树做邻居。',
    safety: 'look-only',
    safetyNote: '珍稀菌类，本 App 只用于认字与观察。',
    habitat: '松林下',
    colors: [
      { h: 32, s: 40, l: 52 },
      { h: 28, s: 28, l: 40 },
      { h: 40, s: 22, l: 68 },
    ],
    svgTone: 'amber',
  },
  {
    id: 'lingzhi',
    name: '灵芝',
    pinyin: 'líng zhī',
    chars: ['灵', '芝'],
    funFact: '菌盖像小扇子或小云朵，常常有光泽。',
    safety: 'look-only',
    safetyNote: '药店/栽培产品另说；野外只观察识字。',
    habitat: '树根、腐木',
    colors: [
      { h: 18, s: 55, l: 42 },
      { h: 25, s: 45, l: 55 },
      { h: 30, s: 30, l: 30 },
    ],
    svgTone: 'amber',
  },
]

export const literacyChars = [
  { char: '蘑', pinyin: 'mó', meaning: '蘑菇的蘑', tip: '草字头，和植物有关' },
  { char: '菇', pinyin: 'gū', meaning: '香菇的菇', tip: '草字头 + 姑' },
  { char: '伞', pinyin: 'sǎn', meaning: '菌盖像伞', tip: '人下面有个十和两点' },
  { char: '盖', pinyin: 'gài', meaning: '菌盖', tip: '盖住头顶的那一层' },
  { char: '柄', pinyin: 'bǐng', meaning: '菌柄', tip: '像蘑菇的小腿' },
  { char: '看', pinyin: 'kàn', meaning: '只看', tip: '用手搭在目上仔细瞧' },
  { char: '不', pinyin: 'bù', meaning: '不要', tip: '家规：不采不尝' },
  { char: '吃', pinyin: 'chī', meaning: '吃东西', tip: '口字旁，和嘴巴有关' },
  { char: '毒', pinyin: 'dú', meaning: '有毒', tip: '看见就记住：危险信号' },
  { char: '林', pinyin: 'lín', meaning: '树林', tip: '两个木，很多树' },
  { char: '木', pinyin: 'mù', meaning: '木头', tip: '很多蘑菇长在木上' },
  { char: '耳', pinyin: 'ěr', meaning: '耳朵', tip: '木耳长得像小耳朵' },
] as const
