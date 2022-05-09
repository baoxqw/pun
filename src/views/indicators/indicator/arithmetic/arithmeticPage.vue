<template>
  <div class="app-container">
    <!-- 算法定义--四则运算 -->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="arithmeticDialog" :title="title" width="80%" top="5vh">
      <el-row :gutter="24">
        <div class="content">
          <el-col :span="6">
            <div class="line">
              <category ref="category" type="0" @node-click="handleCategoryClick" />
            </div>
          </el-col>
          <el-col :span="15">
            <div>
              <el-row>运算符号:</el-row>
              <br>
              <el-row>
                <el-button :loading="loading" type="primary" @click="handleSymbolClick('+')">+</el-button>
                <el-button :loading="loading" type="primary" @click="handleSymbolClick('-')">-</el-button>
                <el-button :loading="loading" type="primary" @click="handleSymbolClick('*')">*</el-button>
                <el-button :loading="loading" type="primary" @click="handleSymbolClick('/')">/</el-button>
                <el-button :loading="loading" type="primary" @click="handleSymbolClick('(')">(</el-button>
                <el-button :loading="loading" type="primary" @click="handleSymbolClick(')')">)</el-button>
                <el-button :loading="loading" type="primary" @click="reset()">重置</el-button>
              </el-row>
            </div>
            <br>
            <el-row>运算表达式:</el-row>
            <div class="tablediv">
              <!--textarea中标签不能分行,分行会导致出现空格-->
              <textarea id="arith" v-model="arithtext" rows="15" cols="80" style="width: 100%" />
            </div>
            <div class="dialog-footer">
              <el-button :loading="loading" type="primary" @click="taste()">试算</el-button>
              <el-button :loading="loading" type="primary" @click="saveAri()">保存</el-button>
              <!-- <el-button :loading="loading" type="primary" @click="upLine()">上线</el-button>-->
              <el-button type="text" @click="cancel()">关闭</el-button>
            </div>
          </el-col>
          <aForm ref="tastePage" />
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import crudIndIndicatorInfo, { saveArithmetic, checkexpression, updateStatuesByIeCode } from '../../../../api/indicators/indIndicatorInfo'
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
        arithmeticDialog: false,
        title: '',
        ieCode: '',
        arithtext: ''
      }
    },
    mounted() {
    },
    methods: {
      /* 四则运算的method----start */
      // 点击指标触发
      handleCategoryClick(data) {
        if (data.categoryType === '88') {
          // 获取指标名称,添加[]后调用insertText方法
          const categoryName = '[' + data.categoryName + ']'
          this.insertText(document.getElementById('arith'), categoryName)

          // 调用子组件方法刷新左侧树状列表
          // this.$refs.category.refresh();
        }
      },
      // 点击运算符号触发
      handleSymbolClick(param) {
        this.insertText(document.getElementById('arith'), param)
      },
      // textarea中在鼠标位置插入内容。obj为textarea对象,charvalue为插入内容
      insertText(obj, charvalue) {
        obj.focus()
        var leng = obj.value.length
        if (typeof document.selection !== 'undefined') // ie
        {
          var r = document.selection.createRange()
          r.text = charvalue
        } else // firefox
        {
          var ops = obj.value.substr(0, obj.selectionStart) + charvalue
          obj.value = ops + obj.value.substring(obj.selectionStart, leng)
          obj.setSelectionRange(ops.length, ops.length)
        }
      },
      // 试算
      taste() {
        // 校验表达式
        const param = {
          'calcRule': document.getElementById('arith').value
        }
        checkexpression(param).then(retuData => {
          if (retuData.code === 0) {
            let modules = []
            modules = retuData.data // 分割后的指标名称

            // 打开指标试算页面
            const _this = this.$refs.tastePage
            _this.formula = document.getElementById('arith').value
            _this.modules = modules
            _this.title = '试算'
            _this.resultData = []
            _this.dialog = true
          } else {
            this.$message.error({
              message: retuData.msg
            })
          }
        })
      },

      // 取消按钮
      cancel() {
        this.arithmeticDialog = false
      },
      // 重置
      reset() {
        this.arithtext = ''
      },
      // 保存
      saveAri() {
        // 校验表达式是否正确
        const param = {
          'calcRule': document.getElementById('arith').value
        }
        checkexpression(param).then(retuData => {
          if (retuData.code === 0) {
            const data = {
              'ieCode': this.ieCode,
              'ruleType': '1',
              'ruleDesc': document.getElementById('arith').value
            }
            saveArithmetic(data).then(data => {
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
          } else {
            this.$message.error({
              message: retuData.msg
            })
          }
        })
      },
      // 上线
      upLine() {
        // 校验表达式是否正确
        const param = {
          'calcRule': document.getElementById('arith').value
        }
        checkexpression(param).then(retuData => {
          if (retuData.code === 0) {
            const data = {
              'ieCode': this.ieCode,
              'ruleType': '1',
              'ruleDesc': document.getElementById('arith').value
            }
            saveArithmetic(data).then(data => {
              if (data.code === 0) {
                const indIndicatorInfo = {
                  'ieCode': this.ieCode,
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
          } else {
            this.$message.error({
              message: retuData.msg
            })
          }
        })
      }
      /* 四则运算的method----end */
    }
  }
</script>

<style scoped>
  .content {
    margin-top: -35px;
  }

  .line {
    border: 1px solid #dfe6ec;
    overflow: auto;
    height: 100%;
    width: 100%;
    margin-top: 10px;
  }

  .tablediv {
    overflow: auto;
    width: 100%;
    margin-top: 10px;
  }

  .dialog-footer {
    overflow: auto;
    height: 35px;
    margin-left: 300px;
    margin-top: 30px;
  }
</style>
