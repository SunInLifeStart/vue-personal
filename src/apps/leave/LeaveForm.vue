<template>
    <el-dialog title="请休假申请表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="80%" style="text-align: center;">
        <div id="leavelForm">
            <el-form :model='formData' class="demo-form-inline" ref="formupdate">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水单号：">{{formData.no}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <table style="width: 100%; table-layout: fixed; word-break: break-all;">
                    <col style="width: 14%" />
                    <col style="width: 12%" />
                    <col style="width: 14%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 16%" />
                    <col style="width: 16%" />
                    <col style="width: 10%" />
                    <tr>
                        <td colspan="8" style="font-weight:bold;">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">
                            提单人
                        </td>
                        <td colspan="1">
                            <el-input v-model="formData.uname" disabled="disabled"></el-input>
                        </td>
                        <td colspan="1">
                            所属部门
                            <!-- <span class="span1">*</span>  -->
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.oname"></el-input>
                        </td>
                        <td colspan="1">申请时间</td>
                        <td colspan="2">
                            <el-date-picker style="width:100%" disabled="disabled" v-model="formData.applyTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime">
                            </el-date-picker>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="1">
                            <!-- <span class="span1">*</span> -->
                            申请缘由
                        </td>
                        <td colspan="7">
                            <!-- <el-input v-model="formData.reason"></el-input> -->
                            <el-input type="textarea" placeholder="" v-model="formData.reason" :autosize="{ minformData: 4, maxformData: 30}">
                            </el-input>

                        </td>
                    </tr>
                    <tr>
                        <td colspan="1">申请休假种类</td>
                        <td colspan="1">
                            <el-select v-model="formData.type" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                        <td colspan="1">拟休时间</td>
                        <td colspan="2">
                            <template>
                                <el-date-picker v-model="formData.startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="开始时间" @input="getTime()">
                                </el-date-picker>
                            </template>
                        </td>
                        <td colspan="2">
                            <template>
                                <el-date-picker v-model="formData.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="结束时间" @input="getTime()">
                                </el-date-picker>
                            </template>
                        </td>

                        <td colspan="1">
                            <el-input placeholder="休假时长" v-model="formData.day">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <span style="color:#06940c">附件上传</span>
                            </el-upload>
                        </td>
                        <td colspan="6">
                            <div class="attachments" v-for="item in formData.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                                <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                            </div>
                        </td>
                    </tr>

                </table>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="default" @click="saveFormValidate()">保存</el-button>
            <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
        </div>
    </el-dialog>

