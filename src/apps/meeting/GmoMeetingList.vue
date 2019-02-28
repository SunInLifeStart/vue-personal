<template>
    <div id="GmoMeetingList">
        <el-table :data="tableData" stripe style="width: 100%" @row-click="clickTableRow">
            <el-table-column prop="content" label="内容">
            </el-table-column>
            <el-table-column prop="attend" label="出席">
            </el-table-column>
            <el-table-column prop="writer" label="记录">
            </el-table-column>
            <!-- <el-table-column prop="created" label="拟稿时间">
                <template slot-scope="scope">
                    {{scope.row.created | dateformat}}
                </template>
            </el-table-column> -->
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="editForm(scope.row)" >编辑</el-button>
                    <!-- <el-button size="small" type="danger"  @click="deleteItem(scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <br/>
        <el-pagination 
            @size-change="sizeChange" 
            @current-change="currentChange" 
            :current-page="params.pageNum" 
            :page-sizes="[5, 10, 30, 50]" 
            :page-size="params.pageSize" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="params.total">
        </el-pagination>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'GmoMeetingList',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    props: ['searchOptions'],
    watch: {
        /** 
        searchOptions: function() {
            this.params.pageNum = 1;
            this.getList();
        }
        */
    },
    methods: {
        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: 'id',
                desc: true,
                options: this.searchOptions
            };
            axios
                .post('/api/v1/gmo_meeting_forms/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableData = res.data.forms;
                    self.params.total = res.data.totalCount;
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
        editForm(row) {
            //  console.log(row);
             this.$emit('editForm', row.id);
        },
        deleteItem(row) {
            /** 
            const self = this;
            axios
                .delete('/api/v1/incoming_forms/delete/' + row.id)
                .then(res => {
                    self.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    self.getList();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
                */
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        handleSizeChange() {},
        handlez(val) {
            this.currentPage = val;
        },
        handleNodeClick() {},
        handleClick() {}
    },
    mounted() {
       this.getList();
    }
};
</script>