<template>
<div class='payAudit'>
  <goback></goback>
  <div class="pA_success" v-if='auditRes'>
    <div class="re_fac">
      <span class='rer_span'>代理商名称:</span>
      <div class='rer_div'>
        <font>{{auditObj.merName}}</font>
      </div>
    </div>
    <div class="re_fac">
      <span class='rer_span'>手机号:　　</span>
      <div class='rer_div'>
        <font>{{auditObj.phone}}</font>
      </div>
    </div>
    <div class="re_fac">
      <span class='rer_span'>充值金额:　</span>
      <div class='rer_div'>
        <font>{{auditObj.chargeMoney}}</font>
      </div>
    </div>
    <div class="re_fac">
      <span class='rer_span'>审核状态:　</span>
      <div class='rer_div'>
        <font>{{auditObj.state|chargeState}}</font>
      </div>
    </div>
    <div class="re_fac">
      <span class='rer_span'>备注:　　　</span>
      <div class='rer_div'>
        <font>{{auditObj.stateDesc}}</font>
      </div>
    </div>
    <div class="re_fac">
      <span class='rer_span'>转账凭证:　</span>
      <div class='rer_div' style="border-bottom:1px solid #eee"><img :src='auditObj.chargePicPath'></div>
    </div>
    <div class="re_fac">
      <span class='rer_span'>到账凭证:　</span>
      <div class='rer_div'><img :src='auditObj.bingoPicPath'></div>
    </div>

  </div>
  <div class="pA_success" v-else>
    <div class="re_fac">
      <span class='rer_span'>代理商名称:</span>
      <div class='rer_div'>
        <font>{{auditObj.merName}}</font>
      </div>
    </div>
    <div class="re_fac">
      <span class='rer_span'>手机号:　　</span>
      <div class='rer_div'>
        <font>{{auditObj.phone}}</font>
      </div>
    </div>
    <div class="re_fac">
      <span class='rer_span'>充值金额:　</span>
      <div class='rer_div'>
        <font>{{auditObj.chargeMoney}}</font>
      </div>
    </div>
    <div class="re_fac">
      <span class='rer_span'>转账凭证:　</span>
      <div class='rer_div'><img :src='auditObj.chargePicPath'></div>
    </div>
    <div class="re_fac">
      <span class='rer_span'>备注:　　　</span>
      <div class='rer_div'>
        <el-input v-model="auditObj.stateDesc" placeholder="请输入备注信息" class='upload-demo' size='small'></el-input>
      </div>
    </div>

    <div class="re_fac">
      <span class='rer_span'>到账凭证:　</span>
      <div class='rer_div'>
        <el-upload class="upload-demo" ref="upload" action="" :file-list="fileList" :auto-upload="false" list-type="text" :limit='1' :on-exceed='handleExceed' :on-change="handlechange" :on-remove='handleRemove'>
          <el-button slot="trigger" size="small" plain style="width:150px">上传凭证</el-button>
        </el-upload>
        <li>必须为彩色图片大小小于2M，文件格式png，jpeg，jpg或gif</li>
      </div>
    </div>
    <div style="height:40px"></div>

    <el-button type="primary" style='margin:20px 20px 20px 40px;width:150px' @click="Approve">审核通过</el-button>
    <el-button style='margin:20px 20px 20px 40px;width:150px' plain @click="NoApprove">审核不通过</el-button>
  </div>
  <div style="height:30px"></div>
</div>
</template>

<script>
export default {
  data() {
    return {
      auditRes: false,
      // auditFlag:''
      auditObj: {
        merName: "",
        phone: "",
        chargeMoney: "",
        bingoPicPath: "",
        stateDesc: "",
        chargePicPath: "",
        state: ""
      },
      fileList: [],
      file: "",
      chargeId: ""
    };
  },
  methods: {
    _dataInit(){

    },
    Approve() {
      this._handleAudit(1)
    },
    NoApprove() {
      this._handleAudit(2)
    },
    _handlemerEdit(val) {
      this.http.post("/charge/detail", {
          chargeId: val
        })
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.auditObj = {
                merName: res.data.merName,
                phone: res.data.phone,
                chargeMoney: res.data.chargeMoney,
                bingoPicPath: res.data.bingoPicPath,
                stateDesc: res.data.stateDesc || '',
                chargePicPath: res.data.chargePicPath,
                state: res.data.state
              };
              if (res.data.state == 'SUC' || res.data.state == 'FAIL' || res.data.state == 'RECALL') this.auditRes = true;
              console.log(res.data.state, this.auditRes)
            } else {
              this._message(res.msg, "error");
            }
          }
        })
        .catch(error => {});
    },
    _handleAudit(val) {
      this.http.imgpost("/charge/audit", {
          chargeId: this.chargeId,
          type: val,
          desc: this.auditObj.stateDesc,
          bingoPic: this.file
        })
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              this._message('操作成功！', "success");
              this.$router.go(-1)
            } else {
              this._message(res.msg, "error");
            }
          }
        })
        .catch(error => {});
    },
    handleExceed(file) {
      if (file.length) {
        this._message("只允许上传一张照片,请删除后再上传！", "error");
      }
    },
    handleRemove(file) {
      this.file = "";
    },
    handlechange(file, fileList) {
      this.file = file.raw;
    }
  },
  components: {},
  watch: {},
  created() {
    const chargeId = this.$route.query.chargeId || localStorage.agent_chargeId;
    if (chargeId) this._handlemerEdit(chargeId);
    this.chargeId = chargeId;
  },
  mounted() {}
};
</script>

<style lang='less' scoped>
.payAudit {
  padding: 10px !important;
  background-color: #fff;
  text-align: left;
  .re_fac {
    margin-top: 10px;
    min-height: 30px;
    line-height: 30px;
    .rer_span {
      width: 100px;
      margin-left: 40px;
      margin-right: 40px;
      float: left;
    }
    .rer_div {
      margin-left: 180px;
    }
    .upload-demo {
      width: 350px;
    }
    img {
      max-height: 400px;
      max-width: 80%;
    }
  }
  .re_list {
    .rel_text {
      margin-left: 25px;
      border-left: 5px solid #333;
      height: 25px;
      line-height: 25px;
      padding-left: 10px;
    }
    .rel_list {
      margin: 20px 0;
      padding-left: 40px;
    }
  }
}
</style>
