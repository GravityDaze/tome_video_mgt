
/* 
    景区/标签下拉框组件
    Author:朱星杰
    Date:2021/4/20
*/

<template>
  <el-select :multiple="multiple" :value="bind" :placeholder="placeholder" @change="select">
    <el-option
      v-for="item in list"
      :key="item[value]"
      :label="item[label]"
      :value="item[value]"
    ></el-option>
  </el-select>
</template>

<script>
import { getSceneryList } from "@/api/management/videoManage";
import { tagsSelect } from "@/api/management/systemManage";
export default {
  props: {
    bind: {
      default: "" | [],
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
    value: {
      default: "id",
    },
    multiple:{
      default:false
    }
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      switch (this.type) {
        case "scenery":
          this.getSceneryList();
          break;
        case "tag":
          this.getTagList();
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

    select(res) {
      this.$emit("change", res);
    },

  },
};
</script>

<style>
</style>