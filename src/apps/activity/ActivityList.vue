<template>
    <div id="ActivityList">
        <el-table :data="tableData" stripe style="margin-bottom: 10px;" @row-click="clickTableRow"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="活动名称"></el-table-column>
            <el-table-column prop="time" label="开始时间"></el-table-column>
            <el-table-column prop="place" label="活动地点"></el-table-column>
            <el-table-column prop="organName" label="上报单位"></el-table-column>
            <el-table-column prop="combinedUnit" label="联合上报单位"></el-table-column>
            <el-table-column prop="status" label="单据状态" >
                <!-- <template slot-scope="scope">
                    {{status[scope.row.status]}}
                </template> -->
            </el-table-column>
            <el-table-column prop="activityReport.status" label="活动状态"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
                <!-- <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="editForm(scope.row)"  v-if="scope.row.committed == null" >编辑</el-button>
                    <el-button size="small" type="primary" @click="deleteForm(scope.row)" v-if="scope.row.committed == null">删除</el-button>
                    <el-button size="small" type="primary" @click="reportForm(scope.row)" v-if="scope.row.status == '0'">上传活动报告</el-button>
                    <el-button size="small" type="primary"  v-if="scope.row.committed == null">提醒</el-button>
                </template> -->
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left" v-if="scope.row.activityReport == null || scope.row.activityReport.status =='已驳回' || scope.row.activityReport.status =='已保存'">
                        <el-button type="text" icon="el-icon-edit-outline"  @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.activityReport == null || scope.row.activityReport.status =='已驳回' || scope.row.activityReport.status =='已保存'">
                        <el-button type="text" icon="el-icon-delete" @click="deleteForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="上传活动报告" placement="left" v-if="scope.row.activityReport == null || scope.row.activityReport.status =='已驳回' || scope.row.activityReport.status =='已保存'">
                        <el-button type="text" icon="el-icon-upload2" @click="reportForm(scope.row)"></el-button>
                    </el-tooltip>
                     <el-tooltip class="item" effect="dark" content="提醒" placement="left" v-show="roleaa">
                        <el-button type="text" icon="el-icon-bell"></el-button>
                    </el-tooltip>
                </template>
                
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
    </div>
</template>
<script>
import axios from 'axios';
import cookies from 'js-cookie';
export default {
    name: 'ActivityList',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            status: {
                0: '已备案',
                1: '已报告'
            },
            selectArray: [],
            roleaa:false
        };
    },
    props: ['searchOptions'],
    mounted() {
        this.getList();
        this.role();
    },
    watch: {
        'searchOptions': function () {
            this.params.pageNum = 1;
            this.getList();
            
        },
        
    },
    methods: {
        role(){
            if(cookies.get('uname') == '伍孟然' || cookies.get('uname') == '赵倩影'){
                this.roleaa =true
            }
        },
        getList () {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: 'id',
                desc: true,
                options: this.searchOptions
            };
            axios.post('/api/v1/activity_forms/activities/list', JSON.stringify(params), {
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(res => {
                self.tableData = res.data.forms;
                self.params.total = res.data.totalCount;
                if (res.data.forms.length > 0) {
                    self.$emit('formId', res.data.forms[0].id, res.data.forms[0].status);
                }
            }).catch(function() {
                self.$message({
                    message: '操作失败',
                    type: 'error'
                });
            });
        },
        clickTableRow(row) {
            this.$emit('formId', row.id, row.status);
        },
        editForm (row) {
            this.$emit('editForm', row.id);
        },
        handleSelectionChange(val) {
            this.selectArray = val;
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
                        '/api/v1/activity_forms/activities/delete/' +
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
        //批量下载
        moreUplode() {
            if (this.selectArray.length > 0) {
                console.log(this.selectArray)
                for (let data of this.selectArray) {
                    if (data.attachment && data.attachment.length > 0) {
                        // for (let datauplode of data.attachment) {
                        //     this.common.download(datauplode.url);
                        // }
                        this.common.downloadFiles(
                            data.attachment[data.attachment.length - 1].url,
                            data.attachment[data.attachment.length - 1]
                        );
                    }
                }
            }
        },
        deleteForm (row) {
            const self = this;
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                axios.get('/api/v1/activity_forms/activities/delete/' + row.id, '', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                }).then(res => {
                    this.getList();
                }).catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            });
        },
        reportForm (row) {
            this.$emit('reportForm', row.id);
        },
        currentChange (pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange (pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>


    
</style>