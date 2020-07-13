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
      :title="roleDialogTitle"
      :visible.sync="roleDialog"
      width="25%"
      @close="dialogClose('roleForm')"
      :close-on-click-modal="false"
      top="15%"
    >
      <el-form
        style="width:300px"
        :model="roleForm"
        ref="roleForm"
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
          <el-input v-model.trim="roleForm.name" placeholder="请输入标签名称"></el-input>
        </el-form-item>
        <el-form-item label="标签类型">
          <el-select v-model="roleForm.type" disabled>
            <el-option label="景区标签" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
          <el-button @click="roleDialog = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  queryRole,
  addRole,
  editRole,
  enableRole,
  disableRole,
  getAssignableAuth,
  assignableAuth,
  getMenuAuth,
  menuAuth
} from "@/api/management/systemManage";
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  data() {
    return {
      tableCols: [
        {
          prop: "name",
          label: "角色名称",
          align: "center"
        },
        {
          prop: "mark",
          label: "权限标识",
          align: "center"
        },
        {
          prop: "sort",
          label: "显示顺序",
          align: "center"
        },
        {
          prop: "description",
          label: "角色描述",
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
          type: "button",
          btnList: [
            {
              type: "primary",
              label: "编辑",
              handle: this.editTag
            },
            {
              type: "primary",
              label: "授权",
              handle: this.auth
            }
          ]
        }
      ],
      formData: [
        {
          type: "input",
          label: "标签名称",
          model: "name",
          placeholder: "请输入角色名称"
        },
        {
          type: "input",
          label: "标签名称",
          model: "mark",
          placeholder: "请输入权限标识"
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
      roleForm: {
        type: 1,
        name: ""
      },
      roleDialog: false,
      roleDialogTitle: "",
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
        ...this.searchForm,
        pageNum: this.pagination.num,
        pageSize: this.pagination.size
      }
    ) {
      try {
        this.tablesLoading = true;
        const { data } = await queryRole(query);
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
          await enableRole({ id: row.id });
          this.$message.success(`已启用角色${row.name}`);
        } else {
          await disableRole({ id: row.id });
          this.$message.info(`已禁用角色${row.name}`);
        }
      } catch (err) {
        // 错误时恢复
        row.status = !row.status;
      }
    },

    // 编辑标签
    editTag(row) {
      this.roleDialogTitle = "编辑";
      this.roleDialog = true;
      this.id = row.id;
      // 回填数据
      for (const item in this.roleForm) {
        this.roleForm[item] = row[item];
      }
    },

    // 新增标签
    add() {
      this.roleDialogTitle = "新增";
      this.roleDialog = true;
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
            if (this.roleDialogTitle === "编辑") {
              await editTag({ id: this.id, ...this.roleForm });
              this.$message.success("修改成功");
              this.roleDialog = false;
              this.getTableData();
            } else {
              await addTag(this.roleForm);
              this.$message.success("新增成功");
              this.roleDialog = false;
              this.getTableData();
            }
          } catch (err) {
            console.log(err);
          }
        }
      });
    },

    // 授权相关
    auth(){

    },

    // 查询标签
    query(searchForm) {
      this.searchForm = searchForm;
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getTableData();
    }
  }
};
</script>

<style>
</style>