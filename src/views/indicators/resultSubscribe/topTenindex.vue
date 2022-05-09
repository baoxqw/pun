<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col>
        <div class="head-container">

          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <treeselect v-model="query.deptId" :options="depts"  style="width: 320px" size="small"  placeholder="选择机构" class="filter-item"/>
            <el-input v-model="query.ieName" clearable size="small" placeholder="指标名称" style="width: 200px;" class="filter-item"/>
            <el-select  v-model="query.currency" clearable size="small"  placeholder="币种" class="filter-item" style="width: 150px">
              <el-option v-for="item in dict.IND_CURRENCY" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
            <el-select  v-model="query.frequency" clearable size="small"  placeholder="指标频率" class="filter-item" style="width: 150px">
              <el-option v-for="item in dict['IE_FREQUENCY']" :key="item.key" :label="item.label" :value="item.value" />
            </el-select>
            <rrOperation :crud="crud" :toQuery="false"/>
          </div>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <crudOperation :permission="permission" v-show="false"/>

          <el-button
              :loading="crud.downloadLoading"
              :disabled="!crud.data.length"
              class="filter-item"
              type="success"
              icon="el-icon-download"
              @click="crud.doExport('download','收藏夹数据')"
          >导出</el-button>

          <!--表格渲染-->
          <el-table
              ref="table"
              v-loading="crud.loading"
              :data="crud.data"
              size="small"
              style="width: 100%;"
              @selection-change="crud.selectionChangeHandler"
              :cell-style="cellStyle"
          >
<!--            <el-table-column type="selection" width="55"/>-->
            <el-table-column v-if="columns.visible('ieId')" prop="ieId" label="指标ID"  align="center"/>
            <el-table-column v-if="columns.visible('ieCode')" prop="ieCode" label="指标编号"  />
            <el-table-column v-if="columns.visible('ieName')" prop="ieName" label="指标名称"  align="center">
              <template slot-scope="scope">
                {{ scope.row.ieName}}
                <div v-if="scope.row.isFavorites===1" style="font-size: 20px;color: coral;display: inline-flex">
                  <i class="el-icon-star-on"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('deptName')" prop="deptName" label="机构"  align="center"/>
            <el-table-column v-if="columns.visible('ieKindOneName')" prop="ieKindOneName" label="指标一级分类"   align="center"/>
            <el-table-column v-if="columns.visible('currency')" prop="currency" label="币种"   align="center"  >
              <template slot-scope="scope">
                {{ dict.label.IND_CURRENCY[scope.row.currency] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('frequency')" prop="frequency" label="指标频率"   align="center" >
              <template slot-scope="scope">
                {{ dict.label.IE_FREQUENCY[scope.row.frequency] }}
              </template>
            </el-table-column>
            <el-table-column  v-permission="['indIndicatorResult:view']" label="操作" width="120px" fixed="right"  >
              <template slot-scope="scope6">
                <el-button type="primary"  @click="toResultList(scope6.row)">查看结果</el-button>
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

import crudIndResultSubscribe,{getResultDepts} from '@/api/indicators/indResultSubscribe'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
// import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import category from '../category/category'
import { getDepts } from '@/utils/system'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import moment from "moment";
import {saveReadRec} from "@/api/indicators/indIndicatorResult";
import crudIndCategory from "@/api/indicators/indCategory";
// crud交由presenter持有
const defaultCrud = CRUD({
  title: '指标计算结果表',
  url: crudIndResultSubscribe.url,
  sort: 'id,desc',
  initQry: false,
  crudMethod: { ...crudIndResultSubscribe.crud }
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
  categoryType: '0'
}
export default {
  name: 'SubscribeIndex',
  components: { Treeselect,pagination, crudOperation, rrOperation, category },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['IND_FIRST_TYPE','RETENTION', 'IE_TYPE', 'IE_STATUS','IND_CURRENCY','YN','IE_FREQUENCY'],
  data() {
    return {
      depts: [],
      form: {},
      qryIndFirstType: [],
      qryIndSecondType: [],
      formIndFirstType: [],
      formIndSecondType: [],
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
        },
        disabledDate: time => {
          if (this.pickerMinDate) {
            const day1 = 366 * 24 * 3600 * 1000;
            let maxTime = this.pickerMinDate + day1;
            let minTime = this.pickerMinDate - day1;
            return time.getTime() > maxTime || time.getTime() < minTime;
          }
        }
      }
    }
  },
  created() {
    //defaultCrud.query.periodDateInterval = this.timeDefault
    this.initIndFirstType();
    this.resetQuery()
  },
  mounted() {
    defaultCrud.initQry = false
    this.getDepts();
    defaultCrud.refresh()
  },
  computed: {
    // 默认时间
    /*timeDefault () {
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
      this.crud.query.flag = 'topten'
      if(defaultCrud.initQry){
        return true
      }else{
        defaultCrud.loading = false
        defaultCrud.initQry = true
        return false
      }
    },
    viewHandle(row) {
      this.form = row
      this.showDialog = true
      this.saveReadRec(row.id)
    },
    getDepts() {
      /*getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })*/
      getResultDepts().then(res => {
        this.depts = res.content
      })
    },
    handleCategoryClick(data) {
      this.crud.form.categoryId = data.id
      this.crud.query.categoryIds = data.childrenIds
      this.crud.query.categoryType = data.categoryType
      this.form.categoryType = data.categoryType
      this.form.categoryId = data.id
      this.crud.form.indFirstType = data.id;
      this.crud.refresh()
    },
    saveReadRec(id) {
      console.log("hhhhhhhhhhhhhhhh: " + id)
      saveReadRec(id).then(res => {
        console.log("saveReadRec res===>," + res)
      })
    },
    cellStyle(data) {
      if(data.row.readed === 0) {
        return 'font-weight: 1000;color:#1742a5;'
      } else {
        return ''
      }
    },
    refreshList() {
      this.crud.refresh()
    },
    initIndFirstType() {
      crudIndCategory.getCategoryList(0).then(res => {
        const data = res.data;
        if(res.code == 0) {
          for(let i=0; i<data.length; i++) {
            this.qryIndFirstType.push({id: data[i].id, label: data[i].categoryName, value: data[i].id})
            this.formIndFirstType.push({id: data[i].id, label: data[i].categoryName, value: data[i].id})
          }
        }
      })
    },
    initIndSecondType(indFirstType,type) {
      if(type == "query") {
        this.qryIndSecondType = [];
      }else {
        this.formIndSecondType = [];
      }
      //let indFirstType = this.query.indFirstType;
      if(indFirstType == null) {
        return;
      }
      crudIndCategory.getCategoryList(indFirstType).then(res => {
        const data = res.data;
        if(res.code == 0) {
          for(let i=0; i<data.length; i++) {
            if(type == "query"){
              this.qryIndSecondType.push({id: data[i].id, label: data[i].categoryName, value: data[i].id})
            } else {
              this.formIndSecondType.push({id: data[i].id, label: data[i].categoryName, value: data[i].id})
            }

          }
        }
      })
    },
    toResultList(row) {
      this.$router.push({path: '/indicator/result/index',
        query: {deptId: row.deptId,ieName: row.ieName,currency: row.currency,frequency: row.frequency}})
    }
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

