<template>
  <div class="app-container">
    <!-- 算法定义--sql校验 -->
    <el-dialog append-to-body :title="title" :visible.sync="sqlCheck" width="50%">
      <el-form ref="sqlData" :model="sqlData" size="small" label-width="100px" style="height: 300px;">
        <el-form-item label="sql内容" prop="sqlText">
          <el-input
            v-model="sqlData.sqlText"
            type="textarea"
            :rows="15"
            placeholder="查询字段中有且只能有一个指标字段和一个或多个维度字段,总长度不超过300个字符"
            style="width: 600px;"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sqlCheck = false">取 消</el-button>
        <el-button :loading="loading" type="primary" :disabled="sqlTemp" @click="saveSql">保存</el-button>
        <el-button :loading="loading" type="primary" style="background:#67C23A" @click="sqlTest">sql校验</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import crudIndIndicatorInfo, { saveArithmetic } from '../../../../api/indicators/indIndicatorInfo'
  import { sqlCheck } from '@datasource/api/datasources/indDatasource'
  import category from '../../category/categoryInfo'
  import aForm from './taste/tastePage'
  import { getDimListById } from '../../../../api/indicators/indDimension'

  export default {
    components: {
      category,
      aForm
    },
    data() {
      return {
        loading: false,
        dialog: false,
        sqlCheck: false,
        limitCheck: false,
        title: '',
        ieCode: '',
        tree: {},
        tags: [],
        dBExpress: [],
        tempArray: [],
        dimArray: [],
        tableData: [{
          checkName: '',
          checkFlag: '',
          checkValue: '',
          isCheck: false
        }],
        sqlTemp: true,
        sqlData: {
          dataSourceId: null,
          sqlText: null,
          ieCode: null
        },
        categoryIdL: '',
        categoryName: ''
      }
    },
    mounted() {
      // 删除初始化时第一行数据
      this.tableData.splice(0, 1)
    },
    methods: {
      /* SQL校验的method----start */
      // SQL校验触发事件
      sqlTest() {
        const param = {
          'sqlText': this.sqlData.sqlText
        }
        sqlCheck(param).then(data => {
          if (data.code === 0) {
            if (data.data.isCheck == 'Y') {
              this.$message.success({
                message: 'sql校验成功'
              })
              this.sqlTemp = false
              return
            } else {
              this.$message.error({
                message: 'sql语法不正确'
              })
              this.sqlTemp = true
              return
            }
          } else {
            this.$message.error({
              message: 'sql校验失败'
            })
            this.sqlTemp = true
            return
          }
        })
      },
      // SQL校验触发事件
      saveSql() {
        const param = {
          'ieCode': this.sqlData.ieCode,
          'ruleType': '2',
          'calcRule': this.sqlData.sqlText
        }
        saveArithmetic(param).then(data => {
          if (data.code === 0) {
            this.$message.success({
              message: '衍生指标计算规则保存成功'
            })
            this.sqlCheck = false
          } else {
            this.$message.error({
              message: '衍生指标计算规则保存失败'
            })
            this.sqlCheck = false
          }
        })
      },
      /* SQL校验的method----end */
    }
  }
</script>

<style scoped>
  .dialog-footer {
    overflow: auto;
    height: 35px;
    margin-left: 300px;
    margin-top: 30px;
  }
</style>
