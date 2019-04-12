<template>
    <el-dialog title="合同审批表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="ContractForm">
            <el-form :model="formData" label-width="100px" :rules="rules" ref="formupdate">
                <el-row style="margin-bottom:10px">
                    <el-col :span="8">
                        <el-form-item label="流水号：">
                            {{formData.number}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--
                    <el-col :span="8">
                        <el-form-item label='会议结果：' :required="true" label-width="110px" v-show="this.formData.type == '国内差旅报销(对公)'">
                            <el-select v-model="formData.travelId" filterable placeholder="选择出差申请单" allow-create @change="travelChange" v-show="this.formData.type == '国内差旅报销(对公)'">
                                <el-option v-for="item in travelSelections" :key="item.id" :label="item.number" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right" v-show="this.formData.type == '国内差旅报销(对公)'">
                                <el-button type="text" style="margin-left: 5px;" icon="el-icon-view" @click="travelDetail" :disabled="this.formData.tra!='true'"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label='呈报件：' :required="true" label-width="110px">
                            <el-select style="min-width:240px" v-model="submission" filterable placeholder="选择呈报件" allow-create @change="SubmissionChange">
                                <el-option v-for="item in submissionSelections" :key="item.id" :label="item.submissionNo" :value="item.id">
                                </el-option>
                            </el-select>
                            <el-tooltip class="item" effect="dark" content="查看" placement="right">
                                <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="submissionDetail" :disabled="this.formData.sub!='true'"></el-button>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购方案：" :required="true" label-width="140px" v-show="this.formData.type == '国际差旅报销(对公)'">
                            <el-select v-model="formData.ranks" placeholder="选择最高职权" @change="hignleaderChange">
                                <el-option v-for="item in hignLeaderSelections" :key="item.index" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <table style="width: 99%; height: 100%;margin-top: 5px; table-layout: fixed; word-break: break-all;">
                    <col style="width: 9%" />
                    <col style="width: 11%" />
                    <col style="width: 11%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 10%" />
                    <col style="width: 11%" />
                    <col style="width: 10%" />
                    <tr>
                        <td colspan="8" style="font-weight:bold">
                            基本信息
                        </td>
                    </tr>
                    <tr>
                        <td>
                            提单人
                        </td>
                        <td>
                            <el-input v-model="formData.applyname" disabled></el-input>
                        </td>
                        <td>
                            所属部门
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.applydept" disabled></el-input>
                        </td>
                        <td>
                            <span class="span">*</span>
                            发起时间
                        </td>
                        <td colspan="2">
                            <el-date-picker v-model="formData.startTime" type="datetime" placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="font-weight:bold">
                            合同信息
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="span">*</span>
                            合同名称
                        </td>
                        <td colspan="3">
                            <el-input v-model="formData.contractName"></el-input>
                        </td>
                        <td>
                            合同编号
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.contractNum"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="span">*</span>
                            合同类型
                        </td>
                        <td colspan="2">
                            <el-select v-model="formData.contractType" placeholder="请选择" @change="typeandradioChange('contractType')">
                                <el-option label="土地出让合同签订" value="土地出让合同签订"></el-option>
                                <el-option label="合同签订（土地出让合同外）" value="合同签订(土地出让合同外)"></el-option>
                                <el-option label="超出招采委审批条款的合同审批(合同调整审批)" value="超出招采委审批条款的合同审批(合同调整审批)"></el-option>
                                <el-option label="符合招采委审批条款的合同审批" value="符合招采委审批条款的合同审批"></el-option>
                            </el-select>
                        </td>
                        <td colspan="2">
                            <span class="span">*</span>
                            所属项目
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.project"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="span">*</span>
                            甲方
                        </td>
                        <td colspan="6">
                            <el-input v-model="formData.partyA"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="span">*</span>
                            乙方
                        </td>
                        <td colspan="6">
                            <el-input v-model="formData.partyB"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            其他方
                        </td>
                        <td colspan="6">
                            <el-input v-model="formData.otherParty"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同附件
                            <el-upload name="files" class="upload" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </td>
                        <td colspan="6">
                            <div class="attachments" v-for="item in formData.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                                <i class="el-icon-delete" @click.stop="deleteAttachments"></i>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="span">*</span>
                            合同金额
                        </td>
                        <td colspan="6">
                            <el-row>
                                <el-col :span="24">
                                    <el-radio-group v-model="formData.moneyRadio" @change="typeandradioChange('moneyRadio')">
                                        <el-radio label="1">
                                            <el-input v-model.number="formData.contractAmount" type="number" @mousewheel.native.prevent style="width: 110px" :disabled="formData.moneyRadio!='1'"></el-input>
                                            元</el-radio>
                                        <el-radio label="2">其他 成本上线总额
                                            <el-input v-model.number="formData.uptotal" type="number" @mousewheel.native.prevent style="width: 110px" :disabled="formData.moneyRadio!='2'"></el-input>
                                            元</el-radio>
                                    </el-radio-group>
                                </el-col>
                            </el-row>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            是否预算内
                        </td>
                        <td colspan="6">
                            <el-radio-group v-model="formData.est">
                                <el-radio label="1">预算内</el-radio>
                                <el-radio label="2">预算外</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            经办人
                        </td>
                        <td colspan="1">
                            <el-input v-model="formData.manager" disabled></el-input>
                        </td>
                        <td>
                            <span class="span">*</span>
                            合同期限
                        </td>
                        <td colspan="4">
                            <el-radio-group v-model="formData.dateRadio" @change="typeandradioChange('dateRadio')">
                                <el-row>
                                    <el-col :span="24">
                                        <el-radio label="1">自
                                            <!--
                                 <el-date-picker v-model="formData.deadStartTime" type="daterange" range-separator="至" style="width:300px" :disabled="formData.deadline!='1'">
                                </el-date-picker>
                                -->
                                            <el-date-picker v-model="formData.effectiveStart" type="date" placeholder="开始日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="formData.dateRadio!='1'">
                                            </el-date-picker>至
                                            <el-date-picker v-model="formData.effectiveEnd" type="date" placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="formData.dateRadio!='1'">
                                            </el-date-picker>
                                        </el-radio>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="2">
                                        <el-radio label="2" style="text-align: left;">其他</el-radio>
                                    </el-col>
                                </el-row>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" rowspan="2">
                            复审材料
                        </td>
                        <td colspan="2">
                            合同所涉经济行为批准文件
                        </td>
                        <td colspan="4">
                            <el-radio-group v-model="formData.contractallow">
                                <el-radio label="1">股东大会</el-radio>
                                <el-radio label="2">董事会决议</el-radio>
                                <el-radio label="3">会议纪要</el-radio>
                                <el-radio label="4">请示批件</el-radio>
                                <el-radio label="5">其他</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同相对方资质证照复印件
                        </td>
                        <td colspan="4">
                            <el-radio-group v-model="formData.contractphoto">
                                <el-radio label="1">有</el-radio>
                                <el-radio label="2">无（属已尽调投资项目或初次合作时已提供）</el-radio>
                                <el-radio label="3">其他</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同价格形式
                        </td>
                        <td colspan="6">
                            <el-radio-group v-model="formData.contractprice">
                                <el-radio label="1">固定总价</el-radio>
                                <el-radio label="2">固定总和单价</el-radio>
                                <el-radio label="3">其他</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同付款安排
                        </td>
                        <td colspan="6">
                            <el-input type="textarea" :autosize="{minRows: 2}" v-model="formData.contractArrange"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="span">*</span>
                            合同内容摘要
                        </td>
                        <td colspan="6">
                            <el-row>
                                <el-input type="textarea" :autosize="{minRows: 2}" v-model="formData.digest"></el-input>
                            </el-row>
                            <el-row style="padding:5px">
                                <el-col :span="14">
                                    <div style="float:left">
                                        谈判小组成员（不同部门2人或以上）签字：
                                        <el-select v-model="formData.tpxzId" multiple filterable placeholder="请选择">
                                            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                                <el-col :span="10">
                                    年 月 日:
                                    <el-date-picker v-model="formData.datecontractTime" type="date" placeholder="" value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-col>
                            </el-row>
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
/* eslint-disable */
import moment from 'moment';
import axios from 'axios';
import FilesOperate from '../FilesOperate';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
import cookies from 'js-cookie';
export default {
    mixins: [publicMethods],
    name: 'ContractForm',
    data() {
        return {
            options: [], //谈判小组成员选择列表
            radio: '',
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            appFlowName: 'contractforms',
            rules: {
                contractName: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入申请人'
                    }
                ]
            }
        };
    },
    watch: {
        // 'formData.lowercase'(val) {
        //     this.formData.upper = val ? this.convertCurrency(val) : "";
        // }
    },
    components: {
        FilesOperate
    },
    methods: {
        typeandradioChange(type) {
            if (type == 'contractType') {
            } else if (type == 'moneyRadio') {
                if (this.formData.moneyRadio == '1') {
                    this.formData.uptotal = '0';
                } else {
                    this.formData.contractAmount = '0';
                }
            } else if (type == 'dateRadio') {
                if (this.formData.dateRadio == '2') {
                    this.formData.effectiveStart = '';
                    this.formData.effectiveEnd = '';
                }
            } else {
            }
        },
        getNo() {
            const self = this;
            let params = {
                code: 'contract_forms'
            };
            axios
                .post('/synergy-common/serialNumber/getByTableCode', params)
                .then(res => {
                    this.formData.number = res.data.content.serialNumber;
                })
                .catch(function() {
                    self.$message({
                        message: '流水号获取失败',
                        type: 'error'
                    });
                });
        },
        getContractNum() {
            const self = this;
            const year = moment()
                .utc()
                .format('YYYY');
            axios
                .get('/api/v1/contract_forms/contractNum/' + year)
                .then(res => {
                    self.formData.contractNum = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '合同编号获取失败',
                        type: 'error'
                    });
                });
        },
        //获得谈判小组成员
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
        //删除附件
        /** 
        deleteAttachment(id) {
            const self = this;
            if (this.formData.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get('/api/v1/payment_forms/deleteAtt/' + id, '', {
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            })
                            .then(res => {
                                self.formData.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.formData.attachments.splice(
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
        */
        setDataFromParent(data) {
            this.formData = data;
            this.formData.tpxzId = this.formData.tpxzName.split(',');
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.getNo();
            this.getContractNum();
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
        },
        resetForm() {
            let formData = {
                number: '',
                applyname: cookies.get('uname'),
                applydept: cookies.get('oname'),
                startTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), //提单时间
                manager: cookies.get('uname'),
                contractName: '', // 合同名称
                contractNum: '',
                project: '',
                contractType: '',
                moneyRadio: '1',
                contractAmount: '0',
                uptotal: '0',
                est: '1',
                dateRadio: '1',
                effectiveStart: '',
                effectiveEnd: '',
                attachments: [],
                contractallow: '1',
                contractphoto: '1',
                contractprice: '1',
                contractArrange: '',
                digest: '', //合同内容摘要
                tpxzName: '',
                tpxzId: [], //谈判小组成员
                partyA: '', // 甲方
                partyB: '', //  乙方
                otherParty: '',
                datecontractTime: ''
            };
            return formData;
        },
        saveFormValidate(type) {
            if (this.ruleHint() == true) {
                this.saveForm(type);
            }
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            $self.formData.tpxzName = $self.formData.tpxzId.join(',');
            let response = await $self.saveFormData(
                '/api/v1/contract_forms/save',
                $self.formData
            );
            console.log(response.data);
            if (response) {
                $self.formId = response.data.id;
                $self.dialogFormVisible = false;
                if (params) {
                    $self.msgTips('提交成功', 'success');
                    if (this.createForm_status) {
                        $self.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                    } else {
                        let actions = await $self.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                        actions.data.types = actions.data.types.filter(function(
                            item
                        ) {
                            return item.action == 'COMMIT';
                        });
                        actions.data.types[0]['comment'] =
                            actions.data.types[0].name;
                        await $self.startSignal(
                            actions.data.types[0],
                            'fromeEdit'
                        );
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
                    $self.msgTips('提交失败', 'warning');
                } else {
                    $self.msgTips('保存失败', 'warning');
                }
            }
        },
        //输入项警告检查
        ruleHint() {
            let ruleHint = true;
            if (
                this.formData.startTime == '' ||
                this.formData.startTime == null
            ) {
                ruleHint = false;
                this.$message({
                    message: '发起时间为必输项，请输入',
                    type: 'error'
                });
            } else if (
                this.formData.contractName == '' ||
                this.formData.contractName == null
            ) {
                ruleHint = false;
                this.$message({
                    message: '合同名称为必输项，请输入',
                    type: 'error'
                });
            } else if (
                this.formData.project == '' ||
                this.formData.project == null
            ) {
                ruleHint = false;
                this.$message({
                    message: '所属项目为必输项，请输入',
                    type: 'error'
                });
            } else if (
                this.formData.partyA == '' ||
                this.formData.partyA == null
            ) {
                ruleHint = false;
                this.$message({
                    message: '甲方为必输项，请输入',
                    type: 'error'
                });
            } else if (
                this.formData.partyB == '' ||
                this.formData.partyB == null
            ) {
                ruleHint = false;
                this.$message({
                    message: '乙方为必输项，请输入',
                    type: 'error'
                });
            } else if (
                !this.formData.contractAmount ||
                this.formData.contractAmount == ''
            ) {
                ruleHint = false;
                this.$message({
                    message: '合同金额为必输项，请输入',
                    type: 'error'
                });
            } else if (
                this.formData.digest == '' ||
                this.formData.digest == null
            ) {
                ruleHint = false;
                this.$message({
                    message: '合同内容摘要为必输项，请输入',
                    type: 'error'
                });
            } else {
                ruleHint = true;
            }
            return ruleHint;
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
    },
    mounted() {
        this.getUser();
    }
};
</script>
<style lang="scss" scoped>
#ContractForm {
    .span {
        color: red;
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
    table {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        width: 100%;
    }
    table td,
    table th {
        border: 1px solid #ddd;
        color: #666;
        height: 40px;
        vertical-align: middle;
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0;
        }
        input[type='number'] {
            -moz-appearance: textfield;
        }
    }
    table thead th {
        background-color: #cce8eb;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
        width: 160px;
    }
    .upload {
        position: relative;
        margin-right: 30px;
        // width: 100px;
        display: inline-block;
        cursor: pointer;
    }
    .attachments {
        position: relative;
        // margin-bottom: 40px;
        margin-right: 30px;
        width: 200px;
        // height: 120px;
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

    table tr:nth-child(odd) {
        background: #fff;
    }
    table tr:nth-child(even) {
        background: #fff;
    }
}
</style>