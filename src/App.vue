<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>
<script>
import {
  asyncRouter
} from './router'
export default {
  name: 'App',
  methods: {
    cHeight(v) {
      if (this.timeFlag || this.$store.state.clientHeight == v) return
      this.timeFlag = true;
      setTimeout(() => {
        this.$store.state.clientHeight = v;
        this.timeFlag = false;
      }, 300)
    }
  },
  created() {
    // this.rule(asyncRouter, [1, 2, 3, 4, 5, 6])
    // const temppath = this.$route.path.split('/')[1]
    // if (temppath.indexOf('login') < 0) {
    //   if (!this.$store.state.route) {
    //     if (localStorage.cpt_rule && localStorage.cpt_token) {
    //       this.$store.state.islogin = true;
    //       this.$store.state.userInfo.userName = localStorage.cpt_username;
    //       this.$store.state.userInfo.token = localStorage.cpt_token;
    //        this.$store.state.userInfo.types = localStorage.cpt_type;
    //       const res = this.aesDE(localStorage.cpt_rule)
    //       const route = this.rule(asyncRouter, res.split(','))
    //       this.$store.state.routecotant = route
    //       this.$router.addRoutes(route)
    //     } else {
    //       this.$router.push({
    //         path: '/login'
    //       })
    //     }
    //     // this.$router.addRoutes(asyncRouter)
    //   }
    // }
  },
  mounted() {
    this.cHeight(document.body.clientHeight)

    window.addEventListener("resize", () => {
      let h = document.body.clientHeight;
      this.cHeight(h)
    });
    const r = this.$route.path.split('/')[1];
    this.$store.state.editStatus = r == 'edit' ? false : true;
    // console.log(this.$route.path)
    // this.http.INIT(this)
  },
  watch: {
    '$route' (to, from) {
      // if( from.path == "/index"){  
      // console.log(`自：${from.path} 前往：${to.path}`)
      let a = from.path.split('/')[1];
      let b = to.path.split('/')[1];
      // console.log(a, b)
      this.$store.state.editStatus = b == 'edit' ? false : true;
      this.store.keepAlive = a === b ? true : false;

    }
  }
}

</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /* color: #2c3e50; */
  /*margin-top: 60px;*/
  height: 100%;
  width: 100%;
}

</style>
