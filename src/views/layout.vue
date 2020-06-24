<template>
  <div>
    <el-container>
      <el-header id="header_div">
        <div class="title_box_style">
          <div>
            <span class="title">打卡小视频.管理后台</span>
          </div>
          <div>
            <div class="show_name">
              <span>{{username}}</span>
            </div>
            <div class="show_login_out my_hover" @click="handleLogout">
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </el-header>
      <el-container class="left_right">
        <el-aside id="aside_div">
          <div class="sidebar_box">
            <el-row class="tac">
              <el-col>
                <el-menu
                  :default-active="$route.path"
                  :unique-opened="state"
                  class="el-menu-vertical-demo"
                  background-color="#202D3D"
                  router
                  text-color="#fff"
                  active-text-color="#FA8819"
                  :collapse="isCollapse"
                >
                  <!--<template v-for="item in this.menuVar">-->
                  <!--<el-submenu :index=item.num>-->
                  <!--<template slot="title">-->
                  <!--<i class="iconfont icon-Dollar font18 icon_color"></i>-->
                  <!--<span>{{item.title}}</span>-->
                  <!--</template>-->
                  <!--<template v-for="item1 in item.childInfo">-->
                  <!--<el-menu-item :index=item1.url>{{item1.titleChild}}</el-menu-item>-->
                  <!--</template>-->
                  <!--</el-submenu>-->
                  <!--</template>-->

                  <!--此页面就只有两种选择，要么上面注释的代码为授权以前的，否则就是下面的加入授权控制后的更改-->

                  <template v-for="item in JSON.parse(this.menuList)">
                    <el-submenu :index="String(item.id)" :key="item.id">
                      <template slot="title">
                        <i class="iconfont icon-Dollar font18 icon_color"></i>
                        <span>{{item.name}}</span>
                      </template>
                      <template v-for="(item1,index) in item.child">
                        <el-menu-item :index="item1.url" :key="index">{{item1.name}}</el-menu-item>
                      </template>
                    </el-submenu>
                  </template>
                </el-menu>
              </el-col>
            </el-row>
          </div>
        </el-aside>
        <el-main id="main_div">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import { logout } from '../api/layout' 
export default {
  name: "layout",
  data() {
    return {
      state: true,
      isCollapse: false, //是否收起侧边栏导航
      menuVar: []

      // menuVar: [
      //
      //   {
      //     id: '1',
      //     name: '景区管理',
      //     children: [
      //       {
      //         name: '景区管理',
      //         url: '/scenerymanage'
      //       },
      //
      //     ]
      //   },
      //   {
      //     id: '2',
      //     name: '制作需求管理',
      //     children:[
      //       {
      //         name: '制作需求管理',
      //         url: '/makedemandmanage'
      //       },
      //     ]
      //   },
      //   {
      //     id: '3',
      //     name: '小视频管理',
      //     children:[
      //       {
      //         name: '小视频管理',
      //         url: '/smallvideomanage'
      //       },
      //     ]
      //   },
      //   {
      //     id: '4',
      //     name: '销售结算管理',
      //     children:[
      //       {
      //         name: '价格配置',
      //         url: '/pricesetmanage'
      //       },
      //       {
      //         name: '订单管理',
      //         url: '/ordermanage'
      //       },
      //       {
      //         name: '订单结算',
      //         url: '/orderclose'
      //       },
      //     ]
      //   },
      //   {
      //     id: '5',
      //     name: '用户管理',
      //     children:[
      //       {
      //         name: '用户管理',
      //         url: '/usermanage'
      //       },
      //     ]
      //   },
      //   {
      //     id: '6',
      //     name: '系统管理',
      //     children:[
      //       {
      //         name: '操作员管理',
      //         url: '/operatormanage'
      //       },
      //       {
      //         name: '菜单管理',
      //         url: '/menumanage'
      //       },
      //       {
      //         name: '角色管理',
      //         url: '/rolemanage'
      //       },
      //       {
      //         name: '系统参数',
      //         url: '/systemparams'
      //       },
      //     ]
      //   },
      //
      // ],
    };
  },
  created() {

  },
  methods: {
    ...mapActions({logout:'user/logout'}),

    // 注销
    handleLogout() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then( async () => {
          try{
            await this.logout(this.username)
            this.$router.push('/login')
          }catch(err){
            this.$router.push('/login')
          }
        })
        .catch(() => {});
    }
  },
  computed:mapGetters(['username','menuList'])
};
</script>

<style scoped>
#header_div {
  /*width:100%;*/
  height: 80px !important;
  /* background-size: cover; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 0.28rem;
  color: white;
}

.left_right {
  /*width:100%;*/
  /*border:1px solid lime;*/
  display: flex;
  flex-direction: row;
  height: 8.55rem;
  min-height: 800px;
}

#aside_div {
  width: 15% !important;
  min-width: 250px;
  background-color: rgba(32, 45, 61, 1);
}

.sidebar_box {
}

#main_div {
  width: calc(85% - 30px) !important;
  padding: 15px;
}
.title_box_style {
  /*border:1px solid red;*/
  width: 100%;
  display: flex;
  padding: 5px;
}
.title_box_style > div:first-child {
  /*border:1px solid blue;*/
  flex-grow: 1;
}
.title_box_style > div:last-child {
  /*border:1px solid green;*/
  color: white;
  font-size: 16px;
  width: 1.2rem;
  min-width: 80px;
}
.show_login_out {
  /*background-color: rgba(250,136,25,1);*/
  padding: 2px 0;
  color: red;
}
</style>
