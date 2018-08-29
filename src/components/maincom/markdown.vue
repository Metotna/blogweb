<template>
  <div class="mdContainer" :class="{ fullPage: fullPageStatus }">
    <div class="navContainer" v-if="navStatus">
      <!-- <div class="nameContainer" v-if="icoStatusP" @click="happyDay">OVEN-mdEditor</div> -->
      <div class="markContainer">
        <ul class="markListGroup">
          <li class="markListItem" @click="addStrong" title="加粗"><b>B</b></li>
          <li class="markListItem" @click="addItalic" title="斜体"><i>I</i></li>
          <li class="markListItem" @click="addStrikethrough" title="删除线"><i class="iasync ia-strike-through" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addHTitle(1)" title="H1-title">H1</li>
          <li class="markListItem" @click="addHTitle(2)" title="H2-title">H2</li>
          <li class="markListItem" @click="addHTitle(3)" title="H3-title">H3</li>
          <li class="markListItem" @click="addHTitle(4)" title="H4-title">H4</li>
          <li class="markListItem" @click="addHTitle(5)" title="H5-title">H5</li>
          <li class="markListItem" @click="addHTitle(6)" title="H6-title">H6</li>
          <li class="markListItem" @click="addLine" title="分隔线">一</li>
          <li class="markListItem" @click="addQuote" title="引用"><i class="iasync ia-quote" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addCode" title="代码块"><i class="iasync ia-code" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addLink" title="超链接"><i class="iasync ia-link" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addImage" title="图片"><i class="iasync ia-duotu" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addTable" title="表格"><i class="iasync ia-table" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addUl" title="无序列表"><i class="iasync ia-ul" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addOl" title="有序列表"><i class="iasync ia-o-list" aria-hidden="true"></i></li>
          <li class="markListItem" @click="fullPageFn" title="全屏" v-if='!fullPageStatus'><i class="iasync ia-intofull" aria-hidden="true"></i></li>
          <li class="markListItem" @click="fullPageFn" title="退出全屏" v-if='fullPageStatus'><i class="iasync ia-outfull" aria-hidden="true"></i></li>
          <li class="markListItem" @click="previewFn" title="实时预览"><i class="iasync ia-code-eye" aria-hidden="true"></i></li>
          <li class="markListItem" @click="previewAllFn" title="预览"><i class="iasync ia-yulan" aria-hidden="true"></i></li>
        </ul>
      </div>
    </div>
    <div class="mdBodyContainer" :class="{ noMenu: !navStatus }">
      <div class="editContainer" v-if="editStatus">
        <!-- <div contenteditable="true" class="mdEditor" v-html=''></div> -->
        <textarea name="" @keydown.9="tabFn" class="mdEditor" v-scroll="editScroll" v-model="input"></textarea>
      </div>
      <div class="previewContainer markdown-body" v-scroll="previewScroll" v-html="compiledMarkdown" v-if="previewStatus">
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import marked from 'marked'
import scroll from 'vue-scroll'
import hljs from 'highlight.js'
import range from '../../assets/js/tools/rangeFn.js'
Vue.use(scroll)
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function(code) {
    return hljs.highlightAuto(code).value
  }
});
const colorReg = new RegExp(/\&lt\;([A-Za-z0-9#]*)\&gt\;(.*?)\&lt\;\/\&gt\;/gm)

function insertContent(val, that) {
  let textareaDom = document.querySelector('.mdEditor');
  let value = textareaDom.value;
  let point = range.getCursortPosition(textareaDom);
  let lastChart = value.substring(point - 1, point);
  // console.log(lastChart)
  let lastFourCharts = value.substring(point - 4, point);
  if (lastChart != '\n' && value != '' && lastFourCharts != '    ') {
    val = '\n' + val;
    range.insertAfterText(textareaDom, val);
  } else {
    range.insertAfterText(textareaDom, val);
  }
  that.input = document.querySelector('.mdEditor').value;
}
export default {
  name: 'markdown',
  props: ['mdValuesP', 'fullPageStatusP', 'editStatusP', 'previewStatusP', 'navStatusP', 'icoStatusP'],
  data() {
    return {
      input: this.mdValuesP || '',
      editStatus: Boolean(this.editStatusP),
      previewStatus: Boolean(this.previewStatusP),
      fullPageStatus: Boolean(this.fullPageStatusP),
      navStatus: Boolean(this.navStatusP),
      icoStatus: Boolean(this.icoStatusP),
      maxEditScrollHeight: 0,
      maxPreviewScrollHeight: 0
    }
  },
  created: function() {
    if (!this.editStatus && !this.previewStatus) {
      this.editStatus = true;
      this.previewStatus = true;
    }
  },
  methods: {
    enterFn(evt) {
      document.querySelector('.mdEditor').scrollHeight - document.querySelector('.mdEditor').clientHeight;
      let maxPreviewScrollHeight = document.querySelector('.previewContainer').scrollHeight - document.querySelector('.previewContainer').clientHeight;
    },
    tabFn: function(evt) {
      insertContent("  ", this);
      // 屏蔽屌tab切换事件
      if (evt.preventDefault) {
        evt.preventDefault();
      } else {
        evt.returnValue = false;
      }
    },
    addImage: function(evt) {
      insertContent("![Vue](https://cn.vuejs.org/images/logo.png)", this);
    },
    addHTitle: function(index) {
      let tmp = '';
      switch (index) {
        case 1:
          tmp = '# ';
          break;
        case 2:
          tmp = '## ';
          break;
        case 3:
          tmp = '### ';
          break;
        case 4:
          tmp = '#### ';
          break;
        case 5:
          tmp = '##### ';
          break;
        case 6:
          tmp = '###### ';
          break;
        default:
          break;
      }
      insertContent(tmp, this);
    },
    handlePublic() {
      let textareaDom = document.querySelector('.mdEditor');
      let value = textareaDom.value;
      let point = range.getCursortPosition(textareaDom);
      let lastChart = value.substring(point - 1, point);
      return {
        textareaDom: textareaDom,
        value: value,
        point: point,
        lastChart: lastChart
      }
    },
    addCode: function() {
      let temp = this.handlePublic()
      insertContent('```\n\n```', this);
      if (temp.lastChart != '\n' && temp.value != '') {
        range.setCaretPosition(temp.textareaDom, temp.point + 5);
      } else {
        range.setCaretPosition(temp.textareaDom, temp.point + 4);
      }
    },
    addStrikethrough: function() {
      let temp = this.handlePublic()


      insertContent('~~~~', this);
      if (temp.lastChart != '\n' && temp.value != '') {
        range.setCaretPosition(temp.textareaDom, temp.point + 3);
      } else {
        range.setCaretPosition(temp.textareaDom, temp.point + 2);
      }
    },
    addStrong: function() {
      let temp = this.handlePublic()
      insertContent('****', this);
      if (temp.lastChart != '\n' && temp.value != '') {
        range.setCaretPosition(temp.textareaDom, temp.point + 3);
      } else {
        range.setCaretPosition(temp.textareaDom, temp.point + 2);
      }
    },
    addItalic: function() {
      let temp = this.handlePublic()
      insertContent('**', this);
      if (temp.lastChart != '\n' && temp.value != '') {
        range.setCaretPosition(temp.textareaDom, temp.point + 2);
      } else {
        range.setCaretPosition(temp.textareaDom, temp.point + 1);
      }
    },
    setStrong: function() {
      let textareaDom = document.querySelector('.mdEditor');
      let point = range.getCursortPosition(textareaDom);
    },
    addLine: function() {
      insertContent('\n----\n', this);
    },
    addLink: function() {
      insertContent("[Vue](https://cn.vuejs.org/images/logo.png)", this);
    },
    addQuote: function() {
      let temp = this.handlePublic()
      insertContent('> ', this);
      if (temp.lastChart != '\n' && temp.value != '') {
        range.setCaretPosition(temp.textareaDom, temp.point + 3);
      } else {
        range.setCaretPosition(temp.textareaDom, temp.point + 2);
      }
    },
    addTable: function() {
      insertContent('\nheader 1 | header 2\n', this);
      insertContent('---|---\n', this);
      insertContent('row 1 col 1 | row 1 col 2\n', this);
      insertContent('row 2 col 1 | row 2 col 2\n\n', this);
    },
    addUl: function() {
      insertContent('* ', this);
    },
    addOl: function() {
      insertContent('1. ', this);
    },
    previewFn: function() {
      if (!this.editStatus) {
        this.editStatus = true;
        this.previewStatus = !this.previewStatus;
      } else {
        this.previewStatus = !this.previewStatus;
      }
      if (this.previewStatus) {
        console.log(`ss`)
        setTimeout(() => {
          let topPercent = document.querySelector('.mdEditor').scrollTop / this.maxEditScrollHeight;
          document.querySelector('.previewContainer').scrollTop = this.maxPreviewScrollHeight * topPercent;
        })

      }
    },
    previewAllFn: function() {
      if (!this.editStatus && this.previewStatus) {
        this.editStatus = true;
        this.previewStatus = false;
      } else {
        this.editStatus = false;
        this.previewStatus = true;
      }

    },
    fullPageFn: function() {
      this.fullPageStatus = !this.fullPageStatus;
      this.scrollHeightCal()

    },
    previewScroll: function(e, position) {
      if (this.maxEditScrollHeight !== 0) {
        let topPercent = position.scrollTop / this.maxPreviewScrollHeight;
        topPercent = Math.round(topPercent * 10000) / 10000
        try { document.querySelector('.mdEditor').scrollTop = this.maxEditScrollHeight * topPercent; } catch (err) {}
      }
    },
    editScroll: function(e, position) {
      if (this.maxPreviewScrollHeight !== 0) {
        let topPercent = position.scrollTop / this.maxEditScrollHeight;
        topPercent = Math.round(topPercent * 10000) / 10000
        try { document.querySelector('.previewContainer').scrollTop = this.maxPreviewScrollHeight * topPercent; } catch (err) {}
      }
    },
    happyDay: function() {
      window.open('https://github.com/ovenslove/vue-mdEditor');
    },
    scrollHeightCal() {
      try {
        let maxEditScrollHeight = document.querySelector('.mdEditor').scrollHeight - document.querySelector('.mdEditor').clientHeight;
        let EditScrollTOP = document.querySelector('.mdEditor').scrollTop;
        if (Math.abs(EditScrollTOP - maxEditScrollHeight) <= 2) this.maxEditScrollHeight = EditScrollTOP;
        else this.maxEditScrollHeight = maxEditScrollHeight
      } catch (err) {}
      try {
        let maxPreviewScrollHeight = document.querySelector('.previewContainer').scrollHeight - document.querySelector('.previewContainer').clientHeight;
        this.maxPreviewScrollHeight = maxPreviewScrollHeight
      } catch (err) {}
    }
  },
  computed: {
    compiledMarkdown: function() {
      var result = marked(this.input, {
        sanitize: true
      })
      return result.replace(colorReg, `<font style='color:${'$1'}'>${'$2'}</font>`)
    }
  },
  watch: {
    input: function() {
      let data = {};
      data.mdValue = this.input;
      var result = marked(this.input, {
        sanitize: true
      });
      // let temp = this.handlePublic()
      data.htmlValue = result.replace(colorReg, `<font style='color:${'$1'}'>${'$2'}</font>`)
      this.$emit('childevent', data);
      setTimeout(() => {
        try {
          let maxEditScrollHeight = document.querySelector('.mdEditor').scrollHeight - document.querySelector('.mdEditor').clientHeight;
          let EditScrollTOP = document.querySelector('.mdEditor').scrollTop;
          if (Math.abs(EditScrollTOP - maxEditScrollHeight) <= 2) this.maxEditScrollHeight = EditScrollTOP;
          else this.maxEditScrollHeight = maxEditScrollHeight
        } catch (err) {}
        try {
          let maxPreviewScrollHeight = document.querySelector('.previewContainer').scrollHeight - document.querySelector('.previewContainer').clientHeight;
          this.maxPreviewScrollHeight = maxPreviewScrollHeight
        } catch (err) {}
        // console.log(this.maxEditScrollHeight, this.maxPreviewScrollHeight, document.querySelector('.mdEditor').scrollTop)
      })

    },
    mdValuesP(val, oldval) {
      if (val != oldval) {
        this.input = val
        this.scrollHeightCal()
      }
    }
  }
}

</script>
<style lang="scss">
/*引入reset文件*/

@import "../../assets/css/reset";

/*引入github的markdown样式文件*/

@import "../../assets/css/github-markdown.css";

/*引入atom的代码高亮样式文件*/

@import "../../assets/css/atom-one-dark.min.css";
.mdContainer {
  width: 100%;
  height: 100%;
  &.fullPage {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
  }
  .navContainer {
    width: 100%;
    height: 36px;
    background: #fff;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    .nameContainer {
      color: #add8e6;
      margin-right: 10px;
      cursor: pointer;
    }
    .markContainer {
      width: auto;
      height: 100%;
      margin-left: 0px;
      ul.markListGroup {
        height: 100%;
        width: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        li.markListItem {
          list-style: none;
          width: 20px;
          height: 20px;
          margin: 0 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          &:hover {
            background: #eee;
          }
          i {
            font-size: 14px;
          }
        }
      }
    }
  }
  .mdBodyContainer {
    width: 100%;
    height: calc(100% - 86px);
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    &.noMenu {
      height: 100%;
    }
  }
} // 编辑区域
.editContainer {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-right: 1px solid #ddd;
  background: #f2f3f7;
  color: #333;
  padding: 5px 10px;
  .mdEditor {
    line-height: 20px;
    font-size: 16px; // height: 100%;
    height: 100%; // max-height: 800px;
    width: 100%;
    background: transparent;
    font-family: Consolas;
    outline: none; // color: #fff;
    resize: none;
  }
} // 预览区
.previewContainer {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  overflow: auto;
  padding: 10px;
  pre {
    font-size: 14px;
    font-family: monospace!important;
  }
}

</style>
