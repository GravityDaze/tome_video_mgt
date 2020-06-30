<template>
  <div class="outer">
    <div class="img">
      <img src="../../assets/images/404.png" alt />
    </div>
    <div class="text">
      <h3>OOPS!</h3>
      <strong>您进入了一个不存在的页面</strong>
      <p>页面无法找到或页面丢失,请检查您输入的网址是否正确</p>
      <el-button round type="primary" @click="back">Back To Home</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      // 根据sessionStorage中保存的tabs记录获取到跳转前的path
      const editableTabsValue = sessionStorage.getItem("editableTabsValue");
      const editableTabs = JSON.parse(sessionStorage.getItem("editableTabs"));
      const backPath = editableTabs.filter(v => v.name === editableTabsValue)[0].path;
      this.$router.push(backPath);
    }
  }
};
</script>

<style lang="less" scoped>
.outer {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;

  .img {
    flex: 1;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .text {
    flex: 1;

    h3 {
      color: #1482f0;
      font-size: 28px;
    }

    strong {
      padding-bottom: 20px;
      font-size: 20px;
    }

    p {
      padding-bottom: 20px;
      color: grey;
      font-size: 14px;
    }
  }
}
</style>