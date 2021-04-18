<template>
  <el-card>
    <searchs
      :formData="formData"
      @query="query"
      @add="add"
      :searchBtn="searchBtn"
    />
    <tables
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
    >
      <el-form :model="tempForm" ref="form">
        <el-form-item label="景区" label-width="120px" prop="sceneryId">
          <SceneryPicker
            :id="tempForm.sceneryId"
            @change="(id) => (tempForm.sceneryId = id)"
          />
        </el-form-item>
        <el-form-item label="模板名称" label-width="120px" prop="name">
          <el-col :span="16">
            <el-input v-model="tempForm.name" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="模板名称" label-width="120px" v-if="tempDialogTitle === '编辑'">
          <SceneryPicker 

            :id="tagId?'KEY_'+tagId:''" 
            placeholder="请选择标签"
            type="tag"
            label="tagName"
            value="tagId"
            @change="(id)=> tagId = id.split('_')[1]"
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
                (tempForm.coverUrl = `https://tomevideo.zhihuiquanyu.com/${res.key}`)
            "
          />
        </el-form-item>
        <el-form-item label="模板预览视频" prop="videoUrl" label-width="120px">
          <Uploader
            :videoUrl="tempForm.videoUrl"
            @success="
              (res) =>
                (tempForm.videoUrl = `https://tomevideo.zhihuiquanyu.com/${res.key}`)
            "
            :allowedFileType="['video/mp4']"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tempDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit(tempForm)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 模板点位信息对话框 -->
    <el-dialog
      width="70%"
      title="视频片段管理"
      :visible.sync="partDialog"
    >
      <tables
        :tableData="tempDetailData"
        :tableCols="tempPointCols"
        :pagination="tempPointPagination"
        @sizeChange="tempPointSizeChange"
        @numChange="tempPointNumChange"
      />
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
  queryTempDetail
} from "@/api/management/tempManage";
import SceneryPicker from "@/components/SceneryPicker";
import Uploader from "@/components/Uploader";
import initPagination from "@/mixins/initPagination";
export default {
  mixins: [initPagination],
  data() {
    return {
      tableCols: [
        {
          prop: "no",
          label: "模板编号",
          align: "center",
        },
        {
          prop: "name",
          label: "模板名称",
          align: "center",
        },
        {
          prop: "sceneryName",
          label: "所属景区",
          align: "center",
        },

        {
          prop: "describe",
          label: "模板描述",
          align: "center",
        },
        {
          prop: "creator",
          label: "创建者",
          align: "center",
        },

        {
          prop: "createDatetime",
          label: "创建时间",
          align: "center",
        },
        {
          prop: "status",
          label: "状态",
          type: "switch",
          align: "center",
          change: this.statusChange,
        },
        {
          label: "操作",
          type: "button",
          align: "center",
          width:"200",
          btnList: [
              { type: "primary", label: "编辑", handle: this.editTemp },
              { label: "配置", handle: this.config }
            ],
        },
      ],
      tablesLoading: false,
      tempDialog: false, //编辑 & 新增对话框
      tempForm: {
        sceneryId: "",
        name: "",
        describe: "",
        durationLimit: "",
        sort: "",
      }, //对话框表单
      formData: [
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
      ],
      searchBtn: [
        {
          type: "primary",
          label: "新增",
          handle: this.add,
          icon: "el-icon-edit",
        },
        {
          type: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search",
        },
      ],
      tempDialogTitle: "", //对话框标题
      tempPointDialog: false, //模板点位对话框
      partDialog:false,
      tempDetailData: [],
      tempPointCols: [
        {
          label: "片段名称",
          prop: "name",
        },
        {
          label: "点位",
          prop: "pointId",
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
      ],
      tempPointPagination: {
        num: 1,
        size: 5,
        total: 0,
      },
      tagId:""
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
      this.tagId = res.data.value[0]?.tagId
    },

    // 新增
    async add() {
      // 打开对话框
      this.tempDialog = true;
      this.tempDialogTitle = "新增";
    },

    // 提交编辑 & 新增
    async submit(form) {
        const { sceneryId,id } = form
      try {
        if (this.tempDialogTitle === "编辑") {
          await editTemplate(form);
          await editTempTag({
            sceneryId, //景区id
            templetId:id, //模板id
            tags:[ this.tagId ],
          });
          this.getTableData();
          this.$message.success("修改成功");
        } else {
            // bug todo 暂时无法在新增时添加标签
          console.log(await addTemplate(form));
          this.$message.success("新增成功");
        }
        this.getTableData();
        this.tempDialog = false;
      } catch (err) {}
    },

    onClose(){
        this.tagId = ""
        this.$refs.form.resetFields()
    },

    // 配置模板
    config(row){
      this.partDialog = true
      this.getDetils(row.id)
    },


    async getDetils(TempletId){
      const res = await queryTempDetail({TempletId})
      this.tempDetailData = res.data.value?.list || res.data.value.map( v=>{
         v.status = !!v.status;
        return v;
      } )
    },

    async tempDetailStatusChange(){

    },

    // 查看模板点位信息
    checkTempPoint() {
      this.tempPointDialog = true;
      this.getTempPoint();
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

    // 模板点位表格分页
    tempPointSizeChange(val) {
      this.tempPointPagination.size = val;
      this.getTempPoint();
    },
    tempPointNumChange(val) {
      this.tempPointPagination.num = val;
      this.getTempPoint();
    },

    // 关闭模板点位对话框
    tempPointClose() {
      this.tempPointPagination.total = 0;
      this.tempPointData = [];
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
    SceneryPicker,
    Uploader,
  },
};
</script>

<style scoped>
</style>
