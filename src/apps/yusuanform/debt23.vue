<template>
    <div id="debt23" class="main-container">
        <p style="margin-top: 15px; text-align: center;">中关村发展集团股份有限公司</p>
        <p style="margin-top: 5px; text-align: center;font-size: 20px;font-weight: bold;">2018年偿还债务预算表</p>
        <table border="1px solid #f00" style="width: 95%; height: 80%; table-layout: fixed; word-break: break-all;margin-top:20px;">
            <col style="width: 7%" />
            <col style="width: 7%" />
            <col style="width: 7%" />
            <col style="width: 7%" />
            <col style="width: 7%" />
            <col style="width: 10%" />
            <col style="width: 7%" />
            <col style="width: 7%" />
            <col style="width: 7%" />
            <col style="width: 7%" />
            <col style="width: 7%" />
            <col style="width: 7%" />
            <col style="width: 7%" />
            <tr>
                <td>项目</td>
                <td>上年执行数</td>
                <td>上年预算数</td>
                <td>差异金额</td>
                <td>完成比例(%)</td>
                <td>差异原因(未完成预算的收入、超出预算的支出需要特别说明内容、金额、原因、保障措施等)</td>
                <td>全年预算合计</td>
                <td>增减率</td>
                <td>1季度</td>
                <td>2季度</td>
                <td>3季度</td>
                <td>4季度</td>
                <td>编制依据、内容、标准、进展等</td>
            </tr>
            <tr v-for="(item,index) in tabledata" :key="item.id">
                <td>
                    <el-input v-model="item.target" placeholder=""></el-input>
                </td>
                <td>
                    <el-input v-model="item.lastyearExecution" placeholder="" @input="loseFocus(item,index,'shangnian')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.lastyearBudget" placeholder="" @input="loseFocus(item,index,'shangnian')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.diffAmount" disabled></el-input>
                </td>
                <td>
                    <el-input v-model="item.completeProportion" disabled></el-input>
                </td>
                <td>
                    <el-input v-model="item.reason"></el-input>
                </td>
                <td>
                    <el-input v-model="item.annualBudget" disabled></el-input>
                </td>
                <td>
                    <el-input v-model="item.gradient" disabled></el-input>
                </td>
                <td>
                    <el-input v-model="item.firstQuarter" @input="loseFocus(item,index,'jidu')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.secondQuarter" @input="loseFocus(item,index,'jidu')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.thirdQuarter" @input="loseFocus(item,index,'jidu')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.fourthQuarter" @input="loseFocus(item,index,'jidu')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.content"></el-input>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    name: 'debt23',
    mounted() {
        console.log('这是打印的偿还债务2222');
        console.log(this.tabledata);
    },
    props: ['tabledata'],
    data() {
        return {};
    },

    components: {},
    methods: {
        loseFocus(item, index, type) {
            if (type == 'shangnian') {
                if (item.lastyearExecution != '' && item.lastyearBudget != '') {
                    item.diffAmount =
                        parseFloat(item.lastyearExecution) -
                        parseFloat(item.lastyearBudget);
                    item.completeProportion = this.common.toDecimal2(
                        parseFloat(item.lastyearExecution) /
                            parseFloat(item.lastyearBudget) *
                            100
                    );
                } else {
                    item.diffAmount = 0;
                    item.completeProportion = 0;
                }
            } else if (type == 'jidu') {
                item.firstQuarter =
                    item.firstQuarter == '' ? '0' : item.firstQuarter;
                item.secondQuarter =
                    item.secondQuarter == '' ? '0' : item.secondQuarter;
                item.thirdQuarter =
                    item.thirdQuarter == '' ? '0' : item.thirdQuarter;
                item.fourthQuarter =
                    item.fourthQuarter == '' ? '0' : item.fourthQuarter;
                item.annualBudget = String(
                    parseFloat(item.firstQuarter) +
                        parseFloat(item.secondQuarter) +
                        parseFloat(item.thirdQuarter) +
                        parseFloat(item.fourthQuarter)
                );
            }
            if (item.annualBudget != '' && item.lastyearExecution != '') {
                item.gradient = String(
                    this.common.toDecimal2(
                        parseFloat(item.annualBudget) /
                            parseFloat(item.lastyearExecution)
                    ) - 1
                );
            } else {
                item.gradient = '0';
            }
        },
        getTableDate() {
            for (let data of this.tabledata) {
                data.table = 'budget_dpt_chzw';
            }
            // this.$emit('getTableData');
            /** 
            this.$emit('getTableDate', {
                data: this.tabledata,
                type: 'dept23'
            });
            */
        }
    }
};
</script>
<style lang="scss" >
#debt23 {
    table {
        border-collapse: collapse;
        margin: 0 auto;
        width: 90%;
        text-align: center;
    }
    table td,
    table th {
        border: 1px solid #000;
        color: #000;
        height: 30px;
        vertical-align: middle;
    }
    table thead th {
        background-color: #cce8eb;
    }
    table tr:nth-child(odd) {
        background: #fff;
    }
    table tr:nth-child(even) {
        background: #fff;
    }
    .el-table--border td,
    .el-table--border th,
    .el-table__body-wrapper
        .el-table--border.is-scrolling-left
        ~ .el-table__fixed {
        border-right: 1px solid #020819;
    }
    .el-table td,
    .el-table th.is-leaf {
        border-bottom: 1px solid #020819;
    }
}
</style>