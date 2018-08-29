<template>
  <div class='index_custom'>
    <header class="iheader">
      <i class="iasync ia-shouye ia_big ia_p ia_p_left" @click="_routerGo('/')"></i>
      <div class="_ih_right ia_p ia_p_right">
        <i class="iasync ia_big ia-user-login" v-if='!this.$store.state.userInfo.token' @click="_routerGo('/login')"></i>
        <i class="iasync ia_big ia-yidenglu " v-if='this.$store.state.userInfo.token' @click="_routerGo2('/login')"></i>
        <i class="iasync ia_big ia-jiajianzujianjiahao" v-if='this.$store.state.editStatus' @click="_routerGo('/edit')"></i>
      </div>
      <div class="ih_img">
        <img src="../../assets/img/async.svg">
      </div>
    </header>
    <content class="icontent">
      <router-view/>
    </content>
    <footer class="ifooter">async. ONNE
    </footer>
  </div>
</template>
<script>
import crypto from 'crypto'

export default {
  data() {
    return {
      data: []
    }
  },
  methods: {
    _routerGo(path) {
      this.$router.push(path)
    },
    _routerGo2(path) {
      var r = confirm("是否退出当前账号？");
      if (r == true) {
        this.$router.push(path)
      }
    },
    _handlePost() {
      this.http.ajax('/article/data', {}).then(e => {
        this.data = e.data;
      })
    },
    _routerLogin() {
      const a = this.publicEncrypt('123456')
      // const decodeData = crypto.privateDecrypt(Public_Key, Buffer.from(a.toString('base64'), 'base64'));
      // console.log(decodeData)
      this.http.ajax('/login/c', {
        name: 'async',
        pwd: a
      }).then(e => {
        console.log(e)
      })
    }
  },
  computed: {
    edit() {
      return this.$store.state.editStatus
    }

  },
  components: {},
  watch: {},
  created() {},
  mounted() {
    // this._routerLogin()
  },
  activated() {}
}

</script>
<style lang='less' scoped>
.index_custom {
  background-color: #f7f7f7;
  .iheader {
    height: 300px;
    width: 100%;
    background: #fff url('../../assets/img/bgi.png') 0 0 repeat-x;
    -webkit-background-size: 100% 100%;
    margin-bottom: -100px; // background-size: auto 100%;
    .ih_img {
      width: 400px;
      margin: 0 auto;
      padding-top: 40px;
    }
  }
  .icontent {
    // background-color: #ddd;
    display: block;
    max-width: 1200px;
    padding: 0 40px;
    min-width: 500px;
    margin: 0 auto; // transform: translateY(-40px)!important;
  }
  .ifooter {
    // transform: translateY(-40px)!important;
    display: block;
    height: 60px; // padding: 30px 0 20px;
    padding-top: 20px;
    font-size: 14px;
    color: #b3b3b3;
    text-align: center;
    background-color: #333;
  }
}

.iheader {
  .ia_big {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    line-height: 50px;
    font-size: 20px;
    opacity: .8;
    background-color: #ddd;
    transition: all 250ms;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .23);
  }
  .ia_big:hover {
    font-size: 22px;
    opacity: 1;
    transform: scale(1.1);
  }
  .ia_p {
    position: fixed;
    z-index: 5;
    top: 15px;
  }
  .ia_p_right {
    right: 25px;
    i {
      margin-bottom: 10px;
    }
  }
  .ia_p_left {
    left: 25px;
  }
  .ia_p2 {
    position: fixed;
    z-index: 5;
    top: 75px; // transform:rotate(45deg);
  }
}

</style>
