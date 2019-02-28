<template>
    <div id="YuSuan" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <YuSuanFilter @searchList="getSearchOptions"></YuSuanFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>

                </div>
                <YuSuanList ref="yusuanlist" :searchOptions="searchOptions"></YuSuanList>
            </el-card>
            <br>
            <el-card class="box-card">
                <!--
                <AnnoDetail :formId="formId" ref="annodetail"></AnnoDetail>
                -->
            </el-card>
        </div>
        <!--
        <el-dialog title="信息披露" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <AnnoForm @refreshData="refreshData" @saveStatus="saveStatus" @refreshDetail="refreshDetail" ref="annoform" :formId="dialogFormId" :operationType="operationType"></AnnoForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" v-if="this.showStatus == ''" @click="saveForm">保存</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-dialog>
        -->
    </div>
</template>
<script>
import YuSuanFilter from './YuSuanFilter';
import YuSuanList from './YuSuanList';
export default {
    name: 'YuSuan',
    mounted() {},
    data() {
        return {
            searchOptions: ''
        };
    },
    components: {
        YuSuanFilter,
        YuSuanList
    },
    methods: {
        getSearchOptions(search) {
            this.searchOptions = search;
        },
        createForm() {}
    }
};
</script>
<style lang="scss" scoped>
</style>