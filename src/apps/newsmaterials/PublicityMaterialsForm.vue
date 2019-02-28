<template>
    <div id="PublicityMaterialsForm">
        <el-form ref="formupdate" :model="rows" label-width="80px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="标题">
                        <el-input v-model="rows.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="报送单位">
                        <el-input v-model="rows.reportingUnit" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="分类">
                        <el-select v-model="rows.type" placeholder="请选择" style="width: 100%;">
                            <el-option label="宣传册" value="宣传册"></el-option>
                            <el-option label="宣传片" value="宣传片"></el-option>
                            <el-option label="画册" value="画册"></el-option>
                            <el-option label="易拉宝" value="易拉宝"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="联系方式">
                        <el-input v-model="rows.contact"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系人">
                        <el-input v-model="rows.contactUser"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="关键词">
                        <el-input v-model="rows.keywords"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="简介">
                        <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" v-model="rows.introduction"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item)">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
                            <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'PublicityMaterialsForm',
    data() {
        return {
            rows: {
                title: '',
                contact: '',
                contactUser: '',
                reportingUnit: this.cookie_oname,
                introduction: '',
                keywords: '',
                type: '',
                attachments: []
            },
            cookie_oname: '',
            uploadId: 0,
            currentFormId: this.operationType == 'create' ? '' : this.formId
        };
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
                self.rows.creatorName = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > -1) {
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
                self.rows.reportingUnit = decodeURIComponent(
                    item.split('=')[1]
                );
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
            } else {
                this.getForm();
            }
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get(
                        '/api/v1/activity_forms/materials/' +
                            this.formId +
                            '/get'
                    )
                    .then(res => {
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
        saveForm(action = '') {
            const self = this;
            axios
                .post(
                    '/api/v1/activity_forms/materials/save',
                    JSON.stringify(this.rows),
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
            if (this.operationType == 'create') {
                this.saveForm('save');
            } else {
                this.submitForm();
            }
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/materials/' + this.currentFormId + '/create',
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
                    '/api/v1/activity_forms/materials/' +
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
                action: 'COMMIT'
            };
            axios
                .put(
                    '/api/v1/materials/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
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
                                '/api/v1/activity_forms/materials/deleteAtt/' +
                                    id,
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
        deleteItem(index) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
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
            this.$refs.upload.clearFiles();
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {},
        downloadFile(item) {
            this.common.preview(item);
        },
        clearForm() {
            this.rows = {
                title: '',
                contact: '',
                contactUser: '',
                reportingUnit: this.cookie_oname,
                introduction: '',
                keywords: '',
                type: '',
                attachments: []
            };
        }
    }
};
</script>
<style lang="scss">
#PublicityMaterialsForm {
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