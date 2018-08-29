<template>
<div class='account'>
  <span class="account_title" v-if='title'>{{title}}</span>
  <el-select v-model="content" placeholder="请选择出票员" :size='size' :loading="slelectLoading" @change='hanldeChange' class="account_sel" :clearable='!all'>
    <el-option v-for="item in accountOptions" :key="item.tkAccount" :label="_hanldeSelectLabel(item)" :value="item.tkAccount" >
    </el-option>
  </el-select>
</div>
</template>

<script>
const BASE_ARY = [{
  tkAccount: "all",
  tkName: "全部"
}]
export default {
  props: {
    data: {
      type: String,
      default: '',
    },
    model: {
      prop: 'accountId',
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
      accountOptions: '',
      slelectLoading: false,
    }
  },
  methods: {
    _hanldeSelectLabel(o) {
      if (o.tkAccount == 'all') return '全部'
      else return `${o.tkAccount} [${o.tkName}]`
    },
    //机器列表
    _hanldeaccountList() {
      let l = this.$store.state.accountList;
      if (l.length > 0) {
        this.accountOptions = this.all ? BASE_ARY.concat(this.$store.state.accountList) : this.$store.state.accountList;
        return;
      }
      this.slelectLoading = true;
      this.http.post("/user/ticketMan/list", {}).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.slelectLoading = false;
              this.$store.state.accountList = res.data
              this.accountOptions = this.all ? BASE_ARY.concat(this.$store.state.accountList) : this.$store.state.accountList;
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
    this._hanldeaccountList()
  },
  mounted() {
    this.content =this.all?'all':'';
    this.$emit('change', this.content)

  }
}
</script>

<style lang='less' scoped>
.account {
  display: inline-block;
  vertical-align: middle;
  // float: left;
  margin-right: 5px;
  .account_title {
    font-size: 14px;
    line-height: 28px;
    margin-left: 5px;
  }
  .account_sel {
    width: 150px;
  }
}
</style>
