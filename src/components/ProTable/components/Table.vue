<template>
  <el-table
    border
    :data="tableData"
    style="width: 100%"
    row-key="id"
    lazy
    :load="load"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    >
    <!-- 表格索引 -->
    <el-table-column v-if="type" :type="type" width="50"></el-table-column>
    <el-table-column
      v-for="(item, index) in tableCols"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      :align="item.align || 'center'"
      :formatter="item.formatter"
    >
      <template slot-scope="scope">
        <!-- 开关 -->
        <el-switch
          v-model="scope.row[item.prop]"
          v-if="item.type === 'switch'"
          @change="item.change && item.change(scope.row)"
          :disabled="item.disabled && item.disabled(scope.row)"
        ></el-switch>
        <!-- 按钮 -->
        <div v-else-if="item.type === 'button'">
          <template v-for="(btn, btnIndex) in item.btnList">
            <el-button
              :key="btnIndex"
              :type="btn.type"
              :icon="btn.icon"
              @click="btn.handle(scope.row)"
              size="small"
              v-if="!btn.show || btn.show(scope.row)"
              :disabled="(btn.disabled && btn.disabled(scope.row)) || false"
              >{{ btn.label }}</el-button
            >
          </template>
        </div>
        <!-- 图片 -->
        <el-image
          style="width: 100px"
          :preview-src-list="[scope.row[item.prop]]"
          v-else-if="item.type === 'img'"
          :src="scope.row[item.prop]"
        ></el-image>
        <!-- 弹出框 -->
        <el-popover
          v-else-if="item.type === 'popover'"
          trigger="hover"
          placement="top"
        >
          <p>{{ scope.row[item.prop] }}</p>
          <div style="cursor: pointer" slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ item.title }}</el-tag>
          </div>
        </el-popover>
        <!-- 标签 -->
        <div v-else-if="item.type === 'tag'">
          <el-tag
            size="medium"
            :type="(item.tagType && item.tagType(scope.row)) || ''"
            :effect="item.effect || 'light'"
            >{{
              (item.formatter && item.formatter(scope.row)) ||
              scope.row[item.prop]
            }}</el-tag
          >
        </div>
        <!-- 默认以文本方式显示 -->
        <span :style="item.style && item.style(scope.row)" v-else>{{
          (item.formatter && item.formatter(scope.row)) || scope.row[item.prop]
        }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    tableCols: {
      type: Array,
      default() {
        return [];
      },
    },
    type: {
      type: String,
    }
  },
   methods: {
    // 用于加载树形表格
    load(tree, treeNode, resolve) {
      this.$emit("load", { tree, treeNode, resolve });
    },
  },
};
</script>

<style>
</style>