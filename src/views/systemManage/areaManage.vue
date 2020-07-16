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
      :title="areaDialogTitle"
      :visible.sync="areaDialog"
      @close="dialogClose('areaForm')"
      :close-on-click-modal="false"
      top="10%"
      width="40%"
    >
      <el-form
        style="width:500px"
        :model="areaForm"
        ref="areaForm"
        label-width="100px"
        size="small"
        :hide-required-asterisk="false"
      >
        <el-form-item label="上级区域">
          <el-input v-model.trim="areaForm.parentName" placeholder="请选择父菜单" disabled></el-input>
        </el-form-item>
        <el-form-item label="区域名称">
          <el-input v-model.trim="areaForm.name" placeholder="请输入区域名称"></el-input>
        </el-form-item>
        <el-form-item label="标准区域码">
          <el-input v-model.trim="areaForm.code" placeholder="请输入区域码"></el-input>
        </el-form-item>
        <el-form-item label="区域级别">
           <el-select v-model="areaForm.level">
            <el-option v-for="(value,key) in areaMap.values()" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="areaForm.level === 0 && areaForm.level !==''" label="国际电话区码">
          <el-input v-model.trim="areaForm.phoneCode" placeholder="请输入国际电话区码"></el-input>
        </el-form-item>
        <el-form-item label="经纬度">
          <el-input v-model.trim="areaForm.lonLat" placeholder="请输入经纬度"></el-input>
        </el-form-item>
        <el-form-item label="首字母">
          <el-input v-model.trim="areaForm.initial" placeholder="请输入首字母"></el-input>
        </el-form-item>
        <el-form-item label="简拼">
          <el-input v-model.trim="areaForm.simpleSpell" placeholder="请输入简拼"></el-input>
        </el-form-item>
        <el-form-item label="全拼">
         <el-input v-model.trim="areaForm.fullSpell" placeholder="请输入全拼"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('areaForm')">提交</el-button>
          <el-button @click="areaDialog = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入api
