<template>
  <div class="container">
    <aside>
      <el-card class="box-card">
        <div class="box-header">
          <span>全行指标</span>
        </div>
        <el-tree
            :data="data"
            node-key="id"
            default-expand-all
            @node-drag-start="handleDragStart"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
        ></el-tree>
      </el-card>
    </aside>
    <div class="st-table">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>支付工具结构情况季报表</span>
        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="报表日期">
            <el-date-picker
                v-model="formInline.data"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="onSubmit">查询</el-button>
            <el-button type="success" @click="submitCancel">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" border style="width: 100%">

          <el-table-column prop="name" label="项目" width="180">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.name" v-show="scope.row.isEditor" />
              <span v-show="!scope.row.isEditor">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="金额" width="180">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.date" v-show="scope.row.isEditor" />
              <span v-show="!scope.row.isEditor">{{scope.row.date}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="笔数">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.address" v-show="scope.row.isEditor" />
              <span v-show="!scope.row.isEditor">{{scope.row.address}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="报表日期">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.startDate" v-show="scope.row.isEditor" />
              <span v-show="!scope.row.isEditor">{{scope.row.startDate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="warning" @click="edit(scope.row, scope)">编辑</el-button>
              <el-button type="danger" @click="save(scope.row)">保存</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      formInline: {
        data: '',
      },
      /*data: [
        {
          id: 1,
          label: "上海市",
          children: [
            {
              id: 4,
              label: "普陀区",
              children: [
                {
                  id: 9,
                  label: "宁夏路"
                },
                {
                  id: 10,
                  label: "曹杨路"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "北京市",
          children: [
            {
              id: 5,
              label: "朝阳区"
            },
            {
              id: 6,
              label: "东城区"
            }
          ]
        },
        {
          id: 3,
          label: "西安市",
          children: [
            {
              id: 7,
              label: "未央区"
            },
            {
              id: 8,
              label: "碑林区",
              children: [
                {
                  id: 11,
                  label: "和平路"
                },
                {
                  id: 12,
                  label: "南大街"
                }
              ]
            }
          ]
        }
      ],*/
      data:[
        {
          id: 1,
          label: '全行指标',
          children: [
            {
              id: 1-1,
              label: "利息收入",
              children: [
                {
                  id: 1-1-1,
                  label: "2年个人定期整存整取加权平均利率"
                },
                {
                  id: 1-1-2,
                  label: "一年以上贷款d当月发生额"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '管架应用'
        },
        {
          id: 3,
          label: '小金中心报表'
        },
        {
          id: 4,
          label: '5.26上线报表'
        },
      ],
      isEditHeader: false,
      checked: false,
      dialogVisible: false, // 自定义单元格
      filterVisible: false, // 设置过滤
      isUpdate:true,
      isEdit: true,
      propArr:[], // 生成dynamicColumns时的记录
      dynamicColumns: [], // 存放动态生成列
      tableData: [
        {
          date: "[指标]{信用卡交易笔数}",
          name: "存现",
          address: "[本外合-季累计交易金额(月末汇率折币)]",
          isEditor: false,
          startDate:'2022-05-02',
          custom: ""
        },
        {
          date: "[指标]{信用卡交易笔数}",
          name: "取现",
          address: "[小金中心]",
          startDate:'2022-05-08',
          isEditor: false,
          custom: ""
        },
        {
          date: "[指标]{信用卡交易笔数}",
          name: "ATM取现",
          address: "[上线报表]",
          startDate:'2022-05-11',
          isEditor: false,
          custom: ""
        },
        {
          date: "[指标]{信用卡交易笔数}",
          name: "消费",
          address: "[信用卡]",
          startDate:'2022-05-09',
          isEditor: false,
          custom: ""
        }
      ],
      rightList: [],
      addressDrag:{},
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableDataCus: [{
        date: '数据日期',
        name: 'DATE',
        address: '包含1过滤值'
      }, {
        date: '机构编号',
        name: 'ORG',
        address: ''
      }, {
        date: '信用卡账户机构',
        name: 'DM542',
        address: ''
      }],
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    submitCancel() {
      this.formInline =  {
        data: '',
      }
      this.tableData = [
        {
          date: "[指标]{信用卡交易笔数}",
          name: "存现",
          address: "[本外合-季累计交易金额(月末汇率折币)]",
          isEditor: false,
          startDate:'2022-05-02',
          custom: ""
        },
        {
          date: "[指标]{信用卡交易笔数}",
          name: "取现",
          address: "[小金中心]",
          startDate:'2022-05-08',
          isEditor: false,
          custom: ""
        },
        {
          date: "[指标]{信用卡交易笔数}",
          name: "ATM取现",
          address: "[上线报表]",
          startDate:'2022-05-11',
          isEditor: false,
          custom: ""
        },
        {
          date: "[指标]{信用卡交易笔数}",
          name: "消费",
          address: "[信用卡]",
          startDate:'2022-05-09',
          isEditor: false,
          custom: ""
        }
      ]
    },
    filterTools(condition,data) {
      return data.filter( item => {
        return Object.keys( condition ).every( key => {
          return String( item[ key ] ).toLowerCase().includes(
              String( condition[ key ] ).trim().toLowerCase() )
        } )
      } )
    },
    filterSubmit() {
      this.filterVisible = false
    },
    onSubmit() {
      let data = this.formInline.data
      let filterTable = this.filterTools({startDate:data},this.tableData)
      this.tableData = filterTable

    },
    setFilter() {
      this.filterVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    initTable(){
      this.tableData.forEach(item => {
        if (item.custom) {
          item.custom = JSON.parse(item.custom);
          Object.keys(item.custom).forEach(key => {
            if (this.propArr.indexOf(key) === -1) {
              this.propArr.push(key);
              this.dynamicColumns.push({prop: key, label: key});
            }
          })
        } else {
          item.custom = {};
        }
      })
    },
    edit(row, index) {
        row.isEditor = true;
    },
    save(row, index) {
        row.isEditor = false;
    },
    cancel(row, index) {
      if(!this.isUpdate){
        this.isUpdate = true
        row.isEditor = false;
      }
    },
    custom(row, index) {
      this.dialogVisible = true
    },
    handleDragStart(node, ev) {
      ev.dataTransfer.setData("item", JSON.stringify(node.data));
    },
    allowDrop(draggingNode, dropNode, type) {
      return false;
    },
    allowDrag(draggingNode) {
      return true;
    },
    drop(event) {
      let data = event.dataTransfer.getData("item");
      this.rightList.push(JSON.parse(data))
      this.addressDrag =  JSON.parse(data)
      console.log('this.rightList:', this.rightList)
    },
    addColumn() {
      this.$prompt("请输入列名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        this.isEdit = true
        this.dynamicColumns = []
        this.dynamicColumns.push({
          prop: value,
          label: value
        });
      });
    },
    deleteColunm(index) {
      this.dynamicColumns.splice(index, 1);
    },
    submit() {
      let arr = [];
      this.tableData.forEach(data => {
        let temp = {};
        temp.name = data.name;
        let obj = {};
        this.dynamicColumns.forEach(col => {
          // 仅把有效的列提交
          if (data.custom[col.prop]) {
            obj[col.prop] = data.custom[col.prop];
          }
        });
        if (JSON.stringify(obj) !== "{}") {
          temp.custom = JSON.stringify(obj);
        }
        arr.push(temp);
      });
      this.isEdit = false
    }
  }
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}
.container {
  display: flex;
  height: 500px;
  overflow: auto;
}

.container > aside {
  width: 340px;
  height: 100%;
}

.container > .st-table {
  flex: 1;
  height: 100%;
  margin-left:20px;
}
.el-tree{
  border:0;
}
.box-header{
  margin-bottom:20px;
  border-bottom: 1px solid #e6ebf5;
}
.box-header span{
  height: 35px;
  line-height: 12px;
  display: block;
}

.el-button--mini{
  padding:7px 15px!important;
}

</style>