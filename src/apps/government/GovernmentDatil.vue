<template>
    <div id="GovernmentDetail">
        <el-form ref="form" :model="tableData">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="刊物名称：">{{tableData.title}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报送日期：">{{tableData.date}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报道人：">{{tableData.creatorName}}</el-form-item>
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
            </el-row>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import Comment from '../Comment';
export default {
    name: 'GovernmentDetail',
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
            } else {
                this.tableData = {};
            }
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/activity_forms/affairs/' + this.formId)
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
    }
};
</script>
<style lang="scss">
#GovernmentDetail {
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