<template>
    <router-view >
    
    </router-view>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import TopBar from "./components/TopBar.vue";
export default {
    name: "app",
    data() {
        return {
        }
    },
    components: {
        TopBar
    },
    computed: {
        ...mapGetters([
            'getLoginData'
        ])
    },
    methods: {

    },
    mounted() {

    }
};
</script>

<style lang="scss">
html,
body {
    height: 100%;
    overflow: hidden;
}

#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.container {
    display: flex;
    flex: 1;
    width: 100%;
}

.el-dialog {
    max-width: 1280px;
}
</style>
