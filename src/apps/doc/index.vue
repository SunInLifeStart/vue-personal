<template>
    <div id="Doc" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="公文查询" name="first" v-if="this.showgwcx">
                    <el-card class="box-card">
                        <DocFilter @searchList="getSearchOptions"></DocFilter>
                        <DocViewList @formId="getFormId" :searchOptions="searchOptions"></DocViewList>
                    </el-card>
                    <br>
                    <el-card class="box-card">
                        <DocViewDetail :formId="formId" v-if="this.isSubmission"></DocViewDetail>
                        <DocOutgoingDetail :formId="formId" v-if="this.isOutgoing"></DocOutgoingDetail>
                        <DocIncomingDetail :formId="formId" v-if="this.isIncoming"></DocIncomingDetail>
                    </el-card>
                </el-tab-pane>
                <el-tab-pane label="公文统计" name="second" v-if="this.showgwtj">
                    <el-card class="box-card">
                        <el-tabs v-model="changetotal" @tab-click="handleClickcontainer">
                            <el-tab-pane label="公文统计列表" name="one">
                                <DocTotalList @getList="getList"></DocTotalList>
                            </el-tab-pane>
                            <el-tab-pane label="公文统计柱状图" name="two">
                                <div id="charts" style="width: 1200px; height: 400px;"></div>
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </el-tab-pane>
            </el-tabs>
            <!--
            <el-dialog title="机构选择" :visible.sync="dialogDisabled" width="46%">
                <el-tree :data="menuData" accordion node-key="id" :default-expanded-keys="[1]" @node-click="handleNodeClick"></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" @click="dialogDisabled = false">确定</el-button>
                    <el-button type="primary" size="small" @click="dialogDisabled = false">取消</el-button>
                </span>
            </el-dialog>
            -->
        </div>
    </div>
</template>
<script>
import DocViewList from './DocViewList';
import DocFilter from './DocFilter';
import DocTotalList from './DocTotalList';
import DocViewDetail from './DocViewDetail';
import DocOutgoingDetail from './DocOutgoingDetail';
import DocIncomingDetail from './DocIncomingDetail';
import echarts from 'echarts';
export default {
    name: 'Doc',
    mounted() {
        for (let data of this.$store.getters.getMenusByType('doc')) {
            if (data.code == 'gwcx') {
                this.showgwcx = true;
            } else if (data.code == 'gwtj') {
                this.showgwtj = true;
            }
        }
        this.activeName = this.showgwcx ? 'first' : 'second';
        console.log(this.activeName);
    },
    data() {
        return {
            activeName: 'first',
            showgwcx: false,
            showgwtj: false,
            changetotal: 'one',
            dialogDisabled: false,
            isOutgoing: true,
            isIncoming: false,
            isSubmission: false,
            menuData: [],
            formId: '',
            searchOptions: [],
            totalData: []
        };
    },
    components: {
        DocViewList,
        DocFilter,
        DocTotalList,
        DocViewDetail,
        DocOutgoingDetail,
        DocIncomingDetail
    },
    methods: {
        getList(list) {
            this.totalData = list;
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id, type) {
            this.formId = id;
            console.log(type);
            if (type == 'outgoing') {
                this.isOutgoing = true;
                this.isIncoming = false;
                this.isSubmission = false;
            } else if (type == 'incoming') {
                this.isOutgoing = false;
                this.isIncoming = true;
                this.isSubmission = false;
            } else if (type == 'submission') {
                this.isOutgoing = false;
                this.isIncoming = false;
                this.isSubmission = true;
            }
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleNodeClick() {},
        handleClickcontainer() {
            if (this.changetotal == 'two') {
                setTimeout(() => {
                    this.drawCharts();
                }, 300);
            }
        },
        drawCharts() {
            var self = this;
            var myChart = echarts.init(document.getElementById('charts'));
            var option = {
                title: {
                    subtext: '数量:'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [
                        this.totalData[0].type,
                        this.totalData[1].type,
                        this.totalData[2].type
                    ]
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: true,
                xAxis: {
                    type: 'category',
                    data: [
                        '1月',
                        '2月',
                        '3月',
                        '4月',
                        '5月',
                        '6月',
                        '7月',
                        '8月',
                        '9月',
                        '10月',
                        '11月',
                        '12月'
                    ]
                },
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: this.totalData[0].type,
                        type: 'bar',
                        data: [
                            this.totalData[0].jan,
                            this.totalData[0].feb,
                            this.totalData[0].mar,
                            this.totalData[0].apr,
                            this.totalData[0].may,
                            this.totalData[0].jun,
                            this.totalData[0].jul,
                            this.totalData[0].aug,
                            this.totalData[0].sept,
                            this.totalData[0].oct,
                            this.totalData[0].nov,
                            this.totalData[0].dec
                        ],
                        markPoint: {
                            data: [
                                {
                                    type: 'max',
                                    name: '最大值'
                                },
                                {
                                    type: 'min',
                                    name: '最小值'
                                }
                            ]
                        },
                        markLine: {
                            data: [
                                {
                                    type: 'average',
                                    name: '平均值'
                                }
                            ]
                        }
                    },
                    {
                        name: this.totalData[1].type,
                        type: 'bar',
                        data: [
                            this.totalData[1].jan,
                            this.totalData[1].feb,
                            this.totalData[1].mar,
                            this.totalData[1].apr,
                            this.totalData[1].may,
                            this.totalData[1].jun,
                            this.totalData[1].jul,
                            this.totalData[1].aug,
                            this.totalData[1].sept,
                            this.totalData[1].oct,
                            this.totalData[1].nov,
                            this.totalData[1].dec
                        ],
                        markPoint: {
                            data: [
                                {
                                    type: 'max',
                                    name: '最大值'
                                },
                                {
                                    type: 'min',
                                    name: '最小值'
                                }
                            ]
                        },
                        markLine: {
                            data: [
                                {
                                    type: 'average',
                                    name: '平均值'
                                }
                            ]
                        }
                    },
                    {
                        name: this.totalData[2].type,
                        type: 'bar',
                        data: [
                            this.totalData[2].jan,
                            this.totalData[2].feb,
                            this.totalData[2].mar,
                            this.totalData[2].apr,
                            this.totalData[2].may,
                            this.totalData[2].jun,
                            this.totalData[2].jul,
                            this.totalData[2].aug,
                            this.totalData[2].sept,
                            this.totalData[2].oct,
                            this.totalData[2].nov,
                            this.totalData[2].dec
                        ],
                        markPoint: {
                            data: [
                                {
                                    type: 'max',
                                    name: '最大值'
                                },
                                {
                                    type: 'min',
                                    name: '最小值'
                                }
                            ]
                        },
                        markLine: {
                            data: [
                                {
                                    type: 'average',
                                    name: '平均值'
                                }
                            ]
                        }
                    }
                ]
            };
            myChart.setOption(option);
            this.isShowChart = true;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>