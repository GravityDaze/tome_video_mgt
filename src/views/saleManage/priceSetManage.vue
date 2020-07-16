<template>
  <el-card>
    <tables
      :tableData="tableData"
      :tableCols="tableCols"
      :pagination="pagination"
      @sizeChange="sizeChange"
      @numChange="numChange"
      type="index"
    />
  </el-card>
</template>

<script>
import { queryPrinceConfig,addPrinceConfig,delPrinceConfig } from "@/api/management/saleManage";
import initPagination from "@/mixins/initPagination";
export default {
  mixins:[initPagination],
  name: "demand-manage",
  data() {
    return {
      tableCols: [
        {
          prop: "rule",
          label: "视频规则",
        },
        {
          label: "操作",
          type:"button",
          align: "center",
          width:"120",
          btnList:[
            {
              type:"danger",
              label:"删除",
               disabled:row => row.disabled
            }
          ]
        },
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
          icon: "el-icon-search",
         
        }
      ]
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      try {
        const { data } = await queryPrinceConfig();
        console.log(data)
        this.tableData = data.value.map( v=>{
          return{
            rule:`视频时长大于等于${v.maxTime}秒,小于等于${v.minTime}秒,售价${v.price}元`,
            disabled:v.id === 1
          }
        } )
        console.log(this.tableData)
      } catch (err) {
        console.log(err)
      }
    },
  }
};
</script>

