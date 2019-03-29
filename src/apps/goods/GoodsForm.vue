<template>
    <el-dialog title="物品信息表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="GoodsForm">
            <el-form :model="formData" label-width="100px" :rules="rules" ref="formupdate">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="物品类型">
                            <el-select v-model="formData.supplyType" placeholder="请选择" @change="typeChange">
                                <el-option v-for="(item,index) in operations" :key="index" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="流水号">
                            <el-input v-model="formData.no"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="申请人">
                            <el-input v-model="formData.applyUser"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属部门">
                            <el-input v-model="formData.dept"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请时间">
                            <el-date-picker v-model="formData.applyTime" type="datetime" placeholder="选择日期" style="width:100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="申请事由">
                            <el-input type="textarea" :autosize="{minRows: 5}" v-model="formData.reason"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="物品信息">
                            <div style="float: right;">
                                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem()" style="margin-right: 5px;"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem()"></el-button>
                            </div>
                            <el-table ref="table" :data="formData.supplies" border style="width: 100%; margin-top: 5px;" @selection-change="handleSelectionChange">
                                <el-table-column type="selection"></el-table-column>
                                <el-table-column prop="supplyName" label="物品名">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.supplyName"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="specification" label="规格/型号">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.specification"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="applyNumber" label="申请数量">
                                    <template slot-scope="scope">
                                        <el-input v-model.number="scope.row.applyNumber" type="number" @mousewheel.native.prevent></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="employYear" label="使用年限">
                                    <template slot-scope="scope">
                                        <el-input v-model.number="scope.row.employYear" type="number" @mousewheel.native.prevent></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="supplyNo" label="物品编号">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.supplyNo"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件">
                            <!-- <FilesOperate :options="{uploadCommpoent:true,attachmentsList:rows.attachments}"></FilesOperate> -->
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachment"></FilesOperate>
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
import moment from 'moment';
import FilesOperate from '../FilesOperate';
import cookies from 'js-cookie';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'GoodsForm',
    data() {
        return {
            dialogFormVisible: false,
            formData: this.resetForm(),
            selecttabledata: [],
            operations: ['固定资产', '非固定资产'],
            users: [],
            appFlowName: 'motor-trainingapplication_train',
            rules: {
                /** 
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
                trainingPrograms: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入培训/学习(项目)'
                    }
                ],
                trainingContent: [
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
                */
            }
        };
    },
    watch: {
        //'formData.lowercase'(val) {
        // this.formData.upper = val ? this.convertCurrency(val) : "";
        // }
    },
    components: {
        FilesOperate
    },
    methods: {
        typeChange(val) {
            console.log(val);
            this.formData.supplyCode = val == '固定资产' ? 'fixed' : 'unfixed';
        },
        handleSelectionChange(val) {
            console.log(val);
            this.selecttabledata = val;
        },
        addItem() {
            this.formData.supplies.push({
                id: '',
                supplyName: '',
                specification: '',
                applyNumber: '',
                employYear: '',
                supplyNo: '',
                add: 'add' + this.formData.supplies.length
            });
        },
        deleteItem() {
            const self = this;
            let addItem = this.selecttabledata.filter(item => item.id == '');
            let exitsItem = this.selecttabledata.filter(item => item.id != '');
            console.log(addItem);
            console.log(exitsItem);
            addItem.forEach(function(item) {
                for (var i = 0; i < self.formData.supplies.length; i++) {
                    if (item.add == self.formData.supplies[i].add) {
                        self.formData.supplies.splice(i, 1);
                    }
                }
            });
            if (exitsItem.length > 0) {
                exitsItem.forEach(function(item) {
                    for (var i = 0; i < self.formData.supplies.length; i++) {
                        if (item.id == self.formData.supplies[i].id) {
                            self.formData.supplies.splice(i, 1);
                        }
                    }
                });
            }
        },
        async setDataFromParent(data) {
            let $self = this;
            // this.formData = data;
            $self.url = '/api/v1/motor-receive/get/' + data.id;
            let response = await $self.getDetails();
            if (response) {
                $self.formData = response.data.content;
                $self.formId = $self.formData.id;
                $self.dialogFormVisible = true;
                $self.createForm_status = false;
            } else {
                $self.msgTips('获取表单失败', 'warning');
            }
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
        },
        resetForm() {
            let formData = {
                applyUser: cookies.get('uname'),
                no: '',
                dept: cookies.get('oname'),
                applyTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                supplyType: '',
                reason: '',
                supplyCode: '',
                supplies: [
                    {
                        id: '',
                        supplyName: '',
                        specification: '',
                        applyNumber: '',
                        employYear: '',
                        supplyNo: '',
                        add: 'add'
                    }
                ],
                attachments: []
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
            let supplyarray = [];
            $self.formData.supplies.forEach(function(item) {
                supplyarray.push({
                    supplyName: item.supplyName,
                    specification: item.specification,
                    applyNumber: item.applyNumber,
                    employYear: item.employYear,
                    supplyNo: item.supplyNo
                });
            });
            $self.formData.supplies = supplyarray;

            let response = await $self.saveFormData(
                this.createForm_status
                    ? '/api/v1/motor-receive/save'
                    : '/api/v1/motor-receive/update',
                $self.formData
            );
            if (response) {
                $self.formId = response.data.content;
                $self.dialogFormVisible = false;
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
                        await $self.startSignal(actions.data.types[0]);
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
                    $self.msgTips($self, '提交失败', 'warning');
                } else {
                    $self.msgTips($self, '保存失败', 'warning');
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
    },
    mounted() {}
};
</script>
<style lang="scss" scoped>
#GoodsForm {
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
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }
    input[type='number'] {
        -moz-appearance: textfield;
    }
}
</style>