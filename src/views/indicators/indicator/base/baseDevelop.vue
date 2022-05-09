<template>
  <div class="app-container">
    <!-- 基础指标开发 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="baseDevelopDialog"
      :title="title"
      width="60%"
      top="15vh"
    >
      <div class="content">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="原子指标" prop="indBaseRule.bizCode">
                <el-select
                  v-if="form.indBaseRule"
                  v-model="form.indBaseRule.bizCode"
                  filterable
                  placeholder="请选择"
                  @change="atomChangeHandle"
                >
                  <el-option
                    v-for="item in atom"
                    :key="item.bizCode"
                    :label="item.bizName"
                    :value="item.bizCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="度量" prop="indBaseRule.measureColumn">
                <el-select
                  v-if="form.indBaseRule"
                  v-model="form.indBaseRule.measureColumn"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in measureInfo"
                    :key="item.colCode"
                    :label="item.dimDesc"
                    :value="item.colCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-select
                v-if="form.indBaseRule"
                v-model="form.indBaseRule.expression"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dict.EXPRESSION"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="统计维度">
                <el-input v-model="form.dimVals" :disabled="true">
                  <el-button slot="append" type="primary" @click="dimClickHandle">选择</el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="限制规则">
                <el-input v-model="form.limitRule" :disabled="true">
                  <el-button slot="append" type="primary" @click="limitRuleClickHandle">选择</el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <dimensionPage ref="dimensionPage" @func="getDimensionPage" />
        <limitRulePage ref="limitRulePage" @func="getLimitPage" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="saveBaseRule()">保存</el-button>
        <!--<el-button :loading="loading" type="primary" @click="upLine()">上线</el-button>-->
        <el-button type="text" @click="cancel()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import crudIndIndicatorInfo, {
    getAtom,
    getAtomDimenston,
    saveBaseRule,
    updateStatuesByIeCode
  } from '../../../../api/indicators/indIndicatorInfo'
  import dimensionPage from './dimensionPage'
  import limitRulePage from './limitRulePage'

  export default {
    components: {
      dimensionPage,
      limitRulePage
    },
    dicts: ['EXPRESSION'],
    data() {
      return {
        rules: {
          'indBaseRule.bizCode': [
            { required: true, message: '原子指标不能为空', trigger: 'blur' }
          ],
          'indBaseRule.measureColumn': [
            { required: true, message: '度量不能为空', trigger: 'blur' }
          ]
        },
        loading: false,
        baseDevelopDialog: false,
        title: '',

        form: {
          ieCode: null,
          indBaseRule: {
            calcRule: null, // 加工规则
            dataSource: null, // 数据源
            expression: 'sum', // 取数表达式
            dataTable: null, // 取数表名-即原子指标中的存储表名
            measureColumn: null, // 度量
            bizCode: null // 原子指标
          },

          indDimRelations: [], // 指标维度关系
          indBaseRuleFilters: [], // 指标附加规则

          dimVals: null, // 维度选择页面传来的显示维度
          limitRule: null // 限制规则

        },
        atom: [], // 原子指标
        measureInfo: [], // 度量信息
        dimInfo: [] // 原子指标维度信息
      }
    },
    methods: {
      /* 基础指标开发的method----start */
      // 原子指标修改后触发事件
      atomChangeHandle(val) {
        this.atom.some((item) => {
          if (item.bizCode == val) {
            // 1.自动注入取数表名
            this.form.indBaseRule.dataTable = item.bizTabCode
            // 2.根据原子指标编号查询原子指标维度信息表;生成维度信息
            const dimParam = {
              bizCode: item.bizCode,
              dimType: 'D'
            }
            getAtomDimenston(dimParam).then(data => {
              this.dimInfo = data.data
            })
            // 3.根据原子指标编号查询原子指标维度信息表;生成度量信息
            const meaParam = {
              bizCode: item.bizCode,
              dimType: 'M'
            }
            getAtomDimenston(meaParam).then(data => {
              this.measureInfo = data.data
            })
            // 清空
            this.form.indBaseRule.measureColumn = null
            this.form.dimVals = null
            this.form.limitRule = null
          }
        })
      },
      // 统计维度点击选择时触发
      dimClickHandle() {
        // 将维度信息传递过去并将结果返回
        const _this = this.$refs.dimensionPage
        _this.title = '统计维度'
        _this.dimInfo = this.dimInfo
        _this.indDimRelations = this.form.indDimRelations// 默认选中的值
        _this.selectRow()// 做默认选中的处理
        _this.dimensionDialog = true
      },
      // 接收统计维度子组件传来的信息
      getDimensionPage(data1, data2) {
        this.form.dimVals = data1
        this.form.indDimRelations = data2
      },
      // 限制规则点击选择时触发
      limitRuleClickHandle() {
        // 将维度信息传递过去选择后将结果返回
        const _this = this.$refs.limitRulePage
        _this.title = '限制规则'
        _this.dimInfo = this.dimInfo
        _this.tableData = []
        _this.tableName = this.form.indBaseRule.dataTable// 表名,查询值列表的参数
        _this.indBaseRuleFilters = this.form.indBaseRuleFilters// 默认选中的值
        _this.selectRow()// 做默认选中的处理
        _this.limitRuleDialog = true
      },
      // 接收限制规则子组件传来的信息
      getLimitPage(data1, data2) {
        this.form.limitRule = data1
        this.form.indBaseRuleFilters = data2
      },
      // 取消按钮
      cancel() {
        this.baseDevelopDialog = false
      },
      // 保存
      saveBaseRule() {
        if (this.form.indBaseRule.bizCode == null || this.form.indBaseRule.bizCode.trim() == '') {
          this.$message.error({
            message: '原子指标不能为空'
          })
          return false
        }
        if (this.form.indBaseRule.measureColumn == null || this.form.indBaseRule.measureColumn.trim() == '') {
          this.$message.error({
            message: '度量不能为空'
          })
          return false
        }
        // form表单作为参数
        saveBaseRule(this.form).then(data => {
          if (data.code === 0) {
            this.$message.success({
              message: '保存成功!'
            })
            this.cancel()
            this.$emit('func', 'hi')
          } else {
            this.$message.error({
              message: data.msg
            })
          }
        })
      },
      // 上线
      upLine() {
        saveBaseRule(this.form).then(data => {
          if (data.code === 0) {
            const indIndicatorInfo = {
              'ieCode': this.form.ieCode,
              'status': 4
            }
            updateStatuesByIeCode(indIndicatorInfo).then(data => {
              if (data.code === 0) {
                this.$message.success({
                  message: '操作成功!'
                })
                this.cancel()
                this.$emit('func', 'hi')
              } else {
                this.$message.error({
                  message: data.msg
                })
              }
            })
          } else {
            this.$message.error({
              message: data.msg
            })
          }
        })
      }
      /* 基础指标开发的method----end */
    }
  }
</script>

<style scoped>
  .content {
    margin-top: -15px;
    height: 150px;
  }
</style>
