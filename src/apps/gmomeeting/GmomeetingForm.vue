<template>
    <div id="GmoMeetingForm">
        <el-form :model="rows" label-width="100px" :rules="rules" ref="formupdate">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="总办会编号" prop="numbers">
                        <el-input v-model="rows.numbers" placeholder="请输入总办会编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="文件标题" prop="title">
                        <el-input v-model="rows.title" placeholder="请输入文件标题"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="拟稿单位">
                        <el-input type="text" placeholder="" v-model="rows.draftUnit" :disabled="true">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="拟稿时间">
                        <!-- <div class="block"> -->
                        <el-date-picker v-model="rows.draftTime" type="date" placeholder="选择日期" width="100%">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="拟稿人">
                        <el-input type="text" placeholder="" v-model="rows.drafter" :disabled="true">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="电话" prop="phone">
                        <el-input type="text" placeholder="请输入电话" v-model="rows.phone">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文">
                        <FilesOperate v-if="rows.text.name" :item="rows.text" :options="{preview:true,download:true,edit:true}"  @editText="editText"></FilesOperate>
                        <el-button type="primary" size="small" @click="createTextBody" v-if="!rows.text.name">创建文件</el-button>
                        <GmomeetingFiles @editWordData="editWordData" ref="gmomeetingfiles"></GmomeetingFiles>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 20}" placeholder="请输入备注内容" v-model="rows.remarks">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row>
                <el-col :span="24">
                    <el-form-item label="文件内容" prop="content">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 20}" placeholder="请输入内容" v-model="rows.content">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <!-- <el-row>
                <el-col :span="24">
                    <el-form-item label="议题" prop="activeNames">
                        <el-collapse v-show="rows.meetingTasks.length > 0" v-model="activeNames" accordion>
                            <el-collapse-item v-for="(item,index) in rows.meetingTasks" :key="index">
                                <template slot="title">
                                    <div style="color:#005a9e">
                                        <div class="ytTitle">
                                            <el-tag size="mini">{{index+1}}</el-tag> &nbsp; {{item.title}}
                                        </div>
                                        <span class="editicon">
                                            <i class="el-icon-edit-outline" @click="editDiscussion(item,index,$event)" style="margin-right:15px;font-size:20px"></i>
                                            <i class="el-icon-delete" @click="deleteDiscussion(item,$event,index)" style="color:red;font-size:20px"></i>
                                        </span>
                                    </div>
                                </template>
                                <div style="padding-left:30px;">{{item.content}}</div>
                            </el-collapse-item>
                        </el-collapse>
                        <el-row>
                            <i class="el-icon-circle-plus" style="font-size:20px;cursor:pointer" @click="addDiscussion"></i>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <!-- <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-col :span="24">
                            <el-form-item label="出席" prop="attend">
                                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 20}" v-model="rows.attend">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-col>
            </el-row> -->
            <!-- <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-col :span="24">
                            <el-form-item label="列席" prop="delegate">
                                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 20}" v-model="rows.delegate">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-col>
            </el-row> -->
            <!-- <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="记录" prop="writer">
                            <el-select style="width:100%;" v-model="rows.writer" filterable readonly default-first-option placeholder="请选择记录人员">
                                <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row> -->
            <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="发送" prop="distribute">
                            <el-select style="width:100%;" v-model="rows.distribute" value-key="id" @remove-tag="removeTag" multiple filterable allow-create default-first-option placeholder="请选择分送人员">
                                <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog title="新增议题" :visible.sync="dialogFormDiscussion" width="960px" top="150px" custom-class="discussion" :close-on-click-modal="false" append-to-body>
            <GmoDiscussionForm ref="GmoDiscussionForm" :discussionData="discussionData" @currentDiscussionData="getDiscussionData"></GmoDiscussionForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="savaDiscussion">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
