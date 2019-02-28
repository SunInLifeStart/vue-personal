<template>
    <div>
        <h3>中关村发展集团股份有限公司</h3>
        <h3>{{this.year}}年{{this.title}}预算表</h3>
        <div class="contant">
            <span>中关村发展集团股份有限公司</span>
            <span class="unit">单位：元</span>
        </div>
        <table style="width: 99%; height: 100%;margin-top: 5px; table-layout: fixed; word-break: break-all;" class="gridtable">
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <col style="width: 5%" />
            <thead>
                <tr>
                    <th>项目</th>
                    <th>上年执行数</th>
                    <th>上年预算数</th>
                    <th>差异金额</th>
                    <th>完成比例</th>
                    <th>差异原因（未完成预算的收入、超出预算的支出需要特别说明内容、金额、原因、保障措施等）</th>
                    <th>全年预算合计</th>
                    <th>增减率</th>
                    <th>1季度</th>
                    <th>2季度</th>
                    <th>3季度</th>
                    <th>4季度</th>
                    <th>编制依据、内容、标准、进展等</th>

                </tr>
            </thead>
            <tbody>
                <tr v-for="item in this.tableData.listTzzcjwlzc" :key="item.id">
                    <td style="text-align: left">{{item.target}}</td>
                    <td>
                        <el-input v-model="item.lastyearExecution" @input="getRow(item,'one')"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.lastyearBudget" @input="getRow(item,'one')"></el-input>
                    </td>
                    <!-- 差异金额 -->
                    <td>
                        {{item.diffAmount}}
                    </td>
                    <td>
                        {{item.completeProportion}}
                    </td>
                    <td>
                        <el-input v-model="item.reason"></el-input>
                    </td>
                    <td>
                        {{item.annualBudget}}
                    </td>
                    <td>
                        {{item.gradient}}
                    </td>
                    <td>
                        <el-input v-model="item.firstQuarter" @input="getRow(item,'two')"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.secondQuarter" @input="getRow(item,'two')"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.thirdQuarter" @input="getRow(item,'two')"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.fourthQuarter" @input="getRow(item,'two')"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.content"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'flowother14',
    data() {
        return {
            tableData: {
                listTzzcjwlzc: this.searchOptions
            }
        }
    },
    mounted() {
        console.log(this.title)
        console.log('jelkjaflkd')
    },
    props: ['searchOptions' , 'title' , 'year'],
    methods: {
        //计算
        getRow(res, type) {
            if (type == 'one') {
                if (res.lastyearExecution && res.lastyearBudget) {
                    res.diffAmount = res.lastyearExecution - res.lastyearBudget; //差异金额
                    res.completeProportion = this.common.toDecimal2(res.lastyearExecution * 100 / res.lastyearBudget) + '%';  //完成比例
                }
            }
            if (type == 'two') {
                if (res.firstQuarter && res.secondQuarter && res.thirdQuarter && res.fourthQuarter) {
                    res.annualBudget = (parseFloat(res.firstQuarter) + parseFloat(res.secondQuarter) + parseFloat(res.thirdQuarter) + parseFloat(res.fourthQuarter)); //本年度预算合计
                }
            }
            if (res.annualBudget && res.lastyearExecution) {
                res.gradient = this.common.toDecimal2((res.annualBudget / res.lastyearExecution) - 1);  //增减率
            }
        }
    }
}
</script>
<style scoped>
table.gridtable {
  font-family: verdana, arial, sans-serif;
  font-size: 11px;
  color: #333333;
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
  border-style: solid;
  border-color: #666666;
  background-color: #ffffff;
  text-align: right;
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
  position: absolute;
  right: 9px;
}
</style>
