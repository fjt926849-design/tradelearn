/**
 * 《国际贸易实务》第七版的跨章节专业词汇。
 *
 * 这些词汇与 Incoterms® 11 个术语分开维护，避免把不同类型的知识
 * 混进同一套间隔复习进度。定义为独立改写的学习提示，不直接复制教材原文。
 */
export interface TradeGlossaryEntry {
  id: string;
  chapterId: string;
  chapterLabel: string;
  group: "贸易术语" | "合同" | "运输" | "保险" | "价格" | "结算" | "谈判" | "贸易方式" | "跨境电商";
  term: string;
  english: string;
  definition: string;
  usage: string;
  relatedRoute?: string;
}

export const tradeGlossary: TradeGlossaryEntry[] = [
  { id: "ch02-risk-transfer", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "风险转移", english: "Transfer of Risk", definition: "货物发生灭失或损坏的风险从卖方转移给买方的时间点。", usage: "先确认风险转移点，再判断运输途中损失由谁承担；风险点不一定等于费用支付到的地点。" },
  { id: "ch02-cost-point", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "费用承担点", english: "Cost Allocation Point", definition: "买卖双方按照术语约定分别承担运输、装卸、保险和清关费用的分界。", usage: "报价时把费用截止地点写完整，不能仅写‘运费已付’而不写目的地。" },
  { id: "ch02-delivery-place", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "交货地点", english: "Place of Delivery", definition: "卖方完成交货、买方取得对货物处置权的约定地点。", usage: "合同应同时写明具体地点和版本，‘某港口’等模糊表述可能导致责任争议。" },
  { id: "ch02-named-place", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "指定地点", english: "Named Place", definition: "贸易术语后面标注的具体地点，用来确定交货、风险或费用边界。", usage: "同一术语更换地点，卖方承担的内陆运输和装卸责任可能完全不同。" },
  { id: "ch02-first-carrier", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "第一承运人", english: "First Carrier", definition: "在多式联运中最先接收货物并承担运输责任的承运人。", usage: "CPT/CIP 的风险通常在货交第一承运人时转移，而不是到达最终目的地时。" },
  { id: "ch02-main-carriage", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "主运费", english: "Main Carriage", definition: "连接起运地与目的地、通常占国际运输成本主要部分的干线运输费用。", usage: "C 组术语由卖方支付主运费，但不代表卖方承担运输全程风险。" },
  { id: "ch02-loading", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "装船", english: "Loading on Board", definition: "货物被装上指定船舶并完成船上交货的动作。", usage: "FOB/CFR/CIF 的海运风险转移以装船为关键节点，不再使用‘越过船舷’表述。" },
  { id: "ch02-unloading", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "卸货", english: "Unloading", definition: "把货物从运输工具上卸下并交由买方或其指定方处置的动作。", usage: "DAP 不要求卖方卸货，DPU 则要求卖方在目的地完成卸货。" },
  { id: "ch02-container-carriage", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "集装箱运输", english: "Containerized Transport", definition: "以集装箱作为装载单元进行装箱、交接和多式联运的运输方式。", usage: "集装箱海运通常应优先评估 FCA，而不是把 FOB 当作通用海运术语。" },
  { id: "ch02-multimodal", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "多式联运", english: "Multimodal Transport", definition: "使用两种或以上运输方式完成一票货物全程运输的安排。", usage: "选择 CPT/CIP 等适用任何运输方式的术语，并确认风险在第一承运人处转移。" },
  { id: "compare-fob-fca", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "FOB vs FCA", english: "FOB vs FCA", definition: "FOB 仅适用于海运或内河水运，FCA 适用于任何运输方式。", usage: "集装箱交给码头或承运人时通常选 FCA；散货在船上交货时才考虑 FOB。" },
  { id: "compare-cfr-cpt", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "CFR vs CPT", english: "CFR vs CPT", definition: "两者都由卖方支付主运费，但 CFR 仅限海运且风险在装船时转移，CPT 适用于任何运输方式且风险在交给第一承运人时转移。", usage: "先看运输方式和实际交接节点，再决定使用 CFR 还是 CPT。" },
  { id: "compare-cif-cip", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "CIF vs CIP", english: "CIF vs CIP", definition: "两者都包含卖方投保，但 CIF 仅限海运，CIP 适用于任何运输方式且通常要求更高保险保障。", usage: "集装箱或多式联运优先评估 CIP，并在合同中写明保险范围和金额。" },
  { id: "compare-dap-dpu", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "DAP vs DPU", english: "DAP vs DPU", definition: "DAP 在目的地运输工具上交货，卖方不负责卸货；DPU 要求卖方在目的地完成卸货。", usage: "如果目的地卸货设备或操作由卖方安排，应明确使用 DPU 并确认卸货风险。" },
  { id: "compare-dap-ddp", chapterId: "ch-02", chapterLabel: "第2章", group: "贸易术语", term: "DAP vs DDP", english: "DAP vs DDP", definition: "DAP 下买方负责进口报关和税费，DDP 下卖方负责进口报关、关税和相关手续。", usage: "卖方在目的国没有进口资质或税务能力时，不要轻易承诺 DDP。" },
  { id: "ch04-quality-clause", chapterId: "ch-04", chapterLabel: "第4章", group: "合同", term: "品质条款", english: "Quality Clause", definition: "约定货物质量、规格、等级和检验依据的合同条款。", usage: "把可检验的指标、标准版本和允许偏差写清楚，避免只写‘符合样品’。", relatedRoute: "/contract/quality-clause" },
  { id: "ch04-quantity-tolerance", chapterId: "ch-04", chapterLabel: "第4章", group: "合同", term: "数量机动幅度", english: "Quantity Tolerance", definition: "允许实际交货数量在约定数量上下浮动的范围。", usage: "散装货或受装载条件影响的货物，应同时约定幅度和溢短装计价方式。", relatedRoute: "/contract/quantity-clause" },
  { id: "ch04-shipping-mark", chapterId: "ch-04", chapterLabel: "第4章", group: "合同", term: "运输标志", english: "Shipping Mark", definition: "外包装上用于识别收发货人、目的地和件号的标记。", usage: "应与单据、箱唛和目的港要求一致，避免清关或提货时无法识别。", relatedRoute: "/contract/packaging-clause" },
  { id: "ch04-neutral-packing", chapterId: "ch-04", chapterLabel: "第4章", group: "合同", term: "定牌与中性包装", english: "Private Label & Neutral Packing", definition: "按买方品牌生产或不显示生产商信息的包装安排。", usage: "在合同中确认商标授权、包装责任和知识产权风险。", relatedRoute: "/contract/packaging-clause" },
  { id: "ch05-liner", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "班轮运输", english: "Liner Service", definition: "按固定航线、港口和班期提供的公共承运服务。", usage: "订舱时要核对截关时间、免费用箱期和目的港费用。", relatedRoute: "/transport/sea-freight" },
  { id: "ch05-charter", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "租船运输", english: "Charter Transport", definition: "通过租赁船舶全部或部分舱位完成运输的方式。", usage: "大宗货物常用，应重点确认装卸费用、滞期费和速遣费。", relatedRoute: "/transport/charter" },
  { id: "ch05-partial-shipment", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "分批装运", english: "Partial Shipment", definition: "把同一合同项下货物分成两批或以上装运。", usage: "信用证或合同未允许分批时，实际分批可能造成单据不符。", relatedRoute: "/transport/shipment-terms" },
  { id: "ch05-transshipment", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "转运", english: "Transshipment", definition: "货物在运输途中从一种船舶或运输工具转到另一种上。", usage: "确认航线和信用证是否允许转运，避免承运安排与单据要求冲突。", relatedRoute: "/transport/shipment-terms" },
  { id: "ch05-clean-bl", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "清洁提单", english: "Clean Bill of Lading", definition: "承运人未在提单上批注货物或包装有明显缺陷的提单。", usage: "信用证通常要求清洁已装船提单，装运前要处理包装破损等问题。", relatedRoute: "/documents/bill-of-lading" },
  { id: "ch05-on-board-bl", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "已装船提单", english: "On-board Bill of Lading", definition: "表明货物已经装上指定船舶的运输单据。", usage: "与收货备妥或收货待运提单区分，信用证审单时要核对装船批注。", relatedRoute: "/documents/bill-of-lading" },
  { id: "ch06-general-average", chapterId: "ch-06", chapterLabel: "第6章", group: "保险", term: "共同海损", english: "General Average", definition: "为共同安全有意、合理牺牲或支出的费用，由受益各方按比例分摊。", usage: "发生共同海损后要保存船东通知、海损担保和货损证明。", relatedRoute: "/insurance/general-average" },
  { id: "ch06-particular-average", chapterId: "ch-06", chapterLabel: "第6章", group: "保险", term: "单独海损", english: "Particular Average", definition: "仅由受损货物一方承担的部分损失，不涉及全体共同分摊。", usage: "判断能否索赔时，要结合承保险别、免赔额和损失原因。", relatedRoute: "/insurance/particular-average" },
  { id: "ch06-icc-a", chapterId: "ch-06", chapterLabel: "第6章", group: "保险", term: "ICC(A) 条款", english: "Institute Cargo Clauses (A)", definition: "覆盖范围较广的货物运输保险条款，仍受除外责任和免赔约定限制。", usage: "不要把‘一切险’理解为任何原因都赔，必须阅读除外责任。", relatedRoute: "/insurance/icc-clauses" },
  { id: "ch06-icc-c", chapterId: "ch-06", chapterLabel: "第6章", group: "保险", term: "ICC(C) 条款", english: "Institute Cargo Clauses (C)", definition: "以列明风险为主的基础货物运输保险保障。", usage: "CIF 默认最低保障通常与其相关，合同若需更高保障应另行写明。", relatedRoute: "/insurance/icc-clauses" },
  { id: "ch07-commission", chapterId: "ch-07", chapterLabel: "第7章", group: "价格", term: "佣金", english: "Commission", definition: "按成交金额或数量支付给中间商、代理商的报酬。", usage: "明确含佣价或净价、佣金率和计佣基数，避免报价口径不一致。", relatedRoute: "/contract/price-clause" },
  { id: "ch07-discount", chapterId: "ch-07", chapterLabel: "第7章", group: "价格", term: "折扣", english: "Discount", definition: "卖方根据数量、客户关系或付款条件对基础价格作出的减让。", usage: "区分商业折扣、数量折扣和现金折扣，并写明适用条件。", relatedRoute: "/contract/price-clause" },
  { id: "ch07-price-adjustment", chapterId: "ch-07", chapterLabel: "第7章", group: "价格", term: "价格调整条款", english: "Price Adjustment Clause", definition: "在长期或分批交货合同中，根据成本、汇率或指数变化调整价格的约定。", usage: "约定触发阈值、计算公式、通知方式和调整上限。", relatedRoute: "/contract/price-clause" },
  { id: "ch08-dp", chapterId: "ch-08", chapterLabel: "第8章", group: "结算", term: "付款交单", english: "Documents against Payment (D/P)", definition: "银行凭付款条件向进口商交付代表货物的单据。", usage: "D/P at sight 与远期 D/P 的风险不同，必须写明付款期限。", relatedRoute: "/settlement/documents-against-payment" },
  { id: "ch08-da", chapterId: "ch-08", chapterLabel: "第8章", group: "结算", term: "承兑交单", english: "Documents against Acceptance (D/A)", definition: "进口商承兑远期汇票后即可取得单据，付款在未来到期日发生。", usage: "卖方承担买方到期不付款的信用风险，需审慎评估客户资信。", relatedRoute: "/settlement/documents-against-acceptance" },
  { id: "ch08-discrepancy", chapterId: "ch-08", chapterLabel: "第8章", group: "结算", term: "不符点", english: "Discrepancy", definition: "交单单据与信用证条款或适用规则不一致的项目。", usage: "审单应逐项核对金额、日期、当事人、货描和运输条款。", relatedRoute: "/settlement/letter-of-credit" },
  { id: "ch08-confirmed-lc", chapterId: "ch-08", chapterLabel: "第8章", group: "结算", term: "保兑信用证", english: "Confirmed Letter of Credit", definition: "除开证行外，另一家银行对信用证承担独立付款承诺。", usage: "用于降低开证行或开证国家风险，但会增加银行费用。", relatedRoute: "/settlement/letter-of-credit" },
  { id: "ch09-inspection-certificate", chapterId: "ch-09", chapterLabel: "第9章", group: "合同", term: "检验证书", english: "Inspection Certificate", definition: "由约定检验机构出具、证明货物质量或数量状况的文件。", usage: "合同要写清签发机构、检验时间地点和证书效力。", relatedRoute: "/customs/inspection-certificate" },
  { id: "ch10-force-majeure", chapterId: "ch-10", chapterLabel: "第10章", group: "合同", term: "不可抗力", english: "Force Majeure", definition: "在合同订立后发生、当事人不能合理预见或控制并影响履约的事件。", usage: "通知、举证和减损义务通常同样重要，不能只发一封免责邮件。", relatedRoute: "/contract/force-majeure" },
  { id: "ch10-arbitration", chapterId: "ch-10", chapterLabel: "第10章", group: "合同", term: "仲裁条款", english: "Arbitration Clause", definition: "约定争议提交特定仲裁机构、仲裁地、语言和规则解决的条款。", usage: "机构、地点和适用规则要明确，否则可能先发生管辖权争议。", relatedRoute: "/contract/dispute-resolution" },
  { id: "ch11-inquiry", chapterId: "ch-11", chapterLabel: "第11章", group: "谈判", term: "询盘", english: "Inquiry", definition: "买方或其代理向卖方询问价格、规格、交期等交易条件的表示。", usage: "询盘通常不等于具有约束力的发盘，回复时要先补齐关键信息。", relatedRoute: "/contract/inquiry" },
  { id: "ch11-offer", chapterId: "ch-11", chapterLabel: "第11章", group: "谈判", term: "发盘", english: "Offer", definition: "向特定对象提出、内容足够确定并愿意受其约束的交易条件。", usage: "有效期、数量、价格和撤回规则要明确，避免被误解为最终承诺。", relatedRoute: "/contract/offer" },
  { id: "ch11-counteroffer", chapterId: "ch-11", chapterLabel: "第11章", group: "谈判", term: "还盘", english: "Counteroffer", definition: "受盘人对原发盘条件作出实质性修改后提出的新条件。", usage: "还盘可能使原发盘失效，邮件标题和版本留痕很重要。", relatedRoute: "/contract/offer" },
  { id: "ch11-acceptance", chapterId: "ch-11", chapterLabel: "第11章", group: "谈判", term: "接受", english: "Acceptance", definition: "受盘人以明确方式同意发盘全部条件的意思表示。", usage: "‘原则同意’或附加新条件可能不是有效接受，而是新的还盘。", relatedRoute: "/contract/contract-formation" },
  { id: "ch15-exclusive-distribution", chapterId: "ch-15", chapterLabel: "第15章", group: "贸易方式", term: "独家经销", english: "Exclusive Distribution", definition: "供应商在约定区域内只指定一个经销商销售商品的渠道安排。", usage: "要配套最低采购量、区域边界和终止条件。", relatedRoute: "/contract/distribution" },
  { id: "ch15-exclusive-agency", chapterId: "ch-15", chapterLabel: "第15章", group: "贸易方式", term: "独家代理", english: "Exclusive Agency", definition: "代理人在约定区域内享有代表委托人促成交易的排他性或优先权。", usage: "明确代理权限、佣金、客户归属和是否允许委托人直销。", relatedRoute: "/contract/agency" },
  { id: "ch18-hedging", chapterId: "ch-18", chapterLabel: "第18章", group: "贸易方式", term: "套期保值", english: "Hedging", definition: "通过期货等衍生工具对冲现货价格波动风险的安排。", usage: "先确认风险方向、合约月份和基差风险，再设定保证金上限。" },
  { id: "ch21-cross-border-b2c", chapterId: "ch-21", chapterLabel: "第21章", group: "跨境电商", term: "跨境 B2C", english: "Cross-border B2C", definition: "企业通过平台或独立站直接向境外消费者销售商品的模式。", usage: "定价要同时考虑平台费、支付费、物流、税费和售后成本。" },
  { id: "ch22-overseas-warehouse", chapterId: "ch-22", chapterLabel: "第22章", group: "跨境电商", term: "海外仓", english: "Overseas Warehouse", definition: "把货物提前存放在目标市场仓库，再完成本地配送和售后的履约方式。", usage: "要评估库存周转、仓储费、退货处理和当地合规责任。" },
];

export const glossaryGroups = ["全部", "贸易术语", "合同", "运输", "保险", "价格", "结算", "谈判", "贸易方式", "跨境电商"] as const;
