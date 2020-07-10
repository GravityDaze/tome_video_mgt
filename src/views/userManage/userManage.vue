<template>
  <el-card>
    <searchs @query="query" :formData="formData" :searchBtn="searchBtn" />
    <tables
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
      v-loading="loading"
    />

    <!-- 用户信息对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="用户信息"
      :visible.sync="customerDialog"
      append-to-body
      width="70%"
      @close="dialogClose"
    >
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane name="first" label="用户详情">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form ref="customerForm" :model="customerForm" label-width="120px">
                <el-form-item label="头像">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="customerForm.headUrl"
                    fit="cover"
                  ></el-image>
                </el-form-item>
                <el-form-item label="用户ID">
                  <span>{{customerForm.id}}</span>
                </el-form-item>
                <el-form-item label="昵称">
                  <span>{{customerForm.nickName}}</span>
                </el-form-item>
                <el-form-item label="注册时间">
                  <span>{{customerForm.createDatetime}}</span>
                </el-form-item>
                <el-form-item label="最后登录">
                  <span>{{customerForm.lastLoginDatetime}}</span>
                </el-form-item>
                <el-form-item label="openID">
                  <span>{{customerForm.openId}}</span>
                </el-form-item>
                <el-form-item label="交易总次数">
                  <span>{{customerForm.orderCount}}</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-form ref="customerForm" :model="customerForm" label-width="120px">
                <el-form-item label="人脸采集">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="customerForm.frontFace"
                    fit="cover"
                  ></el-image>
                </el-form-item>
                <el-form-item label="用户编号">
                  <span>{{customerForm.no}}</span>
                </el-form-item>
                <el-form-item label="性别">
                  <span>{{customerSex}}</span>
                </el-form-item>
                <el-form-item label="更新时间">
                  <span>{{customerForm.updateDatetime}}</span>
                </el-form-item>
                <el-form-item label="状态">
                  <span>{{customerForm.status === 0?'禁用':'启用'}}</span>
                </el-form-item>
                <el-form-item label="需求总数">
                  <span>{{customerForm.needCount}}</span>
                </el-form-item>
                <el-form-item label="交易总金额">
                  <span>{{customerForm.orderPrice}}</span>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="second" label="需求明细">
          <tables
            :tableData="demandData"
            :tableCols="demandCols"
            :pagination="demandPagination"
            @sizeChange="demandSizeChange"
            @numChange="demandNumChange"
          />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="customerDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  queryCustomer,
  enableCustomer,
  disableCustomer,
  queryCustomerInfo,
  queryCustomerDemand
} from "@/api/management/customerManage";
import initData from "@/mixins/initData";
export default {
  mixins: [initData],
  data() {
    return {
      tableCols: [
        {
          prop: "no",
          label: "用户编号",
          align: "center"
        },
        {
          prop: "nickName",
          label: "昵称",
          align: "center"
        },
        {
          prop: "sex",
          label: "性别",
          align: "center",
          formatter: row => {
            switch(row.sex){
              case 1:
                return '男'
                break
              case 2:
                return '女'
                break
              default:
                return '保密'
            }
          }
        },
        {
          prop: "registerIp",
          label: "注册IP",
          align: "center"
        },
        {
          prop: "lastLoginDatetime",
          label: "最后登录时间",
          align: "center"
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
          align: "center"
        },
        {
          prop: "status",
          label: "状态",
          align: "center",
          type: "switch",
          change: this.handleStatus
        },
        {
          type: "button",
          label: "操作",
          width: "80",
          align: "center",
          btnList: [
            {
              type: "primary",
              label: "查看",
              handle: this.checkCustomer
            }
          ]
        }
      ],
      formData: [
        {
          type: "input",
          label: "用户昵称",
          model: "nickName",
          placeholder: "请输入用户昵称"
        },
        {
          type: "datePicker",
          label: "注册时间",
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
          label: "查询",
          handle: this.query,
          icon: "el-icon-search"
        }
      ],
      customerDialog: false, //用户信息对话框
      demandData: [],
      demandCols: [
        {
          prop: "no",
          label: "需求编号",
          align: "center"
        },
        {
          prop: "sceneryNo",
          label: "景区编号",
          align: "center"
        },
        {
          prop: "sceneryName",
          label: "所属景区",
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "提交时间",
          align: "center"
        },
        {
          prop: "type",
          label: "需求类型",
          align: "center"
        },
        {
          prop: "status",
          label: "需求状态",
          align: "center"
        },
        {
          prop: "buyStatus",
          label: "交易状态",
          align: "center"
        },
        {
          prop: "times",
          label: "下载次数",
          align: "center"
        }
      ],
      demandPagination: {
        num: 1,
        size: 5,
        total: 0
      },
      activeName: "first",
      customerForm: {}, //用户详情表单
      loading:false
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
        ...this.searchForm
      }
    ) {
      this.loading = true
      try{
        const { data } = await queryCustomer(query);
      this.tableData = data.value.list.map(v => {
        // 将0和1转换为布尔值
        v.status = !!v.status;
        return v;
      });
      this.pagination.total = data.value.total;
      }finally{
        this.loading = false
      }
      
    },

    // 启用 & 禁用用户
    async handleStatus(row) {
      try {
        if (row.status) {
          await enableCustomer({ id: row.id });
          this.$message.success(`已启用用户：${row.nickName}`);
        } else {
          await disableCustomer({ id: row.id });
          this.$message.info(`已禁用用户：${row.nickName}`);
        }
      } catch (err) {
        // 错误时还原switch组件的状态
        row.status = !row.status;
      }
    },

    // 打开对话框
    checkCustomer({ id }) {
      this.id = id;
      this.customerDialog = true;
      this.getCustomerInfo();
      this.getDemandData();
    },

    // 查询用户详情
    async getCustomerInfo() {
      const { data } = await queryCustomerInfo({ id: this.id });
      this.customerForm = data.value;
    },

    // 查询用户需求明细
    async getDemandData(
      query = {
        id: this.id,
        pageNum: this.demandPagination.num,
        pageSize: this.demandPagination.size
      }
    ) {
      const { data } = await queryCustomerDemand(query);
      this.demandPagination.total = data.value.total;
      this.demandData = data.value.list;
    },

    // 需求详情分页
    demandSizeChange(val) {
      this.demandPagination.size = val;
    },

    demandNumChange(val) {
      this.demandPagination.num = val;
    },

    // 对话框关闭
    dialogClose() {
      this.activeName = "first";
      this.customerForm = {}
    },

    // 按钮查询
    query(searchForm) {
      if (_.isEmpty(searchForm)) return this.$message.warning("无效的查询");

      // 查询时 pageNum必须恢复为1
      this.searchForm = searchForm;
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getTableData();
    }
  },
  computed: {
    customerSex() {
      switch (this.customerForm.sex) {
        case 1:
          return "男";
          break;
        case 2:
          return "女";
          break;
        default:
          return "保密";
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-tabs {
  box-shadow: none;
}
</style>