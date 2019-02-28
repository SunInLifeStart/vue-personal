<template>
    <div id="SupplyTotalList">
        <table width="100%" class="table2_1">
            <tr class="el-table__row">
                <td rowspan="2" style="background-color:#ecebf3;" v-show="testData.organs && testData.organs.length > 0">种类/部门</td>
                <td colspan="2" v-for="item in testData.organs" :key="item">{{item}}</td>
            </tr>
            <tr>
                <td v-for="item in testData.word" :key="item.index">
                    {{item}}
                </td>
            </tr>
            <tr v-for="(item, index) in testData.prods" :key="item.index">
                <td>{{item}}
                </td>
                <td v-for="items in testData.arr[index]" :key="items.index">
                    {{items}}
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'SupplyTotalList',
    data() {
        return {
            testData: {
                /** 
                arr: [
                    [
                        ['30', '1.0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0']
                    ],
                    [
                        ['0', '0'],
                        ['0', '0'],
                        ['77', '154.0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0']
                    ],
                    [
                        ['30', '1.0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0']
                    ],
                    [
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['30', '60.0'],
                        ['0', '0'],
                        ['0', '0']
                    ],
                    [
                        ['0', '0'],
                        ['30', '1.0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['30', '1.0'],
                        ['30', '22.0']
                    ],
                    [
                        ['30', '11.0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0'],
                        ['0', '0']
                    ]

                ],
                organs: [
                    '财务部',
                    '人力部',
                    '后勤部',
                    '研发部',
                    '技术部',
                    null
                ],
                prods: [
                    '圆珠笔',
                    '中性笔',
                    '垃圾桶',
                    '笔记本',
                    '墨水',
                    '订书器'
                ]
                */
            },
            tableData: []
        };
    },
    props: ['searchOptions'],
    watch: {
        searchOptions: function() {
            this.getList();
        }
    },
    methods: {
        getList() {
            const self = this;
            const params = {
                starTime: this.searchOptions[0] ? this.searchOptions[0] : '',
                endTime: this.searchOptions[1] ? this.searchOptions[1] : ''
            };
            axios
                .post(
                    '/api/v1/supply_forms/statistics',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.testData = res.data;
                    if (this.testData.organs.length > 0) {
                        let arr = [];
                        let word = [];
                        for (let i = 0; i < this.testData.arr.length; i++) {
                            let arr1 = [];
                            for (
                                let j = 0;
                                j < this.testData.arr[i].length;
                                j++
                            ) {
                                arr1.push(this.testData.arr[i][j][0]);
                                arr1.push(this.testData.arr[i][j][1]);
                            }
                            arr.push(arr1);
                        }
                        for (let dataa of this.testData.organs) {
                            word.push('数量');
                            word.push('金额');
                        }
                        this.testData.word = word;
                        this.testData.arr = arr;
                    }
                    if (res.data.prods.length > 0) {
                        for (let i = 0; i < res.data.prods.length; i++) {
                            if (res.data.prods[i] == null) {
                                res.data.prods[i] = '无数据';
                            }
                        }
                        this.testData.prods = res.data.prods;
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    },
    mounted() {
        this.getList();
        /** 
        let arr = [];
        let word = [];
        for (let i = 0; i < this.testData.arr.length; i++) {
            let arr1 = [];
            for (let j = 0; j < this.testData.arr[i].length; j++) {
                arr1.push(this.testData.arr[i][j][0]);
                arr1.push(this.testData.arr[i][j][1]);
            }
            arr.push(arr1);
            word.push('数量');
            word.push('金额');
        }
        this.testData.word = word;
        this.testData.arr = arr;
        */
    }
};
</script>
<style lang="scss" scoped>
table {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
}
table td,
table th {
    border: 1px solid #cad9ea;
    color: #666;
    height: 30px;
    text-align: center;
}
table thead th {
    background-color: #cce8eb;
    width: 100px;
    text-align: center;
}
table tr:nth-child(odd) {
    background: #fff;
}
table tr:nth-child(even) {
    background: #fff;
    text-align: center;
}
</style>
