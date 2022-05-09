<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.title" clearable placeholder="公告题目" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.type" value="1" v-if="false"/>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"  :title="crud.status.title" width="850px">
        <el-form ref="form" :model="form" :rules="rules" size="small" :inline="true">
          <el-form-item label="标题:" prop="title">
            <el-input type="textarea" v-model="form.title" style="width:650px"></el-input>
          </el-form-item>
          <el-form-item label="内容:" prop="content">
            <quill-editor v-model="form.content" :options="contentQuillOption" style="width:650px;height: 300px;margin-bottom: 50px"></quill-editor>
          </el-form-item>
          <el-form-item label="有效时间:" :required="true">
            <el-form-item  prop="effectDateFrom">
                <el-date-picker
                  v-model="form.effectDateFrom"
                  type="date"
                  placeholder="开始日期"
                  format="yyyy-MM-dd"
                  style="width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item>至</el-form-item>
            <el-form-item prop="effectDateTo">
              <el-date-picker
                v-model="form.effectDateTo"
                type="date"
                placeholder="结束日期"
                format="yyyy-MM-dd"
                style="width:150px">
              </el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="置顶:">
            <el-switch
              v-model="form.sortNo"
              active-text="是"
              inactive-text="否"
              :active-value="0"
              :inactive-value="1">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" plain round @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="success" round @click="this.crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('title')" prop="title" label="标题">
          <template slot-scope="scope">
            <p v-html="scope.row.title"></p>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('effectDateFrom')" prop="effectDateFrom" label="开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.effectDateFrom,"{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('effectDateTo')" prop="effectDateTo" label="结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.effectDateTo,"{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('sortNo')" prop="sortNo" label="置顶">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sortNo"
                :active-value="0"
                :inactive-value="1"
                @change="(val) =>{topNotice(scope.row.id,val)}"
                       :disabled="true"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建时间" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.crtDate) }}</span>
        </template>
        </el-table-column>
        <el-table-column v-permission="['admin','sysNotice:edit','sysNotice:del']" label="操作" width="150px"  >
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
  import crudSysNotice,{topNotice} from '../../../api/indicators/notice'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import {quillEditor} from "vue-quill-editor";
  import quillConfig from "../../../api/indicators/quill-config";
  import $ from 'jquery';
  // crud交由presenter持有
  const defaultCrud = CRUD({ title: '公告管理', url: crudSysNotice.url, sort: 'sortNo', crudMethod: { ...crudSysNotice.crud }})
  const defaultForm = { id: null, title: null, content:null, effectDateFrom: null,  effectDateTo: null, sortNo: 1, crtUserCode:null, crtDate:null }


  export default {
    name: 'SysNotice',
    components: { pagination, crudOperation, rrOperation, udOperation,quillEditor },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],

    data() {
      const checkDateFrom = (rule, value, cb) => {
        if(this.form.effectDateFrom == null || this.form.effectDateTo == null){
          return cb();
        }
        this.$refs['form'].clearValidate(['effectDateTo']);
        if(this.form.effectDateFrom > this.form.effectDateTo){
          return cb("开始日期要小于结束日期");
        }
        return cb();
      };
      const checkDateTo = (rule, value, cb) => {
        if(this.form.effectDateFrom == null || this.form.effectDateTo == null){
          return cb();
        }
        this.$refs['form'].clearValidate(['effectDateFrom']);
        if(this.form.effectDateFrom > this.form.effectDateTo){
          return cb("结束日期要大于开始日期");
        }
        return cb();
      };
      return {
        contentQuillOption: {
          placeholder: "请输入公告内容",
          theme: 'snow',
          modules: quillConfig.contentModules
        },
        titleQuillOption: {
          placeholder: "请输入公告标题",
          theme: 'snow',
          modules: quillConfig.titleModules
        },
        permission: {
          add: ['admin', 'sysNotice:add'],
          edit: ['admin', 'sysNotice:edit'],
          del: ['admin', 'sysNotice:del']
        },

        rules: {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          effectDateFrom: [
            { required: true, message: '开始日期不能为空', trigger: 'blur' },
            { validator: checkDateFrom, trigger: 'blur'}
          ],
          effectDateTo: [
            { required: true, message: '结束日期不能为空', trigger: 'blur' },
            { validator: checkDateTo, trigger: 'blur'}
          ]
        }
      }
    },
    created(){
      this.crud.resetQuery(false);
      this.query.type= 1;
      //this.crud.refresh();
    },
    mounted(){
      //this.query.type= 1;
      //this.crud.refresh();
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
      topNotice(id,sortNo) {
        if(sortNo == 1) {
          this.$confirm('确认是否取消置顶?', '取消置顶', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            topNotice(id,sortNo).then(res => {
              if(res.code ==0) {
                this.$notify({
                  title: '取消置顶成功',
                  type: 'success',
                  duration: 2500
                })
              }
            })
          }).catch(() => {})
        }else {
          this.$confirm('确认是否置顶?', '置顶', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            topNotice(id,sortNo).then(res => {
              if(res.code ==0) {
                this.$notify({
                  title: '置顶成功',
                  type: 'success',
                  duration: 2500
                })
              }
            })
          }).catch(() => {})
        }
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
