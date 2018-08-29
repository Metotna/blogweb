<template>
  <div class='mlist'>
    <ul>
      <li v-for='x in list' @click='toGo(x.path)' :class="x.path==temppath?'active':''" :key="x.name" >
        <i class="icon iconfont" :class="x.meta.icon" ></i>
        <span>{{x.name}}</span>
        </li>
      <!-- <li @click="toGo('/work')" :class="'/work'==temppath?'active':''"  >
        <i class="icon iconfont icon-mingxi" ></i>
        <span>出票工作台</span>
      </li> -->
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      temppath: ""
    };
  },
  methods: {
    toGo(path) {
      // console.log(path)
      if(path=='/work'){

      }
      this.$router.push({ path: path });
    },
    toActive() {}
  },
  watch: {
    $route(to, from) {
      const temppath = to.path.split("/");
      this.temppath = "/" + temppath[1];
    }
  },
  created() {},
  mounted() {
    const temppath = this.$route.path.split("/")[1];
    this.temppath = "/" + temppath;
    const _list = this.$store.state.routecotant
    _list.map(x => {
      if (x.name == "mainlist") {
        this.list = x.children;
        return;
      }
    });
  }
};
</script>
<style lang='less' scoped>
.mlist {
  padding-top: 10px;
  li {
    height: 60px;
    line-height: 60px;
    color: #ffffff;
    user-select: none;
    text-align: left;
    padding-left: 20px;
    span {
      margin-left: 7px;
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 18px;
    }
  }
  li:hover {
    background: #112D5F;
  }
  .active {
    background-color: #2a76ed !important;
  }
}
</style>
