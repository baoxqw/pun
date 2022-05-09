<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.batchCode" clearable size="small" placeholder="服务编号" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <el-input v-model="query.batchName" clearable size="small" placeholder="服务名称" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <rrOperation :crud="crud"/>
      </div>
      <crudOperation :permission="permission">
        <el-button style="width: 75px" slot="right"
                        v-permission="permission.edit"
                        class="filter-item"
                        type="success"
                        icon="el-icon-edit"
                        :disabled="crud.selections.length !== 1"
                        @click="openEdit(crud.selections[0])"
            >
              修改
        </el-button>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" @close="initData()" :visible.sync="crud.status.cu > 0"
               :title="crud.status.title" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
        <el-form-item label="服务名称" prop="batchName">
          <el-input v-model="form.batchName" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="服务编号" prop="batchCode">
          <el-input v-model="form.batchCode" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="机构" prop="org">
          <treeselect v-model="form.org" :options="resultDepts"  style="width: 95%" size="small"  placeholder="选择机构" class="filter-item"/>
        </el-form-item>
        <el-form-item label="文件格式" prop="fileFormat">
          <el-select v-model="form.fileFormat" filterable clearable placeholder="请选择">
            <el-option
                v-for="item in dict.FILE_TYPE"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分隔符" prop="fileSeparator">
          <el-input v-model="form.fileSeparator" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="服务器IP" prop="batchIp">
          <el-input v-model="form.batchIp" placeholder="格式如：*.*.*.*" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="文件路径" prop="filePath">
          <el-input v-model="form.filePath" placeholder="格式如：/**/" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="频度" placeholder="请选择">
          <el-select style="width: 370px" v-model="frequen" filterable clearable @change="changeSelectfre()">
            <el-option 
              v-for="item in frequency"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="批量时间:年" v-if="false">
          <el-input v-model="form.batchYear" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="批量时间:月" v-if="switchMonth">
          <el-input v-model="form.batchMonth" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="批量时间:日" v-if="switchDay">
          <el-input v-model="form.batchDay" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="批量时间:时" v-if="switchHour">
          <el-input v-model="form.batchHour" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="批量时间:分" v-if="switchMinute">
          <el-input v-model="form.batchMinute" style="width: 370px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>

    <!-- 选择指标框 -->
    <el-dialog :visible.sync ="rolesDialog" @close="closeRolesDialog" v-if="rolesDialog">
      <el-tabs type="card">
        <el-tab-pane label="指标授权">
          <batch-and-atom-relation v-if="batchAndAtomRelation" :msg ="idToChild" ></batch-and-atom-relation>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small"
              @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55"/>
      <!--<el-table-column v-if="columns.visible('id')" prop="id" label="服务id" />-->
      <el-table-column v-if="columns.visible('batchCode')" prop="batchCode" label="服务编号"/>
      <el-table-column v-if="columns.visible('batchName')" prop="batchName" label="服务名称"/>
      <el-table-column v-if="columns.visible('org')" prop="org" label="机构"/>
      <el-table-column v-if="columns.visible('fileFormat')" prop="fileFormat" label="文件格式"/>
      <el-table-column v-if="columns.visible('fileSeparator')" prop="fileSeparator" label="分隔符"/>
      <el-table-column v-if="columns.visible('batchIp')" prop="batchIp" label="服务器Ip"/>
      <el-table-column v-if="columns.visible('filePath')" prop="filePath" label="文件路径"/>
      <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注"/>
      <el-table-column v-if="columns.visible('batchYear')" prop="batchYear" label="批量时间(年)"/>
      <el-table-column v-if="columns.visible('batchMonth')" prop="batchMonth" label="批量时间(月)"/>
      <el-table-column v-if="columns.visible('batchDay')" prop="batchDay" label="批量时间(日)"/>
      <el-table-column v-if="columns.visible('batchHour')" prop="batchHour" label="批量时间(时)"/>
      <el-table-column v-if="columns.visible('batchMinute')" prop="batchMinute" label="批量时间(分)"/>
      <el-table-column label="操作" min-width="100px" fixed="right">
        <template slot-scope="scope">
          <el-button
              slot="left"
              class="el-icon--left"
              type="primary"
              style="margin-bottom:3px !important"
              size="mini"
              @click="editIndList(scope.row)"
          >
            编辑批量指标信息
          </el-button>
        </template> 
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
  </div>
