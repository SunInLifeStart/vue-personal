<template>
    <div id="SupplyTypeDetail">
        <el-form :model="rows" style="margin-top:10px">
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="名称:">{{rows.name}}
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="编号:">{{rows.serial}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="规格:">{{rows.specification}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='8'>
                    <el-form-item label="数量:">{{rows.quantity}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单位:">{{rows.unit}}
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label="单价:">{{rows.price}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='24'>
                    <el-form-item label="用品分类:">{{rows.classify}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='24'>
                    <el-form-item label="图片：">
                        <div v-for="item in  rows.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true}" @getId="getId"></FilesOperate>
                        </div>
                        <!--
                        <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item)">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
                        </div>
                        -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='24'>
                    <el-form-item label="描述:">{{rows.depict}}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import axios from 'axios';
import FilesOperate from '../FilesOperate';
export default {
    name: 'SupplyTypeDetail',
    data() {
        return {
            rows: {
                classify: ''
            },
            type: '',
            imageUrl: ''
        };
    },
    components: {
        FilesOperate
    },
    props: ['formId'],
    watch: {
        formId: function() {
            if (this.formId != '') {
                this.getForm();
            } else {
                this.rows = {};
            }
        }
    },
    methods: {
        getId(id) {},
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/supply_forms/supplies/' + this.formId)
                    .then(res => {
                        self.rows = res.data;
                        /** 
                        if (res.data.attachments.length > 0) {
                            self.imageUrl = res.data.attachments.iconUrl;
                        } else {
                            self.imageUrl = '';
                        }
                        */
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        downloadFile(item) {
            // window.open(url, '_blank');
            this.common.preview(item);
        }
    },
    mounted() {
        this.getForm();
    }
};
</script>
<style lang="scss" scope>
#SupplyTypeDetail {
    /**
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
    */
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
