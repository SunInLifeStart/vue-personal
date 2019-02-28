<template>
    <div id="MediumDetail">
        <!-- <el-steps :active="crumb.index" finish-status="success">
            <el-step :title="item.name" :key="item.id" v-for="item in crumb.items"></el-step>
        </el-steps> -->
        <el-form ref="form" :model="tableData">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="媒体名称：">{{tableData.name}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="媒体链接：">{{tableData.href}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报道题目：">{{tableData.title}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报道日期：">{{tableData.date}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报道单位：">{{tableData.organName}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="附件：">
                        <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item)">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
                        </div>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="24">
                    <el-form-item label="审核流程：">
                    </el-form-item>
                </el-col> -->
            </el-row>
            <!-- <el-row>
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
            <el-row>
                <Comment ref="comment"></Comment>
                <div style="margin-top:10px;">
                    <el-button type="primary" size="small" :key="action.type" v-for="action in actions" @click="doComment(action)">{{action.name}}</el-button>
                </div>
            </el-row> -->
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import Comment from '../Comment';
export default {
    name: 'MediumDetail',
    data() {
        return {
            tableData: {},
            actions: [],
            crumb: { items: [] }
        };
    },
    props: ['formId'],
    components: {
        Comment
    },
    mounted() {
        this.getForm();
        if (this.formId != '') {
            // this.getActions();
        }
    },
    watch: {
        formId: function() {
            this.getForm();
            if (this.formId != '') {
                // this.getActions();
            }
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/activity_forms/media/' + this.formId)
                    .then(res => {
                        self.tableData = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        downloadFile(item) {
            // window.open(url, '_blank');
            this.common.preview(item);
        },
        // getActions() {
        //     const param = this.formId;
        //     axios.get('/api/v1/publish/' + param + '/actions').then(res => {
        //         this.actions = res.data.types;
        //     });
        //     axios.get(`/api/v1/publish/${this.formId}/crumb`).then(res => {
        //         this.crumb = { items: res.data, index: -1 };
        //         res.data.forEach((item, index) => {
        //             if (item.active) {
        //                 this.crumb.index = index;
        //             }
        //         });
        //     });
        // },
        // doComment(action) {
        //     let atIds = this.$refs.comment.getIds();
        //     let comment = this.$refs.comment.getComment();

        //     if (this.$refs.comment.isEmpty()) {
        //         comment = action.name;
        //     }
        //     axios
        //         .put(`/api/v1/publish/${this.formId}/comment`, {
        //             content: comment
        //         })
        //         .then(res => {
        //             comment = '';
        //             this.$refs.comment.clearComment();
        //             this.getForm();

        //             if (!'SAVE,PREVIEW,COMMENT'.includes(action.type)) {
        //                 axios
        //                     .put(`/api/v1/publish/${this.formId}/signal`, {
        //                         action: action.type,
        //                         assignees: atIds
        //                     })
        //                     .then(res => {
        //                         this.getActions();
        //                     });
        //             }
        //         });
        // }
    }
};
</script>
<style lang="scss" scope>
#MediumDetail {
    .attachments {
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
            line-height: 15px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .audit {
        position: relative;
        margin-bottom: 10px;
        font-size: 14px;
        box-shadow: none;
        border: 0;
        .avatar {
            position: absolute;
            left: 5px;
            top: 5px;
            width: 36px;
            height: 36px;
            img {
                width: 36px;
                height: 36px;
                border: 1px solid #dddddd;
                border-radius: 50%;
            }
        }
        .info {
            margin-left: 60px;
            display: inline-block;
            width: calc(100% - 60px);
            .creator {
                height: 32px;
                line-height: 32px;
                a {
                    color: #4a6495;
                    text-decoration-line: none;
                }
            }
            .content {
                min-height: 32px;
            }
        }
    }
}
</style>