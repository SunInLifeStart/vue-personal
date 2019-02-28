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
                 <el-form-item label="简介" v-if="type == '新闻中心'">
                    <el-input v-model="tableData.data.about"></el-input>
                </el-form-item>
                 <!-- <el-form-item label="" v-if="type== '集团会表'" class="jtbd">
                     <el-date-picker v-model="created" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate"></el-date-picker>
                          &nbsp;     &nbsp;     &nbsp;
                     <el-button type="primary" size="small" @click="export_to_excel">导出会表</el-button>
                </el-form-item> -->
                  <el-form-item label="表单" v-if="type== '集团会表'" class="jtbd">
                      <div class="tableCanvas"  ref="tableCanvas">
                          <slot>
                              
                          <table style="width:100%" class="hb_table" cellpadding = 0 cellspacing = 0  ref="tableToExcel">
                               <tr style="backgorund:#ccc">
                                    <th colspan="6" style="border-top:none">
                                        &nbsp;{{tableData.data.title}}
                                    </th>
                                </tr> 
                              <tr style="backgorund:#ccc">
                                  <th width="110px">日期/星期</th>
                                  <th width="110px">时间</th>
                                  <th width="300px">内容</th>
                                  <th width="200px">地点</th>
                                  <th width="200px">参会人员</th>
                                  <th width="142px">召集部门</th>
                                </tr>
                               <tr style="backgorund:#ccc" v-for="item in arr_data" :key="item.date">
                                   <td>{{item.date | filterDate }} <br />{{item.date | filterWeek }}</td>
                                   <td colspan="6">
                                        <table class="secondTable"  cellpadding = 0 cellspacing = 0 >
                                             <tr>
                                                 <td width="55" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc" >上午</td>
                                                 <td>
                                                  <table class="thirdTabe"  cellpadding = 0 cellspacing = 0>
                                                      <tr v-for="item_2 in item.morning" :key="item_2.date" v-if="item.morning.length > 0">
                                                          <td width="54" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc"> {{item_2.beginTime | filterbeginTime}}</td>
                                                          <td  width="300" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">{{item_2.meetingName}}</td>
                                                          <td  width="200px" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">{{item_2.meetingRoom}}</td>
                                                          <td  width="200px" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">{{item_2.attendees}}</td>
                                                          <td width="142px" style="border-bottom:1px solid #ccc">{{item_2.hostDepartmentCode}}</td>
                                                     </tr>
                                                      <tr v-if="item.morning.length == 0">
                                                          <td width="54" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">（无）</td>
                                                          <td  width="300" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">（无）</td>
                                                          <td  width="200px" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">（无）</td>
                                                          <td  width="200px" style="border-right:1px solid #ccc;border-bottom:1px solid #ccc">（无）</td>
                                                          <td width="142px" style="border-bottom:1px solid #ccc">（无）</td>
                                                     </tr>
                                                  </table>
                                                </td>
                                            </tr>
                                             <tr>
                                                 <td width="55" style="border-right:1px solid #ccc">下午</td>
                                                 <td>
                                                  <table class="thirdTabe thirdTabe_afterNoon" cellpadding = 0 cellspacing = 0>
                                                      <tr v-for="item_2 in item.afternoon" :key="item_2.date" v-if="item.afternoon.length > 0" class="removeBorder">
                                                          <td width="54" style="border-right:1px solid #ccc;border-top:1px solid #ccc;">{{item_2.beginTime | filterbeginTime}}</td>
                                                          <td width="300" style="border-right:1px solid #ccc;border-top:1px solid #ccc;">{{item_2.meetingName}}</td>
                                                          <td width="200px" style="border-right:1px solid #ccc;border-top:1px solid #ccc;">{{item_2.meetingRoom}}</td>
                                                          <td width="200px" style="border-right:1px solid #ccc;border-top:1px solid #ccc;">{{item_2.attendees}}</td>
                                                          <td width="142px" style="border-top:1px solid #ccc;">{{item_2.hostDepartmentCode}}</td>
                                                    </tr>
                                                     <tr v-if="item.afternoon.length == 0"  class="removeBorder">
                                                          <td width="54" style="border-right:1px solid #ccc;">（无）</td>
                                                          <td  width="300" style="border-right:1px solid #ccc;">（无）</td>
                                                          <td  width="200px" style="border-right:1px solid #ccc;">（无）</td>
                                                          <td  width="200px" style="border-right:1px solid #ccc;">（无）</td>
                                                          <td width="142px" style="">（无）</td>
                                                     </tr>
                                                  </table>
                                                </td>
                                            </tr>
                                        </table>
                                   </td>   
                                </tr>
                                 <tr style="backgorund:#ccc">
                                    <th colspan="6" style="text-align:left;font-weight:normal">
                                       &nbsp; {{tableData.data.about}}
                                    </th>
                                </tr> 
                          </table>
                            </slot>
                      </div>
                </el-form-item>
                <!-- <el-form-item label="备注" v-if="type == '集团会表'">
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
            // img: { url: emptydata, iconUrl: emptydata },
            // file: { name: "", url: "", iconUrl: emptydata, kind: true },
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
        filterDate: function(value) {
            return moment(value).format("MM月DD日");
        },
        filterbeginTime: function(value) {
            return moment(value).format("HH:mm");
        },

        filterWeek: function(value) {
            var number = moment(value).format("E");
            if (number == 1) {
                number = "周一";
            } else if (number == 2) {
                number = "周二";
            } else if (number == 3) {
                number = "周三";
            } else if (number == 4) {
                number = "周四";
            } else if (number == 5) {
                number = "周五";
            } else if (number == 6) {
                number = "周六";
            } else {
                number = "周日";
            }
            return "(" + number + ")";
        }
    },
    components: {
        VueEditor,
        FilesOperate
    },
    // mounted() {
      

    //     const self = this;
    //     if (this.operationType == "edit") {
    //         this.getForm();
    //     } else {
    //         this.cleanForm();
    //     }
    // },
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
            this.resetWeekData();
        },
        resetWeekData() {
            axios
                .get(
                    "/meetingRegister/findMeeting?beginTime=" +
                        this.begintime +
                        "&&endTime=" +
                        this.endtime +
                        "&&stamp=123456&&token=2ae1bfc4b6210a3aba5c52bdbfd027ca9375fe78"
                )
                .then(res => {
                    var arr_data = [];
                    var data = this.hbData =  res.data;
                    for (var i = 0; i < data.length; i++) {
                        arr_data.push({
                            date: moment(data[i].beginTime).format(
                                "YYYY-MM-DD"
                            ),
                            morning: [],
                            afternoon: []
                        });
                    }
                    let hash = {};
                    arr_data = arr_data.reduce((preVal, curVal) => {
                        hash[curVal.date]
                            ? ""
                            : (hash[curVal.date] = true && preVal.push(curVal));
                        return preVal;
                    }, []);
                    for (var j = 0; j < data.length; j++) {
                        for (var p = 0; p < arr_data.length; p++) {
                            if (
                                moment(data[j].beginTime).format(
                                    "YYYY-MM-DD"
                                ) == arr_data[p].date
                            ) {
                                if (
                                    parseInt(
                                        moment(data[j].beginTime).format("H")
                                    ) <= 11
                                ) {
                                    arr_data[p].morning.push(data[j]);
                                } else {
                                    arr_data[p].afternoon.push(data[j]);
                                }
                            }
                        }
                    }
                    if (arr_data) {
                        this.arr_data = arr_data;
                        console.log(this.arr_data);
                    }
                })
                .catch(err => {
                });
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
        dataURItoBlob(base64Data) {
            var byteString;
            if (base64Data.split(",")[0].indexOf("base64") >= 0)
                byteString = atob(base64Data.split(",")[1]);
            else byteString = unescape(base64Data.split(",")[1]);
            var mimeString = base64Data
                .split(",")[0]
                .split(":")[1]
                .split(";")[0];
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], { type: mimeString });
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
                //  self.tableData.data.tags = "集团会表";
     
    
                // //  var html3 =  self.$refs.tableToExcel.innerHTML.replace(/style="[^\"]*"/g,'') 
                //  var html = "<html><head><meta charset='ANSI' /></head><body><table>" + html3 + "</table></body></html>";
                //  var blob = new Blob([html], { type: "application/vnd.ms-excel" });
                //  let formData = new FormData();
                //  formData.append("files", blob,"周工作安排.xls");
                //     // let config = {
                //     //     headers: { "Content-Type": "multipart/form-data" }
                //     // };
                //     axios
                //         .post("/api/v1/files/upload", formData) //上传图片
                //         .then(response => {
                //            self.attachments.push(response.data[0]);
                //     });
                 
                    // var a = document.getElementsByTagName("a")[0];

                //     this.common.download(URL.createObjectURL(blob) ,"123.xls");
                //  return false;


                //生成图片
                // html2canvas(this.$refs.tableCanvas, {
                //     backgroundColor: "#FFF"
                // }).then(canvas => {
                //     this.dataURL = canvas.toDataURL("image/png");
                //     let formData = new FormData();
                //     formData.append(
                //         "files",
                //         this.dataURItoBlob(this.dataURL),
                //         "周工作安排.jpg"
                //     );
                //     let config = {
                //         headers: { "Content-Type": "multipart/form-data" }
                //     };
                //     axios
                //         .post("/api/v1/files/upload", formData, config) //上传图片
                //         .then(response => {
                //            self.attachments.push(response.data[0]);
                //         });

                    //生成pdf
                    // var doc = new jsPDF("p", "px", "a4");
                    // doc.addImage(this.dataURL, "PNG", 15, 40, 420, 150);
                    // let pdf = doc.output("blob");
                    // let config = {
                    //     headers: { "Content-Type": "multipart/form-data" }
                    // };
                    // let formData = new FormData();
                    // formData.append("files", pdf, "周工作安排.pdf");

                    // axios
                    //     .post("/api/v1/files/upload", formData, config) //上传图片
                    //     .then(response => {
                    //         if (
                    //             !self.tableData.data.articleId &&
                    //             !self.tableData.data.id
                    //         ) {
                    //             self.tableData.data.tags = "集团会表";
                    //             self.tableData.data.url = [response.data[0].url];
                    //             self.saveData(self.tableData.data);
                    //         }
                    //     });
              // });
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
//         export_to_excel(){
//          require.ensure([], () => {
//             　　　　const { export_json_to_excel } = require('@/plugins/Export2Excel');
//             　　　　const tHeader = ['日期/星期', "上/午", "时间" ,'内容', '地点', '参会人员', '召集部门'];
//             　　　　const filterVal = ['beginTime','timeJuder','shortTime','meetingName', 'meetingRoom', 'attendees', 'hostDepartmentCode'];
//              　　 　const list = this.initTime(this.hbData);
//                     console.log(list);
//             　　　　const data = this.formatJson(filterVal, list);
//                    export_json_to_excel(tHeader, data, '集团会表');
// 　　        })
//         },
        // initTime(data){
        //         for(let item of data){
        //                 var number = moment(item.beginTime).format("E");
        //                 if (number == 1) {
        //                     number = "周一";
        //                 } else if (number == 2) {
        //                     number = "周二";
        //                 } else if (number == 3) {
        //                     number = "周三";
        //                 } else if (number == 4) {
        //                     number = "周四";
        //                 } else if (number == 5) {
        //                     number = "周五";
        //                 } else if (number == 6) {
        //                     number = "周六";
        //                 } else {
        //                     number = "周日";
        //                 }
        //                 item.shortTime =  moment(item.beginTime).format("HH:mm");
                        
        //                 if(moment(item.beginTime).format("HH") > 11){
        //                     item.timeJuder = "下午"
        //                 }else{
        //                      item.timeJuder = "上午"
        //                 }
        //                 item.beginTime =  moment(item.beginTime).format("YYYY-MM-DD") + '（'+ number +'）';
        //         };
        //         return data;
        // },
        // formatJson(filterVal, jsonData) {
        //         return jsonData.map(v => filterVal.map(j => v[j]))
        // }
     
    },
       mounted(){
        // if (this.type == "集团会表") {
        //     var weekOfday = moment().format("E"); //计算今天是这周第几天
        //     // var last_monday = moment().subtract(weekOfday-7-1, 'days').format('YYYY/MM/DD');//周一日期
        //     this.begintime = moment()
        //         .add(7 - weekOfday + 1, "days")
        //         .format("YYYY-MM-DD");
        //     this.endtime = moment()
        //         .add(7 - weekOfday + 5, "days")
        //         .format("YYYY-MM-DD");
        //     this.created = [this.begintime, this.endtime];
        //     this.resetWeekData();
        // }
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