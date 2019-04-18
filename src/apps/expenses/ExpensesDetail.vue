<template>
    <div id="ExpensesDetail">
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
                        <span class="bolder">呈报件：</span>
                        <span :class="{titlename:tableData.subView}" @click="ViewDetail('chengbao')">{{tableData.subNo}}</span>
                    </el-col>
                </el-row>
                <table>
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <tr>
                        <td colspan="8" style="font-weight:bold;">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td>
                            申请人
                        </td>
                        <td>
                            {{tableData.creatorName}}
                        </td>
                        <td>
                            所属部门
                        </td>
                        <td colspan="2">
                            {{tableData.organName}}
                        </td>
                        <td>
                            申请时间
                        </td>
                        <td colspan="2">
                            {{tableData.created}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            接待部门
                        </td>
                        <td colspan="3">
                            {{tableData.organ}}
                        </td>
                        <td>
                            接待时间
                        </td>
                        <td colspan="3">
                            {{tableData.cometime}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8"></td>
                    </tr>
                    <tr>
                        <td>客户单位</td>
                        <td colspan="7">
                            {{tableData.unit}}
                        </td>
                    </tr>
                    <tr>
                        <td>招待事由</td>
                        <td colspan="7">
                            {{tableData.reason}}
                        </td>
                    </tr>
                    <tr>
                        <td>招待地点</td>
                        <td colspan="7">
                            {{table.position}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            公司参加陪同人员
                        </td>
                        <td colspan="3">
                            {{tableData.people}}
                        </td>
                        <td>
                            客户来访人员及职务
                        </td>
                        <td colspan="3">
                            {{tableData.po}}
                        </td>
                    </tr>
                    <tr>
                        <td>预计人数</td>
                        <td colspan="7">
                            {{tableData.amount}}
                        </td>
                    </tr>
                    <tr>
                        <td>预计金额
                        </td>
                        <td colspan="3">
                            {{tableData.smallUpper}}
                            <el-input placeholder="小写" @input="moneyChange" v-model.number="formData.smallUpper" @mousewheel.native.prevent type="number"></el-input>
                        </td>
                        <td colspan="4">
                            {{tableData.bigUpper}}
                        </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr>
                        <td>
                            是否标准内
                        </td>
                        <td colspan="7">
                            {{tableData.allow ? '是' : '否'}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">附件</td>
                    </tr>
                    <tr>
                        <td colspan="2">附件上传
                        </td>
                        <td colspan="6">
                            <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                            </div>
                        </td>
                    </tr>
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
    name: 'ExpensesDetail',
    data() {
        return {
            tableData: {},
            actions: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'appFlowName',
            formName: 'expenses_forms',
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
            if (view == 'chengbao' && this.tableData.subView) {
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
#ExpensesDetail {
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