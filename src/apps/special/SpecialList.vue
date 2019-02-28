<template>
    <div id="SpecialList">
        <el-table :data="tableData" stripe style="width: 100%; margin-bottom: 10px;" @row-click="clickTableRow">
            <el-table-column prop="fileName" label="文件名" align="center" fixed width="260">
            </el-table-column>
            <el-table-column prop="issueDate" label="下发时间" align="center">
            </el-table-column>
            <el-table-column prop="issueName" label="下发人" align="center">
            </el-table-column>
            <el-table-column prop="organName" label="下发部门" align="center" min-width="150">
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="200">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editForm(scope.row)" v-if="scope.row.czqx"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="left" v-if="scope.row.committed == null">
                        <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row)" v-if="scope.row.czqx"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="下载" placement="left">
                        <el-button type="text" download="" icon="el-icon-download" @click="downlode(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="上传决议" placement="left">
                        <el-button type="text" icon="el-icon-upload2" @click="clickDialog(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total"></el-pagination>
        <el-dialog title="上传" :visible.sync="dialogVisible" width="70%">
            <el-form :model="resolution" label-width="125px">
                <el-form-item label="上传">
                    <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <div class="attachments" v-for="item in row.attachmentForIssu" :key="item.id">
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
import cookies from 'js-cookie';
export default {
    name: 'SpecialList',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            row: {},
            resolution: {},
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
                .post(
                    '/api/v1/super_forms/specialReport/query',
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
                        self.$emit('formId', '');
                    }
                    for (let item of res.data.forms) {
                        if (item.issueName == cookies.get('uname')) {
                            item.czqx = true;
                        } else {
                            item.czqx = false;
                        }
                    }
                    console.log(this.tableData);
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
                    .get('/api/v1/super_forms/specialReport/delete/' + row.id)
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
            //         self.selectItem.attachmentForIssu.push(item);
            //     });
            // }
            if (response.length > 0) {
                response.forEach(function(item) {
                    // self.selectItem.push(self.row.id);
                    self.row.attachmentForIssu.push(item);
                    self.row.creatorName = item.uname;
                });
                console.log(self.row);
            }
        },
        upsanve() {
            console.log(this.row);
            axios
                .post(
                    '/api/v1/super_forms/specialReport/save?uid=' +
                        this.row.creatorId +
                        '&uname=' +
                        this.row.issueName +
                        '&oid=' +
                        this.row.organId +
                        '&oname=' +
                        this.row.organName,
                    JSON.stringify(this.row),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    const downdata = {
                        formId: this.row.id,
                        fileName: this.row.attachmentForIssu[0].name,
                        fileId: this.row.attachmentForIssu[0].id,
                        creatorName: cookies.get('uname'),
                        organName: cookies.get('oname'),
                        oid: cookies.get('oid'),
                        uid: cookies.get('uid')
                    };
                    axios.post(
                        '/api/v1/super_forms/specialReportUpAndDown/upload',
                        JSON.stringify(downdata),
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    );
                })
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
            if (this.row.attachmentForIssu.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/super_forms/specialReport/deleteAttachment1/' +
                                    id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.row.attachmentForIssu.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.row.attachmentForIssu.splice(
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
        },
        downlode(row) {
            const self = this;
            const downdata = {
                formId: row.id,
                fileName: row.attachment[0].name,
                fileId: row.attachment[0].id,
                creatorName: cookies.get('uname'),
                organName: cookies.get('oname'),
                oid: cookies.get('oid'),
                uid: cookies.get('uid')
            };
            axios.post(
                '/api/v1/super_forms/specialReportUpAndDown/download',
                JSON.stringify(downdata),
                {
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            );
            if (row.attachment.length > 0) {
                for (let data of row.attachment) {
                    // console.log(data);
                    this.common.downloadFiles(data.url, data);
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
#SpecialList {
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