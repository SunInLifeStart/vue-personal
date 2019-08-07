<template>
    <div id="ProgrammeDetail">
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="(action,index) in actions" :key="index" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>
            </el-row>
        </div>
        <div class="formContent">
            <br />
            <div>
                <el-button type="primary" v-show="this.tableData.status && this.tableData.status == '00'" @click="commitDetail">提交</el-button>
                <el-button type="primary" @click="getFlowNode" v-if="tableData.status != '04'">查看流程</el-button>
            </div>
            <br />
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model='tableData' class="formList" label-width="140px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">{{tableData.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="项目名称：">{{tableData.projectName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购项目名称：">{{tableData.purchaseProjectName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="采购标的简述：">{{tableData.purchaseSignSketch}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购业务类别：">{{radioOption[tableData.purchaseBusinessType]}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否存在‘规定情形’中规定的情况：">{{SignOption[tableData.purchaseSchemeSign]}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="采购发起时间：">{{tableData.purchaseStartTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购主责部门：">{{tableData.purchaseDeptNames.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购预估金额(元)：">{{tableData.estimatedAmount}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="目标成本/预算金融(元)：">{{tableData.budgetAmount}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购方式：">{{tableData.purchaseWay}}
                            <span>{{tableData.purchaseOther}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="实施主体：">{{tableData.executor}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="评审/谈判机构：">{{tableData.negotiateAgent}}
                            <span>{{tableData.negotiateAgentOther}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="其他情况说明：">{{tableData.otherCase}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="评审办法：">{{tableData.reviewWay}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="评审/谈判名单">
                            <tr>
                                <td colspan="4" style="width: 21%;">
                                    <el-select disabled value-key="id" v-model="tableData.negotiateLeaders">
                                        <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="{id: item.id, name: item.name}">
                                        </el-option>
                                    </el-select>
                                </td>
                                <td colspan="8" id="seles">
                                    <el-select disabled v-model="tableData.negotiatePersonnels" multiple filterable allow-create value-key="id" default-first-option>
                                        <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="{id: item.id, name: item.name}">
                                        </el-option>
                                    </el-select>
                                </td>
                            </tr>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="供应商入围情况">
                            <table class="tableNoBorder">
                                <th colspan="8" style="width: 80%">推荐采购入围名单</th>
                                <th colspan="2" style="width: 20%">考察结论</th>
                                <tr style="backgorund:#ccc">
                                    <th colspan="1">序号</th>
                                    <th colspan="2">名称</th>
                                    <th colspan="2">企业性质</th>
                                    <th colspan="2">注册资金</th>
                                    <th colspan="2"> </th>
                                </tr>
                                <tr v-for="(item,index) in tableData.provider" :key="index">
                                    <td colspan="1" style="text-align: center">
                                        {{index + 1}}
                                    </td>
                                    <td colspan="2" style="text-align: center">
                                        {{item.providerName}}
                                    </td>
                                    <td colspan="2" style="text-align: center">
                                        {{item.enterpriseNature}}
                                    </td>
                                    <td colspan="2" style="text-align: center">
                                        {{item.registeredFund}}
                                    </td>
                                    <td colspan="2" style="text-align: right">
                                        {{item.inspectConclusion}}
                                    </td>
                                </tr>
                            </table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="征集公告附件：" v-if="tableData.attachmentsAnno && tableData.attachmentsAnno.length > 0">
                            <div v-for="item in tableData.attachmentsAnno" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="考察报告附件：" v-if="tableData.attachmentsIns && tableData.attachmentsIns.length > 0">
                            <div v-for="item in tableData.attachmentsIns" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="招标采购管理委员会会议纪要附件：" v-if="tableData.attachmentsMan && tableData.attachmentsMan.length > 0">
                            <div v-for="item in tableData.attachmentsMan" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="其他附件：" v-if="tableData.attachmentsOth && tableData.attachmentsOth.length > 0">
                            <div v-for="item in tableData.attachmentsOth" :key="item.id" style="float:left">
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
            <el-dialog :visible.sync="dialogVisibleAttachment" width="40%">
                <el-form label-width="140px">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="征集公告附件" prop="">
                                <el-upload name="files" class="upload-demo uploadBtn" ref="uploadAnno" action="/api/v1/files/upload" :on-success="handleSuccessAnno" accept="" :auto-upload="true" :with-credentials="true">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div v-for="item in tableData.attachmentsAnno" :key="item.id" style="float:left">
                                    <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId()"></FilesOperate>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="考察报告附件" prop="">
                                <el-upload name="files" class="upload-demo uploadBtn" ref="uploadIns" action="/api/v1/files/upload" :on-success="handleSuccessIns" accept="" :auto-upload="true" :with-credentials="true">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div v-for="item in tableData.attachmentsIns" :key="item.id" style="float:left">
                                    <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId()"></FilesOperate>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="招标采购管理委员会会议纪要附件">
                                <el-upload name="files" class="upload-demo uploadBtn" ref="uploadMan" action="/api/v1/files/upload" :on-success="handleSuccessMan" accept="" :auto-upload="true" :with-credentials="true">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div v-for="item in tableData.attachmentsMan" :key="item.id" style="float:left">
                                    <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId()"></FilesOperate>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="其他附件">
                                <el-upload name="files" class="upload-demo uploadBtn" ref="uploadOth" action="/api/v1/files/upload" :on-success="handleSuccessOth" accept="" :auto-upload="true" :with-credentials="true">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div v-for="item in tableData.attachmentsOth" :key="item.id" style="float:left">
                                    <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId()"></FilesOperate>
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
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Comment from '../Comment';
import FilesOperate from '../FilesOperate';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'ProgrammeDetail',
    data() {
        return {
            userOptions: [],
            options: [],
            dataOptions: [],
            dialogVisibleCrumb: false,
            dialogVisibleAttachment: false,
            tableData: {
                status: '',
                purchaseDeptNames: {}
            },
            SignOption: {
                '1': '是',
                '2': '否'
            },
            radioOption: {
                '1':
                    '开发建设类采购(招标方式；工程类>=100万，货物类>=50万，服务费>=30万)',
                '2':
                    '开发建设类采购(竞价谈判方式：100万>工程类>=20万、50万>货物类>=10万、30万>服务类>=10万)',
                '3': '非开发建设类采购(招标方式：估算金额>=30万)',
                '4': '非开发建设类采购(竞价谈判方式：30万>估算金额>=10万)',
                '5': '行政非业务类采购(招标方式：估算金额>=30万)',
                '6': '行政非业务类采购(竞价谈判方式：30万>估算金额>=1万)'
            },
            actions: [],
            actionsDialogArr: [],
            users: [],
            crumbs: [],
            formId: '',
            comments: [],
            textarea: '',
            dialogVisible: false,
            flowNodeUrl: '',
            appFlowName: 'motor-procscheme_procscheme'
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    mounted() {
        this.getUser();
        // this.getOrgans()
    },
    methods: {
        attahmentsUplode() {
            this.dialogVisibleAttachment = true;
        },
        handleSuccessAnno(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.tableData.attachmentsAnno.push(item);
                });
            }
            this.$refs.uploadAnno.clearFiles();
        },
        handleSuccessMan(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.tableData.attachmentsMan.push(item);
                });
            }
            this.$refs.uploadMan.clearFiles();
        },
        handleSuccessIns(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.tableData.attachmentsIns.push(item);
                });
            }
            this.$refs.uploadIns.clearFiles();
        },
        handleSuccessOth(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.tableData.attachmentsOth.push(item);
                });
            }
            this.$refs.uploadOth.clearFiles();
        },
        async saveIncomingApply() {
            const $self = this;
            let response = await this.saveFormData(
                '/api/v1/motor-procscheme/save',
                this.tableData
            );
            if (response) {
                this.dialogVisibleAttachment = false;
                $self.msgTips('编辑附件成功', 'success');
            }
        },
        getId() {},
        async getUser() {
            let user = await this.getUsers('/api/v1/users');
            if (user) this.userOptions = user.data;
        },
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = '/api/v1/motor-procscheme/get/' + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            $self.actions = [];
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data.content;
            }
            if ($self.tableData.status != '00') {
                let actions = await $self.getActions();
                $self.actions = actions.data.types;
            }
            let comments = await $self.getComments();
            $self.comments = comments.data;
            let crumbs = await $self.getCrumbsone();
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
<style lang="scss" scoped>
#ProgrammeDetail {
    .el-step__main {
        margin-top: 10px;
    }
    .el-tag--mini {
        height: 20px;
        padding: 0 5px;
        line-height: 19px;
        color: black;
    }
    .el-tag--mini {
        height: 20px;
        padding: 0 5px;
        line-height: 19px;
        color: black;
    }
    .tableNoBorder {
        width: 100%;
        table-layout: fixed;
        word-break: break-all;
        border-collapse: collapse;
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

<style scoped>
.tableNoBorder >>> .el-input--small .el-input__inner {
    border: none;
}
#seles >>> .el-select {
    width: calc(100% - 180px);
}
#ProgrammeDetail >>> .el-tag--mini {
    height: 20px;
    padding: 0 5px;
    line-height: 19px;
    color: black;
}
</style>