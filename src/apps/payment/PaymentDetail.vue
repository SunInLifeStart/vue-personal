<template>
    <div id="PaymentDetail">
        <!-- <el-steps :active="crumb.index" finish-status="success">
            <el-step :title="item.name" :key="item.id" v-for="item in crumb.items"></el-step>
        </el-steps> -->
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="action in actions" :key="action.index" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>
            </el-row>
        </div>
        <div class="formContent">
            <!---->
            <div>
                <el-button type="primary" v-show="this.tableData.status && this.tableData.status == '00'" @click="commitDetail">提交</el-button>
                <el-button type="primary" @click="getFlowNode" v-show="this.tableData.status && this.tableData.status != '04'">查看流程</el-button>
                <el-button style="margin-left: 25px;" type="primary" @click="print" v-show="this.tableData.status && this.tableData.status == '04'">打印</el-button>
            </div>
            <br />
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList">
                <el-step :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model='tableData' class="demo-form-inline" ref="formupdate" id='queryTable' style="height:300%">
                <h4 style="text-align: center;">付款审批单({{tableData.organName ? tableData.organName.split('-')[0]: ''}})</h4>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="单据编号：" style="margin-left:5px;">
                            <span style="font-size:10px"> {{tableData.numericalOrder}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出差申请单：">
                            <span style="font-size:10px" @click="travelDetail()" :class="{'titlename':this.tableData.tra=='true'}"> {{tableData.travelCode}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="呈报件：" label-width="70px">
                            <span style="font-size:10px" @click="ViewDetail()" :class="{'titlename':this.tableData.sub=='true'}"> {{tableData.submissionName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <table class="tablePrint" style="width: 99%;">
                    <col style="width: 6%" />
                    <col style="width: 11%" />
                    <col style="width: 11%" />
                    <col style="width: 13%" />
                    <col style="width: 8%" />
                    <col style="width: 12%" />
                    <col style="width: 11%" />
                    <col style="width: 10%" />
                    <tr>
                        <td colspan="8" class="fontBold">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            提单人
                        </td>
                        <td>
                            {{tableData.applicantName}}
                        </td>
                        <td class="fontBold">
                            所属部门
                        </td>
                        <td colspan="2">
                            {{tableData.organ}}
                        </td>
                        <td class="fontBold">
                            申请时间
                        </td>
                        <td colspan="2">
                            {{tableData.applicantTime | dateformat}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            收款单位
                        </td>
                        <td>
                            {{tableData.receiptUnit}}
                        </td>
                        <td class="fontBold">
                            开户行
                        </td>
                        <td colspan="2">
                            {{tableData.openingLine}}
                        </td>
                        <td class="fontBold">
                            银行账号
                        </td>
                        <td colspan="2">
                            {{tableData.bankNumber}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            结算方式
                        </td>
                        <td>
                            {{tableData.settlement}}
                        </td>
                        <td class="fontBold">
                            费用承担部门
                        </td>
                        <td colspan="2">
                            {{tableData.costUnit}}
                        </td>
                        <td class="fontBold">
                            分摊
                        </td>
                        <td colspan="2">
                            {{tableData.allocation}}
                            <!-- <template>
                            <el-radio v-model="tabledata.allocation" label="是" @change="showShare('show')">是</el-radio>
                            <el-radio v-model="tabledata.allocation" label="否" @change="showShare('hide')">否</el-radio>
                        </template> -->
                        </td>
                    </tr>
                    <tr class="fontBold">
                        <td colspan="8">
                            付款明细
                        </td>
                    </tr>
                    <tr>
                        <td>
                            付款事项
                        </td>
                        <td colspan="7">
                            {{tableData.paymentMatters ? this.getParameters(tableData.paymentMatters): ''}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            支出说明
                        </td>
                        <td colspan="7">
                            <el-input type="textarea" v-model="tableData.paymentExplain" disabled :autosize="{minRows: 10}"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            费用归属项目
                        </td>
                        <td colspan="7">
                            <el-input type="textarea" v-model="tableData.project" disabled :autosize="{minRows: 3}"></el-input>
                        </td>
                    </tr>
                    <tr class="fontBold">
                        <td colspan="2">支出类别|明细</td>
                        <td>币种</td>
                        <td>金额</td>
                        <td>预估汇率</td>
                        <td>预估本币金额</td>
                        <td>
                            不含税价格
                        </td>
                        <td>
                            税金
                        </td>
                    </tr>
                    <tr v-for="(payItem) in this.tableData.details" :key="payItem.index">
                        <td colspan="2">
                            {{payItem.bigType}}
                            <!-- /{{payItem.centreType}}/{{payItem.smallType}} -->
                        </td>
                        <td>
                            {{payItem.currency}}

                        </td>
                        <td class="money">
                            <format-input separator="," :precision="2" v-model="payItem.amount" :max="100000000000000" read-only :min="-10000000" empty-value="0" :minus="true" />
                        </td>
                        <td>
                            {{payItem.rate}}
                        </td>
                        <td class="money">
                            <format-input separator="," :precision="2" v-model="payItem.localAmount" :max="100000000000000" read-only :min="-10000000" empty-value="0" :minus="true" />
                        </td>
                        <td>
                            <format-input separator="," :precision="2" v-model="payItem.noTax" :max="100000000000000" read-only :min="-10000000" empty-value="0" :minus="true" />
                        </td>
                        <td>
                            <format-input separator="," :precision="2" v-model="payItem.tax" :max="100000000000000" read-only :min="-10000000" empty-value="0" :minus="true" />
                        </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">预算、资金计划信息</td>
                    </tr>
                    <tr>
                        <td>
                            是否资金计划内
                        </td>
                        <td colspan="3">
                            {{this.tableData.capitalYes ? '是': '否'}}
                        </td>
                        <td>
                            是否预算内
                        </td>
                        <td colspan="3">
                            {{this.tableData.budgetYes ? '是': '否'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">
                            合同号
                        </td>
                        <td colspan="2">
                            <span @click="borrowOddDetail()" :class="{'titlename':this.tableData.contract.orAmount=='1'}"> {{tableData.contract.numNo}}</span>
                            <!-- <el-tooltip class="item" effect="dark" content="查看" placement="left">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" :disabled="this.tabledata.contract.orAmount=='2'" @click="borrowOddDetail"></el-button>
                            </el-tooltip> -->
                        </td>
                        <td class="fontBold">
                            合同名称
                        </td>
                        <td colspan="4">
                            {{tableData.contract.name}}
                        </td>
                    </tr>
                    <tr>
                        <td rowspan="3" class="fontBold">
                            合同金额
                        </td>
                        <td rowspan="3" class="money">
                            <div v-if="this.moneyType">
                                <format-input separator="," :precision="2" v-model="tableData.contract.amount" :max="100000000000000" read-only :min="-10000000" empty-value="0" :minus="true" />
                            </div>
                            <div v-else>
                                {{tableData.contract.amount}}
                            </div>
                        </td>
                        <td rowspan="3" class="fontBold">
                            前期已付
                        </td>
                        <td class="fontBold">
                            累计已付款
                        </td>
                        <td class="money">
                            <format-input separator="," :precision="2" v-model="tableData.contract.payments" :max="100000000000000" read-only :min="-10000000" empty-value="0" :minus="true" />
                        </td>
                        <td rowspan="3" class="fontBold">
                            未付金额
                        </td>
                        <td colspan="2" rowspan="3" class="money">
                            <div v-if="this.moneyType2">
                                <format-input separator="," :precision="2" v-model="tableData.contract.unAmount" :max="100000000000000" read-only :min="-10000000" empty-value="0" :minus="true" />
                            </div>
                            <div v-else>
                                {{tableData.contract.unAmount}}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">累计付款比例（%）</td>
                        <td>
                            {{tableData.contract.cumulativeProShow}}
                        </td>
                    </tr>
                    <tr>
                        <td class="fontBold">本次付款后累计支付比例（%）</td>
                        <td>
                            {{tableData.contract.cumulativeAfterShow}}
                        </td>
                    </tr>
                    <!-- <tr>
                        <td colspan="2">
                            预算金额
                        </td>
                        <td>
                            {{tabledata.contract.budgetAmount}}
                        </td>
                        <td colspan="2">
                            资金计划
                        </td>
                        <td colspan="3">
                            {{tabledata.contract.fundingPlan}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            剩余预算金额
                        </td>
                        <td>
                            {{tabledata.contract.reBudgetAmount}}
                        </td>
                        <td colspan="2">
                            剩余资金计划
                        </td>
                        <td colspan="3">
                            {{tabledata.contract.reFundingPlan}}
                        </td>
                    </tr> -->
                    <tr>
                        <td colspan="2" class="fontBold">
                            支付金额
                        </td>
                        <td colspan="2">
                            <el-row>
                                <el-col :span="2" align="left" style="margin-left:2px;text-align:center;">{{this.tableData.contract.symbol}}</el-col>
                                <el-col :span="21" align="right" style="margin-right:2px">
                                    <format-input separator="," :precision="2" v-model="tableData.contract.payAmount" :max="100000000000000" read-only :min="-10000000" empty-value="0" :minus="true" />
                                </el-col>
                            </el-row>
                        </td>
                        <td class="fontBold">
                            金额大写
                        </td>
                        <td colspan="3">
                            （{{ this.tableData.details.length > 0 ? this.tableData.details[0].currency : '人民币'}}：&nbsp;&nbsp;&nbsp;{{tableData.contract.amountCap}}&nbsp;&nbsp;&nbsp;）
                        </td>
                    </tr>

                    <tr v-show="tableData.allocation == '是'" class="fontBold">
                        <td colspan="8">分摊明细（基本信息分摊选择是）</td>
                    </tr>
                    <tr v-show="tableData.allocation == '是'" class="fontBold">
                        <td colspan="2">承担单位</td>
                        <td>承担部门</td>
                        <td>支出项目</td>
                        <td>承担金额（{{this.tableData.contract.symbol}}）</td>
                        <td colspan="2">金额大写（{{this.tableData.details.length > 0 ? this.tableData.details[0].currency : '人民币'}}）</td>
                        <td>分摊比例</td>
                    </tr>
                    <tr v-show="tableData.allocation == '是'" v-for="(shareItem) in this.tableData.allocationDetails" :key="shareItem.index">
                        <td colspan="2">
                            {{shareItem.unit}}
                        </td>
                        <td>
                            {{shareItem.organ}}
                        </td>
                        <td>
                            {{shareItem.project}}
                        </td>
                        <td>
                            <format-input separator="," :precision="2" v-model="shareItem.amount" :max="100000000000000" read-only :min="-10000000" empty-value="0" :minus="true" />
                        </td>
                        <td colspan="2">
                            {{shareItem.amountCap}}
                        </td>
                        <td>
                            {{shareItem.proportion}}
                        </td>
                    </tr>
                    <!--
                    <tr>
                        <td colspan="2" class="fontBold">附件上传</td>
                        <td colspan="6" style="padding:10px;">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    -->
                </table>
                <table class="tablePrint" style="width: 99%;">
                    <tr>
                        <td class="fontBold" style="width:100px;">附件信息</td>
                        <td style="padding: 10px;">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                </table>
                <el-row v-if="comments && comments.length > 0">
                    <el-col :span="24">
                        <h3 style="margin-left: 10px;">审批意见</h3>
                        <div class="items">
                            <div class="item" v-for="item in comments" :key="item.id">
                                <div class="avatar"><img src="img/avatar.1176c00a.png" alt="" width="30px"></div>
                                <div class="info">
                                    <div class="creator">
                                        <span href="#">{{item.userName}}</span> &nbsp; ({{item.times | dateformat}})
                                    </div>
                                    <div class="content">{{item.fullMessage}}</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>

        </div>
        <el-dialog :visible.sync="dialogVisibleAttachment" width="40%">
            <el-form>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="编辑附件">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="uploadAttachmentOther" action="/api/v1/files/upload" :on-success="handleAttachmentSuccess" :multiple="true" :show-file-list="false" accept="" :auto-upload="true" :with-credentials="true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getAttachmentId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleAttachment = false">取 消</el-button>
                <el-button type="primary" @click="saveIncomingApply">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" center width="30%" append-to-body>
            <el-form>
                <el-form-item :label="item.label" v-for="(item,index) in actionsDialogArr" :key="index">
                    <el-select v-model="item.checkedValue" filterable :multiple="item.multiple" style="width:100%;" value-key="id">
                        <el-option v-for="user in item.seletList" :key="user.id" :label="user.name" :value="user"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批意见">
                    <el-input type="textarea" placeholder="请输入审批意见" v-model="textarea" :autosize="{ minRows: 10, maxRows: 30}">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisibleCrumb" center width="90%" height="600px" append-to-body>
            <el-form>
                <iframe :src="flowNodeUrl" width="100%" height="550px" frameborder="0" v-if="flowNodeUrl"></iframe>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import Comment from '../Comment';
import { publicMethods } from '../application.js';
import FilesOperate from '../FilesOperate';
import formatInput from '@/components/formatInput';
export default {
    mixins: [publicMethods],
    name: 'PaymentDetail',
    data() {
        return {
            moneyType: false, //判断合同信息中 金额是否全为数字
            moneyType2: false, //判断合同信息中 金额是否全为数字
            tableData: {
                details: [],
                contract: {
                    numNo: '',
                    amount: '',
                    payments: '',
                    cumulativeProShow: '',
                    cumulativeAfterShow: ''
                } //合同信息
            },
            actions: [],
            crumbs: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'payment-form_payment',
            formName: 'payment_forms',
            comments: [],
            dialogVisibleCrumb: false,
            dialogVisibleAttachment: false,
            flowNodeUrl: '',
            array: []
        };
    },
    components: {
        Comment,
        FilesOperate,
        formatInput
    },
    methods: {
        getParameters(x) {
            let xmlJson = {
                '1': '工程类',
                '2': '招商营销类',
                '3': '财务行政类'
            };
            return xmlJson[x];
        },
        attahmentsUplode() {
            this.dialogVisibleAttachment = true;
        },
        handleAttachmentSuccess(response, file) {
            const self = this;
            if (!self.tableData.attachments) {
                self.tableData.attachments = [];
            }
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.tableData.attachments.push(item);
                    // self.$forceUpdate();
                });
            }
            // this.$refs.uploadAttachmentOther.clearFiles();
        },
        async saveIncomingApply() {
            let response = await this.saveFormData(
                '/api/v1/payment_forms/save',
                this.tableData
            );
            if (response) {
                this.dialogVisibleAttachment = false;
            }
        },
        getAttachmentId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.tableData.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/payment_forms/deleteAtt/' + id)
                            .then(res => {
                                self.tableData.attachments.splice(index, 1);
                            });
                    }
                });
            });
        },
        async print() {
            // document.getElementById('approval').style.display = 'table-row';
            this.$print(this.$refs.formupdate.$el, {
                printTitle: ''
            });
            //  document.getElementById('approval').style.display = 'none';
        },
        ViewDetail() {
            if (
                this.tableData.submissionId &&
                this.tableData.submissionId != '' &&
                this.tableData.sub == 'true'
            ) {
                this.common.open(
                    '#/apps/submission/' + this.tableData.submissionId
                );
            }
        },
        //查看借款单详情
        travelDetail() {
            if (
                this.tableData.travelId &&
                this.tableData.travelId != null &&
                this.tableData.tra == 'true'
            ) {
                this.common.open('#/apps/travel/' + this.tableData.travelId);
            }
        },
        borrowOddDetail() {
            if (
                this.tableData.contract.contractId &&
                this.tableData.contract.contractId != '' &&
                this.tableData.contract.orAmount == '1'
            ) {
                this.common.open(
                    '#/apps/contract/' + this.tableData.contract.contractId
                );
            }
        },
        getAgree() {
            this.array = [];
            let j = -1;
            for (var i = 0; i < this.comments.length; i++) {
                if (this.comments[i].fullMessage == '驳回') {
                    j = i;
                }
            }

            if (j == -1) {
                let arrayConst = [];
                let boolean = false;
                for (var i = 0; i < this.comments.length; i++) {
                    if (
                        this.comments[i + 1] &&
                        this.comments[i + 1].fullMessage == '撤回'
                    ) {
                    } else {
                        arrayConst.push(this.comments[i]);
                    }
                    if (i == this.comments.length - 1) {
                        boolean = true;
                    }
                }
                if (boolean) {
                    for (let data of arrayConst) {
                        if (
                            data.fullMessage != null &&
                            data.fullMessage == '同意'
                        ) {
                            this.array.push(data);
                        }
                    }
                }
            } else {
                let arrayreject = [];
                let boolean = false;
                for (var a = j + 1; a < this.comments.length; a++) {
                    if (
                        this.comments[a + 1] &&
                        this.comments[a + 1].fullMessage == '撤回'
                    ) {
                    } else {
                        arrayreject.push(this.comments[a]);
                    }
                    if (a == this.comments.length - 1) {
                        boolean = true;
                    }
                }
                if (boolean) {
                    for (let data of arrayreject) {
                        if (
                            data.fullMessage != null &&
                            data.fullMessage == '同意'
                        ) {
                            this.array.push(data);
                        }
                    }
                }
            }
        },
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = '/api/v1/' + $self.formName + '/' + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            $self.actions = [];
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data;
                if (this.tableData.contract.orAmount == '2') {
                    this.tableData.contract.cumulativeAfterShow = this.tableData.contract.cumulativeAfter;
                    this.tableData.contract.cumulativeProShow = this.tableData.contract.cumulativePro;
                } else {
                    this.tableData.contract.cumulativeAfterShow = this.common.toDecimal2(
                        this.tableData.contract.cumulativeAfter
                    );
                    this.tableData.contract.cumulativeProShow = this.common.toDecimal2(
                        this.tableData.contract.cumulativePro
                    );
                }
                if (/^[0-9.]+$/.test(this.tableData.contract.amount)) {
                    //这是用正则表达是检查
                    this.moneyType = true;
                } else {
                    this.moneyType = false;
                }
                if (/^[0-9.]+$/.test(this.tableData.contract.unAmount)) {
                    //这是用正则表达是检查
                    this.moneyType2 = true;
                } else {
                    this.moneyType2 = false;
                }
                $self.$emit('resetStatus', {
                    id: $self.tableData.id,
                    status: $self.tableData.status
                });
            } else {
                //  $self.msgTips('获取表单失败', 'warning');
            }
            if ($self.tableData.status != '00') {
                let actions = await $self.getActions();
                $self.actions = actions.data.types;
            }

            let crumbs = await $self.getCrumbsone();
            let comments = await $self.getComments();
            $self.comments = comments.data;
            // this.getAgree();
            $self.crumbs = { items: crumbs.data, index: -1 };
            for (var i = 0; i < $self.crumbs.items.length; i++) {
                if ($self.crumbs.items[i].active) {
                    $self.crumbs.index = i;
                }
            }
            if ($self.crumbs.index == -1) {
                $self.crumbs.index = $self.crumbs.items.length;
            }
        }
    }
};
</script>
<style>
@media print {
    html,
    body {
        height: inherit;
    }
    #query-table {
        height: inherit;
    }
    #queryTable {
        height: inherit;
    }
}
</style>
<style lang="scss" scope>
#PaymentDetail {
    html,
    body {
        height: inherit;
    }
    #query-table {
        height: inherit;
    }
    #queryTable {
        height: inherit;
    }
    .titlename {
        color: #1c47f3;
        text-decoration: underline;
    }
    .formContent {
        flex: 1;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 15px 30px;
    }
    .tablePrint td,
    .tablePrint th {
        padding: 0px;
        margin: 0px;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        font-size: 13px;
        height: 35px;
        text-align: center;
    }
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 130px;
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
    .audit {
        position: relative;
        margin-bottom: 10px;
        font-size: 14px;
        box-shadow: none;
        border: 0;
        .avatar {
            position: absolute;
            left: 5px;
            top: 5px;
            width: 36px;
            height: 36px;
            img {
                width: 36px;
                height: 36px;
                border: 1px solid #dddddd;
                border-radius: 50%;
            }
        }
        .info {
            margin-left: 30px;
            display: inline-block;
            width: calc(100% - 60px);
            .creator {
                height: 32px;
                line-height: 32px;
                a {
                    color: #4a6495;
                    text-decoration-line: none;
                }
            }
            .content {
                min-height: 32px;
            }
        }
    }
    #moneyright {
        text-align: right;
        padding-right: 10px;
    }
    .active {
        float: left;
        margin-right: 10px;
    }
    #actionList {
        background: #f4f4f4;
        border-bottom: 1px solid #eaeaea;
        height: 40px;
        width: 100%;
        z-index: 10;
        font-weight: bold;
        .btnList {
            line-height: 40px;
            padding: 12px 10px;
            cursor: pointer;
        }
        .btnList:hover {
            background: #c7e0f4;
        }
    }
    .btnhide {
        display: none;
    }
    .crumbList {
        margin: 15px 0px;
    }
    .el-step__main {
        margin-top: 10px;
    }
    .el-textarea.is-disabled .el-textarea__inner {
        background-color: #e0e1e205;
        border-color: #e4e7ed;
        color: #85888e;
        cursor: not-allowed;
        color: black;
    }
    .el-input.is-disabled .el-input__inner {
        color: #40516f;
        text-align: center;
    }
}
</style>