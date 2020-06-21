<template>
  <div>
    <mySearchs
      :sign="sign"
      :isAffiliatedScenery="isAffiliatedScenery"
      :isUserOpenId="isUserOpenId"
      :isUserNickName="isUserNickName"
      :isSubmitTime="isSubmitTime"
      :isDemandType="isDemandType"
      :isDemandState="isDemandState"
      @queryInfoFn="queryInfoFn"
    ></mySearchs>
    <myTables
      :sign="sign"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :isShowEnabled="isShowEnabled"
      @queryInfoFn="queryInfoFn"
    ></myTables>
  </div>
</template>

<script>
export default {
  name: "make-demand-manage",
  data() {
    return {
      apiQuery: "videomis/need/query",
      sign: "makedemandmanage",
      isAffiliatedScenery: true,
      isUserOpenId: false,
      isUserNickName: true,
      isSubmitTime: true,
      isDemandType: true,
      isDemandState: true,
      isShowEnabled: true,
      tableTitle: [
        {
          prop: "no",
          label: "需求编号",
          // width: '100',
          align: "center"
        },
        // {
        //   prop: 'sceneryNo',
        //   label: '景区编号',
        //   // width: '180',
        //   align: 'center'
        // },
        {
          prop: "sceneryName",
          label: "所属景区",
          // width: '180',
          align: "center"
        },
        // {
        //   prop: 'customerNo',
        //   label: '用户编号',
        //   // width: '180',
        //   align: 'center'
        // },
        // {
        //   prop: 'openId',
        //   label: '用户OpenId',
        //   // width: '180',
        //   align: 'center'
        // },
        {
          prop: "nickName",
          label: "用户昵称",
          // width: '180',
          align: "center"
        },
        {
          prop: "createDatetime",
          label: "提交时间",
          // width: '180',
          align: "center"
        },
        // {
        //   prop: 'fileName',
        //   label: '用户上传文件',
        //   // width: '180',
        //   align: 'center'
        // },
        {
          prop: "type",
          label: "需求类型",
          // width: '180',
          align: "center",
          formatter: function(row) {
            return row.type == "1" ? "标准制作" : "定制合成";
          }
        },
        {
          prop: "status",
          label: "需求状态",
          // width: '180',
          align: "center",
          formatter: function(row) {
            if (row.status == "0") {
              return (
                <span style="color: #CECECE;">
                  <b>等待合成</b>
                </span>
              );
            } else if (row.status == "1") {
              return (
                <span style="color: #FA8819;">
                  <b>正在合成</b>
                </span>
              );
            } else if (row.status == "2") {
              return (
                <span style="color: green;">
                  <b>合成成功</b>
                </span>
              );
            } else {
              return (
                <span style="color: red;">
                  <b>合成失败</b>
                </span>
              );
            }
          }
        },
        {
          prop: "commitStatus",
          label: "推送通知",
          // width: '180',
          align: "center",
          formatter: function(row) {
            return row.commitStatus == "1" ? "已提交" : "未提交";
          }
        },
        {
          prop: "updateDatetime",
          label: "最后更新时间",
          // width: '180',
          align: "center"
        }
      ],
      tableData: []
    };
  },
  mounted() {
    this.$store.state.pageNumParam = 1;
    this.getDefaultInfoFn();
  },
  methods: {
    getDefaultInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam,
          no: "",
          sceneryName: "",
          openId: "",
          "startDate ": "",
          "endDate ": "",
          type: "",
          status: "",
          nickName: ""
        }
      })
        .then(res => {
          // console.log('列表信息', res.data)
          if (res.data.resultStatus.resultCode === "0000") {
            if (res.data.value.list.length != "0") {
              this.tableData = [...res.data.value.list];
              this.$store.state.totalParam = res.data.value.total;
            } else {
              this.tableData = [];
              this.$store.state.totalParam = 0;
            }
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    },

    queryInfoFn() {
      this.$axios({
        method: "post",
        url: this.apiQuery,
        data: {
          pageNum: this.$store.state.pageNumParam,
          pageSize: this.$store.state.pageSizeParam,
          no: "", //
          sceneryName: this.$store.state.affiliatedSceneryParam,
          openId: this.$store.state.openIdParam,
          startDate: this.$store.state.startDateParam,
          endDate: this.$store.state.endDateParam,
          // "createDatetime ":this.$store.state.submitTimeParam,
          type: this.$store.state.needTypeParam,
          status: this.$store.state.needStateParam,
          nickName: this.$store.state.nickNameParam
        }
      })
        .then(res => {
          // console.log('查询按钮或者翻页按钮信息', res.data)
          if (res.data.resultStatus.resultCode === "0000") {
            if (res.data.value.list.length != "0") {
              this.tableData = [...res.data.value.list];
              this.$store.state.totalParam = res.data.value.total;
            } else {
              this.tableData = [];
              this.$store.state.totalParam = 0;
            }
          } else {
            this.$message.warning(res.data.resultStatus.resultMessage);
          }
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped>
</style>
