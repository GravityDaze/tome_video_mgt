<template>
  <el-card>
    <searchs :searchBtn="searchBtn" />
    <tables
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
      hidePagination
      type="index"
      v-loading="tableLoading"
    />

    <!-- 新增价格规则对话框 -->
    <el-dialog
      width="35%"
      top="25vh"
      title="新增规则"
      :visible.sync="ruleDialog"
      @close="dialogClose('ruleForm')"
    >
      <el-form :model="ruleForm" ref="ruleForm">
        <el-form-item label="时间范围" label-width="120px">
          <el-slider style="width:300px" v-model="ruleForm.value" :marks="marks" range :max="120"></el-slider>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '售价不能为空'},
          ]"
          prop="price"
          label="售价"
          label-width="120px"
        >
          <el-input style="width:200px" placeholder="请输入金额" v-model="ruleForm.price">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="当前规则" label-width="120px">
          <span>
            视频时长大于等于
            <strong>{{ruleForm.value[0]}}</strong>秒，小于等于
            <strong>{{ruleForm.value[1]}}</strong>秒，售价
            <strong>{{ruleForm.price || 0}}</strong>元
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  queryPrinceConfig,
  addPrinceConfig,
  delPrinceConfig
} from "@/api/management/saleManage";
import initPagination from "@/mixins/initPagination";
export default {
  mixins: [initPagination],
  name: "demand-manage",
  data() {
    return {
      tableCols: [
        {
          prop: "rule",
          label: "规则"
        },
        {
          prop: "price",
          label: "售价",
          width: "120",
          align: "center"
        },
        {
          label: "操作",
          type: "button",
          align: "center",
          width: "120",
          btnList: [
            {
              type: "danger",
              label: "删除",
              disabled: row => row.disabled,
              handle: this.delete
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
        }
      ],
      ruleForm: {
        value: [30, 60],
        price: ""
      },
      marks: {
        30: "30秒",
        60: "60秒"
      },
      ruleDialog: false
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      this.tableLoading = true;
      try {
        const { data } = await queryPrinceConfig();
        this.tableData = data.value.map(v => {
          return {
            rule: `视频时长大于等于${v.minTime}秒，小于等于${v.maxTime}秒`,
            price: `${v.price}元`,
            id: v.id,
            disabled: v.id === 1
          };
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.tableLoading = false;
      }
    },

    // 新增一条价格配置
    add() {
      this.ruleDialog = true;
    },

    // 删除一条价格配置
    delete({ id }) {
      this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await delPrinceConfig({ id });
          this.$message.info("删除成功");
          this.getTableData();
        })
        .catch(()=>{});
    },

    submit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const obj = {
            minTime: this[formName].value[0],
            maxTime: this[formName].value[1],
            price: this[formName].price * 100
          };
          try {
            await addPrinceConfig(obj);
            this.$message.success("新增成功");
            this.ruleDialog = false;
            this.getTableData();
          } catch (err) {
            console.log(err);
          }
        }
      });
    },
    dialogClose(formName) {
      this[formName].value = [30, 60];
      this[formName].price = "";
    }
  }
};
</script>

<style scoped>
strong {
  color: red !important;
  font-weight: bold;
}
</style>
