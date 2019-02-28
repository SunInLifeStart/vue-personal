<template>
    <div id="YuSuanList">
        <el-table :data='tableData' @row-click="clickTableRow" max-height="350">
            <el-table-column prop="crtDept" label="部门" min-width="300px">
            </el-table-column>
            <el-table-column label="年度预算" min-width="450px">
                <template slot-scope="scope">
                    <el-button type="text" @click="template('',scope.row)" v-show="scope.row.crtDept != '中关村发展集团'">{{scope.row.title}}</el-button>
                    <el-button type="text" @click="template('临时汇总',scope.row)" v-show="scope.row.crtDept == '中关村发展集团'">临时汇总</el-button>
                    <el-button type="text" @click="template('汇总编制',scope.row)" v-show="scope.row.crtDept == '中关村发展集团'">汇总编制</el-button>
                </template>
            </el-table-column>
            <el-table-column label="执行情况" min-width="350px">
                <template slot-scope="scope">
                    <el-button type="text" @click="jumpzhixing('临时查看',scope.row)" v-show="scope.row.crtDept == '中关村发展集团'">临时查看</el-button>
                    <el-button type="text" @click="jumpzhixing('生成执行汇总',scope.row)" v-show="scope.row.crtDept == '中关村发展集团'">生成执行汇总</el-button>
                    <el-button type="text" @click="jumpzhixing('未生成',scope.row)" v-if="!scope.row.status && scope.row.crtDept != '中关村发展集团'">未生成</el-button>
                    <el-button type="text" @click="jumpzhixing('查看',scope.row)" v-if="scope.row.status&& scope.row.crtDept != '中关村发展集团'">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作按钮" min-width="100px">
                <template slot-scope="scope">
                    <el-button type="text" @click="deleteItem(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
        </el-pagination>
        -->
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'YuSuanList',
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
            console.log(this.searchOptions);
            this.getList();
        }
    },
    methods: {
        getList() {
            const self = this;
            const params = {
                // page: this.params.pageNum,
                //pageSize: this.params.pageSize,
                // orderBy: 'created',
                // desc: true,
                year: this.searchOptions
                // uid: this.cookie_uid
            };
            axios
                .post(
                    '/budget/BudgetDptForm/queryList',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.tableData.push({
                        id: '',
                        crtDept: '中关村发展集团',
                        status: '中关村',
                        committed: ''
                    });
                    for (let data of res.data.content.list) {
                        self.tableData.push(data);
                    }
                    if (self.tableData.length > 0) {
                        self.$emit('formId', self.tableData[0].id);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        template(type, row) {
            this.$router.push({
                path: '/apps/yusuanform',
                query: {
                    type: type,
                    rows: row ? row : ''
                }
            });
        },
        jumpzhixing(type, row) {
            this.$router.push({
                path: '/apps/yusuanzhixing',
                query: {
                    type: type,
                    rows: row ? row : ''
                }
            });
        },
        deleteItem(row) {
            const self = this;
            axios
                .get('/budget/BudgetGroupForm/' + row.id + '/delete')
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
            // this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            // this.getList();
        },
        handleSizeChange() {},
        handleNodeClick() {},
        handleClick() {}
    },
    mounted() {
        console.log(this.$store.getters.LoginData.oid);
        this.getList();
    }
};
</script>