<template>
  <el-dialog append-to-body :visible.sync="openFlag" title="指标操作记录" width="55%" top="8vh">
    <div class="app-container">
      <!--表格渲染-->
      <el-table ref="table" v-loading="loading" :data="crud.data" style="width: 100%;">
        <el-table-column prop="ieCode" label="指标编号"   fixed="left"/>
        <el-table-column prop="ieName" label="指标名称" show-overflow-tooltip   width="120px" fixed="left"/>
        <el-table-column prop="crtUserCode" label="员工号"   width="95px"/>
        <el-table-column prop="crtUserName" label="姓名"  />
        <el-table-column prop="crtOrgCode" label="机构号"   width="100px"/>
        <el-table-column prop="dname" label="机构名称"   width="120px"/>
        <el-table-column prop="status" label="操作类型"  />
        <el-table-column prop="crtDate" label="操作时间" width="150px" :formatter="timeColumnFormat"  />
        <el-table-column prop="ieDesc" show-overflow-tooltip label="指标描述"   width="200px"/>
        <el-table-column prop="ieRule" show-overflow-tooltip label="指标业务规则"   width="200px"/>

      </el-table>
      <pagination />

    </div>
  </el-dialog>

</template>

<script>
  import indIndicatorInfos, { getIeCodeHistoryList } from '@/api/indicators/indIndicatorInfo'
  import pagination from '@crud/Pagination'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  //import crudUser from '@/api/system/user'

  const defaultCrud = CRUD({
    title: '',
    sort: '',
    url: indIndicatorInfos.url + '/ieHis',
    queryOnPresenterCreated: false})
  const defaultForm = {
    ieCode: null,
    ieName: null,
    dname: null,
    did: null,
    status: null,
    crtDate: null
  }

  export default {
    name: 'ieCodeHistory',
    components: { pagination },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        query: { type: '1', finished: '' },
        form: { taskId: '', assignee: '', comment: '', parameter: '' },
        current: {},
        rows: [],
        loading: false,
        startFlow: false,
        isAssign: false,
        openFlag: false,
        users: [],
        ieCodePara: this.ieCode
      }
    },
    props: {
      ieCode: { type: String, default: null }
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.toQuery]() {
        console.log('beforeRefresh---- ', JSON.stringify(this.ieCode))
        this.query.ieCode = this.ieCode
        return true
      },
      refresh() {
        // const param = {}
        // param.ieCode = this.ieCode
        this.crud.query.ieCode = this.ieCode
        this.crud.toQuery()
        // getIeCodeHistoryList(param).then(res => {
        //   console.log(res)
        // })
      }
    }
  }
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 70px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  .demo-table-expand .el-form-item__content {
    font-size: 12px;
  }
</style>
