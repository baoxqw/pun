<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.ieCode" clearable size="small" placeholder="指标编号" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.ieName" clearable size="small" placeholder="指标名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select
          v-model="query.status"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 150px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in dict.IE_STATUS" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select
          v-model="query.ieProp"
          clearable
          size="small"
          placeholder="指标级别"
          class="filter-item"
          style="width: 150px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in dict.IE_PROP" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select
          v-model="query.ieType"
          clearable
          size="small"
          placeholder="指标类型"
          class="filter-item"
          style="width: 150px"
          @change="crud.toQuery"
        >
          <el-option v-for="item in dict.IE_TYPE" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission">
        <el-button
          slot="left"
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-setting"
          :disabled="crud.selections.length === 0"
          @click="approves(crud.selections)"
        >
          审批
        </el-button>
        <!-- <el-button
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
        </el-button>-->
      </crudOperation>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" height="450" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="指标ID" />
        <el-table-column v-if="columns.visible('ieCode')" prop="ieCode" label="指标编号" />
        <el-table-column v-if="columns.visible('ieName')" width="130px" prop="ieName" label="指标名称" />
        <el-table-column v-if="columns.visible('ieProp')" prop="ieProp" label="指标级别">
          <template slot-scope="scope">
            {{ dict.label.IE_PROP[scope.row.ieProp] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('ieType')" prop="ieType" label="指标类型">
          <template slot-scope="scope">
            {{ dict.label.IE_TYPE[scope.row.ieType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('ieDesc')" prop="ieDesc" label="指标描述" :show-tooltip-when-overflow="true" />
        <el-table-column v-if="columns.visible('ieRule')" width="100px" prop="ieRule" label="指标业务规则" :show-tooltip-when-overflow="true" />
        <el-table-column v-if="columns.visible('ieDefaultValue')" prop="ieDefaultValue" label="默认值" />

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
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />
        <!--<el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />-->
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" width="140" label="创建日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人" />
        <!--<el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="修改机构" />-->
        <el-table-column v-if="columns.visible('updDate')" prop="updDate" width="140" label="修改日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px"   fixed="right">
          <template slot-scope="scope">
            <el-button class="filter-item" type="success" @click="approve(scope.row)">{{ dict.label.BUTTON_NAME[scope.row.status] }}</el-button>
            <el-button class="filter-item" type="success" @click="details(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
      <checkApproves ref="checkApproves" />
      <checkApprove ref="checkApprove"/>
      <lookDetails ref="lookDetails" />
    </div>
  </div>
</template>

<script>
  import crudIndIndicatorInfo, { getIndDeriveRuleByIeCode, updateStatus, getIndBaseRule, getIndDeriveRule } from '../../../api/indicators/indIndicatorInfo'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/ACRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import checkApproves from './approve/checkApproves'
  import checkApprove from './approve/checkApprove'
  import lookDetails from './details/lookApproveDetails'
  import { getDepts } from '@system/api/system/dept'

  // crud交由presenter持有
  const defaultCrud = CRUD({ title: '指标基本信息', url: crudIndIndicatorInfo.url, sort: 'id,desc', crudMethod: { ...crudIndIndicatorInfo.method }})
  export default {
    name: 'IndIndicatorInfo',
    components: {
      pagination, crudOperation, rrOperation, udOperation, checkApproves, checkApprove, lookDetails },
    mixins: [presenter(defaultCrud), header(), crud()],
    dicts: ['IE_PROP', 'IE_TYPE', 'IE_METHOD', 'CALC_FREQ', 'IE_STATUS', 'IE_DATA_UNIT', 'RETENTION', 'BUTTON_NAME'],
    data() {
      return {
        table: {

          columns: {
            id: 'hidden'
            /* crtOrgCode: 'hidden',
            updOrgCode: 'hidden',*/
          }
        },
        permission: {
          upLine: ['admin', 'baseIndIndicatorInfo:upLine'],
          startUsing: ['admin', 'baseIndIndicatorInfo:startUsing'],
          add: ['admin', 'indIndicatorInfo:add'],
          edit: ['admin', 'indIndicatorInfo:edit'],
          del: ['admin', 'indIndicatorInfo:del']
        }
      }
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        /* this.query.status = this.$route.query.status,*/
        this.query.queryType = '2'
        return true
      },
      // 单条条数据审批
      approve(row) {
        const ieCodes = []
        const _this = this.$refs.checkApprove
        // 打开审批页面时通过ieCode去查询取值规则
        const indDeriveRule = {
          ieCode: row.ieCode
        }
        ieCodes.push(row.ieCode)

        if (row.status == 2) {
          // 开发校验通过后执行审批
          // 基础指标验证
          if (row.ieType == 1) {
            getIndBaseRule(ieCodes).then(returnData => {
              if (returnData.code !== 0) {
                this.crud.notify(returnData.msg + '指标未进行开发', CRUD.NOTIFICATION_TYPE.ERROR)
              } else {
               /* getIndDeriveRuleByIeCode(indDeriveRule).then(data => {
                  if (data.code === 0) {
                    _this.$set(_this.form, 'calcRule', data.data.ruleDesc)
                  }
                })*/
                getDepts({ enabled: true }).then(res => {
                  _this.depts = res.content
                })
                _this.title = '审批'
                _this.form = row
                _this.approveDialog = true
              }
            })
          }
          // 衍生指标 验证是否可以上线
          if (row.ieType == 2) {
            getIndDeriveRule(ieCodes).then(returnData => {
              if (returnData.code !== 0) {
                this.crud.notify(returnData.msg + '指标未进行开发', CRUD.NOTIFICATION_TYPE.ERROR)
              } else {
                /* getIndDeriveRuleByIeCode(indDeriveRule).then(data => {
                  if (data.code === 0) {
                    _this.$set(_this.form, 'calcRule', data.data.ruleDesc)
                  }
                })*/
                getDepts({ enabled: true }).then(res => {
                  _this.depts = res.content
                })
                _this.title = '审批'
                _this.form = row
                _this.approveDialog = true
              }
            })
          }
        } else {
          /* getIndDeriveRuleByIeCode(indDeriveRule).then(data => {
            if (data.code === 0) {
              _this.$set(_this.form, 'calcRule', data.data.ruleDesc)
            }
          })*/
          getDepts({ enabled: true }).then(res => {
            _this.depts = res.content
          })
          _this.title = '审批'
          _this.form = row
          _this.approveDialog = true
        }
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

        getIndBaseRule(ieCodes).then(returnData => {
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
          // 状态校验-只能选择4-已上线，不能啟用6-停用的数据
          if (data[i].status != 4) {
            temp = -1
            break
          }
          const indIndicatorInfo = {
            'id': data[i].id,
            'status': '5'
          }
          param.push(indIndicatorInfo)
        }
        if (temp == -1) {
          this.crud.notify('请选择已上线的数据', CRUD.NOTIFICATION_TYPE.ERROR)
          return false
        }
        this.$confirm(`确定启用所选数据吗?`, '提示', {
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
      // 多条数据审批
      approves(data) {
        let temp = 0
        const ieCodes = []
        const _this = this.$refs.checkApproves
        _this.title = '审批'

        for (let i = 0; i < data.length; i++) {
          const indIndicatorInfo = {
            'id': data[i].id
          }
         for (let j = 0; j < data.length; j++) {
           if (data[i].status != data[j].status) {
              temp = -1
           }
         }

          _this.param.push(indIndicatorInfo)
          ieCodes.push(data[i].ieCode)
        }
        if (temp == -1) {
          this.crud.notify('请选择状态一致的数据', CRUD.NOTIFICATION_TYPE.ERROR)
          _this.approveDialog = false
          return false
        } else {
          if (data[0].status == 2) {
            // 判断是否已开发具备上线
            // 判断是基础指标1 还是 衍生指标2
            if (data[0].ieType == 1) {
              getIndBaseRule(ieCodes).then(returnData => {
                if (returnData.code !== 0) {
                  this.crud.notify(returnData.msg + '指标未进行开发', CRUD.NOTIFICATION_TYPE.ERROR)
                  _this.approveDialog = false
                } else {
                  _this.approveDialog = true
                }
              })
            }
            if (data[0].ieType == 2) {
              // 开发校验通过后执行审批
              getIndDeriveRule(ieCodes).then(returnData => {
                if (returnData.code !== 0) {
                  this.crud.notify(returnData.msg + '指标未进行开发', CRUD.NOTIFICATION_TYPE.ERROR)
                  _this.approveDialog = false
                } else {
                  _this.approveDialog = true
                }
              })
            }
          } else {
            _this.approveDialog = true
          }
        }

        _this.form.status = data[0].status
      },
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
        getDepts({ enabled: true }).then(res => {
          _this.depts = res.content
        })
        _this.title = '详情'
        _this.form = row
        _this.detailsDialog = true
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
