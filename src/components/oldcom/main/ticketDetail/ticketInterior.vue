<template>
<div class='in_body_int'>
  <div class="in_s_div">
    <div class="aheader">

      <el-select class='ah_el ah_margin' size="mini" v-model="timetype" style='width:85px'>
        <el-option v-for="item in timeOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <datapack class=' ah_margin' ref='datapack' @change='receiveVal' style='margin:0' :values='timeslot' v-if="timetype==1" :types="'datetime'" :widths='170' />
      <el-date-picker class=' ah_margin' v-model="timePoint" type="datetime" placeholder="选择日期时间点" size="mini" style='width:200px' v-if="timetype==2" :picker-options="picker2" />
      <merchant class=' ah_margin' @change='handleMerchant' v-if='typeflag==2' style='margin:0' />
      <el-select class='ah_el ah_b  ah_margin' size="mini" v-model="lottype" clearable placeholder="请选择彩种" style='width:140px'>
        <el-option v-for="item in lotysOption" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select class='ah_el ah_b  ah_margin' size="mini" v-model="lotstate" clearable placeholder="请选择状态" style='width:120px'>
        <el-option v-for="item in stateOption" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <accounts class=' ah_margin' @change='handleAccounts' />

      <!-- <div style="heigh t:4px"></div> -->
      <el-input class='ah_el ah_margin' v-model="keyword" placeholder="请输入完整订单号" size="mini" style="width:210px" clearable />
      <el-button class='ah_el ah_elbtn ah_margin' size="mini" type="primary" @click="to_hanldeOverView_list">查询</el-button>
      <el-button class='ah_el ah_elbtn ah_elbtn_flag ah_margin' size="mini" type="info" plain style="margin-left:0" @click="_handleExport">导出</el-button>
      <span class='ah_cl_span ah_margin' v-if='timetype==2'>备注：当为<font> 时间点 </font>选项时，数据结果为所选时间点前后的数据，前后分别最多提供100条</span>
    </div>
    <el-table :data="tableData" show-summary :summary-method="getSummaries" style="text-align:center" header-row-class-name='ah_table_lead' :max-height='cHeight' border class='index_table_tic' v-loading="tableLoading">
      <el-table-column prop="orderNo" label="平台单号" min-width="180" :align='alignL'>
        <content slot-scope="scope">
          <el-popover placement="right" min-width="200" trigger="hover" @after-enter='hanleElPshow' @hide='hanleElPhide'>
            <div class="_elp">代理商单号：<span>{{scope.row.orderNo}}</span>
              <button class="_elp_btn" :data-clipboard-text="scope.row.orderNo">复制</button>
            </div>
            <div class="_elp">平台　单号：<span>{{scope.row.ticketId}}</span>
              <button class="_elp_btn" :data-clipboard-text="scope.row.ticketId">复制</button>
            </div>
            <span slot="reference" class='_elb_span' @click="toGoedit(scope.row)">{{scope.row.ticketId}}</span>
          </el-popover>
        </content>
      </el-table-column>
      <el-table-column prop="merId" label="代理商" min-width="100">
        <label slot-scope="scope">{{scope.row.merId|merinfor($store.state.merchantList,'merId','merName')||'--'}}</label>
      </el-table-column>
      <el-table-column prop="lotId" label="彩种" min-width="100">
        <label slot-scope="scope">{{scope.row.lotId|lottery}}</label>
      </el-table-column>
      <el-table-column prop="lotIssue" label="期次" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="bet" label="投注金额" min-width="90" :align='alignR'>
        <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.bet|myfilter(0)}}</span></label>
      </el-table-column>
      <el-table-column prop="bonus" label="中奖金额" min-width="90" :align='alignR'>
        <label slot-scope="scope"><span style="color: #E7505A;font-weight: bold;" v-if='scope.row.bonus>0'>{{scope.row.bonus|myfilter(2)}}</span><span style="color: #333;font-weight: bold;" v-else-if='scope.row.bonus==0'>{{scope.row.bonus|myfilter(2)}}</span><span style="font-weight: bold;" v-else>--</span></label>
      </el-table-column>
      <el-table-column prop="ticketStatus" label="状态" min-width="90">
        <label slot-scope="scope">{{scope.row.ticketStatus|work_status2}}</label>
      </el-table-column>
      <el-table-column prop="handleTime" label="出票时间" min-width="160">
      </el-table-column>
      <!-- <el-table-column prop="handleTime" label="处理时间" min-width="160"></el-table-column> -->
      <el-table-column prop="ticketMan" label="出票员" min-width="120">
          <div slot-scope="scope">{{scope.row.ticketMan|merinfor($store.state.accountList,'tkAccount','tkName')||'--'}}</div>

      </el-table-column>
      <!-- <el-table-column prop="" label="" min-width="10">
      </el-table-column> -->
    </el-table>
    <pagePilots :pcount='totalCount' :psize='pageSize' :pnums='pageNumber' @sizeChange='sizeResult' @numChange='numResult'></pagePilots>

  </div>
