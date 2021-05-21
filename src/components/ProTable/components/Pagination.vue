<template>
  <el-pagination
    v-if="!hidePagination"
    :hide-on-single-page="hideOnSinglePage"
    background
    style="margin-top: 20px"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="pagination.num"
    :page-sizes="[5, 8, 10, 20]"
    :page-size="pagination.size"
    layout="total, sizes, prev, pager, next, jumper"
    :total.sync="pagination.total"
  ></el-pagination>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    pagination: {
      type: Object,
      default() {
        return {
          total: 20,
          size: 10,
          num: 1,
        };
      },
    },
    hidePagination: {
      type: Boolean,
      default: false,
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("numChange", val);
    },
  },
};
</script>

<style>
</style>