<template>
  <el-card>
    <searchs :formData="formData" @query="query" @add="add" :searchBtn="searchBtn" />
    <tables
      :tableCols="tableCols"
      :tableData="tableData"
      v-loading="tablesLoading"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />

    <!-- 编辑对话框 -->
    <el-dialog :title="tempDialogTitle" :visible.sync="tempDialog" @closed="dialogClose" width="30%">
      <el-form :model="tempForm">
        <el-form-item label="景区" label-width="120px">
          <el-select v-model="tempForm.sceneryId" placeholder="请选择景区">
            <el-option
              v-for="item in sceneryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" label-width="120px">
            <el-col :span="16">
              <el-input v-model="tempForm.name" autocomplete="off"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="模板描述" label-width="120px">
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
        <el-form-item label="时长限制" label-width="120px">
          <el-input-number v-model="tempForm.durationLimit" label="描述文字"></el-input-number>
          <!-- <el-input v-model="tempForm.durationLimit" autocomplete="off" type="number"></el-input> -->
        </el-form-item>
        <el-form-item label="排序" label-width="120px">
          <el-input-number v-model="tempForm.sort" label="描述文字"></el-input-number>
          <!-- <el-input v-model="tempForm.sort" autocomplete="off" type="number"></el-input> -->
        </el-form-item>
        <el-form-item v-show="tempDialogTitle === '编辑'" label="点位信息" label-width="120px">
          <el-button @click="checkTempPoint">点击查看</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tempDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit(tempForm)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 模板点位信息对话框 -->
    <el-dialog  @close="tempPointClose" width="70%" title="模板点位信息列表" :visible.sync="tempPointDialog">
      <tables
        :tableData="tempPointData"
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
  queryTemplateInfo,
  editTemplate,
  disableTemplate,
  enableTemplate,
  queryTemplatePoint,
  addTemplatePoint,
  getTemplatePoint,
  editTemplatePoint,
  disableTemplatePoint,
  enableTemplatePoint,
  getSceneryList
} from "@/api/management/videoManage";
import initPagination from "@/mixins/initPagination";
import { restore } from "@/utils/restoreModel";
export default {
  name: "scenery-shot-template",
  mixins: [initPagination],
  data() {
    return {
      tableCols: [
        {
          prop: "no",
          label: "模板编号",
          align: "center"
        },
        {
          prop: "name",
          label: "模板名称",
          align: "center"
        },
        {
          prop: "sceneryName",
          label: "所属景区",
          align: "center"
        },

        {
          prop: "describe",
          label: "模板描述",
          align: "center"
        },
        {
          prop: "durationLimit",
          label: "模板时长",
          align: "center"
        },
        {
          prop: "creator",
          label: "创建者",
          align: "center"
        },

        {
          prop: "createDatetime",
          label: "创建时间",
          align: "center"
        },
        {
          prop: "status",
          label: "状态",
          type: "switch",
          align: "center",
          change: this.statusChange
        },
        {
          label: "操作",
          type: "button",
          align:"center",
          btnList: [{ type: "primary", label: "编辑", handle: this.editTemp }]
        }
      ],
      tableData: [
        {
          id: "",
          sceneryName: "",
          no: "",
          name: "",
          url: "",
          coverUrl: "",
          describe: "",
          pointNum: "",
          sort: "",
          status: "",
          creator: "",
          createDatetime: "",
          updator: "",
          updateDatetime: ""
        }
      ],
      tablesLoading: false,
      tempDialog: false, //编辑 & 新增对话框
      tempForm: {
        sceneryId: "",
        name: "",
        describe: "",
        durationLimit: "",
        sort: ""
      }, //对话框表单
      formData: [
        {
          type: "input",
          label: "景区名称",
          model: "sceneryName",
          placeholder: "请输入所属景区"
        },
        {
          type: "input",
          label: "模板名称",
          model: "name",
          placeholder: "请输入模板名称"
        },
        {
          type: "datePicker",
          label: "时间范围",
          model: "createDatetime"
        },
        {
          type: "select",
          label: "状态",
          model: "status",
          options: [
            {
              label: "全部",
              value: undefined
            },
            {
              label: "禁用",
              value: 0
            },
            {
              label: "启用",
              value: 1
            }
          ]
        }
      ],
      searchBtn: [
        {
          type: "primary",
          label: "新增",
          handle: this.add,
          icon: "el-icon-edit"
        },
        {
          type: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search"
        }
      ],
      tempDialogTitle: "", //对话框标题
      sceneryList: [], //景区下拉框
      tempPointDialog: false, //模板点位对话框
      tempPointData: [],
      tempPointCols: [
        {
          label: "模板名称",
          prop: "templetName"
        },
        {
          label: "点位名称",
          prop: "name"
        },
        {
          label: "位置",
          prop: "location"
        },
        {
          label: "描述",
          prop: "describe"
        },
        {
          label: "时长",
          prop: "duration"
        },
        {
          label: "序号",
          prop: "sequence"
        },
        {
          label: "创建者",
          prop: "creator"
        },
        {
          label: "创建时间",
          prop: "createDatetime"
        },
        {
          label: "状态",
          type: "switch",
          prop: "status",
          change: this.tempPointStatusChange
        }
      ],
      tempPointPagination: {
        num: 1,
        size: 5,
        total: 0
      }
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
        pageSize: this.pagination.size
      }
    ) {
      try {
        this.tablesLoading = true;
        const { data } = await queryTemplateList(query);
        this.pagination.total = data.value.total;
        this.tableData = data.value.list.map(v => {
          // 将0和1转换为布尔值
          v.status = !!v.status;
          return v;
        });
      } catch (err) {
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
      this.tempDialog = true;
      this.tempDialogTitle = "编辑";
      this.id = row.id; //记录id
      const { data } = await getSceneryList({ id: this.id });
      this.sceneryList = data.value;
      // 回填数据
      for (const item in this.tempForm) {
        this.tempForm[item] = row[item];
      }
      // 将景区名转换为景区id
      this.tempForm.sceneryId = this.sceneryList.find(
        v => v.name === row.sceneryName
      )["id"];
    },

    // 提交编辑 & 新增
    async submit(form) {
      try {
        if (this.tempDialogTitle === "编辑") {
          await editTemplate({ ...form, id: this.id });
          this.getTableData();
          this.$message.success("修改成功");
          this.tempDialog = false;
        } else {
          await addTemplate({ ...form });
          this.getTableData();
          this.$message.success("新增成功");
          this.getTableData = false;
        }
      } catch (err) {}
    },

    // 新增
    async add() {
      // 打开对话框
      this.tempDialog = true;
      this.tempDialogTitle = "新增";
      const { data } = await getSceneryList({ id: this.id });
      this.sceneryList = data.value;
    },

    // 关闭对话框
    dialogClose() {
      this.tempForm = restore(this.tempForm);
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
        templetId: this.id
      });
      this.tempPointData = data.value.list.map(v => {
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
    tempPointClose(){
      this.tempPointPagination.total = 0
      this.tempPointData = []
    },

    // 按钮查询 bug toFix
    query(searchData) {
      if (!_.isEqual(searchData, this.searchData) ) {
        this.pagination.num = 1;
      }
      //将searchData中的时间数组转换为后台需要的字符串格式
      if (searchData.createDatetime) {
        const [ startDatetime, endDatetime] = searchData.createDatetime
        this.searchData = { ...searchData, startDatetime, endDatetime };
      }else{
        this.searchData = { ...searchData }
      }
      this.getTableData();
    }
  }
};
</script>

<style scoped>
</style>
