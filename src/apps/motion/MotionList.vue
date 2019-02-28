<template>
    <div id="MotionList">
        <el-table :data="tableData" stripe style="width: 100%; margin-bottom: 10px;" @row-click="clickTableRow">
            <el-table-column prop="fileNo" label="呈报件编号" align="center" fixed width="260">
            </el-table-column>
            <el-table-column prop="title" label="文件标题" align="center">
            </el-table-column>
            <el-table-column prop="creatorName" label="拟稿人" align="center">
            </el-table-column>
            <el-table-column prop="organName" label="拟稿单位" align="center" min-width="150">
            </el-table-column>
            <el-table-column prop="created" label="拟稿时间" align="center" min-width="150">
            </el-table-column>
            <el-table-column prop="status" label="单据状态" align="center">
            </el-table-column>
            <!--  <el-table-column prop="telephone" label="电话" sortable align="center">
            </el-table-column> -->
            <el-table-column label="操作" fixed="right" width="200">
                <template slot-scope="scope">
                    <!-- <el-button @click="editForm(scope.row)" type="primary" v-if="scope.row.committed == null">编辑
                    </el-button>
                    <el-button type="danger" @click="deleteItem(scope.row)" v-if="scope.row.committed == null">删除
                    </el-button>
                    <el-button type="primary" @click="clickDialog(scope.row)">查看决议附件</el-button> -->
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left"  v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="left"  v-if="scope.row.status == '已驳回' || scope.row.status == '已保存'">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="上传决议" placement="left">
                        <el-button type="text" icon="el-icon-upload2" @click="clickDialog(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
        <el-dialog title="决议附件" :visible.sync="dialogVisible" width="70%">
            <el-form :model="resolution" label-width="125px">
                <el-form-item label="决议附件">
                    <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <div class="attachments" v-for="item in row.resultAttachments" :key="item.id">
                        <img class="el-icon-document" :src="item.iconUrl">
                        <p :title="item.name">{{item.name}}</p>
                        <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="upsanve">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'MotionList',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            row: {},
            resolution: {
                resultAttachments: []
            },
            dialogVisible: false,
            selectItem: []
        };
    },
    props: ['searchOptions'],
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
        clickDialog(row) {
            this.dialogVisible = true;
            this.row = row;
            this.selectItem = [];
        },
        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: 'created',
                desc: true,
                options: this.searchOptions
            };
            axios
                .post('/api/v1/motion_forms/query', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.tableData = res.data.forms;
                    self.params.total = res.data.totalCount;
                    if (res.data.forms.length > 0) {
                        self.$emit('formId', res.data.forms[0].id);
                    } else {
                        self.$emit('formId', '');
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
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                const self = this;
                axios
                    .get('/api/v1/motion_forms/delete/' + row.id)
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
            });
        },
        clickTableRow(row) {
            this.$emit('formId', row.id);
        },
        editForm(row) {
            this.$emit('editForm', row.id);
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        handleSuccess(response, file) {
            const self = this;
            // if (response.length > 0) {
            //     response.forEach(function(item) {
            //         self.selectItem.resultAttachments.push(item);
            //     });
            // }
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.selectItem.push(item.id);
                    self.row.resultAttachments.push(item);
                });
            }
        },
        upsanve() {
            axios
                .post(
                    '/api/v1/motion_forms/' +
                        this.row.id +
                        '/resultAttachment/' +
                        this.selectItem.join(','),
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            this.dialogVisible = false;
        },
        deleteAttachment(id) {
            const self = this;
            if (this.row.resultAttachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/motion_forms/deleteAttachment/' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.row.resultAttachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.row.resultAttachments.splice(
                                            index,
                                            1
                                        );
                                    }
                                });
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                );
            }
        }
    }
};
</script>
<style lang="scss" scoped>
#MotionList {
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;
        border-radius: 2px;
        cursor: pointer;

        .el-upload {
            width: 100%;
            height: 100%;

            i {
                font-size: 50px;
                margin-top: 35px;
            }
        }
    }
    .attachments {
        position: relative;
        margin-bottom: 40px;
        margin-left: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        display: inline-block;
        border: 1px solid #c0c4cc;

        border-radius: 2px;
        cursor: pointer;
        img {
            width: 100px;
            height: 120px;
        }

        p {
            margin: 0;
            line-height: 20px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        i {
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px;
            &:hover {
                color: red;
            }
        }
    }
}
</style>