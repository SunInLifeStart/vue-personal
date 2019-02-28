<template>
    <div id="Foreign" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="通知公告" name="first" v-if="this.tzgg">
                    <ForeignNotice></ForeignNotice>
                </el-tab-pane>
                <el-tab-pane label="出国计划申报" name="second" v-if="this.cgjhsbbd">
                    <ForeignPlan></ForeignPlan>
                </el-tab-pane>
                <el-tab-pane label="出境计划申报" name="out" v-if="this.cgjhsbbd">
                    <ForeignOut></ForeignOut>
                </el-tab-pane>
                <el-tab-pane label="因公出国(境)任务申请" name="three" v-if="this.ygcgrwsq">
                    <ForeignAbroad></ForeignAbroad>
                </el-tab-pane>
                <el-tab-pane label="资料下载" name="four" v-if="this.zlxzbd">
                    <ForeignUpload></ForeignUpload>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import ForeignNotice from './ForeignNotice';
import ForeignPlan from './ForeignPlan';
import ForeignOut from './ForeignOut';
import ForeignAbroad from './ForeignAbroad';
import ForeignUpload from './ForeignUpload';
export default {
    name: 'Foreign',
    data() {
        return {
            activeName: 'first',
            tabsManage: [],
            tzgg: false,
            cgjhsbbd: false,
            ygcgrwsq: false,
            zlxzbd: false,
        };
    },
    mounted() {
        this.tabsManage = this.$store.getters.getMenusByType('foreign');
        for (let item of this.tabsManage) {
            if (item.code == 'tzgg') {
                this.tzgg = true;
            }
            if (item.code == 'cgjhsbbd') {
                this.cgjhsbbd = true;
            }
            if (item.code == 'ygcgrwsq') {
                this.ygcgrwsq = true;
            }
            if (item.code == 'zlxzbd') {
                this.zlxzbd = true;
            }
        }
    },
    components: {
        ForeignNotice,
        ForeignPlan,
        ForeignOut,
        ForeignAbroad,
        ForeignUpload
    },
    methods: {
        handleClick() {}
    }
};
</script>
<style lang="scss" scoped>
</style>