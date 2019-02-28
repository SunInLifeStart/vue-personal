<template>
    <div id="SpecMeetingForm">
        <el-form :model="rows" label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="专题会编号">
                        <el-input v-model="rows.wordNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="文件标题">
                        <el-input v-model="rows.numberCopies"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿人">
                        <el-input v-model="rows.receiptNumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="拟稿单位">
                        <el-input v-model="rows.receiptNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿时间">
                        <el-date-picker v-model="rows.receiptDate" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="电话">
                        <el-input v-model="rows.receiptNumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文">
                        <el-input v-model="rows.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input v-model="rows.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item.url)">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
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
    name: 'SpecMeetingForm',
    data() {
        return {
            tabledata: [],
            rows: {
                attachments: []
            },
            uploadId: 0,
            formLabelWidth: '120px',
            currentFormId: this.operationType == 'create' ? '' : this.formId
        };
    },
    props: ['formId', 'operationType'],
    watch: {
        /** 
        formId: function() {
            if (this.operationType == 'edit') {
                this.getForm();
            } else {
                this.rows = {
                    organ: '',
                    wordNo: '',
                    numberCopies: '',
                    receiptNumber: '',
                    receiptDate: '',
                    emergencyLevel: '',
                    title: '',
                    attachments: []
                };
            }
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.rows = {
                    organ: '',
                    wordNo: '',
                    numberCopies: '',
                    receiptNumber: '',
                    receiptDate: '',
                    emergencyLevel: '',
                    title: '',
                    attachments: []
                };
            } else if (this.operationType == 'edit') {
                this.getForm();
            }
        }
        */
    },
    mounted() {
        /** 
        console.log(this.operationType);
        if (this.operationType == 'edit') {
            this.getForm();
        } else if (this.operationType == 'create') {
            this.rows = {
                organ: '',
                wordNo: '',
                numberCopies: '',
                receiptNumber: '',
                receiptDate: '',
                emergencyLevel: '',
                title: '',
                attachments: []
            };
        }
        */
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/incoming_forms/' + this.formId)
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
            if (self.rows.receiptDate) {
                self.rows.receiptDate = moment(self.rows.receiptDate).format(
                    'YYYY-MM-DD hh:mm:ss'
                );
                console.log(this.rows.receiptDate);
            } else {
                self.rows.receiptDate = moment(new Date()).format(
                    'YYYY-MM-DD hh:mm:ss'
                );
            }
            axios
                .post(
                    '/api/v1/incoming_forms/save',
                    JSON.stringify(this.rows),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;
                    self.$emit('refreshData');
                    if (action == 'save') {
                        self.submitForm();
                        self.startProcess();
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
                this.startProcess();
            }
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/incomings/' + this.currentFormId + '/create',
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
                    '/api/v1/incoming_forms/' +
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
                .then(res => {})
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
                action: 'COMMENT'
            };
            axios
                .put(
                    '/api/v1/incomings/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {})
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
#SpecMeetingForm {
    .uploadBtn {
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
        margin-left: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;

        border-radius: 2px;
        cursor: pointer;
        img {
            width: 100px;
            height: 120px;
        }

        p {
            margin: 0;
            line-height: 15px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>