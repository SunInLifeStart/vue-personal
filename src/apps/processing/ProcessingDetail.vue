<template>
    <div id="ProcessingDetail">
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="(action, index) in actions" :key="index" class="btnList" @click="doAction(action)" v-if="!action.hideCurrent">
                        {{action.name}}
                    </span>
                </div>
            </el-row>
        </div>
        <div class="formContent" style="padding: 15px 30px;overflow-y:auto">

            <div>
                <el-button type="primary" v-show="this.tableData.status && this.tableData.status == '00'" @click="commitDetail">提交</el-button>
                <el-button type="primary" @click="getFlowNode" v-if="tableData.status != '04'">查看流程</el-button>
            </div>
            <br>
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model='tableData' class="formList">
                <div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="员工级别：">{{tableData.positions}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="关键程度：">{{isKeyone}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="申请岗位：">{{tableData.applyPosition}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="填表日期：">{{tableData.fillingTime}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="姓名：">{{tableData.uname}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="性别：">{{tableData.sex}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出生日期：">{{tableData.birthday}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="民族：">{{tableData.nation}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="籍贯/出生地：">{{tableData.nativePlace}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="户口所在地：">{{tableData.placeDomicile}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="身高：">{{tableData.stature}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="血型：">{{tableData.bloodType}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="婚姻状况：">{{tableData.maritalStatus | maritalStatusone}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="外语水平：">{{tableData.languageLevel}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="职称/职业资格：">{{tableData.technicalTitle}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="政治面貌：">{{tableData.politicsStatus}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="最高学历：">{{tableData.highestEducation}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="电子邮箱：">{{tableData.emailAddress}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="日常交通方式：">{{tableData.byPrep | byPreptwo}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="身份证号码/护照号ID：">{{tableData.idNumber}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="紧急联系人及电话：">{{tableData.contacts}}
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="目前住址：">{{tableData.address}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="手机/家庭电话：">{{tableData.phone}}
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <table class="tableNoBorders">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="学习及培训经历" prop="">
                                    <el-table :data="tableData.studyExperience" border style="width: 100%; margin-top: 5px;">
                                        <el-table-column prop="" label="起止时间(年月)">
                                            <template slot-scope="scope">
                                                {{scope.row.fromTo}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="毕业院校/培训机构">
                                            <template slot-scope="scope">
                                                {{scope.row.graduateTnstitution}}
                                            </template>
                                        </el-table-column>

                                        <el-table-column prop="" label="所学专业/培训项目">
                                            <template slot-scope="scope">
                                                {{scope.row.major}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="所得学历">
                                            <template slot-scope="scope">
                                                {{scope.row.educationBackground}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="所得学位">
                                            <template slot-scope="scope">
                                                {{scope.row.degree}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="就读方式">
                                            <template slot-scope="scope">
                                                {{scope.row.studyingWay | studyingWayone}}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="工作经历" prop="">
                                    <el-table :data="tableData.workExperience" border style="width: 100%; margin-top: 5px;">
                                        <el-table-column prop="" label="起止时间">
                                            <template slot-scope="scope">
                                                <!-- <el-input v-model="scope.row.fromTo" disabled></el-input> -->
                                                {{scope.row.fromTo}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="公司名称">
                                            <template slot-scope="scope">
                                                {{scope.row.companyName}}
                                            </template>
                                        </el-table-column>

                                        <el-table-column prop="" label="职位名称">
                                            <template slot-scope="scope">
                                                {{scope.row.jobTitle}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="离职原因">
                                            <template slot-scope="scope">
                                                {{scope.row.reasonToLeave}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="证明人及联系电话">
                                            <template slot-scope="scope">
                                                {{scope.row.referenceNumber}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="职责简述">
                                            <template slot-scope="scope">
                                                {{scope.row.jobDescription}}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="技能：">{{tableData.skill}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="家庭关系" prop="">
                                    <el-table :data="tableData.familyTies" border style="width: 100%; margin-top: 5px;">
                                        <el-table-column prop="" label="称谓">
                                            <template slot-scope="scope">
                                                {{scope.row.appellation}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="姓名">
                                            <template slot-scope="scope">
                                                {{scope.row.name}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="出生年月">
                                            <template slot-scope="scope">
                                                {{scope.row.birthday}}
                                            </template>
                                        </el-table-column>

                                        <el-table-column prop="" label="居住地">
                                            <template slot-scope="scope">
                                                {{scope.row.placeOfAbode}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="工作单位">
                                            <template slot-scope="scope">
                                                {{scope.row.workUnit}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="联系电话">
                                            <template slot-scope="scope">
                                                {{scope.row.contactNumber}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="备注">
                                            <template slot-scope="scope">
                                                {{scope.row.remark}}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </table>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="附件：" v-if="tableData.attachments && tableData.attachments.length > 0">
                                <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                    <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-row v-if="tableData.positionsWage && tableData.positionsWage.remuneration!=''">
                    <el-col :span="24">
                        <h1 style="text-align:center">拟聘人员信息</h1>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名:">
                            {{tableData.positionsWage.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别:">
                            {{tableData.positionsWage.sex}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="定岗:">
                            {{tableData.positionsWage.determinePosts}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门:">
                            {{tableData.positionsWage.department}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职级:">
                            {{tableData.positionsWage.rank}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="薪酬:">
                            {{tableData.positionsWage.remuneration}}
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="试用期(月):">
                            {{tableData.positionsWage.probationPeriod}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="试用期薪酬标准(%):">
                            {{tableData.positionsWage.percentage}}
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
        <ProcessingForm ref="processingForm"></ProcessingForm>
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Comment from '../Comment';
import FilesOperate from '../FilesOperate';
import ProcessingForm from './ProcessingForm';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'ProcessingDetail',
    data() {
        return {
            isFromDetailsEdit: false,
            isKeyone: '',
            dialogVisibleAttachment: false,
            tableData: {},
            actions: [],
            actionsDialogArr: [],
            users: [],
            formId: '',
            crumbs: [],
            comments: [],
            textarea: '',
            dialogVisible: false,
            appFlowName: 'motor-examinationapproval_examinationapproval',
            formName: 'examinationApproval',
            dialogVisibleCrumb: false,
            flowNodeUrl: ''
        };
    },
    components: {
        Comment,
        FilesOperate,
        ProcessingForm
    },
    filters: {
        maritalStatusone: function(data) {
            let xmlJson = {
                '0': '未婚',
                '1': '已婚',
                '2': '离异'
            };
            return xmlJson[data];
        },
        byPreptwo: function(data) {
            let xmlJson = {
                '1': '公共交通',
                '2': '自驾'
            };
            return xmlJson[data];
        },
        studyingWayone: function(data) {
            let xmlJson = {
                1: '自费',
                0: '统招'
            };
            return xmlJson[data];
        }
    },
    methods: {
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
            //  this.$refs.uploadAttachmentOther.clearFiles();
        },
        async saveIncomingApply() {
            const $self = this;
            let response = await this.saveFormData(
                '/api/v1/examinationApproval/save',
                this.tableData
            );
            if (response) {
                this.dialogVisibleAttachment = false;
                $self.msgTips('编辑附件成功', 'success');
            }
        },
        getAttachmentId() {},
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = '/api/v1/examinationApproval/detail/' + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            $self.actions = [];
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data.content;
                if ($self.tableData.isKey == '是') {
                    this.isKeyone = '关键岗位';
                } else {
                    this.isKeyone = '非关键岗位';
                }
                $self.$emit('resetStatus', {
                    id: $self.tableData.id,
                    status: $self.tableData.status
                });
            } else {
                // $self.msgTips("获取表单失败", "warning");
            }
            // debugger;
            if ($self.tableData.status != '00') {
                let actions = await $self.getActions();
                $self.actions = actions.data.types;
            }
            let crumbs = await $self.getCrumbsone();
            let comments = await $self.getComments();
            $self.crumbs = { items: crumbs.data, index: -1 };
            $self.comments = comments.data;
            for (var i = 0; i < $self.crumbs.items.length; i++) {
                if ($self.crumbs.items[i].active) {
                    $self.crumbs.index = i;
                }
            }
            if ($self.crumbs.index == -1) {
                $self.crumbs.index = $self.crumbs.items.length;
            }
        },
        salaryEditForm() {
            let $self = this;
            this.isFromDetailsEdit = true;
            $self.$refs.processingForm.setDataFromParentone(
                this.tableData,
                true
            );
        }
    }
};
</script>
<style lang="scss" scoped>
#ProcessingDetail {
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
        padding-left: 20px;
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
.tableNoBorders {
    width: 1100px;
    max-width: 1100px;
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
.blockcolor >>> .el-input__inner {
    color: black;
}
</style>
