/* 
    顶部工具栏
    Author:朱星杰
    Date:2020/7/24
*/

<template>
  <div class="tools">
    <!-- 搜索组件 -->
    <el-autocomplete
      style="margin-left:8px"
      popper-class="my-autocomplete"
      v-model="state"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      placeholder="请输入搜索内容"
      @select="handleSelect"
      size="small"
    ></el-autocomplete>
    <!-- 全屏组件 -->
    <i @click="handleFullScreen" class="el-icon-rank"></i>
  </div>
</template>

<script>
import screenfull from "screenfull";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isFullscreen: false,
      state: "",
      res: [],
    };
  },
  computed: mapGetters(["menuList"]),
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.destroy();
  },
  methods: {
    querySearch(queryString, callback) {
      this.res = [];
      //  根据queryString匹配出菜单选项
      this.findMenu(this.menuList, queryString);
      // 调用 callback 返回建议列表的数据
      callback(this.res);
    },

    findMenu(data, qs) {
      data.forEach((v) => {
        if (!v.child) {
          // 查询是否匹配
          v.name.includes(qs) && this.res.push({ value: v.name, path: v.url });
        } else {
          this.findMenu(v.child, qs);
        }
      });
    },

    handleSelect(item) {
      this.$router.push(item.path);
    },

    // 全屏
    handleFullScreen() {
      if (!screenfull.isEnabled) {
        this.$message.warning("您的浏览器不支持全屏");
        return false;
      }
      screenfull.toggle();
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on("change", this.change);
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off("change", this.change);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tools {
  margin-right: 10px;

  i {
    cursor: pointer;
    font-size: 20px;
    margin-left: 10px;
    color:gray;
  }
}
</style>