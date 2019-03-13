<template>
    <div id="YuSuanForm" class="main-container">
        <div style="margin-top:10px;margin-left:25px;">
            <el-row>
                <el-button type="primary" size="small" @click="saveFormbefore()">保存</el-button>
                <el-button type="primary" size="small" @click="saveFormbefore('save')">提交</el-button>
                <el-button type="primary" size="small">导出</el-button>
                <el-button type="primary" size="small">打印</el-button>
            </el-row>
            <el-radio-group v-model="isCollapse" style="margin-top: 10px;">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true">收起</el-radio-button>
            </el-radio-group>
            <el-container style="height: 100%; border: 1px solid #eee;margin-top:8px;">
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <el-menu :default-openeds="['fengpi']" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                        <el-menu-item index="fengpi" @click="viewShow('封皮')">
                            <i class="el-icon-menu"></i>
                            <span slot="title">封皮</span>
                        </el-menu-item>
                        <el-menu-item index="zichan" @click="viewShow('资产负债')">
                            <i class="el-icon-document"></i>
                            <span slot="title">资产负债</span>
                        </el-menu-item>
                        <el-menu-item index="lirun" @click="viewShow('利润表')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">利润表</span>
                        </el-menu-item>
                        <el-menu-item index="xianjin" @click="viewShow('现金流量表')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">现金流量表</span>
                        </el-menu-item>
                        <el-menu-item index="chouzi" @click="viewShow('1-1筹资')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">1-1筹资</span>
                        </el-menu-item>
                        <el-menu-item index="touzi" @click="viewShow('1-2投资收回')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">1-2投资收回</span>
                        </el-menu-item>
                        <el-menu-item index="shouyi" @click="viewShow('1-3收益类')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">1-3收益类</span>
                        </el-menu-item>
                        <el-menu-item index="wanglai" @click="viewShow('1-4往来及其他收入')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">1-4往来及其他收入</span>
                        </el-menu-item>
                        <el-menu-item index="sanxiang" @click="viewShow('2-1三项费用')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">2-1三项费用</span>
                        </el-menu-item>
                        <el-menu-item index="rengong" @click="viewShow('2-1-1人工成本')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">2-1-1人工成本</span>
                        </el-menu-item>
                        <el-menu-item index="shuijin" @click="viewShow('2-2税金支出')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">2-2税金支出</span>
                        </el-menu-item>
                        <el-menu-item index="changhuan" @click="viewShow('2-3偿还债务')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">2-3偿还债务</span>
                        </el-menu-item>
                        <el-menu-item index="touzizhichu" @click="viewShow('2-4投资支出')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">2-4投资支出</span>
                        </el-menu-item>
                        <el-menu-item index="liruidenpei" @click="viewShow('2-5利润分配')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">2-5利润分配</span>
                        </el-menu-item>
                        <el-menu-item index="touzizichanjiwanglai" @click="viewShow('2-6投资资产及往来支出')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">2-6投资资产及往来支出</span>
                        </el-menu-item>
                        <el-menu-item index="jitilei" @click="viewShow('2-7计提类')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">2-7计提类</span>
                        </el-menu-item>
                        <el-menu-item index="daichilei" @click="viewShow('2-8代持类')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">2-8代持类</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <envelope ref="envelope" @getTableDate="getTableDate" @getYear="getYear" v-show="this.envelope == true"></envelope>
                        <assetliabilities ref="assetliabilities" @getTableDate="getTableDate" v-show="this.assetliabilities == true"></assetliabilities>
                        <profitTable ref="profitTable" :tabledata="profitTableData" @getTableDate="getTableDate" v-show="this.profitTable == true"></profitTable>
                        <cashflow ref="cashflow" @getTableDate="getTableDate" v-show="this.cashflow == true"></cashflow>
                        <financing11 ref="financing11" :tabledata="financing11TableData" @getTableDate="getTableDate" v-show="this.financing11 == true"></financing11>
                        <withdraw12 ref="withdraw12" @getTableDate="getTableDate" v-show="this.withdraw12 == true"></withdraw12>
                        <earnings13 ref="earnings13" @getTableDate="getTableDate" v-show="this.earnings13 == true"></earnings13>
                        <flowother14 ref="flowother14" @getTableDate="getTableDate" v-show="this.flowother14 == true"></flowother14>
                        <threecosts21 ref="threecosts21" @getTableDate="getTableDate" v-show="this.threecosts21 == true"></threecosts21>
                        <laborcost211 ref="laborcost211" @getTableDate="getTableDate" v-show="this.laborcost211 == true"></laborcost211>
                        <taxexpenditure22 ref="taxexpenditure22" @getTableDate="getTableDate" v-show="this.taxexpenditure22 == true"></taxexpenditure22>
                        <debt23 ref="debt23" :tabledata="debt23TableData" @getTableDate="getTableDate" v-show="this.debt23 == true"></debt23>
                        <investmentoutlays24 ref="investmentoutlays24" @getTableDate="getTableDate" v-show="this.investmentoutlays24 == true"></investmentoutlays24>
                        <distributionprofits25 ref="distributionprofits25" @getTableDate="getTableDate" v-show="this.distributionprofits25 == true"></distributionprofits25>
                        <investcome26 ref="investcome26" @getTableDate="getTableDate" v-show="this.investcome26 == true"></investcome26>
                        <Provisionclass27 ref="Provisionclass27" @getTableDate="getTableDate" v-show="this.Provisionclass27 == true"></Provisionclass27>
                        <generationclass31 ref="generationclass31" @getTableDate="getTableDate" v-show="this.generationclass31 == true"></generationclass31>
                        <!--
                        <el-form ref="formupdate" :model="rows" label-width="80px">
                            <el-row style="margin-top: 30px;">
                                <el-col :span="24">
                                    <el-form-item label="附件">
                                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                            <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <div v-for="item in rows.attachments" :key="item.id" style="float:left">
                                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachment"></FilesOperate>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        -->
                    </el-main>
                </el-container>
            </el-container>
        </div>

        <!--
        <div class="container">
            <div style="margin-top:10px;margin-left:25px;">
                <el-row>
                    <el-button type="primary" size="small" @click="saveForm">保存</el-button>
                    <el-button type="primary" size="small">提交</el-button>
                    <el-button type="primary" size="small">导出</el-button>
                    <el-button type="primary" size="small">打印</el-button>
                </el-row>
                <el-row>
                    <el-col :span="4">
                        <el-card class="box-card" style="margin-left:15px;margin-top: 15px;">
                            <el-tree :data="data" default-expand-all @node-click="nodeClick" style="font-size: 3px;margin-top: 10px;">
                            </el-tree>
                        </el-card>
                    </el-col>
                    <el-col :span="20">
                        <ProfitTable></ProfitTable>
                        <InvestmentEspenseTable></InvestmentEspenseTable>
                        <PaymentTable></PaymentTable>
                        <ProfitShareingTable></ProfitShareingTable>
                        -->
        <!--
                        <el-form ref="formupdate" :model="rows" label-width="80px">
                            <el-row style="margin-top: 30px;">
                                <el-col :span="24">
                                    <el-form-item label="附件">
                                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                            <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <div v-for="item in rows.attachments" :key="item.id" style="float:left">
                                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachment"></FilesOperate>
                                        </div>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </div>
        -->
    </div>
