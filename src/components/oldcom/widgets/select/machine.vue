<template>
<div class='machine'>
  <span class="machine_title">{{title}}</span>
  <el-select v-model="content" placeholder="请选择机器号" :size='size' :loading="slelectLoading" @change='hanldeChange' class="machine_sel">
    <el-option v-for="item in machineOptions" :key="item.mSN" :label="_hanldeSelectLabel(item)" :value="item.mSN">
    </el-option>
  </el-select>
</div>
</template>

<script>
const BASE_ARY = [{
  mSN: "all",
  mName: "全部"
}]
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
    title: {
      type: String,
      default: '',
    },
    all: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: '',
      machineOptions: '',
      slelectLoading: false,
    }
  },
  methods: {
    _hanldeSelectLabel(o) {
      if (o.mSN == 'all') return '全部'
      else return `[${o.mName}]${o.mSN}`
    },
    //机器列表
    _hanldeMachineList2() {
      let l = this.$store.state.machineList2;
      if (l.length > 0) {
        this.machineOptions = this.all ? BASE_ARY.concat(this.$store.state.machineList2) : this.$store.state.machineList2;
        return;
      }
      this.slelectLoading = true;
      this.http.post("/user/machine/list", {}).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.slelectLoading = false;
              this.$store.state.machineList2 = res.data
              this.machineOptions = this.all ? BASE_ARY.concat(this.$store.state.machineList2) : this.$store.state.machineList2;
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
  components: {},
  watch: {
    data(val, oldval) {
      if (val != oldval) {
        this.content = val
      }
    }
  },
  created() {
    this._hanldeMachineList2()
  },
  mounted() {
    this.content =this.all?'all':'';
    this.$emit('change', this.content)

  }
}
</script>

<style lang='less' scoped>
.machine {
  display: inline-block;
  vertical-align: middle;
  .machine_title {
    font-size: 14px;
    line-height: 28px;
    margin-left: 5px;
  }
  .machine_sel {
    width: 200px;
  }
}
</style>
