<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
            <div>
                <!-- 搜索 -->
                <el-input v-model="query.name" clearable size="small" placeholder="申请名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
                <treeselect v-model="query.deptCode" :options="depts"  style="width: 200px" size="small"  placeholder="申请部门" class="filter-item"/>
                <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 150px">
                    <el-option v-for="item in wfStatus" :key="item.id" :label="item.name" :value="item.value" />
                </el-select>
                <el-date-picker  v-model="query.periodDateInterval"  :default-time="['00:00:00','23:59:59']" type="daterange" range-separator=":" size="small"
                                 class="date-item" value-format="yyyy-MM-dd" start-placeholder="申请开始时间" end-placeholder="申请结束时间" :picker-options="pickerOptions"/>
                <!--<el-input v-model="query.userName" clearable size="small" placeholder="申请人122" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery"/>-->

                <rrOperation :crud="crud" />
            </div>
        </div>

        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" @selection-change="crud.selectionChangeHandler">
            <el-table-column type="selection" width="55" />
            <el-table-column v-if="columns.visible('ORIGINAL_INST_ID')" prop="ORIGINAL_INST_ID" label="申请编号" />
            <el-table-column v-if="columns.visible('NAME')" prop="NAME" label="申请名称" />
            <el-table-column v-if="columns.visible('dept_Name')" prop="dept_Name" width="130px" label="申请部门" />
            <el-table-column v-if="columns.visible('NICK_NAME')" prop="NICK_NAME" label="申请人"/>
            <el-table-column v-if="columns.visible('CRT_DATE')" prop="CRT_DATE" label="申请时间"/>
            <el-table-column v-if="columns.visible('STATUS_DESC')" prop="STATUS_DESC" label="状态" />

            <el-table-column label="操作" width="150px" fixed="right"   >
                <template slot-scope="scope">
                    <el-button type="primary"  @click="showDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />

        <!-- 审批链路对话框 -->
        <!--<el-dialog :close-on-click-modal="false" @close="closeApproveDetailDialog" :title="detailDialogTitle" width="80%" :visible="showApproveDetailDialog">
            <el-table :data="detailData" size="small">
                <el-table-column prop = "SEQ" min-width="10%" label="序号" />
                <el-table-column prop="NODE_NAME" min-width="13%" label="办理环节" />
                <el-table-column prop="NICK_NAME" min-width="13%" label="办理人" />
                <el-table-column prop="APPR_COMMENT" min-width="28%" label="办理意见" />
                <el-table-column prop="DURATION" min-width="18%" label="办理时效(工作日)"/>
                <el-table-column prop="END_DATE" min-width="18%" label="办理时间"/>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="closeApproveDetailDialog">取消</el-button>
            </div>
        </el-dialog>-->


        <!--表单组件-->
        <el-dialog :close-on-click-modal="false" @close="closeApproveDialog" :title="approveTitle" width="65%" :visible="formDialog">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form ref="form" :model="form" size="small" label-width="100px">

                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="display: none">
                        <el-form-item label="任务id" prop="taskId" label-width="110px">
                            <el-input v-model="form.taskId" :disabled="true" style="width: 40%;"/>
                        </el-form-item>
                    </el-col>

                    <el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="申请编号" prop="originalInstId" label-width="110px">
                                <el-input v-model="form.originalInstId" :disabled="true" style="width: 95%;"/>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="申请名称" prop="name" label-width="110px">
                                <el-input v-model="form.name" :disabled="true" style="width: 95%;"/>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="申请部门" prop="deptName" label-width="110px">
                                <el-input v-model="form.deptName" :disabled="true" style="width: 95%;"/>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="申请人" prop="nickName" label-width="110px">
                                <el-input v-model="form.nickName" :disabled="true" style="width: 95%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="申请时间" prop="crtDate" label-width="110px">
                                <el-input v-model="form.crtDate" :disabled="true" style="width: 95%;"/>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="状态" prop="status" label-width="110px">
                                <el-input v-model="form.status" :disabled="true" style="width: 95%;"/>
                            </el-form-item>
                        </el-col>
                    </el-col>




                    <el-col>
                        <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName" id="atomTabs">
                            <el-tab-pane label="指标信息" name="atomList">
                                <el-table :data="tabData" size="small">
                                    <el-table-column prop="bizCode" label="指标编码"/>
                                    <el-table-column prop="bizName" label="指标名称"/>
                                    <el-table-column label="指标分类"  align="center">
                                        <el-table-column prop="indFirstTypeName" label="一级分类"/>
                                        <el-table-column prop="indSecondTypeName" label="二级分类"/>
                                    </el-table-column>
                                    <el-table-column prop="ieProp" label="指标类型">
                                        <template slot-scope="scope">
                                            {{ dict.label.IE_PROP[scope.row.ieProp] }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="indDeployStatus" label="指标发布状态">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.indDeployStatus=='1'">未发布</span>
                                            <span v-if="scope.row.indDeployStatus=='2'">已发布</span>
                                            <span v-if="scope.row.indDeployStatus=='3'">已废止</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="businessDeptName" label="业务属主部门"/>
                                    <el-table-column prop="indVerifyStatus" label="指标审批状态">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.indVerifyStatus=='1'">草稿</span>
                                            <span v-if="scope.row.indVerifyStatus=='2'">审批中</span>
                                            <span v-if="scope.row.indVerifyStatus=='3'">拒绝</span>
                                            <span v-if="scope.row.indVerifyStatus=='4'">已通过审批</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="indVerifyId" label="审批编码"/>
                                    <el-table-column label="操作" width="80px" fixed="right">
                                        <template slot-scope="scope">
                                            <el-button slot="left" class="el-icon--left" type="info" @click="showAtomDetail(scope.row)">
                                                详情
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="审批链路"  name="vertifylink">
                                <el-table :data="detailData" size="small">
                                    <el-table-column prop = "SEQ" min-width="10%" label="序号" />
                                    <el-table-column prop="NODE_NAME" min-width="13%" label="办理环节" />
                                    <el-table-column prop="NICK_NAME" min-width="13%" label="办理人" />
                                    <el-table-column prop="APPR_COMMENT" min-width="28%" label="办理意见" />
                                    <el-table-column prop="DURATION" min-width="18%" label="办理时效(工作日)"/>
                                    <el-table-column prop="END_DATE" min-width="18%" label="办理时间"/>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>

                    <el-col>
                        <el-tabs type="border-card">
                            <el-tab-pane label="新增维度信息">
                                <el-table :data="dimData" size="small">
                                    <el-table-column prop="indId" label="指标编码"/>
                                    <el-table-column prop="indName" label="指标名称"/>
                                    <el-table-column prop="dimClassName"  label="维度分类" />
                                    <el-table-column prop="dimName" label="维度名称"/>
                                    <el-table-column prop="diomValName1"  label="一级维度值" />
                                    <el-table-column prop="diomValName2"  label="二级维度值" />
                                    <el-table-column prop="diomValName3"  label="三级维度值" />
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>

                </el-form>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <!--              <el-button  type="text" @close="closeApproveDialog">关闭</el-button>-->
                <el-button type="text" @close="closeApproveDialog"></el-button>
            </div>
        </el-dialog>
        <atomPage ref="atomPage"/>

    </div>
</template>

<script>
    import {appliedProcess, approveDetail} from '@/api/workflow/applyProcess'
    import request from '@/utils/request'
    import qs from 'qs'
    import CRUD, {presenter, header, form, crud} from '@crud/crud'
    import rrOperation from '@crud/RR.operation'
    import crudOperation from '@crud/CRUD.operation'
    import pagination from '@crud/Pagination'
    import { getDepts } from '@/utils/system'
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import  {getDimensions,getAtomListByIds,getDimListByIeIds,getAtomListByVerifyNo} from '@/api/indicators/indAtomInfo'
    import {getAllSource, getDimInfo} from '@/api/indicators/indIndicatorInfo'
    import atomPage from '../indicator/atom/atomPage';

    // crud交由presenter持有
    const defaultCrud = CRUD({
        title: '我的申请',
        url:  'workflow/myTask/appliedProcess',
        crudMethod: {appliedProcess, approveDetail }
    })

    const defaultForm = {
        userName: null,
        name: null,
        deptCode: null,
        status: null,
        periodDateInterval:null
    }

    export default {
        name: "applyProcess",
        components: {pagination,  crudOperation,  rrOperation, Treeselect, atomPage},
        mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
        dicts: ['IE_PROP'],
        data () {
            return {
                showApproveDetailDialog: false,
                detailDialogTitle : '审批链路',
                detailData : [],

                permission: {
                    startUsing: ['admin', 'applyProcess:approveDetail']
                },
                wfStatus : [
                    {name : "运行", value : "0"},{name : "结束", value : "1"}
                ],

                depts: [], //机构树
                pickerMinDate: "", //第一次选中的时间
                //pickerMaxDate : "", //第二次选中的时间
                pickerOptions: {
                    onPick: obj => {
                        this.pickerMinDate = new Date(obj.minDate).getTime();
                        //console.log("times===>," + this.pickerTimes + ", pickerMinDate==>" + this.pickerMinDate)
                        this.pickerMaxDate = new Date(obj.maxDate).getTime();
                    },
                    disabledDate: time => {
                        if (this.pickerMinDate) {
                            const day1 = 366 * 24 * 3600 * 1000;
                            let maxTime = this.pickerMinDate + day1;
                            let minTime = this.pickerMinDate - day1;
                            return time.getTime() > maxTime || time.getTime() < minTime;
                        }
                    }
                },

                //审批详情组建
                formDialog: false,
                approveTitle: '详情',
                tabData : [],
                dimData: [],
                activeName : 'atomList'

            }
        },
      created(){
          this.resetQuery()
      },
        mounted() {
            this.getDepts();
            /*defaultCrud.refresh()*/
        },
        methods : {
          resetQuery(){
            this.crud.resetQuery(false);
            this.crud.refresh()
          },
            // 获取数据前设置好接口地址
            [CRUD.HOOK.beforeRefresh]() {
                return true
            },
            showDetail (row) {

                /*request({
                   // url: '/workflow/myTask/approveDetail' + '?' + qs.stringify({originalInstId:row.ORIGINAL_INST_ID}),
                    url: '/workflow/myTask/approveDetail',
                    method: 'post',
                    data : {originalInstId:row.ORIGINAL_INST_ID}
                }).then(res => {
                    debugger;
                      console.log(res.content)
                })*/

                /*approveDetail(qs.stringify({originalInstId:row.ORIGINAL_INST_ID})).then(res => {
                    //打开审批链路详情
                    this.showApproveDetailDialog = true
                    this.detailData = res.data
                })*/

                this.formDialog = true
                this.activeName = 'atomList'
                this.form.taskId = row.TASK_ID
                this.form.originalInstId = row.ORIGINAL_INST_ID
                this.form.name = row.NAME
                this.form.deptName = row.DEPT_NAME
                this.form.nickName = row.NICK_NAME
                this.form.crtDate = row.CRT_DATE
                this.form.status = '审批中'
                this.form.businessKey = row.BUSINESS_KEY
                //this.getAtomListByIds();
                this.getAtomListByVerifyNo();
                this.getDimListByIeIds();

            },

            closeApproveDetailDialog() {
                this.showApproveDetailDialog = false
            },

            getDepts() {
                getDepts({ enabled: true }).then(res => {
                    this.depts = res.content
                })
            },

            closeApproveDialog() {
                this.formDialog = false
                this.form.apprComment = ''
                this.detailData = []

            },
            handleClick(tab, event) {
                if(tab.index == '0') {//
                    //this.getAtomListByIds();
                    this.getAtomListByVerifyNo();
                    this.getDimListByIeIds();
                } else if (tab.index == '1') {
                    this.approveDetail();
                }
                //console.log(tab, event);
            },
            getAtomListByIds() {
                getAtomListByIds(this.form.businessKey).then(res => {
                    if(res.code == 0) {
                        this.tabData = res.data;
                    }
                })
            },
            getAtomListByVerifyNo() {
              getAtomListByVerifyNo(this.form.originalInstId).then(res => {
                if(res.code == 0) {
                  this.tabData = res.data;
                }
              });
            },
            approveDetail() {
                approveDetail(qs.stringify({originalInstId:this.form.originalInstId})).then(res => {
                    this.detailData = res.data
                })
            },
            showAtomDetail(data) {
                const _thisAtom = this.$refs.atomPage
                _thisAtom.form = data
                _thisAtom.title = data.bizName + '[' + data.bizCode + ']详情'
                const param = {
                    bizCode: data.bizCode,
                    keepHistory: data.keepHistory
                }
                getDimensions(param).then(data => {
                    _thisAtom.atomDimensions = data.data
                })
                getDimInfo().then(data => {
                    _thisAtom.dimensions = data.data
                })
                // 获取数据源
                getAllSource().then(data => {
                    _thisAtom.sourceData = [{ id: 'local', datasourceName: '默认数据源' }].concat(data.data)
                })

              _thisAtom.form.currency = data.currency == null ? null : Array.isArray(data.currency) ? data.currency : data.currency.split(",")
              _thisAtom.form.indValueType = data.indValueType
              _thisAtom.form.indFrequency = data.indFrequency == null ? null : Array.isArray(data.indFrequency) ? data.indFrequency : data.indFrequency.split(",")

              _thisAtom.dimAndValueObject1.isShow = data.indDimAndValueRelations.length == 0 ?
                  false : data.indDimAndValueRelations[0]==null? false : true
              _thisAtom.dimAndValueObject1.dimension = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[0]==null? null : data.indDimAndValueRelations[0].dimension
              _thisAtom.dimAndValueObject1.dimensionValue = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[0]==null? null : data.indDimAndValueRelations[0].dimensionValue
              _thisAtom.dimAndValueObject1.dimensionName = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[0]==null? null : data.indDimAndValueRelations[0].dimensionName

              _thisAtom.dimAndValueObject2.isShow = data.indDimAndValueRelations.length == 0 ?
                  false : data.indDimAndValueRelations[1]==null? false : true
              _thisAtom.dimAndValueObject2.dimension = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[1]==null? null : data.indDimAndValueRelations[1].dimension
              _thisAtom.dimAndValueObject2.dimensionValue = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[1]==null? null : data.indDimAndValueRelations[1].dimensionValue
              _thisAtom.dimAndValueObject2.dimensionName = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[1]==null? null : data.indDimAndValueRelations[1].dimensionName

              _thisAtom.dimAndValueObject3.isShow = data.indDimAndValueRelations.length == 0 ?
                  false : data.indDimAndValueRelations[2]==null? false : true
              _thisAtom.dimAndValueObject3.dimension = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[2]==null? null : data.indDimAndValueRelations[2].dimension
              _thisAtom.dimAndValueObject3.dimensionValue = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[2]==null? null : data.indDimAndValueRelations[2].dimensionValue
              _thisAtom.dimAndValueObject3.dimensionName = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[2]==null? null : data.indDimAndValueRelations[2].dimensionName

              _thisAtom.dimAndValueObject4.isShow = data.indDimAndValueRelations.length == 0 ?
                  false : data.indDimAndValueRelations[3]==null? false : true
              _thisAtom.dimAndValueObject4.dimension = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[3]==null? null : data.indDimAndValueRelations[3].dimension
              _thisAtom.dimAndValueObject4.dimensionValue = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[3]==null? null : data.indDimAndValueRelations[3].dimensionValue
              _thisAtom.dimAndValueObject4.dimensionName = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[3]==null? null : data.indDimAndValueRelations[3].dimensionName

              _thisAtom.dimAndValueObject5.isShow = data.indDimAndValueRelations.length == 0 ?
                  false : data.indDimAndValueRelations[4]==null? false : true
              _thisAtom.dimAndValueObject5.dimension = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[4]==null? null : data.indDimAndValueRelations[4].dimension
              _thisAtom.dimAndValueObject5.dimensionValue = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[4]==null? null : data.indDimAndValueRelations[4].dimensionValue
              _thisAtom.dimAndValueObject5.dimensionName = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[4]==null? null : data.indDimAndValueRelations[4].dimensionName

              _thisAtom.dimAndValueObject6.isShow = data.indDimAndValueRelations.length == 0 ?
                  false : data.indDimAndValueRelations[5]==null? false : true
              _thisAtom.dimAndValueObject6.dimension = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[5]==null? null : data.indDimAndValueRelations[5].dimension
              _thisAtom.dimAndValueObject6.dimensionValue = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[5]==null? null : data.indDimAndValueRelations[5].dimensionValue
              _thisAtom.dimAndValueObject6.dimensionName = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[5]==null? null : data.indDimAndValueRelations[5].dimensionName

              _thisAtom.dimAndValueObject7.isShow = data.indDimAndValueRelations.length == 0 ?
                  false : data.indDimAndValueRelations[6]==null? false : true
              _thisAtom.dimAndValueObject7.dimension = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[6]==null? null : data.indDimAndValueRelations[6].dimension
              _thisAtom.dimAndValueObject7.dimensionValue = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[6]==null? null : data.indDimAndValueRelations[6].dimensionValue
              _thisAtom.dimAndValueObject7.dimensionName = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[6]==null? null : data.indDimAndValueRelations[6].dimensionName

              _thisAtom.dimAndValueObject8.isShow = data.indDimAndValueRelations.length == 0 ?
                  false : data.indDimAndValueRelations[7]==null? false : true
              _thisAtom.dimAndValueObject8.dimension = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[7]==null? null : data.indDimAndValueRelations[7].dimension
              _thisAtom.dimAndValueObject8.dimensionValue = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[7]==null? null : data.indDimAndValueRelations[7].dimensionValue
              _thisAtom.dimAndValueObject8.dimensionName = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[7]==null? null : data.indDimAndValueRelations[7].dimensionName

              _thisAtom.dimAndValueObject9.isShow = data.indDimAndValueRelations.length == 0 ?
                  false : data.indDimAndValueRelations[8]==null? false : true
              _thisAtom.dimAndValueObject9.dimension = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[8]==null? null : data.indDimAndValueRelations[8].dimension
              _thisAtom.dimAndValueObject9.dimensionValue = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[8]==null? null : data.indDimAndValueRelations[8].dimensionValue
              _thisAtom.dimAndValueObject9.dimensionName = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[8]==null? null : data.indDimAndValueRelations[8].dimensionName

              _thisAtom.dimAndValueObject10.isShow = data.indDimAndValueRelations.length == 0 ?
                  false : data.indDimAndValueRelations[9]==null? false : true
              _thisAtom.dimAndValueObject10.dimension = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[9]==null? null : data.indDimAndValueRelations[9].dimension
              _thisAtom.dimAndValueObject10.dimensionValue = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[9]==null? null : data.indDimAndValueRelations[9].dimensionValue
              _thisAtom.dimAndValueObject10.dimensionName = data.indDimAndValueRelations.length == 0 ?
                  null : data.indDimAndValueRelations[9]==null? null : data.indDimAndValueRelations[9].dimensionName

              let defRule = data.indDefRule;
              if (defRule != null) {
                let defRuleArr = defRule.split("||");
                if (Array.isArray(defRuleArr) && defRuleArr.length >= 2) {
                  _thisAtom.form.indDefRule = defRuleArr[0]
                } else {
                  _thisAtom.form.indDefRule = defRule;
                }
              }
              _thisAtom.form.indDefRuleStr = data.indDefRuleStr;
              _thisAtom.indDefRuleStr = data.indDefRuleStr;
              if(_thisAtom.indDefRuleStr == null || _thisAtom.indDefRuleStr == '') {
                this.isSelfRule = true
              } else {
                this.isSelfRule = false
              }
              if(data.indDefRuleVal !=null && data.indDefRuleVal != "") {
                _thisAtom.form.indDefRuleVal = data.indDefRuleVal;
                _thisAtom.form.indDefRuleId = data.indDefRuleId;
                _thisAtom.indDefRuleVal = data.indDefRuleVal;
                _thisAtom.indDefRuleId = data.indDefRuleId;
              } else {
                if (defRule != null) {
                  let defRuleArr = defRule.split("||");
                  if (Array.isArray(defRuleArr) && defRuleArr.length >= 2) {
                    _thisAtom.form.indDefRuleVal = defRuleArr[1];
                    _thisAtom.form.indDefRuleId = defRuleArr[2];
                    _thisAtom.indDefRuleVal = defRuleArr[1];
                    _thisAtom.indDefRuleId = defRuleArr[2];
                  }
                }
              }
                /* _this.bizCode = data.bizCode*/
                _thisAtom.atomPageDialog = true
            },
            getDimListByIeIds() {
                getDimListByIeIds(this.form.businessKey).then(res => {
                    if(res.code == 0) {
                        this.dimData = res.data;
                    }
                })
            }


        }
    }
</script>

<style scoped lang="scss">
// 申请部门treeselect横向滚动条
::v-deep {
  .vue-treeselect__menu {
    overflow-x: auto !important;
    //width: 200px;
  }

  .vue-treeselect__label {
    overflow: unset;
    text-overflow: unset;
  }

  .vue-treeselect__control {
    height: 28.5px !important;
    width: 198px;
    padding: 0;
  }

  .vue-treeselect__multi-value-item-container,
  .vue-treeselect--has-value .vue-treeselect__multi-value {
    height: 30.5px;
    line-height: 30.5px;
    padding: 0;
  }

  .vue-treeselect__limit-tip,
  .vue-treeselect--searchable.vue-treeselect--multi.vue-treeselect--has-value
  .vue-treeselect__input-container {
    padding-top: 0;
  }

  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    height: 30.5px;
    line-height: 30.5px;
    font-size: small;
  }

  .vue-treeselect--has-value .vue-treeselect__input {
    height: 18px !important;
    line-height: 18px !important;
  }

  .vue-treeselect div,
  .vue-treeselect span {
    box-sizing: content-box;
  }

  .vue-treeselect__multi-value-label {
    display: block;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .vue-treeselect__value-container {
    display: block;
    height: 30.5px;
  }
}
</style>


