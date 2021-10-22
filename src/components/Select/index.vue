
/* 
    景区/标签下拉框组件
    Author:朱星杰
    Date:2021/4/20
*/

<template>
  <el-select :multiple="multiple" :value="value" :value-key="valueKey" :placeholder="placeholder" @change="select">
    <el-option
      v-for="item in list"
      :key="item[valueKey]"
      :label="item[label]"
      :value="isGetObjectValue? item:item[valueKey] "
    ></el-option>
  </el-select>
</template>

<script>
import { getSceneryList } from "@/api/management/videoManage";
import { tagsSelect } from "@/api/management/systemManage";
import { queryPointList } from "@/api/management/pointManage";

export default {
  props: {
    value: {
      default: "",
    },
    placeholder: {
      default: "请选择景区名",
      type: String,
    },
    type: {
      default: "scenery",
    },
    label: {
      default: "name",
    },
    valueKey: {
      default: "id",
    },
    requestParams:{
      default:()=>{}
    },
    multiple:{
      default:false
    },
    isGetObjectValue:{
      default:false
    }
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      switch (this.type) {
        case "scenery": // 景区选择
          this.getSceneryList();
          break;
        case "tag": //标签选择
          this.getTagList();
          break;
        case "position": //点位选择
          this.getPosition() 
      }
    },

    async getSceneryList() {
      const res = await getSceneryList();
      this.list = res.data.value;
    },

    async getTagList() {
      const res = await tagsSelect({ type: 2 });
      this.list = res.data.value;
    },

    async getPosition() {
      const res = await queryPointList(this.requestParams);
      this.list = res.data.value.list;
    },

    select(value) {
      this.$emit("change", value);
    },

  },
};
</script>

<style>
</style>