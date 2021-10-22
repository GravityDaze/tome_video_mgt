<template>
  <el-card>
    <ProTable
      :tableData="tableData"
      :tableCols="tableCols"
      :formData="formData"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
      v-loading="loading"
    />

    <!-- 用户信息对话框 -->
    <el-dialog
     class="dialog-vertical"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="positionDialog"
      append-to-body
      width="35%"
      @closed="$refs.form.resetFields()"
    >
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form ref="form" :model="positionForm" label-width="120px">
            <el-form-item label="点位名" prop="name">
              <el-input
                placeholder="请输入点位名"
                v-model="positionForm.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="经纬度" prop="lonLat">
              <el-input
                placeholder="请输入经纬度,如(30.614207,104.069568)"
                v-model="positionForm.lonLat"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属景区" prop="sceneryId">
              <Select
                :value="positionForm.sceneryId"
                @change="(id) => (positionForm.sceneryId = id)"
              />
            </el-form-item>
            <el-form-item label="索引" prop="index">
              <el-input-number
                v-model="positionForm.index"
                @change="() => {}"
                :min="1"
                :max="10"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="设备编号">
              <el-input
                placeholder="请输入设备编号"
                v-model="positionForm.cameraNo"
              ></el-input>
            </el-form-item> -->
            <el-form-item label="描述" prop="description">
              <el-input
                placeholder="请输入点位描述"
                type="textarea"
                v-model="positionForm.description"
              ></el-input>
            </el-form-item>
            <el-form-item label="点位照片" prop="picUrl">
              <Uploader
                :imageUrl="positionForm.picUrl"
                @success="uploadSuccess"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="positionDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  queryPointList,
  enablePoint,
  disablePoint,
  editPoint,
  addPoint,
} from "@/api/management/pointManage";
import initPagination from "@/mixins/initPagination";
import Select from "@/components/Select";
import Uploader from "@/components/Uploader";
export default {
  mixins: [initPagination],
  data() {
    return {
      tableCols:Object.freeze( [
        {
          prop: "name",
          label: "点位名",
          align: "center",
        },
        {
          prop: "index",
          label: "索引",
          align: "center",
        },
        {
          prop: "lon",
          label: "经度",
          align: "center",
        },
        {
          prop: "lat",
          label: "纬度",
          align: "center",
        },
        {
          prop: "cameraNo",
          label: "设备编号",
          align: "center",
          width: "120",
        },
        {
          prop: "sceneryName",
          label: "景区",
          align: "center",
        },
        {
          prop: "picUrl",
          label: "照片",
          align: "center",
          type: "img",
        },
        {
          prop: "description",
          label: "描述",
          align: "center",
          width: "220",
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
          align: "center",
        },
        {
          prop: "updator",
          label: "更新者",
          align: "center",
        },
        {
          prop: "status",
          label: "状态",
          align: "center",
          type: "switch",
          change: this.handleStatus,
        },
        {
          type: "button",
          label: "操作",
          align: "center",
          btnList: [
            {
              type: "primary",
              label: "编辑",
              handle: this.openEditDialog,
              disabled: (row) => !row.status,
            },
          ],
        },
      ]),
      formData: Object.freeze([
        {
          type: "input",
          label: "景区名",
          model: "sceneryName",
          placeholder: "请输入景区名",
        },
        {
          type: "input",
          label: "点位名",
          model: "name",
          placeholder: "请输入点位名",
        },
        {
          type: "input",
          label: "设备编号",
          model: "cameraNo",
          placeholder: "请输入设备编号",
        },
        {
          type: "select",
          label: "状态",
          model: "status",
          change: this.handleStatus,
          options: [
            {
              label: "全部",
              value: undefined,
            },
            {
              label: "禁用",
              value: 0,
            },
            {
              label: "启用",
              value: 1,
            },
          ],
        },
        {
          type:"button",
          btnType:"primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search",
        },
        {
          type: "button",
          btnType:"primary",
          label: "新增",
          handle: this.openAddDialog,
          icon: "el-icon-edit",
        },
      ]),
      loading: false,
      positionDialog: false,
      positionForm: {
        index: "",
        sceneryId: "",
        picUrl: "",
      },
      dialogTitle: "",
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData(
      query = {
        pageNum: this.pagination.num,
        pageSize: this.pagination.size,
        ...this.searchData,
      }
    ) {
      this.loading = true;
      try {
        const { data } = await queryPointList(query);
        // 将0和1转换为布尔值
        this.tableData = data.value.list.map((v) => ({
          ...v,
          status: !!v.status,
        }));
        this.pagination.total = data.value.total;
      } finally {
        this.loading = false;
      }
    },

    // 启用 & 禁用点位
    async handleStatus(row) {
      try {
        if (row.status) {
          await enablePoint({ id: row.id });
          this.$message.success(`已启用点位：${row.name}`);
        } else {
          await disablePoint({ id: row.id });
          this.$message.info(`已禁用点位：${row.name}`);
        }
      } catch {
        // 错误时还原switch组件的状态
        row.status = !row.status;
      }
    },

    // 打开编辑对话框
    openEditDialog(row) {
      this.dialogTitle = "编辑";
      // make resetFields work
      this.$nextTick((_) => {
        this.positionForm = {
          ...row,
          lonLat: row.lat ? `${row.lat},${row.lon}` : "",
        };
      });

      this.positionDialog = true;
    },

    // 打开新增对话框
    openAddDialog() {
      this.dialogTitle = "新增";
      this.positionDialog = true;
    },

    //上传成功
    uploadSuccess(res) {
      this.positionForm.picUrl = `https://tomevideo.zhihuiquanyu.com/${res.key}`;
    },

    // 确认
    async submit() {
      const {
        createDatetime,
        creator,
        sceneryName,
        status,
        updateDatetime,
        updator,
        lon,
        lat,
        ...data
      } = this.positionForm;
      if (this.dialogTitle === "编辑") {
        try {
          await editPoint(data);
          this.positionDialog = false;
          this.$message.success("编辑成功");
          this.getTableData();
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          // 新增时
          await addPoint({ ...data, cameraNo: "" });
          this.positionDialog = false;
          this.$message.success("新增成功");
          this.getTableData();
        } catch (err) {
          console.log(err);
        }
      }
    },

    // 按钮查询
    query(searchData) {
      // 深度对比
      if (!_.isEqual(searchData, this.searchData)) {
        this.pagination.num = 1;
      }
      this.searchData = { ...searchData};
      this.getTableData();
    },
  },
  components: {
    Select,
    Uploader,
  },
};
</script>