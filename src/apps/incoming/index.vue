<template>
    <div id="Incoming">
        <el-card class="box-card">
            <!-- 查询 -->
            <div id="IncomingFilter">
                <el-form :inline="true" class="demo-form-inline">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="公文标题">
                                <el-input placeholder="请输入公文标题" v-model="params.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="来文机关">
                                <el-input placeholder="请输入来文机关" v-model="params.organ"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="来文字号">
                                <el-input v-model="params.wordNo" placeholder="来文字号"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="单据状态">
                                <el-select v-model="params.status" placeholder="请选择">
                                    <el-option v-for="item in s_status" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="收文日期">
                                <el-date-picker v-model="params.created" value-format="yyyy-MM-dd" type="date"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-button type="primary" @click="getList">查询</el-button>
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
            <div id="IncomingList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId" highlight-current-row>
                    <el-table-column prop="title" label="公文标题">
                    </el-table-column>
                    <el-table-column prop="organName" label="公司部门">
                    </el-table-column>
                    <el-table-column prop="organ" label="来文机关">
                    </el-table-column>
                    <el-table-column prop="wordNo" label="来文字号">
                    </el-table-column>
                    <el-table-column prop="creatorName" label="拟稿人">
                    </el-table-column>
                    <el-table-column width="100" label="单据状态">
                        <template slot-scope="scope">{{scope.row.status | filterStatus}}</template>
                    </el-table-column>
                    <el-table-column prop="receiptDate" label="收文日期">
                        <template slot-scope="scope">{{scope.row.receiptDate.substring(0, 10)}}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.status == '00' || scope.row.status == '02'">
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <br />
                <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.page" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </el-card>
        <br>
        <el-card class="box-card">
            <IncomingDetail :formId="formId" ref="IncomingDetail" @reloadList="reloadList" @resetStatus="resetStatus"></IncomingDetail>
        </el-card>
        <IncomingForm ref="IncomingForm" @reloadList="reloadList"></IncomingForm>
    </div>
</template>
<script>
import IncomingForm from './IncomingForm';
import IncomingDetail from './IncomingDetail';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'Incoming',
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: '',
            s_status: [
                {
                    value: '00',
                    label: '已保存'
                },
                {
                    value: '01',
                    label: '审核中'
                },
                {
                    value: '02',
                    label: '已驳回'
                },
                {
                    value: '03',
                    label: '已撤销'
                },
                {
                    value: '04',
                    label: '已完成'
                }
            ],
            total: 0,
            searchOptions: [],
            params: {
                page: 1,
                pageSize: 5,
                options: [],
                orderBy: 'created',
                desc: true
            },
            formName: 'incoming_forms'
        };
    },
    components: {
        IncomingForm,
        IncomingDetail
    },
    filters: {
        filterStatus: function(data) {
            let xmlJson = {
                '00': '已保存',
                '01': '审核中',
                '02': '已驳回',
                '03': '已撤销',
                '04': '已完成'
            };
            return xmlJson[data];
        }
    },
    methods: {
        //获取列表
        async getList(pageNum) {
            let $self = this;
            this.searchOptions = [];
            if (this.params.title && this.params.title.trim() !== '') {
                this.searchOptions.push({
                    field: 'title',
                    filter: 'LIKE',
                    value: this.params.title
                });
            }
            if (this.params.organ && this.params.organ.trim() !== '') {
                this.searchOptions.push({
                    field: 'organ',
                    filter: 'LIKE',
                    value: this.params.organ
                });
            }
            if (this.params.wordNo && this.params.wordNo.trim() !== '') {
                this.searchOptions.push({
                    field: 'wordNo',
                    filter: 'LIKE',
                    value: this.params.wordNo
                });
            }
            if (this.params.status && this.params.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'EQUAL',
                    value: this.params.status
                });
            }
            if (this.params.created) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: this.params.created,
                    value2: this.params.created
                    // value2: moment(this.params.created).format('YYYY-MM-DD')
                });
            }
            this.params.options = this.searchOptions;
            $self.url = '/api/v1/incoming_forms/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    $self.$refs.IncomingDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.total = response.data.totalCount;
            } else {
                $self.msgTips('获取列表失败', 'warning');
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.IncomingDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.IncomingForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.IncomingForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == 'reload') {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.IncomingDetail.getFormDetails(params.id);
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
        resetInput() {
            this.params = {
                page: 1,
                pageSize: 5,
                options: [],
                orderBy: 'created',
                desc: true
            };
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
#IncomingFilter .el-form-item--small.el-form-item {
    width: 100%;
}
</style>
<style scoped>
#IncomingFilter .filterForm >>> .el-form-item__content {
    width: calc(100% - 80px);
}
#IncomingFilter >>> .el-select {
    width: 100%;
}
#IncomingFilter .filterForm >>> .el-date-editor {
    width: 100%;
}
</style>

