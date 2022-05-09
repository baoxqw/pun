<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col>
        <div class="head-container">

          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <treeselect v-model="query.deptId" :options="depts"  style="width: 320px" size="small"  placeholder="选择机构" class="filter-item"/>
            <el-date-picker  v-model="query.periodDateInterval"  :default-time="['00:00:00','23:59:59']" type="daterange" range-separator=":" size="small"
                             class="date-item" value-format="yyyy-MM-dd hh:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions"/>
<!--            <el-input v-model="query.ieCode" clearable size="small" placeholder="指标编号" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery"/>-->
            <el-select class="filter-item" v-model="query.ieKindOneCode" filterable clearable placeholder="指标一级分类" style="width: 180px;"
                       @keyup.enter.native="crud.toQuery">
              <el-option
                  v-for="item in qryIndFirstType"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
            <el-input v-model="query.ieName" clearable size="small" placeholder="指标名称" style="width: 200px;" class="filter-item" @input="forceUpdate"/>
            <el-select  v-model="query.currency" clearable size="small"  placeholder="币种" class="filter-item" style="width: 150px">
              <el-option v-for="item in dict.IND_CURRENCY" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
            <rrOperation :crud="crud" :toQuery="false"/>
          </div>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <crudOperation :permission="permission">
          <el-button slot="right"
              :loading="crud.downloadLoading"
              :disabled="!crud.data.length"
              class="filter-item"
              type="success"
              icon="el-icon-download"
              @click="crud.doExport('download','实时指标结果数据')"
          >导出</el-button>
          </crudOperation>
          <!--表单组件-->
          <el-dialog close-on-press-escape :visible.sync="showDialog" :title="crud.status.title" width="80%" @close="refreshList">
            <el-form ref="form" :model="form" size="small" disabled label-width="150px">
              <el-row :gutter="5">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="数据时间">
                    <el-input v-model="form.periodDate" style="width: 300px;" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="机构">
                    <el-input v-model="form.deptName" style="width: 300px;" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="指标编号">
                    <el-input v-model="form.ieCode" style="width: 300px;" />
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="指标名称">
                    <el-input v-model="form.ieName" style="width: 300px;" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="指标一级分类">
                    <el-select  v-model="form.ieKindOneCode" clearable size="small"  placeholder="指标一级分类"  style="width: 300px">
                      <el-option v-for="item in dict['IND_FIRST_TYPE']" :key="item.key" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="币种">
                    <el-select  v-model="form.currency" clearable size="small"  placeholder="币种"  style="width: 300px">
                      <el-option v-for="item in dict['IND_CURRENCY']" :key="item.key" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="指标频率">
                    <el-select  v-model="form.frequency" clearable size="small"  placeholder="指标频率"  style="width: 300px">
                      <el-option v-for="item in dict['IE_FREQUENCY']" :key="item.key" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="当期值">
                    <el-input v-model="form.ieValue" style="width: 300px;" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="success" plain round @click="showDialog=false">取消</el-button>
            </div>
          </el-dialog>
          <!--表格渲染-->
          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            size="small"
            style="width: 100%;"
            @selection-change="crud.selectionChangeHandler"
          >
            <el-table-column type="selection" width="55" fixed="left"/>
            <el-table-column v-if="columns.visible('id')" prop="id" label="结果ID"  align="center"/>
            <el-table-column v-if="columns.visible('ieId')" prop="ieId" label="指标ID"  align="center"/>
            <el-table-column v-if="columns.visible('periodDate')" prop="periodDate" label="数据时间"  align="center"  width="140"/>
            <el-table-column v-if="columns.visible('deptName')" prop="deptName" label="机构"  align="center" width="180"/>
            <el-table-column v-if="columns.visible('ieKindOneName')" prop="ieKindOneName" label="指标一级分类"   align="center"  width="110"/>
            <el-table-column v-if="columns.visible('ieName')" prop="ieName" label="指标名称"  align="center"  />
            <el-table-column v-if="columns.visible('currency')" prop="currency" label="币种"   align="center" width="120">
              <template slot-scope="scope">
                {{ dict.label.IND_CURRENCY[scope.row.currency] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('ieValue')" prop="ieValue" label="当期值"  align="center" width="100"/>
            <el-table-column  v-permission="['indicatorRealTimeResult:view']" label="操作" width="100px" fixed="right"  align="center" >
              <template slot-scope="scope6">
                <el-button type="primary" icon="iconfont icon-icon-test" @click="viewHandle(scope6.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudIndicatorResult from '../../../api/indicators/indicatorRealTimeResult'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  // import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import crudIndCategory from '@/api/indicators/indCategory'
  import category from '../category/category'
  //import { getDepts } from '@/utils/system'
  import { getResultDepts} from '@/api/indicators/indResultSubscribe'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  //import moment from "moment";
  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '指标计算结果表',
    url: crudIndicatorResult.url,
    sort: 'id,desc',
    initQry: false,
    crudMethod: { ...crudIndicatorResult.crud }
  })
  const defaultForm = {
    id: null,
    orgId: null,
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
    periodDateInterval:null,
    ieKindOneName:null
  }
  export default {
    name: 'IndicatorRealTimeResult',
    components: { Treeselect,pagination, crudOperation, rrOperation, category },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['IND_FIRST_TYPE','RETENTION', 'IE_TYPE', 'IE_STATUS','IND_CURRENCY','YN','IE_FREQUENCY'],
    data() {
      return {
        depts: [],
        qryIndFirstType: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        table: {
          columns: {
            id: 'hidden',
            ieId: 'hidden',
            updUserCode: 'hidden',
            updDate: 'hidden'
          }
        },
        permission: {
          add: [''],
          edit: [''],
          del: ['']
        },
        showDialog: false,
        pickerMinDate: "",//第一次选中的时间
        pickerOptions: {
          onPick: obj => {

            this.pickerMinDate = new Date(obj.minDate).getTime();
            console.log("times===>," + this.pickerTimes + ", pickerMinDate==>" + this.pickerMinDate)
            this.pickerMaxDate = new Date(obj.maxDate).getTime();
          },
          disabledDate: time => {
            if (this.pickerMinDate) {
              const day1 = 366 * 24 * 3600 * 1000;
              let maxTime = this.pickerMinDate + day1;
              let minTime = this.pickerMinDate - day1;
              return time.getTime() > maxTime || time.getTime() < minTime;
            }
          }
        },
        form:{},
      }
    },
    created() {
      //defaultCrud.query.periodDateInterval = this.timeDefault
      this.crud.optShow.del=false
      this.crud.optShow.edit=false
      this.crud.optShow.add=false
      this.resetQuery()
    },
    mounted() {
      this.query.ieName = this.$route.query.ieName
      if(this.query.ieName == null || this.query.ieName == 'undefined'){
        defaultCrud.initQry = false
      }else{
        //CRUD.toQuery
      }
      defaultCrud.refresh()
      this.getDepts();
      this.initIndFirstType();
    },
    computed: {
      // 默认时间
      /*timeDefault () {
        /!*console.log("times===>," + this.pickerTimes)*!/
        var defalutStartTime = moment().subtract(1,"year").format('YYYY-MM-DD')
        var defalutEndTime = moment().format('YYYY-MM-DD')
        return [defalutStartTime, defalutEndTime]
      }*/
    },
    methods: {
      resetQuery(){
        this.crud.resetQuery(false);
        this.crud.refresh()
      },
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        if(defaultCrud.initQry){
          defaultCrud.loading = true
          return true
        }else{
          defaultCrud.initQry = true
          defaultCrud.loading = false
          return false
        }
      },
      viewHandle(row) {
        this.form = row
        this.showDialog = true
      },
      getDepts() {
        /*getDepts({ enabled: true }).then(res => {
          this.depts = res.content
        })*/
        getResultDepts().then(res => {
          this.depts = res.content
        })
      },
      refreshList() {
        this.crud.refresh()
      },
      forceUpdate() {
        this.$forceUpdate()
      },
      initIndFirstType() {
        crudIndCategory.getCategoryList(0).then(res => {
          this.qryIndFirstType = [];
          this.formIndFirstType = [];
          const data = res.data;
          if(res.code == 0) {
            for(let i=0; i<data.length; i++) {
              this.qryIndFirstType.push({id: data[i].id, label: data[i].categoryName, value: data[i].id})
              this.formIndFirstType.push({id: data[i].id, label: data[i].categoryName, value: data[i].id})
            }
          }
        })
      },
    }
  }
</script>

<style>
  .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*font-family: 微软雅黑;*/
    font-size: 12px;
    padding-right: 8px;
  }
  .app-container .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
    padding-left: 20px;
  }
  .app-container .el-table th>.cell {
    padding-left: 20px;
  }
  .app-container .el-table thead.is-group th
  {
    background: rgb(232,237,229);
    height: 25px;
  }
  .app-container .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
    padding-left: 20px;
  }
  .app-container .el-table th>.cell {
    padding-left: 20px;
  }

</style>
