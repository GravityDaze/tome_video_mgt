/* 
    通用表格组件
    Author:朱星杰
    Date:2020/7/1
*/

<template>
  <div class="tables" style="margin:20px 0">
    <el-table  border :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(item,index) in tableCols"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :align="item.align"
        :formatter="item.formatter"
      >
        <template slot-scope="scope">
          <!-- 开关 -->
          <el-switch
            v-model="scope.row[item.prop]"
            v-if="item.type==='switch'"
            @change="item.change && item.change(scope.row)"
          ></el-switch>
          <!-- 按钮 -->
          <div v-else-if="item.type==='button'">
            <el-button
              v-for="(btn,btnIndex) in item.btnList"
              :key="btnIndex"
              :type="btn.type"
              :icon="btn.icon"
              @click="btn.handle(scope.row)"
              size="small"
            >{{btn.label}}</el-button>
          </div>
          <!-- 默认以文本方式显示 -->
          <span v-else>{{(item.formatter && item.formatter(scope.row)) || scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      style="margin-top:20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.num"
      :page-sizes="[5, 8, 10, 20]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total.sync="pagination.total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    tableCols: {
      type: Array,
      default() {
        return [];
      }
    },
    tools: {
      type: Boolean,
      default: true
    },
    toolsData: {
      type: Array,
      default() {
        return [];
      }
    },
    pagination: {
      type: Object,
      default() {
        return {
          total: 20,
          size: 10,
          num: 1
        };
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("numChange", val);
    }
  }
};
</script>

<style lang="less">
.tables{
  // border-top: 1px solid lightgrey;
}
</style>