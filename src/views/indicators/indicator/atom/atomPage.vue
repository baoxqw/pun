<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="atomPageDialog" :title="title" width="60%">
    <template slot="title" class="add-reply-dialog">
      <span>{{ title }}</span>
    </template>
    <el-row :gutter="10">
      <div class="content">
        <div class="tableDiv">
          <el-form ref="form" :model="form" size="small" label-width="100px">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="display: none">
              <el-form-item label="指标编号" prop="bizCode">
                <el-input v-model="form.bizCode" :readonly="true" />
              </el-form-item>
            </el-col>
            <el-divider content-position="center">基础信息</el-divider>
            <el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="指标类型" prop="ieProp" label-width="110px">
                  <el-select v-model="form.ieProp" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
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
                  <el-select v-model="form.genBizName" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
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
                  <el-input v-model="form.bizName" :readonly="true" style="width: 95%;"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="指标一级分类" prop="indFirstTypeName" label-width="110px">
                  <el-select v-model="form.indFirstTypeName" filterable clearable placeholder="请选择" style="width: 95%;"
                             @change="initIndSecondType(form.indFirstType,'form')" :disabled="true">
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
                <el-form-item label="指标二级分类" prop="indSecondTypeName" label-width="110px">
                  <el-select v-model="form.indSecondTypeName" filterable clearable placeholder="请选择"
                             style="width: 95%;" :disabled="true"
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
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" >
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
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
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
<!--              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject1.isShow">
                <el-form-item label="维度1" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject1.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject1.isShow">
                <el-form-item label="维度值1" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 95%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject1.dimensionValue" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
                          show-checkbox
                          node-key="id"
                          ref="dimensionValue1Tree"
                          highlight-current
                          :props="defaultProps"
                      >
                        <span slot-scope="{ node, data }" class="span-ellipsis">
                          <span :title="data.categoryName">{{ data.categoryName }}</span>
                        </span>
                      </el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject2.isShow">
                <el-form-item label="维度2" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject2.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject2.isShow">
                <el-form-item label="维度值2" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject2.dimensionValue" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
                          show-checkbox
                          node-key="id"
                          ref="dimensionValue1Tree"
                          highlight-current
                          :props="defaultProps"
                      >
                        <span slot-scope="{ node, data }" class="span-ellipsis">
                          <span :title="data.categoryName">{{ data.categoryName }}</span>
                        </span>
                      </el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>-->
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3">
                <el-form-item label="" prop="dimension" label-width="110px">
                  <el-input style="visibility: hidden"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject1.isShow">
                <el-form-item label="维度1" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject1.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject1.isShow">
                <el-form-item label="维度值1" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject1.dimensionName" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
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
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject2.isShow">
                <el-form-item label="维度2" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject2.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject2.isShow">
                <el-form-item label="维度值2" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject2.dimensionName" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
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
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject3.isShow">
                <el-form-item label="维度3" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject3.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject3.isShow">
                <el-form-item label="维度值3" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject3.dimensionName" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
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
                  <el-button
                      class="filter-item"
                      type="primary"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteDimensionAndValue(3)"
                      circle :disabled="true"
                  >
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject4.isShow">
                <el-form-item label="维度4" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject4.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject4.isShow">
                <el-form-item label="维度值4" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject4.dimensionName" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
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
                  <el-button
                      class="filter-item"
                      type="primary"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteDimensionAndValue(4)"
                      circle :disabled="true"
                  >
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject5.isShow">
                <el-form-item label="维度5" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject5.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject5.isShow">
                <el-form-item label="维度值5" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject5.dimensionName" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
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
                  <el-button
                      class="filter-item"
                      type="primary"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteDimensionAndValue(5)"
                      circle :disabled="true"
                  >
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject6.isShow">
                <el-form-item label="维度6" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject6.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject6.isShow">
                <el-form-item label="维度值6" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject6.dimensionName" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
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
                  <el-button
                      class="filter-item"
                      type="primary"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteDimensionAndValue(6)"
                      circle :disabled="true"
                  >
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject7.isShow">
                <el-form-item label="维度7" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject7.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject7.isShow">
                <el-form-item label="维度值7" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject7.dimensionName" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
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
                  <el-button
                      class="filter-item"
                      type="primary"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteDimensionAndValue(7)"
                      circle :disabled="true"
                  >
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject8.isShow">
                <el-form-item label="维度8" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject8.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject8.isShow">
                <el-form-item label="维度值8" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject8.dimensionName" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
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
                  <el-button
                      class="filter-item"
                      type="primary"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteDimensionAndValue(8)"
                      circle :disabled="true"
                  >
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject9.isShow">
                <el-form-item label="维度9" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject9.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject9.isShow">
                <el-form-item label="维度值9" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject9.dimensionName" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
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
                  <el-button
                      class="filter-item"
                      type="primary"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteDimensionAndValue(9)"
                      circle :disabled="true"
                  >
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject10.isShow">
                <el-form-item label="维度10" prop="dimension" label-width="110px">
                  <el-select v-model="dimAndValueObject10.dimension" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                    <el-option
                        v-for="item in dimInfoArrHis"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.ieProp == 3 && dimAndValueObject10.isShow">
                <el-form-item label="维度值10" prop="dimensionValue" label-width="110px">
                  <el-select style="width: 85%" filterable clearable placeholder="请选择"
                             v-model="dimAndValueObject10.dimensionName" :disabled="true"
                  >
                    <el-option style="height: auto;" :disabled="true" value="1">
                      <el-tree
                          :data="dimValueArrHis"
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
                  <el-button
                      class="filter-item"
                      type="primary"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteDimensionAndValue(10)"
                      circle :disabled="true"
                  >
                  </el-button>
                </el-form-item>
              </el-col>
