<template>
  <el-card>
    <ProTable
      :formData="formData" 
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
      v-loading="tableLoading"
    />
  </el-card>
</template>

<script>
import { queryDemand } from "@/api/management/demandManage";
import initPagination from "@/mixins/initPagination";
export default {
  mixins: [initPagination],
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
          type:'tag',
          tagType: row => {
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
              case 4:
                return "用户取消"
              default:
                return "合成失败";
            }
          }
        },
        {
          prop: "commitStatus",
          label: "推送通知",
          align: "center",
          style: row => row.commitStatus === 1 ? {color:'green',fontWeight:'bold'} : {color:'grey'},
          formatter: row => (row.commitStatus === 1 ? "已提交" : "未提交")
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
        },
         {
          type:"button", 
          btnType: "primary",
          label: "查询",
          handle: this.query,
          icon: "el-icon-search"
        }
      ],
      tableLoading:false
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
        this.tableLoading = true
        const { data } = await queryDemand(query);
        this.tableData = data.value.list;
        this.pagination.total = data.value.total;
      } catch (err) {
        console.log(err)
      }
      finally{
        this.tableLoading = false
      }
    },

    // 按钮查询
    query(searchData) {
      if (!_.isEqual(searchData, this.searchData) ) {
        this.pagination.num = 1;
      }
      //将searchData中的时间数组转换为后台需要的字符串格式
      if (searchData.createDatetime) {
        const [ startDate, endDate] = searchData.createDatetime
        this.searchData = { ...searchData, startDate, endDate };
      }else{
        this.searchData = { ...searchData }
      }
      this.getTableData();
    }
  }
};
</script>

