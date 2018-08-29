import accounts from './select/account.vue'
import machines from './select/machine.vue'
import merchant from './select/merchants.vue'
import datapack from './datapack.vue'
import goback from './goback.vue'
import pagePilots from './pagePilots.vue'

// 这里是重点
const hBar = {
    install: function(Vue) {
        Vue.component('accounts', accounts)
        Vue.component('machines', machines)
        Vue.component('merchant', merchant)
        Vue.component('datapack', datapack)
        Vue.component('goback', goback)
        Vue.component('pagePilots',pagePilots)

    }
}

// 导出组件
export default hBar