<template>
    <div id="ApprovalDetail">
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
        <div class="formContent" style="padding: 15px 30px;overflow-y:auto">
            <!--v-show="this.tableData.status && this.tableData.status == '04'"-->
            <div>
                <el-button type="primary" v-show="this.tableData.status && this.tableData.status == '00'" @click="commitDetail">提交</el-button>
                <el-button type="primary" v-if="tableData.status != '04'" @click="getFlowNode">查看流程</el-button>
                <el-button style="margin-left: 25px;" type="primary" @click="print" v-show="this.tableData.status && this.tableData.status == '04'">打印</el-button>
            </div>
            <br />
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model='tableData' class="formList" id='queryTable' ref="formupdate" style="height:100%">
                <h4 style="text-align: center;">用印审批申请单({{tableData.organName ? tableData.organName.split('-')[0]: ''}})</h4>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="申请人：">{{tableData.creatorName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请时间：">{{tableData.created}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请部门：">{{tableData.organName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="领用时间：">{{tableData.recipientsTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="结束时间：">{{tableData.endTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="时长：">{{tableData.timeLang}}
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="印章种类：">{{tableData.useItems | useItemsfilter}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="类型：">{{tableData.sealType | filterStatus}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="陪同人：">{{tableData.accompanyingPerson}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <table class="tablePrint" style="width: 99%">
                        <tr>
                            <th style="width: 30%">用印文件名称</th>
                            <th style="width: 40%">使用事由</th>
                            <th style="width: 10%">用印份数</th>
                            <th style="width: 20%">附件</th>
                        </tr>
                        <tr v-for="row in tableData.usingApproval">
                            <td>{{row.fileName}}</td>
                            <td>{{row.useReason}}</td>
                            <td>{{row.fileNum}}</td>
                            <td>
                                <!--                                <el-form-item label="" v-if="scope.row.attachments && scope.row.attachments.length > 0" disabled>-->
                                <div v-for="item in row.attachments" :key="item.id">
                                    <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                                </div>
                                <!--                                </el-form-item>-->
                            </td>
                        </tr>
                    </table>
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
import moment from 'moment';
import Comment from '../Comment';
import FilesOperate from '../FilesOperate';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'ApprovalDetail',
    data() {
        return {
            tableData: {},
            actions: [],
            crumbs: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'motor-usingapproval_seal',
            formName: 'singApproval',
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: ''
        };
    },
    filters: {
        useItemsfilter: function(data) {
            let xmlJson = {
                farenzhang: '法人章',
                dangzhibuzhang: '党支部章',
                gongzhang: '公章',
                hetongzhang: '合同章',
                gonghuizhang: '工会章',
                yingyezhizhao: '营业执照',
                jingshenweizhang: '经审委印章',
                caiwuzhang: '财务章'
            };
            return xmlJson[data];
        },
        filterStatus: function(data) {
            let xmlJsons = {
                baifanghan: '拜访函(企业)',
                renliziyuan: '人力资源模板文件',
                richangxingzheng: '日常行政管理',
                others: '其它'
            };
            return xmlJsons[data];
        }
    },
    components: {
        Comment,
        FilesOperate
    },
    methods: {
        async print() {
            this.$print(this.$refs.formupdate.$el, { printTitle: '' });
        },
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = '/api/v1/' + $self.formName + '/detail/' + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            $self.actions = [];
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data.content;
                //  if($self.tableData.sealType=="true"){
                //         $self.typeJuder='是'

                // }
                // if($self.tableData.sealType=="false"){
                //     $self.typeJuder='是'
                // }
                $self.$emit('resetStatus', {
                    id: $self.tableData.id,
                    status: $self.tableData.status
                });
            } else {
                //  $self.msgTips('获取表单失败', 'warning');
            }
            // debugger;
            if ($self.tableData.status != '00') {
                let actions = await $self.getActions();
                $self.actions = actions.data.types;
            }

            let crumbs = await $self.getCrumbsone();
            let comments = await $self.getComments();
            $self.comments = comments.data;
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
<style lang="scss" scoped>
#ApprovalDetail {
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
    .el-step__main {
        margin-top: 10px;
    }

    .tablePrint td,
    .tablePrint th {
        padding: 0px;
        margin: 0px;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        font-size: 13px;
        height: 35px;
        text-align: center;
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

