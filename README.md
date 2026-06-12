<div align="center">

# ⌨️ TypeRush

**一个游戏化的打字练习 Web 应用**

通过闯关、成就、金币和排行榜，让枯燥的打字练习变成一场冒险。

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## ✨ 功能特性

### 🎮 核心练习
- **自由练习** — 英文 / 中文 / 代码三种类型，简单 / 中等 / 困难三级难度
- **实时反馈** — 逐字符着色（正确/错误），WPM 和准确率实时计算
- **连击系统** — 10 / 25 / 50 / 100 连击里程碑提示
- **SVG 虚拟键盘** — 标准布局，手指区域着色，实时按键高亮

### 🏰 闯关模式
- **20 个关卡，4 个章节**：基础训练 → 提速冲刺 → 精准打击 → 大师之路
- **星级评定**：根据 WPM 和准确率评 1-3 星，不同星级不同金币奖励
- **逐关解锁**：通过前一关才能挑战下一关

### 🏆 成就系统
- **25 个成就**，5 大类别：速度 🚀 / 准确 🎯 / 连击 🔥 / 坚持 📅 / 闯关 🏰
- **自动检测**：练习、闯关、挑战完成后自动判断是否达成条件
- **解锁通知**：达成后弹出成就通知 + 奖励金币

### 🪙 金币经济
- 练习 / 挑战 / 闯关完成后获得金币
- 成就解锁额外奖励 30 - 3000 金币
- 金币用于在商店购买装饰物品

### 🛒 商店
- **6 款主题皮肤**：赛博朋克、终端黑客、深海、樱花、落日、黄金
- **4 款打字特效**：烟花、星光、飘雪、霓虹
- **5 个称号**：打字员 → 指尖之神

### 👤 个人中心
- 等级段位徽章（青铜 → 钻石 → 大师，21 级）
- 经验值进度条
- 成就墙（已解锁 / 未解锁）
- 练习统计汇总

### 📊 其他功能
- **挑战模式** — 限时 60 秒 / 完美零失误 / 超越个人最佳
- **打字教程** — 5 阶段课程（基准行 → 上行 → 下行 → 数字 → 综合）
- **历史记录** — 统计卡片 + Recharts 成长曲线 + 最近记录列表
- **排行榜** — 全服 Top 50，按最高 WPM 排名
- **用户系统** — 邮箱密码注册登录，JWT Session

---

## 🛠 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router, Turbopack) |
| 前端 | React 19 + TypeScript 5 |
| 样式 | Tailwind CSS v4 |
| 状态 | Zustand 5 + localStorage 持久化 |
| 认证 | NextAuth v5 (Auth.js) — JWT + Credentials |
| 数据库 | MySQL + Prisma 7 + @prisma/adapter-mariadb |
| 图表 | Recharts 3 |
| 特效 | canvas-confetti |

---

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx                # 首页（自由练习）
│   ├── layout.tsx              # 根布局
│   ├── globals.css             # 全局样式 + 动画
│   ├── stages/
│   │   ├── page.tsx            # 关卡选择
│   │   └── [id]/page.tsx       # 关卡游玩
│   ├── challenge/page.tsx      # 挑战模式
│   ├── tutorial/page.tsx       # 打字教程
│   ├── history/page.tsx        # 历史记录
│   ├── leaderboard/page.tsx    # 排行榜
│   ├── shop/page.tsx           # 商店
│   ├── profile/page.tsx        # 个人中心
│   ├── auth/
│   │   ├── login/page.tsx      # 登录
│   │   └── register/page.tsx   # 注册
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts
│       │   └── register/route.ts
│       ├── practice/route.ts   # 练习记录 CRUD
│       └── leaderboard/route.ts
├── components/
│   ├── TypingArea.tsx          # 打字输入区
│   ├── Keyboard.tsx            # SVG 虚拟键盘
│   ├── StatsPanel.tsx          # 实时统计面板
│   ├── ComboEffect.tsx         # 连击提示
│   ├── ContentSelector.tsx     # 类型/难度选择器
│   ├── ResultCard.tsx          # 完成结算弹窗
│   ├── GrowthChart.tsx         # 成长曲线图
│   ├── Header.tsx              # 导航栏
│   ├── AchievementToast.tsx    # 成就解锁通知
│   ├── LevelBadge.tsx          # 等级段位徽章
│   ├── StarRating.tsx          # 星级评分
│   ├── CoinDisplay.tsx         # 金币展示
│   ├── RequireAuth.tsx         # 登录保护
│   └── GameUserSync.tsx        # 用户数据隔离
├── hooks/
│   └── useTypingEngine.ts      # 打字引擎核心 Hook
├── store/
│   ├── typingStore.ts          # 练习记录状态
│   └── gameStore.ts            # 游戏数据状态（金币/成就/装备）
└── lib/
    ├── auth.ts                 # NextAuth 配置
    ├── prisma.ts               # Prisma Client
    ├── content.ts              # 内置练习文本库
    ├── gameData.ts             # 成就/关卡/商店/等级定义
    └── achievementChecker.ts   # 成就检测引擎
```

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- MySQL 5.7+ / 8.0
- npm / yarn / pnpm

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/gxy123118/TypeRush.git
cd TypeRush

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填写你的 MySQL 连接信息和 AUTH_SECRET

# 4. 创建数据库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS typerush CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 5. 生成 Prisma Client + 执行迁移
npx prisma generate
npx prisma migrate dev

# 6. 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始打字！

### 环境变量

```env
DATABASE_URL="mysql://root:123456@localhost:3306/typerush"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="your_password"
DB_NAME="typerush"
AUTH_SECRET="your-secret-key"
```

---

## 📜 数据模型

```
User            — 用户（邮箱、密码、金币、等级、经验值、装备）
PracticeResult  — 练习记录（WPM、准确率、连击、用时、模式）
UserAchievement — 已解锁成就
UserItem        — 已购买商品
StageRecord     — 关卡通关记录（星级、得分、金币）
```

---

## 📄 License

MIT
