<!--维度树-->
<template>
  <div class="dimCategory-container">
    <el-scrollbar class="el-tree treeScroll">
      <el-tree
          ref="tree"
          :data="treeData"
          node-key="id"
          :default-expanded-keys="['0','1']"
          :props="defaultProps"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
      >
        <span slot-scope="{ node, data }" class="span-ellipsis">
          <span class="node-span" :title="data.categoryName"><svg-icon icon-class="folder_open" class=""/>{{ data.categoryName }}</span>
          <span align="right">
            <el-tooltip v-if="data.dimLevel < 5" class="item" effect="dark"  placement="top-start">
              <div slot="content">{{data.dimLevel == 0 ? '新增分类' : (data.dimLevel == 1 ? '新增维度名' : '新增维度值' )}}</div>
              <el-button
                         type="text"
                         icon="el-icon-circle-plus-outline"
                         @click="() => handleAdd(data)"
              />
            </el-tooltip>

            <el-tooltip v-if="data.dimLevel != 0" class="item" effect="dark" placement="top-start">
              <div slot="content">{{data.dimLevel == 1 ? '修改分类' : (data.dimLevel == 2 ? '修改维度名' : '修改维度值' )}}</div>
              <el-button
                         type="text"
                         icon="el-icon-edit-outline"
                         @click="() => handleEdit(data)"
              />
            </el-tooltip>

            <el-tooltip v-if="data.id != '0'" class="item" effect="dark" placement="top-start">
              <div slot="content">{{data.dimLevel == 1 ? '删除分类' : (data.dimLevel == 2 ? '删除维度名' : '删除维度值' )}}</div>
              <el-button
                         type="text"
                         icon="el-icon-remove-outline"
                         @click="() => handleRemove(node, data)"
              />
            </el-tooltip>
          </span>
        </span>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'dimCategory',
  props: {
    type: { type: String, default: '1' },
    parentId: { type: String, default: '0' }
  },
  dicts: ['DIMENSION_CATEGORY'],
  data() {
    return {
      defaultProps: { children: 'children', label: 'name' },
      treeData: [{ id: '0', categoryType: this.type, categoryName: '维度分类', children: [], dimLevel: 0 }],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 点击事件
    handleNodeClick(data) {
      this.$emit('node-click', data)
    },
    handleAdd(data) {
      this.$emit('handleAdd', data)
    },
    handleEdit(data) {
      this.$emit('handleEdit', data)
    },
    handleRemove(node, data) {
      this.$emit('handleRemove', data)
    },
    init() {
    }
  }
}
</script>

<style>
.dimCategory-container .span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /*font-family: 微软雅黑;*/
  font-size: 12px;
  padding-right: 8px;
}

.dimCategory-container .el-tree {
  min-width: 100%;
  display: inline-block !important;
}
.treeScroll{
  width:20px;
}
.node-span {
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
