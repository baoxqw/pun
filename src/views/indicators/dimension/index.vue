<template>
  <div class="app-container">
    <el-row :gutter="4">
      <!--侧边分类数据-->
      <el-col :span="7">
        <dimCategory ref="dimCategory" type="0" @node-click="handleCategoryClick" @handleAdd="addDimension" @handleRemove="handleRemove" @handleEdit="handleEdit"/>
      </el-col>
      <!--用户数据-->
      <el-col :span="17">
        <!--工具栏-->
        <div class="head-container">
          <div>
            <!-- 搜索 -->
            <el-input v-model="query.dimName" clearable size="small" placeholder="指标维度名称" style="width: 20%;" class="filter-item"  />
            <el-input v-model="query.categoryName" clearable size="small" placeholder="维度值" style="width: 20%;" class="filter-item"  />
            <rrOperation :crud="crud" />
          </div>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
        <crudOperation :permission="permission">
          <el-button   slot="right"
                  class="filter-item"
                  type="primary"
                  v-permission="permission.add"
                  @click="addDimensionButton"
          >
            新增
          </el-button>
          <el-button   slot="right"
                  class="filter-item"
                  type="primary"
                  v-permission="permission.edit"
                  @click="modifyDimensionButton"
          >
            修改
          </el-button>
        </crudOperation>
          <!--<el-button
              class="filter-item"
              type="primary"
              @click="addDimensionInfo"
          >
            修改维度
          </el-button>
          <el-button
              class="filter-item"
              type="primary"
              @click="addDimensionValue"
          >
            修改维度值
          </el-button>-->
          <!--表单组件-->
          <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="60%">
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
              <!--<el-form-item label="维度ID" prop="id">
                <el-input v-model="form.id" style="width: 100%;" />
              </el-form-item>-->
              <el-row>
                <el-col :span="12">
                  <el-form-item label="维度编号" prop="dimCode">
                    <el-input v-model="form.dimCode" style="width: 100%;" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="维度名称" prop="dimName">
                    <el-input v-model="form.dimName" style="width: 100%;" />
                  </el-form-item>
                  <!--<el-form-item label="数据源ID">
                    <el-select v-model="form.datasourceId" filterable placeholder="请选择" style="width: 100%;" @change="getTableByDB">
                      <el-option key="local" label="local" value="local" />
                      <el-option
                        v-for="item in tableDB"
                        :key="item.id"
                        :label="item.datasourceName"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>-->
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="维度表名" prop="tableName">
                    <!--<el-input v-model="form.tableName" style="width: 100%;" />-->
                    <el-select v-model="form.tableName" clearable placeholder="请选择" style="width: 100%;" @change="getTableInfo">
                      <el-option
                        v-for="item in tableData"
                        :key="item.id"
                        :label="item.tableDesc"
                        :value="item.tableName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="别名">
                    <el-input v-model="form.alias" style="width: 100%;" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="代码字段" prop="codeColumn">
                    <el-select v-model="form.codeColumn" clearable filterable placeholder="请选择" style="width: 100%;" @change="setCodeDesc">
                      <el-option
                        v-for="item in tableInfo"
                        :key="item.id"
                        :label="item.columnName+'-'+item.columnDesc"
                        :value="item.columnName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="代码字段描述" prop="codeColumnDesc">
                    <el-input v-model="form.codeColumnDesc" style="width: 100%;" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="显示字段" prop="nameColumn">
                    <!--<el-input v-model="form.nameColumn" style="width: 100%;" />-->
                    <el-select v-model="form.nameColumn" clearable filterable placeholder="请选择" style="width: 100%;" @change="setColumnDesc">
                      <el-option
                        v-for="item in tableInfo"
                        :key="item.id"
                        :label="item.columnName+'-'+item.columnDesc"
                        :value="item.columnName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="显示字段描述" prop="nameColumnDesc">
                    <el-input v-model="form.nameColumnDesc" style="width: 100%;" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="筛选字段">
                    <el-select v-model="form.filterColumn" clearable filterable placeholder="请选择" style="width: 100%;" @change="getListData">
                      <el-option
                        v-for="item in tableInfo"
                        :key="item.id"
                        :label="item.columnName+'-'+item.columnDesc"
                        :value="item.columnName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="筛选值列表">
                    <el-select v-model="form.filterValue" filterable multiple placeholder="请选择" style="width: 100%;">
                      <el-option
                        v-for="item in screenData"
                        :key="item.dimName"
                        :label="item.dimName"
                        :value="item.dimName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="父ID">
                    <el-select v-model="form.pid" clearable filterable placeholder="请选择" style="width: 100%;">
                      <el-option
                        v-for="item in tableInfo"
                        :key="item.id"
                        :label="item.columnName+'-'+item.columnDesc"
                        :value="item.columnName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="级别">
                    <el-select v-model="form.dimLevel" clearable filterable placeholder="请选择" style="width: 100%;">
                      <el-option
                        v-for="item in tableInfo"
                        :key="item.id"
                        :label="item.columnName+'-'+item.columnDesc"
                        :value="item.columnName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="主键标志">
                    <el-input v-model="form.pkFlag" style="width: 100%;" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="可控制权限">
                    <el-select v-model="form.authType" style="width: 100%;" clearable>
                      <el-option value="0" label="机构"></el-option>
                      <el-option value="1" label="用户"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            <!--<el-form-item label="创建人">
              <el-input v-model="form.crtUserCode" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="创建机构">
              <el-input v-model="form.crtOrgCode" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="创建日期">
              <el-input v-model="form.crtDate" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="修改人">
              <el-input v-model="form.updUserCode" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="修改机构">
              <el-input v-model="form.updOrgCode" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="修改日期">
              <el-input v-model="form.updDate" style="width: 100%;" />
            </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="success" plain round @click="crud.cancelCU">取消</el-button>
              <el-button :loading="crud.cu === 2" type="success" round @click="crud.submitCU">确认</el-button>
            </div>
          </el-dialog>
          <!--查看详情弹出框-->
          <el-dialog :close-on-click-modal="false" title="维度信息" :visible.sync="showDimInfo" width="60%">
            <el-form ref="form" :model="form" size="small" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="维度编号" prop="dimCode">
                    <el-input v-model="form.dimCode" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="维度名称" prop="dimName">
                    <el-input v-model="form.dimName" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
                <!--<el-col :span="12">
                  <el-form-item label="数据源ID" prop="datasourceId">
                    <el-input v-model="form.datasourceId" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>-->
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="维度表名" prop="tableName">
                    <el-input v-model="form.tableName" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="别名">
                    <el-input v-model="form.alias" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="代码字段" prop="codeColumn">
                    <el-input v-model="form.codeColumn" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="代码字段描述" prop="codeColumnDesc">
                    <el-input v-model="form.codeColumnDesc" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="显示字段" prop="nameColumn">
                    <el-input v-model="form.nameColumn" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="显示字段描述" prop="nameColumnDesc">
                    <el-input v-model="form.nameColumnDesc" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="筛选字段" prop="filterColumn">
                    <el-input v-model="form.filterColumn" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                   <el-form-item label="筛选值列表" prop="filterValue">
                    <el-input v-model="form.filterValue" style="width: 100%;" :disabled="true" />
                   </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="级别" prop="dimLevel">
                    <el-input v-model="form.dimLevel" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="父ID" prop="pid">
                    <el-input v-model="form.pid" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                 <el-form-item label="主键标志" prop="pkFlag">
                   <el-input v-model="form.pkFlag" style="width: 100%;" :disabled="true" />
                 </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="可控制权限">
                    <el-select v-model="form.authType" style="width: 100%;" :disabled="true" >
                      <el-option value="0" label="机构"></el-option>
                      <el-option value="1" label="用户"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="创建人" prop="crtUserCode">
                    <el-input v-model="form.crtUserCode" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建机构" prop="crtOrgCode">
                    <el-input v-model="form.crtOrgCode" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="创建日期" prop="crtDate">
                    <el-input v-model="form.crtDate" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="修改人" prop="updUserCode">
                    <el-input v-model="form.updUserCode" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="修改机构" prop="updOrgCode">
                    <el-input v-model="form.updOrgCode" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="修改日期" prop="updDate">
                    <el-input v-model="form.updDate" style="width: 100%;" :disabled="true" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="text" @click="showDimInfo = false">取消</el-button>
            </div>
          </el-dialog>
          <!--表格渲染-->
          <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
            <el-table-column type="selection" width="55" />
    <!--        <el-table-column v-if="columns.visible('id')" prop="id" label="维度ID" />-->
            <el-table-column v-if="columns.visible('dimInfoId')" label="指标维度名称" min-width="160" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span v-for="item in dimInfoArr" :key="item.id" v-if="item.id == scope.row.dimInfoId">
                  {{item.categoryName}}
                </span>
              </template>
            </el-table-column>

            <el-table-column v-if="columns.visible('nickName')" prop="lastCategoryName" label="上级维度值"/>

            <el-table-column v-if="columns.visible('categoryName')" prop="categoryName" label="维度值" min-width="120" :show-overflow-tooltip="true" />
    <!--        <el-table-column v-if="columns.visible('datasourceId')" prop="datasourceId" label="数据源ID" :formatter="formatId" />-->
    <!--        <el-table-column v-if="columns.visible('tableName')" prop="tableName" label="维度表名" min-width="160" :formatter="formatTableName" :show-overflow-tooltip="true" />-->
    <!--        <el-table-column v-if="columns.visible('codeColumn')" prop="codeColumn" label="代码字段" min-width="100" />-->
    <!--        <el-table-column v-if="columns.visible('codeColumnDesc')" prop="codeColumnDesc" label="代码字段描述" min-width="100" />-->
    <!--        <el-table-column v-if="columns.visible('nameColumn')" prop="nameColumn" label="显示字段" min-width="140" />-->
    <!--        <el-table-column v-if="columns.visible('nameColumnDesc')" prop="nameColumnDesc" label="显示字段描述" min-width="140" />-->
            <!--<el-table-column v-if="columns.visible('pid')" prop="pid" label="父ID(预留)" />
            <el-table-column v-if="columns.visible('dimLevel')" prop="dimLevel" label="级别(预留)" />-->
    <!--        <el-table-column v-if="columns.visible('filterColumn')" prop="filterColumn" label="筛选字段" min-width="100" />-->
    <!--        <el-table-column v-if="columns.visible('filterValue')" prop="filterValue" label="筛选值列表" min-width="100" />-->
    <!--        <el-table-column v-if="columns.visible('alias')" prop="alias" label="别名" />-->
    <!--        <el-table-column v-if="columns.visible('pkFlag')" prop="pkFlag" label="主键标志" />-->
            <el-table-column v-if="columns.visible('nickName')" prop="nickName" label="创建人"/>
            <!--<el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />-->
            <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="录入时间">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.crtDate) }}</span>
              </template>
            </el-table-column>
    <!--        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人" min-width="120" />-->
            <!--<el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="修改机构" />-->
    <!--        <el-table-column v-if="columns.visible('updDate')" prop="updDate" min-width="160" label="修改日期">-->
    <!--          <template slot-scope="scope">-->
    <!--            <span>{{ parseTime(scope.row.updDate) }}</span>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
            <el-table-column v-permission="['admin','indDimension:edit','indDimension:del']" label="操作" width="100px"   fixed="right">
              <template slot-scope="scope">
    <!--            <el-button-->
    <!--              type="success"-->
    <!--              v-permission="permission.details"-->
    <!--              class="filter-item"-->
    <!--              icon="el-icon-tickets"-->
    <!--              size="mini"-->
    <!--              style="margin-bottom:3px !important"-->
    <!--              @click="handleInfo(scope.row)"-->
    <!--            />-->
