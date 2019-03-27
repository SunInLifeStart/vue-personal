<template>
    <el-dialog title="议题呈报" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="DiscussionForm">
        <el-form :model="formData" label-width="140px" ref="formupdate">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="流水号:">
                        <el-input v-model="formData.number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="议题呈报">
                        <el-select v-model="appFlowName" placeholder="请选择">
                            <el-option
                                v-for="item in discussionOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="提单人" prop="numbers">
                        <el-input v-model="formData.creatorName" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属部门" prop="filetitle">
                        <el-input v-model="formData.organName" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="提单时间">
                        <el-date-picker v-model="formData.committed" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" :disabled="true">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="提请部门">
                        <el-input v-model="formData.applyDepartment" placeholder="请输入拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="提请时间">
                        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formData.timeApplication" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="议题名称">
                        <el-input v-model="formData.topicName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <table class="tableNoBorder">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="参会部门" prop="phone">
                            <tr v-for="(item,index) in formData.attendingDepartment" :key="index" @contextmenu.prevent="deleteItem(item,index,'message')">
                                <td colspan="4" style="width: 21%;">
                                    <el-select v-model="item.department" placeholder="请输入参会部门" @change="">
                                        <el-option v-for="i in options"
                                                   :key="i.value"
                                                   :label="i.label"
                                                   :value="i.value">
                                                   <!--:value="{value:i.value, label: i.label}">-->
                                        </el-option>
                                    </el-select>
                                </td>
                                <td colspan="4">
                                    <el-select style="width: 100%" v-model="item.people" multiple @change="changePeople" placeholder="请选择人员">
                                        <el-option
                                                v-for="i in personOptions"
                                                :key="i.value"
                                                :label="i.label"
                                                :value="i.value">
                                                <!--:value="{value:i.value, label: i.label}">-->
                                        </el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="8" style="height: 30px;">
                                    <span @click="addItem('message')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                </td>
                            </tr>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="提请事项" prop="content">
                            <tr v-for="(item,index) in formData.requestedItems" :key="index" @contextmenu.prevent="deleteItem(item,index,'personal')">
                                <td colspan="8" style="width: 20%;">
                                    <el-input v-model="item.content" placeholder="请输入提请事项"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="8" style="height: 30px;">
                                    <span @click="addItem('personal')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                </td>
                            </tr>
                        </el-form-item>
                    </el-col>
                </el-row>
            </table>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="会议材料及附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="各级领导意见及审批">
                        <el-input v-model="formData.idea" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="default" @click="saveFormValidate()">保存</el-button>
            <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import FilesOperate from '../FilesOperate';
import { application } from "../application.js";
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: 'DiscussionForm',
    data() {
        return {
            dialogFormVisible: false,
            options: [
                {
                    value: '1',
                    label: '主管部门'
                },
                {
                    value: '2',
                    label: '部门'
                }
            ],
            discussionOption: [
                {
                    value: 'motor-trainingapplication_train',
                    label: '党支委会'
                },
                {
                    value: 'motor-trainingapplication_discussion',
                    label: '总办会'
                }
            ],
            personOptions: [
                {
                    value: '1',
                    label: '杨静'
                },
                {
                    value: '2',
                    label: '刘思雨'
                }
            ],
            formData: this.resetForm(),
            users: [],
            uploadId: 0,
            formLabelWidth: '120px',
            appFlowName: "motor-trainingapplication_train",
            currentFormId: this.operationType == 'create' ? '' : this.formId
        };
    },
    components: {
        FilesOperate
    },
    watch: {
        'formData.lowercase'(val) {

            this.formData.upper = val ? this.convertCurrency(val) : "";
        }
    },
    methods: {
        changePeople() {
            this.$forceUpdate()
        },
        deleteItem(item, index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (type == 'message') {
                    if (item.id) {
                        this.formData.attendingDepartment.splice(index, 1);
                    } else {
                        this.formData.attendingDepartment.splice(index, 1);
                    }
                } else if (type == 'personal') {
                    this.formData.requestedItems.splice(index, 1);
                }
            });
        },
        addItem(type) {
            if (type == 'message') {
                this.formData.attendingDepartment.push({});
            } else if (type == 'personal') {
                this.formData.requestedItems.push({})
            }
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
            let formData =  {
                attachments: [],
                attendingDepartment: [{
                    people: [],
                    department: ''
                }],
                requestedItems: [{}],
                numbers: '',
                created: '',
                // comments: [],
                idea: '',
                committed: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                applyDepartment: this.$store.getters.LoginData.oname || '',
                timeApplication: '',
                topicName: '',
                organName: this.$store.getters.LoginData.oname || '',
                creatorName: this.$store.getters.LoginData.uname || '',
                creatorId: this.$store.getters.LoginData.uid || '',
                organId: this.$store.getters.LoginData.oid || ''
            }
            return formData
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/issuesReported/detail/' + this.formId)
                    .then(res => {
                        self.formData = res.data.content;
                        if (self.formData.attendingDepartment) {
                            self.formData.attendingDepartment.forEach(item => {
                                if (item.person) {
                                    item.people = item.person.split(',')
                                }
                            })
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
        setDataFromParent(data) {
            this.formId = data.id;
            this.getForm()
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
        },
        saveFormValidate(type) {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        async saveForm(params) {
            const $self = this;
            $self.formData.attendingDepartment.forEach(item => {
                if (item.people) {
                    item.person = item.people.join(',')
                }
            })
            let response = await $self.saveFormData(
                "/api/v1/issuesReported/save",
                $self.formData
            );
            if (response) {
                $self.formId = response.data.content.id;
                $self.dialogFormVisible = false;
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
                        await $self.startSignal(actions.data.types[0]);
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
                    $self.msgTips($self, "提交失败", "warning");
                } else {
                    $self.msgTips($self, "保存失败", "warning");
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
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {}
    }
};
</script>
<style lang="scss" scoped>
#DiscussionForm {
    .tableNoBorder {
        width: 100%;
        table-layout: fixed;
        word-break: break-all;
        border-collapse: collapse;
    }
    table td,
    table th {
        border: 1px solid #DBDFE6;
        color: #000;
        height: 35px;
        vertical-align: middle;
        .span1{
            color:red;
            margin-right: 5px;
        }
    }
    table thead th {
        background-color: #cce8eb;
    }
    table tr:nth-child(odd) {
        background: #fff;
    }
    table tr:nth-child(even) {
        background: #fff;
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
}
</style>
<style scoped>
    .tableNoBorder >>> .el-input--small .el-input__inner{
        border: none;
    }
    #DiscussionForm >>> .el-form-item__content{
        width: calc(100% - 140px);
    }
</style>