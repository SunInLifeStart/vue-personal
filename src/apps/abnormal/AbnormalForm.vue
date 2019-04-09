<template>
    <el-dialog title="招标异常事项申报表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="AbnormalForm">
        <el-form :model="formData"  :rules="rules" label-width="140px" ref="formData">
            <!--<el-row>-->
                <!--<el-col :span="8">-->
                    <!--<el-form-item label="流水号:" prop="number">-->
                        <!--<el-input v-model="formData.number"></el-input>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
            <!--</el-row>-->
            <el-row>
                <el-col :span="8">
                    <el-form-item label="招标人" prop="creatorName">
                        <el-input v-model="formData.creatorName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系人及电话">
                        <el-input v-model="formData.organName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目名称" prop="committed">
                        <el-input v-model="formData.organName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="采购业务类别" style="text-align: left">
                            <el-radio-group v-model="formData.radio">
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
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="招标情况说明" prop="applyDepartment">
                        <el-input v-model="formData.applyDepartment"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="22">
                    <el-form-item label="异常情况" prop="topicName">
                        <el-checkbox>投标报价均超上限的；</el-checkbox>
                        <el-checkbox>投标有效单位不足的；</el-checkbox>
                        <el-checkbox>存在围标串标行为或重大嫌疑的；</el-checkbox>
                        <el-checkbox>不按评标原则定标的；</el-checkbox>
                        <el-checkbox>排序第一的投标人弃标；</el-checkbox>
                        <el-checkbox>排序第一的投标人实施有重大风险的，且对方不承诺弃标将其废标的。</el-checkbox>
                        <el-checkbox>其他</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="formData.organName"></el-input>
                </el-col>
            </el-row>
            <!--<el-row>-->
                <!--<el-col :span="24">-->
                    <!--<el-form-item label="会议材料及附件">-->
                        <!--<el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">-->
                            <!--<i class="el-icon-plus"></i>-->
                        <!--</el-upload>-->
                        <!--<div v-for="item in formData.attachments" :key="item.id" style="float:left">-->
                            <!--<FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>-->
                        <!--</div>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
            <!--</el-row>-->
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
    name: 'AbnormalForm',
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
            AbnormalOption: [
                {
                    value: 'general',
                    label: '总办会'
                },
                {
                    value: 'chairman',
                    label: '党支委会'
                }
            ],
            personOptions: [],
            formData: this.resetForm(),
            users: [],
            rules: {
                number: [
                    { required: true, message: '请输入流水单号', trigger: 'blur' }
                ],
                branchlineTo: [
                    { required: true, message: '请输入会议类型', trigger: 'blur' }
                ],
                committed: [
                    { required: true, message: '请输入提单时间', trigger: 'blur' }
                ],
                // creatorName: [
                //     { required: true, message: '请输入活动名称', trigger: 'blur' }
                // ],
                // organName: [
                //     { required: true, message: '请输入活动名称', trigger: 'blur' }
                // ],
                // applyDepartment: [
                //     { required: true, message: '请输入活动名称', trigger: 'blur' }
                // ],
                // timeApplication: [
                //     { required: true, message: '请输入活动名称', trigger: 'blur' }
                // ],
                // topicName: [
                //     { required: true, message: '请输入活动名称', trigger: 'blur' }
                // ]
            },
            uploadId: 0,
            appFlowName:'motor-issuesreported_party-agendasheet'
        };
    },
    components: {
        FilesOperate
    },
    mounted() {
        this.getAbnormalUser()
    },
    watch: {
        'formData.lowercase'(val) {

            this.formData.upper = val ? this.convertCurrency(val) : "";
        }
    },
    methods: {
        async getAbnormalUser() {
            let user = await this.getUsers("/api/v1/users")
            if (user) this.personOptions = user.data
        },
        changePeople() {
            this.$forceUpdate()
        },
        deleteItem(item, index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (type == 'message' && this.formData.attendingDepartment.length > 1) {
                    this.formData.attendingDepartment.splice(index, 1);
                } else if (type == 'personal' && this.formData.requestedItems.length > 1) {
                    this.formData.requestedItems.splice(index, 1);
                } else {
                    this.$message({
                        message: '最后一组不能删除',
                        type: 'error'
                    });
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
                sendMessage: [],
                branchlineTo: "",
                numbers: '',
                created: '',
                business: '',
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
                                for (let i = 0; i<item.people.length; i++) {
                                    item.people[i] = parseInt(item.people[i])
                                }
                            })
                        }
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
            this.formData.sendMessage = []
            $self.formData.attendingDepartment.forEach(item => {
                if (item.people) {
                    item.person = item.people.join(',')
                }
                this.formData.sendMessage = this.formData.sendMessage.concat(item.people)
            })
            this.formData.sendMessage = this.formData.sendMessage.join(',')
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
#AbnormalForm {
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
    #AbnormalForm >>> .el-form-item__content{
        width: calc(100% - 140px);
    }
</style>