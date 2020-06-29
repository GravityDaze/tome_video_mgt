<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    @tab-remove="removeTab"
    @tab-click="tabClick"
    style="background: #fff"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="item.close"
    ></el-tab-pane>
    <el-tooltip content="关闭所有标签" placement="top">
      <span v-show="closeFlag" @click="closeAllTags" class="el-icon-close icon"></span>
    </el-tooltip>
    <el-tooltip content="刷新" placement="top">
      <span
        @click="refresh"
        :class="{'el-icon-refresh-left':true,'icon':true,'animation':animationflag}"
      ></span>
    </el-tooltip>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      editableTabsValue: "1",
      editableTabs: [],
      tabIndex: 1,
      animationflag: false,
      closeFlag: true
    };
  },
  created() {
    //   页面初始化时获得标签状态
    this.getTagsStatus();
  },
  // 监听路由变化动态改变标签页
  watch: {
    $route(to) {
      const obj = this.editableTabs.find(item => item.path === to.path);
      if (!obj) {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: to.meta[to.meta.length - 1],
          name: newTabName,
          path: to.path,
          close: true
        });
        this.editableTabsValue = newTabName;
      } else {
        this.editableTabsValue = obj.name;
      }
      this.setTagsStatus();
    }
  },
  methods: {
    //  移除标签
    removeTab(targetName) {
      const index = this.editableTabs.findIndex(
        item => item.name === targetName
      );
      this.editableTabs.splice(index, 1);
      if (this.editableTabsValue === targetName) {
        const path = this.editableTabs[index - 1].path;
        this.$router.push(path);
      }
      this.setTagsStatus();
    },
    // 点击标签
    tabClick(e) {
      const tab = this.editableTabs.find(item => item.name === e.name);
      if (this.$route.path !== tab.path) {
        this.$router.push(tab.path);
      }
    },
    // 获取标签状态
    getTagsStatus() {
      // 获取vuex路由表保存的第一个路由
      const defaultRouter = this.$store.getters.routerMap[0].children[0]

      this.editableTabs = JSON.parse(
        window.sessionStorage.getItem("editableTabs")
      ) || [
        {
          title: defaultRouter.meta[0],
          name: "1",
          path: defaultRouter.path,
          close: false
        }
      ];
      this.tabIndex = parseInt(window.sessionStorage.getItem("tabIndex")) || 1;
      this.editableTabsValue =
        window.sessionStorage.getItem("editableTabsValue") || "1";
      this.closeFlag = !(this.editableTabs.length === 1);
    },

    // 设置标签状态
    setTagsStatus() {
      window.sessionStorage.setItem(
        "editableTabs",
        JSON.stringify(this.editableTabs)
      );
      window.sessionStorage.setItem("tabIndex", JSON.stringify(this.tabIndex));
      window.sessionStorage.setItem(
        "editableTabsValue",
        this.editableTabsValue
      );
      this.closeFlag = !(this.editableTabs.length === 1);
    },
    // 刷新
    refresh() {
      this.animationflag = true;
      this.$router.go(0);
    },
    // 关闭所有标签
    closeAllTags() {
       // 获取vuex路由表保存的第一个路由
      const defaultRouter = this.$store.getters.routerMap[0].children[0]

      if (this.editableTabs.length !== 1) {
        this.editableTabs.splice(1, this.editableTabs.length - 1);
        if (this.$route.path !== defaultRouter.path) this.$router.push(defaultRouter.path);
        this.setTagsStatus();
        this.closeFlag = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

/deep/ .el-tabs__header {
  margin: 0;
}

.el-tabs {
  display: flex;
  align-items: center;

  .icon {
    cursor: pointer;
    transition: 0.5s;
    margin-left: 10px;
    color: grey;
  }
  .animation {
    animation: rotate 0.5s linear infinite reverse;
  }
}
</style>