<template>
    <div id="relation-main"  class="relation-main" style="margin: auto;position: absolute;left: 1%;bottom: 1%;right: 1%;height: 98%"></div>
</template>

<script>
import echarts from "echarts";

import {getData} from "@/api/indicators/kindred";


// const data = {};

export default ({
    data() {
        return {
            data : "",
        }
    },
    methods: {
      //初始化echarts
      initChart: function () {
        let myChart = echarts.init(document.getElementById("relation-main"));
        myChart.setOption(this.setOption(), true);
      },
      setOption: function () {
        let option = {
          title: {
            x: 'center',
            text: "血缘关系",
          },
          tooltip: {
            show: false,
            trigger: 'item',
            triggerOn: 'mousemove'
          }, //提示框
          series: [
            {
              type: 'tree',
              id: 0,
              name: 'tree1',
              data: [this.data],
              top: '10%',
              left: '10%',
              bottom: '22%',
              right: '20%',
              symbol: 'rect',
              itemStyle: {
                color : '#4379AC',
                borderColor : '#4379AC',
                borderType : 'solid',
              },
              symbolSize: [160, 40],
              edgeShape: 'polyline',
              edgeForkPosition: '63%',
              initialTreeDepth: 5,
              lineStyle: {
                width: 2
              },
              lineStyle : {
                color: '#337ab7',
              },
              label: {
                color: '#FFFFFF',
                fontSize : '14',
                width: '120',
                position: 'inside',
                verticalAlign: 'middle',
                align: 'center'
              },
              emphasis: {
                focus: 'descendant'
              },
              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        };
        return option;
      },
      monitoring(bizCode){
          getData(bizCode).then(data => {
              this.data = data[0].data;
              console.log(this.data);
              this.initChart();
          })
      },
      cleanData(){
        this.data = "";
        this.initChart();
      }
    },
    mounted(){
      this.$nextTick(function(){
          this.initChart();
        });
    }
})
</script>
