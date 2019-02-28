<template>
    <div id="ForeignNoticeDetail">
        <el-form ref="form" :model="tableData">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="文档名称：">{{tableData.fileName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="创建人：">{{tableData.creatorName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="部门名称">{{tableData.organName}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件：" v-if="tableData.uploadAtts && tableData.uploadAtts.length > 0">
                        <div v-for="item in tableData.uploadAtts" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true}"></FilesOperate>
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
import FilesOperate from '../FilesOperate';
export default {
    name: 'ForeignNoticeDetail',
    data() {
        return {
            tableData: {}
        };
    },
    components: {
        Comment,
        FilesOperate
    },
    props: ['formId'],
    mounted() {
        if (this.formId != '') {
            this.getForm();
        }
    },
    watch: {
        formId: function() {
            this.getForm();
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/foreign_forms/upload/' + this.formId)
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
            //window.open(url, '_blank');
            this.common.preview(item);
        }
    }
};
</script>
<style lang="scss" scope>
#ForeignNoticeDetail {
    .uploadBtn {
        margin-right: 10px;
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
    .attachments {
        position: relative;
        margin-bottom: 40px;
        margin-right: 10px;
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
            line-height: 20px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        i {
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px;
            &:hover {
                color: red;
            }
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
    .input-with-select {
        width: 0px;
        margin-right: 10px;
        .el-input-group__prepend {
            background-color: #409eff;
            border-color: #409eff;
            color: #ffffff;
            border-radius: 4px;
        }
        &.reject .el-input-group__prepend {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .el-input__inner {
            width: 0;
            padding: 0;
            border: 0;
        }
        .el-input__suffix {
            left: 8px;
        }
    }
}
</style>