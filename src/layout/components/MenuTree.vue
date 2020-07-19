<template>
    <div>
 
    <template v-for='menu in menuList'>
        <!-- 如果当前有子菜单，则显示 el-submenu ，在el-subment 里调用 递归组件 -->
        <el-submenu
                v-if='menu.child'
                :index='menu.name'
                :key="menu.id"
        >
            <template slot="title" >
                <i :class="menu.iconStyle"></i>
                {{menu.name}}
            </template>
            <!-- 调用自身  此处是重点-->
            <MenuTree :menuList='menu.child'></MenuTree>
 
        </el-submenu>
        <!-- 如果没有子菜单，则显示当前内容 -->
        <el-menu-item
                v-else
                :index='menu.url'
                :key='menu.id'
        >
            <i :class="menu.iconStyle"></i>
            {{menu.name}}
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
    }
</script>
 
<style scoped>
 
</style>