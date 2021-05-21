<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
/* webkit内核浏览器的滚动条样式修改 */
::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(144, 147, 153, 0.3);
}
::-webkit-scrollbar-track {
  border-radius: 5px;
}

// 全屏窗口
html,
body,
#app {
  height: 100%;
}

// 去掉focus的outline
:focus {
  outline: 0;
}

.dialog-vertical {
  display: flex;
  padding: 20px;
  .el-dialog {
    margin: auto !important;
  }
}

@import "./assets/style/normalize.css"; 
</style>
