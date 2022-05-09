<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="分类ID" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类模块">
            <el-input v-model="form.categoryType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="form.categoryName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类描述">
            <el-input v-model="form.categoryDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="父节点">
            <el-input v-model="form.parentId" style="width: 370px;" />
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
          <el-form-item label="法人行社号">
            <el-input v-model="form.legalOrg" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('id')" prop="id" label="分类ID" />
        <el-table-column v-if="columns.visible('categoryType')" prop="categoryType" label="分类模块" />
        <el-table-column v-if="columns.visible('categoryName')" prop="categoryName" label="分类名称" />
        <el-table-column v-if="columns.visible('categoryDesc')" prop="categoryDesc" label="分类描述" />
        <el-table-column v-if="columns.visible('parentId')" prop="parentId" label="父节点" />
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />
        <el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建日期" />
        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人" />
        <el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="修改机构" />
        <el-table-column v-if="columns.visible('updDate')" prop="updDate" label="修改日期" />
        <el-table-column v-if="columns.visible('legalOrg')" prop="legalOrg" label="法人行社号" />
        <el-table-column v-permission="['admin','indCategory:edit','indCategory:del']" label="操作" width="150px"  >
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
import crudIndCategory from '../../../api/indicators/indCategory'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '指标分类', url: crudIndCategory.url, sort: 'id,desc', crudMethod: { ...crudIndCategory.method }})
const defaultForm = { id: null, categoryType: null, categoryName: null, categoryDesc: null, parentId: null, crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, updDate: null, legalOrg: null }
export default {
  name: 'IndCategory',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'indCategory:add'],
        edit: ['admin', 'indCategory:edit'],
        del: ['admin', 'indCategory:del']
      },
      rules: {
        id: [
          { required: true, message: '分类ID不能为空', trigger: 'blur' }
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
.app-container .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
  padding-left: 20px;
}
.app-container .el-table th>.cell {
  padding-left: 20px;
}
</style>
