<template>
  <div class="home_bg">
    <div class="login_content">
      <div class="title">
        <img
          class="logo"
          src="http://39.108.113.236/wp-content/themes/tome_wordpress/images/logo.png"
          alt
        />
      </div>
      <div class="input_content">
        <div>
          <label>
            <span class="input1">用户名：</span>
            <input @focus="curFocus=0" @blur="curFocus=-1" type="text" v-model.trim="ruleForm.name" />
            <div :style="{width:curFocus===0?'100%':''}" class="line"></div>
          </label>
        </div>

        <div>
          <label>
            <span class="input2">密码：</span>
            <input
              @focus="curFocus=1"
              @blur="curFocus=-1"
              type="password"
              v-model.trim="ruleForm.password"
            />
            <div :style="{width:curFocus===1?'100%':''}" class="line"></div>
          </label>
        </div>
        <div>
          <label>
            <span class="input3">验证码：</span>
            <input @focus="curFocus=2" @blur="curFocus=-1" type="text" v-model.trim="ruleForm.code" />
            <div :style="{width:curFocus===2?'100%':''}" class="line"></div>
          </label>
          <div
            class="code my_hover"
            :style="{backgroundImage:`url(${imgCodeUrl})`,backgroundSize:'100% 100%'}"
            @click="getNewCode()"
          ></div>
        </div>
      </div>
      <div class="footer">
        <div class="login_btn my_hover" @click="loginFn()">
          <span>登录</span>
        </div>
      </div>
      <div class="copy">
        <p style="padding:0;margin:0">—— 途咪小视频 后台管理系统 ——</p>
        <span style="white-space:nowrap">Copyright 2020 © 途咪智慧视频有限技术公司</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getCode, login, getMenu } from "@/request/api";
export default {
  name: "login",
  data() {
    return {
      imgCodeUrl: "",
      ruleForm: {
        name: "",
        password: "",
        code: "",
        token: ""
      },
      curFocus: -1 //当前激活的输入框
    };
  },
  created() {
    this.getCode();
  },
  methods: {
    // 获取验证码
    async getCode() {
      const num = Math.ceil(Math.random() * 10); //生成一个随机数（防止缓存）
      const res = await getCode();
      const { url, baseURL } = res.config;
      this.imgCodeUrl = baseURL + url + "?" + num;
    },

    // 登录
    async loginFn() {

      if (!this.ruleForm.name) {
        this.$message.warning("请输入用户名！");
        return;
      }
      if (!this.ruleForm.password) {
        this.$message.warning("请输入密码！");
        return;
      }
      if (!this.ruleForm.code) {
        this.$message.warning("请输入验证码！");
        return;
      }
      // 登录接口
      const res = await login(this.ruleForm);
      if (res.data.resultStatus.resultCode === "0000") {
        
        const token = res.data.value.access_token;
        localStorage.setItem('token',token)
        this.$store.commit("setToken",token);

        this.$store.commit("setUserInfo", this.ruleForm.name);
        localStorage.setItem("allScopeUserName", this.ruleForm.name);

        // 获取菜单权限接口
        const menuRes = await getMenu()
        console.log(menuRes)
        if(menuRes.data.resultStatus.resultCode === "0000"){
          var menuK = menuRes.data.value;
          this.$store.commit("getMenuVarArr", { menuVarArr: menuK });
          this.$store.state.menuVarArr = [...menuK];
          this.$router.push("/layout")
        }else{
          this.$message.warning(menuRes.data.resultStatus.resultMessage);
        }

      } else {
        this.$message.warning(res.data.resultStatus.resultMessage);
        this.getCode()
      }
    }
  }
};
</script>

<style scoped>
.home_bg {
  height: 100vh;
  background-image: url("http://thecodeplayer.com/uploads/media/gs.png");
  background-repeat: repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.logo {
  width: 200px;
}

.copy {
  position: absolute;
  bottom: -80px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #fff;
}

.login_content {
  position: relative;
  width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  background: rgba(255, 255, 255, 1);
}
.title {
  background-image: url("http://demo.qfpffmp.cn/cssthemes6/tmag_4_Dashio/img/instagram.jpg");
  background-size: cover;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px 8px 0 0;
}

.input_content {
  padding: 0 80px 0;
}

.input_content > div {
  position: relative;
  display: flex;
  padding-top: 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.line {
  position: absolute;
  bottom: -1px;
  width: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  background: #5a84fd;
  transition: 0.5s;
}

.input_content > div > span {
  display: flex;
  width: 80px;
  min-width: 60px;
  align-items: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.54);
}

input {
  width: 100%;
  height: 32px;
  font-size: 16px;
  border: none;
  outline: none;
}

.code {
  width: 1rem;
  min-width: 80px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer {
  box-sizing: border-box;
  width: 100%;
  padding: 60px 80px;
}
.login_btn {
  background: #5a84fd;
  box-shadow: 0 5px 30px rgba(0, 66, 255, 0.3);
  font-size: 14px;
  padding: 10px 0;
  color: white;
  text-align: center;
  width: 100%;
  border-radius: 5px;
  transition: 0.5s;
}

.login_btn:hover {
  background: rgba(0, 66, 255, 0.8);
}
</style>
