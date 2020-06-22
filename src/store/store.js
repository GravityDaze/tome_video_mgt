import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router";

Vue.use(Vuex);

const state = {
  //页码控制组件参数
  pageNumParam: 1,
  pageSizeParam: 10,
  totalParam: 90,
  // routes:[],
  pageNumParam2: 1,
  pageSizeParam2: 10,
  totalParam2: 66,
  //权限控制以后，获取到的菜单数据数组
  menuList: localStorage.getItem("menuList")
    ? localStorage.getItem("menuList")
    : "",
  // token
  token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
  // 用户名
  userName: localStorage.getItem("userName")
    ? localStorage.getItem("userName")
    : "",
  //模态框相关参数
  scenerymanage: false,
  scenerymanageInfo: false,
  smallVideoManage: false,
  sceneryShotTemplate: false,
  chooseNeedBox: false,
  orderManage: false,
  refundOrder: false,
  orderInfo: false,
  orderInfoTitle: "默认景区",
  userInfo: false,
  sceneryTagInfo: false, //景区标签模态框
  pointpointShow: false,
  templateListShow: false,
  systemParamSign: false, //系统参数页面新增编辑模态框
  operatorManageSign: false, //操作员管理页面新增编辑模态框
  operatorImpowerSign: false, //操作员管理页面授权模态框
  roleManageSign: false, //角色管理页面新增编辑模态框
  roleImpowerSign: false, //角色管理页面角色授权模态框
  roleFunctionImpowerSign: false, //角色管理页面功能授权模态框
  menuManageSign: false, //菜单管理页面新增编辑模态框
  tagManageSign: false, //标签管理页面新增编辑模态框
  areaManageSign: false, //区域管理页面新增编辑模态框
  cutParam: "1", //在用户管理页面，用于控制切换用户详情页和需求明细列表
  //以下是查询参数
  templateNameParam: "", //模板名称参数
  sceneryNameParam: "",
  sceneryNoParam: "",
  startTirpParam: "", //是否开启视频服务
  affiliatedSceneryParam: "",
  openIdParam: "",
  submitTimeParam: "",
  startDateParam: "",
  endDateParam: "",
  nickNameParam: "",
  needTypeParam: "",
  needStateParam: "",
  needNoParam: "", //查询需求编号
  travelSceneryParam: "", //查询行程景区
  videoNoParam: "", //查询小视频编号
  orderStateParam: "", //查询订单状态
  payStateParam: "", //查询支付状态
  yearParam: "", //查询结算年份
  monthParam: "", //查询结算月份
  stateParam: "", //查询启用禁用状态
  paramKeyParam: "", //查询参数键
  paramValueParam: "", //查询参数值
  editParam: "", //查询是否可以编辑
  loginNameParam: "", //查询登录名
  phoneParam: "", //查询手机号码
  roleNameParam: "", //查询角色名称
  authorityFlagParam: "", //查询权限标识
  tagNameParam: "", //标签名称
  tagTypeParam: "", //标签类型
  videoShareStatusParam: "", //视频发布类型
  videoTopStatusParam: "", //视频置顶状态
  videoRecommendParam: "", //视频推荐状态
  sceneryHotStatusParam: "" //进去热门状态
};
const mutations = {

  // 保存用户名
  saveUserInfo(state,name){
    localStorage.setItem("userName", name);
    state.userName = name
  },

  // 将token存入localStorage
  saveToken(state, token) {
    localStorage.setItem('token',token)
    state.token = token
    
  },

  // 登录成功后，默认获取后台返回的菜单权限数据数组，并放入缓存
  saveMenuList(state, menuList) {
    localStorage.setItem("menuList", JSON.stringify(menuList));
    state.menuList =  JSON.stringify(menuList)
  }
};
const actions = {};

export default new Vuex.Store({
  state,
  mutations,
  actions
});
