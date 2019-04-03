<template>
    <div id="OutgoingFilter">
        <el-form :inline="true" :model="formInline"  label-position="left" class="demo-form-inline">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="标题" label-width="50px">
                        <el-input v-model="formInline.title" placeholder="标题"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单据状态"  label-width="70px">
                        <el-select v-model="formInline.status" placeholder="请选择">
                            <el-option v-for="item in formInline.options_status" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                   <el-col :span="8" class="searchBtn">
                    <el-form-item class="positionBtn">
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetOptions">重置</el-button>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                    <el-form-item label="拟稿人">
                        <el-input v-model="formInline.creatorName" placeholder="拟稿人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="部门">
                        <el-input v-model="formInline.organName" placeholder="部门"></el-input>
                    </el-form-item>
                </el-col> -->
            </el-row>
            <!-- <el-row>
                <el-col :span="8">
                    <el-form-item label="单据状态">
                        <el-select v-model="formInline.status" placeholder="请选择">
                            <el-option v-for="item in formInline.options_status" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="创建时间">
                        <el-date-picker v-model="formInline.created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8" class="searchBtn">
                    <el-form-item class="positionBtn">
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                        <el-button @click="resetOptions">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row> -->
        </el-form>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'OutgoingFilter',
    data() {
        return {
            formInline: {
                title: '',
                creatorName: '',
                organName: '',
                created: [],
                status:"",
                options_status:[
                    "已保存",
                    "已驳回",
                    "审核中",
                    "已完成",
                ]
            },
            searchOptions: []
        };
    },
    methods: {
        resetOptions(){
            this.formInline = {
                title: '',
                creatorName: '',
                organName: '',
                created: [],
                status:"",
                options_status:[
                    "已保存",
                    "已驳回",
                    "审核中",
                    "已完成",
                ]
            }
        },
        onSubmit () {
            this.searchOptions = [];
            if (this.formInline.title.trim() !== '') {
                this.searchOptions.push({
                    'field': 'title',
                    'filter': 'LIKE',
                    'value': this.formInline.title
                });
            }
            if (this.formInline.creatorName.trim() !== '') {
                this.searchOptions.push({
                    'field': 'creatorName',
                    'filter': '',
                    'value': this.formInline.creatorName
                });
            }
            if (this.formInline.organName.trim() !== '') {
                this.searchOptions.push({
                    'field': 'organName',
                    'filter': 'LIKE',
                    'value': this.formInline.organName
                });
            }
            if (this.formInline.status.trim() !== '') {
                this.searchOptions.push({
                    field: 'status',
                    filter: 'EQUAL',
                    value: this.formInline.status
                });
            }
            if (this.formInline.created && this.formInline.created.length > 0) {
                this.searchOptions.push({
                    'field': 'created',
                    'filter': 'BETWEEN',
                    'value': moment(this.formInline.created[0]).format('YYYY-MM-DD'),
                    'value2': moment(this.formInline.created[1]).format('YYYY-MM-DD')
                });
            }
            this.$emit('searchList', this.searchOptions);
        }
    }
};
</script>
<style lang="scss" scoped>
    #OutgoingFilter {
        .searchBtn {
            padding-right: 10px;
            .positionBtn{
                text-align: left;
            }
        }
        .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
            width: 100%;
        }
        .el-form-item--small.el-form-item{
            width: 100%;
        }
        .el-select {
            width: 100%;
        }
    }
</style>
<style scoped>
    #OutgoingFilter >>> .el-form-item__content{
        width: calc(100% - 80px);
    }
</style>