<template>
<div class='virtual'>
  <div class="countlist rule">
    <div class="couQuery">
      <!-- <datapack ref='datapack' class='cou_' @change='receiveVal' :defaults='true' :values='timeslot'></datapack> -->
      <merchant @change='handleMerchant'></merchant>
      <el-select v-model="timesId" size='mini' style="width:180px" placeholder="请选择比赛场次">
        <el-option v-for="item in options" :key="item.time" :label="item.time" :value="item.time">
        </el-option>
      </el-select>
      <el-button type="primary" class='cou_' size='mini' icon='el-icon-search' @click="_PostInit">搜索</el-button>

      <!-- <el-button type="info">勾选出票</el-button> -->
      <el-button type="danger" size='mini' style='margin-left:200px;' @click='batchRefund'>退 票</el-button>
      <el-button plain type="warning" size='mini' style='margin:0 10px;' @click="toggleSelection()">清空已选</el-button>
      <!-- <el-button type="danger">危险按钮</el-button> -->
      <!-- <accounts @change='handleAccounts' v-if='accountFlag' all :title="'出票员:'"></accounts> -->
      <!-- <machines @change='handleMachines' v-if='machineFlag' all :title="'机器编号:'"></machines> -->
    </div>
    <div v-loading="tableLoading">
      <el-table :data="tableDatas" border class='index_table_tic no_xscroll' :show-header='false' id='total_table'>
        <el-table-column prop='' width="300" fixed>
          <div slot-scope="scope">总计</div>
        </el-table-column>
        <!-- <el-table-column prop='astime' label="比赛时间" width="180"></el-table-column> -->
        <el-table-column prop="orderid" label="订单编号" min-width="180" align='left' show-overflow-tooltip></el-table-column>
        <el-table-column prop="merId" label="商户" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="lotteryid" label="彩种" min-width="100"></el-table-column>
        <el-table-column prop="betmoney" label="投注额" min-width="80" align='right'></el-table-column>
        <el-table-column prop="bonus" label="预期奖金" min-width="80" align='right'></el-table-column>
        <el-table-column prop="context" label="玩法" min-width="130"></el-table-column>
        <el-table-column prop="outtic" label="锁定人" min-width="120"></el-table-column>
        <el-table-column prop="" width="15" v-if='scroll'></el-table-column>

      </el-table>

      <el-table :data="tableData" border style="width: 100%" class='index_table_tic' header-row-class-name='ah_table_lead_d2d4d8' stripe :row-key='handleRowkey' :expand-row-keys='expandArray' @expand-change='handleExpand' :max-height='cHeight' @select='handleSelect'
        id='child_table' @select-all="handleSelect" ref="multipleTable">
        <el-table-column type="selection" width="55" :selectable='handleSelectable'></el-table-column>
        <el-table-column type="expand" fixed width="55">
          <div slot-scope="props" class="expand expand_bgc">
            <div class="expand_div">
              <ul class="ul_left">
                <li><span>彩种：</span>
                  <font>{{props.row.lotteryid|lottery}}</font>
                </li>
                <li><span>期次：</span>
                  <font v-for="(x,index) in props.row.pidary" :key='index'>{{x+index}}</font>
                </li>
                <li><span>预期奖金：</span>
                  <font>{{props.row.bonus}}</font>
                </li>
                <li><span>商户：</span>
                  <font>{{props.row.merId}}</font>
                </li>
                <li><span>订单编号：</span>
                  <font>{{props.row.orderid}}</font>
                </li>
              </ul>
              <ul class="ul_right">
                <li class='sp_li'><span>投注截止：</span>
                  <font>{{props.row.astime}}</font>
                </li>
                <li class='sp_li'><span>投注金额：</span>
                  <font style="color: rgb(0, 130, 132);">{{props.row.betmoney}}</font>
                </li>
                <li class='sp_li'><span>玩法：</span>
                  <font>{{props.row.context|work_order_play}}</font>
                </li>
                <li class='sp_li'><span>投注内容：</span>
                  <font v-for='(x,index) in props.row.list' :key="index">
                    {{x[0]|work_slice(8,12)}}|{{x[3]|work_play}}={{x[1]|work_content(x[2],x[3])}}
                  </font>
                </li>
                <li class='sp_li'><span>投注倍数：</span>
                  <font v-for='(x,index) in props.row.items' :key="index">
                    <i style="color:red">{{x.multiple}}倍</i><i>*</i><i>{{x.count}}张</i><i>（单张投注额{{x.money}}元）</i>
                  </font>
                </li>
              </ul>
            </div>
          </div>
        </el-table-column>
        <el-table-column prop='astime' label="比赛时间" width="190" fixed></el-table-column>
        <el-table-column prop="orderid" label="订单编号" min-width="180" align='left' show-overflow-tooltip></el-table-column>
        <el-table-column prop="merId" label="商户" min-width="80" show-overflow-tooltip>
          <div slot-scope="scope">{{scope.row.merId|merinfor($store.state.merchantList,'merId','merName')}}</div>
        </el-table-column>
        <el-table-column prop="lotteryid" label="彩种" min-width="100">
          <div slot-scope="scope">
            {{scope.row.lotteryid|lottery}}
          </div>
        </el-table-column>
        <el-table-column prop="betmoney" label="投注额" min-width="80" align='right'></el-table-column>
        <el-table-column prop="bonus" label="预期奖金" min-width="80" align='right'></el-table-column>

        <el-table-column prop="context" label="玩法" min-width="130">
          <div slot-scope="scope">
            {{scope.row.context|work_order_play}}
          </div>
        </el-table-column>
        <el-table-column prop="outtic" label="锁定人" min-width="120"></el-table-column>
      </el-table>
      <pagePilots :pcount='totalCount' :psize='pageSize' :pnums='pageNumber' @sizeChange='sizeChange' @numChange='numChange'></pagePilots>
    </div>
  </div>
  <el-dialog title="反馈汇总" :visible.sync="dialogTableVisible" width="700px" top='5vh' :append-to-body='true' :close-on-click-modal='false' custom-class='virtualDialog'>
    <span style="font-size:14px;margin:3px 0">批量请求共{{resList.count}}条，成功{{resList.count-resList.length}}条，失败{{resList.length}}条</span>
    <el-table :data="resList" style="width: 100%" border  header-row-class-name='ah_table_lead_d2d4d8':max-height='cHeight' >
      <el-table-column prop="ticketId" label="订单ID" min-width="180" align='left'></el-table-column>
      <!-- <el-table-column prop="request" label="状态" min-width="100"  align='left'></el-table-column> -->
      <el-table-column prop="result" label="错误反馈" min-width="380"  align='left'></el-table-column>
    </el-table>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'VIRTUAL',
  data() {
    return {
      handleRowkey: function(row) {
        return row.orderid
      },
      expandArray: [],
      expandArrayLenght: 3,
      exLoading: false,
      // timeslot: ['', ''],
      comid: '',
      timesId: '',
      cpyid: 'all',
      machineId: 'all',

      totalCount: 0,
      pageSize: 400,
      pageNumber: 1,
      tableLoading: false,
      tableData: [],
      tableDatas: [{}],
      // multipleSelection:[],
      selection: [],
      resList: [],
      dialogTableVisible:false,

      rule: this.$store.state.rule,
      options: this.$store.state.timesList,
    }
  },
  computed: {
    scroll() {
      const a = (this.tableData.length - parseInt((this.$store.state.cHeigt - 180) / 30))
      return a < 0 ? false : true;
    },
    cHeight() {
      return this.$store.state.cHeigt - 200;
    },
  },
  methods: {
    /* handleSelect */
    handleSelect(val, row) {
      //  this.multipleSelection = val;
      this.selection = val.map(x => x.orderid)
      // console.log(this.selection)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectable(val) {
      if (val.outtic) return false
      return true
    },
    /*  _pagePilotsInit 初始化 */
    _pagePilotsInit(a, b) {
      this.expandArray = [];
      this.totalCount = 0
      this.pageSize = a ? this.pageSize : 400
      this.pageNumber = 1;
      this.account = '';
      this.merId = '';
    },
    /* pagePilots */
    sizeChange(val) {
      this.pageSize = val;
      this._Postlist()
    },
    numChange() {
      this.pageNumber = val;
      this._Postlist()
    },
    /* table expand 展开项 */
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
    /* 机器编号 */
    // handleMachines(val) {
    //   this.machineId = val
    // },
    /* 商户 */
    handleMerchant(val) {
      this.comid = val
    },
    /* 退票btn */
    batchRefund() {
      if (this.tableLoading) return
      // console.log()
      if(this.selection.length==0)return

      this.resList = [];
      // console.log(this.selection)
      let x = (this.selection.join(',')).split(',')
      this.resList.count=x.length;

      this._handlePost(x)
      this.tableLoading = true;
    },
    /* 批量请求 */
    _handlePost(list) {
      this.http.post("/piquet/doTicket", {
        ticketId: list[0],
        type: 2,
        machineSn: '06049540-101'
      }).then(res => {
        if (res.status) {
          if (res.status == 200) {} else {
            this.resList.push({
              ticketId: list[0],
              result: res.msg
            })
          }
          list.splice(0, 1)
          if (list.length > 0) {
            this._handlePost(list)
          } else {
            this._handleListExit()
            return
          }
        }
      }).catch(error => {
        this.resList.push({
          ticketId: list[0],
          result: '网络请求错误'
        })
        list.splice(0, 1)
        if (list.length > 0) {
          this._handlePost(list)
        } else {
          this._handleListExit()
          return
        }
      });
    },
    /* 批量结果反馈信息 */
    _handleListExit() {
      // console.table(this.resList)
      this.tableLoading = false;
      this.toggleSelection()
      this._Postlist()
      if(this.resList.length>0){
        this.dialogTableVisible=true;
      }else{
        this._message('批量请求全部成功','success')
      }
      this.selection=[];
    },
    /* 查询 init */
    _PostInit() {
      if (this.tableLoading) return
      this.times = this.timesId;
      this.merId = this.comid;
      // this.machine = this.machineId;
      // this.times = [this.timeslot[0], this.timeslot[1]]
      // this.obj = JSON.parse(JSON.stringify(this.checkList))
      this._Postlist();
    },
    /* // 竞彩解析 */
    handleAys(val, type) {
      const f = this.order();
      var temp_a = f.detailsZ(val, type);
      return temp_a
    },
    /* 查询 */
    _Postlist() {
      if (this.tableLoading) return

      this.tableLoading = true;
      this.tableData = [];
      this.tableDatas = [{}]
      this.http.post('/piquet/memoryList', {
        gameTime: this.times,
        merId: this.merId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }).then(res => {
        if (res.status == 200) {
          let r = res.data.entitys
          this.tableData = r;
          this.tableData.map(x => {
            x.pidary = x.pid.split(',')
            x.list = this.handleAys(x.context, x.lotteryid)
          })
          this.tableDatas = [res.data.total]
          this.pageNumber = res.data.pageNumber
          this.pageSize = res.data.pageSize
          this.totalCount = res.data.totalCount
        } else {
          this._message(res.msg, "error");
        }
        this.tableLoading = false;
      }).catch(err => {
        this.tableLoading = false;
      })
    },
    /* 时间场次 */
    _hanldeTimeList() {
      let l = this.$store.state.timesList;
      if (l.length > 0) return;
      this.slelectLoading = true;
      this.http.post("/piquet/baseInfo", {}).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.slelectLoading = false;
              this.$store.state.timesList = [];
              this.$store.state.timesList = res.data.dcps;
              this.options = res.data.dcps;
            }
          }
        })
        .catch(error => {
          this.slelectLoading = false;
        });
    },
  },
  components: {},
  activated() {
    // this._PostInit()
  },
  watch: {},
  created() {
    this._hanldeTimeList()
    this._PostInit()

  },
  mounted() {}
}
</script>

