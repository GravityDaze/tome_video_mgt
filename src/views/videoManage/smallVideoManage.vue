<template>
  <el-card class="small-video-manage">
    <!-- <mySearchs
      :sign="sign"
      :isAffiliatedScenery="isAffiliatedScenery"
      :isUserOpenId="isUserOpenId"
      :isUserNickName="isUserNickName"
      :isMakeTime="isMakeTime"
      :isShare="isShare"
      :isTop="isTop"
      :isRecommend="isRecommend"
      :addBtn="addBtn"
      :editBtn="editBtn"
      :setTop="setTop"
      :cancelTop="cancelTop"
      :setRecommendBtn="setRecommendBtn"
      :cancelRecommendBtn="cancelRecommendBtn"
      @beforeAddFn="beforeAddFn"
      @addFn="addFn"
      @beforeEditFn="beforeEditFn"
      @editFn="editFn"
      @setTopFn="setTopFn"
      @cancelTopFn="cancelTopFn"
      @queryInfoFn="queryInfoFn"
      @setRecommendFn="setRecommendFn"
      @cancelRecommendFn="cancelRecommendFn"
      class="my_searchs"
    ></mySearchs>-->
    <!-- <myTables
      :sign="sign"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :isShowFacePic="isShowFacePic"
      :isShowEnabled="isShowEnabled"
      @queryInfoFn="queryInfoFn"
      @chooseInfo="chooseInfo"
      class="my_tables"
    ></myTables>-->
    <searchs @query="query" :formData="formData" :searchBtn="searchBtn" />
    <tables
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />

    <!-- 小视频管理或新增 -->
    <el-dialog title="编辑视频" :visible.sync="handleVideoDialog">
      <el-form :model="handleVideoForm">
        <el-form-item label="制作需求" label-width="120px">
          <el-input v-model="handleVideoForm.needNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时长" label-width="120px">
          <el-input v-model="handleVideoForm.duration" autocomplete="off">
             <template slot="append">秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="景区" label-width="120px">
          <el-select v-model="handleVideoForm.sceneryId" placeholder="请选择景区名">
            <el-option
              v-for="item in sceneryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频类型" label-width="120px">
          <el-select v-model="handleVideoForm.type" placeholder="请选择视频类型">
            <el-option label="平台视频" :value="0"></el-option>
            <el-option label="用户视频" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频封面" label-width="120px">
          <el-upload
            class="uploader"
            action="https://upload-z2.qiniup.com"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="onCoverUploadSuccess"
            :on-error="onError"
            :data="{token}"
          >
            <div slot="tip" class="el-upload__tip">推荐尺寸为157(宽)*48(高)，大小不超过 300KB</div>
            <img v-if="handleVideoForm.coverUrl" :src="handleVideoForm.coverUrl" class="upload-img" />
            <i v-else class="el-icon-upload uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="小视频" label-width="120px">
          <el-upload
            class="uploader"
            action="https://upload-z2.qiniup.com"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="onVideoUploadSuccess"
            :on-error="onError"
            :data="{token}"
          >
            <div slot="tip" class="el-upload__tip">确定重新上传后，之前的视频将被彻底覆盖</div>
            <video autoplay v-if="handleVideoForm.url" :src="handleVideoForm.url" class="upload-img" />
            <i v-else class="el-icon-upload uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleVideoDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleVideoDialog = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--小视频管理新增或编辑-->
    <!-- <div id="publicAddEditorDialog">
      <el-dialog
        :title="$store.state.titleHeader"
        :visible.sync="$store.state.smallVideoManage"
        width="30%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          size="small"
          :hide-required-asterisk="false"
        >
          <el-row>
            <el-col :span="20" :offset="2">
              <el-form-item label="制作需求">
                <el-col :span="20">
                  <el-input v-model="ruleForm.needNo" @focus="openNeedListFn"></el-input>
                </el-col>
                <el-col :span="1">
                  <el-popover placement="right-start" width="250" trigger="hover">
                    <span>当视频类型选为</span>
                    <span style="color:red;font-size:16px">
                      <b>用户视频</b>
                    </span>
                    <span>时,该参数必填</span>
                    <i class="el-icon-info" slot="reference"></i>
                  </el-popover>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="2">
              <el-form-item label="选择景区" prop="menuType">
                <el-col class="select_style" v-if="$store.state.titleHeader=='新增'" :span="20">
                  <el-select
                    v-model="ruleForm.sceneryId"
                    filterable
                    placeholder="请选择景区"
                    class="select_style1"
                  >
                    <el-option
                      v-for="item in sceneryArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col class="select_style" v-if="$store.state.titleHeader=='编辑'" :span="20">
                  <el-select
                    v-model="ruleForm.sceneryId"
                    filterable
                    placeholder="请选择景区"
                    class="select_style1"
                  >
                    <el-option
                      v-for="item in sceneryArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="1">
                  <el-popover placement="right-start" width="250" trigger="hover">
                    <span>当视频类型选为</span>
                    <span style="color:red;font-size:16px">
                      <b>平台视频</b>
                    </span>
                    <span>时,该参数必填</span>
                    <i class="el-icon-info" slot="reference"></i>
                  </el-popover>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="2">
              <el-form-item label="时长(秒)" prop="duration">
                <el-col :span="20">
                  <el-input v-model.number="ruleForm.duration"></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="18" :offset="2">
              <el-form-item label="类型" prop="type">
                <el-col class="select_style" v-if="$store.state.titleHeader=='新增'">
                  <el-select v-model="ruleForm.type" placeholder="请选择类型" class="select_style1">
                    <el-option
                      v-for="item in typeArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>

                <el-col class="select_style" v-if="$store.state.titleHeader=='编辑'">
                  <el-select
                    v-model="ruleForm.type"
                    :disabled="true"
                    placeholder="请选择类型"
                    class="select_style1"
                  >
                    <el-option
                      v-for="item in typeArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col class="face">
              <div class="face_title" style="width:20%">
                <span style="color: red; display:inline">*</span>
                <span style="display:inline">视频封面</span>
              </div>
              <div class="obj_box">
                <div
                  class="upload_header"
                  :style="{backgroundImage:'url('+ruleForm.coverUrl+')',backgroundSize:'100% 100%'}"
                ></div>
                <input class="upload_input my_hover" type="file" @change="chooseHeaderPicture" />
              </div>
            </el-col>
            <el-col class="position_center">
              <span class="tip_info">{{tipInfo}}</span>
            </el-col>

            <el-col class="all_pic_box" style="margin: 15px 0" v-if="numParam == 1">
              <div class="pic_title" style="width:20%">
                <span style="color: red; display:inline">*</span>
                <span style="display:inline">小视频</span>
              </div>
              <div>
                <div class>
                  <div class></div>
                  <input class="my_hover" type="file" @change="upMediaInfos" />
                </div>
              </div>
            </el-col>
            <el-col class="all_pic_box" style="margin: 15px 0;" v-if="numParam == 2">
              <div class="pic_title" style="width:20%">
                <span style="color: red; display:inline">*</span>
                <span style="display:inline">小视频</span>
              </div>
              <div>
                <div>
                  <textarea name id cols="35" rows="5" :disabled="true">{{ruleForm.url}}</textarea>
                </div>
              </div>
              <div style="display: flex;align-items: flex-start;padding-left: 10px;">
                <span
                  class="my_hover"
                  style="border:1px solid orange;background-color: orange;"
                  @click="newUploadVideo()"
                >重新上传</span>
              </div>
            </el-col>
            <el-col class="position_center" v-if="numParam == 1">
              <span class="tip_info">{{tipInfo1}}</span>
            </el-col>
          </el-row>
    <el-form-item>-->
    <!--<el-col :span="4" :offset="2">-->
    <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
    <!--</el-col>-->
    <!-- <el-col :span="10" :offset="6" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleForm')">关闭</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>-->

    <!--选择需求模态框-->
    <!-- <div id="myTablesDialog">
      <el-dialog
        title="选择制作需求"
        :visible.sync="$store.state.chooseNeedBox"
        width="70%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleForm2"
          ref="ruleForm2"
          label-width="100px"
          class="demo-ruleForm"
          size="small"
          :hide-required-asterisk="false"
        >
          <div>
            <mySearchs
              :isDemandNum="isDemandNum"
              :isUserNickName="isUserNickName2"
              :isTravelScenery="isTravelScenery"
              :showMysearchsParam="true"
              @queryInfoFn2="queryInfoFn2"
            ></mySearchs>
            <myTables
              :tableTitle="tableTitle2"
              :tableData="tableData2"
              :isShowEnabled="isShowEnabled"
              :showPagePlug1="showPagePlug1"
              @queryInfoFn2="queryInfoFn2"
              @chooseInfoX="chooseInfoX"
            ></myTables>
          </div>
          <el-form-item>
            <el-col :span="6" :offset="18" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleForm2')">关闭</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>-->
  </el-card>
