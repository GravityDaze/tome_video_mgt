<template>
  <div>
    <searchs :formData="formData" @query="query" @add="add" :searchBtn="searchBtn"/>
    <tables
      :tableCols="tableCols"
      :tableData="tableData"
      v-loading="tablesLoading"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />

    <!-- 编辑对话框 -->
    <el-dialog :title="tempDialogTitle" :visible.sync="tempDialog">
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
          <el-input v-model="tempForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模板描述" label-width="120px">
          <el-input
            v-model="tempForm.describe"
            type="textarea"
            maxlength="100"
            show-word-limit
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="时长限制" label-width="120px">
          <el-input-number v-model="tempForm.durationLimit" label="描述文字"></el-input-number>
          <!-- <el-input v-model="tempForm.durationLimit" autocomplete="off" type="number"></el-input> -->
        </el-form-item>
        <el-form-item label="排序" label-width="120px">
          <el-input-number v-model="tempForm.sort" label="描述文字"></el-input-number>
          <!-- <el-input v-model="tempForm.sort" autocomplete="off" type="number"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tempDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit(tempForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
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
} from "@/api/videoManage";
import initData from "@/mixins/initData";
import _ from "lodash";
export default {
  name: "scenery-shot-template",
  mixins: [initData],
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
          icon: "el-icon-search"
        },
        {
          type: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search"
        }
      ],
      tempDialogTitle: "", //对话框标题
      sceneryList: [] //景区下拉框
    };
  },

  created() {
    this.getTempList();
  },

  methods: {
    // 获取模板信息
    async getTempList(
      query = {
        ...this.searchForm,
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
          this.getTempList();
          this.$message.success("修改成功");
          this.tempDialog = false;
        } else {
          await addTemplate({ ...form });
          this.getTempList();
          this.$message.success("新增成功");
          this.getTempList = false;
        }
      } catch (err) {}
    },

    // 新增
    add(){
      // 打开对话框
      this.tempDialog = true;
      this.tempDialogTitle = "新增";
    },

    // 按钮查询 
    query(searchForm) {
      if (_.isEmpty(searchForm)) return this.$message.warning("无效的查询");
      // 将searchForm中的时间数组转换为后台需要的字符串格式 bug toFix
      if (searchForm.createDatetime && searchForm.createDatetime.length) {
        searchForm.startDatetime = searchForm.createDatetime[0];
        searchForm.endDatetime = searchForm.createDatetime[1];
        delete searchForm.createDatetime;
      } else if (searchForm.startDatetime || searchForm.endDatetime) {
        delete searchForm.startDatetime;
        delete searchForm.endDatetime;
      }
      this.searchForm = searchForm;
      console.log(this.searchForm)
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getTempList();
    },

    // 分页功能
    sizeChange(val) {
      this.pagination.size = val;
      this.getTempList();
    },
    numChange(val) {
      this.pagination.num = val;
      this.getTempList();
    }
  }
};
</script>

<style scoped>
</style>
