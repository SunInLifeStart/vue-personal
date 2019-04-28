<template>
    <el-dialog title="请休假申请表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="80%" style="text-align: center;">
        <div id="leavelForm">
            <el-form :model='formData' class="demo-form-inline" ref="formupdate">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水单号：">{{formData.no}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <table style="width: 100%; table-layout: fixed; word-break: break-all;">
                    <col style="width: 14%" />
                    <col style="width: 12%" />
                    <col style="width: 14%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 16%" />
                    <col style="width: 16%" />
                    <col style="width: 10%" />
                    <tr>
                        <td colspan="8" style="font-weight:bold;">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">
                            提单人
                        </td>
                        <td colspan="1">
                            <el-input v-model="formData.uname" disabled="disabled"></el-input>
                        </td>
                        <td colspan="1">
                            所属部门
                            <!-- <span class="span1">*</span>  -->
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.oname" disabled></el-input>
                        </td>
                        <td colspan="1">申请时间</td>
                        <td colspan="2">
                            <el-date-picker style="width:100%" disabled="disabled" v-model="formData.applyTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime">
                            </el-date-picker>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="1">
                            <!-- <span class="span1">*</span> -->
                            申请缘由
                        </td>
                        <td colspan="7">
                            <!-- <el-input v-model="formData.reason"></el-input> -->
                            <el-input type="textarea" placeholder="" v-model="formData.reason" :autosize="{ minformData: 4, maxformData: 30}">
                            </el-input>

                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">申请休假种类</td>
                        <td colspan="1">
                            <el-select v-model="formData.type" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                        <td colspan="1">拟休时间</td>
                        <td colspan="2">
                            <template>
                                <el-date-picker v-model="formData.startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="开始时间">
                                </el-date-picker>
                            </template>
                        </td>
                        <td colspan="1">
                            <template>
                                <el-date-picker style="width:100%;" v-model="formData.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="结束时间">
                                </el-date-picker>
                            </template>
                        </td>
                        <td colspan="2">
                            <el-input placeholder="休假时长" @mousewheel.native.prevent type="number" v-model.number="formData.day">
                                <template style="width:20px;" slot="append">天</template>
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <span style="color:#06940c">附件上传</span>
                            </el-upload>
                        </td>
                        <td colspan="6">
                            <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments"></FilesOperate>
                            </div>
                        </td>
                    </tr>

                </table>
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
            <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
        </div>
    </el-dialog>

</template>
<script>
import { CURRENCY } from '../data.js';
import moment from 'moment';
import axios from 'axios';
import cookies from 'js-cookie';
import FilesOperate from '../FilesOperate';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'leavelForm',
    data() {
        return {
            dialogTitle: '',
            dialogSelectCode: false,
            currentRoles: [],
            branchCode: '',
            dialogFormVisible: false,
            options: [
                {
                    value: '1',
                    label: '事假'
                },
                {
                    value: '2',
                    label: '病假'
                },
                {
                    value: '3',
                    label: '婚假'
                },
                {
                    value: '4',
                    label: '产假'
                },
                {
                    value: '5',
                    label: '丧假'
                },
                {
                    value: '6',
                    label: '工伤假'
                },
                {
                    value: '7',
                    label: '年休假'
                },
                {
                    value: '8',
                    label: '其他'
                }
            ],
            formData: this.resetForm(),
            appFlowName: 'motor-holiday_leave'
        };
    },
    mounted() {},
    components: {
        FilesOperate
    },
    methods: {
        getNum() {
            const self = this;
            let params = {
                code: 'motor-holiday'
            };
            axios
                .post('/synergy-common/serialNumber/getByTableCode', params)
                .then(res => {
                    this.formData.no = res.data.content.serialNumber;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        setDataFromParent(data) {
            this.formData = data;
            for (let item of this.options) {
                if (item.value == this.formData.type) {
                    this.formData.type = item.label;
                }
            }
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
            this.getNum();
            this.branchCode = '';
        },
        resetForm() {
            let formData = {
                attachments: [],
                uname: cookies.get('uname'), //申请人
                oname: cookies.get('oname'), //所属部门
                no: '',
                id: '',
                applyTime: moment().format('YYYY-MM-DD HH:mm:ss'), //提单时间
                isAnnualPlan: 'true',
                startTime: '',
                endTime: '',
                type: '事假'
            };
            return formData;
        },
        saveFormValidate(type) {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            if ($self.createForm_status) {
                if ((await $self.juderCode()) == 'returnDialog') {
                    return false;
                }
            }
            for (let item of $self.options) {
                if ($self.formData.type == item.label) {
                    $self.formData.type = item.value;
                }
            }
            this.formData.role = cookies.get('Role');
            let response = await $self.saveFormData(
                this.createForm_status
                    ? '/api/v1/motor-holiday/save'
                    : '/api/v1/motor-holiday/update',
                $self.formData
            );
            if (response) {
                $self.formId = response.data.content;
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
        handleRemove() {},
        deleteAttachment(id) {
            if (this.formData.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        for (
                            let i = 0;
                            i <= this.formData.attachments.length;
                            i++
                        ) {
                            if (this.formData.attachments[i].id == id) {
                                let aa = this.formData.attachments.splice(i, 1);
                            }
                        }
                    }
                );
            }
        }
    }
};
</script>
<style lang="scss">
#leavelForm {
    table {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        width: 100%;
    }
    table td,
    table th {
        border: 1px solid #ebeef5;
        color: #000;
        height: 40px;
        vertical-align: middle;
        .span1 {
            color: red;
            margin-right: 5px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0;
        }
        input[type='number'] {
            -moz-appearance: textfield;
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
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 180px;
    }
    .el-input--suffix .el-input__inner {
        padding-right: 0;
    }
    .el-cascader {
        width: 100%;
    }
    #moneyright {
        .el-input__inner {
            text-align: right;
        }
    }
    .notice {
        color: red;
        ol {
            font-size: 17px;
        }
    }
}
</style>