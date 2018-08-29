<template>
<div class='tickted'>
  <div class="countlist rule">
    <div class="couQuery">
      <datapack ref='datapack' class='cou_' @change='receiveVal'  :values='timeslot'></datapack>
      <merchant @change='handleMerchant' v-if='merchanFlag' all :title="'商户:'"></merchant>
      <accounts @change='handleAccounts' v-if='accountFlag' all :title="'出票员:'"></accounts>
      <machines @change='handleMachines' v-if='machineFlag' all :title="'机器编号:'"></machines>
      <el-button type="primary" class='cou_' size='mini' icon='el-icon-search' @click="__postInit">搜索</el-button>
      <el-button type="info" class='cou_' size='mini' icon="el-icon-edit" v-popover:popover>更多条件</el-button>
    </div>
    <div v-loading="tableLoading">

        <el-table :data="tableDatas" border class='index_table_tic' :show-header='false'>
          <el-table-column type='index' label='总计' width='170' fixed>
            <div slot-scope="scope"><span style='font-weight:bold'>总计</span></div>
          </el-table-column>
          <el-table-column prop="merId" label="代理商" min-width="100" align='left'>
            <div slot-scope="scope">--</div>
          </el-table-column>
          <el-table-column prop="machine" label='机器编号' min-width="80" align='left'>
            <div slot-scope="scope">--</div>
          </el-table-column>
          <el-table-column prop="ticketCount" label="出票张数" min-width="80" align='right'  >
            <div slot-scope="scope">{{scope.row.ticketCount|work_number}}</div>
          </el-table-column>
          <el-table-column prop="ticketMoney" label="出票金额" min-width="100" align='right'>
            <div slot-scope="scope">{{scope.row.ticketMoney|work_number}}</div>
          </el-table-column>
          <!-- <el-table-column prop="praIncome" label="预计收益" min-width="100" align='right'></el-table-column>
          <el-table-column prop="preIncome" label="实际收益" min-width="100" align='right'></el-table-column> -->
          <el-table-column prop="noTicketCount" label="出票失败张数" min-width="80" align='right'>
            <div slot-scope="scope">{{scope.row.noTicketCount|work_number}}</div>
          </el-table-column>
          <el-table-column prop="noTicketMoney" label="出票失败金额" min-width="100" align='right'>
            <div slot-scope="scope">{{scope.row.noTicketMoney|work_number}}</div>
          </el-table-column>
          <el-table-column prop="account" label="出票员" min-width="120">
            <div slot-scope="scope">{{scope.row.account|merinfor($store.state.accountList,'tkAccount','tkName')||'--'}}</div>
          </el-table-column>
          <el-table-column prop="" width="15" v-if='scroll'></el-table-column>
        </el-table>

      <el-table :data="tableData" border class='index_table_tic' header-row-class-name='ah_table_lead_d2d4d8 ' stripe @expand-change='handleExpand' :row-key='handleRowkey' :expand-row-keys='expandArray' :max-height='cHeight'>
        <el-table-column type='index' label='序号' width='50' fixed></el-table-column>
        <el-table-column prop="sdate" label="日期" width="120" fixed></el-table-column>
        <el-table-column prop="merId" label="代理商" min-width="100" align='left'>
          <div slot-scope="scope">{{scope.row.merId|merinfor($store.state.merchantList,'merId','merName')||'--'}}</div>
        </el-table-column>
        <el-table-column prop="machine" label='机器编号' min-width="80" align='left'>
          <div slot-scope="scope">{{scope.row.machineSn|merinfor($store.state.machineList,'mSN','mName')||'--'}}</div>
        </el-table-column>
        <el-table-column prop="ticketCount" label="出票张数" min-width="80" align='right' sortable>
          <div slot-scope="scope">{{scope.row.ticketCount|work_number}}</div>
        </el-table-column>
        <el-table-column prop="ticketMoney" label="出票金额" min-width="100" align='right'>
          <div slot-scope="scope">{{scope.row.ticketMoney|work_number}}</div>
        </el-table-column>
        <!-- <el-table-column prop="praIncome" label="预计收益" min-width="100" align='right'></el-table-column>
      <el-table-column prop="preIncome" label="实际收益" min-width="100" align='right'></el-table-column> -->
        <el-table-column prop="noTicketCount" label="出票失败张数" min-width="80" align='right'>
          <div slot-scope="scope">{{scope.row.noTicketCount|work_number}}</div>
        </el-table-column>
        <el-table-column prop="noTicketMoney" label="出票失败金额" min-width="100" align='right'>
          <div slot-scope="scope">{{scope.row.noTicketMoney|work_number}}</div>
        </el-table-column>
        <el-table-column prop="account" label="出票员" min-width="120">
          <div slot-scope="scope">{{scope.row.account|merinfor($store.state.accountList,'tkAccount','tkName')||'--'}}</div>
        </el-table-column>
      </el-table>
    </div>
    <pagePilots :pcount='pageCount' :psize='pageSize' :pnums='pageNumber' @sizeChange='sizeChange' @numChange='numChange'></pagePilots>

  </div>
  <el-popover ref="popover" placement="bottom-start" title="更多条件" trigger="click" class='popover'>
    <el-checkbox-group v-model="checkList" @change='handleSelect'>
      <el-checkbox label="mer">商户</el-checkbox>
      <el-checkbox label="account" v-if='rule!=5'>出票员</el-checkbox>
      <el-checkbox label="machine">机器编号</el-checkbox>
    </el-checkbox-group>
  </el-popover>
  <el-dialog :visible.sync="dialogTableVisible" :append-to-body='true' :close-on-click-modal='false'>
    <ticDec></ticDec>
  </el-dialog>
