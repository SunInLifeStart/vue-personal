<template>
    <div id="ForeignUploadForm">
        <el-form ref="form" :model="form" label-width="130px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="文档名称" prop="fileName">
                        <el-input v-model="form.fileName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='creatorName' label="下发人">
                        <el-input v-model="form.creatorName" placeholder="" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='organName' label="下发部门">
                        <el-input v-model="form.organName" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <!-- <div class="attachments" v-for="item in form.uploadAtts" :key="item.id" @click="downloadFile(item)">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
                            <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                        </div> -->
                        <div v-for="item in form.uploadAtts" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,download:true,del:true}" @getId="getId"></FilesOperate>
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
    name: 'ForeignUploadForm',
    data() {
        return {
            form: {
                fileName: '',
                creatorName: this.cookie_uname,
                organName: this.cookie_oname,
                uploadAtts: []
            },
            cookie_uname: '',
            cookie_oname: '',
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
            if (item.indexOf('uname') > -1) {
                self.form.creatorName = decodeURIComponent(item.split('=')[1]);
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > -1) {
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
                this.cleanForm();
            } else {
                this.getForm();
            }
        }
    },
    methods: {
        cleanForm() {
            this.form = {
                fileName: '',
                creatorName: this.cookie_uname,
                organName: this.cookie_oname,
                uploadAtts: []
            };
        },
        downloadFile(item) {
            //window.open(url, '_blank');
            this.common.preview(item);
        },
        saveForm1(type = '') {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.saveForm1(type);
                } else {
                }
            });
        },
        saveForm(action = '') {
            const self = this;
            axios
                .post(
                    '/api/v1/foreign_forms/upload/save',
                    JSON.stringify(this.form),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;
                    self.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.$emit('info', false);
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
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/foreign_forms/upload/' + this.formId)
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
                    self.form.uploadAtts.push(item);
                });
            }
        },
        handlePreview() {},
        handleRemove() {},
        getId(id) {
            const self = this;
            if (this.form.uploadAtts.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/foreign_forms/upload/deleteAtt?id=' +
                                    id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.form.uploadAtts.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.form.uploadAtts.splice(index, 1);
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
#ForeignUploadForm {
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