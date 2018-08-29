<template>
<div class='bank'>
  <div class="aheader">
    <el-radio-group v-model="dptype" size="mini" @change='hanlderTime'>
      <el-radio-button label="date">日汇总</el-radio-button>
      <el-radio-button label="month">月汇总</el-radio-button>
      <el-radio-button label="year">年汇总</el-radio-button>
    </el-radio-group>
    <!-- <el-select class='ah_el' size="mini" v-model="fctname" clearable placeholder="请选择代理商" style='width:140px' :loading="slelectLoading" v-if='typeflag==2'>
      <el-option v-for="item in fctOption" :key="item.merId" :label="item.merName" :value="item.merId">
      </el-option>
    </el-select> -->

    <merchant @change='handleMerchant' v-if='typeflag==2'></merchant>
    <datapack ref='datapack' @change='receiveVal' :types='dptype' style='margin:0'></datapack>

    <el-button class='ah_el' size="mini" type="primary" @click="to_hanldeReport_list">查询</el-button>
    <el-button class='ah_el ah_elbtn_flag' size="mini" type="info" plain style='margin:0'>导出</el-button>
  </div>

  <el-table :data="tableDatas" border class='index_table_tic no_xscroll' :show-header='false' id='total_table'>
    <el-table-column prop="" label="总计" width="240" fixed  v-if="typeflag==2"><label slot-scope="scope">总计</label></el-table-column>
    <el-table-column prop="" label="总计" width="140" fixed  v-if="typeflag!=2"><label slot-scope="scope">总计</label></el-table-column>
    <el-table-column prop="receive" label="收单金额" :align='alignR' min-width='100'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.receive}}</span></label>
    </el-table-column>
    <el-table-column prop="receiveCount" label="收单张数" :align='alignR' min-width='70'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.receiveCount}}</span></label>
    </el-table-column>
    <el-table-column prop="ticket" label="出票成功金额" :align='alignR' min-width='100'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.ticket}}</span></label>
    </el-table-column>
    <el-table-column prop="ticketCount" label="成功张数" :align='alignR' min-width='70'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.ticketCount}}</span></label>
    </el-table-column>
    <el-table-column prop="failTicket" label="出票失败金额" :align='alignR' min-width='100'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.failTicket}}</span></label>
    </el-table-column>
    <el-table-column prop="failTicketCount" label="失败张数" :align='alignR' min-width='70'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.failTicketCount}}</span></label>
    </el-table-column>

    <el-table-column prop="commission" label='佣金' min-width="120" :align='alignR'></el-table-column>
    <el-table-column prop="commissionRate" label='佣金比列' width="70" :align='alignR'></el-table-column>

    <el-table-column prop="bonus" label="返奖金额" :align='alignR' min-width='120'>
      <label slot-scope="scope"><span style="color: #E7505A;font-weight: bold;">{{scope.row.bonus|myfilter(2)}}</span></label>
    </el-table-column>
    <el-table-column prop="bonus" label="返奖张数" :align='alignR' min-width='70'>
      <label slot-scope="scope"><span style="color: #E7505A;font-weight: bold;">{{scope.row.bonusCount}}张</span></label>
    </el-table-column>

    <el-table-column prop="charge" label="现金充值" :align='alignR' min-width='130'>
      <label slot-scope="scope"><span style="color: #2073D3;font-weight: bold;">{{scope.row.charge|myfilter(2,'+')}}</span></label>
    </el-table-column>

    <el-table-column prop="money" label="本期余额" :align='alignR' min-width='130'>
      <label slot-scope="scope"><span>{{scope.row.money|myfilter}}</span></label>
    </el-table-column>
    <el-table-column prop="" width="15" v-if='scroll'></el-table-column>
  </el-table>

  <el-table :data="tableData" style="width: 100%;text-align:center" header-row-class-name='ah_table_lead_d2d4d8' :max-height='cHeight' :class="typeflag == 2? 'index_table_bank' : 'index_table_bank_'" v-loading="tableLoading" border stripe id='child_table' >
    <el-table-column prop="date" label="日期" width="140" fixed></el-table-column>

    <el-table-column prop="merCount" label="代理商" fixed v-if="typeflag==2" :align='alignR' width='100'>
      <label slot-scope="scope"><span @click="toGo(scope.row.date)" v-if="tempflag==2" style='text-decoration: underline'>{{scope.row.merCount|bankName}}</span><span v-if="tempflag==1" >{{scope.row.merId|merinfor($store.state.merchantList,'merId','merName')}}</span></label>
    </el-table-column>
    <el-table-column prop="receive" label="收单金额" :align='alignR' min-width='100'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.receive}}</span></label>
    </el-table-column>
    <el-table-column prop="receiveCount" label="收单张数" :align='alignR' min-width='70'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.receiveCount}}</span></label>
    </el-table-column>
    <el-table-column prop="ticket" label="出票成功金额" :align='alignR' min-width='100'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.ticket}}</span></label>
    </el-table-column>
    <el-table-column prop="ticketCount" label="成功张数" :align='alignR' min-width='70'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.ticketCount}}</span></label>
    </el-table-column>
    <el-table-column prop="failTicket" label="出票失败金额" :align='alignR' min-width='100'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.failTicket}}</span></label>
    </el-table-column>
    <el-table-column prop="failTicketCount" label="失败张数" :align='alignR' min-width='70'>
      <label slot-scope="scope"><span style="color: #008284;font-weight: bold;">{{scope.row.failTicketCount}}</span></label>
    </el-table-column>

    <el-table-column prop="commission" label='佣金' min-width="120" :align='alignR'></el-table-column>
    <el-table-column prop="commissionRate" label='佣金比列' width="70" :align='alignR'></el-table-column>

    <el-table-column prop="bonus" label="返奖金额" :align='alignR' min-width='120'>
      <label slot-scope="scope"><span style="color: #E7505A;font-weight: bold;">{{scope.row.bonus|myfilter(2)}}</span></label>
    </el-table-column>
    <el-table-column prop="bonus" label="返奖张数" :align='alignR' min-width='70'>
      <label slot-scope="scope"><span style="color: #E7505A;font-weight: bold;">{{scope.row.bonusCount}}张</span></label>
    </el-table-column>

    <el-table-column prop="charge" label="现金充值" :align='alignR' min-width='130'>
      <label slot-scope="scope"><span style="color: #2073D3;font-weight: bold;">{{scope.row.charge|myfilter(2,'+')}}</span></label>
    </el-table-column>

    <el-table-column prop="money" label="本期余额" :align='alignR' min-width='130'>
      <label slot-scope="scope"><span>{{scope.row.money|myfilter}}</span></label>
    </el-table-column>
  </el-table>
  <pagePilots :pcount='totalCount' :psize='pageSize' :pnums='pageNumber' @sizeChange='sizeResult' @numChange='numResult'></pagePilots>
