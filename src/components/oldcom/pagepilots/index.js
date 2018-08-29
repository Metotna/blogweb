import pagePilots from './pagePilots.vue'
// 这里是重点
const hBar = {
    install: function(Vue){
        Vue.component('pagePilots',pagePilots)
    }
}

// 导出组件
export default hBar