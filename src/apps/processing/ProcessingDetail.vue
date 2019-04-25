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
        <div class="formContent" style="padding: 15px 30px">
            <br />
            <div><el-button type="primary"  @click="getFlowNode" v-if="tableData.status != '04'">查看流程</el-button></div>
            <br />
            <!--<el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">-->
                <!--<el-step  :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>-->
            <!--</el-steps>-->
            <el-form :model='tableData' class="formList">
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
                                <!-- <div style="float: right;">
                                    <span @click="addItem('personal')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                 </div> -->
                                <el-table :data="tableData.studyExperience" border style="width: 100%; margin-top: 5px;" >
                                    <el-table-column prop="" label="起止时间(年月)">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.fromTo" disabled></el-input>
                                            <!-- <el-date-picker v-model="scope.row.fromTo" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" >
                                            </el-date-picker> -->
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="毕业院校/培训机构">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.graduateTnstitution" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                
                                    <el-table-column prop="" label="所学专业/培训项目">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.major" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="所得学历">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.educationBackground" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="所得学位">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.degree" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="就读方式">
                                        <template slot-scope="scope">
                                            {{scope.row.studyingWay | studyingWayone}}
                                            <!-- <el-radio v-model="scope.row.studyingWay" label="true">统招</el-radio>
                                            <el-radio v-model="scope.row.studyingWay" label="false">自费</el-radio> -->
                                        </template>
                                    </el-table-column>
                                </el-table>
                             </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="工作经历" prop="">
                                <!-- <tr v-for="(item,index) in tableData.attendingDepartment" :key="index" @contextmenu.prevent="deleteItem(item,index,'message')">
                                </tr> -->
                               <!-- <div style="float: right;">
                                    <span @click="addItem('message')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                 </div> -->
                                <el-table :data="tableData.workExperience" border style="width: 100%; margin-top: 5px;" >
                                    <el-table-column prop="" label="起止时间">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.fromTo" disabled></el-input>
                                            <!-- <el-date-picker v-model="scope.row.fromTo" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" >
                                            </el-date-picker> -->
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="公司名称">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.companyName" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                
                                    <el-table-column prop="" label="职位名称">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.jobTitle" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="离职原因">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.reasonToLeave" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="证明人及联系电话">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.referenceNumber" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="职责简述">
                                        <template slot-scope="scope">
                                           <el-input v-model="scope.row.jobDescription" disabled></el-input>
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
                                <!-- <tr v-for="(item,index) in tableData.familyTies" :key="index" @contextmenu.prevent="deleteItem(item,index,'sitIn')">
                                   
                                </tr> -->
                                <!-- <div style="float: right;">
                                    <span @click="addItem('sitIn')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                 </div> -->
                                <el-table :data="tableData.familyTies" border style="width: 100%; margin-top: 5px;" >
                                    <el-table-column prop="" label="称谓">
                                        <template slot-scope="scope">
                                            <el-select style="width:100%;" clearable v-model="scope.row.appellation"  disabled placeholder="请选择">
                                                <el-option
                                                    v-for="item in onOption"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="姓名">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.name" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="出生年月">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.birthday" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                
                                    <el-table-column prop="" label="居住地">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.placeOfAbode" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="工作单位">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.workUnit" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="联系电话">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.contactNumber" disabled></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="备注">
                                        <template slot-scope="scope">
                                           <el-input v-model="scope.row.remark" placeholder="" disabled></el-input>
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
                 <el-row v-if="tableData.positionsWage && tableData.positionsWage!=''" >
                     <el-col :span="24">
                         <h1 style="text-align:center">拟聘人员信息</h1>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名:" >
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
        name: 'ProcessingDetail',
        data() {
            return {
                onOption: [
                    {
                        value: '父亲',
                        label: '父亲'
                    },
                    {
                        value: '母亲',
                        label: '母亲'
                    },
                    {
                        value: '配偶',
                        label: '配偶'
                    },
                     {
                        value: '儿子',
                        label: '儿子'
                    },
                    {
                        value: '女儿',
                        label: '女儿'
                    },
                ],
                tableData: {},
                actions: [],
                actionsDialogArr: [],
                users: [],
                formId: "",
                crumbs: [],
                comments: [],
                textarea: '',
                dialogVisible: false,
                appFlowName:'motor-meetingApply_application-meeting',
                formName:'examinationApproval',
                dialogVisibleCrumb:false,
                flowNodeUrl:"",
            };
        },
        components: {
            Comment,
            FilesOperate
        },
        filters: {
         maritalStatusone: function(data) {
             let xmlJson = {
                "0":"未婚",
                "1":"已婚",
                "2" :"离异",
            };
            return xmlJson[data];
        },
        byPreptwo: function(data) {
                let xmlJson = {
                    "1":"公共交通",
                    "2" :"自驾",
                };
                return xmlJson[data];
        },
        studyingWayone: function(data) {
                let xmlJson = {
                    1:"自费",
                    0 :"统招",
                };
                return xmlJson[data];
        },
    },
        methods: {
            getFormDetails(formId) {
                let $self = this;
                $self.formId = formId;
                $self.url= "/api/v1/examinationApproval/detail/" + $self.formId;
                $self.getFormDetailsData();
            },
            async getFormDetailsData() {
                 let $self = this;
                let response = await $self.getDetails();
                if (response) {
                    $self.tableData = response.data.content;
                    $self.$emit("resetStatus", {id:$self.tableData.id,status:$self.tableData.status});
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
    .tableNoBorders{
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
.blockcolor >>> .el-input__inner{
    color: black
}
</style>
