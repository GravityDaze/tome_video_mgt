<template>
  <el-card class="small-video-manage">
    <ProTable
    :formData="formData"
      v-loading="tablesLoading"
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />

    <!-- 小视频管理或新增 -->
    <el-dialog
      :title="videoDialogTitle"
      :visible.sync="handleVideoDialog"
      @close="$refs.form.resetFields()"
      class="dialog-vertical"
    >
      <el-form :model="handleVideoForm"  ref="form">
        <el-form-item label="视频类型" label-width="120px" prop="type">
          <el-select
            v-model="handleVideoForm.type"
            placeholder="请选择视频类型"
          >
            <el-option label="平台视频" :value="0"></el-option>
            <el-option label="用户视频" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="制作需求"
          label-width="120px"
           prop="needNo"
          v-show="handleVideoForm.type === 1"
        >
          <el-input
            style="width: 200px"
            v-model="handleVideoForm.needNo"
            autocomplete="off"
          ></el-input>
          <el-button @click="demandSelect" style="margin-left: 10px"
            >选择需求</el-button
          >
        </el-form-item>
        <el-form-item
          label="景区"
          label-width="120px"
          v-show="handleVideoForm.type === 0"
           prop="sceneryId"
        >
          <Select
            :value="handleVideoForm.sceneryId"
            @change="(id) => $set( handleVideoForm,'sceneryId',id )"
          />
        </el-form-item>
        <el-form-item label="视频封面" label-width="120px"  prop="coverUrl">
          <Uploader
            @success="onCoverUploadSuccess"
            tips="推荐尺寸为157(宽)*48(高)，大小不超过 300KB"
            :imageUrl="handleVideoForm.coverUrl"
            :width="128"
            :height="72"
           />
        </el-form-item>
        <el-form-item label="小视频" label-width="120px" prop="url">
           <Uploader
            @success="onVideoUploadSuccess"
            :tips="videoTips"
            :videoUrl="handleVideoForm.url"
            :width="128"
            :height="72"
           />
          <el-button
            type="primary"
            size="small"
            v-if="handleVideoForm.url"
            @click="preview(handleVideoForm.url)"
            >预览小视频</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleVideoDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit(handleVideoForm)"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 需求表格 -->
    <el-dialog
      append-to-body
      title="制作需求"
      :visible.sync="demandDialog"
      width="70%"
      top="5vh"
      @closed="demandDialogClose"
    >
      <ProTable
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
  addVideo,
  updateVideo,
  queryNeed,
  sticky,
  cancelSticky,
  recommendFn,
  cancelRecommend,
} from "@/api/management/videoManage";
import { getPublicUploadParams } from "@/api/qiniu";
import initPagination from "@/mixins/initPagination";
import Select from "@/components/Select";
import Uploader from "@/components/Uploader"
export default {
  name: "small-video-manage",
  mixins: [initPagination],
  data() {
    return {
      tableCols: Object.freeze([
        {
          prop: "no",
          label: "视频编号",
        },
        {
          prop: "sceneryName",
          label: "所属景区",
        },
        {
          prop: "nickName",
          label: "用户昵称",
        },
        {
          prop: "duration",
          label: "时长",
        },
        {
          prop: "times",
          label: "下载次数",
        },
        {
          prop: "status",
          label: "状态",
          type: "tag",
          tagType: (row) => {
            switch (row.status) {
              case 0:
                return "danger";
              case 1:
                return "";
              default:
                return "success";
            }
          },
          formatter: (row) => {
            switch (row.status) {
              case 0:
                return "已过期";
              case 1:
                return "未购买";
              default:
                return "已购买";
            }
          },
        },
        {
          prop: "shareStatus",
          label: "发布",
          type: "tag",
          tagType: (row) => (row.shareStatus === 0 ? "warning" : "success"),
          formatter: (row) => (row.shareStatus === 0 ? "未发布" : "已发布"),
        },
        {
          prop: "topStatus",
          label: "置顶",
          type: "switch",
          change: this.handleTopStatus,
        },
        {
          prop: "recommend",
          label: "推荐",
          type: "switch",
          change: this.handleRecommend,
        },
        {
          prop: "laudTimes",
          label: "点赞数",
        },
        {
          prop: "createDatetime",
          label: "提供时间",
        },
        {
          label: "操作",
          type: "button",
          btnList: [{ type: "primary", label: "编辑", handle: this.editVideo }],
        },
      ]),
      formData: Object.freeze([
        {
          type: "input",
          label: "所属景区",
          model: "sceneryName",
          placeholder: "请输入景区名称",
        },
        {
          type: "input",
          label: "用户昵称",
          model: "nickName",
          placeholder: "请输入用户昵称",
        },
        {
          label: "提交时间",
          type: "datePicker",
          model: "createDatetime",
        },
        {
          label: "需求类型",
          type: "select",
          model: "type",
          options: [
            {
              label: "全部",
              value: undefined,
            },
            {
              label: "标准制作",
              value: 1,
            },
            {
              label: "定制合成",
              value: 2,
            },
          ],
        },
        {
          type:"button",
          btnType: "primary",
          label: "新增",
          handle: this.add,
          icon: "el-icon-edit",
        },
        {
          type:"button",
          btnType: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search",
        },
      ]),
      demandTableCols: [
        {
          label: "需求编号",
          prop: "no",
        },
        {
          label: "用户昵称",
          prop: "customerNickName",
        },
        {
          label: "景区名",
          prop: "sceneryName",
        },
        {
          label: "时间",
          prop: "createDatetime",
        },
        {
          label: "操作",
          type: "button",
          btnList: [
            { type: "primary", label: "选择", handle: this.demandSelected },
          ],
        },
      ],
      demandTableData: [],
      demandPagination: {
        num: 1,
        total: 0,
        size: 10,
      },
      handleVideoDialog: false, //编辑或新增模态框
      demandDialog: false, //制作需求对话框
      demandLoading: false, //制作需求对话框加载效果
      tablesLoading: false,
      handleVideoForm: {
        needNo: "", //制作需求
        sceneryId: "", //景区id
        duration: "", //时长 秒
        coverUrl: "", //封面图
        url: "", //视频url
        type: "", //视频类型
        needId: "",
      }, //模态框表单
      videoDialogTitle: "",
      id: "", //
      videoTips: "", //视频上传框下方提示
      token: "", //七牛云上传token
    };
  },

  created() {
    this.getTableData();
  },

  methods: {
    async getTableData(
      query = {
        ...this.searchData,
        pageNum: this.pagination.num,
        pageSize: this.pagination.size,
      }
    ) {
      try {
        this.tablesLoading = true;
        const { data } = await queryVideoList(query);
        // 转换为布尔值
        this.tableData = data.value.list.map((v) => {
          // 将0和1转换为布尔值
          v.recommend = !!v.recommend;
          v.topStatus = !!v.topStatus;
          return v;
        });
        this.pagination.total = data.value.total;
      } catch (err) {
      } finally {
        this.tablesLoading = false;
      }
    },

    // 编辑视频
    async editVideo(row) {
      this.handleVideoDialog = true;
      this.videoDialogTitle = "编辑视频";
      this.videoTips = "确定重新上传后，之前的视频将被彻底覆盖";
      // 编辑视频时 , id为必传
      this._id = row.id;
      this.$nextTick(()=>this.handleVideoForm = { ...row })

    },

    // 请求需求接口
    async getDemandData(
      query = {
        pageSize: this.demandPagination.size,
        pageNum: this.demandPagination.num,
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
        total: 0,
      };
    },

    // 在编辑视频中提供视频预览功能
    preview(url) {
      window.open(url);
    },

    // 新增视频
    async add() {
      this.handleVideoDialog = true;
      this.videoDialogTitle = "新增视频";
      this.videoTips = "推荐720p或1080p视频，MP4格式，大小不超过 20M。";
    },

    // 封面上传成功
    onCoverUploadSuccess({ key }) {
      this.$message.success("上传成功");
      this.handleVideoForm.coverUrl = `https://tomevideo.zhihuiquanyu.com/${key}`;
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


    // 确认提交
    async submit(form) {
      try {
        if (this.videoDialogTitle === "新增视频") {
          await addVideo({ ...form });
        } else {
          await updateVideo({ ...form, id: this._id });
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
       if (!_.isEqual(searchData, this.searchData) ) {
        this.pagination.num = 1;
      }
      //将searchData中的时间数组转换为后台需要的字符串格式
      if (searchData.createDatetime) {
        const [ startDate, endDate] = searchData.createDatetime
        this.searchData = { ...searchData, startDate, endDate };
      }else{
        this.searchData = { ...searchData }
      }
      this.getTableData();

    },
  },
  components: {
    Select,
    Uploader
  },
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
