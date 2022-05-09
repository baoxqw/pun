<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <treeselect v-model="query.orgId" multiple :options="depts"  style="width: 320px" size="small"  placeholder="选择机构" class="filter-item"/>
        <el-input v-model="query.ieCode" clearable  placeholder="指标编码" style="width: 200px;" size="small" class="filter-item"/>
        <el-input v-model="query.ieName" clearable  placeholder="指标名称" style="width: 200px;" size="small" class="filter-item"/>
        <el-date-picker  v-model="query.repDateInterval" :default-time="['00:00:00','23:59:59']" type="daterange" range-separator=":" size="small"
                         class="date-item" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"/>
        <br/>
        <treeselect v-model="query.bizDeptId" multiple :options="depts"  style="width: 320px" size="small"  placeholder="业务属主部门" class="filter-item"/>
        <el-input v-model="query.userName" clearable  placeholder="人员" style="width: 200px;" size="small" class="filter-item"/>
        <el-select  v-model="query.ieKindOneCode" clearable size="small"  placeholder="指标一级分类" class="filter-item" style="width: 150px">
          <el-option v-for="item in qryIndFirstType" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select  v-model="query.ieTypeCode" clearable size="small"  placeholder="指标类型" class="filter-item" style="width: 150px">
          <el-option v-for="item in dict.IE_PROP" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" v-show="false"/>
      <el-button
          :loading="crud.downloadLoading"
          :disabled="!crud.data.length"
          class="filter-item"
          type="success"
          icon="el-icon-download"
          @click="crud.doExport('download','指标使用情况统计数据')"
      >导出查询结果</el-button>
      <crudOperation :permission="permission" v-show="false"/>
      <el-button
          :loading="crud.downloadLoading"
          :disabled="!crud.data.length"
          class="filter-item"
          type="success"
          icon="el-icon-download"
          @click="crud.doExport('downloadDetail','指标使用情况明细数据')"
      >导出明细</el-button>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="机构ID" prop="orgId">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="机构名称" prop="orgName">
            <el-input v-model="form.orgName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="人员ID" prop="userId">
            <el-input v-model="form.userId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="人员姓名" prop="userName">
            <el-input v-model="form.userName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标编码" prop="ieCode">
            <el-input v-model="form.ieCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标名称" prop="ieName">
            <el-input v-model="form.ieName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标分类一级" prop="ieKindOneCode">
            <el-select v-model="form.ieKindOneCode" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.IND_FIRST_TYPE"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="指标分类二级" prop="ieKindTwoCode">
            <el-select v-model="form.ieKindTwoCode" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.IND_SECOND_TYPE"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="指标类型" prop="ieTypeCode">
            <el-select v-model="form.ieTypeCode" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.IE_PROP"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="业务属主部门ID" prop="bizDeptId">
            <el-select v-model="form.bizDeptId" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.BUSSINESS_DEPT"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="业务属主部门名称" prop="bizDeptName">
            <el-input v-model="form.bizDeptName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标引用次数">
            <el-input v-model="form.ieRefCnt" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标查询次数">
            <el-input v-model="form.ieQryCnt" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据日期" prop="repDate">
            <el-date-picker v-model="form.repDate" type="datetime" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
<!--        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="id" />
        <el-table-column v-if="columns.visible('orgId')" prop="orgId" label="机构ID" />-->
<!--        <el-table-column v-if="columns.visible('repDate')" prop="repDate" label="数据日期"  >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.repDate,'{y}/{m}/{d}') }}</span>
          </template>
        </el-table-column>-->
        <el-table-column v-if="columns.visible('repDateInterval')" prop="repDateInterval" label="数据日期" align="center" />
        <el-table-column v-if="columns.visible('orgName')" prop="orgName" label="机构名称" align="center" />
<!--        <el-table-column v-if="columns.visible('userId')" prop="userId" label="人员ID" />-->
        <el-table-column v-if="columns.visible('userName')" prop="userName" label="人员姓名"  align="center" />
        <el-table-column v-if="columns.visible('ieCode')" prop="ieCode" label="指标编码"  align="center" />
        <el-table-column v-if="columns.visible('ieName')" prop="ieName" label="指标名称"  align="center" />
        <el-table-column label="指标分类" width="100px" style="height: 20px" align="center" >
          <el-table-column v-if="columns.visible('ieKindOneName')" prop="ieKindOneName" label="一级分类"  align="center" />
          <el-table-column v-if="columns.visible('ieKindTwoName')" prop="ieKindTwoName" label="二级分类"  align="center" />
        </el-table-column>
        <el-table-column v-if="columns.visible('ieTypeCode')" prop="ieTypeCode" label="指标类型"  align="center" >
          <template slot-scope="scope">
            {{ dict.label.IE_PROP[scope.row.ieTypeCode] }}
          </template>
        </el-table-column>
       <el-table-column v-if="columns.visible('bizDeptName')" prop="bizDeptName" label="业务属主部门"  align="center" />
<!--        <el-table-column v-if="columns.visible('bizDeptName')" prop="bizDeptName" label="业务属主部门名称"  />-->
        <el-table-column v-if="columns.visible('ieRefCnt')" prop="ieRefCnt" label="指标引用次数" align="center"  />
        <el-table-column v-if="columns.visible('ieQryCnt')" prop="ieQryCnt" label="指标查询次数" align="center"  />
        <el-table-column v-if="columns.visible('reqCnt')" prop="reqCnt" label="接口调用次数"   align="center"/>
