<template>
<div class='ticstate' v-if='status'>
  <!-- 工作台 -->
  <!-- <div class="tic-radio">
    <el-radio-group v-model="changePage" size='small' @change='handleRadio'>
      <el-radio-button label="1"> 待出票 </el-radio-button>
      <el-radio-button label="2"> 历史统计 </el-radio-button>
    </el-radio-group>
  </div> -->
  <!-- <div class="tic-select">
    <el-select v-model="value" size='small' style="width:120px">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div> -->
  <div v-show='changePage==1'>
    <unticket :ticfalg='changePage' ref='unticket'></unticket>
  </div>
  <div v-show='changePage==2'>
    <!-- <ticketed :ticfalg='changePage' ref='ticketed'></ticketed> -->
  </div>
</div>
</template>

<script>
import unticket from './unticket'
import ticketed from './ticketed'
export default {
  data() {
    return {
      changePage: 1,
      status: true,
      value: 2,
      options: [{
        value: 1,
        label: '普通出票员'
      }, {
        value: 2,
        label: '管理员'
      }]
    }
  },
  methods: {
    handleRadio(val) {
      this.changePage = val;
      localStorage.change_Page = val;
      if (val == 1) {
        this.$refs.unticket.pageKey = false;

      }
    }
  },
  components: {
    unticket,
    ticketed
  },
  watch: {
    // value(val, oldval) {
    //   if (val != oldval) {
    //     this.$store.state.rule = val
    //     this.$refs.unticket.hisStatus = 1;
    //   }
    // }
  },
  created() {},
  mounted() {
    const merId = localStorage.change_Page || 1
    this.changePage = merId > 2 || merId < 1 ? 1 : merId;
    // this.store.rule = this.value;
  },
  activated() {
    this.status = false;
    this.status = true;
  },
  deactivated() {
    if (this.$refs.unticket) {
      this.$refs.unticket.pageKey = true;

    }
  }
}
</script>

<style lang='less'>
.ticstate {
  position: relative;
  .tic-radio {
    position: absolute;
    top: 0px;
    left: 15px;
  }
  .tic-select {
    position: absolute;
    top: 0px;
    right: 15px;
  }
}
</style>