</div>
</template>

<script>
export default {
  name: 'BANK',
  data() {
    return {
      dptype: "date",
      alignR: "right",
      totalCount: 0,
      pageSize: 200,
      pageFlag: true,
      timeslot: ["", ""],
      pageNumber: 1,
      tableData: [],
      tableDatas: [{}],
      tableLoading: false,
      timeLevel: "DAY",
      slelectLoading: false,
      fctname: "",
      fctOption: this.$store.state.agentList,
      tempflag: 1
    };
  },
  computed: {
    cHeight() {
      return this.$store.state.cHeigt - 166;
    },
    typeflag() {
      return this.$store.state.userInfo.types;
    },
    scroll() {
      const a = (this.tableData.length - parseInt((this.$store.state.cHeigt - 166) / 30))
      return a < 0 ? false : true;
    },
  },
  methods: {
    bank_table(){
      console.log(2111)
    },
    _dataInit() {
      this.dptype = 'date';
      this.totalCount = 0;
      this.pageSize = 200;
      this.timeslot = ["", ""];
      this.pageNumber = 1;
      this.tableData = [];
      this.tableLoading = false;
      this.timeLevel = "DAY";
      this.slelectLoading = false;
      this.fctname = "";
    },
    hanlderTime(val) {
      switch (val) {
        case 'date':
          this.timeLevel = "DAY";
          break;
        case 'month':
          this.timeLevel = "MONTH";
          break;
        case 'year':
          this.timeLevel = "YEAR";
          break;
      }
      this.to_hanldeReport_list();
    },
    toGo(param) {
      this.$router.push({
        path: "/bank/detail",
        query: {
          cot: param
        }
      });
    },
    /* 商户id */
    handleMerchant(val) {
      this.fctname = val;
    },
    receiveVal(val) {
      this.timeslot[0] = val[0] ? val[0] : "";
      this.timeslot[1] = val[1] ? val[1] : "";
    },
    sizeResult(val) {
      this.pageSize = val;

    },
    numResult(val) {
      this.pageNumber = val;
    },
    getSummaries(param) {
      const showSum =
        this.typeflag == 2 ? [
          [2, 2, "-"],
          [3, 2, "+"],
          [4, 2, "+"]
        ] : [
          [1, 2, "-"],
          [2, 2, "+"],
          [3, 2, "+"],
          [4, 2]
        ];
      return this._getSummaries(param, showSum);
    },
    _hanldeTimeformat(val, format) {
      var f = "yyyy-MM-dd"
      switch (format) {
        case 'date':
          f = "yyyy-MM-dd"
          break;
        case 'month':
          f = "yyyy-MM"
          break;
        case 'year':
          f = "yyyy"
          break;
      }
      this.timeslot[0] = val[0] ? new Date(val[0]).format(f) : "";
      this.timeslot[1] = val[1] ? new Date(val[1]).format(f) : "";
    },
    to_hanldeReport_list() {
      if (this.tableLoading) return;
      this.pageNumber = 1;
      this._hanldeTimeformat(this.timeslot, this.dptype);
      this._hanldeReport_list();
    },
    _hanldeReport_list() {
      return
      this.tempflag = this.fctname == "" ? 2 : 1;
      this.tableLoading = true;
      this.http.post("/report/data", {
          timeLevel: this.timeLevel,
          sDate: this.timeslot[0],
          eDate: this.timeslot[1],
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          type: this.tempflag,
          merId: this.fctname
        }).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.tableLoading = false;
              this.tableData = res.data.entitys;
              this.tableDatas = [res.data.total];
              this.pageNumber = res.data.pageNumber;
              this.pageSize = res.data.pageSize;
              this.totalCount = res.data.totalCount;
            } else {
              this._message(res.msg, "error");
              this.tableLoading = false;
            }
          }
        })
        .catch(res => {
          this.tableLoading = false;
        });
    },
    _hanldeAgentList() {
      let l = this.$store.state.agentList;
      if (l.length > 0) return;
      this.slelectLoading = true;
      this.http.post("/user/mer/simpleList", {})
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.slelectLoading = false;
              this.$store.state.agentList = [];
              this.$store.state.agentList = res.data;
              this.fctOption = res.data;
            }
          }
        })
        .catch(error => {
          this.slelectLoading = false;
        });
    }
  },
  components: {},
  watch: {
    pageNumber(val, oldval) {
      if (val != oldval) {
        if (this.pageFlag) {
          this._hanldeReport_list();
        }
      }
    },
    pageSize(val, oldval) {
      if (val != oldval) {
        if (this.pageFlag) {
          this._hanldeReport_list();
        }
      }
    }
  },
  activated() {

    if (!this.store.keepAlive || this.tableData.length == 0) {
      this._dataInit()
      this.$refs.datapack.valInitChg()
      // this._hanldeAgentList();
      this.tempflag = this.typeflag;
      this._hanldeTimeformat(this.timeslot, this.dptype);
      this._hanldeReport_list();
      // console.log('非子页面返回')
    } else {
      // console.log('子页面返回')
    }
  },
  created() {
    this._dataInit()
  },
  mounted() {},
}
</script>

