<template>
  <div class='el_pagepilots el'>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page='pnums' :page-sizes="[100,200,400,1000]" :page-size='psize'  layout="total, sizes, prev, pager, next, jumper" :total='pcount' background  small >
    </el-pagination >
  </div>
</template>
<script>
export default {
  props: {
    pcount: {
      type: Number,
      default: 1
    },
    psize: {
      type: Number,
      default: 100
    },
    pnums: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("numChange", val);
    }
  },
};
</script>
<style lang='less'>
.el_pagepilots{
  margin-top: 5px;
  display: block;
  text-align: right;
  .el-input__inner{
    height: 22px!important;
  }
}
// .el_pagepilots {
//   .el-pagination__sizes,
//   .el-pagination__jump {
//     height: 22px !important;
//     line-height: 22px !important;
//   }
//   .el-input__inner,
//   .el-pagination__total {
//     height: 22px !important;
//     line-height: 22px !important;
//   }
// }
</style>
