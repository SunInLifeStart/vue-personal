<template>
    <el-dialog title="招标异常事项申报表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="AbnormalForm">
            <el-form :model="formData" :rules="rules" label-width="140px" ref="formData">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="招标人" prop="tenderee">
                            <el-input v-model="formData.tenderee"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人及电话" prop="tenderee">
                            <el-input v-model="formData.linkman"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="项目名称" prop="projectName">
                            <el-input v-model="formData.projectName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="采购业务类别" prop="purchaseType" style="text-align: left">
                            <el-radio-group v-model="formData.purchaseType">
                                <div v-for="item in radioOption">
                                    <el-radio :key="item.value" :label="item.label">
                                        {{item.label}}
                                    </el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="招标情况说明" prop="bidCondition">
                            <el-input v-model="formData.bidCondition"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="异常情况" prop="anomalyConditions">
                            <el-checkbox-group v-model="formData.anomalyConditions">
                                <el-row>
                                    <el-checkbox label="投标报价均超上限的；"></el-checkbox>
                                    <el-checkbox label="投标有效单位不足的；"></el-checkbox>
                                    <el-checkbox label="存在围标串标行为或重大嫌疑的；"></el-checkbox>
                                </el-row>
                                <el-row>
                                    <el-checkbox label="排序第一的投标人实施有重大风险的，且对方不承诺弃标将其废标的；"></el-checkbox>
                                    <el-checkbox label="不按评标原则定标的；"></el-checkbox>
                                </el-row>
                                <el-row>
                                    <el-checkbox label="排序第一的投标人弃标。"></el-checkbox>
                                    <el-checkbox label="其他"></el-checkbox>
                                    <el-input style="width: 50%" :disabled="changeConditionsOther" v-model="formData.anomalyConditionOth"></el-input>
                                </el-row>
                            </el-checkbox-group>
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
            <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'AbnormalForm',
    data() {
        return {
            dialogTitle: '',
            dialogSelectCode: false,
            currentRoles: [],
            branchCode: '',
            dialogFormVisible: false,
            radioOption: [
                {
                    value: '1',
                    label:
                        '开发建设类采购(招标方式；工程类>=100万，货物类>=50万，服务费>=30万)'
                },
                {
                    value: '2',
                    label:
                        '开发建设类采购(竞价谈判方式：100万>工程类>=20万、50万>货物类>=10万、30万>服务类>=10万)'
                },
                {
                    value: '7',
                    label:
                        '开发建设类采购(零星采购；工程类＜20万、货物类＜10万、服务类＜10万'
                },
                {
                    value: '3',
                    label: '非开发建设类采购(招标方式：估算金额>=30万)'
                },
                {
                    value: '4',
                    label: '非开发建设类采购(竞价谈判方式：30万>估算金额>=10万)'
                },
                {
                    value: '8',
                    label: '非开发建设类采购(零星采购；估算金额＜10万）'
                },
                {
                    value: '5',
                    label: '行政非业务类采购(招标方式：估算金额>=30万)'
                },
                {
                    value: '6',
                    label: '行政非业务类采购(竞价谈判方式：30万>估算金额>=1万)'
                },
                {
                    value: '9',
                    label: '行政非业务类采购(零星采购；估算金额＜1万）'
                }
            ],
            formData: this.resetForm(),
            users: [],
            rules: {
                tenderee: [
                    { required: true, message: '请输入招标人', trigger: 'blur' }
                ],
                linkman: [
                    {
                        required: true,
                        message: '请输入联系人及电话',
                        trigger: 'blur'
                    }
                ],
                projectName: [
                    {
                        required: true,
                        message: '请输入项目名称',
                        trigger: 'blur'
                    }
                ],
                purchaseType: [
                    {
                        required: true,
                        message: '请输入采购业务类别',
                        trigger: 'blur'
                    }
                ],
                bidCondition: [
                    {
                        required: true,
                        message: '请输入招标情况说明',
                        trigger: 'blur'
                    }
                ],
                anomalyConditions: [
                    {
                        required: true,
                        message: '请输入异常情况',
                        trigger: 'blur'
                    }
                ]
            },
            appFlowName: 'motor-bidanomaly_bidanomaly'
        };
    },
    computed: {
        changeConditionsOther() {
            if (this.formData.anomalyConditions.includes('其他')) {
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        resetForm() {
            let formData = {
                tenderee: '',
                linkman: '',
                projectName: '',
                purchaseType:
                    '开发建设类采购(招标方式；工程类>=100万，货物类>=50万，服务费>=30万)',
                bidCondition: '',
                anomalyConditions: []
            };
            return formData;
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/motor-bidanomaly/get/' + this.formId)
                    .then(res => {
                        self.formData = res.data.content;
                    });
            }
        },
        setDataFromParent(data) {
            this.formId = data.id;
            this.getForm();
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = '';
        },
        saveFormValidate(type) {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        async saveForm(params) {
            const $self = this;
            if ($self.createForm_status) {
                if ((await $self.juderCode()) == 'returnDialog') {
                    return false;
                }
            }
            if (!this.formData.anomalyConditions.includes('其他')) {
                this.formData.anomalyConditionOth = '';
            }
            let response = await $self.saveFormData(
                '/api/v1/motor-bidanomaly/save',
                $self.formData
            );
            if (response) {
                $self.formId = response.data.content.id;
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
                            'fromEdit'
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
        submitUpload() {
            this.$refs.upload.submit();
        }
    }
};
</script>
<style lang="scss" scoped>
#AbnormalForm {
    .tableNoBorder {
        width: 100%;
        table-layout: fixed;
        word-break: break-all;
        border-collapse: collapse;
    }
    table td,
    table th {
        border: 1px solid #dbdfe6;
        color: #000;
        height: 35px;
        vertical-align: middle;
        .span1 {
            color: red;
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
.tableNoBorder >>> .el-input--small .el-input__inner {
    border: none;
}
#AbnormalForm >>> .el-form-item__content {
    width: calc(100% - 140px);
}
</style>