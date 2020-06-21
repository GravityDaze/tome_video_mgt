<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      size="small"
      height="592px"
      max-height="592px"
      tooltip-effect="dark"
      highlight-current-row
      @row-click="handleSelectionChange"
      :cell-style="cellStyle"
    >
      <el-table-column type="index" width="55"></el-table-column>

      <el-table-column
        label="用户编号"
        width="120"
        align="center"
        class="my_hover"
        v-if="isShowUserNum"
      >
        <template slot-scope="scope">
          <span
            class="my_hover"
            style="color: blue"
            @click="checkUserInfoFn(scope.row)"
          >{{ scope.row.no }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="模板编号"
        width="120"
        align="center"
        class="my_hover"
        v-if="isShowTemplateNum"
      >
        <template slot-scope="scope">
          <span
            class="my_hover"
            style="color: blue"
            @click="getTemplateInfoFn(scope.row)"
          >{{ scope.row.no }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="景区编号"
        width="120"
        align="center"
        class="my_hover"
        v-if="showSceneryNum"
      >
        <template slot-scope="scope">
          <span
            class="my_hover"
            style="color: blue"
            @click="gotoInfoPageFn(scope.row)"
          >{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <!--此处有两个景区编号，是由于有的编号返回参数的字段不一致而存在的，下面这个相对用的少-->
      <template v-for="item in tableTitle">
        <el-table-column
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :formatter="item.formatter"
          header-align="center"
        ></el-table-column>
      </template>

      <el-table-column label="封面图" align="center" width="100" v-if="isShowFacePic">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="left">
            <img :src="scope.row.coverUrl" style="width:150px;height:60px;margin: 0 auto" />
            <div slot="reference" class="name-wrapper">
              <!--<el-tag size="medium">{{ scope.row.name }}</el-tag>-->
              <el-tag size="medium">封面图</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <!-- 操作栏 -->
      <el-table-column label="操作" align="center" v-if="isShowOperation">
        <template slot-scope="scope">
          <!--  -->
          <el-button v-if="checkStatus === 0" @click="checkStart(scope.row)" size="small" type="text">开启审核</el-button>
          <el-button v-if="checkStatus === 1 || checkStatus === 0" @click="preview(scope.row)" size="small" type="text">预览</el-button>
          <el-button v-if="checkStatus === 1" @click="download(scope.row)" size="small" type="text">下载</el-button>
          <el-button v-if="checkStatus === 1" @click="upload(scope.row)" size="small" type="text">上传</el-button>
          <el-button v-if="checkStatus === 1" @click="checkPass(scope.row)" size="small" type="text">审核通过</el-button>
          <el-button v-if="checkStatus === 1" @click="checkRefuse(scope.row)" size="small" type="text">拒绝</el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="订单总笔数"
        width="120"
        align="center"
        class="my_hover"
        v-if="isShowOrderCount"
      >
        <template slot-scope="scope">
          <span
            class="my_hover"
            style="color: blue"
            @click="checkOrderInfoFn(scope.row)"
          >{{ scope.row.orderTotalNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="100" v-if="!isShowEnabled">
        <template slot-scope="scope">
          <span style="color: green" v-if="scope.row.status == 1">启用</span>
          <span style="color: red" v-if="scope.row.status == 0">禁用</span>
          <span style="color: blue" v-if="scope.row.status == 9">弃用</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="160" v-if="showHandle">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page_control" v-if="!showPagePlug1">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="$store.state.pageNumParam"
        :page-sizes="[ 5,10,50,100]"
        :page-size="$store.state.pageSizeParam"
        layout="total, sizes, prev, pager, next, jumper"
        :total="$store.state.totalParam"
      ></el-pagination>
    </div>

    <div class="page_control" v-if="showPagePlug1">
      <el-pagination
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="$store.state.pageNumParam2"
        :page-sizes="[ 5,10,50,100]"
        :page-size="$store.state.pageSizeParam2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="$store.state.totalParam2"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-tables",
  data() {
    return {};
  },
  props: [
    "tableTitle",
    "tableData",
    "isShowUserNum",
    "isShowTemplateNum",
    "showSceneryNum",
    "showState",
    "isShowEnabled",
    "isShowOrderCount",
    "isShowFacePic",
    "showHandle",
    "showPagePlug1",
    "isShowOperation", //是否显示操作
    "checkStatus", //当前审核状态

  ],
  methods: {
    //查看用户详情信息事件
    checkUserInfoFn(n) {
      this.$emit("getDefaultInfoFn2", n.id);
      // this.$store.state.userInfo = true
      this.$store.state.cutParam = 1;
    },
    //点击模板编号获取模板信息列表
    getTemplateInfoFn(n) {
      this.$emit("getTemplateInfoFn", n);
    },

    //点击列表内景区编号触发事件
    gotoInfoPageFn(n) {
      this.$emit("gotoInfoPageFn", n);
    },

    //查看订单详情页信息
    checkOrderInfoFn(n) {
      // console.log('我将触发显示订单详情页', n)

      this.$emit("getDefaultInfoFn2", n.id);
      // this.$store.state.orderInfo = true
      this.$store.state.orderInfoTitle =
        n.sceneryName + "(" + n.year + "-" + n.month + ")";
    },

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`, val);
      this.$store.state.pageNumParam = 1;
      this.$store.state.pageSizeParam = val;
      this.$emit("queryInfoFn");
    },

    handleSizeChange2(val) {
      // console.log(`每页 ${val} 条`, val);
      this.$store.state.pageNumParam2 = 1;
      this.$store.state.pageSizeParam2 = val;
      this.$emit("queryInfoFn2");
    },
    //当前页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.$store.state.pageNumParam = val;
      this.$emit("queryInfoFn");
    },
    handleCurrentChange2(val) {
      // console.log(`当前页: ${val}`);
      this.$store.state.pageNumParam2 = val;
      this.$emit("queryInfoFn2");
    },

    handleEdit(index, row) {
      // console.log('A2要开始删除了', index, row);
    },

    handleDel(index, row) {
      // console.log('A2要开始删除了', index, row);
    },

    handleSelectionChange(val) {
      if (!this.showPagePlug1) {
        // console.log('当前行被点击了', val)
        this.$emit("chooseInfo", val);
      } else {
        // alert('点击获取的是+++二级列表行信息')
        this.$emit("chooseInfoX", val);
      }
    },
    // 开启视频审核
    checkStart(row){
      this.$emit('checkStart',{id:row.id})
    },
    // 下载视频
    download(row){
      this.$emit('download',{ url:row.url,name:row.name }) 
    },
    // 预览视频
    preview(row){
       this.$emit('preview',{ url:row.url }) 
    },
    // 上传视频
    upload(row){
      this.$emit('upload',{id:row.id})
    },
    // 审核通过
    checkPass(row){
      this.$emit('checkPass',{id:row.id,statusUpload:row.statusUpload})
    },
    // 审核不通过
    checkRefuse(row){
      this.$emit('checkRefuse',{id:row.id})
    },


    //单独控制具体某个表格单元格的样式，根据此表格的内容的不同，显示不同颜色字体
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === "过期状态" && row.row.status == "1") {
        return "color:green;";
      } else if (row.column.label === "过期状态") {
        return "color:red;";
      }

      if (row.column.label === "订单状态" && row.row.orderState == "0") {
        return "color:red;";
      } else if (row.column.label === "订单状态" && row.row.status == "0") {
        return "color:red;";
      } else if (
        row.column.label === "订单状态" &&
        row.row.orderPayStatus == "0"
      ) {
        return "color:red;";
      } else if (row.column.label === "订单状态") {
        return "color:green;";
      }

      if (row.column.label === "支付状态" && row.row.payState == "0") {
        return "color:red;";
      } else if (row.column.label === "支付状态" && row.row.payStatus == "0") {
        return "color:red;";
      } else if (row.column.label === "支付状态") {
        return "color:green;";
      }

      if (row.column.label === "是否可编辑" && row.row.edit == "0") {
        return "color:red;";
      } else if (row.column.label === "是否可编辑") {
        return "color:green;";
      }

      if (row.column.label === "状态（视频）" && row.row.tripStatus == "0") {
        return "color:red;";
      } else if (row.column.label === "状态（视频）") {
        return "color:green;";
      }
    }
  }
};
</script>

<style scoped>
.page_control {
  margin-top: 10px;
}
</style>
