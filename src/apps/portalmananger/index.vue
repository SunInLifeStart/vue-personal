<template>
    <div id="Foreign" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="集团门户基础信息" name="first">
                    <PortalBase></PortalBase>
                </el-tab-pane>
                 <el-tab-pane label="新闻中心" name="second">
                    <PortalApp :type="'新闻中心'"></PortalApp>
                </el-tab-pane>
                <!-- <el-tab-pane label="工作简报" name="third">
                    <PortalApp :type="'工作简报'"></PortalApp>
                </el-tab-pane> -->
                 <el-tab-pane label="规章制度" name="third_2">
                    <PortalApp :type="'规章制度'"></PortalApp>
                </el-tab-pane>
                  <el-tab-pane label="通知公告" name="fourth">
                    <PortalApp :type="'通知公告'"></PortalApp>
                </el-tab-pane>
                <el-tab-pane label="通讯录/会表" name="fifth">
                    <PortalApp :type="'通讯录'"></PortalApp>
                </el-tab-pane>
                 <!-- <el-tab-pane label="工会活动" name="sixth">
                    <PortalApp :type="'工会活动'"></PortalApp>
                </el-tab-pane>
              -->
                <el-tab-pane label="公司发文" name="eighth">
                    <PortalApp :type="'集团发文'"></PortalApp>
                </el-tab-pane>
                <!-- <el-tab-pane label="领导讲话" name="ninth">
                    <PortalApp :type="'领导讲话'"></PortalApp>
                </el-tab-pane> -->
                 <!-- <el-tab-pane label="集团党建" name="ten">
                    <PortalApp :type="'partyBuilding'"></PortalApp>
                </el-tab-pane>  -->
                <!-- <el-tab-pane label="会表管理" name="eleven">
                    <PortalApp :type="'集团会表'"></PortalApp>
                </el-tab-pane> -->
                <el-tab-pane label="app版本管理" name="seventh">
                     <PortalMobile></PortalMobile>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import PortalBase from './PortalBase';
import PortalMobile from './PortalMobile';
import PortalApp from './PortalApp';
export default {
    name: 'Foreign',
    mounted() {},
    data() {
        return {
            activeName: 'second'
        };
    },
    components: {
        PortalBase,
        PortalApp,
        PortalMobile
    },
    methods: {
        handleClick() {}
    }
};
</script>
<style lang="scss" scoped>
</style>