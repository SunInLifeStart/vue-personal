<template>
    <div>
        <el-table :data='vehicletable' style="width: 100%;margin-top:20px;">
            <el-table-column type="selection" align="center" >
            </el-table-column>
            <el-table-column prop="djbh" label="序号" align="center" fixed>
            </el-table-column>
            <el-table-column prop="reportSummary" label="名称" align="center">
            </el-table-column>
            <el-table-column prop="personBeReported" label="邮箱" align="center">
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="editItem(scope.row)">编辑</el-button>
                    <el-button type="primary" size="mini" @click="viewItem(scope.row)">查看</el-button>
                    <el-button type="danger" size="mini" @click="deleteUser(scope.$index)">删除</el-button>
                    <!-- <el-button type="success" size="mini">下载</el-button>  -->
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 20px;text-align: center">
            <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MailLIst',
    data() {
        return {
            vehicletable: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
        };
    },
    methods: {
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        }
    }
};
</script>

