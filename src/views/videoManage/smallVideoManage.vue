<template>
  <el-card class="small-video-manage">
    <searchs :formData="formData" :searchBtn="searchBtn" />
    <tables
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />

    <!-- 小视频管理或新增 -->
    <el-dialog :title="videoDialogTitle" :visible.sync="handleVideoDialog" @close="dialogClose">
      <el-form :model="handleVideoForm" v-loading="videoDialogLoading">
        <el-form-item label="视频类型" label-width="120px">
          <el-select v-model="handleVideoForm.type" placeholder="请选择视频类型">
            <el-option label="平台视频" :value="0"></el-option>
            <el-option label="用户视频" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="制作需求" label-width="120px" v-show="handleVideoForm.type === 1">
          <el-input style="width:200px" v-model="handleVideoForm.needNo" autocomplete="off"></el-input>
          <el-button @click="demandSelect" style="margin-left:10px">选择需求</el-button>
        </el-form-item>
        <el-form-item label="景区" label-width="120px" v-show="handleVideoForm.type === 0">
          <el-select v-model="handleVideoForm.sceneryId" placeholder="请选择景区名">
            <el-option
              v-for="item in sceneryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频封面" label-width="120px">
          <el-upload
            class="uploader"
            action="https://upload-z2.qiniup.com"
            :show-file-list="false"
            :before-upload="beforeCoverUpload"
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
            :before-upload="beforeVideoUpload"
            :on-success="onVideoUploadSuccess"
            :on-error="onError"
            :on-progress="onUploading"
            :data="{token}"
          >
            <div slot="tip" class="el-upload__tip">{{videoTips}}</div>
            <video
              autoplay
              muted
              loop
              v-if="handleVideoForm.url"
              :src="handleVideoForm.url"
              class="upload-img"
            />
            <i v-else class="el-icon-upload uploader-icon"></i>
          </el-upload>
          <el-button
            type="primary"
            size="small"
            v-if="handleVideoForm.url"
            @click="preview(handleVideoForm.url)"
          >预览小视频</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleVideoDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit(handleVideoForm)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 需求表格 -->
    <el-dialog
      append-to-body
      title="制作需求"
      :visible.sync="demandDialog"
      width="70%"
      top="5vh"
      @close="demandDialogClose"
    >
      <tables
        :tableCols="demandTableCols"
        :tableData="demandTableData"
        :pagination="demandPagination"
        @sizeChange="demandSizeChange"
        @numChange="demandNumChange"
        v-loading="demandLoading"
      />
    </el-dialog>
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
} from "@/api/management/videoManage";
import { getPublicUploadParams } from "@/api/qiniu";
// 工具方法
import { restore } from "@/utils/restoreModel";
import initPagination from "@/mixins/initPagination";
export default {
  name: "small-video-manage",
  mixins: [initPagination],
  data() {
    return {
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
          formatter: row => row.shareStatus === 0 ? "未发布" : "已发布"
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
      demandTableCols: [
        {
          label: "需求编号",
          prop: "no",
          align: "center"
        },
        {
          label: "用户昵称",
          prop: "customerNickName",
          align: "center"
        },
        {
          label: "景区名",
          prop: "sceneryName",
          align: "center"
        },
        {
          label: "时间",
          prop: "createDatetime",
          align: "center"
        },
        {
          label: "操作",
          type: "button",
          btnList: [
            { type: "primary", label: "选择", handle: this.demandSelected }
          ]
        }
      ],
      demandTableData: [],
      demandPagination: {
        num: 1,
        total: 0,
        size: 10
      },
      handleVideoDialog: false, //编辑或新增模态框
      demandDialog: false, //制作需求对话框
      demandLoading: false, //制作需求对话框加载效果
      handleVideoForm: {
        needNo: "", //制作需求
        sceneryId: "", //景区id
        duration: "", //时长 秒
        coverUrl: "", //封面图
        url: "", //视频url
        type: "" //视频类型
      }, //模态框表单
      videoDialogLoading: false, //模态框加载效果
      videoDialogTitle: "",
      id: "", //
      videoTips: "", //视频上传框下方提示
      sceneryList: [], //景区下拉框
      token: "" //七牛云上传token
    };
  },

  created(){
    this.getTableData()
  },

  methods: {
    async getTableData(
      query = {
        ...this.searchData,
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
      this.videoDialogTitle = "编辑视频";
      this.videoTips = "确定重新上传后，之前的视频将被彻底覆盖";
      // 编辑视频时 , id为必传
      this.id = row.id;
      try {
        this.videoDialogLoading = true;
        // 获取景区下拉列表
        const { data } = await getSceneryList({ id: row.id });
        this.sceneryList = data.value;
        // 获取到需要回填的数据
        for (const item in this.handleVideoForm) {
          this.handleVideoForm[item] = row[item];
        }
      } catch (err) {
      } finally {
        this.videoDialogLoading = false;
      }
    },

    // 请求需求接口
    async getDemandData(
      query = {
        pageSize: this.demandPagination.size,
        pageNum: this.demandPagination.num
      }
    ) {
      try {
        this.demandLoading = true;
        const { data } = await queryNeed(query);
        this.demandTableData = data.value.list;
        this.demandPagination.total = data.value.total;
      } finally {
        this.demandLoading = false;
      }
    },

    // 查看需求列表
    demandSelect() {
      this.demandDialog = true;
      this.getDemandData();
    },

    // 选择需求
    demandSelected({ no }) {
      this.demandDialog = false;
      this.handleVideoForm.needNo = no;
    },

    // 需求分页
    demandSizeChange(val) {
      this.demandPagination.size = val;
      this.getDemandData();
    },

    demandNumChange(val) {
      this.demandPagination.num = val;
      this.getDemandData();
    },

    // 关闭需求对话框
    demandDialogClose() {
      // 初始化表格数据
      this.demandTableData = [];
      this.demandPagination = {
        num: 1,
        size: 10,
        total: 0
      };
    },

    // 在编辑视频中提供视频预览功能
    preview(url) {
      window.open(url);
    },

    // 新增视频
    add() {
      this.handleVideoDialog = true;
      this.videoDialogTitle = "新增视频";
      this.videoTips = "推荐720p或1080p视频，MP4格式，大小不超过 20M。";
    },

    // 获取七牛云token
    async getQiniuToken(name) {
      try {
        const { data } = await getPublicUploadParams({ fileName: name });
        this.token = data.value.token;
        return true;
      } catch (err) {
        this.$message.error("上传失败，请刷新后重试");
        return Promise.reject();
      }
    },

    // 封面上传前
    beforeCoverUpload({ type, name }) {
      // 校验文件类型
      if (["image/jpeg", "image/png"].indexOf(type) == -1) {
        this.$message.error("只能上传jpg & png 格式的图片");
        return false;
      } else {
        return this.getQiniuToken(name);
      }
    },

    // 视频上传前
    beforeVideoUpload({ type, name }) {
      // 校验文件类型
      if (["video/mp4"].indexOf(type) == -1) {
        this.$message.error("只能上传mp4格式的视频");
        return false;
      } else {
        return this.getQiniuToken(name);
      }
    },

    // 封面上传成功
    onCoverUploadSuccess({ key }) {
      this.$message.success("上传成功");
      this.handleVideoForm.coverUrl = `https://tomevideo.zhihuiquanyu.com/${key}`;
    },

    // 视频上传中
    onUploading(event) {
      this.videoTips = `正在上传中，请勿关闭对话框或刷新页面 ${parseFloat(
        event.percent
      ).toFixed(2)}%`;
    },

    // 视频上传成功
    onVideoUploadSuccess({ key }, { raw }) {
      this.$message.success("上传成功");
      this.handleVideoForm.url = `https://tomevideo.zhihuiquanyu.com/${key}`;
      // 获取到视频时长
      const audioElement = new Audio(URL.createObjectURL(raw));
      audioElement.addEventListener("loadedmetadata", () => {
        // 通过创建audio元素的方法获取到视频的时长
        this.handleVideoForm.duration = parseInt(audioElement.duration);
        this.videoTips = `上传成功，视频时长为${parseInt(
          audioElement.duration
        )}秒`;
      });
    },

    // 上传失败
    onError() {
      this.$message.error("上传失败，请刷新网页后重试");
    },

    // 对话框关闭回调
    dialogClose() {
      this.handleVideoForm = restore(this.handleVideoForm);
      this.videoTips = "";
    },

    // 确认提交
    async submit(form) {
      try {
        if (this.videoDialogTitle === "新增视频") {
          await addVideo({ ...form });
        } else {
          await updateVideo({ ...form, id: this.id });
        }
        this.handleVideoDialog = false;
        this.$message.success("修改成功");
        // 更新数据
        this.getTableData();
      } catch (err) {
        console.log(err);
      }
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
    query(searchData) {
      if (_.isEmpty(searchData)) return this.$message.warning("无效的查询");
      // 将searchData中的时间数组转换为后台需要的字符串格式
      if (searchData.createDatetime && searchData.createDatetime.length) {
        searchData.startDate = searchData.createDatetime[0];
        searchData.endDate = searchData.createDatetime[1];
        delete searchData.createDatetime;
      } else if (searchData.startDate || searchData.endDate) {
        delete searchData.startDate;
        delete searchData.endDate;
      }
      this.searchData = searchData;
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getTableData();
    }
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
