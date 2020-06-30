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

<style>
/* webkit内核浏览器的滚动条样式优化 */
::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}
::-webkit-scrollbar-thumb { 
  border-radius: 5px;
  background-color: rgba(144, 147, 153, 0.3);
}
::-webkit-scrollbar-track {
  border-radius:5px;

}

html,body,#app{
  height:100%;
}

@import './assets/style/normalize.css';
</style>
