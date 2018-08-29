<template>
<div class='pay_body'>
  <div class="pb_top">
    <goback></goback>
    <div class='pb_t_div'>
      <div class='pbt_l'>账户余额:</div>
      <div class='pbt_r'>
        <li style="color:red"><label @click='toRefresh'><span>{{balance|myfilter}}</span> <i class="el-icon-refresh" :class="{'r_animat':animat}"></i></label></li>
        <li class="pb_t_li f_14px">充值前后有出入，仅供参考</li>
      </div>
    </div>
    <div class='pb_t_div'>
      <div class='pbt_l'>充值金额:</div>
      <div class='pbt_r'>
        <li>
          <el-input v-model="paymoney" placeholder="请输入充值金额" size='small' style="width:200px" type='number'></el-input>
          <span style="color:#777">{{paymoney|moneyFormat}}</span>
        </li>
        <li class="pb_t_li f_14px">请充值整数金额，转账金额应与实际到账一致</li>
      </div>
    </div>
    <div class='pb_t_div'>
      <div class='pbt_l'>转账凭证:</div>
      <div class='pbt_r'>
        <li style="min-height:35px;height:auto;margin-bottom:3px">
          <el-upload class="upload-demo" ref="upload" action="" :file-list="fileList" :auto-upload="false" list-type="text" :limit='1' :on-remove='handleRemove' :on-exceed='handleExceed' :on-change="handlechange">
            <el-button slot="trigger" size="small" plain style="width:150px">上传凭证</el-button>
          </el-upload>
        </li>
        <li class="pb_t_li f_14px">必须为彩色图片大小小于2M，文件格式png，jpeg，jpg或gif</li>
        <li>
          <el-button type="primary" size="small" style="width:150px" @click="_handleCharge">发起充值通知</el-button>
        </li>
        <li class="pb_t_li f_14px">审核确认后充值到账，财务电话 18072996066</li>
      </div>
    </div>
  </div>
  <div class="pb_cot pb_cot_bo">
    <div class='pb_header'>结算账号</div>
    <div class='pb_t_div'>
      <div class='pbt_l'>收款方　　</div>
      <div class='pbt_r'>顾文勇</div>
    </div>
    <div class='pb_t_div'>
      <div class='pbt_l'>收款账户　</div>
      <div class='pbt_r'>6217 0015 4001 8025 245</div>
    </div>
    <div class='pb_t_div'>
      <div class='pbt_l'>收款银行　</div>
      <div class='pbt_r'>建设银行杭州仓基上支行</div>
    </div>
    <div class='pb_t_div'>
      <div class='pbt_l'>转账请备注</div>
      <div class='pbt_r'><span style="color:#333">您的出票后台登录账号后4位</span></div>
    </div>
  </div>

</div>
</template>

<script>
export default {
  data() {
    return {
      balance: 0,
      animat: false,
      chargeFlag: false,
      paymoney: '',
      fileList: [],
      file: '',
      imgSrc: ""
    };
  },
  methods: {
    _dataInit() {
      this.balance = 0
      this.balanceLoading = false
      this.chargeFlag = false
      this.paymoney = ''
      this.fileList = []
      this.file = ''
      this.imgSrc = ""
    },
    toRefresh() {
      if (this.balanceLoading) return
      this.balanceLoading = true;
      this.http.post('/wallet/balance', {}).then(res => {
        if (res.status) {
          if (res.status == 200) {
            this.balance = res.data
          } else {
            this._message(res.msg, "error")
          }
          this.balanceLoading = false;
        }
      }).catch(r => {
        this.balanceLoading = false;
      })
    },
    handleExceed(file) {
      if (file.length) {
        this._message("只允许上传一张照片,请删除后再上传！", "error");
      }
    },
    handleRemove(file) {
      this.file = '';
    },
    handlechange(file, fileList) {
      this.file = file.raw
    },
    handleSuccess(res) {},
    handleError(file) {},
    _handleCharge() {
      if (Number(this.paymoney) <= 0) {
        this._message('充值金额必须大于零！', "error");
        return
      }
      this.chargeFlag = true;
      // console.log(this.paymoney)
      this.http.imgpost('/charge/add', {
        bankAccount: '6217001540018025245',
        bankName: '建设银行杭州仓基上支行',
        chargeMoney: this.paymoney,
        chargePic: this.file,
        merId: '',
        payee: '顾文勇',
      }).then(res => {
        if (res.status) {
          if (res.status == 200) {
            this._message('发起充值通知成功！', "success")
            this.$router.go(-1)
          } else {
            this._message(res.msg, "error")
          }
          this.chargeFlag = false;
        }
      }).catch(r => {
        this.chargeFlag = false;
      })
    }
  },
  components: {},
  watch: {
    paymoney(val, oldval) {
      if (val != oldval) {
        if (val != '') {
          if (val * 1 == NaN || val * 1 <= 0) {
            this.paymoney = 10;
          }
        }
      }
    }
  },
  created() {
    this.toRefresh()
  },
};
</script>

<style lang='less' scoped>
.pay_body {
  // padding: 10px;
  .pb_top {
    background-color: #fff;
    border: 1px solid #ddd;
    overflow: hidden;
    padding: 10px 0 20px 0px;
    .pb_t_div {
      min-height: 60px;
      .pbt_l {
        padding-top: 10px;
      }
    }
    .pb_t_li {
      color: #777;
    }
  }
  .pb_cot {
    background-color: #fff;
    border: 1px solid #ddd;
    margin-top: 20px;
    padding-bottom: 10px;
    .pb_header {
      text-align: left;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      background-color: #ccc;
      margin-bottom: 10px;
    }
    .pb_t_div {
      min-height: 30px;
      line-height: 30px;
    }
  }
  .pb_cot_bo {
    .pb_t_div {
      .pbt_r {
        color: red;
      }
    }
  }
}

.pb_t_div {
  overflow: hidden;
  .pbt_l {
    width: 200px;
    float: left;
  }
  .pbt_r {
    margin-left: 200px;
    text-align: left;
    li {
      height: 35px;
      line-height: 35px;
      label {
        cursor: pointer;
      }
    }
  }
}

.upload-demo {
  width: 350px;
}

.r_animat {
  animation: myanimat 0.8s linear infinite;
}

@keyframes myanimat {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

  

