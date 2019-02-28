<template>
    <div id="DocIncomingDetail">
        <el-form :model='tabledata' style="margin-top:10px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="来文机关：">{{tabledata.organ}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="公文标题：">{{tabledata.title}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="来文字号：">{{tabledata.wordNo}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="份数：">{{tabledata.numberCopies}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收文编号：">{{tabledata.receiptNumber}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="创建日期：">{{tabledata.created}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="收文日期：">{{tabledata.receiptDate}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="拟办意见：">
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="文件传阅：">
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="办理结果：">
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
    name: 'DocIncomingDetail',
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
                    .get('/api/v1/doc/' + this.formId + '?type=2')
                    .then(res => {
                        self.tabledata = res.data;
                        if (self.tabledata.receiptDate) {
                            self.tabledata.receiptDate = moment(
                                self.tabledata.receiptDate
                            ).format('YYYY-MM-DD');
                        }
                        if (self.tabledata.created) {
                            self.tabledata.created = moment(
                                self.tabledata.created
                            ).format('YYYY-MM-DD');
                        }
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