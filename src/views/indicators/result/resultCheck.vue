<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
            <div>
                <!-- 搜索 -->
                <el-input v-model="query.name" clearable size="small" placeholder="指标名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
                <el-date-picker  v-model="query.checkData"  type="date"  size="small" filterable clearable placeholder="校验日期"
                                 class="date-item" value-format="yyyy-MM-dd"  />

                <rrOperation :crud="crud" />
            </div>
            <crudOperation :permission="permission" />



            <!--<span class="crud-opts-left">
                  &lt;!&ndash;左侧插槽&ndash;&gt;
                  <slot name="left" />
                  <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-plus"
                          @click="crud.toAdd"
                  >
                    新增
                  </el-button>

                <el-button
                        v-permission="permission.edit"
                        class="filter-item"
                        type="success"
                        icon="el-icon-edit"
                        :disabled="crud.selections.length !== 1"
                        @click="crud.toEdit(crud.selections[0])"
                    >
                    修改
                  </el-button>
                  <el-button
                          slot="reference"
                          v-permission="permission.del"
                          class="filter-item"
                          type="danger"
                          icon="el-icon-delete"
                          :loading="crud.delAllLoading"
                          :disabled="crud.selections.length === 0"
                          @click="toDelete(crud.selections)"
                  >
                    删除
                  </el-button>

            </span>-->



        </div>

        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" @selection-change="crud.selectionChangeHandler">
            <el-table-column type="selection" width="55" />
            <el-table-column v-if="false" prop="id" label="主键" />
            <el-table-column v-if="columns.visible('ie_code')" prop="ie_code" label="指标编码" />
            <el-table-column v-if="columns.visible('ie_name')" prop="ie_name" label="指标名称 | 计算公式1" />
            <el-table-column v-if="columns.visible('compare_symbol')" prop="compare_symbol" label="比较符" />
            <el-table-column v-if="columns.visible('fix_val')" prop="fix_val" label="定量值 | 计算公式2"/>
            <el-table-column prop="check_type" label="校验类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.check_type=='0'">定量比较</span>
                    <span v-if="scope.row.check_type=='1'">四则运算结果比较</span>
                </template>
            </el-table-column>
            <el-table-column prop="resultFlag" label="校验结果">
                <template slot-scope="scope">
                    <span v-if="scope.row.resultFlag=='1'">通过</span>
                    <span v-if="scope.row.resultFlag=='0'">未通过</span>
                </template>
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />

        <!-- 新增对话框 -->
        <el-dialog :close-on-click-modal="false" @close="closeApproveDetailDialog" :title="detailDialogTitle" width="50%" :visible="showDetailDialog">
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane label="定量校验" name="first" :disabled="firstDisabled">
                    <el-form ref="fixForm" :rules="fixRules" :model="checkForm" size="small" label-width="80px">
                        <!--  style="display: none"   -->
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="display: none">
                            <el-form-item label="主键id" prop="id" label-width="110px">
                                <el-input v-model="checkForm.id" :disabled="true" style="width: 40%;"/>
                            </el-form-item>
                        </el-col>

                        <el-form-item label="指标" prop="code">
                            <el-select v-model="checkForm.code" placeholder="请选择" filterable value-key="id" @change="selectFixInd" @input="onInput()" style="width: 95%;">
                                <el-option
                                        v-for="item in transferData"
                                        :key="item.key"
                                        :label="item.label"
                                        :value="item.key"/>
                            </el-select>


                            <!--<el-input v-model="checkForm.name" @input="onInput()"></el-input>

                            <el-button
                                    class="filter-item"
                                    type="primary"
                                    size="mini"
                                    icon="el-icon-monitor"
                                    @click="showIndDefRuleDialogFix"
                            >指标
                            </el-button>-->

                        </el-form-item>

                        <el-form-item label="机构" prop="fixOrgCode">
                            <treeselect v-model="checkForm.fixOrgCode" :options="resultDepts"  style="width: 95%" size="small"  placeholder="选择机构" class="filter-item"/>
                        </el-form-item>
                        <el-form-item label="币种" prop="fixCurrency">
                            <el-select v-model="checkForm.fixCurrency" placeholder="请选择" @input="onInput()" style="width: 95%;">
                                <el-option
                                        v-for="item in dict.IND_CURRENCY"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.value"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="指标频率" prop="fixIndFrequency">
                            <el-select v-model="checkForm.fixIndFrequency" placeholder="请选择" @input="onInput()" style="width: 95%;">
                                <el-option
                                        v-for="item in dict.IE_FREQUENCY"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.value"/>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="比较符" prop="compareSymbol">
                            <!--<el-input v-model="checkForm.compareSymbol" @input="onInput()">-->

                                <el-select v-model="checkForm.compareSymbol" @input="onInput()" placeholder="请选择" style="width: 95%;">
                                    <el-option
                                            v-for="item in compareSymbolArr"
                                            :key="item.id"
                                            :value="item.value"
                                    />
                                </el-select>


                            <!--</el-input>-->
                        </el-form-item>
                        <el-form-item label="定量值" prop="fixVal">
                            <el-input type="number" v-model="checkForm.fixVal" @input="onInput()"></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="四则运算结果校验" name="second" :disabled="secondDisabled">
                    <el-form ref="formulaForm" :model="checkForm" size="small" label-width="90px">

                        <el-form-item  prop="formulaOne">
                            <span slot="label">
                                <span style="color: red">*</span>
                                <label>计算公式1</label>
                            </span>

                            <el-input v-model="checkForm.formulaOne" :class="[ruleTipShow.formulaOne?'error-border':'']" @input="onInput()" ></el-input>

                            <div>
                                <p class="rule-tip-show el-form-item__error" v-show="ruleTipShow.formulaOne">计算公式不能为空</p>
                            </div>

                            <el-button class="filter-item"
                                       type="primary"
                                       size="mini"
                                       icon="el-icon-delete-solid"
                                       @click="clearFormulaOne">清空</el-button>
                            <el-button type="info"  @click="indDefRulePlus">+</el-button>
                            <el-button type="info"  @click="indDefRuleSubtraction">-</el-button>
                            <el-button type="info"  @click="indDefRuleMultiplication">×</el-button>
                            <el-button type="info"  @click="indDefRuleDivision">/</el-button>
                            <el-button type="info"  @click="indDefRuleLP">(</el-button>
                            <el-button type="info"  @click="indDefRuleRP">)</el-button>
                            <el-button
                                    class="filter-item"
                                    type="primary"
                                    size="mini"
                                    icon="el-icon-monitor"
                                    @click="showIndDefRuleDialog"
                            >指标
                            </el-button>

                        </el-form-item>

                        <el-form-item prop="formulaOrgCode">

                            <span slot="label">
                                <span style="color: red">*</span>
                                <label>机构</label>
                            </span>

                            <treeselect v-model="checkForm.formulaOrgCode" :options="resultDepts"  style="width: 95%" size="small"  placeholder="选择机构" :class="[ruleTipShow.formulaOrgCode?'filter-item error-border':'filter-item']"/>
                            <div>
                                <p class="rule-tip-show el-form-item__error" v-show="ruleTipShow.formulaOrgCode">机构不能为空</p>
                            </div>

                        </el-form-item>

                        <el-form-item prop="formulaCurrency">
                            <span slot="label">
                                <span style="color: red">*</span>
                                <label>币种</label>
                            </span>


                            <el-select v-model="checkForm.formulaCurrency" filterable clearable placeholder="请选择" @input="onInput()" style="width: 95%;" :class="[ruleTipShow.formulaCurrency?'error-border':'']">
                                <el-option
                                        v-for="item in dict.IND_CURRENCY"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.value"/>
                            </el-select>

                            <div>
                                <p class="rule-tip-show el-form-item__error" v-show="ruleTipShow.formulaCurrency">币种不能为空</p>
                            </div>

                        </el-form-item>
                        <el-form-item prop="formulaIndFrequency">

                            <span slot="label">
                                <span style="color: red">*</span>
                                <label>指标频率</label>
                            </span>

                            <el-select v-model="checkForm.formulaIndFrequency" filterable clearable placeholder="请选择" @input="onInput()" style="width: 95%;" :class="[ruleTipShow.formulaIndFrequency?'error-border':'']">
                                <el-option
                                        v-for="item in dict.IE_FREQUENCY"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.value"/>
                            </el-select>

                            <div>
                                <p class="rule-tip-show el-form-item__error" v-show="ruleTipShow.formulaIndFrequency">指标频率不能为空</p>
                            </div>

                        </el-form-item>

                        <el-form-item prop="formulaCompareSymbol">
                            <span slot="label">
                                <span style="color: red">*</span>
                                <label>比较符</label>
                            </span>
                            <!--<el-input v-model="checkForm.formulaCompareSymbol" @input="onInput()"></el-input>-->
                            <el-select v-model="checkForm.formulaCompareSymbol" @input="onInput()" placeholder="请选择" style="width: 95%;" :class="[ruleTipShow.formulaCompareSymbol?'error-border':'']">
                                <el-option
                                        v-for="item in compareSymbolArr"
                                        :key="item.id"
                                        :value="item.value"
                                />
                            </el-select>

                            <div>
                                <p class="rule-tip-show el-form-item__error" v-show="ruleTipShow.formulaCompareSymbol">比较符不能为空</p>
                            </div>
                        </el-form-item>
                        <el-form-item prop="formulaTwo">
                            <span slot="label">
                                <span style="color: red">*</span>
                                <label>计算公式2</label>
                            </span>
                            <el-input v-model="checkForm.formulaTwo" @input="onInput()" :class="[ruleTipShow.formulaTwo?'error-border':'']"></el-input>

                            <div>
                                <p class="rule-tip-show el-form-item__error" v-show="ruleTipShow.formulaTwo">计算公式不能为空</p>
                            </div>

                            <el-button class="filter-item"
                                       type="primary"
                                       size="mini"
                                       icon="el-icon-delete-solid"
                                       @click="clearFormulaTwo">清空</el-button>
                            <el-button type="info"  @click="indDefRulePlusTwo">+</el-button>
                            <el-button type="info"  @click="indDefRuleSubtractionTwo">-</el-button>
                            <el-button type="info"  @click="indDefRuleMultiplicationTwo">×</el-button>
                            <el-button type="info"  @click="indDefRuleDivisionTwo">/</el-button>
                            <el-button type="info"  @click="indDefRuleLPTwo">(</el-button>
                            <el-button type="info"  @click="indDefRuleRPTwo">)</el-button>
                            <el-button
                                    class="filter-item"
                                    type="primary"
                                    size="mini"
                                    icon="el-icon-monitor"
                                    @click="showIndDefRuleDialogTwo"
                            >指标
                            </el-button>



                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
              <el-button type="success" plain round @click="closeApproveDetailDialog">取消</el-button>
              <el-button type="success" round @click="saveCheckForm()">提交</el-button>
            </div>
        </el-dialog>


        <!--     四则运算指标口径规则     -->
        <el-dialog :close-on-click-modal="false" @close="closeIndDefRuleDialog" title="四则运算指标口径规则" width="50%" :visible="showIndDefRule">
            <div style="text-align: center">
                <el-transfer
                        style="text-align: left; display: inline-block"
                        filterable
                        v-model="value"
                        :render-content="renderFunc"
                        :titles="['源', '目标']"
                        :format="{
                              noChecked: '${total}',
                              hasChecked: '${checked}/${total}'
                            }"
                        @change="handleChange"
                        :data="transferData">
                </el-transfer>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" round @click="selectInd">确认</el-button>
            </div>
        </el-dialog>



        <el-dialog :close-on-click-modal="false" @close="closeIndDefRuleDialogTwo" title="四则运算指标口径规则" width="50%" :visible="showIndDefRuleTwo">
            <div style="text-align: center">
                <el-transfer
                        style="text-align: left; display: inline-block"
                        filterable
                        v-model="valueTwo"
                        :render-content="renderFunc"
                        :titles="['源', '目标']"
                        :format="{
                              noChecked: '${total}',
                              hasChecked: '${checked}/${total}'
                            }"
                        @change="handleChangeTwo"
                        :data="transferData">
                </el-transfer>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" round @click="selectIndTwo">确认</el-button>
            </div>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" @close="closeIndDefRuleDialogFix" title="定量指标口径规则" width="50%" :visible="showIndDefRuleFix">
            <div style="text-align: center">
                <el-transfer
                        style="text-align: left; display: inline-block"
                        filterable
                        v-model="valueFix"
                        :render-content="renderFunc"
                        :titles="['源', '目标']"
                        :format="{
                              noChecked: '${total}',
                              hasChecked: '${checked}/${total}'
                            }"
                        @change="handleChangeFix"
                        :data="transferData">
                </el-transfer>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" round @click="selectIndFix">确认</el-button>
            </div>
        </el-dialog>



    </div>