<!--        <el-table-column v-permission="['admin','indUserApplyInfo:edit','indUserApplyInfo:del']" label="操作" width="150px"  >
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>-->
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudIndUserApplyInfo from '@/api/indUserApply/indUserApplyInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getDepts } from '@/utils/system'
import crudIndCategory from "@/api/indicators/indCategory";
const moment = require('moment')
// crud交由presenter持有
const defaultCrud = CRUD({ title: '人员指标使用情况', url: crudIndUserApplyInfo.url, sort: 'id,desc', crudMethod: { ...crudIndUserApplyInfo.crud }})
const defaultForm = { id: null, orgId: null, orgName: null, userId: null, userName: null, ieCode: null, ieName: null, ieKindOneCode: null, ieKindTwoCode: null, ieTypeCode: null, bizDeptId: null, bizDeptName: null, ieRefCnt: null, ieQryCnt: null, repDate: null, crtDate: null, updDate: null,repDateInterval:null }
export default {
  name: 'IndUserApplyInfo',
  components: { Treeselect,pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['IND_FIRST_TYPE', 'IND_SECOND_TYPE', 'IE_PROP', 'BUSSINESS_DEPT'],
  data() {
    return {
      depts: [],
      qryIndFirstType: [],
      permission: {
        add: ['admin', 'indUserApplyInfo:add'],
        edit: ['admin', 'indUserApplyInfo:edit'],
        del: ['admin', 'indUserApplyInfo:del']
      },
      rules: {
        id: [
          { required: true, message: 'id不能为空', trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '机构ID不能为空', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '人员ID不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '人员姓名不能为空', trigger: 'blur' }
        ],
        ieCode: [
          { required: true, message: '指标编码不能为空', trigger: 'blur' }
        ],
        ieName: [
          { required: true, message: '指标名称不能为空', trigger: 'blur' }
        ],
        ieKindOneCode: [
          { required: true, message: '指标分类一级不能为空', trigger: 'blur' }
        ],
        ieKindTwoCode: [
          { required: true, message: '指标分类二级不能为空', trigger: 'blur' }
        ],
        ieType: [
          { required: true, message: '指标类型不能为空', trigger: 'blur' }
        ],
        bizDeptId: [
          { required: true, message: '业务属主部门ID不能为空', trigger: 'blur' }
        ],
        bizDeptName: [
          { required: true, message: '业务属主部门名称不能为空', trigger: 'blur' }
        ],
        repDate: [
          { required: true, message: '数据日期不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: 'id' },
        { key: 'orgId', display_name: '机构ID' },
        { key: 'orgName', display_name: '机构名称' },
        { key: 'userId', display_name: '人员ID' },
        { key: 'userName', display_name: '人员姓名' },
        { key: 'ieCode', display_name: '指标编码' },
        { key: 'ieName', display_name: '指标名称' },
        { key: 'ieKindOneCode', display_name: '指标分类一级' },
        { key: 'ieKindTwoCode', display_name: '指标分类二级' },
        { key: 'ieType', display_name: '指标类型' },
        { key: 'bizDeptId', display_name: '业务属主部门ID' },
        { key: 'bizDeptName', display_name: '业务属主部门名称' },
        { key: 'repDate', display_name: '数据日期' }
      ],
      pickerMinDate: "",//第一次选中的时间
      pickerOptions: {
        onPick: obj => {
          //this.pickerMinDate = new Date(obj.minDate).getTime();
        },
        disabledDate: time => {
          if (this.pickerMinDate) {
            const day1 = 366 * 24 * 3600 * 1000;
            let maxTime = this.pickerMinDate + day1;
            let minTime = this.pickerMinDate - day1;
            return time.getTime() > maxTime || time.getTime() < minTime;
          }
        }
      }
    }
  },
  mounted() {
    this.getDepts();
  },
  created() {
    //defaultCrud.query.repDateInterval = this.timeDefault
    this.initIndFirstType();
    this.resetQuery()
  },
  computed: {
    // 默认时间
    timeDefault () {
      var defalutStartTime = moment().subtract(1,"year").format('YYYY-MM-DD')
      var defalutEndTime = moment().format('YYYY-MM-DD')
      return [defalutStartTime, defalutEndTime]
    }
  },
  methods: {
    resetQuery(){
      this.crud.resetQuery(false);
      this.crud.refresh()
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    dateFormat(row) {
      // return moment(row.crtDate).format('YYYY-MM-DD');
      return moment(row.crtDate).format('YYYY-MM-DD')
    },
    initIndFirstType() {
      crudIndCategory.getCategoryList(0).then(res => {
        const data = res.data;
        if(res.code == 0) {
          for(let i=0; i<data.length; i++) {
            this.qryIndFirstType.push({id: data[i].id, label: data[i].categoryName, value: data[i].id})
            //this.formIndFirstType.push({id: data[i].id, label: data[i].categoryName, value: data[i].id})
          }
        }
      })
    }
  }
}
</script>

<style>
.app-container .el-table thead.is-group th
{
  background: #5c8dbe45;
  height: 25px;
}
.app-container .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
  padding-left: 20px;
}
.app-container .el-table th>.cell {
  padding-left: 20px;
}
</style>
