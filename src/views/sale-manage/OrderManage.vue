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

    <!-- 修改支付状态 -->
    <el-dialog
      width="30%"
      top="30vh"
      title="修改支付状态"
      :visible.sync="statusDialog"
      @close="dialogClose('statusForm')"
    >
      <el-form :model="statusForm" :rules="statusRules" ref="statusForm">
        <el-form-item label="支付状态" label-width="120px">
          <el-select v-model="statusForm.status" disabled>
            <el-option label="已支付" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修改备注" label-width="120px" prop="cause">
          <el-input
            style="width:300px"
            type="textarea"
            v-model="statusForm.cause"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialog = false">取 消</el-button>
        <el-button type="primary" @click="statusSubmit('statusForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 退款对话框 -->
    <el-dialog
      width="30%"
      top="25vh"
      title="退款"
      :visible.sync="refundDialog"
      @closed="dialogClose('refundForm')"
    >
      <el-form :model="refundForm" :rules="refundRules" ref="refundForm">
        <el-form-item label="订单金额" label-width="120px">
          <span>{{refundForm.price}}</span>
        </el-form-item>
        <el-form-item label="已退金额" label-width="120px">
          <span>{{refundForm.refundedPrice}}</span>
        </el-form-item>
        <el-form-item label="退款金额" label-width="120px" prop="refundPrice">
          <el-col :span="12">
            <el-input placeholder="请输入退款金额" v-model="refundForm.refundPrice">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="退款原因" label-width="120px" prop="cause">
          <el-col :span="16">
            <el-input placeholder="请输入退款原因" type="textarea" v-model="refundForm.cause"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundDialog = false">取 消</el-button>
        <el-button type="primary" @click="refundSubmit('refundForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  orderQuery,
  changeOrderStatus,
  refundPrice,
  refund,
} from "@/api/management/saleManage";
import initPagination from "@/mixins/initPagination";
import { restore } from "@/utils/restoreModel";
export default {
  mixins: [initPagination],
  data() {
    return {
      tableCols: [
        {
          label: "订单编号",
          prop: "no",
          align: "center",
        },
        {
          label: "景区编号",
          prop: "sceneryNo",
          align: "center",
        },
        {
          label: "所属景区",
          prop: "sceneryName",
          align: "center",
        },
        {
          label: "用户编号",
          prop: "no",
          align: "center",
        },
        {
          label: "小视频编号",
          prop: "videoNo",
          align: "center",
        },
        {
          label: "订单金额",
          prop: "price",
          align: "center",
        },
        {
          label: "下单时间",
          prop: "createDatetime",
          align: "center",
        },
        {
          label: "订单状态",
          prop: "status",
          align: "center",
          type: "tag",
          tagType: (row) => (row.status === 0 ? "info" : "success"),
          formatter: (row) => (row.status === 0 ? "未支付" : "已完成"),
        },
        {
          label: "支付时间",
          prop: "buyDatetime",
          align: "center",
        },
        {
          label: "支付状态",
          prop: "payStatus",
          align: "center",
          type: "tag",
          tagType: (row) => (row.status === 0 ? "info" : "success"),
          formatter: (row) => (row.payStatus === 0 ? "未支付" : "已支付"),
        },
        {
          label: "操作",
          type: "button",
          align: "center",
          btnList: [
            {
              type: "text",
              label: "修改支付状态",
              handle: this.changeStatus,
              show: (row) => row.payStatus === 0,
            },
            {
              type: "text",
              label: "退款",
              handle: this.handleRefund,
              show: (row) => row.payStatus === 1,
            },
          ],
        },
      ],
      formData: [
        {
          type: "input",
          label: "所属景区",
          model: "sceneryName",
          placeholder: "请输入景区名称",
        },
        {
          type: "input",
          label: "昵称",
          model: "customerNickName",
          placeholder: "请输入用户昵称",
        },
        {
          type: "input",
          label: "小视频编号",
          model: "videoNo",
          placeholder: "请输入用户昵称",
        },
        {
          label: "订单状态",
          type: "select",
          model: "status",
          options: [
            {
              label: "全部",
              value: undefined,
            },
            {
              label: "未支付",
              value: 0,
            },
            {
              label: "已完成",
              value: 1,
            },
          ],
        },
        {
          type: "select",
          label: "支付状态",
          model: "payStatus",

          options: [
            {
              label: "全部",
              value: undefined,
            },
            {
              label: "未支付",
              value: 0,
            },
            {
              label: "已支付",
              value: 1,
            },
          ],
        },
        {
          label: "下单时间",
          type: "datePicker",
          model: "createDatetime",
        },
      ],
      searchBtn: [
        {
          type: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search",
        },
      ],
      statusDialog: false, //修改支付状态对话框
      refundDialog: false, //退款对话框
      tablesLoading: false,
      statusForm: {
        cause: "",
        status: 1,
      }, //修改支付状态表单
      refundForm: {
        refundedPrice: "",
        cause: "",
        refundPrice: "",
        price: "",
      }, //退款表单
      refundRules: {
        refundPrice: [
          { required: true, message: "请输入退款金额", trigger: "blur" },
        ],
        cause: [{ required: true, message: "请输入退款原因", trigger: "blur" }],
      }, //退款表单验证规则
      statusRules: {
        cause: [{ required: true, message: "请输入修改备注", trigger: "blur" }],
      }, //修改支付状态验证规则
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData(
      query = {
        pageNum: this.pagination.num,
        pageSize: this.pagination.size,
        ...this.searchData,
      }
    ) {
      try {
        this.tablesLoading = true;
        const { data } = await orderQuery(query);
        this.tableData = data.value.list;
        this.pagination.total = data.value.total;
      } finally {
        this.tablesLoading = false;
      }
    },

    // 打开修改支付状态对话框
    changeStatus(row) {
      this.statusDialog = true;
      // 记录id
      this.id = row.id;
    },

    // 打开退款对话框
    async handleRefund(row) {
      this.refundDialog = true;
      // 记录id
      this.id = row.id;
      // 获取到订单金额及已退金额
      const { data } = await refundPrice({ id: row.id });
      this.refundForm.refundedPrice = data.value.refundPrice;
      this.refundForm.price = row.price;
    },

    // 确认退款
    refundSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const { refundPrice, cause } = this[formName];
            await refund({
              id: this.id,
              refundPrice: parseFloat(refundPrice) * 100,
              cause,
            });
            this.$message.success("退款成功");
            this.refundDialog = false;
            this.getTableData();
          } catch (err) {}
        } else {
          return false;
        }
      });
    },

    // 确认修改支付状态
    statusSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await changeOrderStatus({ id: this.id, cause: this[formName].cause });
          this.$message.success("修改支付状态成功");
          this.statusDialog = false;
          this.getTableData();
        } else {
          return false;
        }
      });
    },

    // 关闭对话框
    dialogClose(formName) {
      // 重置验证
      this.$refs[formName].resetFields();
    },

    // 查询
    query(searchData) {

      if (!_.isEqual(searchData, this.searchData) ) {
        this.pagination.num = 1;
      }
      //将searchData中的时间数组转换为后台需要的字符串格式
      if (searchData.createDatetime) {
        const [ createStartDatetime, createEndDatetime] = searchData.createDatetime
        this.searchData = { ...searchData, createStartDatetime, createEndDatetime };
      }else{
        this.searchData = { ...searchData }
      }
      this.getTableData();
    },
  },
};
</script>

<style>
</style>