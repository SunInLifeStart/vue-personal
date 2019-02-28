<template>
    <div id="SupplyTypeList">
        <el-table :data='tableData' @row-click="clickTableRow" max-height="350">
            <el-table-column prop="serial" label="编号" sortable>
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable>
            </el-table-column>
            <el-table-column prop="specification" label="规格" sortable>
            </el-table-column>
            <el-table-column prop="attachments" label="图片" sortable>
                <template slot-scope="scope">
                    <img :src="scope.row.attachments" width="50px" height="40px">
                </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" sortable>
            </el-table-column>
            <el-table-column prop="unit" label="单位" sortable>
            </el-table-column>
            <el-table-column prop="price" label="单价">
            </el-table-column>
            <el-table-column prop="classify" label="分类">
            </el-table-column>
            <el-table-column prop="depict" label="描述">
            </el-table-column>
            <el-table-column label="操作" width="170px">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="right">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
        </el-pagination>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'SupplyTypeList',
    data() {
        return {
            tableData: [],
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
        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: 'created',
                desc: true,
                options: this.searchOptions
            };
            axios
                .post(
                    '/api/v1/supply_forms/supplies/query',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.tableData = res.data.forms;
                    self.params.total = res.data.toalCount;
                    for (let i = 0; i < self.tableData.length; i++) {
                        /** 
                        if (self.tableData[i].type == null) {
                            self.tableData[i].typeId = '';
                        } else {
                            self.tableData[i].typeId =
                                self.tableData[i].type.suppliesType;
                        }
                        */
                        if (self.tableData[i].attachments.length > 0) {
                            self.tableData[i].attachments =
                                self.tableData[i].attachments[0].iconUrl;
                        } else {
                            self.tableData[i].attachments = '';
                        }
                    }
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
                    } else {
                        self.$emit('formId', '');
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
            this.$emit('editForm', row.id);
        },
        deleteItem(row) {
            const self = this;
            axios
                .get('/api/v1/supply_forms/supplies/delete/' + row.id)
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
        },
        changemethod(row) {},
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