<template>
    <div id="leaveDetail">
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
            <!-- <div><el-button type="primary"  @click="getFlowNode">查看流程</el-button></div> -->
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList">
                <el-step :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <div style="text-align:right">
                <el-button type="primary" @click="cope()">打 印</el-button>
            </div>
            <el-form :model='tableData' class="demo-form-inline" ref="formupdate">
                <el-row style="margin-top: 25px;">
                    <el-col :span="8">
                        <el-form-item label="流水单号：">{{tableData.no}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <table class="tablePrint" style=" width: 100%;">
                    <col style="width: 12%" />
                    <col style="width: 14%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 16%" />
                    <col style="width: 16%" />
                    <col style="width: 10%" />
                    <tr>
                        <td colspan="8" style="font-weight:bold;">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">
                            提单人
                        </td>
                        <td colspan="1">
                            {{tableData.uname}}
                        </td>
                        <td colspan="1">
                            <span class="span1">*</span> 所属部门
                        </td>
                        <td colspan="2">
                            {{tableData.oname}}
                        </td>
                        <td colspan="1">申请时间</td>
                        <td colspan="2">
                            {{tableData.applyTime}}
                        </td>
                    </tr>
                    <tr>
                        <!-- <td colspan="8" style="font-weight:bold;"> 出差信息</td> -->
                    </tr>
                    <tr>
                        <td colspan="1">
                            <span class="span1">*</span>申请缘由
                        </td>
                        <td colspan="7">
                            <el-input v-model="tableData.reason"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>申请休假种类</td>
                        <td colspan="2">
                            {{tableData.type}}
                        </td>
                        <td>拟休时间</td>
                        <td colspan="5">
                            <template>
                                {{tableData.startTime}}至 {{tableData.endTime}}
                            </template>
                            共({{tableData.day}})天
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span>附件上传</span>
                        </td>
                        <td colspan="6">
                            <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                                <!-- <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i> -->
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            审批意见
                        </td>
                        <td colspan="6" style="text-align: left;">
                            <div class="audit" v-for="item in this.array" :key="item.id" v-show="item.action=='APPROVE'">
                                <!-- <div class="avatar">
                                    <img src="../../assets/avatar.png" alt="">
                                </div> -->
                                <div class="info">
                                    <div class="creator">
                                        <a href="#">{{item.creatorName}}</a> {{item.created | dateformat}}
                                    </div>
                                    <span>【同意】</span>
                                    <span class="content">{{item.content}}</span>
                                </div>
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
import FilesOperate from '../FilesOperate';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'leaveDetail',
    data() {
        return {
            actions: [],
            crumbs: [],
            crumb: [],
            formId: '',
            users: [],
            actionsDialogArr: [],
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: '',
            // qqq
            subStatus: false,
            activeName: 'first',
            tableData: {
                no: '',
                submitter: '',
                subOrganName: '',
                reason: '',
                evections: [],
                estimate: [],
                attachments: []
            },
            fileleng: 'show',
            actions: [],
            rejectTarget: '',
            rejectList: [],
            attachments: [],
            array: [],
            users: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: '',
            textarea: '',
            dialogVisible: false,
            appFlowName: 'motor-holiday_leave',
            formName: 'motor-holiday'
        };
    },
    // props: ['formId'],
    components: {
        Comment,
        FilesOperate
    },
    methods: {
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = '/api/v1/motor-holiday/get/' + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data.content;
            } else {
                $self.msgTips('获取表单失败', 'warning');
            }
            // debugger;
            let actions = await $self.getActions();
            let crumbs = await $self.getCrumbs();
            let comments = await $self.getComments();
            $self.actions = actions.data.types;
            $self.crumbs = { items: crumbs.data, index: -1 };
            $self.comments = comments.data;
            for (var i = 0; i < $self.crumbs.items.length; i++) {
                if ($self.crumbs.items[i].active) {
                    $self.crumbs.index = i;
                }
            }
        }
    }
};
</script>
<style lang="scss">
#leaveDetail {
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