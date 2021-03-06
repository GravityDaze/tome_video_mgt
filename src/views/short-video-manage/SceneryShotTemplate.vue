<template>
  <el-card>
    <ProTable
      :formData="formData"
      :tableCols="tableCols"
      :tableData="tableData"
      v-loading="tablesLoading"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />

    <el-dialog
      :title="tempDialogTitle"
      :visible.sync="tempDialog"
      @closed="onClose"
      width="30%"
      class="dialog-vertical"
    >
      <el-form :model="tempForm" ref="form">
        <el-form-item label="景区" label-width="120px" prop="sceneryId">
          <Select
            :value="tempForm.sceneryId"
            @change="(id) => (tempForm.sceneryId = id)"
          />
        </el-form-item>
        <el-form-item label="模板名称" label-width="120px" prop="name">
          <el-col :span="16">
            <el-input v-model="tempForm.name" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="模板名称" label-width="120px">
          <Select
            :value="tags"
            placeholder="请选择标签"
            type="tag"
            label="tagName"
            value-key="tagId"
            multiple
            @change="(res) => (tags = res)"
          />
        </el-form-item>
        <el-form-item label="模板描述" label-width="120px" prop="describe">
          <el-col :span="16">
            <el-input
              v-model="tempForm.describe"
              type="textarea"
              maxlength="100"
              show-word-limit
              autocomplete="off"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="模板封面" prop="coverUrl" label-width="120px">
          <Uploader
            :imageUrl="tempForm.coverUrl"
            @success="
              (res) =>
                $set(
                  tempForm,
                  'coverUrl',
                  `https://tomevideo.zhihuiquanyu.com/${res.key}`
                )
            "
          />
        </el-form-item>
        <el-form-item label="模板预览视频" prop="videoUrl" label-width="120px">
          <Uploader
            :videoUrl="tempForm.videoUrl"
            @success="
              (res) =>
                $set(
                  tempForm,
                  'videoUrl',
                  `https://tomevideo.zhihuiquanyu.com/${res.key}`
                )
            "
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tempDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit(tempForm)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 模板片段表格对话框 -->
    <el-dialog
      class=""
      width="70%"
      title="视频片段管理"
      :visible.sync="configDialog"
    >
      <ProTable
        :formData="tempFormData"
        :tableCols="tempDetailCols"
        :tableData="tempDetailData"
        hidePagination
      />
    </el-dialog>

    <!-- 模板片段新增/编辑 -->
    <el-dialog
      :title="`${tempConfigTitle}模板配置`"
      :visible.sync="tempDetailDialog"
      @closed="onTempClose"
    >
      <el-form :model="tempConfigForm" ref="tempConfigForm">
        <el-form-item label="类型" label-width="120px" prop="type">
          <el-select v-model="tempConfigForm.type" placeholder="请选择类型">
            <el-option label="点位" :value="1"></el-option>
            <el-option label="空镜" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="名字"
          style="width: 400px"
          label-width="120px"
          prop="name"
          v-if="tempConfigForm.type === 0"
        >
          <el-input
            v-model.trim="tempConfigForm.name"
            placeholder="请输入名字"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="排序"
          style="width: 400px"
          label-width="120px"
          prop="sequence"
           v-if="tempConfigForm.type === 0  || tempConfigForm.type === 1"
        >
          <el-input-number
            v-model="tempConfigForm.sequence"
            :min="1"
            :max="10"
            label="描述文字"
          ></el-input-number>
        </el-form-item>

        <el-form-item
          v-if="tempConfigForm.type === 0"
          label="视频"
          prop="url"
          label-width="120px"
        >
          <Uploader
            :videoUrl="tempConfigForm.url"
            @success="
              (res) =>
                $set(
                  tempConfigForm,
                  'url',
                  `https://tomevideo.zhihuiquanyu.com/${res.key}`
                )
            "
            :allowedFileType="['video/mp4']"
          />
        </el-form-item>
        <el-form-item
          v-if="tempConfigForm.type === 1"
          label="点位"
          label-width="120px"
          prop="pointId"
        >
          <Select
            ref="select"
            type="position"
            label="description"
            placeholder="请选择点位"
            :value="tempConfigForm.pointId"
            :request-params="{ sceneryId,status:1 }"
            @change=" onPositionSelect "
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tempDetailDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitConfig('tempConfigForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// api接口
import {
  queryTemplateList,
  addTemplate,
  editTemplate,
  disableTemplate,
  enableTemplate,
  queryTemplatePoint,
  disableTemplatePoint,
  enableTemplatePoint,
  getTempTag,
  editTempTag,
  queryTempDetail,
  editTempDetail,
  addTempDetail,
  enableTempDetail,
  disableTempDetail,
} from "@/api/management/tempManage";
import Select from "@/components/Select";
import Uploader from "@/components/Uploader";
import initPagination from "@/mixins/initPagination";
export default {
  mixins: [initPagination],
  data() {
    return {
      tableCols: Object.freeze([
        {
          prop: "no",
          label: "模板编号",
        },
        {
          prop: "name",
          label: "模板名称",
        },
        {
          prop: "sceneryName",
          label: "所属景区",
        },

        {
          prop: "describe",
          label: "模板描述",
        },
        {
          prop: "creator",
          label: "创建者",
        },

        {
          prop: "createDatetime",
          label: "创建时间",
        },
        {
          prop: "status",
          label: "状态",
          type: "switch",
          change: this.statusChange,
        },
        {
          label: "操作",
          type: "button",
          width: "200",
          btnList: [
            { type: "primary", label: "编辑", handle: this.editTemp },
            { label: "配置", handle: this.openConfigDialog },
          ],
        },
      ]),
      formData: Object.freeze([
        {
          type: "input",
          label: "景区名称",
          model: "sceneryName",
          placeholder: "请输入所属景区",
        },
        {
          type: "input",
          label: "模板名称",
          model: "name",
          placeholder: "请输入模板名称",
        },
        {
          type: "datePicker",
          label: "时间范围",
          model: "createDatetime",
        },
        {
          type: "select",
          label: "状态",
          model: "status",
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
          type: "button",
          btnType: "primary",
          label: "新增",
          handle: this.add,
          icon: "el-icon-edit",
        },
        {
          type: "button",
          btnType: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search",
        },
      ]),
      tablesLoading: false,
      tempDialog: false, //编辑 & 新增对话框
      tempForm: {
        sceneryId: "",
        name: "",
        describe: "",
        durationLimit: "",
        sort: "",
      }, //对话框表单
      tempDialogTitle: "", //对话框标题
      configDialog: false,
      tempFormData: [
        {
          type: "button",
          btnType: "primary",
          label: "新增",
          handle: this.addTempConfig,
          icon: "el-icon-edit",
        },
      ],
      tempDetailData: [],
      tempDetailCols: [
        {
          label: "片段名称",
          prop: "name",
        },
        {
          label: "类型",
          prop: "type",
          formatter: (row) => (row.type ? "点位" : "空镜"),
        },
        {
          label: "视频地址",
          prop: "url",
        },
        {
          label: "排序",
          prop: "sequence",
        },
        {
          label: "状态",
          type: "switch",
          prop: "status",
          change: this.tempDetailStatusChange,
        },
        {
          label: "操作",
          type: "button",
          width: "200",
          btnList: [
            { type: "primary", label: "编辑", handle: this.editTempConfig },
          ],
        },
      ],
      tempConfigForm: {},
      tempConfigTitle: "",
      tempDetailDialog: false,
      sceneryId:"",
      tempId:"",
      tags: [],
    };
  },

  created() {
    this.getTableData();
  },

  methods: {
    // 获取模板信息
    async getTableData(
      query = {
        ...this.searchData,
        pageNum: this.pagination.num,
        pageSize: this.pagination.size,
      }
    ) {
      try {
        this.tablesLoading = true;
        const { data } = await queryTemplateList(query);
        this.pagination.total = data.value.total;
        this.tableData = data.value.list.map((v) => {
          // 将0和1转换为布尔值
          v.status = !!v.status;
          return v;
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.tablesLoading = false;
      }
    },

    // 启用 & 禁用
    async statusChange(row) {
      try {
        if (row.status) {
          // 启用
          await enableTemplate({ id: row.id });
          this.$message.success("已启用");
        } else {
          // 禁用
          await disableTemplate({ id: row.id });
          this.$message.success("已禁用");
        }
      } catch (err) {
        // 错误时还原switch组件的状态
        row.status = !row.status;
      }
    },

    // 编辑模板
    async editTemp(row) {
      // 打开对话框
      this.tempDialogTitle = "编辑";
      // make resetFields work
      this.$nextTick(() => (this.tempForm = { ...row }));
      this.tempDialog = true;
      // get tempTags
      const res = await getTempTag({ templetId: row.id });
      this.tags = res.data.value.map((v) => `KEY_${v.tagId}`);
    },

    // 新增
    async add() {
      // 打开对话框
      this.tempDialog = true;
      this.tempDialogTitle = "新增";
    },

    // 提交编辑 & 新增
    async submit(form) {
      const { sceneryId, id } = form;
      const tags = this.tags.map((v) => v.split("_")[1]);
      try {
        if (this.tempDialogTitle === "编辑") {
          await Promise.all[
            (editTemplate(form),
            editTempTag({
              sceneryId, //景区id
              templetId: id, //模板id
              tags,
            }))
          ];
          this.getTableData();
          this.$message.success("编辑成功");
        } else {
          const res = await addTemplate(form);
          await editTempTag({
            sceneryId, //景区id
            templetId: res.data.value.id, //模板id
            tags,
          });
          this.$message.success("新增成功");
        }
        this.getTableData();
        this.tempDialog = false;
      } catch (err) {
        console.log(err);
      }
    },

    onClose() {
      this.tags = [];
      this.$refs.form.resetFields();
    },

    // 配置模板
    openConfigDialog(row) {
      this.sceneryId = row.sceneryId
      this.tempId = row.id
      this.configDialog = true;
      this.getDetils(row.id);
    },

    // 获取模板配置
    async getDetils(TempletId) {
      const res = await queryTempDetail({ TempletId });
      this.tempDetailData =
        res.data.value?.list ||
        res.data.value.map((v) => {
          v.status = !!v.status;
          return v;
        });
    },

    // 模板配置状态更改
    async tempDetailStatusChange(row) {
      try {
        if (row.status) {
          // 启用
          await enableTempDetail({ id: row.id });
          this.$message.success("已启用");
        } else {
          // 禁用
          await disableTempDetail({ id: row.id });
          this.$message.info("已禁用");
        }
      } catch (err) {
        // 错误时还原switch组件的状态
        row.status = !row.status;
      }
    },

    // 编辑表单
    editTempConfig(row) {
      this.tempConfigTitle = "编辑";
      this.$nextTick( _=>   this.tempConfigForm = { ...row } )
      this.tempDetailDialog = true;
    },

    // 新增表单
    addTempConfig() {
      console.log(this.tempConfigForm.pointId)
      this.tempConfigTitle = "新增";
      this.tempDetailDialog = true;
    },

    onTempClose() {
      this.$refs.tempConfigForm.resetFields()
    },

    // 获取模板点位信息
    async getTempPoint() {
      const { data } = await queryTemplatePoint({
        pageNum: this.tempPointPagination.num,
        pageSize: this.tempPointPagination.size,
        templetId: this.id,
      });
      this.tempPointData = data.value.list.map((v) => {
        v.status = !!v.status;
        return v;
      });
      this.tempPointPagination.total = data.value.total;
    },

    // 模板点位状态改变
    async tempPointStatusChange(row) {
      try {
        if (row.status) {
          // 启用
          await enableTemplatePoint({ id: row.id });
          this.$message.success("已启用");
        } else {
          // 禁用
          await disableTemplatePoint({ id: row.id });
          this.$message.success("已禁用");
        }
      } catch (err) {
        row.status = !row.status;
      }
    },

    // 关闭模板点位对话框
    tempPointClose() {
      this.tempPointPagination.total = 0;
      this.tempPointData = [];
    },

    // 选择点位回调
    onPositionSelect(id){
       this.tempConfigForm.pointId = id 
    },

    async submitConfig(form) {
      const index = this.$refs.select?.list.findIndex( v=>v.id === this.tempConfigForm.pointId )
      //  判断是空镜还是点位
      const name = this[form].type === 1? this.$refs.select.list[index]?.description : this[form].name
      if (this.tempConfigTitle === "编辑") {
        await editTempDetail({...this[form],name});
      } else {
        await addTempDetail({...this[form], templetId:this.tempId,name });
      }
      // 刷新表格
      this.tempDetailDialog = false;
      this.getDetils( this.tempId )
    },

    // 按钮查询
    query(searchData) {
      if (!_.isEqual(searchData, this.searchData)) {
        this.pagination.num = 1;
      }
      //将searchData中的时间数组转换为后台需要的字符串格式
      if (searchData.createDatetime) {
        const [startDatetime, endDatetime] = searchData.createDatetime;
        this.searchData = { ...searchData, startDatetime, endDatetime };
      } else {
        this.searchData = { ...searchData };
      }
      this.getTableData();
    },
  },
  components: {
    Select,
    Uploader,
  },
};
</script>

<style scoped>
</style>
