<template>
<div class='unticket'>
  <div class="header" id='unticket_header'>
    <li><span class='hea_span'>当前商户:</span>
      <font class="hea_font"> {{comid|merinfor(comOptions)}}</font>
    </li>
    <li><span class='hea_span'>待出票:</span>
      <font class="hea_font">￥{{info.dcpMoney|work_number}}/{{info.dcpCount}} 份
        <i class="el-icon-info" v-popover:popover></i>
      </font>
    </li>
    <li><span class='hea_span'>已出票:</span>
      <font class="hea_font">￥{{info.cpeMoney|work_number}}/{{info.cpeCount}} 份</font>
    </li>
    <li><span class='hea_span'>日期:</span>
      <font class="hea_font"> {{info.date|work_slice(0,10)}}</font>
    </li>
  </div>
  <hr>
  <div class="workbench" id='unticket_workbench' :class="{'workbench_hidden':show}">
    <div class="start" v-if='!start'>
      <el-carousel height='48px' :autoplay='false' :indicator-position="'none'" :initial-index='elcarNumber'>
        <el-carousel-item>
          <span>商户：</span>
          <el-select v-model="comid" clearable placeholder="请选择商户" class="start_sel" style="width:150px" :loading="slelectLoading">
            <el-option v-for="item in comOptions" :key="item.merId" :label="item.merName" :value="item.merId">
            </el-option>
          </el-select>
          <span>机器号：</span>
          <el-select v-model="machineId" clearable placeholder="请选择机器号" class="start_sel" :loading="slelectLoading">
            <el-option v-for="item in machineList" :key="item.mSN" :label="_hanldeSelectLabel(item)" :value="item.mSN">
            </el-option>
          </el-select>
          <el-button type="primary" @click="handleStart" class="start_btn">点击开始</el-button>
        </el-carousel-item>
        <el-carousel-item>
          <span>商户：</span>
          <el-select v-model="comid2" clearable placeholder="请选择商户" class="start_sel" style="width:150px" :loading="slelectLoading">
            <el-option v-for="item in comOptions" :key="item.merId" :label="item.merName" :value="item.merId">
            </el-option>
          </el-select>
          <span>机器号：</span>
          <el-select v-model="machineId2" clearable placeholder="请选择机器号" class="start_sel" :loading="slelectLoading">
            <el-option v-for="item in machineList" :key="item.mSN" :label="_hanldeSelectLabel(item)" :value="item.mSN">
            </el-option>
          </el-select>
          <el-input v-model="comOrdid" placeholder="请输入订单号" class="start_sel start_width"></el-input>
          <el-button type="primary" @click="_PostSearch" class="start_btn2" icon='el-icon-search'>搜索</el-button>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="ing_btn" v-if="start&& work==''">
      <el-button type="warning" @click='handleOver'>退出工作台</el-button>
    </div>
    <div class="ing expand" v-if='start' v-loading="loading" element-loading-text="坐等大佬下单..." :class="{'workbgc':!workbarbgc}">
      <div class='expand_div workbench_ul'>
        <ul class="ul_left">
          <li><span>彩种：</span>
            <font>{{work.lotteryid|lottery}}</font>
          </li>
          <li><span>期次：</span>
            <font v-for="(x,index) in work.pidary" :key='index'>{{x+index}}</font>
          </li>
          <li><span>预期奖金：</span>
            <font>{{work.bonus}}</font>
          </li>
          <li><span>商户：</span>
            <font>{{work.merId|merinfor(comOptions)}}</font>
          </li>
          <li><span>订单编号：</span>
            <font>{{work.orderid}}</font>
          </li>
        </ul>
        <ul class="ul_right">
          <li class='sp_li'><span>投注截止：</span>
            <font>{{work.astime}}</font>
          </li>
          <li class='sp_li'><span>投注金额：</span>
            <font style="color: rgb(0, 130, 132);">{{work.betmoney}}</font>
          </li>

          <li class='sp_li'><span>玩法：</span>
            <font>{{work.context|work_order_play}}</font>
          </li>

          <li class='sp_li'><span>投注内容：</span>
            <font v-for='(x,index) in work.list' :key="index">
              {{x[0]|work_slice(8,12)}}|{{x[3]|work_play}}={{x[1]|work_content(x[2],x[3])}}
            </font>
          </li>
          <li class='sp_li'><span>投注倍数：</span>
            <font v-for='(x,index) in work.items' :key="index">
              <i style="color:red">{{x.multiple}}倍</i><i>*</i><i>{{x.count}}张</i><i>（单张投注额{{x.money}}元）</i>
            </font>
          </li>
        </ul>
      </div>
      <hr>
      <div class="btn">
        <el-button plain type="danger" style="float:left" @click='handleDialogShow(noText,3)' id='tempBtn'>暂不出票</el-button>
        <el-button plain type="primary" style="float:right" @click='handleDialogShow(suText,1)' id='succBtn' ref='succBtn'>出票成功（ Enter ）</el-button>
        <el-button plain type="warning" style="float:left" @click='handleDialogShow(deText,2)' id='loseBtn'>无法出票</el-button>
      </div>

    </div>
    <div class="opr_" v-if='start'>
      <div class="opr_h" :class="{'active':showFlag}"></div>
      <div class="opr_text" @click='showMethod' style="cursor:pointer">
        {{showText}}
      </div>
    </div>
  </div>

  <div class="historylist">
    <div class="his_opr">
      <el-radio-group v-model="hisStatus" size='small' style='float:left'>
        <el-radio-button label="1">近日出票</el-radio-button>
        <el-radio-button label="2">待出票详情</el-radio-button>
      </el-radio-group>
      <el-button type="info" size='small' style='float:right' v-if='hisStatus==2' icon="el-icon-refresh" @click='historylistRefresh'>刷新数据</el-button>
    </div>
    <div class="hisdiv">
      <el-table :data="tableDate" border style="width: 100%" class='index_table_tic' v-loading="tableLoading" header-row-class-name='ah_table_lead_d2d4d8' stripe :row-key='handleRowkey' :expand-row-keys='expandArray' @expand-change='handleExpand' :max-height='cHeight'>
        <el-table-column type="expand" fixed>
          <div slot-scope="props" class="expand expand_bgc">
            <div class="expand_div" v-if='hisStatus==1'>
              <ul class="ul_left">
                <li><span>彩种：</span>
                  <font>{{props.row.lotteryid|lottery}}</font>
                </li>
                <li><span>期次：</span>
                  <font v-for="(x,index) in props.row.pidary" :key='index'>{{x+index}}</font>
                </li>
                <li><span>预期奖金：</span>
                  <font>{{props.row.bonus}}</font>
                </li>
                <li><span>商户：</span>
                  <font>{{props.row.merId|merinfor(comOptions)}}</font>
                </li>
                <li><span>订单编号：</span>
                  <font>{{props.row.orderid}}</font>
                </li>
              </ul>
              <ul class="ul_right">
                <li class='sp_li'><span>投注截止：</span>
                  <font>{{props.row.astime}}</font>
                </li>
                <li class='sp_li'><span>投注金额：</span>
                  <font style="color: rgb(0, 130, 132);">{{props.row.betmoney}}</font>
                </li>
                <li class='sp_li'><span>玩法：</span>
                  <font>{{props.row.context|work_order_play}}</font>
                </li>
                <li class='sp_li'><span>投注内容：</span>
                  <font v-for='(x,index) in props.row.list' :key="index">
                    {{x[0]|work_slice(8,12)}}|{{x[3]|work_play}}={{x[1]|work_content(x[2],x[3])}}
                  </font>
                </li>
                <li class='sp_li'><span>投注倍数：</span>
                  <font v-for='(x,index) in props.row.items' :key="index">
                    <i style="color:red">{{x.multiple}}倍</i><i>*</i><i>{{x.count}}张</i><i>（单张投注额{{x.money}}元）</i>
                  </font>
                </li>
              </ul>
            </div>
            <div class="expand_div" v-if='hisStatus==2'>
              <ul class='ul_left'>
                <li><span>彩种：</span>
                  <font>{{props.row.lotteryid|lottery}}</font>
                </li>
                <li><span>期次：</span>
                  <font v-for="(x,index) in props.row.pid.split(',')" :key='index'>{{x}}</font>
                </li>
                <li><span>投注金额：</span>
                  <font>{{props.row.betmoney}}</font>
                </li>
                <li><span>商户：</span>
                  <font>{{props.row.merId|merinfor(comOptions)}}</font>
                </li>
                <li><span>订单编号：</span>
                  <font>{{props.row.orderid}}</font>
                </li>
              </ul>
              <ul class='ul_right sp_li'>
                <li><span>投注截止：</span>
                  <font>{{props.row.astime}}</font>
                </li>
                <li><span>出票时间：</span>
                  <font>{{props.row.outtime}}</font>
                </li>
                <li><span>预期奖金：</span>
                  <font>{{props.row.bonus}}</font>
                </li>
                <li><span>玩法：</span>
                  <font>{{props.row.context|work_order_play}}</font>
                </li>
                <li class='span_red'><span>投注倍数：</span>
                  <font>{{props.row.multiple}}</font>
                </li>
                <li><span>投注内容：</span>
                  <font v-for='(x,index) in props.row.list' :key="index">
                    {{x[0]|work_slice(8,12)}}|{{x[3]|work_play}}={{x[1]|work_content(x[2],x[3])}}
                  </font>
                </li>
              </ul>
            </div>
          </div>
        </el-table-column>
        <!-- <el-table-column type='index' label="序号" width="40"></el-table-column> -->
        <el-table-column prop="orderid" label="订单编号" min-width="180" align='left' show-overflow-tooltip></el-table-column>
        <el-table-column prop="merId" label="商户" min-width="80" show-overflow-tooltip>
          <div slot-scope="scope">{{scope.row.merId|merinfor(comOptions)}}</div>
        </el-table-column>
        <el-table-column prop="lotteryid" label="彩种" min-width="100">
          <div slot-scope="scope">
            {{scope.row.lotteryid|lottery}}
          </div>
        </el-table-column>
        <el-table-column prop="betmoney" label="投注额" min-width="80" align='right'></el-table-column>
        <el-table-column prop="bonus" label="预期奖金" min-width="80" align='right'></el-table-column>

        <el-table-column prop="context" label="玩法" min-width="130">
          <div slot-scope="scope">
            {{scope.row.context|work_order_play}}
          </div>
        </el-table-column>
        <el-table-column prop="outtime" label="出票时间" min-width="165"></el-table-column>
        <el-table-column prop="outstate" label="状态" min-width="60" v-if='hisStatus==1'>
          <div slot-scope="scope">
            {{scope.row.outstate|work_status}}
          </div>
        </el-table-column>


        <el-table-column prop="machineSn" label='机器编号' min-width="120" v-if='hisStatus==1'>
          <div slot-scope="scope">{{scope.row.machineSn|merinfor($store.state.machineList,'mSN','mName')}}</div>
        </el-table-column>
        <el-table-column prop="outtic" label="出票人" min-width="120" v-if='hisStatus==1'></el-table-column>
      </el-table>
      <pagePilots :pcount='pageCount' :psize='pageSize' :pnums='pageNumber' @sizeChange='sizeChange' @numChange='numChange'></pagePilots>
    </div>
  </div>

  <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :append-to-body='true' :before-close='handleDialogClose' :close-on-click-modal='false'>
    <span>{{dialogshowText}}</span>
    <div v-if="(dialogStatus==2 || dialogStatus ==3 )">
      <span>请在下方输入框输入 <font style="color:red;font-size:20px;font-weight:bold"> y </font> (不区分大小写)</span>
      <input type="text" autocomplete="off" placeholder="请输入内容" v-model.trim="defeadInputValue" id="defeadInput" class="el-input__inner" autofocus ref='defInput'>
    </div>
    <span slot="footer" class="dialog-footer" v-if='dialogExit'>
      <el-button plain @click="handleDialogClose" style="float:left">取 消</el-button>
      <el-button plain @click="handleDiaBtnExit" type="primary" v-if='!comOrdidSearch' >确定且退出</el-button>
      <el-button plain @click="handleDiaBtnExit2" type="primary" v-if='comOrdidSearch'>确定且退出</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-else>
      <el-button plain @click="handleDialogClose" style="float:left">取 消</el-button>
      <el-button plain @click="handleDiaBtnExit" style="float:left" type="info" v-if='!comOrdidSearch ' >确定且退出</el-button>
      <el-button  @click="handleDiaBtnNext" type="primary" v-if='!comOrdidSearch'>确定并跳转下一条 ( Enter )</el-button>
      <el-button plain @click="handleDiaBtnExit2" type="primary" v-if='comOrdidSearch' >确定且退出</el-button></label>
    </label>
    </span>
  </el-dialog>

  <el-dialog title="警告" :visible.sync="dialogVisible2" width="600px" :before-close="handleDialog2Close" :append-to-body='true' :close-on-click-modal='false'>
    <span style="font-size:18px;font-weight:bold">两次出票操作间隔过短，请检查当前票务是否已出！</span>
    <span slot="footer" class="dialog-footer"><el-button type="primary" @click="handleDialog2Close">确 定</el-button></span>
  </el-dialog>

  <el-popover ref="popover" placement="bottom-start" title="今日待出票详情" trigger="hover" class='popover'>
    <ul class="pop_ul">
      <li v-for='y in info.dcps'>
        <!-- {{info.dcps}} -->
        <span>{{y.time}}截止</span>
        <font>￥{{y.dcpMoney}}/{{y.dcpCount}} 份</font>
      </li>

    </ul>
  </el-popover>
