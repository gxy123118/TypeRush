// ==================== 成就系统 ====================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "speed" | "accuracy" | "combo" | "persist" | "stage";
  icon: string;
  coins: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // 速度类
  { id: "speed-1", name: "起步", description: "首次达到 20 WPM", category: "speed", icon: "🚶", coins: 50 },
  { id: "speed-2", name: "快手", description: "首次达到 40 WPM", category: "speed", icon: "🏃", coins: 100 },
  { id: "speed-3", name: "飞速", description: "首次达到 60 WPM", category: "speed", icon: "🚀", coins: 200 },
  { id: "speed-4", name: "闪电", description: "首次达到 80 WPM", category: "speed", icon: "⚡", coins: 500 },
  { id: "speed-5", name: "音速", description: "首次达到 100 WPM", category: "speed", icon: "🌟", coins: 1000 },
  // 准确类
  { id: "acc-1", name: "仔细", description: "单次准确率 ≥ 90%", category: "accuracy", icon: "🎯", coins: 50 },
  { id: "acc-2", name: "精准", description: "单次准确率 ≥ 95%", category: "accuracy", icon: "💎", coins: 100 },
  { id: "acc-3", name: "完美主义", description: "单次准确率 100%（≥20字符）", category: "accuracy", icon: "👑", coins: 300 },
  { id: "acc-4", name: "钢铁意志", description: "连续 5 次准确率 ≥ 95%", category: "accuracy", icon: "🛡️", coins: 500 },
  // 连击类
  { id: "combo-1", name: "小试牛刀", description: "单次最大连击 ≥ 10", category: "combo", icon: "✨", coins: 50 },
  { id: "combo-2", name: "势不可挡", description: "单次最大连击 ≥ 25", category: "combo", icon: "🔥", coins: 100 },
  { id: "combo-3", name: "连击大师", description: "单次最大连击 ≥ 50", category: "combo", icon: "💥", coins: 300 },
  { id: "combo-4", name: "传说", description: "单次最大连击 ≥ 100", category: "combo", icon: "🏆", coins: 800 },
  // 坚持类
  { id: "persist-1", name: "初来乍到", description: "完成第 1 次练习", category: "persist", icon: "🌱", coins: 30 },
  { id: "persist-2", name: "渐入佳境", description: "累计完成 10 次练习", category: "persist", icon: "🌿", coins: 100 },
  { id: "persist-3", name: "持之以恒", description: "累计完成 50 次练习", category: "persist", icon: "🌳", coins: 300 },
  { id: "persist-4", name: "打字狂人", description: "累计完成 100 次练习", category: "persist", icon: "🏔️", coins: 500 },
  { id: "persist-5", name: "千锤百炼", description: "累计完成 500 次练习", category: "persist", icon: "💫", coins: 2000 },
  // 闯关类
  { id: "stage-1", name: "第一章完成", description: "通关前 5 关", category: "stage", icon: "📖", coins: 200 },
  { id: "stage-2", name: "第二章完成", description: "通关前 10 关", category: "stage", icon: "📚", coins: 400 },
  { id: "stage-3", name: "第三章完成", description: "通关前 15 关", category: "stage", icon: "🎓", coins: 600 },
  { id: "stage-4", name: "全关卡三星", description: "所有关卡获得 3 星", category: "stage", icon: "⭐", coins: 3000 },
  { id: "stage-5", name: "关卡征服者", description: "通关全部 20 关", category: "stage", icon: "🏰", coins: 1500 },
];

export const ACHIEVEMENT_CATEGORIES = [
  { key: "speed" as const, label: "速度", icon: "🚀" },
  { key: "accuracy" as const, label: "准确", icon: "🎯" },
  { key: "combo" as const, label: "连击", icon: "🔥" },
  { key: "persist" as const, label: "坚持", icon: "📅" },
  { key: "stage" as const, label: "闯关", icon: "🏰" },
];

// ==================== 关卡系统 ====================

export interface Stage {
  id: number;
  chapter: number;
  title: string;
  text: string;
  requiredWpm: number;
  requiredAccuracy: number;
  coins: [number, number, number]; // 1星/2星/3星
}

