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
      @load="load"
    />

    <!--新增 & 编辑模态框-->
    <el-dialog
      :title="menuDialogTitle"
      :visible.sync="menuDialog"
      @closed="dialogClose('menuForm')"
      :close-on-click-modal="false"
      top="5%"
      width="40%"
    >
      <el-form
        style="width:500px"
        :model="menuForm"
        ref="menuForm"
        :rules="rules"
        label-width="100px"
        size="small"
        :hide-required-asterisk="false"
      >
        <el-form-item label="父菜单" prop="parentName">
          <el-input v-model.trim="menuForm.parentName" placeholder="请选择父菜单" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="menuForm.type">
            <el-option
              v-for="(value,key) in typeMap.values()"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="menuForm.type === 0" label="菜单精确类型" prop="fullOrChildMenu">
          <el-select v-model="menuForm.fullOrChildMenu">
            <el-option label="父菜单" :value="0"></el-option>
            <el-option label="子菜单" :value="1"></el-option>
          </el-select>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="菜单精确类型决定了该按钮在左侧菜单将以何种方式进行显示。其中，子菜单类型是点击可以直接跳转的导航按钮，父菜单类型仅仅起到折叠展开子菜单的作用"
          >
            <i slot="reference" class="el-icon-question" style="cursor:pointer;margin-left:5px;color:#606266"></i>
          </el-popover>
        </el-form-item>
        <el-form-item label="HTTP方法" prop="method">
          <el-select v-model="menuForm.method">
            <el-option
              v-for="(value,key) in methodMap.values()"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中文名称" prop="name">
          <el-input v-model.trim="menuForm.name" placeholder="请输入中文名称"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="nameEn">
          <el-input v-model.trim="menuForm.nameEn" placeholder="请输入英文名称"></el-input>
        </el-form-item>
        <el-form-item label="路由文件路径">
          <el-input v-model.trim="menuForm.route" placeholder="请输入路由文件路径"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model.trim="menuForm.url" placeholder="请输入URL"></el-input>
        </el-form-item>
        <el-form-item label="图标样式">
          <el-input v-model.trim="menuForm.iconStyle" placeholder="请输入图标样式"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="1" :max="99" label="显示顺序"></el-input-number>
        </el-form-item>
        <el-form-item label="可否刷新" prop="refreshable">
          <el-radio-group v-model="menuForm.refreshable">
            <el-radio :label="1">可以</el-radio>
            <el-radio :label="0">不可以</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            maxlength="30"
            show-word-limit
            type="textarea"
            v-model.trim="menuForm.description"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('menuForm')">提交</el-button>
          <el-button @click="menuDialog = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入api
