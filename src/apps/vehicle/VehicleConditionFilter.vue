<template>
    <div id="MotionFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="车牌号">
                <el-input v-model="formInline.plateNum " placeholder="车牌号"></el-input>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'MotionFilter',
    data() {
        return {
            formInline: {
                plateNum: '',
                created: []
            },
            searchOptions: '',
            searchCreated: []
        };
    },
    methods: {
        onReset() {
            this.formInline.plateNum = '';
            this.formInline.created = [];
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = '';
            this.searchCreated = [];
            if (this.formInline.plateNum.trim() !== '') {
                this.searchOptions = this.formInline.plateNum;
            }
            if (this.formInline.created && this.formInline.created.length > 0) {
                this.searchCreated = this.formInline.created;
            }
            /** 
            if (this.formInline.created && this.formInline.created.length > 0) {
                this.searchOptions.push({
                    field: 'created',
                    filter: 'BETWEEN',
                    value: moment(this.formInline.created[0]).format(
                        'YYYY-MM-DD'
                    ),
                    value2: moment(this.formInline.created[1]).format(
                        'YYYY-MM-DD'
                    )
                });
            }
            */
            this.$emit('searchList', this.searchOptions, this.searchCreated);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>