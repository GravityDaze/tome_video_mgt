// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import './router/permit'
import Vuex from "vuex";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import store from "./store/store";

//引入rem转化
// require("rem-init")({
//   psd_width: 1920
// });

// Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Vuex);
Vue.prototype.$axios = axios;
axios.defaults.baseURL =  "https://tome3pay.zhihuiquanyu.com"
console.dir(axios)
// axios.defaults.baseURL = 'https://tome3pay.zhihuiquanyu.com'
// Axios.defaults.baseURL =
//   process.env.NODE_ENV === "development"
//     ? "https://tome3pay.zhihuiquanyu.com"
//     : "https://tome3pay.zhihuiquanyu.com";
// Axios.defaults.baseURL = process.env.NODE_ENV === 'development'?'http://192.168.0.185:8080':'http://tome3pay.zhihuiquanyu.com';
// Axios.defaults.baseURL = process.env.NODE_ENV === 'development'?'http://tome3pay.zhihuiquanyu.com':'http://tome3pay.zhihuiquanyu.com';

// 引入组件
import myTables from "./components/myTables";
import mySearchs from "./components/mySearchs";
import priceSets from "./components/priceSets";
import treeviewComponent from "./components/treeviewComponent";

//注册组件(全局)
Vue.component("myTables", myTables);
Vue.component("mySearchs", mySearchs);
Vue.component("priceSets", priceSets);
Vue.component("treeviewComponent", treeviewComponent);

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem("token")) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
