<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <el-input v-model="query.sysCode" clearable size="small" placeholder="系统编码" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />

      </div>
      <crudOperation :permission="permission" />

      <el-dialog :close-on-click-modal="false" append-to-body :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
          <el-form-item label="系统编码" prop="sysCode">
            <el-input v-model="form.sysCode" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="系统名称" prop="sysName">
            <el-input v-model="form.sysName" style="width: 200px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;height: 60%" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('sysCode')" prop="sysCode" label="系统编码" width="200px"/>
        <el-table-column v-if="columns.visible('sysName')" prop="sysName" label="系统名称"/> >
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建时间" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />

      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import apiAndSystemRelation from '../../../api/apiInfo/apiAndSystemRelation.js'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {getData2Api} from '../../../api/indicators/indIndicatorManual'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  // crud交由presenter持有
  const defaultCrud = CRUD({ title: '系统授权', url: apiAndSystemRelation.url, sort: 'id,desc', crudMethod: { ...apiAndSystemRelation.crud }})
  const defaultForm = {
    id: null,
    apiId: null,
    sysName: null,
    sysCode: null,
    crtUserCode: null,
    crtOrgCode: null,
    crtDate: null,
    updUserCode: null,
    updOrgCode: null,
    updDate: null }
  const bizNames={}
  const depts={}
  export default {
    name: 'apiAndSystemRelation',
    props:["msg"],
    components: { Treeselect,pagination, crudOperation, rrOperation, udOperation },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['IND_CURRENCY', 'IE_FREQUENCY'],

    data() {
      return {
        bizNames,
        permission: {
          add: ['admin', 'resultCheck:add'],
          edit: ['admin', 'resultCheck:edit'],
          del: ['admin', 'resultCheck:del']
        },
        rules: {
          sysCode: [
            { required: true, message: '系统编码不能为空', trigger: 'blur' }
          ],
          sysName: [
            { required: true, message: '系统名称不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    created() {
      this.form.apiId = this.msg
      console.log(this.form.apiId)
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        this.query.apiId = this.msg
        this.crud.optShow.del = true
        this.crud.optShow.add = true
        this.crud.optShow.edit = true
        return true
      },
      [CRUD.HOOK.beforeToAdd](){
        this.form.apiId = this.msg
      },
      forceUpdate(e){
        this.$forceUpdate(); //
      },

    }
  }
</script>

<style scoped>
  .el-upload{
    margin: 0px 2px 10px 0px;
    display: inline;
    vertical-align: middle;
  }
</style>
