<template>
  <div>
    <div class="tool_bar">
      <el-row :gutter="10" class="tool_left">
        <el-col :span="6" v-if="isLoginName">
          <div class="line_box">
            <span>登录名</span>
            <el-input v-model="allParams.loginName" placeholder="请输入用户登录名"></el-input>
          </div>
        </el-col>

        <el-col :span="6" v-if="isSceneryName">
          <div class="line_box">
            <span>景区名称</span>
            <el-input v-model="allParams.sceneryName" placeholder="请输入景区名称"></el-input>
          </div>
        </el-col>

        <el-col :span="6" v-if="isSceneryNum">
          <div class="line_box">
            <span>景区编号</span>
            <el-input v-model="allParams.sceneryNo" placeholder="请输入景区编号"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isHot">
          <div class="line_box">
            <span>是否热门</span>

            <el-select v-model="allParams.sceneryHotStatus" size="small" class="change_select_style">
              <el-option
                v-for="item in sceneryHotStatusArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" v-if="isEnabledVideo">
          <div class="line_box">
            <span>启用视频服务</span>

            <el-select v-model="allParams.videoOpenType" size="small" class="change_select_style">
              <el-option
                v-for="item in videoServiceArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" v-if="isAffiliatedScenery">
          <div class="line_box">
            <span>所属景区</span>
            <el-input v-model="allParams.affiliatedScenery" placeholder="请输入景区名称"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isUserOpenId">
          <div class="line_box">
            <span>用户OpenId</span>
            <el-input v-model="allParams.openId" placeholder="请输入用户OpenId"></el-input>
          </div>
        </el-col>

        <el-col :span="6" v-if="isTemplateName">
          <div class="line_box">
            <span>模板名称</span>
            <el-input v-model="allParams.templateName" placeholder="请输入模板名称"></el-input>
          </div>
        </el-col>
        <el-col :span = "6" v-if="isTagName">
          <div class="line_box">
            <span>标签名称</span>
            <el-input v-model="allParams.tagName" placeholder="请输入标签名称"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isUserNickName">
          <div class="line_box">
            <span>用户昵称</span>
            <el-input v-model="allParams.nickName" placeholder="请输入用户昵称"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isShare">
          <div class="line_box">
            <span>是否发布</span>
            <el-select v-model="allParams.shareStatus" size="small" class="change_select_style">
              <el-option
                v-for="item in shareStatusArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" v-if="isRecommend">
          <div class="line_box">
            <span>是否推荐</span>
            <el-select v-model="allParams.recommend" size="small" class="change_select_style">
              <el-option
                v-for="item in recommendArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" v-if="isTop">
          <div class="line_box">
            <span>是否置顶</span>
            <el-select v-model="allParams.topStatus" size="small" class="change_select_style">
              <el-option
                v-for="item in topStatusArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" v-if="isPhoneNum">
          <div class="line_box">
            <span>手机号</span>
            <el-input v-model="allParams.phone" placeholder="请输入手机号码"></el-input>
          </div>
        </el-col>
        <el-col :span="8" v-if="isSubmitTime">
          <div class="line_box">
            <span>提交时间</span>
            <!--<el-input v-model="allParams.searchIfInfo" placeholder="请输入对应信息"></el-input>-->
            <el-date-picker
              v-model="allParams.submitTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </div>
        </el-col>

        <el-col :span="8" v-if="isMakeSearchTime">
          <div class="line_box">
            <span>搜索时间</span>
            <!--<el-date-picker-->
            <!--v-model="allParams.makeTime"-->
            <!--type="datetimerange"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--:default-time="['12:00:00']"-->
            <!--value-format="yyyy-MM-dd HH:mm:ss"-->
            <!--&gt;-->
            <!--</el-date-picker>-->

            <el-date-picker
              v-model="allParams.makeSearchTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker>

          </div>
        </el-col>

        <el-col :span="8" v-if="isMakeTime">
          <div class="line_box">
            <span>制作时间</span>
            <!--<el-date-picker-->
            <!--v-model="allParams.makeTime"-->
            <!--type="datetimerange"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--:default-time="['12:00:00']"-->
            <!--value-format="yyyy-MM-dd HH:mm:ss"-->
            <!--&gt;-->
            <!--</el-date-picker>-->

            <el-date-picker
              v-model="allParams.makeTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker>

          </div>
        </el-col>

        <el-col :span="6" v-if="isDemandType">
          <div class="line_box">
            <span>需求类型</span>
            <el-select v-model="allParams.needType" size="small" class="change_select_style">
              <el-option
                v-for="item in needTypeArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" v-if="isTagType">
          <div class="line_box">
            <span>标签类型</span>
            <el-select v-model="allParams.tagType" size="small" class="change_select_style">
              <el-option
                v-for="item in tagTypeArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" v-if="isDemandState">
          <div class="line_box">
            <span>需求状态</span>
            <el-select v-model="allParams.needState" size="small" class="change_select_style">
              <el-option
                v-for="item in needStateArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" v-if="isDemandNum">
          <div class="line_box">
            <span>需求编号</span>
            <el-input v-model="allParams.needNo" placeholder="请输入需求编号"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isTravelScenery">
          <div class="line_box">
            <span>行程景区</span>
            <el-input v-model="allParams.travelScenery" placeholder="请输入景区"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isVideoNum">
          <div class="line_box">
            <span>小视频编号</span>
            <el-input v-model="allParams.videoNo" placeholder="请输入小视频编号"></el-input>
          </div>
        </el-col>
        <el-col :span="8" v-if="isOrderTime">
          <div class="line_box">
            <span>下单时间</span>
            <!--<el-input v-model="allParams.searchIfInfo" placeholder="请输入对应信息"></el-input>-->
            <el-date-picker
              v-model="allParams.orderTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker>

          </div>
        </el-col>
        <el-col :span="6" v-if="isOrderState">
          <div class="line_box">
            <span>订单状态</span>
            <!--<el-input v-model="allParams.searchIfInfo" placeholder="请输入对应信息"></el-input>-->

            <el-select v-model="allParams.orderState" size="small" class="change_select_style">
              <el-option
                v-for="item in orderStateArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>

          </div>
        </el-col>
        <el-col :span="6" v-if="isPayState">
          <div class="line_box">
            <span>支付状态</span>
            <!--<el-input v-model="allParams.searchIfInfo" placeholder="请输入对应信息"></el-input>-->
            <el-select v-model="allParams.payState" size="small" class="change_select_style">
              <el-option
                v-for="item in payStateArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>


          </div>
        </el-col>
        <el-col :span="6" v-if="isCloseYear">
          <div class="line_box">
            <span>结算年份</span>
            <!--<el-input v-model="allParams.searchIfInfo" placeholder="请输入对应信息"></el-input>-->
            <el-select v-model="allParams.year" size="small" class="change_select_style">
              <el-option
                v-for="item in yearsArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" v-if="isCloseMonth">
          <div class="line_box">
            <span>结算月份</span>
            <!--<el-input v-model="allParams.searchIfInfo" placeholder="请输入对应信息"></el-input>-->
            <el-select v-model="allParams.month" size="small" class="change_select_style">
              <el-option
                v-for="item in monthsArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>

          </div>
        </el-col>
        <el-col :span="8" v-if="isRegisterTime">
          <div class="line_box">
            <span>注册时间</span>
            <!--<el-input v-model="allParams.searchIfInfo" placeholder="请输入对应信息"></el-input>-->
            <el-date-picker
              v-model="allParams.registerTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker>

          </div>
        </el-col>
        <el-col :span="6" v-if="isRoleName">
          <div class="line_box">
            <span>角色名称</span>
            <el-input v-model="allParams.roleName" placeholder="请输入角色名称"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isAuthorityFlag">
          <div class="line_box">
            <span>权限标识</span>
            <el-input v-model="allParams.authorityFlag" placeholder="请输入权限标识"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isState">
          <div class="line_box">
            <span>状态</span>
            <!--<el-input v-model="allParams.searchIfInfo" placeholder="请输入对应信息"></el-input>-->
            <el-select v-model="allParams.state" size="small" class="change_select_style">
              <el-option
                v-for="item in stateArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" v-if="isOrganizationName">
          <div class="line_box">
            <span>机构名称</span>
            <el-input v-model="allParams.searchIfInfo" placeholder="请输入机构名称"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isParamKey">
          <div class="line_box">
            <span>参数键</span>
            <el-input v-model="allParams.paramKey" placeholder="请输入参数键"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isParamValue">
          <div class="line_box">
            <span>参数值</span>
            <el-input v-model="allParams.paramValue" placeholder="请输入参数值"></el-input>
          </div>
        </el-col>
        <el-col :span="6" v-if="isCanEdit">
          <div class="line_box">
            <span>编辑</span>
            <!--<el-input v-model="allParams.searchIfInfo" placeholder="请输入对应信息"></el-input>-->
            <el-select v-model="allParams.edit" size="small" class="change_select_style">
              <el-option
                v-for="item in editArr"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>

      <div class="search_btn my_hover" v-if="!showSearchBtn" @click="queryInfoFn()"><span>查询</span></div>
    </div>
    <div class="btn_arr">
      <div class="btn1 my_hover" v-if="addBtn" @click="addFn('新增')">
        <span>新增</span>
      </div>
      <div class="btn1 my_hover" v-if="addBtn2" @click="addFn2('新增')">
        <span>新增</span>
      </div>
      <div class="btn2 my_hover" v-if="editBtn" @click="editFn('编辑')">
        <span>编辑</span>
      </div>
      <div class="btn2 my_hover" v-if="editBtn2" @click="editFn2('编辑')">
        <span>编辑</span>
      </div>


      <div class="btn3 my_hover" v-if="setHot" @click="setHotFn">
        <span>设为热门</span>
      </div>
      <div class="btn3 my_hover" v-if="cancelHot" @click="cancelHotFn">
        <span>取消热门</span>
      </div>

      <div class="btn3 my_hover" v-if="setTop" @click="setTopFn">
        <span>置顶</span>
      </div>
      <div class="btn3 my_hover" v-if="cancelTop" @click="cancelTopFn">
        <span>取消置顶</span>
      </div>
      <div class="btn3 my_hover" v-if="setRecommendBtn" @click="setRecommendFn">
        <span>推荐</span>
      </div>
      <div class="btn3 my_hover" v-if="cancelRecommendBtn" @click="cancelRecommendFn">
        <span>取消推荐</span>
      </div>

      <div class="btn3 my_hover" v-if="openVideoBtn" @click="openVideoFn()">
        <span>开启视频服务</span>
      </div>
      <div class="btn4 my_hover" v-if="closeVideoBtn" @click="closeVideoFn()">
        <span>关闭视频服务</span>
      </div>
      <div class="btn4 my_hover" v-if="tagBtn" @click="tagFn('标签')">
        <span>标签</span>
      </div>
      <div class="btn5 my_hover" v-if="changePayStateBtn" @click="changePayStateFn()">
        <span>修改支付状态</span>
      </div>
      <div class="btn6 my_hover" v-if="refundBtn" @click="refundOrderFn()">
        <span>退款</span>
      </div>
      <div class="btn7 my_hover" v-if="enabledBtn" @click="enabledFn()">
        <span>启用</span>
      </div>

      <div class="btn7 my_hover" v-if="enabledBtn2" @click="enabledFn2()">
        <span>启用</span>
      </div>
      <!-- 模板启用禁用操作按钮 -->
      <div class="btn7 my_hover" v-if="enabledTempleteBtn" @click="enabledTempleteFn()">
        <span>启用</span>
      </div>
      <div class="btn8 my_hover" v-if="disabledTempleteBtn" @click="disabledTempleteFn()">
        <span>禁用</span>
      </div>

      <div class="btn8 my_hover" v-if="disabledBtn" @click="disabledFn()">
        <span>禁用</span>
      </div>

      <div class="btn8 my_hover" v-if="disabledBtn2" @click="disabledFn2()">
        <span>禁用</span>
      </div>

      <div class="btn9 my_hover" v-if="abandonBtn" @click="abandonFn()">
        <span>弃用</span>
      </div>
      <div class="btn8 my_hover" v-if="impowerBtn" @click="getImpowerInfoFn()">
        <span>授权</span>
      </div>
      <div class="btn8 my_hover" v-if="impowerSceneryBtn">
        <span>授权景区</span>
      </div>
      <div class="btn8 my_hover" v-if="resetPsdBtn" @click="resetPsdFn()">
        <span>重置密码</span>
      </div>
      <div class="btn8 my_hover" v-if="roleImpowerBtn" @click="roleImpowerFn()">
        <span>角色授权</span>
      </div>
      <div class="btn8 my_hover" v-if="functionImpowerBtn" @click="getChooseFunctionInfos()">
        <span>功能授权</span>
      </div>
      <div class="btn8 my_hover" v-if="RedisBtn" @click="sureRedisFn()">
        <span>同步Redis</span>
      </div>
      <div class="btn8 my_hover" :class="'color_btn1'+$store.state.cutParam" v-if="userInfoBtn" style="text-align: center" @click="changeNum('1')">
        <span>用户信息</span>
      </div>
      <div class="btn8 my_hover" :class="'color_btn2'+$store.state.cutParam" v-if="needInfoBtn" style="text-align: center" @click="changeNum('2')">
        <span>需求明细</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "my-searchs",
    data() {
      return {
        allParams: {
          sceneryName: '',
          affiliatedScenery: '',
          openId: '',
          sceneryNo: '',
          submitTime: '',//提交时间
          nickName: '',//昵称
          templateName:'',//模板名称
          searchIfInfo: '',
          videoOpenType: '',
          needType: '',//需求类型
          needState: '',//需求
          makeTime: '',
          makeSearchTime:'',
          videoNo:'',//小视频编号
          orderTime: '',
          orderState: '',
          payState: '',
          needNo:'',
          travelScenery:'',//行程景区
          year: '',
          month: '',
          registerTime: '',
          state: '',
          paramKey:'',
          paramValue:'',
          edit:'',
          loginName:'',
          phone:'',
          roleName:'',
          authorityFlag:'',//权限标识
          tagName:'',// 标签名称
          tagType:'',//标签类型
          shareStatus:'',//视频是否发布
          topStatus:'',//视频是否置顶
          recommend:'',//视频是否是推荐视频
          sceneryHotStatus: ''//景区是否是热门景区
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        sceneryHotStatusArr: [
          {
            'id': 9,
            'name': '全部',
            'value': '',
          },
          {
            'id': 0,
            'name': '否',
            'value': '0',
          },
          {
            'id': 1,
            'name': '是',
            'value': '1',
          }
        ],
        recommendArr: [
          {
            'id': 9,
            'name': '全部',
            'value': '',
          },
          {
            'id': 1,
            'name': '推荐',
            'value': '1',
          }
        ],
        topStatusArr: [
          {
            'id': 9,
            'name': '全部',
            'value': '',
          },
          {
            'id': 0,
            'name': '未置顶',
            'value': '0',
          },
          {
            'id': 1,
            'name': '已置顶',
            'value': '1',
          }
        ],
        shareStatusArr: [
          {
            'id': 9,
            'name': '全部',
            'value': '',
          },
          {
            'id': 0,
            'name': '未发布',
            'value': '0',
          },
          {
            'id': 1,
            'name': '已发布',
            'value': '1',
          }
        ],
        tagTypeArr: [
          {
            'id': 9,
            'name': '全部',
            'value': '',
          },
          {
            'id': 0,
            'name': '景区标签',
            'value': '1',
          }
        ],
        videoServiceArr: [
          {
            'id': 9,
            'name': '全部',
            'value': '',
          },
          {
            'id': 0,
            'name': '关闭',
            'value': '0',
          },
          {
            'id': 1,
            'name': '开启',
            'value': '1',
          },
        ],
        needTypeArr: [
          {
            'id': 9,
            'name': '全部',
            'value': '',
          },
          {
            'id': 1,
            'name': '标准制作',
            'value': '1',
          },
          {
            'id': 2,
            'name': '定制合成',
            'value': '2',
          },
        ],
        needStateArr: [
          {
            'id': 9,
            'name': '全部',
            'value': '',
          },
          {
            'id': 0,
            'name': '等待合成',
            'value': '0',
          },
          {
            'id': 1,
            'name': '正在合成',
            'value': '1',
          },
          {
            'id': 2,
            'name': '合成成功',
            'value': '2',
          },
          {
            'id': 3,
            'name': '合成失败',
            'value': '3',
          }
        ],
        orderStateArr: [
          {
            'id': 9,
            'name': '全部',
            'value': '',
          },
          {
            'id': 0,
            'name': '未支付',
            'value': '0',
          },
          {
            'id': 1,
            'name': '已完成',
            'value': '1',
          },
        ],
        payStateArr: [
          {
            'id': 9,
            'name': '全部',
            'value': '',
          },
          {
            'id': 0,
            'name': '未支付',
            'value': '0',
          },
          {
            'id': 1,
            'name': '已支付',
            'value': '1',
          },
        ],
        yearsArr: [
          {
            'id': 999,
            'name': '全部',
            'value': '',
          },
          {
            'id': 2019,
            'name': '2019',
            'value': '2019',
          },
          {
            'id': 2020,
            'name': '2020',
            'value': '2020',
          },
          {
            'id': 2021,
            'name': '2021',
            'value': '2021',
          },
          {
            'id': 2022,
            'name': '2022',
            'value': '2022',
          },
          {
            'id': 2023,
            'name': '2023',
            'value': '2023',
          },
          {
            'id': 2024,
            'name': '2024',
            'value': '2024',
          },
          {
            'id': 2025,
            'name': '2025',
            'value': '2025',
          },
          {
            'id': 2026,
            'name': '2026',
            'value': '2026',
          },
          {
            'id': 2027,
            'name': '2027',
            'value': '2027',
          },
          {
            'id': 2028,
            'name': '2028',
            'value': '2028',
          },
          {
            'id': 2029,
            'name': '2029',
            'value': '2029',
          },
          {
            'id': 2030,
            'name': '2030',
            'value': '2030',
          },
        ],
        monthsArr: [
          {
            'id': 999,
            'name': '全部',
            'value': '',
          },
          {
            'id': 1,
            'name': '1月',
            'value': '1',
          },
          {
            'id': 2,
            'name': '2月',
            'value': '2',
          },
          {
            'id': 3,
            'name': '3月',
            'value': '3',
          },
          {
            'id': 4,
            'name': '4月',
            'value': '4',
          },
          {
            'id': 5,
            'name': '5月',
            'value': '5',
          },
          {
            'id': 6,
            'name': '6月',
            'value': '6',
          },
          {
            'id': 7,
            'name': '7月',
            'value': '7',
          },
          {
            'id': 8,
            'name': '8月',
            'value': '8',
          },
          {
            'id': 9,
            'name': '9月',
            'value': '9',
          },
          {
            'id': 10,
            'name': '10月',
            'value': '10',
          },
          {
            'id': 11,
            'name': '11月',
            'value': '11',
          },
          {
            'id': 12,
            'name': '12月',
            'value': '12',
          },
        ],
        stateArr: [
          {
            id: 9,
            name: '全部',
            value: '',
          },
          {
            id: 0,
            name: '禁用',
            value: '0',
          },
          {
            id: 1,
            name: '启用',
            value: '1',
          },
        ],
        editArr: [
          {
            id: 9,
            name: '全部',
            value: '',
          },
          {
            id: 0,
            name: '不可编辑',
            value: '0',
          },
          {
            id: 1,
            name: '可编辑',
            value: '1',
          },
        ]
      }
    },
    props: ['showMysearchsParam','sign','isLoginName', 'isSceneryName', 'isSceneryNum', 'isEnabledVideo', 
    'isAffiliatedScenery', 'isUserOpenId', 'isTemplateName','isUserNickName', 'isPhoneNum', 'isSubmitTime', 
    'isMakeSearchTime','isMakeTime', 'isDemandType', 'isDemandState', 'isDemandNum', 'isTravelScenery', 
    'isVideoNum', 'isOrderTime', 'isOrderState', 'isPayState', 'isCloseYear', 'isCloseMonth', 'isRegisterTime', 
    'isState', 'isOrganizationName', 'isRoleName', 'isAuthorityFlag', 'isParamKey', 'isParamValue', 'isCanEdit', 
    'showSearchBtn', 'addBtn','addBtn2', 'editBtn','editBtn2','setHot','cancelHot','setTop','cancelTop', 'openVideoBtn', 
    'closeVideoBtn', 'changePayStateBtn', 'refundBtn', 'enabledBtn','enabledBtn2', 'disabledBtn','disabledBtn2', 
    'abandonBtn', 'impowerBtn', 'impowerSceneryBtn', 'resetPsdBtn', 'roleImpowerBtn', 'functionImpowerBtn', 'RedisBtn', 
    'userInfoBtn', 'needInfoBtn', 'isTagName', 'isTagType', 'isShare', 'isTop', 'isRecommend','setRecommendBtn', 'cancelRecommendBtn',
    'tagBtn', 'enabledTempleteBtn', 'disabledTempleteBtn', 'isHot'],
    mounted(){
      for(let item in this.allParams){
        this.allParams[item] = ''
      }
    },
    methods: {
      queryInfoFn() {

        this.$store.state.tagNameParam = this.allParams.tagName //标签名称搜索
        this.$store.state.templateNameParam = this.allParams.templateName
        this.$store.state.sceneryNameParam = this.allParams.sceneryName
        this.$store.state.sceneryNoParam = this.allParams.sceneryNo
        this.$store.state.affiliatedSceneryParam = this.allParams.affiliatedScenery
        this.$store.state.openIdParam = this.allParams.openId
        this.$store.state.paramKeyParam = this.allParams.paramKey
        this.$store.state.paramValueParam = this.allParams.paramValue
        this.$store.state.loginNameParam = this.allParams.loginName
        this.$store.state.phoneParam = this.allParams.phone
        this.$store.state.roleNameParam = this.allParams.roleName
        this.$store.state.authorityFlagParam = this.allParams.authorityFlag

        this.$store.state.nickNameParam = this.allParams.nickName
        this.$store.state.needNoParam = this.allParams.needNo
        this.$store.state.travelSceneryParam = this.allParams.travelScenery

        this.$store.state.videoNoParam = this.allParams.videoNo


        // this.$store.state.submitTimeParam = this.allParams.submitTime
        if(this.allParams.submitTime&& this.sign === 'makedemandmanage'){

          this.$store.state.startDateParam = this.allParams.submitTime[0]
          this.$store.state.endDateParam = this.allParams.submitTime[1]

        }else if(this.allParams.makeTime && this.sign === 'smallvideomanage') {

          this.$store.state.startDateParam = this.allParams.makeTime[0]
          this.$store.state.endDateParam = this.allParams.makeTime[1]

        }else if(this.allParams.makeSearchTime && this.sign === 'sceneryshottemplate') {

          this.$store.state.startDateParam = this.allParams.makeSearchTime[0]
          this.$store.state.endDateParam = this.allParams.makeSearchTime[1]

        }else if(this.allParams.orderTime && this.sign === 'ordermanage'){

          this.$store.state.startDateParam = this.allParams.orderTime[0]
          this.$store.state.endDateParam = this.allParams.orderTime[1]

        } else if(this.allParams.registerTime && this.sign === 'usermanage'){

          this.$store.state.startDateParam = this.allParams.registerTime[0]
          this.$store.state.endDateParam = this.allParams.registerTime[1]

        } else {
          this.$store.state.startDateParam = ''
          this.$store.state.endDateParam = ''
        }


        if (this.allParams.videoOpenType == '9') {
          this.$store.state.startTirpParam = ''
        } else {
          this.$store.state.startTirpParam = this.allParams.videoOpenType
        }
        if (this.allParams.sceneryHotStatus == '9') {
          this.$store.state.sceneryHotStatusParam = ''
        } else {
          this.$store.state.sceneryHotStatusParam = this.allParams.sceneryHotStatus
        }
        if (this.allParams.needType == '9') {
          this.$store.state.needTypeParam = ''
        } else {
          this.$store.state.needTypeParam = this.allParams.needType
        }
        if (this.allParams.needState == '9') {
          this.$store.state.needStateParam = ''
        } else {
          this.$store.state.needStateParam = this.allParams.needState
        }

        if (this.allParams.orderState == '9') {
          this.$store.state.orderStateParam = ''
        } else {
          this.$store.state.orderStateParam = this.allParams.orderState
        }


        if (this.allParams.state == '9') {
          this.$store.state.stateParam = ''
        } else {
          this.$store.state.stateParam = this.allParams.state
        }


        if (this.allParams.edit == '9') {
          this.$store.state.editParam = ''
        } else {
          this.$store.state.editParam = this.allParams.edit
        }


        if (this.allParams.payState == '9') {
          this.$store.state.payStateParam = ''
        } else {
          this.$store.state.payStateParam = this.allParams.payState
        }

        //标签类型
        if (this.allParams.tagType == '9') {
          this.$store.state.tagTypeParam = ''
        } else {
          this.$store.state.tagTypeParam = this.allParams.tagType
        }

        //视频发布类型
        if (this.allParams.shareStatus == '9') {
          this.$store.state.videoShareStatusParam = ''
        } else {
          this.$store.state.videoShareStatusParam = this.allParams.shareStatus
        }

        //视频置顶状态
        if (this.allParams.topStatus == '9') {
          this.$store.state.videoTopStatusParam = ''
        } else {
          this.$store.state.videoTopStatusParam = this.allParams.topStatus
        }

        //视频推荐状态
        if (this.allParams.recommend == '9') {
          this.$store.state.videoRecommendParam = ''
        } else {
          this.$store.state.videoRecommendParam = this.allParams.recommend
        }

        if (this.allParams.year == '999') {
          this.$store.state.yearParam = ''
        } else {
          this.$store.state.yearParam = this.allParams.year
        }

        if (this.allParams.month == '999') {
          this.$store.state.monthParam = ''
        } else {
          this.$store.state.monthParam = this.allParams.month
        }


        if(!this.showMysearchsParam){

          this.$store.state.pageNumParam = 1

          this.$emit('queryInfoFn')

        }else if(this.showMysearchsParam){

          this.$store.state.pageNumParam2 = 1

          this.$emit('queryInfoFn2')

        }

      },

      addFn(n) {
        this.$store.state.titleHeader = n
        this.$emit('beforeAddFn', n)
        // if(this.sign === 'scenerymanage'){
        //   this.$store.state.scenerymanage = true
        // }
      },
      addFn2(n) {
        this.$store.state.titleHeader = n
        this.$emit('beforeAddFn2', n)

      },
      tagFn(n) {
        this.$store.state.titleHeader = n
        this.$emit('tagSelectFn', n)
      },
      editFn(n) {
        this.$store.state.titleHeader = n
        this.$emit('beforeEditFn', n)
      },
      editFn2(n) { 
        this.$store.state.titleHeader = n
        this.$emit('beforeEditFn2', n)
      },
      openVideoFn() {
        this.$confirm('确定要开启视频服务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行');
          this.$emit('openVideo')
        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })

      },
      closeVideoFn() {
        this.$confirm('确定要关闭视频服务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行');
          this.$emit('closeVideo')
        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })
      },
      changePayStateFn() {
        this.$emit('changePayStateFn')
      },
      refundOrderFn() {
        this.$emit('refundOrderFn')
      },
      enabledFn() {
        this.$confirm('确定要执行启用操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行')

          this.$emit('enabledFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })
      },
      enabledFn2() {
        this.$confirm('确定要执行启用操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行')

          this.$emit('enabledFn2')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })
      },
      enabledTempleteFn() {
        this.$confirm('启用此模板，将会通知发布至AI视频服务器，是否启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行')

          this.$emit('enabledTempleteFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })
      },
      disabledTempleteFn() {
        this.$confirm('禁用此模板，将会通知发布至AI视频服务器，是否禁用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行')

          this.$emit('disabledTempleteFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })
      },
      disabledFn() {
        this.$confirm('确定要执行禁用操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行');

          this.$emit('disabledFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })
      },
      disabledFn2() {
        this.$confirm('确定要执行禁用操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行');

          this.$emit('disabledFn2')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })
      },

      abandonFn(){

        this.$confirm('确定要执行弃用操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行');

          this.$emit('abandonFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })

      },


      getImpowerInfoFn(){

        this.$emit('getImpowerInfoFn')

      },

      resetPsdFn(){

        this.$confirm('确定需要重置密码吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行');

          this.$emit('resetPsdFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })

      },

      roleImpowerFn(){

        this.$emit('getChooseRoleInfos')

      },

      getChooseFunctionInfos(){

        this.$emit('getChooseFunctionInfos')

      },

      sureRedisFn(){

        this.$confirm('确定同步到Redis吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行');

          this.$emit('sureRedisFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })

      }
      ,
      changeNum(n) {
        // alert(n)
        this.$store.state.cutParam = n
      },
      //新增的四个方法，分别为设置及取消热门，置顶及取消置顶
      setHotFn(){

        this.$confirm('确定将该景区设置为热门吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行')

          this.$emit('setHotFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })

      },
      cancelHotFn(){

        this.$confirm('确定取消该景区热门吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行')

          this.$emit('cancelHotFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })

      },
      setTopFn(){

        this.$confirm('确定将该视频置顶吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行')

          this.$emit('setTopFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })

      },
      cancelTopFn(){

        this.$confirm('确定取消该视频的置顶吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行')

          this.$emit('cancelTopFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })

      },
      // 设置视频推荐状态
      setRecommendFn(){

        this.$confirm('确定将该视频作为推荐视频吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行')

          this.$emit('setRecommendFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })

      },
      // 取消视频推荐
      cancelRecommendFn(){

        this.$confirm('确定取消该视频的推荐吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // alert('确定执行')

          this.$emit('cancelRecommendFn')

        }).catch(() => {
          this.$message.warning('本次操作已取消')
        })

      }
    }
  }
</script>

<style scoped>
  .tool_bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

  }

  .tool_left {
    /*border:1px solid lightgrey;*/
    width: 90%;
    margin: 0 !important;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;
  }

  .line_box {
    display: flex;
    flex-direction: row;
    padding: 8px 5px;

  }

  .line_box > span {
    width: 0.8rem;
    min-width: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

  }

  .line_box > .el-input {
    /*display: inline-block;*/
  }

  .search_btn {
    /*border:1px solid red;*/
    width: 10%;
    min-width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search_btn > span {
    padding: 5px 20px;
    border: 1px solid #FA8819;
    background-color: #FA8819;
    border-radius: 5px;
  }

  .btn_arr {
    border-top: 1px solid lightgrey;
    /*width:calc(100% - 20px);*/
    display: flex;
    flex-direction: row;
    padding: 10px 10px;
    /*margin-top: 20px;*/
  }

  .btn_arr > div {
    width: 0.8rem;
    min-width: 60px;
    /*border:1px solid green;*/
    padding: 5px 10px;
    margin-right: 10px;
    border-radius: 4px;
    background-color: #FA8819;
    color: white;
  }

 .color_btn11{
   /*border:1px solid black;*/
   background-color: lightblue!important;
 }
  .color_btn22{
    /*border:1px solid black;*/
    background-color: lightblue!important;
  }
</style>
