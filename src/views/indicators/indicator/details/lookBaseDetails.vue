<template>
  <el-dialog append-to-body :visible.sync="detailsDialog" :title="title" width="55%" top="8vh">
    <div class="content">
      <el-form ref="form" :model="form" size="small" label-width="120px">
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
          <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="生效日期">
              <el-date-picker v-model="form.startDate" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="失效日期">
              <el-date-picker v-model="form.endDate" :disabled="true"/>
            </el-form-item>
          </el-col>-->
          <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="指标描述" prop="">
              <el-input v-model="form.ieDesc" type="textarea" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="指标业务规则">
              <el-input v-model="form.ieRule" type="textarea" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="加工规则">
              <el-input v-if="form.indBaseRule" v-model="form.indBaseRule.calcRule" :disabled="true" type="textarea"/>
            </el-form-item>
          </el-col>

         <!-- <el-col :xs="16" :sm="16" :md="8" :lg="8" :xl="5">
            <el-form-item label="取数表达式">
              <el-select v-if="form.indBaseRule" v-model="form.indBaseRule.expression" :disabled="true" placeholder="">
                <el-option
                  v-for="item in dict.EXPRESSION"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="16" :sm="16" :md="8" :lg="8" :xl="5">
            <el-form-item label="原子指标" prop="bizCode">
              <el-select v-if="form.indBaseRule" v-model="form.indBaseRule.bizCode" :disabled="true" placeholder="">
                <el-option
                  v-for="item in atom"
                  :key="item.bizCode"
                  :label="item.bizName"
                  :value="item.bizCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="16" :sm="16" :md="8" :lg="8" :xl="5">
              <el-select v-if="form.indBaseRule" v-model="form.indBaseRule.measureColumn" :disabled="true" placeholder="">
                <el-option
                  v-for="item in measureInfo"
                  :key="item.colCode"
                  :label="item.dimDesc"
                  :value="item.colCode"
                />
              </el-select>
          </el-col>-->

          <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="统计维度">
              <el-input v-model="form.dimVals" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>

          <!--<el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="限制规则">
              <el-input v-model="form.limitRule" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="制定依据">
              <el-input v-model="form.formulateBasis" type="textarea" :disabled="true"/>
            </el-form-item>
          </el-col>-->
          <!--<el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
            <el-form-item label="审批意见" prop="">
              <el-input v-model="form.approvalOpinion" type="textarea" :disabled="true" />
            </el-form-item>
          </el-col>-->
          <el-col class="dialog-footer">
            <el-button type="primary" @click="detailsDialog = false">关闭</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
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
        viewDept: []
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
