# 贸学 TradeLearn

面向国际贸易初学者的公开学习网站。产品采用两层内容结构：先通过术语卡快速建立概念，再进入模块化知识点和业务场景深入学习。

**线上地址：** [tradelearn.dpdns.org](https://tradelearn.dpdns.org)

## 当前内容结构

| 层级 | 数量 | 用途 | 入口 |
|---|---:|---|---|
| 快速术语层 | 9 个篇章、44 张术语卡 | 查词、理解概念、轻量闪卡复习 | `/terms-preview` |
| 深入学习层 | 7 个模块、73 个知识点 | 系统学习、间隔复习、模块实战 | `/learn` |

44 张术语卡和 73 个知识点不是两份需要强行合并的数据。部分内容语义对应，部分术语共享同一个深入知识点，另有少量扩展术语暂时没有旧模块内容。对应关系集中维护在 `data/content-registry.ts`，两个层级分别统计进度，不相加成“117 个知识点”。

### 7 个深入学习模块

| 模块 | 知识点数 | 主要内容 |
|---|---:|---|
| 贸易术语 | 11 | Incoterms® 2020 的责任、费用和风险边界 |
| 国际结算 | 12 | 汇付、托收、信用证、贸易融资 |
| 国际运输 | 10 | 运输方式、提单、集装箱和运费 |
| 货运保险 | 8 | 险别、保险金额、风险缺口和索赔 |
| 进出口单据 | 9 | 发票、装箱单、提单、产地证等 |
| 报关与检验 | 8 | 报关、HS 编码、完税价格和检验 |
| 合同条款 | 15 | 品质、数量、价格、装运、违约和争议解决 |

合计 73 个知识点。另有分模块场景题和 7 步全流程综合实战。

## 学习进度与数据边界

- 浏览器 `localStorage` 仍是当前读取主源，匿名用户不需要登录即可学习。
- 44 张术语卡使用 `tradelearn-term-card-progress-v1`；73 个深入知识点沿用各模块独立存储键。
- 两层进度都会旁路写入 Supabase `card_progress`，其中快速术语层使用 `module_id = term-library`。
- Supabase 当前只负责写入镜像，不从云端反向覆盖浏览器记录；因此这还不是登录后的跨设备双向同步。
- 旧浏览器记录会被保留并在页面挂载时补写到 Supabase，不会因内容入口调整而被清空。

## 功能

- 44 张术语卡：搜索、分篇章浏览、详情解释、业务场景、三档学习状态。
- 73 个深入知识点：7 个模块、四档自评、间隔复习和聚合进度。
- 显式内容映射：术语详情可继续进入对应或相关的深入知识点。
- 场景实战：分模块题目及完整外贸业务流程练习。
- 分层进度页：分别展示快速术语与深入知识点进度，避免混淆统计口径。
- 可选 GA4：记录页面浏览、术语操作、闪卡评分和练习事件。

## 技术栈

| 层面 | 技术 |
|---|---|
| 框架 | Next.js 16（App Router + Turbopack） |
| 视图 | React 19、TypeScript strict、Tailwind CSS v4 |
| 本地持久化 | localStorage |
| 匿名云端镜像 | Supabase |
| 分析 | Google Analytics 4（用户明确同意后加载） |
| 部署 | Vercel（GitHub `main` 更新后自动部署） |

## 本地运行

```bash
npm install
npm run dev -- -p 3002
npm run lint
npm run build
```

### 环境变量

复制 `.env.example` 为 `.env.local`，按需配置：

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

未配置对应变量时，GA4 或 Supabase 会静默停用，本地学习功能仍可运行。

## 主要目录

```text
app/
  page.tsx              首页
  terms-preview/        44 张快速术语卡
  learn/                73 个深入知识点的统一入口
  progress/             两层学习进度
  terms/ glossary/      术语详情
  settlement/ ...       7 个深入学习模块
  flashcards/ practice/ 复习与实战
data/
  content-registry.ts   快速术语与深入知识点映射
  term-library.ts       44 张术语卡注册表
  *-concepts.ts         73 个知识点数据
hooks/
  useTermCardProgress.ts
  useConceptProgress.ts
lib/
  supabase/progressSync.ts
  analytics.ts
```

## 尚未完成

- 登录与账号体系。
- 从 Supabase 读取并进行跨设备进度合并。
- 旧匿名设备记录与未来登录账号的归属迁移。
- 扩展术语与新模块内容的持续补全。

## 许可

MIT License
