<template>
  <el-card class="dashboard">
    <div class="header">
      <div
        class="count-card"
        v-for="(item, index) in countCard"
        :key="index"
      >
        <div class="icon">
          <img :src="require(`../../assets/images/${item.icon}`)" alt="">
        </div>
        <div class="data">
          <div class="value">
            <span>{{item.value}}</span>
          </div>
          <div class="desc">
            <span>{{item.desc}}</span>
            <span class="unit">单位:{{item.unit}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="day-data"> 
        
    </div>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      countCard: [
        {
          icon: "1.png",
          value: "999",
          desc: "代理商总数",
          unit: "个",
        },
        {
          icon: "2.png",
          value: "999",
          desc: "用户总数",
          unit: "个",
        },
        {
          icon: "3.png",
          value: "999",
          desc: "下单总数",
          unit: "个",
        },
        {
          icon: "4.png",
          value: "999",
          desc: "支付总单数",
          unit: "个",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.dashboard {
  .header {
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(4, 1fr);

    .count-card {
      display:flex;
      height: 125px;
      align-items:center;
      border-radius: 6px;

      .icon{
        text-align: center;
        flex:1;
      }

      .data{
        // display:grid;
        // grid-template-rows: repeat(2, 1fr);
        // row-gap: 20px;
        flex:2;

        .value{
          color:#fff;
          font-size:36px;
        }

        .desc{
          color:#fff;
          font-size:18px;
          display: flex;
          align-items:flex-end;
          margin-top:10px;
          
          .unit{
            font-size:14px;
            margin-left:30px;
            // align-self: flex-end;
            // vertical-align: middle;
          }

        }
      }

      // 渐变色
      &:nth-child(1) {
        background: linear-gradient(-48deg, #686dcb, #464a9e);
      }
      &:nth-child(2) {
        background: linear-gradient(-48deg, #7697f4, #4d7cfe);
      }
      &:nth-child(3) {
        background: linear-gradient(-48deg, #59e4a1, #24d17e);
      }
      &:nth-child(4) {
        background: linear-gradient(-48deg, #7dc7f4, #3ab4ff);
      }
    }
  }
}
</style>