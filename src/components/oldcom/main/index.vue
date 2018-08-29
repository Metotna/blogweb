<template>
<div class='index'>
  <keep-alive :include="include">
    <router-view class='index_router' />
  </keep-alive>

</div>
</template>

<script>
export default {
  data() {
    return {
      include: ['TICKET', 'ROLE', 'PAY', 'MONEY', 'FACTOR', 'BANK', 'ACCOUNT', 'TICKETED','TICKETINT'],
      tag: false,
    }
  },
  methods: {
    scrollFun(a) {
      document.getElementById('total_table').getElementsByClassName('el-table__body-wrapper')[0].scrollLeft = a;
    },
    addEventListener() {
      try {
        document.getElementById('child_table').getElementsByClassName('el-table__body-wrapper')[0].addEventListener('scroll', e => {
          this.scrollFun(e.target.scrollLeft)
          this.tag = true;
        }, false)
      } catch (err) {}
    },
    removeEventHandle() {
      try {
        document.getElementById('child_table').getElementsByClassName('el-table__body-wrapper')[0].removeEventListener('scroll', e => {
          this.scrollFun(e.target.scrollLeft)
          this.tag = false;
        }, false)
      } catch (err) {}
    },
  },
  watch: {
    '$route' (to, from) {
      // if( from.path == "/index"){  
      // console.log(`自：${from.path} 前往：${to.path}`)
      let a = from.path.split('/')[1];
      let b = to.path.split('/')[1];
      this.store.keepAlive = a === b ? true : false;
      // console.log(this.tag, 444)
      setTimeout(() => {
        if (!this.tag) {
          this.addEventListener()
        }
      })
    }

  },
  created() {},
  mounted() {
    this.addEventListener()
  },
  beforeDestroy() {
    this.removeEventHandle()
  },
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    // console.log(to)
    // to.meta.keepAlive = true;  // B 跳转到 A 时，让 A 缓存，即不刷新
    next();
  },
}
</script>

