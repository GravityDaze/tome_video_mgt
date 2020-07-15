<template>
  <el-card>
    <!-- <searchs :formData="formData" :searchBtn="searchBtn" /> -->
    <tables
      v-loading="tablesLoading"
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />

    <!--新增 & 编辑模态框-->
    <el-dialog
      :title="paramsDialogTitle"
      :visible.sync="paramsDialog"
      width="25%"
      @close="dialogClose('paramsForm')"
      :close-on-click-modal="false"
    >
      <el-form
        style="width:320px"
        :model="paramsForm"
        :rules="rules"
        ref="paramsForm"
        label-width="100px"
        size="small"
        :hide-required-asterisk="false"
      >
        <el-form-item label="参数键" prop="paramKey">
          <el-input placeholder="请输入参数键" v-model.trim="paramsForm.paramKey"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input placeholder="请输入参数值" v-model.trim="paramsForm.value"></el-input>
        </el-form-item>
        <el-form-item label="参数值规则" prop="regularExpression">
          <el-input placeholder="请输入参数值规则" v-model.number="paramsForm.regularExpression"></el-input>
        </el-form-item>
        <el-form-item label="可否编辑" prop="edit">
          <el-radio-group v-model="paramsForm.edit">
            <el-radio :label="0">可以</el-radio>
            <el-radio :label="1">不可以</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model.trim="paramsForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('paramsForm')">提交</el-button>
          <el-button @click="paramsDialog = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  queryParams,
  addParams,
  editParams,
  paramsSync
} from "@/api/management/systemManage";
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  name: "system-params",
  data() {
    return {
      paramsForm: {
        id: "",
        paramKey: "",
        value: "",
        regularExpression: "",
        edit: "",
        description: ""
      },
      // 验证规则
      rules: {
        paramKey: [{ required: true, message: "请输入参数键", tigger: "blur" }],
        value: [{ required: true, message: "请输入参数值", tigger: "blur" }],
        regularExpression: [
          { required: true, message: "请输入参数值规则", tigger: "blur" }
        ],
        edit: [
          {
            required: true,
            message: "请选择此参数信息是否可编辑",
            trigger: "change"
          }
        ]
      },
      tableCols: [
        {
          prop: "paramKey",
          label: "参数键",
          align: "center"
        },
        {
          prop: "value",
          label: "参数值",
          align: "center"
        },
        {
          prop: "regularExpression",
          label: "参数值规则",
          align: "center"
        },
        {
          prop: "description",
          label: "描述",
          align: "center"
        },
        {
          prop: "edit",
          label: "是否可编辑",
          align: "center",
          formatter: row => (row.edit ? "可编辑" : "不可编辑")
        },
        {
          label: "操作",
          align: "center",
          type: "button",
          btnList: [
            {
              type: "primary",
              label: "编辑",
              handle: this.editParams,
              disabled: row => !row.edit
            }
          ]
        }
      ],
      tablesLoading: false,
      paramsDialog:false,
      paramsDialogTitle:''
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData(
      query = {
        ...this.searchForm,
        pageNum: this.pagination.num,
        pageSize: this.pagination.size
      }
    ) {
      try {
        this.tablesLoading = true;
        const { data } = await queryParams(query);
        this.pagination.total = data.value.total;
        this.tableData = data.value.list;
      } catch (err) {
        console.log(err);
      } finally {
        this.tablesLoading = false;
      }
    },

    // 编辑参数
    editParams(row) {
      this.paramsDialog = true
      this.id = row.id
      this.paramsDialogTitle = '编辑'
      // 回填数据
      for( const item in this.paramsForm ){
        this.paramsForm[item] = row[item]
      }
    },




    // 关闭对话框回调
    dialogClose(){
      //todo
    }
  
  }
};
</script>

<style scoped>
</style>