</template>

<script>
import axios from 'axios';
import cookies from 'js-cookie';
import FilesOperate from '../FilesOperate';
import envelope from './envelope';
import assetliabilities from './assetliabilities';
import profitTable from './profitTable';
import cashflow from './cashflow';
import financing11 from './financing11';
import withdraw12 from './withdraw12';
import earnings13 from './earnings13';
import flowother14 from './flowother14';
import threecosts21 from './threecosts21';
import laborcost211 from './laborcost211';
import taxexpenditure22 from './taxexpenditure22';
import debt23 from './debt23';
import investmentoutlays24 from './investmentoutlays24';
import distributionprofits25 from './distributionprofits25';
import investcome26 from './investcome26';
import Provisionclass27 from './Provisionclass27';
import generationclass31 from './generationclass31';
export default {
    name: 'YuSuanForm',
    mounted() {
        this.params = this.$route.query;
        console.log(this.params);
        if (this.params.rows) {
            this.getBudgetGoupFormList();
        }
    },
    data() {
        return {
            view: '',
            currentFormId: '',
            year: '2019',
            envelopeTableData: {},
            assetliabilitiesTableData: [],
            profitTableData: [],
            cashflowTableData: [],
            financing11TableData: [],
            withdraw12TableData: [],
            earnings13TableData: [],
            flowother14TableData: [],
            threecosts21TableData: [],
            laborcost211TableData: [],
            taxexpenditure22TableData: [],
            debt23TableData: [],
            investmentoutlays24TableData: [],
            distributionprofits25TableData: [],
            investcome26TableData: [],
            Provisionclass27TableData: [],
            generationclass31TableData: [],
            isCollapse: false,
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
            params: {},
            rows: {
                attachments: []
            }
        };
    },
    components: {
        FilesOperate,
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
    watch: {
        year: function() {
            this.getBudgetGoupFormList();
        }
    },
    methods: {
        getYear(year, type) {
            this.year = year;
        },
        clearForm() {
            this.envelopeTableData = {};
            this.assetliabilitiesTableData = [];
            this.profitTableData = [];
            this.cashflowTableData = [];
            this.financing11TableData = [];
            this.withdraw12TableData = [];
            this.earnings13TableData = [];
            this.flowother14TableData = [];
            this.threecosts21TableData = [];
            this.laborcost211TableData = [];
            this.taxexpenditure22TableData = [];
            this.debt23TableData = [];
            this.investmentoutlays24TableData = [];
            this.distributionprofits25TableData = [];
            this.investcome26TableData = [];
            this.Provisionclass27TableData = [];
            this.generationclass31TableData = [];
        },
        getBudgetGoupFormList() {
            this.clearForm();
            const self = this;
            console.log('22222');
            console.log(this.params.rows);
            let params = {};
            if (
                this.params.rows.crtDept == '中关村协同发展' &&
                !this.params.rows.crtDeptId
            ) {
                params = {
                    year: this.year
                };
            } else {
                params = {
                    year: this.year,
                    crtDeptId: this.params.rows.crtDeptId
                };
            }
            axios
                .post('/budget/BudgetDptForm/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    if (res.data.content) {
                        this.assetliabilitiesTableData =
                            res.data.content.listZcfz;
                        this.profitTableData = res.data.content.listLr;
                        this.cashflowTableData = res.data.content.listXjll;
                        this.financing11TableData = res.data.content.listCz;
                        this.withdraw12TableData = res.data.content.listTzsh;
                        this.earnings13TableData = res.data.content.listSyl;
                        this.flowother14TableData =
                            res.data.content.listWljqtsr;
                        this.threecosts21TableData = res.data.content.listSxfy;
                        this.laborcost211TableData = res.data.content.listRgcb;
                        this.taxexpenditure22TableData =
                            res.data.content.listSjzc;
                        this.debt23TableData = res.data.content.listChzw;
                        this.investmentoutlays24TableData =
                            res.data.content.listTzzc;
                        this.distributionprofits25TableData =
                            res.data.content.listLrfp;
                        this.investcome26TableData =
                            res.data.content.listTzzcjwlzc;
                        this.Provisionclass27TableData =
                            res.data.content.listJtl;
                        this.generationclass31TableData =
                            res.data.content.listDcl;
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        saveFormbefore(action) {
            this.$refs.debt23.getTableDate();
            this.$refs.financing11.getTableDate();
            this.saveForm(action);
        },
        getTableDate(data) {
            /** 
            switch (data.type) {
                case 'assetliabilities':
                    this.assetliabilitiesTableData = data.data;
                    break;
                case 'profitTable':
                    this.profitTableData = data.data;
                    break;
                case 'cashflow':
                    this.cashflowTableData = data.data;
                    break;
                case 'financing11':
                    this.financing11TableData = data.data;
                    break;
                case 'withdraw12':
                    this.withdraw12TableData = data.data;
                    break;
                case 'earnings13':
                    this.earnings13TableData = data.data;
                    break;
                case 'flowother14':
                    this.flowother14TableData = data.data;
                    break;
                case 'threecosts21':
                    this.threecosts21TableData = data.data;
                    break;
                case 'laborcost211':
                    this.laborcost211TableData = data.data;
                    break;
                case 'taxexpenditure22':
                    this.taxexpenditure22TableData = data.data;
                    break;
                case 'debt23':
                    this.debt23TableData = data.data;
                    break;
                case 'investmentoutlays24':
                    this.investmentoutlays24TableData = data.data;
                    break;
                case 'distributionprofits25':
                    this.distributionprofits25TableData = data.data;
                    break;
                case 'investcome26':
                    this.investcome26TableData = data.data;
                    break;
                case 'Provisionclass27':
                    this.Provisionclass27TableData = data.data;
                    break;
                case 'generationclass31':
                    this.generationclass31TableData = data.data;
                    break;
                default:
                    break;
            }
            */
        },
        viewShow(index) {
            this.envelope = index == '封皮' ? true : false;
            this.assetliabilities = index == '资产负债' ? true : false;
            this.profitTable = index == '利润表' ? true : false;
            this.cashflow = index == '现金流量表' ? true : false;
            this.financing11 = index == '1-1筹资' ? true : false;
            this.withdraw12 = index == '1-2投资收回' ? true : false;
            this.earnings13 = index == '1-3收益类' ? true : false;
            this.flowother14 = index == '1-4往来及其他收入' ? true : false;
            this.threecosts21 = index == '2-1三项费用' ? true : false;
            this.laborcost211 = index == '2-1-1人工成本' ? true : false;
            this.taxexpenditure22 = index == '2-2税金支出' ? true : false;
            this.debt23 = index == '2-3偿还债务' ? true : false;
            this.investmentoutlays24 = index == '2-4投资支出' ? true : false;
            this.distributionprofits25 = index == '2-5利润分配' ? true : false;
            this.investcome26 = index == '2-6投资资产及往来支出' ? true : false;
            this.Provisionclass27 = index == '2-7计提类' ? true : false;
            this.generationclass31 = index == '3-1代持类' ? true : false;
        },
        saveForm(action) {
            const self = this;
            const params = {
                year: this.year,
                crtId: cookies.get('uid'),
                crtName: cookies.get('uname'),
                crtDeptId: cookies.get('oid'),
                crtDept: cookies.get('oname'),
                listCz: this.financing11TableData,
                listZcfz: this.assetliabilitiesTableData,
                listLr: this.profitTableData,
                listXjll: this.cashflowTableData,
                listTzsh: this.withdraw12TableData,
                listSyl: this.earnings13TableData,
                listWljqtsr: this.flowother14TableData,
                listSxfy: this.threecosts21TableData,
                listRgcb: this.laborcost211TableData,
                listSjzc: this.taxexpenditure22TableData,
                listChzw: this.debt23TableData,
                listTzzc: this.investmentoutlays24TableData,
                listLrfp: this.distributionprofits25TableData,
                listTzzcjwlzc: this.investcome26TableData,
                listJtl: this.Provisionclass27TableData,
                listDcl: this.generationclass31TableData
            };
            axios
                .post('/budget/BudgetGroupForm/save', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.currentFormId = res.data.content;
                    if (action == 'save') {
                        self.submitForm();
                    } else {
                        self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });

            /** 
            this.$router.push({
                path: '/apps/yusuan'
                */
            /** 
                query: {
                    type: type,
                    rows: row ? row : ''
                }

            });
            */
        },
        submitForm() {
            const self = this;
            const params = {
                id: this.currentFormId,
                cmtId: cookies.get('uid'),
                cmtName: cookies.get('uname')
            };
            axios
                .post(
                    '/budget/BudgetGroupForm/commit',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.getAction();
                    // self.tableData = res.data.list
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getAction() {
            const self = this;
            axios
                .get(
                    '/workflow/motor-budget_fundBudgetCollect/' +
                        self.currentFormId +
                        '/' +
                        cookies.get('uid') +
                        '/actions',
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.startProcess(res.data);
                })
                .catch(function() {
                    self.$message({
                        message: 'actions操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess(res) {
            const self = this;
            // res.types[0].required[0] = "oid:"+cookies.get('oid')
            res.types[0].required = ['oid:' + cookies.get('oid')];
            axios
                .put(
                    '/workflow/motor-budget_fundBudgetCollect/' +
                        self.currentFormId +
                        '/' +
                        cookies.get('uid') +
                        '/signal',
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
                    // self.$emit('refreshData');
                    self.comment();
                })
                .catch(function() {
                    self.$message({
                        message: 'signal操作失败',
                        type: 'error'
                    });
                });
        },
        comment() {
            let self = this;
            const params = {
                action: 'START',
                content: '创建',
                node: '创建',
                crtId: cookies.get('uid'),
                crtName: cookies.get('uname'),
                crtDeptId: cookies.get('oid'),
                crtDept: cookies.get('oname'),
                formId: self.currentFormId
            };
            axios
                .post(
                    '/budget/BudgetGroupForm/comment',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: '评论失败',
                        type: 'error'
                    });
                });
        },
        handleOpen() {},
        handleClose() {},
        deleteAttachment(id) {},
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        }
    }
};
</script>

<style lang="scss">
#YuSuanForm {
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;
        border-radius: 2px;
        cursor: pointer;

        .el-upload {
            width: 100%;
            height: 100%;

            i {
                font-size: 50px;
                margin-top: 35px;
            }
        }
    }
}
</style>
