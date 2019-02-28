<template>
    <div id="PublicityActivitiesForm">
        <el-form ref="formupdate" :model="rows" :rules="rules" label-width="120px" style="margin-top:10px;">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="名称">
                        <el-input v-model="rows.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
                  <el-row>
               <el-col :span="24">
                    <el-form-item label="主题">
                        <el-input v-model="rows.theme"></el-input>
                    </el-form-item>
                </el-col>
                 </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="开始时间">
                        <el-date-picker v-model="rows.time"  value-format="yyyy-MM-dd HH:mm:ss"  type="datetime"   style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="结束时间">
                        <el-date-picker v-model="rows.endTime"  value-format="yyyy-MM-dd HH:mm:ss" type="datetime"   style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地点">
                        <el-input v-model="rows.place"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="主办方" prop="organizer">
                        <el-input v-model="rows.organizer"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="承办方" prop="contractors">
                        <el-input v-model="rows.contractors"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="活动规模">
                        <el-input v-model="rows.scale"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="上报单位">
                        <el-input v-model="rows.organName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="联合上报单位">
                        <!-- <el-select v-model="rows.combinedUnit" placeholder="请选择" style="width: 100%;">
                            <el-option v-for="item in combinedUnit" :key="item" :label="item" :value="item"></el-option>
                        </el-select> -->
                        <el-select style="width:100%;" v-model="rows.combinedUnit" filterable multiple readonly default-first-option placeholder="请选择">
                            <el-option v-for="item in combinedUnit" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="参会人员构成">
                        <el-col :span="24">
                            <el-form-item>
                                <el-input v-model="rows.superiorLeader" placeholder="上级领导" style="border:none"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item>
                                <!-- <el-select v-model="rows.groupLeader" placeholder="集团领导" style="width: 100%;">
                            <el-option v-for="item in groupLeader" :key="item" :label="item" :value="item"></el-option>
                        </el-select> -->
                                <el-select style="width:100%;" v-model="rows.groupLeader" filterable multiple readonly default-first-option placeholder="集团领导">
                                    <el-option v-for="item in groupLeader" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item>
                                <el-input v-model="rows.companyLeader" placeholder="公司领导"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="联系人">
                        <el-input v-model="rows.contactUser"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式">
                        <el-input v-model="rows.contact"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="是否有外媒">
                        <el-select v-model="rows.isMedia" placeholder="请选择" style="width: 100%;">
                            <el-option label="请选择" value=""></el-option>
                            <el-option label="是" value="是"></el-option>
                            <el-option label="否" value="否"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否有外宾">
                        <el-select v-model="rows.isGuedts" placeholder="请选择" style="width: 100%;">
                            <el-option label="请选择" value=""></el-option>
                            <el-option label="是" value="是"></el-option>
                            <el-option label="否" value="否"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="拟邀请媒体">
                        <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" v-model="rows.invitation"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="上传会议议程">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div class="attachments" v-for="item in rows.attachment" :key="item.id" @click="downloadFile(item)">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
                            <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
    name: "PublicityActivitiesForm",
    data() {
        return {
            rows: {
                organName: "",
                attachment: [],
                // time:moment(new Date()).format("YYYY-MM-DD"),
                // endTime:moment(new Date()).format("YYYY-MM-DD")
            },
            cookie_uname: "",
            cookie_oname: "",
            combinedUnit: [
                "党委办公室集团办公室",
                "董事会办公室",
                "党群工作部",
                "资本运营部",
                "风险管理部",
                "科技金融事业部/中科金",
                "组织部人力资源部",
                "宣传部品牌管理部",
                "纪检监察部",
                "战略管理部",
                "资金财务部",
                "科技园区事业部",
                "产业投资部",
                "海外业务部",
                "区域合作部",
                "北京中关村软件园发展有限责任公司",
                "北京中关村生命科学园发展有限责任公司",
                "北京中关村科技融资担保有限公司",
                "中关村科技租赁有限公司",
                "中关村医疗器械园有限公司",
                "北京中建中关村生物医药产业投资发展有限公司",
                "北京知识产权运营管理有限公司",
                "北京中关村延庆园建设发展有限公司",
                "北京中关村微纳能源投资有限公司",
                "北京中关村集成电路设计园发展有限责任公司",
                "中关村协同发展投资有限公司",
                "北京中关村协同创新投资基金管理有限公司",
                "北京中关村前沿技术产业发展有限公司",
                "中关村芯园（北京）有限公司",
                "中关村（国际）控股公司",
                "北京中科金投资管理有限公司",
                "北京中关村领创空间科技服务有限责任公司",
                "北京中关村科技创业金融服务集团有限公司",
                "北京集成电路产业发展股权投资基金有限公司",
                "北京实创高科技发展有限责任公司",
                "北京丰台科技园建设发展有限公司",
                "北京中关村电子城建设有限公司",
                "北京兴昌高科技发展有限公司",
                "北京金桥科技产业基地开发有限公司",
                "北京光谷科技园开发建设有限公司",
                "北京京石科园置业发展有限公司",
                "北京东方雍和文化创意投资有限公司",
                "北京海开房地产集团公司",
                "北京中关村国际孵化器有限公司",
                "北京中关村国际环保产业促进中心",
                "北京中关村海外科技园有限责任公司",
                "石家庄中关村协同发展有限公司",
                "天津京津中关村科技城发展有限公司",
                "北京领创精准医疗健康产业投资股份公司",
                "北京怀柔科学城建设发展有限公司",
                "北京中关村京西建设发展有限公司"
            ],
            groupLeader: [
                "赵长山",
                "宣鸿",
                "王明兰",
                "李妍",
                "姚胜利",
                "韩柏",
                "周武光",
                "杨彦茹",
                "邵顺昌",
                "贾一伟",
                "龙宜彬",
                "张哲",
                "段海波",
                "杨彦文",
                "许均华"
            ],
            rules:{
                organizer: [
                    { required: true, message: '请输入主办方名称', trigger: 'change' },
                ],
                contractors: [
                    { required: true, message: '请输入承办方名称', trigger: 'change' }
                ],
            },
            currentFormId: this.operationType == "create" ? "" : this.formId
        };
    },
    props: ["formId", "operationType"],
    mounted() {
        const self = this;
        if (this.operationType == "edit") {
            this.getForm();
        }
        const cookieItems = document.cookie.split(";");
        cookieItems.forEach(function(item) {
            if (item.indexOf("uname") > 0) {
                self.rows.creatorName = decodeURIComponent(item.split("=")[1]);
                self.cookie_uname = decodeURIComponent(item.split("=")[1]);
            }
            if (item.indexOf("oname") > 0) {
                self.rows.organName = decodeURIComponent(item.split("=")[1]);
                self.cookie_oname = decodeURIComponent(item.split("=")[1]);
            }
        });
    },
    watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == "create") {
                this.clearForm();
            }
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != "") {
                axios
                    .get("/api/v1/activity_forms/activities/" + this.formId)
                    .then(res => {
                        res.data.combinedUnit =
                            res.data.combinedUnit == ""
                                ? []
                                : res.data.combinedUnit.split(",");
                        res.data.groupLeader =
                            res.data.groupLeader == ""
                                ? []
                                : res.data.groupLeader.split(",");
                        self.rows = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: "操作失败",
                            type: "error"
                        });
                    });
            }
        },
        saveForm1(){
            this.$refs['formupdate'].validate((valid) => {
                if (valid) {
                    this.saveForm();
                    this.$emit("saveStatus", false);
                }
            });
        },
        saveForm() {
            const self = this;
            self.rows.combinedUnit = self.rows.combinedUnit.join(",");
            self.rows.groupLeader = self.rows.groupLeader.join(",");
            axios
                .post(
                    "/api/v1/activity_forms/activities/save",
                    JSON.stringify(this.rows),
                    {
                        headers: {
                            "Content-type": "application/json"
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;
                    if (this.operationType == "create") {
                        this.clearForm();
                    } else {
                        self.rows.combinedUnit = self.rows.combinedUnit.split(
                            ","
                        );
                        self.rows.groupLeader = self.rows.groupLeader.split(
                            ","
                        );
                    }
                    self.$emit("refreshData");
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.attachment.push(item);
                });
            }
        },
        downloadFile(item) {
            this.common.preview(item);
            // window.open(url, "_blank");
        },
        getFormData() {
            return this.rows;
        },
        clearForm() {
            this.rows = {
                title: "",
                time: "",
                endTime:"",
                place: "",
                theme: "",
                organizer: "",
                contractors: "",
                scale: "",
                combinedUnit: [],
                superiorLeader: "",
                groupLeader: [],
                companyLeader: "",
                contactUser: "",
                contact: "",
                isGuedts: "",
                isMedia: "",
                invitation: "",
                creatorName: this.cookie_uname,
                organName: this.cookie_oname,
                attachment: []
            };
        },
         deleteAttachment(id) {
            const self = this;
            if (this.rows.attachment.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get('/api/v1/activity_forms/deleteAtt/' + id, '', {
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            })
                            .then(res => {
                                self.rows.attachment.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.rows.attachment.splice(index, 1);
                                    }
                                });
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                );
            }
        },
    }
};
</script>
<style lang="scss">
#PublicityActivitiesForm {
    .uploadBtn {
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
        margin-left: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;
        position: relative;
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