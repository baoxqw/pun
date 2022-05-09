<template>
  <div class="app-container">
    <el-row :gutter="10">
      <!--侧边分类数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">
        <category type="1" @node-click="handleCategoryClick"/>
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
                v-model="query.ieCode"
                clearable
                size="small"
                placeholder="指标编号"
                style="width: 100px;"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
            />
            <el-input
                v-model="query.ieName"
                clearable
                size="small"
                placeholder="指标名称"
                style="width: 180px;"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
            />
            <el-select
                v-model="query.status"
                clearable
                size="small"
                placeholder="状态"
                class="filter-item"
                style="width: 90px"
                @change="crud.toQuery"
            >
              <el-option v-for="item in dict.IE_STATUS" :key="item.id" :label="item.label" :value="item.value"/>
            </el-select>
            <el-select v-model="query.ieProp" clearable placeholder="级别" size="small" class="filter-item"
                       style="width: 90px" @change="crud.toQuery">
              <el-option
                  v-for="item in dict.IE_PROP"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
            <el-select v-model="query.manageDept" clearable placeholder="管理部门" size="small" class="filter-item"
                       style="width: 160px" @change="crud.toQuery">
              <el-option
                  v-for="item in depts"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
              />
            </el-select>
            <rrOperation :crud="crud"/>

          </div>

          <!--表单组件-->
          <!--          permission="permission.submit"-->
          <crudOperation :permission="permission">
            <el-button
                slot="left"
                v-permission="permission.add"
                class="filter-item"
                type="primary"
                style="margin-left: 8px"
                icon="el-icon-plus"
                @click="crud.toAdd"
            >
              申请
            </el-button>
            <el-button
                slot="left"
                class="filter-item"
                size="mini"
                v-if="false"
                type="success"
                icon="el-icon-setting"
                :disabled="crud.selections.length === 0"
                @click="subApprove(crud.selections)"
            >
              提交
            </el-button>

            <!--            <el-button
                            v-slot:left
                            class="filter-item"
                            size="mini"
                            v-if="false"
                            type="success"
                            icon="el-icon-setting"
                            :disabled="crud.selections.length !== 1"
                            @click="baseDevelop(crud.selections[0])"
                        >
                          开发
                        </el-button>-->
            <!--  <el-button
              slot="left"
              v-permission="permission.upLine"
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-setting"
              :disabled="crud.selections.length == 0"
              @click="upLine(crud.selections)"
            >
              上线
            </el-button>
            <el-button
              slot="left"
              v-permission="permission.startUsing"
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-setting"
              :disabled="crud.selections.length == 0"
              @click="startUsing(crud.selections)"
            >
              启用
            </el-button>-->
            <!--            <el-button
                            slot="left"
                            v-permission="permission.stopUsing1"
                            class="filter-item"
                            size="mini"
                            v-if="false"
                            type="success"
                            icon="el-icon-setting"
                            :disabled="crud.selections.length == 0"
                            @click="stopUsing(crud.selections)"
                        >
                          停用
                        </el-button>-->
            <el-button
                slot="left"
                v-permission="permission.processA"
                class="filter-item"
                type="success"
                icon="el-icon-setting"
                :disabled="crud.selections.length === 0"
                @click="processA(crud.selections)"
            >
              计算
            </el-button>
          </crudOperation>
          <el-dialog :visible.sync="processDialog" width="400px">
            <template>
              <div class="block">
                <el-date-picker
                    v-model="dateValue"
                    type="date"
                    placeholder="选择日期"
                />
                <el-button type="primary" plain @click="processB">确定</el-button>
              </div>
            </template>
          </el-dialog>
          <el-dialog
              :close-on-click-modal="false"
              :before-close="crud.cancelCU"
              :visible.sync="crud.status.cu > 0"
              :title="crud.status.title"
              top="8vh"
              width="55%"
          >
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
              <el-row :gutter="5">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <!-- <el-form-item label="指标ID" prop="id">
                     <el-input v-model="form.id" style="width: 370px;"/>
                   </el-form-item>-->
                  <el-form-item label="指标编号" prop="ieCode">
                    <el-input v-model="form.ieCode" placeholder="系统自动生成..." :disabled="true"/>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="指标名称" prop="ieName">
                    <el-input v-model="form.ieName"/>
                  </el-form-item>
                </el-col>
                <!--   <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                 <el-form-item v-if="false" label="指标分类ID(树状)">
                   <el-input v-model="form.categoryId" style="width: 370px;"/>
                 </el-form-item>
                   </el-col>-->
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="指标级别" prop="ieScope">
                    <el-select v-model="form.ieScope" filterable placeholder="请选择" @change="changeIeScope">
                      <el-option
                          v-for="item in dict.IE_SCOPE"
                          :key="item.id"
                          :label="item.label"
                          :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="管理部门" prop="manageDept">
                    <treeselect
                        v-model="form.manageDept"
                        :options="depts"
                        placeholder="选择部门"
                        :disabled="manageDeptEdited"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
                  <el-form-item label="查看部门" prop="viewDepts">
                    <treeselect
                        v-model="form.viewDepts"
                        :options="viewDept"
                        :multiple="true"
                        openDirection="below"
                        placeholder="选择部门"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="指标类型" prop="ieProp">
                    <el-select v-model="form.ieProp" filterable placeholder="请选择">
                      <el-option
                          v-for="item in dict.IE_PROP"
                          :key="item.id"
                          :label="item.label"
                          :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="取值方式">
                     <el-select v-model="form.ieMethod" filterable placeholder="请选择">
                       <el-option
                         v-for="item in dict.IE_METHOD"
                         :key="item.id"
                         :label="item.label"
                         :value="item.value"
                       />
                     </el-select>
                   </el-form-item>
                  <el-form-item label="计算频度">
                    <el-select v-model="form.calcFreq" filterable placeholder="请选择">
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
                    <el-select v-model="form.ieDataUnit" filterable placeholder="请选择">
                      <el-option
                          v-for="item in dict.IE_DATA_UNIT"
                          :key="item.id"
                          :label="item.label"
                          :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
                  <el-form-item label="指标描述" prop="ieDesc">
                    <el-input v-model="form.ieDesc" type="textarea"/>
                  </el-form-item>
                </el-col>
                <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                   <el-form-item label="指标层级(根据依赖关系确定层级，基础指标为0)">
                     <el-input v-model="form.ieLevel" style="width: 370px;"/>
                   </el-form-item>
                </el-col> -->
                <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="生效日期">
                    <el-date-picker v-model="form.startDate"/>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="失效日期">
                    <el-date-picker v-model="form.endDate"/>
                  </el-form-item>
                </el-col>-->

                <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="失效日期">
                    <el-date-picker v-model="form.endDate"/>
                  </el-form-item>
                </el-col>-->

                <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="结果保留期限">
                    <el-select v-model="form.retention" filterable placeholder="请选择">
                      <el-option
                        v-for="item in dict.RETENTION"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>-->
                <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="指标状态">
                    <el-select v-model="form.status" filterable placeholder="请选择" :disabled="true">
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
                  <!--<el-form-item label="指标类型">
                    <el-select v-model="form.ieType" filterable placeholder="请选择">
                      <el-option
                        v-for="item in dict.IE_TYPE"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>-->

                  <el-form-item label="指标业务规则">
                    <el-input v-model="form.ieRule" type="textarea"/>
                  </el-form-item>
                </el-col>

                <!--<el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
                   <el-form-item label="审核流程ID">
                         <el-input v-model="form.processInstanceId" style="width: 370px;"/>
                       </el-form-item>
                  <el-form-item label="创建人">
                     <el-input v-model="form.crtUserCode" style="width: 370px;"/>
                   </el-form-item>
                   <el-form-item label="创建机构">
                     <el-input v-model="form.crtOrgCode" style="width: 370px;"/>
                   </el-form-item>
                   <el-form-item label="创建日期">
                     <el-input v-model="form.crtDate" style="width: 370px;"/>
                   </el-form-item>
                   <el-form-item label="修改人">
                     <el-input v-model="form.updUserCode" style="width: 370px;"/>
                   </el-form-item>
                   <el-form-item label="修改机构">
                     <el-input v-model="form.updOrgCode" style="width: 370px;"/>
                   </el-form-item>
                   <el-form-item label="修改日期">
                     <el-input v-model="form.updDate" style="width: 370px;"/>
                   </el-form-item>
                </el-col>-->

                <!-- 2020/4/20 lf 基础指标新增修改表单中增加字段(取数表达式-默认sum、加工规则、数据源、原子指标、数据表名(选择原子指标后自动回显)、维度、限制规则、度量)-->
                <!--<el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
                <el-form-item label="加工规则">
                  <el-input v-if="form.indBaseRule" v-model="form.indBaseRule.calcRule" placeholder="新增保存时动态生成SQL并写入..."
                            :disabled="true" type="textarea" />
                </el-form-item>
              </el-col>-->

                <!-- 数据源先屏蔽 -->
                <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="数据源" prop="dataSource">
                  <el-select v-model="form.indBaseRule.dataSource" filterable placeholder="请选择" style="width: 250px;" @change="dataSourceChangeHandle">
                    <el-option
                      v-for="item in sourceData"
                      :key="item.datasourceName"
                      :label="item.datasourceName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>-->
                <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="原子指标" prop="indBaseRule.bizCode">
                    <el-select
                      v-if="form.indBaseRule"
                      v-model="form.indBaseRule.bizCode"
                      filterable
                      placeholder="请选择"
                      @change="atomChangeHandle"
                    >
                      <el-option
                        v-for="item in atom"
                        :key="item.bizCode"
                        :label="item.bizName"
                        :value="item.bizCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                  <el-col :xs="36" :sm="36" :md="36" :lg="18" :xl="12">
                    <el-form-item label="度量" prop="indBaseRule.measureColumn">
                      <el-select v-if="form.indBaseRule" v-model="form.indBaseRule.measureColumn" filterable
                                 placeholder="请选择">
                        <el-option
                          v-for="item in measureInfo"
                          :key="item.colCode"
                          :label="item.dimDesc"
                          :value="item.colCode"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="4">
                    <el-select v-if="form.indBaseRule" v-model="form.indBaseRule.expression" filterable
                               placeholder="请选择">
                      <el-option
                        v-for="item in dict.EXPRESSION"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                </el-col>-->

                <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="取数表达式">
                  <el-select v-if="form.indBaseRule" v-model="form.indBaseRule.expression" filterable placeholder="请选择">
                    <el-option
                      v-for="item in dict.EXPRESSION"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>-->

                <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="取数表名">
                  <el-input v-if="form.indBaseRule" v-model="form.indBaseRule.dataTable" placeholder="自动写入..." :disabled="true"/>
                </el-form-item>
              </el-col>-->

                <!--<el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
                  <el-form-item label="统计维度">
                    <el-input v-model="form.dimVals" :disabled="true">
                      <el-button slot="append" type="primary" @click="dimClickHandle">选择</el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
                  <el-form-item label="限制规则">
                    <el-input v-model="form.limitRule" :disabled="true">
                      <el-button slot="append" type="primary" @click="limitRuleClickHandle">选择</el-button>
                    </el-input>
                  </el-form-item>
                </el-col>-->
                <!--<el-col :xs="48" :sm="48" :md="24" :lg="24" :xl="16">
                  <el-form-item label="制定依据">
                    <el-input v-model="form.formulateBasis" type="textarea" />
                  </el-form-item>
                </el-col>-->
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="crud.cancelCU">取消</el-button>
              <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">提交</el-button>
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
            <el-table-column type="selection" width="55"/>
            <el-table-column v-if="columns.visible('id')" prop="id" label="指标ID"/>
            <el-table-column v-if="columns.visible('ieCode')" prop="ieCode" label="指标编号" width="120px"  />
            <el-table-column
                v-if="columns.visible('ieName')"
                prop="ieName"
                :show-tooltip-when-overflow="true"
                width="150px"
                label="指标名称"

            />
            <el-table-column v-if="columns.visible('ieScope')" prop="ieScope" label="指标级别"  >
              <template slot-scope="scope">
                {{ dict.label.IE_SCOPE[scope.row.ieScope] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('ieProp')" prop="ieProp" label="指标类型"  >
              <template slot-scope="scope">
                {{ dict.label.IE_PROP[scope.row.ieProp] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('manageDept')" prop="manageDept" label="管理部门" width="150px"
                              />
            <el-table-column
                v-if="columns.visible('ieDesc')"
                prop="ieDesc"
                :show-tooltip-when-overflow="true"
                width="120px"
                label="指标描述"

            />
            <!--<el-table-column
              v-if="columns.visible('ieRule')"
              prop="ieRule"
              label="指标业务规则"
              :show-tooltip-when-overflow="true"
              width="100px"
            />-->
            <el-table-column
                v-if="columns.visible('dimNames')"
                prop="dimNames"
                label="维度名称"
                :show-tooltip-when-overflow="true"
                width="120px"

            />
            <!--<el-table-column v-if="columns.visible('calcFreq')" prop="calcFreq" label="计算频度">
              <template slot-scope="scope">
                {{ dict.label.CALC_FREQ[scope.row.calcFreq] }}
              </template>
            </el-table-column>-->
            <el-table-column v-if="columns.visible('status')" prop="status" label="指标状态"   width="120px">
              <template slot-scope="scope">
                {{ dict.label.IE_STATUS[scope.row.status] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('ieScope')" prop="ieProp" label="指标类型"
                             width="120px">
              <template slot-scope="scope">
                {{ dict.label.IE_SCOPE[scope.row.ieScope] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('ieProp')" prop="ieProp" label="指标种类"
                             width="120px">
              <template slot-scope="scope">
                {{ dict.label.IE_PROP[scope.row.ieProp] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('ieDataUnit')" prop="ieDataUnit" label="指标单位"
                             width="120px">
              <template slot-scope="scope">
                {{ dict.label.IE_DATA_UNIT[scope.row.ieDataUnit] }}
              </template>
            </el-table-column>
            <!--<el-table-column prop="startDate" :formatter="dateColumnFormat" label="生效日期" width="90px"/>
            <el-table-column
              v-if="columns.visible('endDate')"
              prop="endDate"
              :formatter="dateColumnFormat"
              label="失效日期"
              width="90px"
            />-->
            <!--<el-table-column v-if="columns.visible('retention')" prop="retention" label="结果保留期限" width="100px">
              <template slot-scope="scope">
                {{ dict.label.RETENTION[scope.row.retention] }}
              </template>
            </el-table-column>-->
            <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" width="120px"
                              />
            <el-table-column
                v-if="columns.visible('crtDate')"
                :formatter="timeColumnFormat"
                prop="crtDate"
                label="申请日期"
                width="150px"

            />
            <!-- <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人"  width="90"/>

            <el-table-column
                v-if="columns.visible('updDate')"
                :formatter="timeColumnFormat"
                prop="onlineDate"
                label="上线日期"
                width="150px"

            />
                  <el-table-column
                            v-if="columns.visible('updDate')"
                            :formatter="timeColumnFormat"
                            prop="enableDate"
                            label="启用日期"
                            width="150px"

                        />-->
            <el-table-column
                v-permission="['admin','baseIndIndicatorInfo:details','baseIndIndicatorInfo:stopUsing']"
                label="操作"
                width="180px"

                fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                    v-permission="permission.details"
                    class="el-icon&#45;&#45;left"
                    style="display:inline-block;"
                    type="text"
                    @click="details(scope.row,'detail')"
                >
                  详情
                </el-button>
                <el-button
                    slot="left"
                    v-permission="permission.develop"
                    :disabled="scope.row.status != '2'"
                    class="el-icon&#45;&#45;left"
                    style="display:inline-block;"
                    type="text"
                    @click="baseDevelop(scope.row)"
                >
                  开发
                </el-button>
                <el-button
                    slot="left"
                    prop="manageDept"
                    :disabled=" scope.row.manageDept != user.deptId || scope.row.status != '5'"
                    v-permission="permission.stopUsing"
                    class="el-icon&#45;&#45;left"
                    type="text"
                    style="display:inline-block;"
                    @click="stopUsing2(scope.row)"
                >
                  停用
                </el-button>
                <!--:disabled=" scope.row.manageDept != user.deptId"-->
                <!--已启用 -->
                <!--  <el-button
                 slot="left"
                 :disabled="scope.row.crtUserCode != user.username || scope.row.status != '5'"
                 v-permission="permission.edit"
                 class="el-icon&#45;&#45;left"
                 style="display:inline-block;"
                 @click="details(scope.row, 'start')"
                 type="text"
             >
               修改
             </el-button>
                        <el-button
                                 slot="left"
                                 class="el-icon&#45;&#45;left"
                                 style="display:inline-block;"
                                 @click="detailsHis(scope.row, 'his')"
                                 type="text"
                             >
                               记录
                             </el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination/>
          <dimensionPage ref="dimensionPage" @func="getDimensionPage"/>
          <limitRulePage ref="limitRulePage" @func="getLimitPage"/>
          <lookDetails ref="lookDetails"/>
          <toStartDetails ref="toStartDetails"/>
          <ieCodeHistory ref="ieCodeHistory" :ieCode="ieCodeHis"/>
          <baseDevelop ref="baseDevelop" @func="refQuery"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudIndIndicatorInfo, {
  add,
  checkDept,
  getAllSource,
  getAtom,
  getAtomDimenston,
  updateStatus,
  getBaseIndicatorByIeCode,
  getAllAtomInfos,
  process,
  getIndBaseRule
} from '../../../../api/indicators/indIndicatorInfo'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/ICRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import category from '../../category/category'
import dimensionPage from './dimensionPage'
import limitRulePage from './limitRulePage'
import lookDetails from '../details/lookBaseDetails'
import baseDevelop from './baseDevelop'
import {getDepts} from '@system/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
//import checkPermission from '@eladmin/utils/permission'
import toStartDetails from '../details/toStartBaseDetails'
import ieCodeHistory from '../details/ieCodeHistory'
import {mapGetters} from 'vuex'
// crud交由presenter持有
const defaultCrud = CRUD({
  title: '指标信息',
  url: crudIndIndicatorInfo.url,
  sort: 'id,desc',
  optShow: {del: false},
  crudMethod: {...crudIndIndicatorInfo.method}
})
const defaultForm = {
  id: null,
  ieCode: null,
  ieName: null,
  categoryId: null,
  ieProp: null,
  ieType: '1',
  ieDesc: null,
  ieRule: null,
  dimNames: null,
  ieDefaultValue: null,
  ieMethod: null,
  calcFreq: null,
  status: '0',
  ieDataUnit: '',
  formulateBasis: '',
  startDate: new Date(),
  endDate: null,
  retention: '1,Y',
  processInstanceId: null,
  manageDept: null,
  crtUserCode: null,
  crtOrgCode: null,
  crtDate: null,
  updUserCode: null,
  updOrgCode: null,
  updDate: null,
  viewDepts: [],
  viewDept: null,
  indBaseRule: {
    calcRule: null, // 加工规则
    dataSource: null, // 数据源
    expression: 'sum', // 取数表达式
    dataTable: null, // 取数表名-即原子指标中的存储表名
    measureColumn: null, // 度量
    bizCode: null // 原子指标
  },

  indDimRelations: [], // 指标维度关系
  indBaseRuleFilters: [], // 指标附加规则

  dimVals: null, // 维度选择页面传来的显示维度
  limitRule: null // 限制规则

}
export default {
  name: 'BaseIndicatorInfo',
  components: {
    pagination,
    crudOperation,
    rrOperation,
    udOperation,
    category,
    dimensionPage,
    limitRulePage,
    lookDetails,
    baseDevelop,
    Treeselect,
    toStartDetails,
    ieCodeHistory
  },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['IE_PROP', 'IE_SCOPE', 'IE_TYPE', 'IE_METHOD', 'CALC_FREQ', 'IE_STATUS', 'IE_DATA_UNIT', 'RETENTION', 'EXPRESSION'],
  data() {
    return {
      manageDeptEdited: false,
      table: {
        columns: {
          id: 'hidden',
          crtOrgCode: 'hidden',
          updOrgCode: 'hidden',
          calcFreq: 'hidden',
          retention: 'hidden'
        }
      },
      permission: {
        add: ['admin', 'baseIndIndicatorInfo:add'],
        submit: ['admin', 'baseIndIndicatorInfo:submit'],
        develop: ['admin', 'baseIndIndicatorInfo:develop'],
        upLine: ['admin', 'baseIndIndicatorInfo:upLine'],
        startUsing: ['admin', 'baseIndIndicatorInfo:startUsing'],
        stopUsing: ['admin', 'baseIndIndicatorInfo:stopUsing'],
        processA: ['admin', 'baseIndIndicatorInfo:processA'],
        edit: ['admin', 'baseIndIndicatorInfo:edit'],
        del: ['admin', 'baseIndIndicatorInfo:del'],
        details: ['admin', 'baseIndIndicatorInfo:details'],
        stopUsing1: []
      },
      rules: {
        ieName: [
          {required: true, message: '指标名称不能为空', trigger: 'blur'}
        ],
        ieProp: [
          {required: true, message: '指标类别不能为空', trigger: 'change'}
        ],
        viewDepts: [
          {required: true, message: '查看部门不能为空', trigger: 'change'}
        ],
        manageDept: [
          {required: true, message: '管理部门不能为空', trigger: 'change'}
        ],
        formulateBasis: [
          {required: true, message: '指标类型不能为空', trigger: 'change'}
        ],
        ieDataUnit: [
          {required: true, message: '指标单位不能为空', trigger: 'change'}
        ],
        ieDesc: [
          {required: true, message: '指标描述不能为空', trigger: 'change'}
        ],
        'indBaseRule.bizCode': [{required: true, message: '原子指标不能为空', trigger: 'blur'}],
        'indBaseRule.measureColumn': [{required: true, message: '原子指标不能为空', trigger: 'blur'}]
      },
      sourceData: [], // 数据源信息
      atom: [], // 原子指标
      measureInfo: [], // 度量信息
      dimInfo: [], // 原子指标维度信息
      processDialog: false, // 计算输日期的页面
      processParam: { // 传给后台的参数
        codes: [],
        periodDate: ''
      },
      dateValue: '', // 计算日期

      depts: [], // 部门数组
      viewDept: [], // 查看部门数组
      tea: '',
      ieCodeHis: null
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.$nextTick(() => {
    })
  },
  mounted() {
    this.crud.resetQuery()
    getDepts({enabled: true, pid: '0'}).then(res => {
      let dep = [];
      res.content.forEach(function (item) {
        /*if (item.id != '89999053' && item.id != '89999024' && item.id != '00000203'
            && item.id != '89999052' && item.id != '00000201' && item.id != '89999001'
            && item.id != '89999048' && item.id != '89999020' && item.id != '89999015' && item.id != '89999047') {*/
        dep.push(item)
        //}
      });
      this.depts = dep
      // console.log(this.depts)
    })
  },
  methods: {
    //checkPermission,
    // 选择指标级别后关联管理部门
    changeIeScope(data) {
      if (data == 1) {
        this.manageDeptEdited = true
        /* getInfo().then(res => {
           this.form.manageDept = res.deptId
         })*/
        this.form.manageDept = this.user.deptId
        console.log('------------>>>>>---->>>', this.user.deptId)
      } else {
        this.form.manageDept = null
        this.manageDeptEdited = false
      }
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      this.query.ieType = '1'
      this.query.queryType = '1'
      return true
    },
    handleCategoryClick(data) {
      this.crud.form.categoryId = data.id
      // console.log(data)
      this.crud.query.categoryIds = data.childrenIds // data.childrenIds
      this.form.categoryId = data.id
      this.crud.refresh()
    },
    // 新增之前
    [CRUD.HOOK.beforeToAdd]() {
      console.log('类别', this.form.categoryId)
      if (!this.form.categoryId) {
        this.crud.notify('请选择类别', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      if (this.form.categoryId === '0') {
        this.crud.notify('根节点不能添加', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      // 获取数据源
      /* getAllSource().then(data => {
        this.sourceData = data.data
      })*/
      // 获取原子指标-初始化新增菜单时默认查询当前连接(暂定数据源='')的原子指标信息
      /* const param = {
        sourceDataSource: ''
      }
      getAtom(param).then(data => {
        this.atom = data.data
      })*/
      getAllAtomInfos().then(data => {
        this.atom = data.data
      })
      // 获取部门信息
      this.getDepts()
    },
    /*[CRUD.HOOK.afterSubmit](data1,data2) {
      console.log(data2.data)
      let temp = 0
      const param = []
      const data = []
      data.push(data2.data)
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择0-未审批
        if (data[i].status != 0) {
          temp = -1
          break
        }
        const indIndicatorInfo = {
          'id': data[i].id,
          'status': '1',
          'ieProp': data[i].ieProp
        }
        param.push(indIndicatorInfo)
      }
      if (temp == -1) {
        this.crud.notify('请选择已创建的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }

      this.$confirm(`确定要提交所选数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(param).then(returnData => {
          if (returnData.code === 0) {
            this.crud.notify('操作成功!', CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.crud.toQuery()
          } else {
            this.crud.notify('操作失败!错误原因:' + returnData.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            this.crud.toQuery()
          }
        })
      })
    },*/
    // 删除之前
    [CRUD.HOOK.beforeDelete]() {
      for (let items of this.crud.selections) {
        if (items.status != 0) {
          this.crud.notify('该状态的指标不允许删除', CRUD.NOTIFICATION_TYPE.ERROR)
          return false
        }
      }
      getAllAtomInfos().then(data => {
        this.atom = data.data
      })
      // 获取部门信息
      this.getDepts()

    },
    // 数据源发生变化时查询对应的原子指标
    /* dataSourceChangeHandle(val) {
      //获取原子指标-初始化新增菜单时默认查询当前连接(暂定数据源='')的原子指标信息
      const param = {
        sourceDataSource: val
      }
      getAtom(param).then(data => {
        this.atom = data.data
      })
    },*/
    // 原子指标修改后触发事件
    atomChangeHandle(val) {
      this.atom.some((item) => {
        if (item.bizCode == val) {
          // 1.自动注入取数表名
          this.form.indBaseRule.dataTable = item.bizTabCode
          // 2.根据原子指标编号查询原子指标维度信息表;生成维度信息
          const dimParam = {
            bizCode: item.bizCode,
            dimType: 'D'
          }
          getAtomDimenston(dimParam).then(data => {
            this.dimInfo = data.data
          })
          // 3.根据原子指标编号查询原子指标维度信息表;生成度量信息
          const meaParam = {
            bizCode: item.bizCode,
            dimType: 'M'
          }
          getAtomDimenston(meaParam).then(data => {
            this.measureInfo = data.data
          })
          // 清空
          this.form.indBaseRule.measureColumn = null
          this.form.dimVals = null
          this.form.limitRule = null
        }
      })
    },
    // 统计维度点击选择时触发
    dimClickHandle() {
      // 将维度信息传递过去并将结果返回
      const _this = this.$refs.dimensionPage
      _this.title = '统计维度'
      _this.dimInfo = this.dimInfo
      _this.indDimRelations = this.form.indDimRelations// 默认选中的值
      _this.selectRow()// 做默认选中的处理
      _this.dimensionDialog = true
    },
    // 接收统计维度子组件传来的信息
    getDimensionPage(data1, data2) {
      this.form.dimVals = data1
      this.form.indDimRelations = data2
    },
    // 限制规则点击选择时触发
    limitRuleClickHandle() {
      // 将维度信息传递过去选择后将结果返回
      const _this = this.$refs.limitRulePage
      _this.title = '限制规则'
      _this.dimInfo = this.dimInfo
      _this.tableData = []
      _this.tableName = this.form.indBaseRule.dataTable// 表名,查询值列表的参数
      _this.indBaseRuleFilters = this.form.indBaseRuleFilters// 默认选中的值
      _this.selectRow()// 做默认选中的处理
      _this.limitRuleDialog = true
    },
    // 接收限制规则子组件传来的信息
    getLimitPage(data1, data2) {
      this.form.limitRule = data1
      this.form.indBaseRuleFilters = data2
    },

    // 修改之前触发的事件
    [CRUD.HOOK.beforeToEdit]() {
      if (this.form.status != 0 && this.form.status != 2) {
        this.crud.notify('只有未提交或退回的数据才能修改能修改', CRUD.NOTIFICATION_TYPE.ERROR)
        this.crud.resetForm()
        return false
      }
      // 获取部门信息
      this.getDepts()
      // 通过指标编号查询基础指标规则+维度+附加规则
      /* const param = {
        'ieCode': this.form.ieCode
      }
      getBaseIndicatorByIeCode(this.form.ieCode).then(returnData => {
        if (returnData.code === 0) {
          this.form.indBaseRule = returnData.data.indBaseRule
          this.form.indDimRelations = returnData.data.indDimRelations
          this.form.indBaseRuleFilters = returnData.data.indBaseRuleFilters
          this.form.dimVals = returnData.data.dimVals
          this.form.limitRule = returnData.data.limitRule
          // 获取原子指标-初始化新增菜单时默认查询当前连接(暂定数据源='')的原子指标信息
          /!* const param1 = {
            sourceDataSource: ''
          }
          getAtom(param1).then(data => {
            this.atom = data.data
          })*!/
          // 获取原子指标
          getAllAtomInfos().then(data => {
            this.atom = data.data
          })
          // 根据原子指标编号查询原子指标维度信息表;生成维度信息
          const dimParam = {
            bizCode: this.form.indBaseRule.bizCode,
            dimType: 'D'
          }
          getAtomDimenston(dimParam).then(data => {
            this.dimInfo = data.data
          })
          // 根据原子指标编号查询原子指标维度信息表;生成度量信息
          const meaParam = {
            bizCode: this.form.indBaseRule.bizCode,
            dimType: 'M'
          }
          getAtomDimenston(meaParam).then(data => {
            this.measureInfo = data.data
          })
        }
      })*/
    },

    /* 点击提交审批触发事件 */
    subApprove(data) {
      let temp = 0
      const param = []
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择0-未审批
        if (data[i].status != 0) {
          temp = -1
          break
        }
        const indIndicatorInfo = {
          'id': data[i].id,
          'status': '1',
          'ieProp': data[i].ieProp
        }
        param.push(indIndicatorInfo)
      }
      if (temp == -1) {
        this.crud.notify('请选择已创建的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }

      this.$confirm(`确定要提交所选数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.notify('操作成功!', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.crud.toQuery()
        /*updateStatus(param).then(returnData => {
          if (returnData.code === 0) {
            this.crud.notify('操作成功!', CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.crud.toQuery()
          } else {
            this.crud.notify('操作失败!错误原因:' + returnData.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            this.crud.toQuery()
          }
        })*/
      })
    },
    /** 基础指标开发按钮 */
    baseDevelop(data) {
      // 状态校验-只能选择0-未审批或3-已退回的数据
      if (data.status != 2) {
        this.crud.notify('请选择已审批的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      const _this = this.$refs.baseDevelop
      _this.title = '基础指标开发[' + data.ieCode + ']'
      _this.form.ieCode = data.ieCode

      // 通过指标编号查询基础指标规则+维度+附加规则
      const param = {
        'ieCode': data.ieCode
      }
      getBaseIndicatorByIeCode(data.ieCode).then(returnData => {
        if (returnData.code === 0) {
          _this.form.indBaseRule = returnData.data.indBaseRule
          _this.form.indDimRelations = returnData.data.indDimRelations
          _this.form.indBaseRuleFilters = returnData.data.indBaseRuleFilters
          _this.form.dimVals = returnData.data.dimVals
          _this.form.limitRule = returnData.data.limitRule
          // 根据原子指标编号查询原子指标维度信息表;生成维度信息
          const dimParam = {
            bizCode: _this.form.indBaseRule.bizCode,
            dimType: 'D'
          }
          getAtomDimenston(dimParam).then(data => {
            _this.dimInfo = data.data
          })
          // 根据原子指标编号查询原子指标维度信息表;生成度量信息
          const meaParam = {
            bizCode: _this.form.indBaseRule.bizCode,
            dimType: 'M'
          }
          getAtomDimenston(meaParam).then(data => {
            _this.measureInfo = data.data
          })
        } else {
          _this.form.indBaseRule = {
            calcRule: null, // 加工规则
            dataSource: null, // 数据源
            expression: 'sum', // 取数表达式
            dataTable: null, // 取数表名-即原子指标中的存储表名
            measureColumn: null, // 度量
            bizCode: null // 原子指标
          }
          _this.form.indDimRelations = []
          _this.form.indBaseRuleFilters = []
          _this.form.dimVals = null
          _this.form.limitRule = null
          _this.dimInfo = []
          _this.measureInfo = []
        }
      })
      // 获取原子指标-初始化新增菜单时默认查询当前连接(暂定数据源='')的原子指标信息
      /* const param1 = {
        sourceDataSource: ''
      }
      getAtom(param1).then(data => {
        this.atom = data.data
      })*/
      // 获取原子指标
      getAllAtomInfos().then(data => {
        _this.atom = data.data
      })
      _this.baseDevelopDialog = true
    },
    // 子组件调用刷新方法
    refQuery(data) {
      this.crud.toQuery()
    },
    /* 点击上线按钮触发事件 */
    upLine(data) {
      let temp = 0
      const param = []
      const ieCodes = []
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择0-已审批
        if (data[i].status != 2) {
          temp = -1
          break
        }
        const indIndicatorInfo = {
          'id': data[i].id,
          'status': '4'
        }
        param.push(indIndicatorInfo)
        ieCodes.push(data[i].ieCode)
      }
      if (temp == -1) {
        this.crud.notify('请选择已审批的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      // 开发校验通过后执行审批
      getIndBaseRule(ieCodes).then(returnData => {
        if (returnData.code !== 0) {
          this.crud.notify(returnData.msg + '指标未进行开发', CRUD.NOTIFICATION_TYPE.ERROR)
        } else {
          this.$confirm(`确定上线所选数据吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 开发校验通过后,修改状态
            updateStatus(param).then(returnData => {
              if (returnData.code === 0) {
                this.crud.notify('操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
                this.crud.toQuery()
              } else {
                this.crud.notify('操作失败!错误原因:' + returnData.msg, CRUD.NOTIFICATION_TYPE.ERROR)
                this.crud.toQuery()
              }
            })
          })
        }
      })
    },
    // 启用按钮
    startUsing(data) {
      let temp = 0
      const param = []
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择4-已上线，不能啟用6-停用的数据
        if (data[i].status != 4) {
          temp = -1
          break
        }
        const indIndicatorInfo = {
          'id': data[i].id,
          'status': '5'
        }
        param.push(indIndicatorInfo)
      }
      if (temp == -1) {
        this.crud.notify('请选择已上线的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      this.$confirm(`确定启用所选数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(param).then(returnData => {
          if (returnData.code === 0) {
            this.crud.notify('操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.crud.toQuery()
          } else {
            this.crud.notify('操作失败!错误原因:' + returnData.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            this.crud.toQuery()
          }
        })
      })
    },
    stopUsing2(data) {
      let temp = 0
      const param = []
      checkDept(data.manageDept).then(res => {
        this.tea = res.code
        if (res.code !== 0) {
          this.crud.notify('请选择自己管理部门的指标', CRUD.NOTIFICATION_TYPE.ERROR)
          return false
        } else {
          if (data.status != 5) {
            temp = -1
          }
          const indIndicatorInfo = {
            'id': data.id,
            'ieCode': data.ieCode,
            'ieName': data.ieName,
            'status': '6'
          }
          param.push(indIndicatorInfo)
          if (temp == -1) {
            this.crud.notify('请选择启用的数据', CRUD.NOTIFICATION_TYPE.ERROR)
            return false
          }
          this.$confirm(`确定停用所选数据吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateStatus(param).then(returnData => {
              if (returnData.code === 0) {
                this.crud.notify('操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
                this.crud.toQuery()
              } else {
                this.crud.notify('操作失败!错误原因:' + returnData.msg, CRUD.NOTIFICATION_TYPE.ERROR)
                this.crud.toQuery()
              }
            })
          })
        }
      })
    },
    // 停用按钮
    stopUsing(data) {
      let temp = 0

      const param = []
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择4-启用数据
        if (data[i].status != 5) {
          temp = -1
          break
        }
        const indIndicatorInfo = {
          'id': data[i].id,
          'status': '6'
        }
        param.push(indIndicatorInfo)
      }
      if (temp == -1) {
        this.crud.notify('请选择启用的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      this.$confirm(`确定停用所选数据吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(param).then(returnData => {
          if (returnData.code === 0) {
            this.crud.notify('操作成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.crud.toQuery()
          } else {
            this.crud.notify('操作失败!错误原因:' + returnData.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            this.crud.toQuery()
          }
        })
      })
    },
    // 详情按钮
    detailsHis(row, detailFlag) {
      let _this = this.$refs.ieCodeHistory
      _this.openFlag = true
      _this.ieCodePara = row.ieCode
      this.ieCodeHis = row.ieCode
      this.$nextTick(() => {
        this.$refs.ieCodeHistory.refresh()
      })

    },
    // 详情按钮
    details(row, detailFlag) {
      let _this = null
      if (detailFlag == 'detail') {
        _this = this.$refs.lookDetails
      } else if (detailFlag == 'start') {
        _this = this.$refs.toStartDetails
      }
      // 打开详情页面时查询相关信息
      // 通过指标编号查询基础指标规则+维度+附加规则
      const param = {
        'ieCode': row.ieCode
      }
      getBaseIndicatorByIeCode(row.ieCode).then(returnData => {
        if (returnData.code === 0) {
          row.indBaseRule = returnData.data.indBaseRule
          row.indDimRelations = returnData.data.indDimRelations
          row.indBaseRuleFilters = returnData.data.indBaseRuleFilters
          row.dimVals = returnData.data.dimVals
          row.limitRule = returnData.data.limitRule
          // 获取原子指标-初始化新增菜单时默认查询当前连接(暂定数据源='')的原子指标信息
          /* const param1 = {
            sourceDataSource: ''
          }
          getAtom(param1).then(data => {
            _this.atom = data.data
          })*/
          // 获取原子指标
          getAllAtomInfos().then(data => {
            _this.atom = data.data
          })
          // 根据原子指标编号查询原子指标维度信息表;生成维度信息
          const dimParam = {
            bizCode: row.indBaseRule.bizCode,
            dimType: 'D'
          }
          getAtomDimenston(dimParam).then(data => {
            _this.dimInfo = data.data
          })
          // 根据原子指标编号查询原子指标维度信息表;生成度量信息
          const meaParam = {
            bizCode: row.indBaseRule.bizCode,
            dimType: 'M'
          }
          getAtomDimenston(meaParam).then(data => {
            _this.measureInfo = data.data
          })
        } else {
          row.indBaseRule = {}
          row.indDimRelations = null
          row.indBaseRuleFilters = null
          row.dimVals = null
          row.limitRule = null
        }
      })
      getDepts({enabled: true}).then(res => {
        _this.depts = res.content
        _this.viewDept = [{
          id: 0,
          label: '总行机关',
          children: res.content,
        }]
      })
      _this.title = '详情'
      _this.form = row
      _this.detailsDialog = true
    },

    /** 点击计算按钮触发 */
    processA(data) {
      // 只能选择已审批的数据
      let temp = 0
      for (let i = 0; i < data.length; i++) {
        // 状态校验-只能选择5-启用
        if (data[i].status != 5) {
          temp = -1
          break
        }
      }
      if (temp == -1) {
        this.crud.notify('请选择已启用的数据', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }

      const codes = []
      for (let i = 0; i < data.length; i++) {
        codes.push(data[i].ieCode)
      }
      this.processParam.codes = codes
      this.processDialog = true
    },
    processB() {
      if (this.dateValue == '') {
        this.crud.notify('日期不能为空', CRUD.NOTIFICATION_TYPE.ERROR)
      } else {
        const dateValue = this.dateFormat(this.dateValue, 'YYYYMMDD')
        this.processParam.periodDate = dateValue
        process(this.processParam, 'base').then(data => {
          if (data.code == 0) {
            this.crud.notify(data.msg, CRUD.NOTIFICATION_TYPE.SUCCESS)
          } else {
            this.crud.notify(data.msg, CRUD.NOTIFICATION_TYPE.ERROR)
          }
          this.processDialog = false
        })
      }
    },
    // 获取弹窗内部门数据
    getDepts() {
      getDepts({enabled: true, pid: '1', deptCategory: '0'}).then(res => {
        let dep = [];
        /* res.content.forEach(function (item) {
           if (item.id != '89999053' && item.id != '89999024' && item.id != '00000203'
               && item.id != '89999052' && item.id != '00000201' && item.id != '89999001'
               && item.id != '89999048' && item.id != '89999020' && item.id != '89999015' && item.id != '89999047') {
             dep.push(item)
           }
         });
         this.depts = dep*/
        // console.log( this.depts)
        this.depts = res.content
        this.viewDept = [{
          id: 0,
          label: '总行机关',
          children: res.content,
        }]
      })
    }
  }
}
</script>

<style scoped>
.app-container .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
  padding-left: 20px;
}
.app-container .el-table th>.cell {
  padding-left: 20px;
}
</style>
