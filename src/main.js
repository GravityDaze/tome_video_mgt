import Vue from "vue";
import App from "./App";
import router from "./router";
import './router/permit'
import Vuex from "vuex";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import store from "./store" 


// NProgress.configure({     
//   easing: 'ease',  // 动画方式    
//   speed: 500,  // 递增进度条的速度    
//   showSpinner: false, // 是否显示加载ico    
//   trickleSpeed: 200, // 自动递增间隔    
//   minimum: 0.3 // 初始化时的最小百分比
// })

//引入rem转化
// require("rem-init")({
//   psd_width: 1920
// });


Vue.use(ElementUI);
Vue.use(Vuex);
Vue.prototype.$axios = axios;

// baseURL  ( 待废除 see request.js 2020/6/24) 
axios.defaults.baseURL =  "https://tome3pay.zhihuiquanyu.com"


// 引入组件
import myTables from "./components/myTables";
import mySearchs from "./components/mySearchs";
import priceSets from "./components/priceSets";
import treeviewComponent from "./components/treeviewComponent";
import Tables from "./components/Tables";
import Searchs from "./components/Searchs";

//注册组件(全局)
Vue.component("myTables", myTables);
Vue.component("mySearchs", mySearchs);
Vue.component("priceSets", priceSets);
Vue.component("treeviewComponent", treeviewComponent);
Vue.component('tables',Tables)
Vue.component('searchs',Searchs)

// 添加请求拦截器，在请求头中加token (待废除 see request.js 2020/6/24)
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
