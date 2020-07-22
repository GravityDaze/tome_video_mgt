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
        style="width:350px"
        :model="roleForm"
        ref="roleForm"
        label-width="100px"
        size="small"
        :hide-required-asterisk="false"
      >
        <el-form-item
          label="角色名称"
          prop="name"
          :rules="[
              { required: true, message: '角色名不能为空',trigger: 'blur'},
            ]"
        >
          <el-input v-model.trim="roleForm.name" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model.trim="roleForm.mark" placeholder="请输入标识">
            <template slot="prepend">ROLE_</template>
          </el-input>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number v-model="roleForm.sort" :min="1" :max="99" label="显示顺序"></el-input-number>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            maxlength="30"
            show-word-limit
            type="textarea"
            v-model.trim="roleForm.description"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
          <el-button @click="roleDialog = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 授权模态框 -->
    <el-dialog
      title="授权"
      :visible.sync="authDialog"
      @close="authDialogClose('authForm')"
      :close-on-click-modal="false"
      top="3%"
    >
      <el-form
        :model="authForm"
        ref="roleForm"
        label-width="100px"
        size="small"
        :hide-required-asterisk="false"
      >
        <el-form-item label="角色名称">
          <span>{{authForm.name}}</span>
        </el-form-item>
        <el-form-item label="可授角色">
          <el-checkbox-group v-model="authForm.roleIds">
            <el-checkbox v-for="item in canAuth" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="可授功能">
          <el-tree
            v-loading="treeLoading"
            :data="treeData"
            show-checkbox
            :default-expanded-keys="expandedKeys"
            :default-checked-keys="authForm.menuIds"
            node-key="id"
            :props="defaultProps"
            ref="tree"
          ></el-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAuth('authForm')">提交</el-button>
          <el-button @click="authDialog = false">关闭</el-button>
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
import { restore } from "@/utils/restoreModel";
import initPagination from "@/mixins/initPagination";
export default {
  mixins: [initPagination],
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
          change: this.statusChange,
          disabled: row => row.name === "ADMIN"
        },
        {
          label: "操作",
          align: "center",
          type: "button",
          btnList: [
            {
              type: "primary",
              label: "编辑",
              handle: this.editRole
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
          label: "角色名称",
          model: "name",
          placeholder: "请输入角色名称"
        },
        {
          type: "input",
          label: "权限标识",
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
        sort: 1,
        name: "",
        mark: "",
        description: ""
      }, // 编辑 & 新增表单
      roleDialog: false, //编辑 & 新增对话框
      roleDialogTitle: "", // 编辑 & 新增对话框标题
      tablesLoading: false, //表格加载效果
      authDialog: false, //授权对话框
      treeLoading: false, //树形控件加载效果
      canAuth: [], //可以被授权的角色
      beAuth: [], //已被授权的角色
      treeData: [], //树形菜单控件数据
      defaultProps: {
        children: "child",
        label: "name"
      },
      expandedKeys: [], //默认展开的树形控件
      authForm: {
        roleIds: [],
        menuIds: []
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取角色列表
    async getTableData(
      query = {
        ...this.searchData,
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

    // 切换角色状态
    async statusChange(row) {
      console.log(row);
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

    // 编辑角色
    editRole(row) {
      this.roleDialogTitle = "编辑";
      this.roleDialog = true;
      this.id = row.id;
      // 回填数据
      for (const item in this.roleForm) {
        this.roleForm[item] = row[item];
      }
      // 处理权限标识
      this.roleForm.mark = this.roleForm.mark.split("ROLE_")[1];
    },

    // 新增角色
    add() {
      this.roleDialogTitle = "新增";
      this.roleDialog = true;
    },

    // 对话框关闭时
    dialogClose(formName) {
      this.$refs[formName].resetFields();
      this[formName].sort = 1;
      this[formName].name = "";
      this[formName].description = "";
      this[formName].mark = "";
      console.log(this[formName]);
    },

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            // 判断是新增还是编辑
            if (this.roleDialogTitle === "编辑") {
              await editRole({ id: this.id, ...this[formName] });
              this.$message.success("修改成功");
              this.roleDialog = false;
              this.getTableData();
            } else {
              // 处理权限标识
              this[formName].mark = `ROLE_${this[formName].mark}`;
              await addRole(this[formName]);
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

    // 打开授权对话框
    async auth(row) {
      this.id = row.id;
      this.authDialog = true;
      this.treeLoading = true;
      // 并发请求功能授权及角色授权
      try {
        const [res1, res2] = await Promise.all([
          getAssignableAuth({ id: row.id }),
          getMenuAuth({ id: row.id })
        ]);
        // 获取可被授权的角色数据
        this.canAuth = res1.data.value.canAuth;
        // 获取可被授权的树形菜单数据
        this.treeData = res2.data.value.canAuth;
        // 回填角色名称数据
        this.authForm.name = row.name;
        // 回填可授权角色数据
        this.authForm.roleIds = res1.data.value.beAuth.map(v => v.id);
        // 回填可授权功能数据
        this.getTree( res2.data.value.beAuth)
        console.log(res2.data.value.beAuth)
        console.log(this.treeData)
        // 将默认选中节点的父节点展开
        this.expandedKeys = res2.data.value.beAuth.map(v => v.parentId);
        // 如果不存在选中的节点则默认展开根节点
        !this.expandedKeys.length && (this.expandedKeys = [1]);
      } catch (err) {
        console.log(err);
      } finally {
        this.treeLoading = false;
      }
    },

    getTree(data){
      data.forEach( v=>{
        if(!v.child){
        this.authForm.menuIds.push(v.id)
      }else{
        this.getTree(v.child)
      }
      } )
    },


    // 授权对话框提交
    async submitAuth(formName) {
      // 提交时过滤掉系统根的id,以防止新增菜单后后台返回系统根id导致树形控件中所有菜单都被默认选中
      const menuIds = this.$refs.tree.getCheckedKeys().filter( v => v!==1 )
      await Promise.all([
        menuAuth({ id: this.id, menuIds }),
        assignableAuth({ id: this.id, roleIds: this[formName].roleIds })
      ]);
      this.$message.success("授权成功");
      this.authDialog = false;
    },

    // 关闭授权对话
    authDialogClose(formName) {
      //还原表单数据
      this[formName] = restore(this[formName]);
      // 还原树形控件数据
      this.treeData = [];
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