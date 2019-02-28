<template>
    <div id="distributionprofits25" class="main-container">
        <p style="margin-top: 15px; text-align: center;">中关村发展集团股份有限公司</p>
        <p style="margin-top: 5px; text-align: center;font-size: 20px;font-weight: bold;">2018年利润分配预算表</p>
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
                <td>完成比例</td>
                <td>差异原因(未完成预算的收入、超出预算的支出需要特别说明内容、金额、原因、保障措施等)</td>
                <td>全年预算合计</td>
                <td>增减率</td>
                <td>1季度</td>
                <td>2季度</td>
                <td>3季度</td>
                <td>4季度</td>
                <td>编制依据、内容、标准、进展等</td>
            </tr>
            <tr v-for="(item,index) in tableData" :key="item.id">
                <td>
                    <el-input v-model="item.xiangmu" placeholder="" @input="loseFocus(item,index,'shangnian')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.shangzhi" placeholder="" @input="loseFocus(item,index,'shangnian')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.shangyusuan" placeholder=""></el-input>
                </td>
                <td>
                    <el-input v-model="item.chayi" disabled></el-input>
                </td>
                <td>
                    <el-input v-model="item.bili" disabled></el-input>
                </td>
                <td>
                    <el-input v-model="item.reason"></el-input>
                </td>
                <td>
                    <el-input v-model="item.total" disabled></el-input>
                </td>
                <td>
                    <el-input v-model="item.zengjian" disabled></el-input>
                </td>
                <td>
                    <el-input v-model="item.ojidu" @input="loseFocus(item,index,'jidu')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.tjitu" @input="loseFocus(item,index,'jidu')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.sjidu" @input="loseFocus(item,index,'jidu')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.fjidu" @input="loseFocus(item,index,'jidu')"></el-input>
                </td>
                <td>
                    <el-input v-model="item.bianzhi"></el-input>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    name: 'distributionprofits25',
    mounted() {},
    data() {
        return {
            tableData: [
                {
                    id: '1',
                    xiangmu: '1',
                    shangzhi: '',
                    shangyusuan: '',
                    chayi: '',
                    bili: '',
                    reason: '111111',
                    total: '',
                    zengjian: '',
                    ojidu: '',
                    tjitu: '',
                    sjidu: '',
                    fjidu: '',
                    bianzhi: '1111'
                },
                {
                    id: '2',
                    xiangmu: '2',
                    shangzhi: '',
                    shangyusuan: '',
                    chayi: '',
                    bili: '',
                    reason: '2222',
                    total: '',
                    zengjian: '',
                    ojidu: '',
                    tjitu: '',
                    sjidu: '',
                    fjidu: '',
                    bianzhi: '2222'
                },
                {
                    id: '3',
                    xiangmu: '2',
                    shangzhi: '',
                    shangyusuan: '',
                    chayi: '',
                    bili: '',
                    reason: '2222',
                    total: '',
                    zengjian: '',
                    ojidu: '',
                    tjitu: '',
                    sjidu: '',
                    fjidu: '',
                    bianzhi: '2222'
                },
                {
                    id: '4',
                    xiangmu: '2',
                    shangzhi: '',
                    shangyusuan: '',
                    chayi: '',
                    bili: '',
                    reason: '2222',
                    total: '',
                    zengjian: '',
                    ojidu: '',
                    tjitu: '',
                    sjidu: '',
                    fjidu: '',
                    bianzhi: '2222'
                },
                {
                    id: '5',
                    xiangmu: '2',
                    shangzhi: '',
                    shangyusuan: '',
                    chayi: '',
                    bili: '',
                    reason: '2222',
                    total: '',
                    zengjian: '',
                    ojidu: '',
                    tjitu: '',
                    sjidu: '',
                    fjidu: '',
                    bianzhi: '2222'
                }
            ]
        };
    },
    components: {},
    methods: {
        loseFocus(item, index, type) {
            if (type == 'shangnian') {
                if (item.shangzhi != '' && item.shangyusuan != '') {
                    item.chayi =
                        parseFloat(item.shangzhi) -
                        parseFloat(item.shangyusuan);
                    item.bili =
                        this.common.toDecimal2(
                            parseFloat(item.shangzhi) /
                                parseFloat(item.shangyusuan) *
                                100
                        ) + '%';
                } else {
                    item.chayi = 0;
                    item.bili = 0 + '%';
                }
            } else if (type == 'jidu') {
                item.ojidu = item.ojidu == '' ? '0' : item.ojidu;
                item.tjitu = item.tjitu == '' ? '0' : item.tjitu;
                item.sjidu = item.sjidu == '' ? '0' : item.sjidu;
                item.fjidu = item.fjidu == '' ? '0' : item.fjidu;
                item.total = String(
                    parseFloat(item.ojidu) +
                        parseFloat(item.tjitu) +
                        parseFloat(item.sjidu) +
                        parseFloat(item.fjidu)
                );
            }
            if (item.total != '' && item.shangzhi != '') {
                item.zengjian = String(
                    this.common.toDecimal2(
                        parseFloat(item.total) / parseFloat(item.shangzhi)
                    ) - 1
                );
            } else {
                item.zengjian = '0';
            }
        }
    }
};
</script>
<style lang="scss" >
#distributionprofits25 {
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