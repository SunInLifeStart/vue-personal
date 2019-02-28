<template>
    <el-card shadow="always">
        <el-main>
            <div class='tableform'>
                <el-form :model="rows" class="demo-form-inline" ref="ruleForm" label-width="130px">
                    <el-row>
                        <el-col :span='12'>
                            <el-form-item label="举报人">
                                <el-input v-model="rows.informer"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label="联系电话 ">
                                <el-input v-model="rows.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label="举报人电子邮件">
                                <el-input v-model="rows.emailInformer"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label="举报人单位">
                                <el-input v-model="rows.reportUnit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label="被举报人">
                                <el-input v-model="rows.personBeReported"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label="被举报人单位">
                                <el-input v-model="rows.reportedUnit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label="被举报人电子邮件">
                                <el-input v-model="rows.reportedEmail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='12'>
                            <el-form-item label="是否匿名举报">
                                <el-radio-group v-model="rows.sfnm">
                                    <el-radio label="是"></el-radio>
                                    <el-radio label="否"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span='24'>
                            <el-form-item label="举报简介">
                                <el-input v-model="rows.jbjj"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span='24'>
                            <el-form-item label="举报详细内容">
                                <el-input type="textarea" v-model="rows.jbxxnr" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-main>
        <div style="text-align: center;">
            <el-button type="primary" @click="saveItems('ruleForm')">保存</el-button>
        </div>
    </el-card>
</template>
<script>
export default {
    name: 'InformDetail',
    data() {
        return {
            activeName: 'first',
            rows: {
                jbr: '',
                lxdh: '',
                jbrdzyj: '',
                jbrdw: '',
                bjbr: '',
                bjbrdw: '',
                sfnm: '',
                jbjj: ''
            }
        };
    }
};
</script>

