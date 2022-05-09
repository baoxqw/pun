<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边分类数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">
        <category type="1" @node-click="handleCategoryClick" />
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div>
            <!-- 搜索 -->
            <el-input
              v-model="query.ieCode"
              size="small"
              placeholder="指标编号"
              style="width: 200px;"
              class="filter-item"
              readonly
              @keyup.enter.native="crud.toQuery"
            />
            <el-input
              v-model="query.ieName"
              size="small"
              placeholder="指标名称"
              style="width: 200px;"
              class="filter-item"
              readonly
              @keyup.enter.native="crud.toQuery"
            />
            <el-date-picker
              v-model="query.periodDate"
              clearable
              size="small"
              placeholder="数据日期"
              type="date"
              class="filter-item"
              value-format="yyyyMMdd"
            />
            <rrOperation :crud="crud" />
          </div>
          <br>
          <!--表格渲染-->
          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            size="small"
            style="width: 100%;"
            @selection-change="crud.selectionChangeHandler"
          >
            <el-table-column v-if="columns.visible('periodDate')" prop="periodDate" label="数据日期" />
            <el-table-column
              v-for="item in crud.extdata.definition"
              v-if="columns.visible(item.key)"
              :prop="item.key"
              :label="item.value"
            />
            <el-table-column v-if="columns.visible('ieValue')" prop="ieValue" label="指标值" />
          </el-table>
          <!--分页组件-->
          <pagination />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import crudIndIndicatorResult from '../../../api/indicators/indIndicatorResult'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  // import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import category from '../category/categoryInfo'
  import { getYesterday } from '@eladmin/utils/data_format'

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '指标计算结果表',
    url: crudIndIndicatorResult.url,
    sort: 'id,desc',
    crudMethod: { ...crudIndIndicatorResult.crud },
    loading: false,
    queryOnPresenterCreated: false,
    query: {
      periodDate: getYesterday()
    }
  })
  export default {
    name: 'IndIndicatorResult',
    components: {
      pagination, crudOperation, rrOperation, category
    },
    mixins: [presenter(defaultCrud), header(), crud()],
    dicts: ['RETENTION', 'IE_TYPE', 'IE_STATUS'],
    data() {
      return {
        table: {
          columns: {}
        },
        permission: {
          add: [''],
          edit: [''],
          del: ['']
        }
      }
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        this.query.indicatorType = '1'
        return true
      },
      // 点击指标触发
      handleCategoryClick(data) {
        if (data.categoryType === '88') {
          // categoryDesc 指标编号
          this.query.ieCode = data.categoryDesc
          this.query.ieName = data.categoryName
          this.crud.refresh()
        }
      }
    }
  }
</script>

<style scoped>

</style>
