// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)
import './assets/css/index.css'
//数据项
import dataLary from './assets/js/dataLary'
Vue.prototype._date = dataLary;

import install from './pulgin/install'
import filters from './pulgin/filter'
Vue.use(install, filters)

// import pagePilots from './components/pagepilots'
// Vue.use(pagePilots)
// import datapack from './components/datapack'
// Vue.use(datapack)
// import widgets from './components/widgets'
// Vue.use(widgets)

import store from './vuex'
import router from './router'

Vue.prototype.store = store.state
Vue.config.productionTip = false
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

