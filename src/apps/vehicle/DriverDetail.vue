<template>
    <div id="DriverDetail">
        <el-form ref="form" :model="tableData">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="司机姓名">{{tableData.name }}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="手机号码">{{tableData.phone}}</el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                    <el-form-item label="QQ号码">{{tableData.qq}}</el-form-item>
                </el-col> -->
                <el-col :span="8">
                    <el-form-item prop='draftUnit：' label="司机性别">{{tableData.sex}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='draftTime：' label="出生日期">{{tableData.birthday}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='draftUser：' label="司机住址">{{tableData.address}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='draftUnit：' label="执照号码">{{tableData.licenseNum}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="准驾车型">{{tableData.permitType}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="初次领证">{{tableData.firstLicenseTime}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="司机状态">{{tableData.status}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注信息">{{tableData.remarks }}</el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row>
                <el-col :span="24">
                    <el-form-item label="主管领导批示：">{{tableData.leaderInstruction}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="总经理批示：">{{tableData.managerInstruction}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="党委书记/董事长批示：">{{tableData.chairmanInstruction}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文：">{{tableData.content}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件：" v-if="tableData.attachments && tableData.attachments.length > 0">
                        <div class="attachments" v-for="item in tableData.attachments" :key="item.id" @click="downloadFile(item.url)">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <!-- <el-row>
                <el-col :span="24">
                    <el-form-item label="审核流程：">
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="audit" v-for="item in tableData.comments" :key="item.id">
                        <div class="avatar">
                            <img src="../../assets/avatar.png" alt="">
                        </div>
                        <div class="info">
                            <div class="creator">
                                <a href="#">{{item.creatorName}}</a> {{item.created | dateformat}}
                            </div>
                            <div class="content">{{item.content}}</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <Comment ref="comment"></Comment>
                <div style="margin-top:10px;">
                    <el-button type="primary" size="small" :key="action.type" v-for="action in actions" @click="doComment(action)">{{action.name}}</el-button>
                </div>
            </el-row> -->
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import Comment from '../Comment';
export default {
    name: 'DriverDetail',
    data() {
        return {
            tableData: {},
            pageType: 'show',
            actions: [],
            crumb: { items: [] }
        };
    },
    props: ['formId'],
    components: {
        Comment
    },
    mounted() {
        this.getForm();
        // if (this.formId != '') {
        //     this.getActions();
        // }
    },
    watch: {
        formId: function() {
            this.getForm();
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/vehicle_forms/driver/' + this.formId)
                    .then(res => {
                        self.tableData = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        // downloadFile(url) {
        //     window.open(url, '_blank');
        // },
       
       
    }
};
</script>
<style lang="scss" scope>
#DriverDetail {
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