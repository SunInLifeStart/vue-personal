<template>
    <div id="editfiles">
        <!-- <el-dialog title="编辑文件" :visible.sync="dialogForm" max-width="1280px" width="90%" top="10px" :close-on-click-modal="false" append-to-body>
            <iframe id="mainIframe" name="mainIframe" src="edit.html" width="100%" height="850px" frameborder="0" scrolling="auto">
            </iframe>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveData">保存</el-button>
            </div>
        </el-dialog> -->
    </div>
</template>
<script>
/* eslint-disable */
import axios from "axios";
export default {
    name: "editfiles",
    data() {
        return {
            dialogForm: false,
            timer:null,
            openUrl:"",
        };
    },

    mounted() {},
    created: function() {
        // let self = this;
        // self.$nextTick(() => {
        //     window.addEventListener("message", self.getEditData, false);
        // });
    },

    methods: {
        // getEditData(e) {
        //     if (e.data) {
        //         if (e.data.type == "webpackWarnings" || e.data.source) {
        //         } else {
        //             console.log(e.data);
        //             this.$emit("editWordData", JSON.parse(e.data));
        //             this.dialogForm = false;
        //         }
        //     }
        // },
        saveData(type) {
            mainIframe.window.createFile();
        },
        openData(url) {
            let self = this;
            if(self.timer){
                 self.clearTime();
            }
            axios.get(`/api/v1/gid`).then(res => {

                if (res.data) {
                    axios
                        .get("/api/v1/ntko/session/create?token=" + res.data)
                        .then(res => {
                            console.log(res.data);
                        });
                }
                if (url) {
                    ntkoBrowser.openWindow(
                       this.openUrl + "token="+res.data+"&url=" + url
                    );
                } else {
                    console.log(this.openUrl);
                    ntkoBrowser.openWindow(
                           this.openUrl + "token=" + res.data
                    );
                }

                 self.timer = setInterval(function() {
                    axios
                        .get("/api/v1/ntko/session/finish?token=" + res.data)
                        .then(res => {
                            self.$emit("editWordData",res.data);
                        });
                }, 2000);
            });

        },
        openPrinter(url){
             ntkoBrowser.openWindow(
                    this.openUrl +"token=print&url="+url
            );
        },
        clearTime(){
            if(this.timer){
                 clearInterval(this.timer);
            }  
        },
    },
    mounted(){
        if(process.env.NODE_ENV === 'production'){
            this.openUrl = "http://static.zgcgroup.vpn/edit.html?"
        }else{
            this.openUrl = "http://static.yxpe.com.cn/edit.html?"
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
