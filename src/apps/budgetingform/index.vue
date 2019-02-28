<template>
    <div id="budgetingform">
        <el-row>
            <el-button type="primary" size="small" @click="saveForm()">保存</el-button>
            <el-button type="primary" size="small" @click="saveForm('save')">提交</el-button>
            <el-button type="primary" size="small" @click="exportForm">导出</el-button>
            <el-button type="primary" size="small" @click="getCodeTree('listCz')">打印</el-button>
            <el-button type="" size="small" @click="quxiao">取消</el-button>
        </el-row>
        <el-radio-group v-model="isCollapse" style="margin-top: 10px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <el-container style="height: 100%; border: 1px solid #eee">
            <el-aside width="" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-openeds="['1', '3']" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                    <el-menu-item index="1" @click="viewShow('封皮')">
                        <i class="el-icon-menu"></i>
                        <span slot="title">封皮</span>
                    </el-menu-item>
                    <!-- <el-menu-item index="2" @click="viewShow('资产负债')">
                        <i class="el-icon-document"></i>
                        <span slot="title">资产负债</span>
                    </el-menu-item>
                    <el-menu-item index="3" @click="viewShow('利润表')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">利润表</span>
                    </el-menu-item>
                    <el-menu-item index="4" @click="viewShow('现金流量表')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">现金流量表</span>
                    </el-menu-item> -->
                    <el-menu-item index="5" @click="viewShow('1-1筹资')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">1-1筹资</span>
                    </el-menu-item>
                    <el-menu-item index="6" @click="viewShow('1-2投资收回')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">1-2投资收回</span>
                    </el-menu-item>
                    <el-menu-item index="7" @click="viewShow('1-3收益类')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">1-3收益类</span>
                    </el-menu-item>
                    <el-menu-item index="8" @click="viewShow('1-4往来及其他收入')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">1-4往来及其他收入</span>
                    </el-menu-item>
                    <el-menu-item index="9" @click="viewShow('2-1三项费用')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">2-1三项费用</span>
                    </el-menu-item>
                    <el-menu-item index="10" @click="viewShow('2-1-1人工成本')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">2-1-1人工成本</span>
                    </el-menu-item>
                    <el-menu-item index="11" @click="viewShow('2-2税金支出')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">2-2税金支出</span>
                    </el-menu-item>
                    <el-menu-item index="12" @click="viewShow('2-3偿还债务')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">2-3偿还债务</span>
                    </el-menu-item>
                    <el-menu-item index="13" @click="viewShow('2-4投资支出')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">2-4投资支出</span>
                    </el-menu-item>
                    <el-menu-item index="14" @click="viewShow('2-5利润分配')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">2-5利润分配</span>
                    </el-menu-item>
                    <el-menu-item index="15" @click="viewShow('2-6投资资产及往来支出')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">2-6投资资产及往来支出</span>
                    </el-menu-item>
                    <el-menu-item index="16" @click="viewShow('2-7计提类')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">2-7计提类</span>
                    </el-menu-item>
                    <el-menu-item index="17" @click="viewShow('3-1代持类')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">3-1代持类</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <!-- <el-container> -->
            <el-main>
                <envelope ref="envelope" @getYear="getYear" :year="this.tabledate.year" v-show="this.envelope == true"></envelope>
                <!-- <assetliabilities ref="assetliabilities" v-show="this.assetliabilities == true"></assetliabilities>
                <profitTable ref="profitTable" v-show="this.profitTable == true"></profitTable>
                <cashflow ref="cashflow" v-show="this.cashflow == true"></cashflow> -->
                <financing11 ref="financing11" :searchOptions="this.tabledate.listCz" :title="this.title[0]" :year="this.tabledate.year" v-show="this.financing11 == true"></financing11>
                <withdraw12 ref="withdraw12" :searchOptions="this.tabledate.listTzsh" :title="this.title[1]" :year="this.tabledate.year" v-show="this.withdraw12 == true"></withdraw12>
                <earnings13 ref="earnings13" :searchOptions="this.tabledate.listSyl" :title="this.title[2]" :year="this.tabledate.year" v-show="this.earnings13 == true"></earnings13>
                <flowother14 ref="flowother14" :searchOptions="this.tabledate.listWljqtsr" :title="this.title[3]" :year="this.tabledate.year" v-show="this.flowother14 == true"></flowother14>
                <threecosts21 ref="threecosts21" :searchOptions="this.tabledate.listSxfy" :title="this.title[4]" :year="this.tabledate.year" v-show="this.threecosts21 == true"></threecosts21>
                <laborcost211 ref="laborcost211" :searchOptions="this.tabledate.listRgcb" :title="this.title[5]" :year="this.tabledate.year" v-show="this.laborcost211 == true"></laborcost211>
                <taxexpenditure22 ref="taxexpenditure22" :searchOptions="this.tabledate.listSjzc" :title="this.title[6]" :year="this.tabledate.year" v-show="this.taxexpenditure22 == true"></taxexpenditure22>
                <debt23 ref="debt23" :searchOptions="this.tabledate.listChzw" :title="this.title[7]" :year="this.tabledate.year" v-show="this.debt23 == true"></debt23>
                <investmentoutlays24 ref="investmentoutlays24" :searchOptions="this.tabledate.listTzzc" :title="this.title[8]" :year="this.tabledate.year" v-show="this.investmentoutlays24 == true"></investmentoutlays24>
                <distributionprofits25 ref="distributionprofits25" :searchOptions="this.tabledate.listLrfp" :title="this.title[9]" :year="this.tabledate.year" v-show="this.distributionprofits25 == true"></distributionprofits25>
                <investcome26 ref="investcome26" :searchOptions="this.tabledate.listTzzcjwlzc" :title="this.title[10]" :year="this.tabledate.year" v-show="this.investcome26 == true"></investcome26>
                <Provisionclass27 ref="Provisionclass27" :searchOptions="this.tabledate.listJtl" :title="this.title[11]" :year="this.tabledate.year" v-show="this.Provisionclass27 == true"></Provisionclass27>
                <generationclass31 ref="generationclass31" :searchOptions="this.tabledate.listDcl" :title="this.title[12]" :year="this.tabledate.year" v-show="this.generationclass31 == true"></generationclass31>
            </el-main>
            <!-- </el-container> -->
        </el-container>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'js-cookie'
