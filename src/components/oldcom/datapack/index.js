import datapack from './datapack.vue'
import goback from './goback.vue'
// 这里是重点
const hBar = {
    install: function(Vue) {
        Vue.component('datapack', datapack)
        Vue.component('goback', goback)
    }
}

// 导出组件
export default hBar