<template>
    <div id="DiscussionForm">
        <el-form :model="rows" label-width="150px" ref="formupdate">
            <el-row>
                <el-col :span="8" :offset="16">
                    <el-form-item label="流水号:">
                        <el-input v-model="rows.number"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="提单人" prop="numbers">
                        <el-input v-model="rows.creatorName" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属部门" prop="filetitle">
                        <el-input v-model="rows.organName" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="提单时间">
                        <el-date-picker v-model="rows.committed" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" :disabled="true">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="提请部门">
                        <el-input v-model="rows.applyDepartment" placeholder="请输入拟稿单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="提请时间">
                        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="rows.timeApplication" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="议题名称">
                        <el-input v-model="rows.topicName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <table class="tableNoBorder">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="参会部门" prop="phone">
                            <tr v-for="(item,index) in rows.attendingDepartment" :key="index" @contextmenu.prevent="deleteItem(item,index,'message')">
                                <td colspan="4" style="width: 21%;">
                                    <el-select v-model="item.department" placeholder="请输入参会部门" @change="">
                                        <el-option v-for="i in options"
                                                   :key="i.value"
                                                   :label="i.label"
                                                   :value="i.value">
                                                   <!--:value="{value:i.value, label: i.label}">-->
                                        </el-option>
                                    </el-select>
                                </td>
                                <td colspan="4">
                                    <el-select style="width: 100%" v-model="item.people" multiple @change="changePeople" placeholder="请选择人员">
                                        <el-option
                                                v-for="i in options"
                                                :key="i.value"
                                                :label="i.label"
                                                :value="i.value">
                                                <!--:value="{value:i.value, label: i.label}">-->
                                        </el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="8" style="height: 30px;">
                                    <span @click="addItem('message')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                </td>
                            </tr>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="提请事项" prop="content">
                            <tr v-for="(item,index) in rows.requestedItems" :key="index" @contextmenu.prevent="deleteItem(item,index,'personal')">
                                <td colspan="8" style="width: 20%;">
                                    <el-input v-model="item.content" placeholder="请输入提请事项"></el-input>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="8" style="height: 30px;">
                                    <span @click="addItem('personal')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                </td>
                            </tr>
                        </el-form-item>
                    </el-col>
                </el-row>
            </table>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="会议材料及附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="各级领导意见及审批">
                        <el-input v-model="rows.idea" :disabled="true"></el-input>
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
    name: 'DiscussionForm',
    data() {
        return {
            tabledata: [],
            options: [
                {
                    value: '1',
                    label: '主管部门'
                },
                {
                    value: '2',
                    label: '部门'
                }
            ],
            rows: {
                attachments: [],
                attendingDepartment: [{
                    people: [],
                    department: ''
                }],
                requestedItems: [{}],
                numbers: '',
                created: '',
                // comments: [],
                idea: '',
                committed: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                applyDepartment: this.$store.getters.LoginData.oname || '',
                timeApplication: '',
                topicName: '',
                organName: this.$store.getters.LoginData.oname || '',
                creatorName: this.$store.getters.LoginData.uname || '',
                creatorId: this.$store.getters.LoginData.uid || '',
                organId: this.$store.getters.LoginData.oid || ''
            },
            users: [],
            uploadId: 0,
            formLabelWidth: '120px',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                // numbers: [
                //     {
                //         required: true, //是否必填
                //         trigger: 'blur', //何事件触发
                //         message: '请输入专题会编号'
                //     }
                // ]
            }
        };
    },
    props: ['formId', 'operationType'],
    components: {
        FilesOperate
    },
    watch: {
        formId: function() {
            if (this.operationType == 'edit') {
                this.getForm();
            } else {
                this.clearForm();
            }
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
            } else if (this.operationType == 'edit') {
                this.getForm();
            }
        }
    },
    mounted() {
        const cookieItems = document.cookie.split(';');
        for (let item of cookieItems) {
            if (item.indexOf('uname') > -1) {
                this.rows.drafter = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > -1) {
                this.rows.draftUnit = decodeURIComponent(item.split('=')[1]);
            }
        }
        if (this.operationType == 'edit') {
            this.getForm();
        } else if (this.operationType == 'create') {
        }
    },
    methods: {
        changePeople() {
            this.$forceUpdate()
        },
        deleteItem(item, index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (type == 'message') {
                    if (item.id) {
                        // axios
                        //     .get('/api/v1/travel_forms/delEvection/' + item.id)
                        //     .then(res => {
                        this.rows.attendingDepartment.splice(index, 1);
                            // })
                            // .catch(function() {
                            //     self.$message({
                            //         message: '操作失败',
                            //         type: 'error'
                            //     });
                            // });
                    } else {
                        this.rows.attendingDepartment.splice(index, 1);
                    }
                } else if (type == 'personal') {
                    this.rows.requestedItems.splice(index, 1);
                }
            });
        },
        addItem(type) {
            if (type == 'message') {
                this.rows.attendingDepartment.push({});
            } else if (type == 'personal') {
                this.rows.requestedItems.push({})
            }
        },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.rows.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/board_meeting_forms/deleteAtt/' + id)
                            .then(res => {
                                self.rows.attachments.splice(index, 1);
                            });
                        self.rows.attachments.splice(index, 1);
                    }
                });
            });
        },
        getUserList() {
            axios.get('/api/v1/users', '').then(res => {
                this.users = res.data;
            });
        },
        clearForm() {
            this.rows =  {
                attachments: [],
                attendingDepartment: [{
                    people: [],
                    department: ''
                }],
                requestedItems: [{}],
                numbers: '',
                created: '',
                // comments: [],
                idea: '',
                committed: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                applyDepartment: this.$store.getters.LoginData.oname || '',
                timeApplication: '',
                topicName: '',
                organName: this.$store.getters.LoginData.oname || '',
                creatorName: this.$store.getters.LoginData.uname || '',
                creatorId: this.$store.getters.LoginData.uid || '',
                organId: this.$store.getters.LoginData.oid || ''
            }
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/issuesReported/detail/' + this.formId)
                    .then(res => {
                        //res.data.delegate = res.data.delegate.split(",");
                        self.rows = res.data.content;
                        if (self.rows.attendingDepartment) {
                            self.rows.attendingDepartment.forEach(item => {
                                if (item.person) {
                                    item.people = item.person.split(',')
                                }
                            })
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
        saveFormValidate(type) {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                    this.$emit('saveStatus', false);
                }
            });
        },
        saveForm(action = '') {
            const self = this;
            self.rows.attendingDepartment.forEach(item => {
                if (item.people) {
                    item.person = item.people.join(',')
                }
            })
            axios
                .post(
                    '/issuesReported/save',
                    JSON.stringify(self.rows),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;
                    if (self.operationType == 'create') {
                        self.clearForm();
                    }
                    if (action == 'submit') {
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
        submitCheck() {},
        // submitForm() {
        //     const self = this;
        //     axios
        //         .post(
        //             '/api/v1/board_meetings/' + this.currentFormId + '/create',
        //             '',
        //             {
        //                 headers: {
        //                     'Content-type': 'application/json'
        //                 }
        //             }
        //         )
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
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/board_meeting_forms/' +
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
                    self.comment();
                    this.startProcess();
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
                .put(
                    `/api/v1/board_meeting_forms/${self.currentFormId}/comment`,
                    {
                        content: '提交',
                        action: 'COMMIT',
                        node: '提交'
                    }
                )
                .then(res => {});
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT'
            };
            axios
                .put(
                    '/api/v1/board_meetings/' + this.currentFormId + '/signal',
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
                                '/api/v1/board_meeting_forms/deleteAtt/' + id,
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
#DiscussionForm {
    .tableNoBorder {
        width: 100%;
        table-layout: fixed;
        word-break: break-all;
        border-collapse: collapse;
    }
    table td,
    table th {
        border: 1px solid #DBDFE6;
        color: #000;
        height: 35px;
        vertical-align: middle;
        .span1{
            color:red;
            margin-right: 5px;
        }
    }
    table thead th {
        background-color: #cce8eb;
    }
    table tr:nth-child(odd) {
        background: #fff;
    }
    table tr:nth-child(even) {
        background: #fff;
    }
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
}
</style>
<style scoped>
    .tableNoBorder >>> .el-input--small .el-input__inner{
        border: none;
    }
</style>