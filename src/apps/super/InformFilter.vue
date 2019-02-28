<template>
    <div id="InformFilter">
        <div class="formit" style="border: 0px;margin-left:10px; margin-bottom: 10px;">
            <el-form :inline="true" :model="search_form" class="demo-form-inline" ref="search_form" >
                <el-form-item label="举报人：" prop="informer">
                    <el-input placeholder="" v-model="search_form.informer"></el-input>
                </el-form-item>
                <el-form-item label="举报人单位：" prop="reportUnit">
                    <el-input placeholder="" v-model="search_form.reportUnit"></el-input>
                </el-form-item>
                <el-form-item label="被举报人：" prop="personBeReported">
                    <el-input placeholder="" v-model="search_form.personBeReported"></el-input>
                </el-form-item>
                <el-form-item label="被举报人单位：" prop="reportedUnit">
                    <el-input placeholder="" v-model="search_form.reportedUnit"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  v-on:click="searchtitle()">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'InformFilter',
    data() {
        return {
            search_form: {
                informer: '',
                startdate: '',
                enddate: '',
                reportedUnit: ''
            }
        };
    }
};
</script>
