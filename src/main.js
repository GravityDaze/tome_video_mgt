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
import Tables from "./components/Tables";
import Searchs from "./components/Searchs";

//注册组件(全局)
Vue.component('tables',Tables)
Vue.component('searchs',Searchs)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
