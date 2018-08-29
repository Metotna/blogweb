<template>
<div class='datapack'>
  <div class="d_body" v-if='show'>
    <span class='D_spana D_span'>{{texts[0]}}</span>
    <el-date-picker v-model="value[0]" :type="types" placeholder="开始时间" :size='sizes' :style='stylewidth' :picker-options="picker1" :default-value="new Date()" @change='valChange' :clearable='clearable'></el-date-picker>
    <span class='D_spanb D_span'>{{texts[1]}}</span>
    <el-date-picker v-model="value[1]" :type="types" placeholder="结束时间" :size='sizes' :style='stylewidth' :picker-options="picker2" :default-value="new Date()" @change='valChange' :clearable='clearable'></el-date-picker>
  </div>
</div>
</template>

<script>
export default {
  name: 'data_pack',
  props: {
    values: {
      type: Array,
      default: function() {
        return ["", ""];
      }
    },
    range: {
      type: String,
      default: 'month'
    },
    // range 类型  day、month、empty、backstep 
    rangeNmber: {
      type: Number,
      default: 7
    },
    types: {
      type: String,
      default: "date"
    },
    widths: {
      type: Number,
      default: 115
    },
    texts: {
      type: Array,
      default: function() {
        return ["", "至"];
      }
    },
    defaults: {
      type: Boolean,
      default: false
    },
    sizes: {
      type: String,
      default: "mini"
    }
  },
  data() {
    let _this = this;
    return {
      clearable: true,
      value: ["", ""],
      show: true,
      picker1: {
        disabledDate(time) {
          return (
            time.getTime() > new Date(_this.value[1] || '').getTime() ||
            time.getTime() > new Date().getTime() ||
            time.getTime() < new Date(2017, 6, 1, 0, 0, 0, 0, 0, 0).getTime()
          );
        }
      },
      picker2: {
        disabledDate(time) {
          return time.getTime() < new Date(_this.value[0]).getTime() ||
            time.getTime() > new Date().getTime();
        }
      }
    };
  },
  methods: {
    valChange() {
      this.$emit("change", this.value);
    },
    valInit() {
      switch (this.range) {
        case 'day':
          this.value[0] = new Date(this._timeF(new Date(), "yyyy/MM/dd 00:00:00"));
          this.value[1] = new Date(this._timeF(new Date(), "yyyy/MM/dd 23:59:59"));
          break;
        case 'month':
          this.value[0] = new Date(this._timeF(new Date(), "yyyy/MM/01 00:00:00"));
          this.value[1] = new Date(this._timeF(new Date(), "yyyy/MM/dd hh:mm:ss"));
          break
        case 'empty':
          break
      }
    },
    valInitChg() {
      this.show = false;
      this.valInit()
      this.show = true;
      this.valChange()
    },
  },
  watch: {
    types(val, oldval) {
      if (val != oldval) {
        this.show = false;
        this.show = true;
        this.valChange()
      }
    },
    values: {
      handler: function(val, oldval) {
        if (val != "") {
          this.value = val;
        }
      },
      deep: true
    }
  },
  created() {
    this.valInit()
    this.stylewidth = `width:${this.widths}px`;
    if (this.defaults) this.value = this.values;
    this.$emit("change", this.value);
  },
  activated() {
    // console.log(13)
    // console.log(`子页面进入 ${this.store.keepAlive}`)
    if (!this.store.keepAlive) this.valInitChg()
  }
};
</script>

<style lang='less'>
.datapack {
  margin: 0 0px;
  vertical-align: middle;
  display: inline-block;
  .d_body {
    display: inline-block;
    .D_span {
      text-align: right;
      font-size: 14px;
    } // input {
    //   font-size: 14px;
    // }
  }
  .el-date-editor {
    input {
      padding-left: 10px!important;
    }
    .el-input__prefix {
      display: none;
    }
  }
}
</style>
