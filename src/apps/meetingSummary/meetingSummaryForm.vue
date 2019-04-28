<template>
<el-dialog title="会议纪要" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="75%" style="text-align: center;">
    <div id="MeetingSummaryForm">
        <el-form :model="formData" label-width="100px" :rules="rules" ref="formupdate">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="会议类型" prop="meetingType">
                        <el-select v-model="formData.meetingType" placeholder="请选择会议类型" style="width:100%;">
                            <el-option
                                    v-for="item in discussionOption"
                                    :key="item.value"
                                    :disabled="item.disabled"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="总办会编号" prop="numbers">
                        <el-input v-model="formData.numbers" placeholder="请输入总办会编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="文件标题" prop="title">
                        <el-input v-model="formData.title" placeholder="请输入文件标题"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="拟稿单位">
                        <el-input type="text" placeholder="" v-model="formData.draftUnit" :disabled="true">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="拟稿时间">
                        <!-- <div class="block"> -->
                        <el-date-picker v-model="formData.draftTime" type="date" placeholder="选择日期" width="100%">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="拟稿人">
                        <el-input type="text" placeholder="" v-model="formData.drafter" :disabled="true">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="电话" prop="phone">
                        <el-input type="text" placeholder="请输入电话" v-model="formData.phone">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="发送" prop="distributes">
                            <el-select style="width:100%;" v-model="formData.distributes" @change="changePeople" multiple placeholder="请选择分送人员">
                                <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 20}" placeholder="请输入备注内容" v-model="formData.remarks">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogSelectCode"
            width="30%"  append-to-body
            center>
        <el-select v-model="branchCode" placeholder="请选择" style="width:100%">
            <el-option
                    v-for="item in currentRoles"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
            </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
                   <el-button type="default" @click="saveFormValidate()">保存</el-button>
                   <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
                </span>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="saveFormValidate()">保存</el-button>
        <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
    </div>
    </el-dialog>
  
</template>
<script>
/* eslint-disable */
import moment from "moment";
import axios from 'axios';
import FilesOperate from "../FilesOperate";
import { application } from "../application.js";
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: "MeetingSummaryForm",
    data() {
        return {
            dialogTitle:"",
            dialogSelectCode:false,
            currentRoles:[],
            branchCode:"",
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            discussionOption: [
                {
                    value: 'specMeeting',
                    label: '专题会'
                },
                {
                    value: 'communMeeting',
                    label: '班子沟通会'
                },
                {
                    value: 'gmoMeeting',
                    disabled: true,
                    label: '总办会'
                },
                {
                    value: 'partyMeeting',
                    disabled: true,
                    label: '党支委会'
                },
                {
                    value: 'recruMeeting',
                    label: '招采委员会'
                }
            ],
            appFlowName: "meeting-form_meeting",
            rules: {
                numbers: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入总办会编号'
                    }
                ],
                meetingType: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入会议类型'
                    }
                ],
                title: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入文件标题'
                    }
                ],
                content: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入内容'
                    }
                ],
                attend: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入出席人'
                    }
                ],
                writer: [
                    {
                        required: true, //是否必填
                        trigger: 'change', //何事件触发
                        message: '请选择记录人'
                    }
                ],
                distributes: [
                    {
                        required: true, //是否必填
                        trigger: 'change', //何事件触发
                        message: '请选择分送人'
                    }
                ]
                // activeNames:[
                //     {
                //         required: true, //是否必填
                //         trigger: "change",//何事件触发
                //         message: '请输入出席人'
                //     }
                // ],
            }
        };
    },
    components: {
        FilesOperate
    },
    methods: {
         setDataFromParent(data) {
            this.formData = data;
            this.formData.distributes = this.formData.distribute.split(',');
            for (let i=0; i<this.formData.distributes.length; i++) {
                this.formData.distributes[i] = parseInt(this.formData.distributes[i])
            }
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.formData.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/board_meeting_forms/deleteAtt/' + id)
                            .then(res => {
                                self.formData.attachments.splice(index, 1);
                            });
                        self.formData.attachments.splice(index, 1);
                    }
                });
            });
        },
        resetForm() {
            let formData = {
                text: '',
                numbers: '',
                title: '',
                content: '',
                attend: '',
                delegate: '',
                writer: '',
                meetingTasks: [],
                attachments: [],
                remarks: '',
                phone: '',
                drafter: this.$store.getters.LoginData.uname || '',
                draftUnit: this.$store.getters.LoginData.oname || '',
                draftTime: moment(new Date()).format('YYYY-MM-DD'),
                distributes: [],
                distribute: '',
            };
            return formData;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = "";
        },
        saveFormValidate(type) {
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        getUsers() {
            axios.get('/api/v1/users', '').then(res => {
                for (let item of res.data) {
                    this.users.push({ id: item.id, name: item.name });
                }
            });
        },
        changePeople() {
            this.$forceUpdate()
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            if($self.createForm_status){
                if(await $self.juderCode() == "returnDialog"){
                    return false;
                }
            }
            this.formData.distribute = this.formData.distributes.join(',')
            let response = await $self.saveFormData(
                "/api/v1/meeting_forms/save",
                $self.formData
            );
            if (response) {
                $self.formId = response.data.id;
                $self.dialogFormVisible = $self.dialogSelectCode =  false;
                if (params) {
                    $self.msgTips("提交成功", "success");
                    if (this.createForm_status) {
                        $self.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                    } else {                              
                        let actions = await $self.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                        actions.data.types = actions.data.types.filter(
                            function(item) {
                                return item.action == "COMMIT";
                            }
                        );
                       actions.data.types[0]["comment"] =  actions.data.types[0].name;
                       await $self.startSignal(actions.data.types[0],"fromeEdit");
                       $self.emitMessage();
                    }
                } else {
                    $self.msgTips("保存成功", "success");
                    if (this.createForm_status) {
                        $self.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                    } else {
                        $self.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                    }
                }
            } else {
                if (params) {
                    if(!this.dialogSelectCode){
                        $self.msgTips("提交失败", "warning");
                    }
                } else {
                    if(!this.dialogSelectCode){
                        $self.msgTips("保存失败", "warning");
                    }
                }
            }
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.formData.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
       
    },
    mounted() {
        this.getUsers();
        if (this.$store.getters.LoginData.oname === '综合管理部') {
            this.discussionOption[2].disabled = false
            this.discussionOption[3].disabled = false
        }
    }
};
</script>
<style lang="scss" scoped>
#MeetingSummaryForm {
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
    input[type=number]::-webkit-inner-spin-button,  
    input[type=number]::-webkit-outer-spin-button {  
    -webkit-appearance: none;
}
}
</style>
<style scoped>

#MeetingSummaryForm  >>> .el-form-item__content{
        width: calc(100% - 112px);
    }
    #MeetingSummaryForm  >>> .el-select {
        width: calc(100% - 15px);
    }
    #MeetingSummaryForm  >>> .el-date-editor{
        width: calc(100% - 0px);
    }
</style>