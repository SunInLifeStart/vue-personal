<template>
    <div id="leader">
        <TopBar/>
        <div class="container">  
            <iframe src="http://172.16.3.13:8080/webroot/decision/view/report?viewlet=largeScreen/project1.frm" style="width:100%;height:100%;" frameborder="0"></iframe>
        </div>      
    </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";

export default {
    data() {
        return {
            gitData: {}
        }
    },
    components: {
        TopBar
    },
    methods: {

    },
    mounted() {

    }

}
</script>

<style lang="scss" scoped>
#leader{
    display: flex;
    flex-direction: column;
    height:100%;
    .header{
        flex:0 0 auto;
    }
    .container{
        flex:1 1 auto;
        height:100%;
    }

}
</style>
