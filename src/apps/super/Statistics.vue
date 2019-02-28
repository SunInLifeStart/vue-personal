<template>
    <div id="statistical-report">
        <el-card shadow="always">
            <StatisticsFilter @searchList="getSearchOptions"></StatisticsFilter>
            <StatisticsList  :searchOptions="searchOptions"></StatisticsList>
        </el-card><br>
        <el-card shadow="always">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="下载明细" name="first">
                    <StatisticsDownloadDetailsList></StatisticsDownloadDetailsList>
                </el-tab-pane>
                <el-tab-pane label="上传明细" name="second">
                     <StatisticsParticularsList></StatisticsParticularsList>
                </el-tab-pane>
            </el-tabs>
        </el-card>

    </div>
</template>
<script>
import StatisticsFilter from './StatisticsFilter';
import StatisticsList from './StatisticsList';
import StatisticsParticularsList from './StatisticsParticularsList';
import StatisticsDownloadDetailsList from './StatisticsDownloadDetailsList';
export default {
    name: 'Statistics',
    data() {
        return {
            activeName: 'first',
            searchOptions:''
        };
    },
    components: {
        StatisticsFilter,
        StatisticsList,
        StatisticsParticularsList,
        StatisticsDownloadDetailsList
    },
    methods: {
        handleClick(){},
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
    }
};
</script>

