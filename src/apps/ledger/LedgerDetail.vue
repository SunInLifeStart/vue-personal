<template>
    <div id="LedgerDetail">
        <!--
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="(action,index) in actions" :key="index" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>
            </el-row>
        </div>
        -->
        <br />
        <div class="formContent">
            <br />
            <el-row style="margin-bottom:10px;margin-left: 5px;">
                <el-col :span="8" style="margin-bottom:10px;margin-left: 5px;">
                    流水号： {{tableData.number}}
                </el-col>
            </el-row>
            <el-form :model='tableData' class="formList">
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
                            {{tableData.applyName}}
                        </td>
                        <td>
                            所属部门
                        </td>
                        <td colspan="2">
                            {{tableData.dept}}
                        </td>
                        <td>
                            发起时间
                        </td>
                        <td colspan="2">
                            {{tableData.initiateTime}}
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
                            {{tableData.contractName}}
                        </td>
                        <td>
                            合同编号
                        </td>
                        <td colspan="2">
                            {{tableData.contractNum}}
                        </td>
                    </tr>
                    <tr v-show="decodeURI(this.$store.getters.LoginData.companyName) != '中关村协同发展投资有限公司'">
                        <td colspan="2">
                            合同类型
                        </td>
                        <td colspan="6">
                            {{tableData.contractType}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            所属项目
                        </td>
                        <td colspan="6">
                            {{tableData.project}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            甲方
                        </td>
                        <td colspan="6">
                            {{tableData.partyA}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            乙方
                        </td>
                        <td colspan="6">
                            {{tableData.partyB}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            其他方
                        </td>
                        <td colspan="6">
                            {{tableData.otherParty}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同附件
                        </td>
                        <td colspan="6">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType1'">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同金额
                        </td>
                        <td colspan="6">
                            <el-row>
                                <el-col :span="24">
                                    <el-radio-group v-model="tableData.moneyRadio" disabled>
                                        <el-radio label="1">
                                            {{tableData.contractAmount}} 元
                                        </el-radio>
                                        <el-radio label="2">其他 成本上线总额 {{tableData.uptotal}} 元
                                        </el-radio>
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
                            <el-radio-group v-model="tableData.budget" disabled>
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
                            {{tableData.manager}}
                        </td>
                        <td>
                            合同期限
                        </td>
                        <td colspan="4">
                            <el-radio-group v-model="tableData.terminationPeople" disabled>
                                <el-row>
                                    <el-col :span="24">
                                        <el-radio label="1">自{{tableData.effectiveStart}} 至{{tableData.effectiveEnd}}
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
                            <el-radio-group v-model="tableData.paper" disabled>
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
                            <el-radio-group v-model="tableData.copy" disabled>
                                <el-radio label="1">有</el-radio>
                                <el-radio label="2">无（属已尽调投资项目或初次合作时已提供）</el-radio>
                                <el-radio label="3">其他</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同所涉经济行为批准文件附件
                        </td>
                        <td colspan="6">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType2'">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同相对方资质证照复印件附件
                        </td>
                        <td colspan="6">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType3'">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            其他附件
                        </td>
                        <td colspan="6">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType4'">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            上传合同及校审表
                        </td>
                        <td colspan="6">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType5'">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            上传签字盖章合同
                        </td>
                        <td colspan="6">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType6'">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同价格形势
                        </td>
                        <td colspan="6">
                            <el-radio-group v-model="tableData.shape" disabled>
                                <el-radio label="1">固定总价</el-radio>
                                <el-radio label="2">固定综合单价</el-radio>
                                <el-radio label="3">其他</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同付款安排
                        </td>
                        <td colspan="6">
                            {{tableData.arrange}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同内容摘要
                        </td>
                        <td colspan="6">
                            <el-row style="padding:5px; min-height:100px">
                                {{tableData.sponsor}}
                            </el-row>
                            <el-row style="padding:5px;">
                                <el-col :span="14">
                                    <div style="float:left">
                                        谈判小组成员（不同部门2人或以上）签字：{{tableData.tpxzName}}
                                    </div>
                                </el-col>
                                <el-col :span="10">
                                    年 月 日： {{tableData.datecontractTime}}
                                </el-col>
                            </el-row>
                        </td>
                    </tr>
                </table>
            </el-form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Comment from '../Comment';
import FilesOperate from '../FilesOperate';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'LedgerDetail',
    data() {
        return {
            tableData: {},
            actions: [],
            crumbs: [],
            formId: '',
            textarea: '',
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'asset-form_asset', //固定资产流程 asset-form_fixedAsset  低值易耗办公品  asset-form_lowAsset
            formName: 'contract_forms',
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: ''
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    mounted() {},
    methods: {
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = '/api/v1/contract_forms/' + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data;
                if (this.tableData.contractType == '合同签订') {
                    this.tableData.contractType = '合同签订(土地出让合同外)';
                } else if (
                    this.tableData.contractType ==
                    '超出招采委审批条款的合同审批'
                ) {
                    this.tableData.contractType =
                        '超出招采委审批条款的合同审批(合同调整审批)';
                }
            } else {
                $self.msgTips('获取表单失败', 'warning');
            }
        }
    }
};
</script>
<style lang="scss">
#LedgerDetail {
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
    }
    table thead th {
        background-color: #cce8eb;
    }
    .el-step__main {
        margin-top: 10px;
    }
    .audit {
        position: relative;
        margin-bottom: 10px;
        font-size: 14px;
        box-shadow: none;
        border: 0;
        font-weight: bold;
        .avatar {
            position: absolute;
            left: 5px;
            top: 5px;
            width: 36px;
            height: 36px;
            img {
                width: 36px;
                height: 36px;
                border: 1px solid #dddddd;
                border-radius: 50%;
            }
        }
        .info {
            margin-left: 60px;
            display: inline-block;
            width: calc(100% - 60px);
            .creator {
                height: 32px;
                line-height: 32px;
                a {
                    color: #4a6495;
                    text-decoration-line: none;
                }
            }
            .content {
                min-height: 32px;
            }
        }
    }
    .input-with-select {
        width: 0px;
        margin-right: 10px;
        .el-input-group__prepend {
            background-color: #409eff;
            border-color: #409eff;
            color: #ffffff;
            border-radius: 4px;
        }
        &.reject .el-input-group__prepend {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .el-input__inner {
            width: 0;
            padding: 0;
            border: 0;
        }
        .el-input__suffix {
            left: 8px;
        }
    }
    #actionList {
        background: #f4f4f4;
        border-bottom: 1px solid #eaeaea;
        height: 40px;
        width: 100%;
        z-index: 10;
        .btnList {
            line-height: 40px;
            padding: 12px 10px;
            cursor: pointer;
        }
        .btnList:hover {
            background: #c7e0f4;
        }
    }
    .btnhide {
        display: none;
    }
    .crumbList {
        margin: 15px 0px;
    }
}
.el-radio__input.is-disabled + span.el-radio__label {
    color: #082b4e;
    cursor: not-allowed;
}
.el-radio__input.is-disabled.is-checked .el-radio__inner {
    background-color: #4a6286;
    border-color: #e4e7ed;
}
.fullScreen {
    position: fixed;
    top: 0px;
    z-index: 10;
    background: #fff;
    left: 0px;
    right: 0px;
}
</style>
