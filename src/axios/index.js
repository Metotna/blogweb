// 'use strict'
import vue from 'Vue'
import axios from 'axios'
import qs from 'qs'
import store from '@/vuex'
import router from '@/router'

axios.defaults.baseURL = AR_ADDR_QQDZ;
axios.defaults.timeout = AR_TIME;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.vm =''
var that


// 请求时的拦截
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
// 响应时拦截
axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function shwobox(text){
  if(that){
    that._message(text, "error")
  }else{
    alert(text)
  }
}

// 检查http状态码
function checkStatus(response) {
  if(response){
    const res = response.data
    if(response.status==200){
      return response
    }else{
      // console.log(response.data,2)
      throw response.data
    }
  }else{
    throw 'error'
  }
}

// 检查返回数据状态码
function checkCode(res) {
  const S = res.data.status
  if (S == 501) {
    shwobox('登录状态已过期，请重新登录！')
    router.push({
      path: '/login'
    });
    return 
  } else {
    return res.data
  }

}
export default {
  post(url, data) {
    if (url.indexOf('login') < 0) data.token = store.state.userInfo.token;
    return axios({
      method: 'post',
      url,
      data: qs.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(response => checkStatus(response)
    ).then(res=> checkCode(res)
    ).catch((error) => {
      shwobox('网络异常，请稍后再试!')
    })
  },
  imgpost(url, data) {
    if (url.indexOf('login') < 0) data.token = store.state.userInfo.token;
    var temp = new FormData();
    for (var key in data) {
      temp.append(key, data[key])
    }
    return axios({
      method: 'post',
      url,
      data: temp,
      headers: {
        'Content-Type': undefined,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    ).catch((error) => {
      alert('网络异常，请稍后再试!')
      throw error
    })
  },
  get(url, params) {
    if (url.indexOf('login') < 0) params.token = store.state.userInfo.token;
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
      headers: {}
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  INIT(vm) {
    that = vm
  },
  ajax(url,data){
    if (url.indexOf('login') < 0) data.token = store.state.userInfo.token;
        return axios({
      method: 'post',
      url,
      data: qs.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(response => checkStatus(response)
    ).then(res=> checkCode(res)
    ).catch((error) => {
      shwobox('网络异常，请稍后再试!')
    })
  }
}
