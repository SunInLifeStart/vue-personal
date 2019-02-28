<template>
    <div id="VehiclePrint" >
        <div style="margin-top: 15px;text-align: center; font-size: 20px;font-weight: bold; width:100%">中关村发展集团公务用车出差单</div>
        <table border="1px solid #f00" style="width: 100%; height: 80%; table-layout: fixed; word-break: break-all;margin-top:20px;">
            <col style="width: 3%" />
            <col style="width: 20%" />
            <col style="width: 10%" />
            <col style="width: 3%" />
            <col style="width: 20%" />
            <col style="width: 10%" />
            <col style="width: 3%" />
            <col style="width: 20%" />
            <col style="width: 10%" />
            <!-- <tr style="border:0;">
                <td colspan="9" style="border:0;text-align: center;"> 中关村发展集团公务用车出差单</td>
            </tr> -->
            <tr>
                <td colspan="3">
                    用车人：{{printData.transportPpl ?printData.transportPpl : ''}}
                </td>
                <td colspan="3">
                    部门：{{printData.organName}}
                </td>
                <td colspan="3">
                    出车时间：{{printData.startTime ? printData.startTime : ''}}
                </td>
            </tr>
            <tr>
                <td colspan="9">用车事项:{{printData.reason ? printData.reason: ''}}</td>
            </tr>
            <tr>
                <td colspan="6">目的地：{{printData.destination ? printData.destination : ''}}</td>
                <td colspan="3">回车时间:{{printData.receipts? printData.receipts.receiptTime ? printData.receipts.receiptTime : '': ''}}</td>
            </tr>
            <tr>
                <td colspan="6">出车车辆(号牌)：{{printData.vehicles? printData.vehicles.plateNum ? printData.vehicles.plateNum : '': ''}}</td>
                <td colspan="3">司机:{{printData.drivers? printData.drivers.name ? printData.drivers.name : '': ''}}</td>
            </tr>
            <tr>
                <td colspan="9">备注:</td>
            </tr>
            <tr>
                <td colspan="1">经办人:</td>
                <td colspan="2"> {{this.shenqing}}</td>
                <td colspan="1">部门领导:</td>
                <td colspan="2">{{this.leader}}</td>
                <td colspan="1">车管人员:</td>
                <td colspan="2">{{this.siji}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
/* eslint-disable */
import moment from 'moment';
export default {
    name: 'VehiclePrint',
    data() {
        return {
            shenqing: '',
            leader: '',
            siji: ''
        };
    },
    props: ['printData'],
    watch: {
        printData: function() {
            this.getComments();
        }
    },
    mounted() {
        this.getComments();
    },
    methods: {
        getComments() {
            this.shenqing = '';
            this.leader = '';
            this.siji = '';
            if (this.printData.comments) {
                for (let data of this.printData.comments) {
                    if (data.content == '提交') {
                        this.shenqing =
                            data.creatorName +
                            '(' +
                            moment(data.created).format('YYYY-MM-DD hh:mm:ss') +
                            ')';
                    } else if (data.content == '同意') {
                        this.leader =
                            data.creatorName +
                            '(' +
                            moment(data.created).format('YYYY-MM-DD hh:mm:ss') +
                            ')';
                    } else if (data.content == '安排') {
                        this.siji =
                            data.creatorName +
                            '(' +
                            moment(data.created).format('YYYY-MM-DD hh:mm:ss') +
                            ')';
                    }
                }
            }
        }
    }
};
</script>
<style lang="scss" >
#VehiclePrint {
    table {
        border-collapse: collapse;
        margin: 0 auto;
        width: 100%;
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