<template>
    <el-dialog title="招标文件审批表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="TenderingForm">
            <el-form :model="formData" :rules="rules" label-width="140px" ref="formupdate">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号:">
                            {{formData.number}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="关联采购方案" prop="meetingPlace">
                            <el-select v-model="formData.procurementScheme" value-key="id" placeholder="请选择采购结果">
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
                    <el-col :span="8">
                        <el-form-item label="项目名称" prop="projectName">
                            <el-input v-model="formData.projectName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="招标项目名称" prop="biddingProjectName">
                            <el-input v-model="formData.biddingProjectName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="招标人" prop="tenderee">
                            <el-input v-model="formData.tenderee"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="招标方式" prop="biddingType">
                            <el-radio-group v-model="formData.biddingType">
                                <el-radio key="1" value="1" label="公开招标(有形市场)"></el-radio>
                                <el-radio key="2" value="2" label="公开招标(法定媒体)"></el-radio>
                                <el-radio key="3" value="3" label="公开招标(其他媒体)"></el-radio>
                                <el-radio key="4" value="4" label="邀请招标"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="采购业务类别" style="text-align: left" prop="procurementType">
                            <el-radio-group v-model="formData.procurementType">
                                <div v-for="item in radioOption">
                                    <el-radio
                                            :key="item.value"
                                            :value="item.value"
                                            :label="item.label">
                                    </el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="采购标的类别" prop="purchaseType">
                            <el-radio-group v-model="formData.purchaseType">
                                <el-radio key="1" value="1" label="工程类"></el-radio>
                                <el-radio key="2" value="2" label="货物类"></el-radio>
                                <el-radio key="3" value="3" label="服务类"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="标的简述" prop="bidingSketch">
                            <el-input v-model="formData.bidingSketch"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="签章需求">
                            <el-radio-group v-model="formData.signatureRequirements">
                                <el-radio key="1" value="1" label="公司公章"></el-radio>
                                <el-radio key="2" value="2" label="法定代表签字或法人章"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预计金额(元)" prop="estimatedAmount">
                            <!--<el-input v-model="formData.estimatedAmount"></el-input>-->
                            <format-input separator="," :precision="2" v-model="formData.estimatedAmount" :max="10000000" :min="-10000000" class="w300" empty-value="0" :minus="true"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="招标文件(评审版)附件" prop="biddingDocumentAttachment">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccessDocument" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in formData.biddingDocumentAttachment" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId(item.id, 'biddingDocumentAttachment')"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="经审批的采购方案附件" prop="procurementSchemeAttachment">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccessScheme" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in formData.procurementSchemeAttachment" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId(item.id, 'procurementSchemeAttachment')"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="其他附件">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccessOther" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in formData.otherAttachment" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId(item.id, 'otherAttachment')"></FilesOperate>
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
    import formatInput from '@/components/formatInput'
    export default {
        mixins: [publicMethods],
        name: 'TenderingForm',
        data() {
            return {
                dialogFormVisible: false,
                rules: {
                    projectName: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' }
                    ],
                    biddingProjectName: [
                        { required: true, message: '请输入招标项目名称', trigger: 'blur' }
                    ],
                    tenderee: [
                        { required: true, message: '请输入招标人', trigger: 'blur' }
                    ],
                    biddingType: [
                        { required: true, message: '请输入招标方式', trigger: 'blur' }
                    ],
                    procurementType: [
                        { required: true, message: '请输入采购业务类别', trigger: 'blur' }
                    ],
                    bidingSketch: [
                        { required: true, message: '请输入标的简述', trigger: 'blur' }
                    ],
                    purchaseType: [
                        { required: true, message: '请输入采购标的类别', trigger: 'blur' }
                    ],
                    estimatedAmount: [
                        { required: true, message: '请输入预计金额(元)', trigger: 'blur'},
                        // { type: 'number', message: '年龄必须为数字值'}
                    ],
                    biddingDocumentAttachment: [
                        { required: true, message: '请输入招标文件(评审版)附件', trigger: 'blur' }
                    ],
                    procurementSchemeAttachment: [
                        { required: true, message: '请输入经审批的采购方案附件', trigger: 'blur' }
                    ]
                },
                radioOption: [
                    {
                        value: '1',
                        label: '开发建设类采购(招标方式；工程类>=100万，货物类>=50万，服务费>=30万)'
                    },
                    {
                        value: '3',
                        label: '非开发建设类采购(招标方式：估算金额>=30万)'
                    },
                    {
                        value: '5',
                        label: '行政非业务类采购(招标方式：估算金额>=30万)'
                    }
                ],
                params: {
                    pageNum: 1,
                    status: '04',
                    pageSize: 100000
                },
                issueOption: [],
                formData: this.resetForm(),
                users: [],
                appFlowName: "motor-biddocument_biddocument"
            };
        },
        components: {
            FilesOperate,
            formatInput
        },
        mounted() {
            this.getList();
        },
        methods: {
            async getTableCode() {
                let user = await this.getCommonData("/synergy-common/serialNumber/getByTableCode", { code: 'issuesReported' })
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
            },
            changePeople() {
                this.$forceUpdate()
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
                    procurementScheme: {},
                    projectName: '',
                    biddingProjectName: '',
                    tenderee: '',
                    biddingType: '公开招标(有形市场)',
                    estimatedAmount: '',
                    procurementType: '开发建设类采购(招标方式；工程类>=100万，货物类>=50万，服务费>=30万)',
                    purchaseType: '工程类',
                    bidingSketch: '',
                    signatureRequirements: '公司公章',
                    biddingDocumentAttachment: [],
                    procurementSchemeAttachment: [],
                    otherAttachment: [],
                }
                return formData
            },
            getForm() {
                const self = this;
                if (this.formId != '') {
                    axios
                        .get('/api/v1/motor-biddocument/detail/' + this.formId)
                        .then(res => {
                            self.formData = res.data.content;
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
                let response = await $self.saveFormData(
                    "/api/v1/motor-biddocument/save",
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
            handleSuccessDocument(response, file) {
                const self = this;
                if (response.length > 0) {
                    response.forEach(function(item) {
                        item.attachmentType = 'biddingDocumentAttachment'
                        self.formData.biddingDocumentAttachment.push(item);
                    });
                }
                this.$refs.upload.clearFiles();
            },
            handleSuccessScheme(response, file) {
                const self = this;
                if (response.length > 0) {
                    response.forEach(function(item) {
                        item.attachmentType = 'procurementSchemeAttachment'
                        self.formData.procurementSchemeAttachment.push(item);
                    });
                }
                this.$refs.upload.clearFiles();
            },
            handleSuccessOther(response, file) {
                const self = this;
                if (response.length > 0) {
                    response.forEach(function(item) {
                        item.attachmentType = 'otherAttachment'
                        self.formData.otherAttachment.push(item);
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
    #TenderingForm {
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
    #TenderingForm >>> .el-form-item__content{
        width: calc(100% - 140px);
    }
</style>