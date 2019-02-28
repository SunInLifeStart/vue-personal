<template>
    <div id="ForeignNotice" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <ForeignNoticeFilter @searchList="getSearchOptions"></ForeignNoticeFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="cleanForm" v-if="foreignManager">新建</el-button>
                </div>
                <ForeignNoticeList ref="ForeignNoticelist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions" :foreignManager="foreignManager"></ForeignNoticeList>
            </el-card>
            <br>
            <el-card class="box-card">
                <ForeignNoticeDetail ref="ForeignNoticeDetail" :formId="formId"></ForeignNoticeDetail>
            </el-card>
        </div>
        <el-dialog title="通知公告" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <ForeignNoticeForm ref="foreignnoticeform" @info="getInfo" @refreshData="refreshData" :formId="dialogFormId" :operationType="operationType"></ForeignNoticeForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveForm">保存</el-button>
                <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import ForeignNoticeForm from './ForeignNoticeForm';
import ForeignNoticeFilter from './ForeignNoticeFilter';
import ForeignNoticeList from './ForeignNoticeList';
import ForeignNoticeDetail from './ForeignNoticeDetail';
import cookies from 'js-cookie';
export default {
    name: 'ForeignNotice',
    mounted() {
        this.role();
    },
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            foreignManager: false
        };
    },
    components: {
        ForeignNoticeForm,
        ForeignNoticeFilter,
        ForeignNoticeList,
        ForeignNoticeDetail
    },
    methods: {
        role(){
            for (let item of cookies.get('Role').split(',')) {
                console.log(item)
                if (item == 'foreignManager') {
                    this.foreignManager = true;
                }
                
            }
        },
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        getInfo(info) {
            this.dialogFormVisible = info;
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.ForeignNoticelist.getList();
            this.$refs.ForeignNoticeDetail.getForm();
        },
        saveForm() {
            this.$refs.foreignnoticeform.saveForm();
        },
        cleanForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.foreignnoticeform) {
                this.$refs.foreignnoticeform.cleanForm();
            }
        }
    }
};
</script>
<style lang="scss">
</style>