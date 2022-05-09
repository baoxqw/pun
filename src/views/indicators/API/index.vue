<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <el-input v-model="query.interfaceCode" clearable size="small" placeholder="接口编码" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />

      </div>
      <crudOperation :permission="permission" >
        <el-button  slot="right" class="el-upload"
                    display ="inline"
                    :disabled="crud.selections.length !== 1"
                    style="width: 75px"
                    type="primary"  @click="forRoles()">授权</el-button>
        <el-button  slot="right" class="el-upload"
                    display ="inline"
                    :disabled="crud.selections.length !== 1"
                    style="width: 75px"
                    type="primary"  @click="testInterface(crud.selections[0])">接口调用</el-button>

      </crudOperation>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->

<!--
      </crudOperation>
      -->
      <!--表单组件-->
      <el-dialog :visible.sync ="rolesDialog" @close="closeRolesDialog" v-if="rolesDialog" >
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >

          <el-tab-pane label="指标授权" name="first" :key="'first'" >
            <api-and-atom-relation v-if="apiAndAtomRelation" :msg ="idToChild" ></api-and-atom-relation>
          </el-tab-pane>

          <el-tab-pane label="系统授权" name="second" :key="'second'" >
            <api-and-system-relation v-if="apiAndSystemRelation" :msg ="idToChild"></api-and-system-relation>
          </el-tab-pane>

        </el-tabs>
      </el-dialog>
      <el-dialog width="80%" :visible="interfaceDialog" @close="closeDialog">
        <div class="block">
          <span class="demonstration">日期:</span>
          <el-date-picker
                  v-model="value"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
          </el-date-picker>
          <span class="demonstration">机构:</span>
          <treeselect v-model="businessDept" :options="depts" style="width: 230px;display: inline-block;top: 9px" placeholder="机构:" />
          <el-select v-model="testName"    clearable placeholder="请选择">
            <el-option
                    v-for="item in testNames"
                    :key="item.id"
                    :label="item.bizName"
                    :value="item.bizName">
            </el-option>
          </el-select>
          <el-button @click="doSubmit()" class="filter-item" size="mini" type="success" plain>确定</el-button>
          <div>
            <h5>code:</h5>
            <el-input placeholder="" v-model="input1"  style="width: 800px">
            </el-input>
          </div>
          <div>
            <h5>data:</h5>
            <el-input placeholder="" v-model="input2"  type="textarea" style="width: 800px" autosize>
            </el-input>
        </div>
        </div>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
          <!--<el-form-item label="指标名称" prop="bizName">
            <el-select v-model="form.bizName"  multiple clearable placeholder="请选择">
              <el-option
                      v-for="item in bizNames"
                      :key="item.id"
                      :label="item.bizName"
                      :value="item.bizName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="币种" >
            <el-select v-model="form.currency" clearable placeholder="请选择" >
              <el-option v-for="item in dict.IND_CURRENCY" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="频率" >
            <el-select v-model="form.frequency"  clearable placeholder="请选择">
              <el-option v-for="item in dict.IE_FREQUENCY" :key="item.id" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="系统英文缩写" prop="sysName">
            <el-input v-model="form.sysName" style="width: 200px;" />
          </el-form-item>-->
          <el-form-item label="接口编码" prop="interfaceCode">
            <el-input v-model="form.interfaceCode" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="接口名称" prop="interfaceName">
            <el-input v-model="form.interfaceName" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :aria-rowspan="10" maxlength="300" show-word-limit style="width: 230px;" />
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
       <!-- <el-table-column v-if="columns.visible('bizName')" prop="bizName" label="指标名称" width="200px">
        <template slot-scope="scope">
          <el-popover
                  placement="top-start"
                  title=""
                  width="200"
                  trigger="hover"
                  :content="scope.row.bizName">
            <span slot="reference" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.bizName }}</span>
          </el-popover>
        </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('bizCode')" prop="bizCode" label="指标编号" >
          <template slot-scope="scope">
            <el-popover
                    placement="top-start"
                    title=""
                    width="200"
                    trigger="hover"
                    :content="scope.row.bizCode">
              <span slot="reference" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.bizCode }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('currency')" prop="currency" label="币种" >
        <template slot-scope="scope">
          {{ dict.label.IND_CURRENCY[scope.row.currency] }}
        </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('frequency')" prop="frequency" label="频率" >
        <template slot-scope="scope">
          {{ dict.label.IE_FREQUENCY[scope.row.frequency] }}
        </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('sysName')" prop="sysName" label="系统英文缩写" />-->
        <el-table-column v-if="columns.visible('interfaceCode')" prop="interfaceCode" label="接口编码" />
        <el-table-column v-if="columns.visible('interfaceName')" prop="interfaceName" label="接口名称" />
        <el-table-column v-if="columns.visible('url')" prop="url" label="接口路径" >
          <template slot-scope="scope">
            <el-popover
                    placement="top-start"
                    title=""
                    width="200"
                    trigger="hover"
                    :content="scope.row.url">
              <span slot="reference" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.url }}</span>
            </el-popover>
          </template>
        </el-table-column>
<!--
        <el-table-column v-if="columns.visible('password')" prop="password" label="密码" />
