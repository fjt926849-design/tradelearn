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
  group: "合同" | "运输" | "保险" | "价格" | "结算" | "谈判" | "贸易方式" | "跨境电商";
  term: string;
  english: string;
  definition: string;
  usage: string;
  relatedRoute?: string;
  summary: string;
  detailedDefinition: string;
  practicalUse: string;
  scenario: string;
  keyPoints: string[];
  commonMistakes: string[];
  relatedIds?: string[];
}

type TradeGlossaryBaseEntry = Omit<
  TradeGlossaryEntry,
  "summary" | "detailedDefinition" | "practicalUse" | "scenario" | "keyPoints" | "commonMistakes" | "relatedIds"
>;

const baseTradeGlossary: TradeGlossaryBaseEntry[] = [
  { id: "ch04-quality-clause", chapterId: "ch-04", chapterLabel: "第4章", group: "合同", term: "品质条款", english: "Quality Clause", definition: "约定货物质量、规格、等级和检验依据的合同条款。", usage: "把可检验的指标、标准版本和允许偏差写清楚，避免只写‘符合样品’。", relatedRoute: "/contract/quality-clause" },
  { id: "ch04-quantity-tolerance", chapterId: "ch-04", chapterLabel: "第4章", group: "合同", term: "数量机动幅度", english: "Quantity Tolerance", definition: "允许实际交货数量在约定数量上下浮动的范围。", usage: "散装货或受装载条件影响的货物，应同时约定幅度和溢短装计价方式。", relatedRoute: "/contract/quantity-clause" },
  { id: "ch04-shipping-mark", chapterId: "ch-04", chapterLabel: "第4章", group: "合同", term: "运输标志", english: "Shipping Mark", definition: "外包装上用于识别收发货人、目的地和件号的标记。", usage: "应与单据、箱唛和目的港要求一致，避免清关或提货时无法识别。", relatedRoute: "/contract/packaging-clause" },
  { id: "ch04-neutral-packing", chapterId: "ch-04", chapterLabel: "第4章", group: "合同", term: "定牌与中性包装", english: "Private Label & Neutral Packing", definition: "按买方品牌生产或不显示生产商信息的包装安排。", usage: "在合同中确认商标授权、包装责任和知识产权风险。", relatedRoute: "/contract/packing-clause" },
  { id: "ch05-liner", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "班轮运输", english: "Liner Service", definition: "按固定航线、港口和班期提供的公共承运服务。", usage: "订舱时要核对截关时间、免费用箱期和目的港费用。", relatedRoute: "/transport/sea-freight" },
  { id: "ch05-charter", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "租船运输", english: "Charter Transport", definition: "通过租赁船舶全部或部分舱位完成运输的方式。", usage: "大宗货物常用，应重点确认装卸费用、滞期费和速遣费。", relatedRoute: "/transport" },
  { id: "ch05-partial-shipment", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "分批装运", english: "Partial Shipment", definition: "把同一合同项下货物分成两批或以上装运。", usage: "信用证或合同未允许分批时，实际分批可能造成单据不符。", relatedRoute: "/transport" },
  { id: "ch05-transshipment", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "转运", english: "Transshipment", definition: "货物在运输途中从一种船舶或运输工具转到另一种上。", usage: "确认航线和信用证是否允许转运，避免承运安排与单据要求冲突。", relatedRoute: "/transport" },
  { id: "ch05-clean-bl", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "清洁提单", english: "Clean Bill of Lading", definition: "承运人未在提单上批注货物或包装有明显缺陷的提单。", usage: "信用证通常要求清洁已装船提单，装运前要处理包装破损等问题。", relatedRoute: "/documents/bill-of-lading-doc" },
  { id: "ch05-on-board-bl", chapterId: "ch-05", chapterLabel: "第5章", group: "运输", term: "已装船提单", english: "On-board Bill of Lading", definition: "表明货物已经装上指定船舶的运输单据。", usage: "与收货备妥或收货待运提单区分，信用证审单时要核对装船批注。", relatedRoute: "/documents/bill-of-lading-doc" },
  { id: "ch06-general-average", chapterId: "ch-06", chapterLabel: "第6章", group: "保险", term: "共同海损", english: "General Average", definition: "为共同安全有意、合理牺牲或支出的费用，由受益各方按比例分摊。", usage: "发生共同海损后要保存船东通知、海损担保和货损证明。", relatedRoute: "/insurance" },
  { id: "ch06-particular-average", chapterId: "ch-06", chapterLabel: "第6章", group: "保险", term: "单独海损", english: "Particular Average", definition: "仅由受损货物一方承担的部分损失，不涉及全体共同分摊。", usage: "判断能否索赔时，要结合承保险别、免赔额和损失原因。", relatedRoute: "/insurance" },
  { id: "ch06-icc-a", chapterId: "ch-06", chapterLabel: "第6章", group: "保险", term: "ICC(A) 条款", english: "Institute Cargo Clauses (A)", definition: "覆盖范围较广的货物运输保险条款，仍受除外责任和免赔约定限制。", usage: "不要把‘一切险’理解为任何原因都赔，必须阅读除外责任。", relatedRoute: "/insurance/insurance-coverage" },
  { id: "ch06-icc-c", chapterId: "ch-06", chapterLabel: "第6章", group: "保险", term: "ICC(C) 条款", english: "Institute Cargo Clauses (C)", definition: "以列明风险为主的基础货物运输保险保障。", usage: "CIF 默认最低保障通常与其相关，合同若需更高保障应另行写明。", relatedRoute: "/insurance/insurance-coverage" },
  { id: "ch07-commission", chapterId: "ch-07", chapterLabel: "第7章", group: "价格", term: "佣金", english: "Commission", definition: "按成交金额或数量支付给中间商、代理商的报酬。", usage: "明确含佣价或净价、佣金率和计佣基数，避免报价口径不一致。", relatedRoute: "/contract/price-clause" },
  { id: "ch07-discount", chapterId: "ch-07", chapterLabel: "第7章", group: "价格", term: "折扣", english: "Discount", definition: "卖方根据数量、客户关系或付款条件对基础价格作出的减让。", usage: "区分商业折扣、数量折扣和现金折扣，并写明适用条件。", relatedRoute: "/contract/price-clause" },
  { id: "ch07-price-adjustment", chapterId: "ch-07", chapterLabel: "第7章", group: "价格", term: "价格调整条款", english: "Price Adjustment Clause", definition: "在长期或分批交货合同中，根据成本、汇率或指数变化调整价格的约定。", usage: "约定触发阈值、计算公式、通知方式和调整上限。", relatedRoute: "/contract/price-clause" },
  { id: "ch08-dp", chapterId: "ch-08", chapterLabel: "第8章", group: "结算", term: "付款交单", english: "Documents against Payment (D/P)", definition: "银行凭付款条件向进口商交付代表货物的单据。", usage: "D/P at sight 与远期 D/P 的风险不同，必须写明付款期限。", relatedRoute: "/settlement/dp" },
  { id: "ch08-da", chapterId: "ch-08", chapterLabel: "第8章", group: "结算", term: "承兑交单", english: "Documents against Acceptance (D/A)", definition: "进口商承兑远期汇票后即可取得单据，付款在未来到期日发生。", usage: "卖方承担买方到期不付款的信用风险，需审慎评估客户资信。", relatedRoute: "/settlement/da" },
  { id: "ch08-discrepancy", chapterId: "ch-08", chapterLabel: "第8章", group: "结算", term: "不符点", english: "Discrepancy", definition: "交单单据与信用证条款或适用规则不一致的项目。", usage: "审单应逐项核对金额、日期、当事人、货描和运输条款。", relatedRoute: "/settlement/lc" },
  { id: "ch08-confirmed-lc", chapterId: "ch-08", chapterLabel: "第8章", group: "结算", term: "保兑信用证", english: "Confirmed Letter of Credit", definition: "除开证行外，另一家银行对信用证承担独立付款承诺。", usage: "用于降低开证行或开证国家风险，但会增加银行费用。", relatedRoute: "/settlement/lc" },
  { id: "ch09-inspection-certificate", chapterId: "ch-09", chapterLabel: "第9章", group: "合同", term: "检验证书", english: "Inspection Certificate", definition: "由约定检验机构出具、证明货物质量或数量状况的文件。", usage: "合同要写清签发机构、检验时间地点和证书效力。", relatedRoute: "/customs/inspection-basics" },
  { id: "ch10-force-majeure", chapterId: "ch-10", chapterLabel: "第10章", group: "合同", term: "不可抗力", english: "Force Majeure", definition: "在合同订立后发生、当事人不能合理预见或控制并影响履约的事件。", usage: "通知、举证和减损义务通常同样重要，不能只发一封免责邮件。", relatedRoute: "/contract/force-majeure" },
  { id: "ch10-arbitration", chapterId: "ch-10", chapterLabel: "第10章", group: "合同", term: "仲裁条款", english: "Arbitration Clause", definition: "约定争议提交特定仲裁机构、仲裁地、语言和规则解决的条款。", usage: "机构、地点和适用规则要明确，否则可能先发生管辖权争议。", relatedRoute: "/contract/dispute-resolution" },
  { id: "ch11-inquiry", chapterId: "ch-11", chapterLabel: "第11章", group: "谈判", term: "询盘", english: "Inquiry", definition: "买方或其代理向卖方询问价格、规格、交期等交易条件的表示。", usage: "询盘通常不等于具有约束力的发盘，回复时要先补齐关键信息。", relatedRoute: "/contract" },
  { id: "ch11-offer", chapterId: "ch-11", chapterLabel: "第11章", group: "谈判", term: "发盘", english: "Offer", definition: "向特定对象提出、内容足够确定并愿意受其约束的交易条件。", usage: "有效期、数量、价格和撤回规则要明确，避免被误解为最终承诺。", relatedRoute: "/contract" },
  { id: "ch11-counteroffer", chapterId: "ch-11", chapterLabel: "第11章", group: "谈判", term: "还盘", english: "Counteroffer", definition: "受盘人对原发盘条件作出实质性修改后提出的新条件。", usage: "还盘可能使原发盘失效，邮件标题和版本留痕很重要。", relatedRoute: "/contract" },
  { id: "ch11-acceptance", chapterId: "ch-11", chapterLabel: "第11章", group: "谈判", term: "接受", english: "Acceptance", definition: "受盘人以明确方式同意发盘全部条件的意思表示。", usage: "‘原则同意’或附加新条件可能不是有效接受，而是新的还盘。", relatedRoute: "/contract/contract-formation" },
  { id: "ch15-exclusive-distribution", chapterId: "ch-15", chapterLabel: "第15章", group: "贸易方式", term: "独家经销", english: "Exclusive Distribution", definition: "供应商在约定区域内只指定一个经销商销售商品的渠道安排。", usage: "要配套最低采购量、区域边界和终止条件。", relatedRoute: "/contract" },
  { id: "ch15-exclusive-agency", chapterId: "ch-15", chapterLabel: "第15章", group: "贸易方式", term: "独家代理", english: "Exclusive Agency", definition: "代理人在约定区域内享有代表委托人促成交易的排他性或优先权。", usage: "明确代理权限、佣金、客户归属和是否允许委托人直销。", relatedRoute: "/contract" },
  { id: "ch18-hedging", chapterId: "ch-18", chapterLabel: "第18章", group: "贸易方式", term: "套期保值", english: "Hedging", definition: "通过期货等衍生工具对冲现货价格波动风险的安排。", usage: "先确认风险方向、合约月份和基差风险，再设定保证金上限。" },
  { id: "ch21-cross-border-b2c", chapterId: "ch-21", chapterLabel: "第21章", group: "跨境电商", term: "跨境 B2C", english: "Cross-border B2C", definition: "企业通过平台或独立站直接向境外消费者销售商品的模式。", usage: "定价要同时考虑平台费、支付费、物流、税费和售后成本。" },
  { id: "ch22-overseas-warehouse", chapterId: "ch-22", chapterLabel: "第22章", group: "跨境电商", term: "海外仓", english: "Overseas Warehouse", definition: "把货物提前存放在目标市场仓库，再完成本地配送和售后的履约方式。", usage: "要评估库存周转、仓储费、退货处理和当地合规责任。" },
];

