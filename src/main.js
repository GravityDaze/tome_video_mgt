import Vue from "vue";
import App from "./App";
import router from "./router";
import './router/permit'
import Vuex from "vuex";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import store from "./store"

Vue.use(ElementUI);
Vue.use(Vuex);

// 引入组件
import ProTable from "./components/ProTable";
// import Searchs from "./components/Searchs";

//全局注册注册组件
Vue.component('ProTable',ProTable)
// Vue.component('searchs',Searchs)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
