<template>
    <div id="DocViewDetail">
        <el-form :model='tabledata' style="margin-top:10px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="呈报件编号：">{{tabledata.submissionNo}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="文件标题：">{{tabledata.title}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿单位：">{{tabledata.organName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="拟稿人：">{{tabledata.creatorName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="部门呈报意见：">{{tabledata.submitComments}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="主管领导批示：">{{tabledata.leaderInstruction}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="总经理批示：">{{tabledata.managerInstruction}}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'DocViewDetail',
    data() {
        return {
            tabledata: {}
        };
    },
    props: ['formId'],
    mounted() {
        this.getForm();
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
                    .get('/api/v1/doc/' + this.formId + '?type=3')
                    .then(res => {
                        self.tabledata = res.data;
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
<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>