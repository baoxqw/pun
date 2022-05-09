<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog" :title="title" width="60%">
    <el-row :gutter="24">
      <div class="content">
        <div class="tableDiv">
          <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="指标编号" prop="ieCode">
                <el-input v-model="form.ieCode" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="指标名称" prop="ieName">
                <el-input v-model="form.ieName" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="指标类别" prop="ieProp">
                <el-select v-model="form.ieProp" filterable placeholder="请选择" style="width: 100%;" :disabled="true">
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
              <el-form-item label="默认值">
                <el-input v-model="form.ieDefaultValue" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="计算频度">
                <el-select v-model="form.calcFreq" filterable placeholder="请选择" style="width: 100%;" :disabled="true">
                  <el-option
                    v-for="item in dict.CALC_FREQ"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="指标单位" prop="ieDataUnit">
                <el-select v-model="form.ieDataUnit" filterable placeholder="请选择" style="width: 100%;" :disabled="true">
                  <el-option
                    v-for="item in dict.IE_DATA_UNIT"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="创建人">
                <el-input v-model="form.crtUserCode" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="创建日期" :formatter="timeColumnFormat">
                <el-date-picker v-model="form.crtDate" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="修改人">
                <el-input v-model="form.updUserCode" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="修改日期">
                <el-date-picker v-model="form.updDate" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="生效日期">
                <el-date-picker v-model="form.startDate" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="失效日期">
                <el-date-picker v-model="form.endDate" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="结果保留期限">
                <el-select v-model="form.retention" filterable placeholder="请选择" style="width: 100%;" :disabled="true">
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
                <el-select v-model="form.status" filterable placeholder="请选择" :disabled="true" style="width: 100%;">
                  <el-option
                    v-for="item in dict.IE_STATUS"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="指标评价规则">
                <el-input v-model="form.ieRule" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="指标描述">
                <el-input v-model="form.ieDesc" :readonly="true" />
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
    </el-row>
    <div class="dialog-footer">
      <el-button @click="dialog = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    ieCode: 'ieCode',
    dicts: ['IE_PROP', 'IE_TYPE', 'IE_METHOD', 'CALC_FREQ', 'IE_STATUS', 'IE_DATA_UNIT', 'RETENTION'],
    data() {
      return {
        loading: false,
        dialog: false,
        title: '',
        /* ieCode: '',*/
        /* tag: {
      data: []
    },*/
        /* ieCode:{
      ieCode
    },*/
        userIds: []
      }
    },
    computed: {},
    created() {

    },
    methods: {}
  }
</script>

<style scoped>
  .content {
    margin-top: 15px;
  }

  .dialog-footer {
    overflow: auto;
    height: 35px;
    margin-left: 300px;
    margin-top: 30px;
  }
</style>