</div>
</template>

<script>
export default {
  name: 'UNTICKET',
  props: {
    ticfalg: {
      type: null,
      default: 1,
    },
  },
  data() {
    return {

      noText: '确认不出票？',
      deText: '确认无法出票？',
      suText: '确定是否已经成功出票',
      exText: '是否退出工作台，退出后当前事务将回滚。',
      handleRowkey: function(row) {
        return row.orderid
      },
      expandArrayLenght: 3,
      expandArray: [],

      showText: '收起',
      showFlag: false,
      workbarbgc: false,
      hisStatus: 1,
      start: false,
      comid: '',
      comid2: '',
      comOptions: this.$store.state.agentList,
      comOrdid: '',
      machineId: '',
      machineId2: '',
      machineList: this.$store.state.machineList,
      slelectLoading: false,
      slelectLoading2: false,
      comOrdidSearch: false,
      /** search condition */
      defeadInputFlag: true,
      defeadInputValue: '',
      succFocus: false,
      succNextFocus: false,


      elcarNumber: 0,
      /** el-carousel (index)*/

      loading: false,
      dialogshowText: '',
      dialogVisible: false,
      dialogStatus: '',
      dialogOrder: '',
      dialogExit: false,

      pageKey: false,
      cHeight: '1',
      info: "",
      work: '',
      ycplist: [],
      dcplist: [],

      pageCount: 0,
      pageSize: 200,
      pageNumber: 1,
      tableLoading: false,
      tableDate: [],
      dataParse: 0,

      dialogVisible2: false,
    }
  },
  methods: {
    _hanldeSelectLabel(o) {
      return `[${o.mName}]${o.mSN}`
    },
    // handleComOrdid() {
    //   this.comOrdidFlag = !this.comOrdidFlag;
    // },
    /* pagepilost 系列 --开始*/
    _pagePilotsInit(a, b) {
      this.expandArray = [];
      this.pageCount = 0
      this.pageSize = a ? this.pageSize : 200
      this.pageNumber = 1;
    },
    numChange(val) {
      const a = this.pageNumber;
      if (this.start) {
        this.$message.error('请先退出工作台,再查看数据!')
        const b = this.pageCount;
        this.pageCount = 0;
        setTimeout(() => {
          this.pageCount = b;
          this.pageNumber = a;
        })
      } else {
        this.pageNumber = val;
        this._Postlist()
      }
    },
    sizeChange(val) {
      const a = this.pageSize;
      if (this.start) {
        this.$message.error('请先退出工作台,再查看数据!')
        const b = this.pageCount;
        this.pageCount = 0;
        setTimeout(() => {
          this.pageCount = b;
          this.pageSize = a;
        })
      } else {
        this.pageSize = val;
        this._Postlist()
      }
    },
    /* pagepilost 系列 --结束*/
    // historylist Refresh
    historylistRefresh() {
      this._pagePilotsInit(1)
      this._Postlist()
    },
    // table 展开
    handleExpand(val, row) {
      const vol = this.expandArrayLenght;
      const ary = this.expandArray
      if (ary.length == 0) {
        this.expandArray.push(val.orderid)
        return
      }
      const res = ary.findIndex(x => x == val.orderid)
      if (res > -1) {
        this.expandArray.splice(res, 1)
      } else {
        ary.push(val.orderid)
        if (ary.length > vol) {
          this.expandArray = ary.slice(ary.length - vol, ary.length)
        }
      }
    },
    handleStart() {
      if (this.comid == '' || this.machineId == '') {
        this._message('商户或机器号不能为空！', 'error')
        return
      }
      this.comOrdidSearch = false;
      this.elcarNumber = 0;
      this.start = true;
      this.loading = true;
      this._PostWorkbar(true);
      this.historylistRefresh()
    },
    handleEXit() {
      this.start = false;
    },
    // 展开 && 收起
    showMethod() {
      this.showFlag = !this.showFlag;
      this.showText = this.showFlag ? "展开" : "收起";
      this.__cHeight()
    },
    handleOver() {
      this.start = false;
      this.showFlag = false;
      this.comOrdidSearch = false;
      clearInterval(this.INT)
    },
    /* Dialog-2 */
    handleDialog2Close() {
      this.dialogVisible2 = false;
      this.pageKey = false;
      if (this.setTimeout2) {
        clearInterval(this.setTimeout2)
      }
    },
    //  Dialog 系列
    handleDialogShow(done, type, falg) {
      document.activeElement.blur(); // 使聚焦元素失焦
      if (this.dialogVisible) return // 当前 model 打开状态
      this.defeadInputValue = '';
      const tt = 3000 - (Date.parse(new Date()) - this.dataParse) //与3s 的时间差
      if (tt > 0) {
        this.pageKey = true //是否 支持键盘 监听
        this.dialogVisible2 = true;
        this.setTimeout2 = setTimeout(() => {
          if (this.dialogVisible2) {
            this.dialogVisible2 = false;
            this.pageKey = false;
          }
        }, tt) // 弹出框延时关闭
        return
      }

      this.dialogExit = falg ? true : false;
      this.dialogVisible = true;
      this.dialogStatus = type;
      this.dialogshowText = done;
      this.succFocus = false;
      this.succNextFocus = true;
      setTimeout(() => {
        try {
          this.$refs.defInput.focus()
        } catch (error) {}
      })
    },
    handleDialogClose() {
      this.dialogStatus = '';
      this.dialogVisible = false;
    },
    handleDiaBtnExit() {
      if (this.dialogStatus != 1) {
        if (!(this.defeadInputValue == 'Y' || this.defeadInputValue == 'y')) {
          this._message('输入内容有误请重新输入', 'error')
          return
        }
      }
      this._PostdoTicket()
      this.handleDialogClose()
      this.start = false;
    },
    handleDiaBtnExit2() {
      this._PostdoTicket(5, 2)
      this.handleDialogClose()
      this.start = false;
    },
    handleDiaBtnNext() {
      if (this.dialogStatus != 1) {
        if (!(this.defeadInputValue == 'Y' || this.defeadInputValue == 'y')) {
          this._message('输入内容有误请重新输入', 'error')
          return
        }
      }
      this._PostdoTicket(1)
      this.handleDialogClose()
    },
    // 竞彩解析
    handleAys(val, type) {
      const f = this.order();
      var temp_a = f.detailsZ(val, type);
      return temp_a
    },
        // 竞彩解析
    handleAys2(val, type) {
      const f = this.order();
      var temp_a = f.dataAnalytic(val, type);
      // return temp_a
    },
    // cheight
    __cHeight() {
      setTimeout(() => {
        var a = document.getElementById('unticket_workbench').clientHeight;
        const h = this.$store.state.cHeigt - 230 - a
        this.cHeight = h < 100 ? 100 : h;
      }, 100)
    },
    // 搜索 
    _PostSearch() {
      if (this.machineId2 || this.comid2)
        this.loading = true;
      this.work = '';
      this.http.post("/piquet/findOrder", {
        merId: this.comid2,
        orderId: this.comOrdid,
        machineSn: this.machineId2,
        isReal: true,
      }).then(res => {
        if (res.status) {
          if (res.status == 200) {
            this.start = true;
            this.comOrdidSearch = true;
            this.elcarNumber = 1;

            this.work = res.data;
            this.work.pidary = this.work.pid.split(',')
            this.work.list = this.handleAys(this.work.context, this.work.lotteryid)
            setTimeout(() => {
              this.loading = false
            }, 50)
          } else {
            this.loading = false
            this._message(res.msg, "error");
          }
        }
      });
    },
    // 基本信息
    _PostInfo(a) {
      this.http.post("/piquet/baseInfo", {
        merId: this.comid,
      }).then(res => {
        if (res.status) {
          if (res.status == 200) {
            this.info = res.data;
            if (!a) this._Postlist()
          } else {
            if (!a) this._message(res.msg, "error");
          }
        }
      });
    },
    // 工作条
    _PostWorkbar(a) {
      this.loading = true;
      this.work = '';
      this.http.post("/piquet/workbar", {
        merId: this.comid,
      }).then(res => {
        if (res.status) {
          if (res.status == 200) {
            this.succFocus = true;

            this.workbarbgc = !this.workbarbgc;
            this.work = res.data;
            this.work.pidary = this.work.pid.split(',')
            this.work.list = this.handleAys(this.work.context, this.work.lotteryid)
            setTimeout(() => {

              this.loading = false
              // console.log(this.$refs.succBtn)
              // this.$refs.succBtn.focus()

            }, 50)
          } else {
            // this._message(res.msg, "error");
            this.loading = true;
            if (a) this._PostWork()
          }
        }
      }).catch(e => {
        setTimeout(() => {
          this.handleOver()
        }, 3000)
      })
    },
    // 工作条 - 轮询 
    _PostWork() {
      this.INT = setInterval(() => {
        if (!this.loading) {
          clearInterval(this.INT)
          return
        } else {
          this._PostWorkbar()
        }
      }, 1000 * 5)
    },
    // 今日已出 && 待出票
    _Postlist() {
      let url = this.hisStatus == 1 ? '' : "/piquet/dcplist";
      if (url) {
        this.tableLoading = true;
        this.http.post(url, {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        }).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.tableDate = res.data.entitys;
              this.tableDate.map(x =>{ x.list = this.handleAys(x.context, x.lotteryid)
              this.handleAys2(x.context, x.lotteryid)
              })

              this.pageNumber = res.data.pageNumber
              this.pageSize = res.data.pageSize
              this.pageCount = res.data.totalCount
            } else {
              this._message(res.msg, "error");
            }
          }
          setTimeout(() => this.tableLoading = false, 200)
        }).catch(error => {
          this.tableLoading = false;
        })
      } else {
        this.tableDate = this.$store.state.worklistary;
        this.tableLoading = false;
      }
    },
    // 出票操作
    _PostdoTicket(m, n) {
      this.dataParse = Date.parse(new Date())
      // console.log(this.dataParse)
      const t = this.dialogStatus
      this.loading = true;
      var obj = {
        ticketId: this.work.orderid,
        type: this.dialogStatus,
        machineSn: this.machineId,
      }
      if (this.elcarNumber == 1) {
        obj.machineSn = this.machineId2;
        obj.isReal = true;
      }
      this.http.post("/piquet/doTicket", obj).then(res => {
        if (res.status) {
          if (res.status == 200) {
            this.work.outtime = new Date().format('yyyy-MM-dd hh:mm:ss')
            this.work.outtic = this.$store.state.userInfo.userName
            this.work.machineSn = this.elcarNumber ? this.machineId2 : this.machineId;
            if (t == 2) this.work.outstate = 'CLOSE_ERR';
            if (t == 1) this.work.outstate = "CLOSE"

            if (t != 3) {
              const obj = JSON.parse(JSON.stringify(this.work))
              this.$store.state.worklistary.splice(0, 0, this.work);
              this.$store.state.worklistary = this.$store.state.worklistary.splice(0, 100)

              if (this.hisStatus == 1) {
                this.tableDate = this.$store.state.worklistary;
              }
              localStorage.setItem("work_list", JSON.stringify(this.$store.state.worklistary));
            }
            if (m == 1) {
              this._message('操作已成功，正在请求下一条', "success");
              this.loading = true;
              if (!n) this._PostWorkbar(true)
            } else {
              this._message('操作已成功！', "success");
            }
          } else {
            this._message(res.msg, "error");

          }
        }
      });
    },
    //代理商列表
    _hanldeAgentList() {
      let l = this.$store.state.agentList;
      if (l.length > 0) return;
      this.slelectLoading = true;
      this.http.post("/user/mer/simpleList", {}).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.slelectLoading = false;
              this.$store.state.agentList = [];
              this.$store.state.agentList = res.data;
              this.comOptions = res.data;
            }
          }
        })
        .catch(error => {
          this.slelectLoading = false;
        });
    },
    //机器列表
    _hanldeMachineList() {
      let l = this.$store.state.machineList;
      if (l.length > 0) return;
      this.slelectLoading2 = true;
      this.http.post("/user/machine/list", {}).then(res => {
          if (res.status) {
            if (res.status == 200) {
              this.slelectLoading2 = false;
              this.$store.state.machineList = [];
              this.$store.state.machineList = res.data;
              this.machineList = res.data;
            }
          }
        })
        .catch(error => {
          this.slelectLoading2 = false;
        });
    }
  },
  computed: {
    rule() {
      return this.store.rule
    },
    show() {
      return this.showFlag && this.start
    },
  },
  components: {},
  watch: {
    hisStatus(val, oldval) {
      if (val != oldval) {
        this.tableLoading = true;
        this.historylistRefresh()
      }
    },
    start(val, oldval) {
      if (val != oldval) {
        this.__cHeight()
      }
    },
    comid(val, oldval) {
      if (val != oldval) {
        this._PostInfo(1)
      }
    }
  },
  created() {
    // this._PostInfo()
    this._hanldeAgentList();
    this._hanldeMachineList();

  },
  mounted() {
    this.__cHeight()
    document.onkeydown = (event) => {
      // return
      const c = event.keyCode
      // console.log(1111)
      if (this.pageKey || c != 13) return
      if (this.start && c == 13) {
        if (this.dialogVisible) {
          // console.log(2222)
          if (this.comOrdidSearch) {
            this.handleDiaBtnExit2()
          } else {
            this.handleDiaBtnNext()
          }
          // if(document.activeElement.id=='succBtn') 
        } else if (!this.loading) {
          //  console.log(33333)
          if (this.dialogVisible) return
          if (document.activeElement.id == 'succBtn') return
          if (document.activeElement.id == 'tempBtn') return
          if (document.activeElement.id == 'loseBtn') return
          this.handleDialogShow(this.suText, 1)
          // if(document.activeElement.id=='succBtn') 
        }
      }
      event.preventDefault()
    }

    this.pageKey = false;
    this._PostInfo()
    this.INT2 = setInterval(() => {
      this._PostInfo(1)
    }, 1000 * 15)
  },
  beforeDestroy() {
    clearInterval(this.INT)
    this.start = false;
    clearInterval(this.INT2)
    this.pageKey = true;
  },
  beforeRouteLeave(to, from, next) {
    if (this.start) {
      this.$alert('当前正在工作中，请先退出工作台再进行其他操作！', '警告', {
        confirmButtonText: '确定',
        callback: action => {
          next(false)
        }
      });
    } else {
      next()
    }
  }
}
</script>

