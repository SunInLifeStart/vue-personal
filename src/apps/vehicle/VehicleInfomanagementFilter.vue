<template>
    <div id="MotionFilter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="车牌号码">
                <el-input v-model="formInline.plateNum" placeholder="车牌号码"></el-input>
            </el-form-item>
            <el-form-item label="车辆品牌">
                <el-input v-model="formInline.brand" placeholder="车辆品牌"></el-input>
            </el-form-item>
            <el-form-item label="车辆类型">
                <!-- <el-input v-model="formInline.type" placeholder="车辆类型"></el-input> -->
                <el-select clearable v-model="formInline.type" placeholder="请选择" prop="status">
                    <el-option v-for="item in status_options" :key="item.value_status" :label="item.label_status" :value="item.label_status" auto-complete="off"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车辆状态：">
                <el-input v-model="formInline.status" placeholder="车辆状态"></el-input>

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
                brand: '',
                type: '',
                created: [],
                status: ''
            },
            searchOptions: [],
            status_options: [
                {
                    value_status: '大型客车',
                    label_status: '大型客车'
                },
                {
                    value_status: '小型客车',
                    label_status: '小型客车'
                },
                {
                    value_status: '3',
                    label_status: '小型自动挡汽车'
                },
                {
                    value_status: '4',
                    label_status: '其它'
                }
            ]
        };
    },
    methods: {
        onReset() {
            this.formInline.type = '';
            this.formInline.plateNum = '';
            this.formInline.brand = '';
            this.formInline.status = '';
            this.onSubmit();
        },
        onSubmit() {
            this.searchOptions = [];
            if (this.formInline.plateNum.trim() !== '') {
                this.searchOptions.push({
                    field: 'plateNum',
                    filter: 'LIKE',
                    value: this.formInline.plateNum
                });
            }
            if (this.formInline.brand.trim() !== '') {
                this.searchOptions.push({
                    field: 'brand',
                    filter: 'LIKE',
                    value: this.formInline.brand
                });
            }
            if (this.formInline.type.trim() !== '') {
                this.searchOptions.push({
                    field: 'type',
                    filter: 'LIKE',
                    value: this.formInline.type
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'LIKE',
                    value: this.formInline.status
                });
            }
            // if (this.formInline.created && this.formInline.created.length > 0) {
            //     this.searchOptions.push({
            //         'field': 'created',
            //         'filter': 'BETWEEN',
            //         'value': moment(this.formInline.created[0]).format('YYYY-MM-DD'),
            //         'value2': moment(this.formInline.created[1]).format('YYYY-MM-DD')
            //     });
            // }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>