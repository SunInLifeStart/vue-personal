<template>
    <div id="BoardMeetingForm">
        <el-form :model="rows" label-width="100px" :rules="rules" ref="formupdate">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="董事会编号" prop="numbers">
                        <el-input v-model="rows.numbers" placeholder="请输入董事会编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="文件标题" prop="filetitle">
                        <el-input v-model="rows.filetitle" placeholder="请输入文件标题"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿人">
                        <el-input v-model="rows.drafter" placeholder="请输入拟稿人" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="拟稿单位">
                        <el-input v-model="rows.draftUnit" placeholder="请输入拟稿单位" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿时间">
                        <el-date-picker v-model="rows.draftTime" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="电话" prop="phone">
                        <el-input v-model="rows.phone" placeholder="请输入电话"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文" prop="content">
                        <el-input v-model="rows.content" placeholder="请输入正文" type="textarea" :autosize="{ minRows: 2, maxRows: 20}" :rows="3"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input v-model="rows.remarks" placeholder="备注"></el-input>
                    </el-form-item>
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
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import FilesOperate from '../FilesOperate';
export default {
    name: 'BoardMeetingForm',
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
            tabledata: [],
            rows: {
                attachments: [],
                numbers: '',
                filetitle: '',
                numbers: '',
                drafter: '',
                draftUnit: '',
                draftTime: moment(new Date()).format('YYYY-MM-DD'),
                phone: '',
                content: '',
                remarks: '',
                writer: ''
                // delegate:[],
            },
            users: [],
            uploadId: 0,
            formLabelWidth: '120px',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                numbers: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入专题会编号'
                    }
                ],
                filetitle: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入文件标题'
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
                content: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请选择正文'
                    }
                ],
                // delegate: [
                //     {
                //         required: true, //是否必填
                //         trigger: "change", //何事件触发
                //         message: "请选择参会人员"
                //     }
                // ],
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
    props: ['formId', 'operationType'],
    components: {
        FilesOperate
    },
    watch: {
        formId: function() {
            if (this.operationType == 'edit') {
                this.getForm();
            } else {
                clearForm();
            }
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
            } else if (this.operationType == 'edit') {
                this.getForm();
            }
        }
    },
    mounted() {
        const cookieItems = document.cookie.split(';');
        for (let item of cookieItems) {
            if (item.indexOf('uname') > -1) {
                this.rows.drafter = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > -1) {
                this.rows.draftUnit = decodeURIComponent(item.split('=')[1]);
            }
        }
        if (this.operationType == 'edit') {
            this.getForm();
        } else if (this.operationType == 'create') {
        }
        this.getUserList();
    },
    methods: {
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.rows.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/board_meeting_forms/deleteAtt/' + id)
                            .then(res => {
                                self.rows.attachments.splice(index, 1);
                            });
                        self.rows.attachments.splice(index, 1);
                    }
                });
            });
        },
        getUserList() {
            axios.get('/api/v1/users', '').then(res => {
                this.users = res.data;
            });
        },
        clearForm() {
            this.rows = {
                attachments: [],
                numbers: '',
                filetitle: '',
                numbers: '',
                drafter: this.rows.drafter,
                draftUnit: this.rows.draftUnit,
                draftTime: moment(new Date()).format('YYYY-MM-DD'),
                phone: '',
                content: '',
                remarks: '',
                // delegate:[],
                writer: ''
            };
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/board_meeting_forms/' + this.formId)
                    .then(res => {
                        //res.data.delegate = res.data.delegate.split(",");
                        self.rows = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
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
            //  if (self.rows.delegate.length > 0) {
            //     self.rows.delegate = self.rows.delegate.join(",");
            // } else {
            //     self.rows.delegate = "";
            // }
            axios
                .post(
                    '/api/v1/board_meeting_forms/save',
                    JSON.stringify(self.rows),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;
                    if (self.operationType == 'create') {
                        self.clearForm();
                    }
                    if (action == 'submit') {
                        self.submitForm();
                    } else {
                        self.$emit('refreshData');
                        if (this.operationType == 'edit') {
                            self.$emit('refreshDetail');
                        }
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        submitCheck() {},
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/board_meetings/' + this.currentFormId + '/create',
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    if (res.data.id != '') {
                        self.commitForm(res.data.id);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/board_meeting_forms/' +
                        this.currentFormId +
                        '/commit/' +
                        processId,
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.comment();
                    this.startProcess();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        comment() {
            let self = this;
            axios
                .put(
                    `/api/v1/board_meeting_forms/${self.currentFormId}/comment`,
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
                    '/api/v1/board_meetings/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
                    if (this.operationType == 'edit') {
                        self.$emit('refreshDetail');
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        deleteAttachment(id) {
            const self = this;
            if (this.rows.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/board_meeting_forms/deleteAtt/' + id,
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.rows.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.rows.attachments.splice(index, 1);
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
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        downloadFile(url) {
            window.open(url, '_blank');
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {},
        getFormData() {
            return this.rows;
        }
    }
};
</script>
<style lang="scss" scoped>
#BoardMeetingForm {
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