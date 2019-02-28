<template>
    <div id="IncomingForm">
        <el-form ref="formupdate" :model="rows" label-width="80px" :rules="rules">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="收文类型" prop="type">
                        <el-select v-model="rows.type" placeholder="请选择" @change="getIcommingType(rows.type)">
                            <el-option v-for="item in options_type" :key="item.value_type" :label="item.label_type" :value="item.value_type">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="来文机关" prop="organ" v-show="commonInput">
                        <el-input v-model="rows.organ" placeholder="请填写来文机关"></el-input>
                    </el-form-item>
                    <el-form-item label="来文机关" prop="organ" v-show="childOptions_status">
                        <el-select v-model="rows.organ" placeholder="选择子公司" filterable>
                            <el-option v-for="item in childOptions" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="来文机关" prop="organ" v-show="lastCopy_status">
                        <el-select v-model="rows.organ" placeholder="选择上级阅知，抄送待阅" allow-create filterable>
                            <el-option v-for="item in lastCopyOptions" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="来文字号" prop="wordNo">
                        <el-input v-model="rows.wordNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="份数" prop="numberCopies">
                        <el-input v-model.number="rows.numberCopies"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="收文编号">
                        <el-input v-model="rows.receiptNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收文日期">
                        <el-date-picker v-model="rows.receiptDate" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="紧急程度">
                        <el-select v-model="rows.emergencyLevel" placeholder="请选择">
                            <el-option v-for="item in options_harry" :key="item.value_harryy" :label="item.label_xwfx" :value="item.value_harryy">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="公文标题" prop="title">
                        <el-input v-model="rows.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="便签">
                        <el-input v-model="rows.memo"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                       <!-- <FilesOperate :options="{uploadCommpoent:true,attachmentsList:rows.attachments}"></FilesOperate> -->
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
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
import FilesOperate from "../FilesOperate";
export default {
    name: 'IncomingForm',
    data() {
        return {
            numberValidateForm: {},
            tabledata: [],
            rows: {
                organ: '',
                wordNo: '',
                numberCopies: '',
                receiptNumber: '',
                receiptDate: moment(new Date()).format('YYYY-MM-DD'),
                emergencyLevel: '',
                type: '',
                title: '',
                memo: '',
                attachments: []
            },
            uploadId: 0,
            lastCopy_status: false,
            childOptions_status: false,
            commonInput: true,
            options_harry: [
                {
                    value_harryy: '一般',
                    label_xwfx: '一般'
                },
                {
                    value_harryy: '较急',
                    label_xwfx: '较急'
                },
                {
                    value_harryy: '急',
                    label_xwfx: '急'
                },
                {
                    value_harryy: '特急',
                    label_xwfx: '特急'
                }
            ],
            options_type: [
                {
                    value_type: 'superior',
                    label_type: '上级阅知性文件'
                },
                {
                    value_type: 'group',
                    label_type: '集团收文批办'
                },
                {
                    value_type: 'copy',
                    label_type: '抄送待阅文件'
                },
                {
                    value_type: 'childcom',
                    label_type: '子公司来文'
                }
            ],
            lastCopyOptions: [
                {
                    id: 1,
                    name: '市委'
                },
                {
                    id: 2,
                    name: '市政府'
                },
                {
                    id: 3,
                    name: '市科委'
                },
                {
                    id: 4,
                    name: '中关村管委会'
                }
            ],
            childOptions: [
                {
                    id: 3,
                    name: '北京中关村软件园发展有限责任公司'
                },
                {
                    id: 4,
                    name: '北京中关村生命科学园发展有限责任公司'
                },
                {
                    id: 5,
                    name: '北京中关村科技融资担保有限公司'
                },
                {
                    id: 6,
                    name: '中关村科技租赁有限公司'
                },
                {
                    id: 7,
                    name: '中关村医疗器械园有限公司'
                },
                {
                    id: 8,
                    name: '北京中建中关村生物医药产业投资发展有限公司'
                },
                {
                    id: 9,
                    name: '北京知识产权运营管理有限公司'
                },
                {
                    id: 10,
                    name: '北京中关村延庆园建设发展有限公司'
                },
                {
                    id: 11,
                    name: '北京中关村微纳能源投资有限公司'
                },
                {
                    id: 12,
                    name: '北京中关村集成电路设计园发展有限责任公司'
                },
                {
                    id: 13,
                    name: '中关村协同发展投资有限公司'
                },
                {
                    id: 14,
                    name: '北京中关村协同创新投资基金管理有限公司'
                },
                {
                    id: 15,
                    name: '北京中关村前沿技术产业发展有限公司'
                },
                {
                    id: 16,
                    name: '中关村芯园（北京）有限公司'
                },
                {
                    id: 17,
                    name: '中关村（国际）控股公司'
                },
                {
                    id: 18,
                    name: '北京中科金投资管理有限公司'
                },
                {
                    id: 19,
                    name: '北京中关村领创空间科技服务有限责任公司'
                },
                {
                    id: 20,
                    name: '北京中关村科技创业金融服务集团有限公司'
                },
                {
                    id: 21,
                    name: '北京集成电路产业发展股权投资基金有限公司'
                },
                {
                    id: 22,
                    name: '北京实创高科技发展有限责任公司'
                },
                {
                    id: 23,
                    name: '北京丰台科技园建设发展有限公司'
                },
                {
                    id: 24,
                    name: '北京中关村电子城建设有限公司'
                },
                {
                    id: 25,
                    name: '北京兴昌高科技发展有限公司'
                },
                {
                    id: 26,
                    name: '北京金桥科技产业基地开发有限公司'
                },
                {
                    id: 27,
                    name: '北京光谷科技园开发建设有限公司'
                },
                {
                    id: 28,
                    name: '北京京石科园置业发展有限公司'
                },
                {
                    id: 29,
                    name: '北京东方雍和文化创意投资有限公司'
                },
                {
                    id: 30,
                    name: '北京海开房地产集团公司'
                },
                {
                    id: 31,
                    name: '北京中关村国际孵化器有限公司'
                },
                {
                    id: 32,
                    name: '北京中关村国际环保产业促进中心'
                },
                {
                    id: 33,
                    name: '北京中关村海外科技园有限责任公司'
                },
                {
                    id: 34,
                    name: '天津京津中关村科技城发展有限公司'
                },
                {
                    id: 35,
                    name: '北京领创精准医疗健康产业投资股份公司'
                },
                {
                    id: 36,
                    name: '北京怀柔科学城建设发展有限公司'
                },
                {
                    id: 37,
                    name: '北京中关村京西建设发展有限公司'
                },
                {
                    id: 38,
                    name: '石家庄中关村协同发展有限公司'
                },
                {
                    id: 39,
                    name: '北京中关村信息谷资产管理有限责任公司'
                },
                {
                    id: 40,
                    name: ' 北京工业设计院有限公司'
                }
            ],
            formLabelWidth: '120px',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请输入类型', trigger: 'blur' }
                ],
                organ: [
                    {
                        required: true,
                        message: '请输入来文机关',
                        trigger: 'blur'
                    }
                ],
                // wordNo: [
                //     {
                //         required: true,
                //         message: '请输入来文字号',
                //         trigger: 'blur'
                //     }
                // ],
                // :rules="[{ required: true, type: 'number', message: ''}]"
                numberCopies: [
                    {
                        type: 'number',
                        required: true,
                        message: '份数必须为数字值'
                    }
                ]
            }
        };
    },
    props: ['formId', 'operationType'],
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
    mounted() {
        if (this.operationType == 'edit') {
            this.getForm();
        }
    },
    methods: {
        getId(id) {
            let self = this;
            self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                self.rows.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get("/api/v1/incoming_forms/deleteAtt/" + id)
                            .then(res => {
                                self.rows.attachments.splice(index, 1);
                            });
                    }
                });
            });
        },
        getIcommingType(type) {
            if (type) {
                this.rows.organ = '';
                if (type == 'superior' || type == 'copy') {
                    this.childOptions_status = this.commonInput = false;
                    this.lastCopy_status = true;
                } else if (type == 'childcom') {
                    this.lastCopy_status = this.commonInput = false;
                    this.childOptions_status = true;
                } else {
                    this.lastCopy_status = this.childOptions_status = false;
                    this.commonInput = true;
                }
            }
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/incoming_forms/' + this.formId)
                    .then(res => {
                        self.getIcommingType(res.data.type);
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
        // deleteAttachment(id) {
        //     const self = this;
        //     if (this.rows.attachments.length > 0) {
        //         this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
        //             () => {
        //                 const params = {
        //                     id: id
        //                 };
        //                 axios
        //                     .get('/api/v1/incoming_forms/deleteAtt/' + id, '', {
        //                         headers: {
        //                             'Content-type': 'application/json'
        //                         }
        //                     })
        //                     .then(res => {
        //                         self.rows.attachments.forEach(function(
        //                             item,
        //                             index
        //                         ) {
        //                             if (item.id == id) {
        //                                 self.rows.attachments.splice(index, 1);
        //                             }
        //                         });
        //                     })
        //                     .catch(function() {
        //                         self.$message({
        //                             message: '操作失败',
        //                             type: 'error'
        //                         });
        //                     });
        //             }
        //         );
        //     }
        // },
        saveFormValidate() {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm();
                    this.$emit('saveStatus', false);
                }
            });
        },
        setMemo() {
            const self = this;
            axios
                .post('/api/v1/incoming_forms/setMemo', {
                    memo: self.rows.memo,
                    id: self.currentFormId
                })
                .then(res => {
                    console.log(res);
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
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
                    self.setMemo();
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
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/incoming_forms/${self.currentFormId}/comment`, {
                     node:'提交',
                    content: '提交',
                    action: 'COMMIT',
                })
                .then(res => {});
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
                .then(res => {
                    self.comment();
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
                // type:
                //     self.rows.type == "superior" || self.rows.type == "copy"
                //         ? "READONLY"
                //         : "TODO"
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
        downloadFile(item) {
            // window.open(url, '_blank');
            this.common.preview(item);
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {},
        getFormData() {
            return this.rows;
        },
        clearForm() {
            this.rows = {
                organ: '',
                wordNo: '',
                numberCopies: '',
                receiptNumber: '',
                receiptDate: moment(new Date()).format('YYYY-MM-DD'),
                emergencyLevel: '',
                title: '',
                attachments: [],
                type: ''
            };
        }
    }
};
</script>
<style lang="scss" scoped>
#IncomingForm {
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