<!--              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-for="item in dimensionArr" v-if="form.ieProp == 3">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" >
                  <el-form-item :label="dimensionTitle + item" label-width="100px">
                    <el-select v-model="('dimAndValueObject' + item)['dimension']"
                               filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
                      <el-option
                          v-for="item in dimInfoArrHis"
                          :key="item.id"
                          :label="item.categoryName"
                          :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item :label="dimensionValueTitle + item" label-width="110px">
                    <el-select v-model="('dimAndValueObject' + item)['dimensionValue']" :disabled="true"
                               filterable clearable placeholder="请选择" style="width: 88%;">
                      <el-option style="height: auto;" :disabled="true" value="1">
                        <el-tree
                            :data="dimValueArrHis"
                            show-checkbox
                            node-key="id"
                            ref="dimensionValue1Tree"
                            highlight-current
                            :props="defaultProps"
                        >
                            <span slot-scope="{ node, data }" class="span-ellipsis">
                              <span :title="data.categoryName">{{ data.categoryName }}</span>
                            </span>
                        </el-tree>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-col>-->
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="业务属主部门" prop="businessDept" label-width="110px">
                  <treeselect v-model="form.businessDept" :options="depts"  style="width: 95%" size="small"  placeholder="选择机构" class="filter-item" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="指标层级" prop="indLevel" label-width="110px">
                  <el-select v-model="form.indLevel" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
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
                  <el-checkbox v-model="form.isDeptQuery" :disabled="true"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="指标结果是否会补录" prop="isAdditionalRecording" label-width="150px">
                  <el-checkbox v-model="form.isAdditionalRecording" :disabled="true"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="指标定义" prop="indDefinition" label-width="110px">
                  <el-input type="textarea" v-model="form.indDefinition" style="width: 95%;" :rows="5" :readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="指标口径规则" prop="indDefRule" label-width="110px">
                  <el-input type="textarea" v-model="form.indDefRule" style="width: 95%;" :rows="5" :readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="指标取值范围" prop="indValueRange1" label-width="110px">
                      <el-input v-model="form.indValueRange1" style="width: 100%;" :readonly="true"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="indValueRange2">
                      <el-input v-model="form.indValueRange2" style="width: 85%;" :readonly="true"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="指标内部警戒值" prop="indInnerWarnValue" label-width="110px">
                  <el-col v-for="item in indInnerWarnValueArr">
                    <el-button type="text">></el-button>
                    <el-button type="text">=</el-button>
                    <el-button type="text"><</el-button>
                    <el-button type="text">≠</el-button>
                    <el-input v-model="form.indInnerWarnValue" style="width: 40%;" :readonly="true">
                      <template slot="prepend">{{form.indInnerWarnFlg}}</template>
                    </el-input>
                    表示预警
                  </el-col>
