<template>
  <el-card class="scenery-manage">
    <ProTable
      :formData="formData"
      v-loading="tablesLoading"
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />
    <!-- 景区管理或新增模态框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="dialogTitle"
      :visible.sync="sceneryDialog"
      class="dialog-vertical"
      append-to-body
      @closed="dialogClose('sceneryForm')"
    >
      <!-- @closed="dialogClose('sceneryForm')" -->
      <el-form :model="sceneryForm" :rules="rules" ref="sceneryForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="景区名" label-width="120px" prop="name">
              <el-input
                placeholder="请输入景区名称"
                v-model="sceneryForm.name"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="服务器URL" label-width="120px" prop="aiUrl">
              <el-input v-model="sceneryForm.aiUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="景区经纬度" label-width="120px" prop="lonLat">
              <el-input
                placeholder="请输入景区经纬度"
                v-model="sceneryForm.lonLat"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="景区标识" label-width="120px" prop="mark">
              <el-input
                placeholder="请输入景区标识"
                v-model="sceneryForm.mark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="景区标签" label-width="120px">
              <el-tag
                :key="tag"
                v-for="tag in tags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
               
                >{{ tag }}</el-tag
              >
              <el-autocomplete
                v-if="inputVisible"
                class="input-new-tag"
                v-model="inputValue"
                :fetch-suggestions="getAllTags"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                @select="handleSelect"
              ></el-autocomplete>

              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                :style="{ marginLeft:tags.length?'10px':'0' }"
                >+ 新增</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="景区描述" label-width="120px" prop="describe">
          <el-input
            style="width: 500px"
            type="textarea"
            v-model="sceneryForm.describe"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item
              ref="cover"
              label="景区封面"
              label-width="120px"
              prop="coverUrl"
            >
              <Uploader
                :imageUrl="sceneryForm.coverUrl"
                @success="onCoverUploadSuccess"
                tips=" 推荐宽高比为6:4，大小不超过 300KB"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="景区广告图" label-width="120px">
              <Uploader
                :imageUrl="sceneryForm.advertisementUrl"
                @success="onADUploadSuccess"
                tips=" 推荐宽高比为6:4，大小不超过 300KB"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              ref="showImg"
              label="景区详图"
              label-width="120px"
              prop="imageUrls"
            >
              <Uploader
                @success="onShowImgSuccess"
                @preview="handlePictureCardPreview"
                @remove="handleRemove"
                :file-list="fileList"
                list-type="picture-card"
              />
              <el-dialog :visible.sync="dialogVisible" append-to-body>
                <img width="100%" :src="previewUrl" alt />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sceneryDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit('sceneryForm')"
          >确 定</el-button
        >
      </div>
      <!-- <ProForm 
        :forms="forms" 
        @submit="submit1"
        :formdata="formdata"
        ref="form" 
        /> -->
    </el-dialog>
  </el-card>
</template>

