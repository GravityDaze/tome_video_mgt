/* 
    通用表单组件
    Author:朱星杰
    Date:2020/6/18
*/

<template>
  <div class="searchs">
    <div class="top-area">
      <el-form size="small" :inline="true" :model="searchData" class="search-form">
        <el-form-item :label="item.label" v-for="(item,index) in formData" :key="index">
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="searchData[item.model]"
            :placeholder="item.placeholder"
          ></el-input>
          <!-- 下拉选择框 -->
          <el-select
            v-if="item.type === 'select'"
            v-model="searchData[item.model]"
            :placeholder="item.placeholder"
          >
            <template v-for="option in item.options">
              <el-option :key="option.value" :label="option.label" :value="option.value"></el-option>
            </template>
          </el-select>
          <!-- 日期时间选择器 -->
          <el-date-picker
            v-if="item.type === 'datePicker'"
            v-model="searchData[item.model]"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd"
          ></el-date-picker>

          <!-- 月选择器 -->
          <el-date-picker v-if="item.type === 'monthPicker'"  value-format="MM" v-model="searchData[item.model]" type="month" placeholder="选择月"></el-date-picker>

          <!-- 年选择器 -->
          <el-date-picker v-if="item.type === 'yearPicker'"  value-format="yyyy" v-model="searchData[item.model]" type="year" placeholder="选择年"></el-date-picker>
        </el-form-item>

        <!-- 按钮组 -->
        <el-form-item>
          <el-button
            v-for="(item,index) in searchBtn"
            :key="index"
            :type="item.type"
            @click="item.handle(searchData)"
            :icon="item.icon"
            :loading="item.loading"
          >{{item.label}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    searchBtn: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      searchData: {},
      // 带快捷选项的时间范围选择器
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  mounted() {
    // 初始化时查询数据中是否有默认值
    const defaultArr = this.formData.filter(v => v.default !== undefined);
    for (let i = 0; i < defaultArr.length; i++) {
      this.$set(this.searchData, defaultArr[i].model, defaultArr[i].default);
    }
  },
  watch:{
    // 监听默认值的变化
    formData:{
      handler(newVal) {
        for( const item of newVal ){
          if(item.default !== undefined && this.searchData[item.model] !== undefined){
              this.searchData[item.model] = item.default
          }
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.searchs {
  padding: 10px;
}
</style>