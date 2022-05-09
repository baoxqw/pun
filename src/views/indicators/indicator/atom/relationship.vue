<template>
  <div id="app-container" class="app-container" >
    <div class ="head-container">
    <el-select v-model="value" clearable placeholder="请选择">
      <el-option
              v-for="item in names"
              :key="item.name"
              :label="item.name"
              :value="item.name">
      </el-option>
    </el-select>
     <el-button type="primary"   @click="findByName">搜索</el-button>
    </div>
    <div id="relation-main"  class="relation-main" style="margin: auto;position: absolute; left: 1%;bottom: 1%;right: 1%;height: 750px"></div>
  </div>
</template>
<!--data-v-58f21aad-->


<script>

  import echarts from "echarts";
  import crudIndAtomRelation,{getData} from '../../../../api/indicators/indAtomRelation'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'


 const data={}
  const links={}
  const names={}

  export default {
    data(){
      return {
        data,
        links,
        names,
        value: ''
      }
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
      //初始化echarts
      initChart: function () {
        let myChart = echarts.init(document.getElementById("relation-main"));
        myChart.resize();  //自适应大小
        myChart.setOption(this.setOption());
        var _this = this;
        myChart.on('click',function (params) {
            if(params.dataType == 'node'){
              var atomName = params.data.name;
              _this.$router.push({path: '/indicator/atomIndicator',query:{ieName:atomName}});

            }
        })
      },
      setOption: function () {

        let option = {
          title: {
            x: 'center',
            text: "指标关联关系",
          },
          tooltip: {}, //提示框
          animationDurationUpdate: 1500,
          animationEasingUpdate: "quinticInOut",
          series: [
            {
              type: "graph",
              layout: "force",

              data: this.data,
              links: this.links,
              // symbolSize: 50, //倘若该属性不在link里，则其表示节点的大小；否则即为线两端标记的大小
              symbolSize: (value, params) => {

                switch (params.data.category) {
                  case 1:
                    return 80;
                    break;
                  case 2:
                    return 60;
                    break;
                  case 3:
                    return 60;
                    break;
                  case 4:
                    return 60;
                    break;
                }
              },
              categories: [
                {
                  name: 1,
                  itemStyle: {
                    normal: {
                      color: '#ff1600'
                    }
                  }
                },
                {
                  name: 2,
                  itemStyle: {
                    normal: {
                      color: '#ff1600'
                    }
                  }
                },
                {
                  name: 3,
                  itemStyle: {
                    normal: {
                      color: '#658cff'
                    }
                  }
                },
                {
                  name: 4,
                  itemStyle: {
                    normal: {
                      color: '#ffa500'
                    }
                  }
                },
                {
                  name: 5,
                  itemStyle: {
                    normal: {
                      color: '#30ff00'
                    }
                  }
                },
              ],
              roam: true, //鼠标缩放功能
              label: {
                show: true, //是否显示标签
              },
              focusNodeAdjacency: true, //鼠标移到节点上时突出显示结点以及邻节点和边
              edgeSymbol: ["none", "arrow"], //关系两边的展现形式，也即图中线两端的展现形式。arrow为箭头
              edgeSymbolSize: [4, 10],
              draggable: true,//可不可以拖动
              edgeLabel: {
                fontSize: 20, //关系（也即线）上的标签字体大小
                length: 30,
              },
              //设置距离
              force: {
                repulsion: 200,
                edgeLength: 120,
              },

              lineStyle: {
                opacity: 0.9,
                width: 2,
                curveness: 0,
              },
            },
          ],
        };

        return option;
      },

      findByName() {
        const bizName =this.value;
        getData(bizName).then(data => {

          this.data = data[0].data
          this.links = data[0].links
          console.log("data:"+JSON.stringify(data[0].data));
          console.log("link:"+JSON.stringify(data[0].links));

          this.initChart();
        })

      },
/*      toDetail() {
        console.log("11111111111111")
      }*/
    },
    mounted() {
      getData("").then(data => {

        this.data = data[0].data
        this.links = data[0].links
        this.names=data[0].data;
        this.initChart();
      })

    }
  }
</script>
<style lang="scss" scoped>

</style>

