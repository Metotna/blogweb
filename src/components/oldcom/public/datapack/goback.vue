<template>
  <div class='go_back'>
    <div @click="goback"><i class="icon iconfont icon-fanhui"></i><span>返回</span></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    goback(){
      this.$router.go(-1)
    }
  },
  components: {},
  watch: {},
  created() {},
  mounted() {}
};
</script>
<style lang='less' scoped>
.go_back {
  margin: 0 0 10px 0 ;
  color: #333;
  display: block;
  padding-left: 10px;
  width: 100%;
  overflow: hidden;
  i {
    color: #333;
  }
  span {
    color: #333;
    margin-left: 5px;
    font-size: 17px;
  }
  div {
    border: 1px dashed #ddd;
    padding: 5px 20px;
    display: inline-block;
    border-radius: 4px;
    float: left;
    cursor: pointer;
    text-align: left;
  }
  div:hover{
      border: 1px solid #ddd;
  }
}
</style>