</div>
</template>

<script>
import ticDec from './ticketDetial.vue'
export default {
  name: 'TICKETED',
  props: ['ticfalg'],
  data() {
    return {
      handleRowkey: function(row) {
        return row.date
      },
      expandArray: [],
      expandArrayLenght: 3,
      exLoading: false,

      timeslot: ['', ''],
      comid: 'all',
      cpyid: 'all',
      machineId: 'all',

      merchanFlag: true,
      accountFlag: false,
      machineFlag: false,

      checkList: ['mer'],

      pageCount: 0,
      pageSize: 200,
      pageNumber: 1,
      tableLoading: false,
      tableData: [],
      tableDatas: [{}],
      rule: this.$store.state.rule,

      dialogTableVisible: false,
      dialogTitle: '收款',
    }

  },
  computed: {
    scroll() {
      const a = (this.tableData.length - parseInt((this.$store.state.cHeigt - 180) / 30))
      return a < 0 ? false : true;
    },
    cHeight() {
      return this.$store.state.cHeigt - 180;
    },
  },
  methods: {
    handleSelect(val) {
      this.merchanFlag = !!(val.indexOf('mer') + 1)
      this.accountFlag = !!(val.indexOf('account') + 1)
      this.machineFlag = !!(val.indexOf('machine') + 1)
    },
    _pagePilotsInit(a, b) {
      this.expandArray = [];
      this.pageCount = 0
      this.pageSize = a ? this.pageSize : 200
      this.pageNumber = 1;
      this.account = '';
      this.merId = '';
    },
    sizeChange(val) {
      this.pageSize = val;
      this._Postlist()
    },
    numChange() {
      this.pageNumber = val;
      this._Postlist()
    },
    // // table 展开
    handleExpand(val, row) {
      const vol = this.expandArrayLenght;
      const ary = this.expandArray
      if (ary.length == 0) {
        this.expandArray.push(val.orderid)
        return
      }
      const res = ary.findIndex(x => x == val.orderid)
      if (res > -1) {
        this.expandArray.splice(res, 1)
      } else {
        ary.push(val.orderid)
        if (ary.length > vol) {
          this.expandArray = ary.slice(ary.length - vol, ary.length)
        }
      }
    },
    // 时间赋值
    receiveVal(val) {
      this.timeslot[0] = val[0] ? new Date(val[0]).format("yyyy-MM-dd") : "";
      this.timeslot[1] = val[1] ? new Date(val[1]).format("yyyy-MM-dd") : "";
    },
    // 查询初始化
    __postInit() {
      this._pagePilotsInit();
      this._PostInit()
    },
    // 机器编号
    handleMachines(val) {
      this.machineId = val
    },
    // 商户
    handleMerchant(val) {
      this.comid = val
    },
    // 出票员
    handleAccounts(val) {
      this.cpyid = val
    },
    // 查询 init
    _PostInit() {
      this.account = this.cpyid;
      this.merId = this.comid;
      this.machine = this.machineId;
      this.times = [this.timeslot[0], this.timeslot[1]]
      // console.log(this.timeslot)
      this.obj = JSON.parse(JSON.stringify(this.checkList))
      this._Postlist();
    },
    //查询
    _Postlist() {
      var obj = {
        account: this.account,
        merId: this.merId,
        machineSn: this.machine,

        sDate: this.times[0],
        eDate: this.times[1],
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }
      this.obj.indexOf('mer') == -1 ? delete obj.merId : '';
      this.obj.indexOf('account') == -1 ? delete obj.account : '';
      this.obj.indexOf('machine') == -1 ? delete obj.machineSn : '';
      this.tableLoading = true;
      this.tableData = [];
      this.tableDatas = [{}]
      this.http.post('/piquet/ticketHistory', obj).then(res => {
        if (res.status == 200) {
          this.tableData = res.data.entitys
          this.tableDatas = [res.data.total]
          this.pageNumber = res.data.pageNumber
          this.pageSize = res.data.pageSize
          this.pageCount = res.data.totalCount
        } else {
          this._message(res.msg, "error");
        }
        this.tableLoading = false;
      }).catch(err => {
        this.tableLoading = false;
      })
    }
  },
  components: {
    ticDec,
  },
  activated() {
    this.__postInit()
  },
  watch: {},
  created() {
    this.timeslot[0] = new Date().format("yyyy-MM-01")
    this.timeslot[1] = new Date().format("yyyy-MM-dd")
  },
  mounted() {
    // this._hanldeAgentList()
    // this._hanldeMachineList()
  }
}
</script>

<style lang='less' scoped>
.tickted {
  .count {
    height: 32px;
    li {
      display: inline-block;
      margin: 0 10px;
      vertical-align: middle;
      overflow: hidden;
      height: 32px;
      span,
      font {
        display: block;
        float: left;
        line-height: 31px;
      }
      font {
        margin-left: 10px;
        padding: 0 10px;
        background-color: #fff;
        min-width: 150px;
        font-size: 20px;
      }
    }
  }
  .countlist {
    padding: 5px;
    background: #fff;
    .couQuery {
      overflow: hidden;
      margin-bottom: 5px;
      text-align: left;
      .cou_sel {
        width: 120px;
      }
      .cou_ {
        vertical-align: middle;
        // float: left;
        margin-right: 5px;
        margin: 0 2px;
      }
      .cou_label {
        float: left;
        overflow: hidden;
        span {
          line-height: 28px;
          float: left;
          font-size: 14px;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
