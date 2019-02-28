<template>
    <el-card class="box-card" id="InformationReleaseDetail">
        <el-steps :active="crumb.index" finish-status="success">
            <el-step :title="item.name" :key="item.id" v-for="item in crumb.items"></el-step>
        </el-steps>
        <el-form ref="rows" :model="rows" label-width="100px">

            <div style="margin-top:5px;">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="通知公告" name="tzgg" v-model="rows">
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
                        </div>

                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="附件：" v-if="tableData.attachments && tableData.attachments.length > 0">
                                    <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item.url)">
                                        <img class="el-icon-document" :src="item.iconUrl">
                                        <p :title="item.name">{{item.name}}</p>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="审核流程：">
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <div class="audit" v-for="item in tableData.comments" :key="item.id">
                                    <div class="avatar">
                                        <img src="../../assets/avatar.png" alt="">
                                    </div>
                                    <div class="info">
                                        <div class="creator">
                                            <a href="#">{{item.creatorName}}</a> {{item.created | dateformat}}
                                        </div>
                                        <div class="content">{{item.content}}</div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                </el-tabs>
            </div>
        </el-form>
    </el-card>
</template>
<script>
export default {
    name: 'PolicyDetail',
    data() {
        return {};
    }
};
</script>
