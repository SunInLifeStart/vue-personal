<template>
    <div id="TravelDetail">
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
            <!--   v-show="this.tableData.status && this.tableData.status == '04'"-->
            <div>
                <el-button type="primary" @click="getFlowNode" v-show="this.tableData.status && this.tableData.status != '04'">查看流程</el-button>
                <el-button style="margin-left: 25px;" type="primary" @click="print" v-show="this.tableData.status && this.tableData.status == '04'">打印</el-button>
            </div>
            <br />
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model='tableData' class="demo-form-inline" ref="formupdate" id='queryTable' style="height:100%">
                <h4 style="text-align: center;">出差审批单({{tableData.organName ? tableData.organName.split('-')[0]: ''}})</h4>
                <el-row style="margin-top: 25px;">
                    <el-col :span="12">
                        <el-form-item label="流水单号：" style="margin-left:5px;">{{tableData.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="呈报件：">
                            <span style="font-size:10px" @click="ViewDetail()" :class="{'titlename':this.tableData.travelView}"> {{tableData.submissionName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <table class="tablePrint" style=" width: 100%;">
                    <col style="width: 12%" />
                    <col style="width: 12%" />
                    <col style="width: 14%" />
                    <col style="width: 12%" />
                    <col style="width: 12%" />
                    <col style="width: 14%" />
                    <col style="width: 16%" />
                    <col style="width: 18%" />
                    <tr>
                        <td colspan="8" style="font-weight:bold;"> 基本信息</td>
                    </tr>
                    <tr>
                        <td colspan="1">
                            提单人
                        </td>
                        <td colspan="1">
                            {{tableData.creatorName}}
                        </td>
                        <td colspan="1">
                            费用承担部门
                        </td>
                        <td colspan="2">
                            {{tableData.subOrganName}}
                        </td>
                        <td colspan="1">提单时间</td>
                        <td colspan="2">
                            {{tableData.submitted}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;"> 出差信息</td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            出差事由
                        </td>
                        <td colspan="6" style="text-align: left; padding-left: 10px;">
                            {{tableData.reason}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">出差人员</td>
                        <td colspan="1">所属部门</td>
                        <td colspan="1">职务</td>
                        <td colspan="1">出发地</td>
                        <td colspan="1">目的地</td>
                        <td colspan="1">开始时间</td>
                        <td colspan="1">结束时间</td>
                        <td colspan="1">出差天数</td>
                    </tr>
                    <tr v-for="(item,index) in this.tableData.evections" :key="item.index" @contextmenu.prevent="deleteItem(index,'message')">
                        <td colspan="1">
                            {{item.bname}}
                        </td>
                        <td colspan="1">
                            {{item.borganName}}
                        </td>
                        <td colspan="1">
                            {{item.ranks}}
                        </td>
                        <td colspan="1">
                            {{item.departure}}
                        </td>
                        <td colspan="1">
                            {{item.destination}}
                        </td>
                        <td colspan="1">
                            {{item.startTime}}
                        </td>
                        <td colspan="1">
                            {{item.endTime}}
                        </td>
                        <td colspan="1">
                            {{item.dateNumber}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">预估费用</td>
                    </tr>
                    <tr>
                        <td colspan="2">费用类别</td>
                        <td colspan="1">单价</td>
                        <td colspan="1">数量</td>
                        <td colspan="1">币种</td>
                        <td colspan="1">预估汇率</td>
                        <td colspan="1">原币金额合计</td>
                        <td colspan="1">预估本币金额</td>

                    </tr>
                    <tr v-for="(item) in this.tableData.estimate" :key="item.index">
                        <td colspan="2">{{item.bigType}}</td>
                        <!-- <td colspan="2"> {{item.smallType}}</td> -->
                        <td colspan="1">
                            {{item.price}}
                        </td>
                        <td colspan="1">
                            {{item.number}}
                        </td>
                        <td colspan="1">
                            {{item.currency.label}}
                        </td>
                        <td colspan="1">
                            {{item.rate}}
                        </td>
                        <td colspan="1" id="moneyright">
                            {{item.subtotal}}
                        </td>
                        <td colspan="1" id="moneyright">
                            {{item.principal}}
                        </td>

                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">预算、资金计划信息</td>
                    </tr>
                    <tr>
                        <td>
                            是否资金计划内
                        </td>
                        <td colspan="3">
                            {{tableData.fundPlan ? '是': '否'}}
                        </td>
                        <td>
                            是否预算内
                        </td>
                        <td colspan="3">
                            {{tableData.est ? '是': '否'}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">合计金额</td>
                        <td colspan="6">
                            {{this.tableData.estimate.length ==0 ? '￥': this.tableData.estimate[0].currency.curValue}}: &nbsp; {{tableData.total}}（金额大写:【{{this.tableData.estimate.length ==0 ? '人民币': this.tableData.estimate[0].currency.label}} 】: {{this.tableData.upper}})
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <!-- <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false"> -->
                            <span>附件上传</span>
                            <!-- </el-upload> -->
                        </td>
                        <td colspan="6" style="padding:10px;">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    <!--
                    <tr>
                        <td colspan="2">
                            审批意见
                        </td>
                        <td colspan="6" style="text-align: left;">
                            <div class="audit" v-for="item in this.array" :key="item.index">
                                <div class="info">
                                    <div class="creator">
                                        <a href="#">{{item.userName}}</a> {{item.times | dateformat}}
                                    </div>
                                    <span>【同意】</span>
                                    <span class="content">{{item.fullMessage}}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    -->
                </table>
                <el-row v-if="comments && comments.length > 0">
                    <el-col :span="24">
                        <h3 style="margin-left:5px;">审批意见</h3>
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
export default {
    mixins: [publicMethods],
    name: 'TravelDetail',
    data() {
        return {
            tableData: {
                attachments: [],
                number: '',
                travelType: '',
                submission2: '',
                submitter: '',
                subOrganName: '',
                submitted: '',
                reason: '',
                total: '',
                upper: '',
                evections: [],
                estimate: []
            },
            array: [],
            actions: [],
            crumbs: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'travel-form_travel',
            formName: 'travel_forms',
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: ''
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    // mounted() {
    //     // this.getAgree()
    //     this.getAllUsers();
    //     if (this.formId != '') {
    //         this.getForm();
    //         this.getActions();
    //     }
    // },
    methods: {
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
                this.tableData.travelView
            ) {
                this.common.open(
                    '#/apps/submission/' + this.tableData.submissionId
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
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data;
                $self.$emit('resetStatus', {
                    id: $self.tableData.id,
                    status: $self.tableData.status
                });
            } else {
                $self.msgTips('获取表单失败', 'warning');
            }
            let actions = await $self.getActions();
            let crumbs = await $self.getCrumbsone();
            let comments = await $self.getComments();
            $self.actions = actions.data.types;
            $self.comments = comments.data;
            this.getAgree();
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
#TravelDetail {
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
}
</style>