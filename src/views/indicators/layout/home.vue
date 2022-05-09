<template>
  <div class="dashboard-container">
    <!-- <DashBoard/>
        <updatePass1 ref="pass"/> -->
    <div class="ballon">
      <img src="@public/images/bg.png"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Dashboard',

    data() {
      return {

      }
    },
    computed: {},
    mounted() {

    },

    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-container {
    overflow: hidden;
    width: 100%;
    height: 100vh;
  }

  @keyframes scaleDraw {

    /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
    0% {
      transform: scale(1);
      /*开始为原始大小*/
    }

    25% {
      transform: scale(1.1);
      /*放大1.1倍*/
    }

    50% {
      transform: scale(1);
    }

    75% {
      transform: scale(1.1);
    }
  }

  .ballon {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    img{
      display: block;
      width: 100%
    }
    // background: url('~@public/images/bg2.jpg');
    // background-size: 100vw 100vh;
    // -webkit-animation-name: scaleDraw;
    // /*关键帧名称*/
    // -webkit-animation-timing-function: ease-in-out;
    // /*动画的速度曲线*/
    // -webkit-animation-iteration-count: infinite;
    // /*动画播放的次数*/
    // -webkit-animation-duration: 15s;
    // /*动画所花费的时间*/
  }
</style>