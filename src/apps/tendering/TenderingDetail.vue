<template>
    <div id="TenderingDetail">
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="(action, index) in actions" :key="index" class="btnList" @click="doAction(action)">
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
            <el-button style="margin-left: 25px;" type="primary" v-show="this.tableData.status && this.tableData.status == '04'" @click="print">打印</el-button>
            <br />
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model="tableData" id='queryTable' class="demo-form-inline" ref="formupdate" style="height:100%;" label-width="140px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">{{tableData.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="项目名称：">{{tableData.projectName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="招标项目名称：">{{tableData.biddingProjectName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="招标人：">{{tableData.tenderee}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购业务类别：">{{procurementOption[tableData.procurementType]}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购标的类别：">{{tableData.purchaseType}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="招标方式：">{{tableData.biddingType}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="签章需求：">{{tableData.signatureRequirements}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预计金额(元)：">{{tableData.estimatedAmount}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="标的简述：">{{tableData.bidingSketch}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="关联采购方案：">
                            <span @click="common.open('#/apps/programme/' + tableData.procurementScheme.id);">{{tableData.procurementScheme.number}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="招标文件(评审版)附件：" v-if="tableData.biddingDocumentAttachment && tableData.biddingDocumentAttachment.length > 0">
                            <div v-for="item in tableData.biddingDocumentAttachment" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="经审批的采购方案附件：" v-if="tableData.procurementSchemeAttachment && tableData.procurementSchemeAttachment.length > 0">
                            <div v-for="item in tableData.procurementSchemeAttachment" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="其他附件：" v-if="tableData.otherAttachment && tableData.otherAttachment.length > 0">
                            <div v-for="item in tableData.otherAttachment" :key="item.id" style="float:left">
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
                            <el-form-item label="招标文件(评审版)附件" prop="">
                                <el-upload name="files" class="upload-demo uploadBtn" ref="uploadDocument" action="/api/v1/files/upload" :on-success="handleSuccessDocument" :multiple="true" :show-file-list="false" accept="" :auto-upload="true" :with-credentials="true">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div v-for="item in tableData.biddingDocumentAttachment" :key="item.id" style="float:left">
                                    <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId()"></FilesOperate>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="经审批的采购方案附件" prop="">
                                <el-upload name="files" class="upload-demo uploadBtn" ref="uploadScheme" action="/api/v1/files/upload" :on-success="handleSuccessScheme" :multiple="true" :show-file-list="false" accept="" :auto-upload="true" :with-credentials="true">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div v-for="item in tableData.procurementSchemeAttachment" :key="item.id" style="float:left">
                                    <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId()"></FilesOperate>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="其他附件">
                                <el-upload name="files" class="upload-demo uploadBtn" ref="uploadOther" action="/api/v1/files/upload" :on-success="handleSuccessOther" :multiple="true" :show-file-list="false" accept="" :auto-upload="true" :with-credentials="true">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div v-for="item in tableData.otherAttachment" :key="item.id" style="float:left">
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
    name: 'TenderingDetail',
    data() {
        return {
            tableData: {
                procurementScheme: {}
            },
            dialogVisibleAttachment: false,
            actions: [],
            crumbs: [],
            procurementOption: {
                '1':
                    '开发建设类采购(招标方式；工程类>=100万，货物类>=50万，服务费>=30万)',
                '3': '非开发建设类采购(招标方式：估算金额>=30万)',
                '5': '行政非业务类采购(招标方式：估算金额>=30万)'
            },
            actionsDialogArr: [],
            dialogVisibleCrumb: false,
            users: [],
            comments: [],
            formId: '',
            flowNodeUrl: '',
            textarea: '',
            dialogVisible: false,
            appFlowName: 'motor-biddocument_biddocument'
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    methods: {
        attahmentsUplode() {
            this.dialogVisibleAttachment = true;
        },
        handleSuccessDocument(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    item.attachmentType = 'biddingDocumentAttachment';
                    self.tableData.biddingDocumentAttachment.push(item);
                });
            }
            // this.$refs.uploadDocument.clearFiles();
        },
        handleSuccessScheme(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    item.attachmentType = 'procurementSchemeAttachment';
                    self.tableData.procurementSchemeAttachment.push(item);
                });
            }
            //  this.$refs.uploadScheme.clearFiles();
        },
        handleSuccessOther(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    item.attachmentType = 'otherAttachment';
                    self.tableData.otherAttachment.push(item);
                });
            }
            // this.$refs.uploadOther.clearFiles();
        },
        async saveIncomingApply() {
            const $self = this;
            let response = await this.saveFormData(
                '/api/v1/motor-biddocument/save',
                this.tableData
            );
            if (response) {
                this.dialogVisibleAttachment = false;
                $self.msgTips('编辑附件成功', 'success');
            }
        },
        async print() {
            // document.getElementById('approval').style.display = 'table-row';
            this.$print(this.$refs.formupdate.$el, {
                printTitle: ''
            });
        },
        getId() {},
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = '/api/v1/motor-biddocument/detail/' + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            $self.actions = [];
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data.content;
                $self.$emit('resetStatus', {
                    id: $self.tableData.id,
                    status: $self.tableData.status
                });
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
<style lang="scss">
#TenderingDetail {
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
