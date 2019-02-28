<template>
    <div id="StatisticsParticularsList">
        <div>
            <h4>报告上传明细</h4>
        </div>
        <div>
            <el-table :data="list" style="margin-top:20px" @row-click='aa'>
                <el-table-column prop="fileName1" label="文件名" align="center">
                </el-table-column>
                <el-table-column prop="creatorName" label="用户名" align="center">
                </el-table-column>
                <el-table-column prop="organName" label="用户单位" align="center">
                </el-table-column>
                <el-table-column prop="issueDate" label="上传时间" align="center">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="editForm(scope.row)" v-if="scope.row.status == null">下载（上传文件）</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <el-dialog title="文件信息" :visible.sync="dialogVisible" width="50%">
            <div class="attachment" v-for="item in list" :key="list[]" @click="downloadFile(item)">
                <img class="el-icon-document" :src="item.iconUrl">
                <p :title="item.name">{{item.name}}</p>
                <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
            </div>
        </el-dialog> -->
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
            },
            dialogVisible: false
        };
    },
    // props: ['searchOptions'],
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
        getList() {
            const self = this;
            const params = {
                // page: this.params.pageNum,
                // pageSize: this.params.pageSize,
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
                    '/api/v1/super_forms/specialReportUpAndDown/upQueryDetail',
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
        },
        editForm(row) {
            // this.dialogVisible = true;
            // console.log(row);
            window.open(row[5])
        },
        aa(row){
            console.log(row)
        }
    }
};
</script>
<style lang="scss">
</style>


