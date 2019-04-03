<template>
    <el-popover placement="bottom-start" width="260" height="500" class="drawer">
        <!-- <div>
            <div>扫一扫下载Android版App</div>
            <img :src="qrcode" alt="" width="180px"/>
            <br />
            <br />
            <br />
            <a href="http://static.yxpe.com.cn/docs/文档以及插件.rar" alt="" width="180px" download="文档控件EXT跨浏览器插件.exe">点击下载Chrome插件以及文档</a>
        </div> -->
        <div class="icon" slot="reference">
           <i class="el-icon-star-off" style="cursor:pointer" />
        </div>
    </el-popover>
</template>

<script>
import { mapGetters } from "vuex";
import ClickOutside from "@/directives/clickoutside";
import axios from "axios";
export default {
    name: "notice",
    data() {
        return {
            items: [],
            showNotice: false,
            activeName: "first",
            items: [],
            qrcode:''
        };
    },
    directives: {
        ClickOutside
    },
    computed: {
        ...mapGetters(["getNewMessage"])
    },

    methods: {
     
    },
    mounted() {
        if (process.env.NODE_ENV == 'production') {
            this.qrcode = 'http://static.yxpe.com.cn/docs/app.png';
        }else{
          // this.qrcode = 'http://59.110.172.228/docs/test.png';
             this.qrcode = 'http://static.yxpe.com.cn/docs/app.png';
        }
    }
};
</script>

<style lang="scss" scoped>


</style>
