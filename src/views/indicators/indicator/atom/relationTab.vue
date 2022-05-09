<template>
    <div class="tabZujian" style="width:100%;height:100%">

        <el-tabs v-model="activeName" @tab-click="handleClick" >
            <el-tab-pane label="  关联关系图" name="first" :key="'first'" >
                <relationship v-if="relationship" ></relationship>
            </el-tab-pane>

            <el-tab-pane label="关联关系表" name="second" :key="'second'" >
                <relationForm v-if="relationForm"></relationForm>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    import relationship from "./relationship";
    import relationForm from "./relationForm";
    export default {
        components:{
            relationship,
            relationForm
        },
        data() {
            return {
                relationship:'relationship',
                relationForm:'relationForm',
                activeName: "first"
            };
        },
        methods:{
            handleClick(tab) {
                if(tab.name == "first") {
                    this.relationship = true;
                    this.relationForm = false;
                } else if(tab.name == "second") {
                    this.relationship = false;
                    this.relationForm = true;
                }
            }
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