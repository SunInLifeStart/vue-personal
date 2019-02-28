<template>
    <div id="PortalAppDetail">
        <el-form ref="form" :model="tableData">
           <h2 style="text-align:center;">{{tableData.data.title}}</h2>
           <div style="text-align:center;color:#9A9A9A">发布时间：{{tableData.data.time}} &nbsp;&nbsp;&nbsp; 发布人：{{tableData.data.publisher}} &nbsp;&nbsp;&nbsp; 来源：{{tableData.data.source}}</div>
           <div style="color:#9A9A9A;padding:55px;padding-bottom:0px;" v-if="tableData.data.about">简介：{{tableData.data.about}}</div>
           <div class="content" style="padding:50px;" v-html="tableData.data.content"></div>
            <div class="content" style="padding:50px;">
                <!-- {{tableData.data.url}} -->
                 <div v-for="item in tableData.data.url" :key="item.id" style="float:left" v-if="tableData.data.url.length > 0">
                        <FilesOperate :item="item" :options="{preview:true,del:true,download:true}"></FilesOperate>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import Comment from '../Comment';
import FilesOperate from "../FilesOperate";
import emptydata from "@/assets/emptydata.png";
export default {
    name: 'PortalAppDetail',
    data() {
        return {
            tableData: {
                data:{
                    title:"",
                    time:"",
                    publisher:"",
                    source:"",
                    content:"",
                    url:[],
                }
            },
            actions: [],
            item:{},
        
        };
    },
    props: ['formId'],
    components: {
        Comment,
        FilesOperate
    },
    mounted() {
        if (this.formId != '') {
            this.getForm();
        }
    },
    watch: {
        formId: function() {
            this.getForm();
            if (this.formId != '') {
            }
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/portal/details',{
                        params:{
                            id:self.formId
                        }
                    })
                    .then(res => {
                       self.item = {url:res.data.data.url[0],name:'附件',iconUrl:emptydata};
                       self.tableData = res.data;
                       console.log(self.tableData);
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
<style lang="scss" scope>
.PortalAppDetail{
   
    p{
         font-size: 16px;
    }
}
.ql-editor{
    font-size: 14px;
}
.ql-align-center{
    text-align: center;
}
.ql-align-right{
    text-align: right;
}
.ql-align-left{
    text-align: left;
}
</style>