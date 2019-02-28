<template>
    <div id="StatisticsFilter">
        <el-form :inline="true" class="demo-form-inline" :model="formInline">
            <el-form-item label="文件名:" prop="notice_person">
                <el-input v-model="formInline.fileName" placeholder="文件名"></el-input>
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
    name: 'StatisticsFilter',
    data() {
        return {
            formInline: {
                type: '',
                fileName: '',
                created: '',
                status:'',
            },
            searchOptions: '',
        };
    },
    methods: {
        onReset() {
            this.formInline.fileName = '';
            // this.formInline.type = '';
            // // this.formInline.organName = '';
            // this.formInline.status = '';
            // this.formInline.created = '';
            this.onSubmit();
        },
        onSubmit() {
            // this.searchOptions = '';
            // if (this.formInline.fileName.trim() !== '') {
            //     // this.searchOptions.push({
            //     //     field: 'fileName',
            //     //     filter: 'LIKE',
            //     //     value: this.formInline.fileName
            //     // });
            // }
                this.searchOptions = this.formInline.fileName
            // if (this.formInline.type.trim() !== '') {
            //     this.searchOptions.push({
            //         field: 'type',
            //         filter: 'LIKE',
            //         value: this.formInline.type
            //     });
            // }
            // if (this.formInline.status.trim() !== '') {
            //     this.searchOptions.push({
            //         field: 'status',
            //         filter: 'LIKE',
            //         value: this.formInline.status
            //     });
            // }
            // if (this.formInline.created && this.formInline.created.length > 0) {
            //     this.searchOptions.push({
            //         field: 'created',
            //         filter: 'BETWEEN',
            //         value: moment(this.formInline.created[0]).format(
            //             'YYYY-MM-DD'
            //         ),
            //         value2: moment(this.formInline.created[1]).format(
            //             'YYYY-MM-DD'
            //         )
            //     });
            // }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>