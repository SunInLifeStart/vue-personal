<template>
    <div id="DriverVehicle">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="司机工作量统计" name="first">
                <Drivertask></Drivertask>
            </el-tab-pane>
            <el-tab-pane label="车辆情况统计" name="second">
                <VehicleCondition></VehicleCondition>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Drivertask from './Drivertask';
import VehicleCondition from './VehicleCondition';
export default {
    name: 'DriverVehicle',
    mounted() {},
    data() {
        return {
            activeName: 'first'
        };
    },
    components: {
        VehicleCondition,
        Drivertask
    },
    methods: {
        handleClick() {}
    }
};
</script>
<style lang="scss">
#DriverVehicle {
    .el-tabs__nav-wrap::after {
        background-color: #f3f3f3;
    }
}
</style>


