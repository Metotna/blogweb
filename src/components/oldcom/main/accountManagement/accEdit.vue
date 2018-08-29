<template>
<div class='accEdit'>
  <goback></goback>
  <div class='re_list'>
    <div class='rel_text'>账号信息</div>
    <div class="re_acc">
      <span class='rer_span'>联系人　</span>
      <el-input v-model="accname" placeholder="请输入账户联系人" class='rer_input'></el-input>
    </div>
    <div class="re_acc">
      <span class='rer_span'>手机号码</span>
      <el-input v-model="accphone" placeholder="请输入账户手机号码" class='rer_input' :disabled="!!usr"></el-input>
    </div>
    <div class="re_acc" v-if="!usr">
      <span class='rer_span'>初始密码</span>
      <el-input v-model="accpwd" placeholder="请输入密码" class='rer_input' type='text'></el-input>
    </div>
    <div class="re_acc">
      <span class='rer_span'>角色　　</span>
      <!-- <el-radio v-model="accstate" label='1'>代理商</el-radio> -->
      <el-radio v-model="accstate" label='4'>管理员</el-radio>
      <el-radio v-model="accstate" label='2'>财务</el-radio>
      <el-radio v-model="accstate" label='3'>运营</el-radio>
      <el-radio v-model="accstate" label='5'>出票员</el-radio>
    </div>
  </div>
  <div class='re_list'>
    <div class='rel_text'>权限设置（请勾选该角色可以操作的模块）</div>
    <div class='rel_list'>
      <el-checkbox-group v-model="accAry">
        <el-checkbox v-for="(x,index) in acclist" :label="x.id" :key="x.id" class="el_check">{{x.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-button type="primary" style='margin:20px 40px;width:150px' @click="_handleInfoSave" :loading="saveLoading">保存</el-button>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      accname: "",
      accphone: '',
      accpwd: '',
      accstate: '',
      acclist: this._date._BASIC.resList,
      accAry: [],
      saveLoading: false,
      accstateFalg: false,
    };
  },
  methods: {
    _dataInit() {
      this.accname = ""
      this.accphone = ''
      this.accpwd = ''
      this.accstate = ''
      this.acclist = this._date._BASIC.resList
      this.accAry = []
      this.saveLoading = false
      this.accstateFalg = false
      this.usr = ''
    },
    _handleInfo(val) {
      this.http.post("/account/edit", {
        usrId: val
      }).then(res => {
        if (res.status) {
          if (res.status == 200) {
            this.saveLoading = false;
            this.accstateFalg = true
            this.accstate = res.data.roleId + '';
            this.accname = res.data.linkman;
            this.accphone = res.data.account;
            this.accstateFalg = false
            this.accAry = res.data.resourceIds;
          } else {
            this.saveLoading = false;
            this._message(res.msg, "error");
          }
        }
      }).catch(error => {
        this.saveLoading = false;
      })
    },
    _handleInfoSave() {
      if (this.saveLoading) return
      this.saveLoading = true;
      this.http.post("/account/save", {
        linkman: this.accname,
        password: this.accpwd,
        phone: this.accphone,
        resources: this.accAry.join(','),
        roleId: this.accstate,
        usrId: this.usr,
      }).then(res => {
        if (res.status) {
          if (res.status == 200) {
            if (this.usr) {
              this._message('账号修改成功！', "success");
            } else {
              this._message('账号创建成功,新账号请使用手机号码登陆！', "success");
            }
            this.$router.go(-1)
          } else {
            this._message(res.msg, "error");
          }
          this.saveLoading = false;
        }
      }).catch(error => {
        this.saveLoading = false;
      });
    }
  },
  components: {},
  watch: {
    accstate(val, oldval) {
      if (val != oldval && oldval != '') {
        if (val == 1) {
          this.accAry = [1, 2, 3, 4, 5, 6]
        } else if (val == 2) {
          this.accAry = [1, 3, 4, 5]
        } else if (val == 3) {
          this.accAry = [1, 3, 4, 5]
        } else if (val == 4) {
          this.accAry = [1, 2, 3, 4, 5, 6, 7, 8,9]
        } else if (val == 5) {
          this.accAry = [7, 8]
        }
      }
    }
  },
  created() {
    const usr = this.$route.query.usr || '';
    if (usr) this._handleInfo(usr)
    else {
      this.accpwd = '123456';
      this.accstate = '2'
      this.accAry = [1, 3, 4, 5]
    }
    this.usr = usr;
  },
  mounted() {}
};
</script>

<style lang='less' scoped>
.accEdit {
  padding: 10px !important;
  background-color: #fff;
  text-align: left;
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
      width: 850px;
        overflow: hidden;

      .el_check{
        float: left;
        overflow: hidden;
        margin: 5px 10px 10px 0;
        min-width: 100px;
      }
    }
    .re_acc {
      margin: 10px 0;
      height: 40px;
      line-height: 40px;
      .rer_span {
        width: 100px;
        margin-left: 40px;
        margin-right: 40px;
      }
      .rer_input {
        width: 300px;
      }
    }
  }
}
</style>
