<template>
    <div id="VehicleDetail" :class="{fullScreen:fullScreen}">
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="action in actions" :key="action.type" class="btnList" @click="doAction(action)">
                        {{action.name}}
                        <!-- <i class="el-icon-edit-outline"></i> -->
                    </span>
                </div>
            </el-row>
        </div>
        <div class="formContent">
            <el-steps :active="crumb.index" finish-status="success" class="crumbList">
                <el-step :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumb.items"></el-step>
            </el-steps>
            <div style="text-align:right">
                <el-button type="primary" @click="print" v-show="this.showPrintBtu">打印</el-button>
            </div>
            <el-form :model='tabledata' style="margin-top: 10px;">
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item label="申请人：">{{tabledata.creatorName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用车人：">{{tabledata.transportPpl}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请人部门：">{{tabledata.organName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用车人电话：">{{tabledata.transportPplPhone}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆类型：">{{tabledata.vehicleType}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="乘车人数：">{{tabledata.transportNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开始时间：">{{tabledata.startTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="结束时间：">{{tabledata.endTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="派车地：">{{tabledata.origin}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目的地：">{{tabledata.destination}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="事由：">{{tabledata.reason}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="tabledata.comments && tabledata.comments.length > 0">
                    <el-col :span="24">
                        <h3>审批意见</h3>
                        <div class="items">
                            <div class="item" v-for="item in tabledata.comments" :key="item.id">
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
            <div v-show="this.showPrint">
                <VehiclePrint :printData="this.tabledata" ref="formupdate"></VehiclePrint>
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
            <el-dialog title="车辆和司机选择" :visible.sync="dispatchDialog1" width="65%">
                <VehicleDriverList @saveStatus="saveStatus" :formId="this.formId"></VehicleDriverList>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Comment from '../Comment';
import VehicleDriverList from './VehicleDriverList';
import VehiclePrint from './VehiclePrint';
export default {
    name: 'VehicleDetail',
    data() {
        return {
            tabledata: {},
            rejectList: [],
            vehicle_form: {},
            showPrint: false,
            showPrintBtu: false,
            options_harry: [
                {
                    value_harryy: 'option1',
                    label_xwfx: '一般'
                },
                {
                    value_harryy: 'option2',
                    label_xwfx: '较急'
                },
                {
                    value_harryy: 'option3',
                    label_xwfx: '急'
                },
                {
                    value_harryy: 'option4',
                    label_xwfx: '特急'
                }
            ],
            crumb: { items: [] },
            actions: [],
            dispatchDialog1: false,
            users: [],
            rejectTarget: '',
            rejectList: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: '',
            textarea: '',
            dialogVisible: false,
            currentAction: '',
            submitData: {},
            fullScreen: false,
            crumbNodeName: ''
        };
    },
    components: {
        Comment,
        VehicleDriverList,
        VehiclePrint
    },
    props: ['formId'],
    mounted() {
        this.getForm();
        this.getAllUsers();
        if (this.formId != '') {
            this.getActions();
        }
    },
    watch: {
        formId: function() {
            if (this.formId != '') {
                this.getForm();
                this.getAllUsers();
                this.getActions();
            } else {
                this.tabledata = {};
            }
        }
    },
    methods: {
        print() {
            //this.showPrint = true;
            this.$print(this.$refs.formupdate.$el);
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/vehicle_forms/' + this.formId)
                    .then(res => {
                        self.tabledata = res.data;
                        if (this.tabledata.done != null) {
                            this.showPrintBtu = true;
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        getActions() {
            this.showPrintBtu = false;
            axios
                .get('/api/v1/vehicles/' + this.formId + '/actions')
                .then(res => {
                    res.data.types = res.data.types || [];
                    if (this.fullScreen) {
                        res.data.types.push({
                            type: 'closeFullScreen',
                            name: '关闭全屏'
                        });
                    } else {
                        res.data.types.push({
                            type: 'fullScreen',
                            name: '全屏显示'
                        });
                    }
                    this.actions = res.data.types;
                });
            axios.get(`/api/v1/vehicles/${this.formId}/crumb`).then(res => {
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        if (item.key == 'Task_04') {
                            this.showPrintBtu = true;
                        }
                        this.crumbNodeName = item.name;
                        if (item.assignes) {
                            item.name = item.name + '(' + item.assignes + ')';
                        }
                        this.crumb.index = index;
                    }
                });
            });
        },
        doComment(action) {
            // if (this.$refs.comment.isEmpty()) {
            //     comment = action.name;
            // }
            if (action.type == 'ARRANGE') {
                this.dispatchDialog1 = true;
                // return false;
            } else {
                this.method(action.type);
            }
        },
        doAction(action) {
            this.clearForm();
            this.currentAction = action;
            // 不需要弹出框
            if (
                'ARCHIVE,DISPATCH,TEMPLATE,PULL,COMMIT,SIGNIN'.includes(
                    action.type
                )
            ) {
                this.clearForm();
                let self = this; //套红，归档，分发
                if (action.type == 'PULL') {
                    axios
                        .get(`/api/v1/vehicles/${self.formId}/pull`)
                        .then(res => {
                            self.comment('formOnlyComment');
                            self.getActions();
                        });
                }
                if (action.type == 'COMMIT' && this.crumbNodeName == '申请') {
                    this.submitForm();
                } else {
                    if (action.type == 'COMMIT') {
                        self.dialogVisible = true;
                        if (action.required) {
                            if (action.type == 'COMMIT') {
                                self.presign_status = true;
                                self.seleteUserLabel = '请选择拟办人';
                            }
                        }
                    }
                }

                if (self.currentAction.type == 'SIGNIN') {
                    self.submitForm();
                }
            } else if ('PRESIGN'.includes(action.type)) {
                //拒绝，加签
                this.dialogVisible = true;
                //需要弹出并填写意见，选择驳回节点或选择其他人
                if (action.type == 'REJECT') {
                    this.getRejectList();
                    this.reject_status = true;
                }
                if (action.type == 'PRESIGN') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择前加签人';
                }
            } else if (action.type == 'ARRANGE') {
                this.dispatchDialog1 = true;
            } else if ('fullScreen'.includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: 'closeFullScreen',
                    name: '关闭全屏'
                });
                this.fullScreen = true;
                // this.common.open(`/#/apps/outgoing/${this.formId}`);
            } else if ('closeFullScreen'.includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: 'fullScreen',
                    name: '全屏显示'
                });
                this.fullScreen = false;
            } else {
                this.dialogVisible = true;
            }
        },
        getRejectList() {
            let self = this;
            axios
                .get('/api/v1/vehicles/' + this.formId + '/reject/targets')
                .then(res => {
                    self.rejectList = res.data;
                });
        },
        submitForm() {
            let self = this;

            //如果是不需要走流程的节点
            if (
                'SAVE,PREVIEW,COMMENT,PULL,PRINTER,EDIT,'.includes(
                    self.currentAction.type
                )
            ) {
            } else {
                //退回
                // if (self.currentAction.type == 'REJECT') {
                //     if (self.seleteUsers) {
                //         self.submitData.rejectTarget = self.rejectTarget;
                //     } else {
                //         self.$message.error('请选择驳回节点');
                //         return false;
                //     }
                // }
                //前加签
                if (self.currentAction.required) {
                    if (self.seleteUsers.length > 0) {
                        var key = self.currentAction.required[0].split(':')[0];
                        self.submitData[key] = self.seleteUsers;
                    } else {
                        self.$message.error(self.seleteUserLabel);
                        return false;
                    }
                }
                self.submitData.action = self.currentAction.type;
                axios
                    .put(
                        `/api/v1/vehicles/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.comment();
                        // self.getForm();
                        self.getActions();
                        self.note1();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    });
            }
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/vehicle_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    node: this.crumbNodeName,
                    action: self.currentAction.type
                })
                .then(res => {
                    if (comment == 'formOnlyComment') {
                        this.getActions();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    }
                    this.getForm();
                });
        },
        clearForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.textarea = '';
            this.submitData = {};
        },
        saveStatus(arrange, driveId) {
            this.dispatchDialog1 = false;
            this.method(arrange, driveId);
            this.getForm()
            
        },
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        },
        method(action, id) {
            this.comment();
            axios
                .put(`/api/v1/vehicles/${this.formId}/signal`, {
                    action: action,
                    driver: id.id
                })
                .then(res => {
                    this.note();
                    this.getActions();
                });
               
           
        },
        note1(){
             const param = {
                    phoneNumbers: this.tabledata.transportPplPhone,
                    signName: '中发展',
                    templateCode:'SMS_156280014',
                    templateParam:{
                        transportPpl:this.tabledata.transportPpl,
                        startTime:this.tabledata.startTime,
                        driver:this.tabledata.drivers.name,
                        driverPhone:this.tabledata.drivers.phone,
                        origin:this.tabledata.origin,
                        licenseNumber:this.tabledata.vehicles.plateNum,
                    }
                };
                axios
                    .post(
                        '/api/v1/message/sendMsg',
                        JSON.stringify(param),
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    )
        },
        note(){
            const parama = {
                phoneNumbers: this.tabledata.drivers.phone,
                signName: '中发展',
                templateCode:'SMS_156280011',
                templateParam:{
                    driver:this.tabledata.drivers.name,
                    transportDept:this.tabledata.transportDept,
                    transportPpl:this.tabledata.transportPpl,
                    licenseNumber:this.tabledata.vehicles.plateNum,
                    transportTime:this.tabledata.startTime,
                    transportPplPhone:this.tabledata.drivers.phone,
                    origin:this.tabledata.origin,
                    destination: this.tabledata.destination
                }
            };
            axios
                .post(
                    '/api/v1/message/sendMsg',
                    JSON.stringify(parama),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
        }
    }
};
</script>
<style lang="scss" scope>
#VehicleDetail {
    .attachments {
        position: relative;
        margin-bottom: 40px;
        margin-right: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        display: inline-block;
        border: 1px solid #c0c4cc;
        border-radius: 2px;
        cursor: pointer;
        img {
            width: 100px;
            height: 120px;
        }
        p {
            margin: 0;
            line-height: 20px;
            color: #606266;
            overflow: hidden;
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
.fullScreen {
    position: fixed;
    top: 0px;
    z-index: 10;
    background: #fff;
    left: 0px;
    right: 0px;
}
</style>