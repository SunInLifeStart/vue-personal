<template>
    <div id="DrivertaskList">
        <el-table :data="tableData" stripe style="width: 100%; margin-bottom: 10px;">
            <el-table-column prop="name" label="姓名" align="center" min-width="400px">
            </el-table-column>
            <el-table-column prop="num" label="出车数量" align="center" min-width="400px">
            </el-table-column>
            <el-table-column prop="total" label="总公里数" align="center" min-width="400px">
            </el-table-column>
        </el-table>

    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'DrivertaskList',
    data() {
        return {
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
        };
    },
    props: ['searchOptions', 'searchCreated'],
    mounted() {
        this.getList();
    },
    watch: {
        searchOptions: function() {
            this.getList();
        },
        searchCreated: function() {
            this.getList();
        }
    },
    methods: {
        getList() {
            const self = this;
            let params;
            if (this.searchOptions != '' || this.searchCreated.length > 0) {
                params = {
                    name: this.searchOptions,
                    startTime:
                        this.searchCreated.length > 0
                            ? moment(this.searchCreated[0]).format(
                                  'YYYY-MM-DD hh:mm:ss'
                              )
                            : '',
                    endTime:
                        this.searchCreated.length > 0
                            ? moment(this.searchCreated[1]).format(
                                  'YYYY-MM-DD hh:mm:ss'
                              )
                            : ''
                };
            } else {
                params = {};
            }

            axios
                .post(
                    '/api/v1/vehicle_forms/getDriver',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.tableData = res.data;
                    // self.params.total = res.data.totalCount;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
#DrivertaskList {
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;
        border-radius: 2px;
        cursor: pointer;

        .el-upload {
            width: 100%;
            height: 100%;

            i {
                font-size: 50px;
                margin-top: 35px;
            }
        }
    }
    .attachments {
        position: relative;
        margin-bottom: 40px;
        margin-left: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        display: inline-block;
        border: 1px solid #c0c4cc;

        border-radius: 2px;
        cursor: pointer;
        img {
            width: 100px;
            height: 120px;
        }

        p {
            margin: 0;
            line-height: 20px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        i {
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px;
            &:hover {
                color: red;
            }
        }
    }
}
</style>