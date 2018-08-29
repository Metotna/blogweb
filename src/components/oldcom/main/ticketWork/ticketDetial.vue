<template>
<div class='tickteddetial'>
  <div class="ticdec">
      <el-table :data="tableDate" border style="width: 100%" class='index_table_tic' v-loading="tableLoading" header-row-class-name='ah_table_lead_d2d4d8' stripe :row-key='handleRowkey' :expand-row-keys='expandArray'@expand-change='handleExpand'  :max-height='cHeight'>
        <el-table-column type="expand" fixed>
          <div slot-scope="props" class="expand expand_bgc">
            <div class="expand_div">
              <ul class='ul_left'>
                <li><span>彩种：</span>
                  <font>{{props.row.lotteryid|lottery}}</font>
                </li>
                <li><span>期次：</span>
                  <font v-for="(x,index) in props.row.pid.split(',')" :key='index'>{{x}}</font>
                </li>
                <li><span>投注金额：</span>
                  <font>{{props.row.betmoney}}</font>
                </li>
                <li><span>商户：</span>
                  <font>{{props.row.merId|merinfor(comOptions)}}</font>
                </li>
                <li><span>订单编号：</span>
                  <font>{{props.row.orderid}}</font>
                </li>
              </ul>
              <ul class='ul_right sp_li'>
                <li><span>投注截止：</span>
                  <font>{{props.row.astime}}</font>
                </li>
                <li><span>出票时间：</span>
                  <font>{{props.row.outtime}}</font>
                </li>
                <li><span>预期奖金：</span>
                  <font>{{props.row.bonus}}</font>
                </li>
                <li><span>玩法：</span>
                  <font>{{props.row.context|work_order_play}}</font>
                </li>
                <li class='span_red'><span>投注倍数：</span>
                  <font>{{props.row.multiple}}</font>
                </li>
                <li><span>投注内容：</span>
                  <font v-for='(x,index) in props.row.list' :key="index">
                    {{x[0]|work_slice(8,12)}}|{{x[3]|work_play}}={{x[1]|work_content(x[2],x[3])}}
                  </font>
                </li>
              </ul>
            </div>
          </div>
        </el-table-column>
        <el-table-column type='index' label="序号" width="40"></el-table-column>
        <el-table-column prop="orderid" label="编号" min-width="180" align='left' show-overflow-tooltip></el-table-column>
        <el-table-column prop="lotteryid" label="彩种" min-width="100">
          <div slot-scope="scope">
            {{scope.row.lotteryid|lottery}}
          </div>
        </el-table-column>
        <el-table-column prop="betmoney" label="投注额" min-width="80" align='right'></el-table-column>
        <el-table-column prop="outtime" label="出票时间" min-width="165"></el-table-column>
        <el-table-column prop="bonus" label="预期奖金" min-width="80" align='right'></el-table-column>
        <el-table-column prop="outstate" label="出票状态" min-width="100" v-if='hisStatus==1'>
          <div slot-scope="scope">
            {{scope.row.outstate|work_status}}
          </div>
        </el-table-column>
        <el-table-column prop="context" label="玩法" min-width="130">
          <div slot-scope="scope">
            {{scope.row.context|work_order_play}}
          </div>
        </el-table-column>
        <el-table-column prop="merId" label="商户" min-width="80" show-overflow-tooltip>
          <div slot-scope="scope">{{scope.row.merId|merinfor(comOptions)}}</div>
        </el-table-column>
        <el-table-column prop="outtic" label="出票人" min-width="120" v-if='hisStatus==1'></el-table-column>
      </el-table>
    <pagePilots :pcount='pageCount' :psize='pageSizes' :pnums='pageNumber' @sizeChange='sizeChange' @numChange='numChange'></pagePilots>
  </div>
</div>
</template>

<script>
export default {
  name: 'TICKETED',
  data() {
    return {
      comOptions: this.$store.state.agentList,
         handleRowkey: function(row) {
        return row.date
      },
      expandArray: [],
      expandArrayLenght: 3,
      accountFlag: false,
      merIdFlag: false,

      pageCount: 0,
      pageSizes: 200,
      pageNumber: 1,
      tableLoading: false,
      tableData: [],
    }

  },
  computed: {
      rule() {
      return this.store.rule
    },
        cHeight() {
      return this.$store.state.cHeigt - 290;
    },
  },
  methods: {
    _pagePilotsInit(a, b) {
      this.pageCount = 0
      this.pageSizes = a ? this.pageSizes : 200
      this.pageNumber = 1;
    },
    sizeChange(val) {
      this.pageSizes = val;
      this._Postlist()
    },
    numChange() {
      this.pageNumber = val;
      this._Postlist()
    },
    // table 展开
    handleExpand(val,row) {
      const vol = this.expandArrayLenght;
      const ary = this.expandArray
      if(ary.length==0 ) {
       this.expandArray.push(val.date)
        return 
      }
      const res = ary.findIndex(x => x == val.date)
      if (res > -1) {
        this.expandArray.splice(res, 1)
      } else {
        ary.push(val.date)
        if (ary.length > vol) {
          this.expandArray = ary.slice(ary.length - vol, ary.length)
        }
      }
    },
    // 时间赋值
    receiveVal(val) {
      this.timeslot[0] = val[0] ? new Date(val[0]).format("yyyy-MM-dd 00:00:00") : "";
      this.timeslot[1] = val[1] ? new Date(val[1]).format("yyyy-MM-dd 23:59:00") : "";
    },
    // 查询初始化
    __postInit() {
      this._pagePilotsInit();
      this._PostInit()
    },
 
    // 查询 init
    _PostInit() {
      this.accountFlag = false;
      this.merIdFlag = false;
      this.account = this.cpyid;
      this.merId = this.comid;
      this.times = [this.timeslot[0], this.timeslot[1]]
      this._Postlist();
    },
    //查询
    _Postlist() {
      this.accountFlag = !!this.account;
      this.merIdFlag = !!this.merId;

      this.tableLoading = true;
      this.http.post('/piquet/ticketHistory', {
        account: this.account,
        sDate: this.times[0],
        eDate: this.times[1],
        merId: this.merId,
        pageNumber: this.pageNumber,
        pageSizes: this.pageSizes,
      }).then(res => {
        if (res.status == 200) {
          this.tableData = res.data.entitys
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
  
  },
  activated() {
    this.__postInit()
  },
  watch: {},
  created() {

  },
  mounted() {
  }
}
</script>

<style lang='less' scoped>
.tickteddetial{

}
</style>
