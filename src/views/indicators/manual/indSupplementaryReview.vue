<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select class="filter-item" v-model="query.approveStatus" filterable clearable placeholder="审批状态" style="width: 180px;"
                   @keyup.enter.native="crud.toQuery">
          <el-option
                  v-for="item in dict.BE_APPROVE_STATUS"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <el-button slot="left" class="filter-item" size="mini" type="success"
                 :disabled="crud.selections.length !=1"
                 @click="Approved(crud.selections)"
      >审批
      </el-button>
      <el-button slot="left" class="filter-item" size="mini" type="success"
                 :disabled="crud.selections.length !=1"
                 @click="showDetail(crud.selections)"
      >详情
      </el-button>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.supplementaryDescribe" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="审核结论">
            <el-input v-model="form.approveStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="补录ID">
            <el-input v-model="form.supplementaryId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建用户">
            <el-input v-model="form.crtUserCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建机构">
            <el-input v-model="form.crtOrgCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.crtDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改用户">
            <el-input v-model="form.updUserCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改机构">
            <el-input v-model="form.updOrgCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="存续时间">
            <el-input v-model="form.inputdate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改时间">
            <el-input v-model="form.updDate" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" @close="closeApprovedDialog" :visible="approvedDialog" title="补录审批" width="350px">
        <el-form :model="form">
          <el-form-item label="审批结论"  >
           <el-select v-model="form.approveStatus" filterable clearable placeholder="请选择" style="width: 180px">
             <el-option
                     v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
             </el-option>
           </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button  class="el-upload" size="mini" :disabled="false" type="success" @click="submit()">确定</el-button>
          </span>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" @close="closeDetailDialog" title="" width="80%" :visible="DetailDialog">
        <el-table ref="detailData" :data="detailData" size="small" style="width:100%"
                  v-loading="loading"
                  @selection-change="crud.selectionChangeHandler"
                  stripe border :header-cell-style="{background:'rgb(232,237,229)'}"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column  prop="periodDate" label="数据日期" width="100px" />
          <el-table-column  prop="deptName" label="机构" width="100px"/>
          <el-table-column  prop="ieKindOneName" label="指标一级分类" width="120px"/>
          <el-table-column prop="ieName" label="指标名称" width="100px" />
          <el-table-column  prop="currency" label="币种" width="100px">
            <template slot-scope="scope">
              {{ dict.label.IND_CURRENCY[scope.row.currency] }}
            </template>
          </el-table-column>
          <el-table-column  prop="frequency" label="频率" width="100px">
            <template slot-scope="scope">
              {{ dict.label.IE_FREQUENCY[scope.row.frequency] }}
            </template>
          </el-table-column>
          <el-table-column  prop="ieValue" label="当期值" width="100px"/>
          <el-table-column  prop="supplementaryValue" label="补录值" width="100px"/>
<!--
          <el-table-column  prop="ieValue" label="调整差额" width="100px"/>
-->
          <el-table-column  prop="supplementaryReason" label="补录原因" width="100px"/>
          <el-table-column  prop="updUserCode" label="补录人" width="100px"/>
        </el-table>
<!--        <el-pagination
                background
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="cur_page"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"

        ></el-pagination>-->
      </el-dialog>

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="ID" />
        <el-table-column v-if="columns.visible('supplementaryDescribe')" prop="supplementaryDescribe" label="描述" />
        <el-table-column v-if="columns.visible('approveStatus')" prop="approveStatus" label="审批状态" >
          <template slot-scope="scope">
            {{ dict.label.BE_APPROVE_STATUS[scope.row.approveStatus] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建用户" />
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建时间" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.crtDate) }}</span>
        </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudIndSupplementaryReview,{toApprove} from '../../../api/indicators/indSupplementaryReview'
import {findIndByApproveId} from '../../../api/indicators/indIndicatorManual'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '补录审核', url: crudIndSupplementaryReview.url, sort: 'id,desc', crudMethod: { ...crudIndSupplementaryReview.crud }})
const defaultForm = { id: null, supplementaryDescribe: null,approveStatus:null, supplementaryId: null,infoId:null, crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, inputdate: null, updDate: null }
const detailData=[]
export default {
  name: 'IndSupplementaryReview',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['RETENTION', 'IE_TYPE', 'IE_STATUS', 'IND_CURRENCY', 'IND_FIRST_TYPE','BUSSINESS_DEPT','IE_FREQUENCY','IND_APPROVE_STATUS','BE_APPROVE_STATUS'],
  data() {
    return {
      approvedDialog:false,
      DetailDialog:false,
      loading:true,
      ids:null,
      infoIds:null,
      detailData,
      permission: {
        add: ['admin', 'indSupplementaryReview:add'],
        edit: ['admin', 'indSupplementaryReview:edit'],
        del: ['admin', 'indSupplementaryReview:del']
      },
      options: [{
        value: '2',
        label: '同意'
      }, {
        value: '3',
        label: '驳回'
      }],
      rules: {
        id: [
          { required: true, message: 'ID不能为空', trigger: 'blur' }
        ]
      }    }
  },
  created() {
    this.resetQuery()
  },
  methods: {
    resetQuery(){
      this.crud.resetQuery(false);
      this.crud.refresh()
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      this.crud.optShow.del = false
      this.crud.optShow.add = false
      return true
    },
    Approved(data){
        console.log(data);
        if(Object.keys(data).length == 0){
          this.$message({
            message: '请先选择一条记录',
            type: 'warning'
          });
        }else {
          this.approvedDialog = true,
          this.ids=data[0].id
          this.infoIds=data[0].infoId
        }
    },
    closeApprovedDialog(){
      this.approvedDialog = false
      this.form.approveStatus=""
      this.ids=""
      this.infoIds=""
    },
    closeDetailDialog(){
      this.DetailDialog = false
      this.loading = true

    },
    showDetail(data){
      this.DetailDialog = true
      var approveId = data[0].id
      findIndByApproveId(approveId).then(data => {
            console.log(data)
        this.detailData = data
        this.loading = false
      })
    },
    submit(){
      toApprove(this.ids,this.infoIds,this.form.approveStatus).then(data =>{
        if(data.msg =="成功"||data.msg =="操作成功"){
          this.$message.success({
            message: '操作成功!'
          })
          this.closeApprovedDialog();
          this.crud.toQuery();
        }else{
          this.$message.error({
            message: data.msg
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
