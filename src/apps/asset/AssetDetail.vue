<template>
    <div id="AssetDetail">
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
        <div class="formContent">
            <div>
                <!--v-show="this.tableData.status && this.tableData.status == '04'"-->
                <el-button type="primary" v-show="this.tableData.status && this.tableData.status == '00'" @click="commitDetail">提交</el-button>
                <el-button type="primary" v-show="this.tableData.status && this.tableData.status != '04'" @click="getFlowNode">查看流程</el-button>
                <el-button style="margin-left: 25px;" type="primary" @click="print" v-show="this.tableData.status && this.tableData.status == '04'">打印</el-button>
            </div>
            <br />
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step :description="item.name" :title="item.assignes" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model="tableData" id='queryTable' class="demo-form-inline" ref="formupdate" style="height:100%;">
                <div style="margin-left:20px;">
                    <h4 style="text-align: center;">资产采购审批单({{tableData.organName ? tableData.organName.split('-')[0]: ''}})</h4>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="申请人：">{{tableData.proposer}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请部门：">{{tableData.applyDept}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请日期：">{{tableData.applyDate | dateformat('YYYY-MM-DD')}}</el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="资产类型：">{{tableData.assetsType}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否年度预算内:">
                                {{this.tableData.budget ? '是': '否'}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否月度资金计划内:">
                                {{this.tableData.plan ? '是': '否'}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注：">{{tableData.remark}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="采购明细："></el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-table :data="tableData.detail" border style="width:700px; margin-top: 5px;color:black;" :header-cell-style="{color:'#000'}">
                                <el-table-column prop="name" label="物品名称">
                                    <template slot-scope="scope">
                                        {{scope.row.name}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="specification" label="规格说明" width="100px">
                                    <template slot-scope="scope">
                                        {{scope.row.specification}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="number" label="计划采购数量" width="60px">
                                    <template slot-scope="scope">
                                        {{scope.row.number}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="price" label="计划单价" width="60px">
                                    <template slot-scope="scope">
                                        {{scope.row.price |numFilter}}

                                    </template>
                                </el-table-column>
                                <el-table-column prop="totalPrice" label="计划总价" width="60px">
                                    <template slot-scope="scope">
                                        {{scope.row.totalPrice}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="inventory" label="库存数量" width="60px">
                                    <template slot-scope="scope">
                                        {{scope.row.inventory}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="buyTime" label="要求购入时间" width="140px">
                                    <template slot-scope="scope">
                                        {{scope.row.buyTime}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="reason" label="用途及申购原因">
                                    <template slot-scope="scope">
                                        {{scope.row.reason}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:20px">
                        <el-col :span="24">
                            <el-form-item label="附件：">
                                <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
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
                </div>
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
    name: 'AssetDetail',
    data() {
        return {
            tableData: {},
            actions: [],
            crumbs: [],
            dialogVisibleAttachment: false,
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'asset-form_asset', //固定资产流程 asset-form_fixedAsset  低值易耗办公品  asset-form_lowAsset
            formName: 'asset_forms',
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
           // this.$refs.uploadAttachmentOther.clearFiles();
        },
        async saveIncomingApply() {
            const $self = this;
            let response = await this.saveFormData(
                '/api/v1/asset_forms/save',
                this.tableData
            );
            if (response) {
                this.dialogVisibleAttachment = false;
                $self.msgTips('编辑附件成功', 'success');
            }
        },
        getAttachmentId() {},
        async print() {
            // document.getElementById('approval').style.display = 'table-row';
            this.$print(this.$refs.formupdate.$el, {
                printTitle: ''
            });
        },
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = '/api/v1/asset_forms/' + $self.formId;
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
            if (response) {
                $self.tableData = response.data;
                $self.$emit('resetStatus', {
                    id: $self.tableData.id,
                    status: $self.tableData.status
                });
            } else {
                // $self.msgTips('获取表单失败', 'warning');
            }
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
    #query-table {
        height: inherit;
    }
    #queryTable {
        height: inherit;
    }
}
</style>
<style scoped>
/* #AssetDetail >>> .el-table .cell.el-tooltip {
    white-space: normal
} */
</style>

<style lang="scss" scoped>
#AssetDetail {
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
    .formContent {
        flex: 1;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 15px 30px;
    }
    .el-step__main {
        margin-top: 10px;
    }
    .has-gutter .el-table .cell {
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
body .el-table th.gutter {
    display: table-cell !important;
}
.fullScreen {
    position: fixed;
    top: 0px;
    z-index: 10;
    background: rgb(214, 172, 172);
    left: 0px;
    right: 0px;
}
</style>
