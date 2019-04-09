<template>
    <el-dialog title="供应商引入审批表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="SupplierForm">
        <el-form :model="formData"  :rules="rules" label-width="140px" ref="formData">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="推荐部门/个人" prop="number">
                        <el-input v-model="formData.number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商名称" prop="branchlineTo">
                        <el-input v-model="formData.number"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="供应商来源" prop="creatorName">
                        <el-radio-group v-model="formData.radio">
                            <el-radio key="1" value="1" label="采购主责部门推荐/股东方供应商库项目引入模式"></el-radio>
                            <el-radio key="2" value="2" label="常规引入"></el-radio>
                            <el-radio key="3" value="3" label="批量引入股东方供应商资源或/“战略合作”关系（级别）股东方供应商资源"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="推荐参与项目" prop="applyDepartment">
                        <el-input v-model="formData.applyDepartment" placeholder="请输入拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="推荐参与采购项目" prop="timeApplication">
                        <el-input v-model="formData.applyDepartment" placeholder="请输入拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商所在地" prop="topicName">
                        <el-input v-model="formData.topicName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="供应商来源" prop="creatorName">
                        <el-checkbox>承包商</el-checkbox>
                        <el-checkbox>制造商</el-checkbox>
                        <el-checkbox>代理商</el-checkbox>
                        <el-checkbox>经销商</el-checkbox>
                        <el-checkbox>服务商</el-checkbox>
                        <el-checkbox>其他</el-checkbox>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="联系人" prop="applyDepartment">
                        <el-input v-model="formData.applyDepartment" placeholder="请输入拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否有授权" prop="timeApplication">
                        <el-input v-model="formData.applyDepartment" placeholder="请输入拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式" prop="topicName">
                        <el-input v-model="formData.topicName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="主营行业" prop="applyDepartment">
                        <el-input v-model="formData.applyDepartment" placeholder="请输入拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主力产品/业务" prop="timeApplication">
                        <el-input v-model="formData.applyDepartment" placeholder="请输入拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主营品牌" prop="topicName">
                        <el-input v-model="formData.topicName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="供应商基本情况" prop="applyDepartment">
                        <el-input v-model="formData.applyDepartment" placeholder="请输入拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="考察评估情况" prop="timeApplication">
                        <el-input v-model="formData.applyDepartment" placeholder="请输入拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="推荐意见" prop="topicName">
                        <el-input v-model="formData.topicName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="供应商入库申请表附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="考察报告附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
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
            SupplierOption: [
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
        this.getSupplierUser()
    },
    watch: {
        'formData.lowercase'(val) {

            this.formData.upper = val ? this.convertCurrency(val) : "";
        }
    },
    methods: {
        async getSupplierUser() {
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