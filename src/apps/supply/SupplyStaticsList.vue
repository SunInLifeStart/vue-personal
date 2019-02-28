<template>
    <div id="SupplyStaticsList">
        <el-table :data='tableData' @row-click="clickTableRow" max-height="350">
            <el-table-column prop="creatorName" label="申请人">
            </el-table-column>
            <el-table-column prop="organName" label="申请部门">
            </el-table-column>
            <el-table-column prop="created" label="申请时间">
                <template slot-scope="scope">
                    {{scope.row.created | dateformat}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
            </el-table-column>
            <el-table-column label="操作" width="170px">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="删除" placement="right" v-if="scope.row.status == '已保存'">
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
    name: 'SupplyStaticsList',
    data() {
        return {
            tableData: [],
            cookie_uid: '',
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
                options: this.searchOptions,
                uid: this.cookie_uid
            };
            axios
                .post('/api/v1/supply_forms/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableData = res.data.forms;
                    self.params.total = res.data.toalCount;
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
        deleteItem(row) {
            const self = this;
            axios
                .get('/api/v1/supply_forms/delete/' + row.id)
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
        clickTableRow(row) {
            this.$emit('formId', row.id);
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
        handleNodeClick() {},
        handleClick() {}
    },
    mounted() {
        console.log(this.$store.getters.LoginData.oid);
        const self = this;
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uid') > -1) {
                self.cookie_uid = decodeURIComponent(item.split('=')[1]);
            }
        });
        this.getList();
    }
};
</script>