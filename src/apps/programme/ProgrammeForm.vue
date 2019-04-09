<template>
    <el-dialog title="采购方案审批表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="ProgrammeForm">
            <el-form :model="formData" label-width="140px" ref="formupdate">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号:">
                            <el-input v-model="formData.number"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="项目名称" prop="numbers">
                            <el-input v-model="formData.creatorName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购项目名称" prop="filetitle">
                            <el-input v-model="formData.organName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购标的简述">
                            <el-input v-model="formData.committed"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="采购业务类别" style="text-align: left">
                            <el-radio-group v-model="formData.radio">
                                <div v-for="item in radioOption">
                                    <el-radio
                                            :key="item.value"
                                            :value="item.value"
                                            :label="item.label">
                                    </el-radio>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="采购方案是否是规定情形">
                            <el-radio-group v-model="formData.radio">
                                <el-radio key="1" value="1" label="是"></el-radio>
                                <el-radio key="2" value="2" label="否"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购发起时间">
                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formData.organName" style="width:100%" type="date">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购主责部门">
                            <el-input v-model="formData.organName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="采购预估金额(元)">
                            <el-input v-model="formData.organName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目标成本/预算金融(元)">
                            <el-input v-model="formData.organName"></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="采购主责部门">-->
                            <!--<el-input v-model="formData.organName"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                </el-row>
                <table class="tableNoBorder">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="供应商入围情况" prop="phone">
                                <tr style="backgorund:#ccc">
                                    <th colspan="8">推荐采购入围名单</th>
                                    <th colspan="2">考察结论</th>
                                </tr>
                                <tr style="backgorund:#ccc">
                                    <th colspan="2">序号</th>
                                    <th colspan="2">名称</th>
                                    <th colspan="2">企业性质</th>
                                    <th colspan="2">注册资金</th>
                                    <th colspan="2">  </th>
                                </tr>
                                <tr v-for="(item,index) in formData.attendingDepartment" :key="index" @contextmenu.prevent="deleteItem(item,index,'message')">
                                    <td colspan="2" style="width: 50px;">
                                        {{index + 1}}
                                    </td>
                                    <td colspan="2">
                                        <el-input v-model="formData.organName" placeholder="请输入名称"></el-input>
                                    </td>
                                    <td colspan="2">
                                        <el-input v-model="formData.organName" placeholder="请输入企业性质"></el-input>
                                    </td>
                                    <td colspan="2">
                                        <el-input v-model="formData.organName" placeholder="请输入注册资金(元)"></el-input>
                                    </td>
                                    <td colspan="2">
                                        <el-input v-model="formData.organName" placeholder="请输入考察结论"></el-input>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="10" style="height: 30px;">
                                        <span @click="addItem('message')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                    </td>
                                </tr>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </table>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="采购方式">
                            <el-radio-group v-model="formData.radio">
                                <el-radio key="1" value="1" label="公开招标"></el-radio>
                                <el-radio key="2" value="2" label="邀请招标"></el-radio>
                                <el-radio key="3" value="3" label="竞价谈判"></el-radio>
                                <el-radio key="4" value="4" label="直接委托"></el-radio>
                                <el-radio key="5" value="5" label="其他"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-input v-model="formData.organName"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="实施主体">
                            <el-radio-group v-model="formData.radio">
                                <el-radio key="1" value="1" label="自主实施"></el-radio>
                                <el-radio key="2" value="2" label="代理机构实施"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="评审/谈判机构">
                            <el-radio-group v-model="formData.radio">
                                <el-radio key="1" value="1" label="评标委员会"></el-radio>
                                <el-radio key="2" value="2" label="评审谈判小组"></el-radio>
                                <el-radio key="3" value="3" label="招标采购管理委员会"></el-radio>
                                <el-radio key="4" value="4" label="其他"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-input v-model="formData.organName"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="评审/谈判名单">
                            <el-col :span="3">
                                <el-input v-model="formData.organName"></el-input>
                            </el-col>
                            <el-col :span="2">(组长)</el-col>
                            <el-col :span="3">
                                <el-input v-model="formData.organName"></el-input>
                            </el-col>
                            <el-col :span="3" :offset="1">
                                <el-input v-model="formData.organName"></el-input>
                            </el-col>
                            <el-col :span="3" :offset="1">
                                <el-input v-model="formData.organName"></el-input>
                            </el-col>
                            <el-col :span="3" :offset="1">
                                <el-input v-model="formData.organName"></el-input>
                            </el-col>
                            <el-col :span="3" :offset="1">
                                <el-input v-model="formData.organName"></el-input>
                            </el-col>
                            <!--<el-select-->
                                    <!--v-model="formData.value"-->
                                    <!--multiple-->
                                    <!--filterable-->
                                    <!--allow-create-->
                                    <!--default-first-option>-->
                                <!--<el-option-->
                                        <!--v-for="item in []"-->
                                        <!--:key="item.value"-->
                                        <!--:label="item.label"-->
                                        <!--:value="item.value">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="评判办法">
                            <el-input v-model="formData.organName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                    <el-form-item label="其他情况说明">
                        <el-input v-model="formData.organName"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="征集公告附件">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="考察报告附件">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="其他附件">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="default" @click="saveFormValidate()">保存</el-button>
            <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
    /* eslint-disable */
    import axios from 'axios';
    import moment from 'moment';
    import FilesOperate from '../FilesOperate';
    import { application } from "../application.js";
    import { publicMethods } from "../application.js";
    export default {
        mixins: [publicMethods],
        name: 'ProgrammeForm',
        data() {
            return {
                dialogFormVisible: false,
                radioOption: [
                    {
                        value: '1',
                        label: '开发建设类采购(招标方式；工程类>=100万，货物类>=50万，服务费>=30万)'
                    },
                    {
                        value: '2',
                        label: '开发建设类采购(竞价谈判方式：100万>工程类>=20万、50万>货物类>=10万、30万>服务类>=10万)'
                    },
                    {
                        value: '3',
                        label: '非开发建设类采购(招标方式：估算金额>=30万)'
                    },
                    {
                        value: '4',
                        label: '非开发建设类采购(竞价谈判方式：30万>估算金额>=10万)'
                    },
                    {
                        value: '5',
                        label: '行政非业务类采购(招标方式：估算金额>=30万)'
                    },
                    {
                        value: '6',
                        label: '行政非业务类采购(竞价谈判方式：30万>估算金额>=1万)'
                    }
                ],
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
                personOptions: [
                    {
                        value: '1',
                        label: '杨静'
                    },
                    {
                        value: '2',
                        label: '刘思雨'
                    }
                ],
                formData: this.resetForm(),
                users: [],
                uploadId: 0,
                formLabelWidth: '120px',
                appFlowName: "motor-trainingapplication_train",
                currentFormId: this.operationType == 'create' ? '' : this.formId
            };
        },
        components: {
            FilesOperate
        },
        watch: {
            'formData.lowercase'(val) {

                this.formData.upper = val ? this.convertCurrency(val) : "";
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
                            this.formData.attendingDepartment.splice(index, 1);
                        } else {
                            this.formData.attendingDepartment.splice(index, 1);
                        }
                    } else if (type == 'personal') {
                        this.formData.requestedItems.splice(index, 1);
                    } else if (type == 'sitIn') {
                        this.formData.sitIn.splice(index, 1);
                    }
                });
            },
            addItem(type) {
                if (type == 'message') {
                    this.formData.attendingDepartment.push({});
                } else if (type == 'personal') {
                    this.formData.requestedItems.push({})
                } else if (type == 'sitIn') {
                    this.formData.sitIn.push({})
                }
            },
            getId(id) {
                let self = this;
                self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                    self.formData.attachments.forEach(function(value, index) {
                        if (value.id == id) {
                            axios
                                .get('/api/v1/board_meeting_forms/deleteAtt/' + id)
                                .then(res => {
                                    self.formData.attachments.splice(index, 1);
                                });
                            self.formData.attachments.splice(index, 1);
                        }
                    });
                });
            },
            resetForm() {
                let formData =  {
                    attachments: [],
                    attendingDepartment: [{
                        people: [],
                        department: ''
                    }],
                    requestedItems: [{}],
                    sitIn: [{
                        people: [],
                        department: ''
                    }],
                    numbers: '',
                    created: '',
                    idea: '',
                    committed: '',
                    meetingPlace: '',
                    meetingTime: '',
                    conferenceTitle: '',
                    organName: '',
                    creatorName:'',
                    creatorId: '',
                    organId: ''
                }
                return formData
            },
            getForm() {
                const self = this;
                if (this.formId != '') {
                    axios
                        .get('/api/v1/meetingApply/zd/detail/' + this.formId)
                        .then(res => {
                            self.formData = res.data.content;
                            if (self.formData.attendingDepartment) {
                                self.formData.attendingDepartment.forEach(item => {
                                    if (item.person) {
                                        item.people = item.person.split(',')
                                    }
                                })
                                self.formData.sitIn.forEach(item => {
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
            setDataFromParent(data) {
                this.formId = data.id;
                this.getForm()
                this.dialogFormVisible = true;
                this.createForm_status = false;
            },
            createForm() {
                this.formData = this.resetForm();
                this.dialogFormVisible = this.createForm_status = true;
            },
            saveFormValidate(type) {
                this.$refs['formupdate'].validate(valid => {
                    if (valid) {
                        this.saveForm(type);
                    }
                });
            },
            async saveForm(params) {
                const $self = this;
                $self.formData.attendingDepartment.forEach(item => {
                    if (item.people) {
                        item.person = item.people.join(',')
                    }
                })
                $self.formData.sitIn.forEach(item => {
                    if (item.people) {
                        item.person = item.people.join(',')
                    }
                })
                let response = await $self.saveFormData(
                    "/api/v1/meetingApply/zd/save",
                    $self.formData
                );
                if (response) {
                    $self.formId = response.data.content.id;
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
                            await $self.startSignal(actions.data.types[0]);
                            $self.emitMessage();
                        }
                    } else {
                        $self.msgTips("保存成功", "success");
                        if (this.createForm_status) {
                            $self.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                        } else {
                            $self.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                        }
                    }
                } else {
                    if (params) {
                        $self.msgTips($self, "提交失败", "warning");
                    } else {
                        $self.msgTips($self, "保存失败", "warning");
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
            handleRemove() {}
        }
    };
</script>
<style lang="scss" scoped>
    #ProgrammeForm {
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
    #ProgrammeForm >>> .el-form-item__content{
        width: calc(100% - 140px);
    }
</style>