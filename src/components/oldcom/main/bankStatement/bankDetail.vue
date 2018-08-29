<template>
<div class='bank'>
  <goback style="padding-left:0"></goback>
  <div class="aheader">
    <!-- <el-button class='ah_el' size="mini" type="primary" @click="to_hanldeReport_list">查询</el-button> -->
    <span class='ahb_span ahb_s'>{{contant}}</span>
    <font class='ahb_font ahb_s'>代理商对账单</font>
    <el-button class='ah_el ah_elbtn_flag' size="mini" type="info" style='margin:0'>导出</el-button>
  </div>
  <el-table :data="tableData" style="width: 100%;text-align:center" show-summary :summary-method="getSummaries" header-row-class-name='ah_table_lead' :max-height='cHeight' class='index_table_bankd' v-loading="tableLoading" border>

    <el-table-column prop="merCount" label="代理商" :align='alignR'>
      <label slot-scope="scope">{{scope.row.merId|merinfor($store.state.merchantList,'merId','merName')}}</label>
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

    <el-table-column prop="commission" label='佣金' min-width="120" :align='alignR' ></el-table-column>
    <el-table-column prop="commissionRate" label='佣金比列' width="70" :align='alignR' ></el-table-column>

    <el-table-column prop="bonus" label="返奖金额" :align='alignR' min-width='120'>
      <label slot-scope="scope"><span style="color: #E7505A;font-weight: bold;">{{scope.row.bonus|myfilter(2)}}</span></label>
    </el-table-column>
    <el-table-column prop="bonus" label="返奖张数" :align='alignR' min-width='70'>
      <label slot-scope="scope"><span style="color: #E7505A;font-weight: bold;">{{scope.row.bonusCount}}</span></label>
    </el-table-column>

    <el-table-column prop="charge" label="现金充值" :align='alignR' min-width='120'>
      <label slot-scope="scope"><span style="color: #2073D3;font-weight: bold;">{{scope.row.charge|myfilter(2,'+')}}</span></label>
    </el-table-column>

    <el-table-column prop="money" label="本期余额" :align='alignR'  min-width='120'>
      <label slot-scope="scope"><span>{{scope.row.money|myfilter}}</span></label>
    </el-table-column>
  </el-table>
  <pagePilots :pcount='totalCount' :psize='pageSize' :pnums='pageNumber' @sizeChange='sizeResult' @numChange='numResult'></pagePilots>
</div>
</template>
 
<script>
export default {
  data() {
    return {
      alignR: "right",
      totalCount: 0,
      pageNumber: 1,
      pageSize: 200,
      timeslot: ["", ""],
      tableData: [],
      tableLoading: false,
      accountType: 1,
      timeLevel: 'DAY',
      contant: ''
    };
  },
  computed: {
    cHeight() {
      const h = this.$store.state.cHeigt - 106
      // console.log(h)
      return h < 200 ? 200 : h;
    }
  },
  methods: {
    toGo() {
      this.$router.push({
        path: "/index/ipay"
      });
    },
    sizeResult(val) {
      this.pageSize = val;
      this._hanldeReport_list();
    },
    numResult(val) {
      this.pageNumber = val;
      this._hanldeReport_list();
    },
    getSummaries(param) {
      /* show-summary :summary-method="getSummaries" */
      const showSum = [
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 2],
        // [8, 0],
        [9, 2],
        [10, 0],
        [12, 2],
        [11, 0],
      ];
      return this._getSummaries(param, showSum);
    },
    _hanldeReport_list() {
      this.tableLoading = true;
      this.http.post("/report/data", {
        timeLevel: this.timeLevel,
        sDate: this.timeslot[0],
        eDate: this.timeslot[1],
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        type: this.accountType,
      }).then(res => {
        if (res.status) {
          if (res.status == 200) {
            this.tableData = res.data.entitys;
            this.pageNumber = res.data.pageNumber;
            this.pageSize = res.data.pageSize;
            this.totalCount = res.data.totalCount;
          } else {
            this._message(res.msg, "error");
          }
          this.tableLoading = false;
        }
      }).catch(res => {
        this.tableLoading = false;
      });
    }
  },
  watch: {},
  created() {
    this.contant = this.$route.query.cot || localStorage.agent_cot;
    const l = this.contant.length
    this.timeLevel = l > 9 ? 'DAY' : (l > 6 ? 'MONTH' : 'YEAR');
    this.timeslot = [this.contant, this.contant]
    this._hanldeReport_list()
  },
  mounted() {}
};
</script>

<style lang='less' scoped>
.bank {
  padding: 10px !important;
  background-color: #fff;
  .aheader {
    float: left;
    margin-bottom: 10px;
    .ahb_span {
      padding: 0 20px;
    }
    .ahb_font {
      padding-right: 10px;
    }
    .ahb_s {
      float: left;
      line-height: 28px;
    }
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
.index_table_bankd {
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
        color: #E7505A;
        div {
          font-weight: bold;
        }
      }
      td:nth-child(4) {
        div {
          font-weight: bold;
        }
        color: #2073D3;
      }
    }
  }
}
</style>
