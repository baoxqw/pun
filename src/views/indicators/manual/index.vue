<template>
  <div class="app-container">
    <!--工具栏-->

    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <treeselect v-model="query.deptNo" :options="deptList"  style="width: 320px" size="small"  placeholder="选择机构" class="filter-item"/>

        <el-date-picker  v-model="query.periodDate"  type="date"  size="small" filterable clearable placeholder="数据日期"
                         class="date-item" value-format="yyyy-MM-dd"  />
        <el-input v-model="query.ieName" clearable size="small" placeholder="指标名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <el-select class="filter-item" v-model="query.currency" filterable clearable placeholder="币种" style="width: 180px;"
                   @keyup.enter.native="crud.toQuery">
          <el-option
                  v-for="item in dict.IND_CURRENCY"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
          />
        </el-select>
<!--        <el-select  v-model="query.ieKindOneName" clearable size="small"  placeholder="指标一级分类" class="filter-item" style="width: 150px">
          <el-option v-for="item in dict.IND_FIRST_TYPE" :key="item.id" :label="item.label" :value="item.label" />
        </el-select>-->
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
                 <el-button slot="left" class="filter-item" size="mini" type="success"
                               :disabled="crud.selections.length >1"
                              @click="addOrEdit(crud.selections)"
                    >补录
                    </el-button>
      <el-upload
              slot="right"
              ref="upload"
              class="upload-demo inline-block "
              :show-file-list="false"
              action="importData"
              accept=".xlsx,.xls"
              :disabled="importDisabled"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :http-request="uploadFile"
              multiple
              :limit="1">
        <el-button class="el-upload"  size="mini" type="primary" slot="trigger">{{importDataText }}</el-button>
        <el-button  class="el-upload" size="mini"  type="primary" @click="downloadTemplate">下载Excel模板</el-button>
        <el-button  class="el-upload" size="mini" :disabled="false" type="success" @click="showApproveDialog()">发起审核</el-button>
        <el-button
                :loading="crud.downloadLoading"
                :disabled="!crud.data.length"
                class="el-upload"
                size="mini"
                type="primary"
                icon="el-icon-download"
                @click="crud.doExport('download','补录数据')"
        >导出</el-button>
      </el-upload>

      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false"  @close="closeFlowDialog" :visible="showDialog" title="补录" width="550px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">

          <el-form-item label="指标名称" prop="ieName" :disabled="readOnly">
            <!-- <el-input v-model="form.ieName" style="width: 370px;" />-->
            <el-select v-model="form.ieName"  clearable placeholder="请选择" @change="selectChange" :disabled="readOnly">
              <el-option
                      v-for="item in bizNames"
                      :key="item.id"
                      :label="item.bizName"
                      :value="item.bizName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指标编号" prop="ieCode">
            <el-input v-model="form.ieCode"  disabled style="width: 190px;" />
          </el-form-item>
          <el-form-item label="币种" prop="currency">
            <!-- <el-input v-model="form.ieName" style="width: 370px;" />-->
            <el-select v-model="form.currency" clearable placeholder="请选择" :disabled="readOnly" @input="forceUpdate($event)">
              <el-option v-for="item in dict.IND_CURRENCY" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="频率" prop="frequency">
            <!-- <el-input v-model="form.ieName" style="width: 370px;" />-->
            <el-select v-model="form.frequency"  clearable placeholder="请选择" :disabled="readOnly" @input="forceUpdate($event)">
              <el-option v-for="item in dict.IE_FREQUENCY" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="补录值" prop="supplementaryValue"  >
            <el-input v-model="form.supplementaryValue" maxlength="10" show-word-limit style="width: 370px;" oninput="value=value.replace(/[^\d|\.]/g,'')"  @blur="valueChange"/>
          </el-form-item>
          <el-form-item label="补录原因" prop="supplementaryReason">
            <el-input v-model="form.supplementaryReason" type="textarea" maxlength="300" show-word-limit style="width: 370px;" />
          </el-form-item>
