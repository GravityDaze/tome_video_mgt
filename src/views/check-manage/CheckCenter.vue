<template>
  <el-card class="checkCenter">
    <searchs :formData="formData" :searchBtn="searchBtn" />
    <tables
      :tableData="tableData"
      :tableCols="filterTitle"
      @sizeChange="sizeChange"
      @numChange="numChange"
      :pagination="pagination"
      v-loading="tableLoading"
      :element-loading-text="loadingText"
    />

    <!-- 上传对话框 begin -->
    <el-dialog
      title="上传视频"
      :show-close="false"
      :visible.sync="upLoadDiaglogVisible"
    >
      <p style="margin-top: 0">只能上传mp4格式，上传成功后，请点击确定按钮</p>
      <el-upload
        ref="upload"
        v-loading="uploading"
        :element-loading-text="tips"
        class="video-uploader"
        action="https://upload-z2.qiniup.com"
        :show-file-list="false"
        :on-success="onUploadSuccess"
        :on-error="onUploadError"
        :on-progress="onUploading"
        :before-upload="beforeUploadSuccess"
        :data="{ token }"
      >
        <video
          v-if="videoUrl"
          autoplay
          muted
          :src="videoUrl"
          class="video"
        ></video>
        <i v-else class="el-icon-plus video-uploader-icon"></i>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button
          type="primary"
          :disabled="uploadDialogDisabled"
          @click="uploadFinish"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 上传对话框 end -->

    <!-- 审核不通过对话框 begin -->
    <el-dialog title="请填写拒绝备注" :visible.sync="refuseDialogvisible">
      <el-form>
        <el-form-item>
          <el-input type="textarea" v-model="remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refuseDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="refuse">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 审核不通过对话框 end -->
  </el-card>
</template>