import moment from 'moment';
import envelope from './envelope'
import assetliabilities from './assetliabilities'
import profitTable from './profitTable'
import cashflow from './cashflow'
import financing11 from './financing11'
import withdraw12 from './withdraw12'
import earnings13 from './earnings13'
import flowother14 from './flowother14'
import threecosts21 from './threecosts21'
import laborcost211 from './laborcost211'
import taxexpenditure22 from './taxexpenditure22'
import debt23 from './debt23'
import investmentoutlays24 from './investmentoutlays24'
import distributionprofits25 from './distributionprofits25'
import investcome26 from './investcome26'
import Provisionclass27 from './Provisionclass27'
import generationclass31 from './generationclass31'
export default {
    name: 'budgetingform',
    data() {
        return {
            title: [
                '筹资',
                '投资回收',
                '收益类',
                '往来及其他收入',
                '三项费用',
                '人工成本',
                '税金支出',
                '偿还债务',
                '投资支出',
                '利润分配',
                '投资资产及往来支出',
                '计提类',
                '代持类',
            ],
            tabledate: {
                year: moment(new Date()).format("YYYY"),
                crtId: cookies.get('uid'),
                crtName: cookies.get('uname'),
                crtDeptId: cookies.get('oid'),
                crtDept: cookies.get('oname'),
                listCz: [],
                listTzsh: [],
                listSyl: [],
                listWljqtsr: [],
                listSxfy: [],
                listRgcb: [],
                listSjzc: [],
                listChzw: [],
                listTzzc: [],
                listLrfp: [],
                listTzzcjwlzc: [],
                listJtl: [],
                listDcl: [],
            },
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            currentFormRow: this.$route.query.library,
            envelope: true,
            assetliabilities: false,
            profitTable: false,
            cashflow: false,
            financing11: false,
            withdraw12: false,
            earnings13: false,
            flowother14: false,
            threecosts21: false,
            laborcost211: false,
            taxexpenditure22: false,
            debt23: false,
            investmentoutlays24: false,
            distributionprofits25: false,
            investcome26: false,
            Provisionclass27: false,
            generationclass31: false,
            isCollapse: false //导航栏隐藏标识
        }
    },
    components: {
        envelope,
        assetliabilities,
        profitTable,
        cashflow,
        financing11,
        withdraw12,
        earnings13,
        flowother14,
        threecosts21,
        laborcost211,
        taxexpenditure22,
        debt23,
        investmentoutlays24,
        distributionprofits25,
        investcome26,
        Provisionclass27,
        generationclass31
    },
    // props: ['formId', 'operationType'],
    mounted() {
        this.getCodeTree('011', 'listCz', 'budget_dpt_cz');
        this.getCodeTree('012', 'listTzsh', 'budget_dpt_tzsh');
        this.getCodeTree('013', 'listSyl', 'budget_dpt_syl');
        this.getCodeTree('014', 'listWljqtsr', 'budget_dpt_wljqtsr');
        this.getCodeTree('021', 'listSxfy', 'budget_dpt_sxfy');
        this.getCodeTree('0211', 'listRgcb', 'budget_dpt_rgcb');
        this.getCodeTree('022', 'listSjzc', 'budget_dpt_sjzc');
        this.getCodeTree('023', 'listChzw', 'budget_dpt_chzw');
        this.getCodeTree('024', 'listTzzc', 'budget_dpt_tzzc');
        this.getCodeTree('025', 'listLrfp', 'budget_dpt_lrfp');
        this.getCodeTree('026', 'listTzzcjwlzc', 'budget_dpt_tzzcjwlzc');
        this.getCodeTree('027', 'listJtl', 'budget_dpt_jtl');
        this.getCodeTree('031', 'listDcl', 'budget_dpt_dcl');

        //点击查看详情，查询操作        
        // if (this.currentFormRow.year && this.currentFormRow.crtDeptId) {
        //     this.getForm();
        // };
    },
    methods: {
        //封面修改年份后改变表单
        getYear(year) {
            this.tabledate.year = year;
        },
        //获得每个页面的“项目”字段
        getCodeTree(a, b, c) {
            const self = this
            const params = {
                // id: this.currentFormId,
                typeCode: '001',
                type: a
            }
            axios
                .post('/budget/codeTable/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    console.log(a, b, res)
                    for (let item of res.data.content) {
                        if (item.name) {
                            this.tabledate[b].push({
                                target: item.name,
                                targetCode: item.code,
                                table: c,
                                sort: item.code,
                            })
                        }
                    }
                })
                .catch(function () {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    })
                })
        },
        viewShow(index) {
            this.envelope = index == '封皮' ? true : false
            this.assetliabilities = index == '资产负债' ? true : false
            this.profitTable = index == '利润表' ? true : false
            this.cashflow = index == '现金流量表' ? true : false
            this.financing11 = index == '1-1筹资' ? true : false
            this.withdraw12 = index == '1-2投资收回' ? true : false
            this.earnings13 = index == '1-3收益类' ? true : false
            this.flowother14 = index == '1-4往来及其他收入' ? true : false
            this.threecosts21 = index == '2-1三项费用' ? true : false
            this.laborcost211 = index == '2-1-1人工成本' ? true : false
            this.taxexpenditure22 = index == '2-2税金支出' ? true : false
            this.debt23 = index == '2-3偿还债务' ? true : false
            this.investmentoutlays24 = index == '2-4投资支出' ? true : false
            this.distributionprofits25 = index == '2-5利润分配' ? true : false
            this.investcome26 = index == '2-6投资资产及往来支出' ? true : false
            this.Provisionclass27 = index == '2-7计提类' ? true : false
            this.generationclass31 = index == '3-1代持类' ? true : false
        },
        quxiao() {
            this.$router.push({
                path: '/apps/budgeting'
            })
        },
        //导出功能
        exportForm() {
            console.log(this.currentFormRow)
        },
        //获得列表详情
        getForm() {
            const self = this;
            if (this.formId != '') {
                const self = this
                //获得年份和部门id
                const params = {
                    year: this.currentFormRow.year,
                    crtDeptId: this.currentFormRow.crtDeptId,
                }
                axios
                    .post('/budget/BudgetDptForm/query', JSON.stringify(params), {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    })
                    .then(res => {

                    })
                    .catch(function () {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        })
                    })
            }
        },
        submitForm() {
            const self = this
            const params = {
                id: this.currentFormId,
                cmtId: cookies.get('uid'),
                cmtName: cookies.get('uname')
            }
            axios
                .post('/budget/BudgetDptForm/commit', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    if (params.id != '') {
                        res.data.id
                        self.actionsForm(params);
                    }
                    // self.tableData = res.data.list
                })
                .catch(function () {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    })
                })
        },
        actionsForm(params) {
            const self = this;
            axios
                .get(
                    '/workflow/motor-budget_fundBudget/' + params.id + '/' + params.cmtId + '/actions',
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.startProcess(params, res.data);
                })
                .catch(function () {
                    self.$message({
                        message: 'actions操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess(params, res) {
            const self = this;
            res.types[0].required = ["oid:" + cookies.get('oid')]
            axios
                .put(
                    '/workflow/motor-budget_fundBudget/' + params.id + '/' + params.cmtId + '/signal',
                    JSON.stringify(res.types[0]),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    self.$emit('refreshData');
                    self.comment(params.id);
                })
                .catch(function () {
                    self.$message({
                        message: 'signal操作失败',
                        type: 'error'
                    });
                });
        },
        comment(id) {
            let self = this;
            const params = {
                action: 'START',
                content: '创建',
                node: '创建',
                crtId: cookies.get('uid'),
                crtName: cookies.get('uname'),
                crtDeptId: cookies.get('oid'),
                crtDept: cookies.get('oname'),
                formId: id
            }
            axios
                .post('/budget/BudgetDptForm/comment', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => { })
                .catch(function () {
                    self.$message({
                        message: '评论失败',
                        type: 'error'
                    })
                })
        },
        //保存提交
        saveForm(action) {
            const self = this
            axios
                .post('/budget/BudgetDptForm/save', JSON.stringify(this.tabledate), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.currentFormId = res.data.content;
                    if (action == 'save') {
                        self.submitForm();
                    } else {
                        // self.$emit('refreshData');
                        self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                })
                .catch(function () {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    })
                })
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        }
    }
}
</script>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
.el-main {
  padding: 0px;
}
</style>