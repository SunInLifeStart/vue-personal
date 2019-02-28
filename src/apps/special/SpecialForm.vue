<template>
    <div id="SpecialForm">
        <el-form ref="form" :model="form" label-width="130px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="文件名" prop="title">
                        <el-input v-model="form.fileName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='issueDate' label="下发时间">
                        <!-- <el-date-picker v-model="form.issueDate" style="width:100%" type="date"></el-date-picker> -->
                        <el-input v-model="form.issueDate" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item prop='draftUser' label="下发人">
                        <el-input v-model="form.issueName" placeholder="" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='telephone' label="下发部门">
                        <el-input v-model="form.organName" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item prop='telephone' label="发布到">
                        <el-checkbox v-model="form.toPortal">集团门户</el-checkbox>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in form.attachment" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachment"></FilesOperate>
                        </div>
                        <!--
                        <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item)">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
                            <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                        </div>
                        -->
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
import cookies from 'js-cookie';
import FilesOperate from '../FilesOperate';
export default {
    name: 'SpecialForm',
    data() {
        return {
            info: '',
            selectNumber: '',
            form: {
                fileName: '',
                issueDate: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                // issueName: this.$store.getters.LoginData.uname,
                // organName: this.$store.getters.LoginData.oname,
                attachment: [],
                toPortal: ''
                // issueName: cookies.get('uname'),
                // organName: cookies.get('oname'),
                // oid:  parseInt(cookies.get('oid')),
                // uid: parseInt(cookies.get('uid'))
            },
            tabledata: [],
            uploadId: '',
            currentFormId: this.operationType == 'create' ? '' : this.formId
        };
    },
    components: {
        FilesOperate
    },
    props: ['formId', 'operationType'],
    mounted() {
        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.form.issueName = decodeURIComponent(item.split('=')[1]);
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.form.organName = decodeURIComponent(item.split('=')[1]);
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
    },
    watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == 'create') {
                // const time = moment()
                //     .utc()
                //     .format('YYYY-MM-DD');
                this.cleanForm();
            } else {
                this.getForm();
            }
        }
    },
    methods: {
        getReviseData(repelaceData) {
            let self = this;
            self
                .$confirm('确定要替换吗，替换后原文件将被删除?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    self.rows.attachments.forEach(function(value, index) {
                        if (value.id == repelaceData.id) {
                            axios
                                .get(
                                    '/api/v1/activity_forms/deleteAtt/' +
                                        repelaceData.id
                                )
                                .then(res => {
                                    self.rows.attachments.splice(index, 1);
                                    self.rows.attachments.push(
                                        repelaceData.data
                                    );
                                });
                        }
                    });
                });
        },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.rows.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/activity_forms/deleteAtt/' + id)
                            .then(res => {
                                self.rows.attachments.splice(index, 1);
                            });
                    }
                });
            });
        },
        cleanForm() {
            this.form = {
                fileName: '',
                issueDate: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                creatorName: '',
                toPortal: '',
                organName: '',
                attachment: [],
                organName: this.$store.getters.LoginData.oname,
                issueName: this.$store.getters.LoginData.uname
            };
        },
        downloadFile(item) {
            this.common.preview(item);
        },
        // saveForm1(type = '') {
        //     this.$refs['form'].validate(valid => {
        //         if (valid) {
        //             this.saveForm1(type);
        //         } else {
        //         }
        //     });
        // },
        saveFormValidate() {
            if (this.form.attachment.length > 0) {
                this.saveForm();
                this.$emit('saveStatus', false);
            } else {
                this.$message({
                    message: '请上传下发文件',
                    type: 'error'
                });
            }
        },
        saveForm(action = '') {
            const self = this;
            axios
                .post(
                    '/api/v1/super_forms/specialReport/save?uid=' +
                        cookies.get('uid') +
                        '&uname=' +
                        cookies.get('uname') +
                        '&oid=' +
                        cookies.get('oid') +
                        '&oname=' +
                        cookies.get('oname'),
                    JSON.stringify(this.form),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;
                    self.$emit('refreshData');
                    if (this.operationType == 'edit') {
                        self.$emit('refreshDetail');
                    }
                    self.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    // this.info = 'success';
                    // this.$emit('info', this.info);
                    // if (action == 'save') {
                    //    self.submitForm();
                    // }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/super_forms/${self.currentFormId}/comment`, {
                    content: '提交'
                })
                .then(res => {});
        },
        submitCheck() {
            if (this.operationType == 'create') {
                this.saveForm('save');
            } else {
                this.submitForm();
                this.comment();
            }
        },
        submitForm() {
            const self = this;
            axios
                .post('/api/v1/motions/' + this.currentFormId + '/create', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
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
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/super_forms/specialReport/' + this.formId)
                    .then(res => {
                        self.form = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.form.attachment.push(item);
                });
            }
        },
        handlePreview() {},
        handleRemove() {},
        deleteAttachment(id) {
            const self = this;
            if (this.form.attachment.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/super_forms/specialReport/deleteAttachment/' +
                                    id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.form.attachment.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.form.attachment.splice(index, 1);
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
        }
    }
};
</script>
<style lang="scss" scoped>
#SpecialForm {
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 120px;
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
    /**
    .attachment {
        position: relative;
        margin-bottom: 40px;
        margin-right: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        display: inline-block;
        border: 1px solid #c0c4cc;

        border-radius: 2px;
        cursor: pointer;
        img {
            width: 100px;
            height: 120px;
        }

        p {
            margin: 0;
            line-height: 20px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        i {
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px;
            &:hover {
                color: red;
            }
        }
    }
    */
}
</style>