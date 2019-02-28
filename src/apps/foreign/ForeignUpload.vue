<template>
    <div id="ForeignUpload" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <ForeignUploadFilter @searchList="getSearchOptions"></ForeignUploadFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="cleanForm" v-if="foreignManager">新建</el-button>
                </div>
                <ForeignUploadList ref="ForeignUploadlist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions" :foreignManager="foreignManager"></ForeignUploadList>
            </el-card>
            <br>
            <el-card class="box-card">
                <ForeignUploadDetail ref="ForeignUploadDetail" :formId="formId"></ForeignUploadDetail>
            </el-card>
        </div>
        <el-dialog title="资料下载" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <ForeignUploadForm ref="ForeignUploadform" @info="getInfo" @refreshData="refreshData" :formId="dialogFormId" :operationType="operationType"></ForeignUploadForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveForm">保存</el-button>
                <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import ForeignUploadForm from './ForeignUploadForm';
import ForeignUploadFilter from './ForeignUploadFilter';
import ForeignUploadList from './ForeignUploadList';
import ForeignUploadDetail from './ForeignUploadDetail';
import cookies from 'js-cookie';
export default {
    name: 'ForeignUpload',
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
            isinfo: '',
            foreignManager: false
        };
    },
    components: {
        ForeignUploadForm,
        ForeignUploadFilter,
        ForeignUploadList,
        ForeignUploadDetail
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
            this.$refs.ForeignUploadlist.getList();
            this.$refs.ForeignUploadDetail.getForm();
        },
        saveForm() {
            this.$refs.ForeignUploadform.saveForm();
        },
        cleanForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.ForeignUploadform) {
                this.$refs.ForeignUploadform.cleanForm();
            }
        }
    }
};
</script>
<style lang="scss">
</style>