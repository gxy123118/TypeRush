export type ContentType = "english" | "chinese" | "code";
export type Difficulty = "easy" | "medium" | "hard";

interface ContentItem {
  id: string;
  text: string;
  type: ContentType;
  difficulty: Difficulty;
}

const englishEasy: ContentItem[] = [
  { id: "en-e-1", type: "english", difficulty: "easy", text: "The quick brown fox jumps over the lazy dog near the river bank on a sunny day." },
  { id: "en-e-2", type: "english", difficulty: "easy", text: "She sells sea shells by the sea shore every morning before the sun rises high." },
  { id: "en-e-3", type: "english", difficulty: "easy", text: "A good book is like a garden carried in the pocket of your mind forever." },
  { id: "en-e-4", type: "english", difficulty: "easy", text: "The cat sat on the mat and looked at the bird flying in the bright blue sky." },
  { id: "en-e-5", type: "english", difficulty: "easy", text: "Time flies when you are having fun with your friends and family together." },
];

const englishMedium: ContentItem[] = [
  { id: "en-m-1", type: "english", difficulty: "medium", text: "Programming is the art of telling another human being what one wants the computer to do efficiently." },
  { id: "en-m-2", type: "english", difficulty: "medium", text: "The greatest glory in living lies not in never falling, but in rising every time we stumble and fall." },
  { id: "en-m-3", type: "english", difficulty: "medium", text: "Innovation distinguishes between a leader and a follower in the rapidly changing technology landscape." },
  { id: "en-m-4", type: "english", difficulty: "medium", text: "Artificial intelligence is transforming the way we interact with technology and understand the world around us." },
  { id: "en-m-5", type: "english", difficulty: "medium", text: "The best way to predict the future is to create it with determination, creativity, and unwavering perseverance." },
];

const englishHard: ContentItem[] = [
  { id: "en-h-1", type: "english", difficulty: "hard", text: "Sophisticated algorithms leverage concurrent processes to optimize computational throughput across distributed systems architectures." },
  { id: "en-h-2", type: "english", difficulty: "hard", text: "Quantum entanglement demonstrates non-local correlations that fundamentally challenge our classical intuitions about separability." },
  { id: "en-h-3", type: "english", difficulty: "hard", text: "The juxtaposition of philosophical empiricism and rationalist epistemology yields profound insights into metacognitive frameworks." },
  { id: "en-h-4", type: "english", difficulty: "hard", text: "Cryptographic protocols utilizing elliptic curve mathematics provide asymmetric key exchanges with exceptional computational efficiency." },
  { id: "en-h-5", type: "english", difficulty: "hard", text: "Neuroplasticity research demonstrates that synaptic connections continuously reorganize through experiential and environmental stimulation." },
];

const chineseEasy: ContentItem[] = [
  { id: "zh-e-1", type: "chinese", difficulty: "easy", text: "春天来了，花儿开了，小鸟在树枝上唱着欢快的歌。" },
  { id: "zh-e-2", type: "chinese", difficulty: "easy", text: "今天天气很好，阳光明媚，适合出去散步。" },
  { id: "zh-e-3", type: "chinese", difficulty: "easy", text: "我喜欢读书，每天晚上都会看一个小时的书。" },
  { id: "zh-e-4", type: "chinese", difficulty: "easy", text: "学习是一件快乐的事情，它让我们变得更聪明。" },
  { id: "zh-e-5", type: "chinese", difficulty: "easy", text: "妈妈做的饭菜很好吃，我每天都很期待回家吃饭。" },
];

const chineseMedium: ContentItem[] = [
  { id: "zh-m-1", type: "chinese", difficulty: "medium", text: "科技的发展日新月异，人工智能正在改变我们的生活方式和工作模式。" },
  { id: "zh-m-2", type: "chinese", difficulty: "medium", text: "读万卷书不如行万里路，实践是检验真理的唯一标准。" },
  { id: "zh-m-3", type: "chinese", difficulty: "medium", text: "编程不仅仅是写代码，更是一种解决问题的思维方式和创造力的体现。" },
  { id: "zh-m-4", type: "chinese", difficulty: "medium", text: "互联网连接了世界各地的人们，让信息交流变得前所未有的便捷和高效。" },
  { id: "zh-m-5", type: "chinese", difficulty: "medium", text: "持续学习是适应快速变化世界的最佳方式，终身学习已成为必然趋势。" },
];

const chineseHard: ContentItem[] = [
  { id: "zh-h-1", type: "chinese", difficulty: "hard", text: "分布式系统架构在微服务环境下面临着数据一致性、服务治理和链路追踪等诸多挑战。" },
  { id: "zh-h-2", type: "chinese", difficulty: "hard", text: "深度学习模型通过反向传播算法不断优化权重参数，以实现对复杂数据模式的精确拟合。" },
  { id: "zh-h-3", type: "chinese", difficulty: "hard", text: "量子计算利用叠加态和纠缠态的特性，在特定问题上展现出超越经典计算机的巨大优势。" },
  { id: "zh-h-4", type: "chinese", difficulty: "hard", text: "区块链技术通过去中心化共识机制和密码学哈希函数确保了数据的不可篡改性和透明性。" },
  { id: "zh-h-5", type: "chinese", difficulty: "hard", text: "云原生应用采用容器化部署、声明式接口和不可变基础设施等原则构建弹性可扩展的系统。" },
];