<script>
import {
  queryVideoList,
  queryChecking,
  beginCheck,
  uploadFinishApi,
  postCheckStatus,
} from "@/api/management/checkManage";
import { getUpLoadParams } from "@/api/qiniu";
import { download } from "@/utils/download";
import initPagination from "@/mixins/initPagination";
export default {
  mixins: [initPagination],
  data() {
    return {
      // 表头默认状态 0未审核 1正在审核  2:审核通过 3:审核不通过
      status: 0,
      // 响应审核状态映射
      statusMap: new Map([
        [0, "未审核"],
        [1, "正在审核"],
        [2, "审核通过"],
        [3, "审核未通过"],
      ]),
      // 响应审核标签类型映射
      statusTagMap: new Map([
        [0, "warning"],
        [1, ""],
        [2, "success"],
        [3, "danger"],
      ]),
      filterTitle: [], //过滤后的表头数据
      tableCols: [
        {
          prop: "id",
          label: "审核id",
          align: "center",
        },
        {
          prop: "customerNeedId",
          label: "用户需求id",
          align: "center",
        },
        {
          prop: "name",
          label: "视频名称",
          align: "center",
        },
        {
          prop: "coverUrl",
          label: "视频封面",
          align: "center",
          type: "img",
        },
        {
          prop: "customerFaceUrl",
          label: "人脸识别",
          align: "center",
          type: "img",
        },
        {
          prop: "status",
          label: "审核结果",
          align: "center",
          type: "tag",
          tagType: (row) => this.statusTagMap.get(row.status),
          formatter: (row) => this.statusMap.get(row.status),
        },
        {
          prop: "examineUserName",
          label: "审核员名称",
          align: "center",
        },
        {
          prop: "examineDatetime",
          label: "审核确认时间",
          align: "center",
        },
        {
          prop: "remark",
          label: "审核备注",
          align: "center",
        },
        {
          prop: "createDatetime",
          label: "审核信息创建时间",
          align: "center",
        },
        {
          prop: "statusUpload",
          label: "视频是否已重新上传",
          align: "center",
          formatter: (row) => (row.statusUpload ? "是" : "否"),
        },
        {
          prop: "proName",
          label: "视频新名称",
          align: "center",
        },
        {
          prop: "proCoverUrl",
          label: "视频新封面",
          align: "center",
          type: "img",
        },
        {
          prop: "proUrl",
          label: "视频新链接",
          align: "center",
        },
        {
          prop: "source",
          label: "来源",
          align: "center",
          formatter: (row) => row.source === 1?'腾讯':'途咪'
        },
        {
          label: "操作",
          type: "button",
          align: "center",
          btnList: [
            { type: "text", label: "开启审核", handle: this.checkStart },
            { type: "text", label: "预览视频", handle: this.preview },
            { type: "text", label: "审核通过", handle: this.approved },
            { type: "text", label: "下载", handle: this.downloadVideo },
            { type: "text", label: "上传", handle: this.upload },
            { type: "text", label: "拒绝", handle: this.disapproved },
          ],
        },
      ], //初始表头数据
      formData: [
        {
          type: "select",
          label: "状态",
          model: "status",
          placeholder: "请选择审核状态",
          default: 0,
          options: [
            {
              label: "未审核",
              value: 0,
            },
            {
              label: "正在审核",
              value: 1,
            },
            {
              label: "审核通过",
              value: 2,
            },
            {
              label: "审核未通过",
              value: 3,
            },
          ],
        },
        {
          type: "input",
          label: "审批人",
          model: "examineUserName",
          placeholder: "请输入审批人",
        },
        {
          type: "datePicker",
          label: "时间范围",
          model: "createDatetime",
        },
      ], //初始表单数据
      searchData: {},
      searchBtn: [
        {
          type: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search",
        },
      ], //search组件的按钮组
      tableData: [], //表格数据
      isCheck: false, //当前是否有正在审核的视频
      upLoadDiaglogVisible: false, //上传对话框状态
      refuseDialogvisible: false, //审核不通过对话框状态
      remark: "", //备注
      uploadDialogDisabled: true, //对话框确定按钮状态
      videoUrl: "", //上传成功后预览的视频地址
      token: "", //当前视频token
      id: "", //当前视频的id
      tips: "", //上传提示信息
      tableLoading: false,
      loadingText: "", //表格加载时的提示信息
      uploading: false,
      videoInfo: {}, //视频相关信息
      timer: null, //定时器
      pagination: {
        num: 1,
        size: 10,
        total: 0,
        absTotal: 0,
      },
    };
  },

  created() {
    this.isCheckingFn();
  },
  beforeDestroy() {
    // 关闭通知栏
    this.instance && this.instance.close();
    // 清除定时器
    clearInterval(this.timer);
  },

  watch: {
    // 改变status的时候改变默认值
    status() {
      const index = this.formData.findIndex((v) => v.model === "status");
      this.formData[index].default = this.status;
    },
  },

  methods: {
    // 获取视频信息
    async getTableData(
      query = {
        status: this.status,
        pageNum: this.pagination.num,
        pageSize: this.pagination.size,
        ...this.searchData,
      }
    ) {
      try {
        const { data } = await queryVideoList(query);
        this.pagination.total = data.value.total;
        // 如果查询参数中有status,则更改当前status
        if (query.status !== undefined) {
          this.status = query.status;
        }
        // 过滤表头
        this.filterTitle = this.filterTableCols();
        // 查询完毕后判断是否需要关闭定时器
        if (
          this.status !== 0 ||
          query.createDatetime ||
          query.examineUserName
        ) {
          clearInterval(this.timer);
          this.timer = null;
        } else if (this.timer === null) {
          // 重新开启定时器
          this.startTimer();
        }
        // 赋值表格数据
        this.tableData = data.value.list;
      } catch (err) {}
    },

    // 初始化查询是否有正在审核的视频
    async isCheckingFn() {
      this.tableLoading = true;
      const { data } = await queryChecking();
      this.isChecking = data.value.flag;
      if (this.isChecking) {
        this.instance = this.$notify({
          title: "您有一条正在审核的视频",
          customClass: "hover",
          type: "warning",
          message: this.$createElement(
            "a",
            {
              on: {
                click: this.checkVideo,
              },
            },
            "点击查看"
          ),
        });
      }
      this.tableLoading = false;
      this.startTimer();
    },

    // 表头过滤方法 , 数组中保存的是每个状态下应该被过滤掉的表头数据 ，而非显示在表头上的数据
    filterTableCols() {
      let filter;
      let btnFilter;
      switch (this.status) {
        case 0:
          filter = [
            "proName",
            "proCoverUrl",
            "proUrl",
            "remark",
            "examineDatetime",
            "examineUserName",
            "statusUpload",
          ];
          btnFilter = ["下载", "上传", "审核通过", "拒绝"];
          break;

        case 1:
          filter = [
            "proName",
            "proCoverUrl",
            "proUrl",
            "remark",
            "examineDatetime",
            "examineUserName",
          ];
          btnFilter = ["开启审核"];
          break;

        case 3:
          filter = [
            "proName",
            "proCoverUrl",
            "proUrl",
            "examineUserName",
            "examineDatetime",
            "statusUpload",
            "button",
            "coverUrl",
            "customerFaceUrl",
          ];
          break;
        default:
          filter = [
            "button",
            "remark",
            "statusUpload",
            "coverUrl",
            "customerFaceUrl",
          ];
      }
      // 获取到过滤后的表头
      const mainCols = _.cloneDeep(
        this.tableCols.filter((v) => !filter.includes(v.prop || v.type))
      );
      // 对按钮组进行单独过滤
      return mainCols.map((v) => {
        if (v.type === "button") {
          v.btnList = v.btnList.filter((btn) => !btnFilter.includes(btn.label));
        }
        return v;
      });
    },

    // 通过提示信息跳转到审核界面
    checkVideo() {
      this.instance.close();
      this.status = 1;
      this.getTableData();
    },

    // 开启定时器
    startTimer() {
      const count = () => {
        this.getTableData();
        return count;
      };
      this.timer = setInterval(count(), 3000);
    },

    // 开启审核
    async checkStart({ id }) {
      // 取消定时器
      clearInterval(this.timer);
      this.timer = null;
      try {
        await beginCheck({ id });
        this.$message.success("已开启审核");
        this.pagination.num = 1;
        this.status = 1;
        this.getTableData();
      } catch (err) {}
    },
    // 预览视频
    preview({ url }) {
      window.open(url);
    },

    // 下载视频
    async downloadVideo({ url, name }) {
      try {
        this.tableLoading = true;
        this.loadingText = "下载中请稍后";
        await download(url, name);
      } finally {
        this.tableLoading = false;
        this.loadingText = "";
      }
    },

    // 打开对话框并获取上传视频前必要的参数
    async upload({ id }) {
      //通过id获取上传token
      const { data } = await getUpLoadParams({ id });
      this.token = data.value.token;
      this.upLoadDiaglogVisible = true;
      //保存id
      this.id = id;
    },

    // 关闭对话框
    cancelDialog() {
      this.$message.info("已取消上传");
      // 停止上传
      this.$refs.upload.abort();
      // 清空已上传的文件列表
      this.$refs.upload.clearFiles();
      // 清除预览视频
      this.videoUrl = "";
      // 关闭对话框和加载动画
      this.uploading = false;
      this.upLoadDiaglogVisible = false;
    },

    // 上传视频之前检查是否是mp4格式
    beforeUploadSuccess({ type }) {
      if (["video/mp4"].indexOf(type) === -1) {
        //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
        this.$message.error("请上传正确的视频格式");
        return false;
      } else {
        this.uploading = true;
      }
    },

    // 获取上传进度
    onUploading(event) {
      this.tips = `正在上传中，请勿关闭对话框或刷新页面 ${parseFloat(
        event.percent
      ).toFixed(2)}%`;
    },

    // 上传视频成功
    onUploadSuccess(res, file) {
      const audioElement = new Audio(URL.createObjectURL(file.raw));
      audioElement.addEventListener("loadedmetadata", () => {
        // 通过创建audio元素的方法获取到视频的时长
        const proDuration = parseInt(audioElement.duration);
        const proSize = parseInt(file.size / 1000);
        // 保存视频相关信息
        this.videoInfo = {
          id: this.id,
          proName: res.key,
          proUrl: `https://tomevideo.zhihuiquanyu.com/${res.key}`,
          proSize,
          proDuration,
        };
        // 完成视频上传
        this.$message.success("已上传视频，请点击确定按钮");
        // 创建上传框中的预览视频
        this.videoUrl = URL.createObjectURL(file.raw);
        this.uploading = false;
        this.uploadDialogDisabled = false;
      });
    },

    // 上传视频失败
    onUploadError(res, file) {
      this.uploading = false;
      this.$confirm("上传视频失败,请刷新网页并尝试重新上传", "提示", {
        type: "error",
      })
        .then(() => {})
        .catch(() => {});
    },

    // 确认视频上传结果
    async uploadFinish() {
      const res = await uploadFinishApi(this.videoInfo);
      // 清空数据
      this.videoInfo = {};
      this.videoUrl = "";
      this.upLoadDiaglogVisible = false;
      this.$message.success("上传成功");
      // 查询一次当前列表更新数据
      this.getTableData();
    },

    // 审核通过
    approved({ id, statusUpload }) {
      // 检查是否已经重新上传视频
      if (statusUpload === 0) {
        return this.$message.warning("请先上传视频");
      }

      this.$confirm("是否审核通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 审核通过逻辑
          await postCheckStatus({
            id,
            result: 1,
          });
          this.$message.success("已通过");
          // 重新渲染未审核数据
          this.status = 0;
          this.getTableData();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 打开审核不通过对话框
    disapproved({ id }) {
      this.refuseDialogvisible = true;
      this.id = id; //记录当前id
    },

    // 审核不通过逻辑
    async refuse() {
      if (this.remark === "") {
        this.$message.warning("备注不能为空");
      } else {
        await postCheckStatus({
          id: this.id,
          remark: this.remark,
          result: 0,
        });
        this.$message.info("已拒绝");
        this.refuseDialogvisible = false;
        // 重新渲染未审核数据
        this.status = 0;
        this.getTableData();
      }
    },

    // 按钮查询
    query(searchData) {
      if (!_.isEqual(searchData, this.searchData)) {
        this.pagination.num = 1;
      }
      this.searchData = { ...searchData};
      this.getTableData();
    },
  },
};
</script>

<style>
.video-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.video-uploader .el-upload:hover {
  border-color: #409eff;
}
.video-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.video {
  width: 178px;
  height: 178px;
  display: block;
}

.hover {
  cursor: pointer;
}
</style>