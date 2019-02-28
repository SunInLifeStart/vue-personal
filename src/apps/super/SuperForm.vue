<template>
    <div id="SuperForm">
        <el-form ref="formupdate" :model="selectItem" label-width="125px" :rules="rules">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="信息标题:">
                        <el-input v-model="selectItem.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="信息栏目:" prop="type">
                        <el-select v-model="selectItem.type" placeholder="请选择信息类型" @change="changeType" style="width:100%">
                            <!-- <el-option label="通知公告" value="通知公告"></el-option> -->
                            <el-option label="政策要闻" value="政策要闻"></el-option>
                            <el-option label="法规制度" value="法规制度"></el-option>
                            <el-option label="宣传教育" value="宣传教育"></el-option>
                            <el-option label="工作动态" value="工作动态"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="时间:">
                        <el-date-picker style="width:100%" v-model="selectItem.created" type="date" disabled>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="草拟人:">
                        <el-input v-model="selectItem.grassUser"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="草拟单位:">
                        <el-input v-model="selectItem.grassUserUnit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文:">
                        <div v-loading="loading">
                            <VueEditor style="width: 100%" useCustomImageHandler @imageAdded="handleImageAdded" :editorToolbar="customToolbar" v-model="selectItem.content"></VueEditor>
                        </div>
                        <!-- <textarea v-model="selectItem.content" style="height:130px;width:100%"></textarea> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="发布到">
                    <el-col :span="6">
                        <el-checkbox label="集团网站" v-model="selectItem.toSite"></el-checkbox>
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox label="集团门户" v-model="selectItem.toPortal"></el-checkbox>
                    </el-col>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="附件">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <!-- <div class="attachments" v-for="item in selectItem.attachmentforSRs" :key="item.id" @click="downloadFile(item)">
                                <img class="el-icon-document" :src="item.iconUrl">
                                <p :title="item.name">{{item.name}}</p>
                                <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                            </div> -->
                            <div v-for="item in selectItem.attachmentforSRs" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
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
import { VueEditor } from 'vue2-editor';
export default {
    name: 'SuperForm',
    data() {
        return {
            selectItem: {
                title: '',
                type: '',
                created: moment(new Date()).format('YYYY-MM-DD'),
                grassUser: '',
                grassUserUnit: '',
                content: '',
                attachmentforSRs: [],
                toSite: '',
                toPortal: ''
            },
            cookie_uname: '',
            cookie_oname: '',
            cookie_uid: '',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                type: [
                    { required: true, message: '请输入类型', trigger: 'blur' }
                ]
            },
            loading: false,
            customToolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ align: [] }],
                ['image'],

                [{ size: [] }],

                [{ color: [] }, { background: [] }]
            ]
        };
    },
    components: {
        FilesOperate,
        VueEditor
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
                self.selectItem.grassUser = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.selectItem.grassUserUnit = decodeURIComponent(
                    item.split('=')[1]
                );
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
                this.clearForm();
            }
        }
    },
    methods: {
        handleImageAdded: function(file, Editor, cursorLocation) {
            var formData = new FormData();
            formData.append('files', file);
            axios
                .post('/api/v1/files/upload', formData)
                .then(res => {
                    let url = res.data[0].url;
                    Editor.insertEmbed(cursorLocation, 'image', url);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        changeType() {
            const self = this;
            let booean = false;
            if (this.selectItem.type == '工作动态') {
                booean = true;
            }
            self.$emit('showCommit', booean);
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/super_forms/' + this.formId)
                    .then(res => {
                        self.selectItem = res.data;
                        if (self.selectItem.created) {
                            self.selectItem.created = moment(
                                self.selectItem.created
                            ).format('YYYY-MM-DD');
                        }
                        //this.changeType();
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        deleteAttachment(id) {
            const self = this;
            if (this.selectItem.attachmentforSRs.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .delete(
                                '/api/v1/publish_forms/deleteAtt?id=' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.selectItem.attachmentforSRs.forEach(
                                    function(item, index) {
                                        if (item.id == id) {
                                            self.selectItem.attachmentforSRs.splice(
                                                index,
                                                1
                                            );
                                        }
                                    }
                                );
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
        saveFormValidate() {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm();
                    this.$emit('saveStatus', false);
                }
            });
        },
        saveForm(action = '') {
            const self = this;
            this.selectItem.created = moment(this.selectItem.created).format(
                'YYYY-MM-DD hh:mm:ss'
            );
            axios
                .post(
                    '/api/v1/super_forms/save',
                    JSON.stringify(this.selectItem),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;

                    if (action == 'save') {
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
        submitCheck() {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm('save');
                    this.$emit('saveStatus', false);
                }
            });
        },
        submitForm() {
            const self = this;
            axios
                .post('/api/v1/supers/' + this.currentFormId + '/create', '', {
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
            axios
                .put(
                    '/api/v1/super_forms/' +
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
        comment() {
            let self = this;
            axios
                .put(`/api/v1/super_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    node:'提交',
                    action: 'COMMIT',
                })
                .then(res => {});
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT',
                type: this.selectItem.type
            };
            axios
                .put(
                    '/api/v1/supers/' + this.currentFormId + '/signal',
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
                    self.comment();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        deleteItem(index) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.tableData.splice(index, 1);
            });
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.selectItem.attachmentforSRs.push(item);
                });
            }
        },
        downloadFile(item) {
            // window.open(url, '_blank');
            this.common.preview(item);
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {},
        clearForm() {
            this.selectItem = {
                title: '',
                type: '',
                created: moment(new Date()).format('YYYY-MM-DD'),
                grassUser: this.cookie_uname,
                grassUserUnit: this.cookie_oname,
                content: '',
                attachmentforSRs: [],
                toSite: '',
                toPortal: ''
            };
        },
        getReviseData(repelaceData) {
            let self = this;
            self
                .$confirm('确定要替换吗，替换后原文件将被删除?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    self.selectItem.attachmentforSRs.forEach(function(
                        value,
                        index
                    ) {
                        if (value.id == repelaceData.id) {
                            axios
                                .get(
                                    '/api/v1/super_forms/deleteAttachment/' +
                                        repelaceData.id
                                )
                                .then(res => {
                                    self.selectItem.attachmentforSRs.splice(
                                        index,
                                        1
                                    );
                                    self.selectItem.attachmentforSRs.push(
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
                self.selectItem.attachmentforSRs.forEach(function(
                    value,
                    index
                ) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/super_forms/deleteAttachment/' + id)
                            .then(res => {
                                self.selectItem.attachmentforSRs.splice(
                                    index,
                                    1
                                );
                            });
                    }
                });
            });
        }
    }
};
</script>
<style lang="scss">
#SuperForm {
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

    .attachments {
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
}
</style>