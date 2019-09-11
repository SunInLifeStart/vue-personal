<template>
    <el-dialog title="督办管理" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="InspectForm">
            <el-form ref="formData" :model="formData" label-width="130px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="标题:">
                            <el-input v-model="formData.title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="立项人:">
                            <el-input v-model="formData.definer" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="立项单位:">
                            <el-input v-model="formData.definerUnit" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="被督办部门负责人:">
                            <el-select v-model="formData.inspector" filterable placeholder="请选择" style="width:100%">
                                <el-option v-for="item in inspectors" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="截至日期:">
                            <el-date-picker style="width:100%" type="date" v-model="formData.deadline" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备注:">
                            <el-input v-model="formData.remark"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="督办类型:">
                            <el-radio-group v-model="formData.lamp">
                                <el-radio label="红灯"></el-radio>
                                <el-radio label="黄灯"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="内容:">
                            <el-input type="textarea" :autosize="{minRows: 5}" placeholder="请输入内容" v-model="formData.content"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :multiple="true" :show-file-list="false" accept="" :auto-upload="true" :with-credentials="true">
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
            <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import cookies from 'js-cookie';
import FilesOperate from '../FilesOperate';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'InspectForm',
    data() {
        return {
            // createForm_status :false,
            attType: '',
            // formData: {
            //   title: "",
            //   definer: cookies.get("uname"),
            //   definerUnit: cookies.get("oname"),
            //   inspector: "",
            //   deadline: "",
            //   frequency: "",
            //   remark: "",
            //   content: "",
            //   attachments: []
            // },
            dialogTitle: '',
            dialogSelectCode: false,
            currentRoles: [],
            branchCode: '',
            inspectors: [],
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            options: [],
            value: '',
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            appFlowName: 'inspect-form_inspect',
            rules: {
                submitter: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入申请人'
                    }
                ],
                department: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入所属部门'
                    }
                ],
                isAnnualPlan: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '年度计划'
                    }
                ],

                committed: [
                    {
                        required: false, //是否必填
                        message: '请选择提单时间',
                        trigger: 'blur'
                    }
                ],
                InspectingPrograms: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入培训/学习(项目)'
                    }
                ],
                InspectingContent: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入培训/学习(目的内容)'
                    }
                ],
                participant: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入培训/学习(参加人员)'
                    }
                ],
                schedule: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入日程安排'
                    }
                ],
                consts: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入费用预算'
                    }
                ],
                processId: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入是否资金计划内'
                    }
                ],
                suggestion: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入审批意见'
                    }
                ],
                draftTime: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请选择培训时间'
                    }
                ],
                writer: [
                    {
                        required: true, //是否必填
                        trigger: 'change', //何事件触发
                        message: '请选择记录人'
                    }
                ]
            }
        };
    },
    components: {
        FilesOperate
    },
    methods: {
        setDataFromParent(data) {
            this.formData = data;
            this.formData.inspector = parseInt(this.formData.inspector);
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = '';
        },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.formData.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/inspect_forms/attachment/' + id)
                            .then(res => {
                                self.formData.attachments.splice(index, 1);
                            });
                        // self.formData.attachments.splice(index, 1);
                    }
                });
            });
        },
        resetForm() {
            let formData = {
                title: '',
                definer: cookies.get('uname'),
                definerUnit: cookies.get('oname'),
                inspector: '',
                deadline: '',
                frequency: '',
                lamp: '红灯',
                remark: '',
                content: '',
                attachments: []
            };
            return formData;
        },
        saveFormValidate(type) {
            this.$refs['formData'].validate(valid => {
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
            let response = await $self.saveFormData(
                '/api/v1/inspect_forms/save',
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
                        //  $self.$emit("subOk");
                    }
                } else {
                    $self.msgTips('保存成功', 'success');
                    if (this.createForm_status) {
                        $self.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                    } else {
                        $self.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                    }
                    // $self.$emit("saveOk");
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
            // this.$refs.upload.clearFiles();
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {},
        getInspector() {
            const self = this;
            let type = this.$store.getters.LoginData.code.split('_')[0];
            axios
                .get(`/api/v1/users/role/${type}_deptManager`)
                .then(res => {
                    self.inspectors = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    },
    mounted() {
        this.getInspector();
    }
};
</script>
<style lang="scss" scoped>
#InspectForm {
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
    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }
}
</style>