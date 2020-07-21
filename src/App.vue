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

// 去掉focus中的弹框
:focus {
  outline: 0;
}

// element-ui dialog组件全局居中 bug
// .el-dialog {
//   display: flex;
//   flex-direction: column;
//   margin: 0 !important;
//   position: absolute !important;
//   // top:0;
//   // left:0;
//   // bottom:0;
//   // right:0;
//   // margin: auto !important;
//   top: 50%;
//   left: 50%;
//   // transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
//   transform: translate(-50%, -50%) ;
//   // transform-origin: 50%  51%;
//   max-height: calc(100% - 30px);
//   max-width: calc(100% - 30px);

//   .el-dialog__body {
//     flex: 1;
//     overflow: auto;
//   }
// }

@import "./assets/style/normalize.css"; 
</style>
