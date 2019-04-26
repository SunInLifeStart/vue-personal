<template>
    <div id="BusinessCard">
        <el-card class="box-card">
            <!-- 查询 -->
            <div id="BusinessCardFilter">
                <el-form :inline="true"  label-position="left" class="demo-form-inline">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="姓名：">
                                <el-input v-model="params.creatorName" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请时间：">
                                <!-- <el-input v-model="params.applyDept" placeholder=""></el-input> -->
                                 <el-date-picker v-model="params.created" clearable style="width:100%" value-format="yyyy-MM-dd 00:00:00" type="date" >
                                  </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属月份：" prop="status">
                                <el-select v-model="params.umonth" clearable filterable placeholder="全部">
                                    <el-option v-for="item in onOption"
                                     :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="15">
                            <el-form-item label="是否属于年度预算内:" label-width="130px">
                                <el-radio v-model="params.utype" label="1">是</el-radio>
                                <el-radio v-model="params.utype" label="0">否</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="searchBtn">
                            <el-form-item class="positionBtn">
                                <el-button type="primary" @click="searchList">查询</el-button>
                                <el-button @click="resetInput">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <!-- 新建 -->
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="BusinessCardList">
                <el-table :data="tableData" align="center" style="width: 100%; cursor:pointer" highlight-current-row @row-click="showCurrentId">
                    <el-table-column prop="creatorName" label="申请人">
                    </el-table-column>
                    <el-table-column prop="organName" label="申请部门">
                    </el-table-column>
                    <el-table-column prop="committed" label="申请日期" sortable >
                        <template slot-scope="scope">
                            {{scope.row.committed | dateformat('YYYY-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="utypes" label="是否属于年度预算内">
                    </el-table-column>
                    <el-table-column prop="umonth" label="资金计划所属月份">
                    </el-table-column>
                    <el-table-column prop="totlenumbers" label="总印刷数量">
                    </el-table-column>
                    <el-table-column prop="status" label="单据状态"  :formatter="fomatterStatus">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)" v-show="scope.row.status!='01'&&scope.row.status!='04'"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="right">
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)" v-show="scope.row.status!='01'&&scope.row.status!='04'"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <br />
                <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
        </el-card>
        <br>
        <el-card class="box-card">
            <BusinessCardDetail :formId="formId" ref="BusinessCardDetail" @reloadList="reloadList" @resetStatus="resetStatus"></BusinessCardDetail>
        </el-card>
        <BusinessCardForm ref="BusinessCardForm" @reloadList="reloadList"></BusinessCardForm>
    </div>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import BusinessCardForm from "./BusinessCardForm";
import BusinessCardDetail from "./BusinessCardDetail";
import { CONFIG } from '../data.js';
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: "BusinessCard",
    data() {
        return {
            onOption: [
                {
                    value: 'yiyue',
                    label: '一月'
                },
                {
                    value: 'eryue',
                    label: '二月'
                },
                {
                    value: 'sanyue',
                    label: '三月'
                },
                {
                    value: 'siyue',
                    label: '四月'
                },
                {
                    value: 'wuyue',
                    label: '五月'
                },
                {
                    value: 'liuyue',
                    label: '六月'
                },
                {
                    value: 'qiyue',
                    label: '七月'
                },
                {
                    value: 'bayue',
                    label: '八月'
                },
                {
                    value: 'jiuyue',
                    label: '九月'
                },
                {
                    value: 'shiyue',
                    label: '十月'
                },
                {
                    value: 'shiyiyue',
                    label: '十一月'
                },
                {
                    value: 'shieryue',
                    label: '十二月'
                },
            ],
            statusAll: CONFIG['status'],
            tableData: [],
            formDetails: {},
            formId: "",
            params: {
                umonth: '',
                page: 1,
                pageSize: 5,
                creatorName: "",
                created: "",
                total: 0,
                utype: '',
                // desc: true,
                // options: []
            },
            searchOptions: [],
            formName: "cardprint_名片印刷",
            formInline: {
                umonth: '',
                creatorName: "",
                created: "",
                utype: '',
                status:'',
            },
        };
    },
    components: {
        BusinessCardForm,
        BusinessCardDetail
    },
    methods: {
        
        //获取列表
        async getList(pageNum) {
            // this.onSubmit();
            let $self = this;
            $self.url = "/api/v1/cardPrinting/queryList";
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.content.list && response.data.content.list.length > 0) {
                    let formId = response.data.content.list[0].id;
                    $self.$refs.BusinessCardDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                $self.tableData.forEach(item=>{
                    if(item.utype=='1'){
                        item.utypes='是'
                    }
                    else{
                        item.utypes='否'
                    }
                })
                $self.params.total = response.data.content.total;

            } else {
                $self.msgTips("获取列表失败", "warning");
            }
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.umonth.trim() !== '') {
                this.searchOptions.push({
                    field: 'umonth',
                    filter: 'LIKE',
                    value: this.formInline.umonth
                });
            }
           
            if (this.formInline.creatorName  ) {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'LIKE',
                    value:this.formInline.creatorName
                });
            }
             if (this.formInline.created.trim() !== '') {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'LIKE',
                    value: this.formInline.created
                });
            }
           
            if (this.formInline.utype  ) {
                this.searchOptions.push({
                    field: 'utype',
                    filter: 'LIKE',
                    value:this.formInline.utype
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            this.params.options = this.searchOptions;
        },
        //选择行
        showCurrentId(row) {
            this.$refs.BusinessCardDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.BusinessCardForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.BusinessCardForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == "reload") {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.BusinessCardDetail.getFormDetails(params.id);
            }
        },
        resetStatus(data) {
            let $self = this;
            for (let item of $self.tableData) {
                if (data.id == item.id) {
                    item.status = data.status;
                }
            }
        },
        
        //分页
        currentChange(pageNum) {
            this.params.page = pageNum;
            this.getList(pageNum);
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        searchList() {
            this.getList();
        },
        resetInput() {
            this.params.umonth = '';
            this.params.creatorName = '';
            this.params.created = '';
            this.params.utype = '';
            this.params.status= '';
            this.getList();
        },
        fomatterStatus(row, column) {
            let state;
            //0已保存1审核中2驳回3撤销4完成
            switch (row.status) {
                case '00':
                    state = "已保存";
                    break;
                case '01':
                    state = "审核中";
                    break;
                case '02':
                    state = "驳回";
                    break;
                case '03':
                    state = "撤销";
                    break;
                case '04':
                    state = "已完成";
                    break;
            }
            return state;
        },
    },
    mounted() {
        this.getList();

    }
};
</script>
<style scoped>
 
#BusinessCardFilter  >>> .el-select{
        width: calc(100% - 0px);
    }
     #BusinessCardFilter >>> .el-form-item__content{
        width: calc(100% - 130px);
    }
     #BusinessCardFilter >>> .el-checkbox{
         width: 30px;
    }
</style>

<style lang="scss" scoped>
#BusinessCardFilter .el-form-item--small.el-form-item {
  width: 100%;
}
#BusinessCardFilter {
             .searchBtn {
            padding-right: 10px;
            .positionBtn{
                text-align: right;
            }
        }}
</style>
