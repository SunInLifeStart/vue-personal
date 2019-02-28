<template>
    <div id="ForeignOutDetail">
        <el-form ref="form" :model="tableData">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="标题：">{{tableData.title}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请人：">{{tableData.creatorName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="集团部门/子公司名称：">{{tableData.organName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请日期：">{{tableData.created}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"><el-form-item label="申请明细："></el-form-item></el-col>
                <el-col :span="24">
                    <el-table :data="tableData.items" border style="width: 100%; margin-top: 5px;">
                        <el-table-column prop="manager" label="负责人" width="120px">
                        </el-table-column>
                        <el-table-column prop="personNum" label="人数" width="120px">
                        </el-table-column>
                        <el-table-column prop="time" label="出境时间" width="160px">
                            <template slot-scope="scope">
                                {{scope.row.time | dateformat('YYYY-MM-DD')}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="stopTime" label="停留时间" width="120px">
                            <template slot-scope="scope">
                                {{scope.row.stopTime | dateformat('YYYY-MM-DD')}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="destination" label="目的地" width="120px">
                        </el-table-column>
                        <el-table-column prop="passWay" label="途径地点" width="120px">
                        </el-table-column>
                        <el-table-column prop="task" label="任务" width="120px">
                        </el-table-column>
                        <el-table-column prop="taskSource" label="任务来源或依据" width="180px">
                        </el-table-column>
                        <el-table-column prop="budget" label="费用预算及来源" width="180px">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import Comment from '../Comment';
export default {
    name: 'ForeignOutDetail',
    data() {
        return {
            tableData: {
                items: []
            },
            actions: []
        };
    },
    props: ['formId'],
    components: {
        Comment
    },
    mounted() {
        if (this.formId != '') {
            this.getForm();
        }
    },
    watch: {
        formId: function() {
            this.getForm();
            if (this.formId != '') {
            }
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/foreign_forms/out/' + this.formId)
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
        }
    }
};
</script>
<style lang="scss" scope>
#ForeignOutDetail {
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