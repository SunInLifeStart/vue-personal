<template>
    <div id="YuSuanZhiXing" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <p style="font-size: 20px;">协同发展集团xx年预算执行情况单</p>
                <YuSuanDoFilter @searchList="getSearchOptions" style="margin-top: 10px;" v-if="this.yusuando == true"></YuSuanDoFilter>
                <YuSuanShengDoFilter @searchShengList="getShengSearchOptions" v-if="this.yusuanshengdo == true"></YuSuanShengDoFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="zhixingshengBtu" v-if="this.yusuando == true">执行生成</el-button>
                    <el-button type="primary" v-if="this.saveBtu == true" @click="saveForm()">保存</el-button>
                    <el-button type="primary" v-if="this.saveBtu == true" @click="saveForm('save')">提交生成</el-button>
                    <el-button type="primary" @click="createForm">导出</el-button>
                    <el-button type="primary" @click="createForm">打印</el-button>
                </div>
                <YuSuanDoList ref="yusuandolist" :searchOptions="searchOptions" style="margin-top: 15px;" v-if="this.yusuando == true"></YuSuanDoList>
                <YuSuanShengDoList ref="yusuanshengdolist" :searchOptions="searchOptions" style="margin-top: 15px;" v-if="this.yusuanshengdo == true"></YuSuanShengDoList>
            </el-card>
            <br>
            <el-card class="box-card">
                <!--
                <AnnoDetail :formId="formId" ref="annodetail"></AnnoDetail>
                -->
            </el-card>
        </div>
    </div>
</template>
<script>
import YuSuanDoFilter from './YuSuanDoFilter';
import YuSuanShengDoFilter from './YuSuanShengDoFilter';
import YuSuanDoList from './YuSuanDoList';
import YuSuanShengDoList from './YuSuanShengDoList';
import axios from 'axios';
import moment from 'moment';
import cookies from 'js-cookie';
export default {
    name: 'YuSuanZhiXing',
    mounted() {
        this.yusuando = true;
        this.yusuanshengdo = false;
        this.saveBtu = false;
        this.params = this.$route.query;
        if (this.params.type) {
            if (
                this.params.type == '临时查看' ||
                this.params.type == '生成执行汇总'
            ) {
                this.yusuando = false;
                this.yusuanshengdo = true;
                if (this.params.type == '生成执行汇总') {
                    this.saveBtu = true;
                }
            }
        }
    },
    data() {
        return {
            yusuando: true,
            saveBtu: false,
            params: {},
            yusuanshengdo: false,
            searchOptions: {
                startYear: moment(new Date()).format('YYYY-MM-DD'),
                endYear: moment(new Date()).format('YYYY-MM-DD'),
                groupName: cookies.get('oname'),
                year: moment(new Date()).format('YYYY')
            },
            currentFormId: ''
        };
    },
    components: {
        YuSuanDoFilter,
        YuSuanDoList,
        YuSuanShengDoFilter,
        YuSuanShengDoList
    },
    methods: {
        zhixingshengBtu() {
            this.$router.push({
                path: '/apps/yusuanzhixing',
                query: {
                    type: '生成执行汇总',
                    rows: ''
                }
            });
        },
        getSearchOptions(search) {
            this.searchOptions = search;
            console.log('dayin');
            console.log(this.searchOptions);
        },
        getShengSearchOptions(search) {
            this.searchOptions = search;
        },
        createForm() {
            this.$router.push({
                path: '/apps/yusuan'
                /** 
                query: {
                    type: type,
                    rows: row ? row : ''
                }
                */
            });
        },
        saveForm(action) {
            const self = this;
            const params = [];
            axios
                .post(
                    '/budget/BudgetGroupForm/imtSave',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.result;
                    if (action == 'save') {
                        self.submitForm();
                    } else {
                        self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });

            /** 
            this.$router.push({
                path: '/apps/yusuan'
                */
            /** 
                query: {
                    type: type,
                    rows: row ? row : ''
                }
                
            });
            */
        },
        submitForm() {
            const self = this;
            const params = {
                id: this.currentFormId
            };
            axios
                .post(
                    '/budget/BudgetDptForm/imtCommit',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.getAction();
                    // self.tableData = res.data.list
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getAction() {
            const self = this;
            axios
                .get(
                    '/workflow/motor-budget_fundBudgetCollect/' +
                        self.currentFormId +
                        '/' +
                        cookies.get('uid') +
                        '/actions',
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.startProcess(res.data);
                })
                .catch(function() {
                    self.$message({
                        message: 'actions操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess(res) {
            const self = this;
            // res.types[0].required[0] = "oid:"+cookies.get('oid')
            res.types[0].required = ['oid:' + cookies.get('oid')];
            axios
                .put(
                    '/workflow/motor-budget_fundBudgetCollect/' +
                        self.currentFormId +
                        '/' +
                        cookies.get('uid') +
                        '/signal',
                    JSON.stringify(res.types[0]),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    // self.$emit('refreshData');
                    self.comment();
                })
                .catch(function() {
                    self.$message({
                        message: 'signal操作失败',
                        type: 'error'
                    });
                });
        },
        comment() {
            let self = this;
            const params = {
                action: 'START',
                content: '创建',
                node: '创建',
                crtId: cookies.get('uid'),
                crtName: cookies.get('uname'),
                crtDeptId: cookies.get('oid'),
                crtDept: cookies.get('oname'),
                formId: self.currentFormId
            };
            axios
                .post(
                    '/budget/BudgetGroupForm/comment',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: '评论失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
