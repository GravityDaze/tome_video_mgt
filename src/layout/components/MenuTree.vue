/* 
    element-ui递归导航菜单子组件
    Author:朱星杰
    Date:2020/7/20
*/

<template>
  <div>
    <template v-for="menu in menuList">
      <!-- 如果当前有子菜单 -->
      <el-submenu v-if="menu.child" :index="menu.name" :key="menu.id">
        <template slot="title">
          <i :class="menu.iconStyle"></i>
          <span>{{menu.name}}</span>
        </template>
        <!-- 组件递归-->
        <MenuTree :menuList="menu.child"></MenuTree>
      </el-submenu>
      <!-- 如果没有子菜单 -->
      <el-menu-item v-else :index="menu.url" :key="menu.id">
        <i :class="menu.iconStyle"></i>
        <span>{{menu.name}}</span>
      </el-menu-item>
    </template>
  </div>
</template>
 
<script>
export default {
  name: "MenuTree",
  props: {
    menuList: {
      type: Array,
      required: false
    }
  }
};
</script>
 
<style lang="less">
/* 
   解决element-ui导航菜单无法伸缩的bug
   详见:https://segmentfault.com/q/1010000022440073
 */

.el-menu--collapse {
  .el-menu-item span,
  .el-submenu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }
  .el-submenu__icon-arrow {
    display: none;
  }
}
</style>