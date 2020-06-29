<template>
  <el-container class="wrapper">
    <el-aside :style="{width:asideWidth}">
      <!-- 顶部logo  -->
      <div class="logo" :style="{display:logoDisplay}">
        <img src="../assets/images/logo.png" alt />
      </div>
      <el-menu
        :default-active="$route.path"
        :unique-opened="true"
        class="el-menu-vertical"
        background-color="#304156"
        router
        text-color="#fff"
        active-text-color="#03a9f3"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <template v-for="item in JSON.parse(this.menuList)">
          <el-submenu :index="item.id.toString()" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.name}}</span>
            </template>
            <template v-for="(item1,index) in item.child">
              <el-menu-item :index="item1.url" :key="index">{{item1.name}}</el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="left">
          <i @click="collapse" id="collapse" :class="collapseClass"></i>
          <el-breadcrumb separator="/" >
            <el-breadcrumb-item>{{$route.meta[0]}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.meta[$route.meta.length-1]}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="info">
          <!-- 头像 -->
          <el-dropdown>
            <span class="el-dropdown-link">
              <!-- 用户名 -->
              <span class="username">{{username}}</span>
              <el-avatar icon="el-icon-user-solid"></el-avatar>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>个人资料</el-dropdown-item>
              <el-dropdown-item @click.native="handleLogout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <tags />
        <transition name="fade-transform" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Tags from "@/components/Tags";
export default {
  name: "layout",
  data() {
    return {
      isCollapse: false, //是否收起侧边栏导航
      asideWidth: "300px",
      logoDisplay: "flex",
      collapseClass: "el-icon-s-fold",
      menuVar: [],
      fullscreenLoading: false
    };
  },
  computed: mapGetters(["username", "menuList"]),
  methods: {
    ...mapActions({ logout: "user/logout" }),

    // 注销
    handleLogout() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            await this.logout(this.username);
          } catch (err) {
          } finally {
            this.$router.push("/login");
          }
        })
        .catch(() => {});
    },
    // 收起侧边栏
    collapse() {
      this.isCollapse = !this.isCollapse;
      this.asideWidth = this.asideWidth === "auto" ? "300px" : "auto";
      this.logoDisplay = this.logoDisplay === "none" ? "flex" : "none";
      this.collapseClass =
        this.collapseClass === "el-icon-s-fold"
          ? "el-icon-s-unfold"
          : "el-icon-s-fold";
    }
  },
  components: {
    Tags
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
    display: flex;
    padding: 0 20px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e8e9ed;

    .left {
      display: flex;
      align-items: center;

      #collapse {
        font-size: 24px;
        cursor: pointer;
        color: #606266;
        margin-right:15px;
      }
    }

    .info {
      // 头像
      .el-dropdown {
        cursor: pointer;
        .el-dropdown-link {
          display: flex;
          align-items: center;
        }
      }

      // 用户名
      .username {
        font-size: 16px;
        margin-right: 10px;
      }
    }
  }

  // 侧边栏
  .el-aside {
    background: #304156;

    .el-menu-vertical {
      border: 0;
    }

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
    background: #f8f9fc;
    overflow: hidden;
  }
}
</style>
