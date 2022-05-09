<template>
  <div>
    <div class="head-container">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
    </div>
    <div class="treeDiv">
      <el-tree
        ref="tree"
        :data="treeData"
        class="filter-tree"
        node-key="id"
        :default-expanded-keys="['0']"
        :props="defaultProps"
        :expand-on-click-node="true"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ node, data}" class="span-ellipsis">
          <span v-if="data.categoryType === '88'" :title="data.categoryName">{{ data.categoryName }}
          </span>
          <span v-if="data.categoryType !== '88'" :title="data.categoryName"><svg-icon icon-class="folder_open" class="" />{{ data.categoryName }}
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
  import crudIndCategory from '../../../api/indicators/indCategory'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '指标分类',
    url: crudIndCategory.url,
    sort: 'id,desc',
    crudMethod: { ...crudIndCategory.crud }
  })
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
    components: { pagination, crudOperation, rrOperation, udOperation },
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
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
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
        crudIndCategory.treeByTable('0').then(res => {
          this.treeData[0].children = res.data
          console.log(this.treeData, 'treeDate')
        }).catch(() => {
          console.log('')
        })
      },
      // 刷新左侧树状列表的方法
      refresh() {
        console.log('测试一下')
      }
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

  .treeDiv {
    height: 470px;
    width: 170px;
    overflow: auto;
    font-size: 12px;
    overflow-x: auto;
  }
  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }
</style>
