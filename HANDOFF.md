# TypeRush 项目接手指南 (Prompt)

## 项目概述

TypeRush 是一个打字练习全栈 Web 应用，目标是通过良好的实时反馈和激励机制帮助用户提高打字速度。项目基于 **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Prisma 7 + SQLite**，前后端一体。

## 技术栈

- **Next.js 16.2.9** (Turbopack, App Router) — 注意：`params` 和 `searchParams` 是 Promise 需要 await；路由 handler 默认不缓存；`headers()`/`cookies()` 是 async
- **React 19.2.4** + TypeScript 5
- **Tailwind CSS v4** — 使用 `@import 'tailwindcss'` 而非旧的 `@tailwind` 指令，配置在 `@theme inline {}` 中
- **Prisma 7 + `@prisma/adapter-mariadb` + MySQL** — Prisma 7 不再支持 schema 中的 `url`，连接配置在 `prisma.config.ts` 中；PrismaClient 构造需要传 `adapter` 参数
- **NextAuth v5 beta** (Auth.js) — JWT session，credentials provider
- **Zustand 5** + localStorage 持久化 — 客户端状态管理
- **Recharts 3** — 成长曲线图表
- **canvas-confetti** — 完成/连击庆祝特效

## 已实现的功能

1. **核心打字引擎** (`src/hooks/useTypingEngine.ts`) — 逐字符对比、WPM/准确率实时计算、combo 连击、退格支持
2. **练习模式** (`src/app/page.tsx`) — 内容选择器（英文/中文/代码 × 简单/中等/困难）、实时统计面板、完成评级 (S/A/B/C/D)
3. **SVG 虚拟键盘** (`src/components/Keyboard.tsx`) — 标准键盘布局、手指区域着色、实时键位高亮
4. **连击/Combo 系统** (`src/components/ComboEffect.tsx`) — 10/25/50 连击阶梯式视觉反馈
5. **打字教程** (`src/app/tutorial/page.tsx`) — 5 阶段课程（基准行→上行→下行→数字→综合），自动进阶
6. **挑战模式** (`src/app/challenge/page.tsx`) — 限时 60 秒 / 完美零失误 / 超越个人最佳
7. **历史记录** (`src/app/history/page.tsx`) — 统计卡片 + Recharts 成长曲线 + 最近记录列表
8. **用户系统** — 邮箱密码注册/登录、JWT session
9. **API 路由** — `/api/auth/register`、`/api/practice` (CRUD)、`/api/leaderboard` (Top 50)
10. **内容库** (`src/lib/content.ts`) — 46 条内置文本，覆盖英文/中文/代码三类

## 需要修复的问题

以下是已知的 bug 和未完成的功能，按优先级排序：

### 高优先级

1. **练习结果未保存到数据库** — `page.tsx` 只调用了 `store.addRecord()`（localStorage），从未调用 `POST /api/practice`。需要在用户登录时自动将结果同步到服务端。

2. **登录状态在 UI 中不可见** — Header 始终显示"登录"按钮，没有 session 检查、用户名显示和退出登录按钮。需要读取 NextAuth session 并在 Header 中展示。

3. **排行榜页面缺失** — API `/api/leaderboard` 已实现但没有对应的前端页面。需要创建 `src/app/leaderboard/page.tsx` 并在 Header 导航中添加入口。

4. **挑战模式结果未持久化** — 挑战完成后既没有调用 `store.addRecord()` 也没有调用 API，分数在离开页面后丢失。

### 中优先级

5. **`prisma.ts` 硬编码了数据库路径** — `file:prisma/dev.db` 应改为读取环境变量，方便部署到不同环境。

6. **缺少路由保护中间件** — 目前认证检查只在各 API handler 内部，应添加 Next.js middleware 统一保护需登录的路由。

7. **`TypingArea` 的 `isCode` 分支是空操作** — `isCode ? "font-mono" : "font-mono"` 两边一样，代码片段应该有不同的排版样式（比如语法高亮、更小字体、行号）。

### 低优先级

8. **`Keyboard` 组件的 `highlightFinger` prop 未使用** — 声明了但没有消费者传入，可以移除或实现手指高亮功能。
9. **`getFingerForKey` 导出但未使用** — 从 Keyboard.tsx 导出但未被引用。
10. **内容库是纯静态的** — 可以扩展为支持用户自定义文本、从 API 获取文本等。

## 目录结构

```
typerush/
├── prisma/
│   ├── schema.prisma              # 数据模型：User + PracticeResult
│   └── migrations/                # 数据库迁移文件
├── src/
│   ├── app/
│   │   ├── page.tsx               # 首页（练习模式）
│   │   ├── layout.tsx             # 根布局（深色主题）
│   │   ├── globals.css            # 全局样式 + 自定义动画
│   │   ├── tutorial/page.tsx      # 教程页
│   │   ├── challenge/page.tsx     # 挑战模式
│   │   ├── history/page.tsx       # 历史记录 + 成长曲线
│   │   ├── auth/login/page.tsx    # 登录页
│   │   ├── auth/register/page.tsx # 注册页
│   │   └── api/                   # API 路由
│   ├── components/                # UI 组件
│   │   ├── TypingArea.tsx         # 核心打字区域
│   │   ├── Keyboard.tsx           # SVG 虚拟键盘
│   │   ├── StatsPanel.tsx         # 实时统计面板
│   │   ├── ComboEffect.tsx        # 连击特效
│   │   ├── ContentSelector.tsx    # 内容/难度选择器
│   │   ├── ResultCard.tsx         # 完成结果弹窗
│   │   ├── GrowthChart.tsx        # Recharts 成长曲线
│   │   └── Header.tsx             # 导航栏
│   ├── hooks/
│   │   └── useTypingEngine.ts     # 打字引擎核心 hook
│   ├── store/
│   │   └── typingStore.ts         # Zustand 状态管理
│   └── lib/
│       ├── auth.ts                # NextAuth 配置
│       ├── content.ts             # 内置文本数据
│       └── prisma.ts              # Prisma 客户端
├── prisma.config.ts               # Prisma 7 连接配置
└── .env.example                   # 环境变量模板
```

## 本地开发

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## 后续可做的功能增强

- 音效系统（键盘声、combo 音效，可开关）
- 响应式适配（移动端布局）
- 深色/浅色主题切换
- 多语言国际化 (i18n)
- 实时多人对战（WebSocket）
- 从外部 API 获取随机文本
- 用户头像和个人资料编辑
- 将 SQLite 切换为 MySQL（只需修改 prisma schema provider 和 prisma.config.ts 中的连接方式）

## 已完成的修复（2026-06-12）

以上"需要修复的问题"已全部修复：

1. ✅ **练习结果保存到数据库** — 登录后自动 `POST /api/practice`
2. ✅ **登录状态 UI** — Header 显示用户名 + 退出按钮，读取 NextAuth session
3. ✅ **排行榜页面** — 新建 `/leaderboard` 页面 + Header 导航入口
4. ✅ **挑战结果持久化** — 完成后 localStorage + API 双写
5. ✅ **数据库路径不再硬编码** — 使用 `DB_HOST/DB_USER/DB_PASSWORD/DB_NAME` 环境变量
6. ✅ **数据库从 SQLite 切换为 MySQL** — 使用 `@prisma/adapter-mariadb`
7. ✅ **`isCode` 分支修复** — 代码模式使用 `font-mono text-sm whitespace-pre`，非代码用 `font-sans text-lg`
8. ✅ **NextAuth trustHost** — 设置 `trustHost: true` 解决 production 环境 UntrustedHost 错误
