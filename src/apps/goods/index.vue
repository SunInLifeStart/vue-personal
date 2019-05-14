<template>
    <div id="Goods">
        <el-card class="box-card">
            <div id="GoodsFilter">
                <el-form :inline="true" label-width="70px" label-position="left" class="demo-form-inline">
                    <el-row class="filterForm">
                        <el-col :span="8">
                            <el-form-item label="申请人">
                                <el-input placeholder="请输入申请人" v-model="params.applyUser"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属部门">
                                <el-input placeholder="请输入所属部门" v-model="params.dept"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据状态">
                                <el-select v-model="params.status" placeholder="请选择">
                                    <el-option v-for="item in statusOpertions" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item class="">
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
            <div id="GoodsList">
                <el-table :data="tableData" stripe style="width: 100%; cursor:pointer" @row-click="showCurrentId">
                    <el-table-column prop="applyUser" label="申请人">
                    </el-table-column>
                    <el-table-column prop="dept" label="申请部门">
                    </el-table-column>
                    <el-table-column prop="applyTime" label="申请时间">
                        <template slot-scope="scope">
                            {{scope.row.applyTime | dateformat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            {{scope.row.status | filterStatus}}
                            <!--
                            {{scope.row.status == '00'? '已保存' :scope.row.status == '01' ? '审核中': scope.row.status == '02' ? '已驳回': scope.row.status == '03' ? '已撤销': scope.row.status == '04'? '已完成': ''}}
                        -->
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100px">
                        <!--v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'"
                         v-if="scope.row.status == '已保存'"
                        -->
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '02' || scope.row.status == '00'">
                                <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="right" v-if="scope.row.status == '02' || scope.row.status == '00'">
                                <el-button type="text" icon="el-icon-delete" @click.stop="deleteCurrentLine(scope.row.id)"></el-button>
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
            <GoodsDetail :formId="formId" ref="GoodsDetail" @reloadList="reloadList" @resetStatus="resetStatus"></GoodsDetail>
        </el-card>
        <GoodsForm ref="GoodsForm" @reloadList="reloadList"></GoodsForm>
    </div>
</template>
<script>
import GoodsForm from './GoodsForm';
import GoodsDetail from './GoodsDetail';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'Goods',
    data() {
        return {
            tableData: [],
            formDetails: {},
            formId: '',
            statusOpertions: [
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
                pageNum: 1,
                pageSize: 5,
                applyUser: '',
                dept: '',
                status: null
            },
            formName: 'motor-receive'
        };
    },
    filters: {
        filterStatus: function(data) {
            console.log(data);
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
    components: {
        GoodsForm,
        GoodsDetail
    },
    methods: {
        //获取列表
        async getList(pageNum) {
            let $self = this;
            $self.url = '/api/v1/motor-receive/query';
            let response = await $self.getQueryList();
            if (response) {
                if (response.data.content.list.length > 0) {
                    let formId = response.data.content.list[0].id;
                    $self.$refs.GoodsDetail.getFormDetails(formId);
                } else {
                    $self.$refs.GoodsDetail.clearForm();
                }
                $self.tableData = response.data.content.list;
                $self.params.total = response.data.content.total;
            } else {
                $self.msgTips('获取列表失败', 'warning');
            }
        },

        //选择行
        showCurrentId(row) {
            this.$refs.GoodsDetail.getFormDetails(row.id);
        },

        //新建
        createNewForm() {
            this.$refs.GoodsForm.createForm();
        },

        //编辑
        editForm(data) {
            this.$refs.GoodsForm.setDataFromParent(data);
        },
        resetStatus(data) {
            let $self = this;
            for (let item of $self.tableData) {
                if (data.id == item.id) {
                    item.status = data.status;
                }
            }
        },
        reloadList(params) {
            if (params == 'reload') {
                this.params.pageNum = 1;
                this.getList();
            } else {
                this.$refs.GoodsDetail.getFormDetails(params.id);
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
            this.params.applyUser = this.params.dept = '';
            this.params.status = null;
            this.params.pageNum = 1;
            this.getList();
        }
    },
    mounted() {
        this.getList();
    }
};
</script>
<style lang="scss" scoped>
#Goods {
    .searchBtn {
        padding-right: 10px;
        .positionBtn {
            text-align: right;
        }
    }
    .el-select {
        width: 100%;
    }
    .card_margin_10 {
        margin-top: 10px;
    }
    .el-form-item--small.el-form-item {
        width: 100%;
    }
}
</style>
<style scoped>
#Goods .filterForm >>> .el-form-item__content {
    width: calc(100% - 80px);
}
</style>