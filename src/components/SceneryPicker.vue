
/* 
    景区下拉框组件
    Author:朱星杰
    Date:2021/2/25
*/

<template>
  <el-select :value="id" :placeholder="placeholder" @change="select">
    <el-option
      v-for="item in sceneryList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
import { getSceneryList } from "@/api/management/videoManage";
export default {
    props:{
        id:{
            default:""
        },
        placeholder:{
            default:"请选择景区名",
            type:String
        }
    },
    data(){
        return{
            sceneryList:[]
        }
    },
    created(){
        this.getList()
    },
    methods:{
        async getList(){
            const res = await getSceneryList()
            this.sceneryList = res.data.value
        },
        select(id){
            console.log(id)
            this.$emit( 'change',id )
        }
    }
};
</script>

<style>
</style>