</template>

<script>
import {
  queryVideoList,
  getSceneryList,
  addVideo,
  updateVideo,
  queryNeed,
  sticky,
  cancelSticky,
  recommendFn,
  cancelRecommend
} from "@/api/videoManage";
import { getPublicUploadParams } from "@/api/qiniu";
import _ from "lodash";
export default {
  name: "small-video-manage",
  data() {
    return {
      apiUploadImage: "/videomis/upload/uploadImage",
      apiSceneryDrop: "/videomis/scenery/dropDown",
      apiQuery: "videomis/video/query",
      apiChooseNeed: "videomis/need/queryNeed",
      apiAdd: "videomis/video/add",
      apiEdit: "videomis/video/update",
      apiSetTop: "videomis/video/top",
      apiCancelTop: "videomis/video/topCancel",
      apiRecommend: "videomis/video/recommend",
      apiRecommendCancel: "videomis/video/recommendCancel",
      sign: "smallvideomanage",
      isAffiliatedScenery: true,
      isUserOpenId: false,
      isUserNickName: true,
      isMakeTime: true,
      isShowEnabled: true,
      isShowFacePic: true,
      showPagePlug1: true,
      isShare: true, //显示视频发布类型选择
      isTop: true, //显示视频置顶状态选择
      isRecommend: true, //视频推荐状态选择
      numParam: 1, //用于控制显示编辑栏里面是否重新上传视频
      // showMysearchsParam:true,//参数控制使用的是第一级mysearchs还是第二级mysearchs
      addBtn: true,
      editBtn: true,
      setTop: true,
      cancelTop: true,
      setRecommendBtn: true,
      cancelRecommendBtn: true,
      //以下的true或者false用于控制模态框里面的mysearchs和mytables
      isDemandNum: true,
      isUserNickName2: true,
      isTravelScenery: true,
      mediaFilesInfo: "", //点击文件上传input框获取到的初始信息
      tipInfo: "推荐尺寸为 128(宽) * 72(高)，大小不超过 300KB。",
      tipInfo1: "推荐720p或1080p视频，MP4格式，大小不超过 20M。",
      defaultPic: "../../static/addIcon.png",
      picArr: [this.defaultPic],
      picArr2: ["../../static/bg1.png", "../../static/bg2.png"],
      commonId: "", //随时有可能用到的id,此处存储的是视频id
      topStatus: "",
      recommendStatus: "",
      shareStatus: "",
      typeArr: [
        {
          id: "0",
          name: "平台视频",
          value: "0"
        },
        {
          id: "1",
          name: "用户视频",
          value: "1"
        }
      ],
      ruleForm: {
        id: "",
        needId: "", //这个代表需求列表里面的需求的id
        needNo: "", //这个是代表需求列表里面的需求编号，模态框里也需要呈现这个数据
        sceneryId: "", //新添加的景区ID参数
        duration: "",
        coverUrl: "",
        url: "", //文件后台返回的路径
        originalName: "", //原文件名
        fileName: "", //上传成功后，后台解析处理后返回的新的文件名
        type: "" //类型
      },
      // 验证规则
      rules: {
        duration: [
          { required: true, message: "请输入视频时长" },
          { type: "number", message: "视频时长必须为数字值" }
        ],
        type: [{ required: true, message: "请选择视频类型", tigger: "change" }]
      },
      sceneryArr: [],
      needArr: [
        {
          id: 9,
          name: "全部",
          value: ""
        },
        {
          id: 0,
          name: "标准制作",
          value: "0"
        },
        {
          id: 1,
          name: "定制合成",
          value: "1"
        }
      ],
      tableCols: [
        {
          prop: "no",
          label: "视频编号",
          align: "center"
        },
        {
          prop: "sceneryName",
          label: "所属景区",
          align: "center"
        },
        {
          prop: "nickName",
          label: "用户昵称",
          align: "center"
        },
        {
          prop: "duration",
          label: "时长",
          align: "center"
        },
        {
          prop: "times",
          label: "下载次数",
          align: "center"
        },
        {
          prop: "status",
          label: "状态",
          align: "center",
          formatter: row => {
            switch (row.status) {
              case 0:
                return "已过期";
                break;
              case 1:
                return "未购买";
                break;
              default:
                return "已购买";
            }
          }
        },
        {
          prop: "shareStatus",
          label: "发布",
          align: "center",
          formatter: row => (row.shareStatus === 0 ? "未发布" : "已发布")
        },
        {
          prop: "topStatus",
          label: "置顶",
          type: "switch",
          align: "center",
          change: this.handleTopStatus
        },
        {
          prop: "recommend",
          label: "推荐",
          type: "switch",
          align: "center",
          change: this.handleRecommend
        },
        {
          prop: "laudTimes",
          label: "点赞数",
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "提供时间",
          align: "center"
        },
        {
          label: "操作",
          type: "button",
          btnList: [{ type: "primary", label: "编辑", handle: this.editVideo }]
        }
      ],
      tableData: [],
      ruleForm2: {
        needId: "",
        duration: "",
        coverUrl: this.defaultPic,
        url: ""
      },
      tableTitle2: [
        {
          prop: "no",
          label: "需求编号",
          align: "center"
        },
        {
          prop: "sceneryNo",
          label: "景区编号",
          align: "center"
        },

        {
          prop: "openId",
          label: "openId",
          align: "center"
        }
      ],
      tableData2: [
        {
          needNum: "n00214",
          sceneryNum: "s000000002",
          openId: "O1111"
        }
      ],
      // 以下是重构代码
      pagination: {
        num: 1,
        size: 10,
        total: 0
      },
      searchForm: {},
      formData: [
        {
          type: "input",
          label: "所属景区",
          model: "sceneryName",
          placeholder: "请输入景区名称"
        },
        {
          type: "input",
          label: "用户昵称",
          model: "nickName",
          placeholder: "请输入用户昵称"
        },
        {
          label: "提交时间",
          type: "datePicker",
          model: "createDatetime"
        },
        {
          label: "需求类型",
          type: "select",
          model: "type",
          options: [
            {
              label: "全部",
              value: undefined
            },
            {
              label: "标准制作",
              value: 1
            },
            {
              label: "定制合成",
              value: 2
            }
          ]
        }
      ],
      searchBtn: [
        {
          type: "primary",
          label: "新增",
          handle: this.add,
          icon: "el-icon-search"
        },
        {
          type: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search"
        }
      ],
      handleVideoDialog: false, //编辑或新增模态框
      handleVideoForm: {
        needNo: "", //制作需求
        sceneryId: "", //景区id
        duration: "", //时长 秒
        coverUrl: "", //封面图
        url: "", //视频url
        type: "" //视频类型
      }, //模态框表单
      sceneryList: [], //景区下拉框
      token: "" //七牛云上传token
    };
  },

  created() {
    this.getVideoList();
  },

  mounted() {
    // this.$store.state.pageNumParam = 1;
    // this.getDefaultInfoFn();
    // // 获取景区下拉信息
    // this.getSceneryDropFn();
  },
  methods: {
    async getVideoList(
      query = {
        ...this.searchForm,
        pageNum: this.pagination.num,
        pageSize: this.pagination.size
      }
    ) {
      try {
        const { data } = await queryVideoList(query);
        // 转换为布尔值
        this.tableData = data.value.list.map(v => {
          // 将0和1转换为布尔值
          v.recommend = !!v.recommend;
          v.topStatus = !!v.topStatus;
          return v;
        });
        this.pagination.total = data.value.total;
      } catch (err) {}
    },

    // 编辑视频
    async editVideo(row) {
      this.handleVideoDialog = true;
      // 获取景区下拉列表
      const { data } = await getSceneryList({ id: row.id });
      this.sceneryList = data.value;
      // 获取到需要回填的数据
      for(const item in this.handleVideoForm){
        // 回填时将视频状态转换为中文
        this.handleVideoForm[item] = row[item]
      }
       

    },

    // 新增视频
    add() {},

    // 上传前
    async beforeUpload({ type, name }) {
      // 校验文件类型
      // if (["image/jpeg", "image/png"].indexOf(type) == -1) {
      //   this.$message.error("只能上传jpg & png 格式的图片");
      //   return Promise.reject();
      // } else {
        try {
          const { data } = await getPublicUploadParams({ fileName: name });
          this.token = data.value.token;
          return true;
        } catch (err) {
          return Promise.reject();
        }
      // }
    },

    // 封面上传成功
    onCoverUploadSuccess({key}) {
      this.$message.success("上传成功");
      this.handleVideoForm.coverUrl = `https://tomevideo.zhihuiquanyu.com/${key}`;
    },

    // 视频上传成功
     onVideoUploadSuccess({key}) {
      this.$message.success("上传成功");
      this.handleVideoForm.url = `https://tomevideo.zhihuiquanyu.com/${key}`;
    },


    // 上传失败
    onError() {
      this.$message.error('上传失败，请刷新网页后重试')
    },

    // 切换置顶状态
    async handleTopStatus(row) {
      try {
        if (row.topStatus) {
          await sticky({ id: row.id });
          this.$message.success("已将该视频置顶");
        } else {
          await cancelSticky({ id: row.id });
          this.$message.success("已取消该视频置顶");
        }
      } catch (err) {
        row.topStatus = !row.topStatus;
      }
    },

    // 切换推荐状态
    async handleRecommend(row) {
      try {
        if (row.recommend) {
          await recommendFn({ id: row.id });
          this.$message.success("已将该视频设置为推荐");
        } else {
          await cancelRecommend({ id: row.id });
          this.$message.success("已取消推荐该视频");
        }
      } catch (err) {
        row.recommend = !row.recommend;
      }
    },

    // 按钮查询
    query(searchForm) {
      if (_.isEmpty(searchForm)) return this.$message.warning("无效的查询");
      // 将searchForm中的时间数组转换为后台需要接收的格式
      if (searchForm.createDatetime && searchForm.createDatetime.length) {
        searchForm.startDate = searchForm.createDatetime[0];
        searchForm.endDate = searchForm.createDatetime[1];
        delete searchForm.createDatetime;
      } else if (searchForm.startDate || searchForm.endDate) {
        delete searchForm.startDate;
        delete searchForm.endDate;
      }
      this.searchForm = searchForm;
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getVideoList();
    },

    // 分页size改变
    sizeChange(val) {
      this.pagination.size = val;
      this.getVideoList();
    },

    // 分页num改变
    numChange(val) {
      this.pagination.num = val;
      this.getVideoList();
    }

    // //重新上传切换显示隐藏
    // newUploadVideo() {
    //   this.$confirm("确定重新上传后，之前的视频将被彻底覆盖?", "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     center: true
    //   })
    //     .then(() => {
    //       this.numParam = 1;
    //     })
    //     .catch(() => {
    //       this.$message.warning("本次操作已取消");
    //     });
    // },

    // //获取景区下拉列表
    // getSceneryDropFn() {
    //   this.$axios({
    //     method: "get",
    //     url: this.apiSceneryDrop,
    //     data: {}
    //   })
    //     .then(res => {
    //       // console.log("下拉是什么信息", res);
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         this.sceneryArr = [...res.data.value];
    //       } else {
    //         this.$message.warning(res.data.resultStatus.resultMessage);
    //       }
    //     })
    //     .catch(error => {
    //       // console.log(error);
    //     });
    // },

    // // 新增前清空数据方法
    // beforeAddFn() {
    //   for (let item in this.ruleForm) {
    //     this.ruleForm[item] = "";
    //   }
    //   this.ruleForm.coverUrl = this.defaultPic;
    //   this.numParam = 1;
    //   this.$store.state.smallVideoManage = true;
    // },

    // getDefaultInfoFn() {
    //   this.$axios({
    //     method: "post",
    //     url: this.apiQuery,
    //     data: {
    //       pageNum: this.$store.state.pageNumParam,
    //       pageSize: this.$store.state.pageSizeParam,
    //       sceneryName: "",
    //       nickName: "",
    //       openId: "",
    //       shareStatus: "",
    //       topStatus: "",
    //       recommend: "",
    //       startDate: "",
    //       endDate: ""
    //     }
    //   })
    //     .then(res => {
    //       // console.log("列表信息", res.data);
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         if (res.data.value.list.length != "0") {
    //           this.tableData = [...res.data.value.list];
    //           this.$store.state.totalParam = res.data.value.total;
    //         } else {
    //           this.tableData = [];
    //           this.$store.state.totalParam = 0;
    //         }
    //       } else {
    //         this.$message.warning(res.data.resultStatus.resultMessage);
    //       }
    //     })
    //     .catch(error => {});
    // },

    // queryInfoFn() {
    //   this.$axios({
    //     method: "post",
    //     url: this.apiQuery,
    //     data: {
    //       pageNum: this.$store.state.pageNumParam,
    //       pageSize: this.$store.state.pageSizeParam,
    //       sceneryName: this.$store.state.affiliatedSceneryParam,
    //       nickName: this.$store.state.nickNameParam,
    //       openId: this.$store.state.openIdParam,
    //       shareStatus: this.$store.state.videoShareStatusParam,
    //       topStatus: this.$store.state.videoTopStatusParam,
    //       recommend: this.$store.state.videoRecommendParam,
    //       startDate: this.$store.state.startDateParam,
    //       endDate: this.$store.state.endDateParam
    //     }
    //   })
    //     .then(res => {
    //       // console.log("查询按钮或者翻页按钮信息", res.data);
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         if (res.data.value.list.length != "0") {
    //           this.tableData = [...res.data.value.list];
    //           this.$store.state.totalParam = res.data.value.total;
    //         } else {
    //           this.tableData = [];
    //           this.$store.state.totalParam = 0;
    //         }
    //       } else {
    //         this.$message.warning(res.data.resultStatus.resultMessage);
    //       }
    //     })
    //     .catch(error => {});
    // },

    // //新增时，打开需求列表信息模态框供选择
    // openNeedListFn() {
    //   this.$store.state.pageNumParam2 = 1;
    //   this.$axios({
    //     method: "post",
    //     url: this.apiChooseNeed,
    //     data: {
    //       no: "",
    //       sceneryName: "",
    //       // "openId": "",
    //       nickName: "",
    //       pageNum: this.$store.state.pageNumParam2,
    //       pageSize: this.$store.state.pageSizeParam2
    //     }
    //   })
    //     .then(res => {
    //       // console.log("需求列表返回数据", res.data);
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         this.tableData2 = [...res.data.value.list];
    //         this.$store.state.totalParam2 = res.data.value.total;
    //         this.$store.state.chooseNeedBox = true;
    //       }
    //     })
    //     .catch(error => {});
    // },

    // //点击二级列表获取对应行的信息
    // chooseInfoX(n) {
    //   // console.log('点击的是二级行',n)
    //   this.$message.success("制作需求选择成功，编号：" + n.no);
    //   this.ruleForm.needId = n.id;
    //   this.ruleForm.needNo = n.no;
    // },

    // //需求列表查询或者翻页查询
    // queryInfoFn2() {
    //   this.$axios({
    //     method: "post",
    //     url: this.apiChooseNeed,
    //     data: {
    //       no: this.$store.state.needNoParam,
    //       sceneryName: this.$store.state.travelSceneryParam,
    //       // "openId": "",
    //       nickName: this.$store.state.nickNameParam,
    //       pageNum: this.$store.state.pageNumParam2,
    //       pageSize: this.$store.state.pageSizeParam2
    //     }
    //   })
    //     .then(res => {
    //       // console.log("需求列表返回数据", res.data);
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         this.tableData2 = [...res.data.value.list];
    //         this.$store.state.totalParam2 = res.data.value.total;
    //       }
    //     })
    //     .catch(error => {});
    // },

    // //新增
    // addFn(n) {
    //   if (this.ruleForm.type == 0 && this.ruleForm.sceneryId == "") {
    //     this.$message.warning("选择平台视频类型时，必须选择视频所属景区");
    //   } else if (this.ruleForm.type == 1 && this.ruleForm.needId == "") {
    //     this.$message.warning("选择用户视频类型时，必须选择视频所属需求");
    //   } else if (
    //     this.ruleForm.coverUrl == "" ||
    //     this.ruleForm.coverUrl === this.defaultPic
    //   ) {
    //     this.$message.warning("请上传视频封面图");
    //   } else if (this.ruleForm.url == "") {
    //     this.$message.warning("请上传视频文件");
    //   } else {
    //     this.$axios({
    //       method: "post",
    //       url: this.apiAdd,
    //       data: this.ruleForm
    //     }).then(res => {
    //       // console.log("新增是否成功", res.data);
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         this.$store.state.smallVideoManage = false;
    //         this.$store.state.pageNumParam = 1;
    //         this.getDefaultInfoFn();
    //       } else {
    //         this.$message.warning(res.data.resultStatus.resultMessage);
    //       }
    //     });
    //   }
    // },

    // //编辑之前点击行获取相关信息
    // chooseInfo(n) {
    //   // console.log("获取第一级表格对应行信息，", n);
    //   this.ruleForm.needId = n.needId;
    //   this.ruleForm.needNo = n.needNo;
    //   this.ruleForm.id = n.id;
    //   this.commonId = n.id;
    //   this.ruleForm.duration = n.duration;
    //   this.ruleForm.coverUrl = n.coverUrl;
    //   this.ruleForm.url = n.url;
    //   this.ruleForm.type = n.type == "0" ? "平台视频" : "用户视频";
    //   this.ruleForm.sceneryId = n.sceneryId;
    //   // 赋值视频置顶状态以及推荐状态
    //   this.topStatus = n.topStatus;
    //   this.recommendStatus = n.recommend;
    //   this.shareStatus = n.shareStatus;
    // },
    // //获取相关信息后，显示编辑模态框
    // beforeEditFn() {
    //   if (this.commonId == "") {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("请选择一条数据");
    //     }
    //   } else {
    //     this.$store.state.titleHeader = "编辑";
    //     this.numParam = 2;
    //     this.$store.state.smallVideoManage = true;
    //   }
    // },
    // //编辑事件
    // editFn() {
    //   this.ruleForm.type = this.ruleForm.type == "平台视频" ? "0" : "1";
    //   if (this.ruleForm.type == 0 && this.ruleForm.sceneryId == "") {
    //     this.$message.warning("选择平台视频类型时，必须选择视频所属景区");
    //   } else if (this.ruleForm.type == 1 && this.ruleForm.needId == "") {
    //     this.$message.warning("选择用户视频类型时，必须选择视频所属需求");
    //   } else if (
    //     this.ruleForm.coverUrl == "" ||
    //     this.ruleForm.coverUrl === this.defaultPic
    //   ) {
    //     this.$message.warning("请上传视频封面图");
    //   } else if (this.ruleForm.url == "") {
    //     this.$message.warning("请上传视频文件");
    //   } else {
    //     this.$axios({
    //       method: "post",
    //       url: this.apiEdit,
    //       data: this.ruleForm
    //     })
    //       .then(res => {
    //         // console.log("编辑是否成功", res.data);
    //         if (res.data.resultStatus.resultCode === "0000") {
    //           this.$store.state.smallVideoManage = false;
    //           this.$store.state.pageNumParam = 1;
    //           this.commonId = "";
    //           this.getDefaultInfoFn();
    //         } else {
    //           this.$message.warning(res.data.resultStatus.resultMessage);
    //         }
    //       })
    //       .catch(error => {});
    //   }
    // },

    // //设置置顶
    // setTopFn() {
    //   if (this.commonId == "") {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("请选择一条数据");
    //     }
    //   } else if (this.shareStatus == 0) {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("此视频未被用户发布到途咪平台，不能被置顶");
    //     }
    //   } else if (this.topStatus == 1) {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("此视频已被置顶，无需操作");
    //     }
    //   } else {
    //     this.$axios({
    //       method: "GET",
    //       url: this.apiSetTop + "?id=" + this.commonId,
    //       data: {}
    //     }).then(res => {
    //       // console.log("设置置顶的结果", res.data);
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         this.commonId = "";
    //         this.queryInfoFn();
    //         this.$message.success(res.data.resultStatus.resultMessage);
    //       } else {
    //         this.$message.warning(res.data.resultStatus.resultMessage);
    //       }
    //     });
    //   }
    // },
    // //取消置顶
    // cancelTopFn() {
    //   if (this.commonId == "") {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("请选择一条数据");
    //     }
    //   } else if (this.topStatus == 0) {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("此视频未被置顶，无需操作");
    //     }
    //   } else {
    //     this.$axios({
    //       method: "GET",
    //       url: this.apiCancelTop + "?id=" + this.commonId,
    //       data: {}
    //     }).then(res => {
    //       // console.log("取消置顶的结果", res.data);
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         this.commonId = "";
    //         this.queryInfoFn();
    //         this.$message.success(res.data.resultStatus.resultMessage);
    //       } else {
    //         this.$message.warning(res.data.resultStatus.resultMessage);
    //       }
    //     });
    //   }
    // },

    // // 设置视频推荐状态
    // setRecommendFn() {
    //   if (this.commonId == "") {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("请选择一条数据");
    //     }
    //   } else if (this.shareStatus == 0) {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("此视频未被用户发布到途咪平台，不能被推荐");
    //     }
    //   } else if (this.recommendStatus == 1) {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("此视频已被推荐，无需操作");
    //     }
    //   } else {
    //     this.$axios({
    //       method: "GET",
    //       url: this.apiRecommend + "?id=" + this.commonId,
    //       data: {}
    //     }).then(res => {
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         this.commonId = "";
    //         this.$message.success(res.data.resultStatus.resultMessage);
    //         this.queryInfoFn();
    //       } else {
    //         this.$message.warning(res.data.resultStatus.resultMessage);
    //       }
    //     });
    //   }
    // },
    // //取消视频推荐状态
    // cancelRecommendFn() {
    //   if (this.commonId == "") {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("请选择一条数据");
    //     }
    //   } else if (this.recommendStatus == 0) {
    //     if (document.getElementsByClassName("el-message").length === 0) {
    //       this.$message.warning("此用户未被推荐，无需操作");
    //     }
    //   } else {
    //     this.$axios({
    //       method: "GET",
    //       url: this.apiRecommendCancel + "?id=" + this.commonId,
    //       data: {}
    //     }).then(res => {
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         this.commonId = "";
    //         this.$message.success(res.data.resultStatus.resultMessage);
    //         this.queryInfoFn();
    //       } else {
    //         this.$message.warning(res.data.resultStatus.resultMessage);
    //       }
    //     });
    //   }
    // },
    // //上传封面图
    // chooseHeaderPicture(e) {
    //   this.ruleForm.iconUrl = e.target.files[0];
    //   var formdata = new FormData();
    //   formdata.append("file", this.ruleForm.iconUrl);
    //   this.$axios({
    //     method: "post",
    //     url: this.apiUploadImage,
    //     data: formdata
    //   })
    //     .then(res => {
    //       // console.log("景区图层管理上传图片返回了什么", res.data);
    //       if (res.data.resultStatus.resultCode === "0000") {
    //         this.ruleForm.coverUrl = res.data.value.url;
    //       } else {
    //         this.$message.warning(res.data.resultStatus.resultMessage);
    //       }
    //     })
    //     .catch(error => {});
    // },

    // //上传视频
    // upMediaInfos(e) {
    //   this.mediaFilesInfo = e.target.files[0];
    //   this.ruleForm.originalName = this.mediaFilesInfo.name;
    //   console.log(e.target.files[0]);
    //   let tokenInfo = "";
    //   let formdata = new FormData();
    //   formdata.append("file", this.mediaFilesInfo);
    //   //前端上传音视频等文件到七牛云时关键三步
    //   //1，向后台调用特定获取token接口，以便获取与七牛云相关的对应token
    //   //2，自己服务器存储文件空间（即绑定的存储域名）在哪个大区，就调用哪个大区的七牛云共用接口，如华东：http://upload.qiniup.com
    //   //3，接口调用成功后，后台返回key后，将上述的存储域名与key结合到一块就成为最终的下载地址
    //   this.$axios
    //     .get(
    //       "/videomis/upload/uploadAuth?fileName=" + this.ruleForm.originalName
    //     )
    //     .then(res => {
    //       // console.log('+++++++',res)
    //       tokenInfo = res.data.value.token;
    //       formdata.append("token", tokenInfo);

    //       this.$axios
    //         .post("https://upload-z2.qiniup.com", formdata, {
    //           emulateJSON: true
    //         })
    //         .then(res => {
    //           this.ruleForm.fileName = res.data.key; //原来可以的
    //           // console.log('格式是否带在了后面',this.ruleForm.fileName)

    //           this.ruleForm.url =
    //             "https://tomevideo.zhihuiquanyu.com/" + res.data.key;
    //           // console.log("媒体资源上传重要传输环节+++", this.ruleForm.url);
    //         })
    //         .catch(error => {
    //           // console.log(error);
    //         });
    //     });
    // },

    // submitForm(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       if (formName === "ruleForm") {
    //         if (this.$store.state.titleHeader === "新增") {
    //           this.addFn();
    //         } else if (this.$store.state.titleHeader === "编辑") {
    //           this.editFn();
    //         }
    //       } else if (formName === "ruleForm2") {
    //       }
    //     } else {
    //       // console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },
    // cancelForm(formName) {
    //   if (formName === "ruleForm") {
    //     this.$refs[formName].resetFields();
    //     this.$store.state.smallVideoManage = false;
    //   } else if (formName === "ruleForm2") {
    //     this.$store.state.chooseNeedBox = false;
    //   }
    // }
  }
};
</script>

<style lang="less">
.small-video-manage {
  .uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .uploader .el-upload:hover {
    border-color: #409eff;
  }
  .uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 72px;
    line-height: 72px;
    text-align: center;
  }
  .upload-img {
    width: 128px;
    height: 72px;
    display: block;
  }
}
</style>
