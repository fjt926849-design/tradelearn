import type { SettlementConcept } from "@/lib/types";

export const settlementConcepts: SettlementConcept[] = [
  /* ═══════════════════════ 结算基础 ═══════════════════════ */
  {
    module: "settlement",
    id: "settlement-basics",
    title: "国际结算基础",
    englishTitle: "International Settlement Basics",
    category: "basics",
    summary:
      "国际结算是指跨国贸易中货款支付与资金清算的全部过程，是贸易术语之外国际贸易实务的第二大核心板块。",
    description:
      "在国际贸易中，卖方发货后如何收到钱、买方付款后如何确保拿到货，就是国际结算要解决的核心问题。不同的结算方式代表着卖方和买方之间的信任程度不同——信任越低，越需要银行介入提供信用担保（如信用证）；信任越高，越可以使用简单直接的方式（如电汇或赊账）。选择结算方式时，需要综合考量交易双方的信任关系、货物性质、目的地国家风险、以及所选贸易术语（Incoterms）的要求。",
    keyFeatures: [
      "国际贸易中的货款收付和资金清算过程",
      "核心权衡：交易安全 vs 交易成本 vs 操作便利性",
      "信用类型：商业信用（T/T、D/P、D/A、O/A）vs 银行信用（L/C）",
      "与 Incoterms 配合使用——不同术语对结算方式有不同偏好",
    ],
    commonMisunderstandings: [
      "以为国际结算就是简单的「跨境转账」——实际上涉及单据流转、银行信用、汇率风险、合规审查等复杂环节。",
      "以为银行会「担保」所有结算方式的交易安全——只有信用证是银行信用，其他方式银行仅提供操作服务，不承担付款责任。",
    ],
    comparisons: [],
    relatedIncotermCodes: [],
    relatedConceptIds: [],
  },

  /* ═══════════════════════ 电汇 T/T ═══════════════════════ */
  {
    module: "settlement",
    id: "tt",
    title: "电汇 T/T",
    englishTitle: "Telegraphic Transfer",
    category: "payment-method",
    summary:
      "T/T 是国际贸易实务中最常用的支付方式——买方通过银行将款项电汇给卖方，速度快、费用低，但完全依赖商业信用。",
    description:
      "电汇（Telegraphic Transfer，简称 T/T）是国际贸易中使用频率最高的支付方式。买方（进口商）通过银行将货款直接电汇至卖方（出口商）的银行账户。T/T 仅依赖买卖双方的商业信用——买方需在收到货物前或收到单据后主动付款，银行不提供任何付款保证。实务中 T/T 有几种常见的付款时间安排：前 T/T（预付全部或部分货款——对卖方最有利），后 T/T（收货后付款——对买方最有利），以及混合模式（如 30% 预付 + 70% 见提单副本后付）。T/T 速度快（通常 1-3 个工作日到账）、费用低（几十美元）、操作简单，是双方有长期合作信任关系时的首选。",
    keyFeatures: [
      "商业信用——银行仅提供转账通道，不担保付款",
      "三种付款时间：前T/T（预付）、后T/T（赊销）、混合T/T",
      "速度快（1-3天到账），费用低（几十美元）",
      "适合长期合作、互信度高的买卖双方",
      "SWIFT 系统处理，资金流向清晰可追踪",
    ],
    processSteps: [
      { order: 1, actor: "importer", actorLabel: "进口商", action: "通过银行发出电汇指令" },
      { order: 2, actor: "importer-bank", actorLabel: "进口方银行", action: "通过 SWIFT 系统发送付款报文至出口方银行" },
      { order: 3, actor: "exporter-bank", actorLabel: "出口方银行", action: "收到报文后贷记卖方账户" },
      { order: 4, actor: "exporter", actorLabel: "出口商", action: "收到款项后安排发货" },
    ],
    commonMisunderstandings: [
      "以为 T/T 和国内转账完全一样——国际电汇需要 SWIFT Code、IBAN 等信息，可能经过中转行，到账时间和费用与国内转账不同。",
      "前 T/T 下买方以为付款后卖方一定发货——实际上如果卖方不发货，买方需要自行跨国追讨，银行不承担任何责任。",
      "混淆 T/T 和 L/C——T/T 是商业信用，L/C 是银行信用。T/T 下如果买方不付款，卖方只能自行追讨。",
    ],
    comparisons: [
      {
        conceptId: "lc",
        title: "信用证 L/C",
        differences: ["T/T 是商业信用，L/C 是银行信用", "T/T 银行不担保付款，L/C 开证行承担第一性付款责任", "T/T 费用低（几十美元），L/C 费用高（千分之几+固定费用）", "T/T 操作简单，L/C 涉及单据审核和严格相符原则"],
      },
      {
        conceptId: "dp",
        title: "付款交单 D/P",
        differences: ["T/T 单据直接寄买方，D/P 单据通过银行转交", "T/T 无银行控单功能，D/P 银行代为控制货权单据直到买方付款"],
      },
    ],
    relatedIncotermCodes: ["EXW", "FCA", "FOB"],
    relatedConceptIds: [],
  },

  /* ═══════════════════════ 信用证 L/C ═══════════════════════ */
  {
    module: "settlement",
    id: "lc",
    title: "信用证 L/C",
    englishTitle: "Letter of Credit",
    category: "payment-method",
    summary:
      "信用证是银行（开证行）应买方申请开立的、承诺在卖方提交符合信用证条款的单据后付款的书面保证。银行信用替代了商业信用。",
    description:
      "信用证（Letter of Credit，简称 L/C）是国际贸易中最安全、最复杂的结算方式。它把买卖双方的商业信用转化为银行的付款承诺：只要卖方（受益人）提交的单据与信用证条款表面相符，银行就承担第一性的付款责任。信用证有三大核心原则——独立性原则（L/C 独立于基础销售合同）、严格相符原则（单据必须与 L/C 条款完全一致）、纯单据交易原则（银行只审单据不审货物）。信用证广泛用于大额交易、新客户首次交易、以及高风险国家贸易。但信用证也有缺点：费用高（开证费、通知费、议付费等）、流程长、对单据要求极其严格，任何不符点都可能导致银行拒付。国际商会 UCP 600 是信用证业务的统一惯例。",
    keyFeatures: [
      "银行信用——开证行承担第一性付款责任，是最安全的结算方式",
      "三大核心原则：独立性原则、严格相符原则、纯单据交易原则",
      "银行只审单据表面是否与 L/C 条款相符，不涉及货物本身",
      "费用高、流程长、单据要求严格",
      "适用于大额交易、新客户、高风险国家",
      "受 UCP 600 统一惯例约束",
    ],
    parties: [
      { role: "开证申请人", englishRole: "Applicant", who: "importer-side", description: "通常是进口商，向开证行申请开立信用证" },
      { role: "开证行", englishRole: "Issuing Bank", who: "bank", description: "应申请人要求开立L/C，承担第一性付款责任" },
      { role: "通知行", englishRole: "Advising Bank", who: "bank", description: "在出口商所在地，核实L/C真伪后通知受益人" },
      { role: "受益人", englishRole: "Beneficiary", who: "exporter-side", description: "通常是出口商，有权凭相符单据获得付款" },
      { role: "议付行", englishRole: "Negotiating Bank", who: "bank", description: "应受益人请求审核并购买其提交的单据（可为通知行兼）" },
      { role: "保兑行", englishRole: "Confirming Bank", who: "bank", description: "应开证行请求在L/C上加具保兑，承担与开证行相同的付款责任" },
    ],
    processSteps: [
      { order: 1, actor: "importer", actorLabel: "进口商", action: "与出口商签订销售合同，约定以 L/C 方式结算" },
      { order: 2, actor: "importer", actorLabel: "进口商", action: "向开证行申请开立信用证，填写开证申请书并缴纳保证金" },
      { order: 3, actor: "importer-bank", actorLabel: "开证行", action: "审核申请书后开立 L/C，通过 SWIFT 发送至通知行" },
      { order: 4, actor: "exporter-bank", actorLabel: "通知行", action: "核实 L/C 真伪，通知出口商（受益人）" },
      { order: 5, actor: "exporter", actorLabel: "出口商", action: "审核 L/C 条款，确认无误后安排发货", documents: ["商业发票", "装箱单"] },
      { order: 6, actor: "exporter", actorLabel: "出口商", action: "备齐全套单据，向议付行交单", documents: ["提单", "汇票", "发票", "保险单", "产地证"] },
      { order: 7, actor: "exporter-bank", actorLabel: "议付行", action: "审核单据，确认相符后向开证行寄单索汇", documents: ["全套单据"] },
      { order: 8, actor: "importer-bank", actorLabel: "开证行", action: "审核单据。如无不符点，向议付行付款/承兑；如有不符点，征询申请人意见", documents: ["全套单据"] },
      { order: 9, actor: "importer", actorLabel: "进口商", action: "付款赎单后凭提单提货", documents: ["提单"] },
    ],
    commonMisunderstandings: [
      "以为信用证保证交易「完全安全」——银行只审单据，不审货物。如果卖方伪造单据但表面相符，银行照样付款，买方可能钱货两空。",
      "以为银行会帮忙检查货物质量——纯单据交易原则下银行绝不涉及货物，货物有质量问题属于买卖双方的合同纠纷，与 L/C 无关。",
      "忽略信用证条款中的软条款——一些买方可能在 L/C 中加入对自己有利的条件（如「需申请人出具检验证后付款」），这实质上削弱了银行付款的独立性。",
      "以为所有信用证都有保兑——保兑L/C需要额外申请和费用，普通L/C只有开证行一家承担付款责任。",
    ],
    comparisons: [
      {
        conceptId: "tt",
        title: "电汇 T/T",
        differences: ["L/C 是银行信用，T/T 是商业信用", "L/C 费用高，T/T 费用低", "L/C 流程复杂，T/T 操作简单", "L/C 适合新客户/大额/高风险，T/T 适合老客户/小额/低风险"],
      },
      {
        conceptId: "dp",
        title: "付款交单 D/P",
        differences: ["L/C 是银行信用（银行担保付款），D/P 是商业信用（银行只代收）", "L/C 下银行审核单据，D/P 下银行只传递单据不审核", "L/C 适用于高风险交易，D/P 适用于中等风险交易"],
      },
    ],
    relatedIncotermCodes: ["FOB", "CFR", "CIF", "CIP"],
    relatedConceptIds: [],
  },

  /* ═══════════════════════ 付款交单 D/P ═══════════════════════ */
  {
    module: "settlement",
    id: "dp",
    title: "付款交单 D/P",
    englishTitle: "Documents against Payment",
    category: "payment-method",
    summary:
      "D/P 是托收的一种方式——卖方通过银行向买方转交单据，买方必须在付款后才能拿到单据并提货。银行代收但不担保。",
    description:
      "付款交单（Documents against Payment，简称 D/P）属于跟单托收。卖方发货后将全套货运单据（含提单等物权凭证）交给自己的银行（托收行），托收行将单据寄给买方所在地的银行（代收行），买方在支付货款后才能取得单据。由于提单是物权凭证，买方不付款就拿不到提单、提不了货——这为卖方提供了比后 T/T 更高的安全保障。但银行仅提供单据传递和代收服务，不承担付款责任。D/P 分为即期付款交单（D/P at sight——买方见单即付）和远期付款交单（D/P after sight——买方在见单后若干天付款）。注意：远期 D/P 与 D/A 不同——远期 D/P 买方仍需先付款才能拿单，D/A 买方承兑后即可拿单。整体而言 D/P 比前 T/T 更平衡双方利益，适合已有一定合作基础、但尚未建立充分信任的交易。",
    keyFeatures: [
      "商业信用——银行只代收货款和传递单据，不担保付款",
      "卖方保留货权——买方不付款就拿不到提单",
      "即期 D/P（at sight）和远期 D/P（after sight）两种",
      "卖方风险：买方到期不赎单，货物已发运，需自行处理退运或转卖",
      "受 URC 522（托收统一规则）约束",
    ],
    processSteps: [
      { order: 1, actor: "exporter", actorLabel: "出口商", action: "发货后取得提单等全套货运单据" },
      { order: 2, actor: "exporter", actorLabel: "出口商", action: "将单据和托收指示交给托收行" },
      { order: 3, actor: "exporter-bank", actorLabel: "托收行", action: "将单据寄给进口方代收行" },
      { order: 4, actor: "importer-bank", actorLabel: "代收行", action: "通知进口商付款赎单" },
      { order: 5, actor: "importer", actorLabel: "进口商", action: "付款后取得全套单据", documents: ["提单", "发票", "装箱单"] },
      { order: 6, actor: "importer-bank", actorLabel: "代收行", action: "将货款汇给托收行" },
      { order: 7, actor: "exporter-bank", actorLabel: "托收行", action: "将货款贷记卖方账户" },
    ],
    commonMisunderstandings: [
      "混淆远期 D/P 与 D/A——远期 D/P 买方必须先付款才能拿单；D/A 买方仅凭承兑即可拿单。这是卖方风险级别的关键区别。",
      "以为 D/P 下银行会审核单据——托收业务中银行只传递单据，不审核内容、不承担责任。",
      "买方以为 D/P 像 L/C 一样安全——D/P 是商业信用，银行不担保卖方发货或不伪造单据，货物质量问题也与银行无关。",
    ],
    comparisons: [
      {
        conceptId: "da",
        title: "承兑交单 D/A",
        differences: ["D/P 买方付款后才能拿单，D/A 买方承兑后即可拿单", "D/P 卖方仍控制货权直到买方付款，D/A 卖方在买方付款前已失去货权", "D/P 对卖方更安全，D/A 对买方更有利"],
      },
      {
        conceptId: "lc",
        title: "信用证 L/C",
        differences: ["D/P 是商业信用，L/C 是银行信用", "D/P 银行不审核单据，L/C 银行严格审核单据", "D/P 费用低，L/C 费用高", "D/P 适用于中等信任度交易，L/C 适用于低信任度/高风险交易"],
      },
    ],
    relatedIncotermCodes: ["FOB", "CFR", "FCA"],
    relatedConceptIds: [],
  },

  /* ═══════════════════════ 承兑交单 D/A ═══════════════════════ */
  {
    module: "settlement",
    id: "da",
    title: "承兑交单 D/A",
    englishTitle: "Documents against Acceptance",
    category: "payment-method",
    summary:
      "D/A 是托收方式中最具风险的一种——买方只需「承兑」远期汇票即可取得单据提货，卖方在买方付款前就失去了货权。",
    description:
      "承兑交单（Documents against Acceptance，简称 D/A）与 D/P 同属跟单托收，但卖方的风险大得多。卖方通过托收行寄出单据时，附带一张远期汇票。代收行提示买方在汇票上「承兑」（签字承诺到期付款）后，即将全套单据（含提单）交给买方——此时买方即可提货销售。卖方完全依赖买方到期主动付款，银行不提供任何担保。如果买方承兑提货后到期不付款，卖方面临的是「钱货两空」的局面：货物已被买方提走或转卖，卖方只剩下买方在汇票上的承兑签字，需要跨国追讨。因此 D/A 实际上是一种卖方提供的商业信用和资金融通，只适用于买卖双方有长期高度信任关系的情况。受 URC 522 约束。",
    keyFeatures: [
      "商业信用——银行只传递单据，不承担付款责任",
      "买方仅凭承兑远期汇票即可取得全套单据（包括提单）",
      "卖方在买方付款前即失去货权——风险极高的结算方式",
      "相当于卖方为买方提供了一段时间的无担保商业信用",
      "仅适用于有长期高度信任关系的买卖双方",
    ],
    processSteps: [
      { order: 1, actor: "exporter", actorLabel: "出口商", action: "发货后取得提单等单据，附远期汇票交托收行" },
      { order: 2, actor: "exporter-bank", actorLabel: "托收行", action: "寄单至代收行" },
      { order: 3, actor: "importer-bank", actorLabel: "代收行", action: "提示买方承兑远期汇票" },
      { order: 4, actor: "importer", actorLabel: "进口商", action: "在远期汇票上承兑后取得全套单据", documents: ["提单", "发票"] },
      { order: 5, actor: "importer", actorLabel: "进口商", action: "提货、销售，汇票到期时付款" },
      { order: 6, actor: "importer-bank", actorLabel: "代收行", action: "汇票到期收款后汇给托收行" },
      { order: 7, actor: "exporter-bank", actorLabel: "托收行", action: "贷记卖方账户" },
    ],
    commonMisunderstandings: [
      "与远期 D/P 混淆——远期 D/P 买方付款后才能提货；D/A 买方承兑后即可提货付款在后。这是决定卖方风险的根本区别。",
      "以为银行在 D/A 下承担了信用担保——银行仅提供托收服务，买方到期不付款时银行不承担任何责任。",
      "将 D/A 视为一种「安全的赊销」——实际上卖方货权已失、依赖买方商业信用，风险接近 O/A。",
    ],
    comparisons: [
      {
        conceptId: "dp",
        title: "付款交单 D/P",
        differences: ["D/P 买方付款后才能拿单，D/A 买方承兑后即可拿单", "D/P 卖方在买方付款前控制货权，D/A 卖方在买方付款前已失去货权", "D/A 风险远高于 D/P"],
      },
      {
        conceptId: "oa",
        title: "赊账 O/A",
        differences: ["D/A 有银行参与的托收程序，O/A 单据直接寄给买方", "D/A 最起码有买方签字的承兑汇票可作为追索依据，O/A 只有商业合同"],
      },
    ],
    relatedIncotermCodes: ["FOB", "CFR"],
    relatedConceptIds: [],
  },

  /* ═══════════════════════ 赊账 O/A ═══════════════════════ */
  {
    module: "settlement",
    id: "oa",
    title: "赊账 O/A",
    englishTitle: "Open Account",
    category: "payment-method",
    summary:
      "O/A 是卖方将货物和单据直接发给买方，买方在约定的信用期后付款。对买方最有利、对卖方最大风险。",
    description:
      "赊账（Open Account，简称 O/A）是最简单的国际结算方式，也是卖方承担风险最大的方式。卖方将货物和全套单据（含提单）直接发给买方，买方提货后在约定的信用期内（通常 30/60/90/120 天）支付货款。卖方完全依赖买方的商业信用，没有任何银行保障或保留的货权。O/A 在发达经济体之间的成熟贸易关系中非常普遍（如欧美之间的贸易约 80% 采用 O/A），但在缺乏信任的跨境交易中风险极高。为降低 O/A 的风险，可以搭配出口信用保险、国际保理、福费廷等贸易融资工具——这些内容将在后续版本中详细介绍。",
    keyFeatures: [
      "卖方完全依赖买方商业信用——风险最高的结算方式",
      "单据直接寄给买方，卖方无任何货权保留",
      "约定了信用期（30/60/90/120 天），买方可在期限内延迟付款",
      "适合长期高度信任关系、或母公司对子公司的内部交易",
      "可搭配出口信用保险、保理、福费廷来管理信用风险",
    ],
    processSteps: [
      { order: 1, actor: "exporter", actorLabel: "出口商", action: "将货物和全套单据直接发给进口商" },
      { order: 2, actor: "importer", actorLabel: "进口商", action: "提货入库" },
      { order: 3, actor: "importer", actorLabel: "进口商", action: "在约定的信用期（30-120天）结束时付款" },
    ],
    commonMisunderstandings: [
      "以为 O/A 在任何情况下都风险太大不能用——实际上发达市场之间的成熟贸易广泛使用 O/A，成本最低效率最高。关键在于对买方的信用评估。",
      "忽略搭配风险管理工具——出口信用保险和保理等工具可以有效降低 O/A 的信用风险，但需付出保险费或融资成本。",
    ],
    comparisons: [
      {
        conceptId: "tt",
        title: "电汇 T/T",
        differences: ["O/A 先发货后付款（有信用期），T/T 可预付", "O/A 无任何银行参与，T/T 通过银行转账", "O/A 对买方最有利，前 T/T 对卖方最有利"],
      },
      {
        conceptId: "da",
        title: "承兑交单 D/A",
        differences: ["O/A 单据直接寄买方，D/A 单据通过银行转交", "O/A 无银行参与，D/A 有银行托收程序", "O/A 买方无任何签字承诺，D/A 至少有买方在汇票上的承兑签字作为追索依据"],
      },
    ],
    relatedIncotermCodes: ["EXW", "FCA", "DDP"],
    relatedConceptIds: ["tt", "dp", "da", "lc"],
  },

  /* ═══════════════════════ UCP 600 ═══════════════════════ */
  {
    id: "ucp600",
    module: "settlement",
    title: "UCP 600 基础",
    englishTitle: "UCP 600 Basics",
    category: "lc-detail",
    summary: "UCP 600 是国际商会制定的信用证统一惯例，是全球 L/C 业务的「游戏规则」——银行和企业在处理信用证时必须遵守的通行准则。",
    description: "UCP 600（Uniform Customs and Practice for Documentary Credits，跟单信用证统一惯例）由国际商会（ICC）于 2007 年修订生效，是目前全球信用证业务的最核心规则，被 175 个以上国家的银行采用。UCP 600 共 39 条，规定了信用证业务中各方当事人的权利、义务与操作标准。信用证本身只需写明「受 UCP 600 约束」即可自动适用。核心条款包括：第 14 条审单标准（银行有最多 5 个银行工作日审核单据）、第 16 条不符点的处理（银行必须一次性列出全部不符点）、第 28 条保险单据要求（保险金额不低于 CIF/CIP 价值的 110%）、第 30 条容差（金额/数量/单价的 ±10% 或 ±5% 容差）。学习者不需要逐条背诵 UCP 600，但需要理解这几条核心条款在实务中如何影响单据准备和银行审单。",
    keyFeatures: [
      "国际商会 ICC 制定，2007 年生效，全球 175+ 国银行采用",
      "信用证只需注明受 UCP 600 约束即自动适用",
      "第 14 条：银行有最多 5 个银行工作日的审单时间",
      "第 16 条：银行拒付时必须一次性列出全部不符点（不能分批提出）",
      "第 28 条：L/C 下保险单据的金额至少为 CIF/CIP 价值的 110%",
    ],
    commonMisunderstandings: [
      "以为 UCP 600 是法律——UCP 600 是国际惯例而非法律，只有被信用证条款引用时才产生约束力。",
      "以为银行审单没有时限——UCP 600 第 14 条明确规定了 5 个银行工作日的上限。",
      "以为信用证必须逐条引用 UCP 600 条款——只需写明受 UCP 600 约束即可，所有 39 条自动适用。",
    ],
    comparisons: [
      {
        conceptId: "lc",
        title: "信用证 L/C",
        differences: ["UCP 600 是规则（怎么操作），L/C 是基于规则的工具（操作什么）", "UCP 600 适用于一切跟单信用证，L/C 是具体的单据"],
      },
    ],
    relatedIncotermCodes: ["CIF", "CIP", "FOB", "CFR"],
    relatedConceptIds: ["lc", "forfaiting", "factoring"],
  },

  /* ═══════════════════════ L/C 风险 ═══════════════════════ */
  {
    id: "lc-risks",
    module: "settlement",
    title: "L/C 常见风险",
    englishTitle: "L/C Risks",
    category: "lc-detail",
    summary: "信用证虽然由银行信用支撑，但并非无风险——软条款、伪造单据、开证行信用风险、汇率波动等都可能让受益人或申请人遭受损失。",
    description: "许多出口商认为「有了信用证就万无一失」——这是非常危险的想法。信用证的风险主要来自三个方面：第一，开证行信用风险——如果开证行本身实力不足或在政局不稳的国家，即使单据完全相符，银行也可能无力付款。第二，软条款风险——L/C 中可能包含非受益人能够单方面控制的条件，例如「需申请人出具检验证后付款」或「需开证行另行通知后装运」。这些条款将付款的决定权交还给了申请人，实质上削弱了银行信用的独立性。第三，伪造单据风险——银行只审单据表面是否相符，如果受益人恶意伪造单据（即使货物不存在或质量极差），银行在表面相符时照样付款，申请人可能钱货两空。风险防范需要受益人在收到 L/C 后仔细审核每一条款，对无法单方面满足的软条款坚决要求修改或删除。",
    keyFeatures: [
      "开证行信用风险：银行实力和国家风险可能导致即使单证相符也无法收款",
      "软条款风险：L/C 中非受益人可单方面控制的条件，削弱银行付款独立性",
      "伪造单据风险：银行只审单表面相符，恶意受益人可能利用此规则实施欺诈",
      "受益人应仔细审核 L/C 条款，对软条款要求修改或删除",
    ],
    commonMisunderstandings: [
      "以为有了 L/C 就绝对安全——三大风险（银行信用、软条款、伪造单据）让 L/C 并非 100% 保证。",
      "忽视了审证环节——出口商收到 L/C 后的第一件事不是发货，而是逐条审核 L/C 条款是否可接受。",
      "以为保兑 L/C 消除了所有风险——保兑只解决了开证行信用风险，软条款和伪造单据风险依然存在。",
    ],
    comparisons: [
      {
        conceptId: "lc",
        title: "信用证 L/C",
        differences: ["L/C 是工具和机制，L/C 风险是使用该工具时需要注意的实务陷阱", "了解风险是正确使用 L/C 的前提，而非否定 L/C 的价值"],
      },
    ],
    relatedIncotermCodes: ["FOB", "CFR", "CIF"],
    relatedConceptIds: ["lc", "ucp600"],
  },

  /* ═══════════════════════ 贸易融资 — 福费廷 ═══════════════════════ */
  {
    id: "forfaiting",
    module: "settlement",
    title: "福费廷",
    englishTitle: "Forfaiting",
    category: "trade-finance",
    summary: "福费廷是出口商将远期应收账款（通常由银行承兑的汇票或本票）无追索权地卖给包买商，提前获得现款的一种中长期贸易融资方式。",
    description: "福费廷（Forfaiting）源自法语「à forfait」，意为「放弃权利」。出口商在发运大型设备或大宗商品后，持有由进口方银行承兑或担保的远期票据（通常 6 个月至 5 年）。出口商可以将这些票据无追索权地卖给福费廷包买商（通常是国际大银行），立即获得现金，同时将进口商的信用风险、国家风险、汇率风险全部转移给包买商。对出口商最大的好处是「无追索权」——包买商买入票据后，即使到期进口商或担保银行不付款，也不能向出口商追索。福费廷常用于大型设备出口和项目融资，费用通常高于保理但结构更灵活。在中国，中国出口信用保险公司（Sinosure）的保单常与福费廷搭配使用。",
    keyFeatures: [
      "无追索权融资——包买商承担全部信用风险和国家风险",
      "适用于中长期应收账款（6 个月至 5 年或更长）",
      "通常要求票据由进口方银行承兑或担保",
      "常用于大型设备出口、项目融资",
      "费用结构：贴现息 + 承诺费 + 宽限期利息",
    ],
    commonMisunderstandings: [
      "与保理混淆——保理通常针对短期应收账款（90 天内），福费廷针对中长期（半年以上）；保理服务更多样（含账款管理、催收），福费廷主要是无追索权买断。",
      "以为所有远期应收款都可以福费廷——福费廷通常要求有银行信用支持（如银行承兑汇票、银行保函），纯商业信用的应收款很难获得福费廷融资。",
    ],
    comparisons: [
      {
        conceptId: "factoring",
        title: "国际保理",
        differences: ["福费廷针对中长期（6月-5年+），保理针对短期（通常90天内）", "福费廷通常需要银行信用支撑，保理可仅依靠买方商业信用", "福费廷是单纯的融资买断，保理还包含账款管理、催收、坏账担保等综合服务"],
      },
    ],
    relatedIncotermCodes: ["FOB", "CFR", "CIF"],
    relatedConceptIds: ["lc", "factoring", "bank-guarantee"],
  },

  /* ═══════════════════════ 贸易融资 — 保理 ═══════════════════════ */
  {
    id: "factoring",
    module: "settlement",
    title: "国际保理",
    englishTitle: "International Factoring",
    category: "trade-finance",
    summary: "保理是出口商将应收账款卖给保理商，由保理商提供账款管理、催收、坏账担保和融资的综合金融服务——特别适合 O/A 赊销方式下的信用风险管理。",
    description: "国际保理（International Factoring）是为以赊销（O/A）方式结算的出口商提供的一站式金融服务。出口商发货后将应收账款转让给出口保理商，出口保理商再通过进口国的进口保理商进行账款催收和信用评估。保理的核心价值在于：第一，坏账担保——保理商对核准额度内的应收账款承担 100% 的坏账担保（无追索权保理）；第二，账款催收——保理商在进口国当地进行催收，效率远高于出口商跨国追讨；第三，融资——出口商可在发货后立即获得发票金额 80%-90% 的预付款。保理特别适合：O/A 赊销方式的出口商、面向发达市场的中小企业、希望释放被应收账款占用的流动资金的成长型企业。",
    keyFeatures: [
      "综合金融服务：融资 + 账款管理 + 催收 + 坏账担保",
      "无追索权保理：保理商承担核准额度内的买方信用风险",
      "通常与 O/A 赊销方式配合使用，降低赊销的信用风险",
      "出口商发货后可获发票金额 80%-90% 的预付款",
      "双保理模式（出口保理商 + 进口保理商）是国际保理的典型结构",
    ],
    commonMisunderstandings: [
      "以为保理商担保所有应收账款——保理商只担保其「核准额度」内的应收款，超额部分或未经核准的买方仍由出口商自担风险。",
      "以为保理只适用于大公司——保理非常适合中小企业，因为保理商评估的是买方的信用而非出口商自身的财务实力。",
    ],
    comparisons: [
      {
        conceptId: "forfaiting",
        title: "福费廷",
        differences: ["保理针对短期（90天内），福费廷针对中长期（半年以上）", "保理提供综合服务（融资+催收+担保），福费廷主要是买断融资", "保理可不要银行信用支持，福费廷通常需要银行信用背书"],
      },
      {
        conceptId: "oa",
        title: "赊账 O/A",
        differences: ["保理是管理 O/A 风险的金融工具——保理不是结算方式，而是配合 O/A 使用的风险管理手段", "O/A 下无保理时卖方完全自担信用风险，使用保理后可将核准额度内的买方信用风险转移给保理商"],
      },
    ],
    relatedIncotermCodes: ["FCA", "FOB", "DDP"],
    relatedConceptIds: ["oa", "forfaiting", "packing-loan"],
  },

  /* ═══════════════════════ 贸易融资 — 打包贷款 ═══════════════════════ */
  {
    id: "packing-loan",
    module: "settlement",
    title: "打包贷款",
    englishTitle: "Packing Loan / Pre-shipment Finance",
    category: "trade-finance",
    summary: "打包贷款是出口商收到信用证后，在发货前以 L/C 正本为抵押向银行申请的一种装船前融资——用于采购、生产、包装等环节的资金周转。",
    description: "打包贷款（Packing Loan，也称装船前融资 / Pre-shipment Finance）专为持有信用证的出口商设计。出口商在收到买方开来的信用证后，发货前需要资金用于采购原料、组织生产、包装货物等——此时可以 L/C 正本为抵押，向银行申请打包贷款。贷款金额通常为 L/C 金额的 70%-80%，期限覆盖从贷款发放到交单议付的时间（通常 3-6 个月）。出口商用后续的 L/C 议付/付款来还款——即银行「贷前」→出口商「生产发货」→「交单议付」→银行「扣款还贷」。打包贷款的风险在于：如果出口商拿到贷款后不能按 L/C 要求发货并提交相符单据，银行无法通过 L/C 渠道收回贷款，只能向出口商追讨。因此银行通常会严格审核出口商的履约能力和信用状况。",
    keyFeatures: [
      "装船前融资——用于发货前的采购、生产、包装环节",
      "以 L/C 正本为抵押，贷款金额通常为 L/C 金额的 70%-80%",
      "期限覆盖从贷款到 L/C 议付的时间（通常 3-6 个月）",
      "还款来源是后续的 L/C 议付/付款",
      "实质是银行的信用风险放贷 + L/C 的支付保障结合",
    ],
    commonMisunderstandings: [
      "以为有 L/C 银行就一定给打包贷款——银行还要审核出口商的履约能力和历史记录，并非有 L/C 就自动获批。",
      "与出口押汇混淆——打包贷款是装船前融资（用于生产备货），出口押汇是装船后融资（交单后的贴现）。时间点完全不同。",
    ],
    comparisons: [
      {
        conceptId: "forfaiting",
        title: "福费廷",
        differences: ["打包贷款在装船前，福费廷在装船后", "打包贷款以 L/C 为抵押且有追索权，福费廷买断票据无追索权", "打包贷款用于生产备货，福费廷用于应收账款变现"],
      },
    ],
    relatedIncotermCodes: ["FOB", "CFR", "CIF"],
    relatedConceptIds: ["lc", "forfaiting"],
  },

  /* ═══════════════════════ 贸易融资 — 银行保函 ═══════════════════════ */
  {
    id: "bank-guarantee",
    module: "settlement",
    title: "银行保函",
    englishTitle: "Bank Guarantee",
    category: "trade-finance",
    summary: "银行保函是银行应申请人请求开立的、承诺在受益人提出相符索赔时付款的书面保证——广泛用于投标、履约、预付款、质量保证等国际贸易各环节。",
    description: "银行保函（Bank Guarantee）与信用证类似，都是银行信用的体现，但用途更广泛。信用证主要用于「正常履约」下的付款（卖方交单→银行付款），保函主要用于「违约救济」下的付款（申请人违约→受益人索赔→银行付款）。常见类型：投标保函（保证投标人中标后不撤标）、履约保函（保证卖方按合同履约）、预付款保函（保证卖方收到预付款后按约发货）、质量保函（保证质保期内出现问题卖方负责）、以及付款保函（保证买方按约付款）。保函的核心特征是「见索即付」——受益人只需提交书面索赔声明，银行即应付款，无需证明申请人确实违约。这一特征使保函对受益人非常有利，同时也要求申请人对受益人有充分信任。保函与备用信用证功能相似但法律基础不同：保函受国际商会 URDG 758 约束，备用 L/C 受 UCP 600 或 ISP98 约束。",
    keyFeatures: [
      "银行信用——银行在申请人违约时承担付款责任",
      "见索即付——受益人只需提交索赔声明即可获得付款",
      "广泛用于投标、履约、预付款、质量保证等非直接付款场景",
      "与 L/C 互补：L/C 用于正常履约付款，保函用于违约救济",
      "受 URDG 758（见索即付保函统一规则）约束",
    ],
    commonMisunderstandings: [
      "以为银行保函和信用证可以互相替代——L/C 用于正常履约下付款（卖方交单→付款），保函用于违约下付款（卖方不履约→赔偿），二者是互补关系。",
      "以为保函下银行会审查违约事实——见索即付保函下银行仅审查索赔书表面是否符合保函条款，不审查申请人是否真的违约。",
    ],
    comparisons: [
      {
        conceptId: "lc",
        title: "信用证 L/C",
        differences: ["L/C 用于正常履约付款，保函用于违约救济", "L/C 要求提交货运单据，保函通常只需提交索赔书", "L/C 受 UCP 600 约束，保函受 URDG 758 约束"],
      },
    ],
    relatedIncotermCodes: ["FOB", "CFR", "CIF", "DDP"],
    relatedConceptIds: ["lc", "forfaiting", "packing-loan"],
  },
];

export function getSettlementConceptById(id: string): SettlementConcept | undefined {
  return settlementConcepts.find((c) => c.id === id);
}