type TradeGlossaryDetails = Pick<
  TradeGlossaryEntry,
  "summary" | "detailedDefinition" | "practicalUse" | "scenario" | "keyPoints" | "commonMistakes"
> & { relatedIds?: string[] };

const glossaryLearningDetails: Record<string, TradeGlossaryDetails> = {
  "ch04-quality-clause": {
    summary: "把货物质量变成可以验收、可以追责的合同标准。",
    detailedDefinition: "品质条款规定货物必须达到的规格、等级、性能、材质和检验依据，是买卖双方判断是否适约的共同标准。条款既可以采用样品、品牌或图纸描述，也可以列明国家标准、行业标准和允许偏差；关键在于让第三方能够据此复核，而不是只留下‘品质良好’这类无法操作的表述。",
    practicalUse: "签约时应同时写明标准版本、检验时间地点、抽样方法、检验机构以及不合格后的处理方式。对于有保质期或性能衰减的商品，还要约定生产日期、剩余有效期和包装状态。",
    scenario: "出口一批电子元件时，合同写明额定电压、误差范围和抽检比例。到货后按同一标准抽检，双方就能快速判断是批次问题还是运输损坏。",
    keyPoints: ["指标必须可测量，避免只写‘符合样品’", "注明标准名称、版本和优先适用顺序", "约定检验机构、抽样规则和异议期限"],
    commonMistakes: ["把宣传册参数当成合同标准，却没有锁定版本", "忽略允许偏差，导致轻微差异也被认定为违约"],
    relatedIds: ["ch04-quantity-tolerance", "ch09-inspection-certificate"],
  },
  "ch04-quantity-tolerance": {
    summary: "为实际装运数量预留一个双方认可的浮动范围。",
    detailedDefinition: "数量机动幅度是合同允许实际交货数量相对约定数量上下浮动的范围，常见于散装货、按舱容装运或生产批次难以精确切分的商品。它同时决定卖方能否多装或少装，以及多装、少装部分如何结算。",
    practicalUse: "条款应明确幅度（如±5%）、选择权归属、计价基准和通知方式。若使用信用证，还要让信用证金额、数量和单据表述与该幅度保持一致。",
    scenario: "粮食装船时受舱容和损耗影响，合同约定±5%且由卖方选择，最终按提单净重和合同单价结算，避免因几百公斤差异引发争议。",
    keyPoints: ["写清浮动比例或绝对数量", "明确由买方还是卖方行使选择权", "同步约定溢短装的价格和付款处理"],
    commonMistakes: ["只写‘允许溢短装’却没有比例", "忽略信用证对数量和金额的容差限制"],
    relatedIds: ["ch04-quality-clause", "ch05-partial-shipment"],
  },
  "ch04-shipping-mark": {
    summary: "让每个包装件在运输、清关和交付环节都能被准确识别。",
    detailedDefinition: "运输标志（唛头）是印在外包装上的识别信息，通常包括收货人缩写、目的港、合同号、件号、重量和必要的操作提示。它连接了货物本身与提单、装箱单、报关单等单据，是仓储和目的港分拨的重要依据。",
    practicalUse: "制作唛头前要向买方确认格式、语言、危险品标识和目的港特殊要求，并在装箱单上逐项对应。多批次或多型号货物应使用连续件号，便于短装、错装和索赔时追踪。",
    scenario: "同一集装箱内有三种型号的配件，卖方用合同号+型号+件号制作唛头，并把对应关系写入装箱单，目的港拆箱时能快速完成分拨。",
    keyPoints: ["唛头、包装件号和单据必须一致", "考虑目的国的语言、环保和危险品标识要求", "多批货物使用稳定的编号规则"],
    commonMistakes: ["沿用旧客户唛头，造成收货人或目的港错误", "只改外箱唛头却未同步修改单据"],
  },
  "ch04-neutral-packing": {
    summary: "在品牌展示和生产商信息之间做出合同化安排。",
    detailedDefinition: "定牌包装按买方指定的商标、版式或品牌规范生产；中性包装则不显示生产商、原产地或特定品牌信息。两者都涉及商标授权、包装设计、标签合规和渠道责任，不能只当作印刷要求处理。",
    practicalUse: "合同应明确谁提供设计文件、谁承担打样和改版费用、商标使用范围、知识产权保证以及因标签不合规产生的召回责任。中性包装还要确认目的国是否强制标注生产商或原产地。",
    scenario: "买方要求使用其品牌销售，卖方在量产前完成打样确认，并约定未经书面同意不得将同一包装用于其他市场。",
    keyPoints: ["明确商标授权和使用边界", "保留打样确认和版本记录", "核对目的国标签与原产地要求"],
    commonMistakes: ["把买方口头要求当作最终版面", "以为中性包装可以省略法定标签信息"],
  },
  "ch05-liner": {
    summary: "按固定航线和班期订舱的常规海运服务。",
    detailedDefinition: "班轮运输由承运人按照预先公布的航线、挂靠港和班期组织运输，运价、订舱和提单格式通常较为标准化。它适合货量稳定、需要多港覆盖或对班期有明确要求的普通货物。",
    practicalUse: "询价时除了看海运费，还要核对截单、截关、预计开航和到港时间、免费用箱期、目的港码头费及可能的附加费。遇到转船或甩柜，应及时取得承运人的书面更新。",
    scenario: "一批小批量机械配件从宁波发往鹿特丹，外贸人员比较不同班轮的直航天数和免费箱期后再确认订舱，避免低运价被目的港滞箱费抵消。",
    keyPoints: ["班期和舱位比单一运价更重要", "确认截关、免费箱期和目的港收费", "留意转船、甩柜和航线变更"],
    commonMistakes: ["只比较基本海运费，忽略附加费", "把预计到港日当成承诺到货日"],
    relatedIds: ["ch05-charter", "ch05-transshipment"],
  },
  "ch05-charter": {
    summary: "为大宗或特殊货物租用整船、部分舱位或航次运力。",
    detailedDefinition: "租船运输通过租船合同安排船舶或舱位，运价、装卸安排和航次条件可以根据货物特点协商。与班轮相比，它的灵活性更高，但对装卸效率、港口限制和滞期责任也更敏感。",
    practicalUse: "谈判时要明确航次、装卸港、装卸率、装卸费用承担、滞期费/速遣费、天气风险和船舶适航责任，并核验船舶与港口的兼容性。",
    scenario: "钢材出口采用航次租船，合同按‘每晴天工作日’约定装卸率和滞期费，港口拥堵时可以据此计算额外成本。",
    keyPoints: ["区分航次租船、定期租船等模式", "装卸率决定滞期和速遣成本", "确认港口、船舶和货物限制"],
    commonMistakes: ["忽略港口拥堵和天气条款", "未明确装卸费用由谁承担"],
    relatedIds: ["ch05-liner", "ch05-partial-shipment"],
  },
  "ch05-partial-shipment": {
    summary: "把一份合同货物拆成多批次完成装运。",
    detailedDefinition: "分批装运是同一合同或信用证项下货物分两批或以上发运的安排。它可以缓解生产、备货和舱位压力，但会增加单据批次、付款节点和货损追踪的复杂度。",
    practicalUse: "合同和信用证应写清是否允许分批、每批数量或最晚装运日，以及分批后的付款和单据要求。安排多批装运时，还要保持合同号、唛头和货描的一致。",
    scenario: "买方允许三批交货，卖方按生产完成情况分别订舱，并为每批准备独立提单和商业发票，银行按批次审核交单。",
    keyPoints: ["先确认合同和信用证是否允许分批", "为每批设置清晰的数量、日期和单据边界", "跟踪每批货物的付款和风险节点"],
    commonMistakes: ["把同一航次的多票货误认为可以随意分批", "漏看信用证对分批装运的特别限制"],
    relatedIds: ["ch05-transshipment", "ch04-quantity-tolerance"],
  },
  "ch05-transshipment": {
    summary: "货物在途中换船或换运输工具后继续前往目的地。",
    detailedDefinition: "转运发生在货物未到最终目的地前，由一艘船、一个航班或一种运输工具转到另一艘或另一种工具。转运可能是航线结构决定的正常安排，也可能增加操作环节、延误和货损风险。",
    practicalUse: "订舱和审证时要核对运输路线、提单转运批注、承运人责任以及信用证是否允许转运。对高价值或时效货物，应比较直达方案的额外成本与风险。",
    scenario: "从内陆港出运的货物先通过驳船到枢纽港再海运，销售合同明确允许转运，提单完整记录起运地和最终目的港。",
    keyPoints: ["转运不等于分批装运", "核对信用证、提单和航线是否允许", "评估换装带来的延误和货损风险"],
    commonMistakes: ["把‘直达’口头承诺写成了无转运限制", "忽略转运港的单证和监管要求"],
    relatedIds: ["ch05-on-board-bl", "ch05-partial-shipment"],
  },
  "ch05-clean-bl": {
    summary: "提单未对货物或包装外观作出不良批注。",
    detailedDefinition: "清洁提单表示承运人在接收或装船时，没有在提单上记录货物或包装存在明显破损、短少等表面瑕疵。它只说明承运人未作不良批注，并不等于货物内在质量完全无问题。",
    practicalUse: "装运前应检查外包装、件数和唛头；若确有破损，应先修复或与承运人协商批注方式。信用证要求清洁提单时，还要确认提单没有模糊的保留语句。",
    scenario: "纸箱受潮时，卖方在装船前更换外箱并重新拍照，承运人最终签发无不良批注的已装船提单。",
    keyPoints: ["清洁针对提单批注，不是质量保证", "装船前检查包装和件数", "同时核对信用证对提单措辞的要求"],
    commonMistakes: ["误以为清洁提单能覆盖隐蔽内在损坏", "只看‘clean’字样却忽略其他保留批注"],
    relatedIds: ["ch05-on-board-bl", "ch08-discrepancy"],
  },
  "ch05-on-board-bl": {
    summary: "证明货物已经装上指定船舶的提单状态。",
    detailedDefinition: "已装船提单由承运人确认货物已装载于指定船舶，通常包含船名、装船日期和装货港。它与收货待运提单不同，后者只证明承运人已接收货物，不能单独证明完成装船。",
    practicalUse: "在信用证结算中，卖方应核对提单是否显示船名、装船日期、装货港和必要的装船批注；若先签发收货待运提单，要及时取得有效的装船批注。",
    scenario: "信用证要求‘clean on-board bill of lading’，卖方在船舶实际装货后取得带装船日期的提单，再向银行交单。",
    keyPoints: ["区别已装船与收货待运状态", "检查船名、装船日期和装货港", "以信用证原文核对批注和签发方式"],
    commonMistakes: ["把装货港的收货日期当成装船日期", "漏看提单上的签发人资格和批注"],
    relatedIds: ["ch05-clean-bl", "ch08-discrepancy"],
  },
  "ch06-general-average": {
    summary: "为共同安全作出的合理牺牲，由各受益方共同分摊。",
    detailedDefinition: "共同海损是航程中船舶、货物和运费面临共同危险时，为使航程整体脱险而有意且合理作出的牺牲或支出。获救财产的所有人按各自获救价值分摊，而不是由单一受损方独自承担。",
    practicalUse: "收到船东或理算师通知后，应保存海损担保、保险单、提单、货损照片和价值证明，并按照保险人或理算师要求提交资料。共同海损与普通货损的索赔路径不同。",
    scenario: "船舶为扑灭机舱火灾而使用海水，部分货物受损但船货整体获救，理算后由船东、货主和运费相关方按比例分摊。",
    keyPoints: ["必须存在共同危险和共同安全目的", "牺牲或支出要有意、合理且有效", "分摊基础是获救财产价值"],
    commonMistakes: ["把所有海上货损都称为共同海损", "未及时提供担保导致提货受阻"],
    relatedIds: ["ch06-particular-average", "ch06-icc-a"],
  },
  "ch06-particular-average": {
    summary: "只影响某一货主或某一利益方的部分海损。",
    detailedDefinition: "单独海损是由承保风险造成、仅由受损货物或相关利益方承担的部分损失，不因共同安全行为而向其他受益方分摊。是否属于可赔损失，还要结合保险条款、损失原因和免赔约定判断。",
    practicalUse: "索赔时应区分货物本身损坏、共同海损分摊和费用损失，准备提单、保险单、检验报告、修理或残值证明，并及时通知保险人。",
    scenario: "集装箱进水导致其中一批纺织品受潮，其他货物未受影响，货主根据保险责任和检验报告单独向保险人索赔。",
    keyPoints: ["损失只归属于特定利益方", "先判断事故原因是否属于承保风险", "证据链决定损失范围和金额"],
    commonMistakes: ["将单独海损和共同海损分摊混为一谈", "没有保留受损前后的数量、价值证据"],
    relatedIds: ["ch06-general-average", "ch06-icc-c"],
  },
  "ch06-icc-a": {
    summary: "保障范围较广，但仍受除外责任和特别条件限制。",
    detailedDefinition: "ICC(A)是协会货物保险条款中保障范围较宽的一类，原则上承保运输途中意外造成的损失，但战争、罢工、包装不当、固有缺陷等除外事项仍可能排除。实际保障取决于保险单、附加条款和货物风险特征。",
    practicalUse: "投保前应把货物包装、路线、易损点和目的地风险交给保险人评估；签约时明确保险金额、免赔额、索赔期限以及是否附加战争或罢工险。",
    scenario: "高价值精密设备采用ICC(A)并附加战争险，投保人同时提交防震包装方案，避免发生损失后因包装缺陷被拒赔。",
    keyPoints: ["‘一切险’不等于任何原因都赔", "重点阅读除外责任和附加条款", "保险金额与运输路线、货值相匹配"],
    commonMistakes: ["只看险别名称不看除外责任", "忽略包装缺陷和固有风险的影响"],
    relatedIds: ["ch06-icc-c", "ch06-particular-average"],
  },
  "ch06-icc-c": {
    summary: "以列明风险为主的基础货物运输保险保障。",
    detailedDefinition: "ICC(C)主要承保条款中列明的重大运输风险，例如火灾、爆炸、船舶搁浅、碰撞等，并不覆盖所有偶发损坏。它通常提供较低保费和较窄保障，适合风险可控、价格敏感或合同只要求最低保险的场景。",
    practicalUse: "使用CIF等条款时，要确认合同要求的最低险别、保险金额和索赔地点；如果货物易碎、易受潮或路线复杂，应比较升级到ICC(A)或增加附加险的成本。",
    scenario: "普通大宗货物采用ICC(C)控制保费，合同另行约定由买方承担超出列明风险的损失，双方在报价阶段就保险边界达成一致。",
    keyPoints: ["只保障列明风险，范围窄于ICC(A)", "保费较低但自留风险更高", "根据货物和路线决定是否加保"],
    commonMistakes: ["把ICC(C)误认为自动覆盖一般破损", "合同要求更高保障时仍只投最低险别"],
    relatedIds: ["ch06-icc-a", "ch06-particular-average"],
  },
  "ch07-commission": {
    summary: "按约定基数支付给中间商或代理人的交易报酬。",
    detailedDefinition: "佣金是中间商、代理商或经纪人促成交易后取得的报酬，可以按成交金额、数量或净销售额计算。佣金率、计佣基数、结算时间和退货时的调整方式都会影响最终价格。",
    practicalUse: "报价时先区分含佣价和净价，明确佣金是否计入运费、保险费、税费等项目，并在合同中规定支付币种、发票和客户取消订单时的处理。",
    scenario: "出口商给海外代理5%佣金，合同约定按扣除运费的货物净价计算，订单收款后30日内支付，避免双方对基数理解不同。",
    keyPoints: ["写清含佣价、净价和佣金率", "确定计佣基数和支付节点", "约定退货、折扣和坏账的调整方式"],
    commonMistakes: ["把折扣直接当成佣金", "报价时未说明佣金已包含在价格中"],
    relatedIds: ["ch07-discount", "ch07-price-adjustment"],
  },
  "ch07-discount": {
    summary: "根据交易条件对基础价格作出的减让。",
    detailedDefinition: "折扣是卖方为反映数量、客户等级、促销或付款条件而对基础价格进行的减让。不同折扣的触发条件和会计处理不同，合同需要区分商业折扣、数量折扣、现金折扣和季节折扣。",
    practicalUse: "报价单应同时列明原价、折扣率、适用数量或付款条件及有效期；多种折扣叠加时，说明是依次计算还是合并计算。",
    scenario: "买方达到每季度1万件采购量可享3%数量折扣，卖方在订单确认和月度对账中分别标记折扣条件，防止达到门槛前提前适用。",
    keyPoints: ["明确折扣类型和触发条件", "写清折扣有效期与叠加顺序", "让报价、发票和对账口径一致"],
    commonMistakes: ["只口头承诺折扣，未写入报价或合同", "未区分付款折扣与价格折扣"],
    relatedIds: ["ch07-commission", "ch07-price-adjustment"],
  },
  "ch07-price-adjustment": {
    summary: "用事先约定的公式应对长期交易中的成本波动。",
    detailedDefinition: "价格调整条款允许合同价格随原材料、工资、汇率或公开指数变化而调整，常用于长期供货、分批交付和项目型交易。有效条款必须明确基准日、指数来源、触发阈值、公式、上限及通知和争议处理机制。",
    practicalUse: "签约前固定初始价格构成和权重，约定指数发布中断时的替代来源，并设置调价生效日和双方复核流程，避免每批货重新谈判。",
    scenario: "铜材价格占产品成本60%，合同按伦敦金属交易所月均价调整，并设置±8%的年度上限，买卖双方可以据公式核算每批价格。",
    keyPoints: ["固定基准日、指数来源和权重", "约定触发阈值、上限和生效时间", "准备指数缺失或异常时的替代规则"],
    commonMistakes: ["只写‘按市场价调整’没有公式", "忽略汇率与原材料变化可能同时发生"],
    relatedIds: ["ch07-commission", "ch07-discount"],
  },
  "ch08-dp": {
    summary: "进口商付款后，银行才交出提货所需单据。",
    detailedDefinition: "付款交单（D/P）属于托收结算，出口方银行委托进口方银行在收到付款后向进口商交付商业发票、提单等单据。银行只按委托指示办理，不承担像信用证开证行那样的付款保证。",
    practicalUse: "合同中要写明即期或远期D/P、付款币种、银行费用和拒付后的货物处理。出口商应评估进口商资信以及货物在目的港滞留、转售的成本。",
    scenario: "老客户采用D/P at sight，货到港后进口商先向代收行付款，取得正本提单再提货；银行不付款时，卖方仍需自行处置货物。",
    keyPoints: ["银行不承担买方付款保证", "区分即期D/P和远期D/P", "提前安排拒付和货物处置方案"],
    commonMistakes: ["把托收当作银行信用", "未考虑拒付后目的港仓储和转售成本"],
    relatedIds: ["ch08-da", "ch08-confirmed-lc"],
  },
  "ch08-da": {
    summary: "进口商承兑远期汇票后先取得单据、到期再付款。",
    detailedDefinition: "承兑交单（D/A）允许进口商承兑远期汇票后获得运输单据，实际付款延后至汇票到期日。出口商在承兑后失去对货物单据的控制，因而承担更高的买方信用和市场风险。",
    practicalUse: "只对资信可靠且有持续交易记录的客户考虑D/A，并明确期限、承兑银行、追索安排和逾期处理。必要时可要求银行保兑或信用保险。",
    scenario: "买方承兑90天远期汇票后提货并销售，出口商通过信用保险覆盖买方到期拒付的部分风险。",
    keyPoints: ["承兑不等于实际付款", "出口商提前让渡单据控制权", "信用评估和风险保障不可缺少"],
    commonMistakes: ["对新客户直接接受D/A", "未核实承兑人身份和汇票到期日"],
    relatedIds: ["ch08-dp", "ch08-confirmed-lc"],
  },
  "ch08-discrepancy": {
    summary: "交单内容与信用证或适用规则存在不一致。",
    detailedDefinition: "不符点是银行审单时发现单据与信用证条款、UCP规则或彼此之间不一致的项目，例如金额、日期、当事人、货物描述、装运港和签章错误。一个细小差异也可能影响银行是否付款。",
    practicalUse: "制单前建立信用证条款清单和双人复核机制，逐项核对商业发票、提单、保险单、原产地证等文件；发现错误时尽快联系银行和相关签发方更正。",
    scenario: "提单显示的收货人名称少了公司后缀，审单员在交单前发现并要求船公司更正，避免形成可拒付的不符点。",
    keyPoints: ["单据之间要相互一致", "严格按信用证原文而非惯例制单", "留出更正和补交单据的时间"],
    commonMistakes: ["只核对商业发票，漏看提单和保险单", "用业务习惯替代信用证明确要求"],
    relatedIds: ["ch08-confirmed-lc", "ch05-on-board-bl"],
  },
  "ch08-confirmed-lc": {
    summary: "由另一家银行增加一层独立付款承诺的信用证。",
    detailedDefinition: "保兑信用证在开证行承诺之外，由保兑行对受益人承担独立付款、承兑或议付责任。它可以降低开证行所在国家或银行的信用风险，但会增加保兑费、审单要求和操作成本。",
    practicalUse: "申请保兑前要确认保兑行资质、费用承担、有效地点和索赔期限；交单时仍需严格满足信用证条件，保兑并不会消除不符点风险。",
    scenario: "出口商担心买方所在国的外汇管制，要求欧洲银行保兑信用证，并把保兑费用计入报价，确保符合条件交单后有第二付款来源。",
    keyPoints: ["保兑行承担独立的第二重承诺", "保兑费用和风险覆盖范围需写清", "单据合规仍是付款前提"],
    commonMistakes: ["把保兑理解成对商业争议也负责", "忽略保兑行的交单地点和截止日期"],
    relatedIds: ["ch08-dp", "ch08-discrepancy"],
  },
  "ch09-inspection-certificate": {
    summary: "用第三方文件证明货物在特定时间地点的状态。",
    detailedDefinition: "检验证书由合同约定的检验机构或有资格的检验人出具，记录货物的质量、数量、包装或装运状态。证书的证明力取决于签发主体、检验标准、抽样方法和合同对其效力的约定。",
    practicalUse: "签约时要确定检验机构、申请人、检验地点和费用承担，并规定证书是付款依据、最终证据还是可被复验的初步证据。",
    scenario: "买方要求装船前由SGS按合同抽样检验，证书确认数量和主要指标合格后，卖方才可提交付款单据。",
    keyPoints: ["检验机构和标准要事先约定", "区分装运前检验与到货检验", "明确证书的付款和索赔效力"],
    commonMistakes: ["只写‘第三方检验’却未指定机构", "忽略抽样误差和复验机制"],
    relatedIds: ["ch04-quality-clause", "ch10-force-majeure"],
  },
  "ch10-force-majeure": {
    summary: "在不可控制的重大事件影响下，暂时或部分免除履约责任。",
    detailedDefinition: "不可抗力通常指合同订立后发生、当事人不能合理预见、不能避免或克服，并直接导致履约受阻的事件。能否免责不只看事件名称，还要证明因果关系、影响程度以及当事人已采取合理减损措施。",
    practicalUse: "条款应列举或概括事件范围，写明通知期限、证明材料、替代履约、暂停期限和解除条件。发生事件后要持续更新影响，而不是一次通知后长期不沟通。",
    scenario: "港口因政府禁令关闭，卖方在合同约定期限内发送官方通知和船期证明，并提出改港方案，双方据此决定延期而非直接解除合同。",
    keyPoints: ["证明事件、影响和因果关系", "及时通知并提交客观证据", "履行减损、替代履约和持续沟通义务"],
    commonMistakes: ["把价格上涨或经营困难一律称为不可抗力", "只通知事件发生却未说明预计影响"],
    relatedIds: ["ch10-arbitration", "ch09-inspection-certificate"],
  },
  "ch10-arbitration": {
    summary: "预先约定由哪个仲裁机构和哪套规则解决争议。",
    detailedDefinition: "仲裁条款把争议提交给特定仲裁机构或临时仲裁庭，并确定仲裁地、语言、适用规则和裁决效力。有效条款的核心是让争议发生后能够迅速确定管辖，不必先为‘去哪儿审’争论。",
    practicalUse: "合同中至少明确仲裁机构、仲裁地、仲裁语言和适用法律，并与主合同、订单和补充协议保持一致。发生争议前要保留合同版本、往来邮件和履约证据。",
    scenario: "中外双方约定在新加坡国际仲裁中心以英文仲裁，合同同时指定适用法，违约发生后可以直接按条款启动程序。",
    keyPoints: ["机构、地点、语言和规则要完整", "仲裁条款独立于主合同", "保留证据并关注申请时效"],
    commonMistakes: ["只写‘提交仲裁’不写机构", "仲裁地和适用法律互相矛盾"],
    relatedIds: ["ch10-force-majeure", "ch11-acceptance"],
  },
  "ch11-inquiry": {
    summary: "买方发出的交易条件询问，通常是谈判起点。",
    detailedDefinition: "询盘是买方或其代理人向卖方了解价格、规格、数量、交期、付款等条件的表示。它通常不具备订立合同的确定性和约束力，但能帮助卖方判断需求并准备正式发盘。",
    practicalUse: "回复询盘时先确认贸易术语、数量、目的地、交期和付款方式，再给出有条件的报价。对不明确的询盘，应通过问题清单补齐关键信息。",
    scenario: "客户只询问‘1000件产品多少钱’，卖方先确认型号、包装、目的港和交付方式，再提供可比较的FOB和CIF报价。",
    keyPoints: ["询盘不是订单，也通常不是发盘", "补齐数量、规格、地点和期限", "记录版本，避免报价条件被断章取义"],
    commonMistakes: ["把询盘邮件直接当作合同成立", "没有确认目的港就报价运费"],
    relatedIds: ["ch11-offer", "ch11-counteroffer"],
  },
  "ch11-offer": {
    summary: "向特定对象提出并愿意受其约束的确定交易条件。",
    detailedDefinition: "发盘需要指向特定受盘人，内容足够确定，并体现发盘人一旦被有效接受就愿意受约束。价格、数量、标的、交付和有效期等核心条件越清晰，越容易判断发盘是否成立及何时失效。",
    practicalUse: "正式报价应标注编号、有效期、币种、贸易术语、付款方式和接受方式；修改条件时用新版本替代旧版本，并保留发送和撤回时间。",
    scenario: "卖方发送编号为O-2026-018的报价，写明数量、CIF价格和7天有效期，客户在期限内按原条件回复接受，双方可据此确认合同。",
    keyPoints: ["对象、内容和约束意愿要明确", "设置有效期和接受渠道", "版本和时间记录决定优先顺序"],
    commonMistakes: ["广告或目录价格被误当成正式发盘", "报价写‘最终确认’却没有说明条件"],
    relatedIds: ["ch11-inquiry", "ch11-counteroffer", "ch11-acceptance"],
  },
  "ch11-counteroffer": {
    summary: "对原发盘作实质修改后形成的新交易条件。",
    detailedDefinition: "还盘是受盘人没有完全接受原发盘，而是对价格、数量、交期、付款或其他重要条件作出修改并提出新条件。实质性还盘通常意味着拒绝原发盘并使谈判进入新一轮。",
    practicalUse: "收到修改意见后要明确‘接受原报价’还是‘提出新报价’，避免在同一邮件中混用。对价格以外的细节变化，也要判断是否会改变风险和成本分配。",
    scenario: "买方将付款方式从即期信用证改为90天托收，卖方回复新的价格和付款条件，该回复构成还盘而不是对原发盘的接受。",
    keyPoints: ["实质修改通常构成新发盘", "非实质澄清也应明确是否接受", "为每轮条件保留版本和时间"],
    commonMistakes: ["在邮件中写‘接受’后又附加新条件", "忽略付款和交期变化带来的风险"],
    relatedIds: ["ch11-offer", "ch11-acceptance"],
  },
  "ch11-acceptance": {
    summary: "对发盘全部条件作出无保留同意的意思表示。",
    detailedDefinition: "接受是受盘人以发盘约定的方式和期限，对发盘全部条件作出一致同意。对核心条件增加、删除或修改，通常不是接受，而是新的还盘；沉默本身也通常不产生接受效力。",
    practicalUse: "确认订单时逐项核对原发盘编号、价格、数量、交付、付款和有效期，并使用合同或订单确认书固定最终版本。含糊的‘原则同意’应继续澄清。",
    scenario: "客户在报价有效期内回签订单，所有条件与发盘一致，卖方随后发送合同确认并安排生产，形成清晰的接受链条。",
    keyPoints: ["接受必须在有效期内到达", "内容应与发盘完全一致", "保留回签、邮件和系统记录"],
    commonMistakes: ["把‘原则同意’当成无条件接受", "漏掉发盘中的附件或技术规格"],
    relatedIds: ["ch11-offer", "ch11-counteroffer", "ch10-arbitration"],
  },
  "ch15-exclusive-distribution": {
    summary: "在指定区域内把销售渠道集中给一个经销商。",
    detailedDefinition: "独家经销是供应商在约定区域和期间内，只授权一个经销商以自身名义买入、转售商品。经销商通常自担库存和客户信用风险，供应商则通过排他性换取渠道投入和市场覆盖。",
    practicalUse: "协议要明确区域、产品范围、最低采购量、价格政策、线上渠道、品牌使用和未达标时的降级或终止机制，并避免排他范围与竞争法要求冲突。",
    scenario: "供应商授予经销商华东地区两年独家权，但要求每季度达到最低采购量，未达标时转为非独家，双方激励和退出路径都清晰。",
    keyPoints: ["独家范围要落到区域、产品和渠道", "用最低采购量衡量经销投入", "预设未达标和终止机制"],
    commonMistakes: ["只写‘独家代理’却没有区分经销和代理", "忽略线上销售和跨区域客户边界"],
    relatedIds: ["ch15-exclusive-agency", "ch11-acceptance"],
  },
  "ch15-exclusive-agency": {
    summary: "在约定区域内赋予代理人排他性的促成交易权限。",
    detailedDefinition: "独家代理由代理人在指定区域代表委托人开发客户、促成交易并按成交取得佣金，货物所有权和交易风险通常仍由委托人承担。是否允许委托人直销、指定客户或另行授权，是排他边界的关键。",
    practicalUse: "合同要写清代理权限、佣金基数、客户登记、委托人直销例外、费用承担和终止后的尾佣安排，避免代理人把排他权理解成区域内所有订单都自动计佣。",
    scenario: "制造商授权代理人开发越南市场，但保留老客户直销权；代理人登记的新客户在保护期内成交，制造商按约支付佣金。",
    keyPoints: ["代理不等于买断经销", "明确直销、指定客户和客户登记规则", "约定终止后的尾佣和保密义务"],
    commonMistakes: ["未区分代理佣金与经销利润", "没有定义区域和客户归属"],
    relatedIds: ["ch15-exclusive-distribution", "ch07-commission"],
  },
  "ch18-hedging": {
    summary: "用衍生工具锁定或对冲现货价格波动。",
    detailedDefinition: "套期保值通过期货、远期、期权等工具建立与现货相反的风险头寸，目标是降低汇率、利率或商品价格波动对利润和现金流的影响。它不是为了保证每次都盈利，而是把不可控波动转化为可管理的成本。",
    practicalUse: "操作前要明确现货风险方向、数量、期限和基准价格，选择匹配的合约月份和工具，并设置保证金、止损和授权额度。还要持续关注基差风险和提前交割。",
    scenario: "出口商三个月后收取美元货款，担心人民币升值，通过远期结汇锁定汇率，提前确定本币收入而不是押注汇率走势。",
    keyPoints: ["先识别现货敞口和风险方向", "工具、期限和数量要与敞口匹配", "控制保证金、基差和流动性风险"],
    commonMistakes: ["把套保当成投机，建立过量头寸", "只看名义金额，忽略交割和保证金现金流"],
    relatedIds: ["ch07-price-adjustment", "ch22-overseas-warehouse"],
  },
  "ch21-cross-border-b2c": {
    summary: "企业通过平台或独立站直接服务境外消费者。",
    detailedDefinition: "跨境B2C把商品、支付、营销和售后直接连接到境外个人消费者，订单通常小批量、多频次，履约和合规要求与传统大宗贸易不同。平台规则、消费者保护、税费和退货体验会直接影响利润。",
    practicalUse: "核算售价时应拆分平台佣金、广告费、支付费、国际物流、进口税费、退货和客服成本，并针对不同市场设置库存、语言和售后策略。",
    scenario: "独立站向德国消费者销售配件，运营团队把VAT、支付费、末端配送和退货预留计入价格，避免只按出厂成本定价。",
    keyPoints: ["订单和履约颗粒度更细", "平台、税费和消费者保护影响成本", "用市场数据迭代定价和库存"],
    commonMistakes: ["只计算采购和国际运费", "忽略目的国退货、隐私和产品合规"],
    relatedIds: ["ch22-overseas-warehouse", "ch18-hedging"],
  },
  "ch22-overseas-warehouse": {
    summary: "先把库存放到目标市场，再用本地仓完成配送和退货。",
    detailedDefinition: "海外仓把商品提前运至目标市场仓库，订单产生后由当地仓库完成拣选、派送和售后。它能缩短时效、提升退货体验，但也会带来库存占用、仓储费、滞销和当地税务合规责任。",
    practicalUse: "建仓前应根据销量预测、补货周期和退货率设置安全库存，比较自营仓、第三方仓和平台仓的费用与服务，并确认进口主体、税务登记和数据接口责任。",
    scenario: "家居品类在美国使用第三方海外仓，运营团队按周转天数补货，滞销品通过促销和跨仓调拨处理，降低长期仓储费。",
    keyPoints: ["时效提升与库存成本同时存在", "明确进口主体和税务责任", "用周转、退货和仓储指标管理仓库"],
    commonMistakes: ["只看配送时效而忽略滞销库存", "没有预留退货、换标和销毁成本"],
    relatedIds: ["ch21-cross-border-b2c", "ch05-liner"],
  },
};

export const tradeGlossary: TradeGlossaryEntry[] = baseTradeGlossary.map((entry) => {
  const details = glossaryLearningDetails[entry.id];
  if (!details) {
    throw new Error(`Missing learning details for glossary entry: ${entry.id}`);
  }
  return { ...entry, ...details };
});

export const glossaryGroups = ["全部", "合同", "运输", "保险", "价格", "结算", "谈判", "贸易方式", "跨境电商"] as const;
