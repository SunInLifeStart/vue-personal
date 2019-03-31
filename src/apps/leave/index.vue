<template>
    <div id="Leave">
        <el-card class="box-card">
            <div id="LeaveFilter">
                <el-form :inline="true" :model="params" label-width="70px" label-position="left" class="demo-form-inline">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="提单人">
                                <el-input v-model="params.uname" placeholder="提单人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属部门">
                                <el-input v-model="params.oname" placeholder="所属部门"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="提单时间">
                                <el-date-picker v-model="params.applyTime" type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row> -->
                        <el-col :span="8">
                            <el-form-item label="单据状态">
                                <el-select v-model="params.status" placeholder="请选择">
                                    <!-- <el-option v-for="item in params.options_status" :key="item" :label="item" :value="item">
                                    </el-option> -->
                                    <el-option label="已保存" value="已保存"></el-option>
                                    <el-option label="审核中" value="审核中"></el-option>
                                    <el-option label="已驳回" value="已驳回"></el-option>
                                    <el-option label="已完成" value="已完成"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="创建时间">
                                <el-date-picker v-model="params.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="24" class="">
                            <el-form-item class="" style=" text-align: right">
                                <el-button type="primary" @click="searchList">查询</el-button>
                                <el-button @click="resetInput">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="LeaveList">
                <el-table :data="tableData" stripe @row-click="showCurrentId">
                    <el-table-column prop="uname" label="提单人" align="center">
                    </el-table-column>
                    <el-table-column prop="oname" label="所属部门" align="center">
                    </el-table-column>
                    <el-table-column prop="no" label="流水号" align="center">
                    </el-table-column>
                    <el-table-column prop="applyTime" label="提单时间" align="center">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center" :formatter="fomatterStatus">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '已保存' || scope.row.status == '已驳回'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '已保存'">
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <br>
                <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
        </el-card>
        <br>
        <el-card class="box-card">
            <LeaveDetail :formId="formId" ref="LeaveDetail" @reloadList="reloadList"></LeaveDetail>
        </el-card>
        <LeaveForm ref="LeaveForm" @reloadList="reloadList"></LeaveForm>
        <!-- <el-dialog title="请休假申请" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="1240px">
            <LeaveForm ref="Leaveform" @refreshData="refreshData" @refreshDetail="refreshDetail" :formId="dialogFormId" :operationType="operationType" @saveStatus="saveStatus"></LeaveForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.showStatus == ''" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog> -->

    </div>
</template>
<script>
// import LeaveList from './LeaveList';
import LeaveForm from './LeaveForm';
// import LeaveFilter from './LeaveFilter';
import LeaveDetail from './LeaveDetail';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'Leave',
    data() {
        return {
            params: {},
            tableData: [],
            formDetails: {},
            formId: '',
            params: {
                pageNum: 1,
                pageSize: 5,
                department: '',
                submitter: '',
                total: 0
            },
            formName: 'motor-holiday',
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
            }
        };
    },

    methods: {
        async getList(pageNum) {
            let $self = this;
            $self.url = '/api/v1/motor-holiday/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.content.list.length > 0) {
                    let formId = response.data.content.list[0].id;
                    $self.$refs.LeaveDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                $self.params.total = response.data.content.total;
            } else {
                $self.msgTips('获取列表失败', 'warning');
            }
        },
        //选择行
        showCurrentId(row) {
            this.$refs.LeaveDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.LeaveForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.LeaveForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == 'reload') {
                this.params.pageNum = 1;
                this.getList();
            } else {
                this.$refs.LeaveDetail.getFormDetails(params.id);
            }
        },

        //分页
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
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
            this.params.submitter = this.params.department = '';
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
    },
    components: {
        // LeaveList,
        LeaveForm,
        // LeaveFilter,
        LeaveDetail
    }
};
</script>
<style lang="scss" >
#LeaveFilter .el-form-item--small.el-form-item {
    width: 100%;
}
#LeaveFilter .el-form-item--small .el-form-item__content {
    width: 80%;
}
#LeaveFilter .el-range-editor--small.el-input__inner {
    width: 100%;
}
</style>


