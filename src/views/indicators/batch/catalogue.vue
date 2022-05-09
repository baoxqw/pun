<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <div>
        <el-input v-model="query.tabName" clearable size="small" placeholder="表名称123" style="width: 200px;"
          class="filter-item" />
        <el-input v-model="query.tabNameCn" clearable size="small" placeholder="表中文名" style="width: 200px;"
          class="filter-item" />
        <!-- <el-select clearable size="small" class="filter-item" clearable v-model="query.createBy" placeholder="创建人">
          <el-option v-for="peo in peopleOptions" :key="peo.userId" :label="peo.nickName" :value="peo.userId" />
        </el-select> -->
        <el-button class="filter-item" type="success" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button class="filter-item" type="success" icon="el-icon-refresh-left" @click="resetQuery(getList)">重置
        </el-button>
      </div>
      <!-- 新增工具栏 -->
      <span class="crud-opts-left">
        <slot name="left" />
        <el-button class="filter-item" type="primary" @click="handleAdd">
          创建数据模型
        </el-button>
        <el-upload slot="right" ref="upload" class="upload-demo inline-block " :show-file-list="false"
          action="importData" accept=".xlsx,.xls" :before-upload="beforeUpload" :on-success="handleSuccess"
          :http-request="uploadFile" multiple :limit="1">
          <el-button class="el-upload" size="mini" type="primary" slot="trigger">导入</el-button>

          <!-- <el-button class="el-upload" size="mini" type="primary" @click="doExport('download','补录数据')">导出</el-button> -->
          <el-button class="el-upload" size="mini" type="primary" @click="downloadTemplate">下载Excel模板</el-button>
        </el-upload>
      </span>
    </div>

    <!--表格渲染-->
    <el-table ref="table" v-loading="loading" :data="componentList" size="small">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="数据表名" align="center" prop="tabName" />
      <!-- <el-table-column label="表名称" align="center" prop="tabName" /> -->
      <el-table-column label="数据模型名称" align="center" prop="tabNameCn" />
      <el-table-column label="模型目录" align="center" prop="modelLvl" />
      <!-- <el-table-column label="数据表用途" align="center" prop="tabTodo" />
      <el-table-column label="更新频率" align="center" prop="dataUpdFrequency" />
      <el-table-column label="更新时间" align="center" prop="dataUpdTime" /> -->
      <!-- <el-table-column label="数据库类型" align="center" prop="tableType" /> -->
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" width="300px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="SQLPreview(scope.row)">
            SQL预览
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleExport(scope.row)">导出</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页组件-->
    <el-pagination :background="background" :current-page="pageNum" :page-size="pageSize" :layout="layout"
      :page-sizes="[10, 20, 30, 50]" :total="total" v-bind="$attrs" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 创建模型对话框 -->
    <el-dialog :close-on-click-modal="false" @close="cancel" :title="title" width="80%" :visible="open" class="dialog
    ">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="数据模型基本信息" name="first">
          <el-form label-suffix=":" class="pane" ref="form" :model="form" :rules="rules" label-width="128px">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="数据源" prop="tableRegionalBut">
                  <el-radio-group v-model="form.tableRegionalBut" size="small">
                    <el-radio v-for="dict in dbTypeOptions" :key="dict.dictLabel" :label="dict.dictLabel">
                      {{ dict.dictLabel }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row v-if="form.dbType === 'HIVE'" :gutter="20">
              <el-col :span="12">
                <el-form-item label="表分区键" prop="tableRegionalBut">
                  <el-input clearable size="small" v-model="form.tableRegionalBut" placeholder="请输入表分区键" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分区键类型" prop="regionalType">
                  <el-input clearable size="small" v-model="form.regionalType" placeholder="请输入分区键类型" />
                </el-form-item>
              </el-col>
            </el-row> -->
            <!-- <el-row v-if="form.dbType === 'HIVE'" :gutter="20">
              <el-col :span="24">
                <el-form-item label="location" prop="location">
                  <el-input clearable size="small" v-model="form.location" placeholder="请输入location" />
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row style="padding-top: 20px" :gutter="20">
              <el-col :span="12">
                <el-form-item label="SCHEMA" prop="regionalType">
                  <el-select class="block" v-model="form.regionalType" filterable clearable size="small"
                    @change="changeDatabases" placeholder="SCHEMA">
                    <el-option v-for="item in regionalType" :key="item.label" :label="item.label" :value="item.label">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据表名" prop="tabName">
                  <el-select class="block" v-model="form.tabName" filterable clearable size="small"
                    @change="changeTableNames" placeholder="数据表名">
                    <el-option v-for="item in tabName" :key="item.label" :label="item.label" :value="item.label">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="padding-top: 20px" :gutter="20">
              <el-col :span="12">
                <el-form-item label="数据模型名称" prop="tabNameCn">
                  <el-input clearable size="small" v-model="form.tabNameCn" placeholder="数据模型名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="模型目录" prop="modelLvl">
                  <el-select class="block" v-model="form.modelLvl" filterable clearable size="small" placeholder="模型目录">
                    <el-option v-for="dict in modelLvlOptions" :key="dict.dictValue" :label="dict.dictLabel"
                      :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="表名称" prop="tabName">
                  <el-input clearable size="small" v-model="form.tabName" placeholder="表名称" />
                </el-form-item>
              </el-col> -->
            </el-row>
            <!-- <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="模型目录" prop="modelLvl">
                  <el-select class="block" v-model="form.modelLvl" filterable clearable size="small"
                    placeholder="模型目录">
                    <el-option v-for="dict in modelLvlOptions" :key="dict.dictValue" :label="dict.dictLabel"
                      :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表用途" prop="tabTodo">
                  <el-input clearable size="small" v-model="form.tabTodo" placeholder="请输入表用途" />
                </el-form-item>
              </el-col>
            </el-row> -->
            <!-- <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="关联需求" prop="demandId">
                  <el-select class="width100" size="small" clearable filterable remote v-model="form.demandId"
                    placeholder="请搜索或选择" :loading="doLoading" :remote-method="demandRelaQuery" @change="demandOnChange">
                    <el-option v-for="dema in demandOptions" :key="dema.demandId" :label="dema.demandName"
                      :value="dema.demandId" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据更新频率" prop="dataUpdFrequency">
                  <el-select class="block" v-model="form.dataUpdFrequency" filterable clearable size="small"
                    placeholder="选择数据更新频率">
                    <el-option v-for="dict in demandReqFrequencyList" :key="dict.dictValue" :label="dict.dictLabel"
                      :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="数据更新时间" prop="dataUpdTime">
                  <el-input clearable size="small" v-model="form.dataUpdTime" placeholder="请输入数据更新时间" />
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="表描述" prop="tabDesc">
                  <el-input clearable :rows="4" type="textarea" v-model="form.tabDesc" placeholder="请输入表描述"
                    size="small" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="配置数据模型" name="second" :disabled="secondDisabled" class="pane">

          <el-row :gutter="20">
            <el-button v-if='openTypes==false' class="filter-item" style="float:left; margin:0 0 5px 10px;" type="success"
              icon="el-icon-refresh" @click="syncGetColumns">同步</el-button>
              <el-button class="filter-item" style="float:left; margin:0 0 5px 10px;" type="success" v-if='openTypes==true'
              icon="el-icon-refresh" @click="resertGetColumns">重置</el-button><br>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="openTypes==false?12:24">
              <el-table ref="table" v-loading="loading" :data="fieldsData" size="small" :cell-style="cellStyle">
                <el-table-column type="index" label=" 序号" width="60px" />
                <el-table-column prop="colNameCn" label=" 字段中文名" width="200px">
                  <template slot-scope="scope">
                    <el-input clearable size="small" v-model="scope.row.colNameCn" placeholder="字段中文名" />
                  </template>
                </el-table-column>
                <el-table-column prop="colName" label="字段列名" width="200px" />
                <el-table-column prop="colType" label="物理类型" width="100px" >
                <template slot-scope="scope">
                    <el-input clearable size="small" v-model="scope.row.colType" placeholder="物理类型" />
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="colDesc" label="注释" width="200px" /> -->
                <el-table-column label="操作" fixed="right">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status == '1'" size="mini" type="text" icon="el-icon-edit"
                      @click="innerUpdate(scope.$index, fieldsData)">停用</el-button>
                    <el-button v-if="scope.row.status == '2'" size="mini" type="text" icon="el-icon-edit"
                      @click="innerUpdate(scope.$index, fieldsData)">启用</el-button>
                    <!-- <el-button v-if="scope.row.status == '2'" size="mini" type="text" icon="el-icon-delete"
                      @click="innerDelete(scope.$index, fieldsData)">删除
                    </el-button> -->
                  </template>
                </el-table-column>
              </el-table>

            </el-col>
            <el-col :span="12" v-if='openTypes==false'>
              <el-table ref="table" v-loading="loading" class="tableStyle" :data="syncFieldsData" size="small"   :cell-style="cellStyle">
                <el-table-column type="index" label=" 序号" width="60px" />
                <el-table-column prop="colNameCn" label=" 字段中文名" width="200px"/>

                <el-table-column prop="colName" label="字段列名" width="200px"/>
                <el-table-column prop="colType" label="物理类型" width="100px"/>
                <!-- <el-table-column prop="colDesc" label="注释" width="200px" /> -->

                 <el-table-column label="操作" fixed="right">
                  <template slot-scope="scope">
                   
                  </template>
                </el-table-column>

              </el-table>

            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" plain round @click="cancel">取消</el-button>
        <el-button type="success" round @click="submitForm()">提交</el-button>
      </div>
    </el-dialog>

    <!-- SQL预览 -->
    <el-dialog title="SQL预览" width="90%" :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body>
      <SqlEditor v-loading="creTabsqlLoading" class="sqleditor bordered mb20" height="600px" ref="sqleditor">
      </SqlEditor>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getDatabases,
    getTableNames,
    getTableColumns,
    syncColumns,
    dataModelTable,
    dataModelRemove,
    dataModelQuery,
    addDataModelColumn,
    addBatchModelColumn,
    updateDataModelTable,
    dataModelColumnRemove,
    sqlText,
    checkWord,
    queryTableColumn,
    dataDemandList,
    listUser,
    getDicts,
    importExcel,
    importTemp,
    download,
    getDataSourceNames
  } from '@/api/indicators/metaModel'
  import qs from 'qs'
  import {
    downloadFile
  } from '@eladmin/utils/index'
  import SqlEditor from "./SqlEditor";
  import sqlFormatter from "sql-formatter";

  export default {
    name: "metaModel",
    components: {
      SqlEditor,
    },
    data() {
      return {
        activeName: "first",
        // 保存时加载
        subLoading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 数据表表格数据
        componentList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //关联需求码表
        demandOptions: [],
        doLoading: false,
        //创建人码表
        peopleOptions: [],
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          tableRegionalBut: [{
            required: true,
            message: "请选择数据源",
            trigger: "blur"
          }],
          tabNameCn: [{
            required: true,
            message: "表中文名称不能为空",
            trigger: "blur"
          }],
          regionalType: [{
            required: true,
            message: "请选择SCHEMA",
            trigger: "blur"
          }],
          tabName: [{
            required: true,
            message: "数据表名",
            trigger: "blur"
          }],
          tabNameCn: [{
            required: true,
            message: "请选择数据模型名称",
            trigger: "blur"
          }],
          modelLvl: [{
            required: true,
            message: "请选择模型目录",
            trigger: "blur"
          }]
        },
        secondDisabled: false,
        //表格字段
        fieldsData: [],
        syncFieldsData: [],

        openTypes: null,

        dialogVisible: false,
        creTabsqlLoading: false,
        fieldsLoading: false,

        resertId:'',
        //需求更新频率码表
        demandReqFrequencyList: [],
        dbTypeOptions: [],
        modelLvlOptions: [],

        regionalType: [],
        tabName: [],
        TableColumns: [],
        synccolumns: [],


        query: {
          tabName: '',
          tabNameCn: '',
          createBy: '',
        },
        pageNum: 1,
        pageSize: 10,
        layout: 'total, prev, pager, next, sizes',
        loading: "",
        background: true,

      }
    },
    created() {
      //列表
      this.getList();
      this.getDatabases();
      //需求更新频率码表
      getDicts("demand_req_frequency").then((res) => {
        this.demandReqFrequencyList = res.data || [];
      });
      // getDicts("data_db_type").then((response) => {
      //   this.dbTypeOptions = response.data;
      // });
      this.getDataSourceNames();
      getDicts("model_lvl").then((response) => {
        this.modelLvlOptions = response.data;
      })

      //关联需求码表
      // this.dataDemandList();

      //创建人码表
      // listUser({
      //     pageNum: 1,
      //     pageSize: 1000,
      //     status: 0
      //   })
      //   .then((res) => {
      //     console.log(res);
      //     if (res.code === 200) {
      //       this.peopleOptions = res.rows.map((item) => ({
      //         nickName: item.nickName,
      //         userId: item.userId,
      //       }));
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },

    methods: {

      getDataSourceNames() {
        getDataSourceNames().then((res) => {
          if (res.code === 200) {
            let Num = [];
            for (let i in res.data) {
              var j = {};
              j.dictLabel = res.data[i];
              Num.push(j);
            }
            console.log(666)
            console.log(Num)
            this.dbTypeOptions = Num;
          }
        }).catch((err) => {});
      },


      //搜索
      handleQuery() {
        this.pageNum = 1;
        this.getList();
      },

      //搜索框重置
      resetQuery() {
        this.pageNum = 1;
        this.pageSize = 10;
        this.query.tabName = '';
        this.query.tabNameCn = '';
        this.query.createBy = '';
        this.handleQuery();
      },

      //页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getList();
      },

      //页码
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getList();
      },

      //列表
      getList() {
        this.loading = true;
        let params = {};
        params = {
          ...this.query,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        dataModelQuery(params).then(res => {
          this.componentList = res.rows;
          this.total = res.total;
          this.loading = false;
        })
      },


      //新增
      handleAdd() {
        this.openTypes = true
        this.reset();
        this.open = true;
        this.activeName = "first";
        this.fieldsData = [];
        this.syncFieldsData = [];
        this.title = "创建数据模型";
        this.form.tableRegionalBut ='pg'
      },

      //导入成功调用
      handleSuccess() {
        this.importDataText = '导入数据';
        this.importDisabled = false;
        this.$refs.upload.clearFiles();
        this.getList();

      },

      //导入
      uploadFile: function (item) {
        const $this = this;
        let errorMsg = [];
        const h = this.$createElement;
        this.isImported = true;
        const formData = new FormData();
        formData.append("file", item.file);
        importTemp(formData).then(data => {

          if (data.msg == "成功" || data.msg == "操作成功") {
            $this.$message({
              showClose: true,
              type: 'success',
              message: '导入成功 ',
            })
            this.handleSuccess();
          } else {
            for (let i in data.msg) {
              errorMsg.push(h('p', null, data.msg[i]))
            }
            $this.$message({
              showClose: true,
              duration: 0,
              type: 'error',
              message: h('div', null, errorMsg)
            })
            this.handleSuccess();
          }
        })
      },

      //下载模板
      downloadTemplate() {
        window.open('/api/data/dataModelTable/excelDownload');
      },

      //上传之前
      beforeUpload(file) {
        var FileExt = file.name.replace(/.+\./, "");
        if (["xls", "xlsx"].indexOf(FileExt.toLowerCase()) === -1) {
          this.$message({
            type: "warning",
            message: "请上传后缀名为xls、xlsx的附件！"
          });
          return false;
        }
        this.importDataText = '正在导入';
        this.importDisabled = true;
      },



      //导出
      handleExport(row) {
        let params = {};
        params = {
          tabName: row.tabName
        };
        download(params).then(result => {
          downloadFile(result, '数据', 'xlsx');

        }).catch(() => {})
      },


      //SQL预览
      async SQLPreview({
        tabId,
        tabName,
        tabNameCn,
        createBy
      }) {
        this.dialogVisible = true;
        // this.activeName2 = "MYSQL";
        this.sqlParams = {
          tabId,
          tabName,
          tabNameCn,
          createBy,
        };
        this.renderSql(this.sqlParams);
      },

      async renderSql(sqlParams) {
        this.creTabsqlLoading = true;
        const result = await sqlText(sqlParams).catch((err) => {});
        this.creTabsqlLoading = false;
        if (result) this.$refs.sqleditor.setVal(sqlFormatter.format(result));
      },


      // 修改按钮操作 
      handleUpdate(row) {
        this.openTypes = false
        this.reset();
        this.form = {
          ...row,
          // dbType: row.tableType
          dbType: 'MYSQL'
        };
        this.open = true;
        this.title = "编辑数据模型";
        this.fieldsLoading = true;
        queryTableColumn({
            tabId: row.tabId
          })
          .then((res) => {
            if (res.code === 200) {
              this.fieldsData = res.rows;
            }
            this.fieldsLoading = false;
          })
          .catch((err) => {
            this.fieldsLoading = false;
          });
      },

      // 表格删除按钮操作 
      handleDelete(row) {
        const tabIds = row.tabId;
        const tip = "是否确认删除该条数据项?";

        this.$confirm(tip, "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(function () {
            return dataModelRemove({
              tabIds: typeof tabIds === "number" ? [tabIds] : tabIds,
              status: 0,
            });
          })
          .then(() => {
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功 '
            });
          });
      },


      //查询数据库名称
      getDatabases() {
        let params = {};
        params = {
          datasourceName: 'mysql',
        };
        getDatabases(params).then(res => {
          let Num = [];
          for (let i in res.data) {
            var j = {};
            j.label = res.data[i];
            Num.push(j);
          }
          this.regionalType = Num;
        })
      },
      //选择查询数据库名称
      changeDatabases() {
        // console.log(this.form.regionalType)
        this.getTableNames(this.form.regionalType);
        this.form.tabName = [];
        this.fieldsData = [];
        this.syncFieldsData = [];
      },
      //查询数据表名称
      getTableNames(v) {
        let params = {};
        params = {
          databaseName: v,
        }
        getTableNames(params).then(res => {
          let Num = [];
          for (let i in res.data) {
            var j = {};
            j.label = res.data[i];
            Num.push(j);
          }
          this.tabName = Num
        })
      },
      //选择查询数据表名称
      changeTableNames() {
        this.getTableColumns(this.form.regionalType, this.form.tabName);
        this.fieldsData = [];
        this.syncFieldsData = [];
      },

      //查询指定数据表中的列名
      getTableColumns(v, n) {
        let params = {};
        params = {
          databaseName: v,
          tableName: n
        };
        getTableColumns(params).then(res => {
          this.fieldsData = res.data;
        })
      },

      //关联需求码表
      dataDemandList(demandName = "") {
        return dataDemandList({
            demandName,
            status: 2,
            pageNum: 1,
            pageSize: 20
          })
          .then((res) => {
            console.log(res);
            if (res.code === 200) {
              this.demandOptions = res.rows.map((item) => ({
                demandId: item.demandId,
                demandName: item.demandName,
                demandReqFrequency: item.demandReqFrequency,
                demandReqTime: item.demandReqTime,
              }));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },

      //关联需求码表查询
      async demandRelaQuery(keywords) {
        if (keywords) {
          this.doLoading = true;
          await this.dataDemandList(keywords);
          this.doLoading = false;
        } else {
          this.demandOptions = [];
        }
      },

      //关联需求改变
      demandOnChange(demandId) {
        if (!demandId) {
          this.form.dataUpdFrequency = null;
          this.form.dataUpdTime = null;
          return;
        }
        const result = this.demandOptions.find(
          (item) => item.demandId === demandId
        );
        this.form.dataUpdFrequency = result.demandReqFrequency;
        this.form.dataUpdTime = result.demandReqTime;
      },
      //同步数据表中的列
      syncGetColumns() {
        let params = {};
        params = {
          databaseName: this.form.regionalType,
          tableName: this.form.tabName
        };

        if (!this.form.regionalType) {
          this.$message({
            type: 'error',
            message: '请选择SCHEMA'
          });
        } else if (!this.form.tabName) {
          this.$message({
            type: 'error',
            message: '请选择数据表名'
          });
        } else {
          syncColumns(params).then(res => {
            this.fieldsData = res.data.oldData;
            if (!this.openTypes) {
              this.syncFieldsData = res.data.newData.filter(item => item.flag != 2)
            }

          })
        }
      },

      resertGetColumns(){

         if (!this.form.regionalType) {
          this.$message({
            type: 'error',
            message: '请选择SCHEMA'
          });
        } else if (!this.form.tabName) {
          this.$message({
            type: 'error',
            message: '请选择数据表名'
          });
        } else {
         this.getTableColumns(this.form.regionalType, this.form.tabName);
        this.fieldsData = [];
        this.syncFieldsData = [];
        }

      },


      //  内部表格删除
      innerDelete(index, rows) {
        rows.splice(index, 1);
      },
      //  内部表格启用/停用
      innerUpdate(index, rows) {
        if (rows[index].status == '1') {
          rows[index].status = '2';
        } else {
          rows[index].status = '1';
        }
      },

      handleClick(tab, event) {
        console.log("=====" + tab, event);
      },

      //提交按钮 
      submitForm() {

        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            if (
              this.fieldsData.some(
                (item) => !item.colName || !item.colType
              ) || !this.fieldsData.length
            ) {
              this.$message.warning("除字段中文名外字段信息不能有空值");
              return;
            }
            let result = null;
            this.subLoading = true;
            if (this.form.tabId) {
              result = await dataModelTable({
                ...this.form,
                dbType: 'MYSQL'
              }, "put", '/edit').catch(() => {});
              if (result && result.code === 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功 '
                });
                this.updateDataModelTable({
                  tabId: this.form.tabId,
                  list: this.fieldsData,
                });
                this.resetQuery()
              } else {
                this.$message({
                  type: 'error',
                  message: result.msg
                });
              }
            } else {
              result = await dataModelTable({
                ...this.form,
                dbType: 'MYSQL'
              }, "post", '/add').catch(() => {});
              if (result && result.code === 200) {
                this.$message({
                  type: 'success',
                  message: '新增成功 '
                });
                this.addBatchModelColumn({
                  tabId: result.data.tabId,
                  list: this.fieldsData,
                });
                this.resetQuery()
              } else {
                this.$message({
                  type: 'error',
                  message: result.msg
                })
              }
            }
            this.subLoading = false;
          } else {
            this.activeName = "first";
          }
        });
      },

      // 字段批量新增
      async addBatchModelColumn(data) {
        console.log(data);
        const result = await addBatchModelColumn(data).catch((err) => {
          console.log(err);
        });
        this.open = false;
        console.log(result);
      },
      // 字段批量修改
      async updateDataModelTable(data) {
        const result = await updateDataModelTable(data).catch((err) => {});
        this.open = false;
        console.log(result);
      },

      //关闭对话框
      cancel() {
        this.open = false;
        this.activeName = 'first';
        this.reset();
      },

      // 重置对话框
      reset() {
        this.form = {};
        this.fieldsData = [];
        this.syncFieldsData = [];
      },

      cellStyle(row){
        if(row.row.flag==="1"){
          return "background:#e1f3d8;height:49px"
        }else if(row.row.flag==="2" ){
          return "background:#fde2e2;height:49px"
        }else if(row.row.flag==="0" ){
          return "height:49px"
        }
      }
    }
  }
</script>

<style scoped>

.tableStyle table td{
  height: 100px; 
}
  .rule-tip-show {
    color: #f56c6c;
    margin: 0px;
    font-size: 12px;
  }

   .warning-row {
    background: oldlace;
  }

  .app-container .dialog .pane .el-table .success-row {
    background: red;
  }

  .upload-demo {
    margin: 0px 2px 10px 0px;
    display: inline;
    vertical-align: middle;
  }

  .el-upload {
    margin: 0px 2px 10px 0px;
    display: inline;
    vertical-align: middle;
  }

  .app-container .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding-left: 20px;
  }

  .app-container .dialog .pane .el-table td {
    padding-left: 20px;
  }

  .pane .el-table .cell {
    height: 49px;
  }
</style>
<style>
  .error-border .el-input__inner,
  .error-border .vue-treeselect__control {
    border-color: #f56c6c !important;
  }
</style>