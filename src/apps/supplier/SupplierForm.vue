<template>
    <el-dialog title="供应商引入审批表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="SupplierForm">
        <el-form :model="formData"  :rules="rules" label-width="140px" ref="formData">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="推荐时间" prop="recommendTime">
                        <el-date-picker value-format="yyyy-MM-dd" v-model="formData.recommendTime" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="推荐部门/个人" prop="recommendDept">
                        <el-input v-model="formData.recommendDept"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商名称" prop="supplierName">
                        <el-input v-model="formData.supplierName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="供应商来源" prop="supplierSource">
                        <el-radio-group v-model="formData.supplierSource">
                            <el-radio key="1" label="1">采购主责部门推荐/股东方供应商库项目引入模式</el-radio>
                            <el-radio key="2" label="2">常规引入</el-radio>
                            <el-radio key="3" label="3">批量引入股东方供应商资源或/“战略合作”关系（级别）股东方供应商资源</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="推荐参与项目" prop="recommendProject">
                        <el-input v-model="formData.recommendProject" placeholder="请输入推荐参与项目"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="推荐参与采购项目" prop="recommendPurProject">
                        <el-input v-model="formData.recommendPurProject" placeholder="请输入推荐参与采购项目"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商所在地" prop="supplieLocation">
                        <el-input v-model="formData.supplieLocation"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="经营模式" prop="businessModels">
                        <el-checkbox-group v-model="formData.businessModels">
                            <el-checkbox label="承包商">承包商</el-checkbox>
                            <el-checkbox label="制造商">制造商</el-checkbox>
                            <el-checkbox label="代理商">代理商</el-checkbox>
                            <el-checkbox label="经销商">经销商</el-checkbox>
                            <el-checkbox label="服务商">服务商</el-checkbox>
                            <el-checkbox label="其他">其他</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="formData.businessModelOth"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="联系人" prop="linkman">
                        <el-input v-model="formData.linkman" placeholder="请输入联系人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否有授权" prop="accreditSign">
                        <el-select v-model="formData.accreditSign">
                            <el-option key="1" label="是" value="是"></el-option>
                            <el-option key="2" label="否" value="否"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式" prop="contactWay">
                        <el-input v-model="formData.contactWay" placeholder="请输入联系方式"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="主营行业" prop="mainTrade">
                        <el-input v-model="formData.mainTrade" placeholder="请输入主营行业"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主力产品/业务" prop="mainProduct">
                        <el-input v-model="formData.mainProduct" placeholder="请输入主力产品/业务"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主营品牌" prop="mainBrand">
                        <el-input v-model="formData.mainBrand" placeholder="请输入主营品牌"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="供应商基本情况" prop="supplierBasic">
                        <el-input v-model="formData.supplierBasic" placeholder="请输入供应商基本情况"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="考察评估情况" prop="inspectSituation">
                        <el-input v-model="formData.inspectSituation" placeholder="请输入考察评估情况"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="推荐意见" prop="recommendations">
                        <el-input v-model="formData.recommendations" placeholder="请输入推荐意见"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="供应商入库申请表附件" prop="attachmentsSto">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccessSto" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachmentsSto" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="考察报告附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccessIns" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachmentsIns" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
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
import FilesOperate from '../FilesOperate';
import { application } from "../application.js";
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: 'SupplierForm',
    data() {
        return {
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            rules: {
                recommendDept: [
                    { required: true, message: '请输入推荐部门/个人', trigger: 'blur' }
                ],
                supplierName: [
                    { required: true, message: '请输入供应商名称', trigger: 'blur' }
                ],
                supplierSource: [
                    { required: true, message: '请输入供应商来源', trigger: 'blur' }
                ],
                attachmentsSto: [
                    { required: true, message: '请输入供应商入库申请表附件', trigger: 'blur' }
                ]
            },
            appFlowName:'motor-supplier_supplier'
        };
    },
    components: {
        FilesOperate
    },
    methods: {
        changePeople() {
            this.$forceUpdate()
        },
        resetForm() {
            let formData =  {
                recommendTime: '',
                recommendDept: '',
                supplierName: '',
                supplierSource: '1',
                recommendProject: '',
                recommendPurProject: '',
                supplieLocation: '',
                businessModels: [],
                businessModelOth: '',
                linkman: '',
                accreditSign: '',
                contactWay: '',
                mainTrade: '',
                mainProduct: '',
                mainBrand: '',
                supplierBasic: '',
                inspectSituation: '',
                recommendations: '',
                attachmentsSto: [],
                attachmentsIns: []
            }
            return formData
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/motor-supplier/get/' + this.formId)
                    .then(res => {
                        self.formData = res.data.content;
                    })
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
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        async saveForm(params) {
            const $self = this;
            let response = await $self.saveFormData(
                "/api/v1/motor-supplier/save",
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
        handleSuccessSto(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.formData.attachmentsSto.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        handleSuccessIns(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.formData.attachmentsIns.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        submitUpload() {
            this.$refs.upload.submit();
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
        }
    }
};
</script>
<style lang="scss" scoped>
#SupplierForm {
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
    #SupplierForm >>> .el-form-item__content{
        width: calc(100% - 140px);
    }
</style>