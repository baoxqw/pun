<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标编号" prop="bizCode">
            <el-input v-model="form.bizCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="维度编号">
            <el-input v-model="form.dimCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="form.subCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="代码描述">
            <el-input v-model="form.subDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="代码规则">
            <el-input v-model="form.subCond" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="规则描述">
            <el-input v-model="form.subCondDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
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
          <el-form-item label="租户">
            <el-input v-model="form.tenant" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('dimCode')" prop="dimCode" label="维度编号" />
        <el-table-column v-if="columns.visible('subCode')" prop="subCode" label="代码" />
        <el-table-column v-if="columns.visible('subDesc')" prop="subDesc" label="代码描述" />
        <el-table-column v-if="columns.visible('subCond')" prop="subCond" label="代码规则" />
        <el-table-column v-if="columns.visible('subCondDesc')" prop="subCondDesc" label="规则描述" />
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" />
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />
        <el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建日期" />
        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人" />
        <el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="修改机构" />
        <el-table-column v-if="columns.visible('updDate')" prop="updDate" label="修改日期" />
        <el-table-column v-if="columns.visible('tenant')" prop="tenant" label="租户" />
        <el-table-column v-permission="['admin','indAtomDimCode:edit','indAtomDimCode:del']" label="操作" width="150px"  >
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudIndAtomDimCode from '../../../../../api/indicators/indAtomDimCode'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '原子指标维度代码表', url: crudIndAtomDimCode.url, sort: 'id,desc', crudMethod: { ...crudIndAtomDimCode.crud }})
const defaultForm = { id: null, bizCode: null, dimCode: null, subCode: null, subDesc: null, subCond: null, subCondDesc: null, remark: null, crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, updDate: null, tenant: null }
export default {
  name: 'IndAtomDimCode',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'indAtomDimCode:add'],
        edit: ['admin', 'indAtomDimCode:edit'],
        del: ['admin', 'indAtomDimCode:del']
      },
      rules: {
        id: [
          { required: true, message: '主键不能为空', trigger: 'blur' }
        ],
        bizCode: [
          { required: true, message: '指标编号不能为空', trigger: 'blur' }
        ]
      }}
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
.app-container .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
  padding-left: 20px;
}
.app-container .el-table th>.cell {
  padding-left: 20px;
}
</style>
