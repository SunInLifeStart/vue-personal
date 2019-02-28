<template>
    <div id="Super">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="信息发布申请" name="first" v-if="this.showxxfbsq">
                <InformationRelease></InformationRelease>
            </el-tab-pane>
            <el-tab-pane label="专项报告" name="second" v-if="this.showzxbg">
                <index></index>
            </el-tab-pane>
            <!-- <el-tab-pane label="监督举报" name="fgzd">
                <Inform></Inform>
            </el-tab-pane> -->
            <el-tab-pane label="统计报告" name="three" v-if="this.showtjbg">
                <Statistics></Statistics>
            </el-tab-pane>

        </el-tabs>

    </div>
</template>
<script>
import InformationRelease from './InformationRelease';
import index from '../special/index';
import Inform from './Inform';
import Statistics from './Statistics';
export default {
    name: 'super',
    data() {
        return {
            activeName: 'first',
            showxxfbsq: false,
            showzxbg: false,
            showtjbg: false,
            params: {
                announcementId: '',
                title: '',
                grassUserUnit: '',
                grassUser: '',
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            searchword: {
                title: '',
                grassUser: '',
                grassUserUnit: '',
                fwlx: ''
            },
            activeIndex2: '1',
            detailselected: [],
            tableDraftData: [],
            tablePolicyData: [],
            tableLawsData: [],
            tableEducationData: [],
            tableWorkData: []
        };
    },
    mounted() {
        for (let data of this.$store.getters.getMenusByType('super')) {
            if (data.code == 'xxfbsq') {
                this.showxxfbsq = true;
            } else if (data.code == 'zxbg') {
                this.showzxbg = true;
            } else if (data.code == 'tjbg') {
                this.showtjbg = true;
            }
        }
        this.activeName = this.showxxfbsq
            ? 'first'
            : this.showzxbg ? 'second' : 'three';
    },
    components: {
        InformationRelease,
        index,
        Inform,
        Statistics
    },
    methods: {
        handleClick() {}
    }
};
</script>
<style lang="scss" scoped>
#Super {
    h4 {
        margin: 0;
        padding: 0;
    }
    .new-notice {
        float: right;
        margin: -32px 0 0 0;
    }
}
</style>


