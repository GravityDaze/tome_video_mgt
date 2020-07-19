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
      :title="tagsDialogTitle"
      :visible.sync="tagsDialog"
      width="25%"
      @close="dialogClose('tagsForm')"
      :close-on-click-modal="false"
      top="15%"
    >
      <el-form
        style="width:300px"
        :model="tagsForm"
        ref="tagsForm"
        label-width="100px"
        size="small"
        :hide-required-asterisk="false"
      >
        <el-form-item
          label="标签名称"
          prop="name"
          :rules="[
              { required: true, message: '标签不能为空',trigger: 'blur'},
            ]"
        >
          <el-input v-model.trim="tagsForm.name" placeholder="请输入标签名称"></el-input>
        </el-form-item>
        <el-form-item label="标签类型">
          <el-select v-model="tagsForm.type" disabled>
            <el-option label="景区标签" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('tagsForm')">提交</el-button>
          <el-button @click="tagsDialog = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  queryTags,
  addTag,
  enableTag,
  disableTag,
  tagsSelect,
  editTag
} from "@/api/management/systemManage";
import initPagination from "@/mixins/initPagination";
export default {
  mixins: [initPagination],
  data() {
    return {
      tableCols: [
        {
          prop: "name",
          label: "标签名称",
          align: "center",
          type:"tag",
          effect:"plain",
          tag:()=>'success'
        },
        {
          prop: "type",
          label: "标签类型",
          align: "center",
          formatter: row => (row.type === 1 ? "景区标签" : "未知")
        },
        {
          prop: "createDatetime",
          label: "创建时间",
          align: "center"
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
          align: "center"
        },
        {
          type: "switch",
          prop: "status",
          label: "状态",
          align: "center",
          change: this.statusChange
        },
        {
          label: "操作",
          align: "center",
          width: "120",
          type: "button",
          btnList: [{ type: "primary", label: "编辑", handle: this.editTag }]
        }
      ],
      formData: [
        {
          type: "input",
          label: "标签名称",
          model: "name",
          placeholder: "请输入标签名"
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
              label: "启用",
              value: 1
            },
            {
              label: "禁用",
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
        }
      ],
      tagsForm: {
        type: 1,
        name: ""
      },
      tagsDialog: false,
      tagsDialogTitle: "",
      tablesLoading: false
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取标签列表
    async getTableData(
      query = {
        ...this.searchData,
        pageNum: this.pagination.num,
        pageSize: this.pagination.size
      }
    ) {
      try {
        this.tablesLoading = true;
        const { data } = await queryTags(query);
        this.pagination.total = data.value.total;
        // 将后台返回的数据处理为符合switch组件的数据
        console.log(data.value.list);
        this.tableData = data.value.list.map(v => {
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

    // 切换标签
    async statusChange(row) {
      try {
        if (row.status) {
          await enableTag({ id: row.id });
          this.$message.success(`已启用标签${row.name}`);
        } else {
          await disableTag({ id: row.id });
          this.$message.info(`已禁用标签${row.name}`);
        }
      } catch (err) {
        // 错误时恢复
        row.status = !row.status;
      }
    },

    // 编辑标签
    editTag(row) {
      this.tagsDialogTitle = "编辑";
      this.tagsDialog = true;
      this.id = row.id;
      // 回填数据
      for (const item in this.tagsForm) {
        this.tagsForm[item] = row[item];
      }
    },

    // 新增标签
    add() {
      this.tagsDialogTitle = "新增";
      this.tagsDialog = true;
    },

    // 对话框关闭时
    dialogClose(formName) {
      this[formName].type = 1;
      this[formName].name = "";
      this.$refs[formName].resetFields();
    },

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            // 判断是新增还是编辑
            if (this.tagsDialogTitle === "编辑") {
              await editTag({ id: this.id, ...this.tagsForm });
              this.$message.success("修改成功");
              this.tagsDialog = false;
              this.getTableData();
            } else {
              await addTag(this.tagsForm);
              this.$message.success("新增成功");
              this.tagsDialog = false;
              this.getTableData();
            }
          } catch (err) {
            console.log(err);
          }
        }
      });
    },

    // 查询标签
    query(searchData) {
      this.searchData = searchData;
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getTableData();
    }
  }
};
</script>

<style>
</style>