<template>
    <div id="ForeignAbroadForm">
        <el-form ref="formupdate" :model="rows" label-width="140px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="组团名称">
                        <el-input v-model="rows.groupName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="组团单位">
                        <el-input v-model="rows.groupOrg"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="出访组团人员">
                        <el-input v-model="rows.visitors"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="申请出国（境）日期">
                        <el-date-picker v-model="rows.visitTime" style="width:100%" type="date"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="目的地">
                        <el-input v-model="rows.visitCountry"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="行程">
                        <el-input v-model="rows.route"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="预算">
                        <el-input v-model="rows.budget"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="费用来源">
                        <el-input v-model="rows.source"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="出访目的">
                        <el-input v-model="rows.purpose"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="出国（境）原因">
                        <el-input v-model="rows.reason"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="出访必要性">
                        <el-input v-model="rows.necessary"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" @click.native="attType='attType1'" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType1'">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
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
import FilesOperate from '../FilesOperate';
export default {
    name: 'ForeignAbroadForm',
    data() {
        return {
            rows: {
                groupName: '',
                groupOrg: '',
                visitors: '',
                visitTime: moment(new Date()).format('YYYY-MM-DD'),
                visitCountry: '',
                route: '',
                budget: '',
                source: '',
                reason: '',
                organName: '',
                creatorName: '',
                purpose: '',
                necessary: '',
                attachments: []
                // "visitTime":"出访时间",
                //   "endTime":"回国时间",
            },
            attType: '',
            cookie_uname: '',
            cookie_oname: '',
            rules: {
                mainTo: [
                    { required: true, message: '请输入主送', trigger: 'change' }
                ],
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入正文', trigger: 'blur' }
                ]
            },
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
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.rows.organName = decodeURIComponent(item.split('=')[1]);
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
    },
    components: {
        FilesOperate
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
        getId(id) {
            const self = this;
            if (this.rows.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/foreign_forms/deleteAtt?id=' + id,
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
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/foreign_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    action: 'COMMIT',
                    node:'提交'
                })
                .then(res => {});
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/foreign_forms/' + this.formId)
                    .then(res => {
                        self.rows = res.data;
                        if (self.rows.visitTime) {
                            self.rows.visitTime = moment(
                                self.rows.visitTime
                            ).format('YYYY-MM-DD');
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
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
        saveForm(action) {
            const self = this;
            if (self.rows.visitTime) {
                self.rows.visitTime = moment(self.rows.visitTime).format(
                    'YYYY-MM-DD HH:mm:ss'
                );
            } else {
                self.rows.visitTime = '';
            }
            axios
                .post('/api/v1/foreign_forms/save', JSON.stringify(this.rows), {
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
            this.saveForm('save');
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/foreigns/' + this.currentFormId + '/create',
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
                    '/api/v1/foreign_forms/' +
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
                    '/api/v1/foreigns/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
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
        handleSuccess(response, file) {
            for (let item of response) {
                this.rows.attachments.push({
                    iconUrl: item.iconUrl,
                    id: item.id,
                    name: item.name,
                    // organId: item.organId,
                    // organName: item.organName,
                    size: item.size,
                    type: item.type,
                    // uid: item.uid,
                    // uname: item.uname,
                    url: item.url,
                    attType: this.attType
                });
            }
        },

        clearForm() {
            this.rows = {
                groupName: '',
                groupOrg: '',
                visitors: '',
                visitTime: moment(new Date()).format('YYYY-MM-DD'),
                visitCountry: '',
                route: '',
                budget: '',
                source: '',
                reason: '',
                purpose: '',
                necessary: '',
                attachments: [],
                organName: this.cookie_oname,
                creatorName: this.cookie_uname
            };
        }
    }
};
</script>
<style lang="scss">
#ForeignAbroadForm {
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