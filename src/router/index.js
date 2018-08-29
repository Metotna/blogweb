import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import index from '@/components/maincom/index'
import filelist from '@/components/maincom/filelist'
import filecontent from '@/components/maincom/filecontent'
import fileedit from '@/components/maincom/fileedit'
import login from '@/components/common/login'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/test',
      name: 'HelloWorld',
      component: HelloWorld
    },
    { path: '/login', component: login, meta: { auth: true } },
    {
      path: '/',
      component: index,
      name: 'home',
      meta: { role: '4', icon: 'icon-mingxi', keepAlive: false },
      children: [
        { path: 'list', component: filelist, alias: '/', name: 'default' },
        { path: 'article', component: filecontent, name: 'details ', meta: { role: [100] } },
        { path: 'edit', component: fileedit, name: 'edit ', meta: { role: [100] } },
        // { path: 'order', component: ticketOrd, name: '订单详情', meta: { role: [100, 200] } }
      ]
    },
  ]
})
