var obj = {
  // 基本模块
  _BASIC: {
    Lotstate: [
      // { id: 100, name: '全部' },
      { id: 10, name: '申请出票' },
      { id: 20, name: '已接单' },
      { id: 10000, name: '成功出票' },
      { id: 9000, name: '出票失败' },
    ],
    Ordstate: [
      { id: 0, name: '已接单' },
      { id: 10, name: '已接单' },
      { id: 20, name: '已接单' },
      { id: 21, name: '出票失败' },
      { id: 22, name: '成功出票' },
      { id: 30, name: '成功出票' },
      { id: 31, name: '成功出票' },
      { id: 10000, name: '成功出票' },
      { id: 10001, name: '出票失败' },
      { id: 10002, name: '出票失败' },
    ],
    Ordstates: [
      { id: 1, name: '申请出票', value: '-1' },
      { id: 2, name: '已接单', value: '0,10,20' },
      { id: 3, name: '成功出票', value: '22,30,31,10000' },
      { id: 4, name: '出票失败', value: '21,10002' },
    ],
    // 0 新建 10 已支付 20 待出票 21 出票失败 22 出票成功 30 已开奖 31 奖金已复核 
    //  10000 关闭 10001 未支付关闭 10002 出票失败关闭
    OrdsList: [
      { id: 1, name: '待出票', array: [0, 1, 20] },
      { id: 2, name: '出票失败', array: [21, 10002, 10001] },
      { id: 3, name: '待开奖', array: [22] },
      { id: 4, name: '已开奖', array: [30, 31] },
    ],
    Lottype: [
      // { id: '0', name: '全部' },
      { id: '1', name: "竞彩足球" },
      { id: '2', name: "竞彩篮球" },
      { id: '3', name: "七星彩" },
      { id: '4', name: "排列3" },
      { id: '5', name: "排列5" },
      { id: '6', name: "大乐透" },
      { id: '7', name: "11选5(江西)" },
      { id: '8', name: "11选5(山东)" },
      { id: '9', name: "11选5(上海)" },
      { id: '10', name: "11选5(浙江)" },
      { id: '11', name: "双色球" },
      { id: '12', name: "七乐彩" },
      { id: '13', name: "福彩3D" },
      { id: '14', name: "北京赛车PK10" },
    ],
    JCWF: [
      { id: 'SPF', name: "胜平负" },

      { id: 'CBF', name: "猜比分" },
      { id: 'RSPF', name: "让球胜平负" },
      { id: 'BQC', name: "半全场" },
      { id: 'JQS', name: "进球数" },
      { id: 'SF', name: "胜负" },
      { id: 'RFSF', name: "让分胜负" },
      { id: 'SFC', name: "胜分差" },
      { id: 'DXF', name: "大小分" },
      { id: 'ZQHH', name: "竞足混合" },
      { id: 'LQHH', name: "竞篮混合" },

    ],
    Tsatype: [
      { id: 10, name: '现金充值' },
      { id: 20, name: '投注返奖' },
      { id: 10000, name: '出票扣款' },
    ],
    Factor: [
      { id: 10, name: '代理商1' },
      { id: 20, name: '代理商2' },
      { id: 10000, name: '代理商3' },
    ],
    resList: [
      { id: 1, name: '代理商管理',role:'1,2,3,4,5' },
      { id: 2, name: '资金流水',role:'1,2,3,4,5'  },
      { id: 3, name: '对账单', role:'1,2,3,4,5' },
      { id: 4, name: '出票明细',role:'1,2,3,4,5'  },
      { id: 5, name: '充值记录', role:'1,2,3,4,5' },
      { id: 6, name: '账号管理', role:'1,2,3,4,5' },
      { id: 7, name: '出票工作台',role:'1,2,3,4,5' , },
      { id: 8, name: '出票统计', role:'1,2,3,4,5' },
      { id: 9, name: '出票管理',role:'1,2,3,4,5'  },
      { id: 10, name: '内部出票明细',role:'1,4,5'  },
    ],
    roleList: [
      { id: 1, name: '代理商', },
      { id: 2, name: '财务', },
      { id: 3, name: '运营', },
      { id: 4, name: '管理员', },
      { id: 5, name: '出票员', },
    ],
    betType: [
      { id: 'SPF', name: '胜平负', },
      { id: 'BQC', name: '半全场', },
      { id: 'JQS', name: '进球数', },
      { id: 'RSPF', name: '让球胜负平', },
      { id: 'SF', name: '胜负', },
      { id: 'DXF', name: '大小分', },
      { id: 'SFC', name: '胜分差', },
      { id: 'RFSF', name: '让分胜负', },
    ]
  },
  _WORK: {
    state: [
      { id: 'NEW', name: '待出' },
      { id: 'LOCK', name: '已锁定' },
      { id: 'CLOSE', name: '已出' },
      { id: 'CLOSE_ERR', name: '未出' },
    ],
    states: [
      { id: 'NEW', name: '待出' },
      { id: 'LOCK', name: '已锁定' },
      { id: 'CLOSE', name: '出票成功' },
      { id: 'CLOSE_ERR', name: '出票失败' },
    ]
  },
  _CHARGE: {
    state: [
      { id: 'NEW', name: '待审核' },
      { id: 'AUDIT', name: '待审核' },
      { id: 'SUC', name: '审核通过' },
      { id: 'FAIL', name: '不通过' },
      { id: 'RECALL', name: '不通过' },
    ]
  },
  _CHARGE_: {
    state: [
      { id: 'NEW', name: '待审核' },
      { id: 'SUC', name: '审核通过' },
      { id: 'FAIL', name: '不通过' },
    ]
  },
  _BILL: {
    state: [
      { id: 'CHARGE', name: '现金充值' },
      { id: 'BET', name: '投注扣款' },
      { id: 'BETREFUND', name: '退款充值' },
      { id: 'BONUS', name: '返奖充值' },
      { id: 'FEECHARGE', name: '拥金充值' },
      { id: 'CASH', name: '提现扣款' },
    ]
  },
  _AGENT: {
    state: [
      { id: 'ON', name: '合作' },
      { id: 'OFF', name: '暂停合作' },
      { id: 'DEL', name: '删除' },

    ]
  },
  // GM
  _GM: {
    before: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
      }
    }],
    after: [{
      text: '一周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [end, start]);
      }
    }, {
      text: '两周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() + 3600 * 1000 * 24 * 14);
        picker.$emit('pick', [end, start]);
      }
    }, {
      text: '一个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [end, start]);
      }
    }, {
      text: '一年',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() + 3600 * 1000 * 24 * 365);
        picker.$emit('pick', [end, start]);
      }
    }],
  }
}
Object.defineProperty(window,'obj', {
    configurable: false,
    writable: false
});

// obj._BASIC.Lotstate[0].name='123123'
// console.log(obj._BASIC.Lotstate)
//  console.log(Object.getOwnPropertyDescriptor(window, 'obj'));

export default obj