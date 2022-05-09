<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <el-input v-model="query.bizName" clearable size="small" placeholder="指标名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />

      </div>
      <crudOperation :permission="permission" />

      <el-dialog :close-on-click-modal="false" append-to-body :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px" >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px" >
<!--          <el-form-item label="指标名称" prop="bizName">
            <el-select v-model="form.bizName"  clearable placeholder="请选择">
              <el-option
                      v-for="item in bizNames"
                      :key="item.id"
                      :label="item.bizName"
                      :value="item.bizName">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="指标名称" prop="atomList" >
            <el-cascader
                    collapse-tags
                    placeholder="请输入指标名称"
                    :options="options"
                    :show-all-levels="false"
                    v-model ="atomList"
                    :props="{ multiple: true,emitPath:false }"
                    filterable></el-cascader>
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
        <el-table-column v-if="columns.visible('bizName')" prop="bizName" label="指标名称" width="200px"/>
        <el-table-column v-if="columns.visible('bizCode')" prop="bizCode" label="指标编号"/> >
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import batchAndAtomRelation,{getSelectedListBybatchCode} from '@/api/indicators/batchAndAtomRelation.js'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {getData2Api} from '@/api/indicators/indIndicatorManual'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  // crud交由presenter持有
  const defaultCrud = CRUD({ title: '指标授权', url: batchAndAtomRelation.url, sort: 'id,desc', crudMethod: { ...batchAndAtomRelation.crud }})
  const defaultForm = {
    batchCode: null,
    bizName: null,
    bizCode: null}
    const bizNames={}
    const depts={}
  export default {
    name: 'batchAndAtomRelation',
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
          atomList:[],
          rules: {
/*           atomList: [
            { type:'array' , required: true, message: '请选择一个指标', trigger: 'blur' }
          ],*/
        },
        options: [],
      }
    },
    created() {
     this.form.batchCode = this.msg
        getSelectedListBybatchCode(this.form.batchCode).then(data => {
            this.atomList = data;
        })
    },
    mounted() {
      getData2Api().then(data => {
        this.bizNames = data;
        this.options = data;
      })

    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        this.query.batchCode = this.msg
        this.crud.optShow.del = true
        this.crud.optShow.add = true
        this.crud.optShow.edit = false
        return true
      },
      [CRUD.HOOK.beforeToAdd](){
        this.form.batchCode = this.msg
        getSelectedListBybatchCode(this.form.batchCode).then(data => {
            console.log(data);
            this.atomList = data;
        })
      },
      [CRUD.HOOK.beforeSubmit]() {
          if(this.atomList.length==0){
              this.$message.error({
                  message: "请选择一个指标"
              })
              return false;
          }
          this.form.bizCode = this.atomList.toString();
          //this.form.bizName = this.form.bizName == null? null : Array.isArray(this.form.bizName)? this.form.bizName.join(",") : this.form.bizName
      },
      [CRUD.HOOK.afterSubmit](){
        
      },
      forceUpdate(e){
        this.$forceUpdate(); //
      },
      closeDialog(){
        this.interfaceDialog = false;

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
