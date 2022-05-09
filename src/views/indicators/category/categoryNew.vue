<template>
  <div class="category-container">
<!--    <div class="head-container">-->
<!--      <el-input-->
<!--        v-model="filterText"-->
<!--        placeholder="输入关键字进行过滤"-->
<!--        suffix-icon="el-icon-search"-->
<!--      />-->
<!--    </div>-->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="默认指标分类" name="defaultCategory" style="overflow-x: auto">
        <el-scrollbar class="el-tree treeScroll">
          <el-tree
              ref="tree"
              :data="treeData"
              node-key="id"
              :default-expanded-keys="['0','1']"
              :props="defaultProps"
              :expand-on-click-node="true"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
          >
        <span slot-scope="{ node, data}" class="span-ellipsis">
          <span :title="data.categoryName"><svg-icon icon-class="folder_open" class=""/>{{ data.categoryName }}</span>
          <span align="right" v-if="canOpr=='true'">
            <el-tooltip class="item" effect="dark" content="添加子节点" placement="top-start">
              <el-button v-permission="permission.add"
                         v-if="data.level<2"
                         type="text"
                         icon="el-icon-circle-plus-outline"
                         @click="() => handleAdd(data)"
              />
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="修改子节点" placement="top-start">
              <el-button v-permission="permission.edit"
                         type="text"
                         icon="el-icon-edit-outline"
                         @click="() => handleEdit(data)"
              />
            </el-tooltip>

            <el-tooltip v-if="data.id!='0'" class="item" effect="dark" content="删除该节点" placement="top-start">
              <el-button v-permission="permission.del"
                         type="text"
                         icon="el-icon-remove-outline"
                         @click="() => handleRemove(node, data)"
              />
            </el-tooltip>
          </span>
        </span>
          </el-tree>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="自定义指标分类" name="myCategory" style="overflow-x: auto">
        <el-scrollbar class="el-tree treeScroll">
          <el-tree
              ref="tree"
              :data="treeData"
              node-key="id"
              :default-expanded-keys="['0','1']"
              :props="defaultProps"
              :expand-on-click-node="true"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
          >
        <span slot-scope="{ node, data}" class="span-ellipsis">
          <span :title="data.categoryName"><svg-icon icon-class="folder_open" class=""/>{{ data.categoryName }}</span>
          <span align="right"  v-if="canOpr=='true'">
            <el-tooltip class="item" effect="dark" content="添加子节点" placement="top-start">
              <el-button
                         type="text"
                         icon="el-icon-circle-plus-outline"
                         v-if="data.level<3"
                         @click="() => handleAdd(data)"
              />
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="修改子节点" placement="top-start">
              <el-button
                         type="text"
                         icon="el-icon-edit-outline"
                         @click="() => handleEdit(data)"
              />
            </el-tooltip>

            <el-tooltip v-if="data.id!='0'" class="item" effect="dark" content="删除该节点" placement="top-start">
              <el-button
                         type="text"
                         icon="el-icon-remove-outline"
                         @click="() => handleRemove(node, data)"
              />
            </el-tooltip>
          </span>
        </span>
          </el-tree>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <el-dialog close-on-press-escape :title="dialogTitle" :visible.sync="dialogVisible"  width="40%">
      <el-form ref="form" :model="form" size="small" label-width="150px" :rules="rules">
        <el-row :gutter="5" v-if="superAdminFlag && isTop">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="所属租户" prop="tenant">
              <el-select v-model="form.tenant" filterable placeholder="请选择" style="width: 220px;">
                <el-option
                    v-for="item in tenantArr"
                    :key="item.ID"
                    :label="item.NAME"
                    :value="item.ID"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-input type="hidden" v-model="form.categoryType" style="width: 220px;" v-show="false" />
            <el-input type="hidden" v-model="form.parentId" style="width: 220px;" v-show="false"/>
            <el-input type="hidden" v-model="form.id" style="width: 220px;" v-show="false"/>
            <el-input type="hidden" v-model="form.operType" style="width: 220px;" v-show="false" />
            <el-form-item label="所属分类">
              <el-input v-model="form.parentName" style="width: 220px;" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="分类名称">
              <el-input v-model="form.categoryName" style="width: 220px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5" v-if="form.categoryType == 0">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="前缀">
              <el-input v-model="form.prefix" style="width: 220px;" maxlength="2" onchange="this.value = this.value.toUpperCase()"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" plain round @click="cancel">取消</el-button>
        <el-button type="success" round @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import crudIndCategory from '@/api/indicators/indCategory'
  import CRUD, {crud, form, header, presenter} from "@crud/crud";
  import { isSuperAdmin, getTenants } from '@/api/indUserApply/indTenant'
  const defaultCrud = CRUD({
    title: '指标信息',
    url: crudIndCategory.url,
    sort: 'id,desc',
    crudMethod: { ...crudIndCategory.crud }
  })
  const defaultForm = {
    parentName: null,
    categoryName: null,
    categoryType: null,
    id: null,
    parentId: null,
    prefix: null,
    operType: null,
    level: 1
  }
  export default {
    name: 'IndCategory',
    // components: { pagination, crudOperation, rrOperation, udOperation },
     mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        type: '0',
        parentId:  '0',
        isTop: false,
        dialogVisible: false,
        dialogTitle: '',
        filterText: '',
        activeName:'defaultCategory',
        defaultProps: { children: 'children', label: 'name' },
        treeData: [{ id: '0', categoryType: this.type, categoryName: '全部类别', children: [] ,parentName: null,parentId: null,prefix: null,level:0}],
        permission: {
          add: ['admin', 'indCategory:add'],
          edit: ['admin', 'indCategory:edit'],
          del: ['admin', 'indCategory:del'],
          selfAdd: ['admin', 'indCategory:selfAdd'],
          selfEdit: ['admin', 'indCategory:selfEdit'],
          selfDel: ['admin', 'indCategory:selfDel']
        },
        rules: {
          id: [
            { required: true, message: '分类ID不能为空', trigger: 'blur' }
          ],
          categoryName: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' }
          ]
        },
        tenantArr: [],
        superAdminFlag: false,
      }
    },
    props: {
      canOpr: true
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    mounted() {
      // console.log('=====category---mounted....')
      this.superAdminFlag = isSuperAdmin();
      this.init()
      this.getTenants()
    },
    methods: {
      // 获取数据前设置好接口地址
      /*  [CRUD.HOOK.beforeRefresh]() {
          return true
      },*/
      filterNode(value, treeData) {
        if (!value) return true
        return treeData.categoryName.indexOf(value) !== -1
      },
      handleTabClick(tab, event) {
        console.log("tab===>, " + tab)
        this.type = tab.index;
        this.treeData[0].categoryType = tab.index;
        this.treeData[0].children = []
        this.init();
        this.handleNodeClick(this.treeData[0]);
      },
      // 点击事件
      handleNodeClick(data) {
        this.$emit('node-click', data)
      },
      handleAdd(data) {
        this.form.level=parseInt(data.level) + 1
        this.dialogVisible = true
        this.dialogTitle = "新增指标分类"
        this.form.categoryType = this.type
        //this.form.categoryName = data.categoryName
        this.form.parentName = data.categoryName
        this.form.parentId = data.id
        this.form.operType = "add"
        if(data.id > 0) {
          this.form.prefix = data.prefix
        }
        if(data.id == '0') {
          this.isTop = true;
        } else {
          this.isTop = false;
        }
      },
      handleEdit(data) {
        this.dialogVisible = true
        this.dialogTitle = "修改指标分类"
        this.form.categoryType = data.categoryType
        this.form.categoryName = data.categoryName
        this.form.parentName = data.parentName
        this.form.id = data.id
        this.form.parentId = data.parentId
        this.form.operType = "edit"
        this.form.prefix = data.prefix
        this.form.tenant = data.tenant
        this.form.level = data.level
        if(data.parentId == '0') {
          this.isTop = true;
        } else {
          this.isTop = false;
        }
      },
      handleRemove(node, data) {
        const $this = this
        this.$confirm('确定要删除该节点及其所有子节点吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudIndCategory.crud.del([data.id]).then(res => {
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
            }
            $this.init()

            // this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          }).catch(() => {
            console.log('删除异常')
            $this.$message({
              type: 'error',
              message: '删除失败 '
            })
          })
        }).catch(() => {
        })
      },
      init() {
        let _self = this;
        crudIndCategory.tree(this.type, this.parentId).then(res => {
          console.log('======crudIndCategory.init======', res.toString())
          this.treeData[0].categoryType = this.type;
          this.treeData[0].children = res.data
          // this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          //刷新上层页面
          this.$emit('reloadIndFirstType');
        }).catch(() => {
          console.log('')
          // data.enabled = !data.enabled
        })
      },
      cancel() {
        this.dialogVisible = false
      },
      submit() {
        if(this.form.operType === "add") {
          this.addCategory();
        } else {
          this.editCategory();
        }
      },
      addCategory() {
        const $this = this;
        if(this.superAdminFlag && this.superAdminFlag && this.isTop && this.form.tenant == null){
          $this.$message({
            type:'error',
            message: '请选择所属租户'
          })
          return
        }
        if(this.form.categoryName == null){
          $this.$message({
            type:'error',
            message: '分类名称不能为空'
          })
          return
        }
        if(this.form.categoryType == 0 && this.form.prefix == null){
          $this.$message({
            type:'error',
            message: '前缀不能为空'
          })
          return
        }
        crudIndCategory.crud.add({
          categoryName: this.form.categoryName,
          categoryType: this.form.categoryType,
          prefix: this.form.prefix != null? this.form.prefix.toUpperCase(): null,
          parentId: this.form.parentId,
          tenant: this.form.tenant,
          level: this.form.level
        }).then(res => {
          if(res.code === 0) {
            $this.$message({
              type: 'success',
              message: '添加成功 '
            })
            $this.init()
            this.form.categoryName = null
            this.form.categoryType  = null
            this.form.prefix = null
            this.form.parentId = null
            this.dialogVisible = false
          }else {
            $this.$message({
              type:'error',
              message: res.msg
            })
          }

        }).catch(() => {
          console.log('新增异常')
          $this.$message({
            type: 'error',
            message: '添加失败 '
          })
        })
      },
      editCategory() {
        const $this = this
        if(this.superAdminFlag && this.superAdminFlag && this.isTop && this.form.tenant == null){
          $this.$message({
            type:'error',
            message: '请选择所属租户'
          })
          return
        }
        if(this.form.categoryName == null){
          $this.$message({
            type:'error',
            message: '分类名称不能为空'
          })
          return
        }
        if(this.form.categoryType == 0 && this.form.prefix == null){
          $this.$message({
            type:'error',
            message: '前缀不能为空'
          })
          return
        }
        crudIndCategory.crud.edit({
          categoryName: this.form.categoryName,
          categoryType: this.form.categoryType,
          prefix: this.form.prefix != null? this.form.prefix.toUpperCase(): null,
          id: this.form.id,
          parentId: this.form.parentId,
          tenant: this.form.tenant,
          level: this.form.level
        }).then(res => {
          if(res.code === 0) {
            $this.$message({
              type: 'success',
              message: '修改成功 '
            })
            $this.init()
            this.form.categoryName = null
            this.form.categoryType  = null
            this.form.prefix = null
            this.form.parentId = null
            this.dialogVisible = false
          }else {
            $this.$message({
              type:'error',
              message: res.msg
            })
          }
        }).catch(() => {
          $this.$message({
            type: 'error',
            message: '修改失败 '
          })
        })
        /*this.$prompt('输入节点名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: data.categoryName
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(() => {

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '修改失败'
          })
        })*/
      },
      getTenants() {
        getTenants().then(data => {
          if (data != null && data.code == '0000') {
            this.tenantArr = data.data
          }
        })
      }
    }
  }
</script>

<style scoped>
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

  .el-tree {
    height: 510px;
    min-width: 100%;
    display: inline-block !important;
  }
</style>
