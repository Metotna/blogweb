import Vue from 'vue'
import dataLary from '../assets/js/dataLary'
Vue.filter('myfilter', (value, x, symbol) => {
  if (typeof(value * 1) == 'number' && value * 1 != NaN) {
    var s = symbol || '';
    if (x > -1) {
      return s + (value * 1).toFixed(x)
    } else {
      return s + (value * 1).toFixed(2)
    }
  } else {
    return '--';
  }
})

Vue.filter('myfilter_', (value, x) => {
  let v = value * 1
  if (typeof(v) == 'number' && v != NaN) {
    var s = value > 0 ? "+" : '';
    let tF = x || 2
    return s + (v).toFixed(tF)
  } else {
    return '--';
  }
})
Vue.filter('moneyFormat', (val) => {
  if (val) {
    if (val >= 10000) {
      if (val % 10000 == 0) { return val / 10000 + 'w' } else {
        const a = val.toString()
        return a.substring(0, a.length - 4) + 'w' + a.substring(a.length - 4, a.length)
      }
    }
  }
  return val

})

Vue.filter('dataFixed', function(val) {
  if (val == undefined) return '--';
  if (val != '') {
    if (val > 100000) return (val * 1 / 10000).toFixed(1) + 'w';
    else return (val * 1).toFixed(0)
  }
  return val
})
Vue.filter('orderState', function(val) {
  var optionstatus = dataLary._BASIC.Ordstate;
  for (var x in optionstatus) {
    if (optionstatus[x].id == val) {
      return optionstatus[x].name;
    }
  }
  return '--';
})
Vue.filter('chargeState', function(val) {
  if (val) {
    var optionstatus = dataLary._CHARGE.state;
    for (var x in optionstatus) {
      if (optionstatus[x].id == val) {
        return optionstatus[x].name;
      }
    }
  }
  return '--';
})
Vue.filter('billState', function(val) {
  if (val) {
    var optionstatus = dataLary._BILL.state;
    for (var x in optionstatus) {
      if (optionstatus[x].id == val) {
        return optionstatus[x].name;
      }
    }
  }
  return '--';
})
Vue.filter('agentState', function(val) {
  if (val) {
    var optionstatus = dataLary._AGENT.state;
    for (var x in optionstatus) {
      if (optionstatus[x].id == val) {
        return optionstatus[x].name;
      }
    }
  }
  return '--';
})

Vue.filter('bankName', function(val) {
  if (val > 0) {
    return val + '个'
  }
  return '';
})

Vue.filter('AUTH_RES', function(val) {
  if (val) {
    var optionstatus = dataLary._BASIC.resList;
    var ary = []
    val.map(x => {
      for (var y in optionstatus) {
        if (optionstatus[y].id == x) {
          ary.push(optionstatus[y].name)
        }
      }
    })
    return ary.join(',')
  }
  return val;
})
Vue.filter('AUTH_RULE', function(val) {
  if (val) {
    var optionstatus = dataLary._BASIC.roleList;
    for (var y in optionstatus) {
      if (optionstatus[y].id == val) {
        return optionstatus[y].name + ':';
      }
    }
    // return val.join(',')
  }
  return val;
})
Vue.filter('order_play', function(val) {
  if (val !== '') {
    var tempval = val.split('|');
    return tempval[2].replace('*', '串')
  }
  return val
})
Vue.filter('order_play_type', function(val) {
  if (val !== '') {
    let p = val.split('|')[0]
    var optionstatus = dataLary._BASIC.betType;
    for (var y in optionstatus) {
      if (optionstatus[y].id == p) {
        return optionstatus[y].name;
      }
    }
  }
  return val
})

Vue.filter('lottery', function(val) {
  if (val) {
    var optionstatus = dataLary._BASIC.Lottype;
    for (var x in optionstatus) {
      if (optionstatus[x].id == val) {
        return optionstatus[x].name;
      }
    }
  }
  return '--';
})

Vue.filter('work_status', function(val) {
  if (val) {
    var optionstatus = dataLary._WORK.state;
    for (var x in optionstatus) {
      if (optionstatus[x].id == val) {
        return optionstatus[x].name;
      }
    }
  }
  return '--';
})
Vue.filter('work_status2', function(val) {
  if (val) {
    var optionstatus = dataLary._WORK.states;
    for (var x in optionstatus) {
      if (optionstatus[x].id == val) {
        return optionstatus[x].name;
      }
    }
  }
  return '--';
})
Vue.filter('work_slice', function(val, a, b) {
  if (val) {
    return val.slice(a, b)
  }
  return val
})
Vue.filter('work_play', function(val) {
  if (val) {
    var tempval = val.split('|');
    var optionstatus = dataLary._BASIC.JCWF;
    for (var x in optionstatus) {
      if (optionstatus[x].id == tempval[0]) {
        var a = optionstatus[x].name;
      }
    }
    return a;
  }
  return val
})

Vue.filter('work_order_play', function(val) {
  if (val) {
    var tempval = val.split('|');
    var b = tempval[2].replace('*', '串')

    var optionstatus = dataLary._BASIC.JCWF;
    for (var x in optionstatus) {
      if (optionstatus[x].id == tempval[0]) {
        var a = optionstatus[x].name;
      }
    }
    return a + '|' + b;
  }
  return val
})
Vue.filter('work_number', function(val) {
  if (val) {
    const a = val.toString()
    return a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }
  return val
})

Vue.filter('merinfor', function(val, ary, eId, eName) {

  if (val) {
    const ID = eId || 'merId'
    const NAME = eName || 'merName'

    var optionstatus = ary;
    for (var x in optionstatus) {
      if (optionstatus[x][ID] == val) {
        return optionstatus[x][NAME];
      }
    }
  }
  return val
})

Vue.filter('work_content', function(val, valb, type) {
  if (val) {
    if (type.indexOf('HH') > -1) {
      var a = val.split('/')
      var b1 = valb.split('=')
      var optionstatus = dataLary._BASIC.JCWF;
      for (var x in optionstatus) {
        if (optionstatus[x].id == b1[0]) {
          var e = optionstatus[x].name;
        }
      }
      var b2 = b1[1].split('/')
      var t = []
      for (var x in a) {
        t.push(a[x] + '|' + b2[x])
      }
      return `【${e}】${t.join(' , ')}`

    } else {
      var a = val.split('/')
      var b = valb.split('/')
      var t = []
      for (var x in a) {
        t.push(a[x] + '|' + b[x])
      }
      return t.join(' , ')
    }

  }
  return val
})

Vue.filter('timesSummary', function(val) {
  if (val) {
    let d = Date.parse(new Date()) / 1000 - Date.parse(val.replace(/-/g, '/')) / 1000;
    if(d<=600)return '刚刚'
      else if (d>600 && d<3600) return  parseInt(d/60)+'分钟前';
    else if(d>=3600 && d<=24*3600) return parseInt(d/3600)+'小时前';
    else if(d>24*3600 && d<=48*3600) return '昨日'
    else return  parseInt(d/(24*3600))+'天前'
  }
  return val
})

Vue.directive('colors', {
  // bind: function() {},
  // update: function() {},
  // componentUpdated: function() {},
  // unbind: function() {},
  inserted: function(el, binding) {
    // 聚焦元素
    el.style.color = binding.value;
  }
})

export default Vue
