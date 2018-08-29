<template>
<div class='in_body'>
  <!-- <div class='in_f_div'>
    <div style='display:flex;padding-right:5%;'>
      <div class='lb_div' style="width:200px;flex:none" v-if='typeflag==1'>
        <font>账户余额</font>
        <span style="color: #333333;">{{overView.money|myfilter}}</span>
        <div @click='toGo'>充值</div>
      </div>
      <div class='lb_div'>
        <font>昨日(出票/返奖)</font>
        <span style="color: #008284;">{{overView.zrBetBonus.ticket|myfilter}}</span>
        <span style="color: #E7505A;">{{overView.zrBetBonus.bonus|myfilter}}</span>
      </div>
      <div class='lb_div'>
        <font>本月(出票/返奖)</font>
        <span style="color: #008284;">{{overView.byBetBonus.ticket|myfilter}}</span>
        <span style="color: #E7505A;">{{overView.byBetBonus.bonus|myfilter}}</span></div>
      <div class='lb_div'>
        <font>上月(出票/返奖)</font>
        <span style="color: #008284;">{{overView.syBetBonus.ticket|myfilter}}</span>
        <span style="color: #E7505A;">{{overView.syBetBonus.bonus|myfilter}}</span></div>
    </div>
  </div> -->
  <div class="in_s_div">
    <div class="aheader">
      <datapack ref='datapack' @change='receiveVal' style='margin:0' :values='timeslot'></datapack>
      <!-- <el-select class='ah_el' size="mini" v-model="fctname" clearable placeholder="请选择代理商" style='width:140px' :loading="slelectLoading" v-if='typeflag==2'>
        <el-option v-for="item in fctOption" :key="item.merId" :label="item.merName" :value="item.merId">
        </el-option>
      </el-select> -->
       <merchant @change='handleMerchant' v-if='typeflag==2'style='margin:0'  ></merchant>
      <el-select class='ah_el ah_b' size="mini" v-model="lottype" clearable placeholder="请选择彩种" style='width:140px'>
        <el-option v-for="item in lotysOption" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-select class='ah_el ah_b' size="mini" v-model="lotstate" clearable placeholder="请选择状态" style='width:120px'>
        <el-option v-for="item in stateOption" :key="item.id" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
      <el-input class='ah_el' v-model="keyword" placeholder="请输入完整手机号或完整订单号" size="mini" style="width:280px" clearable></el-input>
      <el-button class='ah_el ah_elbtn' size="mini" type="primary" @click="to_hanldeOverView_list">查询</el-button>
      <el-button class='ah_el ah_elbtn ah_elbtn_flag' size="mini" type="info" plain style="margin-left:0" @click="_handleExport">导出</el-button>
    </div>
    <el-table :data="tableData" show-summary :summary-method="getSummaries" style="text-align:center" header-row-class-name='ah_table_lead' :max-height='cHeight' border class='index_table_tic' v-loading="tableLoading">
      <el-table-column prop="orderNo" label="订单号" min-width="140" :align='alignL'>
        <content slot-scope="scope">
          <el-popover placement="right" min-width="200" trigger="hover" @after-enter='hanleElPshow' @hide='hanleElPhide'>
            <div class="_elp">代理商单号：<span>{{scope.row.orderNo}}</span>
              <button class="_elp_btn" :data-clipboard-text="scope.row.orderNo">复制</button>
            </div>
            <div class="_elp">平台单号：<span>{{scope.row.ticketId}}</span>
              <button class="_elp_btn" :data-clipboard-text="scope.row.ticketId">复制</button>
            </div>
            <span slot="reference" class='_elb' @click="toGoedit(scope.row)">{{scope.row.orderNo}}</span>
          </el-popover>
        </content>
      </el-table-column>
      <el-table-column prop="merName" label="代理商" min-width="80">
      </el-table-column>
      <el-table-column prop="lotName" label="彩种" min-width="100">
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
        <label slot-scope="scope">{{scope.row.ticketStatus|orderState}}</label>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" min-width="160">
      </el-table-column>
      <!-- <el-table-column prop="handleTime" label="处理时间" min-width="160"></el-table-column> -->
      <el-table-column prop="user" label="用户" min-width="120">
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
  name:'TICKET',
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
      // fctOption: this.$store.state.agentList,
      lotysOption: this._date._BASIC.Lottype,
      stateOption: this._date._BASIC.Ordstates,

    };
  },
  methods: {
    /* 商户 select */
    handleMerchant(val){
      this.fctname=val
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
        path: "/index/ipay"
      });
    },
    toGoedit(param) {
      if (this.typeflag != 2) return;
      localStorage.setItem("agent_orderID", param.ticketId);
      this.$router.push({
        path: "/index/order",
        query: {
          orderID: param.ticketId
        }
      });
    },
    receiveVal(val) {
      this.timeslot[0] = val[0] ? new Date(val[0]).format("yyyy-MM-dd") : "";
      this.timeslot[1] = val[1] ? new Date(val[1]).format("yyyy-MM-dd") : "";
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
    _hanldePage(val) {
      this.pageNumber = val.pageNumber;
      this.pageSize = val.pageSize;
      this.totalCount = val.totalCount;
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
        ticketStatus: this.lotstate
      };
      this.http
        .post("/ticket/list", obj)
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.tableLoading = false;
              this.tableData = res.data.entitys;
              this._hanldePage(res.data);
              this.$store.state.index_query = {};
            } else {
              this.tableLoading = false;

              this._message(res.msg, "error");
            }
          }
        })
        .catch(res => {
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
      return this.$store.state.cHeigt - 170;
    },
    typeflag() {
      return this.$store.state.userInfo.types;
    }
  },
  components: {},
  watch: {},
  activated() {
    if (!this.store.keepAlive||this.tableData.length==0) {
      this._dataInit()
      this._hanldeOverview();
      // console.log('非子页面返回')
    } else {
      // console.log('子页面返回')
    }
  },
  created() {
  },
  beforeDestroy() {
    this.$off();
  },
  mounted() {
  }
};
</script>

<style lang='less' scoped>
.in_body {
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
      margin-bottom: 10px;
      .ah_el {
        width: 100px;
        vertical-align: middle;
      }
      .ah_elbtn {
        width: 70px !important;
      }
    }
    .afooter {
      margin-top: 10px;
      text-align: right;
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
