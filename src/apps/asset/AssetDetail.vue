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
            <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps>
            <el-form :model="tableData" class="formList">
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
                    <el-col :span="24">
                        <el-form-item label="备注：">{{tableData.remark}}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="采购明细：">
                            <el-table :data="tableData.detail" border style="width: 100%; margin-top: 5px;">
                                <el-table-column prop="name" label="物品名称">
                                    <template slot-scope="scope">
                                        {{scope.row.name}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="specification" label="规格说明">
                                    <template slot-scope="scope">
                                        {{scope.row.specification}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="number" label="计划采购数量">
                                    <template slot-scope="scope">
                                        {{scope.row.number}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="price" label="计划单价">
                                    <template slot-scope="scope">
                                        {{scope.row.price}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="totalPrice" label="计划总价">
                                    <template slot-scope="scope">
                                        {{scope.row.totalPrice}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="inventory" label="库存数量">
                                    <template slot-scope="scope">
                                        {{scope.row.inventory}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="buyTime" label="要求购入时间" width="160px">
                                    <template slot-scope="scope">
                                        {{scope.row.buyTime}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="reason" label="用途及申购原因" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{scope.row.reason}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件：">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="tableData.comments && tableData.comments.length > 0">
                    <el-col :span="24">
                        <h3>审批意见</h3>
                        <div class="items">
                            <div class="item" v-for="item in tableData.comments" :key="item.id">
                                <div class="avatar"><img src="img/avatar.1176c00a.png" alt="" width="30px"></div>
                                <div class="info">
                                    <div class="creator">
                                        <span href="#">{{item.creatorName}}</span> &nbsp; ({{item.created | dateformat}})
                                    </div>
                                    <div class="content">{{item.content}}</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
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
    </div>
</template>
<script>
import axios from 'axios';
import moment from "moment";
import Comment from "../Comment";
import FilesOperate from "../FilesOperate";
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: "AssetDetail",
    data() {
        return {
            tableData: {},
            actions: [],
            crumbs: [],
            formId: "",
            textarea: "",
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'asset-form_asset',//固定资产流程 asset-form_fixedAsset  低值易耗办公品  asset-form_lowAsset 
            comments: [],
            dialogVisibleCrumb: false,

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
    mounted() {
        this.getAllUsers();
    },
    methods: {
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = "/api/v1/asset_forms/" + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            // let url = `/workflow/${this.appFlowName}/processContent`;
            // $self.$axios.get(url).then(res => {
            //     console.log(res);
            // });
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data;
            } else {
                $self.msgTips("获取表单失败", "warning");
            }
            // debugger;
            let actions = await $self.getActions();
            let crumbs = await $self.getCrumbs();
            let comments = await $self.getComments();
            $self.actions = actions.data.types;
            console.log('actions1', actions)
            $self.crumbs = { items: crumbs.data, index: -1 };
            $self.comments = comments.data;
            for (var i = 0; i < $self.crumbs.items.length; i++) {
                if ($self.crumbs.items[i].active) {
                    $self.crumbs.index = i;
                }
            }
        },
        getRejectList() {
            let self = this;
            axios
                .get('/api/v1/assets/' + this.formId + '/reject/targets')
                .then(res => {
                    self.rejectList = res.data;
                })
                .catch(function () {
                    self.$message({
                        message: '驳回节点查询失败',
                        type: 'error'
                    });
                });
        },
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        },
        // doAction(action) {
        //     this.clearForm();
        //     this.currentAction = action;
        //     // this.submitData = action;
        //     console.log(' this.currentAction', this.currentAction)
        //     // 不需要弹出框
        //     if ('ARCHIVE,DISPATCH,TEMPLATE,PULL,COMMIT'.includes(action.type)) {
        //         let self = this; //套红，归档，分发
        //         if (action.type == 'PULL') {
        //             axios
        //                 .get(`/workflow/asset-form_asset/${self.formId}/pull`)
        //                 .then(res => {
        //                     self.comment('formOnlyComment');
        //                 });
        //         }
        //         if (action.type == 'COMMIT' && this.crumbNodeName == '申请') {
        //             this.submitForm();
        //         } else if (action.type == 'COMMIT') {
        //             self.dialogVisible = true;
        //             if (action.required) {
        //                 if (action.type == 'COMMIT') {
        //                     self.presign_status = true;
        //                     self.seleteUserLabel = '请选择拟办人';
        //                 }
        //             }
        //         }
        //     } else if ('PERSIGN,PRESIGN'.includes(action.type)) {
        //         //拒绝，加签
        //         this.dialogVisible = true;
        //         //需要弹出并填写意见，选择驳回节点或选择其他人
        //         if (action.type == 'REJECT') {
        //             this.getRejectList();
        //             this.reject_status = true;
        //         }
        //         if (action.type == 'PERSIGN') {
        //             this.presign_status = true;
        //             this.seleteUserLabel = '请选择前加签人';
        //             if (this.currentAction.required == null) {
        //                 this.currentAction.required = ['childList:array'];
        //             }
        //         }
        //         if (action.type == 'PRESIGN') {
        //             this.presign_status = true;
        //             this.seleteUserLabel = '请选择前加签人';
        //             if (this.currentAction.required == null) {
        //                 this.currentAction.required = ['childList:array'];
        //             }
        //         }
        //     } else if ('fullScreen'.includes(action.type)) {
        //         this.actions.splice(this.actions.length - 1, 1);
        //         this.actions.push({
        //             type: 'closeFullScreen',
        //             name: '关闭全屏'
        //         });
        //         this.fullScreen = true;
        //         // this.common.open(`/#/apps/outgoing/${this.formId}`);
        //     } else if ('closeFullScreen'.includes(action.type)) {
        //         this.actions.splice(this.actions.length - 1, 1);
        //         this.actions.push({
        //             type: 'fullScreen',
        //             name: '全屏显示'
        //         });
        //         this.fullScreen = false;
        //     } else {
        //         this.dialogVisible = true;
        //     }
        // },
        clearForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.textarea = '';
            this.submitData = {};
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/asset_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    action: self.currentAction.type,
                    node: self.crumbNodeName
                })
                .then(res => {
                    if (comment == 'formOnlyComment') {

                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    }
                    this.getForm();
                });
        },
        // submitForm() {
        //     let self = this;
        //     //如果是不需要走流程的节点
        //     if (
        //         'SAVE,PREVIEW,COMMENT,PULL,PRINTER,EDIT'.includes(
        //             self.currentAction.type
        //         )
        //     ) {
        //     } else {
        //         console.log('1', self.currentAction.required)
        //         console.log('2', self.seleteUsers)
        //         if (self.currentAction.required) {
        //             if (self.seleteUsers.length > 0) {
        //                 var key = self.currentAction.required[0].split(':')[0];
        //                 self.submitData[key] = self.seleteUsers;
        //             } else {
        //                 self.$message.error(self.seleteUserLabel);
        //                 return false;
        //             }
        //         }
        //         self.submitData.action = self.currentAction.type;
        //         axios
        //             .put(
        //                 `/workflow/asset-form_asset/${self.formId}/signal`,
        //                 self.submitData
        //             )
        //             .then(res => {
        //                 self.dialogVisible = false;
        //                 self.comment();

        //                 self.$message({
        //                     message: self.currentAction.name + '成功',
        //                     type: 'success'
        //                 });
        //                 if (self.currentAction.type == 'CANCEL') {
        //                     self.$emit('refreshData');
        //                 }
        //             });
        //     }
        // },
        refreshFormData() {
            this.getForm();
        },
        setMemo() {
            const self = this;
            axios
                .post('/api/v1/asset_forms/setMemo', {
                    memo: '',
                    id: self.formId
                })
                .then(res => { })
                .catch(function () {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss">
#AssetDetail {
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
