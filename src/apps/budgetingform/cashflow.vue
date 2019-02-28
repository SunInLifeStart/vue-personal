<template>
    <div id="cashflow" style="height: 100%; width: 100%">
        <p style="text-align: center;">中关村发展集团股份有限公司</p>
        <h3 style="text-align: center;">2018年现金流量预算表</h3>
        <span style="float:right">单位：元</span>
        <table style="width: 100%; table-layout: fixed; word-break: break-all;">
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <tr>
                <th>项目</th>
                <th>上年执行数</th>
                <th>上年预算数</th>
                <th>差异金额</th>
                <th>完成比例</th>
                <th>全年预算合计</th>
                <th>增减率</th>
                <th>1季度</th>
                <th>2季度</th>
                <th>3季度</th>
                <th>4季度</th>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: 'cashflow',
    data() {
        return {};
    }
};
</script>
<style lang="scss">
    #cashflow{
        table {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        width: 100%;
    }
    table td,
    table th {
        border: 1px solid #000;
        color: #000;
        height: 40px;
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
    }
</style>