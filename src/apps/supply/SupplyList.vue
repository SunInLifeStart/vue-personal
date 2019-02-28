<template>
    <div id="SupplyList">
        <el-table :data='tableData' max-height="350">
            <el-table-column prop="type" label="用品种类">
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
        <el-dialog title="编辑用品" :append-to-body="true" :visible.sync="dialogFormVisibleEdit" max-width="1280px" width="50%">
            <el-form :model="rows" label-width="80px">
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label="用品种类:">
                            <el-input v-model="rows.type"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveEditType">保存</el-button>
                <el-button type="default" @click="dialogFormVisibleEdit = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'SupplyList',
    data() {
        return {
            tableData: [],
            dialogFormVisibleEdit: false,
            rows: {}
        };
    },
    methods: {
        getList() {
            const self = this;
            const params = {};
            axios
                .post(
                    '/api/v1/supply_forms/type/query',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.tableData = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        editForm(row) {
            this.dialogFormVisibleEdit = true;
            const self = this;
            if (row.id != '') {
                axios
                    .get('/api/v1/supply_forms/type/' + row.id)
                    .then(res => {
                        self.rows = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        saveEditType() {
            const self = this;
            axios
                .post(
                    '/api/v1/supply_forms/type/save',
                    JSON.stringify(self.rows),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.dialogFormVisibleEdit = false;
                    self.getList();
                    self.$emit('refreshDataEditType');
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        deleteItem(row) {
            const self = this;
            axios
                .get('/api/v1/supply_forms/type/delete/' + row.id)
                .then(res => {
                    self.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    self.getList();
                    self.$emit('refreshDataEditType');
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    },
    mounted() {
        this.getList();
    }
};
</script>