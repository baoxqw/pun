<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
            <div>
                <!-- 搜索 -->
                <el-input v-model="query.title" clearable placeholder="公告题目" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
                <rrOperation :crud="crud" />
            </div>
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <!--<crudOperation :permission="permission" />-->
          <!--表单组件-->
          <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"  :title="crud.status.title" width="850px">
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px" :inline="true">
<!--              <el-form-item label="" prop="title" >-->
                <label style="text-align: center;display: block;margin-bottom: 30px;font-size: large">{{form.title}}</label>
<!--              </el-form-item>-->
<!--              <el-form-item label="" prop="content">-->
              <div style="text-align: center;display: block;margin-bottom: 30px">
                <quill-editor :options="contentQuillOption" v-model="form.content" style="margin-bottom: 50px;height: 300px;" :disabled="true"></quill-editor>
<!--              </el-form-item>-->
              </div>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button type="success" plain round @click="crud.cancelCU">关闭</el-button>
            </div>
          </el-dialog>
            <!--表格渲染-->
            <el-table tooltip-effect="dark" ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
                <el-table-column type="selection" min-width="3%"/>
                <el-table-column show-overflow-tooltip v-if="columns.visible('title')" prop="title" label="标题" min-width="30%">
                    <template slot-scope="scope">
                        <p style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" v-html="scope.row.title"></p>
                    </template>
                </el-table-column>
                <el-table-column v-if="columns.visible('effectDateFrom')" prop="effectDateFrom" label="开始时间" min-width="7%">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.effectDateFrom,"{y}-{m}-{d}") }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="columns.visible('effectDateTo')" prop="effectDateTo" label="结束时间" min-width="7%">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.effectDateTo,"{y}-{m}-{d}") }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="columns.visible('sortNo')" prop="sortNo" label="置顶" min-width="7%">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.sortNo"
                                   :active-value="0"
                                   :inactive-value="1" disabled>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" min-width="7%"/>
                <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建时间" min-width="10%">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.crtDate) }}</span>
                    </template>
                </el-table-column>
              <el-table-column v-permission="['admin','sysNotice:detail','sysNotice:edit','sysNotice:del']" label="操作" min-width="7%"  >
                <template slot-scope="scope">
                  <el-button
                      slot="left"
                      class="el-icon--left"
                      type="primary"
                      style="margin-bottom:3px !important"
                      size="mini"
                      @click="crud.toDetail(scope.row)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination />
        </div>
    </div>
</template>

<script>
    import crudSysNotice from '../../../api/indicators/notice'
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
        name: 'noticeQuery',
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
              modules: {
                toolbar: false // 禁用工具栏
              }
            },
            titleQuillOption: {
              placeholder: "请输入公告标题",
              theme: 'snow',
              modules: {
                toolbar: false // 禁用工具栏
              }
            },
                permission: {
                    /*add: ['admin', 'sysNotice:add'],
                    edit: ['admin', 'sysNotice:edit'],
                    del: ['admin', 'sysNotice:del']*/
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
      created() {
          this.resetQuery()
      },
        methods: {
          resetQuery(){
            this.crud.resetQuery(false);
            this.crud.refresh()
          },
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
