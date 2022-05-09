<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col>
        <div class="head-container">

          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-date-picker  v-model="query.periodDateInterval"  :default-time="['00:00:00','23:59:59']" type="daterange" range-separator=":" size="small"
                             class="date-item" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"/>
            <el-input v-model="query.ieName" clearable size="small" placeholder="指标名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery"/>
            <el-select  v-model="query.frequency" clearable size="small"  placeholder="指标频率" class="filter-item" style="width: 150px">
              <el-option v-for="item in dict.IE_FREQUENCY" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
            <rrOperation :crud="crud"/>
          </div>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <crudOperation :permission="permission" v-show="false"/>
          <!--表单组件-->
          <el-dialog close-on-press-escape :visible.sync="showDialog" :title="crud.status.title" width="80%" @close="refreshList">
            <el-form ref="form" :model="form" size="small" disabled label-width="150px">
              <el-row :gutter="5">
                <fieldset style="padding: 10px;border: none">
                  <legend style="font-size: 20px;font-weight: bold;color: dodgerblue">基本信息</legend>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="数据日期">
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
                    <el-form-item label="是否已收藏">
                      <el-select  v-model="form.isFavorites" clearable size="small"  placeholder="是否已收藏"  style="width: 300px">
                        <el-option v-for="item in dict['YN']" :key="item.key" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="当期值">
                      <el-input v-model="form.ieValue" style="width: 300px;" />
                    </el-form-item>
                  </el-col>
                </fieldset>
                <fieldset style="padding: 10px;border: none">
                  <legend style="font-size: 20px;font-weight: bold;color: dodgerblue">统计信息</legend>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="同期值">
                      <el-input v-model="form.correspondValue" style="width: 300px;" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="同比增量">
                      <el-input v-model="form.correspondIncrement" style="width: 300px;" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="同比增幅">
                      <el-input v-model="form.correspondRate + '%'" style="width: 300px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="上期值">
                      <el-input v-model="form.stageValue" style="width: 300px;" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="环比增量">
                      <el-input v-model="form.stageIncrement" style="width: 300px;" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="环比增幅">
                      <el-input v-model="form.circalRate + '%'" style="width: 300px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="年初值">
                      <el-input v-model="form.yearBeginValue" style="width: 300px;" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="较年初增量">
                      <el-input v-model="form.yearBeginIncrement" style="width: 300px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="较年初增幅">
                      <el-input v-model="form.yearFloatRate + '%'" style="width: 300px;"></el-input>
                    </el-form-item>
                  </el-col>
                </fieldset>
                <fieldset style="padding: 10px;border: none">
                  <legend style="font-size: 20px;font-weight: bold;color: dodgerblue">扩展信息</legend>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="是否超过内部警戒值">
                      <el-select  v-model="form.exceedInnerWarning" clearable size="small"  placeholder="是否超过内部警戒值"  style="width: 300px">
                        <el-option v-for="item in dict['YN']" :key="item.key" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="是否超过监管警戒值">
                      <el-select  v-model="form.exceedMntWarning" clearable size="small"  placeholder="是否超过监管警戒值"  style="width: 300px">
                        <el-option v-for="item in dict['YN']" :key="item.key" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="结果是否补录">
                      <el-select  v-model="form.isSupplement" clearable size="small"  placeholder="结果是否补录"  style="width: 300px">
                        <el-option v-for="item in dict['YN']" :key="item.key" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-form-item label="补录原因">
                      <el-input v-model="form.supplementaryReason" style="width: 300px;"></el-input>
                    </el-form-item>
                  </el-col>
                </fieldset>
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
              :cell-style="cellStyle"
          >
            <el-table-column v-if="columns.visible('periodDate')" prop="periodDate" label="数据日期"  align="center" width="104" v-show="false"/>
            <el-table-column v-if="columns.visible('frequency')" prop="ieName" label="指标频率"  align="center">
              <template slot-scope="scope">
                {{ dict.label.IE_FREQUENCY[scope.row.frequency] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('deptName')" prop="deptName" label="机构"  align="center"  width="100"/>
            <el-table-column v-if="columns.visible('ieKindOneName')" prop="ieKindOneName" label="指标一级分类"   align="center" width="110"/>

            <el-table-column v-if="columns.visible('ieName')" prop="ieName" label="指标名称"  align="center">
              <template slot-scope="scope">
                {{ scope.row.ieName}}
                <div v-if="scope.row.isFavorites===1" style="font-size: 20px;color: coral;display: inline-flex">
                  <i class="el-icon-star-on"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('currency')" prop="currency" label="币种"   align="center">
              <template slot-scope="scope">
                {{ dict.label.IND_CURRENCY[scope.row.currency] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('ieValue')" prop="ieValue" label="当期值"  align="center"/>
            <el-table-column label="同期" width="100px" style="height: 20px"  align="center" >
              <el-table-column v-if="columns.visible('correspondValue')" prop="correspondValue" label="同期值"  align="center" />
              <el-table-column v-if="columns.visible('correspondIncrement')" prop="correspondIncrement" label="同比增量"  align="center" />
              <el-table-column v-if="columns.visible('correspondRate')" prop="correspondRate" label="同比增幅" align="center">
                <template slot-scope="scope3">
                  {{ scope3.row.correspondRate}} %
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="较上期" width="100px" style="height: 20px"  align="center" >
              <el-table-column v-if="columns.visible('stageValue')" prop="stageValue" label="上期值"  align="center" />
              <el-table-column v-if="columns.visible('stageIncrement')" prop="correspondIncrement" label="环比增量"  align="center" />
              <el-table-column v-if="columns.visible('circalRate')" prop="circalRate" label="环比增幅" align="center">
                <template slot-scope="scope3">
                  {{ scope3.row.circalRate}} %
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="较年初" width="100px" style="height: 20px"  align="center" >
              <el-table-column v-if="columns.visible('yearBeginValue')" prop="yearBeginValue" label="年初值" align="center"/>
              <el-table-column v-if="columns.visible('yearBeginIncrement')" prop="yearBeginIncrement" label="较年初增量"  align="center"  width="96"/>
              <el-table-column v-if="columns.visible('yearFloatRate')" prop="yearFloatRate" label="较年初增幅" align="center"  width="96">
                <template slot-scope="scope3">
                  {{ scope3.row.yearFloatRate}} %
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column v-if="columns.visible('exceedInnerWarning')" prop="exceedInnerWarning" label="是否超过内部警戒值"   align="center"  width="100">
              <template slot-scope="scope">
                <!--                {{ dict.label.YN[scope.row.exceedInnerWarning] }}-->
                <div v-if="scope.row.exceedInnerWarning==1" style="font-size: 20px;color: coral">
                  <i class="el-icon-warning"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('exceedMntWarning')" prop="exceedMntWarning" label="是否超过监管警戒值"   align="center"  width="100">
              <template slot-scope="scope">
                <!--                {{ dict.label.YN[scope.row.exceedMntWarning] }}-->
                <div v-if="scope.row.exceedMntWarning==1" style="font-size: 20px;color: coral">
                  <i class="el-icon-warning"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('isSupplement')" prop="isSupplement" label="指标结果可能存在补录"   align="center"  width="100">
              <template slot-scope="scope">
                <el-popover
                    placement="top-start"
                    title="补录原因"
                    width="200"
                    trigger="hover"
                    :content="scope.row.supplementaryReason">
                  <span slot="reference">{{ dict.label.YN[scope.row.isSupplement] }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column  v-permission="['indIndicatorResult:view']" label="操作" width="100px" fixed="right"  align="center" >
              <template slot-scope="scope6">
                <el-button type="primary"  @click="viewHandle(scope6.row)">查看</el-button>
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

import crudIndResultSubscribe from '@/api/indicators/subscribeAndTopTen'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
// import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import category from '../category/category'
import { getDepts } from '@/utils/system'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
//import moment from "moment";
import {saveReadRec} from "@/api/indicators/indIndicatorResult";
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
  periodDateInterval:null
}
export default {
  name: 'SubscribeList',
  components: { Treeselect,pagination, crudOperation, rrOperation, category },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['IND_FIRST_TYPE','RETENTION', 'IE_TYPE', 'IE_STATUS','IND_CURRENCY','YN','IE_FREQUENCY'],
  data() {
    return {
      depts: [],
      form: {},
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
    this.resetQuery()
  },
  mounted() {
    defaultCrud.initQry = true
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
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    handleCategoryClick(data) {
      this.crud.form.categoryId = data.id
      this.crud.query.categoryIds = data.childrenIds
      this.form.categoryId = data.id
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

