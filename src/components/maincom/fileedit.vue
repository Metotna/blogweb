<template>
  <div class="indexContainer">
    <!--         <div class="btnsContainer">
            <div class="btn" @click="getMdValueFn">获取mdValue</div>
            <div class="btn" @click="getHtmlValueFn">获取htmlValue</div>
        </div> -->
    <!--     <div class="maskContainer" v-if="dilogStatus">
      <div class="contentContainer">
        <div class="closeBtnContainer" @click="closeMaskFn"></div>
        <textarea class="showAreaContainer" v-model="msgShow" readonly></textarea>
      </div>
    </div> -->
    <div class="editorContainer" :style='height'>
      <div class="editContitle">
        <!-- <div class="_eleft">文章标题</div> -->
        <div class="_eright">
          <input type="text" v-model="contentTitle" placeholder="请输入文章标题（最多不超过N个字符）">
        </div>
        <i class="iasync ia_ ia-quxiao _btnicon_quxiao" title="取消" @click='_routeBack'></i>
        <i class="iasync ia_ ia-save _btnicon_save" title="保存" @click='_articleSave'></i>
      </div>
      <div style="height: 1px;margin: 1px 0 ;"></div>
      <markdown :mdValuesP="msg.mdValue" :fullPageStatusP="false" :editStatusP="true" :previewStatusP="false" :navStatusP="true" :icoStatusP="true" @childevent="childEventHandler"></markdown>
    </div>
    <div class="markdownBtn"></div>
  </div>
</template>
<script>
import markdown from './markdown.vue'
const samples = '## 正文内容'
export default {
  name: 'index',
  data() {
    return {
      msgShow: '我要显示的内容',
      dilogStatus: false,
      editStatus: false,
      contentTitle: '',
      msg: {
        mdValue: samples
      },
      scoringSamples: samples,
    }
  },
  computed: {
    height() {
      return `height: ${this.$store.state.clientHeight-300}px!important`
    }
  },
  components: {
    markdown
  },
  watch: {
    'msg.mdValue' (val, oldval) {
      if (oldval != val) {
        if (oldval != this.scoringSamples)
          this.editStatus = true;
      }
    }
  },
  methods: {
    _articleSave() {
      var oldval = this.msg.mdValue.toString()
      var t = oldval.slice(0, 200).replace(/\r|\n/gm, '').replace('```', ' ');
      this.http.ajax('/article/content/edit', {
        id: this._id,
        title: this.contentTitle,
        content: this.msg.mdValue,
        introduce: t,
      }).then(e => {
        if (e) {
          this.$router.push('/')
        }
      })
    },
    _routeBack() {
      if (this.editStatus) {
        alert('内容已已修改')
      } else {
        this.$router.go(-1)
      }
    },
    childEventHandler: function(res) {
      // res会传回一个data,包含属性mdValue和htmlValue，具体含义请自行翻译
      this.msg = res;
    },
    getMdValueFn: function() {
      this.msgShow = this.msg.mdValue;
      this.dilogStatus = true;
    },
    getHtmlValueFn: function() {
      this.msgShow = this.msg.htmlValue;
      this.dilogStatus = true;

    },
    closeMaskFn: function() {
      this.msgShow = '';
      this.dilogStatus = false;
    },
    _handlePost(v) {
      this.http.ajax('/article/content', {
        id: v
      }).then(e => {
        if (e) {
          // this.data = e.data;
          this.contentTitle = e.data.title;
          this.msg.mdValue = e.data.content;

        }
      })
    }
  },
  mounted() {
    const id = this.$route.query.id || '';
    this._id = id;
    if (id) this._handlePost(id)
  }
}

</script>
<style lang="less" scoped>
.show {
  position: absolute;
  left: 0;
  top: 0;
}

.indexContainer {
  width: 100%;
  height: 100%;
  background: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 40px
}

.editorContainer {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  box-shadow: 0 10px 20px rgba(0, 0, 0, .19), 0 6px 6px rgba(0, 0, 0, .23);
  .editContitle {
    height: 50px;
    background-color: #fff; // padding-top: 3px;
    position: relative; // ._eleft {
    //   float: left;
    //   width: 150px;
    //   height: 30px;
    //   line-height: 30px;
    //   border-right: 1px solid #ddd;
    //   text-align: center;
    // }
    ._eright {
      margin-left: 20px;
      height: 50px;
      line-height: 50px;
      input {
        font-size: 20px;
        width: 60%;
        height: 100%;
      }
    }
    .ia_ {
      position: absolute;
      top: -25px;
      height: 50px;
      width: 50px;
      border-radius: 50%;
      font-size: 18px;
      transition: all 250ms;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); // text-align: center;
      line-height: 50px;
    }
    ._btnicon_quxiao {
      right: 80px;
      color: #fff;
      background-color: #de6464;
    }
    ._btnicon_save {
      right: 20px;
      color: #fff;
      background-color: #0a6ba7;
    }
    .ia_:hover {
      font-size: 20px;
      opacity: 1;
      transform: scale(1.1);
    }
  }
}

</style>
