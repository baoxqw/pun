<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边分类数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="">
          <category type="0" @node-click="handleCategoryClick" />
        </div>
      </el-col>
      <!--工具栏-->
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <div class="head-container">
          <div>
            <el-input
              v-model="form.bizCode"
              size="small"
              placeholder="指标编号"
              style="width: 200px;"
              class="filter-item"
              readonly
            />
            <el-input
              v-model="form.bizName"
              readonly
              size="small"
              placeholder="指标名称"
              style="width: 200px;"
              class="filter-item"
            />
            <!--<el-date-picker
            v-model="query.periodDate"
            size="small"
            type="daterange"
            class="filter-item"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />-->
            <el-date-picker
              v-model="query.periodDate"
              clearable
              size="small"
              placeholder="数据日期"
              type="date"
              class="filter-item"
              value-format="yyyyMMdd"
              @keyup.enter.native="crud.toQuery"
            />
            <rrOperation :crud="crud" />
          </div>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <!-- <crudOperation :permission="permission" />-->
          <!--表格渲染-->
          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            size="small"
            style="width: 100%;"
            @selection-change="crud.selectionChangeHandler"
          >
            <el-table-column
              v-for="item in crud.extdata.definition"
              :key="item.key"
              :v-if="columns.visible(item.key)"
              :prop="item.key"
              :label="item.value"
            />
          </el-table>
          <!--分页组件-->
          <pagination />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import crudIndIndicatorResult from '../../../api/indicators/indAtomResult'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import pagination from '@crud/Pagination'
  import category from '../category/categoryAtom'
  import { getYesterday } from '@eladmin/utils/data_format'
  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '指标计算结果表',
    url: crudIndIndicatorResult.url,
    sort: '',
    queryOnPresenterCreated: false,
    crudMethod: { ...crudIndIndicatorResult.crud },
    loading: false,
    query: {
      periodDate: getYesterday()
    }
  })
  const defaultForm = {
    id: null,
    ieId: null,
    bizCode: '',
    bizName: '',
    categoryId: null,
    parentId: null,
    ieType: '4',
    ieRule: null,
    ieValue: null,
    ieAdjustValue: null,
    iePlanValue: null,
    periodDate: null,
    objectCode: null,
    objectType: null,
    status: null,
    processInstanceId: null,
    retention: null,
    crtUserCode: null,
    crtOrgCode: null,
    crtDate: null,
    updUserCode: null,
    updOrgCode: null,
    updDate: null
  }
  export default {
    name: 'IndIndicatorResult',
    components: { pagination, rrOperation, category },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['RETENTION', 'IE_TYPE', 'IE_STATUS'],
    data() {
      return {
        // timeDefaultShow:'2020-07-01',  //在没有v-model的情况下，默认展示出来的日历时间是 23号
        periodDate1: null,
        table: {
          columns: {}
        },
        permission: {
          add: [''],
          edit: [''],
          del: ['']
        },
        showDialog: false,
        id: '',
        ieCode: ''
        /* rules: {
          ieId: [
            {required: true, message: '指标ID不能为空', trigger: 'blur'}
          ]
        }*/
      }
    },
    /* watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },*/
    methods: {
      /* filterNode(value, treeData) {
        if (!value) return true
        return treeData.label.indexOf(value) !== -1
      },*/
      handleCategoryClick(data) {
        /* this.crud.form.categoryId = data.id
        this.crud.query.categoryIds = data.childrenIds
        this.form.ieCode = data.id*/
        if (data.categoryType === '88') {
          this.crud.query.id = data.id
          this.crud.query.ieCode = data.id
          this.form.bizCode = data.id
          this.form.bizName = data.categoryName
          this.crud.refresh()
        }
      },
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
      [CRUD.HOOK.afterRefresh]() {
        // console.log('======afterRefresh====', this.crud.data)
      },
      viewHandle(row) {
        this.form = row
        this.showDialog = true
      }
    }
  }
</script>

<style scoped>
  .line {
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
</style>
