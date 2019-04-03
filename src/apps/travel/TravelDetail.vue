<template>
    <div id="TravelDetail">
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
            <el-steps :active="crumb.index" finish-status="success" class="crumbList">
                <el-step :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumb.items"></el-step>
            </el-steps>
            <div style="text-align:right">
                <el-button type="primary" @click="cope()">打 印</el-button>
            </div>
            <el-form :model='tableData' class="demo-form-inline" ref="formupdate">
                <!-- <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水单号：">{{tableData.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="呈报件：" label-width="30px;">
                            <el-input v-model="tableData.submissionName"></el-input>
                           
                            <el-tooltip class="item" effect="dark" content="查看" placement="right">
                                <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="submissionDetail"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row style="margin-top: 25px;">
                    <el-col :span="8">
                         <el-form-item label="流水单号：">{{tableData.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="呈报件：">
                            {{tableData.submissionName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" icon="el-icon-view" @click="ViewDetail('chengbao')"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-row>
                <table class="tablePrint" style=" width: 100%;">
                    <col style="width: 12%" />
                    <col style="width: 12%" />
                    <col style="width: 14%" />
                    <col style="width: 12%" />
                    <col style="width: 12%" />
                    <col style="width: 14%" />
                    <col style="width: 16%" />
                    <col style="width: 18%" />
                    <tr>
                        <td colspan="8" style="font-weight:bold;"> 基本信息</td>
                    </tr>
                    <tr>
                        <td colspan="1">
                            提单人
                        </td>
                        <td colspan="1">
                            {{tableData.creatorName}}
                        </td>
                        <td colspan="1">
                            费用承担部门
                        </td>
                        <td colspan="2">
                            {{tableData.subOrganName}}
                        </td>
                        <td colspan="1">提单时间</td>
                        <td colspan="2">
                            {{tableData.submitted}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;"> 出差信息</td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            出差事由
                        </td>
                        <td colspan="6" style="text-align: left; padding-left: 10px;">
                            {{tableData.reason}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">出差人员</td>
                        <td colspan="1">所属部门</td>
                        <td colspan="1">职务</td>
                        <td colspan="1">出发地</td>
                        <td colspan="1">目的地</td>
                        <td colspan="1">开始时间</td>
                        <td colspan="1">结束时间</td>
                        <td colspan="1">出差天数</td>
                    </tr>
                    <tr v-for="(item,index) in this.tableData.evections" :key="item.index" @contextmenu.prevent="deleteItem(index,'message')">
                        <td colspan="1">
                            {{item.bname}}
                        </td>
                        <td colspan="1">
                            {{item.borganName}}
                        </td>
                        <td colspan="1">
                            {{item.ranks}}
                        </td>
                        <td colspan="1">
                            {{item.departure}}
                        </td>
                        <td colspan="1">
                            {{item.destination}}
                        </td>
                        <td colspan="1">
                            {{item.startTime}}
                        </td>
                        <td colspan="1">
                            {{item.endTime}}
                        </td>
                        <td colspan="1">
                            {{item.dateNumber}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">预估费用</td>
                    </tr>
                    <tr>
                        <td colspan="2">费用类别</td>
                        <td colspan="1">单价</td>
                        <td colspan="1">数量</td>
                        <td colspan="1">币种</td>
                        <td colspan="1">预估汇率</td>
                        <td colspan="1">原币金额合计</td>
                        <td colspan="1">预估本币金额</td>

                    </tr>
                    <tr v-for="(item,index) in this.tableData.estimate" :key="item.index" @contextmenu.prevent="deleteItem(index,'cost')">
                        <td colspan="2">{{item.smallType !=null ? item.bigType+'/'+item.smallType : item.bigType}}</td>
                        <!-- <td colspan="2"> {{item.smallType}}</td> -->
                        <td colspan="1">
                            {{item.price}}
                        </td>
                        <td colspan="1">
                            {{item.number}}
                        </td>
                        <td colspan="1">
                            {{item.currency.label}}
                        </td>
                        <td colspan="1">
                            {{item.rate}}
                        </td>
                        <td colspan="1" id="moneyright">
                            {{item.subtotal}}
                        </td>
                        <td colspan="1" id="moneyright">
                            {{item.principal}}
                        </td>

                    </tr>

                    <tr>
                        <td colspan="2">合计金额</td>
                        <td colspan="6">
                            {{this.tableData.estimate.length ==0 ? '￥': this.tableData.estimate[0].currency.curValue}}: &nbsp; {{tableData.total}}（金额大写:【{{this.tableData.estimate.length ==0 ? '人民币': this.tableData.estimate[0].currency.label}} 】: {{this.tableData.upper}})
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <!-- <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false"> -->
                            <span>附件上传</span>
                            <!-- </el-upload> -->
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
            <el-row v-if="tableData.comments && tableData.comments.length > 0">
                <el-col :span="24">
                    <h3>审批意见</h3>
                    <div class="items">
                        <div class="item" v-for="item in tableData.comments" :key="item.id">
                            <div class="avatar"><img src="img/avatar.1176c00a.png" alt="" width="30px"></div>
                            <div class="info">
                                <div class="creator">
                                    <span href="#">{{item.creatorName}}</span> &nbsp; ({{item.created | dateformat}})
                                    <span v-show="item.action == 'APPROVE'">【同意】</span>
                                    <span v-if="item.action == 'REJECT'">【驳回】</span>
                                </div>
                                <div class="content">{{item.content}}</div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-dialog :visible.sync="dialogVisible" center width="30%" append-to-body>
            <el-form>
                <el-form-item label="请选择驳回节点" v-show="reject_status">
                    <el-select v-model="rejectTarget" style="width:100%;">
                        <el-option v-for="user in rejectList" :key="user" :label="user" :value="user">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="seleteUserLabel" v-show="presign_status">
                    <el-select v-model="seleteUsers" filterable multiple style="width:100%;">
                        <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批意见">
                    <el-input type="textarea" :rows="2" placeholder="请输入审批意见" v-model="textarea">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import Comment from '../Comment';
export default {
    name: 'TravelDetail',
    data() {
        return {
            tableData: {},
            actions: [],
            crumbs:[],
            formId: "",
            textarea: "",
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName:'appFlowName',
            formName:'travel_forms',
            comments:[],
            dialogVisibleCrumb:false,
            flowNodeUrl:"",
        };
    },
    props: ['formId'],
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
       /**
        ViewDetail(view) {
            if (view == 'borrow') {
                if (
                    this.tableData.borrow.borrowId &&
                    this.tableData.borrow.borrowId != ''
                ) {
                    this.common.open(
                        '#/apps/loan/' + this.tableData.borrow.borrowId
                    );
                }
            } else if (view == 'chengbao') {
                if (this.tableData.submissionId && this.tableData.submissionId != '') {
                    this.common.open(
                        '#/apps/submission/' + this.tableData.submissionId
                    );
                }
            }
        },
        cope() {
            this.$print(this.$refs.formupdate.$el);
        },
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        },
        getAgree() {
            this.array = [];
            let j = -1;
            let p ;
            for (var i = 0; i < this.tableData.comments.length; i++) {
                if (this.tableData.comments[i].action == 'REJECT') {
                    j = i;
                }else if(this.tableData.comments[i].action == 'PULL'){
                    p= i;
                    j = 2;
                }
            }
            if (j == -1) {
                this.array = this.tableData.comments;
            }else if(j = 2){
                for (var a = 0; a < this.tableData.comments.length; a++) {
                    if(a == p || a == p - 1){
                         this.array =  this.array
                    }else{
                        this.array.push(this.tableData.comments[a]);
                    }
                }
            } else {
                for (var k = j + 2; k < this.tableData.comments.length; k++) {
                    this.array.push(this.tableData.comments[k]);
                }
            }
            
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/travel_forms/' + this.formId)
                    .then(res => {
                        self.tableData = res.data;
                        this.getAgree();
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        downloadFile(url) {
            this.common.preview(url);
        },
        */
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url= "/api/v1/"+$self.formName+"/detail/" + $self.formId;
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
            // let crumbs = await $self.getCrumbs();
            let comments =  await $self.getComments();
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
#TravelDetail {
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