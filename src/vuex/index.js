import Vue from 'vue'
import Vuex from 'vuex'
// import { constRouter, asyncRouter } from '../intraware/routers'
Vue.use(Vuex)

// function hasPermission(roles, route) {
//   if (route.meta && route.meta.role) {
//     return roles.some(role => route.meta.role.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

export default new Vuex.Store({
  state: {
    islogin: sessionStorage.offalg || '',
    userInfo: {
      authority: '',
      userName: localStorage.as_user || '',
      token: sessionStorage.as_token || (localStorage.as_token || ''),
    },
    dpr: 1,
    clientHeight:500,
    keepAlive: false,
    editStatus:true,
    rule: localStorage.work_role || 1,
  },
  mutations: {},
  actions: {
    GenerateRoutes() {
      // const accessRouter = asyncRouter.filter(x=> {

      // })
    }
  }
})
