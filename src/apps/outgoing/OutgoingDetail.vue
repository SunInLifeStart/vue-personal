<template>
    <div id="OutgoingDetail">
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="(action,index) in actions" :key="index" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>
                
            </el-row>
        </div>
        <br />
        <div class="formContent"  style="padding: 15px 30px;overflow-y:auto">
            <div id="stepslist">
                <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                    <el-step  :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
                </el-steps>
            </div>
            <div><el-button type="primary" v-if="tableData.status != '04'"  @click="getFlowNode">查看流程</el-button></div>
            <br />
         <el-form :model='tableData' >
                <el-row  v-if="tableData.wordNo && tableData.wordNo!=''">
                    <el-col :span="8">
                        <el-form-item label="发文字号：">{{tableData.wordNo}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发文文号：">{{tableData.docNo}}</el-form-item>
                    </el-col>
                </el-row>
         <el-row>
                <el-col :span="8">
                    <el-form-item label="发文类型：">{{tableData.type}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="行文方向：">{{tableData.direction}}</el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="8">
                    <el-form-item label="紧急程度：">{{tableData.urgency}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="主送：">{{tableData.mainTo}}</el-form-item>
                </el-col>
            </el-row>
           <el-row>
                <el-col :span="24">
                    <el-form-item label="抄送：">{{tableData.copyto}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="拟稿单位：">{{tableData.organName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿人：">{{tableData.creatorName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="核稿：">{{tableData.checkorName}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="印制：">{{tableData.printer}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="核对：">{{tableData.verify}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="印发份数：">{{tableData.parts}}</el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="标题：" prop="title">{{tableData.title}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文：">
                         <FilesOperate v-if="tableData.text.name"  :item="tableData.text" :options="{preview:true,download:true,upload:replaceButton,uploadUrl:replaceButton}"   @getId="getId"></FilesOperate>
                    </el-form-item>
                </el-col>
            </el-row>
            
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件：">
                        <div v-for="item in  tableData.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
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
                    <el-form-item label="" v-if="showCheckBox">
                         <div style="color:#941d1d;">*注意：选择经过董事长签批时,也会经过总经理</div>
                          <el-radio-group v-model="tableData.branchlineTo">
                            <el-radio :label="2">需要经过总经理签批</el-radio>
                            <el-radio :label="3">需要经过董事长签批</el-radio>
                        </el-radio-group>
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
         <OutgoingForm  ref="outgoingForm"></OutgoingForm>
    </div>
</template>
<script>
import { publicMethods } from "../application.js";

import axios from "axios";
import Comment from "../Comment";
import OutgoingForm from "./OutgoingForm";
import FilesOperate from "../FilesOperate";
import PdfJs from "../PdfJs";
import moment from "moment";
export default {
    mixins:[publicMethods],
    name: "OutgoingDetail",
    data() {
        return {
            showCheckBox:false,
            tableData: { text: { name: "" }},
            activeName: "second",
            actions: [],
            crumbs:[],
            formId: "",
            textarea: "",
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName:'outgoing-form_outgoing',
            formName:'outgoingingApplication',
            printerFormName:'outgoing_forms',
            comments:[],
            dialogVisibleCrumb:false,
            flowNodeUrl:"",
            dialogFormId: "",
            operationType: "edit",
            dialogFormVisible: false,
            fileleng: "show",
            actions: [],
            crumbNodeName: "",
            crumb: { items: [] },
            saveStatus: false,
            activeName: "second",
            users: [],
            rejectTarget: "",
            rejectList: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: "",
            textarea: "",
            dialogVisible: false,
            currentAction: "",
            submitData: {},
            copyData: {},
            replaceButton: false,
            fullScreen: false,
            seleteUserLabel_approve:'',
            seleteUsers_approve:"",
            approve_status: false,
            approve_users:[],
         };
    },
    components: {
        
        Comment,
        FilesOperate,
        PdfJs,
        OutgoingForm,
    },
    methods: {
        
        getId(id) {},
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url= "/api/v1/outgoing_forms/" + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            let response = await $self.getDetails();
            if (response) {
                $self.copyData = JSON.parse(JSON.stringify(response.data));
                    response.data.text =
                        response.data.text == null
                            ? { name: "" }
                            : JSON.parse(response.data.text);
                // $self.tableData = response.data.content;
                 $self.tableData = response.data;
               $self.$emit("resetStatus", {id:$self.tableData.id,status:$self.tableData.status});

            } else {
                $self.msgTips("获取表单失败", "warning");
            }
            let actions = await $self.getActions();
            let crumbs = await $self.getCrumbsone();
            let comments =  await $self.getComments();
            $self.actions = actions.data.types;
            $self.comments = comments.data;
            $self.crumbs =  {items: crumbs.data, index: -1};
            for(var i= 0; i<$self.crumbs.items.length; i++){
                if($self.crumbs.items[i].active){
                    $self.crumbs.index = i;    
                }
            }
        },
        reEditForm(){
            let $self = this;
            $self.$refs.outgoingForm.setDataFromParent(this.tableData,true);
        },
        symbolEditForm(){
            let $self = this;
            $self.$refs.outgoingForm.setDataFromParents(this.tableData,true);
        },
        
    }
};
</script>
<style lang="scss" scoped>
#OutgoingDetail {
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
     #stepslist{
        height:120px;
        width: 100%;
        // overflow: auto
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