export const STAGES: Stage[] = [
  // 第一章：基础训练
  { id: 1, chapter: 1, title: "第一步", text: "The cat sat on the mat and looked at the sky.", requiredWpm: 10, requiredAccuracy: 70, coins: [20, 40, 60] },
  { id: 2, chapter: 1, title: "热身", text: "She sells sea shells by the sea shore every morning.", requiredWpm: 15, requiredAccuracy: 75, coins: [25, 50, 75] },
  { id: 3, chapter: 1, title: "小试锋芒", text: "A good book is like a garden carried in the pocket of your mind forever and always.", requiredWpm: 20, requiredAccuracy: 75, coins: [30, 60, 90] },
  { id: 4, chapter: 1, title: "中文入门", text: "春天来了，花儿开了，小鸟在树枝上唱着欢快的歌。阳光温暖地洒在大地上。", requiredWpm: 15, requiredAccuracy: 70, coins: [30, 60, 90] },
  { id: 5, chapter: 1, title: "基础完成", text: "Time flies when you are having fun with your friends. Practice makes perfect every day.", requiredWpm: 20, requiredAccuracy: 80, coins: [40, 80, 120] },
  // 第二章：提速冲刺
  { id: 6, chapter: 2, title: "加速", text: "The greatest glory in living lies not in never falling, but in rising every time we stumble and fall down.", requiredWpm: 25, requiredAccuracy: 80, coins: [40, 80, 120] },
  { id: 7, chapter: 2, title: "疾风", text: "Innovation distinguishes between a leader and a follower in the rapidly changing technology landscape of our modern world.", requiredWpm: 30, requiredAccuracy: 80, coins: [45, 90, 135] },
  { id: 8, chapter: 2, title: "代码初练", text: "function add(a, b) {\n  return a + b;\n}\nconst result = add(3, 5);\nconsole.log(result);", requiredWpm: 25, requiredAccuracy: 80, coins: [50, 100, 150] },
  { id: 9, chapter: 2, title: "双语挑战", text: "编程不仅仅是写代码，更是一种解决问题的思维方式。Programming is the art of problem solving.", requiredWpm: 35, requiredAccuracy: 82, coins: [55, 110, 165] },
  { id: 10, chapter: 2, title: "冲刺完成", text: "Artificial intelligence is transforming the way we interact with technology and understand the complex world around us every single day.", requiredWpm: 40, requiredAccuracy: 85, coins: [60, 120, 180] },
  // 第三章：精准打击
  { id: 11, chapter: 3, title: "精雕细琢", text: "Sophisticated algorithms leverage concurrent processes to optimize computational throughput across distributed systems architectures.", requiredWpm: 35, requiredAccuracy: 85, coins: [50, 100, 150] },
  { id: 12, chapter: 3, title: "代码进阶", text: "async function fetchData(url: string) {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error('Failed');\n  return res.json();\n}", requiredWpm: 30, requiredAccuracy: 88, coins: [55, 110, 165] },
  { id: 13, chapter: 3, title: "长文挑战", text: "分布式系统架构在微服务环境下面临着数据一致性、服务治理和链路追踪等诸多挑战，需要工程师具备全局视野。", requiredWpm: 40, requiredAccuracy: 85, coins: [60, 120, 180] },
  { id: 14, chapter: 3, title: "混合高手", text: "The best way to predict the future is to create it. 持续学习是适应快速变化世界的最佳方式。Never stop improving.", requiredWpm: 45, requiredAccuracy: 88, coins: [65, 130, 195] },
  { id: 15, chapter: 3, title: "精准收官", text: "Cryptographic protocols utilizing elliptic curve mathematics provide asymmetric key exchanges with exceptional computational efficiency and security.", requiredWpm: 50, requiredAccuracy: 90, coins: [70, 140, 210] },
  // 第四章：大师之路
  { id: 16, chapter: 4, title: "大师门槛", text: "Neuroplasticity research demonstrates that synaptic connections continuously reorganize through experiential and environmental stimulation throughout our entire lives.", requiredWpm: 50, requiredAccuracy: 90, coins: [80, 160, 240] },
  { id: 17, chapter: 4, title: "代码大师", text: "class EventEmitter {\n  private listeners = new Map<string, Function[]>();\n  on(event: string, cb: Function) {\n    const list = this.listeners.get(event) || [];\n    list.push(cb);\n    this.listeners.set(event, list);\n  }\n}", requiredWpm: 45, requiredAccuracy: 90, coins: [85, 170, 255] },
  { id: 18, chapter: 4, title: "极限速度", text: "Quantum entanglement demonstrates non-local correlations that fundamentally challenge our classical intuitions about separability and the nature of reality itself.", requiredWpm: 60, requiredAccuracy: 90, coins: [90, 180, 270] },
  { id: 19, chapter: 4, title: "终极中文", text: "深度学习模型通过反向传播算法不断优化权重参数，以实现对复杂数据模式的精确拟合，推动了人工智能技术的革命性突破。", requiredWpm: 55, requiredAccuracy: 92, coins: [95, 190, 285] },
  { id: 20, chapter: 4, title: "登顶", text: "The juxtaposition of philosophical empiricism and rationalist epistemology yields profound insights into metacognitive frameworks that shape our understanding of knowledge itself.", requiredWpm: 65, requiredAccuracy: 95, coins: [100, 200, 300] },
];