<style lang='less' scoped>
.virtual {
  overflow: hidden;
  .countlist {
    padding: 5px;
    background: #fff;
    .couQuery {
      text-align: left;
      margin-bottom: 4px;
    }
  }
  .expand_bgc {
    background-color: #efefef!important;
  }
  .expand {
    background: #e7f9df;
    overflow: hidden;
    .expand_div {
      margin: 0 auto;
      overflow: hidden;
      width: 800px;
      padding: 10px 5px;
      ul {
        overflow: hidden;
        float: left;
      }
      li {
        float: left;
        width: 100%;
        min-height: 30px;
        font-size: 16px;
        line-height: 30px;
        span {
          display: block;
          float: left;
          width: 100px;
          color: #555;
          text-align: right;
          font-size: inherit;
          line-height: inherit;
        }
        font {
          word-wrap: break-word;
          display: block;
          margin-left: 100px;
          text-align: left;
          font-size: inherit;
          line-height: inherit;
          overflow: hidden;
          i {
            float: left;
            font-style: normal!important;
          }
          i:nth-child(2) {
            margin: 0 5px;
          }
          i:nth-child(3) {
            margin-top: 4px;
            padding: 4px 10px;
            background: #000;
            color: yellow;
            line-height: 1;
          }
        }
      }
      .ul_left {
        width: 37%;
        padding-right: 10px;
        // li:first-child {
        //   margin-top: 5px;
        // }
      }
      .ul_right {
        border-left: 1px solid #ddd;
        width: 63%;
      }
    }
  }
}

</style>
