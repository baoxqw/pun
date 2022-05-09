<template>
  <div class="indicator">

    <el-row style="margin-bottom: 15px">
      <el-col>
        <div>
          <!-- 搜索 -->
          <el-input
              v-model="query.bizName"
              clearable
              size="mini"
              placeholder="指标名称"
              style="width: 150px;"
              @input="forceUpdate"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
          />
          <el-select class="filter-item" v-model="query.indFirstType" filterable clearable placeholder="指标一级分类" style="width: 150px;"
                     @keyup.enter.native="crud.toQuery" @change="initIndSecondType(query.indFirstType,'query')">
            <el-option
                v-for="item in qryIndFirstType"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-select class="filter-item" v-model="query.indSecondType" filterable clearable placeholder="指标二级分类" style="width: 150px;"
                     @keyup.enter.native="crud.toQuery">
            <el-option
                v-for="item in qryIndSecondType"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-select class="filter-item" v-model="query.ieProp" filterable clearable placeholder="指标类型" style="width: 150px;"
                     @keyup.enter.native="crud.toQuery">
            <el-option
                v-for="item in dict.IE_PROP"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <!--            <el-select class="filter-item" v-model="query.businessDept" filterable clearable placeholder="业务属主部门" style="width: 180px;"
                                 @keyup.enter.native="crud.toQuery">
                        <el-option
                            v-for="item in dict.BUSSINESS_DEPT"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>-->
          <el-select class="filter-item" v-model="query.indVerifyStatus" filterable clearable placeholder="指标审批状态" style="width: 150px;"
                     @keyup.enter.native="crud.toQuery">
            <el-option
                v-for="item in dict.IND_VERIFY_STATUS"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-select class="filter-item" v-model="query.indLevel" filterable clearable placeholder="指标层级" style="width: 150px;"
                     @keyup.enter.native="crud.toQuery">
            <el-option
                v-for="item in dict.IND_LEVEL"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-select class="filter-item" v-model="query.indDeployStatus" filterable clearable placeholder="指标发布状态" style="width: 150px;"
                     @keyup.enter.native="crud.toQuery">
            <el-option
                v-for="item in dict.IND_DEPLOY_STATUS"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-select class="filter-item" v-model="query.indMonField" filterable clearable placeholder="标准来源" style="width: 150px;"
                     @keyup.enter.native="crud.toQuery">
            <el-option
                v-for="item in dict.IND_MON_FIELD"
                :key="item.id"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <treeselect v-model="query.businessDept" :options="depts" style="width: 150px;display: inline-block;top: 9px" placeholder="业务属主部门" class="filter-item"/>
          <el-button style="width: 75px" class="filter-item" type="success" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
          <el-button style="width: 75px" class="filter-item" type="success" icon="el-icon-refresh-left" @click="resetQuery">重置</el-button>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <crudOperation style="display: inline-block;margin-left: 10px" :permission="permission">
            <!--            <el-button slot="right" v-permission="permission.processA" class="filter-item" size="mini" type="success"-->
            <!--                       icon="el-icon-setting" :disabled="crud.selections.length == 0"-->
            <!--                       @click="processA(crud.selections)"-->
            <!--            >计算-->
            <!--            </el-button>-->
            <!--            <el-button slot="right" class="filter-item" size="mini" type="success"-->
            <!--                       :disabled="crud.selections.length == 0"-->
            <!--                       @click="modifyInd(crud.selections)"-->
            <!--            >修改-->
            <!--            </el-button>-->
            <el-button style="width: 75px" slot="right"
                        v-permission="permission.edit"
                        class="filter-item"
                        type="success"
                        icon="el-icon-edit"
                        :disabled="crud.selections.length !== 1 || crud.selections[0].indVerifyStatus == '2'|| crud.selections[0].indDeployStatus == '3'"
                        v-show="this.categoryType == 0 || this.categoryType == null"
                        @click="openEdit(crud.selections[0])"
            >
              修改
            </el-button>
            <el-button style="width: 75px" slot="right" v-permission="permission.cancelInd" class="filter-item" size="mini" type="success"
                       :disabled="crud.selections.length == 0"
                       v-show="this.categoryType == 0 || this.categoryType == null"
                       @click="cancelInd(crud.selections)"
            >废止
            </el-button>
            <el-button style="width: 75px" slot="right" v-permission="permission.processVerify" class="filter-item" size="mini" type="success"
                       :disabled="crud.selections.length == 0"
                       v-show="this.categoryType == 0 || this.categoryType == null"
                       @click="processVerify(crud.selections)"
            >发起审批
            </el-button>
            <el-button style="width: 75px" slot="right" class="filter-item" size="mini" type="success"
                       v-show="this.categoryType == 1"
                       @click="toAddAtomToMyClass"
            >添加指标
            </el-button>
            <el-button style="width: 75px" slot="right"
                       :loading="crud.downloadLoading"
                       :disabled="!crud.data.length"
                       class="filter-item"
                       type="success"
                       icon="el-icon-download"
                       @click="crud.doExport('download','指标数据')"
            >导出</el-button>
          </crudOperation>
          <!--            <rrOperation :crud="crud"/>-->
        </div>

      </el-col>
    </el-row>

    <el-row :gutter="15">
      <!--侧边分类数据-->
      <el-col  :span="categorySpan">
        <category @node-click="handleCategoryClick" @reloadIndFirstType="initIndFirstType" canOpr="true"/>
      </el-col>
      <!--用户数据-->
      <el-col  :span="tableSpan">
        <!--工具栏-->
        <div style="position: relative" class="head-container">
          <div style="position: absolute;top: 200px;left: -16px">
            <i @click="handleZoom" style="cursor: pointer" :class="'el-icon-d-arrow-' + zoomDirection"></i>
          </div>
<!--          <crudOperation  :permission="permission" v-show="this.query.categoryType ==1">
          <el-button slot="right" class="filter-item" size="mini" type="success"
                     @click="toAddAtomToMyClass"
          >添加指标
          </el-button>
          </crudOperation>-->
          <!--计算进入选择日期页面-->
          <el-dialog :visible.sync="processDialog" width="400px">
            <template>
              <div class="block">
                <el-date-picker v-model="dateValue" type="date" placeholder="选择日期"/>
                <el-button type="primary" plain @click="processB">确定</el-button>
              </div>
            </template>
          </el-dialog>
          <!--表单组件-->
          <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                     :title="crud.status.title" width="65%" v-show="formDialog"
          >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px" @submit.native.prevent>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="display: none">
                  <el-form-item label="指标编号" prop="bizCode" label-width="110px">
                    <el-input v-model="form.bizCode" placeholder="系统自动生成..." :disabled="true" style="width: 40%;"/>
                  </el-form-item>
                </el-col>
                <el-divider content-position="center">基础信息</el-divider>
                <el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标类型" prop="ieProp" label-width="110px">
                      <el-select v-model="form.ieProp" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2" @change="changeIeProp">
                        <el-option
                            v-for="item in dict.IE_PROP"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3">
                    <el-form-item label="根指标名称" prop="genBizName" label-width="110px">
                      <el-select v-model="form.genBizName" filterable clearable placeholder="请选择" style="width: 95%;" @change="genBizNameChange()" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in genIndArr"
                            :key="item.id"
                            :label="item.bizName"
                            :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标名称" prop="bizName" label-width="110px">
                      <el-input v-model="form.bizName" style="width: 95%;" :disabled="crud.status.flag == 2"  @blur="validateBizNameContract"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标一级分类" prop="indFirstType" label-width="110px">
                      <el-select v-model="form.indFirstType" filterable clearable placeholder="请选择" style="width: 95%;"
                      @change="initIndSecondType(form.indFirstType,'form')" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in formIndFirstType"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标二级分类" prop="indSecondType" label-width="110px">
                      <el-select v-model="form.indSecondType" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2"
                      >
                        <el-option
                            v-for="item in formIndSecondType"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"  v-if="crud.status.flag == 2">
                    <el-form-item label="指标发布状态" prop="indDeployStatus" label-width="110px">
                      <el-select v-model="form.indDeployStatus" filterable clearable placeholder="请选择" style="width: 95%;"
                                 :disabled="true">
                        <el-option
                            v-for="item in dict.IND_DEPLOY_STATUS"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"  v-if="crud.status.flag == 2">
                    <el-form-item label="指标审批状态" prop="indVerifyStatus" label-width="110px">
                      <el-select v-model="form.indVerifyStatus" filterable clearable placeholder="请选择" style="width: 95%;"
                                 :disabled="true">
                        <el-option
                            v-for="item in dict.IND_VERIFY_STATUS"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3">
                    <el-form-item label="" prop="dimension" label-width="110px">
                      <el-input style="visibility: hidden"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject1.isShow">
                    <div class="el-form-item el-form-item--small">
                      <label for="dimension" class="el-form-item__label" style="width: 110px;"><span style="color: red">* </span>维度1</label>
                      <el-select v-model="dimAndValueObject1.dimension" filterable clearable placeholder="请选择"
                                 style="width: 74%;" :disabled="crud.status.flag == 2" @change="(val)=>initDimVal(val,1)">
                        <el-option
                            v-for="item in dimInfoArr"
                            :key="item.id"
                            :label="item.categoryName"
                            :value="item.id"
                        />
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDim1">维度1不能为空</div>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject1.isShow">
                    <div class="el-form-item el-form-item--small">
                      <label for="dimension" class="el-form-item__label" style="width: 110px;"><span style="color: red">* </span>维度值1</label>
                      <el-select style="width: 65%" filterable clearable placeholder="请选择"
                                 v-model="dimAndValueObject1.dimensionName" :disabled="crud.status.flag == 2"
                                 @change="changeDimVal1"
                      >
                        <el-option style="height: auto;" :disabled="true" value="1">
                          <el-tree
                              :data="dimValueArr1"
                              show-checkbox
                              node-key="name"
                              ref="dimensionValue1Tree"
                              highlight-current
                              :props="defaultProps"
                              :check-strictly="true"
                              @check-change="handleDimValueClick1"
                          >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
<!--                      <DimValTreeSelect v-model="dimAndValueObject1.dimensionName" :options="dimValueArr1"  style="width: 95%" size="small"  placeholder="选择机构" class="filter-item"  :disabled="crud.status.flag == 2"/>-->
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDimV1">维度值1不能为空</div>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject2.isShow">
                    <el-form-item label="维度2" prop="dimension" label-width="110px">
                      <el-select v-model="dimAndValueObject2.dimension" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2" @change="(val)=>initDimVal(val,2)">
                        <el-option
                            v-for="item in dimInfoArr"
                            :key="item.id"
                            :label="item.categoryName"
                            :value="item.id"
                        />
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDim2">维度2不能为空</div>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject2.isShow">
                    <el-form-item label="维度值2" prop="dimensionValue" label-width="110px">
                      <el-select style="width: 85%" filterable clearable placeholder="请选择"
                                 v-model="dimAndValueObject2.dimensionName" :disabled="crud.status.flag == 2"
                                 @change="changeDimVal2"
                      >
                        <el-option style="height: auto;" :disabled="true" value="1">
                          <el-tree
                              :data="dimValueArr2"
                              show-checkbox
                              node-key="id"
                              ref="dimensionValue1Tree"
                              highlight-current
                              :props="defaultProps"
                              :check-strictly="true"
                              @check-change="handleDimValueClick2"
                          >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDimV2">维度值2不能为空</div>
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-plus"
                          circle
                          size="mini"
                          v-if="form.ieProp == 3"
                          :disabled="crud.status.flag == 2"
                          @click="addDimensionAndValue"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject3.isShow">
                    <el-form-item label="维度3" prop="dimension" label-width="110px">
                      <el-select v-model="dimAndValueObject3.dimension" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2" @change="(val)=>initDimVal(val,3)">
                        <el-option
                            v-for="item in dimInfoArr"
                            :key="item.id"
                            :label="item.categoryName"
                            :value="item.id"
                        />
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDim3">维度3不能为空</div>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject3.isShow">
                    <el-form-item label="维度值3" prop="dimensionValue" label-width="110px">
                      <el-select style="width: 85%" filterable clearable placeholder="请选择"
                                 v-model="dimAndValueObject3.dimensionName" :disabled="crud.status.flag == 2"
                                 @change="changeDimVal3"
                      >
                        <el-option style="height: auto;" :disabled="true" value="1">
                          <el-tree
                              :data="dimValueArr3"
                              show-checkbox
                              node-key="id"
                              ref="dimensionValue1Tree"
                              highlight-current
                              :props="defaultProps"
                              :check-strictly="true"
                              @check-change="handleDimValueClick3"
                          >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDimV3">维度值3不能为空</div>
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteDimensionAndValue(3)"
                          circle :disabled="crud.status.flag == 2"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject4.isShow">
                    <el-form-item label="维度4" prop="dimension" label-width="110px">
                      <el-select v-model="dimAndValueObject4.dimension" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2" @change="(val)=>initDimVal(val,4)">
                        <el-option
                            v-for="item in dimInfoArr"
                            :key="item.id"
                            :label="item.categoryName"
                            :value="item.id"
                        />
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDim4">维度4不能为空</div>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject4.isShow">
                    <el-form-item label="维度值4" prop="dimensionValue" label-width="110px">
                      <el-select style="width: 85%" filterable clearable placeholder="请选择"
                                 v-model="dimAndValueObject4.dimensionName" :disabled="crud.status.flag == 2"
                                 @change="changeDimVal4"
                      >
                        <el-option style="height: auto;" :disabled="true" value="1">
                          <el-tree
                              :data="dimValueArr4"
                              show-checkbox
                              node-key="id"
                              ref="dimensionValue1Tree"
                              highlight-current
                              :props="defaultProps"
                              :check-strictly="true"
                              @check-change="handleDimValueClick4"
                          >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDimV4">维度值4不能为空</div>
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteDimensionAndValue(4)"
                          circle :disabled="crud.status.flag == 2"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject5.isShow">
                    <el-form-item label="维度5" prop="dimension" label-width="110px">
                      <el-select v-model="dimAndValueObject5.dimension" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2" @change="(val)=>initDimVal(val,5)">
                        <el-option
                            v-for="item in dimInfoArr"
                            :key="item.id"
                            :label="item.categoryName"
                            :value="item.id"
                        />
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDim5">维度5不能为空</div>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject5.isShow">
                    <el-form-item label="维度值5" prop="dimensionValue" label-width="110px">
                      <el-select style="width: 85%" filterable clearable placeholder="请选择"
                                 v-model="dimAndValueObject5.dimensionName" :disabled="crud.status.flag == 2"
                                 @change="changeDimVal5"
                      >
                        <el-option style="height: auto;" :disabled="true" value="1">
                          <el-tree
                              :data="dimValueArr5"
                              show-checkbox
                              node-key="id"
                              ref="dimensionValue1Tree"
                              highlight-current
                              :props="defaultProps"
                              :check-strictly="true"
                              @check-change="handleDimValueClick5"
                          >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDimV5">维度值5不能为空</div>
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteDimensionAndValue(5)"
                          circle :disabled="crud.status.flag == 2"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject6.isShow">
                    <el-form-item label="维度6" prop="dimension" label-width="110px">
                      <el-select v-model="dimAndValueObject6.dimension" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2" @change="(val)=>initDimVal(val,6)">
                        <el-option
                            v-for="item in dimInfoArr"
                            :key="item.id"
                            :label="item.categoryName"
                            :value="item.id"
                        />
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDim6">维度6不能为空</div>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject6.isShow">
                    <el-form-item label="维度值6" prop="dimensionValue" label-width="110px">
                      <el-select style="width: 85%" filterable clearable placeholder="请选择"
                                 v-model="dimAndValueObject6.dimensionName" :disabled="crud.status.flag == 2"
                                 @change="changeDimVal6"
                      >
                        <el-option style="height: auto;" :disabled="true" value="1">
                          <el-tree
                              :data="dimValueArr6"
                              show-checkbox
                              node-key="id"
                              ref="dimensionValue1Tree"
                              highlight-current
                              :props="defaultProps"
                              :check-strictly="true"
                              @check-change="handleDimValueClick6"
                          >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDimV6">维度值6不能为空</div>
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteDimensionAndValue(6)"
                          circle :disabled="crud.status.flag == 2"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject7.isShow">
                    <el-form-item label="维度7" prop="dimension" label-width="110px">
                      <el-select v-model="dimAndValueObject7.dimension" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2" @change="(val)=>initDimVal(val,7)">
                        <el-option
                            v-for="item in dimInfoArr"
                            :key="item.id"
                            :label="item.categoryName"
                            :value="item.id"
                        />
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDim7">维度7不能为空</div>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject7.isShow">
                    <el-form-item label="维度值7" prop="dimensionValue" label-width="110px">
                      <el-select style="width: 85%" filterable clearable placeholder="请选择"
                                 v-model="dimAndValueObject7.dimensionName" :disabled="crud.status.flag == 2"
                                 @change="changeDimVal7"
                      >
                        <el-option style="height: auto;" :disabled="true" value="1">
                          <el-tree
                              :data="dimValueArr7"
                              show-checkbox
                              node-key="id"
                              ref="dimensionValue1Tree"
                              highlight-current
                              :props="defaultProps"
                              :check-strictly="true"
                              @check-change="handleDimValueClick7"
                          >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDimV7">维度值7不能为空</div>
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteDimensionAndValue(7)"
                          circle :disabled="crud.status.flag == 2"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject8.isShow">
                    <el-form-item label="维度8" prop="dimension" label-width="110px">
                      <el-select v-model="dimAndValueObject8.dimension" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2" @change="(val)=>initDimVal(val,8)">
                        <el-option
                            v-for="item in dimInfoArr"
                            :key="item.id"
                            :label="item.categoryName"
                            :value="item.id"
                        />
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDim8">维度8不能为空</div>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject8.isShow">
                    <el-form-item label="维度值8" prop="dimensionValue" label-width="110px">
                      <el-select style="width: 85%" filterable clearable placeholder="请选择"
                                 v-model="dimAndValueObject8.dimensionName" :disabled="crud.status.flag == 2"
                                 @change="changeDimVal8"
                      >
                        <el-option style="height: auto;" :disabled="true" value="1">
                          <el-tree
                              :data="dimValueArr8"
                              show-checkbox
                              node-key="id"
                              ref="dimensionValue1Tree"
                              highlight-current
                              :props="defaultProps"
                              :check-strictly="true"
                              @check-change="handleDimValueClick8"
                          >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDimV8">维度值8不能为空</div>
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteDimensionAndValue(8)"
                          circle :disabled="crud.status.flag == 2"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject9.isShow">
                    <el-form-item label="维度9" prop="dimension" label-width="110px">
                      <el-select v-model="dimAndValueObject9.dimension" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2" @change="(val)=>initDimVal(val,9)">
                        <el-option
                            v-for="item in dimInfoArr"
                            :key="item.id"
                            :label="item.categoryName"
                            :value="item.id"
                        />
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDim9">维度9不能为空</div>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject9.isShow">
                    <el-form-item label="维度值9" prop="dimensionValue" label-width="110px">
                      <el-select style="width: 85%" filterable clearable placeholder="请选择"
                                 v-model="dimAndValueObject9.dimensionName" :disabled="crud.status.flag == 2"
                                 @change="changeDimVal9"
                      >
                        <el-option style="height: auto;" :disabled="true" value="1">
                          <el-tree
                              :data="dimValueArr9"
                              show-checkbox
                              node-key="id"
                              ref="dimensionValue1Tree"
                              highlight-current
                              :props="defaultProps"
                              :check-strictly="true"
                              @check-change="handleDimValueClick9"
                          >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDimV9">维度值9不能为空</div>
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteDimensionAndValue(9)"
                          circle :disabled="crud.status.flag == 2"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject10.isShow">
                    <el-form-item label="维度10" prop="dimension" label-width="110px">
                      <el-select v-model="dimAndValueObject10.dimension" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2" @change="(val)=>initDimVal(val,10)">
                        <el-option
                            v-for="item in dimInfoArr"
                            :key="item.id"
                            :label="item.categoryName"
                            :value="item.id"
                        />
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDim10">维度10不能为空</div>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject10.isShow">
                    <el-form-item label="维度值10" prop="dimensionValue" label-width="110px">
                      <el-select style="width: 85%" filterable clearable placeholder="请选择"
                                 v-model="dimAndValueObject10.dimensionName" :disabled="crud.status.flag == 2"
                                 @change="changeDimVal10"
                      >
                        <el-option style="height: auto;" :disabled="true" value="1">
                          <el-tree
                              :data="dimValueArr10"
                              show-checkbox
                              node-key="id"
                              ref="dimensionValue1Tree"
                              highlight-current
                              :props="defaultProps"
                              :check-strictly="true"
                              @check-change="handleDimValueClick10"
                          >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
                      <div class="el-form-item_error_dim" style="color: red" v-show="errmsgDimV10">维度值10不能为空</div>
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-delete"
                          size="mini"
                          @click="deleteDimensionAndValue(10)"
                          circle :disabled="crud.status.flag == 2"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3">
                    <el-form-item label="新增维度" label-width="110px">
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-plus"
                          @click="addDimension" :disabled="crud.status.flag == 2"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="新增维度值" label-width="110px" v-if="form.ieProp == 3">
                      <el-button
                          class="filter-item"
                          type="primary"
                          icon="el-icon-plus"
                          @click="addDimensionValue" :disabled="crud.status.flag == 2"
                      >
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="业务属主部门" prop="businessDept" label-width="110px">
                      <treeselect v-model="form.businessDept" :options="depts"  style="width: 95%" size="small"  placeholder="选择机构" class="filter-item"  :disabled="true"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标层级" prop="indLevel" label-width="110px">
                      <el-select v-model="form.indLevel" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in dict.IND_LEVEL"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="是否部门内部都可查询指标结果" prop="isDeptQuery" label-width="220px">
                      <el-checkbox v-model="form.isDeptQuery" :disabled="crud.status.flag == 2"></el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标结果是否会补录" prop="isAdditionalRecording" label-width="150px">
                      <el-select v-model="form.isAdditionalRecording" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                        <el-option label="否" value="false" selected></el-option>
                        <el-option label="是" value="true"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标定义" prop="indDefinition" label-width="110px">
                      <el-input type="textarea" v-model="form.indDefinition" style="width: 95%;" :rows="5" :disabled="crud.status.flag == 2"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <div class="el-form-item el-form-item--small">
                      <label for="indDefRule" class="el-form-item__label" style="width: 110px;">
                        <span style="color: red" v-if="indDefRuleStr == null || indDefRuleStr ==''">* </span>
                        指标口径规则
                      </label>
                      <div class="el-form-item__content" style="margin-left: 110px;">
                        <span style="display: none;">{{ indDefRuleStr }}</span>
                        <span style="display: none;">{{ indDefRuleVal }}</span>
                        <el-input type="textarea" v-model="form.indDefRule" style="width: 95%;margin-bottom: 10px" :rows="5" :disabled="crud.status.flag == 2 || !this.isSelfRule"  :class="[this.errmsgIndDefRule?'error-border':'']" @change="(val) => {this.checkIndDefRule(val)}"  @blur="(val) => {this.checkIndDefRule(val)}"></el-input>
                        <br>
                        <el-button type="text" v-if="form.ieProp == 2" @click="indDefRulePlus" :disabled="crud.status.flag == 2 || this.isSelfRule">+</el-button>
                        <el-button type="text" v-if="form.ieProp == 2" @click="indDefRuleSubtraction" :disabled="crud.status.flag == 2 || this.isSelfRule">-</el-button>
                        <el-button type="text" v-if="form.ieProp == 2" @click="indDefRuleMultiplication" :disabled="crud.status.flag == 2 || this.isSelfRule">×</el-button>
                        <el-button type="text" v-if="form.ieProp == 2" @click="indDefRuleDivision" :disabled="crud.status.flag == 2 || this.isSelfRule">/</el-button>
                        <el-button type="primary" v-if="form.ieProp == 2" @click="showIndDefRuleDialog" class="filter-item" size="mini" icon="el-icon-monitor" :disabled="crud.status.flag == 2 || this.isSelfRule"></el-button>
                        <el-button type="primary" v-if="form.ieProp == 2" @click="clearRuleVal" class="filter-item" size="mini" icon="el-icon-delete-solid" :disabled="crud.status.flag == 2 || this.isSelfRule"></el-button>
                        <el-checkbox v-model="isSelfRule" @change="changeIsSelfRule" style="margin-left: 20px" :disabled="crud.status.flag == 2 || form.ieProp != 2">自定义规则</el-checkbox>
                        <div class="el-form-item_error_dim" style="color: red" v-if="this.errmsgIndDefRule">{{indDefRuleErr}}</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="指标取值范围" prop="indValueRange1" label-width="110px">
                          <el-input type="text" v-model="form.indValueRange1" style="width: 100%;" :disabled="crud.status.flag == 2"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="indValueRange2">
                          <el-input type="text" v-model="form.indValueRange2" style="width: 85%;" :disabled="crud.status.flag == 2"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标内部警戒值(表示预警)" prop="indInnerWarnValue" label-width="110px">
                      <el-col v-for="(item,index) in indInnerWarnValueArr" :key="index">
                        <el-button type="text" @click="indInnerWarnValueBiggerClick" :disabled="crud.status.flag == 2">></el-button>
                        <el-button type="text" @click="indInnerWarnValueBiggerEqualsClick" :disabled="crud.status.flag == 2">>=</el-button>
                        <el-button type="text" @click="indInnerWarnValueEqualsClick" :disabled="crud.status.flag == 2">=</el-button>
                        <el-button type="text" @click="indInnerWarnValueSmallerClick" :disabled="crud.status.flag == 2"><</el-button>
                        <el-button type="text" @click="indInnerWarnValueSmallerEqualsClick" :disabled="crud.status.flag == 2"><=</el-button>
                        <el-button type="text" @click="indInnerWarnValueNotEqualsClick" :disabled="crud.status.flag == 2">≠</el-button>
                        <el-input type="number" v-model="form.indInnerWarnValue" style="width: 100%;" :disabled="crud.status.flag == 2"
                                  @change="(val) => {checkWarning(val,'inner')}" @blur="(val) => {checkWarning(form.indInnerWarnValue,'inner')}">
                          <template slot="prepend">{{form.indInnerWarnFlg}}</template>
                        </el-input>
                        <div class="el-form-item_error_dim" style="color: red" v-show="errmsgInnerWarning">{{innerwarningErrMsg}}</div>
