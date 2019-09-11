<template>
    <div id="app">
        <TopBar />
        <div class="container">
            <Main :type="type" />
        </div>
    </div>
</template>
<script>
import Aside from "@/components/Aside.vue";
import Main from "@/components/Main.vue";
import TopBar from "@/components/TopBar.vue";
import axios from "@/plugins/axios";

export default {
    name: "home",
    props: ["type"],
    data() {
        return {
            dataList: [],
            stompClient: null
        };
    },
    components: {
        Aside,
        Main,
        TopBar
    },
    methods: {
        getUserInfo() {
            axios.get("/api/admin/user/userInfo").then(res => {
                console.log(res.data);
            });
        },
        subscribe() {
            this.$store.dispatch("subscribe").then(data => {
                if (data.status == 200) {
                    this.subscribe();
                };
            }).catch(error => {
                if (error.response.status == 504) {
                    this.subscribe();
                }
            });
        }
    },
    created() {
        // this.subscribe();
    },
    mounted: function() {
        
    },
    beforeDestroy: function() {}
};
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    overflow: hidden;
    flex: 1 1 auto;
}
</style>
