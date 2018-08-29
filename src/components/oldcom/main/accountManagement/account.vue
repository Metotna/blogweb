<template>
<div class='account'>
  <div class="aheader">
    <el-button class='ah_el' size="mini" type="primary" @click="toGo">添加账号</el-button>
  </div>
  <el-table :data="tableData" style="width: 100%" header-row-class-name='ah_table_lead' v-loading="tableLoading">
    <el-table-column type="index" width="50" label=' '>
    </el-table-column>
    <el-table-column prop="account" label="账号" width="140">
    </el-table-column>
    <el-table-column prop="linkman" label="联系人" width="140">
    </el-table-column>
    <el-table-column prop="resourceIds" label="权限" :align="'left'" :header-align="'center'">
      <label slot-scope="scope">{{scope.row.roleId|AUTH_RULE}} {{scope.row.resourceIds|AUTH_RES}} </label>
    </el-table-column>
    <el-table-column label="操作" width="130">
      <div slot-scope="scope">
        <el-button type="text" size="small" @click='toGoedit(scope.row.usrId)'>编辑</el-button>
        <el-button type="text" size="small" @click='toGodel(scope)'>删除</el-button>
      </div>
    </el-table-column>
  </el-table>
  <pagePilots :pcount='totalCount' :psize='pageSize' :pnums='pageNumber' @sizeChange='sizeResult' @numChange='numResult'></pagePilots>

</div>
</template>

<script>
export default {
  name: 'ACCOUNT',
  data() {
    return {
      totalCount: 1,
      pageSize: 200,
      pageNumber: 1,
      pageFlag: true,
      tableData: [],
      tableLoading: false,
    };
  },
  methods: {
    _dataInit() {
      this.totalCount = 1
      this.pageSize = 200
      this.pageNumber = 1
      this.pageFlag = true
      this.tableData = []
      this.tableLoading = false
    },
    toGo() {
      this.$router.push({
        path: "/account/add"
      });
    },
    toGoedit(param) {
      this.$router.push({
        path: "/account/edit",
        query: {
          usr: param
        }
      })
    },
    toGodel(param) {
      // console.log(param)
      this.$confirm('是否删除该账号信息？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.http.post("/account/delete", {
          usrId: param.row.usrId,
        }).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this._message('已删除', "success");
              this.tableData.splice(param.$index, this.tableData.length)
            } else {
              this._message(res.data, "error");
            }
          }
        });
      }).catch(() => {});
    },
    sizeResult(val) {
      this.pageSize = val;
      this._hanldeOverview();
    },
    numResult(val) {
      this.pageNumber = val;
      this._hanldeOverview();
    },
    _hanldePage(val) {
      this.pageFlag = false;

      this.pageFlag = true;
    },
    _hanldeOverview() {
      this.tableLoading = true
      this.http.post("/account/list", {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }).then(res => {
        if (res.status) {
          if (res.status == 200) {
            this.tableData = res.data.entitys;
            this.pageNumber = val.pageNumber;
            this.pageSize = val.pageSize;
            this.totalCount = val.totalCount;
          } else {
            this._message(res.data, "error");
          }
        }
        this.tableLoading = false
      }).catch(r => {
        this.tableLoading = false
      })
    },
  },
  components: {},
  watch: {},
  activated() {
    this._dataInit()
    this._hanldeOverview();
    if (!this.store.keepAlive || this.tableData == []) {

    } else {

      // console.log('子页面返回')
    }
  },
  created() {
    this._dataInit()
  },
  mounted() {}
};
</script>

<style lang='less' scoped>
.account {
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
