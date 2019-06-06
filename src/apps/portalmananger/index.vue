<template>
    <div id="Foreign" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="集团门户基础信息" name="first" v-if="first">
                    <PortalBase></PortalBase>
                </el-tab-pane>
                 <el-tab-pane label="新闻中心" name="second" v-if="second">
                    <PortalApp :type="'新闻中心'"></PortalApp>
                </el-tab-pane>
                 <el-tab-pane label="规章制度" name="third_2" v-if="third_2">
                    <PortalApp :type="'规章制度'"></PortalApp>
                </el-tab-pane>
                  <el-tab-pane label="通知公告" name="fourth" v-if="fourth">
                    <PortalApp :type="'通知公告'"></PortalApp>
                </el-tab-pane>
                <el-tab-pane label="通讯录/会表" name="fifth" v-if="fifth">
                    <PortalApp :type="'通讯录'"></PortalApp>
                </el-tab-pane>
                <el-tab-pane label="公司发文" name="eighth" v-if="eighth">
                    <PortalApp :type="'集团发文'"></PortalApp>
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
            activeName: 'second',
            hasPowerForHB:false,
            first:true,
            second:true,
            third_2:true,
            fourth:true,
            fifth:true,
            eighth:true
        };
    },
    components: {
        PortalBase,
        PortalApp,
        PortalMobile
    },
    methods: {
        handleClick() {}
    },
    mounted(){
          if(['dongwy','gehao','tangyc','zhaozs'].includes(this.$store.getters.LoginData.username)){
                    this.first = this.second =  this.third_2 = this.fourth = this.eighth = false;
                    this.activeName =  'fifth';
            }
    }
};
</script>
<style lang="scss" scoped>
</style>