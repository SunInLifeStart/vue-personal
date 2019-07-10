<template>
    <div id="Leave">
        <el-card class="box-card">
            <div id="LeaveFilter">
                <el-form :inline="true" :model="params" label-width="70px" label-position="left" class="demo-form-inline">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="所属部门">
                                <el-input v-model="params.oname" placeholder="所属部门"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="提单人">
                                <el-input v-model="params.uname" placeholder="提单人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="提单时间">
                                <el-date-picker v-model="params.applyTime" clearable style="width:100%" value-format="yyyy-MM-dd" type="date">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="单据状态">
                                <el-select v-model="status" placeholder="请选择">
                                    <el-option label="已保存" value="00"></el-option>
                                    <el-option label="审核中" value="01"></el-option>
                                    <el-option label="已驳回" value="02"></el-option>
                                    <el-option label="已完成" value="04"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="">
                            <el-form-item>
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
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId" highlight-current-row>
                    <el-table-column prop="oname" label="所属部门" align="center">
                    </el-table-column>
                    <el-table-column prop="uname" label="提单人" align="center">
                    </el-table-column>
                    <el-table-column prop="no" label="流水号" align="center">
                    </el-table-column>
                    <el-table-column prop="applyTime" label="提单时间" align="center">
                    </el-table-column>

                    <el-table-column prop="status" label="状态" align="center" :formatter="fomatterStatus">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '00'">
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
            <LeaveDetail :formId="formId" ref="LeaveDetail" @reloadList="reloadList" @resetStatus="resetStatus"></LeaveDetail>
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
            status: '',
            params: {
                pageNum: 1,
                pageSize: 5,
                uname: '',
                oname: '',
                status: null,
                applyTime: '',
                total: 0
            },
            formName: 'motor-holiday'
        };
    },

    methods: {
        async getList(pageNum) {
            let $self = this;
            this.params.status = this.status == '' ? null : this.status;
            $self.url = '/api/v1/motor-holiday/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.content.list.length > 0) {
                    let formId = response.data.content.list[0].id;
                    $self.$refs.LeaveDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.content.list;
                console.log($self.tableData);
                $self.params.total = response.data.content.total;
            } else {
                //  $self.msgTips('获取列表失败', 'warning');
            }
        },
        //选择行
        showCurrentId(row) {
            this.$refs.LeaveDetail.getFormDetails(row.id);
        },
        resetStatus(data) {
            let $self = this;
            for (let item of $self.tableData) {
                if (data.id == item.id) {
                    item.status = data.status;
                }
            }
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
            this.params = {};
            this.params.total = 0;
            this.params.uname = this.params.oname = this.params.applyTime = '';
            this.status = '';
            this.params.pageNum = 1;
            this.params.pageSize = 5;
            this.getList();
        },
        fomatterStatus(row, column) {
            let state;
            //0已保存1审核中2驳回3撤销4完成
            switch (row.status) {
                case '00':
                    state = '已保存';
                    break;
                case '01':
                    state = '审核中';
                    break;
                case '02':
                    state = '驳回';
                    break;
                case '03':
                    state = '撤销';
                    break;
                case '04':
                    state = '已完成';
                    break;
            }
            return state;
        }
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
<style lang="scss" scoped>
#LeaveFilter .el-form-item--small.el-form-item {
    width: 100%;
}
#LeaveFilter .el-select {
    width: 100%;
}
</style>
<style scoped>
#LeaveFilter .filterForm >>> .el-form-item__content {
    width: calc(100% - 100px);
}
</style>