</div>
</template>

<script>
import ClipboardJS from "clipboard";
export default {
  name: 'TICKETINT',
  data() {
    return {
      totalCount: 1,
      pageSize: 200,
      pageNumber: 1,

      timeslot: ["", ""],
      tableData: [],
      tableLoading: false,

      lottype: "",
      lotstate: "",
      keyword: "",
      slelectLoading: false,
      fctname: "",
      Clip: "",
      overView: {
        byBetBonus: {},
        syBetBonus: {},
        zrBetBonus: {},
        money: ""
      },
      alignR: "right",
      alignL: "left",
      accounts: '',
      timetype: 1,
      timePoint: '',
      timeOption: [{
        id: 1,
        name: '时间段'
      }, {
        id: 2,
        name: '时间点'
      }],
      // fctOption: this.$store.state.agentList,
      lotysOption: this._date._BASIC.Lottype,
      stateOption: this._date._WORK.states,
      picker2: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        }
      }

    };
  },
  methods: {
    /* 出票员 select */
    handleAccounts(val) {
      this.accounts = val
    },
    /* 商户 select */
    handleMerchant(val) {
      this.fctname = val
    },
    _dataInit() {
      this.totalCount = 1;
      this.pageSize = 200;
      // this.timeslot = ["", ""];
      this.pageNumber = 1;
      this.tableData = [];
      this.tableLoading = false;
      this.lottype = "";
      this.lotstate = "";
      this.keyword = "";
      this.slelectLoading = false;
      this.fctname = "";
      this.Clip = "";
      this.accounts = ''
      this.timetype = 1
      this.timePoint = ''
    },
    hanleElPshow() {
      const _this = this;
      var btns = document.querySelectorAll("button");
      var ClipBoard = new ClipboardJS(btns);
      ClipBoard.on("success", function(e) {
        e.clearSelection();
        _this._message("复制成功！", "success");
      });
      ClipBoard.on("error", function(e) {
        _this._message("您的浏览器暂不支持,请手动复制！", "error");
      });
      this.Clip = ClipBoard;
    },
    hanleElPhide() {
      if (this.Clip) {
        this.Clip.destroy();
      }
    },
    toGo() {
      this.$router.push({
        path: "/index/order"
      });
    },
    toGoedit(param) {
      if (this.typeflag != 2) return;
      localStorage.setItem("agent_orderID", param.ticketId);
      this.$router.push({
        path: "/interior/order",
        query: {
          orderID: param.ticketId
        }
      });
    },
    receiveVal(val) {
      this.timeslot[0] = val[0] ? new Date(val[0]).format("yyyy-MM-dd hh:mm:ss") : "";
      this.timeslot[1] = val[1] ? new Date(val[1]).format("yyyy-MM-dd hh:mm:ss") : "";
    },
    sizeResult(val) {
      this.pageSize = val;
      this._hanldeOverView_list();
    },
    numResult(val) {
      this.pageNumber = val;
      this._hanldeOverView_list();
    },
    getSummaries(param) {
      const showSum = [
        [4, 0],
        [5, 2]
      ];
      return this._getSummaries(param, showSum);
    },
    to_hanldeOverView_list() {
      if (this.timetype == 2 && this.timePoint == '') {
        this._message('时间点选项时，时间不能为空！', "error");
        return
      }
      if (this.tableLoading) return;
      this.pageNumber = 1;
      this.totalCount = 0;
      this._hanldeOverView_list();
      this._hanldeBanlance();
    },
    _hanldeOverview() {
      this.http.post("/ticket/overView", {}).then(res => {
        if (res.status) {
          if (res.status == 200) {
            this.overView = res.data;
            this._hanldeOverView_list();
          } else {
            this._message(res.msg, "error");
          }
        }
      });
    },
    _hanldeOverView_list() {
      this.tableLoading = true;
      var obj = {
        sDate: this.timeslot[0],
        eDate: this.timeslot[1],
        lotId: this.lottype,
        merId: this.fctname,
        orderOrPhone: this.keyword,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        ticketStatus: this.lotstate,
        ticketMan: this.accounts,
        timePoint: new Date(this.timePoint).format("yyyy-MM-dd hh:mm:ss"),
      };
      if (this.timetype == 1) obj.timePoint = ''
      else {
        obj.sDate = '';
        obj.eDate = '';
      }
      this.http.post("/bingoticket/list", obj).then(res => {
        if (!res.status) throw res
        if (res.status == 200) {
          this.tableData = res.data.entitys;
          this.pageNumber = res.data.pageNumber;
          this.pageSize = res.data.pageSize;
          this.totalCount = res.data.totalCount;
        } else {
          this._message(res.msg, "error");
        }
        this.tableLoading = false;
      }).catch(res => {
        this.tableLoading = false;
      });
    },
    _handleExport() {
      this.http.get("/ticket/list/export", {
          sDate: this.timeslot[0],
          eDate: this.timeslot[1],
          lotId: this.lottype,
          merId: "",
          orderOrPhone: this.keyword,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          ticketStatus: this.lotstate
        })
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              // this.overView = res.data;
              // this._hanldeOverView_list();
            } else {
              this._message(res.data, "error");
            }
          }
        });
    },
    _hanldeBanlance() {
      if (this.typeflag == 1) {
        this.http.post("/wallet/balance", {}).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.overView.money = res.data;
            }
          }
        });
      }
    },
  },
  computed: {
    cHeight() {
      return this.$store.state.cHeigt - 200;
    },
    typeflag() {
      return this.$store.state.userInfo.types;
    }
  },
  components: {},
  watch: {},
  activated() {
    if (!this.store.keepAlive || this.tableData.length == 0) {
      this._dataInit()
      this._hanldeOverview();
      // console.log('非子页面返回')
    } else {
      // console.log('子页面返回')
    }
  },
  created() {},
  beforeDestroy() {
    this.$off();
  },
  mounted() {}
};
</script>

