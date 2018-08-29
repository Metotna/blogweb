<template>
  <div class="helloword">
    <!--     helloword
    <i class="iasync ia-pingjia"> </i> -->
    <header class="iheader">
    </header>
    <button @click='handlePost'>测试 <i class="iasync ia-pingjia"> </i> </button>
  </div>
</template>
<script>
import crypto from 'crypto'
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      name: '15168271902',
      pwd: '15168271902+'
    }
  },
  methods: {
    handlePost() {
      // var encrypt = new jsencrypt();
      // encrypt.setPublicKey(Public_Key);
      // var encrypted = encrypt.encrypt(this.pwd);
      // console.log(crypto)
      // const s = `${this.name}async${this.pwd}`
      // const encodeData = cryptojs.AES.encrypt(this.pwd, Public_Key);
      const s ='131711qq'
      const encodeData = crypto.publicEncrypt(Public_Key, Buffer.from(s)).toString('base64');
      const decodeData = crypto.privateDecrypt(Private_Key, Buffer.from(encodeData.toString('base64'), 'base64'));
      console.log("encode: ", encodeData)
      console.log(decodeData.toString())
      // this.http.test('/prosdata', {}).then(e => {
      //   console.log(e)
      //   if (e) {

      //   }
      //   // const v = e.data[0].content.toString()
      //   // var c =v.match(/(?<=\<p\>)(.|\n)*(?=\<\/p\>)/gm)
      //   // console.log(v,c)
      // })
    },
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.helloword {
  // padding: 10px;
  .iheader {
    height: 300px;
    width: 100%;
    background: #fff url('../assets/img/bgi.png') 0 0 repeat-x; // -webkit-background-size: auto 100%;
    // background-size: auto 100%;
  }
}

</style>
