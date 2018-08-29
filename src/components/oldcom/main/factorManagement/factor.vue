<template>
<div class='factor'>
  <div class="aheader">
    <el-button class='ah_el' size="mini" type="primary" @click='toGo'>创建</el-button>
    <merchant @change='handleMerchant' />
    <el-button class='ah_el' size="mini" type="primary" plain @click="To_handlelist">查询</el-button>
    <el-button class='ah_el ah_elbtn_flag' size="mini" type="info" plain style='margin:0' @click="_handleExport">导出</el-button>
  </div>
  <el-table :data="tableData" show-summary :summary-method="getSummaries" style="width: 100%" header-row-class-name='ah_table_lead' class='index_table_fac'>
    <el-table-column prop="merName" label="代理商名字" width="100"></el-table-column>
    <el-table-column prop="phone" label="手机号码" width="140"></el-table-column>
    <el-table-column prop="state" label="状态">
      <label slot-scope="scope"><span>{{scope.row.state|agentState}}</span></label>
    </el-table-column>
    <el-table-column prop="money" label="账户余额" :align='alignR'>
      <label slot-scope="scope"><span style=" font-weight: bold;">{{scope.row.money|myfilter}}</span></label>
    </el-table-column>
    <el-table-column prop="ticket" label="累计出票" :align='alignR'>
      <label slot-scope="scope"><span style="color:#008284; font-weight: bold;">{{scope.row.ticket|myfilter(2,'-')}}</span></label>
    </el-table-column>
    <el-table-column prop="bonus" label="累计返奖" :align='alignR'>
      <label slot-scope="scope"><span style=" font-weight: bold;color:#E7505A">{{scope.row.bonus|myfilter(2,'+')}}</span></label>
    </el-table-column>
    <el-table-column prop="charge" label="累计充值" :align='alignR'>
      <label slot-scope="scope"><span style=" font-weight: bold;color:#2073D3">{{scope.row.charge|myfilter(2,'+')}}</span></label>
    </el-table-column>
    <el-table-column prop="createTime" label="创建日期" width="180"></el-table-column>
    <el-table-column label="操作" width="130">
      <div slot-scope="scope"><el-button type="text" size="small" @click='toGoedit(scope.row)'>编辑</el-button></div>
    </el-table-column>
  </el-table>
  <pagePilots :pcount='totalCount' :psize='pageSize' :pnums='pageNumber' @sizeChange='sizeResult' @numChange='numResult'></pagePilots>

</div>
</template>

<script>
export default {
  name: 'FACTOR',
  data() {
    return {
      alignR: "right",
      fctname: "",
      // fctOption: this.$store.state.agentList,
      totalCount: 0,
      pageSize: 100,
      pageNumber: 1,
      tableData: [],
      tableLoading: true,
      slelectLoading: false
    };
  },
  methods: {
    /* 商户 select */
    handleMerchant(val) {
      this.fctname = val
    },
    _dataInit() {
      this.fctname = ""
      this.totalCount = 0
      this.pageSize = 100
      this.pageNumber = 1
      this.tableData = []
      this.tableLoading = true
      this.slelectLoading = false
    },
    toGo() {
      localStorage.setItem("agent_merId", '');
      this.$router.push({
        path: "/factor/add"
      });
    },
    toGoedit(param) {
      localStorage.setItem("agent_merId", param.merId);
      this.$router.push({
        path: "/factor/edit",
        query: {
          merId: param.merId
        }
      });
    },
    sizeResult(val) {
      this.pageSize = val;
      this._handlelist();
    },
    numResult(val) {
      this.pageNumber = val;
      this._handlelist();
    },
    getSummaries(param) {
      const showSum = [
        [3, 2],
        [4, 2, '-'],
        [5, 2, '+'],
        [6, 2, '+']
      ];
      return this._getSummaries(param, showSum);
    },
    To_handlelist() {
      if (this.tableLoading) return;
      this.pageFlag = false;
      this.pageNumber = 1;
      this.pageFlag = true;
      this._handlelist();
    },
    _handlelist() {
      this.tableLoading = true;
      this.http.post("/mer/list", {
        merId: this.fctname,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }).then(res => {
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
      }).catch(error => {
        this.tableLoading = false;
      });
    },
    _hanldePage(val) {
      this.pageFlag = false;
      this.pageNumber = val.pageNumber;
      this.pageSize = val.pageSize;
      this.totalCount = val.totalCount;
      this.pageFlag = true;
    },
    _handleExport() {
      this.http.post("/mer/list/export", {
        merName: this.fctname,
      }).then(res => {
        if (res.status) {
          if (res.status == 200) {
            // this.overView = res.data;
            // this._hanldeOverView_list();
          } else {
            this._message(res.msg, "error");
          }
        }
      });
    }
  },
  computed: {
    cHeight() {
      return this.$store.state.cHeigt - 166;
    }
  },
  components: {},
  watch: {},
  activated() {
    if (!this.store.keepAlive || this.tableData == []) {
      this._dataInit()
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
.factor {
  background-color: #fff;
  padding: 10px;
  .aheader {
    float: left;
    margin-bottom: 10px;
    .ah_el {
      width: 70px;
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
.index_table_fac {
  border: 1px solid #f5f7fa;
  border-bottom: none;
  .el-table__footer-wrapper {
    table tr {
      td:nth-child(4) {
        div {
          font-weight: bold;
        }
      }
      td:nth-child(5) {
        color: #008284;
        div {
          font-weight: bold;
        }
      }
      td:nth-child(6) {
        color: #E7505A;
        div {
          font-weight: bold;
        }
      }
      td:nth-child(7) {
        div {
          font-weight: bold;
        }
        color: #2073D3;
      }
    }
  }
}
</style>
