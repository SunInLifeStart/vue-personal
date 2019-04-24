<template>
    <div id="SupplierDetail">
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
            <div><el-button type="primary"  @click="getFlowNode">查看流程</el-button></div>
            <br />
            <el-form :model='tableData' class="formList">
                <!--<el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">-->
                    <!--<el-step  :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>-->
                <!--</el-steps>-->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="推荐时间：">{{tableData.recommendTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="推荐部门/个人：">{{tableData.recommendDept}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="供应商名称：">{{tableData.supplierName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="推荐参与项目：">{{tableData.recommendProject}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="推荐参与采购项目：">{{tableData.recommendPurProject}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="供应商所在地：">{{tableData.supplieLocation}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="联系人：">
                            <span  v-html="tableData.linkman" ></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否有授权：">{{tableData.accreditSign}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="联系方式：">{{tableData.contactWay}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="主营行业：">{{tableData.mainTrade}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="主力产品/业务：">{{tableData.mainProduct}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="供应商基本情况：">{{tableData.supplierBasic}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="考察评估情况：">{{tableData.inspectSituation}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="推荐意见：">{{tableData.recommendations}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="供应商入库申请表附件：" v-if="tableData.attachmentsSto && tableData.attachmentsSto.length > 0">
                            <div v-for="item in tableData.attachmentsSto" :key="item.id" style="float:left">
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
    name: 'SupplierDetail',
    data() {
        return {
            tableData: {},
            actions: [],
            actionsDialogArr: [],
            users: [],
            crumbs: [],
            comments: [],
            textarea: '',
            dialogVisible: false,
            appFlowName:'motor-issuesreported_party-agendasheet',
            SupplierOption: {
                general: '总办会',
                chairman: '党支委会'
            },
            formName:'issuesReported',
            dialogVisibleCrumb:false,
            flowNodeUrl:"",
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
            $self.url= "/api/v1/issuesReported/detail/" + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data.content;
            } else {
                $self.msgTips("获取表单失败", "warning");
            }
            // debugger;
            let actions = await $self.getActions();
            let crumbs = await $self.getCrumbs();
            let comments =  await $self.getComments();
            for(let i = 0; i < actions.data.types.length; i++){
                if(actions.data.types[i].required && JSON.stringify(actions.data.types[i].required).indexOf("filterButton") > -1){
                    for(let j = 0; j<actions.data.types[i].required.length; j++){
                        if(actions.data.types[i].required[j].indexOf("filterButton") > -1){
                            if(actions.data.types[i].required[j].indexOf("==") > -1){
                                let a = actions.data.types[i].required[j];
                                let key_a = a.split("==")[0].split(":")[1];
                                let value = a.split("==")[1];
                                if($self.tableData[key_a] != value){
                                    actions.data.types[i].hideCurrent = true;
                                }
                            }else{
                                let a = actions.data.types[i].required[j];
                                let key_a = a.split("!=")[0].split(":")[1];
                                let value = a.split("!=")[1];
                                if($self.tableData[key_a] == value){
                                    actions.data.types[i].hideCurrent = true;
                                }
                            }
                        }
                    }
                }
            };
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
#SupplierDetail {
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
