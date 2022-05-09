<template>
    <!--  <el-card body-style="border-radius: 0; box-shadow: 10px 10px 10px #aaa;padding:0">-->
    <iframe id="dbpFrame"
            :src="dbpPath"
            :width="frameWidth"
            :height="frameHeight"
            frameborder="0" scrolling="auto"
            style="border-radius: 8px; box-shadow: 10px 10px 10px #aaa;padding:0"
    >

    </iframe>
    <!--  </el-card>-->
</template>

<script>
    import {getDbpPath} from '@portal/api/dashboard/dashboard'
    import {MessageBox} from "element-ui";
    export default {
        name: "ThirdpartyDashBoard",
        data() {
            return {
                dbpPath : '',
                frameWidth: '100%',
                frameHeight: 'auto'
            }
        },
        mounted() {
            const _self = this;
            this.getDbpPath();
            //this.frameHeight = window.innerHeight - 202
            this.frameHeight = window.innerHeight
        },
        methods: {
            getDbpPath()  {
                getDbpPath().then(res => {
                    console.log("getDbpPatheee==>" + res.toString())
                    if(res.code == 0){
                        this.dbpPath = res.data;
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        });
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>