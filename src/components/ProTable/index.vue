/* 
    通用表格组件
    Author:朱星杰
    Date:2021/4/22
*/

<template>
  <div class="pro-table">
    <Searchs v-bind="$attrs" />
    <Table v-bind="$attrs" v-on="$listeners" />
    <Pagination v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
import Searchs from "./components/Searchs";
import Table from "./components/Table";
import Pagination from "./components/Pagination";
export default {
  inheritAttrs: true,
  components: {
    Searchs,
    Table,
    Pagination,
  },
};
</script>