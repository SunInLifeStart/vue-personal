<template>
    <div id="ForeignOutForm">
    <!-- <div class="imageWrapper" ref="imageWrapper">
            <img class="real_pic" :src="dataURL" />
            <slot>
               
            </slot>
    </div> -->
        <el-form label-width="130px">
            <el-row>
                <el-form-item label="标题">
                    <el-input v-model="tableData.data.title"></el-input>
                </el-form-item>
                 <!-- <el-form-item label="简介" v-if="type == '新闻中心'">
                    <el-input v-model="tableData.data.about"></el-input>
                </el-form-item> -->
                 <el-form-item label="发布人">
                         <el-input v-model="tableData.data.publisher"></el-input>
                </el-form-item>
                <el-form-item label="来源">
                    <el-input v-model="tableData.data.source"></el-input>
                </el-form-item>
                <el-form-item label="发布时间">
                         <el-date-picker v-model="tableData.data.time" type="datetime" :clearable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="焦点图片"  v-if="type == '新闻中心' || type == '工会活动' || type == 'partyBuilding'">
                    <el-upload name="files" class="upload-demo uploadBtn" ref="uploadimage" action="/api/v1/files/upload" :on-success="handleSuccess_images"  :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in images" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                </el-form-item>
                <el-form-item label="文件" v-if="type != '新闻中心'  && type != '工会活动' && type != 'partyBuilding'">
                      <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess"  :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getIdAttach"></FilesOperate>
                        </div>
                </el-form-item>
              
                <el-form-item label="内容"  v-if="type == '新闻中心' || type == '工会活动' || type == 'partyBuilding'">
                                     <div v-loading="loading">
                            <VueEditor style="width: 80%"
                                useCustomImageHandler
                                @imageAdded="handleImageAdded"
                                :editorToolbar="customToolbar"
                                v-model="tableData.data.content"></VueEditor>
                            </div>
                </el-form-item>
       
            </el-row>
        </el-form>
    </div>
