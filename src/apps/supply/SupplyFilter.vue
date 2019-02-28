<template>
    <div id="SupplyFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="申请时间 ：">
                <el-date-picker v-model="formInline.applicationtime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="发放时间：">
                <el-date-picker v-model="formInline.sendtime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
 
<script>
/* eslint-disable */
export default {
    name: 'SupplyFilter',
    data() {
        return {
            searchOptions: [],
            formInline: {
                applicationtime: '',
                sendtime: ''
            },
            options_harry: [
                {
                    value_harryy: 'option1',
                    label_xwfx: '一般'
                },
                {
                    value_harryy: 'option2',
                    label_xwfx: '较急'
                },
                {
                    value_harryy: 'option3',
                    label_xwfx: '急'
                },
                {
                    value_harryy: 'option4',
                    label_xwfx: '特急'
                }
            ]
        };
    },
    methods: {
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.title.trim() !== '') {
                this.searchOptions.push({
                    field: 'title',
                    filter: 'LIKE',
                    value: this.formInline.title
                });
            }
            if (this.formInline.creatorName.trim() !== '') {
                this.searchOptions.push({
                    field: 'creatorName',
                    filter: 'EQUAL',
                    value: this.formInline.creatorName
                });
            }
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    field: 'organName',
                    filter: 'EQUAL',
                    value: this.formInline.organName
                });
            }
            if (this.formInline.created.length > 0) {
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
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>