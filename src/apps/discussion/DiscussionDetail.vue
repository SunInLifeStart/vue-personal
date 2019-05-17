<template>
    <div id="DiscussionDetail">
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="(action, index) in actions" :key="action.index" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>
            </el-row>
        </div>
        <div class="formContent">
            <br />
            <div><el-button type="primary"  @click="getFlowNode" v-if="tableData.status != '04'">查看流程</el-button></div>
            <br />
            <el-form :model='tableData' class="formList">
                <!--<el-steps :active="crumbs.index" finish-status="success" class="crumbList" v-if="crumbs && crumbs.items">-->
                    <!--<el-step  :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumbs.items"></el-step>-->
                <!--</el-steps>-->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="流水号：">{{tableData.number}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="提单人：">{{tableData.creatorName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属部门：">{{tableData.organName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="提单时间：">{{tableData.committed}}-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col :span="8">
                        <el-form-item label="会议类型：">
                            <span  v-html="discussionOption[tableData.branchlineTo]" ></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="提请部门：">{{tableData.applyDepartment}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="提请时间：">{{tableData.timeApplication}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="议题名称：">{{tableData.topicName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="参会部门" prop="phone">
                            <tr v-for="(item,index) in tableData.attendingDepartment" :key="index" @contextmenu.prevent="deleteItem(item,index,'message')">
                                <td colspan="4" style="width: 21%;">
                                    <!--<el-select v-model="item.department" placeholder="请输入参会部门" @change="changeDepartment(item, index)">-->
                                    <!--<el-option v-for="i in options"-->
                                    <!--:key="i.id"-->
                                    <!--:label="i.name"-->
                                    <!--:value="i.id">-->
                                    <!--&lt;!&ndash;:value="{value:i.value, label: i.label}">&ndash;&gt;-->
                                    <!--</el-option>-->
                                    <!--</el-select>-->
                                    <el-cascader
                                            disabled
                                            @change="changePersonOptions(item)"
                                            :show-all-levels="false"
                                            :props="props"
                                            :options="options"
                                            v-model="item.department"
                                    ></el-cascader>
                                </td>
                                <td colspan="4">
                                    <el-select style="width: 100%"
                                               disabled v-model="item.people" multiple @change="changePeople">
                                        <el-option
                                                v-for="i in item.personOptions"
                                                :key="i.id"
                                                :label="i.name"
                                                :value="i.id">
                                            <!--:value="{value:i.value, label: i.label}">-->
                                        </el-option>
                                    </el-select>
                                </td>
                            </tr>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="提请事项" prop="content">
                            <tr v-for="(item,index) in tableData.requestedItems" :key="index" @contextmenu.prevent="deleteItem(item,index,'personal')">
                                <td colspan="8" style="width: 20%;">
                                    <el-input v-model="item.content" disabled></el-input>
                                </td>
                            </tr>
                        </el-form-item>
                    </el-col>
                </el-row>
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
                        <el-select v-model="item.checkedValue" filterable :multiple = "item.multiple" style="width:100%;" value-key="id">
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
import moment from 'moment';
import Comment from '../Comment';
import FilesOperate from '../FilesOperate';
import { publicMethods } from "../application.js";
export default {
    mixins:[publicMethods],
    name: 'DiscussionDetail',
    data() {
        return {
            tableData: {},
            actions: [],
            actionsDialogArr: [],
            users: [],
            crumbs: [],
            comments: [],
            dataOptions: [],
            options: [],
            person: [],
            textarea: '',
            dialogVisible: false,
            appFlowName:'motor-issuesreported_party-agendasheet',
            discussionOption: {
                general: '总办会',
                chairman: '党支委会'
            },
            props: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            formName:'issuesReported',
            dialogVisibleCrumb:false,
            flowNodeUrl:"",
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    // mounted() {
    //     this.getDiscussionUser()
    // },
    methods: {
        async getDiscussionUser() {
            let a = await axios.get("/api/v1/users/list/organs")
            if (a) this.dataOptions = a.data || []
            this.options = JSON.parse(JSON.stringify(this.dataOptions))
            this.deleteChildren(this.options)
        },
        deleteChildren(array) {
            array.forEach(item => {
                if (item.children.length === 0) {
                    delete item.children
                }
                if (item.children) {
                    if (item.children[0]) {
                        if (!item.children[0].type) {
                            delete item.children
                        }
                    }
                }
                if (item.children && item.children.length > 0) {
                    this.deleteChildren(item.children)
                }
            })
        },
        getFormDetails(formId) {
            let $self = this;
            $self.formId = formId;
            $self.url= "/api/v1/issuesReported/detail/" + $self.formId;
            $self.getFormDetailsData();
        },
        changePersonOptions(item) {
            item.people = []
            this.searchPersonOptions(this.dataOptions, item.department[item.department.length - 1])
            item.personOptions = this.person
        },
        changePeople() {
            this.$forceUpdate()
        },
        searchPersonOptions(array, value) {
            array.forEach(item => {
                if (item.id === value && item.type) {
                    this.person = item.children;
                }
                if (item.children && item.children.length > 0) {
                    this.searchPersonOptions(item.children, value)
                }
            });
        },
        async getFormDetailsData() {
            let $self = this;
            let response = await $self.getDetails();
            let a = await $self.getDiscussionUser();
            let actions = await $self.getActions();
            let comments =  await $self.getComments();
            $self.comments = comments.data;
            if (response) {
                $self.tableData = response.data.content;
                // setTimeout(() => {
                    if ($self.tableData.attendingDepartment) {
                        $self.tableData.attendingDepartment.forEach((item,index) => {
                            // 处理部门
                            if (item.person) {
                                item.people = item.person.split(',')
                            }
                            if (item.department) {
                                item.department = item.department.split(',')
                            }
                            for (let i = 0; i<item.department.length; i++) {
                                item.department[i] = parseInt(item.department[i])
                            }
                            let flag = item.department[item.department.length - 1]
                            $self.searchPersonOptions($self.dataOptions, flag)
                            item.personOptions = this.person
                            // 处理人员
                            if (item.people)
                                for (let i = 0; i<item.people.length; i++) {
                                    item.people[i] = parseInt(item.people[i])
                                }
                        })
                    }
                // },500)
                $self.$emit("resetStatus", {id:$self.tableData.id,status:$self.tableData.status});
            } else {
                $self.msgTips("获取表单失败", "warning");
            }
            for(let i = 0; i < actions.data.types.length; i++){
                if(actions.data.types[i].required && JSON.stringify(actions.data.types[i].required).indexOf("filterButton") > -1){
                    for(let j = 0; j<actions.data.types[i].required.length; j++){
                        if(actions.data.types[i].required[j].indexOf("filterButton") > -1){
                            if(actions.data.types[i].required[j].indexOf("==") > -1){
                                let a = actions.data.types[i].required[j];
                                let key_a = a.split("==")[0].split(":")[1];
                                let value = a.split("==")[1];
                                if($self.tableData[key_a] != value){
                                    actions.data.types[i].hideCurrent = true;
                                }
                            }else{
                                let a = actions.data.types[i].required[j];
                                let key_a = a.split("!=")[0].split(":")[1];
                                let value = a.split("!=")[1];
                                if($self.tableData[key_a] == value){
                                    actions.data.types[i].hideCurrent = true;
                                }
                            }
                        }
                    }
                }
            };
            $self.actions = actions.data.types;
        }
    }
};
</script>
<style lang="scss">
#DiscussionDetail {
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