</template>
<script>
/* eslint-disable */
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import { VueEditor } from "vue2-editor";
import FilesOperate from "../FilesOperate";
import emptydata from "@/assets/emptydata.png";
// import Export2Excel from "@/plugins/Export2Excel.js"
export default {
    name: "ForeignOutForm",
    data() {
        return {
            tableData: {
                data: {
                    title: "",
                    tags: "",
                    about: "",
                    content: "",
                    time:"",
                    source:""
                }
            },
            hbData:[],
            attachments: [],
            images: [],
            created: [],
            begintime: "",
            endtime: "",
            dataURL: "",
            arr_data: [],
            loading: false,
            customToolbar: [
                ["bold", "italic", "underline", "strike"],
                [{ align: [] }], // toggled buttons
                ["image"],

                [{ size: [] }], // custom dropdow

                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                ["clean"]
            ]
        };
    },
    props: ["formId", "operationType", "type"],
    watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == "create") {
                this.cleanForm();
            } else {
                this.getForm();
            }
        }
    },
    filters: {
    },
    components: {
        VueEditor,
        FilesOperate
    },
    methods: {
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        handleSuccess_images(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.images.push(item);
                });
            }
            this.$refs.uploadimage.clearFiles();
        },
        getId(id) {
            let self = this;
            self.images.forEach(function(value, index) {
                if (value.id == id) {
                    self.images.splice(index, 1);
                }
            });
        },
        getIdAttach(id) {
            let self = this;
            self.attachments.forEach(function(value, index) {
                if (value.id == id) {
                    self.attachments.splice(index, 1);
                }
            });
        },
        
        changeDate() {
            this.begintime = moment(this.created[0]).format("YYYY-MM-DD");
            this.endtime = moment(this.created[1]).format("YYYY-MM-DD");
        },
        handleImageAdded: function(file, Editor, cursorLocation) {
            var formData = new FormData();
            formData.append("files", file);
            axios
                .post("/api/v1/files/upload", formData)
                .then(res => {
                    let url = res.data[0].url;
                    Editor.insertEmbed(cursorLocation, "image", url);
                })
                .catch(err => {
                });
        },
        editItem(row, column) {
            this.innerVisible = true;
            this.itemInfo = row;
        },
        deleteItem() {
            const self = this;
        },
        getForm() {
          
            const self = this;
            self.cleanForm();
            if (self.formId != "") {
                axios
                    .get("/api/v1/portal/details", {
                        params: {
                            id: self.formId
                        }
                    })
                    .then(res => {
                        if (
                            res.data.data.img[0] != "" &&
                            res.data.data.img.length > 0
                        ) {
                            self.images.push({
                                url: res.data.data.img[0],
                                iconUrl: res.data.data.img[0]
                            });
                        }
                        self.tableData = res.data;
                        self.attachments = self.tableData.data.url;
                    })
                    .catch(function() {
                        self.$message({
                            message: "操作失败",
                            type: "error"
                        });
                    });
            }
        },
        saveForm(action = "") {
            const self = this;
            self.tableData.data.img = [];
            self.tableData.data.url = [];
            self.tableData.data.time = moment(self.tableData.data.time).format("YYYY-MM-DD HH:mm:ss");
            for (let item of self.images) {
                self.tableData.data.img.push(item.url);
            }
            self.tableData.data.url =  self.attachments;
            if (this.operationType == "create") {
                if (this.type == "集团会表") {
                     self.createNewData();
            }else{
              self.createNewData();
            }
            } else {
               self.saveData();
            }
        },

        createNewData(){
              let self = this;
               const params = {
                    publisher: self.tableData.data.publisher,
                    title: self.tableData.data.title,
                    time: self.tableData.data.time,
                    content:self.tableData.data.content,
                    source: self.tableData.data.source,
                    // abstract: null,
                    tags: self.type,
                    url: self.tableData.data.url,
                    img: self.tableData.data.img,
                    about: self.tableData.data.about
                };
                axios
                    .post("/api/v1/portal/article", params)
                    .then(res => {
                        if (res.data.error == 0) {
                            self.$message({
                                message: "新建成功",
                                type: "success"
                            });
                            self.$emit("saveStatus");
                            self.cleanForm();
                        }
                    })
                    .catch(function(res) {
                        self.$message({
                            message: "操作失败",
                            type: "error"
                        });
                    });
        },
        saveData() {
            let self = this;
            axios
                .post("/api/v1/portal/article/upd", self.tableData.data)
                .then(res => {
                    self.$emit("saveStatus");
                })
                .catch(function() {
                    self.$message({
                        message: "保存失败",
                        type: "error"
                    });
                });
        },

        cleanForm() {
            this.tableData.data.about = "";
            this.tableData.data.title = "";
            this.tableData.data.content = "";
            this.tableData.data.time =  moment().format("YYYY-MM-DD HH:mm:ss");
            this.attachments = [];
            this.images =  [];
        }, 
    },
       mounted(){
           this.tableData.data.time =  moment().format("YYYY-MM-DD HH:mm:ss");
           this.tableData.data.source = this.$store.getters.LoginData.oname;
           this.tableData.data.publisher = this.$store.getters.LoginData.uname;
           if(this.operationType == "edit"){
               this.getForm();
           };
    },
};
</script>
<style lang="scss" scope>
.uploadBtn {
    margin-right: 10px;
    width: 100px;
    height: 130px;
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
.ql-editor {
    height: 300px;
}
.jtbd{
     display: none;
}
.hb_table {
     border: 1px solid #ccc;
    .secondTable td {
        border: none;
        padding: 0px;
        .thirdTabe td {
            padding: 0px;
        }
        .thirdTabe_afterNoon tr:nth-of-type(1) td {
            border-top: none !important;
        }
    }
}
.hb_table table {
    border: none;
}
.hb_table th,
.hb_table td {
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;
    text-align: center;
}
</style>