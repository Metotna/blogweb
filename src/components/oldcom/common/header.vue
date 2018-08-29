<template>
<div class='headerll'>
  <div class="hl_meanu">
    <div class='hl_eb'>
      <li v-for='(x,index) in meanlist' @click='toPath(x.path)' :key='index'>
        <span v-if='index!=0'>/</span>
        <font>{{x.name}}</font>
      </li>
    </div>
  </div>
  <div class="hl_exit" @click='toExit'><i class="icon iconfont icon-tuichu"></i> 退出</div>
  <div class="hl_name"><i class="icon iconfont icon-zhanghao"></i> {{usrphone}}</div>
</div>
</template>

<script>
import {
  asyncRouter
} from '../../router'
export default {
  data() {
    return {
      temppath: "",
      _list: "",
      _listNow: "",
      meanlist: [{
        name: "",
        path: ""
      }]
    };
  },
  methods: {
    toExit() {
      const name = localStorage.cpt_username || '';
      const list = localStorage.work_list || '';
      localStorage.clear();
      localStorage.cpt_username = name || '';
      localStorage.work_list = list;
      location.reload();

      // this.$router.push({ path: '/login'});
    },
    toPath(val) {
      this.$router.push({
        path: val
      });
    },
    toChange(val) {
      const _list = this._list;
      _list.map(x => {
        if (x.path == "/" + val[0]) {
          this._listNow = x;
          this.toResult(x, val);
          return;
        }
      });
    },
    toResult(cot, ary) {
      if (!ary || !cot) return;
      this.meanlist = [];
      const p = cot.path;
      let l = ary.length;
      for (var i = 0; i < l; i++) {
        if (i == 0) {
          this.meanlist.push({
            name: cot.name,
            path: p
          });
        } else {
          let name = this.toChildPath(cot.children, ary[i]);
          this.meanlist.push({
            name: name,
            path: ""
          });
        }
      }
    },
    toChildPath(child, cot) {
      for (var i = 0; i < child.length; i++) {
        if (child[i].path == cot) {
          if (!child[i].alias) return child[i].name;
        }
      }
    }
  },
  computed: {
    usrphone() {
      return this.$store.state.userInfo.userName
    }
  },
  components: {},
  watch: {
    $route(to, from) {
      const temppath = to.path.split("/");
      if (temppath[1] == 'work') {
        this.meanlist[0] = {
          name: '出票工作台',
          path: '/work'
        }
      } else {
        this.toChange(temppath.splice(1));

      }
    }
  },
  created() {},
  mounted() {
    const _list = asyncRouter;
    _list.map(x => {
      if (x.name == "mainlist") {
        this._list = x.children;
        const temppath = this.$route.path.split("/");
        this.toChange(temppath.splice(1));
        return;
      }
    });
  }
};
</script>

<style lang='less' scoped>
.headerll {
  font-size: 16px;
  .hl_meanu {
    float: left;
    .hl_eb {
      float: left;
      height: 40px;
      color: #333;
      line-height: 40px;
      li {
        cursor: pointer;
        display: inline-block;
        margin: 0 3px;
        font {
          padding: 0 3px;
        }
      }
      li:last-child {
        cursor: initial;
        font {
          color: #6d6b6b;
        }
      }
    }
  }
  .hl_name {
    float: right;
    i {
      color: #333
    }
  }
  .hl_exit {
    cursor: pointer;
    float: right;
    margin-left: 20px;
    i {
      color: #333
    }
  }
}
</style>
