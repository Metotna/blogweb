<template>
<div class='role'>
  <div class="aheader">
    <el-button class='ah_el' size="mini" type="primary" @click='toGo'>创建角色</el-button>
  </div>
  <el-table :data="tableData" style="width: 100%;text-align:center" header-row-class-name='ah_table_lead' :max-height='cHeight' class='index_table' v-loading="tableLoading">
    <el-table-column prop="name" label="角色名称" width="80">
    </el-table-column>
    <el-table-column prop="state" label="权限">
    </el-table-column>
    <el-table-column label="操作" width="130">
      <div slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
      </div>
    </el-table-column>
  </el-table>
  <pagePilots :pcount='pageCount' :psize='pageSizes' :pnums='pageNumber' @sizeChange='sizeResult' @numChange='numResult'></pagePilots>
</div>
</template>
 
<script>
export default {
  name: 'ROLE',
  data() {
    return {
      pageNumber: 1,
      pageCount: 1,
      pageSizes: 200,
      pageFlag: true,
      timeslot: ["", ""],
      tableData: [{
        name: 1,
        state: 213123
      }],
      tableLoading: false,
    };
  },
  methods: {
    toGo() {
      this.$router.push({
        path: "/role/add"
      })
    },
    toGoedit() {
      this.$router.push({
        path: "/role/edit"
      })
    },
    sizeResult(val) {
      this.pageSizes = val;
    },
    numResult(val) {
      this.pageNumber = val;
    },
  },
  computed: {
    cHeight() {
      return this.$store.state.cHeigt - 166;
    }
  },
  components: {},
  watch: {},
  created() {},
  mounted() {}
};
</script>

<style lang='less' scoped>
.role {
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
