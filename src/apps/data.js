export const MENUDATA = {
    // import { CONTRACT_MANAGE, CONFIG } from '../../common/data.js';
    // params: CONFIG['pagination'],

};
export const YUSUAN = {
    'yusuanList': [{
        id: 1,
        qnys: '2019全年预算',
        creatdate: '2019-01-16'
    }, {
        id: 1,
        qnys: '2018全年预算',
        creatdate: '2018-01-18'
    }, {
        id: 1,
        qnys: '2017全年预算',
        creatdate: '2017-01-12'
    }, {
        id: 1,
        qnys: '2016全年预算',
        creatdate: '2016-01-11'
    }
    ],
    'zhixingList': [{

        budgetProject: '股权筹资'

    }, {

        budgetProject: '债务筹资',

    }, {

        budgetProject: '处置子公司及其他单位的股权',

    }, {

        budgetProject: '收回委托贷款',

    }
    ]

};
export const PAYMENT = {
    'payType': [{
        id: 1,
        name: '国内差旅报销(对公)',
        type: 'pubDomTravel',
        api: 'pubDomTravels',
        describe: '公司人员出差，出发地和目的地均在中国内陆（不含港澳台）的出差涉及的支出，公司支付给旅行社等机构。',
        warn: '注意：',
        warn1: '1.差旅费用在集团制度标准内据实报销，金额超过100元人民币的票据均需经办人和费用承担部门负责人共同背签（未超过100元人民币的票据由经办人一人背签），票据较多时请根据交通、餐费、住宿等分类整齐平铺粘贴好；',
        warn2: '2.针对国内差旅，集团已统一为员工购买交通意外险，员工自行购买不予报销；',
        warn3: '3.所有补助款随同报销款一并打入报销经办人账户，经办人有义务将补助转给对应的收款人（借调人员无差旅补助，集团司机有差旅补助）；',
        warn4: '4.费用标准高随等超过集团制度规定标准的特殊情况，需由经办人提交情况说明，依次经由部门负责人、部门主管领导和财务主管领导批准后方可报销；',
        warn5: '5.由于因公产生行程变动而导致的退票、改签费用（前提是未超出出差审批单批准金额），需由经办人提交情况说明，依次经由部门负责人、部门主管领导批准后方可报销。',
    }, {
        id: 2,
        name: '国际差旅报销(对公)',
        type: 'pubInterTravels',
        api: 'pubInterTravels',
        describe: '公司人员出差，出发地或目的地在国外或者中国境内港澳台地区的出差涉及的支出，公司支付给机构。',
        warn: '注意：',
        warn1: '1.差旅费用在集团制度标准内据实报销，金额超过100元人民币的票据均需经办人和费用承担部门负责人共同背签（未超过100元人民币的票据由经办人一人背签），票据较多时请根据交通、餐费、住宿等分类整齐平铺粘贴好；',
        warn2: '2.所有补助款随同报销款一并打入报销经办人账户，经办人有义务将补助转给对应的收款人（借调人员无差旅补助，集团司机有差旅补助）；',
        warn3: '3.国际差旅附件要求：',
        warn4: '（1）费用明细表及费用部门分摊表：一笔开支/一张票据为一行信息，根据交通、餐饮、住宿、其他等项目分类、按时间先后顺序排列，在票据上也标明表格中对应的序号。若费用涉及多个部门进行分摊，需编制费用部门分摊表，根据人员费用实际承担部门进行拆分。以上两表需打印纸质版经办人及费用承担部门负责人在表格空白处或背面签字确认，同时将excel电子版上传。',
        warn5: '（2）汇率：请查询中国银行网站，选择整趟差旅行程出发日或返回日当日的任一时间点的使用币种的汇率（现汇卖出价），打印网站页面，圈出选定汇率。',
        warn6: '4.报销明细以折算后的人民币金额填写。',
    }, {
        id: 3,
        name: '日常支出(对公)',
        type: 'pubDailyExpense',
        api: 'pubDailyExpenses',
        describe: '日常支出：公司日常经营、办公等活动所产生的支出 ，公司支付给外部机构。',
    }, {
        id: 4,
        name: '招待费(对公)',
        type: 'pubEnterExpense',
        api: 'pubEnterExpenses',
        describe: '即业务招待费，指员工在承担业务和重要接待活动中必要的费用开支。主要指餐费、购置礼品费等有关业务费用。公司支付给机构。',
    }, {
        id: 5,
        name: '年度绩效及特别奖励(对公)',
        type: 'pubAward',
        api: 'pubAwards',
        describe: '公司结合年度各项绩效目标进行公司各层次奖励的支出，公司支付给机构。',
    }, {
        id: 6,
        name: '购买理财',
        type: 'pubAward',
        api: 'moneyManagements',
        describe: '即购买银行理财业务，指集团为提高资金使用效率和收益水平,通过利用自有闲置资金购买银行理财产品以实现资金保值增值的行为。',
    }, {
        id: 7,
        name: '缴纳税款',
        type: 'pay',
        api: 'paies',
        describe: '公司取得营业收入并实现利润，要按照权责发生制的原则将按规定应向国家缴纳各种税金而申请的支出，公司财务部税务提出申请。',
    }, {
        id: 9,
        name: '委贷及借款支出',
        type: 'loanby',
        api: 'loanbies',
        describe: '指由集团作为委托人提供资金，由受托人（一般指银行、信托投资公司等金融机构）根据委托人确定的借款人、用途、金额、期限、利率等代为发放、监督使用并协助收回的贷款。',
    }, {
        id: 10,
        name: '董事会费',
        type: 'pubBoardFee',
        api: 'pubBoardFees',
        describe: '董事会及其成员为行使职能而支付的费用。如董事会开会期间董事的差旅费、食宿费及其他必要开支，董事会日常活动经费等，公司支付给机构。',
    }, {
        id: 11,
        name: '资金划转',
        type: 'transfer',
        api: 'transfers',
        describe: '是指预算拨款的一种方式，是公司由一个账户向另一个账户拨款而进行申请的支出。',
    }, {
        id: 12,
        name: '分红及捐赠',
        type: 'pubDonate',
        api: 'pubDonates',
        describe: '公司根据经营情况对投资人进行利润分配的支出和对某些社会机构进行的慈善申请的支出，公司支付给机构。',
    }, {
        id: 13,
        name: '提取现金',
        type: 'withdrawCashe',
        api: 'withdrawCashes',
        describe: '从企业日常备用金账户而申请的支出。',
    }, {
        id: 8,
        name: '结算中心-对外还款',
        type: 'refund',
        api: 'refunds',
        describe: '公司偿还对外的借款而进行的支出。',
    }, {
        id: 14,
        name: '结算中心-资金划转',
        type: 'settleTransfer',
        api: 'settleTransfers',
        describe: '公司结算中心发起的单子，是指预算拨款的一种方式，是公司由一个账户向另一个账户拨款而进行申请的支出。',
    }, {
        id: 15,
        name: '结算中心-委贷及借款支出',
        type: 'settleLoan',
        api: 'settleLoans',
        describe: '公司财务部结算中心发起的单子，指由集团作为委托人提供资金，由受托人（一般指银行、信托投资公司等金融机构）根据委托人确定的借款人、用途、金额、期限、利率等代为发放、监督使用并协助收回的贷款。',
    }, {
        id: 16,
        name: '结算中心-日常支出',
        type: 'settleDailyExpense',
        api: 'settleDailyExpenses',
        describe: '公司财务部结算中心发起的单子，日常经营、办公等活动所产生的支出。',
    }, {
        id: 17,
        name: '项目',
        type: 'settleDailyExpense',
        api: 'investProjects',
        describe: '指投资拨款项目的，可用于投资子公司，投资于项目或对投资项目进行委托贷款而申请的支出。',
    }, {
        id: 18,
        name: '代持',
        type: 'investHeld',
        api: 'investHelds',
        describe: '集团受托管理政府统筹资金（以下简称代持资金）的股权投资业务，包括北京市重大科技成果转化和产业项目统筹资金支持的政府股权投资业务，以及市财政预算安排的中关村示范区现代服务业项目政府股权投资业务等。',
    },]
};
export const CONFIG = {
    'pagination': {
        pageNum: 1,
        pageSize: 5,
        total: 0
    },
    'docTypeList': [
        'doc',
        'xml',
        'pdf',
        'htm',
        'xls',
        'txt',
        '其他类'
    ],
    'status': [{
        id: '1',
        name: '已保存',
        value: '已保存'
    },
    {
        id: '2',
        name: '审核中',
        value: '审核中'
    },
    {
        id: '3',
        name: '已驳回',
        value: '已驳回'
    },
    {
        id: '4',
        name: '已完成',
        value: '已完成'
    },
    ],
    'comment': [
        {
            id: '1',
            name: '建议',
            value: 'ADVICE'
        }, {
            id: '2',
            name: '同意',
            value: 'APPROVE'
        }, {
            id: '3',
            name: '归档',
            value: 'ARCHIVE'
        }, {
            id: '4',
            name: '派遣',
            value: 'ARRANGE'
        }, {
            id: '5',
            name: '分配',
            value: 'ASSIGN'
        }, {
            id: '6',
            name: '撤销',
            value: 'CNACEL'
        }, {
            id: '7',
            name: '表态',
            value: 'COMMENT'
        }, {
            id: '8',
            name: '提交',
            value: 'COMMIT'
        }, {
            id: '9',
            name: '分发',
            value: 'DISPATCH'
        }, {
            id: '10',
            name: '反馈',
            value: 'FEEDBACK'
        }, {
            id: '11',
            name: '填表',
            value: 'FORM'
        }, {
            id: '12',
            name: '后加签',
            value: 'POSTSIGN'
        }, {
            id: '13',
            name: '套红',
            value: 'TEMPLATE'
        }, {
            id: '14',
            name: '前加签',
            value: 'PRESIGN'
        }, {
            id: '15',
            name: '采购',
            value: 'PURCHASE'
        }, {
            id: '16',
            name: '驳回',
            value: 'REJECT'
        }, {
            id: '17',
            name: '保存',
            value: 'SAVE'
        }, {
            id: '18',
            name: '签收',
            value: 'SIGNAN'
        }, {
            id: '19',
            name: '签批',
            value: 'SIGNOUT'
        }, {
            id: '20',
            name: '请领导签批',
            value: 'SUPERIOR'
        }]
};
export const CURRENCY = {
    'currency': [
        {
            dollar: 'C$',
            label: '加元',
            value: '加元'
        },
        {
            dollar: 'SFr',
            value: '瑞士法郎',
            label: '瑞士法郎'
        },
        {
            dollar: '￥',
            value: '人民币',
            label: '人民币'
        },
        {
            dollar: '€',
            value: '欧元',
            label: '欧元'
        },
        {
            dollar: '￡',
            value: '英镑',
            label: '英镑'
        },
        {
            dollar: 'HK$',
            value: '港币',
            label: '港币'
        },
        {
            dollar: 'JPY￥',
            value: '日元',
            label: '日元'
        },
        {
            dollar: '$',
            value: '美元',
            label: '美元'
        },
        {
            dollar: 'MOP$',
            value: '澳门币',
            label: '澳门币'
        },
        {
            dollar: 'NT$',
            value: '新台币',
            label: '新台币'
        }
    ],
};