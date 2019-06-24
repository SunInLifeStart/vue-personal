<template>
    <el-dialog title="部门呈报" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="75%" style="text-align: center;">
        <div id="SubmissionForm">
            <el-form ref="formupdate" :model="formData" label-width="130px" :rules="rules">
                <el-row  v-if="isFromDetailsEdit">
                    <el-col :span="18">
                        <el-form-item label="呈报件编号" prop="submissionNo">
                            <el-input v-model="formData.submissionNo" type="input" placeholder="请选择自动生成或是手动生成" style="margin-left:0px; height: 16px;" :disabled="selectNumber!=='handNumber'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button size="mini" style="text-align:center; margin-top:6px; margin-left:10px " @click="selectInner('autoNumber')">自动编号</el-button>
                        <el-button size="mini" style="text-align:center;" @click="selectInner('handNumber')">手动编号</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="文件标题" prop="title">
                            <el-input v-model="formData.title"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门呈报类型" prop="submissionType">
                            <el-select v-model="formData.submissionType" placeholder="请选择部门呈报类型">
                                <el-option v-for="item in submissionOption" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop='draftUnit' label="拟稿单位">
                            <!-- <el-input suffix-icon="el-icon-date" v-model="form.draftUnit" @focus="openDialog('draftUnit')"></el-input> -->
                            <el-input v-model="formData.draftUnit" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='draftTime' label="拟稿时间">
                            <el-date-picker v-model="formData.draftTime" style="width:100%" type="date"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop='draftUser' label="拟稿人">
                            <el-input v-model="formData.draftUser" placeholder="" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='telephone' label="电话">
                            <el-input v-model="formData.telephone" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="共同发起人">
                            <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容" v-model="formData.commonUser">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入内容" v-model="formData.remarks">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="正文" style="float:left">
                            <FilesOperate v-if="formData.text.name" :item="formData.text" :options="{preview:true,download:true,edit:true}" @editText="openData(formData.text.url)"></FilesOperate>
                            <el-button type="primary" size="small" @click="createTextBody" v-if="!formData.text.name">创建文件</el-button>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogSelectCode" width="30%" append-to-body center>
            <el-select v-model="branchCode" placeholder="请选择" style="width:100%">
                <el-option v-for="item in currentRoles" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveFormValidate()">保存</el-button>
                <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
            </span>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-button type="default" @click="saveFormValidate()">保存</el-button>
            <el-button type="primary" @click="saveFormValidate(true)" v-if="!isFromDetailsEdit">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import FilesOperate from '../FilesOperate';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'SubmissionForm',
    data() {
        return {
            dialogTitle: '',
            dialogSelectCode: false,
            currentRoles: [],
            branchCode: '',
            formData: this.resetForm(),
            selectNumber: '',
            formId: '',
            appFlowName: 'submission-form_submission',
            dialogFormVisible: false,
            isFromDetailsEdit: false,
            submissionOption: [
                {
                    value: 'report',
                    label: '请示报告类'
                },
                {
                    value: 'branch',
                    label: '党支委类'
                },
                {
                    value: 'union',
                    label: '工会类'
                },
                {
                    value: 'financial',
                    label: '财务类'
                }
            ],
            rules: {
                // submissionNo: [
                //     {
                //         required: true,
                //         message: '呈报件编号不能为空',
                //         trigger: 'blur'
                //     }
                // ],
                title: [
                    {
                        required: true,
                        message: '标题不能为空',
                        trigger: 'blur'
                    }
                ],
                draftUnit: [
                    {
                        required: true,
                        message: '拟稿单位不能为空',
                        trigger: 'blur'
                    }
                ],
                draftTime: [
                    {
                        required: true,
                        message: '拟稿时间不能为空',
                        trigger: 'blur'
                    }
                ],
                submissionType: [
                    {
                        required: true,
                        message: '部门呈报类型不能为空',
                        trigger: 'blur'
                    }
                ],
                draftUser: [
                    {
                        required: true,
                        message: '拟稿人不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    components: {
        // Submission,
        FilesOperate
    },
    methods: {
        saveFormValidate(save) {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    if (this.isFromDetailsEdit) {
                        this.saveForm();
                    } else {
                        this.saveForm(save);
                    }
                }
            });
        },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.formData.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get(
                                `/api/v1/submission_forms/deleteAttachment/${id}`
                            )
                            .then(res => {
                                if (res)
                                    self.formData.attachments.splice(index, 1);
                            });
                    }
                });
            });
        },
        async saveForm(params) {
            const $self = this;
            if ($self.createForm_status) {
                if ((await $self.juderCode()) == 'returnDialog') {
                    return false;
                }
            }
            $self.formData.text = JSON.stringify($self.formData.text);
            if ($self.formData.draftUnit === '综合管理部') {
                $self.formData.generalManagement = true;
            } else {
                $self.formData.generalManagement = false;
            }
            let response = await $self.saveFormData(
                '/api/v1/submission_forms/save',
                $self.formData
            );
            if (response) {
                $self.formId = response.data.id;
                $self.dialogFormVisible = $self.dialogSelectCode = false;
                if (params) {
                    $self.msgTips('提交成功', 'success');
                    if (this.createForm_status) {
                        $self.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                    } else {
                        let actions = await $self.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                        actions.data.types = actions.data.types.filter(function(
                            item
                        ) {
                            return item.action == 'COMMIT';
                        });
                        actions.data.types[0]['comment'] =
                            actions.data.types[0].name;
                        await $self.startSignal(
                            actions.data.types[0],
                            'fromeEdit'
                        );
                        $self.emitMessage();
                    }
                } else {
                    $self.msgTips('保存成功', 'success');
                    this.$emit('getFormDetails', $self.formId)
                    if (this.createForm_status) {
                        $self.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                    } else {
                        $self.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                    }
                }
            } else {
                if (params) {
                    if (!this.dialogSelectCode) {
                        $self.msgTips('提交失败', 'warning');
                    }
                } else {
                    if (!this.dialogSelectCode) {
                        $self.msgTips('保存失败', 'warning');
                    }
                }
            }
        },
        setDataFromParent(data, status) {
            if (typeof data.text == 'string') {
                if (data.text && JSON.parse(data.text).name) {
                    data.text = JSON.parse(data.text);
                }
            }
            this.formData = data;
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
            this.isFromDetailsEdit = status;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = '';
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
        selectInner(type) {
            if (type == 'autoNumber') {
                this.selectNumber = 'autoNumber';
                const self = this;
                axios
                    .get(
                        // '/api/v1/submission_forms/getNo?dept=' + encodeURI(this.cookie_oname),
                        `/api/v1/submission_forms/getNo/${this.formData.id}`
                    )
                    .then(res => {
                        self.formData.submissionNo = res.data;
                    });
            } else {
                this.selectNumber = 'handNumber';
            }
        },
        resetForm() {
            let formData = {
                title: '',
                submissionNo: '',
                draftUnit: this.$store.getters.LoginData.oname,
                draftTime: moment()
                    .utc()
                    .format('YYYY-MM-DD'),
                draftUser: this.$store.getters.LoginData.uname,
                telephone: '',
                generalManagement: false,
                commonUser: '',
                remarks: '',
                submissionType: '',
                content: '',
                attachments: [],
                text: { name: '' }
            };
            return formData;
        },
        createTextBody() {
            this.openData();
        }
    }
};
</script>
<style lang="scss" scoped>
#SubmissionForm {
    .el-select {
        width: 100%;
    }
    .textcreate {
        font-size: 16px;
        color: #327dca;
        padding: 0px 20px;
    }
    .textcreate:hover {
        text-decoration: underline;
        cursor: pointer;

        i {
            display: inline-block !important;
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

        i {
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px;
            &:hover {
                color: red;
            }
        }
    }
}
</style>