import {
  getMenuTree,
  querySubMenu,
  addMenu,
  editMenu,
  getMenuInfo,
  enableMenu,
  disableMenu,
} from "@/api/management/systemManage";
import initPagination from "@/mixins/initPagination";
import { restore } from "@/utils/restoreModel";
export default {
  name: "menu-manage",
  mixins: [initPagination],
  data() {
    return {
      tableCols: [
        {
          prop: "name",
          label: "名称",
          width: "150",
        },
        {
          prop: "no",
          label: "编号",
          align: "center",
        },
        {
          prop: "url",
          label: "URL",
          align: "center",
        },
        {
          prop: "iconStyle",
          label: "图标样式",
          align: "center",
        },
        {
          prop: "sort",
          label: "显示顺序",
          align: "center",
        },
        {
          prop: "type",
          label: "类型",
          align: "center",
          formatter: (row) => this.typeMap.get(row.type),
        },
        {
          prop: "method",
          label: "HTTP方法",
          align: "center",
          formatter: (row) => this.methodMap.get(row.method),
        },
        {
          prop: "refreshable",
          label: "可刷新",
          align: "center",
          formatter: (row) => (row.refreshable ? "是" : "否"),
        },
        {
          type: "popover",
          prop: "description",
          label: "描述",
          align: "center",
          title: "查看",
        },
        {
          type: "switch",
          prop: "status",
          label: "状态",
          align: "center",
          change: this.statusChange,
          disabled: (row) => this.isChangeStatus,
        },
        {
          type: "button",
          label: "操作",
          align: "center",
          width: "180",
          btnList: [
            {
              label: "新增",
              handle: this.addSubMenu,
              type: "primary",
              disabled:row => row.fullOrChildMenu,
            },
            {
              label: "编辑",
              handle: this.editMenu,
              type: "primary",
              
            },
          ],
        },
      ],
      formData: [],
      searchBtn: [
        {
          type: "primary",
          label: "新增根菜单",
          handle: this.add,
          icon: "el-icon-edit",
        },
      ],
      menuForm: {
        parentName: "",
        type: "",
        method: "",
        name: "",
        nameEn: "",
        url: "",
        sort: "",
        refreshable: "",
        description: "",
        iconStyle: "",
        route: "",
        fullOrChildMenu: "",
      },
      tablesLoading: false,
      menuDialog: false,
      menuDialogTitle: "",

      // 验证规则
      rules: {
        parentName: [{ required: true, message: "请选择父级菜单" }],
        type: [
          { required: true, message: "请选择菜单类型", trigger: "change" },
        ],
        method: [
          { required: true, message: "请选择菜单HTTP方法", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入菜单中文名称", trigger: "blur" },
        ],
        nameEn: [
          { required: true, message: "请输入菜单英文名称", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请输入菜单显示顺序" },
          { type: "number", message: "顺序值必须为数字值" },
        ],
        refreshable: [
          {
            required: true,
            message: "请选择此菜单信息是否可刷新",
            trigger: "change",
          },
        ],
      },
      typeMap: new Map([
        [0, "菜单"],
        [1, "按钮"],
        [2, "资源"],
        [3, "查询按钮"],
        [4, "导出按钮"],
      ]),
      methodMap: new Map([
        [0, "GET"],
        [1, "POST"],
        [2, "PUT"],
        [3, "DELETE"],
      ]),
      treeMap: new Map(), //记录懒加载树形表格id,详见:https://blog.csdn.net/IM507/article/details/103297208
      isChangeStatus: false, //当前是否在切换菜单状态
    };
  },
  async created() {
    // 查询菜单树
    this.getTableData();
  },
  methods: {
    // 获取表格数据
    async getTableData(
      query = {
        pageNum: this.pagination.num,
        pageSize: this.pagination.size,
      }
    ) {
      try {
        // 切换菜单状态时 , 不需要loading效果
        if (!this.isChangeStatus) {
          this.tablesLoading = true;
        }
        // 获取默认表格数据
        const { data } = await querySubMenu(query);
        this.pagination.total = data.value.total;
        // 处理后台返回的数据
        this.tableData = data.value.list.map((v) => {
          // hasChildren字段为true时会将该行表格转换为树形
          v.hasChildren = !!v.hasChildren;
          v.status = !!v.status;
          return v;
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.tablesLoading = false;
      }
    },

    // 懒加载子节点数据
    async load({ tree, treeNode, resolve }) {
      this.treeId = tree.id;
      this.treeParentId = tree.parentId;
      // 记录当前点击菜单的id
      this.treeMap.set(this.treeId, { tree, treeNode, resolve });
      // 记录当前菜单的父元素id
      this.treeMap.set(this.treeParentId, { tree, treeNode, resolve });
      const { data } = await querySubMenu({ parentId: tree.id });
      // 加载数据
      resolve(
        data.value.list.map((v) => {
          v.hasChildren = !!v.hasChildren;
          v.status = !!v.status;
          return v;
        })
      );
    },

    // 切换菜单状态
    async statusChange(row) {
      try {
        this.isChangeStatus = true;
        if (row.status) {
          await enableMenu({ id: row.id });
          this.$message.success(`已启用${row.name}`);
        } else {
          await disableMenu({ id: row.id });
          this.$message.info(`已禁用${row.name}`);
        }
      } catch (err) {
        // 错误时恢复
        row.status = !row.status;
      } finally {
        // 刷新根节点
        this.getTableData();
        // 刷新根节点下的所有子节点
        if ([...this.treeMap].length) {
          for (const item of this.treeMap) {
            const { tree, treeNode, resolve } = this.treeMap.get(item[0]);
            this.load({ tree, treeNode, resolve });
          }
        }
        this.isChangeStatus = false;
      }
    },

    // 编辑菜单
    editMenu(row) {
      this.menuDialogTitle = "编辑";
      this.menuDialog = true;
      // 获取到id
      this.id = row.id;
      //获取到父级id
      this.parentId = row.parentId;
      // 回填数据
      for (const item in this.menuForm) {
        this.menuForm[item] = row[item];
      }
    },

    // 新增根菜单
    add() {
      this.menuDialogTitle = "新增根菜单";
      this.menuDialog = true;
      this.menuForm.parentName = "系统根";
      // 系统根id无法动态获取 暂时写死
      this.parentId = 1;
    },

    // 新增子菜单
    addSubMenu(row) {
      this.menuDialogTitle = "新增子菜单";
      this.menuDialog = true;
      this.menuForm.parentName = row.name;
      this.parentId = row.id;
    },

    // 对话框关闭时
    dialogClose(formName) {
      // 重置表单验证
      this.$refs[formName].resetFields();
      // 重置表单数据
      this[formName] = restore(this[formName]);
    },

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            // 判断是新增还是编辑
            if (this.menuDialogTitle === "编辑") {
              await editMenu({
                id: this.id,
                parentId: this.parentId,
                ...this[formName],
              });
              this.$message.success("修改成功");
              this.menuDialog = false;
            } else {
              await addMenu({ parentId: this.parentId, ...this[formName] });
              this.$message.success("新增成功");
              this.menuDialog = false;
            }
          } catch (err) {
            console.log(err);
          } finally {
            // 更新根节点数据
            this.getTableData();
            // 更新子节点数据
            const { tree, treeNode, resolve } = this.treeMap.get(this.treeId);
            this.load({ tree, treeNode, resolve });
            // 热更新菜单
            this.$store
              .dispatch("permission/getMenuList")
              .then(() => console.log("更新完成"))
              .catch((err) => console.log(err));
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.card {
  display: flex;
}
</style>