<style lang='less' scoped>
.bank {
  padding: 10px !important;
  background-color: #fff;
  .aheader {
    float: left;
    margin-bottom: 5px;
    .ah_el {
      width: 70px;
      vertical-align: middle;
    }
    .ah_b {
      margin: 0 10px;
    }
  }
  .afooter {
    margin-top: 10px;
    text-align: right;
  }
}
</style>

<style lang='less'>
.index_table_bank {
  border: 1px solid #f5f7fa;
  border-bottom: none;
  .el-table__footer-wrapper {
    table tr {
      td:nth-child(3) {
        color: #008284;
        div {
          font-weight: bold;
        }
      }
      td:nth-child(4) {
        color: #e7505a;
        div {
          font-weight: bold;
        }
      }
      td:nth-child(5) {
        div {
          font-weight: bold;
        }
        color: #2073d3;
      }
    }
  }
}

.index_table_bank_ {
  border: 1px solid #f5f7fa;
  border-bottom: none;
  .el-table__footer-wrapper {
    table tr {
      td:nth-child(2) {
        color: #008284;
        div {
          font-weight: bold;
        }
      }
      td:nth-child(3) {
        color: #e7505a;
        div {
          font-weight: bold;
        }
      }
      td:nth-child(4) {
        div {
          font-weight: bold;
        }
        color: #2073d3;
      }
    }
  }
}
</style>
