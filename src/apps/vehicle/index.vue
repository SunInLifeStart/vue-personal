<template>
    <div id="Vehicle" class="main-container">
        <el-tabs v-model="activeName" @tab-click="handleClick" ref="tabs">
            <el-tab-pane label="用车申请" name="fourth" v-if="this.ycsq">
                <Apply></Apply>
            </el-tab-pane>
            <el-tab-pane label="车辆信息" name="first" v-if="this.clxx">
                <VehicleInfomanagement></VehicleInfomanagement>
            </el-tab-pane>
            <el-tab-pane label="司机信息" name="second" v-if="this.sjxx">
                <Driver></Driver>
            </el-tab-pane>
            <el-tab-pane label="司机和车辆使用情况统计" name="five" v-if="this.sihclsyqktj">
                <DriverVehicle></DriverVehicle>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>
<script>
/* eslint-disable */
import Driver from './Driver';
import VehicleInfomanagement from './VehicleInfomanagement';
import Apply from './Apply';
import DriverVehicle from './DriverVehicle';
export default {
    name: 'Vehicle',
    data() {
        return {
            dialogFormVisible: false,
            searchOptions: [],
            activeName: 'fourth',
            tabsManage: [],
            clxx: false,
            sjxx: false,
            ycsq: false,
            sihclsyqktj: false
        };
    },
    mounted() {
        this.tabsManage = this.$store.getters.getMenusByType('vehicle');
        for (let item of this.tabsManage) {
            if (item.code == 'clxx') {
                this.clxx = true;
            }
            if (item.code == 'sjxx') {
                this.sjxx = true;
            }
            if (item.code == 'ycsq') {
                this.ycsq = true;
            }
            if (item.code == 'sihclsyqktj') {
                this.sihclsyqktj = true;
            }
        }
    },

    components: {
        Driver,
        VehicleInfomanagement,
        Apply,
        DriverVehicle
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.vehiclelist.getList();
        },
        saveForm() {
            this.$refs.vehicleform.saveForm();
            this.dialogFormVisible = false;
        },
        submitForm() {
            this.$refs.vehicleform.submitCheck();
            this.dialogFormVisible = false;
        },
        handleClick() {}
    }
};
</script>
<style lang="scss" scoped>
</style>