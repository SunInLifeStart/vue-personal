<template>
    <div id="News" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <NewsFilter @searchList="getSearchOptions"></NewsFilter>
                <div class="toolbar" style="margin-top: 10px;">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                    <el-button type="primary" @click="moreDeleteNews">批量删除</el-button>
                    <el-button type="primary" @click="moreUplode">批量下载</el-button>
                </div>
            </el-card>
            <el-card class="box-card">
                <NewsList ref="newslist" @formId="getFormId" @editForm="editForm" @deleteForm="deleteForm" :searchOptions="searchOptions" @showStatus="showStatus"></NewsList>
            </el-card>
            <br>
            <el-card class="box-card">
                <NewsDetail ref="newsdetail" :formId="formId"></NewsDetail>
            </el-card>
        </div>
        <el-dialog title="新闻管理" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%">
            <NewsForm ref="newsform" @refreshData="refreshData" @refreshDetail="refreshDetail" @saveStatus="saveStatus" :formId="dialogFormId" :operationType="operationType"></NewsForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm" v-if="showCreateBtn">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import NewsForm from './NewsForm';
import NewsFilter from './NewsFilter';
import NewsList from './NewsList';
import NewsDetail from './NewsDetail';
import axios from 'axios';
export default {
    name: 'News',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            statusNews: '',
            showCreateBtn:true
        };
    },
    components: {
        NewsForm,
        NewsFilter,
        NewsList,
        NewsDetail
    },
    methods: {
        showStatus(status,row) {
            if(row.processId){
                this.showCreateBtn = false;
            }
            if (status == '已保存') {
                this.statusNews = '';
            } else {
                this.statusNews = '已驳回';
            }
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        moreDeleteNews() {
            if (this.$refs.newslist) {
                this.$refs.newslist.moreDelete();
            }
        },
        moreUplode() {
            if (this.$refs.newslist) {
                this.$refs.newslist.moreUplode();
            }
        },
        createForm() {
            this.statusNews = '';
            this.dialogFormId = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.newsform) {
                this.$refs.newsform.clearForm();
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        deleteForm(id) {
            const self = this;
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                const ids = [id];
                axios
                    .delete(
                        '/api/v1/news_forms/deleteForm',
                        { data: ids },
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    )
                    .then(res => {
                        this.$refs.newslist.getList();
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            });
        },
        refreshData() {
            this.$refs.newslist.getList();
            this.$refs.newsdetail.getForm();
        },
        refreshDetail() {
            if (this.$refs.newsdetail) {
                this.$refs.newsdetail.getForm();
                this.$refs.newsdetail.getActions();
            }
        },
        saveForm() {
            this.$refs.newsform.saveFormValidate();
        },
        saveStatus(status) {
            this.dialogFormVisible = status;
        },
        submitForm() {
            this.$refs.newsform.submitCheck();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>