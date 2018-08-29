<template>
  <div class='custom_file'>
    <li v-for='x in data' class="cont_li" @click='articTogo(x.id)'>
      <h2>{{x.title}}</h2>
      <hr>
      <p>{{x.introduce}}</p>
      <div style="text-align: right;">
        <span>{{x.updatetime|timesSummary}}</span>
      </div>
    </li>
    <div class="pagePilots">
      <div class="p_up"> <i class="iasync ia_big ia-pageup"></i></div>
      <div class="p_span"> 5 to 9</div>
      <div class="p_down"> <i class="iasync ia_big ia-pagedown"></i></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: []
    }
  },
  methods: {
    articTogo(v) {
      this.$router.push({
        path: 'article',
        query: {
          id: v
        }
      })
    },
    _handlePost() {
      this.http.ajax('/article/data', {
        id: 1
      }).then(e => {
        if (e) {
          this.data = e.data;
        }
      })
    }
  },
  computed: {

  },
  components: {},
  watch: {},
  created() {
    this._handlePost()
  },
  mounted() {},
  activated() {}
}

</script>
<style lang='less' scoped>
.custom_file {
  .cont_li {
    margin: 10px 10px 30px 10px;
    background-color: #fff;
    padding: 0 20px;
    min-height: 140px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, .19), 0 6px 6px rgba(0, 0, 0, .23);
    -webkit-transition: all 250ms;
    transition: all 250ms;
    cursor: pointer;
  }
  .cont_li {
    text-align: left;

    h2 {
      padding: 20px 0px 10px 0px;
      font-size: 20px;
      line-height: 24px;
      color: #333;
    }
    p {
      min-height: 50px;
      padding: 5px 0px;
      color: #888;
      line-height: 24px;
      margin-bottom: 4px;
      font-size: 13px;
    }
    div {
      padding: 5px 0px 20px 0px;
      span {
        font-size: 14px;
        color: #555;
      }
    }
  }
  .cont_li:hover {
    transform: translateY(-5px)!important;
  }
  .pagePilots {
    width: 200px;
    margin: 20px auto;
    text-align: center;
    .p_up {
      display: inline-block;
      padding-right: 20px;
    }
    .p_span {
      display: inline-block;
    }
    .p_down {
      display: inline-block;
      padding-left: 20px;
    }
  }
}

</style>
