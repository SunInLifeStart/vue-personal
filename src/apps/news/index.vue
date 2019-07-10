<template>
    <div id="News">
        <el-card class="box-card">
            <!-- 查询 -->
            <el-form :inline="true" label-width="70px" label-position="left" :model="params" class="demo-form-inline">
                <el-row class="filterForm">
                    <el-col :span="8">
                        <el-form-item label="公司部门">
                            <el-input v-model="params.organName" placeholder="公司部门"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="作者">
                            <el-input v-model="params.creatorName" placeholder="作者"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="标题">
                            <el-input v-model="params.title" placeholder="标题"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="filterForm">
                    <el-col :span="8">
                        <el-form-item label="创建时间">
                            <el-date-picker v-model="params.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单据状态">
                            <el-select v-model="params.status" placeholder="请选择">
                                <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-button type="primary" @click="searchList">查询</el-button>
                            <el-button @click="resetInput">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>

            <!-- 新建 -->
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createNewForm">新建</el-button>
            </div>
            <div id="NewsList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId" highlight-current-row>
                    <el-table-column prop="title" label="标题">
                    </el-table-column>
                    <el-table-column prop="organName" label="公司部门">
                    </el-table-column>
                    <el-table-column prop="creatorName" label="作者">
                    </el-table-column>
                    <el-table-column prop="created" width="250" label="创建时间"></el-table-column>
                    <el-table-column width="100" label="单据状态">
                        <template slot-scope="scope">{{scope.row.status | filterStatus}}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
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
                <br />
                <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.page" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
            </div>
        </el-card>
        <br>
        <el-card class="box-card">
            <newsDetail :formId="formId" ref="newsDetail" @reloadList="reloadList" @resetStatus="resetStatus"></newsDetail>
        </el-card>
        <newsForm ref="newsForm" @reloadList="reloadList"></newsForm>
    </div>
</template>
<script>
import newsForm from './NewsForm';
import moment from 'moment';
import newsDetail from './NewsDetail';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'news',
    data() {
        return {
            tableData: [],
            searchOptions: [],
            formDetails: {},
            formId: '',
            statusOption: [
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
                    value: '04',
                    label: '已完成'
                }
            ],
            params: {
                page: 1,
                pageSize: 5,
                desc: true,
                options: [],
                orderBy: 'created',
                organName: ''
            },
            formName: 'news_forms'
        };
    },
    components: {
        newsForm,
        newsDetail
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
            $self.url = '/api/v1/news_forms/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.forms.length > 0) {
                    let formId = response.data.forms[0].id;
                    $self.$refs.newsDetail.getFormDetails(formId);
                }
                $self.tableData = response.data.forms;
                $self.params.total = response.data.totalCount;
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.newsDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.newsForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.newsForm.setDataFromParent(data);
        },
        reloadList(params) {
            if (params == 'reload') {
                this.params.page = 1;
                this.getList();
            } else {
                this.$refs.newsDetail.getFormDetails(params.id);
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
            this.searchOptions = [];
            if (this.params.title && this.params.title.trim() !== '') {
                this.searchOptions.push({
                    field: 'title',
                    filter: 'LIKE',
                    value: this.params.title
                });
            }
            if (
                this.params.creatorName &&
                this.params.creatorName.trim() !== ''
            ) {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'EQUAL',
                    value: this.params.creatorName
                });
            }
            if (
                this.params.reportingOrg &&
                this.params.reportingOrg.trim() !== ''
            ) {
                this.searchOptions.push({
                    field: 'reportingOrg',
                    filter: 'LIKE',
                    value: this.params.reportingOrg
                });
            }
            if (this.params.organName && this.params.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organName',
                    filter: 'LIKE',
                    value: this.params.organName
                });
            }
            if (this.params.created && this.params.created.length > 0) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: moment(this.params.created[0]).format('YYYY-MM-DD'),
                    value2: moment(this.params.created[1]).format('YYYY-MM-DD')
                });
            }
            if (this.params.status && this.params.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.params.status
                });
            }
            this.params.options = this.searchOptions;
            this.getList();
        },
        resetInput() {
            this.params = {
                page: 1,
                pageSize: 5,
                desc: true,
                options: [],
                orderBy: 'created',
                organName: ''
            };
            this.getList();
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
#News .el-form-item--small.el-form-item {
    width: 100%;
}
</style>
<style scoped>
#News .filterForm >>> .el-form-item__content {
    width: calc(100% - 80px);
}
#News .filterForm >>> .el-select {
    width: 100%;
}
#News .filterForm >>> .el-date-editor {
    width: calc(100% - 0px);
}
</style>

