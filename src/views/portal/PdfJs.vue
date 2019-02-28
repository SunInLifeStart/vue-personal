<template>
    <div>
        <canvas class="canvasstyle" id="the-canvas"></canvas>
        <el-pagination layout="prev, pager, next" v-if="page_count>1" :total="page_count" :page-size="1" @current-change="renderPage">
        </el-pagination>
    </div>
</template>

<script>
import PDFJS from "pdfjs-dist";
export default {
    data() {
        return {
            pdfDoc: null, //pdfjs 生成的对象
            pageNum: 1, //
            pageRendering: false,
            pageNumPending: null,
            scale: 1.4, //放大倍数
            page_num: 0, //当前页数
            page_count: 0, //总页数
            maxscale: 2, //最大放大倍数
            minscale: 0.8 //最小放大倍数
        };
    },
    props:['pdfUrl'],
    methods: {
        getPdf(url) {
            let vm = this;
            if(url){
             PDFJS.getDocument(url).then(function(pdfDoc_) {
                //初始化pdf
                vm.pdfDoc = pdfDoc_;
                vm.page_count = vm.pdfDoc.numPages;
                console.log(vm.pdfDoc.numPages);
                vm.renderPage(vm.pageNum);
            });
            }
           
        },
        renderPage(num) {
            //渲染pdf
            let vm = this;
            this.pageRendering = true;
            let canvas = document.getElementById("the-canvas");
            // Using promise to fetch the page
            this.pdfDoc.getPage(num).then(function(page) {
                var viewport = page.getViewport(vm.scale);
                //alert(vm.canvas.height)
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: canvas.getContext("2d"),
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);

                // Wait for rendering to finish
                renderTask.promise.then(function() {
                    vm.pageRendering = false;
                    if (vm.pageNumPending !== null) {
                        // New page rendering is pending
                        vm.renderPage(vm.pageNumPending);
                        vm.pageNumPending = null;
                    }
                });
            });
            vm.page_num = vm.pageNum;
        }
    },
    mounted(){
        this.getPdf(this.pdfUrl);
    },
    watch:{
        pdfUrl:function(){
            this.getPdf(this.pdfUrl);
        }
    }
};
</script>

<style scoped>
</style>