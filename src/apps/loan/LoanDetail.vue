<template>
    <div id="LoanDetail">
        <!-- <el-steps :active="crumb.index" finish-status="success">
            <el-step :title="item.name" :key="item.id" v-for="item in crumb.items"></el-step>
        </el-steps> -->
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="action in actions" :key="action.type" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>

            </el-row>
        </div>
        <div class="formContent">
            <div>
                <el-button type="primary" @click="getFlowNode">查看流程</el-button>
            </div>
            <br />
            <el-form :model='tableData' class="demo-form-inline" ref="formupdate">
                <el-row style="margin-top: 25px;vertical-align: middle; line-height: 34px;">
                    <el-col :span="8">
                        <span class="bolder">流水单号</span> ：{{tableData.number}}
                    </el-col>
                    <el-col :span="8">
                        <span class="bolder">出差审批单：</span>
                        <span :class="{titlename:tableData.travelView}" @click="ViewDetail('chuchai')">{{tableData.busNo}}</span>
                    </el-col>
                    <!-- <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.tableData.travelView">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('chuchai')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.tableData.travelView == false">
                            <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                        </el-tooltip>
                    </el-col> -->
                    <el-col :span="8">
                        <span class="bolder">呈报件：</span>
                        <span :class="{titlename:tableData.subView}" @click="ViewDetail('chengbao')">{{tableData.subNo}}</span>
                    </el-col>
                    <!-- <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.tableData.subView">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('chengbao')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.tableData.subView == false">
                            <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                        </el-tooltip>
                    </el-col> -->
                </el-row>
                <table class="tablePrint" style=" width: 100%;">
                    <tr>
                        <th class="bolder" colspan="6">基本信息</th>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" height="20px">提单人</td>
                        <td width="10%">
                            {{tableData.creatorName}}
                        </td>
                        <td class="bolder" width="10%">费用承担部门</td>
                        <td width="10%">
                            {{tableData.borrowDept}}
                        </td>
                        <td class="bolder" width="10%">借款时间</td>
                        <td width="10%">
                            {{tableData.borrowTime}}
                        </td>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" height="20px">借款人</td>
                        <td width="10%">
                            {{tableData.borrower}}
                        </td>
                        <td class="bolder" width="10%">开户行</td>
                        <td width="10%">
                            {{tableData.bank}}
                        </td>
                        <td class="bolder" width="10%">银行卡号</td>
                        <td width="10%">
                            {{tableData.cardNum}}
                        </td>
                    </tr>
                    <tr>
                        <th class="bolder" colspan="6">借款信息</th>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%">借款用途</td>
                        <td class="bolder" width="10%">借款金额</td>
                        <td class="bolder" width="10%">币种</td>
                        <td class="bolder" width="10%">预估汇率</td>
                        <td class="bolder" width="10%" colspan="2">预估本币金额</td>
                    </tr>
                    <tr v-for="(Item) in this.tableData.borrows" :key="Item.index">
                        <td>
                            {{Item.bigType.join(',')}}
                        </td>
                        <td>
                            {{Item.loanAmount}}
                        </td>
                        <td>
                            {{Item.currency}}
                        </td>
                        <td>
                            {{Item.estimateRate}}
                        </td>
                        <td colspan="2">
                            {{Item.estimateDomestic}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6">
                        </td>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" colspan="2">金额合计</td>
                        <td>
                            <!-- {{tableData.total}}￥ -->
                            <el-row>
                                <el-col :span="4" align="left" style="margin-left:5px">{{tableData.symbol}}</el-col>
                                <el-col :span="18" align="right" style="margin-right:5px">{{tableData.total}}</el-col>
                            </el-row>
                        </td>
                        <td class="bolder">
                            金额大写
                        </td>
                        <td colspan="2">
                            （{{this.dollarName}}：&nbsp;&nbsp;{{tableData.dx}}&nbsp;&nbsp;)
                        </td>
                    </tr>
                    <tr>
                        <td class="bolder" width="10%" colspan="2">结算方式</td>
                        <td colspan="4">
                            {{tableData.settlement}}
                        </td>
                    </tr>
                    <tr>
                        <td class="bolder" colspan="2">附件上传
                        </td>
                        <td colspan="6">
                            <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                            </div>
                        </td>
                    </tr>
                    <!-- <tr>
                        <td class="bolder" colspan="2">领导审批</td>
                        <td colspan="6" style="text-align: left;">
                            <div class="audit" v-for="item in this.array" :key="item.id" v-show="item.action == 'APPROVE'">
                                <div class="info">
                                    <div class="creator">
                                        <a href="#">{{item.creatorName}}</a> {{item.created | dateformat}}
                                    </div>
                                    <span>【同意】</span>
                                    <span class="content">{{item.content}}</span>
                                </div>
                            </div>
                        </td>
                    </tr> -->
                </table>
            </el-form>
            <el-row v-if="comments && comments.length > 0">
                <el-col :span="24">
                    <h3>审批意见</h3>
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
export default {
    mixins: [publicMethods],
    name: 'LoanDetail',
    data() {
        return {
            tableData: {
                subView: true,
                travelView: true,
                subId: '',
                subNo: '',
                busId: '',
                busNo: '',
                number: '',
                borrowDept: '',
                creatorName: '',
                borrower: '',
                borrows: [],
                borrowTime: '',
                attachments: [],
                symbol: '',
                type: ''
            },
            actions: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'appFlowName',
            formName: 'loan_forms',
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: ''
        };
    },
    components: {
        Comment
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
        ViewDetail(view) {
            if (view == 'chuchai') {
                this.common.open('#/apps/travel/' + this.tableData.busId);
            } else if (view == 'chengbao') {
                // if (this.rows.submissionId && this.rows.submissionId != '') {
                this.common.open('#/apps/submission/' + this.tableData.subId);
                // }
            }
        },
        getAgree() {
            this.array = [];
            let j = -1;
            let p;
            for (var i = 0; i < this.tableData.comments.length; i++) {
                if (this.tableData.comments[i].action == 'REJECT') {
                    j = i;
                } else if (this.tableData.comments[i].action == 'PULL') {
                    p = i;
                    j = 2;
                }
            }
            if (j == -1) {
                this.array = this.tableData.comments;
            } else if ((j = 2)) {
                for (var a = 0; a < this.tableData.comments.length; a++) {
                    if (a == p || a == p - 1) {
                        this.array = this.array;
                    } else {
                        this.array.push(this.tableData.comments[a]);
                    }
                }
            } else {
                for (var k = j + 2; k < this.tableData.comments.length; k++) {
                    this.array.push(this.tableData.comments[k]);
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
            // let crumbs = await $self.getCrumbs();
            let comments = await $self.getComments();
            $self.actions = actions.data.types;
            $self.comments = comments.data;
            // $self.crumbs =  {items: crumbs.data, index: -1};
            // for(var i= 0; i<$self.crumbs.items.length; i++){
            //     if($self.crumbs.items[i].active){
            //         $self.crumbs.index = i;
            //     }
            // }
        }
    }
};
</script>
<style lang="scss" scope>
#LoanDetail {
    .titlename {
        color: #1c47f3;
        text-decoration: underline;
    }
    .attachments {
        margin-left: 10px;
        width: 170px;
        // height: 80px;
        display: inline-block;
        cursor: pointer;
        p {
            margin: 0;
            line-height: 15px;
            color: #606266;
            overflow: hidden;
            margin-right: 20px;
            text-overflow: ellipsis;
            white-space: nowrap;
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
}
</style>