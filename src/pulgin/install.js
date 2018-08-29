exports.install = function(Vue, options) {
  Vue.prototype.http = require('../axios/index').default;
  Vue.prototype._timeF = function(val, f) {
    // val 是 能被 new Date() 解析的值 ;f 是时间格式,例如： ('yyyyMMddhhmmss') 如果没有返回 时间戳
    if (val) {
      if (f) {
        var temp = new Date(val).format(f);
      } else {
        var temp = Date.parse(new Date(val));
      }
    } else {
      var temp = Date.parse(new Date());
    }
    return temp
  }
  Date.prototype.format = function(fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }
  Vue.prototype._getSummaries = function(param, showAry) {
    const {
      columns,
      data
    } = param;

    const ary = showAry;
    const sums = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = "当页总计";
        return;
      }
      ary.forEach(val => {
        if (index == val || index == val[0]) {
          const FixedNumber = val[1] || 0;
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + value;
              } else {
                return prev;
              }
            }, 0);
            val[2] = val[2] || '';
            sums[index] = val[2] + sums[index].toFixed(FixedNumber);

          } else {
            sums[index] = "";
          }
        }
      })
    });

    return sums;
  }
  Vue.prototype._message = function(text, type) {
    // console.log(Vue, this)
    if (type == 'error') {
      this.$message({
        duration: 3000,
        iconClass: 'ifo',
        message: text,
        customClass: 'elm_error elm'
      })
    } else if (type == 'success') {
      this.$message({
        duration: 3000,
        iconClass: 'ifo',
        message: text,
        customClass: 'elm_success elm'
      })
    } else {
      this.$message(text);

    }
  }
  Vue.prototype.rule = function() {
    // var copy = arguments[0][0].children;
    var l = arguments[0][0].children
    var r = arguments[1].join(',')
    var res = []
    l.map(x => {
      var temp = x.meta.role;
      if (r.indexOf(temp) > -1) {
        res.push(x)
      }
    })
    arguments[0][0].children = res
    return arguments[0]
  }
  Vue.prototype.encryption = function(val) {
    if (!val) return
    var jsencrypt = require('jsencrypt').default;
    var encrypt = new jsencrypt()
    encrypt.setPublicKey(Public_Key);
    const encrypted = encrypt.encrypt(val);
    jsencrypt = null
    return encrypted
  }

  Vue.prototype.publicEncrypt = function(val) {
    if (!val) return
    var crypto = require('crypto');
    const encodeData = crypto.publicEncrypt(Public_Key, Buffer.from(val)).toString('base64');
    // var encrypt = new jsencrypt()
    // encrypt.setPublicKey(Public_Key);
    // const encrypted = encrypt.encrypt(val);
    crypto = null
    return encodeData
  }
  // Vue.prototype.aesEN = function (data) {
  //   const CryptoJS = require('crypto-js')
  //   var strs = data.toString()
  //   var luan = Math.random().toString(36).substr(2);
  //   var endData = strs + '&sign=' + CryptoJS.MD5(strs + luan).toString(); // MD5加密
  //   var key = CryptoJS.enc.Utf8.parse("0880076B18D7EE81"); // 加密秘钥
  //   var iv = CryptoJS.enc.Utf8.parse("CB3EC842D7C69578"); //  矢量
  //   var encryptResult = CryptoJS.AES.encrypt(endData, key, { //  AES加密
  //     iv: iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7 // 后台用的是pad.Pkcs5,前台对应为Pkcs7
  //   });
  //   return encryptResult.toString()
  // }
  // Vue.prototype.aesDE = function () {
  //   const CryptoJS = require('crypto-js')
  //   let data = arguments[0]
  //   let key = CryptoJS.enc.Utf8.parse("0880076B18D7EE81"); // 加密秘钥
  //   let iv = CryptoJS.enc.Utf8.parse("CB3EC842D7C69578"); //  矢量
  //   let baseResult = CryptoJS.enc.Base64.parse(data); // Base64解密
  //   let ciphertext = CryptoJS.enc.Base64.stringify(baseResult); // Base64解密
  //   let decryptResult = CryptoJS.AES.decrypt(ciphertext, key, { //  AES解密
  //     iv: iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   });
  //   var resData = function () {
  //     try {
  //       const res = decryptResult.toString(CryptoJS.enc.Utf8).toString()
  //       // console.log(res)
  //       return res.split('&sign=')[0]
  //     } catch (e) {
  //       return 'data_error'
  //     }
  //   }
  //   return resData()
  // }

}
