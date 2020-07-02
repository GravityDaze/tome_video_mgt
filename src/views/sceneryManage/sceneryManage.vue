<template>
  <div>
    <tables :tableData="tableData" :tableCols="tableCols" />
    <!-- 景区管理或新增模态框 -->
    <el-dialog title="表单" :visible.sync="editSceneryDialog" append-to-body top="1%">
      <el-form :model="editSceneryForm">
        <el-form-item label="景区名" label-width="120px">
          <el-input style="width:300px" v-model="editSceneryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="景区经纬度" label-width="120px">
          <el-input style="width:300px" v-model="editSceneryForm.lonLat"></el-input>
          <el-button @click="getLnglat" style="margin-left:10px">获取经纬度</el-button>
        </el-form-item>
        <el-form-item label="景区标识" label-width="120px">
          <el-input style="width:300px" v-model="editSceneryForm.mark"></el-input>
        </el-form-item>
        <el-form-item label="景区标签" label-width="120px">
          <el-tag
            :key="tag"
            v-for="tag in tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
        <el-form-item label="服务器URL" label-width="120px">
          <el-input style="width:300px" v-model="editSceneryForm.aiUrl"></el-input>
        </el-form-item>
        <el-form-item label="景区描述" label-width="120px">
          <el-input
            style="width:500px"
            type="textarea"
            v-model="editSceneryForm.describe"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="景区封面" label-width="120px">
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
            <img v-if="editSceneryForm.coverUrl" :src="editSceneryForm.coverUrl" class="upload-img" />
            <i v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="景区广告图" label-width="120px">
          <el-upload
            class="uploader"
            action="https://upload-z2.qiniup.com"
            :show-file-list="false"
            :on-success="onADUploadSuccess"
            :on-error="onError"
            :before-upload="beforeUpload"
            :data="{token}"
            :element-loading-text="tips"
          >
            <div slot="tip" class="el-upload__tip">推荐尺寸为157(宽)*48(高)，大小不超过 300KB</div>
            <img
              v-if="editSceneryForm.advertisementUrl"
              :src="editSceneryForm.advertisementUrl"
              class="upload-img"
            />
            <i v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="景区详图" label-width="120px">
          <el-upload
            action="https://upload-z2.qiniup.com"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-success="onShowImgSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
            :data="{token}"
          >
            <div slot="tip" class="el-upload__tip">推荐尺寸为100(宽)*50(高)，大小不超过 300KB</div>
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="previewUrl" alt />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSceneryDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 网络接口
import {
  getSceneryList,
  querySceneryDetail,
  querySceneryInfo,
  addScenery,
  editScenery,
  delScenery,
  serviceEnable,
  serviceDisable,
  setHotScenery,
  cancelHotScenery,
  getSceneryTags,
  editSceneryTags
} from "@/api/sceneryManage";
import { getPublicUploadParams } from "@/api/qiniu";
import Tables from "@/components/Tables";
export default {
  name: "scenery-manage",
  components: {
    Tables
  },
  data() {
    return {
      tableCols: [
        {
          prop: "no",
          label: "景区编号",
          align: "center"
        },
        {
          prop: "name",
          label: "景区名称",
          align: "center"
        },
        {
          prop: "mark",
          label: "标识",
          align: "center"
        },

        {
          prop: "updator",
          label: "最后更新者",
          align: "center"
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
          align: "center"
        },
        {
          prop: "hotStatus",
          label: "热门景区",
          align: "center",
          type: "switch",
          change: this.handleHotScenery
        },
        {
          prop: "tripStatus",
          label: "视频服务",
          align: "center",
          type: "switch",
          change: this.handleService
        },
        {
          label: "操作",
          type: "button",
          btnList: [
            { type: "primary", label: "编辑", handle: this.editScenery },
            { type: "danger", label: "删除", handle: this.deleteScenery }
          ]
        }
      ],
      tableData: [],
      editSceneryDialog: false, //景区修改或编辑模态框
      editSceneryForm: {
        name: "",
        lonLat: "",
        mark: "",
        coverUrl: "",
        advertisementUrl: "",
        imageUrls: []
      }, //模态框表单
      tags: [],
      tips: "",
      id: "", //记录当前正在编辑的景区id
      inputVisible: false, //标签相关参数
      inputValue: "", //标签相关参数
      token: "", //七牛云上传token
      dialogVisible: false, //展示图片预览对话框
      fileList: [], //视图上展示的fileList
      previewUrl: "" //预览图片url
    };
  },
  created() {
    this.getSceneryList();
  },
  methods: {
    // 获取景区列表
    async getSceneryList(query = { pageNum: 1, pageSize: 10 }) {
      const { data } = await getSceneryList(query);
      // 将后台返回的数据处理为符合tables组件的数据
      this.tableData = data.value.list.map(v => {
        // 将后台返回的0和1转换为布尔值
        v.hotStatus = !!v.hotStatus;
        v.tripStatus = !!v.tripStatus;
        return v;
      });
      console.log(this.tableData);
    },

    // 开启/关闭热门景区
    async handleHotScenery(row) {
      try {
        if (row.hotStatus) {
          await setHotScenery({ id: row.id });
          this.$message.success(`已将${row.name}设置为热门景区`);
        } else {
          await cancelHotScenery({ id: row.id });
          this.$message.success(`已将${row.name}取消热门景区`);
        }
      } catch (err) {
        // 错误时还原switch组件的状态
        row.hotStatus = !row.hotStatus;
      }
    },

    // 开启/关闭视频服务
    async handleService(row) {
      try {
        if (row.tripStatus) {
          await serviceEnable({ id: row.id });
          this.$message.success(`已开启${row.name}的视频服务`);
        } else {
          await serviceDisable({ id: row.id });
          this.$message.success(`已取消${row.name}的视频服务`);
          row.hotStatus = false;
        }
      } catch (err) {
        // 错误时还原switch组件的状态
        row.tripStatus = !row.tripStatus;
      }
    },

    // 编辑景区
    async editScenery({ id }) {
      // 打开模态框时获取到旧数据
      this.editSceneryDialog = true;
      // 记录id
      this.id = id;
      try {
        const [sceneryInfo, tags] = await Promise.all([
          querySceneryInfo({ id }),
          getSceneryTags({ sceneryId: id })
        ]);
        // 获取展示图的视图数据
        this.fileList = sceneryInfo.data.value.imageUrls
          .split(",")
          .map(v => ({ url: v }));
        // 将imageUrls转换为数组以便后续操作
        sceneryInfo.data.value.imageUrls = sceneryInfo.data.value.imageUrls.split(
          ","
        );
        this.editSceneryForm = { ...sceneryInfo.data.value };
        console.log(this.editSceneryForm);
        //
        this.tags = tags.data.value.map(v => v.tagName);
      } catch (err) {}
    },

    // 上传前统一回调
    async beforeUpload({ type, name }) {
      // 校验文件类型
      if (["image/jpeg", "image/png"].indexOf(type) == -1) {
        this.$message.error("只能上传jpg & png 格式的图片");
        return Promise.reject();
      } else {
        // 封面及广告图上传前获取到上传token
        try {
          const { data } = await getPublicUploadParams({ fileName: name });
          this.token = data.value.token;
          return true;
        } catch (err) {
          return Promise.reject();
        }
      }
    },

    // 封面上传成功
    onCoverUploadSuccess({ key }) {
      this.$message.success("上传成功");
      this.editSceneryForm.coverUrl = `https://tomevideo.zhihuiquanyu.com/${key}`;
    },

    // 广告图上传成功
    onADUploadSuccess({ key }) {
      this.$message.success("上传成功");
      this.editSceneryForm.advertisementUrl = `https://tomevideo.zhihuiquanyu.com/${key}`;
    },

    // 展示图上传成功
    onShowImgSuccess({ key }) {
      this.$message.success("上传成功");
      // 将新添加的图片添加到表单数据中
      this.editSceneryForm.imageUrls.push(
        `https://tomevideo.zhihuiquanyu.com/${key}`
      );
    },

    // 上传失败统一回调
    onError() {
      this.$message.error("上传失败");
    },

    // 预览展示图
    handlePictureCardPreview(file) {
      this.previewUrl = file.url;
      this.dialogVisible = true;
    },

    // 删除展示图
    handleRemove({ url }) {
      // 将fileList中的变动同步到表单数据中
      const delIndex = this.editSceneryForm.imageUrls.findIndex(v => v === url);
      this.editSceneryForm.imageUrls.splice(delIndex, 1);
    },

    // 删除标签
    handleClose(tag) {
      this.tags.splice(
        this.tags.indexOf(tag),
        1
      );
    },

    // 显示标签输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 标签提交
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    async submit(id) {
      // 调用修改景区接口
      try{
        const [res1, res2] = await Promise.all([
        editScenery({ ...this.editSceneryForm, id: this.id }),
        editSceneryTags({ sceneryId: this.id, tags: this.tags })
      ]);
      }catch(err){
        // 错误时的逻辑
      }
      
     
    },

    // 删除景区
    deleteScenery(row) {
      console.log(row);
    },

    //获取经纬度
    getLnglat() {
      window.open("http://api.map.baidu.com/lbsapi/getpoint/index.html");
    }
  }

  //   getDefaultInfoFn() {
  //     this.$axios({
  //       method: "post",
  //       url: this.apiQuery,
  //       data: {
  //         pageNum: this.$store.state.pageNumParam,
  //         pageSize: this.$store.state.pageSizeParam,
  //         sceneryName: "",
  //         sceneryNo: "",
  //         startTirp: "",
  //         hotStatus: ""
  //       }
  //     })
  //       .then(res => {
  //         // console.log("列表信息", res.data);
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           if (res.data.value.list.length != "0") {
  //             this.tableData = [...res.data.value.list];
  //             this.$store.state.totalParam = res.data.value.total;
  //           } else {
  //             this.tableData = [];
  //             this.$store.state.totalParam = 0;
  //           }
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       })
  //       .catch(error => {});
  //   },

  //   queryInfoFn() {
  //     this.$axios({
  //       method: "post",
  //       url: this.apiQuery,
  //       data: {
  //         pageNum: this.$store.state.pageNumParam,
  //         pageSize: this.$store.state.pageSizeParam,
  //         sceneryName: this.$store.state.sceneryNameParam,
  //         sceneryNo: this.$store.state.sceneryNoParam,
  //         startTirp: this.$store.state.startTirpParam,
  //         hotStatus: this.$store.state.sceneryHotStatusParam
  //       }
  //     })
  //       .then(res => {
  //         // console.log("查询按钮或者翻页按钮信息", res.data);
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           if (res.data.value.list.length != "0") {
  //             this.tableData = [...res.data.value.list];
  //             this.$store.state.totalParam = res.data.value.total;
  //           } else {
  //             this.tableData = [];
  //             this.$store.state.totalParam = 0;
  //           }
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       })
  //       .catch(error => {});
  //   },

  //   //点击列表内编号信息，进入详情页面
  //   gotoInfoPageFn(n) {
  //     // console.log("穿了什么过来哦", n);
  //     this.$axios({
  //       method: "get",
  //       url: this.apiGetInfosss + "?id=" + n.id,
  //       data: {}
  //     }).then(res => {
  //       // console.log("查看详情获取的后台信息", res.data);
  //       if (res.data.resultStatus.resultCode === "0000") {
  //         this.ruleForm2 = res.data.value;
  //         let k = [];
  //         if (res.data.value.imageUrls) {
  //           k = res.data.value.imageUrls.split(",");
  //         } else {
  //           k = [this.defaultPic];
  //         }

  //         this.picArr2 = [...k];
  //         this.$store.state.scenerymanageInfo = true;
  //       } else {
  //         this.$message.warning(res.data.resultStatus.resultMessage);
  //       }
  //     });
  //     // this.$store.state.scenerymanageInfo = true
  //   },

  //   //获取当前点击行的相关信息
  //   chooseInfo(n) {
  //     // console.log('点击当前行获取数据为', n)
  //     this.commonId = n.id;
  //     this.sceneryHotStatus = n.hotStatus;
  //     this.scenreyTripStatus = n.tripStatus;
  //   },
  //   //查看景区详情信息方法
  //   checkSceneryInfoFn() {},

  //   // 新增前清空数据方法
  //   beforeAddFn() {
  //     for (let item in this.ruleForm) {
  //       this.ruleForm[item] = "";
  //     }
  //     this.ruleForm.iconUrl = this.defaultPic;
  //     this.ruleForm.advertisementUrl = this.defaultPic;
  //     this.ruleForm.iconUrl2 = [this.defaultPic];
  //     this.picArr = [this.defaultPic];
  //     this.$store.state.scenerymanage = true;
  //   },
  //   //新增事件
  //   addFn() {
  //     this.removeItem();
  //     this.ruleForm.iconUrl2 = [...this.picArr];
  //     // console.log('注意看所有图片的字符串',this.ruleForm.iconUrl2)
  //     if (this.ruleForm.iconUrl == "") {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("景区封面图不能为空");
  //       }
  //     } else {
  //       this.$axios({
  //         method: "post",
  //         url: this.apiAdd,
  //         data: {
  //           name: this.ruleForm.name,
  //           lonLat: this.ruleForm.lonLat,
  //           advertisementUrl: this.ruleForm.advertisementUrl,
  //           coverUrl: this.ruleForm.iconUrl,
  //           imageUrls: this.ruleForm.iconUrl2,
  //           aiUrl: this.ruleForm.aiUrl,
  //           mark: this.ruleForm.mark,
  //           describe: this.ruleForm.describe
  //         }
  //       }).then(res => {
  //         // console.log("新增返回数据", res.data);
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           this.$store.state.scenerymanage = false;
  //           this.getDefaultInfoFn();
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       });
  //     }
  //   },
  //   //编辑前读取旧信息
  //   beforeEditFn() {
  //     if (this.commonId == "") {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("请选择一条数据");
  //       }
  //     } else {
  //       this.$axios({
  //         method: "get",
  //         url: this.apiGetInfo + "?id=" + this.commonId,
  //         data: {}
  //       }).then(res => {
  //         // console.log("编辑前先获取默认数据", res.data);
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           this.ruleForm.name = res.data.value.name;
  //           this.ruleForm.iconUrl = res.data.value.coverUrl;
  //           this.ruleForm.advertisementUrl =
  //             res.data.value.advertisementUrl == ""
  //               ? this.defaultPic
  //               : res.data.value.advertisementUrl;
  //           this.ruleForm.lonLat = res.data.value.lonLat;
  //           this.ruleForm.aiUrl = res.data.value.aiUrl;
  //           this.ruleForm.mark = res.data.value.mark;
  //           this.ruleForm.describe = res.data.value.describe;
  //           var k = [];
  //           if (res.data.value.imageUrls) {
  //             k = [...res.data.value.imageUrls.split(",")];
  //           }
  //           k.push(this.defaultPic);
  //           this.ruleForm.iconUrl2 = [...k];
  //           this.picArr = [...k];
  //           this.$store.state.scenerymanage = true;
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       });
  //     }
  //   },
  //   //编辑事件
  //   editFn() {
  //     this.removeItem();
  //     this.ruleForm.iconUrl2 = [...this.picArr];
  //     if (this.ruleForm.iconUrl == "") {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("景区封面图不能为空");
  //       }
  //     } else {
  //       this.$axios({
  //         method: "post",
  //         url: this.apiEdit,
  //         data: {
  //           id: this.commonId,
  //           name: this.ruleForm.name,
  //           lonLat: this.ruleForm.lonLat,
  //           advertisementUrl: this.ruleForm.advertisementUrl,
  //           coverUrl: this.ruleForm.iconUrl,
  //           imageUrls: this.ruleForm.iconUrl2,
  //           aiUrl: this.ruleForm.aiUrl,
  //           mark: this.ruleForm.mark,
  //           describe: this.ruleForm.describe
  //         }
  //       }).then(res => {
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           this.$store.state.scenerymanage = false;
  //           this.getDefaultInfoFn();
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       });
  //     }
  //   },

  //   removeItem() {
  //     var defaultPic = this.defaultPic;
  //     this.picArr = this.picArr.filter(function(item) {
  //       return item != defaultPic;
  //     });
  //     if (this.ruleForm.advertisementUrl === defaultPic) {
  //       this.ruleForm.advertisementUrl = "";
  //     }
  //     if (this.ruleForm.iconUrl === defaultPic) {
  //       this.ruleForm.iconUrl = "";
  //     }
  //   },

  //   //设置热门景区
  //   setHotFn() {
  //     if (this.commonId == "") {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("请选择一条数据");
  //       }
  //     } else if (this.sceneryHotStatus == 1) {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("此景区已是热门景区，无须操作");
  //       }
  //     } else if (this.scenreyTripStatus == 0) {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("此景区未开启视频服务，无法进行此操作");
  //       }
  //     } else {
  //       this.$axios({
  //         method: "GET",
  //         url: this.apiSetHot + "?id=" + this.commonId,
  //         data: {}
  //       }).then(res => {
  //         // console.log('设置热门返回结果',res.data)
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           this.$message.success(res.data.resultStatus.resultMessage);
  //           this.commonId = "";
  //           this.getDefaultInfoFn();
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       });
  //     }
  //   },
  //   //取消热门景区
  //   cancelHotFn() {
  //     if (this.commonId == "") {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("请选择一条数据");
  //       }
  //     } else if (this.sceneryHotStatus == 0) {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("此景区并非热门景区，无须操作");
  //       }
  //     } else {
  //       this.$axios({
  //         method: "GET",
  //         url: this.apiCancelHot + "?id=" + this.commonId,
  //         data: {}
  //       }).then(res => {
  //         // console.log("取消热门返回结果", res.data);
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           this.$message.success(res.data.resultStatus.resultMessage);
  //           this.commonId = "";
  //           this.getDefaultInfoFn();
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       });
  //     }
  //   },

  //   //开启视频服务
  //   openVideo() {
  //     if (this.commonId == "") {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("请选择一条数据");
  //       }
  //     } else if (this.scenreyTripStatus == 1) {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("此景区已开启视频服务，无须操作");
  //       }
  //     } else {
  //       this.$axios({
  //         method: "GET",
  //         url: this.apiEnabled + "?id=" + this.commonId,
  //         data: {}
  //       }).then(res => {
  //         // console.log("开启视频后", res.data);
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           this.commonId = "";
  //           this.getDefaultInfoFn();
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       });
  //     }
  //   },
  //   //关闭视频服务
  //   closeVideo() {
  //     if (this.commonId == "") {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("请选择一条数据");
  //       }
  //     } else if (this.sceneryHotStatus == 0) {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("此景区未开启视频服务，无须操作");
  //       }
  //     } else {
  //       this.$axios({
  //         method: "GET",
  //         url: this.apiDisabled + "?id=" + this.commonId,
  //         data: {}
  //       }).then(res => {
  //         // console.log("关闭视频后", res.data);
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           this.commonId = "";
  //           this.getDefaultInfoFn();
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       });
  //     }
  //   },
  //   //上传封面图
  //   chooseHeaderPicture(e) {
  //     this.ruleForm.iconUrl = e.target.files[0];
  //     var formdata = new FormData();
  //     formdata.append("file", this.ruleForm.iconUrl);
  //     this.$axios({
  //       method: "post",
  //       url: this.apiUploadImage,
  //       data: formdata
  //     })
  //       .then(res => {
  //         // console.log("景区图层管理上传图片返回了什么", res.data);
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           this.ruleForm.iconUrl = res.data.value.url;
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       })
  //       .catch(error => {});
  //   },

  //   //上传广告图
  //   chooseHeaderPicturex(e) {
  //     this.ruleForm.advertisementUrl = e.target.files[0];
  //     var formdata = new FormData();
  //     formdata.append("file", this.ruleForm.advertisementUrl);
  //     this.$axios({
  //       method: "post",
  //       url: this.apiUploadImage,
  //       data: formdata
  //     })
  //       .then(res => {
  //         // console.log("景区图层管理上传图片返回了什么", res.data);
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           this.ruleForm.advertisementUrl = res.data.value.url;
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       })
  //       .catch(error => {});
  //   },

  //   //上传景区图
  //   chooseHeaderPicture2(e) {
  //     let picFile = "";
  //     let picUrl = "";
  //     picFile = e.target.files[0];

  //     var formdata = new FormData();
  //     formdata.append("file", picFile);
  //     this.$axios({
  //       method: "post",
  //       url: this.apiUploadImage,
  //       data: formdata
  //     })
  //       .then(res => {
  //         // console.log("景区图层管理上传图片返回了什么", res.data);
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           picUrl = res.data.value.url;
  //           this.picArr.unshift(picUrl);
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       })
  //       .catch(error => {});
  //   },

  //   //清空封面图片
  //   clearPic1(n) {
  //     if (n == 1) {
  //       this.ruleForm.iconUrl = this.defaultPic;
  //     } else if (n == 2) {
  //       this.ruleForm.advertisementUrl = this.defaultPic;
  //     }
  //   },
  //   //清空景区图片
  //   clearPic2() {
  //     this.ruleForm.iconUrl2 = [this.defaultPic];
  //     this.picArr = [this.defaultPic];
  //   },

  //   submitForm(formName) {
  //     this.$refs[formName].validate(valid => {
  //       if (valid) {
  //         if (formName === "ruleForm") {
  //           if (this.$store.state.titleHeader === "新增") {
  //             this.addFn();
  //           } else if (this.$store.state.titleHeader === "编辑") {
  //             this.editFn();
  //           }
  //         } else if (formName === "ruleForm2") {
  //         }
  //       } else {
  //         // console.log("error submit!!");
  //         return false;
  //       }
  //     });
  //   },
  //   cancelForm(formName) {
  //     if (formName === "ruleForm") {
  //       this.$refs[formName].resetFields();
  //       this.$store.state.scenerymanage = false;
  //     } else if (formName === "ruleForm2") {
  //       this.$store.state.scenerymanageInfo = false;
  //     }
  //   },
  //   tagSelectFn() {
  //     if (this.commonId == "") {
  //       if (document.getElementsByClassName("el-message").length === 0) {
  //         this.$message.warning("请选择一条数据");
  //       }
  //     } else {
  //       this.sceneryTagFn();
  //       this.tagSelectAllFn();
  //     }
  //   },
  //   sceneryTagFn() {
  //     this.$axios({
  //       method: "get",
  //       url: this.apiSceneryTags + "?sceneryId=" + this.commonId,
  //       data: {}
  //     }).then(res => {
  //       if (res.data.resultStatus.resultCode === "0000") {
  //         this.tagFrom.tags = [...res.data.value];
  //         this.oldTagArr = [...res.data.value];
  //         this.$store.state.sceneryTagInfo = true;
  //       } else {
  //         this.$message.warning(res.data.resultStatus.resultMessage);
  //       }
  //     });
  //   },
  //   tagSelectAllFn() {
  //     this.$axios({
  //       method: "get",
  //       url: this.apiTagSelect + "?type=1",
  //       data: {}
  //     }).then(res => {
  //       if (res.data.resultStatus.resultCode === "0000") {
  //         this.tagArr = [...res.data.value];
  //       } else {
  //         this.$message.warning(res.data.resultStatus.resultMessage);
  //       }
  //     });
  //   },
  //   cancelTag() {
  //     this.tagFrom.tags = [];
  //     this.oldTagArr = [];
  //     this.$store.state.sceneryTagInfo = false;
  //   },
  //   submitTag(formName) {
  //     // 当此景区本身就没有标签信息，也没有相应的标签信息选择，则不应该提交至后台，直接关闭弹窗即可
  //     if (this.oldTagArr.length == 0 && this.tagFrom.tags.length == 0) {
  //       this.$store.state.sceneryTagInfo = false;
  //     } else {
  //       this.$axios({
  //         method: "post",
  //         url: this.apiSceneryEditTags,
  //         data: {
  //           sceneryId: this.commonId,
  //           tags: this.tagFrom.tags
  //         }
  //       }).then(res => {
  //         if (res.data.resultStatus.resultCode === "0000") {
  //           this.tagFrom.tags = [];
  //           this.$message.success("景区标签修改成功");
  //           this.$store.state.sceneryTagInfo = false;
  //         } else {
  //           this.$message.warning(res.data.resultStatus.resultMessage);
  //         }
  //       });
  //     }
  //   }
};
</script>

<style lang="less">
// 景区标签
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

// 上传框
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
  width: 157px;
  height: 48px;
  line-height: 48px;
  text-align: center;
}
.upload-img {
  width: 157px;
  height: 48px;
  display: block;
}
</style>
