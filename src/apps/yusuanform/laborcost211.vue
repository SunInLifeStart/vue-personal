<template>
    <div>
        <h3>人工成本明细表</h3>
        <div class="contant">
            <span>中关村协同发展</span>
            <span class="unit">单位：元</span>
        </div>
        <!--2-1-1 表-->
        <table style="width: 99%; height: 100%;margin-top: 5px; table-layout: fixed; word-break: break-all;" class="gridtable">
            <thead>
                <tr>
                    <th colspan="3">项目</th>
                    <th>上年执行数</th>
                    <th>上年预算数</th>
                    <th>差异金额</th>
                    <th>完成比例</th>
                    <th>预算1季度</th>
                    <th>预算2季度</th>
                    <th>预算3季度</th>
                    <th>预算4季度</th>
                    <th>全年预算合计</th>
                    <th>增减率</th>
                   
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="3">111</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    name:'laborcost211'
}
</script>
<style scoped>
table.gridtable {
    font-family: verdana,arial,sans-serif;
    font-size:11px;
    color:#333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
 }
 table.gridtable th {
     border-width: 1px;
     padding: 8px;
     border-style: solid;
     border-color: #666666;
     background-color: #dedede;
 }
 table.gridtable td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #ffffff;
    text-align: center;
 }
 h3 {
     text-align: center;
     margin: 0 auto;
 }
 .contant {
     position: relative;
     width: 100%;
     height: 20px;
     margin-top: 10px;
 }
 .unit {
     width: 100px;
     height: 20px;
     position:absolute;
     right: 9px;
 }
</style>
