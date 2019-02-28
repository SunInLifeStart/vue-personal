<template>
    <div id="MotionForm">
        <el-form ref="formupdate" :model="rows" :rules="rules" label-width="145px" style="margin-top:10px;">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="呈报件编号">
                        <el-input v-model="rows.fileNo"></el-input>
                        <!-- <span>
                            <el-button @click="getno()" style="margin: 0 5px;">自动生成</el-button>
                        </span> -->
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="文件标题" prop="title">
                        <el-input v-model="rows.title"></el-input>
                        <!-- <el-button size="" @click="getWordyear" style="margin: 0 5px;">自动生成</el-button> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="拟稿单位">
                        <!-- <el-input v-model="rows.draftUnit"></el-input> -->
                        <el-input v-model="rows.organName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="拟稿人">
                        <el-input v-model="rows.creatorName" disabled="disabled"></el-input>
                        <!-- <el-input v-model="rows.draftUser"></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="拟稿时间" prop="draftTime">
                        <el-date-picker v-model="rows.draftTime" style="width:100%" type="date">
                        </el-date-picker>
                        <!-- <el-input v-model="rows.draftTime"></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="电话" prop="telephone">
                        <el-input v-model="rows.telephone"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="3">
                    <el-checkbox v-model="rows.manager">请总经理批示</el-checkbox>
                    <el-checkbox v-model="rows.chairman">请董事长批示</el-checkbox>
                </el-col>
            </el-row>
            <el-row style="margin-top:20px">
                <el-col :span="24">
                    <!-- <el-form-item label="正文">
                        <el-input type="textarea" :autosize="{minRows: 2}" v-model="rows.content"></el-input>
                    </el-form-item> -->
                    <el-form-item label="正文" prop="content">
                        <FilesOperate v-if="rows.text.name" :item="rows.text" :options="{preview:true,download:true,edit:true}" @getId="getId" @editText="editText" @getReviseData="getReviseData"></FilesOperate>
                        <el-button type="primary" size="small" @click="createTextBody" v-if="!rows.text.name">创建文件</el-button>
                        <motionditFiles @editWordData="editWordData" ref="motionditFiles"></motionditFiles>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input v-model="rows.remarks"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件管理">
                        <el-upload name="files" multiple class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <!-- <div class="attachments" v-for="item in rows.attachments" :key="item.id">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
                            <i class="el-icon-delete" @click="deleteAttachment(item.id)"></i>
                        </div> -->
                        <div v-for="item in rows.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-dialog title="请选择董监事" :visible.sync="dialogVisible" center width="30%" append-to-body>
                <el-form>
                    <el-form-item>
                        <el-select v-model="seleteUsers" filterable multiple style="width:100%;">
                            <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogab()">确 定</el-button>
                </span>
            </el-dialog>
        </el-form>
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import FilesOperate from '../FilesOperate';
import MotionditFiles from './MotionditFiles.vue';
export default {
    name: 'MotionForm',
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
            dialogVisible: false,
            users: [],
            seleteUsers: [],
            dialogFormVisible: false,
            rows: {
                fileNo: '',
                title: '',
                creatorName: '',
                draftTime: moment(new Date()).format('YYYY-MM-DD'),
                organName: '',
                telephone: '',
                commonUser: '',
                remarks: '',
                chairman: false,
                manager: false,
                attachments: [],
                text: { name: '' },
                text2: ''
            },
            numkk: '',
            checkList: [],
            cookie_uname: '',
            cookie_oname: '',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                title: [
                    {
                        required: true,
                        message: '请输入文件标题',
                        trigger: 'blur'
                    }
                ],
                /** 
                telephone: [
                    {
                        required: true, //是否必填
                        validator: checkPhone,
                        trigger: 'blur'
                    }
                ],
                */
                draftTime: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ]
            }
        };
    },
    props: ['formId', 'operationType'],
    mounted() {
        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }
        this.getAllUsers();
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.rows.creatorName = decodeURIComponent(item.split('=')[1]);
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.rows.organName = decodeURIComponent(item.split('=')[1]);
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
        this.getno();
    },
    watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
            }
        }
    },
    components: {
        FilesOperate,
        MotionditFiles
    },
    methods: {
        editText() {
            // this.$refs.motionditFiles.dialogForm = true;
            this.$refs.motionditFiles.openData(this.rows.text.url);
        },
        createTextBody() {
            // this.$refs.motionditFiles.dialogForm = true;
            this.$refs.motionditFiles.openData();
        },
        editWordData(data) {
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
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.rows.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/motion_forms/deleteAttachment/' + id)
                            .then(res => {
                                self.rows.attachments.splice(index, 1);
                            });
                    }
                });
            });
        },
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
                                .delete(
                                    '/api/v1/motion_forms/deleteAtt?id=' +
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
        dialogVisiblea() {
            this.dialogVisible = true;
        },
        dialogab() {
            this.submitCheck();
            this.dialogVisible = false;
        },
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        },
        clearForm() {
            this.rows = {
                fileNo: this.numkk,
                title: '',
                creatorName: this.cookie_uname,
                draftTime: moment(new Date()).format('YYYY-MM-DD'),
                organName: this.cookie_oname,
                telephone: '',
                commonUser: '',
                remarks: '',
                chairman: false,
                manager: false,
                attachments: [],
                text: { name: '' }
            };
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/motion_forms/' + this.formId)
                    .then(res => {
                        res.data.text =
                            res.data.text == null
                                ? { name: '' }
                                : JSON.parse(res.data.text);
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
        saveForm1() {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.info = 'saveRuleSucceed';
                    this.$emit('info', this.info);
                    this.saveForm();
                } else {
                }
            });
        },
        saveForm(action = '') {
            const self = this;
            self.rows.text = JSON.stringify(self.rows.text);
            self.clearTime();
            axios
                .post('/api/v1/motion_forms/save', JSON.stringify(this.rows), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.currentFormId = res.data.id;
                    if (action == 'save') {
                        self.submitForm();
                    } else {
                        self.$emit('refreshData');
                        self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
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
        clearTime() {
            this.$refs.motionditFiles.clearTime();
        },
        comment(comment) {
            let self = this;
            axios
                .put(
                    '/api/v1/motion_forms/' + this.currentFormId + '/comment',
                    {
                        content: '提交',
                        node:'提交',
                        action: 'COMMIT',
                    }
                )
                .then(res => {});
        },
        submitCheck() {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm('save');
                }
            });
        },
        submitForm() {
            const self = this;
            axios
                .post('/api/v1/motions/' + this.currentFormId + '/create', '', {
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
        commitForm(processId) {
            const self = this;
            // /api/v1/motion_forms/{id}/commit/{processId}
            axios
                .put(
                    '/api/v1/motion_forms/' +
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
                    self.startProcess();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT',
                needGeneralManager: this.rows.manager,
                needChairman: this.rows.chairman,
                directList: this.seleteUsers
            };
            axios
                .put(
                    '/api/v1/motions/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.comment();
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
        cancelForm() {
            const self = this;
            axios
                .put('/api/v1/motion_forms/' + this.formId + '/cancel', '', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {})
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
                                '/api/v1/motion_forms/deleteAttachment/' + id,
                                '',
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
        getno() {
            const self = this;
            axios.get('/api/v1/motion_forms/getNo').then(res => {
                self.rows.fileNo = res.data;
                self.numkk = res.data;
            });
        },
        deleteItem(index) {
            this.$confirm('是否删除?', '提示', {
                type: 'warning'
            }).then(() => {
                this.tableData.splice(index, 1);
            });
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.attachments.push(item);
                });
            }
        },
        downloadFile(url) {
            window.open(url, '_blank');
        },
        getFormData() {
            return this.rows;
        }
    }
};
</script>
<style lang="scss">
#MotionForm {
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

    // .attachments {
    //     position: relative;
    //     margin-bottom: 40px;
    //     margin-left: 10px;
    //     width: 100px;
    //     height: 120px;
    //     text-align: center;
    //     display: inline-block;
    //     border: 1px solid #c0c4cc;

    //     border-radius: 2px;
    //     cursor: pointer;
    //     img {
    //         width: 100px;
    //         height: 120px;
    //     }

    //     p {
    //         margin: 0;
    //         line-height: 20px;
    //         color: #606266;
    //         overflow: hidden;
    //         text-overflow: ellipsis;
    //         white-space: nowrap;
    //     }

    //     i {
    //         position: absolute;
    //         top: 0;
    //         right: 0;
    //         padding: 5px;
    //         &:hover {
    //             color: red;
    //         }
    //     }
    // }
}
</style>