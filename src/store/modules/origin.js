// 上一个前端写的旧版vuex 待重构 因各处需要调用已去除命名空间

const state = {
  //页码控制组件参数
  pageNumParam: 1,
  pageSizeParam: 10,
  totalParam: 90,
  pageNumParam2: 1,
  pageSizeParam2: 10,
  totalParam2: 66,

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

};
const actions = {};

export default {
  state,
  mutations,
  actions
};