const codeEasy: ContentItem[] = [
  { id: "code-e-1", type: "code", difficulty: "easy", text: 'const name = "hello";\nconsole.log(name);' },
  { id: "code-e-2", type: "code", difficulty: "easy", text: "function add(a, b) {\n  return a + b;\n}" },
  { id: "code-e-3", type: "code", difficulty: "easy", text: 'const arr = [1, 2, 3];\narr.forEach(x => console.log(x));' },
  { id: "code-e-4", type: "code", difficulty: "easy", text: "let sum = 0;\nfor (let i = 0; i < 10; i++) {\n  sum += i;\n}" },
  { id: "code-e-5", type: "code", difficulty: "easy", text: 'if (x > 0) {\n  return "positive";\n} else {\n  return "negative";\n}' },
];

const codeMedium: ContentItem[] = [
  { id: "code-m-1", type: "code", difficulty: "medium", text: "const fibonacci = (n: number): number => {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n};" },
  { id: "code-m-2", type: "code", difficulty: "medium", text: "async function fetchData(url: string) {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error('Failed');\n  return res.json();\n}" },
  { id: "code-m-3", type: "code", difficulty: "medium", text: "const users = data\n  .filter(u => u.active)\n  .map(u => ({ id: u.id, name: u.name }))\n  .sort((a, b) => a.name.localeCompare(b.name));" },
  { id: "code-m-4", type: "code", difficulty: "medium", text: "class Stack<T> {\n  private items: T[] = [];\n  push(item: T) { this.items.push(item); }\n  pop(): T | undefined { return this.items.pop(); }\n}" },
  { id: "code-m-5", type: "code", difficulty: "medium", text: "export default function handler(req, res) {\n  if (req.method === 'POST') {\n    const { name } = req.body;\n    res.status(201).json({ name });\n  }\n}" },
];

const codeHard: ContentItem[] = [
  {
    id: "code-h-1", type: "code", difficulty: "hard",
    text: [
      "function mergeSort(arr: number[]): number[] {",
      "  if (arr.length <= 1) return arr;",
      "  const mid = Math.floor(arr.length / 2);",
      "  const left = mergeSort(arr.slice(0, mid));",
      "  const right = mergeSort(arr.slice(mid));",
      "  return merge(left, right);",
      "}",
    ].join("\n"),
  },
  {
    id: "code-h-2", type: "code", difficulty: "hard",
    text: [
      "function debounce(fn: (...args: unknown[]) => void, ms: number) {",
      "  let timer: ReturnType<typeof setTimeout>;",
      "  return (...args: unknown[]) => {",
      "    clearTimeout(timer);",
      "    timer = setTimeout(() => fn(...args), ms);",
      "  };",
      "}",
    ].join("\n"),
  },
  {
    id: "code-h-3", type: "code", difficulty: "hard",
    text: [
      "class EventEmitter {",
      "  private listeners = new Map<string, Function[]>();",
      "  on(event: string, cb: Function) {",
      "    const list = this.listeners.get(event) || [];",
      "    list.push(cb);",
      "    this.listeners.set(event, list);",
      "  }",
      "  emit(event: string, ...args: unknown[]) {",
      "    this.listeners.get(event)?.forEach(cb => cb(...args));",
      "  }",
      "}",
    ].join("\n"),
  },
  {
    id: "code-h-4", type: "code", difficulty: "hard",
    text: [
      "async function retry(fn: () => Promise<unknown>, attempts = 3) {",
      "  for (let i = 0; i < attempts; i++) {",
      "    try {",
      "      return await fn();",
      "    } catch (err) {",
      "      if (i === attempts - 1) throw err;",
      "      await new Promise(r => setTimeout(r, 1000 * (i + 1)));",
      "    }",
      "  }",
      "}",
    ].join("\n"),
  },
  {
    id: "code-h-5", type: "code", difficulty: "hard",
    text: [
      "function deepClone(obj: Record<string, unknown>): Record<string, unknown> {",
      "  const result: Record<string, unknown> = {};",
      "  for (const [key, val] of Object.entries(obj)) {",
      "    result[key] = typeof val === 'object' && val !== null",
      "      ? deepClone(val as Record<string, unknown>)",
      "      : val;",
      "  }",
      "  return result;",
      "}",
    ].join("\n"),
  },
  {
    id: "code-h-6", type: "code", difficulty: "hard",
    text: [
      "const compose = (...fns: Function[]) =>",
      "  (value: unknown) =>",
      "    fns.reduceRight((acc, fn) => fn(acc), value);",
    ].join("\n"),
  },
];

const allContent: ContentItem[] = [
  ...englishEasy, ...englishMedium, ...englishHard,
  ...chineseEasy, ...chineseMedium, ...chineseHard,
  ...codeEasy, ...codeMedium, ...codeHard,
];

export function getContent(type: ContentType, difficulty: Difficulty): ContentItem[] {
  return allContent.filter((c) => c.type === type && c.difficulty === difficulty);
}

export function getRandomContent(type: ContentType, difficulty: Difficulty): ContentItem {
  const items = getContent(type, difficulty);
  return items[Math.floor(Math.random() * items.length)];
}

export function getAllContent(): ContentItem[] {
  return allContent;
}

export type { ContentItem };
