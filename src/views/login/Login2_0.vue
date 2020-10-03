<template>
  <div class="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in tabItems"
          :class="{active:curMode===item.mode}"
          :key="item.name"
          @click="toggleMenu(item)"
        >{{item.name}}</li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="login-form"
        label-position="top"
        label-width="100px"
        class="item-form"
        size="small"
      >
        <el-form-item label="邮箱" prop="mail">
          <el-input id="mail" type="text" v-model="ruleForm.mail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwords"
        v-if='curMode==="resgin"'>
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="success" @click='getSms'>{{codeButtonStatus.text}}</el-button>
            </el-col>
            <div v-text="codeButtonStatus.text"></div>
            <div>{{ codeButtonStatus.text }}</div>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" id="form-submit" @click="submitForm('login-form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { validatePass, validateEmail, validateVCode } from '@/utils/validate';
export default {
  name: "login",
  data() {
    var Mail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      }else if(validateEmail(value)){
        callback()
      }else{
        callback(new Error('邮箱格式错误'))
      }
    };
    var Password = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if(validatePass(value)){
        callback()
      }else{
        callback(new Error('密码格式错误'))
      }
    };
    var Passwords = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if(value == this.ruleForm.password){
        callback()
      }else{
        callback(new Error('两次密码不一样'))
      }
    };
    var VCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证"));
      } else if(validateVCode(value)){
        callback()
      }else{
        callback(new Error('验证码格式错误'))
      }
    };
    return {
      ruleForm: {
        mail: "",
        password: "",
        passwords: "",
        code: ""
      },
      rules: {
        mail: [{ validator: Mail, trigger: "blur" }],
        password: [{ validator: Password, trigger: "blur" }],
        passwords: [{ validator: Passwords, trigger: "blur" }],
        code: [{ validator: VCode, trigger: "blur" }]
      },
      curMode: "login",
      tabItems: [
        { name: "登录", mode: "login" },
        { name: "注册", mode: "resgin" }
      ],
      codeButtonStatus:{
        text:'获取验证码'
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toggleMenu(item) {
      this.curMode = item.mode;
    },
    getSms(){
    console.log(this.codeButtonStatus.text)
    // this.codeButtonStatus.text = '发送中'
    this.$set(this.codeButtonStatus,"text","'发送中'")
  }
  },
  
};
</script>

<style lang="scss" scoped>
.login {
  background-color: #344a5f;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap {
  width: 330px;
  // background-color: aqua;
}

.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    // background-color:rgb(224, 75, 75);
    height: 36px;
    color: white;
    line-height: 36px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
  }
  .active {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.item-form {
  margin-top: 10px;
  /deep/ label {
    color: white !important;
    line-height: 30px;
    font-size: 20px;
  }
  /deep/ .el-form-item__content {
    margin-bottom: 5px;
  }
  #form-submit {
    display: block;
    width: 100%;
  }
}
</style>