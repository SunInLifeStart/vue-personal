<template>
    <div id="InspectStatistics">
        <el-card>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="督办统计列表" name="first">
                    <el-row :gutter="12">
                        <el-col>
                            <el-form style="float:right" :model="search_form" ref="search_form">
                                <el-form-item prop="tjdate">
                                    <el-date-picker type="date" v-model="search_form.tjdate_input"></el-date-picker>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <!-- 表格 -->
                            <el-table :data="tablelistData" border>
                                <el-table-column prop="typemouth" label="类型|月份" align="center">
                                </el-table-column>
                                <el-table-column prop="January" label="一月" align="center">
                                </el-table-column>
                                <el-table-column prop="February" label="二月" align="center">
                                </el-table-column>
                                <el-table-column prop="March" label="三月" align="center">
                                </el-table-column>
                                <el-table-column prop="April" label="四月" align="center">
                                </el-table-column>
                                <el-table-column prop="May" label="五月" align="center">
                                </el-table-column>
                                <el-table-column prop="June" label="六月" align="center">
                                </el-table-column>
                                <el-table-column prop="July" label="七月" align="center">
                                </el-table-column>
                                <el-table-column prop="August" label="八月" align="center">
                                </el-table-column>
                                <el-table-column prop="September" label="九月" align="center">
                                </el-table-column>
                                <el-table-column prop="October" label="十月" align="center">
                                </el-table-column>
                                <el-table-column prop="November" label="十一月" align="center">
                                </el-table-column>
                                <el-table-column prop="December" label="十二月" align="center">
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="督办统计柱状图" name="second">
                    <el-row>
                        <el-col :span="24">
                            <div id="charts" style="width: 100%; height: 400px;"></div>
                        </el-col>
                    </el-row>

                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog title="机构选择" :visible.sync="dialogDisabled" width="46%">
            <el-tree :data="menuData" accordion node-key="id" :default-expanded-keys="[1]" @node-click="handleNodeClick"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="dialogDisabled = false">确定</el-button>
                <el-button type="primary" size="small" @click="dialogDisabled = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'InspectStatistics',
    data() {
        return {
            menuData: [],
            tableData: [],
            dialogDisabled: false,
            dateRange: [],
            selectOrg: '',
            activeName: 'first',
            tablelistData: [
                {
                    typemouth: '部门呈报',
                    January: 41,
                    February: 2,
                    March: 5,
                    April: 12,
                    May: 35,
                    June: 23,
                    July: 35,
                    August: 57,
                    September: 32,
                    October: 23,
                    November: 21,
                    December: 28
                },
                {
                    typemouth: '收文登记',
                    January: 41,
                    February: 2,
                    March: 5,
                    April: 12,
                    May: 35,
                    June: 23,
                    July: 35,
                    August: 57,
                    September: 32,
                    October: 23,
                    November: 21,
                    December: 28
                },
                {
                    typemouth: '发文拟稿',
                    January: 41,
                    February: 2,
                    March: 5,
                    April: 12,
                    May: 35,
                    June: 23,
                    July: 35,
                    August: 57,
                    September: 32,
                    October: 23,
                    November: 21,
                    December: 28
                }
            ],

            search_form: {
                tjdate_input: ''
            },
            isShowChart: false
        };
    },
    mounted() {
        // this.drawCharts();
        // this.selectItem = this.tableData[0];
    },
    computed: {
        dayNum() {
            let cnt = [];
            cnt = [
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
            ];
            return cnt;
        }
    },
    methods: {
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
                    data: ['部门呈报', '发文拟稿', '收文登记']
                },
                toolbox: {
                    show: true,
                    feature: {
                        myCalendar: {
                            show: true,
                            title: '机构选择',
                            icon:
                                'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                            onclick: function() {
                                self.dialogDisabled = true;
                            }
                        },
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
                        name: '部门呈报',
                        type: 'bar',
                        data: [
                            5,
                            20,
                            36,
                            10,
                            10,
                            20,
                            100,
                            30,
                            90,
                            140,
                            20,
                            200
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
                        name: '发文拟稿',
                        type: 'bar',
                        data: [
                            50,
                            200,
                            1,
                            100,
                            100,
                            200,
                            50,
                            100,
                            190,
                            30,
                            70,
                            130
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
                        name: '收文登记',
                        type: 'bar',
                        data: [
                            50,
                            80,
                            1,
                            100,
                            100,
                            200,
                            50,
                            16,
                            70,
                            90,
                            160,
                            40
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
        },
        handleNodeClick(data, node) {
            this.selectOrg = node.data.label;
        },
        handleClick() {
            if (this.activeName == 'second' && this.isShowChart == false) {
                setTimeout(() => {
                    this.drawCharts();
                }, 300);
            }
        }
    }
};
</script>
<style lang="scss">
</style>