<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-date-picker
          v-model="query.impDate"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="impDateStart"
          end-placeholder="impDateEnd"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标结果ID" prop="indResultId">
            <el-input v-model="form.indResultId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标ID" prop="ieId">
            <el-input v-model="form.ieId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标编码" prop="ieCode">
            <el-input v-model="form.ieCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标名称" prop="ieName">
            <el-input v-model="form.ieName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="收藏人ID" prop="userId">
            <el-input v-model="form.userId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="收藏人编号" prop="userNo">
            <el-input v-model="form.userNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="收藏人姓名" prop="userName">
            <el-input v-model="form.userName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建人" prop="crtUserCode">
            <el-input v-model="form.crtUserCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.crtDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新人">
            <el-input v-model="form.updUserCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建机构">
            <el-input v-model="form.crtOrgCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新机构">
            <el-input v-model="form.updOrgCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="收藏日期" prop="impDate">
            <el-input v-model="form.impDate" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('id')" prop="id" label="ID" />
        <el-table-column v-if="columns.visible('indResultId')" prop="indResultId" label="指标结果ID" />
        <el-table-column v-if="columns.visible('ieId')" prop="ieId" label="指标ID" />
        <el-table-column v-if="columns.visible('ieCode')" prop="ieCode" label="指标编码" />
        <el-table-column v-if="columns.visible('ieName')" prop="ieName" label="指标名称" />
        <el-table-column v-if="columns.visible('userId')" prop="userId" label="收藏人ID" />
        <el-table-column v-if="columns.visible('userNo')" prop="userNo" label="收藏人编号" />
        <el-table-column v-if="columns.visible('userName')" prop="userName" label="收藏人姓名" />
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建时间" />
        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="更新人" />
        <el-table-column v-if="columns.visible('updDate')" prop="updDate" label="更新时间" />
        <el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />
        <el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="更新机构" />
        <el-table-column v-if="columns.visible('impDate')" prop="impDate" label="收藏日期" />
        <el-table-column v-permission="['admin','indResultFavorites:edit','indResultFavorites:del']" label="操作" width="150px" align="center">
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
import crudIndResultFavorites from '@/api/indicators/indResultFavorites'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '指标结果收藏夹接口', url: crudIndResultFavorites.url, sort: 'id,desc', crudMethod: { ...crudIndResultFavorites.crud }})
const defaultForm = { id: null, indResultId: null, ieId: null, ieCode: null, ieName: null, userId: null, userNo: null, userName: null, crtUserCode: null, crtDate: null, updUserCode: null, updDate: null, crtOrgCode: null, updOrgCode: null, impDate: null }
export default {
  name: 'IndResultFavorites',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'indResultFavorites:add'],
        edit: ['admin', 'indResultFavorites:edit'],
        del: ['admin', 'indResultFavorites:del']
      },
      rules: {
        id: [
          { required: true, message: 'ID不能为空', trigger: 'blur' }
        ],
        indResultId: [
          { required: true, message: '指标结果ID不能为空', trigger: 'blur' }
        ],
        ieId: [
          { required: true, message: '指标ID不能为空', trigger: 'blur' }
        ],
        ieCode: [
          { required: true, message: '指标编码不能为空', trigger: 'blur' }
        ],
        ieName: [
          { required: true, message: '指标名称不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '收藏人ID不能为空', trigger: 'blur' }
        ],
        userNo: [
          { required: true, message: '收藏人编号不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '收藏人姓名不能为空', trigger: 'blur' }
        ],
        crtUserCode: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ],
        impDate: [
          { required: true, message: '收藏日期不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'indResultId', display_name: '指标结果ID' },
        { key: 'ieId', display_name: '指标ID' },
        { key: 'ieCode', display_name: '指标编码' },
        { key: 'ieName', display_name: '指标名称' },
        { key: 'userId', display_name: '收藏人ID' },
        { key: 'userNo', display_name: '收藏人编号' },
        { key: 'userName', display_name: '收藏人姓名' }
      ]
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
