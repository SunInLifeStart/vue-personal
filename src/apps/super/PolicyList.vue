<template>
    <el-card id="PolicyList">
        <div slot="header" class="clearfix">
            <h4>政策要闻</h4>
            <el-button class="new-notice" type="primary" @click="dialogFormVisible = true; operationType = 'create'">草拟政策要闻</el-button>
        </div>
        <el-table :data="tableDraftData" :model="params">
            <!-- <el-table-column type="selection" align="center" width="50px">
            </el-table-column> -->
            <!-- <el-table-column prop="announcementId" label="序号" sortable align="center" fixed width="80px">
                <template slot-scope="scope">
                    {{(params.pageNum - 1) * params.pageSize + scope.$index + 1}}
                </template>
            </el-table-column> -->
            <el-table-column prop="title" label="标题" align="center">
                <template slot-scope="scope">
                    <!-- @click="openDraftPage('view', scope.row)" -->
                    <p>{{scope.row.title}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="grassUser" label="草拟人" align="center">
            </el-table-column>
            <el-table-column prop="grassUserUnit" label="草拟人单位" align="center">
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="170px">
                <template slot-scope="scope">
                    <el-button type="primary" @click="openDraftPage('edit', scope.row)">编辑</el-button>
                    <el-button type="primary" @click="viewItem('view', scope.row)">编辑</el-button>
                    <el-button type="danger" @click="deleteItem(scope.$index, scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="草拟政策要闻" :visible.sync="dialogFormVisible" max-width="1280px" width="70%">
            <el-card class="box-card">
                <el-form ref="rows" :model="rows" label-width="120px">
                    <div>
                        <el-button type="primary" @click="saveItem()">保存</el-button>
                        <el-button type="primary">提交</el-button>
                    </div>
                    <div style="margin-top:5px;">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="政策要闻" name="tzgg" v-model="rows">
                                <div style="margin:20px">
                                    <el-row :gutter="30">
                                        <el-col :span="24">
                                            <el-form-item label="标题:">
                                                <el-input v-model="rows.title"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="30">
                                        <el-col :span="24">
                                            <el-form-item label="内容:">
                                                <textarea v-model="rows.content" style="height:130px;width:100%"></textarea>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="30">
                                        <el-col :span="12">
                                            <el-form-item label="草拟人:">
                                                <el-input v-model="rows.grassUser"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="草拟时间:">
                                                <el-date-picker style="width:100%" type="date" v-model="rows.grassTime"></el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="30">
                                        <el-col :span="24">
                                            <el-form-item label="草拟人单位：">
                                                <el-input v-model="rows.grassUserUnit"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="30">
                                        <el-col :span="24">
                                            <el-form-item label="附件">
                                                <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                                    <i class="el-icon-plus"></i>
                                                </el-upload>
                                                <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item.url)">
                                                    <img class="el-icon-document" :src="item.iconUrl">
                                                    <p :title="item.name">{{item.name}}</p>
                                                </div>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-tab-pane>

                        </el-tabs>
                    </div>
                </el-form>
            </el-card>
        </el-dialog>
        <!-- 分页 -->
        <div class="block">
            <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="params.pageNum" :page-sizes="[5, 10, 30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
            </el-pagination>
        </div>
    </el-card>
</template>
<script>
import axios from 'axios';
export default {
    name: 'PolicyList',
    data() {
        return {
            params: {
                announcementId: '',
                title: '',
                grassUserUnit: '',
                grassUser: '',
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            tableDraftData: [],
            dialogFormVisible: false,
            dialogFormId: '',
            operationType: 'create',
            rows: {},
            activeName: 'tzgg',
            tabledata: []
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
        },
        openDraftPage(type, row) {
            this.$router.push({
                path: '/vue/oa/draft-notice',
                query: {
                    pageType: type,
                    row: row
                }
            });
        },
        refreshData() {
            this.$refs.outgoinglist.getList();
        },
        saveForm() {
            this.$refs.outgoingform.saveForm();
            this.dialogFormVisible = false;
        },
        handleSuccess(response, file) {
            this.tabledata.push({
                filename: file.name,
                filesize: file.size,
                filestatus: file.status
            });
            this.$refs.upload.clearFiles();
        },
        handlePreview() {},
        handleRemove() {},
        submitUpload() {
            this.$refs.upload.submit();
        },
        getList() {
            const self = this;
            const params = {
                page: this.params.pageNum,
                pageSize: this.params.pageSize,
                orderBy: "created",
                desc: true,
                options: this.searchOptions
            };
            axios
                .post(
                    '/api/v1/super_form/query',
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
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        saveItem() {
            const url = '/api/v1/super_form/save';
            axios
                .post(url, JSON.stringify(this.rows), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(function(response) {
                    self.$message({
                        message: response.data.message,
                        type: 'success'
                    });
                });
            // .catch(function() {
            //     self.$message({
            //         message: '操作失败',
            //         type: 'error'
            //     });
            // });
        }
    }
};
</script>
<style lang="scss" scoped>
#PolicyList {
    h4 {
        margin: 0;
        padding: 0;
    }
    .new-notice {
        float: right;
        margin: -32px 0 0 0;
    }
    .uploadBtn {
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
}
</style>


