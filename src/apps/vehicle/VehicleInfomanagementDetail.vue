<template>
    <div id="VehicleInfomanagementDetail">
        <el-form :model='tabledata' style="margin-top:10px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="车牌号码">
                        {{tabledata.plateNum}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车辆型号">{{tabledata.model}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车辆品牌">{{tabledata.brand}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="车辆类型">{{tabledata.type}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="核载人数">{{tabledata.loadNum}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="购买日期">{{tabledata.purchase}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="行驶里程">{{tabledata.distance}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车辆颜色">{{tabledata.color}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车架号">{{tabledata.frameNum}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="发动机编号">{{tabledata.engineNum}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="登记日期">{{tabledata.registration}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发证日期">{{tabledata.certificate}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="保险开始时间">{{tabledata.insuranceStart}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保险结束时间">{{tabledata.insuranceEnd}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车辆状态">{{tabledata.status}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="公用车编码号">{{tabledata.code}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注">{{tabledata.remark}}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Comment from '../Comment';
export default {
    name: 'VehicleInfomanagementDetail',
    data() {
        return {
            tabledata: {}
        };
    },
    props: ['formId'],
    mounted() {
        this.getForm();
    },
    watch: {
        formId: function() {
            this.getForm();
        }
    },
    components: {
        Comment
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/vehicle_forms/vehicle/' + this.formId)
                    .then(res => {
                        self.tabledata = res.data;
                        if (self.tabledata.purchase) {
                            self.tabledata.purchase = moment(
                                self.tabledata.purchase
                            ).format('YYYY-MM-DD');
                        }
                        if (self.tabledata.registration) {
                            self.tabledata.registration = moment(
                                self.tabledata.registration
                            ).format('YYYY-MM-DD');
                        }
                        if (self.tabledata.certificate) {
                            self.tabledata.certificate = moment(
                                self.tabledata.certificate
                            ).format('YYYY-MM-DD');
                        }
                        if (self.tabledata.insuranceStart) {
                            self.tabledata.insuranceStart = moment(
                                self.tabledata.insuranceStart
                            ).format('YYYY-MM-DD');
                        }
                        if (self.tabledata.insuranceEnd) {
                            self.tabledata.insuranceEnd = moment(
                                self.tabledata.insuranceEnd
                            ).format('YYYY-MM-DD');
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        }
    }
};
</script>
<style lang="scss" scoped>
#VehicleInfomanagementDetail {
    .attachments {
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
            line-height: 15px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .audit {
        position: relative;
        margin-bottom: 10px;
        font-size: 14px;
        box-shadow: none;
        border: 0;
        .avatar {
            position: absolute;
            left: 5px;
            top: 5px;
            width: 36px;
            height: 36px;
            img {
                width: 36px;
                height: 36px;
                border: 1px solid #dddddd;
                border-radius: 50%;
            }
        }
        .info {
            margin-left: 60px;
            display: inline-block;
            width: calc(100% - 60px);
            .creator {
                height: 32px;
                line-height: 32px;
                a {
                    color: #4a6495;
                    text-decoration-line: none;
                }
            }
            .content {
                min-height: 32px;
            }
        }
    }
}
</style>
