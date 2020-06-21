<template>
  <div>
    <priceSets
      :dataArr="dataArr"
      @addPriceSetFn="addPriceSetFn"
      @deleteDateFn="deleteDateFn"
      @submitFn="submitFn"
      @cancelFn="getDefaultInfoFn"
    ></priceSets>
  </div>
</template>

<script>
export default {
  name: "price-set-manage",
  data() {
    return {
      apiQuery: "/videomis/priceConfig/query",
      apiAdd: "/videomis/priceConfig/add",
      apiDel: "/videomis/priceConfig/delete",
      sign: "pricesetmanage",
      dataArr: [],
      oldArrLength: "",
      newArrLength: ""
    };
  },
  mounted() {
    this.$store.state.pageNumParam = 1;
    this.getDefaultInfoFn();
  },
  methods: {
    getDefaultInfoFn() {
      this.$axios({
        method: "get",
        url: this.apiQuery,
        data: {}
      }).then(res => {
        if (res.data.resultStatus.resultCode === "0000") {
          this.dataArr = [...res.data.value];
          this.newArrLength = this.oldArrLength;
        } else {
          this.$message.warning(res.data.resultStatus.resultMessage);
        }
      });
    },

    //暂时性的新增，并未提交新增数据的事件
    addPriceSetFn() {
      var lentgth = this.dataArr.length;
      this.oldArrLength = lentgth;
      if (lentgth < 10) {
        var item = this.dataArr[lentgth - 1];
        if (item.minTime == "" || item.maxTime == "" || item.price == "") {
          this.$message.warning("请先提交此条价格配置信息");
        } else {
          this.dataArr.push({
            minTime: "",
            maxTime: "",
            price: "",
            flag: 2
          });
          this.newArrLength = this.oldArrLength + 1;
        }
      } else {
        this.$message.warning("最多配置10条价格数据");
      }
    },

    //当删除数据提交后台成功后，在调用次函数，在页面上显示删除
    deletePageFn(index) {
      // alert(index)
      let dataArrCopy = [];
      var length = this.dataArr.length;
      for (let i = 0; i < length; i++) {
        if (index != i) {
          dataArrCopy.push(this.dataArr[i]);
        }
      }

      if (this.dataArr.length > 1) {
        this.dataArr = [...dataArrCopy];
      } else {
        this.$message.warning("至少要保留一条价格配置数据");
      }
      this.oldArrLength = dataArrCopy.length;
      this.newArrLength = dataArrCopy.length;
    },

    //提交删除数据到后台
    deleteDateFn(n, m) {
      // console.log('n与m',n,m)
      if (m == "" || m == undefined) {
        this.deletePageFn(n);
      } else {
        this.$confirm("确定删除此价格配置吗?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.$axios({
              method: "get",
              url: this.apiDel + "?id=" + m,
              data: {}
            }).then(res => {
              if (res.data.resultStatus.resultCode === "0000") {
                this.$message.success("删除成功");
                this.deletePageFn(n);
              } else {
                this.$message.warning(res.data.resultStatus.resultMessage);
              }
            });
          })
          .catch(() => {
            this.$message.warning("本次操作已取消");
          });
      }
    },

    //新增或者删除以后，确认提交当前数据的事件
    submitFn() {
      if (this.newArrLength > this.oldArrLength) {
        let allParams = this.dataArr[this.dataArr.length - 1];
        if (allParams.minTime == "") {
          this.$message.warning("请输入最小时间配置");
        } else if (allParams.maxTime == "") {
          this.$message.warning("请输入最大时间配置");
        } else if (allParams.price == "") {
          this.$message.warning("请输入价格配置");
        } else {
          allParams.price = allParams.price * 100;
          this.$axios({
            method: "post",
            url: this.apiAdd,
            data: allParams
          }).then(res => {
            if (res.data.resultStatus.resultCode === "0000") {
              this.$message.success("新增成功");
              this.oldArrLength = this.newArrLength;
              this.getDefaultInfoFn();
            } else {
              this.$message.warning(res.data.resultStatus.resultMessage);
              allParams.price = allParams.price / 100;
            }
          });
        }
      }
    }
  }
};
</script>

<style scoped>
</style>