<!--                        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addIndInnerWarnValue" size="mini" circle v-if="item == 1" :disabled="crud.status.flag == 2">
                        </el-button>
                        <el-button class="filter-item" type="primary" icon="el-icon-delete" @click="delIndInnerWarnValue(item)" size="mini" circle v-if="item != 1" :disabled="crud.status.flag == 2">
                        </el-button>-->
                      </el-col>
<!--                      <el-col v-for="item in indInnerWarnPassValueArr">-->
<!--                        <el-button type="text">></el-button>-->
<!--                        <el-button type="text">=</el-button>-->
<!--                        <el-button type="text"><</el-button>-->
<!--                        <el-button type="text">≠</el-button>-->
<!--                        <el-input v-model="form.indInnerWarnPassValue" style="width: 31%;"></el-input>-->
<!--                        表示通过-->
<!--                        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addIndInnerWarnPassValue" size="mini" circle v-if="item == 1">-->
<!--                        </el-button>-->
<!--                        <el-button class="filter-item" type="primary" icon="el-icon-delete" @click="delIndInnerWarnPassValue(item)" size="mini" circle v-if="item != 1">-->
<!--                        </el-button>-->
<!--                      </el-col>-->
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标监管警戒值(表示预警)" prop="indMonWarnValue" label-width="110px">
                      <el-col v-for="(item,index) in indMonWarnValueArr" :key="index">
                        <el-button type="text" @click="indMonWarnValueBiggerClick" :disabled="crud.status.flag == 2">></el-button>
                        <el-button type="text" @click="indMonWarnValueBiggerEqualsClick" :disabled="crud.status.flag == 2">>=</el-button>
                        <el-button type="text" @click="indMonWarnValueEqualsClick" :disabled="crud.status.flag == 2">=</el-button>
                        <el-button type="text" @click="indMonWarnValueSmallerClick" :disabled="crud.status.flag == 2"><</el-button>
                        <el-button type="text" @click="indMonWarnValueSmallerEqualsClick" :disabled="crud.status.flag == 2"><=</el-button>
                        <el-button type="text" @click="indMonWarnValueNotEqualsClick" :disabled="crud.status.flag == 2">≠</el-button>
                        <el-input type="number" v-model="form.indMonWarnValue" style="width: 100%;" :disabled="crud.status.flag == 2"
                                  @change="(val) => {checkWarning(val,'mon')}" @blur="(val) => {checkWarning(form.indMonWarnValue,'mon')}">
                          <template slot="prepend">{{form.indMonWarnFlg}}</template>
                        </el-input>
                        <div class="el-form-item_error_dim" style="color: red" v-show="errmsgMonWarning">{{monwarningErrMsg}}</div>
<!--                        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addIndMonWarnValue" size="mini" circle v-if="item == 1" :disabled="crud.status.flag == 2">
                        </el-button>
                        <el-button class="filter-item" type="primary" icon="el-icon-delete" @click="delIndMonWarnValue(item)" size="mini" circle v-if="item != 1" :disabled="crud.status.flag == 2">
                        </el-button>-->
                      </el-col>
<!--                      <el-col v-for="item in indMonWarnPassValueArr">-->
<!--                        <el-button type="text">></el-button>-->
<!--                        <el-button type="text">=</el-button>-->
<!--                        <el-button type="text"><</el-button>-->
<!--                        <el-button type="text">≠</el-button>-->
<!--                        <el-input v-model="form.indMonWarnPassValue" style="width: 31%;"></el-input>-->
<!--                        表示通过-->
<!--                        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addIndMonWarnPassValue" size="mini" circle v-if="item == 1">-->
<!--                        </el-button>-->
<!--                        <el-button class="filter-item" type="primary" icon="el-icon-delete" @click="delIndMonWarnPassValue(item)" size="mini" circle v-if="item != 1">-->
<!--                        </el-button>-->
<!--                      </el-col>-->
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="币种" prop="currency" label-width="110px">
                      <el-select v-model="form.currency" filterable multiple clearable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in dict.IND_CURRENCY"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <!-- 新增三个字段 -->
                  <el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 1">
                      <el-form-item label="选择模型表" prop="indModelTable" label-width="110px">
                        <el-select v-model="form.indModelTable" filterable clearable placeholder="请选择" style="width: 95%;"
                        @change="initIndModelCols(true)" :disabled="crud.status.flag == 2">
                          <el-option
                              v-for="item in formIndModelTable"
                              :key="item.id"
                              :label="item.label"
                              :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 1">
                      <el-form-item label="度量值字段" prop="indModelCols" label-width="110px">
                        <el-select v-model="form.indModelCols" filterable clearable placeholder="请选择"
                                  style="width: 95%;" :disabled="crud.status.flag == 2"
                        >
                          <el-option
                              v-for="item in formIndModelCols"
                              :key="item.id"
                              :label="item.label"
                              :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 1">
                      <el-form-item label="聚合函数" prop="indAggFunction" label-width="110px">
                        <el-select v-model="form.indAggFunction" filterable clearable placeholder="请选择"
                                  style="width: 95%;" :disabled="crud.status.flag == 2"
                        >
                          <el-option
                              v-for="item in formIndAggFunction"
                              :key="item.id"
                              :label="item.label"
                              :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-col>

                </el-col>
                <el-col>
                  <el-divider content-position="center">指标加工规则详情</el-divider>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标数值属性" prop="indValueType" label-width="110px">
                      <el-select v-model="form.indValueType" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in dict.IND_VALUE_TYPE"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标生成频率" prop="indFrequency" label-width="110px">
                      <el-select v-model="form.indFrequency" filterable multiple clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2"
                      >
                        <el-option
                            v-for="item in dict.IE_FREQUENCY"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="度量单位" prop="indCalType" label-width="110px">
                      <el-select v-model="form.indCalType" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in dict.IND_CAL_TYPE"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="指标安全等级" prop="indSafeLevel" label-width="110px">
                      <el-select v-model="form.indSafeLevel" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in dict.IND_SAFE_LEVEL"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="监管属性" prop="indMonField" label-width="110px">
                      <el-select v-model="form.indMonField" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in dict.IND_MON_FIELD"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="权威加工系统" prop="indProcessSys" label-width="110px">
                      <el-select v-model="form.indProcessSys" filterable clearable placeholder="请选择"
                                 style="width: 95%;" :disabled="crud.status.flag == 2"
                      >
                        <el-option
                            v-for="item in dict.IND_PROCESS_SYS"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="数据类型" prop="indDataType" label-width="110px">
                      <el-select v-model="form.indDataType" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in dict.IND_DATA_TYPE"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="数据格式" prop="indDataForm" label-width="110px">
                      <el-input v-model="form.indDataForm" style="width: 95%;" :disabled="crud.status.flag == 2"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="参考依据" prop="indReference" label-width="110px">
                      <el-input v-model="form.indReference" style="width: 95%;" :disabled="crud.status.flag == 2"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="false">
                    <el-form-item label="是否需要实时加工" prop="isRealTimeProcess" label-width="140px">
                      <el-checkbox v-model="form.isRealTimeProcess" :disabled="crud.status.flag == 2"></el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="display: none">
                    <el-form-item label="数据源" prop="sourceDataSource" label-width="110px">
                      <el-select v-model="form.sourceDataSource" filterable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in sourceData"
                            :key="item.id"
                            :label="item.datasourceName"
                            :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="display: none">
                    <el-form-item label="目标数据源" prop="targetDataSource" label-width="110px">
                      <el-select v-model="form.targetDataSource" filterable placeholder="请选择" style="width: 95%;"
                                 @change="dataSourceChangeHandle" :disabled="crud.status.flag == 2"
                      >
                        <el-option
                            v-for="item in sourceData"
                            :key="item.id"
                            :label="item.datasourceName"
                            :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="display: none">
                    <el-form-item label="保留历史" prop="ieProp" label-width="110px">
                      <el-select v-model="form.keepHistory" filterable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                        <el-option
                            v-for="item in dict.YN"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="display: none">
                    <el-form-item label="存储表名" prop="bizTabCode" label-width="110px">
                      <el-select v-model="form.bizTabCode" filterable placeholder="请选择"
                                 :disabled="(crud.status.flag != 2 && form.createTable=='1')" style="width: 95%;"
                                 @change="bizTabCodeChange"
                      >
                        <el-option
                            v-for="item in tableInfo"
                            :key="item.remark"
                            :label="item.remark"
                            :value="item.tableName"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="指标状态" prop="status">
                    <el-select v-model="form.status" filterable placeholder="请选择">
                      <el-option
                        v-for="item in dict.IE_STATUS"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>-->
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="display: none">
                    <el-form-item label="指标描述" label-width="110px">
                      <el-input v-model="form.bizDesc" style="width: 98%;" :disabled="crud.status.flag == 2"/>
                    </el-form-item>
                  </el-col>
                  <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">-->
                  <!--<el-form-item label="业务标志">
              <el-input v-model="form.bizFlag" style="width: 370px;" />
            </el-form-item>-->
                  <!--</el-col>-->

                  <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="计算顺序">
              <el-input v-model="form.calcSeq" style="width: 200px;" />
            </el-form-item>
            </el-col>-->
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="form.isRealTimeProcess == true">
                    <el-form-item label="实时指标取数SQL" prop="bizCalcSql" label-width="140px">
                      <el-input v-model="form.bizCalcSql" type="textarea" style="height: 50px;width: 98%" :rows="3" :disabled="crud.status.flag == 2"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="padding-top: 12px" v-if="false">
                    <el-form-item label="批量指标取数SQL" prop="bizBatchCalcSql" label-width="140px">
                      <el-input v-model="form.bizBatchCalcSql" type="textarea" style="height: 50px;width: 98%" :rows="3" :disabled="crud.status.flag == 2"/>
                    </el-form-item>
                  </el-col>
                  <!--<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="计算频度">
                <el-input v-model="form.calcFreq" style="width: 370px;" />
              </el-form-item>
              </el-col>-->
                </el-col>
                <el-col>
                  <el-divider content-position="center">指标统计项</el-divider>
                  <el-col>
                    <el-checkbox v-model="form.indCurrentValue" :disabled="crud.status.flag == 2">当期值</el-checkbox>
                    <el-checkbox v-model="form.indContemporaneousValue" :disabled="crud.status.flag == 2" >同期值</el-checkbox>
                    <el-checkbox v-model="form.indYearOnYearIncrement" :disabled="crud.status.flag == 2" >同比增量</el-checkbox>
                    <el-checkbox v-model="form.indYearOnYearGrowth" :disabled="crud.status.flag == 2" @change="changeContemporaneous">同比增幅</el-checkbox>
                    <el-checkbox v-model="form.indPreviousPeriodValue" :disabled="crud.status.flag == 2">上期值</el-checkbox>
                    <el-checkbox v-model="form.indMonthOnMonthIncrement" :disabled="crud.status.flag == 2">环比增量</el-checkbox>
                    <el-checkbox v-model="form.indMonthOnMonthGrowth" :disabled="crud.status.flag == 2" @change="changePreviousPeriod">环比增幅</el-checkbox>
                    <el-checkbox v-model="form.indInitialValueOfTheYear" :disabled="crud.status.flag == 2">年初值</el-checkbox>
                    <el-checkbox v-model="form.indYearOnYearIncre" :disabled="crud.status.flag == 2">较年初增量</el-checkbox>
                    <el-checkbox v-model="form.indIncreaseOverTheBeginningOfTheYear" :disabled="crud.status.flag == 2" @change="changeInitialValue">较年初增幅</el-checkbox>
                  </el-col>
                </el-col>
              </el-form>
            </el-col>
            <div slot="footer" class="dialog-footer">
