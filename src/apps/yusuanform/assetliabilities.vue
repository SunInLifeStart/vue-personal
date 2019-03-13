<template>
    <div id="assetliabilities" class="main-container">
        <p style="margin-top: 15px; text-align: center;">中关村协同发展</p>
        <p style="margin-top: 5px; text-align: center;font-size: 20px;font-weight: bold;">2018年资产负债预算表</p>
        <table border="1px solid #f00" style="width: 95%; height: 80%; table-layout: fixed; word-break: break-all;margin-top:20px;" class="gridtable">
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <thead>
                <tr>
                    <th>项目</th>
                    <th>上年执行数</th>
                    <th>上年预算数</th>
                    <th>全年预算合计</th>
                    <th>增减率</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in tableData" :key="item.id">
                    <td>
                        <el-input v-model="item.xiangmu" placeholder=""></el-input>
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
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    name: 'assetliabilities',
    mounted() { },
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
#assetliabilities {
  table.gridtable th {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #dedede;
  }
  table {
    border-collapse: collapse;
    margin: 0 auto;
    width: 100%;
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
