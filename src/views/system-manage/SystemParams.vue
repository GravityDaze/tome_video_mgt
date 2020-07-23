<template>
  <el-card>
    <searchs :formData="formData" :searchBtn="searchBtn" />
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
      top="20vh"
      @closed="dialogClose('paramsForm')"
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
          <el-input :disabled="this.paramsDialogTitle === '编辑'" placeholder="请输入参数键" v-model.trim="paramsForm.paramKey"></el-input>
        </el-form-item>
        <el-form-item label="参数值规则" prop="regularExpression">
          <el-input :disabled="this.paramsDialogTitle === '编辑'" placeholder="请输入参数值规则" v-model.number="paramsForm.regularExpression"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input placeholder="请输入参数值" v-model.trim="paramsForm.value"></el-input>
        </el-form-item>
        <el-form-item label="可否编辑" prop="edit">
          <el-radio-group v-model="paramsForm.edit">
            <el-radio :label="1">可以</el-radio>
            <el-radio :label="0">不可以</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" autosize v-model.trim="paramsForm.description"></el-input>
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
import initPagination from "@/mixins/initPagination";
import { restore } from '@/utils/restoreModel'
export default {
  mixins: [initPagination],
  name: "system-params",
  data() {
    return {
      paramsForm: {
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
          type:"tag",
          tagType:row=> (row.edit ? "" : "info"),
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
      formData: [
        {
          type: "input",
          label: "参数键",
          model: "paramKey",
          placeholder: "请输入参数键"
        },
        {
          type: "input",
          label: "参数值",
          model: "value",
          placeholder: "请输入用户昵称"
        },
        {
          label: "编辑",
          type: "select",
          model: "edit",
          options: [
            {
              label: "全部",
              value: undefined
            },
            {
              label: "可编辑",
              value: 1
            },
            {
              label: "不可编辑",
              value: 0
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
        },
        {
          type: "primary",
          label: "同步",
          handle: this.sync,
          icon: "el-icon-refresh",
          loading:false
        }
      ],
      tablesLoading: false,
      btnLoading:true,
      paramsDialog:false,
      paramsDialogTitle:'',
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

    // 新增参数
    add(){
      this.paramsDialog = true
      this.paramsDialogTitle = '新增'
    },

    // 提交
    async submitForm(formName){

      try{
        await editParams({id:this.id,...this[formName]})
        this.$message.success('修改成功')
        this.getTableData()
        this.paramsDialog = false
      }catch(err){console.log(err)}
    },



    // 关闭对话框回调
    dialogClose(formName){
      // 重置验证和数据
      this.$refs[formName].resetFields();
      this[formName] = restore(this[formName])
    },

    // 按钮查询
    query(searchData){
       this.searchData = searchData;
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getTableData();
    },

    // 同步至redis
    async sync(){
      const i = this.searchBtn.findIndex( v => v.label==="同步" )
      this.searchBtn[i].loading = true
      await paramsSync()
      this.searchBtn[i].loading = false
      this.$message.success('同步成功')
    }
  }
};
</script>

<style scoped>
</style>
