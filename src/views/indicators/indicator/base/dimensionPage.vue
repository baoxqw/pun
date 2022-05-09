<template>
  <div class="app-container">
    <el-dialog append-to-body class="dialog" :close-on-click-modal="false" :visible.sync="dimensionDialog" :title="title" width="30%" top="2vh">
      <div class="content">
        <el-table
          ref="multipleTable"
          :data="dimInfo"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="维度编号"
            width="120"
          >
            <template slot-scope="scope">{{ scope.row.dimCode }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="维度名称"
            width="120"
          >
            <template slot-scope="scope">{{ scope.row.dimDesc }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="表列名"
            width="120"
          >
            <template slot-scope="scope">{{ scope.row.colCode }}</template>
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-button style="float:right;margin-right: 10px" type="primary" @click="dimClickHandle">确定</el-button>
          <el-button style="float:right;margin-right: 10px" class="footer1" @click="dimensionDialog=false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dimensionDialog: false,
        title: '',
        dimInfo: [],
        multipleSelection: [],
        indDimRelations: []
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 做默认选中的处理
      selectRow() {
        this.$nextTick(() => {
          for (let i = 0; i < this.indDimRelations.length; i++) {
            this.$nextTick(function() {
              this.dimInfo.forEach(row => {
                if (this.indDimRelations[i].dimCode === row.dimCode) {
                  this.$refs.multipleTable.toggleRowSelection(row, true)
                }
              })
            })
          }
        })
      },
      // 确定按钮
      dimClickHandle() {
        let val = '' // 页面显示
        const indDimRelations = [] // 数据库维度信息
        for (let i = 0; i < this.multipleSelection.length; i++) {
          // 拼接字符串用于页面显示
          val = this.multipleSelection[i].colCode + ',' + val
          // 封装维度对象数组保存到数据库
          var newValue = {
            dimSeq: i + 1,
            tableColumn: 'dimension' + i,
            dimCode: this.multipleSelection[i].dimCode,
            dimColumn: this.multipleSelection[i].colCode,
            dimName: this.multipleSelection[i].dimDesc
          }
          indDimRelations.push(newValue)
        }
        // 给父组件传递参数
        this.$emit('func', val.substr(0, val.length - 1), indDimRelations)
        this.dimensionDialog = false
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
