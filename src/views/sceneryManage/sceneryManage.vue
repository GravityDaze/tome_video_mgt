<template>
  <div>
    <mySearchs
      :sign="sign"
      :isSceneryName="isSceneryName"
      :isSceneryNum="isSceneryNum"
      :isEnabledVideo="isEnabledVideo"
      :isHot="isHot"
      :addBtn="addBtn"
      :editBtn="editBtn"
      :setHot="setHot"
      :cancelHot="cancelHot"
      :openVideoBtn="openVideoBtn"
      :closeVideoBtn="closeVideoBtn"
      :tagBtn="tagBtn"
      @beforeAddFn="beforeAddFn"
      @addFn="addFn"
      @beforeEditFn="beforeEditFn"
      @editFn="editFn"
      @setHotFn="setHotFn"
      @cancelHotFn="cancelHotFn"
      @openVideo="openVideo"
      @tagSelectFn="tagSelectFn"
      @closeVideo="closeVideo"
      @queryInfoFn="queryInfoFn"
      class="my_searchs"
    ></mySearchs>
    <myTables
      :sign="sign"
      :showSceneryNum="showSceneryNum"
      :showState="showState"
      :isShowEnabled="isShowEnabled"
      :showHandle="showHandle"
      :tableTitle="tableTitle"
      :tableData="tableData"
      @gotoInfoPageFn="gotoInfoPageFn"
      @queryInfoFn="queryInfoFn"
      @chooseInfo="chooseInfo"
      class="my_tables"
    ></myTables>

    <!--景区管理新增或者编辑-->
    <div id="publicAddEditorDialog">
      <el-dialog
        :title="$store.state.titleHeader"
        :visible.sync="$store.state.scenerymanage"
        width="35%"
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
            <el-col :span="18" :offset="2">
              <el-form-item label="景区名称" prop="name">
                <el-col>
                  <el-input v-model.trim="ruleForm.name"></el-input>
                </el-col>
                <!--<el-col v-if="$store.state.titleHeader=='编辑'">-->
                <!--<el-input v-model="ruleForm.name" :disabled="true"></el-input>-->
                <!--</el-col>-->
              </el-form-item>
            </el-col>

            <el-col :span="18" :offset="2">
              <el-form-item label="经纬度" prop="lonLat">
                <el-col class="lng_lat_outbox">
                  <el-input v-model.trim="ruleForm.lonLat"></el-input>
                  <button @click="getLnglat">获取</button>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="18" :offset="2">
              <el-form-item label="服务器URL" prop="aiUrl">
                <el-col>
                  <el-input v-model.trim="ruleForm.aiUrl"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="22" :offset="2">
              <el-form-item label="标识" prop="mark">
                <el-col :span="18">
                  <el-input v-model.trim="ruleForm.mark"></el-input>
                </el-col>
                <el-col :span="1">
                  <el-popover placement="right-start" width="210" trigger="hover">
                    <span style="color:red;font-size:16px">
                      <b>此唯一标识必须与指定景区视频合成服务器统一，不可随意定义</b>
                    </span>
                    <i class="el-icon-info" slot="reference"></i>
                  </el-popover>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="18" :offset="2">
              <el-form-item label="景区描述">
                <el-col>
                  <el-input
                    type="textarea"
                    v-model.trim="ruleForm.describe"
                    maxlength="30"
                    show-word-limit
                  ></el-input>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col class="face">
              <div class="face_title" style="width:20%">
                <span style="color: red; display:inline">*</span>
                <span style="display:inline">封面图</span>
              </div>
              <div class="obj_box">
                <div
                  class="upload_header"
                  :style="{backgroundImage:'url('+ruleForm.iconUrl+')',backgroundSize:'100% 100%'}"
                ></div>
                <input class="upload_input my_hover" type="file" @change="chooseHeaderPicture" />
              </div>
              <div class="clear_btn">
                <span class="my_hover" @click="clearPic1(1)">清空图片</span>
              </div>
            </el-col>
            <el-col class="position_center">
              <span class="tip_info">{{tipInfo}}</span>
            </el-col>

            <el-col class="face">
              <div class="face_title">
                <span>广告图</span>
              </div>
              <div class="obj_box">
                <div
                  class="upload_header"
                  :style="{backgroundImage:'url('+ruleForm.advertisementUrl+')',backgroundSize:'100% 100%'}"
                ></div>
                <input class="upload_input my_hover" type="file" @change="chooseHeaderPicturex" />
              </div>
              <div class="clear_btn">
                <span class="my_hover" @click="clearPic1(2)">清空图片</span>
              </div>
            </el-col>

            <el-col class="position_center">
              <span class="tip_info">{{tipInfo}}</span>
            </el-col>
            <el-col class="all_pic_box">
              <div class="pic_title">
                <span>展示图片</span>
              </div>
              <div>
                <div class="pic_and_input" v-for="(item,index) in picArr" :key="index">
                  <div
                    class="pic_box"
                    :style="{backgroundImage:'url('+item+')',backgroundSize:'100% 100%'}"
                  ></div>
                  <input class="input_box my_hover" type="file" @change="chooseHeaderPicture2" />
                </div>
              </div>
              <div class="clear_btn">
                <span class="my_hover" @click="clearPic2()">清空图片</span>
              </div>
            </el-col>
            <el-col class="position_center">
              <span class="tip_info">{{tipInfo1}}</span>
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

    <!--景区详情页面信息-->
    <div id="sceneryAllInfo">
      <el-dialog
        title="景区详情"
        :visible.sync="$store.state.scenerymanageInfo"
        width="35%"
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
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item label="景区名称">
                <!--<el-col>-->
                <!--<el-input v-model="ruleForm2.name"></el-input>-->
                <!--</el-col>-->
                <el-col :offset="5">
                  <span>{{ruleForm2.name}}</span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="景区编号">
                <el-col :offset="5">
                  <span>{{ruleForm2.no}}</span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="创建者">
                <el-col :offset="5">
                  <span>{{ruleForm2.creator}}</span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="创建时间">
                <el-col :offset="5">
                  <span>{{ruleForm2.createDatetime}}</span>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="18" :offset="2">
              <el-form-item label="更新者">
                <el-col :offset="5">
                  <span>{{ruleForm2.updator}}</span>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form-item label="最后更新时间">
                <el-col :offset="5">
                  <span>{{ruleForm2.updateDatetime}}</span>
                </el-col>
              </el-form-item>
            </el-col>

            <el-col class="face">
              <div>
                <span>封面图</span>
              </div>
              <div class="obj_box">
                <div
                  class="upload_header"
                  :style="{backgroundImage:'url('+ruleForm2.coverUrl+')',backgroundSize:'100% 100%'}"
                ></div>
                <!--<input class="upload_input my_hover" type="file">-->
              </div>
            </el-col>

            <el-col class="all_pic_box">
              <div class="pic_title">
                <span>展示图片</span>
              </div>
              <div>
                <div class="pic_and_input" v-for="(item,index) in picArr2" :key="index">
                  <div
                    class="pic_box"
                    :style="{backgroundImage:'url('+item+')',backgroundSize:'100% 100%'}"
                  ></div>
                  <!--<input class="input_box my_hover" type="file">-->
                </div>
              </div>
            </el-col>
          </el-row>
          <el-form-item>
            <!--<el-col :span="4" :offset="2">-->
            <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
            <!--</el-col>-->
            <el-col :span="6" :offset="8" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelForm('ruleForm2')">关闭</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <!--景区标签信息-->
    <div id="tagInfo">
      <el-dialog
        title="标签"
        :visible.sync="$store.state.sceneryTagInfo"
        width="45%"
        align="left"
        :close-on-click-modal="false"
      >
        <el-form
          :model="tagFrom"
          ref="tagFrom"
          label-width="10%"
          class="demo-ruleForm"
          size="medium"
          :hide-required-asterisk="false"
        >
          <el-row>
            <el-col :span="18" :offset="2">
              <el-form-item>
                <el-select
                  v-model="tagFrom.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  clearable
                  placeholder="请选择景区标签"
                  class="select_style1"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in tagArr"
                    :key="item.tagId"
                    :label="item.tagName"
                    :value="item.tagId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-col :span="10" :offset="6" style="display: flex;flex-wrap: nowrap">
              <el-button @click="cancelTag()" style="width:40%">关闭</el-button>
              <el-button type="primary" @click="submitTag()" style="width:40%">确定</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "scenery-manage",
  data() {
    return {
      apiUploadImage: "/videomis/upload/uploadImage",
      apiQuery: "videomis/scenery/query",
      apiAdd: "videomis/scenery/add",
      apiGetInfo: "videomis/scenery/get",
      apiGetInfosss: "videomis/scenery/detail",
      apiEdit: "videomis/scenery/update",
      apiSetHot: "videomis/scenery/hot",
      apiCancelHot: "videomis/scenery/hotCancel",
      apiEnabled: "videomis/scenery/enableService",
      apiDisabled: "videomis/scenery/disableService",
      apiSceneryTags: "videomis/scenery/getSceneryTags",
      apiSceneryEditTags: "videomis/scenery/editTags",
      apiTagSelect: "videomis/tags/select",
      commonId: "", //选择当前数据行是，对应需要的id
      sign: "scenerymanage",
      isSceneryName: true,
      isSceneryNum: true,
      isEnabledVideo: true,
      isHot: true,
      showSceneryNum: true,
      showState: true,
      isShowEnabled: true,
      addBtn: true,
      editBtn: true,
      setHot: true,
      cancelHot: true,
      openVideoBtn: true,
      closeVideoBtn: true,
      tagBtn: true,
      showHandle: false,
      tableTitle: [
        // {
        //   prop: 'sex',
        //   label: '性别',
        //   width: '100',
        //   align: 'center',
        //   formatter: function (row) {
        //     return row.sex == '1' ? '男' : '女'
        //   }
        // },
        {
          prop: "name",
          label: "景区名称",
          // width: '100',
          align: "center"
        },
        {
          prop: "mark",
          label: "标识",
          // width: '100',
          align: "center"
        },
        {
          prop: "hotStatus",
          label: "是否热门",
          // width: '180',
          align: "center",
          formatter: function(row) {
            return row.hotStatus == "1" ? "是" : "否";
          }
        },
        {
          prop: "updator",
          label: "最后更新者",
          // width: '180',
          align: "center"
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
          // width: '180',
          align: "center"
        },
        {
          prop: "tripStatus",
          label: "状态（视频）",
          // width: '180',
          align: "center",
          formatter: function(row) {
            return row.tripStatus == "1" ? "开启" : "关闭";
          }
        }
      ],
      tagArr: [],
      tagFrom: {
        tags: []
      },
      oldTagArr: [],
      tableData: [
        // {
        //   id: 1,
        //   name: "圆明园02",
        //   no: "S00001",
        //   tripStatus: 1,
        //   updateDatetime: "2019-11-18 14:02:57",
        //   updator: "gjz",
        // }
      ],
      defaultPic: "../../static/addIcon.png",
      tipInfo: "推荐尺寸为 157(宽) * 48(高)，大小不超过 300KB",
      tipInfo1: "推荐尺寸为 100(宽) * 50(高)，大小不超过 300KB",
      // paramArr:[this.defaultPic],//新增景区图片的时候，临时记录图片文件数据数组
      picArr: [this.defaultPic], //新增景区图片最终呈现文件图片数组
      picArr2: ["../../static/bg1.png", "../../static/bg2.png"], //展示详情页面，而不再有事件发生的图片呈现数组
      sceneryHotStatus: "",
      scenreyTripStatus: "",
      ruleForm: {
        name: "",
        lonLat: "",
        advertisementUrl: this.defaultPic,
        iconUrl: this.defaultPic,
        iconUrl2: [],
        aiUrl: "", //此景区的AI视频服务器地址
        mark: "", // 此景区的唯一标识
        describe: "" //此景区的描述
      },
      // 验证规则
      rules: {
        name: [{ required: true, message: "请输入景区名称", tigger: "blur" }],
        lonLat: [
          { required: true, message: "请输入景区经纬度", tigger: "blur" }
        ],
        aiUrl: [
          { required: true, message: "请输入景区AI服务器URL", tigger: "blur" }
        ],
        mark: [
          { required: true, message: "请输入景区唯一标识", tigger: "blur" }
        ]
      },
      ruleForm2: {
        name: "哼哈二将",
        no: "S1001",
        creator: "李天一",
        createDatetime: "2019-10-12",
        updator: "张晓明",
        updateDatetime: "2020-10-12",
        coverUrl: this.defaultPic,
        pictureUrl: "",
        tripStatus: "1"
      }
    };
  },
  mounted() {
    this.$store.state.pageNumParam = 1;
    this.getDefaultInfoFn();
  },
  methods: {
    //获取经纬度
    getLnglat() {
      window.open("http://api.map.baidu.com/lbsapi/getpoint/index.html");
    },

    getDefaultInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam,
          sceneryName: "",
          sceneryNo: "",
          startTirp: "",
          hotStatus: ""
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

    queryInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam,
          sceneryName: this.$store.state.sceneryNameParam,
          sceneryNo: this.$store.state.sceneryNoParam,
          startTirp: this.$store.state.startTirpParam,
          hotStatus: this.$store.state.sceneryHotStatusParam
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

    //点击列表内编号信息，进入详情页面
    gotoInfoPageFn(n) {
      // console.log("穿了什么过来哦", n);
      this.$axios({
        method: "get",
        url: this.apiGetInfosss + "?id=" + n.id,
        data: {}
      }).then(res => {
        // console.log("查看详情获取的后台信息", res.data);
        if (res.data.resultStatus.resultCode === "0000") {
          this.ruleForm2 = res.data.value;
          let k = [];
          if (res.data.value.pictureUrl) {
            k = res.data.value.pictureUrl.split(",");
          } else {
            k = [this.defaultPic];
          }

          this.picArr2 = [...k];
          this.$store.state.scenerymanageInfo = true;
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
      // this.$store.state.scenerymanageInfo = true
    },

    //获取当前点击行的相关信息
    chooseInfo(n) {
      // console.log('点击当前行获取数据为', n)
      this.commonId = n.id;
      this.sceneryHotStatus = n.hotStatus;
      this.scenreyTripStatus = n.tripStatus;
    },
    //查看景区详情信息方法
    checkSceneryInfoFn() {},

    // 新增前清空数据方法
    beforeAddFn() {
      for (let item in this.ruleForm) {
        this.ruleForm[item] = "";
      }
      this.ruleForm.iconUrl = this.defaultPic;
      this.ruleForm.advertisementUrl = this.defaultPic;
      this.ruleForm.iconUrl2 = [this.defaultPic];
      this.picArr = [this.defaultPic];
      this.$store.state.scenerymanage = true;
    },
    //新增事件
    addFn() {
      this.removeItem();
      this.ruleForm.iconUrl2 = [...this.picArr];
      // console.log('注意看所有图片的字符串',this.ruleForm.iconUrl2)
      if (this.ruleForm.iconUrl == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("景区封面图不能为空");
        }
      } else {
        this.$axios({
          method: "post",
          url: this.apiAdd,
          data: {
            name: this.ruleForm.name,
            lonLat: this.ruleForm.lonLat,
            advertisementUrl: this.ruleForm.advertisementUrl,
            coverUrl: this.ruleForm.iconUrl,
            imageUrls: this.ruleForm.iconUrl2,
            aiUrl: this.ruleForm.aiUrl,
            mark: this.ruleForm.mark,
            describe: this.ruleForm.describe
          }
        }).then(res => {
          // console.log("新增返回数据", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.$store.state.scenerymanage = false;
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },
    //编辑前读取旧信息
    beforeEditFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.$axios({
          method: "get",
          url: this.apiGetInfo + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("编辑前先获取默认数据", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.ruleForm.name = res.data.value.name;
            this.ruleForm.iconUrl = res.data.value.coverUrl;
            this.ruleForm.advertisementUrl =
              res.data.value.advertisementUrl == ""
                ? this.defaultPic
                : res.data.value.advertisementUrl;
            this.ruleForm.lonLat = res.data.value.lonLat;
            this.ruleForm.aiUrl = res.data.value.aiUrl;
            this.ruleForm.mark = res.data.value.mark;
            this.ruleForm.describe = res.data.value.describe;
            var k = [];
            if (res.data.value.pictureUrl) {
              k = [...res.data.value.pictureUrl.split(",")];
            }
            k.push(this.defaultPic);
            this.ruleForm.iconUrl2 = [...k];
            this.picArr = [...k];
            this.$store.state.scenerymanage = true;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },
    //编辑事件
    editFn() {
      this.removeItem();
      this.ruleForm.iconUrl2 = [...this.picArr];
      if (this.ruleForm.iconUrl == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("景区封面图不能为空");
        }
      } else {
        this.$axios({
          method: "post",
          url: this.apiEdit,
          data: {
            id: this.commonId,
            name: this.ruleForm.name,
            lonLat: this.ruleForm.lonLat,
            advertisementUrl: this.ruleForm.advertisementUrl,
            coverUrl: this.ruleForm.iconUrl,
            imageUrls: this.ruleForm.iconUrl2,
            aiUrl: this.ruleForm.aiUrl,
            mark: this.ruleForm.mark,
            describe: this.ruleForm.describe
          }
        }).then(res => {
          if (res.data.resultStatus.resultCode === "0000") {
            this.$store.state.scenerymanage = false;
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    removeItem() {
      var defaultPic = this.defaultPic;
      this.picArr = this.picArr.filter(function(item) {
        return item != defaultPic;
      });
      if (this.ruleForm.advertisementUrl === defaultPic) {
        this.ruleForm.advertisementUrl = "";
      }
      if (this.ruleForm.iconUrl === defaultPic) {
        this.ruleForm.iconUrl = "";
      }
    },

    //设置热门景区
    setHotFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.sceneryHotStatus == 1) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此景区已是热门景区，无须操作");
        }
      } else if (this.scenreyTripStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此景区未开启视频服务，无法进行此操作");
        }
      } else {
        this.$axios({
          method: "GET",
          url: this.apiSetHot + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log('设置热门返回结果',res.data)
          if (res.data.resultStatus.resultCode === "0000") {
            this.$message.success(res.data.resultStatus.resultMessage);
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },
    //取消热门景区
    cancelHotFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.sceneryHotStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此景区并非热门景区，无须操作");
        }
      } else {
        this.$axios({
          method: "GET",
          url: this.apiCancelHot + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("取消热门返回结果", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.$message.success(res.data.resultStatus.resultMessage);
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },

    //开启视频服务
    openVideo() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.scenreyTripStatus == 1) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此景区已开启视频服务，无须操作");
        }
      } else {
        this.$axios({
          method: "GET",
          url: this.apiEnabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("开启视频后", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },
    //关闭视频服务
    closeVideo() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else if (this.sceneryHotStatus == 0) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("此景区未开启视频服务，无须操作");
        }
      } else {
        this.$axios({
          method: "GET",
          url: this.apiDisabled + "?id=" + this.commonId,
          data: {}
        }).then(res => {
          // console.log("关闭视频后", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.commonId = "";
            this.getDefaultInfoFn();
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    },
    //上传封面图
    chooseHeaderPicture(e) {
      this.ruleForm.iconUrl = e.target.files[0];
      var formdata = new FormData();
      formdata.append("file", this.ruleForm.iconUrl);
      this.$axios({
        method: "post",
        url: this.apiUploadImage,
        data: formdata
      })
        .then(res => {
          // console.log("景区图层管理上传图片返回了什么", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.ruleForm.iconUrl = res.data.value.url;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //上传广告图
    chooseHeaderPicturex(e) {
      this.ruleForm.advertisementUrl = e.target.files[0];
      var formdata = new FormData();
      formdata.append("file", this.ruleForm.advertisementUrl);
      this.$axios({
        method: "post",
        url: this.apiUploadImage,
        data: formdata
      })
        .then(res => {
          // console.log("景区图层管理上传图片返回了什么", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            this.ruleForm.advertisementUrl = res.data.value.url;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //上传景区图
    chooseHeaderPicture2(e) {
      let picFile = "";
      let picUrl = "";
      picFile = e.target.files[0];

      var formdata = new FormData();
      formdata.append("file", picFile);
      this.$axios({
        method: "post",
        url: this.apiUploadImage,
        data: formdata
      })
        .then(res => {
          // console.log("景区图层管理上传图片返回了什么", res.data);
          if (res.data.resultStatus.resultCode === "0000") {
            picUrl = res.data.value.url;
            this.picArr.unshift(picUrl);
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    //清空封面图片
    clearPic1(n) {
      if (n == 1) {
        this.ruleForm.iconUrl = this.defaultPic;
      } else if (n == 2) {
        this.ruleForm.advertisementUrl = this.defaultPic;
      }
    },
    //清空景区图片
    clearPic2() {
      this.ruleForm.iconUrl2 = [this.defaultPic];
      this.picArr = [this.defaultPic];
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
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    cancelForm(formName) {
      if (formName === "ruleForm") {
        this.$refs[formName].resetFields();
        this.$store.state.scenerymanage = false;
      } else if (formName === "ruleForm2") {
        this.$store.state.scenerymanageInfo = false;
      }
    },
    tagSelectFn() {
      if (this.commonId == "") {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning("请选择一条数据");
        }
      } else {
        this.sceneryTagFn();
        this.tagSelectAllFn();
      }
    },
    sceneryTagFn() {
      this.$axios({
        method: "get",
        url: this.apiSceneryTags + "?sceneryId=" + this.commonId,
        data: {}
      }).then(res => {
        if (res.data.resultStatus.resultCode === "0000") {
          this.tagFrom.tags = [...res.data.value];
          this.oldTagArr = [...res.data.value];
          this.$store.state.sceneryTagInfo = true;
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },
    tagSelectAllFn() {
      this.$axios({
        method: "get",
        url: this.apiTagSelect + "?type=1",
        data: {}
      }).then(res => {
        if (res.data.resultStatus.resultCode === "0000") {
          this.tagArr = [...res.data.value];
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },
    cancelTag() {
      this.tagFrom.tags = [];
      this.oldTagArr = [];
      this.$store.state.sceneryTagInfo = false;
    },
    submitTag(formName) {
      // 当此景区本身就没有标签信息，也没有相应的标签信息选择，则不应该提交至后台，直接关闭弹窗即可
      if (this.oldTagArr.length == 0 && this.tagFrom.tags.length == 0) {
        this.$store.state.sceneryTagInfo = false;
      } else {
        this.$axios({
          method: "post",
          url: this.apiSceneryEditTags,
          data: {
            sceneryId: this.commonId,
            tags: this.tagFrom.tags
          }
        }).then(res => {
          if (res.data.resultStatus.resultCode === "0000") {
            this.tagFrom.tags = [];
            this.$message.success("景区标签修改成功");
            this.$store.state.sceneryTagInfo = false;
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.lng_lat_outbox {
  /*border:1px solid red;*/
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}
.lng_lat_outbox > button {
  display: inline-block;
  width: 50%;
}
</style>