<!--                <udOperation-->
<!--                  :data="scope.row"-->
<!--                  :permission="permission"-->
<!--                  style="display:inline-block;"-->
<!--                />-->
                <el-button
                    slot="left"
                    v-permission="permission.del"
                    class="el-icon--left"
                    type="danger"
                    style="margin-bottom:3px !important"
                    size="mini"
                    @click="handleRemove(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
          <dimData ref="dimData" />
          <!--    指标维度分类-新增     -->
          <el-dialog :close-on-click-modal="false" @close="closeIndDimensionCateAddDialog" :title="indDimensionCateDialog" width="32%" :visible="showIndDimensionCateAdd">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form ref="form" :model="category" :rules="categoryRules" size="small" label-width="100px" @submit.native.prevent>

                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="superAdminFlag">
                  <el-form-item label="所属租户" prop="tenant" label-width="110px">
                    <el-select v-model="category.tenant" filterable placeholder="请选择" style="width: 95%;">
                      <el-option
                              v-for="item in tenantArr"
                              :key="item.ID"
                              :label="item.NAME"
                              :value="item.ID"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="指标维度分类名称" prop="categoryName" label-width="140px">
                    <el-input v-model="category.categoryName" style="width: 90%;"/>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <div slot="footer" class="dialog-footer">
              <el-button type="success" plain round @click="closeIndDimensionCateAddDialog">取消</el-button>
              <el-button type="success" round @click="commitDimCate">确认</el-button>
            </div>
          </el-dialog>
          <!--    指标维度名称-新增     -->
          <el-dialog :close-on-click-modal="false" @close="closeIndDimensionAddDialog" :title="indDimensionDialog" width="30%" :visible="showIndDimensionAdd">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form ref="form" :model="dimension" :rules="dimensionRules" size="small" label-width="100px">

                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="superAdminFlag">
                  <el-form-item label="所属租户" prop="tenant" label-width="110px">
                    <el-select v-model="dimension.tenant" filterable placeholder="请选择" style="width: 95%;">
                      <el-option
                              v-for="item in tenantArr"
                              :key="item.ID"
                              :label="item.NAME"
                              :value="item.ID"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="所属分类" prop="classificationId" label-width="110px">
                    <el-select v-model="dimension.classificationId" filterable placeholder="请选择" disabled style="width: 95%;">
                      <el-option
                          v-for="item in classificationArr"
                          :key="item.id"
                          :label="item.categoryName"
                          :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="指标维度名称" prop="categoryName" label-width="110px">
                    <el-input v-model="dimension.categoryName" style="width: 95%;"/>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="维度英文名称" prop="columnName" label-width="110px">
                    <el-input v-model="dimension.columnName" style="width: 95%;"/>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="备注" prop="remarks" label-width="110px">
                    <el-input type="textarea" v-model="dimension.remarks" style="width: 95%;" :rows="5"/>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <div slot="footer" class="dialog-footer">
              <el-button type="success" plain round @click="closeIndDimensionAddDialog">取消</el-button>
              <el-button type="success" round @click="commitDim">确认</el-button>
            </div>
          </el-dialog>
          <!--    指标维度值名称-新增     -->
          <el-dialog :close-on-click-modal="false" @close="closeIndDimensionValueAddDialog" :title="indDimensionValueDialog" width="30%" :visible="showIndDimensionValueAdd">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form ref="form" :model="dimensionValue" :rules="dimensionValueRules" size="small" label-width="100px">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="所属维度" prop="dimInfoId" label-width="110px">
                    <el-select v-model="dimensionValue.dimInfoId" filterable placeholder="请选择" disabled style="width: 95%;">
                      <el-option
                          v-for="item in dimInfoArr"
                          :key="item.id"
                          :label="item.categoryName"
                          :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="上级维度值" prop="lastLevelDimValueId" label-width="110px">
                    <el-select :disabled="lastLevelDimValueFlag" v-model="dimensionValue.lastLevelDimValueId" filterable placeholder="请选择" disabled style="width: 95%;">
                      <el-option
                          v-for="item in dimValueArr"
                          :key="item.id"
                          :label="item.categoryName"
                          :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="指标维度值" prop="categoryName" label-width="110px">
                    <el-input v-model="dimensionValue.categoryName" style="width: 95%;" :rows="5"/>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="指标维度值码值" prop="dimValueCode" label-width="110px">
                    <el-input v-model="dimensionValue.dimValueCode" style="width: 95%;" :rows="5"/>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <div slot="footer" class="dialog-footer">
              <el-button type="success" plain round @click="closeIndDimensionValueAddDialog">取消</el-button>
              <el-button type="success" round @click="commitDimValue">确认</el-button>
            </div>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import crudIndDimension from '../../../api/indicators/indDimension'
