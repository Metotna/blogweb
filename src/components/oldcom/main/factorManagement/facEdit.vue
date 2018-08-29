<template>
<div class='facEdit'>
  <goback></goback>
  <div class="re_fac" style="margin-top:10px">
    <span class='rer_span'>代理商名称:</span>
    <el-input size='small' v-model="fac.desc" placeholder="请输入代理商名称" class='rer_input' :disabled="!!merId"></el-input>
  </div>
  <div class="re_fac">
    <span class='rer_span'>联系人:　　</span>
    <el-input size='small' v-model="fac.name" placeholder="请输入联系人名称" class='rer_input' :disabled="!!merId"></el-input>
  </div>
  <div class="re_fac">
    <span class='rer_span'>手机号:　　</span>
    <el-input size='small' v-model="fac.phone" placeholder="请输入手机号" :disabled="!!merId" class='rer_input' type='number'></el-input>
  </div>
  <div class="re_fac">
    <span class='rer_span'>账号状态:　</span>
    <el-radio v-model="fac.state" label='ON'>正常</el-radio>
    <el-radio v-model="fac.state" label='OFF'>禁用</el-radio>
  </div>
  <el-button type="primary" style='margin:20px 40px;width:150px' size='small' :loading='saveLoading' @click="_handlemerAdd">保存</el-button>
</div>
</template>

<script>
export default {
  data() {
    return {
      saveLoading: false,
      merId: '',
      fac: {
        desc: "",
        name: "",
        phone: "",
        state: "ON"
      }
    };
  },
  methods: {
    _handlemerEdit(val) {
      this.http.post("/mer/edit", {
          merId: val,
        })
        .then(res => {
          const data = res.data;
          this.fac = {
            desc: data.merName,
            name: data.linkman,
            phone: data.phone,
            state: data.state
          };
        })
        .catch(error => {});
    },
    _handlemerAdd() {
      if (this.saveLoading) return
      this.saveLoading = true;
      this.http.post("/mer/save", {
          merContract: this.fac.name,
          merId: this.merId,
          merName: this.fac.desc,
          phone: this.fac.phone,
          state: this.fac.state,
        })
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.saveLoading = false;
              this._message('操作成功！', "success");
              this.$store.state.agentList=''
              this.$router.go(-1)
            } else {
              this.saveLoading = false;
              this._message(res.msg, "error");
            }
          }
        })
        .catch(error => {
          this.saveLoading = false;
        });
    }
  },
  components: {},
  watch: {},
  created() {
    const merId = this.$route.query.merId || localStorage.agent_merId;
    if (merId) this._handlemerEdit(merId);
    this.merId = merId;
  },
  mounted() {}
};
</script>

<style lang='less' scoped>
.facEdit {
  padding: 10px !important;
  background-color: #fff;
  text-align: left;
  .re_fac {
    margin-top: 10px;
    height: 50px;
    line-height: 50px;
    .rer_span {
      width: 100px;
      margin-left: 40px;
      margin-right: 40px;
    }
    .rer_input {
      width: 300px;
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
