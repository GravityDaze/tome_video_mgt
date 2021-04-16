<template>
  <div class="home_bg">
    <div class="video">
      <video
        id="video"
        loop
        autoplay
        muted
        src="https://tomevideo.zhihuiquanyu.com/video3.mp4"
      ></video>
    </div>
    <div class="login_content">
      <div class="wel-img">
        <img class="logo" src="../assets/images/wel.jpg" alt />
      </div>
      <div class="input-box">
        <div class="logo">
          <img src="../assets/images/log.png" alt="" />
        </div>
        <div class="input_content">
          <div
            :style="{ borderColor: curFocus === 0 ? 'transparent' : '#5c544c' }"
          >
            <label style="width: 100%">
              <span>用户名</span>
              <input
                @focus="curFocus = 0"
                @blur="curFocus = -1"
                type="text"
                v-model.trim="loginForm.name"
              />
              <div
                :style="{ width: curFocus === 0 ? '100%' : '' }"
                class="line"
              ></div>
            </label>
          </div>

          <div
            :style="{ borderColor: curFocus === 1 ? 'transparent' : '#5c544c' }"
          >
            <label style="width: 100%">
              <span>密码</span>
              <input
                @focus="curFocus = 1"
                @blur="curFocus = -1"
                type="password"
                v-model.trim="loginForm.password"
              />
              <div
                :style="{ width: curFocus === 1 ? '100%' : '' }"
                class="line"
              ></div>
            </label>
          </div>
          <div
            class="code-area"
            :style="{ borderColor: curFocus === 2 ? 'transparent' : '#5c544c' }"
          >
            <label>
              <span>验证码</span>
              <input
                @focus="curFocus = 2"
                @blur="curFocus = -1"
                type="text"
                v-model.trim="loginForm.code"
              />
              <div
                :style="{ width: curFocus === 2 ? '100%' : '' }"
                class="line"
              ></div>
            </label>
            <div
              class="code"
              :style="{
                backgroundImage: `url(${codeUrl})`,
                backgroundSize: '100% 100%',
              }"
              @click="getCode"
            ></div>
          </div>
        </div>
        <div class="footer">
          <div
            :class="{ login_btn: true, is_loading: loading }"
            @click="loginFn"
          >
            {{ loading ? "正在登录" : "登录" }}
          </div>
        </div>
      </div>

      <div class="copy">
        <p style="padding: 0; margin: 0">—— 途咪VLOG 后台管理系统 ——</p>
        <span style="white-space: nowrap"
          >Copyright 2020 © 成都途咪智慧视频有限技术公司</span
        >
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
        token: "",
      },
      curFocus: -1, //当前激活的输入框
      loading: false,
    };
  },
  created() {
    // 监听回车按钮
    document.onkeydown = () => {
      const key = window.event.keyCode;
      key === 13 && this.loginFn();
    };

    this.getCode();
  },
  beforeDestroy() {
    document.onkeydown = null;
  },
  computed: mapGetters(["userInfo"]),
  methods: {
    ...mapActions({
      login: "user/login",
      getMenuList: "permission/getMenuList",
    }),

    // 获取验证码
    async getCode() {
      const res = await getCode();
      const { url } = res.config;
      this.codeUrl = process.env.VUE_APP_BASE_URL + url + "?" + Date.now();
    },

    // 登录
    async loginFn() {
      if (this.loading) return;
      if (!this.loginForm.name) return this.$message.warning("请输入用户名！");
      if (!this.loginForm.password)
        return this.$message.warning("请输入密码！");
      if (!this.loginForm.code) return this.$message.warning("请输入验证码！");

      this.loading = true;
      try {
        // 登录
        await this.login(this.loginForm);
        // 获取菜单
        await this.getMenuList();
        this.$router.replace("/");
        this.$notify({
          title: `您好 ${this.userInfo.loginName}`,
          message: `今天是${new Date().toLocaleDateString()} 欢迎登录途咪小视频后台管理系统`,
          type: "success",
        });
      } catch {
        this.getCode();
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.home_bg {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .video {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    video {
      object-fit: cover;
    }
  }

  &::after {
    content: "";
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    z-index: 2;
    background: rgba(0, 0, 0, 0.4);
  }

  .login_content {
    position: relative;
    display: flex;
    z-index: 3;
    width: 770px;
    box-shadow: 3px 5px 18px 0px rgba(88, 82, 70, 0.45);
    background: rgba(255, 255, 255, 1);

    .wel-img {
      position: relative;
      // flex: 1;
      flex-shrink: 0;
      width: 50%;

      img {
        // filter: blur(px);
        position: absolute;
        top: -10%;
        right: -15px;
        box-shadow: 8px 13px 29px 0px rgba(29, 30, 23, 0.86);
      }
    }

    .input-box {
      padding: 30px 45px 0 70px;
      box-sizing: border-box;
      // flex:1;
      // flex-shrink: 0;

      .logo {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;

        img {
          width: 160px;
          height: 42px;
        }
      }
    }

    .input_content {
      color: #5c544c;
      font: bold 14px "宋体";

      input {
        width: 100%;
        height: 32px;
        font-size: 16px;

        border: none;
        outline: none;
      }

      .line {
        position: absolute;
        bottom: -1px;
        width: 0;
        // left: 50%;
        // transform: translateX(-50%);
        height: 2px;
        // background: rgb(244,186,27);
        background: #5c544c;
        // background:#000;
        transition: 0.3s;
      }
    }

    // .title {
    //   // background-image: url("../assets/images/login-bg.jpg");
    //   background-size: cover;
    //   height: 170px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   border-radius: 8px 8px 0 0;

    //   .logo {
    //     width: 200px;
    //   }
    // }

    .footer {
      box-sizing: border-box;
      width: 100%;
      padding: 20px 6px 50px;

      .login_btn {
        position: relative;
        border: 1px solid #5c544c;
        font: bold 14px "宋体";
        color: #5c544c;
        padding: 14px 0;
        text-align: center;
        width: 100%;
        transition: 0.5s;
        cursor: pointer;
        overflow: hidden;

        &::after {
          content: "";
          position: absolute;
          background: #5c544c;
          border-radius: 50%;
          width: 100%;
          height: 100%;
          right: 100%;
          transition: 0.3s cubic-bezier(0.7, 0, 0.9, 1);
          transform-origin: 100% 50%;
          transform: scale3d(1, 2, 1);
          z-index: -1;
        }

        &:hover {
          &::after {
            transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
            border-radius: 0;
            right: 0;
          }
          color: #fff;
        }
      }

      .is_loading {
        border: 1px solid darkgray !important;
        background: darkgray;
        cursor: wait;
        color: #fff !important;

        &:hover {
          background: darkgray !important;
        }
      }
    }

    .copy {
      position: fixed;
      bottom: 80px;
      text-align: center;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      color: #fff;
    }
  }
}

.input_content > div {
  transition: 0.5s;
  position: relative;
  display: flex;
  padding-top: 28px;
  border-bottom: 1px solid #5c544c;
}

.input_content > div > span {
  display: flex;
  width: 80px;
  min-width: 60px;
  align-items: center;
  font-size: 14px;
  color: #5c544c;
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
</style>
