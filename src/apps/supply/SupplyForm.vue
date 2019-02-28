<template>
    <div id="SupplyForm">
        <el-form :model="rows" label-width="90px" :rules="rules" ref="formupdate">
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="用品种类:" prop="type">
                        <el-input v-model="rows.type"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
export default {
    name: 'SupplyForm',
    data() {
        return {
            rows: {
                type: ''
            },
            rules: {
                type: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入种类名称'
                    }
                ]
            }
        };
    },
    mounted() {},
    methods: {
        resetType() {
            this.rows.type = '';
        },
        saveFormValidate() {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm();
                }
            });
        },
        saveForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/supply_forms/type/save',
                    JSON.stringify(this.rows),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.resetType();
                    self.$emit('refreshDataType');
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss" scoped>
#SupplyForm .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
#SupplyForm .avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
#SupplyForm .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #ccc;
}
#SupplyForm .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
