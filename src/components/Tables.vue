/* 
    通用表格组件
    Author:朱星杰
    Date:2020/7/1
*/

<template>
  <div class="tables" style="margin:20px 0">
    <el-table 
    border 
    :data="tableData" 
    style="width: 100%"
    row-key="id"
    lazy
    :load="load"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    >
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
            :disabled="item.disabled && item.disabled(scope.row)"
          ></el-switch>
          <!-- 按钮 -->
          <div v-else-if="item.type==='button'">
            <template  v-for="(btn,btnIndex) in item.btnList">
            <el-button
              :key="btnIndex"
              :type="btn.type"
              :icon="btn.icon"
              @click="btn.handle(scope.row)"
              size="small"
              v-if="!btn.show || btn.show(scope.row)"
              :disabled="!btn.disabled || btn.disabled(scope.row)"
            >{{btn.label}}</el-button>
            </template>
          </div>
          <!-- 弹出框 -->
          <el-popover v-else-if="item.type==='popover'" trigger="hover" placement="top">
            <p>{{scope.row[item.prop]}}</p>
          <div style="cursor:pointer" slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ item.title }}</el-tag>
          </div>
        </el-popover>
          <!-- 默认以文本方式显示 -->
          <span v-else>{{(item.formatter && item.formatter(scope.row)) || scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :hide-on-single-page="hideOnSinglePage"
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
    },
    hideOnSinglePage:{
      type:Boolean,
      default:false
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("numChange", val);
    },
    // 用于加载树形表格
    load(tree, treeNode, resolve){
      this.$emit('load',{tree,treeNode,resolve})
    },
  }
};
</script>