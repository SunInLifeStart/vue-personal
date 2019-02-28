<template>
    <div id="budgeting" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName">
                <el-tab-pane label="预 算" name="first">
                    <el-card class="box-card">
                        <budget></budget>
                    </el-card>
                    <br>
                </el-tab-pane>
                <el-tab-pane label="执 行" name="second">
                    <el-card class="box-card">
                        <Execute></Execute>
                    </el-card>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import budget from './budget';    
import Execute from './Execute';
export default {
    name: 'budgeting',
    data() {
        return {
            activeName: 'first',
            formInline: {},
            tableData: [
                {
                    qnys: '111',
                    creatdate: '2018-01-16'
                }
            ],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
        };
    },
    components: {
        Execute,
        budget
    },
    methods: {
        newForm() {},
        getList() {
            console.log('getlist');
        },
        //分页查询
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
<style>
</style>