export const CHAPTERS = [
  { id: 1, title: "基础训练", subtitle: "打好根基", icon: "🌱", color: "emerald" },
  { id: 2, title: "提速冲刺", subtitle: "突破极限", icon: "🚀", color: "blue" },
  { id: 3, title: "精准打击", subtitle: "百步穿杨", icon: "🎯", color: "purple" },
  { id: 4, title: "大师之路", subtitle: "登峰造极", icon: "👑", color: "amber" },
];

export function calculateStars(wpm: number, accuracy: number, stage: Stage): number {
  if (wpm < stage.requiredWpm || accuracy < stage.requiredAccuracy) return 0;
  if (wpm >= stage.requiredWpm * 1.6 && accuracy >= stage.requiredAccuracy + 10) return 3;
  if (wpm >= stage.requiredWpm * 1.3 && accuracy >= stage.requiredAccuracy + 5) return 2;
  return 1;
}

// ==================== 等级系统 ====================

export interface Rank {
  name: string;
  tier: string;
  color: string;
  minExp: number;
}

const EXP_THRESHOLDS = [
  0, 100, 300, 600,           // 青铜 I-IV
  1000, 1500, 2100, 2800,     // 白银 I-IV
  3600, 4500, 5500, 6600,     // 黄金 I-IV
  7800, 9100, 10500, 12000,   // 铂金 I-IV
  13600, 15300, 17100, 19000, // 钻石 I-IV
  21000,                      // 大师
];

const RANK_NAMES = ["青铜", "白银", "黄金", "铂金", "钻石"];
const RANK_COLORS = ["text-amber-600", "text-gray-300", "text-yellow-400", "text-cyan-400", "text-blue-400", "text-purple-400"];
const RANK_BG_COLORS = ["bg-amber-600/20", "bg-gray-300/20", "bg-yellow-400/20", "bg-cyan-400/20", "bg-blue-400/20", "bg-purple-400/20"];

