<template>
    <div class="tabZujian" style="width:100%;height:100%">

        <el-tabs>
            <el-tab-pane label="血缘关系图">
                <kindredShip></kindredShip>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import kindredShip from "./kindredShip.vue";

export default {
        components:{
            kindredShip,
        },
        data() {
            return {
                kindredShip:'kindredShip'
            };
        }
    };
</script>

<style>
    .el-tabs__content {
        overflow: hidden;
        position: relative;
        height: 800px;
    }
</style>
