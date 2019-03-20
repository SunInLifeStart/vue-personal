<template>
    <div id="TrainList">
        <el-table :data="tableData" stripe style="width: 100%" @row-click="clickTableRow">
            <el-table-column prop="submitter" label="申请人">
            </el-table-column>
            <el-table-column prop="department" label="所属部门">
            </el-table-column>
            <el-table-column prop="committed" label="提单时间">
            </el-table-column>
            <el-table-column prop="participant" label="培训/学习(参加人员)">
            </el-table-column>
            <el-table-column prop="schedule" label="日程安排">
            </el-table-column>
            <!-- <el-table-column prop="status" label="单据状态" width="200"></el-table-column> -->
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" >
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="left">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <br />
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
        </el-pagination>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import { debug, debuglog } from 'util';
export default {
    name: 'TrainList',
    data() {
        return {
            tableData: [],
            departmentones:'',
            submitterone:'',
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
        };
    },
    props: ['searchOptions'],
    watch: {
        searchOptions: function() {
            this.params.pageNum = 1;
            this.getList();
        }
    },
    methods: {
        // 查询列表
        getList() {
            const self = this;
            let aa=this.searchOptions
            this.searchOptions.forEach(val => {
               this.$nextTick(() => {
                   if(val.field=='department'){
                    self.departmentones=val.value
                    }
                    if(val.field=='submitter'){
                        self.submitterone=val.value
                    }
               })
                
            });
            const params = {
                pageNum: this.params.pageNum,
                pageSize: this.params.pageSize,
                // orderBy: 'created',
                // desc: true,
                // options: this.searchOptions,
                department:this.departmentones,
                submitter:this.submitterone
            };
            axios
                .post(
                    '/trainingApplication/queryList',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    if(res.data.status==200){
                        // for (let data of res.data.forms) {
                        //     let creatorname = '';
                        //     if (data.comments && data.comments.length > 0) {
                        //         for (let arr of data.comments) {
                        //             if (arr.node == '提交') {
                        //                 creatorname = arr.creatorId;
                        //             }
                        //         }
                        //     }
                        //     if (data.status == '已驳回') {
                        //         if (
                        //             creatorname == this.$store.getters.LoginData.uid
                        //         ) {
                        //             data.showedit = true;
                        //         } else {
                        //             data.showedit = false;
                        //         }
                        //     }
                        // }
                        self.tableData = res.data.content.list;
                        self.params.total = res.data.content.total;
                        if (res.data.content.list.length > 0) {
                            self.$emit('formId', res.data.content.list[0].id);
                        } else {
                            self.$emit('formId', '');
                        }
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
            this.$emit('editForm', row);
            this.$emit('showStatus', row.status);
        },
        deleteItem(row) {
            const self = this;
            let rowid={
                id:row.id
            }
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                axios
                    .get('/trainingApplication/' + rowid.id+'/delete')
                    .then(res => {
                        if(res.status==200){
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getList();
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            });
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            debugger
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