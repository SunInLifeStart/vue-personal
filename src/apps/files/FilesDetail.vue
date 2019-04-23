<template>
    <div id="FilesDetail">
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
                <el-button type="primary" v-if="tableData.status != '04'" @click="getFlowNode">查看流程</el-button>
            </div>
            <br />
            <!-- <el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">
                <el-step :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>
            </el-steps> -->
            <el-form :model="tableData" class="formList">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="申请人：">{{tableData.creatorName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请部门：">{{tableData.organName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请日期：" >{{tableData.created | dateformat('YYYY-MM-DD')}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属月份：">{{tableData.umonth | fomumonth}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否属于年度预算内：">{{utypeone}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="总印刷数量(套)：">{{tableData.allPrintNumber}}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="文件印刷明细：">
                            <el-table :data="tableData.cardPrinting" border style="width: 100%; margin-top: 5px;">
                                <el-table-column prop="fileName" label="文件姓名">
                                    <template slot-scope="scope">
                                        {{scope.row.fileName}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="printingPicture" label="印刷幅面">
                                    <template slot-scope="scope">
                                        {{scope.row.printingPicture}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="printNumber" label="印刷数量（套）">
                                    <template slot-scope="scope">
                                        {{scope.row.printNumber}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="colourType" label="印刷色彩">
                                    <template slot-scope="scope">
                                        {{scope.row.colourType |numFilter}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="demand" label="其他需求">
                                    <template slot-scope="scope">
                                        {{scope.row.demand}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="buyTime" label="附件" >
                                    <template slot-scope="scope">
                                        <div v-for="item in scope.row.attachments" :key="item.id" class="opertes">
                                           <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件：">
                            <div v-for="item in tableData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row> -->
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
import axios from 'axios';
import moment from "moment";
import Comment from "../Comment";
import FilesOperate from "../FilesOperate";
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: "FilesDetail",
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
            appFlowName: 'files-form_files',//固定资产流程 Files-form_fixedFiles  低值易耗办公品  Files-form_lowFiles 
            formName: 'documentPrinting',
            comments: [],
            dialogVisibleCrumb: false,
            flowNodeUrl: "",

            crumb: { items: [] },
            tabledata: {
                cardPrinting: []
            },
            pageType: 'show',
            utypeone:'',
            actions_status: false,
            rejectTarget: '',
            rejectList: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: '',
            currentAction: '',
            submitData: {},
            fullScreen: false,
            crumbNodeName: ''
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    mounted() {
    },
     filters: {
         fomumonth: function(data) {
             let xmlJson = {
                "yiyue":"一月",
                "eryue":"二月",
                "sanyue" :"三月",
                "siyue" :"四月",
                "wuyue" :"五月",
                 "liuyue":"六月",
                "qiyue":"七月",
                "bayue" :"八月",
                "jiuyue" :"九月",
                "shiyue" :"十月",
                "shiyiyue" :"十一月",
                "shieryue" :"十二月",
            };
            return xmlJson[data];
       },
    },
    methods: {
        fomutype(row, column) {
            let state;
            //0已保存1审核中2驳回3撤销4完成
            switch (row.utype) {
                case 'true':
                    state = "是";
                    break;
                case 'false':
                    state = "否";
                    break;
            }
            return state;
        },
        getFormDetails(formId) {

            let $self = this;
            $self.formId = formId;
            $self.url = "/api/v1/documentPrinting/detail/" + $self.formId;
            console.log('DetailUrl', $self.url)
            $self.getFormDetailsData();
        },
        async getFormDetailsData() {
            let $self = this;
            // let url = `/workflow/${this.appFlowName}/processContent`;
            // $self.$axios.get(url).then(res => {
            //     console.log(res);
            // });
            let response = await $self.getDetails();
            if (response) {
                $self.tableData = response.data.content;
                if($self.tableData.utype=='true'){
                        this.utypeone='是'
                }
                else{
                    this.utypeone='否'
                }
                if($self.tableData.utype){

                }
                $self.$emit("resetStatus", {id:$self.tableData.id,status:$self.tableData.status});
            } else {
                $self.msgTips("获取表单失败", "warning");
            }
            // debugger;
            let actions = await $self.getActions();
            let crumbs = await $self.getCrumbs();
            let comments = await $self.getComments();
            $self.actions = actions.data.types;
            $self.crumbs = { items: crumbs.data, index: -1 };
            $self.comments = comments.data;
            for (var i = 0; i < $self.crumbs.items.length; i++) {
                if ($self.crumbs.items[i].active) {
                    $self.crumbs.index = i;
                }
            }
        }
    }
};
</script>
<style lang="scss">
#FilesDetail {
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
body .el-table th.gutter {
  display: table-cell !important;
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
