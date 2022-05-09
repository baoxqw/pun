<template>
  <div class="app-container">
    <!-- 算法定义--限制条件 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="limitCheck"
      width="80%"
      top="2vh"
    >
      <el-row :gutter="24">
        <div class="content">
          <el-col :span="6">
            <div class="line">
              <category type="1" @node-click="handleCategoryClick1" />
            </div>
          </el-col>
          <el-col :span="15">
            <br>
            <el-row>限制内容:【{{ categoryName }}】</el-row>
            <div class="tablediv">
              <el-table :data="tableData" border height="350" style="width:100%;margin-top: 0px;">
                <el-table-column label="维度名称" width="200" prop="checkName">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.checkName" @change="getValueList(scope.$index, scope.row)">
                      <el-option
                        v-for="item in dimArray"
                        :key="item.dimCode"
                        :label="item.dimName"
                        :value="item.dimCode"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="是否包含" width="200" prop="checkFlag">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.checkFlag">
                      <el-option label="包含" value="Y" />
                      <el-option label="不包含" value="N" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="值列表" width="200" prop="checkValue">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.checkValue" multiple :disabled="scope.row.isCheck">
                      <el-option
                        v-for="item in tempArray"
                        :label="item.dimName"
                        :value="item.dimName"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="130">
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
            </div>
            <div class="dialog-footer">
              <el-button :loading="loading" type="primary" @click="savelimit()">保存</el-button>
              <el-button @click="limitCheck = false">关闭</el-button>
            </div>
          </el-col>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import crudIndIndicatorInfo, { saveArithmetic } from '../../../../api/indicators/indIndicatorInfo'
  import { sqlCheck } from '@datasource/api/datasources/indDatasource'
  import category from '../../category/categoryInfo'
  import aForm from './taste/tastePage'
  import { getDimListById, getValueListByDimCode } from '../../../../api/indicators/indDimension'

  export default {
    components: {
      category,
      aForm
    },
    data() {
      return {
        loading: false,
        limitCheck: false,
        title: '',
        ieCode: '',
        tempArray: [],
        dimArray: [],
        tableData: [{
          checkName: '',
          checkFlag: '',
          checkValue: '',
          isCheck: false
        }],
        categoryName: ''
      }
    },
    mounted() {
      // 删除初始化时第一行数据
      this.tableData.splice(0, 1)
    },
    methods: {
      /* 限制校验的method----start */
      // 点击指标触发
      handleCategoryClick1(data) { // 限制规则选择基础指标展示右侧选项
        if (data.categoryType === '88') {
          if (this.categoryId != data.id) {
            this.dimArray = []
            this.tableData = []
          }
          this.categoryName = data.categoryName
          this.categoryId = data.id
          const para = {
            id: data.id
          }
          getDimListById(para).then(data => { // 根据基础指标id查询对应维度列表信息
            if (data.code === 0) {
              this.dimArray = data.data// 查询成功后放入对应数组
            } else {
              this.dimArray = []
            }
          })
          var newValue = {
            checkName: '',
            checkFlag: 'Y',
            checkValue: '',
            isCheck: true
          }
          // 添加新的行数
          this.tableData.push(newValue)
        }
      },
      handleDelete(index) { // 删除行数
        this.tableData.splice(index, 1)
      },
      getValueList(index, row) { // 选择维度后解锁值列表方法
        const para = {
          dimCode: row.checkName // change选中的维度编号
        }
        //这个方法不可用了,改为getValueListByTableAndColumn方法,由于衍生指标限制规则不使用，暂未修改
        getValueListByDimCode(para).then(data => { // 根据维度编号查询对应的值列表方法
          if (data.code === 0) {
            this.tempArray = data.data
          } else {
            this.tempArray = []
            this.$message.error({
              message: '未查询到对应的值'
            })
          }
        })
        row.isCheck = false// 值列表状态改为可选可选
      },
      // 保存限制条件
      savelimit() {
        // 1、判断tableData不为空并且元素不为空
        console.log(this.tableData)

        const param = {
          'ieCode': this.ieCode,
          'ruleType': '3',
          'calcRule': '',
          'dependType': '1', // 依赖指标类型(1-基础，2-衍生指标，3-参数)
          'dependId': this.categoryId, // 依赖指标id
          'tableData': this.tableData // 限制内容
        }
        saveArithmetic(param).then(data => {
          if (data.code === 0) {
            this.$message.success({
              message: '保存成功!'
            })
            this.limitCheck = false
          } else {
            this.$message.error({
              message: data.msg
            })
          }
        })
      }
      /* 限制校验的method----end */
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
    border: 1px solid #dfe6ec;
    overflow: auto;
    height: 450px;
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
