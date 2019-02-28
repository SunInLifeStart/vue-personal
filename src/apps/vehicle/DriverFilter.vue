<template>
    <div id="DriverFilter">
        <el-form :inline="true" :model="formInline" ref="formInline">
            <el-form-item label="姓名" prop="name">
                <el-input placeholder="姓名" v-model="formInline.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input placeholder="手机号码" v-model="formInline.phone"></el-input>
            </el-form-item>
            <el-form-item label="准驾车型" prop="permitType">
                <el-input placeholder="准驾车型" v-model="formInline.permitType"></el-input>
            </el-form-item>
            <el-form-item label="司机状态" prop="status">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option key="1" label="正常" value="正常"></el-option>
                    <el-option key="2" label="请假" value="请假"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="search_btu">
                <el-button type="primary" v-on:click="onSubmit()">查询</el-button>
                <el-button type="primary" v-on:click="onReset()">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'DriverFilter',
    data() {
        return {
            formInline: {
                name: '',
                phone: '',
                permitType: '',
                status: ''
            },
            searchOptions: []
        };
    },
    methods: {
        onReset() {
            this.formInline.name = '';
            this.formInline.phone = '';
            this.formInline.permitType = '';
            this.formInline.status = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.name.trim() !== '') {
                this.searchOptions.push({
                    field: 'name',
                    filter: 'LIKE',
                    value: this.formInline.name
                });
            }
            if (this.formInline.phone.trim() !== '') {
                this.searchOptions.push({
                    field: 'phone',
                    filter: 'LIKE',
                    value: this.formInline.phone
                });
            }
            if (this.formInline.permitType.trim() !== '') {
                this.searchOptions.push({
                    field: 'permitType',
                    filter: 'LIKE',
                    value: this.formInline.permitType
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }

            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>