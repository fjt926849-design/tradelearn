# 贸学 TradeLearn

基于 **Incoterms 2020** 的国际贸易术语学习工具。通过间隔复习系统和场景实战，帮助外贸从业者系统掌握 11 个贸易术语。

## ✨ 功能

- **📇 术语词典** — 11 个 Incoterms 2020 术语，含中文详解、买卖方责任、风险转移点、时间线、常见误解和相近术语对比
- **🃏 闪卡系统** — 4 级自评（很熟 / 会 / 模糊 / 不会），间隔复习算法自动安排下次复习时间
- **📋 场景实战** — 15 道高仿真贸易场景题，覆盖术语选择、风险判断、责任划分
- **🗺️ 知识地图** — 按 E/F/C/D 四组可视化展示术语体系
- **📊 学习看板** — 首页展示今日待学、薄弱知识、学习进度、实战提示
- **💾 纯本地存储** — 学习进度保存在浏览器 localStorage，无需登录，无后端

## 🛠 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router + Turbopack) |
| 样式 | Tailwind CSS v4 (CSS-first 配置) |
| 语言 | TypeScript (strict) |
| 持久化 | localStorage（自定义 useLocalStorage hook） |
| 部署 | 纯静态导出，支持 Vercel / Netlify / 任意静态托管 |

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev
# → http://localhost:3000

# 生产构建
npm run build
npm start
```

## 📁 项目结构

```
tradelearn/
├── app/
│   ├── page.tsx                  # 首页仪表盘
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式 + Tailwind v4 配置
│   ├── flashcards/page.tsx       # 闪卡学习页
│   ├── knowledge-map/page.tsx    # 知识地图页
│   ├── practice/page.tsx         # 场景实战页
│   └── terms/
│       ├── page.tsx              # 术语列表页
│       └── [code]/page.tsx       # 术语详情页（SSG，11个静态页面）
├── components/
│   ├── flashcards/               # 闪卡组件
│   │   ├── FlashCard.tsx         # 3D 翻转卡片
│   │   ├── FlashcardDeck.tsx     # 闪卡学习流程
│   │   └── FlashcardResults.tsx  # 学习结果页
│   ├── practice/                 # 实战组件
│   │   ├── PracticeDeck.tsx      # 答题流程
│   │   └── PracticeResults.tsx   # 实战结果页
│   ├── layout/                   # 布局组件
│   │   ├── Header.tsx            # 顶部导航
│   │   └── Footer.tsx            # 底部
│   └── ui/
│       └── StatusDot.tsx         # 学习状态指示点
├── hooks/
│   ├── useLocalStorage.ts        # localStorage 封装
│   ├── useFlashcardProgress.ts   # 闪卡进度 + 间隔复习
│   └── usePracticeProgress.ts    # 实战答题进度
├── lib/
│   └── types.ts                  # TypeScript 类型定义 + 间隔算法
└── data/
    ├── trade-terms.ts            # 11 个术语完整数据
    ├── scenario-questions.ts     # 15 道场景题
    └── knowledge-map.ts          # 知识地图结构
```

## 📖 Incoterms 2020 术语一览

| 分组 | 术语 | 中文 | 风险转移点 |
|------|------|------|-----------|
| E 组 | EXW | 工厂交货 | 卖方场所货交买方 |
| F 组 | FCA | 货交承运人 | 货交买方指定承运人 |
| F 组 | FAS | 船边交货 | 装运港船边 |
| F 组 | FOB | 装运港船上交货 | 货物装上船时 |
| C 组 | CFR | 成本加运费 | 货物装上船时（卖方付运费） |
| C 组 | CIF | 成本加保险费、运费 | 货物装上船时（卖方付运费+保险） |
| C 组 | CPT | 运费付至 | 货交第一承运人 |
| C 组 | CIP | 运费、保险费付至 | 货交第一承运人 |
| D 组 | DAP | 目的地交货 | 目的地运输工具上 |
| D 组 | DPU | 卸货地交货 | 目的地卸货后 |
| D 组 | DDP | 完税后交货 | 目的地完税后 |

## 🧠 间隔复习算法

自评后根据掌握程度动态计算下次复习间隔：

| 掌握程度 | 行为 | 下次间隔 |
|----------|------|----------|
| 不会 (forgot) | 重置间隔为 1 天 | 1 天后 |
| 模糊 (blurry) | 重置间隔为 1 天 | 1 天后 |
| 会 (got-it) | 间隔 × 2 | 最长 60 天 |
| 很熟 (mastered) | 间隔 × 2 | 最长 60 天 |

首次学习从 1 天开始，连续掌握每次翻倍，遗忘或模糊则重置。

## 🔮 路线图

- [ ] 英文版 / 国际化
- [ ] 深色模式
- [ ] PWA 离线支持
- [ ] 术语对比矩阵页
- [ ] 自定义题库导入
- [ ] AI 场景题生成（V2）

## 📄 许可

MIT License
