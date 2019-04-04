<template>
    <div id="ContractDetail">
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="(action,index) in actions" :key="index" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>
            </el-row>
        </div>
        <br />
        <div class="formContent">
            <div>
                <el-button type="primary" @click="getFlowNode">查看流程</el-button>
            </div>
            <br />
            <!-- <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step  :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps> -->
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
                            <!-- <el-date-picker v-model="tableData.initiateTime" type="datetime" placeholder="选择日期" style="width:100%">
                            </el-date-picker> -->
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
                            <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item)">
                                <p :title="item.name">{{item.name}}</p>
                                <!-- <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i> -->
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
                                    <el-radio v-model="tableData.sum" label="1" disabled>
                                         {{tableData.contractAmount}}
                                        元</el-radio>
                                    <el-radio v-model="tableData.sum" label="2" disabled>其他 成本上线总额
                                         {{tableData.contractAmount}}
                                        元</el-radio>
                                </el-col>
                                <el-col :span="10" style="margin-top:8px">
                                    <el-radio v-model="tableData.budget" label="1" disabled>预算内</el-radio>
                                    <el-radio v-model="tableData.budget" label="2" disabled>预算外</el-radio>
                                </el-col>
                            </el-row>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            经办人
                        </td>
                        <td colspan="2">
                             {{tableData.manager}}
                        </td>
                        <td>
                            合同期限
                        </td>
                        <td colspan="3">
                            <el-radio v-model="tableData.deadline" label="1" disabled>自
                                <!-- <el-input v-model="tableData.deadStartTime" style="width: 110px"></el-input> -->
                                {{tableData.deadStartTime}}
                                至
                                {{tableData.deadEndTime}}
                                <!-- <el-input v-model="tableData.deadEndTime" style="width: 110px"></el-input> -->
                            </el-radio>
                            <el-radio v-model="tableData.deadline" label="2" disabled>其他</el-radio>
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
                            <el-radio v-model="tableData.paper" disabled label="1" >股东大会</el-radio>
                            <el-radio v-model="tableData.paper" disabled label="2">董事会决议</el-radio>
                            <el-radio v-model="tableData.paper" disabled label="3">会议纪要</el-radio>
                            <el-radio v-model="tableData.paper" disabled label="4">请示批件</el-radio>
                            <el-radio v-model="tableData.paper" disabled label="5">其他</el-radio>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同相对方资质证照复印件
                        </td>
                        <td colspan="4">
                            <el-radio v-model="tableData.copy" disabled label="1">有</el-radio>
                            <el-radio v-model="tableData.copy" disabled label="2">无（属已尽调投资项目或初次合作时已提供）</el-radio>
                            <el-radio v-model="tableData.copy" disabled label="3">其他</el-radio>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            合同价格形势
                        </td>
                        <td colspan="6">
                            <el-radio v-model="tableData.shape" disabled label="1">固定总价</el-radio>
                            <el-radio v-model="tableData.shape" disabled label="2">固定总和单价</el-radio>
                            <el-radio v-model="tableData.shape" disabled label="3">其他</el-radio>
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

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件：" v-if="tableData.attachments && tableData.attachments.length > 0">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="comments && comments.length > 0">
                    <el-col :span="24">
                        <h3>审批意见</h3>
                        <div class="items">
                            <div class="item" v-for="item in comments" :key="item.id">
                                <div class="avatar"><img src="img/avatar.1176c00a.png" alt="" width="30px"></div>
                                <div class="info">
                                    <div class="creator">
                                        <span href="#">{{item.userName}}</span> &nbsp; ({{item.times | dateformat}})
                                    </div>
                                    <div class="content">{{item.fullMessage}}</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <el-dialog :visible.sync="dialogVisible" center width="30%" append-to-body>
                <el-form>
                    <el-form-item :label="item.label" v-for="(item,index) in actionsDialogArr" :key="index">
                        <el-select v-model="item.checkedValue" filterable :multiple="item.multiple" style="width:100%;" value-key="id">
                            <el-option v-for="user in item.seletList" :key="user.id" :label="user.name" :value="user"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审批意见">
                        <el-input type="textarea" placeholder="请输入审批意见" v-model="textarea" :autosize="{ minRows: 10, maxRows: 30}">
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog :visible.sync="dialogVisibleCrumb" center width="90%" height="600px" append-to-body>
                <el-form>
                    <iframe :src="flowNodeUrl" width="100%" height="550px" frameborder="0" v-if="flowNodeUrl"></iframe>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import Comment from "../Comment";
import FilesOperate from "../FilesOperate";
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: "ContractDetail",
    data() {
        return {
            tableData: {},
            actions: [],
            crumbs: [],
            formId: "",
            textarea: "",
            dialogVisible: false,
            users: [],
            actionsDialogArr: [],
            appFlowName: 'motor-trainingapplication_train',
            formName: 'contract_forms',
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: "",
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    methods: {
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url = "/api/v1/" + $self.formName + "/" + $self.formId;
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            let response = await $self.getDetails();
            console.log(response)
            if (response) {
                $self.tableData = response.data;
                // if ($self.tableData.type == "true") {
                //     $self.tableData.type = '是'
                // }
                // if ($self.tableData.isAnnualPlan == "true") {
                //     $self.tableData.isAnnualPlan = '是'
                // }
                // if ($self.tableData.type == "false") {
                //     $self.tableData.type = '否'
                // }
                // if ($self.tableData.isAnnualPlan == "false") {
                //     $self.tableData.isAnnualPlan = '否'
                // }

                $self.$emit("resetStatus", { id: $self.tableData.id, status: $self.tableData.status });

            } else {
                $self.msgTips("获取表单失败", "warning");
            }
            let actions = await $self.getActions();
            // let crumbs = await $self.getCrumbs();
            let comments = await $self.getComments();
            $self.actions = actions.data.types;
            $self.comments = comments.data;
            // $self.crumbs =  {items: crumbs.data, index: -1};
            // for(var i= 0; i<$self.crumbs.items.length; i++){
            //     if($self.crumbs.items[i].active){
            //         $self.crumbs.index = i;    
            //     }
            // }
        }
    }
};
</script>
<style lang="scss">
#ContractDetail {
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
.fullScreen {
  position: fixed;
  top: 0px;
  z-index: 10;
  background: #fff;
  left: 0px;
  right: 0px;
}
</style>
