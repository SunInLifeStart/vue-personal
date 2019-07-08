<template>
    <div id="ResultsDetail">
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
            <br />
            <div><el-button type="primary"  @click="getFlowNode" v-if="tableData.status != '04'">查看流程</el-button></div>
                <el-button style="margin-left: 25px;" type="primary" v-show="this.tableData.status && this.tableData.status == '04'" @click="print">打印</el-button>
            <br />
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step  :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model='tableData' class="formList">
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
                        <el-form-item label="关联采购方案：">
                            <span @click="common.open('#/apps/programme/' + tableData.procschemeNos.id);">{{tableData.procschemeNos.number}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="关联招标文件：">
                            <span @click="common.open('#/apps/tendering/' + tableData.biddocumentNos.id);">{{tableData.biddocumentNos.number}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购方式：">{{tableData.purchaseWay}}
                            {{tableData.purchaseOther}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="目标成本/预算完成情况：">{{tableData.budgetPerformance}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购起止时间：">{{tableData.proTimeStart}}至{{tableData.proTimeEnd}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="采购内容摘要：">{{tableData.proContent}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="采购过程简述：">{{tableData.proProcess}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="采购结果：">{{tableData.proResult}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购结果是否是规定情形：">{{tableData.proResultYes == '1' ? '是': '否'}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="签章需求：">{{tableData.signDemand}}{{tableData.signDemandOth}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="采购业务类别：">{{proTypeOption[tableData.proType]}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="经审批采购方案的附审资料：" v-if="tableData.attachmentsAnno && tableData.attachmentsAnno.length > 0">
                            <div v-for="item in tableData.attachmentsAnno" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="采购报告(评标报告)的附审资料：" v-if="tableData.attachmentsRep && tableData.attachmentsRep.length > 0">
                            <div v-for="item in tableData.attachmentsRep" :key="item.id" style="float:left">
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
                        <el-form-item label="其他：" v-if="tableData.attachmentsOth && tableData.attachmentsOth.length > 0">
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
import { publicMethods } from "../application.js";
export default {
    mixins:[publicMethods],
    name: 'ResultsDetail',
    data() {
        return {
            tableData: {
                procschemeNos: {},
                biddocumentNos: {}
            },
            proTypeOption: {
                '1': '开发建设类采购(招标方式；工程类>=100万，货物类>=50万，服务费>=30万)',
                '2': '开发建设类采购(竞价谈判方式：100万>工程类>=20万、50万>货物类>=10万、30万>服务类>=10万)',
                '7': '开发建设类采购(零星采购；工程类＜20万、货物类＜10万、服务类＜10万',
                '3': '非开发建设类采购(招标方式：估算金额>=30万)',
                '4': '非开发建设类采购(竞价谈判方式：30万>估算金额>=10万)',
                '8': '非开发建设类采购(零星采购；估算金额＜10万）',
                '5': '行政非业务类采购(招标方式：估算金额>=30万)',
                '6': '行政非业务类采购(竞价谈判方式：30万>估算金额>=1万)',
                '9': '行政非业务类采购(零星采购；估算金额＜1万）'
            },
            actions: [],
            actionsDialogArr: [],
            users: [],
            crumbs: [],
            comments: [],
            textarea: '',
            dialogVisible: false,
            appFlowName:'motor-procresult_procresult',
            formName:'motor-procresult',
            dialogVisibleCrumb:false,
            flowNodeUrl:"",
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    methods: {
        print() {
            let $self = this
            let url = "/api/v1/motor-procresult/print/" + $self.tableData.id
            $self.$axios
                .get(url)
                .then(res => {
                    if (process.env.NODE_ENV === 'production') {
                        $self.openUrl = "http://124.205.31.66:2097/static/edit.html?removeBar=true&"
                    } else {
                        $self.openUrl = "http://static1.yxpe.com.cn/edit.html?removeBar=true&"
                    }
                    ntkoBrowser.openWindow(
                        $self.openUrl + "url=" + res.data
                    );
                });
        },
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url= "/api/v1/motor-procresult/get/" + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data.content;
            }
            let actions = await $self.getActions();
            let comments =  await $self.getComments();
            $self.actions = actions.data.types;
            $self.comments = comments.data;

            let crumbs = await $self.getCrumbsone();
                $self.crumbs =  {items: crumbs.data, index: -1};
                for(var i= 0; i<$self.crumbs.items.length; i++){
                    if($self.crumbs.items[i].active){
                        $self.crumbs.index = i;    
                    }
                }
            if($self.crumbs.index == -1) {
                $self.crumbs.index=$self.crumbs.items.length
            }
        }
    }
};
</script>
<style lang="scss">
#ResultsDetail {
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
