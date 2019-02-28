<template>
    <div id="Meeting" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="总办会会议纪要" name="first">
                    <GmoMeeting></GmoMeeting>
                </el-tab-pane>
                <el-tab-pane label="党委会会议纪要" name="second">
                    <PartyMeeting></PartyMeeting>
                </el-tab-pane>
                <el-tab-pane label="专题会会议纪要" name="tree">
                    <SpecMeeting></SpecMeeting>
                </el-tab-pane>
                <el-tab-pane label="董事会会议纪要" name="four">
                    <BoardMeeting></BoardMeeting>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import GmoMeeting from './GmoMeeting';
import PartyMeeting from './PartyMeeting';
import SpecMeeting from './SpecMeeting';
import BoardMeeting from './BoardMeeting';
export default {
    name: 'Meeting',
    mounted() {},
    data() {
        return {
            activeName: 'first'
        };
    },
    components: {
        GmoMeeting,
        PartyMeeting,
        SpecMeeting,
        BoardMeeting
    },
    methods: {
        handleClick(tab, event) {}
    }
};
</script>
<style lang="scss" scoped>
</style>