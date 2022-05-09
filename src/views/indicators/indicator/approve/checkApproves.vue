<template>
  <el-dialog
    append-to-body
    :visible.sync="approveDialog"
    :title="title"
    width="60%"
    top="15vh"
  >
    <div class="content">
      <el-form ref="form" :model="form" size="small" label-width="120px">
        <el-row>
          <el-form-item label="审批意见" prop="">
            <el-input v-model="form.approvalOpinion" type="textarea" :autosize="{ minRows: 6, maxRows: 6}" />
          </el-form-item>
        </el-row>
        <el-row class="dialog-footer">
          <span>
            <el-button type="primary" @click="checkApprove(2)">通过</el-button>
            <el-button type="primary" @click="checkApprove(3)">拒绝</el-button>
            <el-button type="primary" @click="approveDialog = false">取消</el-button>
          </span>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import { updateStatus } from '../../../../api/indicators/indIndicatorInfo'
  export default {
    dicts: ['IE_PROP', 'IE_TYPE', 'IE_METHOD', 'CALC_FREQ', 'IE_STATUS', 'IE_DATA_UNIT', 'RETENTION'],
    data() {
      return {
        approveDialog: false,
        title: '',
        form: {},
        param: []
      }
    },
    methods: {
      checkApprove(status) {
        // 审批拒绝必须输入审批意见
        if (status == 3) {
          if (this.form.approvalOpinion == null || this.form.approvalOpinion.trim() == '') {
            this.$message.error({
              message: '审批拒绝必须输入审批意见'
            })
            return false
          }
        }
        // 审批通过时判断原先状态进行状态修改
        if (status === 2) {
          console.log(status)
          console.log(this.form.status)
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
        this.$confirm(`确定审批所选数据吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const reqParam = []
          for (let i = 0; i < this.param.length; i++) {
            console.log(status)
            const indIndicatorInfo = {
              'id': this.param[i].id,
              'status': status,
              'approvalOpinion': this.form.approvalOpinion
            }
            reqParam.push(indIndicatorInfo)
          }
          updateStatus(reqParam).then(returnData => {
            if (returnData.code === 0) {
              this.$message.success({
                message: '操作成功!'
              })
              this.approveDialog = false
              this.$parent.crud.toQuery()
            } else {
              this.$message.error({
                message: '操作失败!错误原因:' + returnData.msg
              })
              this.approveDialog = false
            }
          })
        })
      }
    }
  }

</script>

<style scoped>
  .content {
    margin-top: -35px;
    height: 200px;
    width: 100%;
  }
  .dialog-footer {
    overflow: auto;
    height: 35px;
    text-align: center;
    margin-top: 20px;
  }

</style>