</template>
<script>
import { CURRENCY } from '../data.js';
import moment from 'moment';
import axios from 'axios';
import cookies from 'js-cookie';
import FilesOperate from '../FilesOperate';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'leavelForm',
    data() {
        return {
            dialogFormVisible: false,
            submissionSelections: [],
            getoid: '',
            options: [
                {
                    value: '1',
                    label: '事假'
                },
                {
                    value: '2',
                    label: '病假'
                },
                {
                    value: '3',
                    label: '婚假'
                },
                {
                    value: '4',
                    label: '产假'
                },
                {
                    value: '5',
                    label: '丧假'
                },
                {
                    value: '6',
                    label: '工伤假'
                },
                {
                    value: '7',
                    label: '年休假'
                },
                {
                    value: '8',
                    label: '其他'
                }
            ],
            formData: {
                no: '',
                uname: '',
                oname: '',
                reason: '',
                type: '',
                startTime: '',
                endTime: '',
                attachments: [],
                applyTime: moment()
                    // .utc()
                    .format('YYYY-MM-DD HH:mm:ss')
            },
            users: [],
            // currentFormId: this.operationType == 'create' ? '' : this.formId,
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
            },
            bigtype: '',
            getclass: [],
            dataaa: [],
            cookie_uid: cookies.get('uid'),
            vacancy: [],
            appFlowName: "motor-holiday_leave",
        };
    },
    mounted() {
        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }
        // const cookieItems = document.cookie.split(';');
        // cookieItems.forEach(function(item) {
        //     if (item.indexOf('uname') > 0) {
        //         self.formData.uname = decodeURIComponent(item.split('=')[1]);
        //         self.cookie_uname = decodeURIComponent(item.split('=')[1]);
        //     }
        //     if (item.indexOf('oname') > 0) {
        //         self.formData.oname = decodeURIComponent(item.split('=')[1]);
        //         self.cookie_oname = decodeURIComponent(item.split('=')[1]);
        //     }
        // });
        self.getNum();
    },
    watch: {
        'formData.lowercase'(val) {
            this.formData.upper = val ? this.convertCurrency(val) : '';
        }
    },
    components: {
        FilesOperate
    },
    methods: {
        getNum() {
            const self = this;
            axios
                .get('/api/v1/motor-holiday/getNo', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    this.formData.no = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        setDataFromParent(data) {
            this.formData = data;
            for(let item of this.options){
                if(item.value == this.formData.type){
                    this.formData.type = item.label
                }
            }
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
        },
        resetForm() {
            let formData = {
                attachments: [],
                uname: cookies.get('uname'), //申请人
                oname: cookies.get('oname'), //所属部门
                no: this.formData.no,
                id: '',
                applyTime: moment().format('YYYY-MM-DD HH:mm:ss'), //提单时间
                isAnnualPlan: 'true',
                draftUnit: '',
                draftTime: [],
                startTime: '',
                endTime: '',
                participant: '',
                processId: '',
                type: '事假',
                suggestion: '',
                consts: '',
                upper: '',
                lowercase: '',
                schedule: '',
                remarks: '',
                writer: '',
                trainingTime: []
                //  created: moment(new Date()).format("YYYY-MM-DD")
            };
            return formData;
        },
        saveFormValidate(type) {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            for(let item of $self.options){
                if($self.formData.type == item.label){
                    $self.formData.type = item.value
                }

            } 
            let response
            if($self.formData.id){
                response = await $self.saveFormData(
                    '/api/v1/motor-holiday/update',
                    $self.formData
                );
            }else{
                response = await $self.saveFormData(
                    '/api/v1/motor-holiday/save',
                    $self.formData
                );

            }
            if (response) {
                $self.formId = response.data.content;
                $self.dialogFormVisible = false;
                if (params) {
                    $self.msgTips("提交成功", "success");
                    if (this.createForm_status) {
                        $self.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                    } else {                              
                        let actions = await $self.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                       
                        actions.data.types = actions.data.types.filter(
                            function(item) {
                                return item.action == "COMMIT";
                            }
                        );
                         console.log(actions.data.types)
                       await $self.startSignal(actions.data.types[0]);
                       $self.emitMessage();
                    }
                } else {
                    $self.msgTips('保存成功', 'success');
                    if (this.createForm_status) {
                        $self.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                    } else {
                        $self.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                    }
                }
            } else {
                if (params) {
                    $self.msgTips($self, '提交失败', 'warning');
                } else {
                    $self.msgTips($self, '保存失败', 'warning');
                }
            }
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.formData.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {},
        deleteAttachment(id) {
            if (this.formData.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        for (let i = 0; i <= this.formData.attachments.length; i++) {
                            if (this.formData.attachments[i].id == id) {
                                let aa = this.formData.attachments.splice(i, 1);
                            }
                        }
                    }
                );
            }
        },
    }
};
</script>
<style lang="scss">
#leavelForm {
    table {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        width: 100%;
    }
    table td,
    table th {
        border: 1px solid #000;
        color: #000;
        height: 40px;
        vertical-align: middle;
        .span1 {
            color: red;
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
    .attachments {
        position: relative;
        // margin-bottom: 40px;
        margin-right: 30px;
        width: 200px;
        // height: 80px;
        display: inline-block;
        cursor: pointer;
        p {
            margin: 0;
            line-height: 20px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 20px;
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
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 180px;
    }
    .el-input--suffix .el-input__inner {
        padding-right: 0;
    }
    .el-cascader {
        width: 100%;
    }
    #moneyright {
        .el-input__inner {
            text-align: right;
        }
    }
    .notice {
        color: red;
        ol {
            font-size: 17px;
        }
    }
}
</style>