</template>

<script>
    import {getCheckList, saveCheckData, deleteCheckData, getResultDepts} from '@/api/indicators/indResultSubscribe'
    import qs from 'qs'
    import CRUD, {presenter, header, form, crud} from '@crud/crud'
    import rrOperation from '@crud/RR.operation'
    import crudOperation from '@crud/CRUD.operation'
    import pagination from '@crud/Pagination'
    import crudIndAtomInfo, {
        getColumnByTabel,
        getDimensions,
        getGenAndDerivedInd,
        getAllInds,
        getGenInd,
        getTablesById, bizNameIsContract, approveDetailByBusinessKey, abolish,startProcess,delAtom,getHisList
    } from '@/api/indicators/indAtomInfo'
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    String.prototype.replaceAll = function(s1,s2){
      return this.replace(new RegExp(s1,"gm"),s2);
    }
    const defaultCrud = CRUD({
        title: '指标加工结果校验',
        url:  'v1/indicators/result/atom/getCheckList',
        loading : true,
        crudMethod: {getCheckList }
    })

    const defaultForm = {
        name: null,
        checkData:null
    }


    export default {
        name: "resultCheck",
        components: {pagination,  crudOperation,  rrOperation, Treeselect},
        mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
        dicts: ['IND_CURRENCY', 'IE_FREQUENCY'],
        data() {
            return {
                permission: {
                    add: ['admin', 'resultCheck:add'],
                    edit: ['admin', 'resultCheck:edit'],
                    del: ['admin', 'resultCheck:del']
                },
                activeName: 'first',
                showDetailDialog: false,
                detailDialogTitle : '新增|编辑',
                firstDisabled : false,
                secondDisabled : false,
                resultDepts: [],

                checkForm : { formulaOne : '', formulaOneExp : '' ,formulaTwo : '', formulaTwoExp : '', name : '', code : ''},
                showIndDefRule: false,
                value: [],
                valueLable : [],
                transferData: [],
                renderFunc(h, option) {
                    return <span>{ option.label }</span>;
                },
                genAndDerivedIndArr: [],
                compareSymbolArr: [
                    {id:"0", value: ">"},
                    {id:"1", value: ">="},
                    {id:"2", value: "<"},
                    {id:"3", value: "<="},
                    {id:"4", value: "="},
                    {id:"5", value: "≠"}
                ],

                showIndDefRuleTwo : false,
                valueTwo: [],
                valueLableTwo : [],

                valueFix : [],
                valueLableFix : [],
                showIndDefRuleFix : false,

                fixRules: {
                    code: [
                        { required: true, message: '指标不能为空', trigger: 'blur' }
                    ],
                    fixOrgCode: [
                        { required: true, message: '机构不能为空', trigger: 'blur' }
                    ],
                    fixCurrency: [
                        { required: true, message: '币种不能为空', trigger:  'blur' }
                    ],
                    fixIndFrequency: [
                        { required: true, message: '指标频率不能为空', trigger:  'blur' }
                    ],
                    compareSymbol: [
                        { required: true, message: '比较符不能为空', trigger: 'blur'}
                    ],
                    fixVal: [
                        { required: true, message: '定量值是数值且不能为空', trigger: 'blur' }
                    ]
                },
                //是否显示错误信息
                ruleTipShow:{
                    formulaOne:false,
                    formulaOrgCode:false,
                    formulaCurrency:false,
                    formulaIndFrequency:false,
                    formulaCompareSymbol:false,
                    formulaTwo:false,
                },
                formulaRules: {
                    formulaOne: [
                        { required: true, message: '计算公式不能为空', trigger: 'blur' }
                    ],
                    formulaOrgCode: [
                        { required: true, message: '机构不能为空', trigger: 'blur' }
                    ],
                    formulaCurrency: [
                        { required: true, message: '币种不能为空', trigger:  'blur' }
                    ],
                    formulaIndFrequency: [
                        { required: true, message: '指标频率不能为空', trigger:  'blur' }
                    ],
                    formulaCompareSymbol: [
                        { required: true, message: '比较符不能为空', trigger: 'blur'}
                    ],
                    formulaTwo: [
                        { required: true, message: '计算公式不能为空', trigger: 'blur' }
                    ]
                }



            }
        },
        created() {
            //this.crud.optShow.del=false
            //this.crud.optShow.edit=false
            //this.initDimInfos()
            //this.initDimValuesChildren()
           // this.initDimValues()
            //this.initClassifications()
            this.initGenAndDerivedInd()
            //this.initIndFirstType()
            //this.getDepts();
            this.getResultDepts();
            this.resetQuery()
        },
        methods :{
          resetQuery(){
            this.crud.resetQuery(false);
            this.crud.refresh()
          },
            [CRUD.HOOK.beforeRefresh]() {
                this.crud.optShow.del = true
                this.crud.optShow.add = true
                this.crud.optShow.edit = true
                return true
            },


            [CRUD.HOOK.beforeToAdd]() {
                this.showDetailDialog = true;

                this.activeName = 'first'
                this.firstDisabled = false;
                this.secondDisabled = false;

            },
            [CRUD.HOOK.beforeToEdit]() {

                this.$nextTick(() => {
                    this.$refs.fixForm.clearValidate();
                })
                /*this.$nextTick(() => {
                    this.$refs.formulaForm.clearValidate();
                })*/


                this.showDetailDialog = true;
                this.valueLable = [];
                this.valueLableTwo = [];
                if(this.crud.selections[0].check_type == '0') {
                    //定量
                    this.activeName = 'first'
                    this.firstDisabled = false;
                    this.secondDisabled = true;

                    this.checkForm.checkType = this.crud.selections[0].check_type
                    this.checkForm.id = this.crud.selections[0].id
                    this.checkForm.code = this.crud.selections[0].ie_code
                    this.checkForm.name = this.crud.selections[0].ie_name
                    this.checkForm.compareSymbol = this.crud.selections[0].compare_symbol
                    this.checkForm.fixVal = this.crud.selections[0].fix_val

                    this.checkForm.fixCurrency = this.crud.selections[0].ind_currency
                    this.checkForm.fixOrgCode = this.crud.selections[0].ind_dept_code
                    this.checkForm.fixIndFrequency = this.crud.selections[0].ind_frequency

                } else if (this.crud.selections[0].check_type == '1') {
                    this.activeName = 'second'
                    this.firstDisabled = true;
                    this.secondDisabled = false;

                    this.checkForm.checkType = this.crud.selections[0].check_type
                    this.checkForm.id = this.crud.selections[0].id
                    //this.checkForm.code = this.crud.selections[0].ie_code
                    this.checkForm.formulaOne = this.crud.selections[0].ie_name
                    this.checkForm.formulaCompareSymbol = this.crud.selections[0].compare_symbol
                    this.checkForm.formulaTwo = this.crud.selections[0].fix_val

                    this.checkForm.formulaOneExp = this.crud.selections[0].formula_one_exp
                    this.checkForm.formulaTwoExp = this.crud.selections[0].formula_two_exp

                    this.checkForm.formulaCurrency = this.crud.selections[0].ind_currency
                    this.checkForm.formulaOrgCode = this.crud.selections[0].ind_dept_code
                    this.checkForm.formulaIndFrequency = this.crud.selections[0].ind_frequency
                }
            },
            [CRUD.HOOK.beforeDelete]() {
                var selectIds = "";
                for (let items of this.crud.selections) {
                    if (items.id != '') {
                        selectIds += items.id + ",";
                    }
                }

                deleteCheckData(qs.stringify({ids : selectIds})).then(res => {
                    if (res.code == '0') {
                        this.$message({
                            type: 'success',
                            message: '操作成功 '
                        })
                    }
                    this.crud.refresh();
                })

                return false;
            },
            closeApproveDetailDialog() {
                this.showDetailDialog = false
                this.activeName = 'first'
                this.checkForm = { }
            },
            handleClick(tab, event) {
                console.log("=====" + tab, event);
            },
            saveCheckForm(){
                var checkParam = {};
                checkParam.id = this.checkForm.id
                if (this.activeName == 'first') {

                    checkParam.code = this.checkForm.code
                    checkParam.name = this.checkForm.name
                    checkParam.compareSymbol = this.checkForm.compareSymbol
                    checkParam.fixVal = this.checkForm.fixVal
                    checkParam.checkType = '0'

                    checkParam.indDeptCode = this.checkForm.fixOrgCode
                    checkParam.indCurrency = this.checkForm.fixCurrency
                    checkParam.indFrequency = this.checkForm.fixIndFrequency
                } else {
                    checkParam.formulaOne = this.checkForm.formulaOne
                    checkParam.formulaOneExp = this.checkForm.formulaOneExp
                    checkParam.formulaTwo = this.checkForm.formulaTwo
                    checkParam.formulaTwoExp = this.checkForm.formulaTwoExp
                    checkParam.formulaCompareSymbol = this.checkForm.formulaCompareSymbol
                    checkParam.checkType = '1'

                    checkParam.indDeptCode = this.checkForm.formulaOrgCode
                    checkParam.indCurrency = this.checkForm.formulaCurrency
                    checkParam.indFrequency = this.checkForm.formulaIndFrequency
                }

                if (this.activeName == 'first') {
                    this.$refs["fixForm"].validate(valid => {
                        if (!valid) {
                            return
                        }
                        saveCheckData(qs.stringify(checkParam)).then(res => {
                            if (res.code == '0') {
                                this.$message({
                                    type: 'success',
                                    message: '操作成功 '
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '操作失败 ' + res.msg
                                })
                            }
                            this.closeApproveDetailDialog();
                            this.crud.refresh()
                        })
                    })
                } else {
    console.log("checkParam",checkParam)

                    this.ruleTipShow={
                        formulaOne:false,
                        formulaOrgCode:false,
                        formulaCurrency:false,
                        formulaIndFrequency:false,
                        formulaCompareSymbol:false,
                        formulaTwo:false,
                    }

                    let flag=true;//校验是否通过
                    if(!checkParam.formulaOne){
                        this.ruleTipShow.formulaOne=true;
                        flag=false;
                    }
                    if(!checkParam.indDeptCode){
                        this.ruleTipShow.formulaOrgCode=true;
                        flag=false;
                    }
                    if(!checkParam.indCurrency){
                        this.ruleTipShow.formulaCurrency=true;
                        flag=false;
                    }
                    if(!checkParam.indFrequency){
                        this.ruleTipShow.formulaIndFrequency=true;
                        flag=false;
                    }
                    if(!checkParam.formulaCompareSymbol){
                        this.ruleTipShow.formulaCompareSymbol=true;
                        flag=false;
                    }
                    if(!checkParam.formulaTwo){
                        this.ruleTipShow.formulaTwo=true;
                        flag=false;
                    }

                    if(flag){

                        //合规行校验
                        var formulaFlag = this.checkFormulaExp(checkParam.formulaOne);

                        if (!formulaFlag) {
                            this.$message({
                                type: 'error',
                                message: '计算公式1配置错误'
                            })
                            return;
                        }

                        checkParam.formulaOneExp = this.setFormulaExp(this.checkForm.formulaOne);
                        if (checkParam.formulaOneExp != null) {
                            if (checkParam.formulaOneExp.indexOf("[") >=0 || checkParam.formulaOneExp.indexOf("]") >= 0) {
                                this.$message({
                                    type: 'error',
                                    message: '计算公式1指标名称不能修改'
                                })
                                return;
                            }
                            checkParam.formulaOneExp = checkParam.formulaOneExp.replaceAll("#","[");
                            checkParam.formulaOneExp = checkParam.formulaOneExp.replaceAll(";","]");
                        }


                        //计算公式2

                        var formulaFlagTwo = this.checkFormulaExp(checkParam.formulaTwo);

                        if (!formulaFlagTwo) {
                            this.$message({
                                type: 'error',
                                message: '计算公式2配置错误'
                            })
                            return;
                        }

                        checkParam.formulaTwoExp = this.setFormulaExp(this.checkForm.formulaTwo);
                        if (checkParam.formulaTwoExp != null) {
                            if (checkParam.formulaTwoExp.indexOf("[") >=0 || checkParam.formulaTwoExp.indexOf("]") >= 0) {
                                this.$message({
                                    type: 'error',
                                    message: '计算公式2指标名称不能修改'
                                })
                                return;
                            }
                            checkParam.formulaTwoExp = checkParam.formulaTwoExp.replaceAll("#","[");
                            checkParam.formulaTwoExp = checkParam.formulaTwoExp.replaceAll(";","]");
                        }

                        //调用接口
                         saveCheckData(qs.stringify(checkParam)).then(res => {
                             if (res.code == '0') {
                                 this.$message({
                                     type: 'success',
                                     message: '操作成功 '
                                 })
                             } else {
                                 this.$message({
                                     type: 'error',
                                     message: '操作失败 ' + res.msg
                                 })
                             }
                             this.closeApproveDetailDialog();
                             this.crud.refresh()
                         })
                    } else {
                        return;
                    }
                }
            },
            onInput(){
                this.$forceUpdate();
            },
            clearFormulaOne(){
                this.checkForm.formulaOne = '' ;
                this.checkForm.formulaOneExp = '' ;
                this.$forceUpdate()
            },
            indDefRulePlus() {
                if (this.checkForm.formulaOne == undefined || this.checkForm.formulaOne == null) {
                    this.checkForm.formulaOne = ''
                }
                if (this.checkForm.formulaOneExp == undefined || this.checkForm.formulaOneExp == null) {
                    this.checkForm.formulaOneExp = ''
                }

                this.checkForm.formulaOne += ' + '
                //this.checkForm.formulaOneExp += ' + '
                this.$forceUpdate()
            },
            // 指标规则-号按钮
            indDefRuleSubtraction() {
                if (this.checkForm.formulaOne == undefined || this.checkForm.formulaOne == null) {
                    this.checkForm.formulaOne = ''
                }
                if (this.checkForm.formulaOneExp == undefined || this.checkForm.formulaOneExp == null) {
                    this.checkForm.formulaOneExp = ''
                }
                this.checkForm.formulaOne += ' - '
               // this.checkForm.formulaOneExp += ' - '
                this.$forceUpdate()
            },
            // 指标规则×号按钮
            indDefRuleMultiplication() {
                if (this.checkForm.formulaOne == undefined || this.checkForm.formulaOne == null) {
                    this.checkForm.formulaOne = ''
                }
                if (this.checkForm.formulaOneExp == undefined || this.checkForm.formulaOneExp == null) {
                    this.checkForm.formulaOneExp = ''
                }
                this.checkForm.formulaOne += ' * '
              //  this.checkForm.formulaOneExp += ' * '
                this.$forceUpdate()
            },
            // 指标规则/号按钮
            indDefRuleDivision() {
                if (this.checkForm.formulaOne == undefined || this.checkForm.formulaOne == null) {
                    this.checkForm.formulaOne = ''
                }
                if (this.checkForm.formulaOneExp == undefined || this.checkForm.formulaOneExp == null) {
                    this.checkForm.formulaOneExp = ''
                }
                this.checkForm.formulaOne += ' / '
              //  this.checkForm.formulaOneExp += ' / '
                this.$forceUpdate()
            },
            indDefRuleLP(){
                if (this.checkForm.formulaOne == undefined || this.checkForm.formulaOne == null) {
                    this.checkForm.formulaOne = ''
                }
                if (this.checkForm.formulaOneExp == undefined || this.checkForm.formulaOneExp == null) {
                    this.checkForm.formulaOneExp = ''
                }
                this.checkForm.formulaOne += ' ( '
            //    this.checkForm.formulaOneExp += ' ( '
                this.$forceUpdate()
            },
            indDefRuleRP(){
                if (this.checkForm.formulaOne == undefined || this.checkForm.formulaOne == null) {
                    this.checkForm.formulaOne = ''
                }
                if (this.checkForm.formulaOneExp == undefined || this.checkForm.formulaOneExp == null) {
                    this.checkForm.formulaOneExp = ''
                }
                this.checkForm.formulaOne += ' ) '
            //    this.checkForm.formulaOneExp += ' ) '
                this.$forceUpdate()
            },
            // 衍生指标编辑指标口径规则
            showIndDefRuleDialog() {
                // this.formulaOneExp = ''
                this.value = []
                this.showIndDefRule = true
            },
            // 关闭衍生指标编辑指标口径规则
            closeIndDefRuleDialog() {
                this.showIndDefRule = false
            },
            handleChange(value, direction, movedKeys) {
                // valueLable
                //this.transferData[0].label
                this.valueLable = [];
                this.value.map(item =>{
                    var targetObj = this.transferData.filter(function(itemObj){
                        return itemObj.key == item;
                    })
                    this.valueLable.push(targetObj[0].label)
                })

            },
            initGenAndDerivedInd() {
                getAllInds().then(data => {
                    this.genAndDerivedIndArr = data.data
                    for (let i = 0; i < this.genAndDerivedIndArr.length; i++) {
                        this.transferData.push({key: this.genAndDerivedIndArr[i].bizCode, label: this.genAndDerivedIndArr[i].bizName})
                    }
                })
            },
            // 选择指标进行规则拼接
            selectInd() {
                /*if (this.checkForm.formulaOne == undefined || this.checkForm.formulaOne == null) {
                    this.checkForm.formulaOne = '';
                }*/


                /*if (this.checkForm.formulaOneExp == undefined || this.checkForm.formulaOneExp == null) {
                    this.checkForm.formulaOneExp = '';
                }*/


                /*if (this.valueLable.length > 0 ) {
                    this.checkForm.formulaOne += ' [' + this.valueLable[0] + '] '
                }*/

                if (this.checkForm.formulaOne == undefined || this.checkForm.formulaOne == null) {
                    this.checkForm.formulaOne = ''
                }
                if (this.checkForm.formulaOneExp == undefined || this.checkForm.formulaOneExp == null) {
                    this.checkForm.formulaOneExp = ''
                }

                if (this.value.length > 0 ) {
                    for (var i = 0; i < this.value.length; i++) {
                        var name =  ' [' + this.valueLable[i] + '] ';
                        var code = ' [' + this.value[i] + '] ';
                        this.checkForm.formulaOne += name
                    }
                    //this.checkForm.formulaOneExp += ' [' + this.value[0] + '] '
                }

                this.showIndDefRule = false
            },


            clearFormulaTwo(){
                this.checkForm.formulaTwo = '' ;
                this.checkForm.formulaTwoExp = '' ;
                this.$forceUpdate()
            },
            indDefRulePlusTwo() {
                if (this.checkForm.formulaTwo == undefined || this.checkForm.formulaTwo == null) {
                    this.checkForm.formulaTwo = ''
                }
                if (this.checkForm.formulaTwoExp == undefined || this.checkForm.formulaTwoExp == null) {
                    this.checkForm.formulaTwoExp = ''
                }

                this.checkForm.formulaTwo += ' + '
                this.checkForm.formulaTwoExp += ' + '
                this.$forceUpdate()
            },
            // 指标规则-号按钮
            indDefRuleSubtractionTwo() {
                if (this.checkForm.formulaTwo == undefined || this.checkForm.formulaTwo == null) {
                    this.checkForm.formulaTwo = ''
                }
                if (this.checkForm.formulaTwoExp == undefined || this.checkForm.formulaTwoExp == null) {
                    this.checkForm.formulaTwoExp = ''
                }
                this.checkForm.formulaTwo += ' - '
                this.checkForm.formulaTwoExp += ' - '
                this.$forceUpdate()
            },
            // 指标规则×号按钮
            indDefRuleMultiplicationTwo() {
                if (this.checkForm.formulaTwo == undefined || this.checkForm.formulaTwo == null) {
                    this.checkForm.formulaTwo = ''
                }
                if (this.checkForm.formulaTwoExp == undefined || this.checkForm.formulaTwoExp == null) {
                    this.checkForm.formulaTwoExp = ''
                }
                this.checkForm.formulaTwo += ' * '
                this.checkForm.formulaTwoExp += ' * '
                this.$forceUpdate()
            },
            // 指标规则/号按钮
            indDefRuleDivisionTwo() {
                if (this.checkForm.formulaTwo == undefined || this.checkForm.formulaTwo == null) {
                    this.checkForm.formulaTwo = ''
                }
                if (this.checkForm.formulaTwoExp == undefined || this.checkForm.formulaTwoExp == null) {
                    this.checkForm.formulaTwoExp = ''
                }
                this.checkForm.formulaTwo += ' / '
                this.checkForm.formulaTwoExp += ' / '
                this.$forceUpdate()
            },
            indDefRuleLPTwo(){
                if (this.checkForm.formulaTwo == undefined || this.checkForm.formulaTwo == null) {
                    this.checkForm.formulaTwo = ''
                }
                if (this.checkForm.formulaTwoExp == undefined || this.checkForm.formulaTwoExp == null) {
                    this.checkForm.formulaTwoExp = ''
                }
                this.checkForm.formulaTwo += ' ( '
                this.checkForm.formulaTwoExp += ' ( '
                this.$forceUpdate()
            },
            indDefRuleRPTwo(){
                if (this.checkForm.formulaTwo == undefined || this.checkForm.formulaTwo == null) {
                    this.checkForm.formulaTwo = ''
                }
                if (this.checkForm.formulaTwoExp == undefined || this.checkForm.formulaTwoExp == null) {
                    this.checkForm.formulaTwoExp = ''
                }
                this.checkForm.formulaTwo += ' ) '
                this.checkForm.formulaTwoExp += ' ) '
                this.$forceUpdate()
            },
            // 衍生指标编辑指标口径规则
            showIndDefRuleDialogTwo() {
                // this.formulaOneExp = ''
                this.valueTwo = []
                this.showIndDefRuleTwo = true
            },
            // 关闭衍生指标编辑指标口径规则
            closeIndDefRuleDialogTwo() {
                this.showIndDefRuleTwo = false
            },
            handleChangeTwo(value, direction, movedKeys) {
                // valueLable
                //this.transferData[0].label
                this.valueLableTwo = [];
                this.valueTwo.map(item =>{
                    var targetObj = this.transferData.filter(function(itemObj){
                        return itemObj.key == item;
                    })
                    this.valueLableTwo.push(targetObj[0].label)
                })

            },
            // 选择指标进行规则拼接
            selectIndTwo() {
                if (this.checkForm.formulaTwo == undefined || this.checkForm.formulaTwo == null) {
                    this.checkForm.formulaTwo = ''
                }
                if (this.checkForm.formulaTwoExp == undefined || this.checkForm.formulaTwoExp == null) {
                    this.checkForm.formulaTwoExp = ''
                }

                if (this.valueTwo.length > 0 ) {
                    for (var i = 0; i < this.valueTwo.length; i++) {
                        var name =  ' [' + this.valueLableTwo[i] + '] ';
                        var code = ' [' + this.valueTwo[i] + '] ';
                        this.checkForm.formulaTwo += name
                    }
                }

                this.showIndDefRuleTwo = false
            },
            // 衍生指标编辑指标口径规则
            showIndDefRuleDialogFix() {
                // this.formulaOneExp = ''
                this.valueFix = []
                this.showIndDefRuleFix = true
            },
            closeIndDefRuleDialogFix() {
                this.showIndDefRuleFix = false
            },
            handleChangeFix(value, direction, movedKeys) {
                //this.transferData[0].label
                this.valueLableFix = [];
                this.valueFix.map(item =>{
                    var targetObj = this.transferData.filter(function(itemObj){
                        return itemObj.key == item;
                    })
                    this.valueLableFix.push(targetObj[0].label)
                })

            },
            // 选择指标进行规则拼接
            selectIndFix() {
                if (this.valueFix.length > 0 ) {
                    this.checkForm.name = ' [' + this.valueLableFix[0] + '] '
                    this.checkForm.code = this.valueFix[0]
                }

                this.showIndDefRuleFix = false
            },
            selectFixInd(id){
                var targetObj = this.transferData.filter(function(itemObj){
                    return itemObj.key == id;
                })
                this.checkForm.name = targetObj[0].label;
            },
            getResultDepts() {
                getResultDepts().then(res => {
                    this.resultDepts = res.content
                })
            },
            checkFormulaExp(formulaStr){
                //公式前端校验
                var formulaTmp = formulaStr.replaceAll(" ","");
                do {
                    if (formulaTmp.lastIndexOf("]") < (formulaTmp.length - 1)) {
                        var suf = formulaTmp.charAt(formulaTmp.lastIndexOf("]")+1);
                        if (suf != '+' && suf != '-' && suf != '*' && suf != '/' && suf != ')' ) {
                            return false;
                        }
                    }

                    if (formulaTmp.lastIndexOf("[") > 0 ) {
                        var pre = formulaTmp.charAt(formulaTmp.lastIndexOf("[") - 1);
                        if (pre != '+' && pre != '-' && pre != '*' && pre != '/' && pre != '(' ) {
                            return false;
                        }
                    }

                    formulaTmp = formulaTmp.replace(formulaTmp.substring(formulaTmp.lastIndexOf("["), formulaTmp.lastIndexOf("]") + 1),"1")

                } while (formulaTmp.lastIndexOf("]") > 0 );

                return true;

            },
            setFormulaExp(formulaStr){
                var formulaExp = formulaStr;
                do {
                    var pre = formulaExp.lastIndexOf("[");
                    var suf = formulaExp.lastIndexOf("]");

                    //指标名称
                    var indName = formulaExp.substring(pre, suf + 1);
                    var indCode = '';
                    //指标编码
                    var targetObj = this.transferData.filter(function(itemObj){
                        return indName.indexOf(itemObj.label) >= 0;
                    })
                    if (targetObj[0] == null) {
                        return '[]';
                    }
                    indCode = targetObj[0].key;
                    formulaExp = formulaExp.replace(indName, '#' + indCode + ';')
                } while (formulaExp.lastIndexOf("]") > 0 );
                return formulaExp;
            }


        }


    }
</script>

<style scoped>
    .rule-tip-show{
        color:  #f56c6c;
        margin: 0px;
        font-size: 12px;
    }
</style>
<style>
    .error-border .el-input__inner,.error-border .vue-treeselect__control{
        border-color: #f56c6c !important;
    }
</style>