// import { mapGetters } from "vuex";
import moment from 'moment';
import GmoDiscussionForm from './GmodiscussionForm';
import FilesOperate from '../FilesOperate';
import GmomeetingFiles from './GmomeetingFiles';
export default {
    name: 'GmoMeetingForm',
    data() {
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'));
            } else {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                console.log(reg.test(value));
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('请输入正确的手机号'));
                }
            }
        };
        return {
            rows: {
                text: { name: '' },
                numbers: '',
                title: '',
                content: '',
                attend: '',
                delegate: '',
                writer: '',
                meetingTasks: [],
                attachments: [],
                draftUnit: '',
                remarks: '',
                drafter: '',
                phone: '',
                draftTime: moment(new Date()).format('YYYY-MM-DD'),
                distribute: []
            },
            users: [],
            tabledata: [],
            activeNames: [1, 2],
            currentEdit: false,
            discussionData: '',
            dialogFormDiscussion: false,
            loginData: {
                organId: '', // 部门id,
                organName: '', //"部门名称",
                creatorId: '', //创建id,
                creatorName: '' //"创建人姓名",
            },
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                numbers: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入总办会编号'
                    }
                ],
                /** 
                phone: [
                    {
                        required: true, //是否必填
                        validator: checkPhone,
                        trigger: 'blur'
                    }
                ],
                */
                title: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入文件标题'
                    }
                ],
                content: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入内容'
                    }
                ],
                attend: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入出席人'
                    }
                ],
                writer: [
                    {
                        required: true, //是否必填
                        trigger: 'change', //何事件触发
                        message: '请选择记录人'
                    }
                ],
                distribute: [
                    {
                        required: true, //是否必填
                        trigger: 'change', //何事件触发
                        message: '请选择分送人'
                    }
                ]
                // activeNames:[
                //     {
                //         required: true, //是否必填
                //         trigger: "change",//何事件触发
                //         message: '请输入出席人'
                //     }
                // ],
            }
        };
    },
    components: {
        GmoDiscussionForm,
        FilesOperate,
        GmomeetingFiles
    },
    props: ['formId', 'operationType'],
    watch: {
        formId: function() {
            if (this.operationType == 'edit') {
                this.getForm();
            }
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
                this.currentFormId = '';
            } else if (this.operationType == 'edit') {
                this.getForm();
            }
        }
    },
    methods: {
        editWordData(data) {
            // console.log(data);
            if (!data.url) {
                return false;
            }
            this.rows.text = {
                iconUrl: data.icon_url,
                name: data.originalFilename,
                url: data.url,
                path: data.path,
                file_name: data.file_name,
                pdfUrl:
                    data.url.split('files')[0] +
                    'pdf' +
                    data.url.split('files')[1]
            };
        },
        editText() {
            // this.$refs.outgoingeditfiles.dialogForm = true;
            this.$refs.gmomeetingfiles.openData(this.rows.text.url);
        },

        createTextBody() {
            // this.$refs.outgoingeditfiles.dialogForm = true;
            this.$refs.gmomeetingfiles.openData();
        },
        removeTag(value) {
            if (value == '集团领导') {
                this.rows.distribute.push('集团领导');
                this.$message({
                    message: '集团领导选项不可删除',
                    type: 'error'
                });
            }
        },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.rows.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/gmo_meeting_forms/deleteAtt/' + id)
                            .then(res => {
                                self.rows.attachments.splice(index, 1);
                            });
                    }
                });
            });
        },
        getUsers() {
            axios.get('/api/v1/users', '').then(res => {
                for (let item of res.data) {
                    this.users.push({ id: item.id, name: item.name });
                }
            });
        },
        getForm() {
            const self = this;
            if (self.formId != '') {
                axios
                    .get('/api/v1/gmo_meeting_forms/' + self.formId)
                    .then(res => {
                        self.rows.content = res.data.content;
                        self.rows.text = res.data.text
                            ? JSON.parse(res.data.text)
                            : { name: '' };
                        /** 
                        self.rows.attend = res.data.attend
                            ? res.data.attend.split(',')
                            : [];
                            */
                        self.rows.attend = res.data.attend;
                        self.rows.meetingTasks = res.data.meetingTasks;
                        self.rows.attachments = res.data.attachments;
                        self.rows.writer = res.data.writer;
                        self.rows.delegate = res.data.delegate;
                        self.rows.remarks = res.data.remarks;
                        self.rows.phone = res.data.phone;
                        self.rows.draftTime = res.data.draftTime;
                        self.rows.distribute = res.data.distribute
                            ? res.data.distribute.split(',')
                            : [];
                        // self.rows.distribute = res.data.distribute;
                        self.rows.draftUnit = res.data.draftUnit;
                        self.rows.writer = res.data.writer;
                        self.rows.id = res.data.id;
                        self.rows.numbers = res.data.numbers;
                        self.rows.title = res.data.title;
                    })
                    .catch(function() {
                        self.$message({
                            message: '获取表单失败',
                            type: 'error'
                        });
                    });
            }
        },
        addDiscussion() {
            this.currentEdit = false;
            this.dialogFormDiscussion = true;
            const arrNumber = [
                '一',
                '二',
                '三',
                '四',
                '五',
                '六',
                '七',
                '八',
                '九',
                '十'
            ];

            this.$nextTick(function() {
                if (this.$refs.GmoDiscussionForm) {
                    this.$refs.GmoDiscussionForm.clearForm(
                        arrNumber[this.rows.meetingTasks.length]
                    );
                }
            });
        },
        editDiscussion(item, index, event) {
            event.stopPropagation();
            const self = this;
            const arrNumber = [
                '一',
                '二',
                '三',
                '四',
                '五',
                '六',
                '七',
                '八',
                '九',
                '十'
            ];
            self.currentEditIndex = index;
            item.serial = '序号' + arrNumber[index];
            self.dialogFormDiscussion = self.currentEdit = true;
            this.$nextTick(function() {
                if (this.$refs.GmoDiscussionForm) {
                    self.discussionData = JSON.parse(JSON.stringify(item));
                }
            });
        },
        savaDiscussion(data) {
            this.$refs.GmoDiscussionForm.savaCurrentDiscussion(data);
        },
        deleteDiscussion(item, event, index) {
            event.stopPropagation();
            this.$confirm('是否删除此?', '提示', {
                type: 'warning'
            }).then(() => {
                if (item.id) {
                    axios
                        .get('/api/v1/gmo_meeting_forms/deleteTask/' + item.id)
                        .then(res => {});
                }
                this.rows.meetingTasks.splice(index, 1);
            });
        },
        getDiscussionData(data) {
            let arr = [];
            this.dialogFormDiscussion = false;
            if (this.currentEdit == false) {
                this.rows.meetingTasks.push(data); //新增议题
            } else {
                this.rows.meetingTasks[this.currentEditIndex] = data; //编辑议题
            }
        },
        saveFormValidate(type) {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                    this.$emit('saveStatus', false);
                }
            });
        },

        saveForm(action = '') {
            const self = this;
            self.rows.text = JSON.stringify(self.rows.text);
            this.$refs.gmomeetingfiles.clearTime();
            self.rows.distribute = self.rows.distribute.join(',');
            self.rows = Object.assign(self.rows, self.loginData);
            axios
                .post('/api/v1/gmo_meeting_forms/save', self.rows)
                .then(res => {
                    self.rows.text = res.data.text
                        ? JSON.parse(res.data.text)
                        : { name: '' };
                    self.currentFormId = res.data.id;
                    if (this.operationType == 'create') {
                        this.clearForm();
                    } else {
                        // self.rows.attend = res.data.attend.split(',');
                        self.rows.distribute = res.data.distribute.split(',');
                    }
                    if (action == 'submit') {
                        self.submitForm(true);
                    } else {
                        self.$emit('refreshData');
                        if (this.operationType == 'edit') {
                            self.$emit('refreshDetail');
                        }
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '获取表单失败',
                        type: 'error'
                    });
                    self.clearForm();
                });
        },
        submitCheck() {
            this.submitForm();
        },
        submitForm(juder) {
            const self = this;
            if (juder) {
                axios
                    .post(
                        '/api/v1/gmo_meetings/' + self.currentFormId + '/create'
                    )
                    .then(res => {
                        if (res.data.id != '') {
                            // self.$emit("refreshData");
                            self.commitForm(res.data.id);
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '创建表单失败',
                            type: 'error'
                        });
                    });
            } else {
                const action = 'submit';
                this.saveForm(action);
            }
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/gmo_meeting_forms/' +
                        self.currentFormId +
                        '/commit/' +
                        processId,
                    ''
                )
                .then(res => {
                    self.comment();
                    self.startProcess();
                })
                .catch(function() {
                    self.$message({
                        message: '提交表单失败',
                        type: 'error'
                    });
                });
        },
        comment() {
            let self = this;
            axios
                .put(
                    `/api/v1/gmo_meeting_forms/${self.currentFormId}/comment`,
                    {
                        content: '提交',
                        action: 'COMMIT',
                        node: '提交'
                    }
                )
                .then(res => {});
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT'
            };
            axios
                .put(
                    '/api/v1/gmo_meetings/' + self.currentFormId + '/signal',
                    params
                )
                .then(res => {
                    self.$emit('refreshData');
                    if (this.operationType == 'edit') {
                        self.$emit('refreshDetail');
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '启动流程失败',
                        type: 'error'
                    });
                });
        },

        // deleteItem(index) {
        //     this.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
        //         this.tableData.splice(index, 1);
        //     });
        // },

        clearForm() {
            this.rows = {
                text: { name: '' },
                numbers: '',
                title: '',
                id: '',
                content: '',
                attend: '',
                delegate: '',
                writer: '',
                meetingTasks: [],
                attachments: [],
                remarks: '',
                phone: '',
                drafter: this.rows.drafter,
                draftUnit: this.rows.draftUnit,
                draftTime: moment(new Date()).format('YYYY-MM-DD'),
                draftTime: '',
                distribute: ['集团领导']
            };
        },

        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        downloadFile(file) {
            this.common.preview(file);
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {},
        getFormData() {
            return this.rows;
        }
    },
    mounted() {
        const self = this;
        const cookieItems = document.cookie.split(';');
        for (let item of cookieItems) {
            if (item.indexOf('uname') > -1) {
                self.loginData.creatorName = decodeURIComponent(
                    item.split('=')[1]
                );
            }
            if (item.indexOf('oname') > -1) {
                self.rows.organName = self.loginData.organName = decodeURIComponent(
                    item.split('=')[1]
                );
            }
            if (item.indexOf('uid') > -1) {
                self.loginData.creatorId = decodeURIComponent(
                    item.split('=')[1]
                );
            }
            if (item.indexOf('oid') > -1) {
                self.loginData.organId = decodeURIComponent(item.split('=')[1]);
            }
        }

        this.rows.draftUnit = self.loginData.organName;
        this.rows.writer = this.rows.drafter = self.loginData.creatorName;

        if (this.operationType == 'edit') {
            this.getForm();
        }
        this.getUsers();
    }
};
</script>
<style lang="scss" scoped>
#GmoMeetingForm {
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
    .el-collapse {
        margin-bottom: 10px;
    }
    .ytTitle {
        display: inline-block;
        width: 70%;
        height: 37px;
        overflow: hidden;
        word-break: keep-all;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .el-icon-jiahao {
        font-size: 24px;
    }
    .editicon {
        float: right;
        margin-right: 20px;
    }
}
</style>