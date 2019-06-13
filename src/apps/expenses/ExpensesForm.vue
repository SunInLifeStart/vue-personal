<template>
    <el-dialog title="业务招待费申请单" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="90%" style="text-align: center;">
        <div id="ExpensesForm">
            <el-form :model='formData' class="demo-form-inline" ref="formupdate">
                <el-row style="margin-top: 25px;">
                    <el-col :span="8">
                        <el-form-item label="流水单号：">
                            <el-input style="width:200px;" v-model="formData.number" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <!--
                    <el-col :span="9" style="position: relative;">
                        <span class="span2">*</span>
                        <el-form-item label="出差审批单：" label-width="110px">
                            <el-select v-model="formData.travelPeople" filterable value-key="id" allow-create placeholder="" @change="travelChange">
                                <el-option v-for="item in travelSelections" :key="item.id" :label="item.number" :value="item">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.travelView">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="travelDetail"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.travelView == false">
                                <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    -->
                    <el-col :span="8" style="position: relative;">
                        <el-form-item label="呈报件：" label-width="30px;">
                            <el-select v-model="formData.submission" filterable allow-create style="width: 50%;" placeholder="选择呈报件" @change="SubmissionChange">
                                <el-option v-for="item in submissionSelections" :key="item.id" :label="item.submissionNo" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.subView">
                                <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="submissionDetail"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.subView == false">
                                <el-button type="text" style="margin-left: 10px;color:gray;" icon="el-icon-view"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
                <table>
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <tr>
                        <td colspan="8" style="font-weight:bold;">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td>
                            申请人
                        </td>
                        <td>
                            <el-input v-model="formData.creatorName" disabled></el-input>
                        </td>
                        <td>
                            所属部门
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.organName" disabled></el-input>
                        </td>
                        <td>
                            申请时间
                        </td>
                        <td colspan="2">
                            <el-date-picker v-model="formData.created" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" style="width:100%">
                            </el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            接待部门
                        </td>
                        <td colspan="3">
                            <el-select v-model="formData.hospitalitySector" placeholder="请选择" filterable>
                                <el-option v-for="item in organ" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            接待时间
                        </td>
                        <td colspan="3">
                            <el-date-picker v-model="formData.treatTime" type="datetime" placeholder="选择日期" style="width:100%">
                            </el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8"></td>
                    </tr>
                    <tr>
                        <td>客户单位</td>
                        <td colspan="7">
                            <el-input v-model="formData.customerUnit"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>招待事由</td>
                        <td colspan="7">
                            <el-input v-model="formData.servedFor"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>招待地点</td>
                        <td colspan="7">
                            <el-input v-model="formData.hostingSites"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            公司参加陪同人员
                        </td>
                        <td colspan="3">
                            <el-select v-model="formData.people" multiple placeholder="请选择陪同人员" filterable>
                                <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            客户来访人员及职务
                        </td>
                        <td colspan="3">
                            <el-input v-model="formData.visitor"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>预计人数</td>
                        <td colspan="7">
                            <el-input v-model="formData.peopleNumber"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span style="color:red;">*</span>预计金额
                        </td>
                        <td colspan="3">
                            <el-input placeholder="小写" oninput="if(value.length>13) value=value.slice(0,13)" @input="moneyChange" v-model="formData.amountInFigures" @mousewheel.native.prevent type="number"></el-input>
                        </td>
                        <td colspan="4">
                            {{formData.amountInWords}}
                        </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr>
                        <td>
                            是否标准内
                        </td>
                        <td colspan="7">
                            <el-radio-group v-model="formData.utype">
                                <el-radio label="是">是</el-radio>
                                <el-radio label="否">否</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            是否资金计划内
                        </td>
                        <td colspan="7">
                            <el-radio-group v-model="formData.fundPlan">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold;">附件</td>
                    </tr>
                    <tr>
                        <td>
                            <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <span style="color:#06940c"> 附件上传
                                    <i class="el-icon-plus"></i>
                                </span>
                            </el-upload>
                        </td>
                        <td colspan="7" style="padding:10px;">
                            <div v-for="(item,index) in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments(index,formData.attachments,null,'get')"></FilesOperate>
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
import moment from 'moment';
import axios from 'axios';
import cookies from 'js-cookie';
import FilesOperate from '../FilesOperate';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'ExpensesForm',
    data() {
        return {
            dialogTitle: '',
            dialogSelectCode: false,
            currentRoles: [],
            branchCode: '',
            dialogFormVisible: false,
            formData: this.resetForm(),
            appFlowName: 'motor-entertainmentexpense_entertainment',
            organ: [],
            submissionSelections: [],
            travelSelections: [
                {
                    id: 77777,
                    number: '出差审批单1'
                },
                {
                    id: 88888,
                    number: '出差审批单2'
                },
                {
                    id: 99999,
                    number: '出差审批单3'
                }
            ],
            formData: this.resetForm(),
            users: []
        };
    },
    components: {
        FilesOperate
    },
    mounted() {
        console.log(this.$store.getters.LoginData.Role);
        this.getUsers();
        this.organs();
        // this.getTravelList();
        // this.getSubmissionlList();
    },
    methods: {
        moneyChange() {
            this.formData.amountInWords = this.convertCurrency(
                this.formData.amountInFigures
            );
        },
        travelChange(val) {
            this.formData.travelView = true;
            let boolean = false;
            for (let data of this.travelSelections) {
                if (val.id && data.id == val.id) {
                    boolean = true;
                    this.formData.busId = this.formData.travelPeople.id;
                    this.formData.busNo = this.formData.travelPeople.number;
                }
            }
            this.formData.travelView = boolean;
        },
        //根据uid获取列表
        getTravelList() {
            const self = this;
            this.travelSelections = [];
            if (cookies.get('uid') != '') {
                axios
                    .get('/api/v1/travel_forms/findDone/' + cookies.get('uid'))
                    .then(res => {
                        self.travelSelections = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        travelDetail() {
            if (
                this.formData.travelPeople &&
                this.formData.travelPeople != null
            ) {
                this.common.open('#/apps/travel/' + this.formData.busId);
            }
        },
        //根据uid获取部门呈报件
        getSubmissionlList() {
            const self = this;
            this.submissionSelections = [];
            if (cookies.get('uid') != '') {
                axios
                    .post(
                        '/api/v1/submission_forms/queryDone/' +
                            cookies.get('uid')
                    )
                    .then(res => {
                        self.submissionSelections = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        //部门呈报件改变
        SubmissionChange(val) {
            console.log(val);
            this.formData.subView = true;
            let boolean = false;
            for (let data of this.submissionSelections) {
                if (data.id == val) {
                    boolean = true;
                }
            }
            this.formData.subView = boolean;
            /** 
            this.formData.subView = true;
            let boolean = false;
            for (let data of this.submissionSelections) {
                if (val.id && data.id == val.id) {
                    boolean = true;
                    this.formData.subId = this.formData.submission.id;
                    this.formData.subNo = this.formData.submission.submissionNo;
                }
            }
            this.formData.subView = boolean;
            */
        },
        submissionDetail() {
            if (this.formData.submission && this.formData.submission != null) {
                this.common.open('#/apps/submission/' + this.formData.subId);
            }
        },
        organs() {
            axios.get('/api/v1/users/list/organss').then(res => {
                this.organ = [];
                for (let data of res.data) {
                    this.organ.push({
                        id: data.id,
                        name: data.name
                    });
                }
                this.organ = res.data;
            });
        },
        getUsers() {
            axios.get('/api/v1/users').then(res => {
                this.users = res.data;
            });
        },
        getNum() {
            const self = this;
            let params = {
                code: 'expenses_forms'
            };
            axios
                .post('/synergy-common/serialNumber/getByTableCode', params)
                .then(res => {
                    this.formData.number = res.data.content.serialNumber;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        setDataFromParent(data) {
            this.getSubmissionlList();
            this.getUsers();
            this.organs();
            this.formData.submission = '';
            this.formData = data;
            this.formData.people = data.accompanying.split(',');
            if (data.subId && data.subId != '') {
                if (data.subView) {
                    this.formData.submission = parseInt(data.subId);
                } else {
                    this.formData.submission = data.subId;
                }
            }
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.getSubmissionlList();
            this.formData = this.resetForm();
            this.formData.submission = '';
            this.getNum();
            this.getUsers();
            this.organs();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = '';
        },
        resetForm() {
            let formData = {
                // travelView: true,
                // travelPeople: {},
                submission: '',
                subView: true,
                subId: '',
                subNo: '',
                //  busId: '',
                //  busNo: '',
                number: '',
                creatorName: cookies.get('uname'),
                organName: cookies.get('oname'),
                creatorId: this.$store.getters.LoginData.uid || '',
                organId: this.$store.getters.LoginData.oid || '',
                created: moment().format('YYYY-MM-DD HH:mm:ss'),
                hospitalitySector: '',
                treatTime: '',
                customerUnit: '',
                servedFor: '',
                accompanying: '',
                hostingSites: '',
                people: [],
                visitor: '',
                peopleNumber: '',
                amountInFigures: '',
                amountInWords: '',
                utype: '是',
                attachments: [],
                fundPlan: true
            };
            return formData;
        },
        saveFormValidate(type) {
            const $self = this;
            let typee = this.$store.getters.LoginData.code.split('_')[0];
            if (this.formData.amountInFigures != '') {
                if (typee) {
                    let arr = this.$store.getters.LoginData.Role.split(',');
                    if (
                        (arr.includes(typee + '_' + 'chairman') ||
                            arr.includes(typee + '_' + 'generalManager')) &&
                        parseFloat(this.formData.amountInFigures) <= 2000
                    ) {
                        $self.msgTips(
                            '申请额度需要大于2000元可提单',
                            'warning'
                        );
                    } else if (
                        (arr.includes(
                            typee + '_' + 'generalManagerAssistant'
                        ) ||
                            arr.includes(
                                typee + '_' + 'duptyGeneralManager'
                            )) &&
                        parseFloat(this.formData.amountInFigures) <= 1000
                    ) {
                        $self.msgTips(
                            '申请额度需要大于1000元可提单',
                            'warning'
                        );
                    } else {
                        this.saveForm(type);
                    }
                } else {
                }
            } else {
                $self.msgTips('请输入必输项', 'warning');
            }
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            if ($self.createForm_status) {
                if ((await $self.juderCode()) == 'returnDialog') {
                    return false;
                }
            }
            if ($self.formData.created) {
                $self.formData.created = moment($self.formData.created).format(
                    'YYYY-MM-DD HH:mm:ss'
                );
            } else {
                $self.formData.created = '';
            }
            if ($self.formData.treatTime) {
                $self.formData.treatTime = moment(
                    $self.formData.treatTime
                ).format('YYYY-MM-DD HH:mm:ss');
            } else {
                $self.formData.treatTime = '';
            }
            if (this.formData.submission != '') {
                this.formData.subId = this.formData.submission;
                for (let data of this.submissionSelections) {
                    if (data.id == this.formData.submission) {
                        this.formData.subNo = data.submissionNo;
                    }
                }
                if (this.formData.subView == false) {
                    this.formData.subNo = this.formData.submission;
                }
            }
            /** 
            if (this.formData.subView == false) {
                this.formData.subNo = this.formData.submission;
            }
            */
            this.formData.accompanying = this.formData.people.join(',');
            let response = await $self.saveFormData(
                '/api/v1/entertainmentExpense/save',
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
                    self.formData.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        downloadFile(url) {
            window.open(url, '_blank');
        },
        deleteAttachment(id) {
            const self = this;
            if (this.formData.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/loan_forms/deleteAttachment/' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.formData.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.formData.attachments.splice(
                                            index,
                                            1
                                        );
                                    }
                                });
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                );
            }
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {}
    }
};
</script>
<style lang="scss">
#ExpensesForm {
    table {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        width: 100%;
    }
    table td,
    table th {
        border: 1px solid #ccc;
        padding: 0px;
        margin: 0px;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        font-size: 14px;
        height: 40px;
        text-align: center;
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
    .upload {
        position: relative;
        margin-right: 30px;
        // width: 100px;
        display: inline-block;
        cursor: pointer;
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
    .notice {
        color: red;
        h2 {
            text-align: left;
        }
        ol {
            font-size: 17px;
            text-align: left;
        }
    }
    .span1 {
        color: red;
        margin-right: 5px;
    }
    .span2 {
        position: absolute;
        top: 10px;
        left: -5px;
        color: red;
    }
    .span3 {
        position: absolute;
        top: 10px;
        left: -10px;
        color: red;
    }
    .bolder {
        font-weight: bold;
    }
    .el-select {
        width: 100%;
    }
}
</style>