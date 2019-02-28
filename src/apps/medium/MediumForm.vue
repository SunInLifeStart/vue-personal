<template>
    <div id="MediumForm">
        <el-form ref="formupdate" :model="selectItem" label-width="100px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="媒体名称:">
                        <el-input v-model="selectItem.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报道日期:">
                        <el-date-picker v-model="selectItem.date" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="新闻标题:">
                        <el-input v-model="selectItem.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="媒体链接:">
                        <el-input v-model="selectItem.href"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="报道单位:">
                        <el-input v-model="selectItem.organName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="报道附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div class="attachments" v-for="item in selectItem.attachments" :key="item.id" @click="downloadFile(item)">
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
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'MediumForm',
    data() {
        return {
            selectItem: {
                reportingUnit: this.organName,
                title: '',
                href: '',
                name: '',
                // date: '',
                attachments: [],
                organName: ''
            },
            cookie_uname: '',
            cookie_oname: '',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            pickerOptions1: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    },
                    {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    },
                    {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }
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
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.selectItem.manager = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.selectItem.organName = decodeURIComponent(
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
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/activity_forms/media/' + this.formId)
                    .then(res => {
                        self.selectItem = res.data;
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
            if (this.selectItem.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/activity_forms/media/deleteAtt/' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.selectItem.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.selectItem.attachments.splice(
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
        saveFormValidate() {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm();
                    this.$emit('saveStatus', false);
                }
            });
        },
        saveForm(action = '') {
            console.log(this.selectItem);
            const self = this;
            axios
                .post(
                    '/api/v1/activity_forms/media/save',
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
                    if (this.operationType == 'create') {
                        this.saveForm('save');
                        this.$emit('saveStatus', false);
                    } else {
                        this.submitForm();
                        this.$emit('saveStatus', false);
                    }
                }
            });
        },
        // submitForm() {
        //     const self = this;
        //     axios
        //         .post('/api/v1/publish/' + this.currentFormId + '/create', '', {
        //             headers: {
        //                 'Content-type': 'application/json'
        //             }
        //         })
        //         .then(res => {
        //             if (res.data.id != '') {
        //                 self.commitForm(res.data.id);
        //             }
        //         })
        //         .catch(function() {
        //             self.$message({
        //                 message: '操作失败',
        //                 type: 'error'
        //             });
        //         });
        // },
        // commitForm(processId) {
        //     const self = this;
        //     axios
        //         .put(
        //             '/api/v1/publish_forms/' +
        //                 this.currentFormId +
        //                 '/commit/' +
        //                 processId,
        //             '',
        //             {
        //                 headers: {
        //                     'Content-type': 'application/json'
        //                 }
        //             }
        //         )
        //         .then(res => {
        //             self.startProcess();
        //         })
        //         .catch(function() {
        //             self.$message({
        //                 message: '操作失败',
        //                 type: 'error'
        //             });
        //         });
        // },
        // startProcess() {
        //     const self = this;
        //     const params = {
        //         action: 'COMMIT'
        //     };
        //     console.log(params);
        //     axios
        //         .put(
        //             '/api/v1/publish/' + this.currentFormId + '/signal',
        //             JSON.stringify(params),
        //             {
        //                 headers: {
        //                     'Content-type': 'application/json'
        //                 }
        //             }
        //         )
        //         .then(res => {
        //             self.$emit('refreshData');
        //         })
        //         .catch(function() {
        //             self.$message({
        //                 message: '操作失败',
        //                 type: 'error'
        //             });
        //         });
        // },
        deleteItem(index) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.tableData.splice(index, 1);
            });
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.selectItem.attachments.push(item);
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
                reportingUnit: this.organName,
                title: '',
                href: '',
                name: '',
                date: '',
                attachments: [],
                organName: this.cookie_oname
            };
        }
    }
};
</script>
<style lang="scss">
#MediumForm {
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