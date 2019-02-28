<template>
    <div id="SupplyTypeForm">
        <el-form :model="rows" ref="formupdate" label-width="80px" :rules="rules">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="名称">
                        <el-input v-model="rows.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="编号">
                        <el-input v-model="rows.serial"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="规格">
                        <el-input v-model="rows.specification"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="数量" prop="quantity">
                        <!--onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"-->
                        <el-input v-model.number="rows.quantity" type="number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单位">
                        <el-input v-model="rows.unit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单价">
                        <el-input v-model="rows.price">
                            <template slot="append">元</template>
                        </el-input>

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="用品分类">
                        <el-select v-model="rows.typeId" placeholder="请选择">
                            <el-option v-for="item in oprationType" :key="item.id" :label="item.type" :value="item.type">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="图片">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" v-show="this.rows.attachments.length == 0" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :before-upload="beforeAvatarUpload" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true}" @getId="deleteAttachment"></FilesOperate>
                        </div>
                        <!--
                        <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item)">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
                            <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                        </div>
                        -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="描述">
                        <el-input type="textarea" :autosize="{minRows: 5}" v-model="rows.depict"></el-input>
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
    name: 'SupplyTypeForm',
    data() {
        return {
            rows: {
                name: '',
                serial: '',
                specification: '',
                quantity: '',
                unit: '',
                price: '',
                typeId: '',
                attachments: [],
                depict: '',
                creatorName: '',
                organName: '',
                oid: '',
                uid: ''
            },
            uploadId: 0,
            cookie_uname: '',
            cookie_oname: '',
            cookie_uid: '',
            cookie_oid: '',
            oprationType: [],
            formLabelWidth: '120px',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                quantity: [
                    { required: true, message: '数量不能为空' },
                    { type: 'number', message: '数量必须为数字值' }
                ]
            }
        };
    },
    components: {
        FilesOperate
    },
    props: ['formId', 'operationType'],
    watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
                this.getType();
            } else {
                this.getType();
                this.getForm();
            }
        }
    },
    mounted() {
        const self = this;
        this.getType();
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
            if (item.indexOf('oid') > -1) {
                self.rows.oid = decodeURIComponent(item.split('=')[1]);
                self.cookie_oid = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('uid') > -1) {
                self.rows.uid = decodeURIComponent(item.split('=')[1]);
                self.cookie_uid = decodeURIComponent(item.split('=')[1]);
            }
        });
    },
    methods: {
        handleInput(e) {
            let a = e.key.replace(/[^\d]/g, '');
            if (!a) {
                e.preventDefault();
            }
            this.rows.quantity = a;
        },
        trim(e) {
            this.rows.quantity = e.target.value.replace(/[^\d]/g, '');
        },
        beforeAvatarUpload(file) {
            console.log(file);
            if (
                file.type != '' &&
                'image/jpg,image/jpeg,image/png,image/pjpeg,image/gif,image/bmp,image/x-png'.includes(
                    file.type
                )
            ) {
                return true;
            } else {
                this.$message({
                    message: '格式不对，请选择图片格式',
                    type: 'error'
                });
                return false;
            }
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/supply_forms/supplies/' + this.formId)
                    .then(res => {
                        res.data.quantity = parseInt(res.data.quantity);
                        self.rows = res.data;
                        if (self.rows.classify != null) {
                            self.rows.typeId = self.rows.classify;
                        } else {
                            self.rows.typeId = '';
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
        getType() {
            const self = this;
            const params = {};
            axios
                .post(
                    '/api/v1/supply_forms/type/query',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.oprationType = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        handleExceed(files, fileList) {
            this.$message.warning('当前只能传一张图片');
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
                                '/api/v1/supply_forms/supplies/deleteAtt/' + id,
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
        saveFormValidate() {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm();
                    this.$emit('saveStatusType', false);
                }
            });
        },
        saveForm() {
            const self = this;
            self.rows.classify = self.rows.typeId;
            self.rows.quantity = String(self.rows.quantity);
            self.rows.picture =
                self.rows.attachments && self.rows.attachments.length > 0
                    ? self.rows.attachments[0].iconUrl
                    : '';
            axios
                .post(
                    '/api/v1/supply_forms/supplies/save',
                    JSON.stringify(self.rows),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
                    if (this.operationType == 'edit') {
                        self.$emit('refreshDetailForm');
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
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
        handlePreview() {},
        handleRemove() {},
        clearForm() {
            this.getType();
            this.rows = {
                name: '',
                serial: '',
                specification: '',
                quantity: '',
                unit: '',
                price: '',
                typeId: '',
                creatorName: this.cookie_uname,
                organName: this.cookie_oname,
                oid: this.cookie_oid,
                uid: this.cookie_uid,
                attachments: [],
                depict: ''
            };
        }
    }
};
</script>
<style lang="scss" scoped>
#SupplyTypeForm {
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