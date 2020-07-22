/* 
    element-ui导航菜单组件
    Author:朱星杰
    Date:2020/7/20
*/
<template>
  <el-menu
    router
    :default-active="$route.path"
    mode="vertical"
    background-color="#304156"
    text-color="#FFFFFF"
    active-text-color="#409EFF"
    unique-opened
    :collapse-transition="false"
    class="el-menu"
    :collapse="isCollapse"
  >
    <MenuTree :menuList="menuList"></MenuTree>
  </el-menu>
</template>
 
 <script>
 import { mapGetters } from 'vuex'
 import MenuTree from "@/layout/components/MenuTree";
    export default {
        name:'Menu',
        computed:mapGetters(['isCollapse','menuList']),
        components: {
            MenuTree,
        }
    }
</script>
 
<style scoped>
.el-menu{
  border:0;
  overflow: hidden;
}
</style>