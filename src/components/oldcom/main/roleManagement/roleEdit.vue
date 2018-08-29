<template>
  <div class='roleEdit'>
    <goback></goback>
    <div class="re_role">
      <span class='rer_span'>角色名称</span>
      <el-input v-model="rolename" placeholder="请输入角色名称" class='rer_input'></el-input>
    </div>
    <div class='re_list'>
      <div class='rel_text'>权限设置（请勾选该角色可以操作的模块）</div>
      <div class='rel_list'>
        <el-checkbox-group v-model="roleAry">
          <el-checkbox v-for="x in rolelist" :label="x.id" :key="x.id">{{x.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button type="primary" style='margin:20px 40px;width:150px'>保存</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rolelist: this._date._BASIC.roleList,
        rolename: '',
        roleAry: [1, 2, 3, 4],
      }
    },
    methods: {
      _dataInit(){
        this.rolename='';
        this.roleAry=[1, 2, 3, 4];
      }
    },
    components: {},
    watch: {},
    created() {},
    mounted() {
      
    }
  };
</script>

<style lang='less' scoped>
  .roleEdit {
    padding: 10px !important;
    background-color: #fff;
    text-align: left;
    .re_role {
      margin: 20px 0;
      .rer_span {
        width: 100px;
        margin-left: 40px;
        margin-right: 40px;
      }
      .rer_input {
        width: 300px;
      }
    }
    .re_list{
      .rel_text{
        margin-left: 25px;
        border-left:5px solid #333;
        height: 25px;
        line-height: 25px;
        padding-left: 10px;

      }
      .rel_list{
        margin:20px 0;
        padding-left: 40px;
      }
    }
  }
</style>
