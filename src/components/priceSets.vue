<template>
  <div class="price_set_box">
    <div class="price_head">
      <span>价格配置</span>
    </div>
    <div class="price_body">
      <div class="line_style" v-for="(item,index) in dataArr" :key="index">
        <div class="template1">
          <span class="long_span">视频时长大于</span>
          <el-input v-model="item.minTime" placeholder="请输入内容" v-bind:disabled="item.flag == 1"></el-input>
          <span class="short_span">秒，</span>
          <span class="long_span">小于或等于</span>
          <el-input v-model="item.maxTime" placeholder="请输入内容" v-bind:disabled="item.flag == 1"></el-input>
          <span class="short_span">秒，</span>
          <span class="short_span">售价</span>
          <el-input v-model="item.price" placeholder="请输入内容" v-bind:disabled="item.flag == 1"></el-input>
          <span class="short_span">元</span>
        </div>
        <div>
          <el-button type="danger" v-if="index==0" style="opacity: 0">删除</el-button>
          <el-button type="danger" @click="deleteDateFn(index,item.id)" v-if="index!=0">删除</el-button>
        </div>
      </div>

      <div class="add_price_btn my_hover" @click="addPriceSetFn">
        <span style="color: blue">点击添加价格配置</span>
        <el-popover placement="right-start" title="价格配置说明" width="300" trigger="hover">
          <span>1：</span>
          <span style="color:red;font-size:16px">
            <b>价格配置添加之后不能够被更改</b>
          </span>
          <br />
          <span>2：</span>
          <span style="color:red;font-size:16px">
            <b>添加一条价格配置必需提交一次</b>
          </span>
          <br />
          <span>3：</span>
          <span style="color:red;font-size:16px">
            <b>价格配置信息中时间不能够重叠</b>
          </span>
          <i class="el-icon-info" slot="reference"></i>
        </el-popover>
      </div>
      <div class="price_footer">
        <el-button @click="cancelFn">重置</el-button>
        <el-button type="primary" @click="submitFn">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "price-sets",
  data() {
    return {
      // dataArr:[
      //   {
      //     time1:'5',
      //     time2:'10',
      //     price:'18'
      //   },
      //   {
      //     time1:'15',
      //     time2:'30',
      //     price:'25'
      //   },
      //   {
      //     time1:'115',
      //     time2:'300',
      //     price:'205'
      //   },
      // ],
    };
  },
  props: ["dataArr"],
  mounted() {},
  methods: {
    addPriceSetFn() {
      this.$emit("addPriceSetFn");
    },
    deleteDateFn(n, m) {
      this.$emit("deleteDateFn", n, m);
    },
    //取消更改，回到页面最初数据
    cancelFn() {
      this.$emit("cancelFn");
    },
    submitFn() {
      this.$emit("submitFn");
    }
  },
  computed: {
    isdisabledFn() {
      if (后台传过来的数据 != null) {
        return (this.isdisabled = false);
      } else {
        return (this.isdisabled = true);
      }
    }
  }
};
</script>

<style scoped>
.price_set_box {
  border: 1px solid lightgrey;
  height: 8rem;
  min-height: 400px;
}

.price_set_box > div {
  /*border: 1px solid green;*/
}

.price_head {
  font-size: 0.24rem;
  /*font-weight: bold;*/
  text-align: left;
}

.line_style {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template1 {
  border: 1px solid #999;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  flex-grow: 1;
}

.long_span {
  width: 1.2rem;
  min-width: 80px;
  padding: 5px 20px;
}

.short_span {
  width: 0.4rem;
  min-width: 40px;
  padding: 5px 20px;
}

.add_price_btn {
  /*border:1px solid red;*/
  font-size: 16px;
  color: #fa8819;
}

.price_footer {
  margin-top: 0.8rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
