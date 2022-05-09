<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"  v-show="false"/>
      <el-button
              :loading="crud.downloadLoading"
              :disabled="!crud.data.length"
              class="filter-item"
              type="success"
              icon="el-icon-download"
              @click="crud.doExport('download','批量指标结果数据')"
      >导出</el-button>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标编号">
            <el-input v-model="form.bizCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标名称">
            <el-input v-model="form.bizName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标类别(1-根指标，2-衍生指标，3-组合指标)">
            <el-input v-model="form.ieProp" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标编号">
            <el-input v-model="form.relaCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标名称">
            <el-input v-model="form.relaName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标类别(1-根指标，2-衍生指标，3-组合指标)">
            <el-input v-model="form.relaProp" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.crtUserCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建机构">
            <el-input v-model="form.crtOrgCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建日期">
            <el-input v-model="form.crtDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改人">
            <el-input v-model="form.updUserCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改机构">
            <el-input v-model="form.updOrgCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改日期">
            <el-input v-model="form.updDate" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="主键" />
        <el-table-column v-if="columns.visible('bizCode')" prop="bizCode" label="指标编号" />
        <el-table-column v-if="columns.visible('bizName')" prop="bizName" label="指标名称" />
        <el-table-column v-if="columns.visible('ieProp')" prop="ieProp" label="指标类别" >
        <template slot-scope="scope">
          {{ dict.label.IE_PROP[scope.row.ieProp] }}
        </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('relaCode')" prop="relaCode" label="关联指标编号" />
        <el-table-column v-if="columns.visible('relaName')" prop="relaName" label="关联指标名称" />
        <el-table-column v-if="columns.visible('relaProp')" prop="relaProp" label="关联指标类别" >
          <template slot-scope="scope">
            {{ dict.label.IE_PROP[scope.row.relaProp] }}
          </template>
        </el-table-column>
<!--        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />
        <el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建日期" />
        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人" />
        <el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="修改机构" />
        <el-table-column v-if="columns.visible('updDate')" prop="updDate" label="修改日期" />-->
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudIndAtomRelation from '../../../../api/indicators/indAtomRelation'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '指标关联关系', url: crudIndAtomRelation.url, sort: 'id,desc', crudMethod: { ...crudIndAtomRelation.crud }})
const defaultForm = { id: null, bizCode: null, bizName: null, ieProp: null, relaCode: null, relaName: null, relaProp: null, crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, updDate: null }
export default {
  name: 'IndAtomRelation',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['IE_PROP'],
  data() {
    return {
      permission: {
        add: ['admin', 'indAtomRelation:add'],
        edit: ['admin', 'indAtomRelation:edit'],
        del: ['admin', 'indAtomRelation:del']
      },
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ]
      }    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