-->
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注" width="200px">
          <template slot-scope="scope">
            <el-popover
                    placement="top-start"
                    title=""
                    width="200"
                    trigger="hover"
                    :content="scope.row.remark">
              <span slot="reference" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.remark }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建时间" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.crtDate) }}</span>
        </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />
<!--        <el-table-column v-permission="['admin','indApiInfo:edit','indApiInfo:del']" label="操作" width="150px" fixed="right">
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
  import indApiInfo,{testInterface} from '../../../api/apiInfo/apiInfo.js'
  import {getListByApiId} from '../../../api/apiInfo/apiAndAtomRelation.js'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import apiAndAtomRelation from './apiAndAtom'
  import apiAndSystemRelation from './apiAndSystem'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {getData2Api} from '../../../api/indicators/indIndicatorManual'
  import { getDepts} from '@/utils/system'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  // crud交由presenter持有
  const defaultCrud = CRUD({ title: 'API管理', url: indApiInfo.url, sort: 'id,desc', crudMethod: { ...indApiInfo.crud }})
  const defaultForm = {
    id: null,
    bizName: [],
    bizCode: null,
    currency: null,
    frequency: null,
    sysName: null,
    password: null,
    url: null,
    interfaceCode: null,
    interfaceName: null,
    remark: null,
    crtUserCode: null,
    crtOrgCode: null,
    crtDate: null,
    updUserCode: null,
    updOrgCode: null,
    updDate: null }
    const bizNames={}
    const depts={}
    const testNames={}
    const input2 ={}
  export default {
    name: 'indApiInfo',
    components: { apiAndAtomRelation,apiAndSystemRelation,Treeselect,pagination, crudOperation, rrOperation, udOperation },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['IND_CURRENCY', 'IE_FREQUENCY'],

    data() {
      return {
        apiAndAtomRelation:'apiAndAtomRelation',
        apiAndSystemRelation:'apiAndSystemRelation',
        activeName: "first",
        bizNames,
        testNames,
        interfaceDialog:false,
        rolesDialog:false,
        value: null,
        testName: '',
        input1:'',
        input2,
        idToChild:'',
        businessDept:null,
        depts,
        permission: {
          add: ['admin', 'resultCheck:add'],
          edit: ['admin', 'resultCheck:edit'],
          del: ['admin', 'resultCheck:del']
        },
        rules: {
          interfaceCode: [
            { required: true, message: '接口编码不能为空', trigger: 'blur' }
          ],
          interfaceName: [
            { required: true, message: '接口名称不能为空', trigger: 'blur' }
          ],
        },
      }
    },
    created() {
      this.getDepts();

    },
    mounted() {
/*      getData2Api().then(data => {
        this.bizNames = data.data;
      })*/
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        this.crud.optShow.del = true
        this.crud.optShow.add = true
        this.crud.optShow.edit = true
        return true
      },
      [CRUD.HOOK.beforeSubmit]() {
        this.form.bizName = this.form.bizName == null? null : Array.isArray(this.form.bizName)? this.form.bizName.join(",") : this.form.bizName
      },
      [CRUD.HOOK.beforeToEdit](data) {
        this.form.formType= 'edit';
        this.form.bizName = this.crud.selections[0].bizName == null? null : Array.isArray(this.crud.selections[0].bizName)? this.crud.selections[0].bizName : this.crud.selections[0].bizName.split(',')
      },
      forceUpdate(e){
        this.$forceUpdate(); //
      },
      forRoles(){
        this.idToChild = this.crud.selections[0].id;
        this.rolesDialog = true;
      },
      closeRolesDialog(){
        this.rolesDialog = false;
        this.crud.toQuery();
      },
      testInterface(){

        getListByApiId(this.crud.selections[0].id).then(data =>{
          console.log(data)
          this.testNames = data.data
          this.interfaceDialog = true;
        })
        console.log( "------------------"+this.testNames)
        console.log( this.depts)
        console.log(this.crud.selections[0].bizName)
      },
      closeDialog(){
        this.interfaceDialog = false;

      },
      doSubmit(){
        this.value;
        this.businessDept;
        var name = this.testName;
        var id = this.crud.selections[0].id;
        console.log(this.value)
        var beginTime = null;
        var endTime = null;
        if(this.value != null){
          var beginTime = this.handleDate(this.value[0]);
          var endTime = this.handleDate(this.value[1]);
        }

        if(this.businessDept == null || this.businessDept == undefined) this.businessDept =null;
        if(name ==null||name == undefined ||name ==""){
          this.$message({
            message: '请选择一个指标',
            type: 'warning'
          });
        }else {
          testInterface(id,name,this.businessDept,beginTime,endTime).then(data => {
            console.log(data)
            this.input1 = data.code;
            this.input2 = data.data;
          })
        }
      },
      handleDate(date){
        if(date== null ||date ==undefined){
          return null;
        }
        let month = date.getMonth()+1;
        return date.getFullYear()+"-"+month+"-"+date.getDate();
      },
      getDepts() {
        getDepts({ enabled: true }).then(res => {
          this.depts = res.content
        })
      },

      handleClick(tab) {
        if(tab.name == "first") {
          this.apiAndAtomRelation = true;
          this.apiAndSystemRelation = false;
        } else if(tab.name == "second") {
          this.apiAndSystemRelation = true;
          this.apiAndAtomRelation = false;
        }
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
