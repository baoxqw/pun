<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog" :title="title" width="60%" top="15vh">
    <div class="content">
      <el-row>
        <span>公式:【{{formula}}】</span>
      </el-row>
      <el-row>
        <div  width="100%">
          <el-col :span="10">
            <div class="tag">
              <div v-for="module in modules">
                <el-row>
                  <span>{{module.ieCode}}</span>
                </el-row>
                <el-row>
                  <input  v-model="module.ruleDesc" v-if="module.ruleType!=0" />
                  <input  v-model="module.ruleDesc" v-if="module.ruleType==0" :disabled="true" />
                </el-row>
                <br/>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="result">
              <span>计算结果:</span>
              <div v-for="result in resultData" >
                <span>{{result}}</span>
              </div>
            </div>
          </el-col>
        </div>
      </el-row>
      <el-row>
        <div class="button">
          <el-button :loading="loading" type="primary" @click="randomNum(0,10000)">随机生成</el-button>
          <el-button :loading="loading" type="primary" @click="calculate()">计算</el-button>
          <el-button :loading="loading" type="primary" @click="reset()">重置</el-button>
        </div>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
  import crudIndIndicatorInfo, { calculate } from '../../../../../api/indicators/indIndicatorInfo'

  export default {
    components: {},
    data() {
      return {
        title : '',
        loading: false,
        dialog: false,
        formula: '',
        modules:[{}],
        resultData: []
      }
    },
    methods: {
      //随机生成数字
      randomNum(min, max) {
        for (let i = 0; i < this.modules.length; i++) {
          if(this.modules[i].ruleType != 0){
            this.modules[i].ruleDesc=Math.floor(Math.random() * (max - min) + min)+''
          }
        }
      },
      calculate(){
        if ([] === this.modules) {
          return false
        }
        this.modules[0].calcRule=this.formula
        calculate(this.modules).then(data => {
          if(data.code == '0'){
            this.resultData.push(data.data.calcRule)
          }else{
            this.$message.error({
              message: '计算数值输入不正确!'
            })
          }
        })
      },
      reset(){
        for (let i = 0; i < this.modules.length; i++) {
          if(this.modules[i].ruleType != 0){
            this.modules[i].ruleDesc=''
          }
          this.resultData=[]
        }
      }
    }
  }
</script>

<style scoped>
  .content {
    margin-top: -35px;
  }
  .tag{
    border: 1px solid #dfe6ec;
    float:left;
    height: 300px;
    width: 100%;
    margin-top: 10px;
    overflow:scroll;
  }
  .result{
    border: 1px solid #dfe6ec;
    float:left;
    height: 300px;
    width: 100%;
    margin-top: 10px;
    margin-left: 30px;
    overflow:scroll;
  }
  .button{
    margin-left: 30px;
    margin-top: 10px;
  }
</style>