<style lang='less' scoped>
.in_body_int {
  overflow: hidden;
  .in_f_div {
    overflow: hidden;
    padding-left: 25px;
    background: #fff;
    // height: 140px;
    padding-bottom: 10px;
    .lb_span {
      display: block;
      text-align: left;
      font-size: 26px;
      // float: left;
      width: 50px;
      padding-left: 20px;
      margin-right: 20px;
    }
    .lb_div {
      // width: 240px;
      // float: left;
      flex: 1;
      text-align: right;
      font {
        // font-family: PingFangSC-Light;
        display: block;
        padding: 20px 0 10px 0;
        height: auto;
        font-size: 16px;
        line-height: 1;
        color: #666666;
      }
      span {
        // font-family: PingFangSC-Medium;
        display: block;
        height: auto;
        // padding: 5px 0;
        margin: 3px 0;
        font-size: 20px;
        // font-weight: bold;
        line-height: 1;
      }
      div {
        display: inline-block;
        // margin-top: 7px;
        padding: 8px 25px;
        // height: 30px;
        // line-height: 30px;
        // margin: 0 auto;
        color: #fff;
        background: #ea636c;
        border-radius: 2px;
      }
    }
  }
  .in_s_div {
    // margin-top: 10px;
    overflow: hidden;
    padding: 10px;
    background: #fff;
    .aheader {
      float: left;
      text-align: left;
      margin-bottom: 5px;
      .ah_el {
        width: 100px;
        vertical-align: middle;
      }
      .ah_elbtn {
        width: 70px !important;
      }
      .ah_margin {
        margin:  0 0  5px 0!important;
        vertical-align: middle;
      }
      .ah_cl_span{
        display: inline-block;
        height: 28px;
        line-height: 28px;
        color: #777;
        font{
          font-weight: bold;
          color: #444;
        }
      }
    }
    .afooter {
      margin-top: 10px;
      text-align: right;
    }
    ._elb_span {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>

<style lang='less'>
.index_table_tic {
  border: 1px solid #f5f7fa;
  border-bottom: none;
  .el-table__footer-wrapper {
    table tr {
      td:nth-child(5) {
        color: #008284;
        div {
          font-weight: bold;
        }
      }
      td:nth-child(6) {
        div {
          font-weight: bold;
        }
        color: #e7505a;
      }
    }
  }
}
</style>
