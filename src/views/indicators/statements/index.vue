<template>
  <div class="container">
    <aside>
      <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          @node-drag-start="handleDragStart"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
      ></el-tree>
    </aside>
      <div class="st-table" @drop="drop"  @dragover.prevent>
        <div style="margin:10px 0">
          <el-button type="primary" size="mini" @click="addColumn">添加列</el-button>
          <el-button type="primary" size="mini" @click="submit">提交</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="name" label="姓名" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" width="230">
            <template slot-scope="scope">
              <input type="text" v-model="addressDrag.label" v-show="scope.row.isEditor" />
              <span v-show="!scope.row.isEditor">{{scope.row.address}}</span>
            </template>
          </el-table-column>
          <el-table-column
              v-for="(item, index) in dynamicColumns"
              :key="index"
              :prop="item.prop"
              width="200"
          >
            <template slot="header">
              {{ item.label }}
              <i
                  class="el-icon-remove"
                  style="color:red;cursor:pointer;"
                  @click="deleteColunm(index)"
              ></i>
            </template>
            <template slot-scope="scope">
              <el-input
                  v-if="isEdit"
                  v-model="scope.row.custom[item.prop]"
                  placeholder="请输入内容"
              ></el-input>
              <span v-else>{{ scope.row.custom[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button type="warning" @click="edit(scope.row, scope)">拖拽</el-button>
              <el-button type="danger" @click="save(scope.row)">保存</el-button>
              <el-button type="danger" @click="cancel(scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      data: [
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
      ],
      isEditHeader: false,
      isUpdate:true,
      isEdit: true,
      propArr:[], // 生成dynamicColumns时的记录
      dynamicColumns: [], // 存放动态生成列
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎1",
          address: "普陀区",
          isEditor: false,
          custom: ""
        },
        {
          date: "2016-05-04",
          name: "王小红",
          address: "东城区",
          isEditor: false,
          custom: ""
        },
        {
          date: "2016-05-01",
          name: "王小翠",
          address: "未央区",
          isEditor: false,
          custom: ""
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "曹杨路",
          isEditor: false,
          custom: ""
        }
      ],
      rightList: [],
      addressDrag:{},
      defaultProps: {
        children: "children",
        label: "label"
      }
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    initTable(){
      this.tableData.forEach(item => {
        if (item.custom) {
          item.custom = JSON.parse(item.custom);
          console.log('---99',item.custom)
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
      if(this.isUpdate){
        row.isEditor = true;
        this.addressDrag = {}
        this.isUpdate = false
      }
    },
    save(row, index) {
      if(!this.isUpdate){
        this.isUpdate = true
        row.isEditor = false;
        row.address = this.addressDrag.label
      }
    },
    cancel(row, index) {
      if(!this.isUpdate){
        this.isUpdate = true
        row.isEditor = false;
      }
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
      this.addressDrag = JSON.parse(data)
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
      console.log('--this.tableData-',this.tableData)
      console.log('--this.dynamicColumns-',this.dynamicColumns)
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
  width: 300px;
  height: 100%;
}

.container > main {
  flex: 1;
  height: 100%;
}

.st-table {
  padding: 10px;

}

</style>