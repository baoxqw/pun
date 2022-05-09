<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边分类数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">
        <category type="2" @node-click="handleCategoryClick"/>
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
                v-model="query.ieCode"
                clearable
                size="small"
                placeholder="指标编号"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
            />
            <el-input
                v-model="query.ieName"
                clearable
                size="small"
                placeholder="指标名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
            />
            <el-select
                v-model="query.status"
                clearable
                size="small"
                placeholder="状态"
                class="filter-item"
                style="width: 90px"
                @change="crud.toQuery"
            >
              <el-option v-for="item in dict.IE_STATUS" :key="item.id" :label="item.label" :value="item.value"/>
            </el-select>
            <rrOperation :crud="crud"/>
          </div>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <crudOperation :permission="permission">
            <el-button
                slot="left"
                v-permission="permission.add"
                class="filter-item"
                type="primary"
                icon="el-icon-plus"
                @click="crud.toAdd"
            >
              申请
            </el-button>
            <el-button
                slot="left"
                v-permission="permission.submit"
                class="filter-item"
                size="mini"
                type="success"
                icon="el-icon-setting"
                :disabled="crud.selections.length == 0"
                @click="subApprove(crud.selections)"
            >
              提交
            </el-button>
            <!--            <el-button
                          slot="left"
                          v-permission="permission.develop"
                          class="filter-item"
                          size="mini"
                          type="success"
                          icon="el-icon-setting"
                          :disabled="crud.selections.length !== 1"
                          @click="arithmeticDefinition(crud.selections[0])"
                        >
                          开发
                        </el-button>-->
            <!--  <el-button
              slot="left"
              v-permission="permission.upLine"
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-setting"
              :disabled="crud.selections.length == 0"
              @click="upLine(crud.selections)"
            >
              上线
            </el-button>
            <el-button
              slot="left"
              v-permission="permission.startUsing"
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-setting"
              :disabled="crud.selections.length == 0"
              @click="startUsing(crud.selections)"
            >
              启用
            </el-button>-->
