<template>
  <el-dialog append-to-body
             :visible.sync="detailsDialog" :title="title" width="60%" top="10vh">
    <div class="content">
      <el-form ref="form" :model="form" size="small" label-width="120px">
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
            <el-input v-model="form.ieDefaultValue" placeholder="" :disabled="true"/>
          </el-form-item>
        </el-col>
        <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="计算频度">
            <el-select v-model="form.calcFreq" placeholder="" :disabled="true">
              <el-option
                v-for="item in dict.CALC_FREQ"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>-->
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
        <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="生效日期">
            <el-date-picker v-model="form.startDate" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="失效日期">
            <el-date-picker v-model="form.endDate" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="结果保留期限">
            <el-select v-model="form.retention" placeholder="" :disabled="true">
              <el-option
                v-for="item in dict.RETENTION"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="指标状态">
            <el-select v-model="form.status" placeholder="" :disabled="true">
              <el-option
                v-for="item in dict.IE_STATUS"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
          <el-form-item label="指标业务规则">
            <el-input v-model="form.ieRule" type="textarea" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
          <el-form-item label="指标描述">
            <el-input v-model="form.ieDesc" type="textarea" :disabled="true"/>
          </el-form-item>
        </el-col>
        <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
          <el-form-item label="取值方式">
            <el-select v-model="form.ieMethod" placeholder="" :disabled="true">
              <el-option
                v-for="item in dict.IE_METHOD"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
          <el-form-item label="计算规则">
            <el-input v-model="form.calcRule" type="textarea" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
          <el-form-item label="审批意见" prop="">
            <el-input v-model="form.approvalOpinion" type="textarea" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col class="dialog-footer">
            <el-button type="primary" @click="detailsDialog = false">关闭</el-button>
        </el-col>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default{
    components: {
      Treeselect
    },
    dicts: ['IE_PROP', 'IE_TYPE', 'IE_METHOD', 'CALC_FREQ', 'IE_STATUS', 'IE_DATA_UNIT', 'RETENTION'],
    data(){
      return {
        detailsDialog: false,
        title: '',
        form: {},
        depts: [] // 部门数组
      }
    },
  }

</script>

<style scoped>
  .content {
    margin-top: -35px;
    height: 450px;
    width: 100%;
  }
  .dialog-footer {
    overflow: auto;
    height: 35px;
    text-align: center;
    margin-top: 10px;
  }

</style>
