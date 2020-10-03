<template>
  <div class="login">
    <!-- 登录注册切换 -->
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in tabItems"
          :class="{active:curMode===item.mode}"
          :key="item.name"
          @click="toggleMenu(item)"
        >{{item.name}}</li>
      </ul>
      <!-- 表单 -->
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
        <!-- 邮箱(用户名 username) -->
        <el-form-item label="邮箱" prop="username">
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 密码(password) -->
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 重复密码(passwords) -->
        <el-form-item label="确认密码" prop="passwords" v-if="curMode==='register'">
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 验证码(code) -->
        <el-form-item label="验证码" prop="code">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input v-model="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="12">
              <!-- 验证按钮 （getSms）-->
              <el-button
              class='getsms'
                type="success"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >{{codeButtonStatus.text}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 提交按钮（submitForm） -->
        <el-form-item>
          <el-button
            type="danger"
            id="form-submit"
            @click="submitForm('login-form')"
            :disabled="loginButtonStatus"
          >提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//vue3.0(composition-api)
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  watch,
  onUnmounted
} from "@vue/composition-api";
//路由
import { GetSms, Register, Login } from "network/api/login.js";
//ui
import { Message  } from 'element-ui';
//组件
//公用方法
import { validatePass, validateEmail, validateVCode } from "@/utils/validate";
import sha1 from 'js-sha1'


export default {
  name: "login",
  
  setup(props, { refs, root }) {

    /***************************公用的一些方法和数据*****************************/
    
    //控制定时器
    const timer = ref(null);

    //表单验证的一些函数
    const Username = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入邮箱"));
      } else if (validateEmail(value)) {
        callback();
      } else {
        return callback(new Error("邮箱格式错误"));
      }
    };
    const Password = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback();
      } else {
        return callback(new Error("密码格式错误"));
      }
    };
    const Passwords = (rule, value, callback) => {
      console.log(value)
      if (value === "") {
        return callback(new Error("请输入确认密码"));
      } else if (value == ruleForm.password) {
        callback();
      } else {
        return callback(new Error("两次密码不一样"));
      }
    };
    const VCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入验证"));
      } else if (validateVCode(value)) {
        callback();
      } else {
       return callback(new Error("验证码格式错误"));
      }
    };

  //表单验证成功后向接口发送请求
    function getSmsBtn() {
      let requestData = {
        username: ruleForm.username,
        module: curMode.value
      };
      GetSms(requestData)
        .then(response => {
          console.log(response)
          let data = response.data;
          Message({
            message: data.message,
            type: "success"
            // dangerouslyUseHTMLString: true
          });
          // 启用登录或注册按钮
          loginButtonStatus.value = false;
          // 调定时器，倒计时
          countDown(10);
        })
        .catch(error => {
          // 关闭登录或注册按钮
          loginButtonStatus.value = false;
          updataButtonStatus({
            status: false,
            text: "再次获取"
          });
        });
    }

    //调用定时器
    function countDown(time) {
      console.log("开始计时")
        timer = setInterval(() => {
        console.log(time)
        time--;
        if (time === 0) {
          codeButtonStatus.text = `重新发送`;
          codeButtonStatus.status = false;
          clearInterval(timer);
        } else {
          codeButtonStatus.text = `倒计时${time}s`;
          codeButtonStatus.status = true;
        }
      }, 1000);
    }

    //修改按钮状态
    const updataButtonStatus = (params => {
      console.log('开始修改按钮',params.text)
      codeButtonStatus.text = params.text;
      codeButtonStatus.status = params.status;
    });

    //发送登录请求
    const login = (()=>{
      let repuestData = {
          username: ruleForm.username,
          password: sha1(ruleForm.password),
          code: ruleForm.code
        }
        root.$store.dispatch('app/login', repuestData).then(response => {
          // 页面跳转
          root.$router.push({
            name: 'console'
          })
        }).catch(error => {});
    })


    // const login = (() => {
    //     let repuestData = {
    //       username: ruleForm.username,
    //       password: sha1(ruleForm.password),
    //       code: ruleForm.code
    //     }
    //     Login(repuestData).then(data=>{
    //       root.$router.push('/console')
    //     }).catch(error=>{
    //       console.log(error)
    //     })
    //   })

    //发送注册请求
    const register = (()=>{
      let requestData = {
          username: ruleForm.username,
          password: sha1(ruleForm.password),
          code: ruleForm.code,
          module: 'register'
        }
        // 注册接口
        Register(requestData).then(response => {
          let data = response.data
          Message({
            message: data.message,
            type: 'success'
          })
          // 模拟注册成功
          toggleMenu(tabItems[0])
          clearCountDown()
        }).catch(error => {
          // 失败时执行的代码
          clearCountDown
        })
    })

    //清除验证按钮的状态
    const clearCountDown = (() => {
        // 还原验证码按钮默认状态
        updataButtonStatus({
          status: false,
          text: '获取验证码'
        })
        // 清除倒计时
        clearInterval(timer.value)
      })

    //清空表单内容
    function clearForm(){
      ruleForm.username='';
      ruleForm.password='';
      ruleForm.passwords='';
      ruleForm.code='';
    }

    /***************************对应vue2.0data*************************************/
    //表单数据
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });

    //验证规则
    const rules = reactive({
      username: [{ validator: Username, trigger: "blur" }],
      password: [{ validator: Password, trigger: "blur" }],
      passwords: [{ validator: Passwords, trigger: "blur" }],
      code: [{ validator: VCode, trigger: "blur" }]
    });
    
    //当前所处选项(login/register)
    const curMode = ref("login");
    const tabItems = reactive([
      { name: "登录", mode: "login" },
      { name: "注册", mode: "register" }
    ]);
    
    //决定提交按钮的状态（true为disable）
    const loginButtonStatus = ref(true);

    //决定验证按钮的状态（true为disable）
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });

    /***************************对应vue2.0中methods*****************************/

    //获取验证码按钮
    const getSms = (() => {
      // 进行提示
      //验证表单是否符合条件
      if (ruleForm.username == "") {
        console.log('111')
        Message.error("邮箱不能为空！！");
        return false;
      }
      if (!validateEmail(ruleForm.username)) {
        Message.error("邮箱格式有误，请重新输入！！");
        return false;
      }
      updataButtonStatus({
        status: true,
        text: "发送中"
      });
      //向接口发送获取验证码请求
      getSmsBtn()
    });

    //确认按钮对应函数
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          curMode.value === 'login' ? login() : register()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    //导航条对应按钮
    const toggleMenu = item => {
      curMode.value = item.mode;
      clearForm();
      clearCountDown();
    };

    return {
      ruleForm,
      rules,
      curMode,
      tabItems,
      loginButtonStatus,
      codeButtonStatus,
      getSms,
      submitForm,
      toggleMenu
    };
  }
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
  .getsms {
    display: block;
    width: 100%;
  }
  #form-submit {
    display: block;
    width: 100%;
  }
}
</style>