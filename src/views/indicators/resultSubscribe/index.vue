<template>
  <el-tabs type="border-card"  v-model="activeName">
    <el-tab-pane label="主动收藏" name="subcribe">
      <subscribeindex ref="subscribeindex" />
    </el-tab-pane>
    <el-tab-pane label="高频访问" name="topTen">
      <topTenindex ref="topTenindex" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import subscribeindex from './subscribeindex'
import topTenindex from './topTenindex'
export default {
  name: 'IndResultSubscribe',
  components: {subscribeindex,topTenindex},
  data() {
    return {
      activeName: 'subcribe'
    }
  },
  created() {},
  mounted() {},
  methods: {

  }
}
</script>
<style>

</style>

