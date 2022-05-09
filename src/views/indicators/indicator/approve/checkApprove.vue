<template>
  <el-dialog
    append-to-body
    :visible.sync="approveDialog"
    :title="gdtitle"
    width="60%"
    top="15vh"
  >
    <div class="content">

      <el-form ref="form" :model="form" size="small" label-width="120px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">

          <el-steps :active="active"  finish-status="success"  process-status="process"  >
          <el-step title="提交" icon="el-icon-remove-outline"></el-step>
          <el-step title="审批" icon="el-icon-remove-outline"></el-step>
          <!--<el-step title="科技审批" icon="el-icon-upload"></el-step>
          <el-step title="上线" icon="el-icon-upload"></el-step>-->
          <el-step title="启用" icon="el-icon-remove-outline"></el-step>
        </el-steps>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="指标编号">
            <el-input v-model="form.ieCode" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="指标名称">
            <el-input v-model="form.ieName" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="指标级别" prop="ieProp">
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
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="默认值">
            <el-input v-model="form.ieDefaultValue" placeholder="" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="指标单位" prop="ieDataUnit">
            <el-select v-model="form.ieDataUnit" placeholder="" :disabled="true">
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
          <el-form-item label="指标业务规则">
            <el-input v-model="form.ieRule" :disabled="true" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
          <el-form-item label="指标描述">
            <el-input v-model="form.ieDesc" :disabled="true" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
          <el-form-item label="审批意见" prop="">
            <el-input v-model="form.approvalOpinion" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col class="dialog-footer">
          <span>
            <el-button type="primary" @click="checkApprove(2)">通过</el-button>
            <el-button type="primary" @click="checkApprove(3)">拒绝</el-button>
            <el-button type="primary" @click="approveDialog = false">取消</el-button>
          </span>
        </el-col>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { updateStatus,getByIeCode } from '../../../../api/indicators/indIndicatorInfo'
  export default {
    name: "checkApprove" ,
    props: {
      id: null
    },
    components: {
      Treeselect
    },
    dicts: ['IE_PROP', 'IE_TYPE', 'IE_METHOD', 'CALC_FREQ', 'IE_STATUS', 'IE_DATA_UNIT', 'RETENTION'],
    data() {
      return {
        active: null,
        approveDialog: false,
        title: '指标审批',
        gdtitle: '指标审批',
        form: {},
        depts: [] // 部门数组
      }
    },
    watch: {
      id: 'changeData' // 值可以为methods的方法名
  },
    mounted() {

    },
    methods: {
      //监听form中iecode的变化
      changeData(value,oldvalue){

        if (this.id) {
          getByIeCode(this.id).then(res => {
            if (res.code === 0) {
              this.form = res.data
        //当指标状态为已提交时
        if ( this.form.status === '1') {
          this.active = 1
        }
        //当指标状态为11待科技审批时
        if ( this.form.status === '11') {
          this.active = 2
        }
        //当指标状态为2科技已审批
        if ( this.form.status === '2') {
          this.active = 2
        }
        //当指标状态为4已上线时
        if ( this.form.status === '4') {
          this.active = 3
        }
            }
          })
        }
        if (this.id) {
          getByIeCode(this.id).then(res => {
            if (res.code === 0) {
              this.form = res.data
            }
          })
        }
      },
      checkApprove(status) {
        // 审批拒绝必须输入审批意见
        if (status === 3) {
          if (this.form.approvalOpinion == null || this.form.approvalOpinion.trim() == '') {
            this.$message.error({
              message: '审批拒绝必须输入审批意见'
            })
            return false
          }
        }
        // 审批通过时判断原先状态进行状态修改
        if (status === 2) {
          if (this.form.status == 1) {
            status = 11
          }
          if (this.form.status == 11) {
            status = 2
          }
          if (this.form.status == 2) {
            status = 4
          }
          if (this.form.status == 4) {
            status = 5
          }
        }
       /* this.$confirm(`确定审批所选数据吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {*/
          const param = []
          const indIndicatorInfo = {
            'id': this.form.id,
            'ieCode': this.form.ieCode,
            'status': status,
            'approvalOpinion': this.form.approvalOpinion
          }
          param.push(indIndicatorInfo)
          updateStatus(param).then(returnData => {
            if (returnData.code === 0) {
              this.$message.success({
                message: '操作成功!'
              })
              this.approveDialog = false
              this.$emit('success',true)
              this.$parent.crud.toQuery()
            } else {
              this.$message.error({
                message: '操作失败!错误原因:' + returnData.msg
              })
              this.approveDialog = false
            }
          })
       /* })*/
      }
    }
  }

</script>

<style scoped>
  .content {
    margin-top: -35px;
    height: 500px;
    width: 100%;
  }
  .dialog-footer {
    overflow: auto;
    height: 35px;
    text-align: center;
    margin-top: 10px;
  }

</style>
