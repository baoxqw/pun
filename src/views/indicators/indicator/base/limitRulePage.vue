<template>
  <div class="app-container">
    <el-dialog append-to-body class="dialog" :close-on-click-modal="false" :visible.sync="limitRuleDialog"
               :title="title" width="60%" top="2vh">
      <div class="content">
        <el-table :data="tableData" border height="350" style="width:100%;margin-top: 0px;">
          <el-table-column label="维度名称" width="150" prop="checkName">
            <template slot-scope="scope">
              <el-select ref="newText" v-model="scope.row.checkName" @change="getValueList(scope.row)">
                <el-option
                  v-for="item in dimInfo"
                  :key="item.colCode"
                  :label="item.dimDesc"
                  :value="item.dimCode"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="对应列名" width="150" prop="checkName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.colCode" style="width: 120px;" :disabled="true"/>
            </template>
          </el-table-column>

          <el-table-column label="是否包含" width="100" prop="checkFlag">
            <template slot-scope="scope">
              <el-select v-model="scope.row.expsymbol" filterabl>
                <el-option
                  v-for="item in dict.EXP_SYMBOL"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="值列表" width="355" prop="checkValue">
            <template slot-scope="scope">
              <!--<el-select v-model="scope.row.checkValue" multiple :disabled="scope.row.isCheck" style="width: 340px;">
                <el-option
                  v-for="item in scope.row.tempArray"
                  :key="item.dimCode"
                  :label="item.dimName"
                  :value="item.dimCode"
                >
                  <span style="float: left">{{ item.dimCode }}</span>
                  <span style="float: right">{{ item.dimName }}</span>
                </el-option>
              </el-select>-->
              <tree-select
                v-model="scope.row.checkValue"
                @getValue="getValue($event,scope.row)"
                :props="props"
                :options="scope.row.tempArray"
                :disabled="scope.row.isCheck"
                :multiple="true"
                :searchable="true"
                placeholder="请选择..."
                style="width: 340px;"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-button style="float:right;margin-right: 10px" type="primary" @click="dimClickHandle">确定</el-button>
          <el-button style="float:right;margin-right: 10px" class="footer1" @click="limitRuleDialog=false">取消
          </el-button>
          <el-button style="float:right;margin-right: 10px" @click="addClickHandle">新增</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getKeyValueByDimCode} from '../../../../api/indicators/indDimension'
  //import Treeselect from '@riophae/vue-treeselect'
  import TreeSelect from '@eladmin/components/TreeSelect/index'
  import "@riophae/vue-treeselect/dist/vue-treeselect.css"

  export default {
    components: {TreeSelect},
    dicts: ['EXP_SYMBOL'],
    data() {
      return {
        limitRuleDialog: false,
        title: '',
        dimInfo: '',
        tableData: [],
        tableName: '',
        indBaseRuleFilters: [],
        props:{value: "typeCode", label: "typeName",
          children: "children"
          // disabled:true
        },
        // 后台返回的数据和VueTreeselect要求的数据结构不同，需要进行转换
        normalizer(node) {
          //去掉children=[]的children属性
          if (node.children && !node.children.length) {
            delete node.children;
          }
          return {
            id: node.typeCode,
            label: node.typeName,
            children: node.children
          }
        }
      }
    },
    methods: {
      getValue(value,row) {
        row.checkValue = value
        console.log(row.checkValue,'checkValue');
      },
      //做默认选中的处理
      selectRow() {
        this.$nextTick(() => {
          for (let i = 0; i < this.indBaseRuleFilters.length; i++) {
            console.log(this.indBaseRuleFilters[i],'this.indBaseRuleFilters')
            // 根据维度编号查询对应的值列表方法
            getKeyValueByDimCode(this.indBaseRuleFilters[i].dimCode).then(retDate => {
              if (retDate.code === 0) {
                //新增一行
                var newValue = {
                  checkName: this.indBaseRuleFilters[i].dimCode,
                  colCode: this.indBaseRuleFilters[i].expName,
                  expsymbol: this.indBaseRuleFilters[i].expSymbol,
                  checkValue: this.indBaseRuleFilters[i].expValue,//.split(','),
                  isCheck: false,
                  tempArray: retDate.data
                }
                this.tableData.push(newValue)
              } else {
                this.$message.error({
                  message: '未查询到对应的值'
                })
              }
            })
          }
        })
      },
      // 新增一行
      addClickHandle() {
        var newValue = {
          checkName: '',
          colCode: '',
          expsymbol: 'in',
          checkValue: null,
          isCheck: true,
          tempArray: []
        }
        this.tableData.push(newValue)
      },
      // 删除行数
      handleDelete(index) {
        this.tableData.splice(index, 1)
      },
      // 选择维度后解锁值列表方法
      getValueList(row) {
        const para = {
          dimCode: row.checkName // change选中的维度编号
        }
        // 根据维度编号查询列名
        this.dimInfo.some((item) => {
          if (item.dimCode == row.checkName) {
            row.colCode = item.colCode
          }
        })
        // 根据维度编号查询对应的值列表方法
        getKeyValueByDimCode(row.checkName).then(retDate => {
          if (retDate.code === 0) {
            //row.tempArray = this.normalizer(retDate.data)
            console.log("==============retDate", retDate,row)
            row.tempArray=retDate.data

            row.isCheck = false // 值列表状态改为可选
            row.checkValue = null // 值列表清空
          } else {
            this.$message.error({
              message: '未查询到对应的值'
            })
          }
        })
      },
      // 确定按钮
      dimClickHandle() {
        let val = '' // 页面显示
        const indBaseRuleFilters = [] // 数据库限制规则信息
        console.log('tableData',this.tableData)
        for (var i = 0; i < this.tableData.length; i++) {
          //校验维度和值列表是否为空
          if (this.tableData[i].checkName == null || this.tableData[i].checkName == "") {
            this.$message.error({
              message: '维度不能为空'
            })
            return false;
          }
          if (this.tableData[i].checkValue.length == 0) {
            this.$message.error({
              message: '值不能为空'
            })
            return false;
          }

          // 根据限制规则拼接限制sql - 用于页面显示
          let checkVal = ''
          //let checkVal2 = ''
          let checkValues =[]
          checkValues = this.tableData[i].checkValue.split(',')
          console.log(checkValues,'checkValues')
          for (var j = 0; j < checkValues.length; j++) {
            checkVal += "'" + checkValues[j] + "',"
            //checkVal2 += this.tableData[i].checkValue[j] + ","
          }
          checkVal = checkVal.substr(0, checkVal.length - 1)
          //checkVal2 = checkVal2.substr(0, checkVal2.length - 1)
          val = val + this.tableData[i].colCode + ' ' + this.tableData[i].expsymbol + ' (' + checkVal + ')' + ' and '
          // 封装限制规则数组保存到数据库
          var newValue = {
            dimCode: this.tableData[i].checkName,
            expSeq: i + 1,
            expName: this.tableData[i].colCode,
            expSymbol: this.tableData[i].expsymbol,
            expValue: this.tableData[i].checkValue
          }
          indBaseRuleFilters.push(newValue)
        }
        console.log(val,'val')
        // 给父组件传递参数
        this.$emit('func', val.substr(0, val.length - 5), indBaseRuleFilters)
        this.limitRuleDialog = false
      }
    }
  }

</script>

<style scoped>
  .dialog {
    margin-top: 100px;
  }

  .content {
    border: 1px solid #dfe6ec;
    overflow: auto;
    height: 100%;
    width: 100%;
    margin-top: -35px;
  }

  .footer {
    overflow: auto;
    height: 100%;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