<script>
// 网络接口
import {
  getSceneryList,
  querySceneryInfo,
  addScenery,
  editScenery,
  delScenery,
  serviceEnable,
  serviceDisable,
  setHotScenery,
  cancelHotScenery,
  getSceneryTags,
  editSceneryTags,
} from "@/api/management/sceneryManage";
import { tagsSelect } from "@/api/management/systemManage";
import { getPublicUploadParams } from "@/api/qiniu";
// 工具方法
import { restore } from "@/utils/restoreModel";
import ProForm from '@/components/ProForm'
import initPagination from "@/mixins/initPagination";
import Uploader from "@/components/Uploader";
export default {
  mixins: [initPagination],
  name: "scenery-manage",
  data() {
    return {
      imageTips: true, //是否显示景区详图上传框下方的提示,为false时将显示校验信息
      coverTips: true, //是否显示景区封面上传框下方的提示,为false时将显示校验信息
      tableCols: Object.freeze([
        {
          prop: "no",
          label: "景区编号" 
        },
        {
          prop: "name",
          label: "景区名称",
        },
        {
          prop: "mark",
          label: "标识",
        },

        {
          prop: "updator",
          label: "最后更新者",
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
        },
        {
          prop: "hotStatus",
          label: "热门景区",
          type: "switch",
          change: this.handleHotScenery,
          disabled: (row) => !row.tripStatus,
        },
        {
          prop: "tripStatus",
          label: "视频服务",
          type: "switch",
          change: this.handleService,
        },
        {
          label: "操作",
          type: "button",
          btnList: [
            // { type: "primary", label: "编辑", handle: this.edi },
            { type: "primary", label: "编辑", handle: this.editScenery },
            { type: "danger", label: "删除", handle: this.deleteScenery },
          ],
        },
      ]),
      forms:[
        {
          prop:'name',
          placeholder:'请输入景区名称',
          label:'景区名',
          type:'input',
          rules:[{required:true,message:'请输入景区名称',trigger:"blur"}]
        },
        {
          prop:'cover',
          label:'景区封面',
          type:'upload',
          uploadType:'video',
          onSuccess:this.success,
          rules:[{required:true,message:'请上传景区封面',trigger:"change"}]
        },
        {
          prop:'imageUrls',
          label:'景区详图',
          type:'upload',
          uploadType:'image',
          onSuccess:this.success2,
          'list-type':"picture-card"
          
          // rules:[{required:true,message:'请上传景区封面',trigger:"change"}]
        },
      ],
      formdata:{},
      formData: [
        {
          type: "input",
          label: "景区名称",
          model: "sceneryName",
          placeholder: "请输入景区名称",
        },
        {
          type: "input",
          label: "景区编号",
          model: "sceneryNo",
          placeholder: "请输入景区编号",
        },
        {
          type: "select",
          label: "是否热门",
          model: "hotStatus",
          placeholder: "请选择状态",
          options: [
            {
              label: "全部",
              value: undefined,
            },
            {
              label: "是",
              value: 1,
            },
            {
              label: "否",
              value: 0,
            },
          ],
        },
        {
          type: "select",
          label: "是否开启视频服务",
          model: "startTirp",
          placeholder: "请选择状态",
          options: [
            {
              label: "全部",
              value: undefined,
            },
            {
              label: "关闭",
              value: 0,
            },
            {
              label: "开启",
              value: 1,
            },
          ],
        },
         {
          type: "button",
          btnType:"primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search",
        },
        { 
          type: "button",
          btnType:"primary",
          label: "新增",
          // handle: this.add,
          handle: this.open,
          icon: "el-icon-edit",
        },
      ], 
      rules: {
        name: [{ required: true, message: "请输入景区名称", trigger: "blur" }],
        lonLat: [
          { required: true, message: "请输入景区经纬度", trigger: "blur" },
        ],
        mark: [{ required: true, message: "请输入景区标识", trigger: "blur" }],
        aiUrl: [
          { required: true, message: "请输入服务器URL", trigger: "blur" },
        ],
        describe: [
          { required: true, message: "请输入景区描述", trigger: "blur" },
        ],
        coverUrl: [
          { required: true, message: "请上传封面图片", trigger: "change" },
        ],
        imageUrls: [
          { required: true, message: "请上传景区详图", trigger: "change" },
        ],
      }, //校验规则
      sceneryDialog: false, //景区修改或新增模态框
      sceneryForm: {
        name: "",
        lonLat: "",
        mark: "",
        coverUrl: "",
        advertisementUrl: "",
        aiUrl: "",
        describe: "",
        imageUrls: [],
      }, //模态框表单
      dialogTitle: "", //模态框标题
      tablesLoading: false,
      tags: [], //标签数据
      tagsList: [], //全部标签数据
      tips: "",
      id: "", //记录当前正在编辑的景区id
      inputVisible: false, //标签相关参数
      inputValue: "", //标签相关参数
      token: "", //七牛云上传token
      dialogVisible: false, //展示图片预览对话框
      fileList: [], //视图上展示的fileList
      previewUrl: "", //预览图片url
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    submit1(form){
      console.log(form)
    },

    close(){
      // 清除校验
      this.$refs.form.resetFields()
    }, 

    open(){
      // 回填数据
      this.sceneryDialog = true

      this.formdata = { 
        name:'赵四',
        cover:'https://sf1-scmcdn-tos.pstatp.com/goofy/ies/douyin_home_web/medias/1-4.6d59e328.mp4',
        imageUrls:[ 'https://tomevideo.zhihuiquanyu.com/1588047256762.PNG','https://tomevideo.zhihuiquanyu.com/1588047252334.PNG' ] 
        }
    },

    success({key}){
      this.formdata.cover = `https://tomevideo.zhihuiquanyu.com/${key}`;
    },

    success2(){

    },

    edi(){
      this.sceneryDialog = true
    },

    // 获取景区列表
    async getTableData(
      query = {
        ...this.searchData,
        pageNum: this.pagination.num,
        pageSize: this.pagination.size,
      }
    ) {
      try {
        this.tablesLoading = true;
        const { data } = await getSceneryList(query);
        // 获取当前查询结果下的分页条数
        this.pagination.total = data.value.total;
        // 当查询结果为空时获取分页条数
        if (!Object.keys(this.searchData).length) {
          this.pagination.absTotal = data.value.total;
        }
        // 将后台返回的数据处理为符合switch组件的数据
        this.tableData = data.value.list.map((v) => {
          // 将0和1转换为布尔值
          v.hotStatus = !!v.hotStatus;
          v.tripStatus = !!v.tripStatus;
          return v;
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.tablesLoading = false;
      }
    },

    // 开启/关闭热门景区
    async handleHotScenery(row) {
      try {
        if (row.hotStatus) {
          await setHotScenery({ id: row.id });
          this.$message.success(`已将${row.name}设置为热门景区`);
        } else {
          await cancelHotScenery({ id: row.id });
          this.$message.info(`已将${row.name}取消热门景区`);
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
          this.$message.info(`已取消${row.name}的视频服务`);
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
      this.sceneryDialog = true;
      this.dialogTitle = "编辑景区";
      // 记录当前正在编辑的景区id
      this.id = id;
      try {
        // 查询景区详细信息及标签详细信息
        const [sceneryInfo, tags] = await Promise.all([
          querySceneryInfo({ id }),
          getSceneryTags({ sceneryId: id }),
        ]);

        // 将imageUrls转换为数组以便后续操作
        if (sceneryInfo.data.value.imageUrls) {
          sceneryInfo.data.value.imageUrls = sceneryInfo.data.value.imageUrls.split(
            ","
          );
          // 获取展示图的视图数据
          this.fileList = sceneryInfo.data.value.imageUrls.map((v) => ({
            url: v,
          }));
        }
        // 回填数据
        this.sceneryForm = sceneryInfo.data.value;
        // 获取到标签数据
        if (tags.data.value.length) {
          this.tags = tags.data.value.map((v) => v.tagName);
        }

        // 获取到全部标签的数据
        const { data } = await tagsSelect({ type: 1 });
        this.tagsList = data.value.map((v) => ({
          value: v.tagName,
          tagId: v.tagId,
        }));
      } catch (err) {
        console.log(err);
      }
    },

    // 景区标签下拉数据获取
    async getAllTags(queryStr, callback) {
      // 与输入文字进行匹配
      const res = queryStr
        ? this.tagsList.filter((v) => v.value.indexOf(queryStr) !== -1)
        : this.tagsList;
      // 调用 callback 返回建议列表的数据
      callback(res);
    },

    // 标签选择
    handleSelect(item) {
      this.inputValue = item.value;
    },

    // 显示标签输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 标签提交
    handleInputConfirm() {
      // 开启定时器防止blur事件导致select事件失效
      setTimeout(() => {
        if (this.inputValue) {
          if (this.tags.includes(this.inputValue)) {
            this.inputVisible = false;
            this.inputValue = "";
            return this.$message.error("禁止添加相同的标签");
          }
          this.tags.push(this.inputValue);
        }
        this.inputVisible = false;
        this.inputValue = "";
      }, 200);
    },

    // 新增景区
    async add() {
      this.sceneryDialog = true;
      this.dialogTitle = "新增景区";
      // 获取到全部标签的数据
      const { data } = await tagsSelect({ type: 1 });
      this.tagsList = data.value.map((v) => ({
        value: v.tagName,
        tagId: v.tagId,
      }));
    },

    // 模态框关闭时清除所有数据
    dialogClose(formName) {
      this.sceneryForm = restore(this[formName]);
      // console.log(this.sceneryForm);
      this.fileList = [];
      this.tags = [];
      // 清除校验
      this.$refs[formName].resetFields();
    },

    // 上传前统一获取token
    async beforeUpload({ type, name }) {
      // 校验文件类型
      if (["image/jpeg", "image/png"].indexOf(type) == -1) {
        this.$message.error("只能上传jpg & png 格式的图片");
        return Promise.reject();
      } else {
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
      this.sceneryForm.coverUrl = `https://tomevideo.zhihuiquanyu.com/${key}`;
      this.$refs.cover.clearValidate(); // 关闭校验
    },

    // 广告图上传成功
    onADUploadSuccess({ key }) {
      this.$message.success("上传成功");
      this.sceneryForm.advertisementUrl = `https://tomevideo.zhihuiquanyu.com/${key}`;
    },

    // 景区详图上传成功
    onShowImgSuccess({ key }) {
      this.$message.success("上传成功");
      // 将新添加的图片添加到表单数据中
      this.sceneryForm.imageUrls.push(
        `https://tomevideo.zhihuiquanyu.com/${key}`
      );
      this.$refs.showImg.clearValidate(); // 关闭校验
    },

    // 上传失败
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
      const delIndex = this.sceneryForm.imageUrls.findIndex((v) => v === url);
      this.sceneryForm.imageUrls.splice(delIndex, 1);
    },

    // 删除标签
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },

    // 模态框提交
    submit(formName) {
      this.$refs[formName].validate(async (valid, field) => {
        if (valid) {
          try {
            // 判断当前是新增还是修改景区
            if (this.dialogTitle === "新增景区") {
              // 先调用新增景区接口以获取到id , 然后才能通过id调用标签编辑接口
              const { data } = await addScenery(this.sceneryForm);
              await editSceneryTags({
                sceneryId: data.value.sceneryId,
                tags: this.tags,
              });
              // 由于后台返回的数据是正序 所以新增景区后跳转到表格的最后一页
              const { absTotal, size } = this.pagination;
              // 在有查询数据的情况下使用total 将会出现异常 所以使用absTotal
              this.pagination.absTotal++;
              this.pagination.num = Math.ceil((absTotal + 1) / size);
              this.pagination.total = this.pagination.absTotal; //更新total
              this.getTableData();
              this.$message.success(`已添加景区 ${this.sceneryForm.name}`);
              this.sceneryDialog = false;
            } else {
              // 将tags数组中的已经存在于数据库的标签转换为KEY , 不存在的直接返回标签名
              const newTags = this.tags.map((tagName) => {
                // 与tagList数组进行对比
                const index = this.tagsList.findIndex(
                  (item) => item.value === tagName
                );
                if (index !== -1) {
                  // 匹配时返回KEY
                  return this.tagsList[index].tagId;
                } else {
                  // 不匹配时直接返回标签名
                  return tagName;
                }
              });
              await Promise.all([
                editScenery({ ...this.sceneryForm, id: this.id }),
                editSceneryTags({ sceneryId: this.id, tags: newTags }),
              ]);
              this.$message.success(`修改成功`);
              this.sceneryDialog = false;
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log(field);
          field.coverUrl && (this.coverTips = false);
          field.imageUrls && (this.imageTips = false);
          return false;
        }
      });
    },

    // 删除景区
    deleteScenery({ id }) {
      this.$confirm("此操作将永久删除该景区, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await delScenery({ id });
          this.$message.success("删除成功");
          // 删除时如果是该页最后一条数据则回到上一页
          const { total, size, num } = this.pagination;
          const edge = Math.ceil((total - 1) / size);
          edge < num && this.pagination.num--;
          this.getTableData();
        })
        .catch(() => {});
    },

    //获取经纬度
    getLnglat() {
      window.open("http://api.map.baidu.com/lbsapi/getpoint/index.html");
    },

    // 按钮查询相关
    query(searchData) {
      if (!_.isEqual(searchData, this.searchData)) {
        this.pagination.num = 1;
      }
      this.searchData = { ...searchData};
      this.getTableData();
    },
  },
  components: {
    Uploader,
    ProForm
  },
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
</style>