<!--              <el-button class="" size="mini" type="success" @click="atomDimensionHandle">维度设置</el-button>-->
              <el-button v-if="crud.status.flag == 0 || crud.status.flag == 1" type="success" plain round @click="crud.cancelCU">取消</el-button>
              <el-button v-if="crud.status.flag == 0 || crud.status.flag == 1" :loading="crud.cu == 2" type="success"  round @click="submitForm(crud.form)">确认</el-button>
              <el-button v-if="crud.status.flag == 0 || crud.status.flag == 1" :loading="crud.cu == 2" type="success"  round @click="submitAndStartProcess(crud.form)">确认并发起审批</el-button>
              <el-button v-if="crud.status.flag == 2 " type="success" plain round @click="crud.cancelCU">关闭</el-button>
            </div>
          </el-dialog>
          <!--表格渲染-->
          <el-table height="520" ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                    @selection-change="crud.selectionChangeHandler" border
          >
            <el-table-column type="selection" width="55" fixed="left"/>
            <!--<el-table-column v-if="columns.visible('id')" prop="id" label="主键" />-->
            <!--<el-table-column v-if="columns.visible('categoryId')" prop="categoryId" label="指标分类ID(树状)" />-->
            <el-table-column v-if="columns.visible('bizCode')" prop="bizCode" label="指标编码" width="100px"/>
            <el-table-column label="指标分类" style="height: 20px"   width="200px" align="center">
              <el-table-column v-if="columns.visible('indFirstTypeName')" prop="indFirstTypeName" label="一级分类" width="100px" />
              <el-table-column v-if="columns.visible('indSecondTypeName')" prop="indSecondTypeName" label="二级分类" width="100px" />
            </el-table-column>
            <el-table-column v-if="columns.visible('isConfirm')" prop="isConfirm" label="是否确权" width="80px"/>
            <el-table-column v-if="columns.visible('businessDeptName')" prop="businessDeptName" label="业务属主部门" width="130px"/>
            <el-table-column prop="indDeployStatus" label="标准状态" width="80px">
              <template slot-scope="scope">
                {{ dict.label.IND_DEPLOY_STATUS[scope.row.indDeployStatus] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('bizName')" prop="bizName" label="指标名称" width="130px"/>
            <el-table-column v-if="columns.visible('ieProp')" prop="ieProp" label="指标类型" width="80px">
              <template slot-scope="scope">
                {{ dict.label.IE_PROP[scope.row.ieProp] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('genIeName')" prop="genIeName" label="根指标名称" width="130px"/>
            <el-table-column v-if="columns.visible('dimName1')" prop="dimName1" label="维度1" width="130px"/>
            <el-table-column v-if="columns.visible('dimValName1')" prop="dimValName1" label="维度值1" width="130px"/>
            <el-table-column v-if="columns.visible('dimName2')" prop="dimName2" label="维度2" width="130px"/>
            <el-table-column v-if="columns.visible('dimValName2')" prop="dimValName2" label="维度值2" width="130px"/>
            <el-table-column prop="indVerifyStatus" label="审批状态" width="90px">
              <template slot-scope="scope">
                {{ dict.label.IND_VERIFY_STATUS[scope.row.indVerifyStatus] }}
              </template>
            </el-table-column>
            <!--            <el-table-column prop="indOprTypeName" label="操作类型" width="80px" />-->
            <el-table-column prop="indDefinition" label="指标定义" width="200px">
              <template slot-scope="scope">
                <el-popover
                    placement="top-start"
                    title=""
                    width="200"
                    trigger="hover"
                    :content="scope.row.indDefinition">
                  <span slot="reference" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.indDefinition }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="indDefRuleString" label="指标口径规则" width="200px">
              <template slot-scope="scope">
                <el-popover
                    placement="top-start"
                    title=""
                    width="200"
                    trigger="hover"
                    :content="scope.row.indDefRuleString">
                  <span slot="reference" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.indDefRuleString }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="indLevel" label="指标层级" width="80px">
              <template slot-scope="scope">
                {{ dict.label.IND_LEVEL[scope.row.indLevel] }}
              </template>
            </el-table-column>
            <el-table-column prop="indFrequencyName" label="指标统计频率"></el-table-column>
            <el-table-column prop="isRealTimeProcess" label="是否需要实时加工">
              <template slot-scope="scope">
                <span v-if="scope.row.isRealTimeProcess">是</span>
                <span v-if="!scope.row.isRealTimeProcess">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="indCalType" label="度量单位" width="100px">
              <template slot-scope="scope">
                {{ dict.label.IND_CAL_TYPE[scope.row.indCalType] }}
              </template>
            </el-table-column>
            <el-table-column prop="indMonField" label="标准来源" width="100px">
              <template slot-scope="scope">
                {{ dict.label.IND_MON_FIELD[scope.row.indMonField] }}
              </template>
            </el-table-column>
            <el-table-column prop="indProcessSys" label="权威加工系统" width="120px">
              <template slot-scope="scope">
                {{ dict.label.IND_PROCESS_SYS[scope.row.indProcessSys] }}
              </template>
            </el-table-column>
            <el-table-column prop="indVerifyId" label="审批编号" width="220px"/>
<!--            <el-table-column v-if="columns.visible('sourceDataSource')" prop="sourceDataSource" label="数据源"-->
<!--                             :formatter="toSourceDataName" :show-overflow-tooltip="true"-->
<!--            />-->
<!--            <el-table-column v-if="columns.visible('targetDataSource')" prop="targetDataSource" label="目标数据源"-->
<!--                             :formatter="toTargetDataName" :show-overflow-tooltip="true"-->
<!--            />-->
            <!--<el-table-column v-if="columns.visible('createTable')" prop="createTable" label="是否新建表" width="100px" />-->
            <!--<el-table-column v-if="columns.visible('keepHistory')" prop="keepHistory" label="是否保留历史" width="100px" >
              <template slot-scope="scope">
                {{ dict.label.YN[scope.row.keepHistory] }}
              </template>
            </el-table-column>-->
<!--            <el-table-column v-if="columns.visible('bizTabCode')" prop="bizTabCode" label="存储表名" width="150px"/>-->
            <!--<el-table-column v-if="columns.visible('bizFlag')" prop="bizFlag" label="业务标志" />-->
<!--            <el-table-column v-if="columns.visible('bizCalcSql')" prop="bizCalcSql" label="取数SQL"-->
<!--                             :show-overflow-tooltip="true"-->
<!--            />-->
<!--            <el-table-column v-if="columns.visible('dimNames')" prop="dimNames" label="维度名称"-->
<!--                             :show-overflow-tooltip="true"-->
<!--            />-->
            <el-table-column v-if="columns.visible('bizDesc')" prop="bizDesc" label="描述" width="200px">
              <template slot-scope="scope">
                <el-popover
                    placement="top-start"
                    title=""
                    width="200"
                    trigger="hover"
                    :content="scope.row.bizDesc">
                  <span slot="reference" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ scope.row.bizDesc }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <!--<el-table-column v-if="columns.visible('calcSeq')" prop="calcSeq" label="计算顺序" />
            <el-table-column v-if="columns.visible('calcFreq')" prop="calcFreq" label="计算频度" />-->
            <el-table-column v-if="columns.visible('crtUserName')" prop="crtUserName" label="录入人">
              <template slot-scope="scope">
                <span>{{ scope.row.crtUserName }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('crtOrgName')" prop="crtOrgName" label="录入人所属机构"/>
            <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.crtDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人"/>
<!--            <el-table-column v-if="columns.visible('updOrgName')" prop="updOrgName" label="修改机构"/>-->
            <el-table-column v-if="columns.visible('updDate')" prop="updDate" label="修改日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.updDate) }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column v-if="columns.visible('tenant')" prop="tenant" label="租户" />-->
            <el-table-column v-permission="['admin','indAtomInfo:edit','indAtomInfo:del']" label="操作" min-width="550px"
                               fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                    slot="left"
                    class="el-icon--left"
                    type="primary"
                    style="margin-bottom:3px !important"
                    size="mini"
                    @click="crud.toDetail(scope.row)"
                >
                  详情
                </el-button>
                <el-button
                    slot="left"
                    class="el-icon--left"
                    type="primary"
                    style="margin-bottom:3px !important"
                    size="mini"
                    @click="toKindred(scope.row)"
                >
                  血缘关系
                </el-button>
                <el-button
                    slot="left"
                    v-permission="permission.del"
                    class="el-icon--left"
                    type="danger"
                    style="margin-bottom:3px !important"
                    size="mini"
                    v-if="scope.row.classType == 0"
                    @click="delAtom(scope.row)"
                >
                  删除
                </el-button>
                <el-button
                    slot="left"
                    class="el-icon--left"
                    type="primary"
                    size="mini"
                    style="margin-bottom:3px !important"
                    @click="toSelectFlow(scope.row)"
                >
                  流程查看
                </el-button>
                <el-button
                    slot="left"
                    class="el-icon--left"
                    type="primary"
                    size="mini"
                    style="margin-bottom:3px !important"
                    @click="toResult(scope.row)"
                >
                  结果查看
                </el-button>
                <el-button
                    slot="left"
                    class="el-icon--left"
                    type="primary"
                    size="mini"
                    style="margin-bottom:3px !important"
                    @click="toSelectHistory(scope.row)"
                >
                  历史版本
                </el-button>
<!--                <udOperation-->
<!--                    :data="scope.row"-->
<!--                    :permission="permission"-->
<!--                    class="el-icon&#45;&#45;right"-->
<!--                    style="display:inline-block;"-->
<!--                />-->
              </template>
            </el-table-column>
          </el-table>

          <!--     衍生指标编辑指标口径规则     -->
          <el-dialog :close-on-click-modal="false" @close="closeIndDefRuleDialog" title="衍生指标新增指标口径规则" width="50%" :visible="showIndDefRule">
            <div style="text-align: center">
              <el-transfer
                  style="text-align: left; display: inline-block"
                  filterable
                  v-model="value"
                  :render-content="renderFunc"
                  :titles="['源', '目标']"
                  :format="{
                              noChecked: '${total}',
                              hasChecked: '${checked}/${total}'
                            }"
                  @change="handleChange"
                  :data="transferData">
              </el-transfer>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="success" round @click="selectInd">确认</el-button>
            </div>
          </el-dialog>

          <!--分页组件-->
          <pagination/>
          <dimensionPage ref="dimensionPage" :biz-tab-code-dis="bizTabCodeDis" @func="getAtomDimensions"/>
          <atomPage ref="atomPage"/>
          <selectAtom ref="selectAtom" @refreshList="refreshList"/>
          <!--流程查看-->
          <el-dialog :close-on-click-modal="false" @close="closeFlowDialog" title="流程查看" width="80%" :visible="showFlow">
            <el-table ref="flowTable" :data="flowData" size="small" style="width: 100%;" border>
              <el-table-column prop = "SEQ" min-width="10%" label="序号" />
              <el-table-column prop="NODE_NAME" min-width="13%" label="办理环节" />
              <el-table-column prop="NICK_NAME" min-width="13%" label="办理人" />
              <el-table-column prop="APPR_COMMENT" min-width="28%" label="办理意见" />
              <el-table-column prop="DURATION" min-width="18%" label="办理时效(工作日)"/>
              <el-table-column prop="END_DATE" min-width="18%" label="办理时间"/>
            </el-table>
          </el-dialog>

          <!--    指标历史版本列表      -->
          <el-dialog :close-on-click-modal="false" @close="closeIndHistoryDialog" title="指标历史版本列表" width="70%" :visible="showIndHistory">
            <el-table ref="historyTable" :data="historyData" size="small" style="width: 100%;" border>
              <el-table-column prop="bizCode" label="指标编码"/>
              <el-table-column prop="bizName" label="指标名称"/>
              <el-table-column prop="ieProp" label="指标类型">
                <template slot-scope="scope">
                  {{ dict.label.IE_PROP[scope.row.ieProp] }}
                </template>
              </el-table-column>
              <el-table-column prop="indDeployStatus" label="指标发布状态" width="110px">
                <template slot-scope="scope">
                  {{ dict.label.IND_DEPLOY_STATUS[scope.row.indDeployStatus] }}
                </template>
              </el-table-column>
              <el-table-column prop="businessDeptName" label="业务属主部门" width="120px"/>
              <el-table-column prop="updUserName" label="修改人"/>
              <el-table-column prop="updOrgName" label="修改所属机构" width="120px"/>
              <el-table-column prop="updDate" label="修改时间" width="150px">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.updDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column v-permission="['admin','indAtomInfo:historyVersionDetail']" label="操作" width="110px"
                                 fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                      slot="left"
                      class="el-icon&#45;&#45;left"
                      type="primary"
                      size="mini"
                      style="margin-bottom:3px !important"
                      @click="toSelectHistoryDetail(scope.row)"
                  >
                    历史详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <!--    指标维度名称-新增     -->
          <el-dialog :close-on-click-modal="false" @close="closeIndDimensionAddDialog" title="指标维度名称-新增" width="30%" :visible="showIndDimensionAdd">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form ref="dimform" :model="dimension" :rules="dimensionRules" size="small" label-width="100px" @submit.native.prevent>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="所属分类" prop="classificationId" label-width="110px">
                    <el-select v-model="dimension.classificationId" filterable placeholder="请选择" style="width: 95%;">
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
          <el-dialog :close-on-click-modal="false" @close="closeIndDimensionValueAddDialog" title="维度值-新增" width="30%" :visible="showIndDimensionValueAdd">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form ref="dimValform" :model="dimensionValue" :rules="dimensionValueRules" size="small" label-width="100px" @submit.native.prevent>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="所属维度" prop="dimInfoId" label-width="110px">
                    <el-select v-model="dimensionValue.dimInfoId" filterable placeholder="请选择" style="width: 95%;" @change="(val) => initSubDimVal(val,2,1)">
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
                    <el-select v-model="dimensionValue.lastLevelDimValueId" filterable placeholder="请选择" style="width: 95%;">
                      <el-option
                          v-for="item in parentDimValueArr"
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
    <el-dialog :close-on-click-modal="false" :title="sign.title" @close="closeSignDialog"  with="20%" :visible="showSign">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="font-size: medium;font-weight: bolder">
        {{sign.msg}}
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form ref="signform" :model="sign" :rules="signRules" size="small" label-width="100px" @submit.native.prevent>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="是否会签" prop="isSign" label-width="110px">
              <el-radio-group v-model="sign.isSign" @change="changeIsSign">
                <el-radio  label="0" checked>否</el-radio>
                <el-radio  label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="showSignOrg">
            <el-form-item label="会签机构" prop="signDeptId" label-width="100px">
              <el-select v-model="sign.signDeptName" filterable placeholder="请选择" style="width: 95%;">
                <el-input class="selectInput" placeholder="检索关键字"  v-model="filterText"></el-input>
                <el-option style="height: auto;" :disabled="true" value="1">
                  <el-tree
                      ref="signOrgTree"
                      :data="depts"
                      :check-strictly="true"
                      :default-expand-all="true"
                      show-checkbox
                      :filter-node-method="filterNode"
                      style="width: 100%"
                      node-key="id"
                      @check="checkSignOrg"
                  >
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                      <span>{{ node.label }}</span>
                    </span>
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" plain round @click="closeSignDialog">取消</el-button>
        <el-button type="success" round @click="commitAtomWithSign">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"  @close="closeKindredDialog"  width="80%" :visible="showKindred" >
      <el-tabs style="100%;height:600px">
          <el-tab-pane label="血缘关系图">
              <kindredShip ref="kindred"></kindredShip>
          </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import crudIndAtomInfo, {
  getColumnByTabel,
  getDimensions,
  getGenAndDerivedInd,
  getAllInds,
  getGenInd,
  getTablesById, bizNameIsContract, abolish,startProcess,delAtom,getHisList,checkRef,approveDetailByOriginalInstId
} from '@/api/indicators/indAtomInfo'
import crudIndDimInfo, {getDimInfos} from '@/api/indicators/indDimInfo'
import crudIndDimVal,{getDimValues, getDimValuesChildren} from '@/api/indicators/indDimValue'
import {getAllSource, getDimInfo, process} from '@/api/indicators/indIndicatorInfo'
import {getTableList, queryByTableId} from '@/api/indicators/metaModel'
import CRUD, {crud, form, header, presenter} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import category from '../../category/categoryNew'
import dimensionPage from '../atom/dimension/index'
import atomPage from './atomPage'
import selectAtom from './selectAtom'
import {isSignedInteger,isArabicFigures, validateStrLenFiveHundred, validateStrLenHundred,validateStrLenHalfHundred} from '@/utils/validator'
import {getClassifications} from '@/api/indicators/indClassification'
import crudIndCategory from '@/api/indicators/indCategory'
import { getDepts,getCurrentDept } from '@/utils/system'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import DimValTreeSelect from '../../dimension/DimValTreeSelect'
import qs from "qs";
import { v4 as uuidv4 } from 'uuid';
import {checkDeptUser} from '@/api/workflow/graphConfig'
import kindredShip from "../../kindred/kindredShip";
// crud交由presenter持有
const defaultCrud = CRUD({
  title: '指标信息',
  url: crudIndAtomInfo.url,
  sort: 'id,desc',
  crudMethod: { ...crudIndAtomInfo.crud }
})
const defaultForm = {
  id: null,
  categoryId: null,
  sourceDataSource: 'local',
  targetDataSource: 'local',
  bizCode: null,
  bizName: null,
  genBizName: null,// 根指标名称
  indFirstType: null,// 指标一级分类
  indSecondType: null,// 指标二级分类
  businessDept: null,// 业务属主部门
  indLevel: null, // 指标层级
  isDeptQuery: true,// 是否部门内部都可查询指标结果
  isAdditionalRecording: 'false',// 指标结果是否会补录
  indDimAndValueRelations: [],
  indDefinition: null,// 指标定义
  indDefRule: null,// 指标口径规则
  indValueRange1: null,// 指标取值范围1
  indValueRange2: null,// 指标取值范围2
  indInnerWarnValue: '',// 指标内部警戒值（表示预警）
  indInnerWarnPassValue: '',// 指标内部警戒值（表示通过）
  indInnerWarnFlg: '',
  indMonWarnValue: '',// 指标监管警戒值（表示预警）
  indMonWarnPassValue: '',// 指标监管警戒值（表示通过）
  indMonWarnFlg: '',
  currency: null,// 币种
  indModelTable: null, //模型表
  indModelCols: null, //度量值字段
  indAggFunction: null, //聚合函数
  indValueType: null,// 指标数值属性
  indFrequency: [],// 指标生成频率
  indCalType: null,// 度量单位
  indSafeLevel: null,// 指标安全等级
  indMonField: null,// 监管属性
  indProcessSys: null,// 权威加工系统
  indDataType: null,// 数据类型
  indDataForm: null,// 数据格式
  indReference: null,// 参考依据
  isRealTimeProcess: false,// 是否需要实时加工
  indCurrentValue: true,// 当期值
  indContemporaneousValue: true,// 同期值
  indYearOnYearIncrement: true,// 同比增量
  indYearOnYearGrowth: true,// 同比增幅
  indPreviousPeriodValue: true,// 上期值
  indMonthOnMonthIncrement: true,// 环比增量
  indMonthOnMonthGrowth: true,// 环比增幅
  indInitialValueOfTheYear: true,// 年初值
  indYearOnYearIncre: true,// 较年初增量
  indIncreaseOverTheBeginningOfTheYear: true,// 较年初增幅
  indVerifyStatus: null,// 指标审批状态
  indDeployStatus: null,// 指标发布状态
  indVerifyId: null,
  indStandSource: null,// 标准来源
  ieProp: null,
  createTable: null,
  keepHistory: '1',
  bizTabCode: null,
  bizFlag: null,
  bizCalcSql: null,// 实时指标取数SQL
  bizBatchCalcSql: null,// 批量指标取数SQL
  dimNames: null,
  bizDesc: null,
  calcSeq: null,
  calcFreq: null,
  crtUserCode: null,
  crtOrgCode: null,
  crtDate: null,
  updUserCode: null,
  updOrgCode: null,
  updDate: null,
  tenant: null,
  retention: null,
  tableShare: '1',
  status: '2',
  categoryType: '0',
  atomDimensions: [],
  indDefRuleStr: '',
  indDefRuleVal: '',
  submitType: 1
}
export default {
  name: 'IndAtomInfo',
  components: {Treeselect,pagination, crudOperation, rrOperation, udOperation, category, dimensionPage, atomPage,selectAtom,DimValTreeSelect,kindredShip},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['IE_PROP', 'CREATE_TABLE', 'YN', 'RETENTION', 'IE_STATUS', 'GEN_IND', 'IND_FIRST_TYPE', 'IND_SECOND_TYPE', 'BUSSINESS_DEPT',
    'IND_LEVEL', 'IND_CURRENCY', 'IND_VALUE_TYPE', 'IE_FREQUENCY', 'IND_CAL_TYPE', 'IND_SAFE_LEVEL', 'IND_MON_FIELD', 'IND_PROCESS_SYS',
    'IND_DATA_TYPE', 'IND_STAND_SOURCE', 'DIMENSION_CATEGORY', 'DIMENSION', 'LAST_LEVEL_DIMENSION_VALUE','IND_VERIFY_STATUS','IND_DEPLOY_STATUS'],
  data() {
    return {
      categoryType: '0',
      sign: {
        isSign : '0',
        signDeptId: null,
        signDeptName: null,
        oprType: 1,
        title: '发起审批流程',
        msg: '是否发起审批流程? ',
        data: null
      },
      showSign: false,
      showSignOrg: false,
      showKindred: false,
      errmsgIndDefRule: false,
      indDefRuleErr: '指标口径规则不能为空',
      signTitle: '发起审批流程',
      filterText: '',
      indexOrgTab: {
        menuLoading: false,
        data: [],
        loading: false,
        operators: [],
        strictly: true
      },
      dimAndValueObject1: {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      },
      dimAndValueObject2: {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      },
      dimAndValueObject3: {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      },
      dimAndValueObject4: {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      },
      dimAndValueObject5: {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      },
      dimAndValueObject6: {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      },
      dimAndValueObject7: {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      },
      dimAndValueObject8: {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      },
      dimAndValueObject9: {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      },
      dimAndValueObject10: {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      },
      errmsgInnerWarning: false,
      errmsgMonWarning: false,
      innerwarningErrMsg: '请选择运算符',
      monwarningErrMsg: '请选择运算符',
      table: {
        columns: {
          sourceDataSource: 'hidden',
          targetDataSource: 'hidden',
          keepHistory: 'hidden',
          bizDesc: 'hidden',
          crtOrgCode: 'hidden',
          crtDate: 'hidden',
          updUserCode: 'hidden',
          updOrgCode: 'hidden',
          updDate: 'hidden',
          tenant: 'hidden'
        }
      },
      permission: {
        processA: ['indAtomInfo:processA'],
        add: ['indAtomInfo:add'],
        edit: ['indAtomInfo:edit'],
        del: ['indAtomInfo:del'],
        details: ['indAtomInfo:details'],
        workflow: ['indAtomInfo:workflow'],
        batchCheckResult: ['indAtomInfo:batchCheckResult'],
        historyVersion: ['indAtomInfo:historyVersion'],
        cancelInd: ['indAtomInfo:cancelInd'],
        processVerify: ['indAtomInfo:processVerify'],
        historyVersionDetail: ['indAtomInfo:historyVersionDetail']
      },
      rules: {
        bizName: [
          { required: true, message: '指标名称不能为空', trigger: 'blur' },
          { validator: validateStrLenHundred, trigger: 'blur' }
        ],
        ieProp: [
          { required: true, message: '指标类型不能为空', trigger: 'change' }
        ],
        genBizName: [
          { required: true, message: '根指标不能为空', trigger: 'change' }
        ],
        indFirstType: [
          { required: true, message: '指标一级分类不能为空', trigger: 'change' }
        ],
        indSecondType: [
          { required: true, message: '指标二级分类不能为空', trigger: 'change' }
        ],
        businessDept: [
          { required: true, message: '业务属主部门不能为空', trigger: 'change' }
        ],
        indLevel: [
          { required: true, message: '指标层级不能为空', trigger: 'change' }
        ],
        indDefinition: [
          { required: true, message: '指标定义不能为空', trigger: 'blur' },
          { validator: validateStrLenFiveHundred, trigger: 'blur' }
        ],
        indDefRule: [
         /* { required: this.hasCalc, message: '指标口径规则不能为空', trigger: 'blur' },*/
          { required: true, message: '指标口径规则不能为空', trigger: 'blur' },
          { validator: validateStrLenFiveHundred, trigger: 'blur' }
        ],
        indValueRange1: [
          { validator: isArabicFigures, trigger: 'blur' }
        ],
        indValueRange2: [
          { validator: isArabicFigures, trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '币种不能为空', trigger: 'change' }
        ],
        indFrequency: [
          { required: true, message: '指标生成频率不能为空', trigger: 'change' }
        ],
        indCalType: [
          { required: true, message: '度量单位不能为空', trigger: 'change' }
        ],
        indMonField: [
          { required: true, message: '监管属性不能为空', trigger: 'change' }
        ],
        indDataType: [
          { required: true, message: '数据类型不能为空', trigger: 'change' }
        ],
        indDataForm: [
          { max: 10, message: '数据格式不能超过10字', trigger: ['blur', 'change'] }
        ],
        indReference: [
          { max: 50, message: '参考不能超过50字', trigger: ['blur', 'change'] }
        ],
        isAdditionalRecording: [
          { required: true, message: '指标结果是否会补录不能为空', trigger: 'change' }
        ]
        /*,
        dimension1: [
          {required: true, message: '维度1不能为空', trigger: 'change'}
        ],
        dimensionValue1: [
          {required: true, message: '维度值1不能为空', trigger: 'change'}
        ]*/
      },
      dimensionRules: {
        categoryName: [
          { required: true, message: '指标维度名称不能为空', trigger: 'change' }
        ],
        classificationId: [
          { required: true, message: '所属分类不能为空', trigger: 'change' }
        ],
      },
      dimensionValueRules: {
        dimInfoId: [
          { required: true, message: '所属维度不能为空', trigger: 'change' }
        ],
        categoryName: [
          { required: true, message: '指标维度值不能为空', trigger: 'change' }
        ]
      },
      signRules: {
        isSign: [
          { required: true, message: '请选择是否会签', trigger: 'change' }
        ],
        signDeptId: [
          { required: true, message: '请选择会签机构', trigger: 'change' }
        ]
      },
      sourceData: [],
      tableInfo: [],
      atomDimensions: [],
      bizTabCodeDis: false,
      // 计算输日期的页面
      processDialog: false,
      // 传给后台的参数
      processParam: {
        codes: [],
        periodDate: ''
      },
      dateValue: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dimensionArr: [],
      dimensionTitle: '维度',
      dimensionNumber: 2,
      dimensionTmp: null,
      dimensionValueArr: [],
      dimensionValueTitle: '维度值',
      dimensionValueNumber: 2,
      dimensionValueTmp: null,
      showIndDefRule: false,
      showIndHistory: false,
      indInnerWarnValueArr: [1],
      indInnerWarnValueNumber: 1,
      indInnerWarnPassValueArr: [1],
      indInnerWarnPassValueNumber: 1,
      indMonWarnValueArr: [1],
      indMonWarnValueNumber: 1,
      indMonWarnPassValueArr: [1],
      indMonWarnPassValueNumber: 1,
      historyData: [],
      showIndDimensionAdd: false,
      flowData:[],
      showFlow:false,
      dimension: {
        id: null,
        classificationId: null,// 所属分类
        categoryName: null,// 指标维度名称
        remarks: null,// 备注
        serialNo: null
      },
      showIndDimensionValueAdd: false,
      dimensionValue: {
        dimension: null,// 所属维度
        lastLevelDimensionValue: null,// 上级维度值
        dimValue: null,// 指标维度值
        serialNo: null
      },
      renderFunc(h, option) {
        return <span>{ option.label }</span>;
      },
      transferData: [],
      value: [],
      indDefRuleStr: '',
      indDefRuleId: '',
      indDefRuleVal: '',
      genIndArr: [],
      genAndDerivedIndArr: [],
      dimInfoArr: [],
      dimValueArr1: [],
      dimValueArr2: [],
      dimValueArr3: [],
      dimValueArr4: [],
      dimValueArr5: [],
      dimValueArr6: [],
      dimValueArr7: [],
      dimValueArr8: [],
      dimValueArr9: [],
      dimValueArr10: [],
      parentDimValueArr: [],
      classificationArr: [],
      dimValueTmp1: [],
      dimValueTmp2: [],
      dimValueTmp3: [],
      dimValueTmp4: [],
      dimValueTmp5: [],
      dimValueTmp6: [],
      dimValueTmp7: [],
      dimValueTmp8: [],
      dimValueTmp9: [],
      dimValueTmp10: [],

      dimValueTmpName1: [],
      dimValueTmpName2: [],
      dimValueTmpName3: [],
      dimValueTmpName4: [],
      dimValueTmpName5: [],
      dimValueTmpName6: [],
      dimValueTmpName7: [],
      dimValueTmpName8: [],
      dimValueTmpName9: [],
      dimValueTmpName10: [],

      formDialog: false,
      qryIndFirstType: [],
      qryIndSecondType: [],
      formIndFirstType: [],
      formIndSecondType: [],
      formIndModelTable: [],
      formIndModelCols: [],
      formIndAggFunction: [
        {label: "SUM", value: "SUM"},
        {label: "AVG", value: "AVG"},
        {label: "MAX", value: "MAX"},
        {label: "MIN", value: "MIN"}
        ],
      depts:[],
      hisIeId: null,
      errmsgDim1: false,
      errmsgDimV1: false,
      errmsgDim2: false,
      errmsgDimV2: false,
      errmsgDim3: false,
      errmsgDimV3: false,
      errmsgDim4: false,
      errmsgDimV4: false,
      errmsgDim5: false,
      errmsgDimV5: false,
      errmsgDim6: false,
      errmsgDimV6: false,
      errmsgDim7: false,
      errmsgDimV7: false,
      errmsgDim8: false,
      errmsgDimV8: false,
      errmsgDim9: false,
      errmsgDimV9: false,
      errmsgDim10: false,
      errmsgDimV10: false,
      isBizNameContract : true,
      //hasCalc: false
      hasCalc: true,
      isSelfRule: false,
      categorySpan: 6,
      tableSpan: 18,
      zoomDirection: 'left',
      kindredShip:'kindredShip '
    }
  },
  created() {
    this.crud.optShow.del=false
    this.crud.optShow.edit=false
    this.initDimInfos(2)
    //this.initDimValuesChildren()
    this.initDimValues(2)
    this.initClassifications()
    this.initGenAndDerivedInd()
    this.initIndFirstType()
    this.getDepts();
    if(this.query.categoryType == null) {
      this.query.categoryType = 0;
    }
    this.isSelfRule= false
    this.getCurrentDept()
    this.resetQuery()
    this.initIndModelTable()
  },
  mounted() {
    this.query.bizName = this.$route.query.ieName
    this.crud.refresh()
    this.sign.isSign = '0'
    this.sign.signDeptId = null
    this.sign.signDeptName =null
    this.showSignOrg = false
   },
  watch: {
    filterText(val) {
      this.$refs.signOrgTree.filter(val);
    },
    indDefRuleStr(val) {
      if(this.endsWithStr(val)) {
        this.errmsgIndDefRule = true
        this.indDefRuleErr ='口径规则表达式错误'
      } else {
        this.errmsgIndDefRule = false
        this.indDefRuleErr ='指标口径规则不能为空'
      }
    }
  },
  methods: {
    resetQuery(){
      this.crud.resetQuery(false);
      this.query.categoryType = this.categoryType
      this.crud.refresh()
    },
    checkIndDefRule(val) {
      if(this.indDefRuleStr == null || this.indDefRuleStr == '') {
        if(this.form.indDefRule == null || this.form.indDefRule == '') {
          this.indDefRuleErr = '指标口径规则不能为空'
          this.errmsgIndDefRule = true
        } else if (this.form.indDefRule.length > 500){
          this.indDefRuleErr = '长度不能超过500字符'
          this.errmsgIndDefRule = true
        } else {
          this.indDefRuleErr = '指标口径规则不能为空'
          this.errmsgIndDefRule = false
        }
      } else {
        this.indDefRuleErr = '指标口径规则不能为空'
        this.errmsgIndDefRule = false
      }

    },
    closeSignDialog() {
      this.sign.isSign = 0;
      this.sign.signDeptId = ''
      this.sign.signDeptName =null
      this.showSign = false
      this.showSignOrg = false
    },
    changeIsSign(val) {
      this.showSignOrg = val == 1;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    checkSignOrg(data,node) {
      console.debug('======checkSignOrg======',data,node)
      this.sign.signDeptId=node.checkedKeys.join(",")
      this.sign.signDeptName=node.checkedNodes.map(e=>e.label).join(",")

    },
    changeIeProp(val) {
      if(val == 3) {
        this.dimAndValueObject1.isShow = true;
        this.dimAndValueObject2.isShow = true;
      } else {
        this.dimAndValueObject1.isShow = false;
        this.dimAndValueObject2.isShow = false;
      }
      if(val == 2) {
        this.isSelfRule = false
      } else {
        this.isSelfRule = true
      }
      this.changeIsSelfRule(this.isSelfRule)
      /*if(val == 2) {
        if(this.indDefRuleStr == null || this.indDefRuleStr == '') {
          //this.hasCalc = true;
        }else {
          //this.hasCalc = false;
        }
      } else {
        //this.hasCalc = false;
      }*/
    },
    changeContemporaneous(val) {
      if(val) {
        this.form.indContemporaneousValue = val;
        this.form.indYearOnYearIncrement = val;
      }
    },
    changePreviousPeriod(val){
      if(val) {
        this.form.indPreviousPeriodValue = val;
        this.form.indMonthOnMonthIncrement = val;
      }
    },
    changeInitialValue(val){
      if(val) {
        this.form.indInitialValueOfTheYear = val;
        this.form.indYearOnYearIncre = val;
      }
    },
    forceUpdate() {
      this.$forceUpdate()
    },
    genBizNameChange(){
      for (let i = 0; i < Object.keys(this.genIndArr).length; i++) {
        if(this.genIndArr[i].id == this.form.genBizName){
          if(this.genIndArr[i].isAdditionalRecording == true){
            this.warnMsg = true
            this.$message({
              message: '该指标结果可能存在补录，请确认是否引用！',
              type: 'warning'
            });
          }
        }
      }
    },
    validateBizNameContract(){
      let that = this;
      bizNameIsContract(that.form.id,that.form.bizName).then(res => {
        if(res.code == 0) {
          if(res.data) {
            this.$message.error("指标名称重复,请重新输入")
            that.isBizNameContract = false
            return;
          }
          that.isBizNameContract = true
        }else {
          this.$message.error("系统错误")
          that.isBizNameContract = false
        }
      })
    },
    initDimInfos(status) {
      getDimInfos( {size: 100, page: 0,tenant: this.form.tenant,status: status}).then(data => {
        this.dimInfoArr = data.data.records
      })
    },
    initSubDimVal(dimId,treeLevel,status) {
      getDimValues( {size: 100, page: 0,tenant: this.form.tenant,status: status,treeLevel: treeLevel,treeId: dimId}).then(data => {
        this.parentDimValueArr = data.data.records
      })
    },
    initDimVal(dimId,item){
      let _this = this;
      if(item == 1) {
        _this.dimAndValueObject1.dimensionValue = '';
        _this.dimAndValueObject1.dimensionName = '';
        _this.dimValueTmpName1=[]
      } else if(item == 2) {
        _this.dimAndValueObject2.dimensionValue = '';
        _this.dimAndValueObject2.dimensionName = '';
        _this.dimValueTmpName2=[]
      } else if(item == 3) {
        _this.dimAndValueObject3.dimensionValue = '';
        _this.dimAndValueObject3.dimensionName = '';
        _this.dimValueTmpName3=[]
      } else if(item == 4) {
        _this.dimAndValueObject4.dimensionValue = '';
        _this.dimAndValueObject4.dimensionName = '';
        _this.dimValueTmpName4=[]
      } else if(item == 5) {
        _this.dimAndValueObject5.dimensionValue = '';
        _this.dimAndValueObject5.dimensionName = '';
        _this.dimValueTmpName5=[]
      } else if(item == 6) {
        _this.dimAndValueObject6.dimensionValue = '';
        _this.dimAndValueObject6.dimensionName = '';
        _this.dimValueTmpName6=[]
      } else if(item == 7) {
        _this.dimAndValueObject7.dimensionValue = '';
        _this.dimAndValueObject7.dimensionName = '';
        _this.dimValueTmpName7=[]
      } else if(item == 8) {
        _this.dimAndValueObject8.dimensionValue = '';
        _this.dimAndValueObject8.dimensionName = '';
        _this.dimValueTmpName8=[]
      } else if(item == 9) {
        _this.dimAndValueObject9.dimensionValue = '';
        _this.dimAndValueObject9.dimensionName = '';
        _this.dimValueTmpName9=[]
      } else if(item == 10) {
        _this.dimAndValueObject10.dimensionValue = '';
        _this.dimAndValueObject10.dimensionName = '';
        _this.dimValueTmpName10=[]
      }

      this.initDimValuesChildren(dimId,item);
    },
    initDimValuesChildren(dimId,item) {
      let _this = this;
      getDimValuesChildren( {size: 100, page: 0,dimId}).then(data => {
        if(item == 1) {
          _this.dimValueArr1 = data.data
          if (dimId == null || dimId == '') {
            _this.errmsgDim1 = true;
            _this.dimAndValueObject1.dimensionValue = '';
            _this.dimAndValueObject1.dimensionName = '';
            _this.errmsgDimV1 = true;
          }else if(_this.dimAndValueObject1.dimensionValue == null || _this.dimAndValueObject1.dimensionValue == ''){
            _this.errmsgDimV1=true;
            _this.errmsgDim1 = false;
            _this.dimAndValueObject1.dimensionValue = '';
            _this.dimAndValueObject1.dimensionName = '';
          }
        } else if(item == 2) {
          _this.dimValueArr2 = data.data
          if(_this.dimAndValueObject2.dimension == null || _this.dimAndValueObject2.dimension == '')
          {
            _this.errmsgDimV2=false;
            _this.dimAndValueObject2.dimensionValue='';
            _this.dimAndValueObject2.dimensionName='';
          }else if(_this.dimAndValueObject2.dimensionValue == null || _this.dimAndValueObject2.dimensionValue == ''){
            _this.errmsgDimV2=true;
            _this.dimAndValueObject2.dimensionValue = '';
            _this.dimAndValueObject2.dimensionName = '';
          }
        } else if(item == 3) {
          _this.dimValueArr3 = data.data
          if(_this.dimAndValueObject3.dimension == null || _this.dimAndValueObject3.dimension == '')
          {
            _this.errmsgDimV3=false;
            _this.dimAndValueObject3.dimensionValue='';
            _this.dimAndValueObject3.dimensionName='';
          }else if(_this.dimAndValueObject3.dimensionValue == null || _this.dimAndValueObject3.dimensionValue == ''){
            _this.errmsgDimV3=true;
            _this.dimAndValueObject3.dimensionValue = '';
            _this.dimAndValueObject3.dimensionName = '';
          }
        } else if(item == 4) {
          _this.dimValueArr4 = data.data
          if(_this.dimAndValueObject4.dimension == null || _this.dimAndValueObject4.dimension == '')
          {
            _this.errmsgDimV4=false;
            _this.dimAndValueObject4.dimensionValue='';
            _this.dimAndValueObject4.dimensionName='';
          }else if(_this.dimAndValueObject4.dimensionValue == null || _this.dimAndValueObject4.dimensionValue == ''){
            _this.errmsgDimV4=true;
            _this.dimAndValueObject4.dimensionValue = '';
            _this.dimAndValueObject4.dimensionName = '';
          }
        } else if(item == 5) {
          _this.dimValueArr5 = data.data
          if(_this.dimAndValueObject5.dimension == null || _this.dimAndValueObject5.dimension == '')
          {
            _this.errmsgDimV5=false;
            _this.dimAndValueObject5.dimensionValue='';
            _this.dimAndValueObject5.dimensionName='';
          }else if(_this.dimAndValueObject5.dimensionValue == null || _this.dimAndValueObject5.dimensionValue == ''){
            _this.errmsgDimV5=true;
            _this.dimAndValueObject5.dimensionValue = '';
            _this.dimAndValueObject5.dimensionName = '';
          }
        } else if(item == 6) {
          _this.dimValueArr6 = data.data
          if(_this.dimAndValueObject6.dimension == null || _this.dimAndValueObject6.dimension == '')
          {
            _this.errmsgDimV6=false;
            _this.dimAndValueObject6.dimensionValue='';
            _this.dimAndValueObject6.dimensionName='';
          }else if(_this.dimAndValueObject6.dimensionValue == null || _this.dimAndValueObject6.dimensionValue == ''){
            _this.errmsgDimV6=true;
            _this.dimAndValueObject6.dimensionValue = '';
            _this.dimAndValueObject6.dimensionName = '';
          }
        } else if(item == 7) {
          _this.dimValueArr7 = data.data
          if(_this.dimAndValueObject7.dimension == null || _this.dimAndValueObject7.dimension == '')
          {
            _this.errmsgDimV7=false;
            _this.dimAndValueObject7.dimensionValue='';
            _this.dimAndValueObject7.dimensionName='';
          }else if(_this.dimAndValueObject7.dimensionValue == null || _this.dimAndValueObject7.dimensionValue == ''){
            _this.errmsgDimV7=true;
            _this.dimAndValueObject7.dimensionValue = '';
            _this.dimAndValueObject7.dimensionName = '';
          }
        } else if(item == 8) {
          _this.dimValueArr8 = data.data
          if(_this.dimAndValueObject8.dimension == null || _this.dimAndValueObject8.dimension == '')
          {
            _this.errmsgDimV8=false;
            _this.dimAndValueObject8.dimensionValue='';
            _this.dimAndValueObject8.dimensionName='';
          }else if(_this.dimAndValueObject8.dimensionValue == null || _this.dimAndValueObject8.dimensionValue == ''){
            _this.errmsgDimV8=true;
            _this.dimAndValueObject8.dimensionValue = '';
            _this.dimAndValueObject8.dimensionName = '';
          }
        } else if(item == 9) {
          _this.dimValueArr9 = data.data
          if(_this.dimAndValueObject9.dimension == null || _this.dimAndValueObject9.dimension == '')
          {
            _this.errmsgDimV9=false;
            _this.dimAndValueObject9.dimensionValue='';
            _this.dimAndValueObject9.dimensionName='';
          }else if(_this.dimAndValueObject9.dimensionValue == null || _this.dimAndValueObject9.dimensionValue == ''){
            _this.errmsgDimV9=true;
            _this.dimAndValueObject9.dimensionValue = '';
            _this.dimAndValueObject9.dimensionName = '';
          }
        } else if(item == 10) {
          _this.dimValueArr10 = data.data
          if(_this.dimAndValueObject10.dimension == null || _this.dimAndValueObject10.dimension == '')
          {
            _this.errmsgDimV10=false;
            _this.dimAndValueObject10.dimensionValue='';
            _this.dimAndValueObject10.dimensionName='';
          }else if(_this.dimAndValueObject10.dimensionValue == null || _this.dimAndValueObject10.dimensionValue == ''){
            _this.errmsgDimV10=true;
            _this.dimAndValueObject10.dimensionValue = '';
            _this.dimAndValueObject10.dimensionName = '';
          }
        }

      })
    },
    initDimValues(status) {
      getDimValues( {size: 100, page: 0,tenant: this.form.tenant,status: status}).then(data => {
        this.parentDimValueArr = data.data.records
      })
    },
    initClassifications() {
      getClassifications({size: 100, page: 0}).then(data => {
        this.classificationArr = data.data.records
      })
    },
    initGenAndDerivedInd() {
      getAllInds().then(data => {
        this.genAndDerivedIndArr = data.data
        for (let i = 0; i < this.genAndDerivedIndArr.length; i++) {
          this.transferData.push({key: this.genAndDerivedIndArr[i].id + ',' + this.genAndDerivedIndArr[i].bizName+ ',' + this.genAndDerivedIndArr[i].isAdditionalRecording + ',' + this.genAndDerivedIndArr[i].bizCode, label: this.genAndDerivedIndArr[i].bizName})
        }
      })
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
    initIndModelTable() {
      this.formIndModelTable = [];
      getTableList().then(res => {
        if(res.code == 0){
          const data = res.data;
          for(let i=0; i<data.length; i++) {
              this.formIndModelTable.push({id: data[i].objid, label: data[i].tableName, value: data[i].objid});
            }
        }
      });
    },
    initIndModelCols(isChange){
      if(isChange){
        this.form.indModelCols = ''
      }
      this.formIndModelCols = [];
      if(this.form.indModelTable == '' || this.form.indModelTable == null){
        return;
      }
      queryByTableId(this.form.indModelTable).then(res => {
        if(res.code == 0){
          const data = res.data;
          for(let i=0; i<data.length; i++) {
              this.formIndModelCols.push({id: data[i].objid, label: data[i].columnName, value: data[i].objid});
            }
        }
      });
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      //this.crud.optShow.edit = true
      // this.query.ieType = '4'
      return true
    },
    [CRUD.HOOK.afterRefresh]() {
      // getAllSource().then(data => {
      //   this.sourceData = [{ id: 'local', datasourceName: '默认数据源' }].concat(data.data)
      // })
      getGenInd().then(data => {
        this.genIndArr = data.data
      })
    },
    [CRUD.HOOK.beforeToEdit]() {
      this.form.formType= 'edit';
      this.form.serialNo = this.generatorUUID();
      this.initDimInfos(2);
      this.form.indVerifyStatus = this.crud.selections[0].indVerifyStatus
      this.form.indDeployStatus = this.crud.selections[0].indDeployStatus
      this.form.id = this.crud.selections[0].id
      this.form.bizCode = this.crud.selections[0].bizCode
      this.form.ieProp = this.crud.selections[0].ieProp
      this.form.genBizName = this.crud.selections[0].genBizName
      this.form.bizName = this.crud.selections[0].bizName
      this.form.indFirstType = this.crud.selections[0].indFirstType
      this.form.categoryType = this.crud.selections[0].categoryType
      this.initIndSecondType(this.form.indFirstType,'form')
      this.form.indSecondType = this.crud.selections[0].indSecondType
      if(this.form.ieProp == 3) {
        this.dimAndValueObject1.isShow = true
        this.dimAndValueObject1.dimension = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[0] == null? null : this.crud.selections[0].indDimAndValueRelations[0].dimension
        this.dimAndValueObject1.dimensionValue = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[0] == null? null : this.crud.selections[0].indDimAndValueRelations[0].dimensionValue
        if(this.dimAndValueObject1.isShow) {
          this.initDimValuesChildren(this.dimAndValueObject1.dimension,1)
        }
        this.dimAndValueObject1.dimensionName = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[0]==null? null : this.crud.selections[0].indDimAndValueRelations[0].dimensionName

        this.dimAndValueObject2.isShow = true
        this.dimAndValueObject2.dimension = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[1] == null? null : this.crud.selections[0].indDimAndValueRelations[1].dimension
        if(this.dimAndValueObject2.isShow) {
          this.initDimValuesChildren(this.dimAndValueObject2.dimension,2)
        }
        this.dimAndValueObject2.dimensionValue = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[1] == null? null : this.crud.selections[0].indDimAndValueRelations[1].dimensionValue
        this.dimAndValueObject2.dimensionName = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[1]==null? null : this.crud.selections[0].indDimAndValueRelations[1].dimensionName

        this.dimAndValueObject3.isShow = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            false : this.crud.selections[0].indDimAndValueRelations[2]==null? false : true
        this.dimAndValueObject3.dimension = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[2]==null? null : this.crud.selections[0].indDimAndValueRelations[2].dimension
        if(this.dimAndValueObject3.isShow) {
          this.initDimValuesChildren(this.dimAndValueObject3.dimension,3)
        }
        this.dimAndValueObject3.dimensionValue = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[2]==null? null : this.crud.selections[0].indDimAndValueRelations[2].dimensionValue
        this.dimAndValueObject3.dimensionName = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[2]==null? null : this.crud.selections[0].indDimAndValueRelations[2].dimensionName

        this.dimAndValueObject4.isShow = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            false : this.crud.selections[0].indDimAndValueRelations[3]==null? false : true
        this.dimAndValueObject4.dimension = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[3]==null? null : this.crud.selections[0].indDimAndValueRelations[3].dimension
        if(this.dimAndValueObject4.isShow) {
          this.initDimValuesChildren(this.dimAndValueObject4.dimension,4)
        }
        this.dimAndValueObject4.dimensionValue = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[3]==null? null : this.crud.selections[0].indDimAndValueRelations[3].dimensionValue
        this.dimAndValueObject4.dimensionName = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[3]==null? null : this.crud.selections[0].indDimAndValueRelations[3].dimensionName

        this.dimAndValueObject5.isShow = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            false : this.crud.selections[0].indDimAndValueRelations[4]==null? false : true
        this.dimAndValueObject5.dimension = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[4]==null? null : this.crud.selections[0].indDimAndValueRelations[4].dimension
        if(this.dimAndValueObject5.isShow) {
          this.initDimValuesChildren(this.dimAndValueObject5.dimension,5)
        }
        this.dimAndValueObject5.dimensionValue = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[4]==null? null : this.crud.selections[0].indDimAndValueRelations[4].dimensionValue
        this.dimAndValueObject5.dimensionName = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[4]==null? null : this.crud.selections[0].indDimAndValueRelations[4].dimensionName

        this.dimAndValueObject6.isShow = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            false : this.crud.selections[0].indDimAndValueRelations[5]==null? false : true
        this.dimAndValueObject6.dimension = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[5]==null? null : this.crud.selections[0].indDimAndValueRelations[5].dimension
        if(this.dimAndValueObject6.isShow) {
          this.initDimValuesChildren(this.dimAndValueObject6.dimension,6)
        }
        this.dimAndValueObject6.dimensionValue = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[5]==null? null : this.crud.selections[0].indDimAndValueRelations[5].dimensionValue
        this.dimAndValueObject6.dimensionName = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[5]==null? null : this.crud.selections[0].indDimAndValueRelations[5].dimensionName

        this.dimAndValueObject7.isShow = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            false : this.crud.selections[0].indDimAndValueRelations[6]==null? false : true
        this.dimAndValueObject7.dimension = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[6]==null? null : this.crud.selections[0].indDimAndValueRelations[6].dimension
        if(this.dimAndValueObject7.isShow) {
          this.initDimValuesChildren(this.dimAndValueObject7.dimension,7)
        }
        this.dimAndValueObject7.dimensionValue = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[6]==null? null : this.crud.selections[0].indDimAndValueRelations[6].dimensionValue
        this.dimAndValueObject7.dimensionName = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[6]==null? null : this.crud.selections[0].indDimAndValueRelations[6].dimensionName

        this.dimAndValueObject8.isShow = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            false : this.crud.selections[0].indDimAndValueRelations[7]==null? false : true
        this.dimAndValueObject8.dimension = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[7]==null? null : this.crud.selections[0].indDimAndValueRelations[7].dimension
        if(this.dimAndValueObject8.isShow) {
          this.initDimValuesChildren(this.dimAndValueObject8.dimension,8)
        }
        this.dimAndValueObject8.dimensionValue = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[7]==null? null : this.crud.selections[0].indDimAndValueRelations[7].dimensionValue
        this.dimAndValueObject8.dimensionName = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[7]==null? null : this.crud.selections[0].indDimAndValueRelations[7].dimensionName

        this.dimAndValueObject9.isShow = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            false : this.crud.selections[0].indDimAndValueRelations[8]==null? false : true
        this.dimAndValueObject9.dimension = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[8]==null? null : this.crud.selections[0].indDimAndValueRelations[8].dimension
        if(this.dimAndValueObject9.isShow) {
          this.initDimValuesChildren(this.dimAndValueObject9.dimension,9)
        }
        this.dimAndValueObject9.dimensionValue = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[8]==null? null : this.crud.selections[0].indDimAndValueRelations[8].dimensionValue
        this.dimAndValueObject9.dimensionName = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[8]==null? null : this.crud.selections[0].indDimAndValueRelations[8].dimensionName

        this.dimAndValueObject10.isShow = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            false : this.crud.selections[0].indDimAndValueRelations[9]==null? false : true
        this.dimAndValueObject10.dimension = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[9]==null? null : this.crud.selections[0].indDimAndValueRelations[9].dimension
        if(this.dimAndValueObject10.isShow) {
          this.initDimValuesChildren(this.dimAndValueObject10.dimension,10)
        }
        this.dimAndValueObject10.dimensionValue = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[9]==null? null : this.crud.selections[0].indDimAndValueRelations[9].dimensionValue
        this.dimAndValueObject10.dimensionName = this.crud.selections[0].indDimAndValueRelations.length == 0 ?
            null : this.crud.selections[0].indDimAndValueRelations[9]==null? null : this.crud.selections[0].indDimAndValueRelations[9].dimensionName

      }

      this.form.businessDept = this.crud.selections[0].businessDept
      this.form.indLevel = this.crud.selections[0].indLevel
      this.form.isDeptQuery = this.crud.selections[0].isDeptQuery
      this.form.isAdditionalRecording = this.crud.selections[0].isAdditionalRecording? 'true':'false'
      this.form.indDefinition = this.crud.selections[0].indDefinition
      let defRule = this.crud.selections[0].indDefRule;
      if (defRule != null) {
        let defRuleArr = defRule.split("||");
        if (Array.isArray(defRuleArr) && defRuleArr.length >= 2) {
          this.form.indDefRule = defRuleArr[0]
        } else {
          this.form.indDefRule = defRule;
        }
      }
      this.form.indDefRuleStr = this.crud.selections[0].indDefRuleStr;
      this.indDefRuleStr = this.crud.selections[0].indDefRuleStr;
      if(this.indDefRuleStr == null || this.indDefRuleStr == '') {
        this.isSelfRule = true
      } else {
        this.isSelfRule = false
      }
      if(this.crud.selections[0].indDefRuleVal !=null && this.crud.selections[0].indDefRuleVal != "") {
        this.form.indDefRuleVal = this.crud.selections[0].indDefRuleVal;
        this.form.indDefRuleId = this.crud.selections[0].indDefRuleId;
        this.indDefRuleVal = this.crud.selections[0].indDefRuleVal;
        this.indDefRuleId = this.crud.selections[0].indDefRuleId;
      } else {
        if (defRule != null) {
          let defRuleArr = defRule.split("||");
          if (Array.isArray(defRuleArr) && defRuleArr.length >= 2) {
            this.form.indDefRuleVal = defRuleArr[1];
            this.form.indDefRuleId = defRuleArr[2];
            this.indDefRuleVal = defRuleArr[1];
            this.indDefRuleId = defRuleArr[2];
          }
        }
      }
      this.form.indValueRange1 = this.crud.selections[0].indValueRange1
      this.form.indValueRange2 = this.crud.selections[0].indValueRange2
      this.form.indInnerWarnValue = this.crud.selections[0].indInnerWarnValue
      this.form.indMonWarnValue = this.crud.selections[0].indMonWarnValue
      this.form.indInnerWarnFlg = this.crud.selections[0].indInnerWarnFlg
      this.form.indMonWarnFlg = this.crud.selections[0].indMonWarnFlg
      if(this.form.indInnerWarnValue != null && this.form.indInnerWarnValue != ''
          && (this.form.indInnerWarnFlg == null || this.form.indInnerWarnFlg == '')) {
        this.errmsgInnerWarning = true
      }
      if(this.form.indMonWarnValue != null && this.form.indMonWarnValue != ''
          && (this.form.indMonWarnFlg == null || this.form.indMonWarnFlg == '')) {
        this.errmsgMonWarning = true
      }

      this.form.currency = this.crud.selections[0].currency == null? null : Array.isArray(this.crud.selections[0].currency)? this.crud.selections[0].currency : this.crud.selections[0].currency.split(',')
      this.form.indValueType = this.crud.selections[0].indValueType
      this.form.indFrequency = this.crud.selections[0].indFrequency == null? null : Array.isArray(this.crud.selections[0].indFrequency)? this.crud.selections[0].indFrequency : this.crud.selections[0].indFrequency.split(',')
      this.form.indCalType = this.crud.selections[0].indCalType
      this.form.indSafeLevel = this.crud.selections[0].indSafeLevel
      this.form.indMonField = this.crud.selections[0].indMonField
      this.form.indProcessSys = this.crud.selections[0].indProcessSys
      this.form.indDataType = this.crud.selections[0].indDataType
      this.form.indDataForm = this.crud.selections[0].indDataForm
      this.form.indReference = this.crud.selections[0].indReference
      this.form.isRealTimeProcess = this.crud.selections[0].isRealTimeProcess
      this.form.indCurrentValue = this.crud.selections[0].indCurrentValue
      this.form.indContemporaneousValue = this.crud.selections[0].indContemporaneousValue
      this.form.indYearOnYearIncrement = this.crud.selections[0].indYearOnYearIncrement
      this.form.indYearOnYearGrowth = this.crud.selections[0].indYearOnYearGrowth
      this.form.indPreviousPeriodValue = this.crud.selections[0].indPreviousPeriodValue
      this.form.indMonthOnMonthIncrement = this.crud.selections[0].indMonthOnMonthIncrement
      this.form.indMonthOnMonthGrowth = this.crud.selections[0].indMonthOnMonthGrowth
      this.form.indInitialValueOfTheYear = this.crud.selections[0].indInitialValueOfTheYear
      this.form.indYearOnYearIncre = this.crud.selections[0].indYearOnYearIncre
      this.form.indIncreaseOverTheBeginningOfTheYear = this.crud.selections[0].indIncreaseOverTheBeginningOfTheYear
      this.form.indVerifyId = this.crud.selections[0].indVerifyId
      if(this.form.tenant == null) {
        this.form.tenant = this.crud.selections[0].tenant
      }

      // getAllSource().then(data => {
      //   this.sourceData = [{ id: 'local', datasourceName: '默认数据源' }].concat(data.data)
      // })
      // getTablesById(this.form.targetDataSource).then(data => {
      //   this.tableInfo = data.data
      // })
    },
    [CRUD.HOOK.beforeToDetail](data) {
      this.form.id = data.form.id
      this.form.bizCode = data.form.bizCode
      this.form.ieProp = data.form.ieProp
      this.form.genBizName = data.form.genBizName
      this.form.bizName = data.form.bizName
      this.form.indFirstType = data.form.indFirstType
      this.initIndSecondType(this.form.indFirstType, 'form')
      this.form.indSecondType = data.form.indSecondType
      this.form.categoryType = data.form.categoryType
      this.dimAndValueObject1.isShow = data.form.indDimAndValueRelations.length == 0 ?
          false : data.form.indDimAndValueRelations[0] == null ? false : true
      this.dimAndValueObject1.dimension = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[0] == null ? null : data.form.indDimAndValueRelations[0].dimension
      this.dimAndValueObject1.dimensionValue = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[0] == null ? null : data.form.indDimAndValueRelations[0].dimensionValue
      this.dimAndValueObject1.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[0] == null ? null : data.form.indDimAndValueRelations[0].dimensionName

      this.dimAndValueObject2.isShow = data.form.indDimAndValueRelations.length == 0 ?
          false : data.form.indDimAndValueRelations[1] == null ? false : true
      this.dimAndValueObject2.dimension = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[1] == null ? null : data.form.indDimAndValueRelations[1].dimension
      this.dimAndValueObject2.dimensionValue = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[1] == null ? null : data.form.indDimAndValueRelations[1].dimensionValue
      this.dimAndValueObject2.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[1] == null ? null : data.form.indDimAndValueRelations[1].dimensionName

      this.dimAndValueObject3.isShow = data.form.indDimAndValueRelations.length == 0 ?
          false : data.form.indDimAndValueRelations[2] == null ? false : true
      this.dimAndValueObject3.dimension = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[2] == null ? null : data.form.indDimAndValueRelations[2].dimension
      this.dimAndValueObject3.dimensionValue = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[2] == null ? null : data.form.indDimAndValueRelations[2].dimensionValue
      this.dimAndValueObject3.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[2] == null ? null : data.form.indDimAndValueRelations[2].dimensionName
      this.dimAndValueObject3.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[2] == null ? null : data.form.indDimAndValueRelations[2].dimensionName

      this.dimAndValueObject4.isShow = data.form.indDimAndValueRelations.length == 0 ?
          false : data.form.indDimAndValueRelations[3] == null ? false : true
      this.dimAndValueObject4.dimension = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[3] == null ? null : data.form.indDimAndValueRelations[3].dimension
      this.dimAndValueObject4.dimensionValue = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[3] == null ? null : data.form.indDimAndValueRelations[3].dimensionValue
      this.dimAndValueObject4.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[3] == null ? null : data.form.indDimAndValueRelations[3].dimensionName

      this.dimAndValueObject5.isShow = data.form.indDimAndValueRelations.length == 0 ?
          false : data.form.indDimAndValueRelations[4] == null ? false : true
      this.dimAndValueObject5.dimension = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[4] == null ? null : data.form.indDimAndValueRelations[4].dimension
      this.dimAndValueObject5.dimensionValue = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[4] == null ? null : data.form.indDimAndValueRelations[4].dimensionValue
      this.dimAndValueObject5.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[4] == null ? null : data.form.indDimAndValueRelations[4].dimensionName

      this.dimAndValueObject6.isShow = data.form.indDimAndValueRelations.length == 0 ?
          false : data.form.indDimAndValueRelations[5] == null ? false : true
      this.dimAndValueObject6.dimension = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[5] == null ? null : data.form.indDimAndValueRelations[5].dimension
      this.dimAndValueObject6.dimensionValue = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[5] == null ? null : data.form.indDimAndValueRelations[5].dimensionValue
      this.dimAndValueObject6.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[5] == null ? null : data.form.indDimAndValueRelations[5].dimensionName

      this.dimAndValueObject7.isShow = data.form.indDimAndValueRelations.length == 0 ?
          false : data.form.indDimAndValueRelations[6] == null ? false : true
      this.dimAndValueObject7.dimension = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[6] == null ? null : data.form.indDimAndValueRelations[6].dimension
      this.dimAndValueObject7.dimensionValue = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[6] == null ? null : data.form.indDimAndValueRelations[6].dimensionValue
      this.dimAndValueObject7.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[6] == null ? null : data.form.indDimAndValueRelations[6].dimensionName

      this.dimAndValueObject8.isShow = data.form.indDimAndValueRelations.length == 0 ?
          false : data.form.indDimAndValueRelations[7] == null ? false : true
      this.dimAndValueObject8.dimension = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[7] == null ? null : data.form.indDimAndValueRelations[7].dimension
      this.dimAndValueObject8.dimensionValue = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[7] == null ? null : data.form.indDimAndValueRelations[7].dimensionValue
      this.dimAndValueObject8.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[7] == null ? null : data.form.indDimAndValueRelations[7].dimensionName

      this.dimAndValueObject9.isShow = data.form.indDimAndValueRelations.length == 0 ?
          false : data.form.indDimAndValueRelations[8] == null ? false : true
      this.dimAndValueObject9.dimension = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[8] == null ? null : data.form.indDimAndValueRelations[8].dimension
      this.dimAndValueObject9.dimensionValue = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[8] == null ? null : data.form.indDimAndValueRelations[8].dimensionValue
      this.dimAndValueObject9.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[8] == null ? null : data.form.indDimAndValueRelations[8].dimensionName

      this.dimAndValueObject10.isShow = data.form.indDimAndValueRelations.length == 0 ?
          false : data.form.indDimAndValueRelations[9] == null ? false : true
      this.dimAndValueObject10.dimension = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[9] == null ? null : data.form.indDimAndValueRelations[9].dimension
      this.dimAndValueObject10.dimensionValue = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[9] == null ? null : data.form.indDimAndValueRelations[9].dimensionValue
      this.dimAndValueObject10.dimensionName = data.form.indDimAndValueRelations.length == 0 ?
          null : data.form.indDimAndValueRelations[9] == null ? null : data.form.indDimAndValueRelations[9].dimensionName

      this.form.businessDept = data.form.businessDept
      this.form.indLevel = data.form.indLevel
      this.form.isDeptQuery = data.form.isDeptQuery
      this.form.isAdditionalRecording = data.form.isAdditionalRecording? 'true':'false'
      this.form.indDefinition = data.form.indDefinition
      //this.form.indDefRule = data.form.indDefRule
      this.form.indValueRange1 = data.form.indValueRange1
      this.form.indValueRange2 = data.form.indValueRange2
      this.form.indInnerWarnValue = data.form.indInnerWarnValue
      this.form.indMonWarnValue = data.form.indMonWarnValue
      this.form.currency = data.form.currency == null ? null : Array.isArray(data.form.currency) ? data.form.currency : data.form.currency.split(",")
      this.form.indAggFunction = data.form.indAggFunction
      this.form.indModelTable = data.form.indModelTable
      this.initIndModelCols(false)
      this.form.indModelCols = data.form.indModelCols
      this.form.indValueType = data.form.indValueType
      this.form.indFrequency = data.form.indFrequency == null ? null : Array.isArray(data.form.indFrequency) ? data.form.indFrequency : data.form.indFrequency.split(",")
      this.form.indCalType = data.form.indCalType
      this.form.indSafeLevel = data.form.indSafeLevel
      this.form.indMonField = data.form.indMonField
      this.form.indProcessSys = data.form.indProcessSys
      this.form.indDataType = data.form.indDataType
      this.form.indDataForm = data.form.indDataForm
      this.form.indReference = data.form.indReference
      this.form.isRealTimeProcess = data.form.isRealTimeProcess
      this.form.indCurrentValue = data.form.indCurrentValue
      this.form.indContemporaneousValue = data.form.indContemporaneousValue
      this.form.indYearOnYearIncrement = data.form.indYearOnYearIncrement
      this.form.indYearOnYearGrowth = data.form.indYearOnYearGrowth
      this.form.indPreviousPeriodValue = data.form.indPreviousPeriodValue
      this.form.indMonthOnMonthIncrement = data.form.indMonthOnMonthIncrement
      this.form.indMonthOnMonthGrowth = data.form.indMonthOnMonthGrowth
      this.form.indInitialValueOfTheYear = data.form.indInitialValueOfTheYear
      this.form.indYearOnYearIncre = data.form.indYearOnYearIncre
      this.form.indIncreaseOverTheBeginningOfTheYear = data.form.indIncreaseOverTheBeginningOfTheYear
      this.form.indVerifyStatus = data.form.indVerifyStatus
      this.form.indDeployStatus = data.form.indDeployStatus
      this.form.indVerifyId = data.form.indVerifyId
      this.form.tenant = data.form.tenant

      let defRule = data.form.indDefRule;
      if (defRule != null) {
        let defRuleArr = defRule.split("||");
        if (Array.isArray(defRuleArr) && defRuleArr.length >= 2) {
          this.form.indDefRule = defRuleArr[0]
        } else {
          this.form.indDefRule = defRule;
        }
      }
      this.form.indDefRuleStr = data.form.indDefRuleStr;
      this.indDefRuleStr = data.form.indDefRuleStr;
      if(this.indDefRuleStr == null || this.indDefRuleStr == '') {
        this.isSelfRule = true
      } else {
        this.isSelfRule = false
      }
      if(data.form.indDefRuleVal !=null && data.form.indDefRuleVal != "") {
        this.form.indDefRuleVal = data.form.indDefRuleVal;
        this.form.indDefRuleId = data.form.indDefRuleId;
        this.indDefRuleVal = data.form.indDefRuleVal;
        this.indDefRuleId = data.form.indDefRuleId;
      } else {
        if (defRule != null) {
          let defRuleArr = defRule.split("||");
          if (Array.isArray(defRuleArr) && defRuleArr.length >= 2) {
            this.form.indDefRuleVal = defRuleArr[1];
            this.form.indDefRuleId = defRuleArr[2];
            this.indDefRuleVal = defRuleArr[1];
            this.indDefRuleId = defRuleArr[2];
          }
        }
      }
    },
    [CRUD.HOOK.beforeSubmit]() {
      // if (this.form.atomDimensions == null) {
      //   this.crud.notify('请进行维度管理', CRUD.NOTIFICATION_TYPE.ERROR)
      //   return false
      // }
      if(!this.isBizNameContract) {
        this.$message.error("指标名称重复,请重新输入");
        return false;
      }
      //对新增状态进行参数设置
      this.form.indDimAndValueRelations = [];
      if (this.crud.status.add == CRUD.STATUS.PREPARED) {
        this.form.indFrequency = this.form.indFrequency == null? null : Array.isArray(this.form.indFrequency)? this.form.indFrequency.join(",") : this.form.indFrequency
        this.form.currency = this.form.currency == null? null : Array.isArray(this.form.currency)? this.form.currency.join(",") : this.form.currency
        if(this.form.ieProp == 3) {
          if (this.dimAndValueObject1.isShow) {
            this.errmsgDim1 = this.dimAndValueObject1.dimension == null || this.dimAndValueObject1.dimension == '';
            this.errmsgDimV1 = this.dimAndValueObject1.dimensionValue == null || this.dimAndValueObject1.dimensionValue == '';
            if (this.errmsgDim1 || this.errmsgDimV1) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject1)
          }
          if (this.dimAndValueObject2.isShow) {
            this.errmsgDimV2 = this.dimAndValueObject2.dimension != null && this.dimAndValueObject2.dimension != ''
                && (this.dimAndValueObject2.dimensionValue == null || this.dimAndValueObject2.dimensionValue == '');
            if (this.errmsgDim2 || this.errmsgDimV2) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject2)
          }
          if (this.dimAndValueObject3.isShow) {
            this.errmsgDimV3 = this.dimAndValueObject3.dimension != null && this.dimAndValueObject3.dimension != ''
                && (this.dimAndValueObject3.dimensionValue == null || this.dimAndValueObject3.dimensionValue == '');
            if (this.errmsgDim3 || this.errmsgDimV3) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject3)
          }
          if (this.dimAndValueObject4.isShow) {
            this.errmsgDimV4 = this.dimAndValueObject4.dimension != null && this.dimAndValueObject4.dimension != ''
                && (this.dimAndValueObject4.dimensionValue == null || this.dimAndValueObject4.dimensionValue == '');
            if (this.errmsgDim4 || this.errmsgDimV4) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject4)
          }
          if (this.dimAndValueObject5.isShow) {
            this.errmsgDimV5 = this.dimAndValueObject5.dimension != null && this.dimAndValueObject5.dimension != ''
                && (this.dimAndValueObject5.dimensionValue == null || this.dimAndValueObject5.dimensionValue == '');
            if (this.errmsgDim5 || this.errmsgDimV5) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject5)
          }
          if (this.dimAndValueObject6.isShow) {
            this.errmsgDimV6 = this.dimAndValueObject6.dimension != null && this.dimAndValueObject6.dimension != ''
                && (this.dimAndValueObject6.dimensionValue == null || this.dimAndValueObject6.dimensionValue == '');
            if (this.errmsgDim6 || this.errmsgDimV6) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject6)
          }
          if (this.dimAndValueObject7.isShow) {
            this.errmsgDimV7 = this.dimAndValueObject7.dimension != null && this.dimAndValueObject7.dimension != ''
                && (this.dimAndValueObject7.dimensionValue == null || this.dimAndValueObject7.dimensionValue == '');
            if (this.errmsgDim7 || this.errmsgDimV7) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject7)
          }
          if (this.dimAndValueObject8.isShow) {
            this.errmsgDimV8 = this.dimAndValueObject8.dimension != null && this.dimAndValueObject8.dimension != ''
                && (this.dimAndValueObject8.dimensionValue == null || this.dimAndValueObject8.dimensionValue == '');
            if (this.errmsgDim8 || this.errmsgDimV8) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject8)
          }
          if (this.dimAndValueObject9.isShow) {
            this.errmsgDimV9 = this.dimAndValueObject9.dimension != null && this.dimAndValueObject9.dimension != ''
                && (this.dimAndValueObject9.dimensionValue == null || this.dimAndValueObject9.dimensionValue == '');
            if (this.errmsgDim9 || this.errmsgDimV9) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject9)
          }
          if (this.dimAndValueObject10.isShow) {
            this.errmsgDimV10 = this.dimAndValueObject10.dimension != null && this.dimAndValueObject10.dimension != ''
                && (this.dimAndValueObject10.dimensionValue == null || this.dimAndValueObject10.dimensionValue == '');
            if (this.errmsgDim10 || this.errmsgDimV10) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject10)
          }
        } else {
          this.form.genBizName = null;
        }
        if(this.form.indInnerWarnValue != null && this.form.indInnerWarnValue != ''
            && (this.form.indInnerWarnFlg == null || this.form.indInnerWarnFlg == '')) {
          this.errmsgInnerWarning = true
        }
        if(this.form.indMonWarnValue != null && this.form.indMonWarnValue != ''
            && (this.form.indMonWarnFlg == null || this.form.indMonWarnFlg == '')) {
          this.errmsgMonWarning = true
        }
        if(this.errmsgInnerWarning || this.errmsgMonWarning) {
          return false;
        }
        if(this.form.ieProp == 2) {
          if(this.indDefRuleStr == null || this.indDefRuleStr == '') {
            if(this.form.indDefRule == null || this.form.indDefRule == '') {
              this.indDefRuleErr ='指标口径规则不能为空'
              this.errmsgIndDefRule = true
              return false
            } else if(this.form.indDefRule.length > 500) {
              this.indDefRuleErr ='长度不能超过500字符'
              this.errmsgIndDefRule = true
              return false;
            } else {
              this.indDefRuleErr ='指标口径规则不能为空'
              this.errmsgIndDefRule = false
            }
          } else {
            if(this.endsWithStr(this.indDefRuleStr)) {
              this.indDefRuleErr ='口径规则表达式错误'
              this.errmsgIndDefRule = true
              return false
            } else {
              this.indDefRuleErr ='指标口径规则不能为空'
              this.errmsgIndDefRule = false
            }
          }
          this.form.indDefRule = (this.form.indDefRule + "||" + this.indDefRuleVal + "||" + this.indDefRuleId)
          this.form.indDefRuleVal = this.indDefRuleVal;
          this.form.indDefRuleStr = this.indDefRuleStr;
          this.form.indDefRuleId = this.indDefRuleId;

        } else {
          this.indDefRuleErr ='指标口径规则不能为空'
          this.errmsgIndDefRule = false
        }
        console.log('这里是新增参数编辑')
      } else if (this.crud.status.edit == CRUD.STATUS.PREPARED) {
        this.form.indFrequency = this.form.indFrequency == null? null : Array.isArray(this.form.indFrequency)? this.form.indFrequency.join(",") : this.form.indFrequency
        this.form.currency = this.form.currency == null? null : Array.isArray(this.form.currency)? this.form.currency.join(",") : this.form.currency
        //维度和维度值
        console.log(this.form.indDimAndValueRelations)
        //this.form.indDimAndValueRelations = [];
        if(this.form.ieProp == 3) {
          if (this.dimAndValueObject1.isShow) {
            this.errmsgDim1 = this.dimAndValueObject1.dimension == null || this.dimAndValueObject1.dimension == '';
            this.errmsgDimV1 = this.dimAndValueObject1.dimensionValue == null || this.dimAndValueObject1.dimensionValue == '';
            if (this.errmsgDim1 || this.errmsgDimV1) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject1)
          }
          if (this.dimAndValueObject2.isShow) {
            this.errmsgDimV2 = this.dimAndValueObject2.dimension != null && this.dimAndValueObject2.dimension != ''
                && (this.dimAndValueObject2.dimensionValue == null || this.dimAndValueObject2.dimensionValue == '');
            if (this.errmsgDim2 || this.errmsgDimV2) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject2)
          }
          if (this.dimAndValueObject3.isShow) {
            this.errmsgDimV3 = this.dimAndValueObject3.dimension != null && this.dimAndValueObject3.dimension != ''
                && (this.dimAndValueObject3.dimensionValue == null || this.dimAndValueObject3.dimensionValue == '');
            if (this.errmsgDim3 || this.errmsgDimV3) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject3)
          }
          if (this.dimAndValueObject4.isShow) {
            this.errmsgDimV4 = this.dimAndValueObject4.dimension != null && this.dimAndValueObject4.dimension != ''
                && (this.dimAndValueObject4.dimensionValue == null || this.dimAndValueObject4.dimensionValue == '');
            if (this.errmsgDim4 || this.errmsgDimV4) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject4)
          }
          if (this.dimAndValueObject5.isShow) {
            this.errmsgDimV5 = this.dimAndValueObject5.dimension != null && this.dimAndValueObject5.dimension != ''
                && (this.dimAndValueObject5.dimensionValue == null || this.dimAndValueObject5.dimensionValue == '');
            if (this.errmsgDim5 || this.errmsgDimV5) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject5)
          }
          if (this.dimAndValueObject6.isShow) {
            this.errmsgDimV6 = this.dimAndValueObject6.dimension != null && this.dimAndValueObject6.dimension != ''
                && (this.dimAndValueObject6.dimensionValue == null || this.dimAndValueObject6.dimensionValue == '');
            if (this.errmsgDim6 || this.errmsgDimV6) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject6)
          }
          if (this.dimAndValueObject7.isShow) {
            this.errmsgDimV7 = this.dimAndValueObject7.dimension != null && this.dimAndValueObject7.dimension != ''
                && (this.dimAndValueObject7.dimensionValue == null || this.dimAndValueObject7.dimensionValue == '');
            if (this.errmsgDim7 || this.errmsgDimV7) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject7)
          }
          if (this.dimAndValueObject8.isShow) {
            this.errmsgDimV8 = this.dimAndValueObject8.dimension != null && this.dimAndValueObject8.dimension != ''
                && (this.dimAndValueObject8.dimensionValue == null || this.dimAndValueObject8.dimensionValue == '');
            if (this.errmsgDim8 || this.errmsgDimV8) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject8)
          }
          if (this.dimAndValueObject9.isShow) {
            this.errmsgDimV9 = this.dimAndValueObject9.dimension != null && this.dimAndValueObject9.dimension != ''
                && (this.dimAndValueObject9.dimensionValue == null || this.dimAndValueObject9.dimensionValue == '');
            if (this.errmsgDim9 || this.errmsgDimV9) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject9)
          }
          if (this.dimAndValueObject10.isShow) {
            this.errmsgDimV10 = this.dimAndValueObject10.dimension != null && this.dimAndValueObject10.dimension != ''
                && (this.dimAndValueObject10.dimensionValue == null || this.dimAndValueObject10.dimensionValue == '');
            if (this.errmsgDim10 || this.errmsgDimV10) {
              return false;
            }
            this.form.indDimAndValueRelations.push(this.dimAndValueObject10)
          }
        } else {
          this.form.genBizName = null;
        }
        if(this.form.indInnerWarnValue != null && this.form.indInnerWarnValue != ''
            && (this.form.indInnerWarnFlg == null || this.form.indInnerWarnFlg == '')) {
          this.errmsgInnerWarning = true
        }
        if(this.form.indMonWarnValue != null && this.form.indMonWarnValue != ''
            && (this.form.indMonWarnFlg == null || this.form.indMonWarnFlg == '')) {
          this.errmsgMonWarning = true
        }
        if(this.errmsgInnerWarning || this.errmsgMonWarning) {
          return false;
        }
        if(this.form.ieProp == 2) {
          if(this.indDefRuleStr == null || this.indDefRuleStr == '') {
            if(this.form.indDefRule == null || this.form.indDefRule == '') {
              this.indDefRuleErr ='指标口径规则不能为空'
              this.errmsgIndDefRule = true
              return false
            } else {
              this.indDefRuleErr ='指标口径规则不能为空'
              this.errmsgIndDefRule = false
            }
          } else {
            if(this.endsWithStr(this.indDefRuleStr)) {
              this.indDefRuleErr ='口径规则表达式错误'
              this.errmsgIndDefRule = true
              return false
            } else {
              this.indDefRuleErr ='指标口径规则不能为空'
              this.errmsgIndDefRule = false
            }
          }
          this.form.indDefRule = (this.form.indDefRule + "||" + this.indDefRuleVal + "||" + this.indDefRuleId)
          this.form.indDefRuleVal = this.indDefRuleVal;
          this.form.indDefRuleStr = this.indDefRuleStr;
          this.form.indDefRuleId = this.indDefRuleId;
        } else {
          this.indDefRuleErr ='指标口径规则不能为空'
          this.errmsgIndDefRule = false
        }
      }
    },
    [CRUD.HOOK.beforeToAdd]() {
      if (!this.form.categoryId) {
        this.crud.notify('请选择分类', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      if (this.form.categoryId == '0') {
        this.crud.notify('根节点不能添加', CRUD.NOTIFICATION_TYPE.ERROR)
        return false
      }
      this.form.formType= 'add';
      this.form.serialNo = this.generatorUUID();
      this.form.categoryType = this.type
      this.form.indDimAndValueRelations = []
      this.indDefRuleStr = ''
      this.indDefRuleVal = ''
      this.indDefRuleId = ''
      this.getCurrentDept()

      this.cleanDimAndVal();
      this.form.indModelCols = ''
      this.formIndModelCols = []
    },
    cleanDimAndVal() {
      this.dimAndValueObject1 = {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      }
      this.dimAndValueObject2 = {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      }
      this.dimAndValueObject3 = {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      }
      this.dimAndValueObject4 = {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      }
      this.dimAndValueObject5 = {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      }
      this.dimAndValueObject6 = {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      }
      this.dimAndValueObject7 = {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      }
      this.dimAndValueObject8 = {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      }
      this.dimAndValueObject9 = {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      }
      this.dimAndValueObject10 = {
        isShow: false,
        dimension: null,
        dimensionValue: null,
        dimensionName: null
      }
    },
    // 历史版本
    toSelectHistory(data) {
      this.showIndHistory = true
      //this.hisIeId = data.id;
      //this.historyData.push(data)
      getHisList(data.id).then(res => {
        if(res.code == 0) {
          this.historyData=res.data.records
          console.log(this.historyData)

        }
      })
    },
    toSelectFlow(data) {
      this.showFlow = true
      /*approveDetailByBusinessKey(qs.stringify({businessKey:data.id})).then(res => {
        //审批流程
        this.flowData = res.data
      })*/
      approveDetailByOriginalInstId(qs.stringify({originalInstId:data.indVerifyId})).then(res => {
        //审批流程
        this.flowData = res.data
      })
    },
    toResult(data){
      this.$router.push({path: 'result/index',query:{ieName:data.bizName}});
    },
    // 历史详情
    toSelectHistoryDetail(data) {
      const _thisAtom = this.$refs.atomPage
      _thisAtom.form = data
      _thisAtom.title = data.bizName + '[' + data.bizCode + ']历史详情'
      const param = {
        bizCode: data.bizCode,
        keepHistory: data.keepHistory
      }
      getDimensions(param).then(data => {
        _thisAtom.atomDimensions = data.data
      })
      getDimInfo().then(data => {
        _thisAtom.dimensions = data.data
      })
      // 获取数据源
      getAllSource().then(data => {
        _thisAtom.sourceData = [{ id: 'local', datasourceName: '默认数据源' }].concat(data.data)
      })
      _thisAtom.form.currency = data.currency == null ? null : Array.isArray(data.currency) ? data.currency : data.currency.split(",")
      _thisAtom.form.indValueType = data.indValueType
      _thisAtom.form.indFrequency = data.indFrequency == null ? null : Array.isArray(data.indFrequency) ? data.indFrequency : data.indFrequency.split(",")

      _thisAtom.dimAndValueObject1.isShow = data.indDimAndValueRelations.length == 0 ?
          false : data.indDimAndValueRelations[0]==null? false : true
      _thisAtom.dimAndValueObject1.dimension = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[0]==null? null : data.indDimAndValueRelations[0].dimension
      _thisAtom.dimAndValueObject1.dimensionValue = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[0]==null? null : data.indDimAndValueRelations[0].dimensionValue
      _thisAtom.dimAndValueObject1.dimensionName = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[0]==null? null : data.indDimAndValueRelations[0].dimensionName

      _thisAtom.dimAndValueObject2.isShow = data.indDimAndValueRelations.length == 0 ?
          false : data.indDimAndValueRelations[1]==null? false : true
      _thisAtom.dimAndValueObject2.dimension = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[1]==null? null : data.indDimAndValueRelations[1].dimension
      _thisAtom.dimAndValueObject2.dimensionValue = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[1]==null? null : data.indDimAndValueRelations[1].dimensionValue
      _thisAtom.dimAndValueObject2.dimensionName = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[1]==null? null : data.indDimAndValueRelations[1].dimensionName

      _thisAtom.dimAndValueObject3.isShow = data.indDimAndValueRelations.length == 0 ?
          false : data.indDimAndValueRelations[2]==null? false : true
      _thisAtom.dimAndValueObject3.dimension = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[2]==null? null : data.indDimAndValueRelations[2].dimension
      _thisAtom.dimAndValueObject3.dimensionValue = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[2]==null? null : data.indDimAndValueRelations[2].dimensionValue
      _thisAtom.dimAndValueObject3.dimensionName = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[2]==null? null : data.indDimAndValueRelations[2].dimensionName

      _thisAtom.dimAndValueObject4.isShow = data.indDimAndValueRelations.length == 0 ?
          false : data.indDimAndValueRelations[3]==null? false : true
      _thisAtom.dimAndValueObject4.dimension = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[3]==null? null : data.indDimAndValueRelations[3].dimension
      _thisAtom.dimAndValueObject4.dimensionValue = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[3]==null? null : data.indDimAndValueRelations[3].dimensionValue
      _thisAtom.dimAndValueObject4.dimensionName = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[3]==null? null : data.indDimAndValueRelations[3].dimensionName

      _thisAtom.dimAndValueObject5.isShow = data.indDimAndValueRelations.length == 0 ?
          false : data.indDimAndValueRelations[4]==null? false : true
      _thisAtom.dimAndValueObject5.dimension = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[4]==null? null : data.indDimAndValueRelations[4].dimension
      _thisAtom.dimAndValueObject5.dimensionValue = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[4]==null? null : data.indDimAndValueRelations[4].dimensionValue
      _thisAtom.dimAndValueObject5.dimensionName = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[4]==null? null : data.indDimAndValueRelations[4].dimensionName

      _thisAtom.dimAndValueObject6.isShow = data.indDimAndValueRelations.length == 0 ?
          false : data.indDimAndValueRelations[5]==null? false : true
      _thisAtom.dimAndValueObject6.dimension = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[5]==null? null : data.indDimAndValueRelations[5].dimension
      _thisAtom.dimAndValueObject6.dimensionValue = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[5]==null? null : data.indDimAndValueRelations[5].dimensionValue
      _thisAtom.dimAndValueObject6.dimensionName = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[5]==null? null : data.indDimAndValueRelations[5].dimensionName

      _thisAtom.dimAndValueObject7.isShow = data.indDimAndValueRelations.length == 0 ?
          false : data.indDimAndValueRelations[6]==null? false : true
      _thisAtom.dimAndValueObject7.dimension = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[6]==null? null : data.indDimAndValueRelations[6].dimension
      _thisAtom.dimAndValueObject7.dimensionValue = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[6]==null? null : data.indDimAndValueRelations[6].dimensionValue
      _thisAtom.dimAndValueObject7.dimensionName = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[6]==null? null : data.indDimAndValueRelations[6].dimensionName

      _thisAtom.dimAndValueObject8.isShow = data.indDimAndValueRelations.length == 0 ?
          false : data.indDimAndValueRelations[7]==null? false : true
      _thisAtom.dimAndValueObject8.dimension = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[7]==null? null : data.indDimAndValueRelations[7].dimension
      _thisAtom.dimAndValueObject8.dimensionValue = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[7]==null? null : data.indDimAndValueRelations[7].dimensionValue
      _thisAtom.dimAndValueObject8.dimensionName = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[7]==null? null : data.indDimAndValueRelations[7].dimensionName

      _thisAtom.dimAndValueObject9.isShow = data.indDimAndValueRelations.length == 0 ?
          false : data.indDimAndValueRelations[8]==null? false : true
      _thisAtom.dimAndValueObject9.dimension = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[8]==null? null : data.indDimAndValueRelations[8].dimension
      _thisAtom.dimAndValueObject9.dimensionValue = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[8]==null? null : data.indDimAndValueRelations[8].dimensionValue
      _thisAtom.dimAndValueObject9.dimensionName = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[8]==null? null : data.indDimAndValueRelations[8].dimensionName

      _thisAtom.dimAndValueObject10.isShow = data.indDimAndValueRelations.length == 0 ?
          false : data.indDimAndValueRelations[9]==null? false : true
      _thisAtom.dimAndValueObject10.dimension = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[9]==null? null : data.indDimAndValueRelations[9].dimension
      _thisAtom.dimAndValueObject10.dimensionValue = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[9]==null? null : data.indDimAndValueRelations[9].dimensionValue
      _thisAtom.dimAndValueObject10.dimensionName = data.indDimAndValueRelations.length == 0 ?
          null : data.indDimAndValueRelations[9]==null? null : data.indDimAndValueRelations[9].dimensionName

      let defRule = data.indDefRule;
      if (defRule != null) {
        let defRuleArr = defRule.split("||");
        if (Array.isArray(defRuleArr) && defRuleArr.length >= 2) {
          _thisAtom.form.indDefRule = defRuleArr[0]
        } else {
          _thisAtom.form.indDefRule = defRule;
        }
      }
      _thisAtom.form.indDefRuleStr = data.indDefRuleStr;
      _thisAtom.indDefRuleStr = data.indDefRuleStr;
      if(_thisAtom.indDefRuleStr == null || _thisAtom.indDefRuleStr == '') {
        this.isSelfRule = true
      } else {
        this.isSelfRule = false
      }
      if(data.indDefRuleVal !=null && data.indDefRuleVal != "") {
        _thisAtom.form.indDefRuleVal = data.indDefRuleVal;
        _thisAtom.form.indDefRuleId = data.indDefRuleId;
        _thisAtom.indDefRuleVal = data.indDefRuleVal;
        _thisAtom.indDefRuleId = data.indDefRuleId;
      } else {
        if (defRule != null) {
          let defRuleArr = defRule.split("||");
          if (Array.isArray(defRuleArr) && defRuleArr.length >= 2) {
            _thisAtom.form.indDefRuleVal = defRuleArr[1];
            _thisAtom.form.indDefRuleId = defRuleArr[2];
            _thisAtom.indDefRuleVal = defRuleArr[1];
            _thisAtom.indDefRuleId = defRuleArr[2];
          }
        }
      }
      /* _this.bizCode = data.bizCode*/
      _thisAtom.atomPageDialog = true
    },
    toKindred(data) {
      this.showKindred = true;
      this.$nextTick(function(){
        this.$refs.kindred.monitoring(data.bizCode);
      })
    },
    closeKindredDialog() {
      this.$nextTick(function(){
        this.$refs.kindred.cleanData();
      })
      this.showKindred = false;
    },
    bizTabCodeChange() {
      this.bizTabCodeDis = this.form.bizTabCode == null;
    },
    atomDimensionHandle() {

      if (this.form.bizCalcSql != null) {

        const _this = this.$refs.dimensionPage
        _this.keepHistory = this.form.keepHistory
        if (this.form.bizTabCode == null) {
          this.bizTabCodeDis = true
        }
        /* const paramSql = {
          bizCalcSql: this.form.bizCalcSql
        }
        bizCalcSqlVali(paramSql).then(data => {
          if (data.code == 0) {

          } else {
            this.$message(data.msg)
          }
        })*/
        const param = {
          bizCalcSql: this.form.bizCalcSql,
          bizCode: this.form.bizCode,
          keepHistory: this.form.keepHistory,
          bizTabCode: this.form.bizTabCode,
          targetDataSource: this.form.targetDataSource
        }
        getDimensions(param).then(data => {
          if (data.code == 0) {
            _this.atomDimensions = data.data
            _this.dimensionDialog = true
          } else {
            this.$message(data.msg)
          }
        })
        getDimInfo().then(data => {
          _this.dimensions = data.data
        })
        /* const colParam = {
          'id': this.form.targetDataSource,
          'tablename': this.form.bizTabCode
          /!* 'data_type': this.form.filterColumn*!/
        }*/
        if (this.form.bizTabCode != null) {
          getColumnByTabel(this.form.targetDataSource, this.form.bizTabCode).then(data => {
            _this.colCodes = data.data
          })
          /* getColumns(colParam).then(data => {
            if (data.code == 0) {
              _this.colCodes = data.data
              console.log(data.data)
            } else {
              _this.colCodes = []
              alert('数据源连接错误')
            }
          })*/
        } else {
          this.bizTabCodeDis = true
        }
      }
    },
    // 接收维度信息
    getAtomDimensions(data) {
      this.form.atomDimensions = data
    },
    handleCategoryClick(data) {
      console.log(data)
      this.crud.form.categoryId = data.id
      this.crud.query.categoryIds = data.childrenIds
      this.crud.query.categoryType = data.categoryType
      this.query.categoryType = data.categoryType
      this.categoryType = data.categoryType
      this.crud.query.categoryId = data.id
      this.form.categoryId = data.id
      this.form.tenant = data.tenant
      const parentId = data.parentId;
      if(parentId == null) {
        this.crud.optShow.add = false;
        this.crud.form.indFirstType = data.id;
        this.initIndSecondType(data.id,'form');
      } else if(parentId == '0') {
        if(data.categoryType == 0) {
          this.crud.optShow.add = true;
        }
        this.crud.form.indFirstType = data.id;
        this.initIndSecondType(data.id,'form');
      } else {
        if(data.categoryType == 0) {
          this.crud.optShow.add = true;
        }
        this.crud.form.indFirstType = data.parentId;
        this.initIndSecondType(data.parentId,'form');
        this.crud.form.indSecondType = data.id;
      }
      this.initDimInfos(2)
      this.crud.refresh()
    },
    // 数据源发生变化时查询对应的数据源下的表
    dataSourceChangeHandle(val) {
      this.form.bizTabCode = null
      /* const param = {
        id: val
      }
      getTables(param).then(data => {
        this.tableInfo = data.data
      })*/
      // 通过数据源id查询表
      getTablesById(val).then(data => {
        this.tableInfo = data.data
      })
    },
    toSourceDataName(row) {
      let name = ''
      this.sourceData.forEach(row1 => {
        if (row1.id == row.sourceDataSource) {
          name = row1.datasourceName
        }
      })
      return name
    },
    toTargetDataName(row) {
      let name = ''
      this.sourceData.forEach(row1 => {
        if (row1.id == row.targetDataSource) {
          name = row1.datasourceName
        }
      })
      return name
    },
    /** 点击计算按钮触发 */
    processA(data) {
      const bizCodes = []
      for (let i = 0; i < data.length; i++) {
        bizCodes.push(data[i].bizCode)
      }
      this.processParam.codes = bizCodes
      this.processDialog = true
    },
    processB() {
      if (this.dateValue == '') {
        this.crud.notify('日期不能为空', CRUD.NOTIFICATION_TYPE.ERROR)
      } else {
        this.processParam.periodDate = this.dateFormat(this.dateValue, 'YYYYMMDD')
        process(this.processParam, 'atom').then(data => {
          if (data.code == 0) {
            this.crud.notify(data.msg, CRUD.NOTIFICATION_TYPE.SUCCESS)
          } else {
            this.crud.notify(data.msg, CRUD.NOTIFICATION_TYPE.ERROR)
          }
          this.processDialog = false
        })
      }
    },
    // 新增维度
    addDimension() {
      this.dimension.classificationId = null
      this.dimension.categoryName = null
      this.dimension.remarks = null
      this.dimension.serialNo = this.form.serialNo
      this.showIndDimensionAdd = true
    },
    // 新增维度值
    addDimensionValue() {
      this.initDimInfos(2)
     /* this.dimensionValue.dimInfoId = null
      this.dimensionValue.lastLevelDimValueId = null
      this.dimensionValue.categoryName = null*/
      this.dimensionValue.serialNo = this.form.serialNo
      this.showIndDimensionValueAdd = true
    },
    // 新增维度和维度值
    addDimensionAndValue() {
      if(this.dimensionNumber >= 10){
        return;
      }
      this.dimensionArr.push(++this.dimensionNumber)
      this.dimensionArr = this.uniqueArr(this.dimensionArr)
      if(this.dimensionNumber == 3) {
        this.dimAndValueObject3.isShow = true
      } else if(this.dimensionNumber == 4) {
        this.dimAndValueObject4.isShow = true
      } else if(this.dimensionNumber == 5) {
        this.dimAndValueObject5.isShow = true
      } else if(this.dimensionNumber == 6) {
        this.dimAndValueObject6.isShow = true
      } else if(this.dimensionNumber == 7) {
        this.dimAndValueObject7.isShow = true
      } else if(this.dimensionNumber == 8) {
        this.dimAndValueObject8.isShow = true
      } else if(this.dimensionNumber == 9) {
        this.dimAndValueObject9.isShow = true
      } else if(this.dimensionNumber == 10) {
        this.dimAndValueObject10.isShow = true
      }
      // this.dimensionArr.push({ id: ++this.dimensionNumber, value: { dimension: null, dimensionValue: null } })
    },
    // 删除维度和维度值
    deleteDimensionAndValue(item) {
      this.dimensionArr.splice(this.dimensionArr.indexOf(item), 1);
      if(item == 1) {
        this.dimAndValueObject1 = {
          isShow: false,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        }

      } else if(item == 2) {
        this.dimAndValueObject2 = {
          isShow: false,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        }
      } else if(item == 3) {
        this.dimAndValueObject3 = {
          isShow: false,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        }
      } else if(item == 4) {
        this.dimAndValueObject4 = {
          isShow: false,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        }
      } else if(item == 5) {
        this.dimAndValueObject5 = {
          isShow: false,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        }
      } else if(item == 6) {
        this.dimAndValueObject6 = {
          isShow: false,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        }
      } else if(item == 7) {
        this.dimAndValueObject7 = {
          isShow: false,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        }
      } else if(item == 8) {
        this.dimAndValueObject8 = {
          isShow: false,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        }
      } else if(item == 9) {
        this.dimAndValueObject9 = {
          isShow: false,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        }
      } else if(item == 10) {
        this.dimAndValueObject10 = {
          isShow: false,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        }
      }
      this.dimensionNumber =2;
    },
    // 数组去重
    uniqueArr(arr){
      var x = new Set(arr);
      return [...x];
    },
    // 衍生指标编辑指标口径规则
    showIndDefRuleDialog() {
      // this.indDefRuleStr = ''
      this.value = []
      this.showIndDefRule = true
    },
    // 关闭衍生指标编辑指标口径规则
    closeIndDefRuleDialog() {
      this.showIndDefRule = false
    },
    handleChange(value, direction, movedKeys) {
      //value = value.toString();
      //direction = direction.toString();
      //value = value.substring(value.lastIndexOf(",")+1,value.length).trim();
        /*if(value == "true" && direction == "right"){
            this.$message({
              message: '该指标结果可能存在补录，请确认是否引用！',
              type: 'warning'
            });
        }*/
    },
    // 新增指标内部警戒值（表示预警）
    addIndInnerWarnValue() {
      this.indInnerWarnValueArr.push(++this.indInnerWarnValueNumber)
      this.indInnerWarnValueArr = this.uniqueArr(this.indInnerWarnValueArr)
    },
    // 删除指标内部警戒值（表示预警）
    delIndInnerWarnValue(item) {
      this.indInnerWarnValueArr.splice(this.indInnerWarnValueArr.indexOf(item), 1);
      this.indInnerWarnValueNumber = 1
    },
    // 新增指标内部警戒值（表示通过）
    addIndInnerWarnPassValue() {
      this.indInnerWarnPassValueArr.push(++this.indInnerWarnPassValueNumber)
      this.indInnerWarnPassValueArr = this.uniqueArr(this.indInnerWarnPassValueArr)
    },
    // 删除指标内部警戒值（表示通过）
    delIndInnerWarnPassValue(item) {
      this.indInnerWarnPassValueArr.splice(this.indInnerWarnPassValueArr.indexOf(item), 1);
      this.indInnerWarnPassValueNumber = 1
    },
    // 新增指标监管警戒值（表示预警）
    addIndMonWarnValue() {
      this.indMonWarnValueArr.push(++this.indMonWarnValueNumber)
      this.indMonWarnValueArr = this.uniqueArr(this.indMonWarnValueArr)
    },
    // 删除指标监管警戒值（表示预警）
    delIndMonWarnValue(item) {
      this.indMonWarnValueArr.splice(this.indMonWarnValueArr.indexOf(item), 1);
      this.indMonWarnValueNumber = 1
    },
    // 新增指标监管警戒值（表示通过）
    addIndMonWarnPassValue() {
      this.indMonWarnPassValueArr.push(++this.indMonWarnPassValueNumber)
      this.indMonWarnPassValueArr = this.uniqueArr(this.indMonWarnPassValueArr)
    },
    // 删除指标监管警戒值（表示通过）
    delIndMonWarnPassValue(item) {
      this.indMonWarnPassValueArr.splice(this.indMonWarnPassValueArr.indexOf(item), 1);
      this.indMonWarnPassValueNumber = 1
    },
    commitAtomWithSign() {
      this.$refs['signform'].validate(valid => {
        console.log("this.sign.signDeptId  " + this.sign.signDeptId)
        console.log("valid is" + valid)
        if (!valid) {
          return;
        }
        if(this.sign.signDeptId != null && this.sign.signDeptId != '' &&  this.sign.signDeptId != 'null'  && this.sign.signDeptId != 'undefined') {
          checkDeptUser(this.sign.signDeptId).then(res => {
            if(res.code == "0000") {
              if(this.sign.oprType == 1) {//新增
                this.crud.form.signDeptIds = this.sign.signDeptId;
                this.crud.submitCU();
              } else if(this.sign.oprType == 2) {//修改
                this.crud.form.signDeptIds = this.sign.signDeptId;
                this.crud.submitCU();
              } else if(this.sign.oprType == 3) {//发起审批流程
                this.startProcessVerify(this.sign.data);
              } else if(this.sign.oprType == 4) {//删除
                this.sign.data.signDeptIds = this.sign.signDeptId;
                this.abolishSingleAtom(this.sign.data);
              } else if(this.sign.oprType == 5) {//废止
                this.submitCacelInd(this.sign.data,this.sign.signDeptId);
              }
              this.closeSignDialog();
            } else {
              this.$notify({
                title: res.msg,
                type: 'error',
                duration: 2500
              })
            }
          })
        } else {
          if(this.sign.oprType == 1) {//新增
            this.crud.form.signDeptIds = this.sign.signDeptId;
            this.crud.submitCU();
          } else if(this.sign.oprType == 2) {//修改
            this.crud.form.signDeptIds = this.sign.signDeptId;
            this.crud.submitCU();
          } else if(this.sign.oprType == 3) {//发起审批流程
            this.startProcessVerify(this.sign.data);
          } else if(this.sign.oprType == 4) {//删除
            this.sign.data.signDeptIds = this.sign.signDeptId;
            this.abolishSingleAtom(this.sign.data);
          } else if(this.sign.oprType == 5) {//废止
            this.submitCacelInd(this.sign.data,this.sign.signDeptId);
          }
          this.closeSignDialog();
        }
      });

    },
    // 废止指标
    cancelInd(data) {
      let newIeArr = 0;
      let unNewIeArr = 0;
      if(data == null && !Array.isArray(data)) return;
      let ids = "";
      for(let i = 0; i < data.length; i++) {
        const indVerifyStatus = data[i].indVerifyStatus;
        const indDeployStatus = data[i].indDeployStatus;
        const bizCode = data[i].bizCode;
        if(indVerifyStatus == '2') {
          this.$notify({
            title: '审批中的指标不能废止',
            type: 'error',
            duration: 2500
          })
          return;
        }
        if(indDeployStatus == '3') {
          this.$notify({
            title: '已废止的指标不能再次废止',
            type: 'error',
            duration: 2500
          })
          return;
        }
        if(indDeployStatus == '1') {
          newIeArr += 1;
        } else {
          unNewIeArr += 1;
        }
        ids += data[i].id + ",";
      }
      if(ids != null && ids.includes(",")) {
        ids = ids.substr(0,ids.length - 1);
      }
      if(newIeArr > 0 && unNewIeArr > 0) {
        this.$notify({
          title: '请选择审批状态一致的指标操作',
          type: 'error',
          duration: 2500
        })
        return;
      } else if(newIeArr == 0 && unNewIeArr == 0) {
        this.$notify({
          title: '请选择指标记录再操作',
          type: 'error',
          duration: 2500
        })
        return;
      }
      checkRef(ids).then(res => {
        if(res.code == 0) {
          if(res.data == false) {
            if(newIeArr > 0 && unNewIeArr == 0){ //批量删除
              //批量删除
              this.$confirm('确认删除指标?', '删除指标', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                defaultCrud.delAllLoading = true
                delAtom(ids).then(res => {
                  if(res.code == 0) {
                    this.$notify({
                      title: '指标删除成功',
                      type: 'success',
                      duration: 2500
                    })
                  } else {
                    this.$notify({
                      title: '指标删除失败',
                      type: 'error',
                      duration: 2500
                    })
                  }
                  this.crud.refresh();
                })
              }).catch(() => {})
            }else if(newIeArr == 0 && unNewIeArr > 0) {//批量废止
              this.openSignDialog(ids,5,'发起废止流程','请确认是否发起指标废止流程? ');
            }

          } else {
            this.$notify({title: '该指标已被引用，不能删除或废止！',type: 'error',duration: 2500})

          }

        } else {
          this.$notify({title: '删除或废止失败！',type: 'error',duration: 2500})

        }
      })
    },
    submitCacelInd(ids,signDeptId) {
      //批量废止
      abolish(ids,signDeptId).then(res => {
        if(res.code == 0) {
          this.$notify({
            title: '发起指标废止流程成功',
            type: 'success',
            duration: 2500
          })
        } else {
          this.$notify({
            title: '发起指标废止流程失败',
            type: 'error',
            duration: 2500
          })
        }
        this.crud.refresh();
      })

    },
    // 指标发起审批
    processVerify(data) {
      if(data == null && !Array.isArray(data)) return;
      let newIeArr = 0;
      let unNewIeArr = 0;
      let ids = "";
      for(let i = 0; i < data.length; i++) {
        const indVerifyStatus = data[i].indVerifyStatus;
        const indDeployStatus = data[i].indDeployStatus
        if(indDeployStatus == '1') {
          newIeArr += 1;
        } else {
          unNewIeArr += 1;
        }
        if(newIeArr > 0 && unNewIeArr > 0) {
          this.$notify({
            title: '请选择发布状态一致的指标操作',
            type: 'error',
            duration: 2500
          })
          return;
        }
        if(indVerifyStatus == '2') {
          this.$notify({
            title: '审批中的指标不能重复发起审批',
            type: 'error',
            duration: 2500
          })
          return;
        }
        if(indVerifyStatus == '3') {
          this.$notify({
            title: '已拒绝的指标不能发起审批',
            type: 'error',
            duration: 2500
          })
          return;
        }
        if(indVerifyStatus == '4') {
          this.$notify({
            title: '已审批通过的指标不能发起审批',
            type: 'error',
            duration: 2500
          })
          return;
        }
        if(indDeployStatus == '3') {
          this.$notify({
            title: '已废止的指标不能发起审批',
            type: 'error',
            duration: 2500
          })
          return;
        }
        ids += data[i].id + ",";
      }
      if(ids != null && ids.includes(",")) {
        ids = ids.substr(0,ids.length - 1);
      }
      this.openSignDialog(ids,3,'发起审批流程','是否发起审批? ');
    },
    openSignDialog(data,oprType,title,msg) {
      this.showSign = true
      this.showSignOrg = false
      this.sign.signDeptId = null
      this.sign.signDeptName =null
      this.sign.isSign='0'
      this.sign.data =data;
      this.sign.oprType = oprType
      this.sign.title=title
      this.sign.msg = msg
    },
    startProcessVerify(ids) {
      startProcess(ids,this.sign.signDeptId).then(res => {
        if(res.code == 0) {
          this.$notify({
            title: '发起审批请求成功',
            type: 'success',
            duration: 2500
          })
        } else {
          this.$notify({
            title: '发起审批请求失败',
            type: 'error',
            duration: 2500
          })
        }
        this.crud.refresh();
      })
    },
    // 关闭指标历史版本弹框
    closeIndHistoryDialog() {
      this.historyData=[];
      this.showIndHistory = false
    },
    //关闭流程查看弹框
    closeFlowDialog(){
      this.flowData=[];
      this.showFlow = false
    },
    // 关闭维度新增弹框
    closeIndDimensionAddDialog() {
      this.showIndDimensionAdd = false
    },
    // 确认提交新增维度
    commitDim() {
      this.$refs['dimform'].validate(valid => {
        if (!valid) {
          return;
        }
        this.dimension.status = '1';
        this.dimension.tenant = this.form.tenant;
        this.dimension.serialNo = this.form.serialNo
        crudIndDimInfo.crud.add(this.dimension).then(data => {
          if (data.code && data.code != 0) {
            this.$notify({
              title: data.msg,
              type: 'error',
              duration: 2500
            })
            this.showIndDimensionAdd = false
          } else {
            this.$notify({
              title: '新增成功',
              type: 'success',
              duration: 2500
            })
            this.initDimInfos(2)
            this.showIndDimensionAdd = false
          }
        })
      });
    },
    // 关闭维度值新增弹框
    closeIndDimensionValueAddDialog() {
      this.showIndDimensionValueAdd = false
    },
    // 确认提交新增维度值
    commitDimValue() {
      this.$refs['dimValform'].validate(valid => {
        console.log("valid is" + valid)
        if (!valid) {
          return;
        }
        if (this.dimensionValue.dimInfoId == null || this.dimensionValue.dimInfoId.length == 0) {
          this.$notify({
            title: '所属维度不能为空',
            type: 'error',
            duration: 2500
          })
          return;
        }
        if (this.dimensionValue.categoryName == null || this.dimensionValue.categoryName.length == 0) {
          this.$notify({
            title: '指标维度值不能为空',
            type: 'error',
            duration: 2500
          })
          return;
        }

        this.dimensionValue.status = 1;
        this.dimensionValue.tenant = this.form.tenant;
        this.dimension.serialNo = this.form.serialNo
        crudIndDimVal.crud.add(this.dimensionValue).then(data => {
          if (data.code && data.code != 0) {
            this.$notify({
              title: data.msg,
              type: 'error',
              duration: 2500
            })
            this.showIndDimensionValueAdd = false
          } else {
            this.$notify({
              title: '新增成功',
              type: 'success',
              duration: 2500
            })
            this.initDimValues(2)
            this.showIndDimensionValueAdd = false
          }
        })
      });
    },
    // 选择指标进行规则拼接
    selectInd() {
      if(this.value.length  == 0) {
        this.$message({
          message: '请选择一个指标！',
          type: 'error'
        });
        return;
      }
      if(this.value.length > 1) {
        this.$message({
          message: '只能选择一个指标！',
          type: 'error'
        });
        return;
      }
      let keyLabel = this.value[0];
      let keyArr = keyLabel.split(",");
      let hasRef = keyArr[2];
      if(hasRef == "true" ){
        this.$message({
          message: '该指标结果可能存在补录，请确认是否引用！',
          type: 'warning'
        });
      }
      if(this.indDefRuleStr != null
          && (this.endsWithStr(this.indDefRuleStr))) {
        this.indDefRuleStr += '[' + keyArr[1] + ']';
        this.indDefRuleId += keyArr[0];
        this.indDefRuleVal += keyArr[3];
      } else {
        this.indDefRuleStr = '[' + keyArr[1] + ']';
        this.indDefRuleId += keyArr[0];
        this.indDefRuleVal = keyArr[3];
      }
      this.showIndDefRule = false
      //this.hasCalc = false;
      this.rules.indDefRule.required = false
      if(this.indDefRuleStr == null || this.indDefRuleStr == '') {
        if(this.form.indDefRule == null || this.form.indDefRule == '') {
          this.errmsgIndDefRule = true
        } else {
          this.errmsgIndDefRule = false
        }

      } else {
        this.errmsgIndDefRule = false
      }
      this.form.indDefRule = this.indDefRuleStr
    },
    // 指标规则+号按钮
    indDefRulePlus() {
      if(this.indDefRuleStr != null && this.indDefRuleStr.length >0
          && !this.beginWithStr(this.indDefRuleStr) ){


        if(this.endsWithStr(this.indDefRuleStr)) {
          this.indDefRuleStr = this.indDefRuleStr.substring(0,this.indDefRuleStr.length - 3) + ' + '
          this.indDefRuleVal = this.indDefRuleVal.substring(0,this.indDefRuleVal.length - 3) + ' + '
          this.indDefRuleId = this.indDefRuleId.substring(0,this.indDefRuleId.length - 3) + ' + '
        } else {
          this.indDefRuleStr += ' + '
          this.indDefRuleVal += ' + '
          this.indDefRuleId += ' + '
        }

        this.form.indDefRule = this.indDefRuleStr
      }
    },
    // 指标规则-号按钮
    indDefRuleSubtraction() {
      if(this.indDefRuleStr != null && this.indDefRuleStr.length >0
          && !this.beginWithStr(this.indDefRuleStr) ){
        if(this.endsWithStr(this.indDefRuleStr)) {
          this.indDefRuleStr = this.indDefRuleStr.substring(0,this.indDefRuleStr.length - 3) + ' - '
          this.indDefRuleVal = this.indDefRuleVal.substring(0,this.indDefRuleVal.length - 3) + ' - '
          this.indDefRuleId = this.indDefRuleId.substring(0,this.indDefRuleId.length - 3) + ' - '
        } else {
          this.indDefRuleStr += ' - '
          this.indDefRuleVal += ' - '
          this.indDefRuleId += ' - '
        }

        this.form.indDefRule = this.indDefRuleStr
      }
    },
    // 指标规则×号按钮
    indDefRuleMultiplication() {
      if(this.indDefRuleStr != null && this.indDefRuleStr.length >0
          && !this.beginWithStr(this.indDefRuleStr) ) {

        if(this.endsWithStr(this.indDefRuleStr)) {
          this.indDefRuleStr = this.indDefRuleStr.substring(0,this.indDefRuleStr.length - 3) + ' × '
          this.indDefRuleVal = this.indDefRuleVal.substring(0,this.indDefRuleVal.length - 3) + ' × '
          this.indDefRuleId = this.indDefRuleId.substring(0,this.indDefRuleId.length - 3) + ' × '
        } else {
          this.indDefRuleStr += ' × '
          this.indDefRuleVal += ' × '
          this.indDefRuleId += ' × '
        }
        this.form.indDefRule = this.indDefRuleStr
      }
    },
    // 指标规则/号按钮
    indDefRuleDivision() {
      if(this.indDefRuleStr != null && this.indDefRuleStr.length >0
          && !this.beginWithStr(this.indDefRuleStr)){
        if(this.endsWithStr(this.indDefRuleStr)) {
          this.indDefRuleStr = this.indDefRuleStr.substring(0,this.indDefRuleStr.length - 3) + ' / '
          this.indDefRuleVal = this.indDefRuleVal.substring(0,this.indDefRuleVal.length - 3) + ' / '
          this.indDefRuleId = this.indDefRuleId.substring(0,this.indDefRuleId.length - 3) + ' / '
        } else {
          this.indDefRuleStr += ' / '
          this.indDefRuleVal += ' / '
          this.indDefRuleId += ' / '
        }

        this.form.indDefRule = this.indDefRuleStr
      }
    },
    changeDimVal1(val){
      if(val == null || val == '') {
        this.errmsgDimV1=true;
      } else{
        this.errmsgDimV1=false;
        this.dimAndValueObject1.dimensionValue= ''
      }
    },
    changeDimVal2(val){
      if(this.dimAndValueObject2.dimension != null && this.dimAndValueObject2.dimension != '' && (val == null || val == '')) {
        this.errmsgDimV2=true;
      } else{
        this.errmsgDimV2=false;
        this.dimAndValueObject2.dimensionValue= ''
      }
    },
    changeDimVal3(val){
      if(this.dimAndValueObject3.dimension != null && this.dimAndValueObject3.dimension != '' && (val == null || val == '')) {
        this.errmsgDimV3=true;
      } else{
        this.errmsgDimV3=false;
        this.dimAndValueObject3.dimensionValue= ''
      }
    },
    changeDimVal4(val){
      if(this.dimAndValueObject4.dimension != null && this.dimAndValueObject4.dimension != '' && (val == null || val == '')) {
        this.errmsgDimV4=true;
      } else{
        this.errmsgDimV4=false;
        this.dimAndValueObject4.dimensionValue= ''
      }
    },
    changeDimVal5(val){
      if(this.dimAndValueObject5.dimension != null && this.dimAndValueObject5.dimension != '' && (val == null || val == '')) {
        this.errmsgDimV5=true;
      } else{
        this.errmsgDimV5=false;
        this.dimAndValueObject5.dimensionValue= ''
      }
    },
    changeDimVal6(val){
      if(this.dimAndValueObject6.dimension != null && this.dimAndValueObject6.dimension != '' && (val == null || val == '')) {
        this.errmsgDimV6=true;
      } else{
        this.errmsgDimV6=false;
        this.dimAndValueObject6.dimensionValue= ''
      }
    },
    changeDimVal7(val){
      if(this.dimAndValueObject7.dimension != null && this.dimAndValueObject7.dimension != '' && (val == null || val == '')) {
        this.errmsgDimV7=true;
      } else{
        this.errmsgDimV7=false;
        this.dimAndValueObject7.dimensionValue= ''
      }
    },
    changeDimVal8(val){
      if(this.dimAndValueObject8.dimension != null && this.dimAndValueObject8.dimension != '' && (val == null || val == '')) {
        this.errmsgDimV8=true;
      } else{
        this.errmsgDimV8=false;
        this.dimAndValueObject8.dimensionValue= ''
      }
    },
    changeDimVal9(val){
      if(this.dimAndValueObject9.dimension != null && this.dimAndValueObject9.dimension != '' && (val == null || val == '')) {
        this.errmsgDimV9=true;
      } else{
        this.errmsgDimV9=false;
        this.dimAndValueObject9.dimensionValue= ''
      }
    },
    changeDimVal10(val){
      if(this.dimAndValueObject10.dimension != null && this.dimAndValueObject10.dimension != '' && (val == null || val == '')) {
        this.errmsgDimV10=true;
      } else{
        this.errmsgDimV10=false;
        this.dimAndValueObject10.dimensionValue= ''
      }
    },
    handleDimValueClick1(data, selected) {
      if (selected == true) {
        this.dimValueTmpName1.push(data.categoryName)
        this.dimensionTmpName1 = this.uniqueArr(this.dimValueTmpName1)
        this.dimValueTmp1.push(data.id)
        this.dimensionTmp1 = this.uniqueArr(this.dimValueTmp1)
      }else{
        this.dimValueTmpName1.splice(this.dimValueTmpName1.indexOf(data.categoryName),1)
        this.dimensionTmpName1 = this.uniqueArr(this.dimValueTmpName1)
        this.dimValueTmp1.splice(this.dimValueTmp1.indexOf(data.id),1)
        this.dimensionTmp1 = this.uniqueArr(this.dimValueTmp1)
      }
      this.dimAndValueObject1.dimensionName = this.dimensionTmpName1.join(',')
      this.dimAndValueObject1.dimensionValue = this.dimensionTmp1.join(',')
      this.errmsgDimV1 = this.dimAndValueObject1.dimensionValue == null || this.dimAndValueObject1.dimensionValue == '';
    },
    handleDimValueClick2(data, selected) {
      if (selected == true) {
        this.dimValueTmpName2.push(data.categoryName)
        this.dimensionTmpName2 = this.uniqueArr(this.dimValueTmpName2)
        this.dimValueTmp2.push(data.id)
        this.dimensionTmp2 = this.uniqueArr(this.dimValueTmp2)
      }else{
        this.dimValueTmpName2.splice(this.dimValueTmpName2.indexOf(data.categoryName),1)
        this.dimensionTmpName2 = this.uniqueArr(this.dimValueTmpName2)
        this.dimValueTmp2.splice(this.dimValueTmp2.indexOf(data.id),1)
        this.dimensionTmp2 = this.uniqueArr(this.dimValueTmp2)
      }
      this.dimAndValueObject2.dimensionName = this.dimensionTmpName2.join(',')
      this.dimAndValueObject2.dimensionValue = this.dimensionTmp2.join(',')
      this.errmsgDimV2 = this.dimAndValueObject2.dimension != null && this.dimAndValueObject2.dimension != null
          && (this.dimAndValueObject2.dimensionValue == null || this.dimAndValueObject2.dimensionValue == '');
    },
    handleDimValueClick3(data, selected) {
      if (selected == true) {
        this.dimValueTmpName3.push(data.categoryName)
        this.dimensionTmpName3 = this.uniqueArr(this.dimValueTmpName3)
        this.dimValueTmp3.push(data.id)
        this.dimensionTmp3 = this.uniqueArr(this.dimValueTmp3)
      }else{
        this.dimValueTmpName3.splice(this.dimValueTmpName3.indexOf(data.categoryName),1)
        this.dimensionTmpName3 = this.uniqueArr(this.dimValueTmpName3)
        this.dimValueTmp3.splice(this.dimValueTmp3.indexOf(data.id),1)
        this.dimensionTmp3 = this.uniqueArr(this.dimValueTmp3)
      }
      this.dimAndValueObject3.dimensionName = this.dimensionTmpName3.join(',')
      this.dimAndValueObject3.dimensionValue = this.dimensionTmp3.join(',')
      this.errmsgDimV3 = this.dimAndValueObject3.dimension != null && this.dimAndValueObject3.dimension != null
          && (this.dimAndValueObject3.dimensionValue == null || this.dimAndValueObject3.dimensionValue == '');
    },
    handleDimValueClick4(data, selected) {
      if (selected == true) {
        this.dimValueTmpName4.push(data.categoryName)
        this.dimensionTmpName4 = this.uniqueArr(this.dimValueTmpName4)
        this.dimValueTmp4.push(data.id)
        this.dimensionTmp4 = this.uniqueArr(this.dimValueTmp4)
      }else{
        this.dimValueTmpName4.splice(this.dimValueTmpName4.indexOf(data.categoryName),1)
        this.dimensionTmpName4 = this.uniqueArr(this.dimValueTmpName4)
        this.dimValueTmp4.splice(this.dimValueTmp4.indexOf(data.id),1)
        this.dimensionTmp4 = this.uniqueArr(this.dimValueTmp4)
      }
      this.dimAndValueObject4.dimensionName = this.dimensionTmpName4.join(',')
      this.dimAndValueObject4.dimensionValue = this.dimensionTmp4.join(',')
      this.errmsgDimV4 = this.dimAndValueObject4.dimension != null && this.dimAndValueObject4.dimension != null
          && (this.dimAndValueObject4.dimensionValue == null || this.dimAndValueObject4.dimensionValue == '');
    },
    handleDimValueClick5(data, selected) {
      if (selected == true) {
        this.dimValueTmpName5.push(data.categoryName)
        this.dimensionTmpName5 = this.uniqueArr(this.dimValueTmpName5)
        this.dimValueTmp5.push(data.id)
        this.dimensionTmp5 = this.uniqueArr(this.dimValueTmp5)
      }else{
        this.dimValueTmpName5.splice(this.dimValueTmpName3.indexOf(data.categoryName),1)
        this.dimensionTmpName5 = this.uniqueArr(this.dimValueTmpName5)
        this.dimValueTmp5.splice(this.dimValueTmp5.indexOf(data.id),1)
        this.dimensionTmp5 = this.uniqueArr(this.dimValueTmp5)
      }
      this.dimAndValueObject5.dimensionName = this.dimensionTmpName5.join(',')
      this.dimAndValueObject5.dimensionValue = this.dimensionTmp5.join(',')
      this.errmsgDimV5 = this.dimAndValueObject5.dimension != null && this.dimAndValueObject5.dimension != null
          && (this.dimAndValueObject5.dimensionValue == null || this.dimAndValueObject5.dimensionValue == '');
    },
    handleDimValueClick6(data, selected) {
      if (selected == true) {
        this.dimValueTmpName6.push(data.categoryName)
        this.dimensionTmpName6 = this.uniqueArr(this.dimValueTmpName6)
        this.dimValueTmp6.push(data.id)
        this.dimensionTmp6 = this.uniqueArr(this.dimValueTmp6)
      }else{
        this.dimValueTmpName6.splice(this.dimValueTmpName6.indexOf(data.categoryName),1)
        this.dimensionTmpName6 = this.uniqueArr(this.dimValueTmpName6)
        this.dimValueTmp6.splice(this.dimValueTmp6.indexOf(data.id),1)
        this.dimensionTmp6 = this.uniqueArr(this.dimValueTmp6)
      }
      this.dimAndValueObject6.dimensionName = this.dimensionTmpName6.join(',')
      this.dimAndValueObject6.dimensionValue = this.dimensionTmp6.join(',')
      this.errmsgDimV6 = this.dimAndValueObject6.dimension != null && this.dimAndValueObject6.dimension != null
          && (this.dimAndValueObject6.dimensionValue == null || this.dimAndValueObject6.dimensionValue == '');
    },
    handleDimValueClick7(data, selected) {
      if (selected == true) {
        this.dimValueTmpName7.push(data.categoryName)
        this.dimensionTmpName7 = this.uniqueArr(this.dimValueTmpName7)
        this.dimValueTmp7.push(data.id)
        this.dimensionTmp7 = this.uniqueArr(this.dimValueTmp7)
      }else{
        this.dimValueTmpName7.splice(this.dimValueTmpName7.indexOf(data.categoryName),1)
        this.dimensionTmpName7 = this.uniqueArr(this.dimValueTmpName7)
        this.dimValueTmp7.splice(this.dimValueTmp7.indexOf(data.id),1)
        this.dimensionTmp7 = this.uniqueArr(this.dimValueTmp7)
      }
      this.dimAndValueObject7.dimensionName = this.dimensionTmpName7.join(',')
      this.dimAndValueObject7.dimensionValue = this.dimensionTmp7.join(',')
      this.errmsgDimV7 = this.dimAndValueObject7.dimension != null && this.dimAndValueObject7.dimension != null
          && (this.dimAndValueObject7.dimensionValue == null || this.dimAndValueObject7.dimensionValue == '');
    },
    handleDimValueClick8(data, selected) {
      if (selected == true) {
        this.dimValueTmpName8.push(data.categoryName)
        this.dimensionTmpName8 = this.uniqueArr(this.dimValueTmpName8)
        this.dimValueTmp8.push(data.id)
        this.dimensionTmp8 = this.uniqueArr(this.dimValueTmp8)
      }else{
        this.dimValueTmpName8.splice(this.dimValueTmpName8.indexOf(data.categoryName),1)
        this.dimensionTmpName8 = this.uniqueArr(this.dimValueTmpName8)
        this.dimValueTmp8.splice(this.dimValueTmp8.indexOf(data.id),1)
        this.dimensionTmp8 = this.uniqueArr(this.dimValueTmp8)
      }
      this.dimAndValueObject8.dimensionName = this.dimensionTmpName8.join(',')
      this.dimAndValueObject8.dimensionValue = this.dimensionTmp8.join(',')
      this.errmsgDimV8 = this.dimAndValueObject8.dimension != null && this.dimAndValueObject8.dimension != null
          && (this.dimAndValueObject8.dimensionValue == null || this.dimAndValueObject8.dimensionValue == '');
    },
    handleDimValueClick9(data, selected) {
      if (selected == true) {
        this.dimValueTmpName9.push(data.categoryName)
        this.dimensionTmpName9 = this.uniqueArr(this.dimValueTmpName9)
        this.dimValueTmp9.push(data.id)
        this.dimensionTmp9 = this.uniqueArr(this.dimValueTmp9)
      }else{
        this.dimValueTmpName9.splice(this.dimValueTmpName9.indexOf(data.categoryName),1)
        this.dimensionTmpName9 = this.uniqueArr(this.dimValueTmpName9)
        this.dimValueTmp9.splice(this.dimValueTmp9.indexOf(data.id),1)
        this.dimensionTmp9 = this.uniqueArr(this.dimValueTmp9)
      }
      this.dimAndValueObject9.dimensionName = this.dimensionTmpName9.join(',')
      this.dimAndValueObject9.dimensionValue = this.dimensionTmp9.join(',')
      this.errmsgDimV9 = this.dimAndValueObject9.dimension != null && this.dimAndValueObject9.dimension != null
          && (this.dimAndValueObject9.dimensionValue == null || this.dimAndValueObject9.dimensionValue == '');
    },
    handleDimValueClick10(data, selected) {
      if (selected == true) {
        this.dimValueTmpName10.push(data.categoryName)
        this.dimensionTmpName10 = this.uniqueArr(this.dimValueTmpName10)
        this.dimValueTmp10.push(data.id)
        this.dimensionTmp10 = this.uniqueArr(this.dimValueTmp10)
      }else{
        this.dimValueTmpName10.splice(this.dimValueTmpName10.indexOf(data.categoryName),1)
        this.dimensionTmpName10 = this.uniqueArr(this.dimValueTmpName10)
        this.dimValueTmp10.splice(this.dimValueTmp10.indexOf(data.id),1)
        this.dimensionTmp10 = this.uniqueArr(this.dimValueTmp10)
      }
      this.dimAndValueObject10.dimensionName = this.dimensionTmpName10.join(',')
      this.dimAndValueObject10.dimensionValue = this.dimensionTmp10.join(',')
      this.errmsgDimV10 = this.dimAndValueObject10.dimension != null && this.dimAndValueObject10.dimension != null
          && (this.dimAndValueObject10.dimensionValue == null || this.dimAndValueObject10.dimensionValue == '');
    },
    indInnerWarnValueBiggerClick() {
      this.form.indInnerWarnFlg = '>'
      this.errmsgInnerWarning = false;
    },
    indInnerWarnValueBiggerEqualsClick() {
      this.form.indInnerWarnFlg = '>='
      this.errmsgInnerWarning = false;
    },
    indInnerWarnValueEqualsClick() {
      this.form.indInnerWarnFlg = '='
      this.errmsgInnerWarning = false;
    },
    indInnerWarnValueSmallerClick() {
      this.form.indInnerWarnFlg = '<'
      this.errmsgInnerWarning = false;
    },
    indInnerWarnValueSmallerEqualsClick() {
      this.form.indInnerWarnFlg = '<='
      this.errmsgInnerWarning = false;
    },
    indInnerWarnValueNotEqualsClick() {
      this.form.indInnerWarnFlg = '≠'
      this.errmsgInnerWarning = false;
    },
    indMonWarnValueBiggerClick() {
      this.form.indMonWarnFlg = '>'
      this.errmsgMonWarning = false;
    },
    indMonWarnValueBiggerEqualsClick() {
      this.form.indMonWarnFlg = '>='
      this.errmsgMonWarning = false;
    },
    indMonWarnValueEqualsClick() {
      this.form.indMonWarnFlg = '='
      this.errmsgMonWarning = false;
    },
    indMonWarnValueSmallerClick() {
      this.form.indMonWarnFlg = '<'
      this.errmsgMonWarning = false;
    },
    indMonWarnValueSmallerEqualsClick() {
      this.form.indMonWarnFlg = '<='
      this.errmsgMonWarning = false;
    },
    indMonWarnValueNotEqualsClick() {
      this.form.indMonWarnFlg = '≠'
      this.errmsgMonWarning = false;
    },
    //修改按钮弹框
    modifyInd(data) {

    },
    async getCategoryName(row) {
      if (row.indFirstType == null) {
        return '未知分类'
      }
      let res = await crudIndCategory.getCategoryName(row.indFirstType);
      if(res.code == 0) {
        return res.data;
      }
      return '未知分类';
      /*.then(res => {
        if(res.code == 0) {
          return res.data+"ccc";
        }
        return '未知分类';
      })*/
      //return '未知分类'
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    openEdit(row) {
      let id = row.id;
      checkRef(id).then(res => {
        if(res.code == 0) {
          if (res.data) {
            this.$notify({
              title: '该指标已被引用，不能修改！',
              type: 'error',
              duration: 2500
            });
            return;
          }
          this.crud.toEdit(row)
          this.initIndModelCols(false);
        }
      });
    },
    delAtom(row) {
      checkRef(row.id).then(res => {
        if(res.code == 0) {
          if(res.data == false) {
            if(row.indVerifyStatus == "2") {
              this.$notify({
                title: '审批中的指标不能删除',
                type: 'error',
                duration: 2500
              })
              return
            }
            if(row.indDeployStatus == "3") {//已废止
              this.$alert('已废止指标，不能删除','删除指标');
              return;
            }
            if(row.indDeployStatus == "1") {//未发布
              this.delSingleAtom(row);
            } else if(row.indDeployStatus == "2") {//已发布
              let msg = '该指标已发布，确认废止? ';
              let title = '发起废止流程';
              this.openSignDialog(row,4,title,msg);
            }

          } else {
            this.$notify({title: '该指标已被引用，不能删除或废止！',type: 'error',duration: 2500})
            return;
          }
        }else {
          this.$notify({title: '未知错误！',type: 'error',duration: 2500})
        }
      })
    },
    delSingleAtom(row) {
        this.$confirm('请确认是否删除?', '删除指标', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          defaultCrud.delAllLoading = true
          delAtom(row.id).then(res => {
            if(res.code == 0) {
              this.$notify({
                title: '指标删除成功',
                type: 'success',
                duration: 2500
              })
            } else {
              this.$notify({
                title: '指标删除失败',
                type: 'error',
                duration: 2500
              })
            }
            this.crud.refresh();
          })
        }).catch(() => {})
    },
    abolishSingleAtom(row) {
      abolish(row.id,row.signDeptIds).then(res => {
        if(res.code == 0) {
          this.$notify({
            title: '发起指标废止流程成功',
            type: 'success',
            duration: 2500
          })
        } else {
          this.$notify({
            title: '发起指标废止流程失败',
            type: 'error',
            duration: 2500
          })
        }
        this.crud.refresh();
      })
    },
    submitForm() {
      this.crud.form.submitType = 1
      this.crud.submitCU()
    },
    submitAndStartProcess() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        this.crud.form.submitType = 2
        let title = '';
        let msg ='';
        let oprType = 1;
        if( this.crud.form.formType == 'add') {
          title = '发起新增审批流程';
          msg = '请确认是否发起新增审批流程? ';
          oprType = 1;
        } else {
          title = '发起修改审批流程';
          msg = '请确认是否发起修改审批流程? ';
          oprType = 2;
        }
        this.openSignDialog(this.crud.form,oprType,title,msg);
      });
    },
    endsWithStr(indDefRuleStr) {
      return indDefRuleStr.trim().endsWith("+") || indDefRuleStr.trim().endsWith("-")
          || indDefRuleStr.trim().endsWith("×") || indDefRuleStr.trim().endsWith("/");
    },
    beginWithStr(indDefRuleStr) {
      return indDefRuleStr.trim().indexOf("+")==1 || indDefRuleStr.trim().indexOf("-")==1
          || indDefRuleStr.trim().indexOf("×")==1 || indDefRuleStr.trim().indexOf("/")==1;
    },
    clearRuleVal() {
      this.indDefRuleStr ='';
      this.indDefRuleVal ='';
      this.indDefRuleId ='';
      this.form.indDefRuleStr='';
      this.form.indDefRuleVal='';
      this.form.indDefRuleId='';
      this.form.indDefRule = '';
      //this.hasCalc = true;
      this.rules.indDefRule.required = true
      /*if(this.indDefRuleStr == null || this.indDefRuleStr == '') {
        if(this.form.indDefRule == null || this.form.indDefRule == '') {
          this.errmsgIndDefRule = true
        } else {
          this.errmsgIndDefRule = false
        }

      } else {
        this.errmsgIndDefRule = false
      }*/
      this.checkIndDefRule(this.form.indDefRule)
    },
    changeIsSelfRule(val){
      console.log("vvvvv=>" + val)
      //if(val) {
        this.form.indDefRule = ''
        this.indDefRuleStr ='';
        this.indDefRuleVal ='';
        this.indDefRuleId ='';
        this.form.indDefRuleStr='';
        this.form.indDefRuleVal='';
        this.form.indDefRuleId='';
      //}
    },
    checkWarning(val,type) {
      if(type == 'inner') {
        if(val != null && (this.form.indInnerWarnFlg == null || this.form.indInnerWarnFlg == '')) {
          this.innerwarningErrMsg = '请选择运算符';
          this.errmsgInnerWarning = true;
        } else if(val != null && (val.startsWith(".") || val =='.')){
          this.innerwarningErrMsg = '预警值不合法';
          this.errmsgInnerWarning = true;
        } else if((val == null || val == '') && (this.form.indInnerWarnFlg != null &&  this.form.indInnerWarnFlg != '')) {
          this.innerwarningErrMsg = '请输入预警值';
          this.errmsgInnerWarning = true;
        } else {
          this.innerwarningErrMsg = '请选择运算符';
          this.errmsgInnerWarning = false;
        }

      } else {
        if(val != null && (this.form.indMonWarnFlg == null || this.form.indMonWarnFlg == '')) {
          this.monwarningErrMsg = '请选择运算符';
          this.errmsgMonWarning = true;
        } else if(val != null && val.startsWith(".")){
          this.monwarningErrMsg = '预警值不合法';
          this.errmsgMonWarning = true;
        } else if((val == null || val == '')  && (this.form.indMonWarnFlg != null &&  this.form.indMonWarnFlg != '')) {
          this.monwarningErrMsg = '请输入预警值';
          this.errmsgMonWarning = true;
        } else  {
          this.monwarningErrMsg = '请选择运算符';
          this.errmsgMonWarning = false;
        }
      }
    },
    toAddAtomToMyClass() {
      console.log('myCategoryId ===> ',this.form.categoryId)
      if(this.form.categoryId == null || this.form.categoryId == 0) {
        this.crud.notify('请选择分类', CRUD.NOTIFICATION_TYPE.ERROR)
        return;
      }
      const _thisAtom = this.$refs.selectAtom
      _thisAtom.selectAtomDialog = true
      _thisAtom.myCategoryId = this.form.categoryId

    },
    refreshList() {
      this.crud.refresh();
    },
    generatorUUID() {
      return uuidv4();
    },
    getCurrentDept() {
      getCurrentDept().then(res => {
        console.log("dessss => " + res)
        this.form.businessDept = res.id
      })
    },
    handleZoom() {
      if (this.zoomDirection == 'left') {
        this.categorySpan = 0;
        this.tableSpan = 24;
        this.zoomDirection = 'right';
      } else {
        this.categorySpan = 6;
        this.tableSpan = 18;
        this.zoomDirection = 'left';
      }
    }
  }
}
</script>
<style lang="scss">
.indicator {
  padding: 0 16px 16px 16px;
}
.indicator .el-table thead.is-group th
{
  background: #5c8dbe45;
  height: 25px;
}
.indicator .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
  padding-left: 20px;
}
.indicator .el-table th>.cell {
  padding-left: 20px;
.el-form-item_error_dim{
  color: #ff4949;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
  .error-border .el-input__inner,.error-border .vue-treeselect__control{
    border-color: #f56c6c !important;
  }
}
.vue-treeselect__control{
  height: 28px;
  font-size: 12px;
  font-family: sans-serif;
  .vue-treeselect__input{
    line-height: 28px;
  }
  .vue-treeselect__menu-placeholder{
    line-height: 28px;
  }
  .vue-treeselect__placeholder{
    line-height: 28px;
  }
}

.el-tabs__content {
  overflow: hidden;
  position: relative;
  height: 700px;
}


</style>

