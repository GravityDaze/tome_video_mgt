<template>
  <div>
    <mySearchs
      :sign="sign"
      :isAffiliatedScenery="isAffiliatedScenery"
      :isState="isState"
      :isTemplateName="isTemplateName"
      :isMakeSearchTime="isMakeSearchTime"
      :addBtn="addBtn"
      :editBtn="editBtn"
      :enabledTempleteBtn="enabledTempleteBtn"
      :disabledTempleteBtn="disabledTempleteBtn"
      @beforeAddFn="beforeAddFn"
      @addFn="addFn"
      @beforeEditFn="beforeEditFn"
      @editFn="editFn"
      @enabledTempleteFn="enabledTempleteFn"
      @disabledTempleteFn="disabledTempleteFn"
      @queryInfoFn="queryInfoFn"
      class="my_searchs"
    ></mySearchs>
    <myTables
      :sign="sign"
      :isShowTemplateNum="isShowTemplateNum"
      :tableTitle="tableTitle"
      :tableData="tableData"
      @getTemplateInfoFn="getTemplateInfoFn"
      @queryInfoFn="queryInfoFn"
      @chooseInfo="chooseInfo"
      class="my_tables"
    ></myTables>

    <!--小视频管理新增或编辑-->
    <div id="publicAddEditorDialog">
      <el-dialog
        :title="$store.state.titleHeader"
        :visible.sync="$store.state.sceneryShotTemplate"
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
            <!--<el-col :span="18" :offset="2">-->
            <!--<el-form-item label="景区名称">-->
            <!--<el-col>-->
            <!--<el-input v-model="ruleForm.sceneryName"></el-input>-->
            <!--</el-col>-->

            <!--</el-form-item>-->
            <!--</el-col>-->

            <el-col :span="20" :offset="2">
              <el-form-item label="选择景区" prop="sceneryId">
                <el-col class="select_style" :span="20">
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
              </el-form-item>
            </el-col>

            <!--<el-col :span="18" :offset="2">-->
            <!--<el-form-item label="景区ID">-->
            <!--<el-col>-->
            <!--<el-input v-model="ruleForm.sceneryId"></el-input>-->
            <!--</el-col>-->

            <!--</el-form-item>-->
            <!--</el-col>-->

            <el-col :span="20" :offset="2">
              <el-form-item label="模板名称" prop="name">
                <el-col :span="20">
                  <el-input v-model.trim="ruleForm.name"></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <!--<el-col class="all_pic_box" style="margin: 15px 0" v-if="numParam == 1">-->
            <!--<div class="pic_title"><span>上传视频</span></div>-->
            <!--<div>-->
            <!--<div class="">-->
            <!--<div class=""></div>-->
            <!--<input class="my_hover" type="file" @change="upMediaInfos">-->
            <!--</div>-->
            <!--</div>-->
            <!--</el-col>-->

            <!--<el-col class="all_pic_box" style="margin: 15px 0;" v-if="numParam == 2">-->
            <!--<div class="pic_title"><span>小视频</span></div>-->
            <!--<div>-->
            <!--<div>-->
            <!--<textarea name="" id="" cols="35" rows="5" :disabled="true">{{ruleForm.url}}</textarea>-->
            <!--</div>-->
            <!--</div>-->
            <!--<div style="display: flex;align-items: flex-start;padding-left: 10px;"><span class="my_hover"-->
            <!--style="border:1px solid orange;background-color: orange;display: none"-->
            <!--@click="newUploadVideo()">重新上传</span>-->
            <!--</div>-->
            <!--</el-col>-->

            <!--<el-col class="position_center" v-if="numParam == 1">-->
            <!--<span class="tip_info">{{tipInfo1}}</span>-->
            <!--</el-col>-->

            <el-col :span="20" :offset="2">
              <el-form-item label="模板描述">
                <el-col :span="20">
                  <el-input
                    type="textarea"
                    maxlength="100"
                    show-word-limit
                    v-model.trim="ruleForm.describe"
                  ></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <!--<el-col :span="18" :offset="2">-->
            <!--<el-form-item label="最大点位数量">-->
            <!--<el-col>-->
            <!--<el-input v-model="ruleForm.pointNum" v-if="$store.state.titleHeader=='新增'"></el-input>-->
            <!--<el-input v-model="ruleForm.pointNum" :disabled="true"-->
            <!--v-if="$store.state.titleHeader=='编辑'"></el-input>-->
            <!--</el-col>-->

            <!--</el-form-item>-->
            <!--</el-col>-->

            <el-col :span="20" :offset="2">
              <el-form-item label="时长限制" prop="durationLimit">
                <el-col :span="20">
                  <el-input v-model.number="ruleForm.durationLimit"></el-input>
                </el-col>
                <el-col :span="1">
                  <el-popover placement="right-start" width="250" trigger="hover">
                    <span>该参数用于上传该模板的</span>
                    <span style="color:red;font-size:16px">
                      <b>模板片段</b>
                    </span>
                    <span>的总时间限制条件，即该模板不限制上传模板片段个数，但是限制上传模板片段总时间</span>
                    <i class="el-icon-info" slot="reference"></i>
                  </el-popover>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="20" :offset="2">
              <el-form-item label="排序" prop="sort">
                <el-col :span="20">
                  <el-input v-model.number="ruleForm.sort"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <!--<el-col :span="4" :offset="2">-->
            <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
            <!--</el-col>-->
            <el-col :span="10" :offset="6" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleForm')">关闭</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <!--二级列表-->
    <div id="myTablesDialog">
      <el-dialog
        title="模板点位信息列表"
        :visible.sync="$store.state.templateListShow"
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
              :showSearchBtn="showSearchBtn"
              :addBtn2="addBtn2"
              :editBtn2="editBtn2"
              :enabledBtn2="enabledBtn2"
              :disabledBtn2="disabledBtn2"
              @beforeAddFn2="beforeAddFn2"
              @addFn2="addFn2"
              @beforeEditFn2="beforeEditFn2"
              @editFn2="editFn2"
              @enabledFn2="enabledFn2"
              @disabledFn2="disabledFn2"
            ></mySearchs>

            <myTables
              :tableTitle="tableTitle2"
              :tableData="tableData2"
              :showPagePlug1="showPagePlug1"
              @queryInfoFn2="queryInfoFn2"
              @chooseInfoX="chooseInfoX"
            ></myTables>
          </div>
        </el-form>
      </el-dialog>
    </div>

    <!--点位列表内的新增或者编辑-->
    <div id="sceneryAllInfo">
      <el-dialog
        :title="$store.state.titleHeader"
        :visible.sync="$store.state.pointpointShow"
        width="30%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleForm3"
          :rules="form3Rules"
          ref="ruleForm3"
          label-width="100px"
          class="demo-ruleForm"
          size="small"
          :hide-required-asterisk="false"
        >
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="模板ID" prop="templetId">
                <el-col>
                  <el-input v-model="ruleForm3.templetId" :disabled="true"></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="18" :offset="2">
              <el-form-item label="片段名称" prop="name">
                <el-col>
                  <el-input v-model.trim="ruleForm3.name"></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col class="all_pic_box" style="margin: 15px 0" v-if="numParam == 1">
              <div class="pic_title" style="width:20%">
                <span style="color: red; display:inline">*</span>
                <span style="display:inline">上传视频</span>
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
                  <textarea name id cols="27" rows="5" :disabled="true" v-model="ruleForm3.url"></textarea>
                </div>
              </div>
              <div style="display: flex;align-items: flex-start;padding-left: 70%;">
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

            <el-col :span="18" :offset="2">
              <el-form-item label="景区位置" prop="location">
                <el-col>
                  <el-input v-model.trim="ruleForm3.location"></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="18" :offset="2">
              <el-form-item label="片段描述">
                <el-col>
                  <el-input
                    type="textarea"
                    maxlength="30"
                    show-word-limit
                    v-model.trim="ruleForm3.describe"
                  ></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="18" :offset="2">
              <el-form-item label="片段序号" prop="sequence">
                <el-col>
                  <el-input v-model.number="ruleForm3.sequence"></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <!--<el-col class="face">-->
            <!--<div class="face_title"><span>景区封面图</span></div>-->
            <!--<div class="obj_box">-->
            <!--<div class="upload_header"-->
            <!--:style="{backgroundImage:'url('+ruleForm3.picUrl+')',backgroundSize:'100% 100%'}"></div>-->
            <!--<input class="upload_input my_hover" type="file" @change="chooseHeaderPicture">-->
            <!--</div>-->
            <!--<div class="clear_btn"><span class="my_hover" @click="clearPic1(1)">清空图片</span></div>-->

            <!--</el-col>-->

            <!--<el-col class="position_center">-->
            <!--<span class="tip_info">{{tipInfo3}}</span>-->
            <!--</el-col>-->
          </el-row>
          <el-form-item>
            <el-col :span="10" :offset="6" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleForm3')">关闭</el-button>
              <el-button type="primary" @click="submitForm('ruleForm3')">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "scenery-shot-template",
  data() {
    return {
      apiUploadImage: "/mis/upload/uploadImage",
      apiSceneryDrop: "/videomis/scenery/dropDown",
      apiQuery: "/videomis/templet/query",
      apiQueryX: "/videomis/templetPoint/query",
      apiAdd: "/videomis/templet/add",
      apiAdd2: "/videomis/templetPoint/add",
      apiGetInfo: "/videomis/templet/get",
      apiGetInfo2: "/videomis/templetPoint/get",
      apiEdit: "/videomis/templet/edit",
      apiEdit2: "/videomis/templetPoint/edit",
      apiEnabled: "/videomis/templet/enable",
      apiDisabled: "/videomis/templet/disable",
      apiEnabled2: "/videomis/templetPoint/enable",
      apiDisabled2: "/videomis/templetPoint/disable",
      sign: "sceneryshottemplate",
      commonId: "", //获取对应行数据id是存储在这个参数里
      commonIdX: "", //
      numParam: 1, //用于控制显示编辑栏里面是否重新上传视频
      tipInfo1: "推荐720p或1080p视频，MP4格式，大小不超过 20M。",
      mediaFilesInfo: "",
      isAffiliatedScenery: true,
      isState: true,
      isTemplateName: true,
      isMakeSearchTime: true,
      picArr: ["../../static/addIcon.png"], //
      tipInfo3: "推荐尺寸为 157(宽) * 48(高)，大小不超过 300KB",
      addBtn: true,
      editBtn: true,
      addBtn2: true,
      editBtn2: true,
      showSearchBtn: true,
      enabledTempleteBtn: true,
      disabledTempleteBtn: true,
      enabledBtn2: true,
      disabledBtn2: true,
      isShowTemplateNum: true,
      tableTitle: [
        // {
        //   prop: 'id',
        //   label: '模板ID',
        //   // width: '100',
        //   align: 'center'
        // },
        {
          prop: "name",
          label: "模板名称",
          // width: '100',
          align: "center"
        },
        {
          prop: "sceneryName",
          label: "所属景区",
          // width: '100',
          align: "center"
        },

        // {
        //   prop: 'url',
        //   label: '模板链接URL',
        //   // width: '100',
        //   align: 'center'
        // },
        // {
        //   prop: 'coverUrl',
        //   label: '模板封面链接',
        //   // width: '100',
        //   align: 'center'
        // },
        {
          prop: "describe",
          label: "模板描述",
          // width: '100',
          align: "center"
        },
        {
          prop: "durationLimit",
          label: "模板时长",
          // width: '100',
          align: "center"
        },
        // {
        //   prop: 'pointNum',
        //   label: '模板点位最大数量',
        //   // width: '100',
        //   align: 'center'
        // },
        // {
        //   prop: 'sort',
        //   label: '排序',
        //   // width: '100',
        //   align: 'center'
        // },
        {
          prop: "creator",
          label: "创建者",
          // width: '100',
          align: "center"
        },

        {
          prop: "createDatetime",
          label: "创建时间",
          // width: '180',
          align: "center"
        }
        // {
        //   prop: 'updator',
        //   label: '修改者',
        //   // width: '180',
        //   align: 'center'
        // },
        // {
        //   prop: 'updateDatetime',
        //   label: '修改时间',
        //   // width: '180',
        //   align: 'center'
        // },
        // {
        //   prop: 'status',
        //   label: '状态',
        //   // width: '180',
        //   align: 'center',
        //   formatter: function (row) {
        //     return row.status == '0' ? '禁用' : '启用'
        //   }
        // },
      ],
      tableData: [
        {
          id: "",
          sceneryName: "",
          no: "",
          name: "",
          url: "",
          coverUrl: "",
          describe: "",
          pointNum: "",
          sort: "",
          status: "",
          creator: "",
          createDatetime: "",
          updator: "",
          updateDatetime: ""
        }
      ],
      ruleForm: {
        sceneryName: "",
        originalName: "",
        sceneryId: "", //景区id
        name: "", //模板名称
        url: "",
        describe: "",
        pointNum: "", //最大点位数量
        durationLimit: "", //模板片段时间限制
        sort: "", //排序
        id: "" //模板id
      },
      // 验证规则
      rules: {
        sceneryId: [{ required: true, message: "请选择景区" }],
        name: [{ required: true, message: "请输入模板名称", tigger: "blur" }],
        durationLimit: [
          { required: true, message: "请输入模板总时长", trigger: "blur" },
          { type: "number", message: "模板总时长必须为数字值" }
        ],
        sort: [
          { required: true, message: "请输入模板序值" },
          { type: "number", message: "模板序值必须为数字值" }
        ]
      },
      sceneryArr: [],
      ruleForm2: {
        id: "",
        no: "",
        headUrl: "",
        frontFace: "",
        nickName: "",
        phone: "",
        email: "",
        sex: "",
        realName: "",
        credentialsNumber: "",
        registerIp: "",
        imei: "",
        createDatetime: "",
        updateDatetime: "",
        lastLoginDatetime: "",
        status: "",
        openId: "",
        needCount: "",
        orderPrice: "",
        orderCount: ""
      },

      ruleForm3: {
        templetId: "",
        originalName: "",
        id: "",
        name: "",
        url: "",
        location: "",
        // "iconUrl": "../../static/addIcon.png",
        describe: "",
        picUrl: "",
        sequence: ""
      },
      // 验证规则
      form3Rules: {
        templetId: [{ required: true, message: "请选择所属模板ID" }],
        name: [
          { required: true, message: "请输入模板片段名称", tigger: "blur" }
        ],
        url: [{ required: true, message: "请上传模板片段视频" }],
        location: [
          {
            required: true,
            message: "请输入该模板片段的定位地址",
            tigger: "blur"
          }
        ],
        sequence: [
          { required: true, message: "请输入此模板片段序号" },
          { type: "number", message: "片段序号必须为数字值" }
        ]
      },
      templeteStatus: "",
      templetePointStatus: "",
      tableTitle2: [
        // {
        //   prop: 'templetName',
        //   label: '模板名称',
        //   // width: '100',
        //   align: 'center'
        // },
        // {
        //   prop: 'id',
        //   label: '模板Id',
        //   // width: '100',
        //   align: 'center'
        // },
        {
          prop: "name",
          label: "片段名称",
          // width: '100',
          align: "center"
        },
        {
          prop: "location",
          label: "所在位置",
          // width: '100',
          align: "center"
        },
        {
          prop: "describe",
          label: "描述",
          // width: '100',
          align: "center"
        },
        {
          prop: "duration",
          label: "时长",
          // width: '100',
          align: "center"
        },
        // {
        //   prop: 'status',
        //   label: '状态',
        //   // width: '100',
        //   align: 'center'
        // },
        {
          prop: "sequence",
          label: "点位序号",
          // width: '100',
          align: "center"
        },
        {
          prop: "creator",
          label: "创建者",
          // width: '100',
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "创建时间",
          // width: '100',
          align: "center"
        }
        // {
        //   prop: 'updator',
        //   label: '修改者',
        //   // width: '100',
        //   align: 'center'
        // },
        // {
        //   prop: 'updateDatetime',
        //   label: '修改时间',
        //   // width: '100',
        //   align: 'center'
        // },
      ],
      tableData2: [
        {
          id: 9,
          templetName: "",
          name: "",
          location: "",
          describe: "",
          picUrl: "",
          sequence: "",
          status: "",
          creator: "",
          createDatetime: "",
          updator: "",
          updateDatetime: ""
        }
      ],
      showPagePlug1: true
    };
  },
  mounted() {
    this.$store.state.pageNumParam = 1;
    this.getDefaultInfoFn();
    this.getSceneryDropFn();
  },
  methods: {
    //上传封面图
    chooseHeaderPicture(e) {
      this.ruleForm3.picUrl = e.target.files[0];
      var formdata = new FormData();
      formdata.append("file", this.ruleForm3.picUrl);
      this.$axios({
        method: "post",
        url: this.apiUploadImage,
        data: formdata
      })
        .then(res => {
          // console.log("景区图层管理上传图片返回了什么", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.ruleForm3.picUrl = res.data.value.url;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //清空封面图片
    clearPic1(n) {
      if (n == 1) {
        this.ruleForm3.picUrl = "../../static/addIcon.png";
      }
    },

    //获取景区下拉列表
    getSceneryDropFn() {
      this.$axios({
        method: "get",
        url: this.apiSceneryDrop,
        data: {}
      })
        .then(res => {
          // console.log("下拉是什么信息", res);
          if (res.data.resultStatus.resultCode === "0000") {
            this.sceneryArr = [...res.data.value];
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },

    //上传视频
    upMediaInfos(e) {
      this.mediaFilesInfo = e.target.files[0];
      this.ruleForm3.originalName = this.mediaFilesInfo.name;
      let tokenInfo = "";
      let formdata = new FormData();
      formdata.append("file", this.mediaFilesInfo);
      //前端上传音视频等文件到七牛云时关键三步
      //1，向后台调用特定获取token接口，以便获取与七牛云相关的对应token
      //2，自己服务器存储文件空间（即绑定的存储域名）在哪个大区，就调用哪个大区的七牛云共用接口，如华东：http://upload.qiniup.com
      //3，接口调用成功后，后台返回key后，将上述的存储域名与key结合到一块就成为最终的下载地址
      this.$axios
        .get(
          "/videomis/upload/uploadAuth?fileName=" + this.ruleForm3.originalName
        )
        .then(res => {
          // console.log('+++++++',res)
          tokenInfo = res.data.value.token;
          formdata.append("token", tokenInfo);

          this.$axios
            .post("https://upload-z2.qiniup.com", formdata, {
              emulateJSON: true
            })
            .then(res => {
              this.ruleForm3.fileName = res.data.key; //原来可以的
              // console.log('格式是否带在了后面',this.ruleForm.fileName)

              // this.ruleForm.url = 'http://tomepicture.zhihuiquanyu.com/' + res.data.key
              // console.log('媒体资源上传重要传输环节+++', this.ruleForm.url)

              this.ruleForm3.url = res.data.key;
              // console.log("媒体资源上传重要传输环节+++", this.ruleForm3.url);
            })
            .catch(error => {
              // console.log(error);
            });
        });
    },

    //重新上传切换显示隐藏
    newUploadVideo() {
      this.$confirm("确定重新上传后，之前的视频将被彻底覆盖?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.numParam = 1;
        })
        .catch(() => {
          this.$message.warning("本次操作已取消");
        });
    },

    //获取模板详情（模板点位模态框列表）
    // getTemplateInfoFn(n) {
    //   console.log('模板点位信息：', n)
    // },

    getTemplateInfoFn(n) {
      // console.log("模板点位信息：", n);
      if (!this.$store.state.templateListShow) {
        this.commonId = n.id;
        this.ruleForm3.templetId = n.id;
      }

      //此方法里面的请求是获取点位详情明细表
      this.$axios({
        method: "post",
        url: this.apiQueryX,
        data: {
          pageNum: this.$store.state.pageNumParam2,
          pageSize: this.$store.state.pageSizeParam2,
          templetId: this.commonId
        }
      })
        .then(res => {
          // console.log("列表222信息", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            if (res.data.value.list.length != "0") {
              this.tableData2 = [...res.data.value.list];
              this.$store.state.totalParam2 = res.data.value.total;
            } else {
              this.tableData2 = [];
              this.$store.state.totalParam2 = 0;
            }
            this.$store.state.templateListShow = true;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //获取默认第一列表详情
    getDefaultInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam,
          sceneryName: "",
          name: "",
          startDatetime: "",
          endDatetime: "",
          status: ""
        }
      })
        .then(res => {
          // console.log("列表信息", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            if (res.data.value.list.length != "0") {
              this.tableData = [...res.data.value.list];
              this.$store.state.totalParam = res.data.value.total;
            } else {
              this.tableData = [];
              this.$store.state.totalParam = 0;
            }
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //第一列表查询方法
    queryInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam,
          sceneryName: this.$store.state.affiliatedSceneryParam,
          name: this.$store.state.templateNameParam,
          startDatetime: this.$store.state.startDateParam,
          endDatetime: this.$store.state.endDateParam,
          status: this.$store.state.stateParam
        }
      })
        .then(res => {
          // console.log("查询按钮或者翻页按钮信息", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            if (res.data.value.list.length != "0") {
              this.tableData = [...res.data.value.list];
              this.$store.state.totalParam = res.data.value.total;
            } else {
              this.tableData = [];
              this.$store.state.totalParam = 0;
            }
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    // 新增前清空数据方法
    beforeAddFn() {
      for (let item in this.ruleForm) {
        this.ruleForm[item] = "";
      }

      this.$store.state.sceneryShotTemplate = true;
    },

    beforeAddFn2() {
      let qqqq = this.ruleForm3.templetId;
      for (let item in this.ruleForm3) {
        this.ruleForm3[item] = "";
      }
      this.ruleForm3.picUrl = "../../static/addIcon.png";
      this.ruleForm3.templetId = qqqq;
      this.numParam = 1;
      this.$store.state.pointpointShow = true;
    },

    //新增
    addFn() {
      // console.log('jjjjjj:',this.ruleForm.sceneryId)

      this.$axios({
        method: "post",
        url: this.apiAdd,
        data: this.ruleForm
      }).then(res => {
        // console.log("新增是否成功", res.data);
        if (res.data.resultStatus.resultCode === "0000") {
          this.$store.state.sceneryShotTemplate = false;
          this.$store.state.pageNumParam = 1;
          this.getDefaultInfoFn();
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },

    addFn2() {
      // console.log('jjjjjj:',this.ruleForm.sceneryId)

      this.$axios({
        method: "post",
        url: this.apiAdd2,
        data: this.ruleForm3
      }).then(res => {
        // console.log("新增是否成功", res.data);
        if (res.data.resultStatus.resultCode === "0000") {
          this.$store.state.pointpointShow = false;
          this.$store.state.pageNumParam2 = 1;
          this.getTemplateInfoFn();
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },

    //获取相关信息后，显示编辑模态框
    beforeEditFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.$store.state.titleHeader = "编辑";
        this.$store.state.sceneryShotTemplate = true;
      }
    },

    beforeEditFn2() {
      if (this.commonIdX == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.$store.state.titleHeader = "编辑";
        this.numParam = 2;
        this.$store.state.pointpointShow = true;
      }
    },

    //编辑事件
    editFn() {
      this.$axios({
        method: "post",
        url: this.apiEdit,
        data: this.ruleForm
      })
        .then(res => {
          // console.log("编辑是否成功", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.$store.state.sceneryShotTemplate = false;
            this.$store.state.pageNumParam = 1;
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    editFn2() {
      this.$axios({
        method: "post",
        url: this.apiEdit2,
        data: this.ruleForm3
      })
        .then(res => {
          // console.log("编辑是否成功", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.$store.state.pointpointShow = false;
            this.$store.state.pageNumParam2 = 1;
            this.getTemplateInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //禁用，启用前先获取对应行数据的id
    chooseInfo(n) {
      this.templeteStatus = n.status;
      // console.log("模板状态：{}", this.templeteStatus)
      if (this.commonId != n.id) {
        // 防止单条数据已经被获取，却重复查询
        this.commonId = n.id;
        // console.log('编辑前先获取信息：',n)
        if (this.commonId == "") {
          if (document.getElementsByClassName("el-message").length === 0) {
            this.$message.warning("请选择一条数据");
          }
        } else {
          this.$axios({
            method: "get",
            url: this.apiGetInfo + "?id=" + n.id,
            data: {}
          })
            .then(res => {
              // console.log("编辑前先获取到的信息：", res.data.value);
              let k = res.data.value;
              this.ruleForm.sceneryName = k.sceneryName;
              this.ruleForm.originalName = "";
              this.ruleForm.sceneryId = k.sceneryId;
              this.ruleForm.name = k.name;

              this.ruleForm.durationLimit = k.durationLimit;

              this.ruleForm.url = k.url;
              this.ruleForm.describe = k.describe;
              this.ruleForm.pointNum = k.pointNum;
              this.ruleForm.sort = k.sort;
              this.ruleForm.id = k.id;
            })
            .catch(error => {});
        }
      }
    },
    chooseInfoX(n) {
      // console.log("二级内的选择行获取航信息，", n);
      this.templetePointStatus = n.status;
      if (this.commonIdX != n.id) {
        // 防止单条数据已经被获取，却重复查询
        this.commonIdX = n.id;
        if (this.commonIdX == "") {
          if (document.getElementsByClassName("el-message").length === 0) {
            this.$message.warning("请选择一条数据");
          }
        } else {
          this.$axios({
            method: "get",
            url: this.apiGetInfo2 + "?id=" + n.id,
            data: {}
          }).then(res => {
            // console.log("2级别编辑前先获取到的信息：", res.data.value);
            let y = res.data.value;
            this.ruleForm3.id = y.id;
            this.ruleForm3.describe = y.describe;
            this.ruleForm3.location = y.location;
            this.ruleForm3.name = y.name;
            this.ruleForm3.picUrl = y.picUrl;
            this.ruleForm3.url = y.url;
            this.ruleForm3.sequence = y.sequence;
            this.ruleForm3.templetId = y.templetId;
          });
        }
      }
    },
    //模板启用
    enabledTempleteFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.templeteStatus == 1) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此模板已被启用，无须操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiEnabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("启用之后的返回结果，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            // this.$store.state.pageNumParam = 1;
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },
    //模板片段启用
    enabledFn2() {
      if (this.commonIdX == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.templetePointStatus == 1) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此模板片段已被启用，无须操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiEnabled2 + "?id=" + this.commonIdX,
          data: {}
        }).then(res => {
          // console.log("启用之后的返回结果，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            // this.$store.state.pageNumParam2 = 1;
            this.commonIdX = "";
            this.getTemplateInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },
    // 模板禁用
    disabledTempleteFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.templeteStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此模板已被禁用，无须操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiDisabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("禁用之后返回的结果，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            // this.$store.state.pageNumParam = 1;
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },
    // 模板片段禁用
    disabledFn2() {
      if (this.commonIdX == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.templetePointStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此模板片段已被禁用，无须操作");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiDisabled2 + "?id=" + this.commonIdX,
          data: {}
        }).then(res => {
          // console.log("禁用之后返回的结果，", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            // this.$store.state.pageNumParam2 = 1;
            this.commonIdX = "";
            this.getTemplateInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    //第二列表查询方法
    queryInfoFn2() {
      this.$axios({
        method: "post",
        url: this.apiQueryX,
        data: {
          pageNum: this.$store.state.pageNumParam2,
          pageSize: this.$store.state.pageSizeParam2,
          templetId: this.commonId
        }
      })
        .then(res => {
          // console.log("查询按钮或者翻页按钮信息", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            if (res.data.value.list.length != "0") {
              this.tableData2 = [...res.data.value.list];
              this.$store.state.totalParam2 = res.data.value.total;
            } else {
              this.tableData2 = [];
              this.$store.state.totalParam2 = 0;
            }
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "ruleForm") {
            if (this.$store.state.titleHeader === "新增") {
              this.addFn();
            } else if (this.$store.state.titleHeader === "编辑") {
              this.editFn();
            }
          } else if (formName === "ruleForm2") {
          } else if (formName === "ruleForm3") {
            if (this.$store.state.titleHeader === "新增") {
              this.addFn2();
            } else if (this.$store.state.titleHeader === "编辑") {
              this.editFn2();
            }
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    cancelForm(formName) {
      if (formName === "ruleForm") {
        this.$store.state.sceneryShotTemplate = false;
      } else if (formName === "ruleForm2") {
        this.$store.state.chooseNeedBox = false;
      } else if (formName === "ruleForm3") {
        this.$store.state.pointpointShow = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
