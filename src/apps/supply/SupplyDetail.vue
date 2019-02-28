<template>
    <div id="SupplyDetail">
        <el-form :model="rows" style="margin-top:10px">
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="用品组织:">{{rows.name}}
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="单据编号:">{{rows.numbers}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请人:">{{rows.specification}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="申请时间:">{{rows.asknumber}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请组织:">{{rows.unit}}
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="申请部门:">{{rows.price}}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data='tableData'>
            <el-table-column prop="filePath" label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.filePath" alt="" style="border: 3px solid #ccc; width: 50px;height: 50px">
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column prop="price" label="单价">
            </el-table-column>
            <el-table-column prop="asknumber" label="申请数量">
            </el-table-column>
            <el-table-column prop="unit" label="单位">
            </el-table-column>
            <el-table-column prop="total" label="金额">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'SupplyDetail',
    data() {
        return {
            rows: {},
            tableData: []
        };
    },
    props: ['formId'],
    watch: {
        formId: function() {
            // this.getForm();
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/incoming_forms/' + this.formId)
                    .then(res => {
                        self.rows = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        }
    },
    mounted() {
        // this.getForm();
    }
};
</script>
<style lang="scss" scoped>
.el-row {
    margin-bottom: 10px;
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