<!--          <el-form-item label="机构" prop="deptName" :disabled="readOnly">
            &lt;!&ndash; <el-input v-model="form.ieName" style="width: 370px;" />&ndash;&gt;
            <el-select v-model="form.deptName" clearable placeholder="请选择" @change="deptChange" :disabled="readOnly" @input="forceUpdate($event)">
              <el-option
                      v-for="item in deptList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="机构" prop="deptName" :disabled="readOnly">
          <treeselect v-model="form.deptNo" :options="deptList"  style="width: 320px" size="small"  placeholder="选择机构" class="filter-item"/>
          </el-form-item>
          <el-form-item label="数据日期" prop="periodDate">
            <el-date-picker v-model="form.periodDate" clearable size="small" placeholder="数据日期" type="date" :disabled="readOnly" @input="forceUpdate($event)"
                            value-format="yyyy-MM-dd"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="closeFlowDialog">取消</el-button>
          <el-button  type="primary" @click="submitCU">确认</el-button>
        </div>
      </el-dialog>

      <!--可以发起审批的list-->
      <el-dialog :close-on-click-modal="false" @close="closeToApproveDialog" title="发起审核" width="80%" :visible="toApproveDialog">
        <el-dialog
                width="30%"
                title="描述信息"
                :visible.sync="innerVisible"
                @close="closeSubmitDialog"
                append-to-body>
          <el-form :model="form">
            <el-form-item label="相关描述"  >
              <el-input type="textarea" v-model="form.submitDescribe" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button  class="el-upload" size="mini" :disabled="false" type="success" @click="submit()">确定</el-button>
          </span>
        </el-dialog>
        <el-button  class="el-upload" size="mini" :disabled="crud.selections.length==0" type="success" @click="toApprove(crud.selections)">提交审核</el-button>
        <el-table ref="toApproveData" :data="toApproveData.slice((cur_page-1)*pageSize,cur_page*pageSize)" size="small" style="width:100%"
                  @selection-change="crud.selectionChangeHandler"
                  :row-key="getRowKeys"
                  v-loading="showLoad"
                  stripe border :header-cell-style="{background:'rgb(232,237,229)'}"
        >
          <el-table-column type="selection" :reserve-selection="true" width="55"/>
          <el-table-column  prop="periodDate" label="数据日期" width="100px" />
          <el-table-column  prop="deptName" label="机构" width="100px"/>
          <el-table-column  prop="ieKindOneName" label="指标一级分类" width="100px"/>
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
          <el-table-column  prop="crtUserCode" label="补录人" width="100px"/>
          <el-table-column  prop="approveStatus" label="审批状态" width="100px">
            <template slot-scope="scope">
              {{ dict.label.IND_APPROVE_STATUS[scope.row.approveStatus] }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
                background
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :pages="count"
                :current-page="cur_page"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                :total="total"
                :pager-count="5"
                layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler"
                @row-dblclick="toEdit($event)"
                stripe border :header-cell-style="{background:'#5c8dbe45'}"
      >
        <el-table-column type="selection" width="55" fixed="left"/>
        <el-table-column v-if="columns.visible('periodDate')" prop="periodDate" label="数据日期" width="100px" />
        <el-table-column v-if="columns.visible('deptName')" prop="deptName" label="机构" width="100px"/>
        <el-table-column v-if="columns.visible('ieKindOneName')" prop="ieKindOneName" label="指标一级分类" width="100px"/>
        <el-table-column v-if="columns.visible('ieName')" prop="ieName" label="指标名称" width="200px" />
        <el-table-column v-if="columns.visible('currency')" prop="currency" label="币种" width="100px">
          <template slot-scope="scope">
            {{ dict.label.IND_CURRENCY[scope.row.currency] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('frequency')" prop="frequency" label="频率" width="100px">
        <template slot-scope="scope">
          {{ dict.label.IE_FREQUENCY[scope.row.frequency] }}
        </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('ieValue')" prop="ieValue" label="当期值" width="100px"/>
        <el-table-column v-if="columns.visible('supplementaryValue')" prop="supplementaryValue" label="补录值" width="100px"/>
<!--
        <el-table-column v-if="columns.visible('ieValue')" prop="ieValue" label="调整差额" width="100px"/>
-->
        <el-table-column v-if="columns.visible('supplementaryReason')" prop="supplementaryReason" label="补录原因" width="200px">
          <template slot-scope="scope">
            <el-popover
                placement="top-start"
                title=""
                width="200"
                trigger="hover"
                :content="scope.row.supplementaryReason">
              <span slot="reference" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.supplementaryReason }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="补录人" width="100px"/>
        <el-table-column v-if="columns.visible('approveStatus')" prop="approveStatus" label="审批状态" width="100px">
        <template slot-scope="scope">
          {{ dict.label.IND_APPROVE_STATUS[scope.row.approveStatus] }}
        </template>
        </el-table-column>
        <el-table-column label="同期" style="height: 20px" align="center " width="200px" >
          <el-table-column v-if="columns.visible('correspondValue')" prop="correspondValue" label="同期值"  align="center" width="100"/>
          <el-table-column v-if="columns.visible('correspondIncrement')" prop="correspondIncrement" label="同比增量"  align="center" />
          <el-table-column v-if="columns.visible('correspondRate')" prop="correspondRate" label="同比增幅" align="center">
            <template slot-scope="scope3">
              {{ scope3.row.correspondRate}} %
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="较上期" style="height: 20px" align="center" width="200px">
          <el-table-column v-if="columns.visible('stageValue')" prop="stageValue" label="上期值"  align="center" width="100"/>
          <el-table-column v-if="columns.visible('stageIncrement')" prop="correspondIncrement" label="环比增量"  align="center" />
          <el-table-column v-if="columns.visible('circalRate')" prop="circalRate" label="环比增幅" align="center">
            <template slot-scope="scope3">
              {{ scope3.row.circalRate}} %
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="较年初" style="height: 20px" align="center" width="200px">
          <el-table-column v-if="columns.visible('yearBeginValue')" prop="yearBeginValue" label="年初值" align="center" width="100"/>
          <el-table-column v-if="columns.visible('yearBeginIncrement')" prop="yearBeginIncrement" label="较年初增量"  align="center"  width="96"/>
          <el-table-column v-if="columns.visible('yearFloatRate')" prop="yearFloatRate" label="较年初增幅" align="center"  width="96">
            <template slot-scope="scope3">
              {{ scope3.row.yearFloatRate}} %
            </template>
          </el-table-column>
        </el-table-column>

<!--        <el-table-column v-permission="['admin','indIndicatorResult:edit']" label="操作" width="150px"  fixed="right" >
          <template slot-scope="scope">
            <udOperation
                    :data="scope.row"
                    :permission="permission"
            />
          </template>
        </el-table-column>-->
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import indIndicatorResult,{getData,getDept,importExcel,add,toApprove,updateApproveStatus,findToApproveInd} from '../../../api/indicators/indIndicatorManual'
  import { getResultDepts} from '@/api/indicators/indResultSubscribe'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import category from '../category/category'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  // crud交由presenter持有
  const defaultCrud = CRUD({ title: '指标补录', url: indIndicatorResult.url, sort: 'id,desc', crudMethod: { ...indIndicatorResult.method }})
  const defaultForm = {
    id: null,
    ieId: null,
    ieCode: null,
    ieName: null,
    ieValue: null,
    status: null,
    crtUserCode: null,
    crtOrgCode: null,
    crtDate: null,
    updUserCode: null,
    updOrgCode: null,
    updDate: null,
    frequency: null,
    supplementaryValue: null,
    supplementaryReason: null,
    ieKindOneCode:null,
    ieKindOneName:null,
    ieKindTwoName:null,
    approveStatus:null,
    submitDescribe:null
  }
/*  const requestXML="<?xml version=\"1.0\" encoding=\"UTF-8\" ?>" +
          "<service>" +
          "<LOCAL_HEAD>" +
          "</LOCAL_HEAD>"+
          "<SYS_HEAD>" +
          "<SERVICE_CODE attr=\"field\"></SERVICE_CODE>"+
          "<SERVICE_SCENE attr=\"field\"></SERVICE_SCENE>"+
          "<CONSUMER_ID attr=\"field\"></CONSUMER_ID>"+
          "<CONSUMER_SEQ_NO attr=\"field\"></CONSUMER_SEQ_NO>"+
          "<BUSS_SEQ_NO attr=\"field\"></BUSS_SEQ_NO>"+
          "<TRAN_DATE attr=\"field\"></TRAN_DATE>"+
          "<TRAN_TIMESTAMP attr=\"field\"></TRAN_TIMESTAMP>"+
          "<TRAN_FLAG attr=\"field\"></TRAN_FLAG>"+
          "</SYS_HEAD>"+
          "<BODY>" +
          "<INDEX_CODE attr=\"field\">A00001</INDEX_CODE>"+
          "<DATE_DATE attr=\"field\">2021-10-29</DATE_DATE>"+
          "</BODY>"+
          "</service>";*/
  const bizNames={}
  const deptList=[]
  const toApproveData=[]
  export default {
    name: 'IndIndicatorResult',
    components: {Treeselect,pagination, crudOperation, rrOperation, category, udOperation},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['RETENTION', 'IE_TYPE', 'IE_STATUS', 'IND_CURRENCY', 'IND_FIRST_TYPE','BUSSINESS_DEPT','IE_FREQUENCY','IND_APPROVE_STATUS'],
    data() {
      return {
        showDialog:false,
        toApproveDialog:false,
        innerVisible:false,
        showLoad:true,
        ids:null,
        infoIds:null,
        importDataText:'导入数据',
        importDisabled:false,
        permission: {
          add: ['admin', 'indIndicatorResult:add'],
          edit: ['admin', 'indIndicatorResult:edit'],
          del: ['admin', 'indIndicatorResult:del']
        },
        readOnly:false,
        bizNames,
        deptList,
        toApproveData,
        cur_page: 1,
        pageSize: 5,
         pageSizes:[5,10,20,30,40,50],
        total:0,
        count:0,
        rules: {
          ieName: [
            {required: true, message: '指标名称不能为空', trigger: 'change'}
          ],
          ieCode: [
            {required: true, message: '指标编号不能为空', trigger: 'change'}
          ],
          currency: [
            {required: true, message: '币种不能为空', trigger: 'change'}
          ],
          frequency: [
            {required: true, message: '频率不能为空', trigger: 'change'}
          ],
          supplementaryValue: [
            {required: true, message: '补录值不能为空', trigger: 'blur'}
          ],
          supplementaryReason: [
            {required: true, message: '补录原因不能为空', trigger: 'blur'},
            { max: 300, message: '补录原因不能超过300字', trigger: ['blur', 'change'] }
          ],
          deptNo: [
            {required: true, message: '业务属主机构不能为空', trigger: 'change'}
          ],
          periodDate: [
            {required: true, message: '数据日期不能为空', trigger: 'change'}
          ],
        },

      }

    },
    created() {
      this.resetQuery()
      this.getDepts()
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
      forceUpdate(e){
        this.$forceUpdate(); //
      },
      downloadTemplate(){
        //注意路径，前面不要加 ./ 会形成相对路径，点击下载不了。
        window.open('/指标数据补录模板.xlsx', '_blank')
      },
      handleSizeChange(val) {
        this.pageSize=val;
        this.cur_page=1;
      },
      // 分页导航
      handleCurrentChange(val) {
        this.cur_page = val;
/*
        this.tableData = this.allData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
*/

      },

      getRowKeys(row) {
        return row.id;
      },
        selectChange() {
        for (var i = 0; i < Object.keys(this.bizNames).length; i++) {
          if (this.form.ieName == this.bizNames[i].bizName) {
            this.form.ieCode = this.bizNames[i].bizCode
            this.form.ieId = this.bizNames[i].id
            this.form.ieKindOneCode = this.bizNames[i].indFirstType
            this.form.ieKindOneName = this.bizNames[i].indFirstTypeName
            this.form.ieKindTwoCode = this.bizNames[i].indSecondType
            this.form.ieKindTwoName = this.bizNames[i].indSecondTypeName
           // this.form.frequency = this.bizNames[i].indFrequency
          }
        }
      },

      addOrEdit(data){
        if(data.length>0){
          this.form.id = data[0].id
          this.form.ieName = data[0].ieName
          this.form.ieCode = data[0].ieCode
          this.form.frequency = data[0].frequency
          this.form.deptNo = data[0].deptNo == 'undefined'? null : data[0].deptNo
          this.form.deptName = data[0].deptName
          this.form.periodDate = data[0].periodDate
          this.form.currency = data[0].currency
          this.form.supplementaryValue = data[0].supplementaryValue
          this.form.supplementaryReason = data[0].supplementaryReason
          this.form.approveStatus = data[0].approveStatus
          this.form.ieKindOneCode = data[0].ieKindOneCode
          this.form.ieKindOneName = data[0].ieKindOneName
          this.form.ieKindTwoCode = data[0].ieKindTwoCode
          this.form.ieKindTwoName = data[0].ieKindTwoName
          this.readOnly = true
          if(this.form.approveStatus == "1"){
            this.$message({
              message: '审批中的指标信息不可更改',
              type: 'warning'
            });
          }else {
            this.showDialog = true;
          }
        }else {
          this.form.deptNo = null;

          this.showDialog = true;
        }

      },
      toEdit(cloumn){
        this.form.id = cloumn.id
        this.form.ieName = cloumn.ieName
        this.form.ieCode = cloumn.ieCode
        this.form.frequency = cloumn.frequency
        this.form.deptNo = cloumn.deptNo
        this.form.deptName = cloumn.deptName
        this.form.periodDate = cloumn.periodDate
        this.form.currency = cloumn.currency
        this.form.supplementaryValue = cloumn.supplementaryValue
        this.form.supplementaryReason = cloumn.supplementaryReason
        this.readOnly = true
        this.showDialog = true;
      },
      submitCU(){
        this.$refs['form'].validate(valid => {
          if (!valid) {
            return;
          }else{
            add(this.form).then(data=>{
              if (data.code === 0) {
                this.$message.success({
                  message: '操作成功!'
                })
                this.closeFlowDialog();
                this.crud.toQuery();
              } else {
                this.$message.error({
                  message: data.msg
                })
                this.closeFlowDialog();
                this.crud.toQuery();
              }
            })
          }

        })

      },

      closeFlowDialog(){
        debugger
        this.form.id="";
        this.form.ieName = "";
        this.form.ieCode ="";
        this.form.frequency = "";
        this.form.deptNo = null;
        this.form.deptName = null;
        this.form.periodDate = "";
        this.form.currency = "";
        this.form.supplementaryValue = "";
        this.form.supplementaryReason = "";
        //this.crud.selections = [];
        this.$nextTick(()=>{
          this.$refs.form.resetFields();
        })
        this.readOnly = false
        this.crud.toQuery();
        this.showDialog = false;

      },
      showApproveDialog(){
        this.toApproveDialog = true;
        this.$refs.table.clearSelection();
        findToApproveInd().then(data =>{
          this.toApproveData =data.data
          this.total = this.toApproveData.length
          this.count =parseInt(this.total)/parseInt(this.pageSize);
          this.count = Math.ceil(this.count);
          this.showLoad = false;
        })
      },
      closeToApproveDialog(){
        this.toApproveDialog = false;
        this.showLoad = true;
        this.cur_page=1;
        this.$refs.toApproveData.clearSelection()
        this.crud.toQuery();
      },
      toApprove(data){
        this.ids ="";
        this.infoIds="";
        for(var i = 0; i < Object.keys(data).length; i++){
          this.ids+=data[i].id+",";
        }
        for(var i = 0; i < Object.keys(data).length; i++){
          this.infoIds+=data[i].infoId+",";
        }
        this.ids = this.ids.substring(0,this.ids.lastIndexOf(","));
        this.infoIds = this.infoIds.substring(0,this.infoIds.lastIndexOf(","));
        this.innerVisible = true;

      },
      closeSubmitDialog(){
        this.innerVisible = false;
        this.form.submitDescribe="";
      },
      submit(){
        updateApproveStatus(this.ids,this.infoIds,this.form.submitDescribe).then(data =>{
          if(data.msg =="成功"||data.msg =="操作成功"){
            this.$message.success({
              message: '操作成功!'
            })
            this.closeSubmitDialog();
            this.closeToApproveDialog();
          }else{
            this.$message.error({
              message: data.msg
            })
          }
        })

      },
      valueChange(e){
          this.form.supplementaryValue = e.target.value
        },
      beforeUpload(file) {
        var FileExt = file.name.replace(/.+\./, "");
        if (["xls", "xlsx"].indexOf(FileExt.toLowerCase()) === -1) {
          this.$message({
            type: "warning",
            message: "请上传后缀名为xls、xlsx的附件！"
          });
          return false;
        }
        this.importDataText='正在导入';
        this.importDisabled = true;
      },
      handleSuccess(){
        this.importDataText='导入数据';
        this.importDisabled = false;
        this.$refs.upload.clearFiles();
        this.crud.toQuery();

      },
      // 自定义上传 导入数据
      uploadFile: function (item) {
        const $this = this
        let errorMsg = [];
        const h = this.$createElement;
        this.isImported = true;
        const formData = new FormData();
        formData.append("file", item.file);
        importExcel(formData).then(data => {

          if (data.msg == "成功" ||data.msg == "操作成功") {
            $this.$message({
              showClose: true,
              type: 'success',
              message: '导入成功 ',
            })
            this.handleSuccess();
          } else {
            for(let i in data.msg){
              errorMsg.push(h('p',null,data.msg[i]))
            }
            $this.$message({
              showClose: true,
              duration:0,
              type: 'error',
              message: h('div',null,errorMsg)
            })
            this.handleSuccess();
          }
        })
      },
      getDepts() {
        getResultDepts().then(res => {
          this.deptList = res.content
        })
      },
    },

      mounted() {
        getData().then(data => {
          this.bizNames = data.data;
        })
       // this.getDepts()

      }

  }
</script>

<style scoped>
  .upload-demo {
    margin: 0px 2px 10px 0px;
    display: inline;
    vertical-align: middle;
  }
  .el-upload{
    margin: 0px 2px 10px 0px;
    display: inline;
    vertical-align: middle;
  }
  .app-container .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
    padding-left: 20px;
  }
  .app-container .el-table th>.cell {
    padding-left: 20px;
  }

</style>
