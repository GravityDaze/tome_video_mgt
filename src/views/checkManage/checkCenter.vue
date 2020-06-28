<template>
  <div class="checkCenter">
    <searchs @query="query" :formData="formData" />
    <my-tables
      v-loading="loading"
      element-loading-text="下载中,请稍后"
      :tableTitle="filterTitle"
      :tableData="tableData"
      :isShowEnabled="true"
      :isShowFacePic="true"
      :isShowOperation="true"
      :checkStatus="status"
      @queryInfoFn="queryInfo"
      @checkStart="checkStart"
      @download="download"
      @checkPass="approved"
      @checkRefuse="disapproved"
      @upload="upload"
      @preview="preview"
    />

    <!-- 上传对话框 begin -->
    <el-dialog title="上传视频" :show-close="false" :visible.sync="upLoadDiaglogVisible">
      <p style="margin-top:0">只能上传mp4格式，上传成功后，请点击确定按钮</p>
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
        :data="{token}"
      >
        <video v-if="videoUrl" autoplay muted :src="videoUrl" class="video"></video>
        <i v-else class="el-icon-plus video-uploader-icon"></i>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" :disabled="uploadDialogDisabled" @click="uploadFinish">确 定</el-button>
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
  </div>
</template>

<script>
import {
  queryVideoList,
  queryChecking,
  checkStartApi,
  getupLoadParmas,
  uploadFinishApi,
  postAuditStatus
} from "@/api/checkManage";
import { mapState } from "vuex";
import { downVideo } from "@/utils/downVideo";
import myTables from "@/components/myTables";
import Searchs from "@/components/Searchs";
export default {
  data() {
    return {
      // 表头默认状态 0未审核 1正在审核  2:审核通过 3:审核不通过
      status: 0,
      // 响应审核状态映射
      statusMap: {
        0: "未审核",
        1: "正在审核",
        2: "审核通过",
        3: "审核未通过"
      },
      filterTitle: [], //过滤后的表头数据
      tableTitle: [
        {
          prop: "id",
          label: "审核id",
          align: "center"
        },
        {
          prop: "customerNeedId",
          label: "用户需求id",
          align: "center"
        },
        {
          prop: "name",
          label: "视频名称",
          align: "center"
        },
        {
          prop: "status",
          label: "审核结果",
          align: "center",
          formatter: row => this.statusMap[row.status]
        },
        {
          prop: "examineUserName",
          label: "审核员名称",
          align: "center"
        },
        {
          prop: "examineDatetime",
          label: "审核确认时间",
          align: "center"
        },
        {
          prop: "remark",
          label: "审核备注",
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "审核信息创建时间",
          align: "center"
        },
        {
          prop: "statusUpload",
          label: "视频是否已重新上传",
          align: "center",
          formatter: row => (row.statusUpload ? "是" : "否")
        },
        {
          prop: "proName",
          label: "视频新名称",
          align: "center"
        },
        {
          prop: "proCoverUrl",
          label: "视频新封面",
          align: "center"
        },
        {
          prop: "proUrl",
          label: "视频新链接",
          align: "center"
        }
      ], //初始表头数据
      formData: [
        {
          type: "select",
          label: "状态",
          model: "status",
          placeholder: "请选择审核状态",
          options: [
            {
              label: "未审核",
              value: 0
            },
            {
              label: "正在审核",
              value: 1
            },
            {
              label: "审核成功",
              value: 2
            },
            {
              label: "审核未通过",
              value: 3
            }
          ]
        },
        {
          type: "input",
          label: "审批人",
          model: "examineUserName",
          placeholder: "请输入审批人"
        },
        {
          type: "datePicker",
          label: "时间范围",
          model: "createDatetime"
        }
      ], //初始表单数据
      tableData: [], //表格数据
      upLoadDiaglogVisible: false, //上传对话框状态
      refuseDialogvisible: false, //审核不通过对话框状态
      remark: "", //备注
      uploadDialogDisabled: true, //对话框确定按钮状态
      videoUrl: "", //上传成功后预览的视频地址
      token: "", //当前视频token
      id: "", //当前视频的id
      tips: "", //上传提示信息
      loading: false,
      uploading: false,
      videoInfo: {}, //视频相关信息
      timer: null //定时器
    };
  },

  watch: {
    status() {
      console.log("status发生了变化,定时器已停止");
    }
  },

  methods: {
    // 获取视频信息
    async getVideoList( data = {
        status: this.status,
        pageNum: this.$store.state.pageNumParam,
        pageSize: this.$store.state.pageSizeParam
      }) {
      
      console.log( data )
      const res = await queryVideoList(data);
      const { value, resultStatus } = res.data;
      // 如果查询参数中有data.status,则更改
      if (data.status !== undefined) {
        this.status = data.status;
      }
      //创建过滤数组
      let filter;
      switch (this.status) {
        case 0:
          filter = [
            "proName",
            "proCoverUrl",
            "proUrl",
            "remark",
            "examineDatetime",
            "examineUserName",
            "statusUpload"
          ];
          break;

        case 1:
          filter = [
            "proName",
            "proCoverUrl",
            "proUrl",
            "remark",
            "examineDatetime",
            "examineUserName"
          ];
          break;

        case 3:
          filter = [
            "proName",
            "proCoverUrl",
            "proUrl",
            "examineUserName",
            "examineDatetime",
            "statusUpload"
          ];
          break;
        default:
          filter = [];
      }

      // 过滤表头
      this.filterTitle = this.tableTitle.filter(v => !filter.includes(v.prop));
      // 查询完毕后判断是否需要关闭定时器
      if (this.status !== 0 || data.createDatetime || data.examineUserName) {
        clearInterval(this.timer);
        this.timer = null;
      } else if (this.timer === null) {
        // 重新开启定时器
        const count = () => {
          this.getVideoList();
          return count;
        };
        this.timer = setInterval(count(), 3000);
      }

      // 赋值
      this.tableData = value.list;
      // 完成分页
      this.$store.state.totalParam = res.data.value.total;
    },

    // 初始化查询是否有正在审核的视频
    async isChecking() {
      const res = await queryChecking();
      const { resultStatus, value } = res.data;
      this.status = value.flag;
    },
    // 开启审核
    async checkStart(params) {
      const res = await checkStartApi(params);
      const { resultStatus, value } = res.data;
      this.$message.success('已开启审核')
      this.status = 1;
      this.getVideoList();
    },
    // 预览视频
    preview(data) {
      window.open(data.url);
    },

    // 下载视频
    download(data) {
      this.loading = true;
      downVideo(data.url, data.name)
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 打开对话框并获取上传视频前必要的参数
    async upload(params) {
      //通过id获取上传token
      const res = await getupLoadParmas(params);
      this.token = res.data.value.token;
      this.upLoadDiaglogVisible = true;
      //保存id
      this.id = params.id;
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
    beforeUploadSuccess(file) {
      if (["video/mp4"].indexOf(file.type) == -1) {
        //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
        this.$message.error("请上传正确的视频格式");
        return false;
      } else {
        this.uploading = true;
      }
    },

    // 获取上传进度
    onUploading(event) {
      this.tips = `正在上传中，请勿关闭对话框或刷新页面 ${parseInt(
        event.percent
      )}%`;
    },

    // 上传视频成功
    onUploadSuccess(res, file) {
      // 通过key获取到size和duration
      const audioElement = new Audio(URL.createObjectURL(file.raw));
      audioElement.addEventListener("loadedmetadata", () => {
        const proDuration = parseInt(audioElement.duration);
        const proSize = parseInt(file.size / 1000);
        // 保存视频相关信息
        this.videoInfo = {
          id: this.id,
          proName: res.key,
          proUrl: `https://tomevideo.zhihuiquanyu.com/${res.key}`,
          proSize,
          proDuration
        };
        // 完成视频上传
        this.$message.success('已上传视频，请点击确定按钮')
        this.uploading = false;
        this.videoUrl = URL.createObjectURL(file.raw);
        this.uploadDialogDisabled = false;
      });
    },

    // 上传视频失败
    onUploadError(res, file) {
      this.uploading = false;
      this.$confirm("上传视频失败,请刷新网页并尝试重新上传", "提示", {
        type: "error"
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
      this.$message({ type: "success", message: "上传成功" });
      // 查询一次当前列表更新数据
      this.getVideoList();
    },

    // 审核通过
    approved(data) {
      // 检查是否已经重新上传视频
      if (data.statusUpload === 0) {
        return this.$message.warning("请先上传视频");
      }

      this.$confirm("是否审核通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        // 审核通过逻辑
        const res = await postAuditStatus({
          id: data.id,
          result: 1
        });
        this.$message.success("已通过");
        // 重新渲染未审核数据
        this.status = 0;
        this.getVideoList();
      });
    },

    // 打开审核不通过对话框
    disapproved (data) {
      // 审核拒绝逻辑
      this.refuseDialogvisible = true;
      this.id = data.id;
    },

    // 审核不通过逻辑
    async refuse(data) {
      if (this.remark === "") {
        this.$message.warning("备注不能为空");
      } else {
        const res = await postAuditStatus({
          id: this.id,
          remark: this.remark,
          result: 0
        });
          this.$message.info("已拒绝");
          this.refuseDialogvisible = false;
          // 重新渲染未审核数据
          this.status = 0;
          this.getVideoList();
      }
    },

    // 按钮查询
    query(searchForm) {
      this.getVideoList(searchForm);
    },
    // 分页查询
    queryInfo() {
      this.getVideoList();
    }
  },
  created() {
    this.isChecking().then(() => {
      const count = () => {
        this.getVideoList();
        return count;
      };
      this.timer = setInterval(count(), 3000);
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  components: {
    myTables,
    Searchs
  }
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
</style>