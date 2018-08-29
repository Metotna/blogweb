<template>
<div class='money'>
  <div class="aheader">
    <el-select class='ah_el ah_b' size="mini" v-model="fctname" clearable placeholder="请选择代理商" style='width:140px' :loading="slelectLoading" v-if='typeflag==2'>
      <el-option v-for="item in fctOption" :key="item.merId" :label="item.merName" :value="item.merId">
      </el-option>
    </el-select>
    <el-select class='ah_el ah_b' size="mini" v-model="billType" clearable placeholder="请选择交易类型" style='width:140px'>
      <el-option v-for="item in billOption" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <datapack @change='receiveVal' class='ah_b'></datapack>
    <el-button class='ah_el ah_elbtn' size="mini" type="primary" @click="To_hanldebill">查询</el-button>
    <el-button class='ah_el ah_elbtn ah_elbtn_flag' size="mini" type="info" plain style='margin:0'>导出</el-button>
  </div>
  <el-table :data="tableData" show-summary :summary-method="getSummaries" style="width: 100%" header-row-class-name='ah_table_lead' :max-height='cHeight' v-loading="tableLoading" class="index_table_money">
    <el-table-column prop="billTime" label="交易日期" min-width="180">
    </el-table-column>
    <el-table-column prop="busOrder" label="单号" min-width="150">
    </el-table-column>
    <el-table-column prop="merName" label="代理商" min-width="150" v-if='typeflag==2'>
    </el-table-column>
    <el-table-column prop="billType" label="交易类型" min-width="200">
      <label slot-scope="scope"><span>{{scope.row.billType|billState}}</span></label>
    </el-table-column>
    <el-table-column prop="amount" label="金额" :align='alignR' min-width="140">
      <label slot-scope="scope"><span :style="{color:scope.row.colors}" style="font-weight: bold;">{{scope.row.amount|myfilter_}}</span></label>
    </el-table-column>
    <el-table-column prop="money" label="余额" :align='alignR' min-width="140">
      <label slot-scope="scope"><span style="color: #333;font-weight: bold;">{{scope.row.money|myfilter}}</span></label>
    </el-table-column>
    <el-table-column prop="" label="" min-width='10'>
    </el-table-column>
  </el-table>
  <pagePilots :pcount='pageCount' :psize='pageSizes' :pnums='pageNumber' @sizeChange='sizeResult' @numChange='numResult'></pagePilots>
</div>
</template>

<script>
export default {
  name: 'MONEY',
  data() {
    return {
      alignR: "right",
      fctname: "",
      fctOption: this.$store.state.agentList,
      billType: "",
      billOption: this._date._BILL.state,
      timeslot: ["", ""],
      pageCount: 1,
      pageSizes: 100,
      pageNumber: 1,
      pageFlag: true,
      tableData: [],
      tableLoading: false,
      slelectLoading: false
    };
  },
  methods: {
    receiveVal(val) {
      this.timeslot[0] = val[0] ? new Date(val[0]).format("yyyy-MM-dd") : "";
      this.timeslot[1] = val[1] ? new Date(val[1]).format("yyyy-MM-dd") : "";
    },
    sizeResult(val) {
      this.pageSizes = val;
    },
    numResult(val) {
      this.pageNumber = val;
    },
    getSummaries(param) {
      const showSum = [
        [3, 2],
        [4, 2],
      ];
      return this._getSummaries(param, showSum);
    },
    To_hanldebill() {
      this.pageFlag = false;
      this.pageNumber = 1;
      this.pageFlag = true;
      this._hanldebill();
    },
    _hanldePage(val) {
      this.pageFlag = false;
      this.pageNumber = val.pageNumber;
      this.pageSizes = val.pageSize;
      this.pageCount = val.totalCount;
      this.pageFlag = true;
    },
    _hanldebill() {
      this.tableLoading = true;
      this.http.post("/wallet/bill/list", {
          billType: this.billType,
          eDate: this.timeslot[1],
          sDate: this.timeslot[0],
          merId: this.fctname,
          pageNumber: this.pageNumber,
          pageSize: this.pageSizes
        })
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.tableLoading = false;
              var data = res.data.entitys;
              this.tableData = data.map(x => {
                if (x.billType == 'BET' || x.billType == 'CASH') {
                  x.amount = x.amount > 0 ? -1 * x.amount : x.amount;
                  x.colors = '#008284'
                } else {

                  x.amount = x.amount;
                  x.colors = '#2073D3';
                  if (x.billType == 'BONUS') x.colors = '#E7505A'
                }
                return x
              })
              this._hanldePage(res.data)
            } else {
              this._message(res.msg, "error");
              this.tableLoading = false;
            }
          }
        })
        .catch(error => {
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
  computed: {
    cHeight() {
      return this.$store.state.cHeigt - 166;
    },
    typeflag() {
      return this.$store.state.userInfo.types
    }
  },
  components: {},
  watch: {
    pageNumber(val, oldval) {
      if (val != oldval) {
        if (this.pageFlag) {
          this._hanldebill();
        }
      }
    },
    pageSizes(val, oldval) {
      if (val != oldval) {
        if (this.pageFlag) {
          this._hanldebill();
        }
      }
    }
  },
  created() {

  },
  mounted() {
    this._hanldeAgentList();
    this._hanldebill();
  }
};
</script>

<style lang='less' scoped>
.money {
  padding: 10px !important;
  background-color: #fff;
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
    .ah_b {
      margin: 0;
      vertical-align: middle;
    }
  }
  .afooter {
    margin-top: 10px;
    text-align: right;
  }
}
</style>

<style lang='less'>
.index_table_money {
  border: 1px solid #f5f7fa;
  border-bottom: none;
  .el-table__footer-wrapper {
    table tr {
      td:nth-child(4) {
        div {
          font-weight: bold;
        }
      }
      td:nth-child(4) {
        div {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
