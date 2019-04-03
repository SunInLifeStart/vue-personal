<template>
    <el-dialog title="签订审批表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="ContractForm">
            <el-form :model="formData" label-width="100px" :rules="rules" ref="formupdate">
                <!-- <el-row style="margin-bottom:10px">
                    <el-col :span="7">
                        <el-form-item label="流水号：">
                            {{formData.numericalOrder}}
                        </el-form-item>
                    </el-col>
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
                            <el-input v-model="formData.manager" disabled></el-input>
                        </td>
                        <td>
                            所属部门
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.organ" disabled></el-input>
                        </td>
                        <td>
                            发起时间
                        </td>
                        <td colspan="2">
                            <el-date-picker v-model="formData.applicantTime" type="datetime" placeholder="选择日期" style="width:100%">
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
                            合同名称
                        </td>
                        <td colspan="3">
                            <el-input v-model="formData.contractName"></el-input>
                        </td>
                        <td>
                            所属项目
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.contractName"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            甲方
                        </td>
                        <td colspan="6">
                            <el-input v-model="formData.partyA"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
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
                                <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同金额
                        </td>
                        <td colspan="6">
                            <el-row>
                                <el-col :span="14">
                                    <el-radio v-model="radio" label="1">
                                        <el-input v-model="formData.contractAmount" style="width: 110px"></el-input>
                                        元</el-radio>
                                    <el-radio v-model="radio" label="2">其他 成本上线总额
                                        <el-input v-model="formData.contractAmount" style="width: 110px"></el-input>
                                        元</el-radio>
                                </el-col>
                                <el-col :span="10" style="margin-top:8px">
                                    <el-radio v-model="radio" label="1">预算内</el-radio>
                                    <el-radio v-model="radio" label="2">预算外</el-radio>
                                </el-col>
                            </el-row>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            经办人
                        </td>
                        <td colspan="2">
                            <el-input v-model="formData.manager"></el-input>
                        </td>
                        <td>
                            合同期限
                        </td>
                        <td colspan="3">
                            <el-radio v-model="radio" label="1">自
                                <el-input v-model="formData.applicantTime" style="width: 110px"></el-input>
                                至
                                <el-input v-model="formData.applicantTime" style="width: 110px"></el-input>
                            </el-radio>
                            <el-radio v-model="radio" label="2">其他</el-radio>
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
                            <el-radio v-model="radio" label="1">股东大会</el-radio>
                            <el-radio v-model="radio" label="2">董事会决议</el-radio>
                            <el-radio v-model="radio" label="3">会议纪要</el-radio>
                            <el-radio v-model="radio" label="4">请示批件</el-radio>
                            <el-radio v-model="radio" label="5">其他</el-radio>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同相对方资质证照复印件
                        </td>
                        <td colspan="4">
                            <el-radio v-model="radio" label="1">有</el-radio>
                            <el-radio v-model="radio" label="2">无（属已尽调投资项目或初次合作时已提供）</el-radio>
                            <el-radio v-model="radio" label="3">其他</el-radio>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同价格形势
                        </td>
                        <td colspan="6">
                            <el-radio v-model="radio" label="1">固定总价</el-radio>
                            <el-radio v-model="radio" label="2">固定总和单价</el-radio>
                            <el-radio v-model="radio" label="3">其他</el-radio>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同付款安排
                        </td>
                        <td colspan="6">
                            <el-input v-model="formData.contentAbstract"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同内容摘要
                        </td>
                        <td colspan="6">
                            <el-row>
                                <el-col :span="14">
                                    <div style="float:left">
                                        谈判小组成员（不同部门2人或以上）签字：
                                    </div>
                                </el-col>
                                <el-col :span="10">
                                    年 月 日
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
import moment from "moment";
import FilesOperate from "../FilesOperate";
import { application } from "../application.js";
import { publicMethods } from "../application.js";
import cookies from 'js-cookie';
export default {
    mixins: [publicMethods],
    name: "ContractForm",
    data() {
        return {
            radio: '',
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            appFlowName: "motor-trainingapplication_train",
            rules: {
                submitter: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入申请人"
                    }
                ],
                department: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入所属部门"
                    }
                ],
                isAnnualPlan: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "年度计划"
                    }
                ],

                committed: [
                    {
                        required: false, //是否必填
                        message: "请选择提单时间",
                        trigger: "blur"
                    }
                ],
                trainingPrograms: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入培训/学习(项目)"
                    }
                ],
                trainingContent: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入培训/学习(目的内容)"
                    }
                ],
                participant: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入培训/学习(参加人员)"
                    }
                ],
                schedule: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入日程安排"
                    }
                ],
                consts: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入费用预算"
                    }
                ],
                processId: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入是否资金计划内"
                    }
                ],
                suggestion: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入审批意见"
                    }
                ],
                draftTime: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请选择培训时间"
                    }
                ],
                writer: [
                    {
                        required: true, //是否必填
                        trigger: "change", //何事件触发
                        message: "请选择记录人"
                    }
                ]
            }
        };
    },
    watch: {
        'formData.lowercase'(val) {
            this.formData.upper = val ? this.convertCurrency(val) : "";
        }
    },
    components: {
        FilesOperate
    },
    methods: {
        //删除附件
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
                                self.formData.attachments.forEach(function (
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
                            .catch(function () {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                );
            }
        },
        setDataFromParent(data) {
            this.formData = data;
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
                applicantTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), //提单时间
                manager: cookies.get('uname'),
                creatorId: cookies.get('uid'),
                creatorName: cookies.get('uname'),
                organId: cookies.get('oid'),
                organ: cookies.get('oname'),
                contractNum: '',
                historyContract: '',
                effectiveStart: '',
                effectiveEnd: '',
                attachments: [],
                type: 1,
                gid: cookies.get('oid')
            };
            return formData;
        },
        saveFormValidate(type) {
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            let response = await $self.saveFormData("/api/v1/contract_forms/save", $self.formData);
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
                            function (item) {
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
                response.forEach(function (item) {
                    self.formData.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() { },
        handleRemove() { }
    },
    mounted() { }
};
</script>
<style lang="scss" scoped>
#ContractForm {
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
    border: 1px solid #000;
    color: #666;
    height: 40px;
    vertical-align: middle;
  }
  table thead th {
    background-color: #cce8eb;
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
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
}
</style>