<template>
<div class='machine'>
  <el-select v-model="content" clearable placeholder="请选择机器号" :size='size' :loading="slelectLoading" @change='hanldeChange' class="machine_sel">
    <el-option v-for="item in machineOptions" :key="item.mSN" :label="_hanldeSelectLabel(item)" :value="item.mSN">
    </el-option>
  </el-select>
</div>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      default: '',
    },
    model: {
      prop: 'machineId',
      event: 'change'
    },
    size: {
      type: String,
      default: 'mini',
    },
  },
  data() {
    return {
      content:'',
      machineOptions: this.$store.state.machineList,
      slelectLoading: false,
    }
  },
  methods: {
        _hanldeSelectLabel(o){
      return `[${o.mName}]${o.mSN}`
    },
    //机器列表
    _hanldeMachineList() {
      let l = this.$store.state.machineList;
      if (l.length > 0) return;
      this.slelectLoading = true;
      this.http.post("/user/machine/list", {}).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.slelectLoading = false;
              this.$store.state.machineList = [];
              this.$store.state.machineList = res.data;
              this.machineOptions = res.data;
            }
          }
        })
        .catch(error => {
          this.slelectLoading = false;
        });
    },
    hanldeChange(val) {
      this.$emit('change', val)
    },

  },
  // computed: {
  //   machineOptions() {
  //     return this.$store.state.machineList
  //   }
  // },
  components: {},
  watch: {
    data(val, oldval) {
      if (val != oldval) {
        this.content = val
      }
    }
  },
  created() {
    this._hanldeMachineList()
  },
  mounted() {
    console.log(this.size)
  }
}
</script>

<style lang='less' scoped>
.machine {
  display: inline-block;
  float: left;
  margin-right: 5px;
  .machine_sel {
    width: 230px;
  }
}
</style>
