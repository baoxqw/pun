<template>
    <div class="dashboard-editor-container">
        <panel-group/>
        <el-row :gutter="5" class="dashboard-row">
            <el-col>
                <thirdparty-dash-board></thirdparty-dash-board>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import PanelGroup from './panelGroup'
    import ThirdpartyDashBoard from './thirdpartyDashBoard'
    export default {
        name: 'IndicatorBoard',
        data() {
            return {
                date: null
            }
        },
        components: {
            PanelGroup,
            ThirdpartyDashBoard
        },
        mounted() { }
    }
</script>

<style scoped>

</style>
