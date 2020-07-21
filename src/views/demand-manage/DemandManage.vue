<template>
  <el-card>
    <searchs @query="query" :formData="formData" :searchBtn="searchBtn" />
    <tables
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
    />
  </el-card>
</template>

<script>
import { queryDemand } from "@/api/management/demandManage";
import initPagination from "@/mixins/initPagination";
export default {
  mixins:[initPagination],
  name: "demand-manage",
  data() {
    return {
      tableCols: [
        {
          prop: "no",
          label: "需求编号",
          align: "center"
        },
        {
          prop: "sceneryName",
          label: "所属景区",
          align: "center"
        },
        {
          prop: "nickName",
          label: "用户昵称",
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
          align: "center",
          formatter: row => (row.type === 1 ? "标准制作" : "定制合成")
        },
        {
          prop: "status",
          label: "需求状态",
          align: "center",
          type:"tag",
          tag: row=>{ 
            switch (row.status) {
              case 0:
                return 'warning';
                break;
              case 1:
                 return '';
                break;
              case 2:
               return 'success';
                break;
              default:
                 return 'danger';
            }
           },
          formatter: row => {
            switch (row.status) {
              case 0:
                return "等待合成";
                break;
              case 1:
                return "正在合成";
                break;
              case 2:
                return "合成成功";
                break;
              default:
                return "合成失败";
            }
          }
        },
        {
          prop: "commitStatus",
          label: "推送通知",
          align: "center",
          formatter: row => row.commitStatus === 1 ? "已提交" : "未提交"
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
          align: "center"
        }
      ],
      formData: [
        {
          type: "input",
          label: "所属景区",
          model: "sceneryName",
          placeholder: "请输入景区名称"
        },
        {
          type: "input",
          label: "用户昵称",
          model: "nickName",
          placeholder: "请输入用户昵称"
        },
        {
          label: "提交时间",
          type: "datePicker",
          model: "createDatetime"
        },
        {
          label: "需求类型",
          type: "select",
          model: "type",
          options: [
            {
              label: "全部",
              value: undefined
            },
            {
              label: "标准制作",
              value: 1
            },
            {
              label: "定制合成",
              value: 2
            }
          ]
        },
        {
          type: "select",
          label: "需求状态",
          model: "status",
          options: [
            {
              label: "全部",
              value: undefined
            },
            {
              label: "等待合成",
              value: 0
            },
            {
              label: "正在合成",
              value: 1
            },
            {
              label: "合成成功",
              value: 2
            },
            {
              label: "合成失败",
              value: 3
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
      ]
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
        const { data } = await queryDemand(query);
        this.tableData = data.value.list;
        this.pagination.total = data.value.total;
      } catch (err) {}
    },

    // 按钮查询
    query(searchData) {
      if (_.isEmpty(searchData)) return this.$message.warning("无效的查询");
      // 将searchData中的时间数组转换为后台需要接收的格式
      if (searchData.createDatetime && searchData.createDatetime.length) {
        searchData.startDate = searchData.createDatetime[0];
        searchData.endDate = searchData.createDatetime[1];
        delete searchData.createDatetime;
      } else if (searchData.startDate || searchData.endDate) {
        delete searchData.startDate;
        delete searchData.endDate;
      }
      this.searchData = searchData;
      // 查询时,num默认从1开始
      this.pagination.num = 1;
      this.getTableData();
    },
  }
};
</script>

