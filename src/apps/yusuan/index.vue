<template>
    <div id="yusuan" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="预算" name="first">
                    <YuSuan></YuSuan>
                </el-tab-pane>
                <el-tab-pane label="执行" name="second">
                    <YuSuanDo></YuSuanDo>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import YuSuan from './YuSuan';
import YuSuanDo from '../yusuanzhixing/index';
export default {
    name: 'yusuan',
    mounted() {},
    data() {
        return {
            activeName: 'first'
        };
    },
    components: {
        YuSuan,
        YuSuanDo
    },
    methods: {
        handleClick() {}
    }
};
</script>
<style lang="scss" scoped>
</style>