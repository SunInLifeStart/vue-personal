<template>
    <div id="ApplyMeetingDetail">
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="(action, index) in actions" :key="action.index" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>
            </el-row>
        </div>
        <div class="formContent">
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step  :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model='tableData' class="formList">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">{{tableData.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="提单人：">{{tableData.creatorName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属部门：">{{tableData.organName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="提单时间：">{{tableData.committed}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="会议地点：">{{tableData.meetingPlace}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开会时间：">{{tableData.meetingTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="议题呈报：">
                            {{tableData.branchlineTo}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="会议名称：">{{tableData.conferenceTitle}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="各级领导意见及审批：">{{tableData.idea}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件：" v-if="tableData.attachments && tableData.attachments.length > 0">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
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

            </el-form>
            <el-dialog :visible.sync="dialogVisible" center width="30%" append-to-body>
                <el-form>
                    <el-form-item :label="item.label" v-for="(item,index) in actionsDialogArr" :key="index">
                        <el-select v-model="item.checkedValue" filterable :multiple = "item.multiple" style="width:100%;" value-key="id">
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
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import moment from 'moment';
    import Comment from '../Comment';
    import FilesOperate from '../FilesOperate';
    import { publicMethods } from "../application.js";
    export default {
        mixins:[publicMethods],
        name: 'ApplyMeetingDetail',
        data() {
            return {
                tableData: {},
                actions: [],
                actionsDialogArr: [],
                users: [],
                formId: "",
                crumbs: [],
                comments: [],
                textarea: '',
                dialogVisible: false,
                appFlowName:'motor-issuesReported',
                discussionOption: {
                    specMeeting: '专题会',
                    gmoMeeting: '总办会',
                    partyMeeting: '党支委会',
                    recruMeeting: '招采委员会',
                    communMeeting: '班子沟通会'
                }
            };
        },
        components: {
            Comment,
            FilesOperate
        },
        methods: {
            getFormDetails(formId) {
                let $self = this;
                $self.formId = formId;
                $self.url= "/api/v1/meetingApply/detail/" + $self.formId;
                $self.getFormDetailsData();
            },
            async getFormDetailsData() {
                let $self = this;
                let response = await $self.getDetails();
                if (response) {
                    $self.tableData = response.data.content;
                    if (response.data.content.branchlineTo) {
                        $self.tableData.branchlineTo = this.discussionOption[response.data.content.branchlineTo]
                    } else {
                        $self.tableData.branchlineTo = ''
                    }
                } else {
                    $self.msgTips("获取表单失败", "warning");
                }
                // debugger;
                let actions = await $self.getActions();
                let crumbs = await $self.getCrumbs();
                let comments =  await $self.getComments();
                $self.actions = actions.data.types;
                $self.crumbs =  {items: crumbs.data, index: -1};
                $self.comments = comments.data;
                for(var i= 0; i<$self.crumbs.items.length; i++){
                    if($self.crumbs.items[i].active){
                        $self.crumbs.index = i;
                    }
                }

            }
        }
    };
</script>
<style lang="scss">
    #ApplyMeetingDetail {
        .el-step__main {
            margin-top: 10px;
        }
        .audit {
            position: relative;
            margin-bottom: 10px;
            font-size: 14px;
            box-shadow: none;
            border: 0;
            font-weight: bold;
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
                margin-left: 60px;
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
        .input-with-select {
            width: 0px;
            margin-right: 10px;
            .el-input-group__prepend {
                background-color: #409eff;
                border-color: #409eff;
                color: #ffffff;
                border-radius: 4px;
            }
            &.reject .el-input-group__prepend {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
            .el-input__inner {
                width: 0;
                padding: 0;
                border: 0;
            }
            .el-input__suffix {
                left: 8px;
            }
        }
        #actionList {
            background: #f4f4f4;
            border-bottom: 1px solid #eaeaea;
            height: 40px;
            width: 100%;
            z-index: 10;
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
    }
    .fullScreen {
        position: fixed;
        top: 0px;
        z-index: 10;
        background: #fff;
        left: 0px;
        right: 0px;
    }
</style>
