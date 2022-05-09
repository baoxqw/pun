<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="selectAtomDialog" :title="title" width="59%">
    <div class="indicator">
      <el-row>
        <!--用户数据-->
        <el-col>
          <!--工具栏-->
          <div class="head-container">
            <div v-if="crud.props.searchToggle">
              <!-- 搜索 -->
              <el-input
                  v-model="query.bizName"
                  clearable
                  size="small"
                  placeholder="指标名称"
                  style="width: 180px;"
                  @input="forceUpdate"
                  class="filter-item"
                  @keyup.enter.native="crud.toQuery"
              />
  <!--            <el-select class="filter-item" v-model="query.indFirstType" filterable clearable placeholder="指标一级分类" style="width: 180px;"
                         @keyup.enter.native="crud.toQuery" @change="initIndSecondType(query.indFirstType,'query')">
                <el-option
                    v-for="item in qryIndFirstType"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
              <el-select class="filter-item" v-model="query.indSecondType" filterable clearable placeholder="指标二级分类" style="width: 180px;"
                         @keyup.enter.native="crud.toQuery">
                <el-option
                    v-for="item in qryIndSecondType"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
              <el-select class="filter-item" v-model="query.ieProp" filterable clearable placeholder="指标类型" style="width: 180px;"
                         @keyup.enter.native="crud.toQuery">
                <el-option
                    v-for="item in dict.IE_PROP"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>-->
  <!--            <el-select class="filter-item" v-model="query.businessDept" filterable clearable placeholder="业务属主部门" style="width: 180px;"
                         @keyup.enter.native="crud.toQuery">
                <el-option
                    v-for="item in dict.BUSSINESS_DEPT"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>-->
  <!--            <treeselect v-model="query.businessDept" :options="depts"  style="width: 320px" size="small"  placeholder="业务属主部门" class="filter-item"/>-->
              <el-select class="filter-item" v-model="query.indVerifyStatus" filterable clearable placeholder="指标审批状态" style="width: 180px;"
                         @keyup.enter.native="crud.toQuery">
                <el-option
                    v-for="item in dict.IND_VERIFY_STATUS"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
  <!--            <el-select class="filter-item" v-model="query.indLevel" filterable clearable placeholder="指标层级" style="width: 180px;"
                         @keyup.enter.native="crud.toQuery">
                <el-option
                    v-for="item in dict.IND_LEVEL"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>-->
              <el-select class="filter-item" v-model="query.indDeployStatus" filterable clearable placeholder="指标发布状态" style="width: 180px;"
                         @keyup.enter.native="crud.toQuery">
                <el-option
                    v-for="item in dict.IND_DEPLOY_STATUS"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
  <!--            <el-select class="filter-item" v-model="query.indStandSource" filterable clearable placeholder="标准来源" style="width: 180px;"
                         @keyup.enter.native="crud.toQuery">
                <el-option
                    v-for="item in dict.IND_STAND_SOURCE"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>-->
              <rrOperation :crud="crud"/>
            </div>
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <crudOperation :permission="permission"></crudOperation>
            <!--表单组件-->
            <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                       :title="crud.status.title" width="65%" v-show="formDialog"
            >
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
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
                                @check-change="handleDimValueClick1"
                            >
                              <span slot-scope="{ node, data }" class="span-ellipsis">
                                <span :title="data.categoryName">{{ data.categoryName }}</span>
                              </span>
                            </el-tree>
                          </el-option>
                        </el-select>
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
                        <treeselect v-model="form.businessDept" :options="depts"  style="width: 95%" size="small"  placeholder="选择机构" class="filter-item"/>
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
                      <el-form-item label="指标结果是否会补录" prop="isAdditionalRecording" label-width="140px">
                        <el-checkbox v-model="form.isAdditionalRecording" :disabled="crud.status.flag == 2"></el-checkbox>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                      <el-form-item label="指标定义" prop="indDefinition" label-width="110px">
                        <el-input type="textarea" v-model="form.indDefinition" style="width: 95%;" :rows="5" :disabled="crud.status.flag == 2"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"  v-if="form.ieProp == 2">
                      <el-form-item label="指标口径规则" prop="indDefRule" label-width="110px">
                        <span>{{ indDefRuleStr }}</span>
                        <span style="display: none">{{ indDefRuleVal }}</span>
                        <br/>
                        <el-input type="textarea" v-model="form.indDefRule" style="width: 95%;" :rows="5" :disabled="crud.status.flag == 2" v-if="hasCalc"></el-input>
                        <br/>
                        <el-button type="text" v-if="form.ieProp == 2" @click="indDefRulePlus" :disabled="crud.status.flag == 2">+</el-button>
                        <el-button type="text" v-if="form.ieProp == 2" @click="indDefRuleSubtraction" :disabled="crud.status.flag == 2">-</el-button>
                        <el-button type="text" v-if="form.ieProp == 2" @click="indDefRuleMultiplication" :disabled="crud.status.flag == 2">×</el-button>
                        <el-button type="text" v-if="form.ieProp == 2" @click="indDefRuleDivision" :disabled="crud.status.flag == 2">/</el-button>
                        <el-button type="primary" v-if="form.ieProp == 2" @click="showIndDefRuleDialog" class="filter-item" size="mini" icon="el-icon-monitor" :disabled="crud.status.flag == 2"></el-button>
                        <el-button type="primary" v-if="form.ieProp == 2" @click="clearRuleVal" class="filter-item" size="mini" icon="el-icon-delete-solid" :disabled="crud.status.flag == 2"></el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="指标取值范围" prop="indValueRange1" label-width="110px">
                            <el-input type="number" v-model="form.indValueRange1" style="width: 100%;" :disabled="crud.status.flag == 2"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item prop="indValueRange2">
                            <el-input type="number" v-model="form.indValueRange2" style="width: 85%;" :disabled="crud.status.flag == 2"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                      <el-form-item label="指标内部警戒值(表示预警)" prop="indInnerWarnValue" label-width="110px">
                        <el-col v-for="item in indInnerWarnValueArr">
                          <el-button type="text" @click="indInnerWarnValueBiggerClick" :disabled="crud.status.flag == 2">></el-button>
                          <el-button type="text" @click="indInnerWarnValueBiggerEqualsClick" :disabled="crud.status.flag == 2">>=</el-button>
                          <el-button type="text" @click="indInnerWarnValueEqualsClick" :disabled="crud.status.flag == 2">=</el-button>
                          <el-button type="text" @click="indInnerWarnValueSmallerClick" :disabled="crud.status.flag == 2"><</el-button>
                          <el-button type="text" @click="indInnerWarnValueSmallerEqualsClick" :disabled="crud.status.flag == 2"><=</el-button>
                          <el-button type="text" @click="indInnerWarnValueNotEqualsClick" :disabled="crud.status.flag == 2">≠</el-button>
                          <el-input type="number" v-model="form.indInnerWarnValue" style="width: 100%;" :disabled="crud.status.flag == 2"
                                    @change="(val) => {checkWarning(val,'inner')}">
                            <template slot="prepend">{{form.indInnerWarnFlg}}</template>
                          </el-input>
                          <div class="el-form-item_error_dim" style="color: red" v-show="errmsgInnerWarning">请选择运算符</div>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                      <el-form-item label="指标监管警戒值(表示预警)" prop="indMonWarnValue" label-width="110px">
                        <el-col v-for="item in indMonWarnValueArr">
                          <el-button type="text" @click="indMonWarnValueBiggerClick" :disabled="crud.status.flag == 2">></el-button>
                          <el-button type="text" @click="indMonWarnValueBiggerEqualsClick" :disabled="crud.status.flag == 2">>=</el-button>
                          <el-button type="text" @click="indMonWarnValueEqualsClick" :disabled="crud.status.flag == 2">=</el-button>
                          <el-button type="text" @click="indMonWarnValueSmallerClick" :disabled="crud.status.flag == 2"><</el-button>
                          <el-button type="text" @click="indMonWarnValueSmallerEqualsClick" :disabled="crud.status.flag == 2"><=</el-button>
                          <el-button type="text" @click="indMonWarnValueNotEqualsClick" :disabled="crud.status.flag == 2">≠</el-button>
                          <el-input type="number" v-model="form.indMonWarnValue" style="width: 100%;" :disabled="crud.status.flag == 2"
                                    @change="(val) => {checkWarning(val,'mon')}">
                            <template slot="prepend">{{form.indMonWarnFlg}}</template>
                          </el-input>
                          <div class="el-form-item_error_dim" style="color: red" v-show="errmsgMonWarning">请选择运算符</div>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                      <el-form-item label="币种" prop="currency" label-width="110px">
                        <el-select v-model="form.currency" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="crud.status.flag == 2">
                          <el-option
                              v-for="item in dict.IND_CURRENCY"
                              :key="item.id"
                              :label="item.label"
                              :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
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
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
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
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="display: none">
                      <el-form-item label="指标描述" label-width="110px">
                        <el-input v-model="form.bizDesc" style="width: 98%;" :disabled="crud.status.flag == 2"/>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="form.isRealTimeProcess == true">
                      <el-form-item label="实时指标取数SQL" prop="bizCalcSql" label-width="140px">
                        <el-input v-model="form.bizCalcSql" type="textarea" style="height: 50px;width: 98%" :rows="3" :disabled="crud.status.flag == 2"/>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="padding-top: 12px">
                      <el-form-item label="批量指标取数SQL" prop="bizBatchCalcSql" label-width="140px">
                        <el-input v-model="form.bizBatchCalcSql" type="textarea" style="height: 50px;width: 98%" :rows="3" :disabled="crud.status.flag == 2"/>
                      </el-form-item>
                    </el-col>
                  </el-col>
                  <el-col>
                    <el-divider content-position="center">指标统计项</el-divider>
                    <el-col>
                      <el-checkbox v-model="form.indCurrentValue" :disabled="crud.status.flag == 2">当期值</el-checkbox>
                      <el-checkbox v-model="form.indContemporaneousValue" :disabled="crud.status.flag == 2" >同期值</el-checkbox>
                      <el-checkbox v-model="form.indYearOnYearIncrement" :disabled="crud.status.flag == 2" >同比增量</el-checkbox>
                      <el-checkbox v-model="form.indYearOnYearGrowth" :disabled="crud.status.flag == 2" @change="chageContemporaneous">同比增幅</el-checkbox>
                      <el-checkbox v-model="form.indPreviousPeriodValue" :disabled="crud.status.flag == 2">上期值</el-checkbox>
                      <el-checkbox v-model="form.indMonthOnMonthIncrement" :disabled="crud.status.flag == 2">环比增量</el-checkbox>
                      <el-checkbox v-model="form.indMonthOnMonthGrowth" :disabled="crud.status.flag == 2" @change="chagePreviousPeriod">环比增幅</el-checkbox>
                      <el-checkbox v-model="form.indInitialValueOfTheYear" :disabled="crud.status.flag == 2">年初值</el-checkbox>
                      <el-checkbox v-model="form.indYearOnYearIncre" :disabled="crud.status.flag == 2">较年初增量</el-checkbox>
                      <el-checkbox v-model="form.indIncreaseOverTheBeginningOfTheYear" :disabled="crud.status.flag == 2" @change="chageInitialValue">较年初增幅</el-checkbox>
                    </el-col>
                  </el-col>
                </el-form>
              </el-col>
              <div slot="footer" class="dialog-footer">
                <el-button v-if="crud.status.flag == 0 || crud.status.flag == 1" type="success" plain round @click="crud.cancelCU">取消</el-button>
                <el-button v-if="crud.status.flag == 0 || crud.status.flag == 1" :loading="crud.cu == 2" type="success"  round @click="submitForm(crud.form)">确认</el-button>
                <el-button v-if="crud.status.flag == 0 || crud.status.flag == 1" :loading="crud.cu == 2" type="success"  round @click="submitAndStartProcess(crud.form)">确认并发起审批</el-button>
                <el-button v-if="crud.status.flag == 2 " type="success" plain round @click="crud.cancelCU">关闭</el-button>
              </div>
            </el-dialog>
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                      @selection-change="crud.selectionChangeHandler" border
            >
              <el-table-column type="selection" width="55" fixed="left"/>
              <el-table-column v-if="columns.visible('bizCode')" prop="bizCode" label="指标编码" width="100px"/>
              <el-table-column v-if="columns.visible('bizName')" prop="bizName" label="指标名称" width="160px"/>
              <el-table-column label="指标分类" style="height: 20px"   width="200px" align="center">
                <el-table-column v-if="columns.visible('indFirstTypeName')" prop="indFirstTypeName" label="一级分类" width="100px" />
                <el-table-column v-if="columns.visible('indSecondTypeName')" prop="indSecondTypeName" label="二级分类" width="100px" />
              </el-table-column>
              <el-table-column v-if="columns.visible('ieProp')" prop="ieProp" label="指标类型" width="80px">
                <template slot-scope="scope">
                  {{ dict.label.IE_PROP[scope.row.ieProp] }}
                </template>
              </el-table-column>
              <el-table-column prop="indDeployStatus" label="指标发布状态" width="120px">
                <template slot-scope="scope">
                  {{ dict.label.IND_DEPLOY_STATUS[scope.row.indDeployStatus] }}
                </template>
              </el-table-column>
              <el-table-column prop="indVerifyStatus" label="指标审批状态" width="120px">
                <template slot-scope="scope">
                  {{ dict.label.IND_VERIFY_STATUS[scope.row.indVerifyStatus] }}
                </template>
              </el-table-column>
              <el-table-column v-if="columns.visible('businessDeptName')" prop="businessDeptName" label="业务属主部门" width="110px"/>
              <!--<el-table-column v-if="columns.visible('tenant')" prop="tenant" label="租户" />-->
  <!--            <el-table-column v-permission="['admin','indAtomInfo:detail']" label="操作" min-width="110px"
                                 fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                      slot="left"
                      v-permission="permission.details"
                      class="el-icon&#45;&#45;left"
                      type="primary"
                      style="margin-bottom:3px !important"
                      size="mini"
                      @click="crud.toDetail(scope.row)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>-->
            </el-table>
            <!--分页组件-->
            <pagination/>
            <dimensionPage ref="dimensionPage" :biz-tab-code-dis="bizTabCodeDis" @func="getAtomDimensions"/>
          </div>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="success" plain round @click="closeDialog">取消</el-button>
      <el-button type="success" round @click="confirmAtom(crud.selections)">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import crudIndAtomInfo, {
  getGenAndDerivedInd,
  getGenInd,
  getTablesById, bizNameIsContract, abolish,delAtom,checkRef,addIndToSelfCategory
} from '@/api/indicators/indAtomInfo'
import  {getDimInfos} from '@/api/indicators/indDimInfo'
import {getDimValues, getDimValuesChildren} from '@/api/indicators/indDimValue'
import {process} from '@/api/indicators/indIndicatorInfo'
import CRUD, {crud, form, header, presenter} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import category from '../../category/category'
import dimensionPage from '../atom/dimension/index'
import atomPage from './atomPage'
import {isSignedInteger, validateStrLenFiveHundred, validateStrLenHundred} from '@/utils/validator'
import {getClassifications} from '@/api/indicators/indClassification'
import crudIndCategory from '@/api/indicators/indCategory'
import { getDepts } from '@/utils/system'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

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
  isAdditionalRecording: false,// 指标结果是否会补录
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
  name: 'SelectAtom',
  components: {Treeselect,pagination, crudOperation, rrOperation, udOperation, category, dimensionPage, atomPage },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['IE_PROP', 'CREATE_TABLE', 'YN', 'RETENTION', 'IE_STATUS', 'GEN_IND', 'IND_FIRST_TYPE', 'IND_SECOND_TYPE', 'BUSSINESS_DEPT',
    'IND_LEVEL', 'IND_CURRENCY', 'IND_VALUE_TYPE', 'IE_FREQUENCY', 'IND_CAL_TYPE', 'IND_SAFE_LEVEL', 'IND_MON_FIELD', 'IND_PROCESS_SYS',
    'IND_DATA_TYPE', 'IND_STAND_SOURCE', 'DIMENSION_CATEGORY', 'DIMENSION', 'LAST_LEVEL_DIMENSION_VALUE','IND_VERIFY_STATUS','IND_DEPLOY_STATUS'],
  data() {
    return {
      title: '添加指标到自定义分类',
      myCategoryId: null,
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
          { validator: isSignedInteger, trigger: 'blur' }
        ],
        indValueRange2: [
          { validator: isSignedInteger, trigger: 'blur' }
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
        ]/*,
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
        ]
      },
      dimensionValueRules: {
        categoryName: [
          { required: true, message: '指标维度值不能为空', trigger: 'change' }
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
        remarks: null// 备注
      },
      showIndDimensionValueAdd: false,
      dimensionValue: {
        dimension: null,// 所属维度
        lastLevelDimensionValue: null,// 上级维度值
        dimValue: null// 指标维度值
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
      selectAtomDialog: false
    }
  },
  created() {
    this.crud.optShow.add = false
    this.crud.optShow.del=false
    this.crud.optShow.edit=false
    this.crud.optShow.rightBtnGroup = false
    this.initDimInfos(2)
    //this.initDimValuesChildren()
    this.initDimValues(2)
    this.initClassifications()
    this.initGenAndDerivedInd()
    this.initIndFirstType()
    this.getDepts();
  },
  mounted() {
    this.query.bizName = this.$route.query.ieName
    this.crud.refresh()
   },
  methods: {
    changeIeProp(val) {
      if(val == 3) {
        this.dimAndValueObject1.isShow = true;
        this.dimAndValueObject2.isShow = true;
      } else {
        this.dimAndValueObject1.isShow = false;
        this.dimAndValueObject2.isShow = false;
      }
    },
    chageContemporaneous(val) {
      this.form.indContemporaneousValue = val;
      this.form.indYearOnYearIncrement = val;
    },
    chagePreviousPeriod(val){
      this.form.indPreviousPeriodValue = val;
      this.form.indMonthOnMonthIncrement = val;
    },
    chageInitialValue(val){
      this.form.indInitialValueOfTheYear = val;
      this.form.indYearOnYearIncre = val;
    },
    forceUpdate() {
      this.$forceUpdate()
    },
    genBizNameChange(){
      for (var i = 0; i < Object.keys(this.genIndArr).length; i++) {
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
      var that=this;
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
    initDimVal(dimId,item){
      let _this = this;
      if(item == 1) {
        _this.dimAndValueObject1.dimensionValue = '';
        _this.dimAndValueObject1.dimensionName = '';
      } else if(item == 2) {
        _this.dimAndValueObject2.dimensionValue = '';
        _this.dimAndValueObject2.dimensionName = '';
      } else if(item == 3) {
        _this.dimAndValueObject3.dimensionValue = '';
        _this.dimAndValueObject3.dimensionName = '';
      } else if(item == 4) {
        _this.dimAndValueObject4.dimensionValue = '';
        _this.dimAndValueObject4.dimensionName = '';
      } else if(item == 5) {
        _this.dimAndValueObject5.dimensionValue = '';
        _this.dimAndValueObject5.dimensionName = '';
      } else if(item == 6) {
        _this.dimAndValueObject6.dimensionValue = '';
        _this.dimAndValueObject6.dimensionName = '';
      } else if(item == 7) {
        _this.dimAndValueObject7.dimensionValue = '';
        _this.dimAndValueObject7.dimensionName = '';
      } else if(item == 8) {
        _this.dimAndValueObject8.dimensionValue = '';
        _this.dimAndValueObject8.dimensionName = '';
      } else if(item == 9) {
        _this.dimAndValueObject9.dimensionValue = '';
        _this.dimAndValueObject9.dimensionName = '';
      } else if(item == 10) {
        _this.dimAndValueObject10.dimensionValue = '';
        _this.dimAndValueObject10.dimensionName = '';
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
      getGenAndDerivedInd().then(data => {
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
      this.form.isAdditionalRecording = data.form.isAdditionalRecording
      this.form.indDefinition = data.form.indDefinition
      //this.form.indDefRule = data.form.indDefRule
      this.form.indValueRange1 = data.form.indValueRange1
      this.form.indValueRange2 = data.form.indValueRange2
      this.form.indInnerWarnValue = data.form.indInnerWarnValue
      this.form.indMonWarnValue = data.form.indMonWarnValue
      this.form.currency = data.form.currency
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
    // 接收维度信息
    getAtomDimensions(data) {
      this.form.atomDimensions = data
    },
    handleCategoryClick(data) {
      console.log(data)
      this.crud.form.categoryId = data.id
      this.crud.query.categoryIds = data.childrenIds
      this.crud.query.categoryType = data.categoryType
      this.form.categoryId = data.id
      this.form.tenant = data.tenant
      const parentId = data.parentId;
      if(parentId == null) {
        this.crud.optShow.add = false;
        this.crud.form.indFirstType = data.id;
        this.initIndSecondType(data.id,'form');
      } else if(parentId == '0') {
        this.crud.optShow.add = true;
        this.crud.form.indFirstType = data.id;
        this.initIndSecondType(data.id,'form');
      } else {
        this.crud.optShow.add = true;
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
      this.showIndDimensionAdd = true
    },
    // 新增维度值
    addDimensionValue() {
      this.initDimInfos(2)
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
    // 选择指标进行规则拼接
    selectInd() {
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
    },
    // 指标规则+号按钮
    indDefRulePlus() {
      if(this.indDefRuleStr != null && this.indDefRuleStr.length >0
          && !this.beginWithStr(this.indDefRuleStr) && !this.endsWithStr(this.indDefRuleStr)){
        this.indDefRuleStr += ' + '
        this.indDefRuleVal += ' + '
        this.indDefRuleId += ' + '
      }
    },
    // 指标规则-号按钮
    indDefRuleSubtraction() {
      if(this.indDefRuleStr != null && this.indDefRuleStr.length >0
          && !this.beginWithStr(this.indDefRuleStr) && !this.endsWithStr(this.indDefRuleStr)){
        this.indDefRuleStr += ' - '
        this.indDefRuleVal += ' - '
        this.indDefRuleId += ' - '
      }
    },
    // 指标规则×号按钮
    indDefRuleMultiplication() {
      if(this.indDefRuleStr != null && this.indDefRuleStr.length >0
          && !this.beginWithStr(this.indDefRuleStr) && !this.endsWithStr(this.indDefRuleStr)) {
        this.indDefRuleStr += ' × '
        this.indDefRuleVal += ' × '
        this.indDefRuleId += ' × '
      }
    },
    // 指标规则/号按钮
    indDefRuleDivision() {
      if(this.indDefRuleStr != null && this.indDefRuleStr.length >0
          && !this.beginWithStr(this.indDefRuleStr) && !this.endsWithStr(this.indDefRuleStr)){
        this.indDefRuleStr += ' / '
        this.indDefRuleVal += ' / '
        this.indDefRuleId += ' / '
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
      if(this.dimAndValueObject1.dimensionValue == null || this.dimAndValueObject1.dimensionValue == '') {
        this.errmsgDimV1=true;
      } else{
        this.errmsgDimV1=false;
      }
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
      if(this.dimAndValueObject2.dimension != null && this.dimAndValueObject2.dimension != null
          && (this.dimAndValueObject2.dimensionValue == null || this.dimAndValueObject2.dimensionValue == '')) {
        this.errmsgDimV2=true;
      } else{
        this.errmsgDimV2=false;
      }
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
      if(this.dimAndValueObject3.dimension != null && this.dimAndValueObject3.dimension != null
          && (this.dimAndValueObject3.dimensionValue == null || this.dimAndValueObject3.dimensionValue == '')) {
        this.errmsgDimV3=true;
      } else{
        this.errmsgDimV3=false;
      }
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
      if(this.dimAndValueObject4.dimension != null && this.dimAndValueObject4.dimension != null
          && (this.dimAndValueObject4.dimensionValue == null || this.dimAndValueObject4.dimensionValue == '')) {
        this.errmsgDimV4=true;
      } else{
        this.errmsgDimV4=false;
      }
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
      if(this.dimAndValueObject5.dimension != null && this.dimAndValueObject5.dimension != null
          && (this.dimAndValueObject5.dimensionValue == null || this.dimAndValueObject5.dimensionValue == '')) {
        this.errmsgDimV5=true;
      } else{
        this.errmsgDimV5=false;
      }
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
      if(this.dimAndValueObject6.dimension != null && this.dimAndValueObject6.dimension != null
          && (this.dimAndValueObject6.dimensionValue == null || this.dimAndValueObject6.dimensionValue == '')) {
        this.errmsgDimV6=true;
      } else{
        this.errmsgDimV6=false;
      }
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
      if(this.dimAndValueObject7.dimension != null && this.dimAndValueObject7.dimension != null
          && (this.dimAndValueObject7.dimensionValue == null || this.dimAndValueObject7.dimensionValue == '')) {
        this.errmsgDimV7=true;
      } else{
        this.errmsgDimV7=false;
      }
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
      if(this.dimAndValueObject8.dimension != null && this.dimAndValueObject8.dimension != null
          && (this.dimAndValueObject8.dimensionValue == null || this.dimAndValueObject8.dimensionValue == '')) {
        this.errmsgDimV8=true;
      } else{
        this.errmsgDimV8=false;
      }
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
      if(this.dimAndValueObject9.dimension != null && this.dimAndValueObject9.dimension != null
          && (this.dimAndValueObject9.dimensionValue == null || this.dimAndValueObject9.dimensionValue == '')) {
        this.errmsgDimV9=true;
      } else{
        this.errmsgDimV9=false;
      }
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
      if(this.dimAndValueObject10.dimension != null && this.dimAndValueObject10.dimension != null
          && (this.dimAndValueObject10.dimensionValue == null || this.dimAndValueObject10.dimensionValue == '')) {
        this.errmsgDimV10=true;
      } else{
        this.errmsgDimV10=false;
      }
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
                type: 'warning',
                duration: 2500
              })
              return
            }
            if(row.indDeployStatus == "2") { //已发布
              this.$confirm('该指标已发布，确认废止?', '废止指标', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                abolish(row.id).then(res => {
                  if(res.code == 0) {
                    this.$notify({
                      title: '指标废止成功',
                      type: 'success',
                      duration: 2500
                    })
                  } else {
                    this.$notify({
                      title: '指标废止失败',
                      type: 'error',
                      duration: 2500
                    })
                  }
                  this.crud.refresh();
                })
              }).catch(() => {})
            } else if(row.indDeployStatus == "1") {//未发布
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
            } else if(row.indDeployStatus == "3") {//已废止
              this.$alert('已废止指标，不能删除','删除指标');
            }
          } else {
            this.$notify({title: '该指标已被引用，不能删除或废止！',type: 'error',duration: 2500})
            return;
          }
        }
      })
    },
    submitForm() {
      this.crud.form.submitType = 1
      this.crud.submitCU()
    },
    submitAndStartProcess() {
      this.crud.form.submitType = 2
      this.crud.submitCU()
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
      //this.hasCalc = true;
      this.rules.indDefRule.required = true
    },
    checkWarning(val,type) {
      if(type == 'inner') {
        if(val != null && (this.form.indInnerWarnFlg == null || this.form.indInnerWarnFlg == '')) {
          //this.$notify({title: '请选择运算符！',type: 'error',duration: 2500})
          this.errmsgInnerWarning = true;
        } else {
          this.errmsgInnerWarning = false;
        }
      } else {
        if(val != null && (this.form.indMonWarnFlg == null || this.form.indMonWarnFlg == '')) {
          this.errmsgMonWarning = true;
        } else {
          this.errmsgMonWarning = false;
        }
      }
    },
    closeDialog() {
      this.selectAtomDialog = false
    },
    confirmAtom(rows){
      console.log(rows)
      if(rows == null || rows.length == 0) {
        this.crud.notify('请选择要添加的指标', CRUD.NOTIFICATION_TYPE.ERROR)
        return;
      }
      console.log(this.myCategoryId)
      let ids = '';
      for (const row of rows) {
        ids += row.id + ",";
      }
      addIndToSelfCategory(ids,this.myCategoryId).then(res => {
        if(res.code == 0) {
          this.crud.notify('添加成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.$emit('refreshList');
          this.selectAtomDialog = false
        } else {
          this.crud.notify('添加失败', CRUD.NOTIFICATION_TYPE.ERROR)
        }
      });
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
  background: rgb(232,237,229);
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
}
</style>

