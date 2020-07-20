<template>
  <el-container class="wrapper">
    <el-aside :style="{width:isCollapse?'64px':'300px'}">
      <!-- 顶部logo  -->
      <transition name="el-fade-in-linear">
        <div class="logo" v-show="!isCollapse">
          <img src="../assets/images/logo.png" alt />
        </div>
      </transition>
      <!-- 侧边菜单 -->
      <Menu />
    </el-aside>

    <el-container>
      <el-header>
        <div class="top">
          <div class="left">
            <i
              @click="collapse"
              id="collapse"
              :class="[isCollapse?'el-icon-s-unfold':'el-icon-s-fold']"
            ></i>
            <!-- 动态面包屑 -->
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                :style="{ fontWeight:index===0?'bold':''}"
                v-for="(item,index) in $route.meta.breadcrumb"
                :key="index"
              >{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="info">
            <p class="wel">欢迎您，{{username}}</p>
            <div class="logout" @click="handleLogout">
              <i class="el-icon-switch-button"></i>
              <span>注销</span>
            </div>
          </div>
        </div>
        <!-- 标签导航 -->
        <tabs />
      </el-header>
      <el-main>
        <transition name="fade-transform" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import Menu from "@/layout/components/Menu";
import Tabs from "@/layout/components/Tabs";
export default {
  name: "layout",
  computed: mapGetters(["username", "isCollapse"]),
  methods: {
    // 注销
    handleLogout() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            await this.$store.dispatch("user/logout", this.username);
          } finally {
            this.$router.push("/login");
          }
        })
        .catch(() => {});
    },
    // 侧边栏伸缩
    collapse() {
      this.$store.commit("permission/SET_COLLAPSE");
    }
  },
  components: {
    Tabs,
    Menu
  }
};
</script>

<style lang="less" scoped>
// 过渡效果
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.wrapper {
  height: 100%;

  .el-header {
    padding: 0;
    height: auto !important;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    border-bottom: 1px solid #d8dce5;

    .top {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e8e9ed;
      padding: 10px 20px;

      .left {
        display: flex;
        align-items: center;

        #collapse {
          font-size: 24px;
          cursor: pointer;
          color: #606266;
          margin-right: 15px;
        }
      }

      .info {
        display: flex;
        align-items: center;

        .wel {
          font-size: 14px;
          color: #888;
          margin-right: 10px;
        }

        .logout {
          color: #999c9e !important;
          display: flex;
          align-items: center;
          cursor: pointer;
          span {
            margin-left: 5px;
            font-weight: 600;
            font-size: 14px;
          }

          i {
            font-weight: 600;
            color: #999c9e !important;
            font-size: 18px;
          }
        }
      }
    }
  }

  // 侧边栏
  .el-aside {
    background: #304156;
    transition: 0.3s;

    .logo {
      justify-content: center;
      display: flex;
      align-items: center;
      height: 60px;

      img {
        width: 160px;
      }
    }
  }

  .el-main {
    overflow-x: hidden;
  }
}
</style>
