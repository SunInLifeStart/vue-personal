<template>
    <div id="PublicityMaterialsList">
        <el-table :data="tableData" stripe style="margin-bottom: 10px;" @row-click="clickTableRow" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="keywords" label="关键字"></el-table-column>
            <el-table-column prop="reportingUnit" label="报送单位"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="created" label="创建时间" min-width="150px;" sortable>
                <template slot-scope="scope">
                    {{scope.row.created | dateformat}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="240px">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="right" v-if="scope.row.status == '已保存'">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="下载" placement="right">
                        <el-button type="text" icon="el-icon-download" @click="uplode(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'PublicityMaterialsList',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            selectArray: [],
            cookie_oid: '',
            searchOgansId: '',
            setNull: false
        };
    },
    props: ['searchOptions', 'searchOgans'],
    mounted() {
        const self = this;
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('oid') > -1) {
                self.cookie_oid = decodeURIComponent(item.split('=')[1]);
            }
        });
        this.searchOgans.push({
            field: 'organId',
            filter: 'EQUAL',
            value: this.cookie_oid
        });
        this.searchOgansId = this.cookie_oid;
        this.getList();
    },
    watch: {
        searchOptions: function() {
            this.params.pageNum = 1;
            this.getList();
        },
        searchOgans: function() {
            console.log('222');
            console.log(this.searchOgans);
            this.$emit('clearFilter');
            this.$emit('clearSearchOptions');
            this.searchOgansId = this.searchOgans[0].value;
        }
    },
    methods: {
        getList() {
            let options = [];
            console.log(this.searchOgans);
            for (let data of this.searchOgans) {
                options.push(data);
            }
            for (let data of this.searchOptions) {
                options.push(data);
            }
            console.log('打印的数组');
            console.log(options);
            if (this.cookie_oid == this.searchOgansId) {
                const self = this;
                const params = {
                    page: this.params.pageNum,
                    pageSize: this.params.pageSize,
                    orderBy: 'id',
                    desc: true,
                    options: options
                };
                axios
                    .post(
                        '/api/v1/activity_forms/materials/query',
                        JSON.stringify(params),
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    )
                    .then(res => {
                        self.tableData = res.data.forms;
                        self.params.total = res.data.totalCount;
                        if (res.data.forms.length > 0) {
                            self.$emit('formId', res.data.forms[0].id);
                        } else {
                            self.$emit('clear');
                            self.$emit('formId', '');
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            } else {
                options.push({
                    field: 'done',
                    filter: 'IS_NOT_NULL'
                });
                const self = this;
                const params = {
                    page: this.params.pageNum,
                    pageSize: this.params.pageSize,
                    orderBy: 'id',
                    desc: true,
                    options: options
                };
                axios
                    .post(
                        '/api/v1/activity_forms/materials/query',
                        JSON.stringify(params),
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    )
                    .then(res => {
                        self.tableData = res.data.forms;
                        self.params.total = res.data.totalCount;
                        if (res.data.forms.length > 0) {
                            self.$emit('formId', res.data.forms[0].id);
                        } else {
                            self.$emit('clear');
                            self.$emit('formId', '');
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        deleteItem(row) {
            const self = this;
            axios
                .get('/api/v1/activity_forms/materials/delete/' + row.id)
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
        //批量下载
        moreUplode() {
            if (this.selectArray.length > 0) {
                for (let data of this.selectArray) {
                    if (data.attachments && data.attachments.length > 0) {
                        for (let datauplode of data.attachments) {
                            this.common.download(datauplode.url);
                        }
                    }
                }
            }
        },
        moreDelete() {
            if (this.selectArray.length > 0) {
                let arrId = [];
                for (let data of this.selectArray) {
                    arrId.push(data.id);
                }
                const self = this;
                axios
                    .get(
                        '/api/v1/activity_forms/materials/delete/' +
                            arrId.join(',')
                    )
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
            }
        },
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
        uplode(row) {
            if (row.attachments && row.attachments.length > 0) {
                for (let data of row.attachments) {
                    this.common.download(data.url);
                }
            }
        },
        handleSelectionChange(val) {
            console.log(val);
            this.selectArray = val;
        },
        editForm(row) {
            this.$emit('editForm', row.id);
            this.$emit('showStatus');
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>