export function getLevelFromExp(exp: number): number {
  for (let i = EXP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (exp >= EXP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getRank(level: number): { name: string; tier: string; color: string; bgColor: string; icon: string } {
  if (level >= 21) return { name: "大师", tier: "", color: RANK_COLORS[5], bgColor: RANK_BG_COLORS[5], icon: "👑" };
  const groupIndex = Math.floor((level - 1) / 4);
  const tierIndex = ((level - 1) % 4) + 1;
  const tierNames = ["I", "II", "III", "IV"];
  const icons = ["🥉", "🥈", "🥇", "💠", "💎", "👑"];
  return {
    name: RANK_NAMES[groupIndex],
    tier: tierNames[tierIndex - 1],
    color: RANK_COLORS[groupIndex],
    bgColor: RANK_BG_COLORS[groupIndex],
    icon: icons[groupIndex],
  };
}

export function getExpProgress(exp: number): { current: number; next: number; progress: number } {
  const level = getLevelFromExp(exp);
  const currentThreshold = EXP_THRESHOLDS[level - 1] || 0;
  const nextThreshold = EXP_THRESHOLDS[level] || currentThreshold + 1000;
  const progress = ((exp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return { current: exp - currentThreshold, next: nextThreshold - currentThreshold, progress: Math.min(100, progress) };
}

export function calculateExp(wpm: number, accuracy: number): number {
  return Math.round(wpm * (accuracy / 100) * 0.5 + 10);
}

// ==================== 商店系统 ====================

export type ShopItemType = "theme" | "effect" | "title";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: ShopItemType;
  price: number;
  preview?: string; // CSS class or emoji
}

export const SHOP_ITEMS: ShopItem[] = [
  // 主题皮肤
  { id: "theme-cyberpunk", name: "赛博朋克", description: "紫粉霓虹，未来已来", type: "theme", price: 500, preview: "cyberpunk" },
  { id: "theme-hacker", name: "终端黑客", description: "绿色终端，极客风格", type: "theme", price: 500, preview: "hacker" },
  { id: "theme-ocean", name: "深海", description: "深邃蓝色，宁静致远", type: "theme", price: 500, preview: "ocean" },
  { id: "theme-sakura", name: "樱花", description: "粉色浪漫，温柔如你", type: "theme", price: 800, preview: "sakura" },
  { id: "theme-sunset", name: "落日", description: "橙红暖调，夕阳无限", type: "theme", price: 800, preview: "sunset" },
  { id: "theme-golden", name: "黄金", description: "金碧辉煌，尊贵象征", type: "theme", price: 1500, preview: "golden" },
  // 打字特效
  { id: "fx-fireworks", name: "烟花", description: "完成时绽放彩色烟花", type: "effect", price: 300, preview: "🎆" },
  { id: "fx-stars", name: "星光", description: "星星粒子飘散效果", type: "effect", price: 300, preview: "⭐" },
  { id: "fx-snow", name: "飘雪", description: "雪花纷纷飘落", type: "effect", price: 500, preview: "❄️" },
  { id: "fx-neon", name: "霓虹", description: "霓虹灯光闪烁", type: "effect", price: 800, preview: "💡" },
  // 称号
  { id: "title-typist", name: "打字员", description: "排行榜显示专属称号", type: "title", price: 200, preview: "📝" },
  { id: "title-speedster", name: "飞速打字家", description: "速度的象征", type: "title", price: 500, preview: "⚡" },
  { id: "title-master", name: "键盘大师", description: "技艺精湛", type: "title", price: 1000, preview: "🎹" },
  { id: "title-legend", name: "传说", description: "传说中的打字者", type: "title", price: 3000, preview: "🏆" },
  { id: "title-god", name: "指尖之神", description: "至高无上的荣耀", type: "title", price: 5000, preview: "👑" },
];

// ==================== 主题 CSS 映射 ====================

export const THEME_STYLES: Record<string, { bg: string; accent: string; card: string; border: string; text: string }> = {
  default: { bg: "bg-[#0a0a0a]", accent: "text-emerald-400", card: "bg-gray-800/50", border: "border-white/10", text: "text-gray-100" },
  cyberpunk: { bg: "bg-[#0d0221]", accent: "text-fuchsia-400", card: "bg-purple-900/30", border: "border-fuchsia-500/20", text: "text-fuchsia-50" },
  hacker: { bg: "bg-[#001100]", accent: "text-green-400", card: "bg-green-950/40", border: "border-green-500/20", text: "text-green-50" },
  ocean: { bg: "bg-[#0a1628]", accent: "text-sky-400", card: "bg-blue-900/30", border: "border-sky-500/20", text: "text-sky-50" },
  sakura: { bg: "bg-[#1a0a14]", accent: "text-pink-400", card: "bg-pink-900/20", border: "border-pink-500/20", text: "text-pink-50" },
  sunset: { bg: "bg-[#1a0e05]", accent: "text-orange-400", card: "bg-orange-900/20", border: "border-orange-500/20", text: "text-orange-50" },
  golden: { bg: "bg-[#1a1505]", accent: "text-yellow-400", card: "bg-yellow-900/20", border: "border-yellow-500/20", text: "text-yellow-50" },
};
