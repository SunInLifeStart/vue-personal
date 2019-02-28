<template>
    <div>
        <div>
            <!-- @row-click="clickTableRow" -->
            <el-table :data="list" style="margin-top:20px" >
                <el-table-column prop="fileName" label="文件名" align="center">
                </el-table-column>
                <el-table-column prop="uploadCount" label="上传数量" align="center">
                </el-table-column>
                <el-table-column prop="downLoadCount" label="下载数量" align="center">
                </el-table-column>
            </el-table>
        </div>
        <!-- <div class="block" style="margin-top: 20px;text-align: center">
            <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
            </el-pagination>
        </div> -->
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'StatisticsList',
    data() {
        return {
            list: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
        };
    },
    props: ['searchOptions'],
    mounted() {
        this.getList();
    },
    watch: {
        searchOptions: function() {
            // this.params.pageNum = 1;
            this.getList();
        }
    },
    methods: {
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        getList() {
            const self = this;
            // const params = {
            //     // page: this.params.pageNum,
            //     // pageSize: this.params.pageSize,
            //     // orderBy: "created",
            //     // desc: true,
            //     options: this.searchOptions
            // };
            axios
                .post(
                    '/api/v1/super_forms/specialReportUpAndDown/tjQuery?fileName='+ this.searchOptions,
                    // JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.list = res.data;
                    /** 
                    self.list = res.data.forms;
                    consoler.log(res);
                    self.params.total = res.data.totalCount;
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
                    }
                    */
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
