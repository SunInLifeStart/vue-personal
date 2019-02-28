<template>
    <div id="Supply" class="main-container">
        <div class="content-container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="办公用品" name="first" v-if="this.showbgypwh">
                    <SupplyType></SupplyType>
                </el-tab-pane>
                <el-tab-pane label="领用申请" name="second" v-if="this.showlysq">
                    <SupplyStatics></SupplyStatics>
                </el-tab-pane>
                <el-tab-pane label="办公采购" name="three" v-if="this.showbgypcg">
                    <SupplyPur></SupplyPur>
                </el-tab-pane>
                <el-tab-pane label="领用统计" name="four" v-if="this.showlytj">
                    <SupplyTotal></SupplyTotal>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import SupplyType from './SupplyType';
import SupplyStatics from './SupplyStatics';
import SupplyPur from './SupplyPur';
import SupplyTotal from './SupplyTotal';
export default {
    name: 'Supply',
    mounted() {
        for (let data of this.$store.getters.getMenusByType('supply')) {
            if (data.code == 'lysq') {
                this.showlysq = true;
            } else if (data.code == 'bgypwh') {
                this.showbgypwh = true;
            } else if (data.code == 'bgypcg') {
                this.showbgypcg = true;
            } else if (data.code == 'lytj') {
                this.showlytj = true;
            }
        }
        this.activeName = this.showbgypwh
            ? 'first'
            : this.showlysq ? 'second' : this.showbgypcg ? 'three' : 'four';
        console.log(this.activeName);
    },
    data() {
        return {
            activeName: 'first',
            showbgypwh: false,
            showlysq: false,
            showbgypcg: false,
            showlytj: false
        };
    },
    components: {
        SupplyType,
        SupplyStatics,
        SupplyPur,
        SupplyTotal
    },
    methods: {
        handleClick() {}
    }
};
</script>
<style lang="scss" scoped>
</style>