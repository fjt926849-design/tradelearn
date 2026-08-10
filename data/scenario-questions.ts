import type { ScenarioQuestion } from "@/lib/types";

export const scenarioQuestions: ScenarioQuestion[] = [
  {
    id: "q01",
    scenario:
      "深圳一家电子元器件制造商收到德国新客户的询价。客户在中国没有物流团队，对中国的出口报关流程也不熟悉，希望卖方尽可能多地协助处理在中国的出口手续。",
    question: "从卖方责任角度，以下哪个术语最适合这个场景？",
    options: [
      { code: "EXW", label: "EXW — 工厂交货" },
      { code: "FCA", label: "FCA — 货交承运人" },
      { code: "FOB", label: "FOB — 装运港船上交货" },
      { code: "FAS", label: "FAS — 船边交货" },
    ],
    correctIndex: 1, // FCA
    explanation:
      "EXW下卖方不负责出口报关，而FCA卖方必须办理出口报关手续。德国客户在中国没有物流能力，选择EXW会给客户造成极大困难。FCA是更合理的选择：卖方负责出口报关+货交承运人，买方安排国际运输即可。",
    knowledgePoints: [
      "EXW是唯一由买方负责出口报关的术语",
      "FCA卖方负责出口报关",
      "选择术语时要考虑双方的实操能力",
    ],
    commonMistake: "新手常认为EXW「最简单」而直接选用，忽略了买方需在出口国具备报关能力这一前提。",
    relatedTermCodes: ["EXW", "FCA"],
  },
  {
    id: "q02",
    scenario:
      "上海一家玩具出口商准备发运一个40尺集装箱到荷兰鹿特丹。货物将先用卡车运到洋山港的集装箱堆场，在堆场交给船公司后，由船公司统一安排装船。",
    question: "根据Incoterms 2020的规则，应该选择哪个术语？",
    options: [
      { code: "FOB", label: "FOB — 装运港船上交货" },
      { code: "FCA", label: "FCA — 货交承运人" },
      { code: "FAS", label: "FAS — 船边交货" },
      { code: "CFR", label: "CFR — 成本加运费" },
    ],
    correctIndex: 1, // FCA
    explanation:
      "集装箱货物在堆场即已交给承运人，此时卖方已无法控制货物，风险应在此转移。Incoterms 2020明确建议集装箱运输使用FCA而非FOB。FOB要求卖方负责装船，但集装箱运输中装船由码头/船公司完成，卖方并不实际参与。",
    knowledgePoints: [
      "集装箱运输应选择FCA而非FOB",
      "FCA风险在货交承运人时转移",
      "FOB仅适用于卖方能实际控制装船过程的场景",
    ],
    commonMistake: "习惯性地在一切海运场景中使用FOB，忽略了集装箱运输的实际交货方式与FOB的定义不匹配。",
    relatedTermCodes: ["FCA", "FOB"],
  },
  {
    id: "q03",
    scenario:
      "青岛一家轮胎出口商与巴西客户谈判。客户要求卖方负责安排海运并支付到桑托斯港的运费，但客户明确表示会自行向保险公司购买运输保险。",
    question: "应该选择哪个术语？",
    options: [
      { code: "FOB", label: "FOB — 装运港船上交货" },
      { code: "CFR", label: "CFR — 成本加运费" },
      { code: "CIF", label: "CIF — 成本加保险费、运费" },
      { code: "CPT", label: "CPT — 运费付至" },
    ],
    correctIndex: 1, // CFR
    explanation:
      "CFR下卖方负责支付至目的港的海运运费，保险由买方自行负责。客户的要求是「卖方付运费+买方自购保险」，这正是CFR的定义。CIF多了一层卖方购买保险的义务，不符合客户要求。FOB下运费由买方付，也不符合。",
    knowledgePoints: [
      "CFR = 卖方付运费 + 买方自购保险",
      "CIF = CFR + 卖方购保",
      "C组术语的风险转移点与费用划分点分离",
    ],
    commonMistake: "容易把CFR和CIF搞混——一字之差，保险责任完全不同。实务中买方指定保险时常选CFR。",
    relatedTermCodes: ["CFR", "CIF", "FOB"],
  },
  {
    id: "q04",
    scenario:
      "接上一题的场景，巴西客户改变主意：希望卖方一并购买海运保险，这样客户只需要在目的港收货即可，省去自行投保的麻烦。",
    question: "现在应该改为选择哪个术语？",
    options: [
      { code: "CFR", label: "CFR — 成本加运费" },
      { code: "CIF", label: "CIF — 成本加保险费、运费" },
      { code: "CIP", label: "CIP — 运费、保险费付至" },
      { code: "DAP", label: "DAP — 目的地交货" },
    ],
    correctIndex: 1, // CIF
    explanation:
      "CIF在CFR的基础上增加了卖方购买海运保险的义务。Incoterms 2020要求CIF下卖方至少购买协会货物保险条款(C)级别的保险。但风险仍然在装运港装船时转移——卖方只是代付运费和保费，并不承担海运途中的货物风险。",
    knowledgePoints: [
      "CIF = CFR + 卖方购保",
      "Incoterms 2020: CIF保险最低要求条款(C)",
      "CIF下风险仍在装船时转移，卖方不承担运输风险",
    ],
    commonMistake: "买方以为CIF意味着卖方对全程运输负责——实际上CIF只是卖方代付运费和保费，风险在装船时就转移了。",
    relatedTermCodes: ["CIF", "CFR"],
  },
  {
    id: "q05",
    scenario:
      "一家中国机械设备出口商通过中欧班列（铁路）向波兰客户发货。合同要求卖方支付全程运费并购买最高级别的货运保险。货物将先从工厂卡车运到西安铁路站，再经铁路到波兰。",
    question: "应该选择哪个术语？",
    options: [
      { code: "CIF", label: "CIF — 成本加保险费、运费" },
      { code: "CIP", label: "CIP — 运费、保险费付至" },
      { code: "CFR", label: "CFR — 成本加运费" },
      { code: "CPT", label: "CPT — 运费付至" },
    ],
    correctIndex: 1, // CIP
    explanation:
      "关键有三点：(1) CIF仅适用于海运/内河水运，中欧班列是铁路运输，CIF不适用；(2) Incoterms 2020规定CIP卖方必须购买协会货物保险条款(A)——最高级别；(3) CIP适用于任何运输方式（包括铁路）。",
    knowledgePoints: [
      "Incoterms 2020将CIP保险要求提升至条款(A)",
      "CIF仅限海运，CIP适用任何运输方式",
      "多式联运/铁路运输必须使用适用任何运输方式的术语",
    ],
    commonMistake: "仍按Incoterms 2010的习惯认为CIP保险只需条款(C)，或惯性地在海运以外的场景中使用CIF。",
    relatedTermCodes: ["CIP", "CIF"],
  },
  {
    id: "q06",
    scenario:
      "广州一家服装出口商用多式联运（卡车运到深圳港+海运）向肯尼亚蒙巴萨发货。卖方愿意支付全程运费，但不想承担保险责任——希望买方自行购买货运保险。",
    question: "应该选择哪个术语？",
    options: [
      { code: "CIF", label: "CIF — 成本加保险费、运费" },
      { code: "CIP", label: "CIP — 运费、保险费付至" },
      { code: "CPT", label: "CPT — 运费付至" },
      { code: "DAP", label: "DAP — 目的地交货" },
    ],
    correctIndex: 2, // CPT
    explanation:
      "CPT下卖方负责支付全程运费（含卡车+海运），但不承担运输风险，也不负责保险——保险由买方自行购买。CIP多了一层保险义务（条款A），CIF仅限海运且含保险。这是典型的多式联运运费已付场景。",
    knowledgePoints: [
      "CPT = 卖方付运费（任何运输方式）+ 买方自购保险",
      "多式联运不能使用仅限海运的术语",
      "CIP = CPT + 卖方购保（条款A）",
    ],
    commonMistake: "看到有海运段就选CIF，忽略了前面的陆运段——整体是多式联运，必须选适用任何运输方式的术语。",
    relatedTermCodes: ["CPT", "CIP", "CIF"],
  },
  {
    id: "q07",
    scenario:
      "东莞一家家具厂向泰国曼谷客户交货。合同约定卖方负责将货物运到曼谷客户的仓库，但客户有自己的卸货团队和叉车，明确表示不需要卖方卸货——客户会在卡车到达后自己安排卸货。",
    question: "应该选择哪个术语？",
    options: [
      { code: "DPU", label: "DPU — 卸货地交货" },
      { code: "DAP", label: "DAP — 目的地交货" },
      { code: "DDP", label: "DDP — 完税后交货" },
      { code: "FOB", label: "FOB — 装运港船上交货" },
    ],
    correctIndex: 1, // DAP
    explanation:
      "DAP（目的地交货）下卖方负责将货物运到指定目的地，在运输工具上交给买方处置即可，卖方不需要卸货。DPU是Incoterms 2020中唯一要求卖方卸货的术语，不符合「客户自己卸货」的约定。DAP和DPU的唯一区别就是卸货责任归属。",
    knowledgePoints: [
      "DAP = 目的地运输工具上交货（不卸货）",
      "DPU = 目的地卸货后交货",
      "DAP和DPU的唯一区别是卸货责任",
    ],
    commonMistake: "DAP和DPU极易混淆。只需确认一个问题：「谁来卸货？」卖方卸货选DPU，买方卸货选DAP。",
    relatedTermCodes: ["DAP", "DPU"],
  },
  {
    id: "q08",
    scenario:
      "一家中国光伏企业向巴西出口太阳能板。巴西的进口清关程序极为复杂，法律规定只有本地注册实体才能办理进口清关。这家中国企业在巴西没有分支机构，无法以自己名义在巴西清关。",
    question: "应该选择哪个术语？",
    options: [
      { code: "DDP", label: "DDP — 完税后交货" },
      { code: "DAP", label: "DAP — 目的地交货" },
      { code: "DPU", label: "DPU — 卸货地交货" },
      { code: "CIF", label: "CIF — 成本加保险费、运费" },
    ],
    correctIndex: 1, // DAP
    explanation:
      "DDP要求卖方办理进口报关并缴纳关税，但中国企业无法在巴西以自己名义清关——这是DDP最大的实操障碍。DAP下进口报关和关税由买方（巴西客户）负责，更适合此场景。",
    knowledgePoints: [
      "DDP卖方负责进口报关缴税——卖方责任最大",
      "许多国家法律要求进口方为本地实体",
      "DAP买方负责进口报关",
    ],
    commonMistake: "以为DDP「门到门」最省事，忽略了在许多国家外国卖方根本无法直接办理进口清关的现实障碍。",
    relatedTermCodes: ["DAP", "DDP"],
  },
  {
    id: "q09",
    scenario:
      "中国出口商以CIF术语向美国客户出售一批价值50万美元的机械零件。货物在太平洋运输途中遭遇风暴，部分零件受潮损坏。美国客户收到货后向卖方索赔，称「你付了运费和保险费，应该对全程运输负责」。",
    question: "根据Incoterms 2020，客户的索赔要求是否合理？",
    options: [
      { code: "YES", label: "合理——卖方付了运费和保费就应承担运输风险" },
      { code: "NO", label: "不合理——CIF下风险在装船时已转移给买方" },
      { code: "HALF", label: "部分合理——卖方和买方应各承担一半" },
      { code: "SHIP", label: "应向船公司索赔，与买卖双方无关" },
    ],
    correctIndex: 1, // 不合理
    explanation:
      "C组术语的核心特征就是「风险与费用分离」。CIF下卖方支付运费和保险费，但货物风险在装运港装上船时就转移给了买方。运输途中发生货损，买方应向保险公司索赔（凭卖方购买的保险单）。卖方代付保费不等于卖方承担风险。",
    knowledgePoints: [
      "C组术语：风险转移点和费用划分点分离",
      "CIF下风险在装船时转移，卖方不承担运输风险",
      "卖方代付运费和保费 ≠ 卖方承担运输风险",
    ],
    commonMistake: "这是对C组术语最常见的误解——以为卖方付了钱就承担了风险。实际上C组是「风险已在装运地转移」。",
    relatedTermCodes: ["CIF", "CFR", "CPT", "CIP"],
  },
  {
    id: "q10",
    scenario:
      "昆明一家花卉出口商计划用空运向迪拜出口一批鲜花。鲜花需要全程温控，且对运输时效要求极高。业务员在准备合同时需要选择一个合适的贸易术语。",
    question: "以下哪个术语绝对不能用于这次空运出口？",
    options: [
      { code: "FCA", label: "FCA — 货交承运人" },
      { code: "CPT", label: "CPT — 运费付至" },
      { code: "FOB", label: "FOB — 装运港船上交货" },
      { code: "CIP", label: "CIP — 运费、保险费付至" },
    ],
    correctIndex: 2, // FOB
    explanation:
      "FOB仅适用于海运和内河水运，不能用于空运。FAS、CFR、CIF同样有此限制。空运应选择适用任何运输方式的术语：FCA、CPT、CIP、DAP、DPU、DDP。",
    knowledgePoints: [
      "FOB / FAS / CFR / CIF 仅限海运和内河水运",
      "FCA / CPT / CIP / DAP / DPU / DDP 适用任何运输方式",
      "空运、陆运、铁路必须选适用任何运输方式的术语",
    ],
    commonMistake: "将FOB当作「万能海运术语」在所有出口场景中使用——实际上它不仅限海运，还不适合集装箱运输。",
    relatedTermCodes: ["FOB", "FCA", "CPT"],
  },
  {
    id: "q11",
    scenario:
      "一位意大利买家从中国义乌采购了一批小商品，与供应商以EXW成交。货物在义乌工厂备妥后，买家联系供应商，希望供应商「帮忙办理出口报关，费用由买家承担」。",
    question: "根据Incoterms 2020，这笔交易中出口报关的责任方是？",
    options: [
      { code: "SELLER", label: "卖方——EXW下卖方应协助报关" },
      { code: "BUYER", label: "买方——EXW下出口报关是买方的责任" },
      { code: "BOTH", label: "双方协商——EXW未明确规定" },
      { code: "AGENT", label: "货运代理——EXW下由第三方负责" },
    ],
    correctIndex: 1, // 买方
    explanation:
      "EXW（工厂交货）是Incoterms中唯一由买方负责出口报关的术语。卖方仅在自己场所将货物备妥即可。虽然卖方「可以」协助提供报关文件，但这是帮忙而非义务，且费用应由买方承担。",
    knowledgePoints: [
      "EXW是唯一买方负责出口报关的术语",
      "卖方在EXW下没有出口报关义务",
      "EXW是卖方责任最小的术语",
    ],
    commonMistake: "以为EXW下卖方至少会「帮一下忙」办出口报关——规则上这不是卖方的义务，是买方的责任。",
    relatedTermCodes: ["EXW", "FCA"],
  },
  {
    id: "q12",
    scenario:
      "青岛出口商以FOB术语出售一批钢管。货物在码头吊装过程中，吊索突然断裂，钢管坠入海中损毁。经查，钢管在坠落时尚未完全落入船舱，仍在吊装过程中。",
    question: "根据Incoterms 2020的FOB规则，这批钢管的损失应由谁承担？",
    options: [
      { code: "SELLER", label: "卖方——货物尚未装上船" },
      { code: "BUYER", label: "买方——货物已经越过船舷" },
      { code: "PORT", label: "码头——吊装事故属于码头责任" },
      { code: "HALF", label: "买卖双方各承担一半" },
    ],
    correctIndex: 0, // 卖方
    explanation:
      "Incoterms 2020规定FOB下风险在「货物装上船时」转移。吊装过程中货物尚未完全放置于船上，风险仍在卖方。注意Incoterms 2020已取消「越过船舷」这一旧概念（那是Incoterms 2000的表述），改用更明确的「placed on board」。",
    knowledgePoints: [
      "Incoterms 2020: FOB风险在「货物装上船时」转移",
      "Incoterms 2020已删除「越过船舷」概念",
      "吊装过程中的事故——货物尚未装上船，风险在卖方",
    ],
    commonMistake: "仍使用旧版Incoterms(2000)的「越过船舷」概念来判断，但2020版已改用「装上船」。这个变化很多老业务员都不知道。",
    relatedTermCodes: ["FOB"],
  },
  {
    id: "q13",
    scenario:
      "一家中国医疗器械公司中标了沙特阿拉伯的医院采购项目。合同要求：卖方负责将货物送到利雅得医院的仓库，包括办理沙特进口清关、缴纳进口关税和增值税，买方只需在仓库门口接收即可。",
    question: "应选择哪个术语？",
    options: [
      { code: "DAP", label: "DAP — 目的地交货" },
      { code: "DPU", label: "DPU — 卸货地交货" },
      { code: "DDP", label: "DDP — 完税后交货" },
      { code: "CIF", label: "CIF — 成本加保险费、运费" },
    ],
    correctIndex: 2, // DDP
    explanation:
      "DDP（完税后交货）是Incoterms中卖方责任最大的术语，卖方负责包括出口报关、国际运输、进口报关、缴纳关税和增值税在内的全部环节。但需注意：实际操作中卖方必须能在沙特以自己名义或通过代理办理进口清关，否则无法执行DDP。",
    knowledgePoints: [
      "DDP = 卖方负责全程（含进口报关缴税）",
      "DDP是卖方责任最大的术语",
      "DAP/DPU的进口报关由买方负责",
    ],
    commonMistake: "DDP理论上是「门到门」但实操门槛极高——许多国家不允许外国卖方直接办理进口清关。",
    relatedTermCodes: ["DDP", "DAP", "DPU"],
  },
  {
    id: "q14",
    scenario:
      "宁波一家小家电出口商与客户约定在宁波北仑的货运站（不在卖方工厂）交货。卖方用自己的卡车将货物运到货运站，到达后买方指定的承运人接手。卖方把货物留在卡车上，由承运人自行卸车。",
    question: "根据FCA规则，卖方的做法（不卸货）是否正确？",
    options: [
      { code: "WRONG", label: "错误——FCA下卖方在任何地点都应负责卸货" },
      { code: "RIGHT", label: "正确——FCA下交货地点在卖方场所以外时，卖方运到即可" },
      { code: "HALF", label: "不完全——卖方应协助卸货但不承担费用" },
      { code: "DEPENDS", label: "取决于合同具体约定" },
    ],
    correctIndex: 1, // 正确
    explanation:
      "FCA下装/卸货责任取决于交货地点：若在卖方场所交货，卖方负责装货；若在其他地点（如货运站）交货，卖方将货物运到指定地点即可，不需要卸货。本题中交货地点是货运站（非卖方场所），卖方将货物用自己卡车运到后，不负责卸货是正确的。",
    knowledgePoints: [
      "FCA在卖方场所交货：卖方负责装货",
      "FCA在其他地点交货：卖方运到即可，不负责卸货",
      "理解FCA交货地点对责任划分的影响",
    ],
    commonMistake: "不清楚FCA下两种交货地点场景装货/卸货责任的区别，以为FCA在任何情况下卖方都要装货。",
    relatedTermCodes: ["FCA"],
  },
  {
    id: "q15",
    scenario:
      "重庆一家摩托车出口商需要将货物从重庆陆运到上海港，再海运到肯尼亚蒙巴萨。客户要求卖方支付从重庆工厂到蒙巴萨港的全程运费。",
    question: "应该选择CFR还是CPT？",
    options: [
      { code: "CFR", label: "CFR——因为最终运输段是海运" },
      { code: "CPT", label: "CPT——因为整体是多式联运" },
      { code: "CIF", label: "CIF——如果还需要卖方买保险" },
      { code: "FOB", label: "FOB——陆运+海运组合应选FOB" },
    ],
    correctIndex: 1, // CPT
    explanation:
      "CFR仅适用于纯海运/内河水运。重庆到上海是陆运（公路/铁路），整体属于多式联运，必须选择适用任何运输方式的CPT。关键判断标准：整个运输链中是否只有海运？如果是，可以选CFR/CIF；如果有陆运/空运/铁路段，必须选CPT/CIP等适用任何运输方式的术语。",
    knowledgePoints: [
      "CFR/CIF/FOB/FAS仅适用于纯海运/内河水运",
      "包含陆运/空运/铁路的多式联运必须使用适用任何运输方式的术语",
      "CPT适用于任何运输方式且卖方付运费",
    ],
    commonMistake: "看到运输链中有一段海运就惯性选择CFR/CIF，忽略了前面的陆运段——整体判断运输方式，不是只看最后一段。",
    relatedTermCodes: ["CPT", "CFR", "CIF"],
  },
];
