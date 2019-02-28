<template>
    <div id="StatisticsParticularsList">
        <div>
            <h4>报告下载明细</h4>
        </div>
        <div>
            <el-table :data="list" style="margin-top:20px">
                <el-table-column prop="fileName1" label="文件名" align="center">
                </el-table-column>
                <el-table-column prop="creatorName" label="用户名" align="center">
                </el-table-column>
                <el-table-column prop="organName" label="用户单位" align="center">
                </el-table-column>
                <el-table-column prop="issueDate" label="下载时间" align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'StatisticsParticularsList',
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
    // props: ['searchOptions'],
    mounted() {
        this.getList();
    },
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
                // orderBy: 'id',
                // desc: true,
                // options: [
                //     {
                //         field: 'id',
                //         filter: 'IS_NOT_NULL'
                //     },
                //     {
                //         field: 'downloadCount',
                //         filter: 'EQUAL',
                //         value: '1'
                //     }
                // ]
            };
            axios
                .post(
                    '/api/v1/super_forms/specialReportUpAndDown/downQueryDetail',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.list = res.data;
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
<style lang="scss" scoped>
</style>


