<template>
<div class='merchant'>
  <span class="merchant_title" v-if="title">{{title}}</span>
  <el-select v-model="content" placeholder="请选择商户" :size='size' :loading="slelectLoading" @change='hanldeChange' class="merchant_sel"  :clearable='!all'>
    <el-option v-for="item in merchantOptions" :key="item.merId" :label="item.merName" :value="item.merId" >
    </el-option>
  </el-select>

</div>
</template>

<script>
const BASE_ARY = [{
  merId: "all",
  merName: "全部"
}]
export default {
  props: {
    data: {
      type: String,
      default: '',
    },
    model: {
      prop: 'merchantId',
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
      merchantOptions: '',
      slelectLoading: false,
    }
  },
  methods: {
    //机器列表
    _hanldemerchantList() {
      let l = this.$store.state.merchantList;
      if (l.length > 0) {
        this.merchantOptions = this.all ? BASE_ARY.concat(l) : l;
        return;
      }
      this.slelectLoading = true;
      this.http.post("/user/mer/simpleList", {}).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.slelectLoading = false;
              this.$store.state.merchantList = res.data
              this.merchantOptions = this.all ? BASE_ARY.concat(res.data) : res.data;
              // console.log(this.merchantOptions)
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
    this._hanldemerchantList()
  },
  mounted() {
    this.content =this.all?'all':'';
    this.$emit('change', this.content)
  }
}
</script>

<style lang='less' scoped>
.merchant {
  display: inline-block;
    vertical-align: middle;
  // float: left;
  // overflow:hidden;
  .merchant_title {
    font-size: 14px;
    line-height: 26px;
    margin-left: 5px;
    // float: left;
    // padding: 0 5px;
    // border:1px solid #ddd;
    // // border-radius: 5px;
    // border-right-width: 0px;
  }
  .merchant_sel {
    vertical-align: middle;
    width: 120px;
  }
}
</style>
