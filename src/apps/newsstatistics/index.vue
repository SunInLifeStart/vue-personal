<template>
    <div id="NewsStatistics">
        <el-card>
            <el-tabs v-model="activeName" @tab-click="handleClickcontainer">
                <el-tab-pane label="公司比较" name="first">
                    <div class="content-container">
                        <el-card class="box-card" style="margin-top: 15px;">
                            <el-table :data="newsData" stripe style="width: 100%">
                                <el-table-column prop="organName" label="部门名称">
                                </el-table-column>
                                <el-table-column prop="affairsCount" label=" 政务采用数">
                                </el-table-column>
                                <el-table-column prop="mediaCount" label="媒体报道数">
                                </el-table-column>
                                <el-table-column prop="siteCount" label="外网采用数">
                                </el-table-column>
                                <el-table-column prop="oaCount" label="oa采用数">
                                </el-table-column>
                                <el-table-column prop="submitCount" label="微博采用数">
                                </el-table-column>
                                <el-table-column prop="useCount" label="采用信息数">
                                </el-table-column>
                                <!--
                                <el-table-column label="操作" width="200px">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'">
                                            <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content="删除" placement="right" v-if="scope.row.status == '已保存'">
                                            <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                -->
                            </el-table>
                        </el-card>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="统计管理" name="second">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="选择日期">
                            <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                            <el-button type="primary" @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-card class="box-card">
                        <div id="charts" style="width: 100%; height: 500px;"></div>
                    </el-card>
                    <!--
                    <div slot="header" class="clearfix">
                        <el-row>
                            <el-col :span="4" style="line-height: 28px;">信息统计图</el-col>
                            <el-col :span="20" style="text-align: right;">
                                选择日期：
                                <el-date-picker v-model="dateRange" type="daterange" size="mini" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                                <el-button type="primary" size="mini" @click="drawCharts" style="margin-left: 5px;">确定</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-button type="primary" size="mini" style="float: right; margin-left: 5px;">导出Excel</el-button>
                    <div id="charts" style="width: 100%; height: 400px;"></div>
                    <el-row style="font-size: 14px; text-align: center;">
                        <el-col :span="4">报送信息数: {{selectItem.submit}}</el-col>
                        <el-col :span="4">采用信息数: {{selectItem.use}}</el-col>
                        <el-col :span="4">外网采用数: {{selectItem.network}}</el-col>
                        <el-col :span="4">OA采用数: {{selectItem.oa}}</el-col>
                        <el-col :span="4">微信采用数: {{selectItem.wechat}}</el-col>
                        <el-col :span="4">微博采用数: {{selectItem.weibo}}</el-col>
                    </el-row>
                    -->
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import echarts from "echarts";
import axios from "axios";
import moment from "moment";
export default {
    name: "statistical-management",
    data() {
        return {
            formInline: {
                created: []
            },
            newsData: [],
            totalData: [],
            menuData: [
                {
                    id: 1,
                    label: "中关村集团",
                    children: [
                        {
                            id: 2,
                            label: "北京中关村科技金融创业服务集团有限公司"
                        },
                        {
                            id: 3,
                            label: "北京中关村科技融资担保有限公司"
                        },
                        {
                            id: 4,
                            label: "北京中关村软件园发展有限责任公司"
                        },
                        {
                            id: 5,
                            label: "北京中关村电子城建设有限公司"
                        },
                        {
                            id: 6,
                            label: "北京中关村生命科学园发展有限责任公司"
                        },
                        {
                            id: 7,
                            label: "北京实创高科技发展有限责任公司"
                        }
                    ]
                }
            ],
            tableData: [
                {
                    title: "北京中关村软件园发展有限责任公司",
                    submit: 81,
                    use: 48,
                    network: 11,
                    oa: 8,
                    wechat: 26,
                    weibo: 39,
                    affairs: 16
                },
                {
                    title: "北京中关村科技金融创业服务集团有限公司",
                    submit: 100,
                    use: 61,
                    network: 45,
                    oa: 25,
                    wechat: 56,
                    weibo: 48,
                    affairs: 58
                },
                {
                    title: "北京中关村电子城建设有限公司",
                    submit: 182,
                    use: 140,
                    network: 110,
                    oa: 160,
                    wechat: 148,
                    weibo: 125,
                    affairs: 101
                },
                {
                    title: "北京中关村科技融资担保有限公司",
                    submit: 200,
                    use: 152,
                    network: 101,
                    oa: 150,
                    wechat: 147,
                    weibo: 82,
                    affairs: 106
                }
            ],
            dialogDisabled: false,
            dateRange: [],
            selectItem: [],
            selectOrg: "",
            activeName: "first",
            arrayPush: [],
            bottomArray: [],
            typeArray: []
        };
    },
    mounted() {
        this.getForm();
        this.getEcharts();
        this.$store.getters.getMenusByType("newsstatistics");
        /** 
        setTimeout(() => {
            this.drawCharts();
        }, 3000);
        */
    },
    methods: {
        onSubmit() {
            this.getEcharts();
            setTimeout(() => {
                this.drawCharts();
            }, 1500);
        },
        onReset() {
            this.formInline.created = [];
            this.getEcharts();
            setTimeout(() => {
                this.drawCharts();
            }, 1500);
        },
        getEcharts() {
            const self = this;
            const params = {
                startTime: this.formInline.created[0]
                    ? moment(this.formInline.created[0]).format("YYYY-MM-DD")
                    : "",
                endTime: this.formInline.created[1]
                    ? moment(this.formInline.created[1]).format("YYYY-MM-DD")
                    : ""
            };
            axios
                .post(
                    "api/v1/activity_forms/statistics/findDates",
                    JSON.stringify(params),
                    {
                        headers: {
                            "Content-type": "application/json"
                        }
                    }
                )
                .then(res => {
                    this.bottomArray = res.data;
                    console.log(this.bottomArray);
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
            axios
                .post(
                    "/api/v1/activity_forms/statistics/count",
                    JSON.stringify(params),
                    {
                        headers: {
                            "Content-type": "application/json"
                        }
                    }
                )
                .then(res => {
                    self.totalData = res.data;
                    self.arrayPush = [];
                    self.typeArray = [];
                    // for (let data of self.totalData) {
                    //     self.typeArray.push(data.type);
                    //     let dataArray = [];
                    //     for (let items of this.bottomArray) {
                    //         console.log(data[items]);
                    //         dataArray.push(data[items]);
                    //     }
                    //     this.arrayPush.push({
                    //         name: data.type,
                    //         type: 'line',
                    //         data: [dataArray],
                    //         markPoint: {
                    //             data: [
                    //                 {
                    //                     type: 'max',
                    //                     name: '最大值'
                    //                 },
                    //                 {
                    //                     type: 'min',
                    //                     name: '最小值'
                    //                 }
                    //             ]
                    //         },
                    //         markLine: {
                    //             data: [
                    //                 {
                    //                     type: 'average',
                    //                     name: '平均值'
                    //                 }
                    //             ]
                    //         }
                    //     });
                    // }
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        getForm() {
            const self = this;
            axios
                .get("/api/v1/activity_forms/statistics")
                .then(res => {
                    self.newsData = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        handleClickcontainer() {
            if (this.activeName == "second") {
                setTimeout(() => {
                    this.drawCharts();
                }, 300);
            }
        },
        drawCharts() {
            var self = this;
            var myChart = echarts.init(document.getElementById("charts"));
            // var option = {
            //     title: {
            //         subtext: '数量:'
            //     },
            //     tooltip: {
            //         trigger: 'axis'
            //     },
            //     legend: {
            //         data: this.typeArray
            //     },
            //     toolbox: {
            //         show: true,
            //         feature: {
            //             myCalendar: {
            //                 show: false,
            //                 title: '机构选择',
            //                 icon:
            //                     'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
            //                 onclick: function() {
            //                     //self.dialogDisabled = true;
            //                 }
            //             },
            //             saveAsImage: {
            //                 show: true
            //             }
            //         }
            //     },
            //     calculable: true,
            //     xAxis: {
            //         type: 'category',
            //         data: this.bottomArray
            //     },
            //     yAxis: [
            //         {
            //             type: 'value'
            //         }
            //     ],
            //     series: this.arrayPush
            // };

            var option = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: [
                        "媒体报道量",
                        "政务采用量",
                        "外网采用数",
                        "oa采用数",
                        "信息报送数",
                        "微信采用数",
                        "微博采用数",
                        "采用信息数"
                    ]
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                yAxis: {
                    type: "value"
                },
                xAxis: {
                    type: "category",
                    data: this.bottomArray,
                    axisLabel: {
                        textStyle: {
                            color: "#000",
                            fontSize: 12
                        },
                        rotate: 30
                    }
                },
                series: [
                    {
                        name: this.totalData[0].type,
                        type: "bar",
                        stack: "总量",
                        label: {
                            normal: {
                                show: true,
                                position: "insideRight"
                            }
                        },
                        data: this.totalData[0].list
                    },
                    {
                        name: this.totalData[1].type,
                        type: "bar",
                        stack: "总量",
                        label: {
                            normal: {
                                show: true,
                                position: "insideRight"
                            }
                        },
                        data: this.totalData[1].list
                    },
                    {
                        name: this.totalData[2].type,
                        type: "bar",
                        stack: "总量",
                        label: {
                            normal: {
                                show: true,
                                position: "insideRight"
                            }
                        },
                        data: this.totalData[2].list
                    },
                    {
                        name: this.totalData[3].type,
                        type: "bar",
                        stack: "总量",
                        label: {
                            normal: {
                                show: true,
                                position: "insideRight"
                            }
                        },
                        data: this.totalData[3].list
                    },
                    {
                        name: this.totalData[4].type,
                        type: "bar",
                        stack: "总量",
                        label: {
                            normal: {
                                show: true,
                                position: "insideRight"
                            }
                        },
                        data: this.totalData[4].list
                    },
                    {
                        name: this.totalData[5].type,
                        type: "bar",
                        stack: "总量",
                        label: {
                            normal: {
                                show: true,
                                position: "insideRight"
                            }
                        },
                        data: this.totalData[5].list
                    },
                    {
                        name: this.totalData[6].type,
                        type: "bar",
                        stack: "总量",
                        label: {
                            normal: {
                                show: true,
                                position: "insideRight"
                            }
                        },
                        data: this.totalData[6].list
                    },
                    {
                        name: this.totalData[7].type,
                        type: "bar",
                        stack: "总量",
                        label: {
                            normal: {
                                show: true,
                                position: "insideRight"
                            }
                        },
                        data: this.totalData[7].list
                    }
                ]
            };
            myChart.setOption(option);
        },
        drawCharts1() {
            var self = this;
            var myChart = echarts.init(document.getElementById("charts"));
            var option = {
                title: {
                    subtext: "信息条数:"
                },
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["报送信息数", "采用信息数"]
                },
                toolbox: {
                    show: true,
                    feature: {
                        myCalendar: {
                            show: true,
                            title: "机构选择",
                            icon:
                                "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891",
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
                    type: "category",
                    boundaryGap: false,
                    data: self.dayNum
                },
                yAxis: [
                    {
                        type: "value"
                    }
                ],
                series: [
                    {
                        name: "报送信息数",
                        type: "line",
                        data: [5, 20, 36, 10, 10, 20],
                        markPoint: {
                            data: [
                                {
                                    type: "max",
                                    name: "最大值"
                                },
                                {
                                    type: "min",
                                    name: "最小值"
                                }
                            ]
                        },
                        markLine: {
                            data: [
                                {
                                    type: "average",
                                    name: "平均值"
                                }
                            ]
                        }
                    },
                    {
                        name: "采用信息数",
                        type: "line",
                        data: [50, 200, 1, 100, 100, 200],
                        markPoint: {
                            data: [
                                {
                                    type: "max",
                                    name: "最大值"
                                },
                                {
                                    type: "min",
                                    name: "最小值"
                                }
                            ]
                        },
                        markLine: {
                            data: [
                                {
                                    type: "average",
                                    name: "平均值"
                                }
                            ]
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    }
};
</script>
<style lang="scss">
</style>