<!--                  <el-col v-for="item in indInnerWarnPassValueArr">-->
<!--                    <el-button type="text">></el-button>-->
<!--                    <el-button type="text">=</el-button>-->
<!--                    <el-button type="text"><</el-button>-->
<!--                    <el-button type="text">≠</el-button>-->
<!--                    <el-input v-model="form.indInnerWarnPassValue" style="width: 40%;" :readonly="true"></el-input>-->
<!--                    表示通过-->
<!--                  </el-col>-->
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="指标监管警戒值" prop="indMonWarnValue" label-width="110px">
                  <el-col v-for="item in indMonWarnValueArr">
                    <el-button type="text">></el-button>
                    <el-button type="text">=</el-button>
                    <el-button type="text"><</el-button>
                    <el-button type="text">≠</el-button>
                    <el-input v-model="form.indMonWarnValue" style="width: 40%;" :readonly="true">
                      <template slot="prepend">{{form.indMonWarnFlg}}</template>
                    </el-input>
                    表示预警
                  </el-col>
<!--                  <el-col v-for="item in indMonWarnPassValueArr">-->
<!--                    <el-button type="text">></el-button>-->
<!--                    <el-button type="text">=</el-button>-->
<!--                    <el-button type="text"><</el-button>-->
<!--                    <el-button type="text">≠</el-button>-->
<!--                    <el-input v-model="form.indMonWarnPassValue" style="width: 40%;" :readonly="true"></el-input>-->
<!--                    表示通过-->
<!--                  </el-col>-->
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="币种" prop="currency" label-width="110px">
                  <el-select v-model="form.currency" filterable multiple clearable placeholder="请选择" style="width: 95%;" :disabled="true">
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
                    @change="initIndModelCols()" :disabled="true">
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
                              style="width: 95%;" :disabled="true"
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
                              style="width: 95%;" :disabled="true"
                    >
                      <el-option
                          v-for="item in dict.IND_AGG_FUNCTION"
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
                  <el-select v-model="form.indValueType" filterable  placeholder="请选择" style="width: 95%;" :disabled="true">
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
                             style="width: 95%;" :disabled="true"
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
                  <el-select v-model="form.indCalType" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
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
                  <el-select v-model="form.indSafeLevel" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
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
                  <el-select v-model="form.indMonField" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
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
                             style="width: 95%;" :disabled="true"
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
                  <el-select v-model="form.indDataType" filterable clearable placeholder="请选择" style="width: 95%;" :disabled="true">
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
                  <el-input v-model="form.indDataForm" style="width: 95%;" :readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="参考依据" prop="indReference" label-width="110px">
                  <el-input v-model="form.indReference" style="width: 95%;" :readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="false">
                <el-form-item label="是否需要实时加工" prop="isRealTimeProcess" label-width="110px">
                  <el-checkbox v-model="form.isRealTimeProcess" :disabled="true"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="display: none">
                <el-form-item label="数据源" prop="sourceDataSource">
                  <el-select v-model="form.sourceDataSource" filterable placeholder="请选择" style="width: 100%;" :disabled="true">
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
                <el-form-item label="目标数据源" prop="targetDataSource">
                  <el-select v-model="form.targetDataSource" filterable placeholder="请选择" style="width: 100%;" :disabled="true">
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
                <el-form-item label="是否保留历史" prop="ieProp">
                  <el-select v-model="form.keepHistory" filterable placeholder="请选择" :disabled="true" style="width: 100%;">
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
                <el-form-item label="存储表名">
                  <el-input v-model="form.bizTabCode" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="display: none">
                <el-form-item label="指标状态" prop="status">
                  <el-select v-model="form.status" filterable placeholder="请选择" :disabled="true" style="width: 100%;">
                    <el-option
                      v-for="item in dict.IE_STATUS"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="display: none">
                <el-form-item label="创建人">
                  <el-input v-model="form.crtUserCode" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="display: none">
                <el-form-item label="创建日期" :formatter="timeColumnFormat">
                  <el-date-picker v-model="form.crtDate" :readonly="true" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="display: none">
                <el-form-item label="指标描述">
                  <el-input v-model="form.bizDesc" type="textarea" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="取数SQL" v-if="false">
                  <el-input v-model="form.bizCalcSql" type="textarea" :readonly="true" :rows="3" style="width: 98%"/>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col>
              <el-divider content-position="center">指标统计项</el-divider>
              <el-col>
                <el-checkbox v-model="form.indCurrentValue" :checked="true" :disabled="true">当期值</el-checkbox>
                <el-checkbox v-model="form.indContemporaneousValue" :checked="true" :disabled="true">同期值</el-checkbox>
                <el-checkbox v-model="form.indYearOnYearIncrement" :checked="true" :disabled="true">同比增量</el-checkbox>
                <el-checkbox v-model="form.indYearOnYearGrowth" :checked="true" :disabled="true">同比增幅</el-checkbox>
                <el-checkbox v-model="form.indPreviousPeriodValue" :checked="true" :disabled="true">上期值</el-checkbox>
                <el-checkbox v-model="form.indMonthOnMonthIncrement" :checked="true" :disabled="true">环比增量</el-checkbox>
                <el-checkbox v-model="form.indMonthOnMonthGrowth" :checked="true" :disabled="true">环比增幅</el-checkbox>
                <el-checkbox v-model="form.indInitialValueOfTheYear" :checked="true" :disabled="true">年初值</el-checkbox>
                <el-checkbox v-model="form.indYearOnYearIncre" :checked="true" :disabled="true">较年初增量</el-checkbox>
                <el-checkbox v-model="form.indIncreaseOverTheBeginningOfTheYear" :checked="true" :disabled="true">较年初增幅</el-checkbox>
              </el-col>
            </el-col>
          </el-form>
        </div>
      </div>
    </el-row>
    <div class="dialog-footer">
