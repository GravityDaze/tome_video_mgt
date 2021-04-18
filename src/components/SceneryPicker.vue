
/* 
    景区下拉框组件
    Author:朱星杰
    Date:2021/2/25
*/

<template>
  <el-select :value="id" :placeholder="placeholder" @change="select">
    <el-option
      v-for="item in list"
      :key="item[ value ]"
      :label="item[ label ]"
      :value="item[ value ]"
    ></el-option>
  </el-select>
</template>

<script>
import { getSceneryList } from "@/api/management/videoManage";
import { tagsSelect } from "@/api/management/systemManage"
export default {
    props:{
        id:{
            default:""
        },
        placeholder:{
            default:"请选择景区名",
            type:String
        },
        type:{
            default:""
        },
        label:{
            default:"name"
        },
        value:{
            default:"id"
        }
    },
    data(){
        return{
            list:[]
        }
    },
    created(){
        this.getList()
    },
    methods:{
        async getList(){
            if( this.type !== 'tag' ){
                const res = await getSceneryList()
                this.list = res.data.value
            }else{
                const res = await tagsSelect({type:2})
                this.list = res.data.value
            }
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