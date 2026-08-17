# 贸学 TradeLearn

国际贸易知识系统学习工具。覆盖 7 大知识模块、73 个知识点，通过间隔复习系统和场景实战，帮助外贸从业者系统掌握国际贸易全流程。

**线上地址：** [tradelearn-lake.vercel.app](https://tradelearn-lake.vercel.app)

## ✨ 功能

- **📚 7 大知识模块** — 贸易术语、国际结算、国际运输、货运保险、进出口单据、报关检验、合同条款，共 73 个知识点
- **🃏 统一闪卡系统** — 4 级自评（很熟 / 会 / 模糊 / 不会），间隔复习算法自动安排下次复习，支持按模块切换
- **📋 场景实战** — 30 道高仿真贸易场景题，覆盖全部 7 个模块；另有 7 步全流程综合实战（深圳蓝牙耳机→汉堡）
- **🏠 首页学习中心** — 今日待学、薄弱知识点、全局学习进度、实战提示一目了然
- **🗺️ 知识地图** — 按 E/F/C/D 四组可视化展示术语体系
- **💾 纯本地存储** — 学习进度保存在浏览器 localStorage，无需登录，无后端

## 🛠 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router + Turbopack) |
| 样式 | Tailwind CSS v4 (CSS-first 配置) |
| 语言 | TypeScript (strict) |
| 持久化 | localStorage（7 独立 hook + Progress Aggregator 聚合层） |
| 部署 | Vercel（GitHub push 自动部署） |

## 🚀 本地运行

```bash
npm install
npm run dev      # → http://localhost:3000
npm run build    # 生产构建（Turbopack，95 页，0 错误）
```

## 📁 项目结构

```
tradelearn/
├── app/
│   ├── page.tsx                    # 首页学习中心仪表盘
│   ├── layout.tsx                  # 根布局
│   ├── globals.css                 # 全局样式 + Tailwind v4 配置
│   ├── terms/                      # 贸易术语（列表 + 11 个详情页）
│   ├── settlement/                 # 国际结算（列表 + 12 个详情页）
│   ├── transport/                  # 国际运输（列表 + 10 个详情页）
│   ├── insurance/                  # 货运保险（列表 + 8 个详情页）
│   ├── documents/                  # 进出口单据（列表 + 9 个详情页）
│   ├── customs/                    # 报关检验（列表 + 8 个详情页）
│   ├── contract/                   # 合同条款（列表 + 15 个详情页）
│   ├── flashcards/                 # 统一闪卡入口 + 模块选择器
│   ├── practice/                   # 分模块实战 + 综合实战
│   └── knowledge-map/              # 知识地图
├── components/
│   ├── flashcards/                 # 闪卡组件（FlashcardDeck + 6 模块专用 Deck）
│   ├── practice/                   # 实战组件（GenericPracticeDeck + 原 Incoterms PracticeDeck）
│   ├── layout/                     # Header / Footer
│   └── ui/                         # StatusDot 等通用 UI
├── hooks/
│   ├── useConceptProgress.ts       # 通用概念进度 hook（7 模块复用）
│   ├── useProgressAggregator.ts    # 聚合 7 模块进度 → 首页学习中心
│   ├── useFlashcardProgress.ts     # 闪卡进度 + 间隔复习算法
│   ├── usePracticeProgress.ts      # 实战答题进度
│   └── use{Module}Progress.ts      # 各模块轻量 hook（聚合调用）
├── data/
│   ├── trade-terms.ts              # 贸易术语（11 个）
│   ├── settlement-concepts.ts      # 国际结算（12 个）
│   ├── transport-concepts.ts       # 国际运输（10 个）
│   ├── insurance-concepts.ts       # 货运保险（8 个）
│   ├── documents-concepts.ts       # 进出口单据（9 个）
│   ├── customs-concepts.ts         # 报关检验（8 个）
│   ├── contract-concepts.ts        # 合同条款（15 个）
│   ├── scenario-questions.ts       # 贸易术语场景题（15 道）
│   ├── module-scenario-questions.ts # 新 6 模块场景题（15 道）+ 综合实战（7 步）
│   └── knowledge-map.ts            # 知识地图结构
└── lib/
    └── types.ts                    # TypeScript 类型定义
```

## 📖 知识模块一览

| 模块 | 知识点数 | 场景题 | 涵盖内容 |
|------|---------|--------|---------|
| 贸易术语 | 11 | 15 道 | EXW、FCA、FAS、FOB、CFR、CIF、CPT、CIP、DAP、DPU、DDP |
| 国际结算 | 12 | 3 道 | T/T、L/C、D/P、D/A、CAD、托收、保函、UCP 600 等 |
| 国际运输 | 10 | 3 道 | 海运、空运、铁路、多式联运、提单、运单、集装箱等 |
| 货运保险 | 8 | 3 道 | 平安险、水渍险、一切险、保险单、投保流程、索赔等 |
| 进出口单据 | 9 | 3 道 | 商业发票、装箱单、产地证、检验证、保险单、提单等 |
| 报关检验 | 8 | 3 道 | HS 编码、报关流程、报检、AEO 认证、关税计算等 |
| 合同条款 | 15 | 3 道 | 品名、数量、包装、价格、装运、支付、检验、索赔、仲裁等 |
| **综合实战** | — | **7 步** | 深圳蓝牙耳机→汉堡全流程模拟 |

## 🧠 间隔复习算法

自评后根据掌握程度动态计算下次复习间隔：

| 掌握程度 | 行为 | 下次间隔 |
|----------|------|----------|
| 不会 (forgot) | 重置间隔为 1 天 | 1 天后 |
| 模糊 (blurry) | 重置间隔为 1 天 | 1 天后 |
| 会 (got-it) | 间隔 × 2 | 最长 60 天 |
| 很熟 (mastered) | 间隔 × 2 | 最长 60 天 |

## 🏗 架构要点

- **Progress Aggregator** — 7 × `useConceptProgress`（独立 localStorage key）→ `useProgressAggregator` → 首页统一学习中心，数据底层隔离、学习体验统一
- **泛型组件** — `GenericPracticeDeck` 驱动 6 个新模块实战，原 Incoterms `PracticeDeck` 保留
- **可扩展** — 添加第 8 个模块 = 1 行 `MODULE_CONFIG` + 1 个 hook 调用 + 概念数据文件

## 🔮 路线图

- [ ] 英文版 / 国际化
- [ ] 深色模式
- [ ] PWA 离线支持
- [ ] 术语对比矩阵页
- [ ] 知识地图 7 模块全渲染
- [ ] 自定义题库导入
- [ ] AI 场景题生成（V2）

## 📄 许可

MIT License
