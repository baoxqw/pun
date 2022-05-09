<template>
  <el-dialog append-to-body :visible.sync="detailsDialog" :title="title" width="55%" top="8vh">
    <div class="content">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="指标编号">
              <el-input v-model="form.ieCode" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="指标名称">
              <el-input v-model="form.ieName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="指标级别">
              <el-select v-model="form.ieProp" :disabled="true">
                <el-option
                  v-for="item in dict.IE_PROP"
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
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
            <el-form-item label="查看部门">
              <treeselect
                v-model="form.viewDepts"
                :options="viewDept"
                :multiple="true"
                :flat="true"
                :default-expand-level="1"
                placeholder="选择部门"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="指标类型">
              <el-select v-model="form.formulateBasis" :disabled="true">
                <el-option
                  v-for="item in dict.IE_TARGET_TYPE"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="指标单位">
              <el-select v-model="form.ieDataUnit" :disabled="true">
                <el-option
                  v-for="item in dict.IE_DATA_UNIT"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="指标描述" prop="ieDesc">
              <el-input v-model="form.ieDesc" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="指标业务规则" prop="ieRule">
              <el-input v-model="form.ieRule" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="加工规则">
              <el-input v-if="form.indBaseRule" v-model="form.indBaseRule.calcRule" :disabled="true" type="textarea"/>
            </el-form-item>
          </el-col>

          <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="统计维度">
              <el-input v-model="form.dimVals" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="dialog-footer">
            <el-button type="primary" @click="detailsDialog = false">关闭</el-button>
            <el-button type="primary" @click="startUpdate('form')">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  //import { getDepts } from '@/api/system/dept'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  //import CRUD from '@crud/crud'
  import { add, updateStatus } from '@/api/indicators/indIndicatorInfo'
  //import request from '@/utils/request'
  export default {
    components: {
      Treeselect
    },
    dicts: ['IE_PROP', 'IE_TYPE', 'IE_TARGET_TYPE', 'IE_METHOD', 'CALC_FREQ', 'IE_STATUS', 'IE_DATA_UNIT', 'RETENTION', 'EXPRESSION'],
    data() {
      return {
        detailsDialog: false,
        title: '',
        form: {},
        atom: [],
        dimInfo: [],
        measureInfo: [],
        depts: [], // 部门数组
        viewDept: [],
        rules: {
          ieDesc: [
            { required: true, message: '指标描述不能为空', trigger: 'change' }
          ],
          ieRule: [
            { required: true, message: '指标业务规则不能为空', trigger: 'change' }
          ]
        }
      }
    },
    mounted() {
      console.log(this.form)
    },
    methods: {
      // 启用按钮
      startUpdate(form) {
        this.$refs['form'].validate(valid => {
          console.log('form', valid)
          if (!valid) {
            return
          } else {
            /*********************begin**************************/
            let temp = 0
            const param = []
            const indIndicatorInfo = this.form
            indIndicatorInfo.status = '1'
            indIndicatorInfo.id = null
            indIndicatorInfo.enable = "false"
            console.log('indIndicatorInfo = ' , indIndicatorInfo)

            // param.push(indIndicatorInfo)

            this.$confirm(`确定修改指标数据吗?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              add(indIndicatorInfo).then(returnData => {
                if (returnData.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '操作成功 '
                  })
                  this.detailsDialog = false
                } else {
                  this.$message({
                    type: 'error',
                    message: '操作失败!错误原因:' + returnData.msg
                  })
                }
              })
            })
            /*********************end**************************/

          }
        })
      }
    }

  }

</script>

<style scoped>
  .content {
    margin-top: -35px;
    width: 100%;
  }

  .dialog-footer {
    overflow: auto;
    height: 35px;
    text-align: center;
    margin-top: 10px;
  }

</style>