<!--            <el-button
                slot="left"
                v-permission="permission.stopUsing"
                class="filter-item"
                size="mini"
                type="success"
                icon="el-icon-setting"
                :disabled="crud.selections.length == 0"
                @click="stopUsing(crud.selections)"
            >
              停用
            </el-button>-->
            <el-button
                slot="left"
                v-permission="permission.processA"
                class="filter-item"
                size="mini"
                type="success"
                icon="el-icon-setting"
                :disabled="crud.selections.length === 0"
                @click="processA(crud.selections)"
            >
              计算
            </el-button>
          </crudOperation>
          <el-dialog :visible.sync="processDialog" width="400px">
            <template>
              <div class="block">
                <el-date-picker
                    v-model="dateValue"
                    type="date"
                    placeholder="选择日期"
                />
                <el-button type="primary" plain @click="processB">确定</el-button>
              </div>
            </template>
          </el-dialog>
          <!--表单组件-->
          <el-dialog
              :close-on-click-modal="false"
              :before-close="crud.cancelCU"
              :visible.sync="crud.status.cu > 0"
              :title="crud.status.title"
              width="60%"
          >
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="指标编号" prop="ieCode">
                  <el-input v-model="form.ieCode" placeholder="系统自动生成..." :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="指标名称" prop="ieName">
                  <el-input v-model="form.ieName"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="指标级别" prop="ieScope">
                  <el-select v-model="form.ieScope" placeholder="请选择" @change="changeIeScope">
                    <el-option
                        v-for="item in dict.IE_SCOPE"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="管理部门">
                  <treeselect
                      v-model="form.manageDept"
                      :options="depts"
                      placeholder="选择部门"
                      :disabled="manageDeptEdited"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
                <el-form-item label="查看部门" prop="viewDepts">
                  <treeselect
                      v-model="form.viewDepts"
                      :options="viewDept"
                      :multiple="true"
                      openDirection="below"
                      placeholder="选择部门"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="指标类型" prop="ieProp">
                  <el-select v-model="form.ieProp" filterable placeholder="请选择">
                    <el-option
                        v-for="item in dict.IE_PROP"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <!--                <el-form-item label="默认值">
                                  <el-input v-model="form.ieDefaultValue" />
                                </el-form-item>-->
              </el-col>
              <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="计算频度">
                  <el-select v-model="form.calcFreq" filterable placeholder="请选择">
                    <el-option
                      v-for="item in dict.CALC_FREQ"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>-->
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="指标单位" prop="ieDataUnit">
                  <el-select v-model="form.ieDataUnit" filterable placeholder="请选择">
                    <el-option
                        v-for="item in dict.IE_DATA_UNIT"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="生效日期">
                  <el-date-picker v-model="form.startDate"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="失效日期">
                  <el-date-picker v-model="form.endDate"/>
                </el-form-item>
              </el-col>-->
              <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="结果保留期限">
                  <el-select v-model="form.retention" filterable placeholder="请选择">
                    <el-option
                      v-for="item in dict.RETENTION"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>-->
              <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="指标状态">
                  <el-select v-model="form.status" filterable placeholder="请选择" :disabled="true">
                    <el-option
                      v-for="item in dict.IE_STATUS"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>-->
              <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
                <el-form-item label="指标业务规则">
                  <el-input v-model="form.ieRule" type="textarea"/>
                </el-form-item>
              </el-col>
              <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
                <el-form-item label="指标描述">
                  <el-input v-model="form.ieDesc" type="textarea"/>
                </el-form-item>
              </el-col>
              <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="取值方式" prop="ieMethod">
                  <el-select v-model="form.ieMethod" filterable placeholder="请选择">
                    <el-option
                      v-for="item in dict.IE_METHOD"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="text" @click="crud.cancelCU">取消</el-button>
              <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
            </div>
          </el-dialog>
          <!--表格渲染-->
          <el-table
              ref="table"
              v-loading="crud.loading"
              :data="crud.data"
              size="small"
              style="width: 100%;"
              @selection-change="crud.selectionChangeHandler"
          >
            <el-table-column type="selection" width="55"/>
            <el-table-column v-if="columns.visible('id')" prop="id" label="指标ID"/>
            <el-table-column v-if="columns.visible('ieCode')" prop="ieCode" label="指标编号"/>
            <el-table-column
                v-if="columns.visible('ieName')"
                prop="ieName"
                label="指标名称"
                :show-tooltip-when-overflow="true"
                width="100px"
            />
            <el-table-column v-if="columns.visible('ieProp')" prop="ieProp" label="指标级别">
              <template slot-scope="scope">
                {{ dict.label.IE_PROP[scope.row.ieProp] }}
              </template>
            </el-table-column>
            <el-table-column
                v-if="columns.visible('ieDesc')"
                prop="ieDesc"
                :show-tooltip-when-overflow="true"
                width="100px"
                label="指标描述"
            />
            <el-table-column
                v-if="columns.visible('ieRule')"
                prop="ieRule"
                label="指标业务规则"
                :show-tooltip-when-overflow="true"
                width="100px"
            />
            <!--<el-table-column v-if="columns.visible('calcFreq')" prop="calcFreq" label="计算频度">
              <template slot-scope="scope">
                {{ dict.label.CALC_FREQ[scope.row.calcFreq] }}
              </template>
            </el-table-column>-->
            <el-table-column v-if="columns.visible('status')" prop="status" label="指标状态">
              <template slot-scope="scope">
                {{ dict.label.IE_STATUS[scope.row.status] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('ieDataUnit')" prop="ieDataUnit" label="指标单位">
              <template slot-scope="scope">
                {{ dict.label.IE_DATA_UNIT[scope.row.ieDataUnit] }}
              </template>
            </el-table-column>
            <!--<el-table-column v-if="columns.visible('ieMethod')" prop="ieMethod" label="取值方式">
              <template slot-scope="scope">
                {{ dict.label.IE_METHOD[scope.row.ieMethod] }}
              </template>
            </el-table-column>-->
            <!--<el-table-column prop="startDate" :formatter="dateColumnFormat" label="生效日期" width="90px"/>
            <el-table-column
              v-if="columns.visible('endDate')"
              prop="endDate"
              :formatter="dateColumnFormat"
              label="失效日期"
              width="90px"
            />-->
            <!--<el-table-column v-if="columns.visible('retention')" prop="retention" label="结果保留期限" width="100px">
              <template slot-scope="scope">
                {{ dict.label.RETENTION[scope.row.retention] }}
              </template>
            </el-table-column>-->
            <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人"/>
            <el-table-column
                v-if="columns.visible('crtDate')"
                :formatter="timeColumnFormat"
                prop="crtDate"
                label="创建日期"
                width="150px"
            />
            <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人"/>
            <el-table-column
                v-if="columns.visible('updDate')"
                :formatter="timeColumnFormat"
                prop="updDate"
                label="修改日期"
                width="150px"
            />
            <el-table-column
                v-permission="['admin','indIndicatorInfo:edit','indIndicatorInfo:del']"
                label="操作"
                width="200px"

                fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                    v-permission="permission.details"
                    class="el-icon&#45;&#45;left"
                    style="display:inline-block;"
                    type="text"
                    @click="details(scope.row)"
                >
                  详情
                </el-button>
                <el-button
                    v-permission="permission.develop"
                    :disabled="scope.row.status != '2'"
                    class="el-icon&#45;&#45;left"
                    style="display:inline-block;"
                    type="text"
                    @click="deriveDevelop(scope.row)"
                >
                  开发
                </el-button>
                <el-button
                    slot="left"
                    prop="manageDept"
                    :disabled=" scope.row.manageDept != user.deptId || scope.row.status != '5'"
                    v-permission="permission.stopUsing"
                    class="el-icon&#45;&#45;left"
                    type="text"
                    style="display:inline-block;"
                    @click="stopUsing(scope.row)"
                >
                  停用
                </el-button>
<!--                <udOperation
                    :data="scope.row"
                    :permission="permission"
                    style="display:inline-block;"
                />-->
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination/>
          <arithmetic ref="arithmetic" @func="refQuery"/>
          <sqlCheck ref="sqlCheck"/>
          <limitRule ref="limitRule"/>
          <lookDetails ref="lookDetails"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudIndIndicatorInfo, {
  getIndDeriveRule,
  getIndDeriveRuleByIeCode,
  updateStatus,
  process,
  updateDeriveStarStatus
} from '../../../api/indicators/indIndicatorInfo'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/ICRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import category from '../category/category'
import arithmetic from './arithmetic/arithmeticPage'
import sqlCheck from './arithmetic/sqlCheckPage'
import limitRule from './arithmetic/limitRulePage'
import lookDetails from './details/lookDeriveDetails'
import {getDepts} from '@system/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {mapGetters} from 'vuex'

// crud交由presenter持有
const defaultCrud = CRUD({
  title: '衍生指标信息',
  url: crudIndIndicatorInfo.url,
  sort: 'id,desc',
  crudMethod: {...crudIndIndicatorInfo.method}
})
const defaultForm = {
  id: null,
  ieCode: null,
  ieName: null,
  categoryId: null,
  ieProp: null,
  ieType: '2',
  ieDesc: null,
  ieRule: null,
  ieDefaultValue: null,
  ieMethod: '1',
  calcFreq: null,
  status: null,
  ieDataUnit: '1',
  ieLevel: null,
  startDate: null,
  endDate: null,
  retention: '1,Y',
  processInstanceId: null,
  manageDept: null,
  crtUserCode: null,
  crtOrgCode: null,
  crtDate: null,
  updUserCode: null,
  updOrgCode: null,
  updDate: null
}
export default {
  name: 'IndIndicatorInfo',
  components: {
    pagination,
    crudOperation,
    rrOperation,
    udOperation,
    category,
    arithmetic,
    sqlCheck,
    limitRule,
    lookDetails,
    Treeselect
  },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['IE_PROP', 'IE_SCOPE', 'IE_TYPE', 'IE_METHOD', 'CALC_FREQ', 'IE_STATUS', 'IE_DATA_UNIT', 'RETENTION'],
  data() {
    return {
      manageDeptEdited: false,
      table: {
        columns: {
          id: 'hidden',
          crtOrgCode: 'hidden',
          updOrgCode: 'hidden'
        }
      },
      permission: {
        add: ['admin', 'deriveIndIndicatorInfo:add'],
        submit: ['admin', 'deriveIndIndicatorInfo:submit'],
        develop: ['admin', 'deriveIndIndicatorInfo:develop'],
        upLine: ['admin', 'deriveIndIndicatorInfo:upLine'],
        startUsing: ['admin', 'deriveIndIndicatorInfo:startUsing'],
        stopUsing: ['admin', 'deriveIndIndicatorInfo:stopUsing'],
        processA: ['admin', 'deriveIndIndicatorInfo:processA'],
        edit: ['admin', 'deriveIndIndicatorInfo:edit'],
        del: ['admin', 'deriveIndIndicatorInfo:del'],
        details: ['admin', 'deriveIndIndicatorInfo:details']
      },
      rules: {
        ieName: [
          {required: true, message: '指标名称不能为空', trigger: 'blur'}
        ],
        ieScope: [
          {required: true, message: '指标级别不能为空', trigger: 'change'}
        ],
        ieProp: [
          {required: true, message: '指标类别不能为空', trigger: 'change'}
        ],
        ieDataUnit: [
          {required: true, message: '指标单位不能为空', trigger: 'change'}
        ]
        /* ieMethod: [
          {required: true, message: '取值方式不能为空', trigger: 'change'}
        ]*/
      },
      processDialog: false, // 计算输日期的页面
      processParam: { // 传给后台的参数
        codes: [],
        periodDate: ''
      },
      dateValue: '', // 计算日期
      depts: [], // 部门数组
      viewDept: [], // 查看部门数组
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  mounted() {
    this.getDepts()
  },
  methods: {
    // 选择指标级别后关联管理部门
    changeIeScope(data) {
      if (data == 1) {
        this.manageDeptEdited = true
        /* getInfo().then(res => {
           this.form.manageDept = res.deptId
         })*/
        this.form.manageDept = this.user.deptId
        console.log('------------>>>>>---->>>', this.user.deptId)
      } else {
        this.form.manageDept = null
        this.manageDeptEdited = false
      }
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      this.query.ieType = '2',
          this.query.queryType = '1'
      return true
    },
    [CRUD.HOOK.beforeToAdd]() {
      if (!this.form.categoryId) {
        this.crud.notify('请选择分类', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      if (this.form.categoryId === '0') {
        this.crud.notify('根节点不能添加', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      // 获取部门信息
      this.getDepts()
    },
    [CRUD.HOOK.beforeToEdit]() {
      if (this.form.status != 0 && this.form.status != 2) {
        this.crud.notify('只有未提交或退回的数据才能修改能修改', CRUD.NOTIFICATION_TYPE.ERROR)
        this.crud.resetForm()
        return false
      }
      // 获取部门信息
      this.getDepts()
    },
    // 删除之前
    [CRUD.HOOK.beforeDelete]() {
      for (let items of this.crud.selections) {

        if (items.status != 0) {
          this.crud.notify('该状态的指标不允许删除', CRUD.NOTIFICATION_TYPE.ERROR)
          return false
        }
      }
      // 获取部门信息
      this.getDepts()

    },
    handleCategoryClick(data) {
      this.crud.form.categoryId = data.id
      this.crud.query.categoryIds = data.childrenIds
      this.form.categoryId = data.id
      this.crud.refresh()
    },
    /* 点击开发按钮触发,根据不同的取值方式打开不同的开发页面 */
    deriveDevelop(data) {
      // 状态校验-只能选择0-未审批或3-已退回的数据
      if (data.status != 2) {
        this.crud.notify('请选择已审批的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      // 取值方式=1打开四则运算页面.2-SQL公式，3-限制，4-EXCEL公式
      if (data.ieMethod == 1) {
        const _this = this.$refs.arithmetic
        const indDeriveRule = {
          'ieCode': data.ieCode
        }
        getIndDeriveRuleByIeCode(indDeriveRule).then(data => {
          if (data.code === 0) {
            const ruleDesc = data.data.ruleDesc
            if (ruleDesc != null) {
              _this.arithtext = ruleDesc
            }
          } else {
            _this.arithtext = ''
          }
        })
        _this.title = '算法定义-四则运算[' + data.ieCode + ']'
        _this.ieCode = data.ieCode
        _this.arithmeticDialog = true
      } else if (data.ieMethod == 2) {
        const _this = this.$refs.sqlCheck
        const indDeriveRule = {
          'ieCode': data.ieCode
        }
        getIndDeriveRuleByIeCode(indDeriveRule).then(deriveRuleData => {
          if (deriveRuleData.code === 0) {
            _this.sqlData.sqlText = deriveRuleData.data.calcRule
          } else {
            _this.sqlData.sqlText = null
          }
        })
        _this.sqlData.ieCode = data.ieCode
        _this.title = '算法定义-SQL校验[' + data.ieCode + ']'
        _this.ieCode = data.ieCode
        _this.sqlTemp = true
        _this.sqlCheck = true
      } else if (data.ieMethod == 3) {
        const _this = this.$refs.limitRule
        _this.title = '算法定义-限制条件[' + data.ieCode + ']'
        _this.ieCode = data.ieCode
        _this.limitCheck = true
      }
    },
    // 子组件调用刷新方法
    refQuery(data) {
      this.crud.toQuery()
    },
    /* 点击提交审批触发事件 */
    subApprove(data) {
      let temp = 0
      const param = []
      const ieCodes = []
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择0-未审批
        if (data[i].status != 0) {
          temp = -1
          break
        }
        const indIndicatorInfo = {
          'id': data[i].id,
          'status': '1',
          'ieProp': data[i].ieProp
        }
        param.push(indIndicatorInfo)
        ieCodes.push(data[i].ieCode)
      }
      if (temp == -1) {
        this.crud.notify('请选择未审批或已退回的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      this.$confirm(`确定要提交所选数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(param).then(returnData => {
          if (returnData.code === 0) {
            this.crud.notify('操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.crud.toQuery()
          } else {
            this.crud.notify('操作失败!错误原因:' + returnData.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            this.crud.toQuery()
          }
        })
      })
    },
    /* 点击上线按钮触发事件 */
    upLine(data) {
      let temp = 0
      const param = []
      const ieCodes = []
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择0-已审批
        if (data[i].status != 2) {
          temp = -1
          break
        }
        const indIndicatorInfo = {
          'id': data[i].id,
          'status': '4'
        }
        param.push(indIndicatorInfo)
        ieCodes.push(data[i].ieCode)
      }
      if (temp == -1) {
        this.crud.notify('请选择已审批的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      // 开发校验通过后执行审批
      getIndDeriveRule(ieCodes).then(returnData => {
        if (returnData.code !== 0) {
          this.crud.notify(returnData.msg + '指标未进行开发', CRUD.NOTIFICATION_TYPE.ERROR)
        } else {
          this.$confirm(`确定上线所选数据吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 开发校验通过后,修改状态
            updateStatus(param).then(returnData => {
              if (returnData.code === 0) {
                this.crud.notify('操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
                this.crud.toQuery()
              } else {
                this.crud.notify('操作失败!错误原因:' + returnData.msg, CRUD.NOTIFICATION_TYPE.ERROR)
                this.crud.toQuery()
              }
            })
          })
        }
      })
    },
    // 启用按钮
    startUsing(data) {
      let temp = 0
      const param = []
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择4-已上线或6-停用的数据
        if (data[i].status != 4 && data[i].status != 6) {
          temp = -1
          break
        }
        const indIndicatorInfo = {
          'id': data[i].id,
          'ieCode': data[i].ieCode,
          'status': '5'
        }
        param.push(indIndicatorInfo)
      }
      if (temp == -1) {
        this.crud.notify('请选择已上线或停用的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }

      this.$confirm(`确定启用所选数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 算法定义校验通过后,修改状态为启用(单独处理、修改衍生指标层级)
        updateDeriveStarStatus(param).then(returnData => {
          if (returnData.code === 0) {
            this.crud.notify('操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.crud.toQuery()
          } else {
            this.crud.notify('操作失败!错误原因:' + returnData.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            this.crud.toQuery()
          }
        })
      })
    },
    // 停用按钮
    stopUsing(data) {
      let temp = 0
      const param = []
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择4-启用数据
        if (data[i].status != 5) {
          temp = -1
          break
        }
        const indIndicatorInfo = {
          'id': data[i].id,
          'status': '6'
        }
        param.push(indIndicatorInfo)
      }
      if (temp == -1) {
        this.crud.notify('请选择启用的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      this.$confirm(`确定停用所选数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(param).then(returnData => {
          if (returnData.code === 0) {
            this.crud.notify('操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.crud.toQuery()
          } else {
            this.crud.notify('操作失败!错误原因:' + returnData.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            this.crud.toQuery()
          }
        })
      })
    },
    // 详情按钮
    details(row) {
      const _this = this.$refs.lookDetails
      // 打开详情页面时通过ieCode去查询取值规则
      const indDeriveRule = {
        ieCode: row.ieCode
      }
      getIndDeriveRuleByIeCode(indDeriveRule).then(data => {
        if (data.code === 0) {
          _this.$set(_this.form, 'calcRule', data.data.ruleDesc)
        }
      })
      getDepts({enabled: true}).then(res => {
        _this.depts = res.content
      })
      _this.title = '详情'
      _this.form = row
      _this.detailsDialog = true
    },
    /** 点击计算按钮触发 */
    processA(data) {
      // 只能选择已审批的数据
      let temp = 0
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择5-启用
        if (data[i].status != 5) {
          temp = -1
          break
        }
      }
      if (temp == -1) {
        this.crud.notify('请选择已启用的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }

      const codes = []
      for (let i = 0; i < data.length; i++) {
        codes.push(data[i].ieCode)
      }
      this.processParam.codes = codes
      this.processDialog = true
    },
    processB() {
      if (this.dateValue == '') {
        this.crud.notify('日期不能为空', CRUD.NOTIFICATION_TYPE.ERROR)
      } else {
        const dateValue = this.dateFormat(this.dateValue, 'YYYYMMDD')
        this.processParam.periodDate = dateValue
        process(this.processParam, 'derive').then(data => {
          if (data.code == 0) {
            this.crud.notify(data.msg, CRUD.NOTIFICATION_TYPE.SUCCESS)
          } else {
            this.crud.notify(data.msg, CRUD.NOTIFICATION_TYPE.ERROR)
          }
          this.processDialog = false
        })
      }
    },
    // 获取弹窗内部门数据
    getDepts() {
      getDepts({enabled: true, pid: '1', deptCategory: '0'}).then(res => {
        this.depts = res.content
        this.viewDept = [{
          id: 0,
          label: '总行机关',
          children: res.content,
        }]
      })
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
