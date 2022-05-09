<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
    </div>
    <div>
      <el-scrollbar style="height:400px;width: 100px" class="el-tree treeScroll">
        <el-tree
          ref="tree"
          :data="treeData"
          node-key="id"
          :default-expanded-keys="['1']"
          :props="defaultProps"
          :expand-on-click-node="true"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
        <span slot-scope="{ node, data}" class="span-ellipsis">

          <span v-if="data.categoryType === '88'" :title="data.dimName">{{ data.categoryName }}
          </span>
          <span v-if="data.categoryType !== '88'" :title="data.categoryName"><svg-icon
            icon-class="folder_open"
            class=""
          />{{ data.categoryName
          }}
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
    // components: {pagination, crudOperation, rrOperation, udOperation},
    props: {
      type: { type: String, default: '1' },
      parentId: { type: String, default: '0' }
    },
    // mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        filterText: '',
        defaultProps: { children: 'children', label: 'name' },
        treeData: [
          { id: '1', categoryType: '1', categoryName: '基础指标', children: [] },
          { id: '2', categoryType: '2', categoryName: '衍生指标', children: [] },
          { id: '3', categoryType: '9', categoryName: '参数', children: [] }
        ],
        permission: {
          add: ['admin', 'indCategory:add'],
          edit: ['admin', 'indCategory:edit'],
          del: ['admin', 'indCategory:del']
        },
        rules: {
          id: [
            { required: true, message: '分类ID不能为空', trigger: 'blur' }
          ]
        }
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
        if (this.type == 0) {
          // 查询基础指标分类+信息
          crudIndCategory.treeInfo('1', this.parentId).then(res => {
            this.treeData[0].children = res.data
          }).catch(() => {
            console.log('')
          })
          // 查询衍生指标分类+信息
          crudIndCategory.treeInfo('2', this.parentId).then(res => {
            this.treeData[1].children = res.data
          }).catch(() => {
            console.log('')
          })
          // 查询参数分类+信息
          crudIndCategory.treeInfo('9', this.parentId).then(res => {
            this.treeData[2].children = res.data
          }).catch(() => {
            console.log('')
          })
        } else if (this.type == 1) {
          this.treeData = [{ id: '1', categoryType: '1', categoryName: '基础指标', children: [] }]
          // 查询基础指标分类+信息
          crudIndCategory.treeInfo('1', this.parentId).then(res => {
            this.treeData[0].children = res.data
          }).catch(() => {
            console.log('')
          })
        } else if (this.type == 2) {
          this.treeData = [{ id: '1', categoryType: '2', categoryName: '衍生指标', children: [] }]
          // 查询衍生指标分类+信息
          crudIndCategory.treeInfo('2', this.parentId).then(res => {
            this.treeData[0].children = res.data
          }).catch(() => {
            console.log('')
          })
        }
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
   /* font-family: 微软雅黑;*/
    font-size: 12px;
    padding-right: 8px;
  }

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }
</style>