<!--      <el-button-->
<!--        class="filter-item"-->
<!--        size="mini"-->
<!--        type="success"-->
<!--        @click="atomDimensionHandle"-->
<!--      >维度查询</el-button>-->
      <el-button slot="center" type="success" plain round @click="atomPageDialog = false" >关闭</el-button>
    </div>
    <dimensionPage ref="dimensionPage" :atom-dimension-dis="true" :biz-tab-code-dis="true" />
  </el-dialog>
</template>

<script>
  import ElRow from 'element-ui/packages/row/src/row'
  import dimensionPage from '../atom/dimension/index'
  import { getGenInd } from '@/api/indicators/indAtomInfo'
  import { getDimInfos } from '@/api/indicators/indDimInfo'
  import { getDimValues,getDimValuesChildren } from '@/api/indicators/indDimValue'
  import {getTableList, queryByTableId} from '@/api/indicators/metaModel'
  import Treeselect from '@riophae/vue-treeselect'
  import { getDepts } from '@/utils/system'
  import crudIndCategory from '@/api/indicators/indCategory'
  export default {
    components: { Treeselect,ElRow, dimensionPage },
    bizCode: 'bizCode',
    dicts: ['IE_PROP', 'CREATE_TABLE', 'YN', 'RETENTION', 'IE_STATUS', 'GEN_IND', 'IND_FIRST_TYPE', 'IND_SECOND_TYPE', 'BUSSINESS_DEPT',
      'IND_LEVEL', 'IND_CURRENCY', 'IND_AGG_FUNCTION','IND_VALUE_TYPE', 'IE_FREQUENCY', 'IND_CAL_TYPE', 'IND_SAFE_LEVEL', 'IND_MON_FIELD', 'IND_PROCESS_SYS',
      'IND_DATA_TYPE', 'IND_STAND_SOURCE', 'DIMENSION_CLASSIFICATION', 'DIMENSION', 'LAST_LEVEL_DIMENSION_VALUE','IND_VERIFY_STATUS','IND_DEPLOY_STATUS'],
    data() {
      return {
        atomDimensions: [],
        dimensions: [],
        sourceData: [],
        form: {},
        loading: false,
        atomPageDialog: false,
        title: '',
        /* ieCode: '',*/
        /* tag: {
      data: []
    },*/
        /* ieCode:{
      ieCode
    },*/
        depts:[],
        userIds: [],
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
        indInnerWarnValueArr: [1],
        indInnerWarnValueNumber: 1,
        indInnerWarnPassValueArr: [1],
        indInnerWarnPassValueNumber: 1,
        indMonWarnValueArr: [1],
        indMonWarnValueNumber: 1,
        indMonWarnPassValueArr: [1],
        indMonWarnPassValueNumber: 1,
        genIndArr: [],
        dimInfoArrHis: [],
        dimValueArrHis: [],
        dimAndValueObject1: {
          isShow: true,
          dimension: null,
          dimensionValue: null,
          dimensionName: null
        },
        dimAndValueObject2: {
          isShow: true,
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
        formIndFirstType: [],
        formIndSecondType: []
      }
    },
    computed: {

    },
    created() {
      getGenInd().then(data => {
        this.genIndArr = data.data
      })
      this.initDimInfos(2)
      //this.initDimValuesChildren()
      this.initDimValues(2)
      /*getDimInfos( {size: 100, page: 0}).then(data => {
        this.dimInfoArrHis = data.data.records
      })*/
     /* getDimValuesChildren( {size: 100, page: 0}).then(data => {
        this.dimValueArrHis = data.data
      })*/
      this.initIndFirstType();
      this.getDepts();
      this.initIndModelTable();
    },
    methods: {
      initDimInfos(status) {
        getDimInfos( {size: 100, page: 0,tenant: this.form.tenant,status: status}).then(data => {
          this.dimInfoArrHis = data.data.records
        })
      },
      initDimValues(status) {
        getDimValues( {size: 100, page: 0,tenant: this.form.tenant,status: status}).then(data => {
          this.parentDimValueArr = data.data.records
        })
      },
      initSubDimVal(dimId,treeLevel,status) {
        getDimValues( {size: 100, page: 0,tenant: this.form.tenant,status: status,treeLevel: treeLevel,treeId: dimId}).then(data => {
          this.parentDimValueArr = data.data.records
        })
      },
      getDepts() {
        getDepts({ enabled: true }).then(res => {
          this.depts = res.content
        })
      },
      atomDimensionHandle() {
        const _thisDim = this.$refs.dimensionPage
        _thisDim.dimensionDialog = true
        _thisDim.atomDimensions = this.atomDimensions
        _thisDim.dimensions = this.dimensions
        _thisDim.dimDisplay = 'none'
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
      initIndModelCols(){
        this.formIndModelCols = [];
        if(this.form.indModelTable == ''){
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
      }

    }
  }
</script>

<style scoped>
  .content {
    margin-top: 15px;
  }
  .dialog-footer {
    overflow: auto;
    height: 35px;
    margin-left: 300px;
    margin-top: 30px;
    text-align: right;
  }
</style>
