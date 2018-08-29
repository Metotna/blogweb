<template>
<div class='pay'>
  <div class="in_s_div">
    <div class="aheader">
      <el-button class='ah_el' size="mini" type="primary" @click='toGo' v-if='typeflag==1'>充值</el-button>
      <datapack ref='datapack' @change='receiveVal' v-if='typeflag==1'></datapack>
      <el-select class='ah_el ah_b' size="mini" v-model="fctname" clearable placeholder="请选择代理商" style='width:140px' :loading="slelectLoading" v-if='typeflag==2'>
        <el-option v-for="item in fctOption" :key="item.merId" :label="item.merName" :value="item.merId">
        </el-option>
      </el-select>
      <el-select class='ah_el ah_b' size="mini" v-model="auditType" clearable placeholder="请选择审核状态" style='width:140px'>
        <el-option v-for="item in auditOption" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button class='ah_el' size="mini" type="primary" @click="To_handlelist">查询</el-button>
      <el-button class='ah_el ah_elbtn_flag' size="mini" type="info" plain style='margin:0'>导出</el-button>
    </div>
    <el-table :data="tableData" show-summary :summary-method="getSummaries" style="width: 100%" header-row-class-name='ah_table_lead' class='index_table_pay' :max-height='cHeight'>
      <el-table-column prop="chargeId" label="充值单号" width="240">
        <!-- <label slot-scope="scope"><span v-if='typeflag==1' @click='toGoedit(scope.row.chargeId)' style="text-decoration:underline;">{{scope.row.chargeId}}</span>
            <span v-else>{{scope.row.chargeId}}</span></label> -->
      </el-table-column>
      <el-table-column prop="date" label="日期" width="180">
      </el-table-column>
      <el-table-column prop="merName" label="代理商" v-if='typeflag==2'>
      </el-table-column>
      <el-table-column prop="money" label="金额" :align='alignR'>
        <label slot-scope="scope"><span style="color: #2073D3;font-weight: bold;">{{scope.row.money|myfilter}}</span></label>
      </el-table-column>
      <el-table-column prop="chargeState" label="状态">
        <label slot-scope="scope"><span :class="handleColor(scope.row.chargeState)">{{scope.row.chargeState|chargeState}}</span></label>
      </el-table-column>
      <el-table-column prop="desc" label="备注">
      </el-table-column>
      <el-table-column label="操作" width="130" v-if='typeflag==2'>
        <div slot-scope="scope">
          <el-button type="text" @click='toGoedit(scope.row.chargeId)'>
            <span v-if="scope.row.chargeState=='NEW'||scope.row.chargeState=='AUDIT'" style="text-decoration:underline;">审核</span>
            <span v-else style="text-decoration:underline;color:#666">已审核</span>
          </el-button>
        </div>
      </el-table-column>
      <el-table-column prop="" label="" min-width="10">
      </el-table-column>
    </el-table>
    <pagePilots :pcount='pageCount' :psize='pageSizes' :pnums='pageNumber' @sizeChange='sizeResult' @numChange='numResult'></pagePilots>
  </div>
</div>
</template>

<script>
export default {
  name:'PAY',
  data() {
    return {
      pageNumber: 1,
      pageCount: 10,
      pageSizes: 200,
      pageFlag: true,
      timeslot: ["", ""],
      tableData: [],
      tableLoading: false,
      slelectLoading: false,
      fctname: "",
      auditType: '',
      fctOption: this.$store.state.agentList,
      auditOption: this._date._CHARGE_.state,
      alignR: "right",
    };
  },
  methods: {
    _dataInit() {
      this.pageNumber = 1;
      this.pageCount = 10;
      this.pageSizes = 200;
      this.pageFlag = true;
      this.timeslot = ["", ""];
      this.tableData = [];
      this.tableLoading = false;
      this.slelectLoading = false;
      this.fctname = "";
      this.auditType = '';
    },
    handleColor() {
      if (arguments[0]) {
        const v = arguments[0]
        if (v == 'NEW' || v == 'AUDIT') return '_shz'
        else if (v == 'FAIL' || v == 'RECALL') return '_wtg'
        else return '_tg'
      }
      return
    },
    toGo() {
      this.$router.push({
        path: "/pay/ipay"
      });
    },
    toGoedit(param) {
      localStorage.setItem("charge_merId", param);
      this.$router.push({
        path: "/pay/audit",
        query: {
          chargeId: param
        }
      });
    },
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
      if (this.typeflag == 1) {
        var showSum = [
          [2, 2]
        ]
      } else {
        var showSum = [
          [3, 2]
        ];
      }
      return this._getSummaries(param, showSum);
    },
    To_handlelist() {
      if (this.tableLoading) return;
      this.pageFlag = false;
      this.pageNumber = 1;
      this.pageFlag = true;
      this._handlelist();
    },
    _hanldePage(val) {
      this.pageFlag = false;
      this.pageNumber = val.pageNumber;
      this.pageSizes = val.pageSize;
      this.pageCount = val.totalCount;
      this.pageFlag = true;
    },
    _handlelist() {
      this.tableLoading = true;
      this.http.post("/charge/list", {
          sDate: this.timeslot[0],
          eDate: this.timeslot[1],
          merId: this.fctname,
          state: this.auditType,
          pageNumber: this.pageNumber,
          pageSize: this.pageSizes
        })
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.tableLoading = false;
              this.tableData = res.data.entitys;
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
      return this.$store.state.cHeigt - 170;
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
          this._handlelist();
        }
      }
    },
    pageSizes(val, oldval) {
      if (val != oldval) {
        if (this.pageFlag) {
          this._handlelist();
        }
      }
    }
  },
  activated() {
    if (!this.store.keepAlive || this.tableData == []) {
      this._dataInit()
      if (this.typeflag == 1) this.$refs.datapack.valInitChg()
      this._hanldeAgentList();
      this._handlelist();
    } else {
     this._handlelist();
    }
  },
  created() {
    this._dataInit()
  },
  mounted() {}
};
</script>

<style lang='less' scoped>
.pay {
  padding: 10px !important;
  background: #fff !important;
  .in_s_div {
    .aheader {
      float: left;
      margin-bottom: 10px;
      .ah_el {
        width: 70px;
        vertical-align: middle;
      }
      .ah_b {
        // margin: 0 10px;
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
.index_table_pay {
  border: 1px solid #f5f7fa;
  border-bottom: none;
  .el-table__footer-wrapper {
    table tr {
      td:nth-child(3) {
        color: #2073D3;
        div {
          font-weight: bold;
        }
      }
      td:nth-child(4) {
        color: #2073D3;
        div {
          font-weight: bold;
        }
      }
    }
  }
  ._wtg {
    color: #F43741
  }
  ._shz {
    color: #FF8809
  }
  ._tg {
    color: #4990E2
  }
}
</style>

