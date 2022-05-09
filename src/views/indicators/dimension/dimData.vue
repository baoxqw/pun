<template>
  <!-- 全维度查询 -->
  <el-dialog :close-on-click-modal="false" title="维度数据查询" :visible.sync="showAllDim" width="80%" @close="closeDialog">
    <div class="head-container">
      <el-select v-model="parentDimCode" filterable placeholder="筛选字段" style="width: 15%;" class="filter-item">
        <el-option
          v-for="item in filterValue"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-input v-model="typeCode" placeholder="代码" style="width: 15%;" class="filter-item" />
      <el-input v-model="typeName" placeholder="名称" style="width: 15%;" class="filter-item" />
      <!--<el-input v-model="dimLevel" placeholder="级别" style="width: 15%;" class="filter-item" />-->
      <el-button type="success" icon="el-icon-search" class="filter-item" @click="searchDimData">搜索</el-button>
      <el-button type="warning" icon="el-icon-refresh" class="filter-item" @click="resetQuery()">重置</el-button>
    </div>
    <div class="tableDiv">
      <el-table ref="table" :row-key="getRowKeys" :data="crud.data" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" default-expand-all border height="400" style="width:100%;margin-top: 0px;" :row-style="{height:'30px'}">
        <el-table-column label="代码" :show-overflow-tooltip="true" min-width="1" prop="typeCode" />
        <el-table-column label="名称" :show-overflow-tooltip="true" min-width="1" prop="typeName" />
        <!--<el-table-column label="筛选字段" :show-overflow-tooltip="true" min-width="1" prop="parentDimCode" />-->
        <!--<el-table-column label="级别" :show-overflow-tooltip="true" min-width="1" prop="dimLevel" />-->
        <!--<el-table-column label="父ID" :show-overflow-tooltip="true" min-width="1" prop="parentDimName" />-->
      </el-table>
      <div v-if="showPagination">
        <el-pagination
            :total="crud.page.total"
            style="margin-top: 8px;"
            layout="total"
          />
      </div>
      <div v-else><pagination /></div>
    </div>
  </el-dialog>
</template>

<script>
  import crudIndDimensionData, {getDimTree} from '../../../api/indicators/indDimensionData'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '维度公共数据',
    url: crudIndDimensionData.url,
    sort: 'id,desc',
    crudMethod: { ...crudIndDimensionData.crud }
  })
  const defaultForm = {
    id: null,
    typeCode: null,
    typeName: null,
    dimCode: null,
    dimName: null,
    dimLevel: null,
    parentDimCode: null,
    parentDimName: null,
    crtUserCode: null,
    crtOrgCode: null,
    crtDate: null,
    updUserCode: null,
    updOrgCode: null,
    updDate: null,
    tableName: null,
    columnDimCode: null,
    columnDimName: null,
    columnCodeColumn: null,
    columnNameColumn: null,
    columnDimLevel: null,
    columnFilterColumn: null,
    columnPid: null,
    queryFilter: null
  }
  export default {
    name: 'IndDimensionData',
    components: { pagination, crudOperation, rrOperation, udOperation },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        table: {
          columns: {
            id: 'hidden'
          }
        },
        showAllDim: false,
        showPagination: false,
        filterValue: [],
        parentDimCode: null,
        typeCode: null,
        typeName: null,
        dimLevel: null,
        tCode: null,
        tName: null
      }
    },
    created() {
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return false
      },
      getRowKeys: function(row) {
        if (row.children !== null) {
          return row.typeCode
        } else {
          return row.typeCode + String(Math.floor(Math.random()*10000))
        }
      },
      searchDimData() {
        const pid = this.query.columnPid
        if (pid === null || pid === '') {
           this.crud.page.page = 1
           CRUD.HOOK.beforeRefresh = true
           this.query.parentDimCode = this.parentDimCode
           this.query.typeCode = this.typeCode
           this.query.typeName = this.typeName
           this.query.dimLevel = this.dimLevel
           this.showPagination = false
           this.crud.refresh()
        } else {
          this.showPagination = true
          const params = {
            columnCodeColumn: this.query.columnCodeColumn,
            columnNameColumn: this.query.columnNameColumn,
            columnPid: this.query.columnPid,
            columnDimLevel: this.query.columnDimLevel,
            columnFilterColumn: this.query.columnFilterColumn,
            parentDimCode: this.parentDimCode,
            typeCode: this.typeCode,
            typeName: this.typeName,
            queryFilter: this.query.queryFilter,
            tableName: this.query.tableName,
          }
           getDimTree(params).then(data => {
             if (data.code === 0) {
               this.crud.data = data.data
               this.crud.page.total = data.data.length
             } else {
               this.$message.error({
                 message: '获取数据失败'
               })
             }
           })
        }
      },
      closeDialog() {
        this.typeCode = null
        this.typeName = null
        this.parentDimCode = null
        this.dimLevel = null
        this.filterValue = []
        this.crud.data = []
      },
      resetQuery() {
        this.typeCode = null
        this.typeName = null
        this.parentDimCode = null
        const pid = this.query.columnPid
        if (pid === null || pid === '') {
          this.crud.page.page = 1
          this.dimLevel = null
          this.query.typeCode = null
          this.query.typeName = null
          this.query.parentDimCode = null
          this.query.dimLevel = null
          // this.query.parentDimName = null
          this.showPagination = false
          this.crud.refresh()
        } else {
          this.showPagination = true
          const params = {
            columnCodeColumn: this.query.columnCodeColumn,
            columnNameColumn: this.query.columnNameColumn,
            columnPid: this.query.columnPid,
            columnDimLevel: this.query.columnDimLevel,
            columnFilterColumn: this.query.columnFilterColumn,
            parentDimCode: this.parentDimCode,
            queryFilter: this.query.queryFilter,
            tableName: this.query.tableName,
          }
          getDimTree(params).then(data => {
            if (data.code === 0) {
              this.crud.data = data.data
              this.crud.page.total = data.data.length
            } else {
              this.$message.error({
                message: '获取数据失败'
              })
            }
          })
        }


      }
    }
  }
</script>

<style scoped>
  .tableDiv {
    border: 1px solid #dfe6ec;
    overflow: auto;
    height: 452px;
    width: 100%;
    margin-top: 10px;
  }
</style>
