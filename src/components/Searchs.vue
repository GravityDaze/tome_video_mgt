/**
    2020/6/18
    原mySearchs组件封装过于臃肿,此为重新封装的版本
    参数说明:
        formData:{
            type:表单类型 可选值 input select datePicker
            label 文字说明
            model 绑定数据
            placeholder 占位符
        }


**/

<template>
  <div class="searchs">
    <div class="top-area">
        <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item :label="item.label" v-for="(item,index) in formData" :key="index">
                
                <el-input v-if="item.type === 'input'" v-model="searchForm[item.model]" :placeholder="item.placeholder"></el-input>
                
                <el-select v-if="item.type === 'select'"   v-model="searchForm[item.model]" :placeholder="item.placeholder">
                    <template v-for="option in item.options">
                        <el-option :key="option.value"  :label="option.label" :value="option.value"></el-option>
                    </template>
                </el-select>

                <el-date-picker
                    v-if="item.type === 'datePicker'"
                    v-model="searchForm[item.model]"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd"

                >
                </el-date-picker>

            </el-form-item>     

            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="bottom-tools"></div>
  </div>
</template>

<script>
export default {
    props:{
        formData:{
          type:Array,
          default:()=>{
            return []
          }
        }
    },
    data(){
        return{
            searchForm:{},
            // 带快捷选项的时间范围选择期
             pickerOptions: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            }
        }
    },
    methods:{
        query(){
            this.$emit('query',this.searchForm)
        }
    }
}
</script>

<style scoped>
.searchs {
  border: 1px solid lightgrey;
  padding:10px;
}

.el-form-item{
    margin-bottom:0;
}
</style>