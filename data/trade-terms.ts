import type { TradeTerm } from "@/lib/types";

export const tradeTerms: TradeTerm[] = [
  {
    code: "EXW",
    fullName: "Ex Works",
    chineseName: "工厂交货",
    category: "E",
    categoryLabel: "启运",
    icon: "🏭",
    summary: "卖方在其所在地（工厂或仓库）将货物交给买方处置，即完成交货。",
    description:
      "EXW（工厂交货）是Incoterms中卖方责任最小的术语，也是唯一由买方负责出口报关的术语。卖方只需在自己的场所（工厂、仓库等）将货物准备好交给买方，无需承担任何运输、清关或保险费用。买方需要负责从卖方场所提货，并承担此后的所有费用和风险，包括出口报关、国际运输、进口报关等全部环节。这一术语对买方要求很高，通常仅当买方在卖方所在国有完善的物流和报关能力时才使用。",
    sellerObligations: [
      "在约定地点（工厂/仓库）将货物备妥",
      "提供商业发票和符合合同的货物",
      "按买方要求协助办理出口相关文件（费用由买方承担）",
    ],
    buyerObligations: [
      "从卖方场所提货并装载货物",
      "办理全部出口报关手续",
      "承担从卖方场所起的所有运输费用和风险",
      "办理进口报关并缴纳关税",
      "负责运输保险",
    ],
    riskTransferPoint: "卖方场所（工厂/仓库）— 货物交给买方处置时",
    transportMode: ["任何运输方式"],
    timeline: [
      { step: "卖方备货", responsible: "seller" },
      { step: "买方提货装车", responsible: "buyer" },
      { step: "出口报关", responsible: "buyer" },
      { step: "国际运输", responsible: "buyer" },
      { step: "进口报关", responsible: "buyer" },
      { step: "运至最终目的地", responsible: "buyer" },
    ],
    keyPoint: "卖方义务最小，买方承担全部物流和风险。适合买方在卖方国家有成熟物流网络的情况。",
    commonMisunderstandings: [
      "买方以为卖方会协助装货——EXW下卖方无装货义务，装货完全由买方负责。",
      "新手以为EXW「最简单」所以最适合——实际上EXW对买方要求最高，买方需在卖方所在国具备全套物流和报关能力。",
    ],
    similarTermDiffs: [
      {
        term: "FCA",
        diff: "FCA卖方负责出口报关、且在卖方场所交货时负责装货；EXW卖方两样都不管。这是二者最核心的区别。",
      },
    ],
  },
  {
    code: "FCA",
    fullName: "Free Carrier",
    chineseName: "货交承运人",
    category: "F",
    categoryLabel: "主运费未付",
    icon: "🚛",
    summary: "卖方将货物交给买方指定的承运人，并办理出口报关，即完成交货。",
    description:
      "FCA（货交承运人）是F组术语中最灵活的。卖方需要在指定地点将货物交给买方指定的承运人，并完成出口报关手续。交货地点决定了装载责任的归属：若在卖方场所交货，卖方负责装货；若在其他地点（如货运站）交货，卖方将货物运到后无需卸货。FCA适用于任何运输方式，在集装箱运输中非常常用，是集装箱海运场景下替代FOB的正确选择。",
    sellerObligations: [
      "将货物交给买方指定的承运人",
      "若在卖方场所交货，负责将货物装上运输工具",
      "办理出口报关手续",
      "提供商业发票和交货凭证",
    ],
    buyerObligations: [
      "指定承运人并签订运输合同",
      "承担货物交给承运人之后的所有风险和费用",
      "办理进口报关并缴纳关税",
      "负责运输保险",
    ],
    riskTransferPoint: "货物交给买方指定承运人时",
    transportMode: ["任何运输方式"],
    timeline: [
      { step: "卖方备货+出口报关", responsible: "seller" },
      { step: "交货给承运人", responsible: "seller" },
      { step: "国际运输", responsible: "buyer" },
      { step: "进口报关", responsible: "buyer" },
      { step: "运至最终目的地", responsible: "buyer" },
    ],
    keyPoint: "集装箱运输的理想选择，风险在货交承运人时转移。适用于任何运输方式。",
    commonMisunderstandings: [
      "集装箱海运时误选FOB而非FCA——集装箱货交给堆场/码头时已转移给承运人，并未「装上船」，应选FCA。",
      "混淆FCA与EXW——FCA卖方负责出口报关，EXW连出口报关都是买方负责。",
    ],
    similarTermDiffs: [
      {
        term: "FOB",
        diff: "FOB仅限海运/内河水运，且风险在装船时转移；FCA适用任何运输方式，风险在货交承运人时转移。集装箱海运应选FCA。",
      },
      {
        term: "EXW",
        diff: "FCA卖方负责出口报关、且在卖方场所交货时负责装货；EXW卖方两样都不负责。",
      },
    ],
  },
  {
    code: "FAS",
    fullName: "Free Alongside Ship",
    chineseName: "船边交货",
    category: "F",
    categoryLabel: "主运费未付",
    icon: "⚓",
    summary: "卖方将货物运到指定装运港的船边，即完成交货。",
    description:
      "FAS（船边交货）仅适用于海运和内河水运。卖方负责将货物运至指定装运港船边（码头或驳船上），并办理出口报关。货物在船边交到买方手中后，所有风险和费用转移给买方。买方负责装船、海运、卸货和后续所有环节。这个术语常用于大宗散货（如矿石、粮食）的交易。",
    sellerObligations: [
      "将货物运到指定装运港船边",
      "办理出口报关手续",
      "提供商业发票和交货凭证",
    ],
    buyerObligations: [
      "负责装船（将货物从船边装上船舶）",
      "签订海运合同并支付运费",
      "承担装船后的所有风险和费用",
      "办理进口报关并缴纳关税",
    ],
    riskTransferPoint: "装运港船边 — 货物置于船边时",
    transportMode: ["海运", "内河水运"],
    timeline: [
      { step: "卖方备货运输到港+出口报关", responsible: "seller" },
      { step: "货物置于船边", responsible: "seller" },
      { step: "装船+海运", responsible: "buyer" },
      { step: "卸货+进口报关", responsible: "buyer" },
      { step: "运至最终目的地", responsible: "buyer" },
    ],
    keyPoint: "仅用于海运/内河水运。适合大宗散货，卖方负责到船边。",
    commonMisunderstandings: [
      "与FOB混淆——FAS卖方只需把货放到船边即可，不需要装船；FOB卖方必须负责装船。",
    ],
    similarTermDiffs: [
      {
        term: "FOB",
        diff: "FAS下卖方只需将货物送到船边，装船由买方负责；FOB下卖方必须将货物装上船。FAS多用于大宗散货。",
      },
    ],
  },
  {
    code: "FOB",
    fullName: "Free On Board",
    chineseName: "装运港船上交货",
    category: "F",
    categoryLabel: "主运费未付",
    icon: "🚢",
    summary: "卖方将货物装上买方指定的船舶，即完成交货。风险在货物装上船时转移。",
    description:
      "FOB（装运港船上交货）是国际贸易中最常用的术语之一，仅适用于海运和内河水运。卖方负责将货物运到装运港并装上买方指定的船舶，办理出口报关。Incoterms 2020明确规定货物装上船后风险转移给买方（不再使用「越过船舷」这一旧概念）。买方负责安排海运、支付运费和保险，以及目的港的卸货和进口报关。FOB广泛用于散货和普通货物贸易，但不适合集装箱运输（集装箱货应使用FCA）。",
    sellerObligations: [
      "将货物运至装运港并装上船舶",
      "办理出口报关手续",
      "提供商业发票和清洁已装船提单",
    ],
    buyerObligations: [
      "指定船舶并签订运输合同",
      "支付海运运费",
      "承担装船后的所有风险和费用",
      "办理进口报关并缴纳关税",
      "负责运输保险",
    ],
    riskTransferPoint: "装运港 — 货物装上船时",
    transportMode: ["海运", "内河水运"],
    timeline: [
      { step: "卖方备货运输到港+出口报关", responsible: "seller" },
      { step: "装船", responsible: "seller" },
      { step: "海运", responsible: "buyer" },
      { step: "卸货", responsible: "buyer" },
      { step: "进口报关+运至目的地", responsible: "buyer" },
    ],
    keyPoint: "最常用的贸易术语之一。仅限海运。风险在装船时转移。不适合集装箱运输。",
    commonMisunderstandings: [
      "集装箱货物误用FOB——集装箱在堆场/码头即已交给承运人，并非在船舷「装上船」，应选FCA。",
      "买方以为FOB包含保险——FOB下保险由买方自行负责，卖方无义务投保。",
    ],
    similarTermDiffs: [
      {
        term: "FCA",
        diff: "FCA适用任何运输方式（含集装箱海运），风险在货交承运人时转移；FOB仅限海运/内河水运，风险在装船时转移。",
      },
      {
        term: "CFR",
        diff: "FOB下买方付运费；CFR下卖方付运费。但二者风险转移点相同（装运港装上船时）。",
      },
    ],
  },
  {
    code: "CFR",
    fullName: "Cost and Freight",
    chineseName: "成本加运费",
    category: "C",
    categoryLabel: "主运费已付",
    icon: "💰",
    summary: "卖方支付到目的港的运费，但风险在装运港装上船时转移给买方。",
    description:
      "CFR（成本加运费）与FOB相似，但卖方需要额外支付到目的港的海运运费。然而，风险划分点仍然是装运港——货物装上船后，即使运费由卖方支付，货物灭失或损坏的风险已转移给买方。这种「风险与费用分离」是C组术语的核心特征。卖方办理出口报关，买方负责保险和进口报关。CFR仅适用于海运和内河水运。",
    sellerObligations: [
      "签订运输合同并支付至目的港的运费",
      "将货物运至装运港并装上船舶",
      "办理出口报关手续",
      "提供商业发票和运输单据",
    ],
    buyerObligations: [
      "承担装船后的货物风险（虽然卖方付运费）",
      "办理运输保险",
      "承担目的港卸货费用（除非包含在运费中）",
      "办理进口报关并缴纳关税",
    ],
    riskTransferPoint: "装运港 — 货物装上船时（与FOB相同）",
    transportMode: ["海运", "内河水运"],
    timeline: [
      { step: "卖方备货+出口报关", responsible: "seller" },
      { step: "装船", responsible: "seller" },
      { step: "海运（卖方付运费，买方担风险）", responsible: "both" },
      { step: "卸货", responsible: "buyer" },
      { step: "进口报关+运至目的地", responsible: "buyer" },
    ],
    keyPoint: "风险转移点和费用划分点分离——卖方付运费但装船后风险归买方。注意保险由买方负责。",
    commonMisunderstandings: [
      "买方以为CFR包含保险——CFR中卖方只付运费，不负责保险。买方必须自行购买运输保险。这是实务中最容易出问题的地方。",
    ],
    similarTermDiffs: [
      {
        term: "CIF",
        diff: "CFR卖方只付运费，买方自购保险；CIF卖方付运费+保险（但风险同样在装船时转移）。一字之差，保险责任完全不同。",
      },
      {
        term: "CPT",
        diff: "CFR仅限海运/内河水运，风险在装船时转移；CPT适用任何运输方式，风险在货交第一承运人时转移。可将CPT理解为CFR适用于多式联运的对应术语（教学类比）。",
      },
    ],
  },
  {
    code: "CIF",
    fullName: "Cost, Insurance and Freight",
    chineseName: "成本加保险费、运费",
    category: "C",
    categoryLabel: "主运费已付",
    icon: "🛡️",
    summary: "卖方支付到目的港的运费和保险费，但风险在装运港装上船时转移。",
    description:
      "CIF（成本加保险费、运费）是CFR的升级版，卖方除了支付运费外，还必须为货物购买海运保险。Incoterms 2020要求卖方至少购买协会货物保险条款(C)级别的保险。实务中信用证（UCP 600）通常要求保额为合同金额的110%，但这并非Incoterms 2020本身的强制规定。与CFR一样，风险在装运港货物装上船时转移给买方——卖方支付运费和保险费并不意味着承担运输途中的风险。CIF是最常用的贸易术语之一，仅适用于海运和内河水运。",
    sellerObligations: [
      "签订运输合同并支付至目的港的运费",
      "购买海运保险（Incoterms 2020最低要求：协会货物保险条款(C)；信用证下通常要求合同金额的110%）",
      "将货物运至装运港并装上船舶",
      "办理出口报关手续",
      "提供商业发票、保险单和运输单据",
    ],
    buyerObligations: [
      "承担装船后的货物风险",
      "承担目的港卸货费用",
      "办理进口报关并缴纳关税",
      "如需更高保额保险，额外购买",
    ],
    riskTransferPoint: "装运港 — 货物装上船时（与FOB/CFR相同）",
    transportMode: ["海运", "内河水运"],
    timeline: [
      { step: "卖方备货+出口报关", responsible: "seller" },
      { step: "装船", responsible: "seller" },
      { step: "海运（卖方付运费+保险，买方担风险）", responsible: "both" },
      { step: "卸货", responsible: "buyer" },
      { step: "进口报关+运至目的地", responsible: "buyer" },
    ],
    keyPoint: "最常用术语之一。卖方提供一站式服务（运费+保险），但风险仍在装船时转移。仅限海运。",
    commonMisunderstandings: [
      "买方以为CIF下卖方承担全程运输风险——实际上风险仍在装运港装船时转移，卖方只是代为支付运费和保费。货物在海运途中出险，买方仍需向保险公司索赔。",
      "将CIF与CIP混淆——Incoterms 2020下CIP保险要求为条款(A)最高级，CIF仅要求条款(C)，且CIF仅限海运。",
    ],
    similarTermDiffs: [
      {
        term: "CFR",
        diff: "CIF比CFR多一层保险义务（卖方购买），风险转移点完全相同。这是二者的唯一区别。",
      },
      {
        term: "CIP",
        diff: "CIP适用任何运输方式且保险要求更高（条款A vs 条款C），风险在货交第一承运人时转移；CIF仅限海运。",
      },
    ],
  },
  {
    code: "CPT",
    fullName: "Carriage Paid To",
    chineseName: "运费付至",
    category: "C",
    categoryLabel: "主运费已付",
    icon: "📦",
    summary: "卖方支付到指定目的地的运费，但风险在货交第一承运人时转移。",
    description:
      "CPT（运费付至）适用于任何运输方式。卖方支付将货物运至指定目的地的运费，但风险在货物交给第一承运人时就从卖方转移给买方。这意味着运输途中的风险由买方承担，即使运费由卖方支付。CPT常用于集装箱运输和多式联运，在教学上可类比为CFR对应多式联运场景，但请注意这仅是帮助理解的简化说法，并非官方定义。",
    sellerObligations: [
      "签订运输合同并支付至目的地的运费",
      "将货物交给第一承运人",
      "办理出口报关手续",
      "提供商业发票和运输单据",
    ],
    buyerObligations: [
      "承担货交第一承运人后的所有风险",
      "办理运输保险",
      "承担目的地可能的额外费用",
      "办理进口报关并缴纳关税",
    ],
    riskTransferPoint: "货物交给第一承运人时",
    transportMode: ["任何运输方式"],
    timeline: [
      { step: "卖方备货+出口报关", responsible: "seller" },
      { step: "货交第一承运人", responsible: "seller" },
      { step: "全程运输（卖方付运费，买方担风险）", responsible: "both" },
      { step: "进口报关+运至最终目的地", responsible: "buyer" },
    ],
    keyPoint: "适用于任何运输方式。风险在货交第一承运人时转移。教学上可类比为多式联运版的CFR。",
    commonMisunderstandings: [
      "将CPT误认为仅限于海运——CPT适用于任何运输方式，包括陆运、空运、多式联运。与CFR不同，CPT没有运输方式限制。",
    ],
    similarTermDiffs: [
      {
        term: "CFR",
        diff: "CFR仅限海运/内河水运，风险在装船时转移；CPT适用任何运输方式，风险在货交第一承运人时转移。CPT适用范围更广。",
      },
      {
        term: "CIP",
        diff: "CPT卖方只付运费（买方自购保险）；CIP卖方付运费+购买保险。区别与CFR vs CIF类似。",
      },
    ],
  },
  {
    code: "CIP",
    fullName: "Carriage and Insurance Paid To",
    chineseName: "运费、保险费付至",
    category: "C",
    categoryLabel: "主运费已付",
    icon: "🔒",
    summary: "卖方支付到目的地的运费和保险费，风险在货交第一承运人时转移。",
    description:
      "CIP（运费、保险费付至）卖方支付运费和保险费，但风险在货交第一承运人时转移。Incoterms 2020的重大变化之一：CIP下卖方必须购买协会货物保险条款(A)级别的保险（最高级别，覆盖范围最广），而CIF只需(C)级别。这一变化值得特别注意。CIP适用于任何运输方式，在集装箱和多式联运中广泛使用。教学上可类比为CIF对应多式联运场景，但请注意这仅是帮助理解的简化说法。",
    sellerObligations: [
      "签订运输合同并支付至目的地的运费",
      "购买协会货物保险条款(A)级别保险",
      "将货物交给第一承运人",
      "办理出口报关手续",
      "提供商业发票、保险单和运输单据",
    ],
    buyerObligations: [
      "承担货交第一承运人后的所有风险",
      "承担目的地额外费用",
      "办理进口报关并缴纳关税",
    ],
    riskTransferPoint: "货物交给第一承运人时",
    transportMode: ["任何运输方式"],
    timeline: [
      { step: "卖方备货+出口报关", responsible: "seller" },
      { step: "货交第一承运人", responsible: "seller" },
      { step: "全程运输（卖方付运费+保险，买方担风险）", responsible: "both" },
      { step: "进口报关+运至最终目的地", responsible: "buyer" },
    ],
    keyPoint: "Incoterms 2020将CIP保险升级为条款(A)最高级，这是与CIF的重要区别。任何运输方式适用。",
    commonMisunderstandings: [
      "仍按Incoterms 2010的习惯认为CIP保险只需条款(C)——Incoterms 2020已将CIP保险要求提高至条款(A)最高级，这是版本升级中最容易忽略的变化。",
      "将CIP与CIF混淆——CIP适用任何运输方式，CIF仅限海运；二者保险级别也不同（A vs C）。",
    ],
    similarTermDiffs: [
      {
        term: "CIF",
        diff: "CIP保险要求为条款(A)，CIF仅要求条款(C)；CIP适用任何运输方式，CIF仅限海运/内河水运。风险转移点也不同（货交第一承运人 vs 装船时）。",
      },
      {
        term: "CPT",
        diff: "CIP比CPT多一层保险义务（卖方购买条款(A)保险），风险转移点相同。",
      },
    ],
  },
  {
    code: "DAP",
    fullName: "Delivered at Place",
    chineseName: "目的地交货",
    category: "D",
    categoryLabel: "到达",
    icon: "📍",
    summary: "卖方将货物运至指定目的地，在运输工具上（无需卸货）交给买方处置。",
    description:
      "DAP（目的地交货）卖方负责将货物运至指定目的地，在运输工具上备妥由买方处置（卖方不需要卸货）。卖方承担所有运输风险和费用，直到货物到达指定地点。买方只需负责卸货和进口报关。DAP适用于任何运输方式。注意：虽然卖方承担全程运输风险，Incoterms 2020并未强制要求卖方购买保险，但由于卖方承担风险，强烈建议卖方自行投保。",
    sellerObligations: [
      "全程运输至指定目的地",
      "承担运输途中的所有风险和费用",
      "办理出口报关手续",
      "在目的地运输工具上备妥货物",
    ],
    buyerObligations: [
      "在目的地卸货",
      "办理进口报关并缴纳关税",
      "承担卸货后的风险和费用",
    ],
    riskTransferPoint: "指定目的地 — 运输工具上货交买方处置时",
    transportMode: ["任何运输方式"],
    timeline: [
      { step: "卖方备货+出口报关", responsible: "seller" },
      { step: "全程运输（卖方承担风险）", responsible: "seller" },
      { step: "到达目的地 — 运输工具上", responsible: "seller" },
      { step: "买方卸货", responsible: "buyer" },
      { step: "进口报关+运至最终仓库", responsible: "buyer" },
    ],
    keyPoint: "卖方承担直到目的地的全部运输风险。买方只负责卸货和进口报关。不要求卖方卸货。",
    commonMisunderstandings: [
      "与DDP混淆——以为DAP含进口报关。DAP下进口报关和关税由买方负责，卖方只管到目的地运输工具上。",
      "以为卖方负责卸货——DAP是「运输工具上交货」，卖方不负责卸货。需要卖方卸货应选DPU。",
    ],
    similarTermDiffs: [
      {
        term: "DPU",
        diff: "DAP卖方不负责卸货（运输工具上交货）；DPU卖方负责卸货。这是二者唯一的区别。",
      },
      {
        term: "DDP",
        diff: "DAP买方负责进口报关和关税；DDP卖方负责进口报关和关税。DDP比DAP多了一整套进口环节的责任。",
      },
    ],
  },
  {
    code: "DPU",
    fullName: "Delivered at Place Unloaded",
    chineseName: "卸货地交货",
    category: "D",
    categoryLabel: "到达",
    icon: "🏗️",
    summary: "卖方将货物运至目的地并卸货后，交给买方处置。",
    description:
      "DPU（卸货地交货）是Incoterms 2020引入的术语（取代Incoterms 2010中的DAT），也是唯一要求卖方负责卸货的术语。卖方负责将货物运至指定地点，并完成卸货，在卸货后的货物交给买方处置时才算完成交货。与DAT相比，DPU将交货地点从「运输终端」扩展到了任何约定地点，灵活性更高。卖方承担直到卸货完成为止的所有风险和费用。注意：Incoterms 2020未强制要求卖方购买保险，但由于卖方承担全程运输风险，强烈建议卖方自行投保。",
    sellerObligations: [
      "全程运输至指定目的地",
      "负责卸货（唯一要求卖方卸货的术语）",
      "承担直到卸货完成为止的所有风险和费用",
      "办理出口报关手续",
    ],
    buyerObligations: [
      "办理进口报关并缴纳关税",
      "承担卸货后的风险和费用",
      "安排从交货地点到最终仓库的运输",
    ],
    riskTransferPoint: "指定目的地 — 卸货后货物交给买方处置时",
    transportMode: ["任何运输方式"],
    timeline: [
      { step: "卖方备货+出口报关", responsible: "seller" },
      { step: "全程运输（卖方承担风险）", responsible: "seller" },
      { step: "到达目的地+卸货", responsible: "seller" },
      { step: "进口报关", responsible: "buyer" },
      { step: "运至最终仓库", responsible: "buyer" },
    ],
    keyPoint: "唯一要求卖方卸货的术语。Incoterms 2020引入，取代DAT。卖方责任极大。",
    commonMisunderstandings: [
      "与DAP混淆——DPU和DAP的唯一区别就是卖方是否负责卸货。DPU卖方卸货，DAP不卸。选择时只需确认「谁来卸货」。",
    ],
    similarTermDiffs: [
      {
        term: "DAP",
        diff: "DPU卖方负责卸货（卸货后交货）；DAP卖方不负责卸货（运输工具上交货）。这是二者的唯一区别。",
      },
      {
        term: "DDP",
        diff: "DPU买方负责进口报关和关税；DDP卖方负责进口报关和关税。二者和DAP的区别一样，都是进口环节责任不同。",
      },
    ],
  },
  {
    code: "DDP",
    fullName: "Delivered Duty Paid",
    chineseName: "完税后交货",
    category: "D",
    categoryLabel: "到达",
    icon: "✅",
    summary: "卖方将货物运至目的地，完成进口报关并缴纳关税后，交给买方处置。",
    description:
      "DDP（完税后交货）是Incoterms中卖方责任最大的术语。卖方需要承担将货物运至指定目的地的所有费用和风险，包括出口报关、国际运输、进口报关、缴纳进口关税和增值税等全部环节。买方只需要在指定地点接收货物（卸货由其负责）。DDP相当于卖方提供「门到门」服务。但对于卖方来说风险极大，需要完全了解买方国家的进口法规，且许多国家要求进口方必须是本地实体，因此在实际贸易中使用较少。Incoterms 2020未强制要求卖方购买保险，但由于卖方承担全程运输风险，强烈建议卖方自行投保。",
    sellerObligations: [
      "全程运输至指定目的地",
      "办理出口报关和进口报关",
      "缴纳进口关税和增值税",
      "承担直到目的地的所有风险和费用",
    ],
    buyerObligations: [
      "在目的地卸货（如果约定地点在运输工具上）",
      "协助卖方办理进口手续（提供必要文件）",
      "承担卸货后的风险和费用",
    ],
    riskTransferPoint: "指定目的地 — 货物交给买方处置时（完税后）",
    transportMode: ["任何运输方式"],
    timeline: [
      { step: "卖方备货+出口报关", responsible: "seller" },
      { step: "全程运输", responsible: "seller" },
      { step: "进口报关+缴税", responsible: "seller" },
      { step: "到达目的地 — 货交买方", responsible: "seller" },
      { step: "买方卸货", responsible: "buyer" },
    ],
    keyPoint: "卖方责任最大，含进口报关缴税。相当于「门到门」服务。卖方风险极高。",
    commonMisunderstandings: [
      "卖方以为在任何国家都能以自己名义完成进口报关——许多国家法律要求进口申报人必须是本地注册实体，非居民卖方可能无法直接办理进口清关。这是DDP最大的实操障碍。",
    ],
    similarTermDiffs: [
      {
        term: "DAP",
        diff: "DDP卖方负责进口报关和缴纳关税、增值税；DAP这些由买方负责。这是二者的核心区别。",
      },
      {
        term: "DPU",
        diff: "DDP卖方负责进口报关和关税；DPU买方负责。卸货方面：DPU卖方卸货，DDP买方卸货。",
      },
    ],
  },
];

export function getTermByCode(code: string): TradeTerm | undefined {
  return tradeTerms.find((t) => t.code === code.toUpperCase());
}
