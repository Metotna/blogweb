<template>
<div class='layout'>
  <el-container style="height:100%;">
    <el-aside width="160px" class='laside'>
      <div class='la_top'><img src="../../assets/img/logo.png"></div>
      <meaulist class='la_cot'></meaulist>
    </el-aside>
    <el-container>
      <el-header>
        <headerll/>
      </el-header>
      <el-main>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" class='el_main_r'></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class='el_main_r'></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
import meaulist from "./meaulist";
import headerll from "./header";
export default {
  name: "layout",
  data() {
    return {
      screenHeight: "",
      timer: false
    };
  },
  methods: {
    onRseize() {
      console.log(1111);
    }
  },
  components: {
    meaulist,
    headerll
  },

  watch: {
    screenHeight(val) {
      if (!this.timer) {
        this.timer = true;
        setTimeout(() => {
          const v = document.body.clientHeight+20;
          this.screenHeight = v;
          this.$store.state.cHeigt = v;
          this.timer = false;
        }, 150);
      }
    },
    '$route' (to, from) {
      // if( from.path == "/index"){  
      // console.log(`自：${from.name} 前往：${from.name}`)  
      // }   
    }
  },
  created() {
  },
  destroyed() {},
  beforeDestroy() {},
  mounted() {
    this.screenHeight = document.body.clientHeight+20;
    this.$store.state.cHeigt = document.body.clientHeight+20;
    const that = this;
    window.addEventListener("resize", function() {
      let h = document.body.clientHeight;
      that.screenHeight = h+20;
    });
    // console.log(!!localStorage.work_list)
    this.$store.state.worklistary= localStorage.work_list?JSON.parse(localStorage.work_list):[];
    
  }
};
</script>

<style lang='less'>
.layout {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .el-header {
    background-color: #fff;
    color: #333;
    line-height: 40px;
    height: 40px!important;
    border-bottom: 1px solid #ddd;
  }
  .el-aside {
    color: #333;
    background-color: #1f3762;
  }
  .el-main {
    padding: 5px 0;
    background-color: #ddd;
    .el_main_r {
      // padding:20px;
      // background: #fff;
    }
  }
  .laside {
    position: relative;
    .la_top {
      height: 45px;
      line-height:45px;
      background-color: inherit;
      padding: 3px 10px;
      padding-top: 5px;
      color: #fff;
      font-size: 24px;
      border-bottom: 1px solid #314469;
      img {
        // width: 100%;
        height: 100%;
      }
    }
    .la_cot {
      position: absolute;
      top: 45px;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: inherit;
    }
  }
}
</style>