import crudIndClassification, { getClassifications } from '@/api/indicators/indClassification'
import crudIndDimInfo, { getDimInfos } from '@/api/indicators/indDimInfo'
import crudIndDimValue, { getDimValues } from '@/api/indicators/indDimValue'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getValueListByTableAndColumn } from '@/api/indicators/indDimension'
import { getTableListById } from '@datasource/api/datasources/indDataTable'
import { getColumnListByDataSourceIdAndTableName } from '@datasource/api/datasources/indDataColumn'
import dimData from '../dimension/dimData'
import dimCategory from '../category/dimCategory'
import { isSuperAdmin, getTenants } from '@/api/indUserApply/indTenant'
import {validateStrLenHalfHundred, validateStrLenHundred} from "@/utils/validator";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: '维度值管理',
  url: crudIndDimValue.url,
  sort: 'id,desc',
  crudMethod: { ...crudIndDimValue.method }
})
const defaultForm = { id: null, dimInfoId: null, lastLevelDimValueId: null, dimValueName: null, dimValueLevel: null,
  crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, updDate: null }
export default {
  name: 'IndClassification',
  components: { pagination, crudOperation, rrOperation, udOperation, dimData, dimCategory },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['DIMENSION_CATEGORY', 'DIMENSION', 'LAST_LEVEL_DIMENSION_VALUE'],
  data() {
    return {
      table: {
        columns: {
          id: 'hidden',
          datasourceId: 'hidden',
          nameColumn: 'hidden',
          nameColumnDesc: 'hidden',
          codeColumn: 'hidden',
          codeColumnDesc: 'hidden',
          alias: 'hidden',
          pkFlag: 'hidden',
          filterColumn: 'hidden',
          filterValue: 'hidden'
        }
      },
      tableData: [],
      tableInfo: [],
      tableDB: [],
      DictDB: [],
      selectData: [],
      screenData: [],
      showDimInfo: false,
      permission: {
        add: ['admin', 'indDimension:add'],
        edit: ['admin', 'indDimension:edit'],
        del: ['admin', 'indDimension:del'],
        showAllDimCode: ['admin', 'indDimension:showAllDimCode'],
        details: ['admin', 'indDimension:details']
      },
      rules: {
        dimCode: [
          { required: true, message: '维度编号不能为空', trigger: 'blur' }
        ],
        dimName: [
          { required: true, message: '维度名称不能为空', trigger: 'blur' }
        ],
        tableName: [
          { required: true, message: '维表表名称不能为空', trigger: 'blur' }
        ],
        codeColumn: [
          { required: true, message: '代码字段不能为空', trigger: 'blur' }
        ],
        codeColumnDesc: [
          { required: true, message: '代码字段描述不能为空', trigger: 'blur' }
        ],
        nameColumn: [
          { required: true, message: '显示字段不能为空', trigger: 'blur' }
        ],
        nameColumnDesc: [
          { required: true, message: '显示字段描述不能为空', trigger: 'blur' }
        ]
      },
      showIndDimensionAdd: false,
      category: {
        id: null,
        categoryName: null,//分类名称
        tenant: null
      },
      dimension: {
        id: null,
        classificationId: null,// 所属分类
        categoryName: null,// 指标维度名称
        columnName: null, //维度英文名称
        remarks: null,// 备注
        tenant: null//租户 法人
      },
      dimensionRules: {
        categoryName: [
          { max: 50, message: '指标维度名称长度不能超过50字', trigger: ['blur', 'change'] },
          { required: true, message: '指标维度名称不能为空', trigger: 'blur' },
          { validator: validateStrLenHundred, trigger: 'blur' }
        ],
        columnName: [
          { max: 50, message: '维度英文名称长度不能超过50字', trigger: ['blur', 'change'] },
          { required: true, message: '维度英文名称不能为空', trigger: 'blur' },
          { validator: validateStrLenHundred, trigger: 'blur' }
        ],
        classificationId: [
          {required: true,message: '请选择所属分类',trigger: 'change'}
        ],
        remarks: [
          { max: 200, message: '备注长度不能超过200字', trigger: ['blur', 'change'] }
        ],
        tenant:[
          { required: true, message: '所属租户不能为空', trigger: 'blur' }
        ]
      },
      showIndDimensionValueAdd: false,
      dimensionValue: {
        id: null,
        dimInfoId: null,// 所属维度
        lastLevelDimValueId: null,// 上级维度值
        categoryName: null,// 指标维度值
        dimValueCode: null,//指标维度值码值
        dimLevel: null// 维度树层级
      },
      dimensionValueRules: {
        categoryName: [
          { required: true, message: '指标维度值不能为空', trigger: 'blur' },
          { validator: validateStrLenHalfHundred, trigger: 'blur' }
        ]
      },
      categoryRules: {
        categoryName: [
          { max: 10, message: '指标维度分类名称长度不能超过10字', trigger: ['blur', 'change'] },
          { required: true, message: '指标维度分类名称不能为空', trigger: 'blur' }
        ],
        tenant:[
          { required: true, message: '所属租户不能为空', trigger: 'blur' }
        ]
      },
      indDimensionDialog: '指标维度名称-新增',
      indDimensionValueDialog: '指标维度值-新增',
      indDimensionCateDialog: '指标维度分类-新增',
      showIndDimensionCateAdd: false,
      classificationArr: [],
      dimInfoArr: [],
      dimValueArr: [],
      lastLevelDimValueFlag: false,
      dimLevel: null,

      dimTreeInfoChildren: null,

      dimTreeValueName: null,//层级树 维度值名称
      dimTreeValueCode: null,
      dimTreeValueInfoId: null,//层级树 维度值的维度id
      dimTreeValueLastLevelId: null,////层级树 维度值 上级维度值id
      dimTreeValueId: null,////层级树 维度值id
      dimTreeValueChildren: null,
      buttonTreeData: null,//点击

      superAdminFlag: false,
      tenantArr: []
    }
  },
  created() {

    this.superAdminFlag = isSuperAdmin();
    // this.$nextTick(() => {
    //   getAllSource().then(data => {
    //   // console.log("=====getAllSource====>>>>",data)
    //     if (data.code === 0) {
    //       this.tableDB = data.data
    //     } else {
    //       this.$message.error({
    //         message: '获取数据失败'
    //       })
    //     }
    //   })
    //   getTableListById('all').then(data => {
    //     if (data.code === 0) {
    //       this.DictDB = data.data
    //     } else {
    //       this.$message.error({
    //         message: '获取数据失败'
    //       })
    //     }
    //   })
    // })
    this.initTreeData()
    this.crud.optShow.del=false
    this.crud.optShow.add=false
    this.resetQuery()
  },
  methods: {
    resetQuery(){
      this.crud.resetQuery(false);
      this.crud.refresh()
    },
    initTreeData() {
      //获取所有维度分类树
      getClassifications({size: 500, page: 0}).then(data => {
        this.$refs.dimCategory.treeData[0].children = data.data.records
        this.classificationArr = data.data.records
      })
      getDimInfos( {size: 500, page: 0}).then(data => {
        this.dimInfoArr = data.data.records
      })
      getDimValues( {size: 800, page: 0}).then(data => {
        this.dimValueArr = data.data.records
      })
      getTenants().then(data => {
        if (data != null && data.code == '0000') {
            this.tenantArr = data.data
        }
      })
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.tableData = []
      this.tableInfo = []
      this.form.datasourceId = 'local'
      getTableListById(this.form.datasourceId).then(data => {
        if (data.code === 0) {
          this.tableData = data.data
        } else {
          this.clearFrom()
        }
      })
    },
    [CRUD.HOOK.beforeToEdit]() {
       getTableListById(this.form.datasourceId).then(data => {
         // console.log("====getTables====>>>>>",data)
         if (data.code === 0) {
           this.tableData = data.data
         } else {
           this.tableData = []
         }
       })
       getColumnListByDataSourceIdAndTableName(this.form.datasourceId, this.form.tableName).then(data => {
         // console.log("========getColumns====>>>>",data)
         if (data.code === 0) {
           if (data.data.length === 0) {
             this.$message.error({
               message: '表' + this.form.tableName + '不存在'
             })
           }
           this.tableInfo = data.data
         } else {
           this.tableInfo = []
         }
       })
       if (this.form.filterColumn !== null && this.form.filterColumn !== ''){
        const temp = this.form.filterValue
        let tempArray = []
        if ((temp !== null && temp !== '') && temp.indexOf(',') !== -1) {
          tempArray = temp.split(',')
        } else if (temp !== null && temp !== '') {
          tempArray.push(temp)
        }
        this.form.filterValue = tempArray
        getValueListByTableAndColumn(this.form.tableName, this.form.filterColumn, this.form.datasourceId).then(data => {
         if (data.code === 0) {
           this.screenData = data.data
         } else {
           this.$message.error({
             message: '表' + this.form.tableName + '或列' + this.form.filterColumn + '不存在'
           })
         }
        })
       }

    },
    [CRUD.HOOK.beforeSubmit]() {
       if(this.form.filterValue !== null && this.form.filterValue !== '') {
        this.form.filterValue = String(this.form.filterValue)
       }
    },
    getTableInfo() {
      this.form.nameColumn = ''
      this.form.nameColumnDesc = ''
      this.form.codeColumn = ''
      this.form.codeColumnDesc = ''
      this.form.filterColumn = ''
      this.form.filterValue = ''
      getColumnListByDataSourceIdAndTableName(this.form.datasourceId, this.form.tableName).then(data => {
        // console.log("========getColumns====>>>>",data)
        if (data.code === 0) {
          if (data.data.length === 0) {
            this.$message.error({
              message: '表' + this.form.tableName + '不存在'
            })
          }
          this.tableInfo = data.data
        } else {
          this.tableInfo = []
        }
      })
    },
    getListData() {
      this.form.filterValue = ''
      if(this.form.filterColumn !== null && this.form.filterColumn !== ''){
        getValueListByTableAndColumn(this.form.tableName, this.form.filterColumn, this.form.datasourceId).then(data => {
          if (data.code === 0) {
            this.screenData = data.data
          } else {
            this.$message.error({
              message: '表' + this.form.tableName + '或列' + this.form.filterColumn + '不存在'
            })
          }
        })
      }
    },
    setColumnDesc() {
      this.tableInfo.forEach(row => {
        if (this.form.nameColumn === row.columnName) {
          this.form.nameColumnDesc = row.columnDesc
        }
      })
    },
    setCodeDesc() {
      this.tableInfo.forEach(row => {
        if (this.form.codeColumn === row.columnName) {
          this.form.codeColumnDesc = row.columnDesc
        }
      })
    },
    getTableByDB() {
      this.clearFrom()
      getTableListById(this.form.datasourceId).then(data => {
        if (data.code === 0) {
          this.tableData = data.data
        } else {
          this.clearFrom()
        }
      })
    },
    clearFrom() {
      this.form.nameColumn = ''
      this.form.nameColumnDesc = ''
      this.form.tableName = ''
      this.form.codeColumn = ''
      this.form.codeColumnDesc = ''
      this.form.filterColumn = ''
      this.form.filterValue = ''
      this.tableData = []
      this.tableInfo = []
    },
    formatId(row) {
      let name = ''
      this.tableDB.forEach(row1 => {
        if (row1.id === row.datasourceId) {
          name = row1.datasourceName
        }
      })
      return name
    },
    formatTableName(row) {
      let name = ''
      this.DictDB.forEach(row1 => {
        if (row1.tableName === row.tableName) {
          name = row1.tableDesc
        }
      })
      return name
    },
    handleInfo(row) {
      this.form.id = row.id
      this.form.dimCode = row.dimCode
      this.form.datasourceId = row.datasourceId
      this.form.dimName = row.dimName
      this.form.tableName = row.tableName
      this.form.codeColumn = row.codeColumn
      this.form.codeColumnDesc = row.codeColumnDesc
      this.form.nameColumn = row.nameColumn
      this.form.nameColumnDesc = row.nameColumnDesc
      this.form.pid = row.pid
      this.form.dimLevel = row.dimLevel
      this.form.filterColumn = row.filterColumn
      this.form.filterValue = row.filterValue
      this.form.alias = row.alias
      this.form.pkFlag = row.pkFlag
      this.form.crtUserCode = row.crtUserCode
      this.form.crtOrgCode = row.crtOrgCode
      this.form.crtDate = this.parseTime(row.crtDate)
      this.form.updUserCode = row.updUserCode
      this.form.updOrgCode = row.updOrgCode
      this.form.updDate = this.parseTime(row.updDate)
      this.showDimInfo = true
    },
    showAllDimCode(data) {
      console.log("========showAllDimCode====>>>>",data)
      const _this = this.$refs.dimData
      _this.query.tableName = data.tableName
      _this.query.columnDimCode = data.dimCode
      _this.query.columnDimName = data.dimName
      _this.query.columnCodeColumn = data.codeColumn
      _this.query.columnNameColumn = data.nameColumn
      _this.query.columnDimLevel = data.dimLevel
      _this.query.columnFilterColumn = data.filterColumn
      _this.query.columnPid = data.pid
      _this.tCode = data.codeColumnDesc
      _this.tName = data.nameColumnDesc
      const temp = String(data.filterValue)
      _this.query.queryFilter = temp
      if ((temp !== null && temp !== '') && temp.indexOf(',') !== -1) {
        _this.filterValue = temp.split(',')
      } else {
        _this.filterValue.push(temp)
      }
      _this.searchDimData()
      _this.showAllDim = true
    },
    handleCategoryClick(data) {
      console.log("handleCategoryClick =========== " + data)
      this.dimLevel = data.dimLevel
      this.buttonTreeData = data;
      if(data.dimLevel == 0) {
        this.query.dimInfoId = null;
        this.query.treeLevel = data.dimLevel;
        defaultCrud.toQuery();
      }else if (data.dimLevel == 1) {
        this.dimension.classificationId = data.id
      } else if (data.dimLevel == 2) {
        //用来配置维度值
        this.dimensionValue.dimInfoId = data.id
        this.dimensionValue.id = null
        this.dimTreeInfoChildren = data.children

        //用来修改维度赋值
        this.dimension.categoryName = data.categoryName
        this.dimension.columnName = data.columnName
        this.dimension.id = data.id
        this.dimension.classificationId = data.classificationId
        this.dimension.remarks = data.remarks
      } else if (data.dimLevel == 3 || data.dimLevel == 4 || data.dimLevel == 5) {
        this.dimTreeValueName = data.categoryName;
        this.dimTreeValueCode = data.dimValueCode;
        this.dimTreeValueInfoId = data.dimInfoId;
        this.dimTreeValueLastLevelId = data.lastLevelDimValueId;
        this.dimTreeValueId = data.id;
        this.dimTreeValueChildren = data.children

        /*
        this.lastLevelDimValueFlag = data.dimLevel == 3;
        this.dimensionValue.categoryName = data.categoryName
        this.dimensionValue.id = data.id
        this.dimensionValue.dimInfoId = data.dimInfoId
        this.dimensionValue.lastLevelDimValueId = data.lastLevelDimValueId
        this.dimensionValue.dimLevel = data.dimLevel
        */
      }
      if(data.dimLevel == 1 || data.dimLevel == 2 || data.dimLevel == 5) {
        this.query.treeLevel = data.dimLevel
        this.query.treeId = data.id
        this.query.dimInfoId = data.id
        defaultCrud.toQuery();
      } else if (data.dimLevel == 3 || data.dimLevel == 4){
        this.query.treeLevel = data.dimLevel
        this.query.treeId = data.id
        this.query.dimInfoId = data.id
        defaultCrud.toQuery();
      }

    },
    // 关闭维度新增弹框
    closeIndDimensionAddDialog() {
      this.showIndDimensionAdd = false
    },
    // 确认提交新增维度
    commitDim() {
      this.crud.findVM('form').$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        if (this.dimension.id == null) {
          crudIndDimInfo.crud.add(this.dimension).then(data => {
            if (data.code && data.code !== 0) {
              this.$notify({
                title: data.msg,
                type: 'error',
                duration: 2500
              })
              //this.showIndDimensionAdd = false
            } else {
              this.$notify({
                title: '新增成功',
                type: 'success',
                duration: 2500
              })
              this.initTreeData()
              this.showIndDimensionAdd = false
            }
          })
        } else {
          crudIndDimInfo.crud.edit(this.dimension).then(data => {
            if (data.code && data.code !== 0) {
              this.$notify({
                title: data.msg,
                type: 'error',
                duration: 2500
              })
             // this.showIndDimensionAdd = false
            } else {
              this.$notify({
                title: '编辑成功',
                type: 'success',
                duration: 2500
              })
              this.initTreeData()
              this.showIndDimensionAdd = false
            }
          })
        }
      })

    },
    // 关闭维度值新增弹框
    closeIndDimensionValueAddDialog() {
      this.showIndDimensionValueAdd = false
    },
    // 确认提交新增维度值
    commitDimValue() {
      this.crud.findVM('form').$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        if (this.dimensionValue.id == null) {
          crudIndDimValue.crud.add(this.dimensionValue).then(data => {
            if (data.code && data.code !== 0) {
              this.$notify({
                title: data.msg,
                type: 'error',
                duration: 2500
              })
              //this.showIndDimensionValueAdd = false
            } else {
              this.$notify({
                title: '新增成功',
                type: 'success',
                duration: 2500
              })
              this.initTreeData()
              this.showIndDimensionValueAdd = false
              defaultCrud.toQuery();
            }
          })
        } else {
          crudIndDimValue.crud.edit(this.dimensionValue).then(data => {
            if (data.code && data.code !== 0) {
              this.$notify({
                title: data.msg,
                type: 'error',
                duration: 2500
              })
              this.showIndDimensionValueAdd = false
            } else {
              this.$notify({
                title: '编辑成功',
                type: 'success',
                duration: 2500
              })
              this.initTreeData()
              this.showIndDimensionValueAdd = false
              defaultCrud.toQuery();
            }
          })
        }
      })
    },
    // 新增
    addDimension(data) {
      if (data.dimLevel == 0) { // 新增分类
        //置空输入项
        this.category.categoryName = null
        this.category.tenant = null
        this.category.id = null
        this.indDimensionCateDialog = '指标维度分类-新增'
        this.showIndDimensionCateAdd = true
      } else if (data.dimLevel == 1) { //新增维度
        this.indDimensionDialog = '指标维度名称-新增'
        this.dimension.categoryName = null
        this.dimension.columnName = null
        this.dimension.tenant = null
        this.dimension.remarks = null
        this.dimension.id = null
        this.showIndDimensionAdd = true
      } else if (data.dimLevel == 2) { //新增维度值
        this.indDimensionValueDialog = '指标维度值-新增'
        // this.dimensionValue.dimInfoId = data.id
        this.dimensionValue.categoryName = null
        this.dimensionValue.dimValueCode = null
        this.dimensionValue.dimLevel = null
        this.dimensionValue.lastLevelDimValueId = null
        this.dimensionValue.id = null
        this.showIndDimensionValueAdd = true
        this.lastLevelDimValueFlag = true
      } else if (data.dimLevel > 2) {
        this.indDimensionValueDialog = '指标维度值-新增'
        this.dimensionValue.categoryName = null
        this.dimensionValue.dimValueCode = null
        this.dimensionValue.dimInfoId = data.dimInfoId
        this.dimensionValue.dimLevel = data.dimLevel + 1;
        this.dimensionValue.lastLevelDimValueId = data.id
        this.dimensionValue.id = null
        this.showIndDimensionValueAdd = true
        this.lastLevelDimValueFlag = true
      }




      /*if (data.categoryName === '维度分类') {
        //置空输入项
        this.category.categoryName = null
        this.category.tenant = null
        this.category.id = null
        this.indDimensionCateDialog = '指标维度分类-新增'
        this.showIndDimensionCateAdd = true
      } else if (data.dimLevel == 1 || this.dimLevel == 1 || this.dimLevel == 2) {
        // this.dimension.classificationId = data.id
        if (this.dimension.id != null && this.dimLevel == 2) {
          this.indDimensionDialog = '指标维度名称-修改'
          this.showIndDimensionAdd = true
        } else {
          this.indDimensionDialog = '指标维度名称-新增'
          this.dimension.categoryName = null
          this.dimension.tenant = null
          this.dimension.remarks = null
          this.dimension.id = null
          this.showIndDimensionAdd = true
        }
      }*/
    },
    //配置维度
    addDimensionInfo(data){
      if (this.dimLevel == 2) {

        if (this.dimTreeInfoChildren != null && this.dimTreeInfoChildren.length > 0) {
          this.$message({
            type: 'error',
            message: '该维度有子节点，不能修改！'
          })
        } else {
          this.indDimensionDialog = '指标维度名称-修改'
          /*this.dimension.categoryName = null
          this.dimension.tenant = null
          this.dimension.remarks = null
          this.dimension.id = null*/
          this.showIndDimensionAdd = true
        }
      } else {
        this.$message({
          type: 'error',
          message: '请选择分类！'
        })
      }

    },
    // 修改维度值
    addDimensionValue(data) {
      if (this.dimLevel == 3 || this.dimLevel == 4 || this.dimLevel == 5) {
        if (this.dimTreeValueChildren != null && this.dimTreeValueChildren.length > 0) {
          this.$message({
            type: 'error',
            message: '该维度值有子节点，不能修改！'
          })
        } else {
          this.indDimensionValueDialog = '维度值-修改'
          this.dimensionValue.categoryName = this.dimTreeValueName
          this.dimensionValue.dimInfoId = this.dimTreeValueInfoId
          this.dimensionValue.dimValueCode = this.dimTreeValueCode
          //this.dimensionValue.dimLevel = data.dimLevel + 1;
          this.dimensionValue.lastLevelDimValueId = this.dimTreeValueLastLevelId
          this.dimensionValue.id = this.dimTreeValueId
          this.showIndDimensionValueAdd = true
          this.lastLevelDimValueFlag = false
        }
   /*     this.dimTreeValueName = data.categoryName;
        this.dimTreeValueInfoId = data.dimInfoId;
        this.dimTreeValueLastLevelId = data.lastLevelDimValueId;
        this.dimTreeValueId = data.id;*/
      } else {
        this.$message({
          type: 'error',
          message: '请选择维度值！'
        })
      }


/*    if (data.dimLevel > 2 || this.dimLevel == 2) {
        this.indDimensionValueDialog = '维度值-新增'
        // this.dimensionValue.dimInfoId = data.id
        this.dimensionValue.categoryName = null
        this.dimensionValue.dimLevel = null
        this.dimensionValue.lastLevelDimValueId = null
        this.dimensionValue.id = null
        this.showIndDimensionValueAdd = true
        this.lastLevelDimValueFlag = true
      } else if (data.dimLevel == 3 || data.dimLevel == 4 || this.dimLevel == 3 || this.dimLevel == 4 || this.dimLevel == 5) {
        this.indDimensionValueDialog = '维度值-修改'
        this.showIndDimensionValueAdd = true
      }*/
    },
    handleRemove(data) {
      //处理删除，level为1表示指标维度分类的操作
      if (data.dimLevel == 1) {
        const $this = this
        this.$confirm('确定要删除该节点吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (data.children.length === 0 ) {
            crudIndClassification.crud.del([data.id]).then((res) => {
              if (res.code !== 0) {
                $this.$message({
                  type: 'error',
                  message: '删除失败,' + res.msg
                })
              } else {
                $this.$message({
                  type: 'success',
                  message: '删除成功 '
                })
                this.initTreeData()
              }
            }).catch(() => {
              $this.$message({
                type: 'error',
                message: '删除失败 '
              })
            })
          } else {
            $this.$message({
              type: 'error',
              message: '该分类已被引用，不可删除'
            })
          }
        })
      } else if (data.dimLevel == 2) {
        const $this = this
        this.$confirm('确定要删除该节点吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (data.children.length === 0 ) {
            crudIndDimInfo.crud.del([data.id]).then((res) => {
              if (res.code !== 0) {
                $this.$message({
                  type: 'error',
                  message: '删除失败,' + res.msg
                })
              } else {
                $this.$message({
                  type: 'success',
                  message: '删除成功 '
                })
                this.initTreeData()
              }
            }).catch(() => {
              $this.$message({
                type: 'error',
                message: '删除失败 '
              })
            })
          } else {
            $this.$message({
              type: 'error',
              message: '当前节点下有子节点，不能删除'
            })
          }
        })
      } else if (data.dimLevel == 3 || data.dimLevel == 4 || data.dimLevel == 5) {
        const $this = this
        this.$confirm('确定要删除该节点吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudIndDimValue.crud.del([data.id]).then((res) => {
            if (res.code !== 0) {
              $this.$message({
                type: 'error',
                message: '删除失败,' + res.msg
              })
            } else {
              $this.$message({
                type: 'success',
                message: '删除成功 '
              })
              this.initTreeData()
              defaultCrud.toQuery();
            }
          }).catch(() => {
            $this.$message({
              type: 'error',
              message: '删除失败 '
            })
          })
        })
      }
    },
    handleEdit(data) {
      if (data.children != null && data.children.length > 0) {
        this.$message({
          type: 'error',
          message: '该维度值有子节点，不能修改！'
        })
        return;
      }
      if (data.dimLevel == 1) {
        this.indDimensionCateDialog = '指标维度分类名称-修改'
        this.category.categoryName = data.categoryName
        this.category.tenant = data.tenant
        this.category.id = data.id
        this.showIndDimensionCateAdd = true
      } else if (data.dimLevel == 2) {
        this.indDimensionDialog = '指标维度名称-修改'
        this.dimension.categoryName = data.categoryName
        this.dimension.columnName = data.columnName
        this.dimension.tenant = data.tenant
        this.dimension.id = data.id
        this.dimension.classificationId = data.classificationId
        this.dimension.remarks = data.remarks
        this.showIndDimensionAdd = true
      } else if (data.dimLevel >= 3) {
          this.indDimensionValueDialog = '指标维度值-修改'
          this.dimensionValue.categoryName = data.categoryName
          this.dimensionValue.dimValueCode = data.dimValueCode
          this.dimensionValue.id = data.id
          this.dimensionValue.lastLevelDimValueId = data.lastLevelDimValueId
          this.dimensionValue.dimInfoId = data.dimInfoId
          this.showIndDimensionValueAdd = true
          //上级维度值不能选中
          this.lastLevelDimValueFlag = false

      } /*else if (data.dimLevel == 4 || data.dimLevel == 5) {
        this.indDimensionValueDialog = '维度值-编辑'
        this.dimensionValue.categoryName = data.categoryName
        this.dimensionValue.id = data.id
        this.dimensionValue.lastLevelDimValueId = data.lastLevelDimValueId
        this.dimensionValue.dimInfoId = data.dimInfoId
        this.showIndDimensionValueAdd = true
      }*/
    },
    closeIndDimensionCateAddDialog() {
      this.showIndDimensionCateAdd = false
    },
    //新增指标维度分类提交
    commitDimCate() {
      this.crud.findVM('form').$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        if (this.category.id == null) {
          crudIndClassification.crud.add(this.category).then(data => {
            if (data.code && data.code !== 0) {
              this.$notify({
                title: '新增失败，' + data.msg,
                type: 'error',
                duration: 2500
              })
              this.showIndDimensionCateAdd = false
            } else {
              this.$notify({
                title: '新增成功',
                type: 'success',
                duration: 2500
              })
              this.initTreeData()
              this.showIndDimensionCateAdd = false
            }
          })
        } else {
          crudIndClassification.crud.edit(this.category).then(data => {
            if (data.code && data.code !== 0) {
              this.$notify({
                title: '编辑失败，' + data.msg,
                type: 'error',
                duration: 2500
              })
              this.showIndDimensionCateAdd = false
            } else {
              this.$notify({
                title: '编辑成功',
                type: 'success',
                duration: 2500
              })
              this.initTreeData()
              this.showIndDimensionCateAdd = false
            }
          })
        }
      })
    },
    addDimensionButton(){
      //新增按钮
      if (this.dimLevel == null || this.dimLevel == undefined) {
        this.$message({
          type: 'error',
          message: '请选择左侧维度分类树！'
        })
        return;
      }
      if (this.dimLevel == 5){
        this.$message({
          type: 'error',
          message: '维度树最多到5级！'
        })
        return;
      }
      this.addDimension(this.buttonTreeData);
    },
    modifyDimensionButton(){
      //修改按钮
      if (this.dimLevel == null || this.dimLevel == undefined || this.dimLevel == 0) {
        this.$message({
          type: 'error',
          message: '请选择左侧维度分类树！'
        })
        return;
      }

      if (this.buttonTreeData != null && this.buttonTreeData.children && this.buttonTreeData.children.length > 0) {
        this.$message({
          type: 'error',
          message: '该节点下有子节点，不能修改！'
        })
        return;
      }
      this.handleEdit(this.buttonTreeData);
    }

  }
}
</script>

<style scoped>
  .tableDiv {
    border: 1px solid #dfe6ec;
    overflow: auto;
    height: 452px;
    width: 100%;
    margin-top: 10px;
  }
  .app-container .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
    padding-left: 20px;
  }
  .app-container .el-table th>.cell {
    padding-left: 20px;
  }
</style>
