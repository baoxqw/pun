<template>
  <div>
    <div class="head-container">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
    </div>
    <div>
      <el-scrollbar style="height:100%;width: 100%">
        <el-tree
          ref="tree"
          :data="treeData"
          node-key="id"
          :default-expand-all="true"
          :props="defaultProps"
          :expand-on-click-node="true"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
        <span slot-scope="{ node, data}" class="span-ellipsis">
          <span v-if="data.categoryType === '88'" :title="data.categoryName">{{ data.categoryName }}
          </span>
          <span v-if="data.categoryType !== '88'" :title="data.categoryName"><svg-icon icon-class="folder_open"
                                                                                       class=""/>{{ data.categoryName }}
          </span>
        </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import crudIndCategory from '../../../api/indicators/indCategory'
  const defaultForm = {
    id: null,
    categoryType: null,
    categoryName: null,
    categoryDesc: null,
    parentId: null,
    crtUserCode: null,
    crtOrgCode: null,
    crtDate: null,
    updUserCode: null,
    updOrgCode: null,
    updDate: null
  }
  export default {
    name: 'IndCategory',
    /* components: { pagination, crudOperation, rrOperation, udOperation }, */
    props: {
      type: { type: String, default: '1' },
      parentId: { type: String, default: '0' }
    },
    // mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        filterText: '',
        defaultProps: { children: 'children', categoryName: 'categoryName' },
        treeData: [
          { id: '1', categoryType: '1', categoryName: '原子指标', children: [] }
        ],
        permission: {
          add: ['admin', 'indCategory:add'],
          edit: ['admin', 'indCategory:edit'],
          del: ['admin', 'indCategory:del']
        },
        rules: {}
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    mounted() {
      // console.log('=====category---mounted....')
      this.init()
    },
    methods: {
      // 获取数据前设置好接口地址
      /* [CRUD.HOOK.beforeRefresh]() {
         return true
       },*/
      filterNode(value, treeData) {
        if (!value) return true
        return treeData.categoryName.indexOf(value) !== -1
      },
      // 点击事件
      handleNodeClick(data) {
        this.$emit('node-click', data)
      },
      init() {
        // 查询原子指标分类+信息
        crudIndCategory.treeInfo('0', this.parentId).then(res => {
          this.treeData[0].children = res.data
          console.log(this.treeData, 'treeDate')
        }).catch(() => {
          // console.log('')
        })
      }
      // 刷新左侧树状列表的方法
      /* refresh() {
        console.log('测试一下')
      }*/
    }
  }
</script>

<style scoped>
  .span-ellipsis {
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

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }
</style>