<style lang='less' scoped>
.unticket {
  .header {
    // padding-left:150px;
    li {
      display: inline-block;
      margin-left: 10px;
      .hea_span,
      .hea_font {
        display: block;
        float: left;
        overflow: hidden;
        min-width: 100px;
        height: 32px;
        line-height: 32px;
        font-size: 16px;
      }
      .hea_span {
        min-width: 60px;
        text-align: right;
        padding-right: 10px;
      }
      .hea_font {
        min-height: 32px;
        min-width: 50px;
        padding: 0 10px;
        background-color: #fff;
        // border-bottom: 1px solid #333;
      }
    }
  }
  .workbench_hidden {
    height: 100px;
  }
  .workbench {
    overflow: hidden;
    background: #fff;
    padding: 5px;
    margin: 5px 10px 8px 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    position: relative;
    .start {
      padding: 10px;
      font-size: 20px;
      .start_sel {
        font-size: 20px!important;
        // vertical-align: middle;
      }
      .start_width {
        width: 300px;
      }
      .start_btn {
        min-width: 200px;
        font-size: 19px;
        // padding: 20px;
      }
      .start_btn2 {
        font-size: 19px;
        margin: 0;
      }
    }
    .ing {
      overflow: hidden;
      padding: 10px;
      position: relative;
      .btn {
        width: 800px;
        margin: 0 auto;
      }
    }
    .exit {
      position: absolute;
      top: 10px;
      right: 5px;
      i {
        font-size: 30px;
        color: #f56c6c
      }
    }
    .ing_btn {
      position: absolute;
      top: 20px;
      left: 30px;
      z-index: 3000;
    }
    .opr_ {
      z-index: 3000;
      position: absolute;
      right: 5%;
      top: 0px;
      .opr_h {
        margin: 0 auto;
        width: 1px;
        height: 50px;
        background-color: #b18738;
        transition: all .5s
      }
      .active {
        height: 20px;
      }
      .opr_text {
        padding: 10px 10px;
        background-color: #b18738;
        color: #ffffff;
        border-radius: 5px;
      }
    }
  }
  .workbgc {
    background-color: #fbe8e7;
  }
  .historylist {
    margin: 0 10px 5px 10px;
    background: #fff;
    padding: 5px;
    overflow: hidden;
    .his_opr {
      overflow: hidden;
      margin-bottom: 5px;
    }
    .hisdiv {
      margin-top: 5px;
      width: 100%;
      overflow: hidden;
    }
  }
  .sp_li {
    li {
      word-wrap: break-word;
      font {
        overflow: hidden;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
  .span_red {
    font {
      color: red;
    }
  }
}

.pop_ul {
  padding-right: 30px;
  li {
    line-height: 25px;
    border-bottom: 1px solid #ddd;
  }
}

@40pxlh: 40px!important;
.workbench_ul {
  .ul_right {
    position: relative;
    li {
      min-height: @40pxlh;
      line-height: @40pxlh;
      margin-bottom: 5px;
      font {
        font-weight: bold;
        font-size: 24px!important;
      }
    }
  }
}

.expand_bgc {
  background-color: #efefef!important;
}

.expand {
  background: #e7f9df;
  overflow: hidden;
  .expand_div {
    margin: 0 auto;
    overflow: hidden;
    width: 800px;
    padding: 10px 5px;
    ul {
      overflow: hidden;
      float: left;
    }
    li {
      float: left;
      width: 100%;
      min-height: 30px;
      font-size: 16px;
      line-height: 30px;
      span {
        display: block;
        float: left;
        width: 100px;
        color: #555;
        text-align: right;
        font-size: inherit;
        line-height: inherit;
      }
      font {
        word-wrap: break-word;
        display: block;
        margin-left: 100px;
        text-align: left;
        font-size: inherit;
        line-height: inherit;
        overflow: hidden;
        i {
          float: left;
          font-style: normal!important;
        }
        i:nth-child(2) {
          margin: 0 5px;
        }
        i:nth-child(3) {
          margin-top: 4px;
          padding: 4px 10px;
          background: #000;
          color: yellow;
          line-height: 1;
        }
      }
    }
    .ul_left {
      width: 37%;
      padding-right: 10px;
      // li:first-child {
      //   margin-top: 5px;
      // }
    }
    .ul_right {
      border-left: 1px solid #ddd;
      width: 63%;
    }
  }
}
</style>

<style lang ='less'>
.start_sel {
  width: 220px;
  margin-right: 5px;
  input {
    height: auto!important;
    line-height: 1!important;
    padding: 13px 15px;
    font-size: 15px;
  }
}

.work_dialog {
  background: rgba(255, 255, 255, 0.67);
}


/* .start{
  .el-carousel__indicators{
    display: none
  }
} */
</style>