import {
  queryArea,
  addArea,
  editArea,
  enableArea,
  disableArea
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
          label: "区域名称",
          width: "180"
        },
        {
          prop: "code",
          label: "标准区域码",
          align: "center"
        },
        {
          prop: "phoneCode",
          label: "国际电话区号",
          align: "center"
        },
        {
          prop: "level",
          label: "级别",
          align: "center"
        },
        {
          prop: "lonLat",
          label: "经纬度",
          align: "center"
        },
        {
          prop: "parentName",
          label: "父级区域",
          align: "center"
        },
        {
          prop: "fullName",
          label: "区域全称",
          align: "center"
        },
        {
          prop: "simpleSpell",
          label: "简拼",
          align: "center",
        },
        {
          prop: "fullSpell",
          label: "全拼",
          align: "center",
        },
        {
          type: "switch",
          prop: "status",
          label: "状态",
          align: "center",
          change: this.statusChange,
          disabled:row=>row.isChangeStatus
        },
        {
          type: "button",
          label: "操作",
          align: "center",
          width:"200",
          btnList: [
            {
              label:"新增",
              handle:this.addSubMenu,
              type:"primary"
            },
            {
              label: "编辑",
              handle: this.editMenu,
              type: "primary"
            }
          ]
        }
      ],
      formData: [],
      searchBtn: [
        {
          type: "primary",
          label: "新增根区域",
          handle: this.add,
          icon: "el-icon-edit"
        }
      ],
      areaForm: {
        parentName: "",
        code: "",
        level: "",
        name: "",
        phoneCode: "",
        lonLat: "",
        initial: "",
        simpleSpell: "",
        fullSpell: "",
      },
      ruleForm: {
        parentName: "",
        code: "",
        level: "",
        name: "",
        phoneCode: "",
        lonLat: "",
        initial: "",
        simpleSpell: "",
        fullSpell: "",
      },
      tablesLoading: false,
      areaDialog: false,
      areaDialogTitle: "",

      // 验证规则
      rules: {
        parentName: [{ required: true, message: "请选择父级菜单" }],
        type: [
          { required: true, message: "请选择菜单类型", trigger: "change" }
        ],
        method: [
          { required: true, message: "请选择菜单HTTP方法", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入菜单中文名称", trigger: "blur" }
        ],
        nameEn: [
          { required: true, message: "请输入菜单英文名称", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入菜单URL", trigger: "blur" }],
        sort: [
          { required: true, message: "请输入菜单显示顺序" },
          { type: "number", message: "顺序值必须为数字值" }
        ],
        refreshable: [
          {
            required: true,
            message: "请选择此菜单信息是否可刷新",
            trigger: "change"
          }
        ]
      },
      areaMap: new Map([
        [0, "国家"],
        [1, "省、自治区"],
        [2, "市"],
        [3, "县"]
      ]),
      treeMap: new Map(), //记录懒加载树形表格id,详见:https://blog.csdn.net/IM507/article/details/103297208
      isChangeStatus:false //当前是否在切换菜单状态
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取表格数据
    async getTableData(
      query = {
        pageNum: this.pagination.num,
        pageSize: this.pagination.size
      }
    ) {
      try {
        // 切换菜单状态时 , 不需要loadingf效果
        if(!this.isChangeStatus){
          this.tablesLoading = true
        }
        // 获取默认表格数据
        const { data } = await queryArea(query);
        this.pagination.total = data.value.total;
        // 处理后台返回的数据
        this.tableData = data.value.list.map(v => {
          // hasChildren字段为true时会将该行表格转换为树形
          v.hasChildren = !!v.hasChildren
          v.status = !!v.status;
          return v;
        });
      } catch (err) {
        console.log(err);
      }finally{
        this.tablesLoading = false
      }
    },

    // 懒加载子节点数据
    async load({ tree, treeNode, resolve }) {
      this.treeId = tree.id 
      this.treeParentId = tree.parentId
      // 记录当前点击菜单的id
      this.treeMap.set(this.treeId,{tree,treeNode,resolve})
      // 记录当前菜单的父元素id
      this.treeMap.set(this.treeParentId,{tree,treeNode,resolve})
      const { data } = await queryArea({ areaId: tree.id });
      // 加载数据
      resolve(
        data.value.list.map(v => {
          v.hasChildren = !!v.hasChildren
          v.status = !!v.status;
          return v;
        })
      );
    },

    // 切换菜单状态
    async statusChange(row) {
      try {
        this.isChangeStatus = true
        // 此参数是为了禁止频繁切换状态
        row.isChangeStatus = true
        if (row.status) {
          await enableArea({ id: row.id });
          this.$message.success(`已启用${row.name}`);
        } else {
          await disableArea({ id: row.id });
          this.$message.info(`已禁用${row.name}`);
        }
      } catch (err) {
        // 错误时恢复
        row.status = !row.status;
      }finally{
        // 刷新根节点
        this.getTableData()
        // 刷新根节点下的所有子节点
        if([...this.treeMap].length){
          for(const item of this.treeMap){
            const { tree,treeNode,resolve } = this.treeMap.get(item[0])
            this.load({tree,treeNode,resolve})
          }
        }
        this.isChangeStatus = false
         row.isChangeStatus = false
      }
    },

    // 编辑菜单
    editMenu(row) {
      this.areaDialogTitle = "编辑";
      this.areaDialog = true;
      // 获取到id
      this.id = row.id; 
      //获取到父级id
      this.parentId = row.parentId;
      // 回填数据
      for (const item in this.areaForm) {
        this.areaForm[item] = row[item];
      }
    },

    // 新增根菜单
    add() {
      this.areaDialogTitle = "新增根区域";
      this.areaDialog = true;
      this.areaForm.parentName = "世界"
      // 系统根id无法动态获取 暂时写死
      this.parentId = 1 
    },

    // 新增子菜单
    addSubMenu(row){
      this.areaDialogTitle = "新增子菜单";
      this.areaDialog = true;
      this.areaForm.parentName = row.name
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
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            // 判断是新增还是编辑
            if (this.areaDialogTitle === "编辑") {
              await editArea({
                id: this.id,
                parentId: this.parentId,
                ...this[formName]
              });
              this.$message.success("修改成功");
              this.areaDialog = false;
            } else {
              await addArea({parentId:this.parentId,...this[formName]});
              this.$message.success("新增成功");
              this.areaDialog = false;
            }
          } catch (err) {
            console.log(err);
          }finally{
              // 更新根节点数据
              this.getTableData();
              // 更新子节点数据
              const { tree,treeNode,resolve } = this.treeMap.get(this.treeId)
              this.load({tree,treeNode,resolve})
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.card {
  display: flex;
}
</style>