</template>

<script>
import crudindAtomBatchInfo from '@/api/indicators/indAtomBatch'
import batchAndAtomRelation from './batchAndAtom'
import {getResultDepts} from '@/api/indicators/indResultSubscribe'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import qs from 'qs'

// crud交由presenter持有
const defaultCrud = CRUD({
  title: '批量服务信息',
  url: crudindAtomBatchInfo.url,
  sort: 'id,desc',
  crudMethod: {...crudindAtomBatchInfo.method}
})
const defaultForm = {
  id: null,
  batchCode: null,
  batchName: null,
  org: null,
  fileFormat: null,
  fileSeparator: null,
  batchIp: null,
  filePath: null,
  remark: null,
  batchYear: null,
  batchMonth: null,
  batchDay: null,
  batchHour: null,
  batchMinute: null
}
export default {
  name: 'crudindAtomBatchInfo',
  components: {pagination, crudOperation, rrOperation, udOperation, Treeselect,batchAndAtomRelation},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['FILE_TYPE'],
  data() {
    return {
      batchAndAtomRelation: 'batchAndAtomRelation',
      menuTreeDefaultProps: {
          children: 'children',
          label: 'name'
      },
      adminTab: {
          menuLoading: false,
          data: [],
          loading: false,
          operators: [],
          strictly: true
        },
      resultDepts: [],
      permission: {
        add: ['admin', 'crudindAtomBatchInfo:add'],
        del: ['admin', 'crudindAtomBatchInfo:del'],
        edit: ['admin', 'crudindAtomBatchInfo:edit']
      },
      frequency:[
        {key: 'year', value:'年'},
        {key: 'month', value:'月'},
        {key: 'day', value:'日'},
        {key: 'hour', value:'时'}
      ],
      frequen: "",
      rules: {
        batchCode: [
          {required: true, message: '服务编号不能为空', trigger: 'blur'}
        ],
        batchName: [
          {required: true, message: '服务名称不能为空', trigger: 'blur'}
        ],
        org: [
          {required: true, message: '机构不能为空', trigger: 'change'}
        ],
        fileFormat: [
          {required: true, message: '文件格式不能为空', trigger: 'blur'}
        ],
        fileSeparator: [
          {required: true, message: '分隔符不能为空', trigger: 'blur'}
        ],
        batchIp : [
          {required: true, message: '服务器路径不能为空', trigger: 'blur'}
        ],
        filePath: [
          {required: true, message: '文件路径不能为空', trigger: 'blur'}
        ]
      },
      currentId:"",
      rolesDialog:false,
      idToChild:''
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getResultDepts() {
        getResultDepts().then(res => {
          console.log(res);
            this.resultDepts = res.content
        })
    },
    changeSelectfre() {
      if(this.frequen == "month"){
        this.crud.form.batchYear = "";
        this.crud.form.batchMonth = "";
      }else if(this.frequen == "day"){
        this.crud.form.batchYear = "";
        this.crud.form.batchMonth = "";
        this.crud.form.batchDay = "";
      }else if(this.frequen == "hour"){
        this.crud.form.batchYear = "";
        this.crud.form.batchMonth = "";
        this.crud.form.batchDay = "";
        this.crud.form.batchHour = "";
      }
    },
    openEdit(row){
      this.crud.toEdit(row);
      if(row.batchYear != ""){
        this.frequen = "year";
      }else{
        if(row.batchMonth != ""){
          this.frequen = "year";
        }else{
          if(row.batchDay != ""){
            this.frequen = "month";
          }else{
            this.frequen = "day";
          }
        }
      }
    },
    initData(){
      this.frequen = "";
    },
    editIndList(currentRow){
      this.idToChild = currentRow.batchCode;
      this.rolesDialog = true;
    },
    closeRolesDialog(){
        this.rolesDialog = false;
        this.crud.toQuery();
      },
  },
  computed:{
    switchMonth:function(){
      return this.frequen == "year";
    },
    switchDay:function(){
      return this.frequen == "year" || this.frequen == "month";
    },
    switchHour:function(){
      return this.frequen == "year" || this.frequen == "month"||this.frequen == "day";
    },
    switchMinute:function(){
      return this.frequen != "";
    }
  },
  created() {
    this.getResultDepts();
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
.error-border .el-input__inner,.error-border .vue-treeselect__control{
        border-color: #f56c6c !important;
    }
</style>
