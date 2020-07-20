<template>
  <div class="home_bg">
    <div class="login_content">
      <div class="title">
        <img class="logo" src="../assets/images/logo.png" alt />
      </div>
      <div class="input_content">
        <div>
          <label>
            <span class="input1">用户名：</span>
            <input
              @focus="curFocus=0"
              @blur="curFocus=-1"
              type="text"
              v-model.trim="loginForm.name"
            />
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
              v-model.trim="loginForm.password"
            />
            <div :style="{width:curFocus===1?'100%':''}" class="line"></div>
          </label>
        </div>
        <div>
          <label>
            <span class="input3">验证码：</span>
            <input
              @focus="curFocus=2"
              @blur="curFocus=-1"
              type="text"
              v-model.trim="loginForm.code"
            />
            <div :style="{width:curFocus===2?'100%':''}" class="line"></div>
          </label>
          <div
            class="code"
            :style="{backgroundImage:`url(${codeUrl})`,backgroundSize:'100% 100%'}"
            @click="getCode"
          ></div>
        </div>
      </div>
      <div class="footer">
        <div
          class="login_btn"
          @click="loginFn"
          v-loading.fullscreen="fullscreenLoading"
          element-loading-text="登录中"
        >登录</div>
      </div>
      <div class="copy">
        <p style="padding:0;margin:0">—— 途咪小视频 后台管理系统 ——</p>
        <span style="white-space:nowrap">Copyright 2020 © 途咪智慧视频有限技术公司</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getCode } from "@/api/user";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        name: "",
        password: "",
        code: "",
        token: ""
      },
      curFocus: -1, //当前激活的输入框
      fullscreenLoading: false
    };
  },
  created() {
    this.enter();
    this.getCode();
  },
  computed:mapGetters(['username']),
  methods: {
    ...mapActions({
      login: "user/login",
      getMenuList: "permission/getMenuList"
    }),

    // 获取验证码
    async getCode() {
      const res = await getCode();
      const { url } = res.config;
      this.codeUrl = process.env.VUE_APP_BASE_URL + url + "?" + Date.now();
    },

    // 登录
    async loginFn() {
      if (!this.loginForm.name) {
        this.$message.warning("请输入用户名！");
        return;
      }
      if (!this.loginForm.password) {
        this.$message.warning("请输入密码！");
        return;
      }
      if (!this.loginForm.code) {
        this.$message.warning("请输入验证码！");
        return;
      }
      // 登录actions
      this.fullscreenLoading = true;
      this.login(this.loginForm)
        .then(() => {
          // 获取菜单actions
          this.getMenuList()
            .then(resolve => {
              this.$router.push("/");
              this.$notify({
                title: `您好 ${this.username}`,
                message: `今天是${new Date().toLocaleDateString()} 欢迎登录途咪小视频后台管理系统`,
                type: "success"
              });
              // 登录actions
              this.fullscreenLoading = false;
            })
            .catch((err) => console.log(err));
        })
        .catch(() => {
          this.getCode();
          this.fullscreenLoading = false;
        });
    },

    // 监听回车按钮
    enter() {
      document.onkeydown = () => {
        const key = window.event.keyCode;
        key === 13 && this.loginFn();
      };
    }
  }
};
</script>

<style scoped>
.home_bg {
  height: 100vh;
  background-image: url("../assets/images/gs.png");
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
  background-image: url("../assets/images/login-bg.jpg");
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
  cursor: pointer;
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
  cursor: pointer;
}

.login_btn:hover {
  background: rgba(0, 66, 255, 0.8);
}
</style>
