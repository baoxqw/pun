<template>
    <div class="cardIndex">
      <div class="cardBox cardFirst">
        <div class="content">
          <el-card class="box-card">
            <p>全程异地授信敞口余额</p>
            <div class="money">
              <div>
                <strong>719.02</strong>
                <span>亿</span>
                <p class="time">2021-03-31</p>
              </div>
              <div>
              </div>
            </div>
            <div class="footer">
              <div>
                较上季：
                <span class="red">↑29.83</span>
              </div>
              <div>
                <div>
                  较年初：
                  <span class="red">↑29.83</span>
                </div>
              </div>
            </div>

          </el-card>
        </div>
        <div class="content">
          <el-card class="box-card">
            <p>营业收入</p>
            <div class="money">
              <div>
                <strong>271.07</strong>
                <span>亿</span>
                <p class="time">2021-06-30</p>
              </div>
              <div>
                <el-progress type="circle" :percentage="52.38" :width="50"></el-progress>
              </div>
            </div>
            <div class="footer">
              <div >
                较上日：
                <span class="red">↑2.03</span>
              </div>
              <div class="width:60%">
                <div>
                  较去年同期：
                  <span class="red">↑22.45</span>
                </div>
              </div>
            </div>

          </el-card>
        </div>
        <div class="content">
          <el-card class="box-card">
            <p>付息率</p>
            <div class="money">
              <div>
                <strong>2.53</strong>
                <span>%</span>
                <p class="time">2021-03-21</p>
              </div>
              <div>
              </div>
            </div>
            <div class="footer">
              <div>
                较年初：-
              </div>
              <div>
                <div>
                  较上月：-
                </div>
              </div>
            </div>

          </el-card>
        </div>
        <div class="content">
          <el-card class="box-card">
            <p>手机银行月活</p>
            <div class="money">
              <div>
                <strong>-169.52</strong>
                <span>万元</span>
                <p class="time">2021-10-12</p>
              </div>
              <div>
              </div>
            </div>
            <div class="footer">
              <div>
                同比：-
              </div>
              <div>
                <div>
                  环比：-
                </div>
              </div>
            </div>

          </el-card>
        </div>
      </div>
      <div class="cardBox">
        <div class="content">
          <el-card class="box-card">
            <p>企业存款日均/余额</p>
            <div class="money">
              <div>
                <strong>395.31</strong>
                <span>亿</span>
                <p class="time">2021-06-31</p>
              </div>
              <div style="width:50%;height:60px">
                <TrendChart
                    :datasets="[
                                {
                                  data: [10, 45, 20, 30],
                                  smooth: true,
                                 // fill: true,
                                  backgroundColor: '#1782d9',
                                  fill: '#39af77',
                                   stroke: '#39af77'
                                }
                              ]"
                    :grid="{
                               verticalLines: false,
                               horizontalLines: false,
                               showPoints:true,
                               horizontalLinesNumber:false
                            }"
                    :labels="{
                       xLabels: 0,
                       yLabels: 0,

                        }"
                    :min="0">
                </TrendChart>
              </div>
            </div>
            <div class="footer">
              <div>
                较上月：
                <span class="red">↑36.55</span>
              </div>
              <div>
                <div>
                  较上年：
                  <span class="red">↑87.66</span>
                </div>
              </div>
            </div>

          </el-card>
        </div>
        <div class="content">
          <el-card class="box-card">
            <p>智能机具分流</p>
            <div class="money">
              <div>
                <strong>271.07</strong>
                <span>亿</span>
                <p class="time">2021-08-31</p>
              </div>
              <div style="width:50%;height:60px">
                  <TrendChart
                      :datasets="[
                                {
                                  data: [23, 35, 16, 9],
                                  smooth: true,
                                  fill: true,
                                  // color: '#39af77'
                                }
                              ]"
                      :grid="{
                               verticalLines: false,
                               horizontalLines: false,
                               showPoints:true,
                               horizontalLinesNumber:false
                            }"
                      :labels="{
                       xLabels: 0,
                       yLabels: 0,

                        }"
                      :min="0">
                  </TrendChart>
                </div>
            </div>
            <div class="footer" style="visibility: hidden">
              <div>
                同比：-
              </div>
              <div>
                <div>
                  环比：-
                </div>
              </div>
            </div>

          </el-card>
        </div>
        <div class="content">
          <el-card class="box-card">
            <p>全行异地授信余额</p>
            <div class="money">
              <div>
                <strong>944.30</strong>
                <span>亿</span>
                <p class="time">2021-03-21</p>
              </div>
              <div>
              </div>
            </div>
            <div class="footer">
              <div>
                较上季：
                <span class="red">↑11.64</span>
              </div>
              <div>
                <div>
                  较年初：
                  <span class="red">↑11.64</span>
                </div>
              </div>
            </div>

          </el-card>
        </div>
        <div class="content">
          <el-card class="box-card">
            <p>处罚笔数</p>
            <div class="money">
              <div>
                <strong>-169.52</strong>
                <span>万元</span>
                <p class="time">2021-10-12</p>
              </div>
              <div>
              </div>
            </div>
            <div class="footer">
              <div>
                同比：-
              </div>
              <div>
                <div>
                  环比：-
                </div>
              </div>
            </div>

          </el-card>
        </div>
      </div>
      <div class="cardBox">
        <div class="content">
          <el-card class="box-card">
            <p>总资产</p>
            <div class="money">
              <div>
                <strong>22869.15</strong>
                <span>亿</span>
                <p class="time">2020-04-30</p>
              </div>
              <div>
                <el-progress type="circle" :percentage="44.37" :width="50"></el-progress>
              </div>
            </div>
            <div class="footer">
              <div>
                较上日：
                <span class="green">↓-628.02</span>
              </div>
              <div>
                <div>
                  较年初：
                  <span class="red">↑768.83</span>
                </div>
              </div>
            </div>

          </el-card>
        </div>
        <div class="content">
          <el-card class="box-card">
            <p>各项贷款</p>
            <div class="money">
              <div>
                <strong>11646.57</strong>
                <span>亿</span>
                <p class="time">2021-06-30</p>
              </div>
              <div>
                <el-progress type="circle" :percentage="63.42" :width="50"></el-progress>
              </div>
            </div>
            <div class="footer">
              <div >
                较上日：-
              </div>
              <div class="width:60%">
                <div>
                  较年初：
                  <span class="red">↑876.28</span>
                </div>
              </div>
            </div>

          </el-card>
        </div>
        <div class="content">
          <el-card class="box-card">
            <p>各项贷款</p>
            <div class="money">
              <div>
                <strong>14049.03</strong>
                <span>亿</span>
                <p class="time">2021-06-30</p>
              </div>
              <div>
                <el-progress type="circle" :percentage="61.61" :width="50"></el-progress>
              </div>
            </div>
            <div class="footer">
              <div >
                较上日：-
              </div>
              <div class="width:60%">
                <div>
                  较年初：
                  <span class="red">↑1237.33</span>
                </div>
              </div>
            </div>

          </el-card>
        </div>
        <div class="content">
          <el-card class="box-card">
            <p>各项贷款(不含信用卡)</p>
            <div class="money">
              <div>
                <strong>-</strong>
                <span></span>
                <p class="time">2021-04-30</p>
              </div>
              <div>
              </div>
            </div>
            <div class="footer">
              <div>
                较上日：-
              </div>
              <div>
                <div>
                  较同期：-
                </div>
              </div>
            </div>

          </el-card>
        </div>
      </div>
    </div>
</template>

<script>

export default {
  name: "index",
  data() {
    return {
    };
  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style scoped>
.cardBox{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.cardFirst{
  margin-top:10px;
}

.cardBox .content{
  width:24%;
}
.money{
  display: flex;
  justify-content: space-between;
}
strong{
  display: inline-block;
  font-size: 24px;
}
.time{
  color: #938d8d;
  margin:9px 0;
}
.footer{
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.red{
  color:red
}
.green{
  color:green;
}

</style>