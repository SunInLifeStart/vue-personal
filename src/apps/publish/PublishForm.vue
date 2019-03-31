<template>
    <div id="PublishForm">
        <el-form ref="formupdate" :model="selectItem" label-width="125px" :rules="rules">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="信息标题:" prop="title">
                        <el-input v-model="selectItem.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="信息栏目:" prop="columns">
                        <el-select v-model="selectItem.columns" placeholder="请选择信息类型" style="width:100%">
                            <!-- <el-option label="领导讲话" value="领导讲话"></el-option> -->
                            <el-option label="规章制度" value="规章制度"></el-option>
                            <el-option label="通知公告" value="通知公告"></el-option>
                            <!-- <el-option label="工作简报" value="工作简报"></el-option> -->
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="关键字:">
                        <el-input v-model="selectItem.keyword"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文:">
                        <!-- <div @drop="drop($event)">
                            <el-input type="textarea" v-model="selectItem.content" :autosize="{minRows: 5}"></el-input>
                        </div> -->
                        <FilesOperate v-if="selectItem.text.name" :item="selectItem.text" :options="{preview:true,download:true,edit:true}"   @editText="editText" @getReviseData="getReviseData"></FilesOperate>
                        <el-button type="primary" size="small" @click="createTextBody" v-if="!selectItem.text.name">创建文件</el-button>
                        <PublisheditFiles @editWordData="editWordData" ref="publisheditfiles"></PublisheditFiles>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="附件">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in selectItem.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachment"></FilesOperate>
                            </div>
                            <!--
                            <div class="attachments" v-for="item in selectItem.attachments" :key="item.id" @click="downloadFile(item)">
                                <img class="el-icon-document" :src="item.iconUrl" @dragstart="drag($event)" @dragover="allowDrop($event)">
                                <p :title="item.name">{{item.name}}</p>
                                <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                            </div>
                            -->
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
import PublisheditFiles from "./PublisheditFiles.vue";
export default {
    name: 'PublishForm',
    data() {
        return {
            selectItem: {
                title: '',
                columns: '',
                keyword: '',
                content: '',
                attachments: [],
                dom: '',
                text:{name:''}
            },
            showldjh: false,
            showgzzd: false,
            showtzgg: false,
            showgzjb: false,
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                columns: [
                    { required: true, message: '请输入类型', trigger: 'blur' }
                ],
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ]
            }
        };
    },
    components: {
        FilesOperate,
        PublisheditFiles
    },
    props: ['formId', 'operationType'],
    mounted() {
        // for (let data of this.$store.getters.getMenusByType('publish')) {
        //     if (data.code == 'ldjh') {
        //         this.showldjh = true;
        //     } else if (data.code == 'gzzd') {
        //         this.showgzzd = true;
        //     } else if (data.code == 'tzgg') {
        //         this.showtzgg = true;
        //     } else if (data.code == 'gzjb') {
        //         this.showgzjb = true;
        //     }
        // }

        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }
        self.selectItem.organName =  self.$store.getters.LoginData.oname;
        /** 
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
        */
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
         editText() {
            this.$refs.publisheditfiles.openData(this.selectItem.text.url);
        },

        createTextBody() {
            this.$refs.publisheditfiles.openData();
        },
        editWordData(data) {
            // console.log(data);
            if (!data.url) {
                return false;
            }
            this.selectItem.text = {
                iconUrl: data.icon_url,
                name: data.originalFilename,
                url: data.url,
                path: data.path,
                file_name: data.file_name,
                pdfUrl:
                    data.url.split("files")[0] +
                    "pdf" +
                    data.url.split("files")[1]
            };
        },
        getReviseData(repelaceData) {
            // let self = this;
            // self.$confirm("确定要替换吗，替换后原文件将被删除?", "提示", {
            //     type: "warning"
            // }).then(() => {
            //     self.rows.attachments.forEach(function(value, index) {
            //         if (value.id == repelaceData.id) {
            //             axios
            //                 .delete(
            //                     "/api/v1/outgoing_forms/deleteAtt?id=" +
            //                         repelaceData.id
            //                 )
            //                 .then(res => {
            //                     self.rows.attachments.splice(index, 1);
            //                     self.rows.attachments.push(repelaceData.data);
            //                 });
            //         }
            //     });
            // });
        },
        drag(event) {
            this.dom = event.currentTarget;
        },
        drop(event) {
            event.preventDefault();
            if (this.selectItem.content == '') {
                this.selectItem.content = '<img src="' + this.dom.src + '">';
            } else {
                this.selectItem.content += '\n<img src="' + this.dom.src + '">';
            }
        },
        allowDrop(event) {
            event.preventDefault();
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/publish_forms/' + this.formId)
                    .then(res => {
                          res.data.text =
                        res.data.text 
                            ? JSON.parse(res.data.text): { name: "" };
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
            const self = this;
            self.selectItem.text = JSON.stringify(self.selectItem.text);
            axios
                .post(
                    '/api/v1/publish_forms/save',
                    JSON.stringify(this.selectItem),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.clearTime();
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
        clearTime() {
            this.$refs.publisheditfiles.clearTime();
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
                .post('/api/v1/publish/' + this.currentFormId + '/create', '', {
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
                    '/api/v1/publish_forms/' +
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
                .put(`/api/v1/publish_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    action: 'COMMIT',
                    node: '提交'
                })
                .then(res => {});
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT'
            };
            console.log(params);
            axios
                .put(
                    '/api/v1/publish/' + this.currentFormId + '/signal',
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
                title: '',
                columns: '',
                keyword: '',
                content: '',
                attachments: [],
                text:{name:''}
            };
        }
    }
};
</script>
<style lang="scss">
#PublishForm {
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
    /**
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
    */
}
</style>