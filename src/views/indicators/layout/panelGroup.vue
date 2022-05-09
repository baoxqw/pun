<template>
    <div class="panel-group">

        <!-- </el-col>
         <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
        <div class="card-panel" style="margin-right: 1em; min-width: 23%;">
            <el-link @click="openReport" :underline="false">
                <div class="card-panel-icon-wrapper icon-report">
                    <svg-icon icon-class="panel-report" class-name="card-panel-icon" height="2em"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">
                        指标公告
                    </div>
                    <!--<count-to :start-val="0" :end-val="count.recentVisits" :duration="3200" class="card-panel-num"/>-->
                </div>
            </el-link>
        </div>
        <!-- <el-row :gutter="10" class="panel-group">
           <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
        <div class="card-panel" style="margin-right: 1em; min-width: 23%;">
            <el-link @click="openTodoList" :underline="false">
                <div class="card-panel-icon-wrapper icon-todo">
                    <svg-icon icon-class="panel-todo" class-name="card-panel-icon" width="2em" height="2em"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">
                        待办事项 <span class="card-panel-num">{{ count.todo }}</span>
                    </div>
                    <!--<count-to :start-val="0" :end-val="count.todo" :duration="2600" class="card-panel-num"/>-->
                </div>
            </el-link>
        </div>
        <!--</el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
        <div class="card-panel" style="margin-right: 1em; min-width: 23%;">
            <el-link @click="openFavorite" :underline="false">
                <div class="card-panel-icon-wrapper icon-faverite">
                    <svg-icon icon-class="panel-faverite" class-name="card-panel-icon"  height="2em"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">
                        我的收藏
                    </div>
                    <!--<count-to :start-val="0" :end-val="count.newIp" :duration="3000" class="card-panel-num"/>-->
                </div>
            </el-link>
        </div>

        <!-- </el-col>
         <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
        <!--<div class="card-panel" style="margin-right: 1em">
            <el-link @click="openIndex" :underline="false">
                <div class="card-panel-icon-wrapper icon-index">
                    <svg-icon icon-class="panel-index" class-name="card-panel-icon"  height="2em"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">
                        指标
                    </div>
                    &lt;!&ndash;<count-to :start-val="0" :end-val="count.recentIp" :duration="3600" class="card-panel-num"/>&ndash;&gt;
                </div>
            </el-link>
        </div>-->
        <div class="card-panel" style="margin-right: 1em; min-width: 23%;">
            <el-link @click="openSubscribeList" :underline="false">
                <div class="card-panel-icon-wrapper icon-message">
                    <svg-icon icon-class="panel-message" class-name="card-panel-icon"  height="2em"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">
                        我的提醒 <span class="card-panel-num">{{ subscribe.total }}</span>
                    </div>
                    <!--<count-to :start-val="0" :end-val="count.recentIp" :duration="3600" class="card-panel-num"/>-->
                </div>
            </el-link>
        </div>
        <!--</el-col>
      </el-row>-->
    </div>
</template>

<script>
    import { todoCount , subscribeRpt} from '@/api/indicators/dashboard'

    import CountTo from 'vue-count-to'
    export default {
        components: {CountTo},
        data() {
            return {
                activeName: 'second',
                count: {todo: '', newIp: 0, newVisits: 0, recentIp: 0, recentVisits: 0},
                subscribe: {title: '我的订阅', total: ''}
            }
        },
        mounted() {
            todoCount().then(res => {
                if (res.code === '0') {
                    this.count.todo = res.data.total
                }
            })
            subscribeRpt().then(res => {
                this.subscribe.total = res.data.total
            })
        },
        methods: {
            openTodoList() {
                this.$router.push({path: '/indicator/waitApprove'})
            },
            openFavorite() {
                this.$router.push({path: '/indicator/resultSubscribe/index'})
            },
            openReport() {
                //this.$router.push({path: '../indicator/notice'})
                this.$router.push({path: '/indicator/noticeQuery'})
            },
            /*openIndex() {
                this.$router.push({path: '/indicators/query'})
            },*/
            openSubscribeList() {
                this.$router.push({path: '/indicator/resultSubscribe'})
            }

        }
    }
</script>
<style>
    .card-panel-num {
        font-size: 20px;
        color: darksalmon;
    }
</style>
