<template>
    <el-dialog title="会议申请" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="80%" style="text-align: center;">
        <div id="ApplyMeetingForm">
            <el-form :model="formData" :rules="rules" label-width="140px" ref="formData">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号:">
                            {{formData.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="会议类型" prop="branchlineTo">
                            <el-select v-model="formData.branchlineTo" @change="meetingDisscuion" placeholder="请选择会议类型">
                                <el-option v-for="item in discussionOption" :key="item.value" :disabled="item.disabled" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="会议地点" prop="meetingPlace">
                            <el-input v-model="formData.meetingPlace" placeholder="请输入会议地点"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="formData.branchlineTo === 'gmoMeeting' || formData.branchlineTo === 'partyMeeting'">
                    <el-col :span="24">
                        <el-form-item label="关联议题" prop="meetingPlace">
                            <el-select v-model="formData.discussionContent" multiple value-key="discussionId" placeholder="请选择议题">
                                <el-option v-for="item in issueOption" :key="item.id" :label="item.topicName" :value="{discussionId: item.id, discussionName: item.topicName}">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="提单人" prop="creatorName">
                            <el-input v-model="formData.creatorName" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属部门">
                            <el-input v-model="formData.organName" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="提单时间" prop="committed">
                            <el-date-picker v-model="formData.committed" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="datetime" :disabled="true">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="开会时间" prop="meetingTime">
                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formData.meetingTime" style="width:100%" type="datetime">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="结束时间" prop="endTime">
                            <el-date-picker v-model="formData.endTime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="datetime">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="会议名称" prop="conferenceTitle">
                            <el-input v-model="formData.conferenceTitle"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <table class="tableNoBorder">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="会议讨论事项" prop="content">
                                <tr v-for="(item,index) in formData.requestedItems" :key="index" @contextmenu.prevent="deleteItem(item,index,'personal')">
                                    <td colspan="8" style="width: 20%;">
                                        <el-input v-model="item.content" placeholder="请输入提请事项"></el-input>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="8" style="height: 30px;">
                                        <span @click="addItem('personal')">
                                            <i class="el-icon-circle-plus-outline"></i> 插入</span>
                                    </td>
                                </tr>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="参会人员" prop="attendingDepartment">
                                <tr v-for="(item,index) in formData.attendingDepartment" :key="index" @contextmenu.prevent="deleteItem(item,index,'message')">
                                    <td colspan="4" style="width: 21%;">
                                        <!--<el-select v-model="item.department" placeholder="请输入参会部门" @change="changeDepartment(item, index)">-->
                                        <!--<el-option v-for="i in options"-->
                                        <!--:key="i.id"-->
                                        <!--:label="i.name"-->
                                        <!--:value="i.id">-->
                                        <!--&lt;!&ndash;:value="{value:i.value, label: i.label}">&ndash;&gt;-->
                                        <!--</el-option>-->
                                        <!--</el-select>-->
                                        <el-cascader @change="changePersonOptions(item)" :show-all-levels="false" :props="props" :options="options" v-model="item.department"></el-cascader>
                                    </td>
                                    <td colspan="4">
                                        <el-select filterable style="width: 100%" v-model="item.people" multiple @change="changePeople" placeholder="请选择人员">
                                            <el-option v-for="i in item.personOptions" :key="i.id" :label="i.name" :value="i.id">
                                            </el-option>
                                        </el-select>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="8" style="height: 30px;">
                                        <span @click="addItem('message')">
                                            <i class="el-icon-circle-plus-outline"></i> 插入</span>
                                    </td>
                                </tr>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="列席人员" prop="phone">
                                <tr v-for="(item,index) in formData.sitIn" :key="index" @contextmenu.prevent="deleteItem(item,index,'sitIn')">
                                    <td colspan="4" style="width: 21%;">
                                        <!--<el-select v-model="item.department" placeholder="请输入列席部门" @change="changeSitIn(item, index)">-->
                                        <!--<el-option v-for="i in options"-->
                                        <!--:key="i.id"-->
                                        <!--:label="i.name"-->
                                        <!--:value="i.id">-->
                                        <!--&lt;!&ndash;:value="{value:i.value, label: i.label}">&ndash;&gt;-->
                                        <!--</el-option>-->
                                        <!--</el-select>-->
                                        <el-cascader @change="changePersonOptions(item)" :show-all-levels="false" :props="props" :options="options" v-model="item.department"></el-cascader>
                                    </td>
                                    <td colspan="4">
                                        <el-select filterable style="width: 100%" v-model="item.people" multiple @change="changePeople" placeholder="请选择人员">
                                            <el-option v-for="i in item.personOptions" :key="i.id" :label="i.name" :value="i.id">
                                                {{i.name}}
                                            </el-option>
                                        </el-select>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="8" style="height: 30px;">
                                        <span @click="addItem('sitIn')">
                                            <i class="el-icon-circle-plus-outline"></i> 插入</span>
                                    </td>
                                </tr>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </table>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="会议材料及附件">
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
import FilesOperate from '../FilesOperate';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'ApplyMeetingForm',
    data() {
        return {
            dialogTitle: '',
            dialogSelectCode: false,
            currentRoles: [],
            branchCode: '',
            dialogFormVisible: false,
            props: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            discussionOption: [
                {
                    value: 'specMeeting',
                    label: '专题会'
                },
                {
                    value: 'communMeeting',
                    label: '班子沟通会'
                },
                {
                    value: 'gmoMeeting',
                    label: '总办会'
                },
                {
                    value: 'partyMeeting',
                    label: '党支委会'
                },
                {
                    value: 'recruMeeting',
                    disabled: true,
                    label: '招采委员会'
                }
            ],
            options: [],
            issueOption: [],
            rules: {
                endTime: [
                    {
                        required: true,
                        message: '请输入结束时间',
                        trigger: 'blur'
                    }
                ],
                branchlineTo: [
                    {
                        required: true,
                        message: '请输入会议类型',
                        trigger: 'blur'
                    }
                ],
                committed: [
                    {
                        required: true,
                        message: '请输入提单时间',
                        trigger: 'blur'
                    }
                ],
                meetingTime: [
                    {
                        required: true,
                        message: '请输入开会时间',
                        trigger: 'blur'
                    }
                ],
                meetingPlace: [
                    {
                        required: true,
                        message: '请输入会议地点',
                        trigger: 'blur'
                    }
                ],
                attendingDepartment: [
                    {
                        required: true,
                        message: '请选择参会人员',
                        trigger: 'blur'
                    }
                ]
            },
            personOptions: [],
            url: '',
            params: {
                pageNum: 1,
                status: '04',
                pageSize: 10000
            },
            dataOptions: [],
            formData: this.resetForm(),
            users: [],
            uploadId: 0,
            person: [],
            formLabelWidth: '120px',
            appFlowName: 'motor-meetingApply_application-meeting',
            currentFormId: this.operationType == 'create' ? '' : this.formId
        };
    },
    components: {
        FilesOperate
    },
    mounted() {
        this.getDiscussionUser();
        this.recruMeetingFlag();
    },
    methods: {
        recruMeetingFlag() {
            axios.get('/api/v1/users/isBoardFortune').then(res => {
                if (res.data && res.data.zcwyh) {
                    this.discussionOption[
                        this.discussionOption.length - 1
                    ].disabled = false;
                } else {
                    this.discussionOption[
                        this.discussionOption.length - 1
                    ].disabled = true;
                }
            });
        },
        async getList() {
            const $self = this;
            $self.url = '/api/v1/issuesReported/queryList';
            let response = await $self.getQueryList();
            if (response) {
                $self.issueOption = response.data.content.list;
            } else {
                $self.msgTips('获取列表失败', 'warning');
            }
        },
        changePersonOptions(item) {
            item.people = [];
            this.searchPersonOptions(
                this.dataOptions,
                item.department[item.department.length - 1]
            );
            item.personOptions = this.person;
        },
        searchPersonOptions(array, value) {
            array.forEach(item => {
                if (item.id === value && item.type) {
                    this.person = item.children;
                }
                if (item.children && item.children.length > 0) {
                    this.searchPersonOptions(item.children, value);
                }
            });
        },
        async getTableCode() {
            let user = await this.getCommonData(
                '/synergy-common/serialNumber/getByTableCode',
                { code: 'meetingApply' }
            );
            if (user) this.formData.number = user.data.content.serialNumber;
            this.changePeople();
        },
        async getDiscussionUser() {
            axios.get('/api/v1/users/list/organs').then(res => {
                if (res) this.dataOptions = res.data || [];
                this.options = JSON.parse(JSON.stringify(this.dataOptions));
                this.deleteChildren(this.options);
            });
        },
        deleteChildren(array) {
            array.forEach(item => {
                if (item.children.length === 0) {
                    delete item.children;
                }
                if (item.children) {
                    if (item.children[0]) {
                        if (!item.children[0].type) {
                            delete item.children;
                        }
                    }
                }
                if (item.children && item.children.length > 0) {
                    this.deleteChildren(item.children);
                }
            });
        },
        changePeople() {
            this.$forceUpdate();
        },
        deleteItem(item, index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (
                    type == 'message' &&
                    this.formData.attendingDepartment.length > 1
                ) {
                    this.formData.attendingDepartment.splice(index, 1);
                } else if (
                    type == 'personal' &&
                    this.formData.requestedItems.length > 1
                ) {
                    this.formData.requestedItems.splice(index, 1);
                } else if (type == 'sitIn' && this.formData.sitIn.length > 1) {
                    this.formData.sitIn.splice(index, 1);
                } else {
                    this.$message({
                        message: '最后一组不能删除',
                        type: 'error'
                    });
                }
            });
        },
        meetingDisscuion(value) {
            if (value === 'gmoMeeting') {
                this.params.branchlineTo = 'general';
                this.getList();
                this.formData.discussionContent = [];
            } else if (value === 'partyMeeting') {
                this.params.branchlineTo = 'chairman';
                this.getList();
                this.formData.discussionContent = [];
            } else {
                this.formData.discussionContent = [];
            }
        },
        addItem(type) {
            if (type == 'message') {
                this.formData.attendingDepartment.push({});
            } else if (type == 'personal') {
                this.formData.requestedItems.push({});
            } else if (type == 'sitIn') {
                this.formData.sitIn.push({});
            }
        },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.formData.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        self.formData.attachments.splice(index, 1);
                    }
                });
            });
        },
        resetForm() {
            let formData = {
                attachments: [],
                attendingDepartment: [
                    {
                        people: [],
                        department: []
                    }
                ],
                requestedItems: [{}],
                sitIn: [
                    {
                        people: [],
                        department: []
                    }
                ],
                numbers: '',
                discussionContent: [],
                branchlineTo: '',
                businessType: '',
                generalManagement: false,
                created: '',
                sendMessage: [],
                idea: '',
                committed: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                meetingPlace: '',
                meetingTime: '',
                conferenceTitle: '',
                endTime: '',
                organName: this.$store.getters.LoginData.oname || '',
                creatorName: this.$store.getters.LoginData.uname || '',
                creatorId: this.$store.getters.LoginData.uid || '',
                organId: this.$store.getters.LoginData.oid || ''
            };
            return formData;
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/meetingApply/detail/' + this.formId)
                    .then(res => {
                        self.formData = res.data.content;
                        if (self.formData.branchlineTo === 'gmoMeeting') {
                            this.params.branchlineTo = 'general';
                            this.getList();
                        } else if (
                            self.formData.branchlineTo === 'partyMeeting'
                        ) {
                            this.params.branchlineTo = 'chairman';
                            this.getList();
                        } else {
                            this.formData.discussionContent = [];
                        }
                        if (self.formData.sitIn) {
                            self.formData.sitIn.forEach((item, index) => {
                                // 处理部门
                                if (item.person) {
                                    item.people = item.person.split(',');
                                    item.department = item.department.split(
                                        ','
                                    );
                                }
                                for (
                                    let i = 0;
                                    i < item.department.length;
                                    i++
                                ) {
                                    item.department[i] = parseInt(
                                        item.department[i]
                                    );
                                }
                                this.searchPersonOptions(
                                    this.dataOptions,
                                    item.department[item.department.length - 1]
                                );
                                item.personOptions = this.person;
                                // 处理人员
                                if (item.people)
                                    for (
                                        let i = 0;
                                        i < item.people.length;
                                        i++
                                    ) {
                                        item.people[i] = parseInt(
                                            item.people[i]
                                        );
                                    }
                            });
                        }
                        if (self.formData.attendingDepartment) {
                            self.formData.attendingDepartment.forEach(
                                (item, index) => {
                                    // 处理部门
                                    if (item.person) {
                                        item.people = item.person.split(',');
                                        item.department = item.department.split(
                                            ','
                                        );
                                    }
                                    for (
                                        let i = 0;
                                        i < item.department.length;
                                        i++
                                    ) {
                                        item.department[i] = parseInt(
                                            item.department[i]
                                        );
                                    }
                                    this.searchPersonOptions(
                                        this.dataOptions,
                                        item.department[
                                            item.department.length - 1
                                        ]
                                    );
                                    item.personOptions = this.person;
                                    // 处理人员
                                    if (item.people)
                                        for (
                                            let i = 0;
                                            i < item.people.length;
                                            i++
                                        ) {
                                            item.people[i] = parseInt(
                                                item.people[i]
                                            );
                                        }
                                }
                            );
                        }
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
            console.log(this.formData);
        },
        saveFormValidate(type) {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    if (
                        this.formData.attendingDepartment[0].people &&
                        this.formData.attendingDepartment[0].people.length > 0
                    ) {
                        this.saveForm(type);
                    } else {
                        this.msgTips('请添加参会人员', 'error');
                    }
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
            // this.formData.sendMessage = [];
            $self.formData.attendingDepartment.forEach(item => {
                if (item.people && item.department) {
                    item.department = item.department.join(',');
                    item.person = item.people.join(',');
                    this.formData.sendMessage = this.formData.sendMessage.concat(
                        item.people
                    );
                }
            });
            $self.formData.sitIn.forEach(item => {
                if (item.people && item.department) {
                    item.department = item.department.join(',');
                    item.person = item.people.join(',');
                    this.formData.sendMessage = this.formData.sendMessage.concat(
                        item.people
                    );
                }
            });
            this.formData.sendMessage = this.formData.sendMessage.join(',');
            console.log('dayinde');
            console.log(this.formData);
            if (
                this.formData.sendMessage &&
                this.formData.sendMessage.length <= 0
            ) {
                delete this.formData.sendMessage;
            }
            let business = this.discussionOption.filter(item => {
                return item.value === this.formData.branchlineTo;
            });
            if (business.length > 0)
                this.formData.businessType =
                    business[0].value + '_' + business[0].label;
            if (this.$store.getters.LoginData.code.split("_")[1] == 'generalManagementDepartment') {
                $self.formData.generalManagement = true;
            }

            let response = await $self.saveFormData(
                '/api/v1/meetingApply/save',
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
                    item.attachmentType = 'attachments';
                    self.formData.attachments.push(item);
                });
            }
          //  this.$refs.upload.clearFiles();
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
#ApplyMeetingForm {
    .el-select {
        width: 100%;
    }
    .el-cascader {
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
#ApplyMeetingForm >>> .el-form-item__content {
    width: calc(100% - 140px);
}
</style>