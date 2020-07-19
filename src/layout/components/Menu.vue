<template>
  <el-menu
    router
    mode="vertical"
    background-color="#304156"
    text-color="#FFFFFF"
    active-text-color="#409EFF"
    v-if="menuList"
  >
    <MenuTree :menuList="menuList"></MenuTree>
  </el-menu>
</template>
 
 <script>
 import MenuTree from "@/layout/components/MenuTree";
    export default {
        name:'Menu',
        components: {
 
            MenuTree,
        },
        props:{
            menuList: {
                type: Array,
                required: false
            }
        }
    }
</script>
 
<style scoped>

</style>