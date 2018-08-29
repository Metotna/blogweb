<template>
<div class='ticdetial'>
  <goback></goback>
  <div class="tic_public">
    <div class="tp_jc tp_">
      <div class="_overview _cot">
        <div class="_title">基本信息</div>
        <div class="_title_infor _t_15px">
          <div class="_t_i_">　　彩种：{{infor.lotId|lottery}}</div>
          <!-- <div class="_t_i_">单号：{{infor.orderNo}}</div> -->
          <div class="_t_i_">平台单号：{{infor.ticketId}}</div>
          <div class="_t_i_">　代理商：{{infor.merId|merinfor($store.state.merchantList,'merId','merName')}}</div>

          <div class="_t_i_">申请时间：{{infor.applyTime}}</div>
          <div class="_t_i_">出票时间：{{infor.handleTime}}</div>
          <div class="_t_i_">　出票人：{{infor.ticketMan}}</div>

          <!-- <div class="_t_i_">　　注数：{{infor.bet/2/infor.multi}}</div> -->
          <div class="_t_i_">订单状态：{{infor.ticketStatus|work_status2}}</div>
        </div>
      </div>
      <div class="_detial _cot">
        <div class="_title">投注内容</div>
        <div class="_title_infor">
          <!-- <li class="listcont">
            <span>期次:</span>
            <font v-for="(x,index) in infor.lotIssue.split(',')" :key='index'>{{x}}</font>
          </li> -->
          <li class="listcont">
            <span>玩法:</span>
            <font>{{infor.contentApply|work_order_play}}</font>
          </li>

          <li class="listcont">
            <span>投注金额:</span>
            <font>{{infor.bet}}</font>
          </li>
          <li class="listcont">
            <span>　　倍数:</span>
            <font>{{infor.multi}}</font>
          </li>
          <li class="listcont">
            <span>中奖金额：:</span>
            <font v-if="infor.bonus==null">--</font>
            <font v-else>{{infor.bonus}}</font>
          </li>
          <li class="listcont"><span>投注详情:</span>
            <font v-for='(x,index) in infor.contents' :key="index">
              {{x[0]}}|{{x[3]|work_play}}={{x[1]|work_content(x[2],x[3])}}
            </font>
          </li>
          <!-- <div class="_t_cot">选择玩法：{{context|order_play_type}}</div>
              <label v-for="(x,index) in asCot" :key="index">
                  <div class="_t_cot">{{x[0Î]}}　{{x[1]}}</div>
                </label> -->
          <!-- <div style="padding:5px 0;word-wrap:break-word;line-height:1.3">必赢：<br>{{contextTicket}}</div>
          <div style="padding:5px 0;word-wrap:break-word;line-height:1.3">平台：<br>{{contextApply}}</div> -->
        </div>
      </div>
    </div>
    <div class="tp_ssc tp_"></div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      saveLoading: false,
      orderID: "",
      infor: {},
      contentTicket: "",
      contentApply: "",
      asCot: ""
    };
  },
  methods: {
    _handlemerEdit(val) {
      this.http.post("/bingoticket/detail", {
          ticketId: val
        })
        .then(res => {
          if (res.status) {
            if (res.status == 200) {
              const data = res.data;
              this.infor = data;
              this.contentTicket = data.contentTicket;
              this.contentApply = data.contentApply;
              this.infor.contents = this.handleAys(data.contentApply, data.lotId);
            } else {
              this._message(res.msg, "error");
            }
          }
        })
        .catch(error => {});
    },
    handleAys(val, type) {
      const f = this.order();
      var temp_a = f.detailsZ(val, type);
      return temp_a
      // this.asCot = temp_a;
    }
  },
  watch: {},
  created() {
    const orderID = this.$route.query.orderID || localStorage.agent_orderID;
    if (orderID) this._handlemerEdit(orderID);
    this.orderID = orderID;
  },
  mounted() {}
};
</script>

<style lang='less' scoped>
.ticdetial {
  padding: 10px !important;
  background-color: #fff;
  text-align: left;
  .tp_ {
    padding: 10px;
    padding-top: 0px;
    ._cot {
      border: 1px solid #ddd;
      ._title {
        padding: 5px 10px;
        line-height: 30px;
        border-bottom: 1px solid #ddd;
        background-color: #dddddd;
      }
      ._t_15px {
        font-size: 15px;
      }
      ._title_infor {
        overflow: hidden;
        padding: 10px 20px;
        ._t_i_ {
          float: left;
          width: 30%;
          min-width: 300px;
          line-height: 30px;
        }
        ._t_cot {
          line-height: 30px;
        }
      }
    }
    ._detial {
      margin-top: 20px;
      border: 1px solid #ddd;
      .listcont {
        line-height: 30px;
        span {
          text-align: right;
          display: block;
          float: left;
          width: 100px;
        }
        font {
          display: block;
          margin-left: 130px
        }
      }
    }
  }
}
</style>
