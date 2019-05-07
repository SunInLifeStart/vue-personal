<template>
    <el-dialog title="采购结果审批表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="ResultsForm">
        <el-form :model="formData"  :rules="rules" label-width="140px" ref="formData">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="流水号:" prop="number">
                        {{formData.number}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目名称" prop="projectName">
                        <el-input v-model="formData.projectName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="采购项目名称" prop="projectName">
                        <el-input v-model="formData.purchaseProjectName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="关联采购方案" prop="procschemeNo">
                        <el-select v-model="formData.procschemeNos" value-key="id" placeholder="请选择采购方案">
                            <el-option
                                    v-for="item in issueOption"
                                    :key="item.id"
                                    :label="item.number"
                                    :value="{id: item.id, number: item.number}">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="关联招标文件" prop="biddocumentNo">
                        <el-select v-model="formData.biddocumentNos" value-key="id" placeholder="请选择招标文件">
                            <el-option
                                    v-for="item in biddocumentOption"
                                    :key="item.id"
                                    :label="item.number"
                                    :value="{id: item.id, number: item.number}">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="22">
                    <el-form-item label="采购方式" prop="purchaseWay">
                        <el-radio-group v-model="formData.purchaseWay">
                            <el-radio key="1" value="1" label="公开招标"></el-radio>
                            <el-radio key="2" value="2" label="邀请招标"></el-radio>
                            <el-radio key="3" value="3" label="竞价谈判"></el-radio>
                            <el-radio key="4" value="4" label="直接委托"></el-radio>
                            <el-radio key="5" value="5" label="零星采购"></el-radio>
                            <el-radio key="6" value="6" label="其他"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="formData.purchaseOther"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="目标成本/预算完成情况" prop="budgetPerformance">
                        <el-input v-model="formData.budgetPerformance" placeholder="请输入目标成本/预算完成情况"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="采购起止时间" prop="proTime">
                        <el-date-picker
                                v-model="formData.proTime"
                                type="daterange"
                                range-separator="至"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="采购业务类别" prop="proType" style="text-align: left">
                            <el-radio-group v-model="formData.proType">
                                <div v-for="item in radioOption">
                                    <el-radio
                                            :key="item.value"
                                            :label="item.value">
                                        {{item.label}}
                                    </el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="采购内容摘要" prop="proContent">
                        <el-input v-model="formData.proContent"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="采购过程简述" prop="proProcess">
                        <el-input v-model="formData.proProcess"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="采购结果" prop="proResult">
                        <el-input v-model="formData.proResult"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="采购结果是否是规定情形" prop="proResultYes">
                        <el-radio-group v-model="formData.proResultYes">
                            <el-radio key="1" label="1">是</el-radio>
                            <el-radio key="2" label="2">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="签章需求" prop="signDemand">
                        <el-radio-group v-model="formData.signDemand">
                            <el-radio key="1" value="1" label="无"></el-radio>
                            <el-radio key="2" value="2" label="中标通知书加盖公章"></el-radio>
                            <el-radio key="3" value="3" label="中标通知书法人代表签字或盖法人章"></el-radio>
                            <el-radio key="4" value="4" label="其他"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="formData.signDemandOth"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="经审批采购方案的附审资料">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccessAnno" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachmentsAnno" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId(item.id, 'attachmentsAnno')"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="采购报告(评标报告)的附审资料">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccessRep" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachmentsRep" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId(item.id, 'attachmentsRep')"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="招标采购管理委员会会议纪要附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="uploadMan" action="/api/v1/files/upload" :on-success="handleSuccessMan" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachmentsMan" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId(item.id, 'attachmentsMan')"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="其他">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccessOth" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachmentsOth" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId(item.id, 'attachmentsOth')"></FilesOperate>
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
import axios from 'axios';
import moment from 'moment';
import FilesOperate from '../FilesOperate';
import { application } from "../application.js";
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: 'ResultsForm',
    data() {
        return {
            dialogTitle:"",
            dialogSelectCode:false,
            currentRoles:[],
            branchCode:"",
            dialogFormVisible: false,
            personOptions: [],
            formData: this.resetForm(),
            users: [],
            params: {
                pageNum: 1,
                status: '04',
                pageSize: 100000
            },
            rules: {
                number: [
                    { required: true, message: '请输入流水单号', trigger: 'blur' }
                ],
                projectName: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
                purchaseWay: [
                    { required: true, message: '请输入采购方式', trigger: 'blur' }
                ],
                budgetPerformance: [
                    { required: true, message: '请输入目标成本/预算完成情况', trigger: 'blur' }
                ],
                proTime: [
                    { required: true, message: '请输入采购起止时间', trigger: 'blur' }
                ],
                proContent: [
                    { required: true, message: '请输入采购内容摘要', trigger: 'blur' }
                ],
                proProcess: [
                    { required: true, message: '请输入采购过程简述', trigger: 'blur' }
                ],
                proResultYes: [
                    { required: true, message: '请输入采购结果是否是规定情形', trigger: 'blur' }
                ],
                proResult: [
                    { required: true, message: '请输入采购结果', trigger: 'blur' }
                ],
                signDemand: [
                    { required: true, message: '请输入签章需求', trigger: 'blur' }
                ],
                proType: [
                    { required: true, message: '请输入采购业务类别', trigger: 'blur' }
                ]
            },
            issueOption: [],
            biddocumentOption: [],
            radioOption: [
                {
                    value: '1',
                    label: '开发建设类采购(招标方式；工程类>=100万，货物类>=50万，服务费>=30万)'
                },
                {
                    value: '2',
                    label: '开发建设类采购(竞价谈判方式：100万>工程类>=20万、50万>货物类>=10万、30万>服务类>=10万)'
                },
                {
                    value: '7',
                    label: '开发建设类采购(零星采购；工程类＜20万、货物类＜10万、服务类＜10万'
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
            appFlowName:'motor-procresult_procresult'
        };
    },
    components: {
        FilesOperate
    },
    mounted() {
        this.getList()
        // this.getSchemeNos()
    },
    methods: {
        // async getSchemeNos() {
        //     const $self = this;
        //     $self.url = "/api/v1/motor-procresult/query";
        //     let response = await $self.getQueryList();
        //     if (response) {
        //         $self.issueOption = response.data.content.list;
        //     } else {
        //         $self.msgTips("获取列表失败", "warning");
        //     }
        // },
        async getTableCode() {
            let user = await this.getCommonData("/synergy-common/serialNumber/getByTableCode", { code: 'motor-procresult' })
            if (user) this.formData.number = user.data.content.serialNumber
        },
        async getList() {
            const $self = this;
            $self.url = "/api/v1/motor-procscheme/query";
            let response = await $self.getQueryList();
            if (response) {
                $self.issueOption = response.data.content.list;
            } else {
                $self.msgTips("获取列表失败", "warning");
            }
            $self.url = "/api/v1/motor-biddocument/queryList";
            let re = await $self.getQueryList();
            if (re) {
                $self.biddocumentOption = re.data.content.list;
            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },
        changePeople() {
            this.$forceUpdate()
        },
        handleSuccessMan(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.formData.attachmentsMan.push(item);
                });
            }
            this.$refs.uploadMan.clearFiles();
        },
        getId(id, type) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.formData[type].forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/board_meeting_forms/deleteAtt/' + id)
                            .then(res => {
                                self.formData[type].splice(index, 1);
                            });
                        self.formData[type].splice(index, 1);
                    }
                });
            });
        },
        resetForm() {
            let formData =  {
                number: '',
                projectName: '',
                procschemeNos: {},
                biddocumentNos: {},
                purchaseWay: '公开招标',
                purchaseOther: '',
                budgetPerformance: '',
                proTime: [],
                proType: '1',
                proTimeStart: '',
                proTimeEnd: '',
                proContent: '',
                proProcess: '',
                proResult: '',
                proResultYes: '1',
                signDemand: '无',
                signDemandOth: '',
                attachmentsAnno: [],
                attachmentsRep: [],
                attachmentsMan: [],
                attachmentsOth: []
            }
            return formData
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/motor-procresult/get/' + this.formId)
                    .then(res => {
                        self.formData = res.data.content;
                        self.formData.proTime = [self.formData.proTimeStart, self.formData.proTimeEnd]
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
            this.branchCode = "";
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
            if($self.createForm_status){
                if(await $self.juderCode() == "returnDialog"){
                    return false;
                }
            }
            if (this.formData.proTime.length > 0) {
                this.formData.proTimeStart = this.formData.proTime[0]
                this.formData.proTimeEnd = this.formData.proTime[1]
            }
            let response = await $self.saveFormData(
                "/api/v1/motor-procresult/save",
                $self.formData
            );
            if (response) {
                $self.formId = response.data.content.id;
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
                        await $self.startSignal(actions.data.types[0],"fromEdit");
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
        handleSuccessAnno(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    item.attachmentType = 'attachmentsAnno'
                    self.formData.attachmentsAnno.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        handleSuccessRep(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    item.attachmentType = 'attachmentsRep'
                    self.formData.attachmentsRep.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        handleSuccessOth(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    item.attachmentType = 'attachmentsOth'
                    self.formData.attachmentsOth.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        submitUpload() {
            this.$refs.upload.submit();
        }
    }
};
</script>
<style lang="scss" scoped>
#ResultsForm {
    .el-select {
        width: 100%;
    }
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
    #ResultsForm >>> .el-form-item__content{
        width: calc(100% - 140px);
    }
</style>