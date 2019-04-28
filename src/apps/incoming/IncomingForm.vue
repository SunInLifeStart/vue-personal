<template>
    <el-dialog title="收文" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="75%" style="text-align: center;">
        <div id="IncomingForm">
        <el-form ref="formupdate" :model="formData" label-width="80px" :rules="rules">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="来文机关">
                        <el-input v-model="formData.organ" placeholder="请填写来文机关"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="来文字号">
                        <el-input v-model="formData.wordNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="份数" prop="numberCopies">
                        <el-input v-model.number="formData.numberCopies"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="收文编号">
                        <el-input v-model="formData.receiptNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收文日期">
                        <el-date-picker v-model="formData.receiptDate" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="紧急程度">
                        <el-select v-model="formData.emergencyLevel" placeholder="请选择" style="width:100%">
                            <el-option v-for="item in options_harry" :key="item.value_harryy" :label="item.label_xwfx" :value="item.value_harryy">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="公文标题" prop="title">
                        <el-input v-model="formData.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--<el-row>-->
                <!--<el-col :span="24">-->
                    <!--<el-form-item label="便签">-->
                        <!--<el-input v-model="formData.memo"></el-input>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
            <!--</el-row>-->
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments"></FilesOperate>
                        </div>
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
import FilesOperate from "../FilesOperate";
import {publicMethods} from "../application.js";
export default {
    mixins:[publicMethods],
    name: 'IncomingForm',
    data() {
        return {
            formData: this.resetForm(),
            dialogFormVisible: false,
            createForm_status: false,
            options_harry: [
                {
                    value_harryy: '一般',
                    label_xwfx: '一般'
                },
                {
                    value_harryy: '较急',
                    label_xwfx: '较急'
                },
                {
                    value_harryy: '急',
                    label_xwfx: '急'
                },
                {
                    value_harryy: '特急',
                    label_xwfx: '特急'
                }
            ],
            appFlowName:'incoming-form_incoming',
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                numberCopies: [
                    {
                        type: 'number',
                        required: true,
                        message: '份数必须为数字值'
                    }
                ]
            }
        };
    },
    props: ['formId'],
      components: {
        FilesOperate
    },
    methods: {
        saveFormValidate(data) {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm(data);
                }
            });
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
        },
        setDataFromParent(data) {
            this.formData = data;
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        async saveForm(params) {
            if (this.formData.receiptDate) {
                this.formData.receiptDate = moment(this.formData.receiptDate).format(
                    'YYYY-MM-DD hh:mm:ss'
                );
            } else {
                this.formData.receiptDate = moment(new Date()).format(
                    'YYYY-MM-DD hh:mm:ss'
                );
            }
            let response = await this.getCommonData(
                "/api/v1/incoming_forms/save",
                this.formData
            );
            if (response) {
                this.formId = response.data.id;
                this.dialogFormVisible = false;
                if (params) {
                    this.msgTips("提交成功", "success");
                    if (this.createForm_status) {
                        this.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                    } else {
                        let actions = await this.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                        actions.data.types = actions.data.types.filter(
                            function(item) {
                                return item.action == "COMMIT";
                            }
                        );
                        actions.data.types[0]["comment"] =  actions.data.types[0].name;
                        await this.startSignal(actions.data.types[0],"fromeEdit");
                        this.emitMessage();
                    }
                } else {
                    this.msgTips("保存成功", "success");
                    if (this.createForm_status) {
                        this.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                    } else {
                        this.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                    }
                }
            } else {
                if (params) {
                    this.msgTips("提交失败", "warning");
                } else {
                    this.msgTips("保存失败", "warning");
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
        resetForm() {
            let formData = {
                organ: '',
                wordNo: '',
                numberCopies: '',
                receiptNumber: '',
                receiptDate: moment(new Date()).format('YYYY-MM-DD'),
                emergencyLevel: '',
                title: '',
                attachments: [],
                type: ''
            }
            return formData
        }
    }
};
</script>
<style lang="scss" scoped>
#IncomingForm {
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