<template>
    <div id="InspectForm">
        <el-form ref="selectItem" :model="selectItem" label-width="130px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="标题:">
                        <el-input v-model="selectItem.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="立项人:">
                        <el-input v-model="selectItem.definer" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="立项单位:">
                        <el-input v-model="selectItem.definerUnit" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="被督办部门负责人:">
                        <el-select v-model="selectItem.inspector" @change="getInspectorsId()" filterable placeholder="请选择" style="width:100%">
                            <el-option v-for="item in inspectors" :key="item.id" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="截至日期:">
                        <el-date-picker style="width:100%" type="date" v-model="selectItem.deadline"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <!-- <el-col :span="12">
                    <el-form-item label="反馈频率:">
                        <el-input v-model="selectItem.frequency"></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :span="24">
                    <el-form-item label="备注:">
                        <el-input v-model="selectItem.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="内容:">
                        <el-input type="textarea" :autosize="{minRows: 5}" placeholder="请输入内容" v-model="selectItem.content">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" @click.native="attType='attType1'" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in selectItem.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType1'">
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
    name: 'InspectForm',
    data() {
        return {
            attType: '',
            selectItem: {
                title: '',
                definer: this.cookie_uname,
                definerUnit: this.cookie_oname,
                inspector: '',
                deadline: '',
                frequency: '',
                remark: '',
                content: '',
                attachments: []
            },
            inspectors: [],
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            options: [],
            value: '',
            cookie_uname: '',
            cookie_oname: ''
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
                self.selectItem.definer = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.selectItem.definerUnit = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
        this.getUser();
        this.getInspector();
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
        clearForm() {
            this.selectItem = {
                definer: this.cookie_uname,
                definerUnit: this.cookie_oname,
                title: '',
                inspector: '',
                inspectorId: '',
                deadline: '',
                frequency: '',
                remark: '',
                content: '',
                attachments: []
            };
        },
        getUser() {
            const self = this;
            axios
                .get('/api/v1/users')
                .then(res => {
                    self.options = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getInspector() {
            const self = this;
            axios
                .get('/api/v1/users/role/deptManager')
                .then(res => {
                    self.inspectors = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getInspectorsId() {
            const name = this.selectItem.inspector;
            let iid = '';
            this.inspectors.forEach(function(item) {
                if (item.name == name) {
                    iid = item.id;
                }
            });
            this.selectItem.inspectorId = iid;
            return iid;
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/inspect_forms/' + this.formId)
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
        saveForm(action) {
            const self = this;
            axios
                .post(
                    '/api/v1/inspect_forms/save',
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
        submitCheck() {
            if (this.selectItem.inspector == null) {
                this.$message({
                    message: '请选择被督办部门负责人',
                    type: 'warning'
                });
            } else {
                this.saveForm('save');
            }
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/inspects/' + this.currentFormId + '/create',
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
                    '/api/v1/inspect_forms/' +
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
            let atIds = this.selectItem.inspectorId;
            const self = this;
            const params = {
                action: 'COMMIT',
                assignee: atIds
            };
            axios
                .put(
                    '/api/v1/inspects/' + this.currentFormId + '/signal',
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
                    self.$message({
                        message: '提交成功',
                        type: 'success'
                    });
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
                .put(`/api/v1/inspect_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    action: 'COMMIT',
                    node:'提交'
                })
                .then(res => {});
        },
        handleSuccess(response, file) {
            for (let item of response) {
                this.selectItem.attachments.push({
                    iconUrl: item.iconUrl,
                    id: item.id,
                    name: item.name,
                    size: item.size,
                    type: item.type,
                    url: item.url,
                    attType: this.attType
                });
            }
            console.log(this.selectItem.attachments);
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        getId(id) {
            const self = this;
            if (this.selectItem.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get('/api/v1/inspect_forms/attachment/' + id, '', {
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            })
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
        }
    }
};
</script>
<style lang="scss">
#InspectForm {
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