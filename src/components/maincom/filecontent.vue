<template>
  <div class='file_content'>
    <div class="_content ">
      <i class="iasync ia-fanhui ia_big ia_big_left" @click='_routeBack'></i>
      <i class="iasync ia-bianji ia_big ia_big_right" @click="_articEdit(data.id)" style="margin-bottom: 10px;"></i>
      <div class='_c_title'>{{data.title}}</div>
      <div class='_c_time'>{{data.id}} - {{data.updatetime}}</div>
      <hr style="border-bottom:1px solid #ddd;margin-bottom: 20px;">
      <p v-html='data.content' class="markdown-body _c_p"></p>
      <hr style="margin:30px 0;opacity: 0">
    </div>
  </div>
</template>
<script>
import marked from 'marked'
const colorReg = new RegExp(/\&lt\;([A-Za-z0-9#]*)\&gt\;(.*?)\&lt\;\/\&gt\;/gm)

export default {
  data() {
    return {
      data: []
    }
  },
  methods: {
    _articEdit(v) {
      this.$router.push({
        path: 'edit',
        query: {
          id: v
        }
      })
    },
    _routeBack() {
      this.$router.go(-1)
    },
    _handlePost(v) {
      this.http.ajax('/article/content', {
        id: v
      }).then(e => {
        if (e) {
          this.data = e.data;
          // console.log(e.data)
          // this.data.content=''
          var result = marked(e.data.content, {
            sanitize: true
          })
          this.data.content = result.replace(colorReg, `<font style='color:${'$1'}'>${'$2'}</font>`)
        }
      })
    }
  },
  computed: {

  },
  components: {},
  watch: {},
  created() {
    const id = this.$route.query.id || '';
    // console.log(id)
    if (id) this._handlePost(id)
    this.editid = id;
    // this._handlePost()
  },
  mounted() {},
  activated() {}
}

</script>
<style lang='less'>
/*引入github的markdown样式文件*/

@import "../../assets/css/github-markdown.css";





/*引入atom的代码高亮样式文件*/

@import "../../assets/css/atom-one-dark.min.css";

// @import "../../assets/css/monokai.min.css";
.file_content {
  ._content {
    position: relative;
    padding: 15px 40px;
    margin: 10px 10px 30px 10px;
    background-color: #fff;
    min-height: 100px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, .19), 0 6px 6px rgba(0, 0, 0, .23);
  }
  ._c_title {
    padding: 20px;
    font-size: 50px;
    text-align: center;
  }
  ._c_time {
    text-align: right;
    font-size: 14px;
    color: #777;
  }
  ._c_p {
    // margin-bottom: 50px;
    pre {
      font-size: 14px;
    }
  }
  .ia_big {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    line-height: 50px;
    font-size: 18px;
    background-color: #fff;
    transition: all 250ms;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .23);
    position: absolute;
    top: -25px;
  }
  .ia_big_left {
    left: 60px;
  }
  .ia_big_right {
    right: 60px;
  }

  .ia_big:hover {
    font-size: 20px; // opacity: 1;
    transform: scale(1.1);
  }
}

</style>
