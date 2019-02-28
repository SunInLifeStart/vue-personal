<template>
    <div>
        <el-button type="primary" @click="onExport">导出</el-button>
        <el-button type="primary" @click="Printing">打印</el-button>
        <h3>中关村发展集团股份有限公司</h3>
        <h3><span>2018年8月</span>-<span>2018年10月</span>滚动资金计划收支表</h3>
        <div class="contant">
            <span>党委办公室/集团办公室</span>
            <span class="unit">单位：元人民币</span>
        </div>
        
        <table style="width: 99%; height: 100%;margin-top: 5px; table-layout: fixed; word-break: break-all;" class="gridtable">
            <thead>
                <tr>
                    <th rowspan="2" colspan="3">项目</th>
                    <th colspan="3">季度合计</th>
                    <th colspan="3">2018年8月</th>
                    <th colspan="3">2018年9月</th>
                    <th colspan="3">2018年10月</th>
                    <th rowspan="2" colspan="2">编制依据、内容、标准、进展等</th>
                   
                </tr>
                <tr>
                    <th>预算内</th>
                    <th>预算外</th>
                    <th>小计</th>
                    <th>预算内</th>
                    <th>预算外</th>
                    <th>小计</th>
                    <th>预算内</th>
                    <th>预算外</th>
                    <th>小计</th>
                    <th>预算内</th>
                    <th>预算外</th>
                    <th>小计</th>
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
                    <td>1</td>
                    <td>1</td>
                    <td colspan="2">1</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return{

        }
    },
    methods:{
        //导出
        onExport(){},
        //打印
        Printing(){},
        getList () {
             let params = JSON.parse(JSON.stringify(this.summaryData.idCollection));    //深拷贝
        // POST /api/v1/budget/capitalGroupForm/temporaryCollect?year=年度&month=月度
            let url = `/budget/capitalGroupForm/temporaryCollect?year=${this.summaryData.year}&month=${this.summaryData.month}`
            axios.post(url,JSON.stringify(params),{
                 headers: {
                    'Content-type': 'application/json'
                }
            }).then(res => {
                let data = res.data;
                console.log(data)

            }).catch(err => {
                console.log(err,'临时汇总',);
            })
        }
    },
    props : ['summaryData'],
    created () {
       this.getList();
        
    },
    
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
