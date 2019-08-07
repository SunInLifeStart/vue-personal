<template>
    <div id="BusinessCardDetail">
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
        <div class="formContent" style="padding: 15px 20px;overflow-y:auto">

            <div>
                <el-button type="primary" v-show="this.tableData.status && this.tableData.status == '00'" @click="commitDetail">提交</el-button>
                <el-button type="primary" v-if="tableData.status != '04'" @click="getFlowNode">查看流程</el-button>
                <el-button style="margin-left: 25px;" type="primary" @click="print" v-show="this.tableData.status && this.tableData.status == '04'">打印</el-button>
            </div>
            <br />
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model="tableData" ref="formupdate" class="formList" style="height:100%">
                <h4 style="text-align: center;">名片印刷申请单({{tableData.organName ? tableData.organName.split('-')[0]: ''}})</h4>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="申请人：">{{tableData.creatorName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请部门：">{{tableData.organName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请日期：">{{tableData.committed | dateformat('YYYY-MM-DD')}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属月份：">{{tableData.umonth}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否属于年度预算内：">{{utypeone}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="总印刷数量：">{{tableData.totlenumbers}}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="印刷明细：">
                            <el-table :data="tableData.cardPrinting" border style="width: 900px; margin: 5px;" :header-cell-style="{color:'#000'}">
                                <el-table-column prop="uname" label="姓名" width="70px">
                                    <template slot-scope="scope">
                                        {{scope.row.uname}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="organ" label="部门" width="70px">
                                    <template slot-scope="scope">
                                        {{scope.row.organ}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="duty" label="职务" width="60px">
                                    <template slot-scope="scope">
                                        {{scope.row.duty}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="quantity" label="数量（盒）" width="50px">
                                    <template slot-scope="scope">
                                        {{scope.row.quantity}}
                                        <!-- |numFilter -->
                                    </template>
                                </el-table-column>
                                <el-table-column prop="phone" label="电话" width="60px">
                                    <template slot-scope="scope">
                                        {{scope.row.phone}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="telephone" label="座机号" width="60px">
                                    <template slot-scope="scope">
                                        {{scope.row.telephone}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="mailbox" label="邮箱" width="50px">
                                    <template slot-scope="scope">
                                        {{scope.row.mailbox}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="company" label="公司名称" width="70px">
                                    <template slot-scope="scope">
                                        {{scope.row.company}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="mailingAddress" label="通讯地址" width="70px">
                                    <template slot-scope="scope">
                                        {{scope.row.mailingAddress}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="postcode" label="邮编" width="60px">
                                    <template slot-scope="scope">
                                        {{scope.row.postcode}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="buyTime" label="附件">
                                    <template slot-scope="scope">
                                        <div v-for="item in scope.row.attachments" :key="item.id" class="opertes">
                                            <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
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
    name: 'BusinessCardDetail',
    data() {
        return {
            tableData: {},
            utypeone: '',
            actions: [],
            crumbs: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],

            appFlowName: 'motor-cardprinting_cardprint', //固定资产流程 BusinessCard-form_fixedBusinessCard  低值易耗办公品  BusinessCard-form_lowBusinessCard
            formName: 'cardPrinting',
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: '',
            crumb: { items: [] },
            tabledata: {
                detail: []
            },
            pageType: 'show',
            actions_status: false,
            rejectTarget: '',
            rejectList: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: '',
            currentAction: '',
            submitData: {},
            fullScreen: false,
            crumbNodeName: ''
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    mounted() {},
    methods: {
        async print() {
            this.$print(this.$refs.formupdate.$el, { printTitle: '' });
        },
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = '/api/v1/cardPrinting/detail/' + $self.formId;
            console.log('DetailUrl', $self.url);
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            $self.actions = [];
            // let url = `/workflow/${this.appFlowName}/processContent`;
            // $self.$axios.get(url).then(res => {
            //     console.log(res);
            // });
            let response = await $self.getDetails();
            if (response.data.content) {
                $self.tableData = response.data.content;
                // debugger
                // $self.tableData.forEach(item=>{
                if ($self.tableData.utype == '1') {
                    this.utypeone = '是';
                } else {
                    this.utypeone = '否';
                }
                // })
                $self.$emit('resetStatus', {
                    id: $self.tableData.id,
                    status: $self.tableData.status
                });
            } else {
                //  $self.msgTips("获取表单失败", "warning");
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
}
</style>
<style lang="scss" scoped>
#BusinessCardDetail {
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
    .el-table .cell {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding-left: 10px;
        padding-right: 10px;
        color: black;
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
body .el-table th.gutter {
    display: table-cell !important;
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
#BusinessCardDetail >>> .el-table__header {
    width: 0px;
}
#BusinessCardDetail >>> .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
    color: black;
}
</style>

