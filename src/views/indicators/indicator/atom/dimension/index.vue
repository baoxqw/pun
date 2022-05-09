<template>
  <!--表单组件-->
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dimensionDialog" :title="title" width="70%">
    <template slot="title" class="add-reply-dialog">
      <span>维度查询</span>
    </template>
    <!--<div class="button" style="width:3%;float:right;height:3%">
      <P>
        <el-button class="el-icon-plus" @click.prevent="addRow()" />
      </P>
      <p>
        <el-button class="el-icon-minus" @click.prevent="delData()" />
      </p>
    </div>-->
    <el-table ref="atomDim" :data="atomDimensions" style="width: 95%" @selection-change="selectRow">
      <!--<el-table-column type="selection" width="55" />-->
      <!-- <el-table-column label="序号" type="index" width="60"    :index="indexMethod"></el-table-column>-->
      <el-table-column prop="dimType" label="类型" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.dimType" filterable placeholder="请选择" :disabled="scope.row.dimType=='B'|| scope.row.dimType=='P'|| atomDimensionDis" clearable>
            <el-option
              v-for="item in dict.DIM_TYPE"
              :key="item.id"
              :label="item.label"
              :value="item.value"
              :disabled="item.value=='B' || item.value=='P'"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="dimCode" label="维度" width="200">
        <template slot-scope="scope">
          <el-select v-model="scope.row.dimCode" filterable placeholder="请选择" :disabled="scope.row.dimType!='D' || atomDimensionDis">
            <el-option
              v-for="item in dimensions"
              :key="item.dimCode"
              :label="item.dimName"
              :value="item.dimCode"
            >
              <span style="float: left">{{ item.dimName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dimCode }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <!--<el-table-column prop="dimDesc" label="维度描述" width="110">
            <template slot-scope="scope">
              <el-input v-model="scope.row.dimDesc"/>
            </template>
          </el-table-column>-->
      <el-table-column prop="colCode" label="表列名" width="200">
        <template slot-scope="scope">
          <el-select v-model="scope.row.colCode" filterable placeholder="请选择" :disabled="bizTabCodeDis || atomDimensionDis" @change="changeRemarkByColCode(scope.row)">
            <el-option
              v-for="item in colCodes"
              :key="item.id"
              :label="item.columnName"
              :value="item.columnName"
              :disabled="item.dis"
            >
              <span style="float: left">{{ item.columnDesc }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.columnName }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <!--<el-table-column prop="dimFlag" label="维度生成方式" width="110">
            <template slot-scope="scope">
              <el-select v-model="scope.row.dimFlag" filterable placeholder="请选择">
                <el-option
                  v-for="item in dict.DIM_FLAG"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>-->
      <el-table-column prop="sourceCol" label="原表字段" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sourceCol" :readonly="true" :disabled="atomDimensionDis" />
        </template>
      </el-table-column>
      <!-- <el-table-column prop="defaultCode" label="默认代码" width="110">
        <template slot-scope="scope">
          <el-input v-model="scope.row.defaultCode" :disabled="atomDimensionDis" />
        </template>
      </el-table-column>-->
      <el-table-column prop="remark" label="注释" width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" :disabled="atomDimensionDis" />
        </template>
      </el-table-column>
      <el-table-column prop="dimSeq" label="顺序号" width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.dimSeq" :disabled="atomDimensionDis" />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="dimensionDialog=false ">取消</el-button>
      <el-button type="primary" :style="{ display:dimDisplay}" @click="dimClickHandle">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import CRUD,{crud} from '@crud/crud'
  export default {
    name: 'IndAtomDimension',
    components: {},
    mixins: [],
    dicts: ['DIM_TYPE', 'DIM_FLAG'],
    props: {
      atomDimensionDis: { type: Boolean, default: false },
      bizTabCodeDis: { type: Boolean, default: false }
    },
    data() {
      return {
        atomDimensions: [],
        dimensions: [],
        keepHistory: '0',
        selectListRow: [],
        dimensionDialog: false,
        dimDisplay: '',
        bizTabCode: null,
        colCodes: [],
        title: '',
        permission: {
          add: ['admin', 'indAtomDimension:add'],
          edit: ['admin', 'indAtomDimension:edit'],
          del: ['admin', 'indAtomDimension:del']
        },
        rules: {}
      }
    },
    watch: {
      atomDimensions: {
        handler(newName, oldName) {
          this.colCodes.some((colCode)=>{
            colCode.dis = false
            this.atomDimensions.some((atomDim)=>{
              if(colCode.columnName===atomDim.colCode){
                colCode.dis = true
              }
            })
          })
        },
        deep: true
      }
    },
    methods: {
      // 获取数据前设置好接口地址
       [CRUD.HOOK.beforeRefresh]() {
         console.log(this.props.bizTabCodeDis,'bizTabCodeDis')
         return true
       },
      /* indexMethod(a){
        console.log(a,'val')
      },*/
      // 获取表格选中时的数据
      selectRow(val) {
        this.selectListRow = val
      },
      changeRemarkByColCode(item) {
        this.colCodes.some((colCode) => {
          if (colCode.columnName === item.colCode) {
            item.remark = colCode.columnDesc
           /* if(colCode.dis===true){
              colCode.dis = false
            }else{
              colCode.dis = true
            }*/
        }
        })
      },
      // 点击确定按钮向父页面传维度数据
      dimClickHandle() {
        const atomDimension = []
        let dimType = 0
        let dimTypeM = 0
        let dimTypeB = 0
        let dimTypeP = 0
        let dimColeN = 0
        for (let i = 0; i < this.atomDimensions.length; i++) {
          if (this.atomDimensions[i].dimType === 'D' && this.atomDimensions[i].dimCode === null) {
            this.$message('类型为维度时 必须选择维度编号')
            return false
          }
          this.dimensions.some((item) => {
            if (item.dimCode === this.atomDimensions[i].dimCode) {
              this.atomDimensions[i].dimDesc = item.dimName
            }
          })
          var newValue = {
            id: this.atomDimensions[i].id,
            dimType: this.atomDimensions[i].dimType,
            dimCode: this.atomDimensions[i].dimCode,
            dimDesc: this.atomDimensions[i].dimDesc,
            dimFlag: this.atomDimensions[i].dimFlag,
            colCode: this.atomDimensions[i].colCode,
            defaultCode: this.atomDimensions[i].defaultCode,
            sourceCol: this.atomDimensions[i].sourceCol,
            remark: this.atomDimensions[i].remark,
            dimSeq: this.atomDimensions[i].dimSeq
          }
          if (this.atomDimensions[i].dimType === 'M') {
            dimTypeM++
          }
          if (this.atomDimensions[i].dimType === 'B') {
            dimTypeB++
          }
          if (this.atomDimensions[i].dimType === 'P') {
            dimTypeP++
          }
          if (this.atomDimensions[i].dimType !== null && this.atomDimensions[i].colCode === null) {
            dimColeN++
          }
          if (this.atomDimensions[i].dimType !== null) {
            atomDimension.push(newValue)
          }else{
            dimType++
          }
        }
        if(dimType==0){
        if (dimColeN === 0) {
        if (dimTypeM > 0) {
          if (dimTypeB > 0) {
            if (this.keepHistory === '1' && dimTypeP === 0) {
              this.$message('保留历史时 必须选择一个日期')
            } else {
              this.$emit('func', atomDimension)
              this.dimensionDialog = false
            }
          } else {
            this.$message('类型必须有一个是指标编号')
          }
        } else {
          this.$message('类型至少有一个是度量')
        }
      } else {
          this.$message('表列名不能为空')
        }
        }else {
          this.$message('类型不能为空')
        }
      },
      // 增加行
      addRow() {
        var list = {
          dimCode: this.dimCode,
          dimDesc: this.dimDesc,
          dimType: this.dimType,
          dimFlag: this.dimFlag,
          defaultCode: this.defaultCode,
          sourceCol: this.sourceCol,
          colCode: this.colCode,
          remark: this.remark
        }
        this.atomDimensions.unshift(list)
        console.log(this.bizTabCode)
      },
      // 删除方法 删除选中行
      delData() {
        /* for (let i = 0; i < this.selectlistRow.length; i++) {*/
        const atomRows = this.selectListRow
        const atomDs = this.atomDimensions
        for (let i = 0; i < atomRows.length; i++) {
          for (let j = 0; j < atomDs.length; j++) {
            if (atomRows[i] === atomDs[j]) {
              this.atomDimensions.splice(j, 1)
            }
          }
        }
        this.atomDimensions.clearSelection()
      }
    }
  }
</script>

<style scoped>

</style>
