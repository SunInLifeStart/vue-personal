<template>
    <div id="DocTotalList">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="年份">
                <el-date-picker v-model="formInline.created" type="year" placeholder="选择年">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <el-card class="box-card">
            <span>统计表</span>
            <el-table :data="tableDataOut" stripe style="width: 100%; margin-bottom: 10px;">
                <el-table-column prop="type" label="类型|月份">
                </el-table-column>
                <el-table-column prop="jan" label="一月">
                </el-table-column>
                <el-table-column prop="feb" label="二月">
                </el-table-column>
                <el-table-column prop="mar" label="三月">
                </el-table-column>
                <el-table-column prop="apr" label="四月">
                </el-table-column>
                <el-table-column prop="may" label="五月">
                </el-table-column>
                <el-table-column prop="jun" label="六月">
                </el-table-column>
                <el-table-column prop="jul" label="七月">
                </el-table-column>
                <el-table-column prop="aug" label="八月">
                </el-table-column>
                <el-table-column prop="sept" label="九月">
                </el-table-column>
                <el-table-column prop="oct" label="十月">
                </el-table-column>
                <el-table-column prop="nov" label="十一月">
                </el-table-column>
                <el-table-column prop="dec" label="十二月">
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'DocTotalList',
    data() {
        return {
            tableDataOut: [],
            formInline: {
                created: '2019'
            }
        };
    },
    props: ['searchOptions'],
    mounted() {
        this.getList();
    },
    watch: {},
    methods: {
        onSearch() {
            this.getList();
        },
        getList() {
            if (this.formInline.created) {
                this.formInline.created = moment(
                    this.formInline.created
                ).format('YYYY');
            } else {
                this.formInline.created = '2019';
            }
            const param = [this.formInline.created];
            axios
                .get('/api/v1/doc/stats/' + this.formInline.created)
                .then(res => {
                    this.tableDataOut = res.data.list;
                    this.$emit('getList', this.tableDataOut);
                });
        }
    }
};
</script>