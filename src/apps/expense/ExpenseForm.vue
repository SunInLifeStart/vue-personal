<template>
    <div id="ExpenseForm">
        <div v-show="!this.showType">
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item title="国内差旅报销 " name="0">
                    <div>公司人员出差，出发地和目的地均在中国内陆（不含港澳台）的出差涉及的支出；&nbsp; &nbsp; &nbsp;公司支付给报销人</div>
                    <div style="color: red;">
                        <h3 style="margin-top:3px;margin-bottom: 3px;">注意</h3>
                        <ol style="margin-top:3px;">
                            <li>差旅费用在集团制度标准内据实报销，金额超过100元人民币的票据均需经办人和费用承担部门负责人共同背签（未超过100元人民币的票据由经办人一人背签），票据较多时请根据交通、餐费、住宿等分类整齐平铺粘贴好；</li>
                            <li>针对国内差旅，集团已统一为员工购买交通意外险，员工自行购买不予报销；</li>
                            <li>所有补助款随同报销款一并打入报销经办人账户，经办人有义务将补助转给对应的收款人（借调人员无差旅补助，集团司机有差旅补助）；</li>
                            <li>费用标准高随等超过集团制度规定标准的特殊情况，需由经办人提交情况说明，依次经由部门负责人、部门主管领导和财务主管领导批准后方可报销；</li>
                            <li>由于因公产生行程变动而导致的退票、改签费用（前提是未超出出差审批单批准金额），需由经办人提交情况说明，依次经由部门负责人、部门主管领导批准后方可报销;</li>
                        </ol>
                    </div>
                    <el-button type="primary" size="mini" @click="viewDetail">选择</el-button>
                </el-collapse-item>
                <el-collapse-item title="国际差旅报销" name="1">
                    <div>公司人员出差，出发地或目的地在国外或者中国境内港澳台地区的出差涉及的支出;&nbsp; &nbsp; &nbsp;公司支付给报销人</div>
                    <div style="color: red;">
                        <h3 style="margin-top:3px;margin-bottom: 3px;">注意</h3>
                        <ol style="margin-top:3px;">
                            <li>差旅费用在集团制度标准内据实报销，金额超过100元人民币的票据均需经办人和费用承担部门负责人共同背签（未超过100元人民币的票据由经办人一人背签），票据较多时请根据交通、餐费、住宿等分类整齐平铺粘贴好；</li>
                            <li>所有补助款随同报销款一并打入报销经办人账户，经办人有义务将补助转给对应的收款人（借调人员无差旅补助，集团司机有差旅补助）；</li>
                            <li>国际差旅附件要求：
                                <ul style="margin-left:-45px">
                                    （1）费用明细表及费用部门分摊表：一笔开支/一张票据为一行信息，根据交通、餐饮、住宿、其他等项目分类、按时间先后顺序排列，在票据上也标明表格中对应的序号。若费用涉及多个部门进行分摊，需编制费用部门分摊表，根据人员费用实际承担部门进行拆分。以上两表需打印纸质版经办人及费用承担部门负责人在表格空白处或背面签字确认，同时将excel电子版上传。
                                </ul>
                                <ul style="margin-left:-45px">
                                    （2）汇率：请查询中国银行网站，选择整趟差旅行程出发日或返回日当日的任一时间点的使用币种的汇率（现汇卖出价），打印网站页面，圈出选定汇率。
                                </ul>
                            </li>
                            <li>报销明细以折算后的人民币金额填写。</li>
                        </ol>
                    </div>
                    <el-button type="primary" size="mini" @click="viewDetail">选择</el-button>
                </el-collapse-item>
                <el-collapse-item title="日常支出(对私) " name="2">
                    <div>公司日常经营、办公等活动所产生的支出 ，公司支付给报销人</div>
                    <el-button type="primary" size="mini" @click="viewDetail">选择</el-button>
                </el-collapse-item>
                <el-collapse-item title="捐赠 " name="3">
                    <div>公司对某些社会机构、个人进行慈善而申请的支出，公司支付给报销人</div>
                    <el-button type="primary" size="mini" @click="viewDetail">选择</el-button>
                </el-collapse-item>
                <el-collapse-item title="招待费" name="4">
                    <div> 即业务招待费，指员工在承担业务和重要接待活动中必要的费用开支。</div>
                    <div>主要指餐费、购置礼品费等有关业务费用。公司支付给报销人。</div>
                    <el-button type="primary" size="mini" @click="viewDetail">选择</el-button>
                </el-collapse-item>
                <el-collapse-item title="董事会费 " name="5">
                    <div>董事会及其成员为行使职能而支付的费用。</div>
                    <div>如董事会开会期间董事的差旅费、食宿费及其他必要开支，董事会日常活动经费等</div>
                    <el-button type="primary" size="mini" @click="viewDetail">选择</el-button>
                </el-collapse-item>
                <el-collapse-item title="年度绩效及特别奖励 " name="6">
                    <div>公司结合年度各项绩效目标进行公司各层次奖励的支出，公司支付给报销人。</div>
                    <el-button type="primary" size="mini" @click="viewDetail">选择</el-button>
                </el-collapse-item>
            </el-collapse>
        </div>
        <el-form :model='rows' class="demo-form-inline" ref="formupdate" v-show="this.showType">
            <p style="text-align: center;">{{rows.type}}</p>
            <el-row style="margin-top: 25px;">
                <el-col :span="6">
                    <el-form-item label="流水单号：" label-width="100px">
                        <el-input style="width:160px;" v-model="rows.no" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="出差审批单：" :required="true" v-if="this.type == '0'" label-width="115px">
                        <el-select v-model="travelPeople" placeholder="选择出差审批单" @change="travelChange" v-if="this.type == '0'">
                            <el-option v-for="item in travelSelections" :key="item.id" :label="item.number" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right" v-if="this.type == '0'">
                            <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="travelDetail"></el-button>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="呈报件：" :required="true" label-width="25px;">
                        <el-select v-model="submission" placeholder="选择呈报件" @change="SubmissionChange">
                            <el-option v-for="item in submissionSelections" :key="item.id" :label="item.submissionNo" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-tooltip class="item" effect="dark" content="查看" placement="right">
                            <el-button type="text" style="margin-left: 10px;" icon="el-icon-view" @click="submissionDetail"></el-button>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="9" style="text-align:right;padding-right:10px;">
                    <el-form-item label="出差人员最高职务：" :required="true" v-if="this.type == '1'">
                        <el-select v-model="rows.topPower" placeholder="选择最高职权" @change="hignleaderChange" v-if="this.type == '1'">
                            <el-option v-for="item in hignLeaderSelections" :key="item.index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <table border="1px solid #f00" style="width: 99%; height: 100%; table-layout: fixed; word-break: break-all;margin-top:20px;">
                <col style="width: 10%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
                <col style="width: 10%" />
                <tr>
                    <td colspan="8" style="font-weight:bold;">
                        基本信息
                    </td>
                </tr>
                <tr>
                    <td>
                        提单人
                    </td>
                    <td>
                        <el-input v-model="rows.creatorName" disabled></el-input>
                    </td>
                    <td>
                        所属部门
                    </td>
                    <td colspan="2">
                        <el-input v-model="rows.organName" disabled></el-input>
                    </td>
                    <td>
                        提单时间
                    </td>
                    <td colspan="2">
                        <el-date-picker v-model="rows.created" type="datetime" placeholder="选择日期" style="width:100%">
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span style="color:red;">*</span>
                        收款人
                    </td>
                    <td>
                        <el-select v-model="rows.payee" placeholder="请选择" @change="payeeChange" filterable>
                            <el-option v-for="item in borrowPerson" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        开户行
                    </td>
                    <td colspan="2">
                        <el-input v-model="rows.bank" :disabled="this.showBank"></el-input>
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        银行卡号
                    </td>
                    <td colspan="2">
                        <el-input v-model="rows.cardNo" :disabled="this.showBank"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span style="color:red;">*</span>
                        结算方式
                    </td>
                    <td>
                        <el-select v-model="rows.clearing" placeholder="请选择">
                            <el-option v-for="item in clearing_method" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        费用承担部门
                    </td>
                    <td colspan="2">
                        <el-select v-model="rows.expenseDep" placeholder="请选择" @change="expenseDepChange">
                            <el-option v-for="item in combinedUnit" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        分摊
                    </td>
                    <td colspan="2">
                        <el-radio-group v-model="rows.share" @change="radioChange('share')">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="8">

                    </td>
                </tr>
                <tr>
                    <td colspan="8" style="font-weight:bold;">
                        报销明细
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span style="color:red;">*</span>
                        费用类别
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        费用描述
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        币种
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        金额
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        预估汇率
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        预估本币金额
                    </td>
                    <td>
                        费用归属项目
                    </td>
                </tr>
                <tr v-for="(item,index) in tableData" :key="item.index" @contextmenu.prevent="youjian(index,'baoxiao')">
                    <td colspan="2">
                        <el-cascader :options="options_spec" filterable @change="selectChangeType(item,index)" v-model="item.min" :props="prop" @focus="getSelectOptions"></el-cascader>
                    </td>
                    <td>
                        <el-input v-model="item.depict" placeholder="请描述费用用途"></el-input>
                    </td>
                    <td>
                        <el-select v-model="item.currency" placeholder="人民币" @focus="currencyChange" @change="handleChange(item, index,'currency')">
                            <el-option v-for="item in currency_method" :key="item.value" :label="item.label" :value="{value:item.value, label: item.label}" :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="item.money" @input="loseFocus(item,index,'money')"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.estRate" @input="loseFocus(item,index,'money')"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.estSum"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.costItem"></el-input>
                    </td>
                </tr>
                <tr>
                    <td colspan="8">
                        <p @click="insert('baoDetail')">插入</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="1">
                        金额合计
                    </td>
                    <td colspan="2">
                        <span style="float:left;"> {{this.tableData.length ==0 ? '￥': this.tableData[0].currency.value}}</span>
                        <span style="float:right;">{{parseFloat(this.rows.total).toLocaleString()}}</span>
                    </td>
                    <td>
                        金额大写
                    </td>
                    <td colspan="4">
                        <span> ({{this.tableData.length ==0 ? '人民币': this.tableData[0].currency.label}}:&nbsp;&nbsp;{{this.rows.upper}})</span>
                    </td>
                </tr>
                <tr v-show="false">
                    <td colspan="8" style="font-weight:bold;">预算、资金计划信息</td>
                </tr>
                <tr v-show="false">
                    <td>
                        预算金额
                    </td>
                    <td>
                        <el-input v-model="rows.budget.estSum"></el-input>
                    </td>
                    <td>
                        剩余预算金额
                    </td>
                    <td>
                        <el-input v-model="rows.budget.surplusSum"></el-input>
                    </td>
                    <td>
                        资金计划
                    </td>
                    <td>
                        <el-input v-model="rows.budget.fundPlan"></el-input>
                    </td>
                    <td>
                        剩余资金计划
                    </td>
                    <td>
                        <el-input v-model="rows.budget.surplusPlan"></el-input>
                    </td>
                </tr>
                <tr>
                    <td colspan="8" style="font-weight:bold;">借款信息</td>
                </tr>
                <tr>
                    <td>
                        <span style="color:red;">*</span>
                        是否有借款
                    </td>
                    <td colspan="2">
                        关联借款单号
                    </td>
                    <td>
                        借款未核销金额
                    </td>
                    <td colspan="2">
                        借款已核销金额
                    </td>
                    <td colspan="2">
                        借款剩余金额是否退还
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-radio-group v-model="rows.borrow.bor" @change="radioChange('bor')">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </td>
                    <td colspan="2">
                        <el-select v-model="rows.borrow.borrowOdd" placeholder="请选择" @change="borrowOddChange" :disabled="this.rows.borrow.bor== null || this.rows.borrow.bor == false">
                            <el-option v-for="item in borrowOddSelections" :key="item.id" :label="item.number" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-tooltip class="item" effect="dark" content="查看" placement="left">
                            <el-button type="text" style="margin-left: 20px;" icon="el-icon-view" @click="borrowOddDetail"></el-button>
                        </el-tooltip>
                    </td>
                    <td>
                    {{parseFloat(this.rows.borrow.noVerify).toLocaleString()}}
                    </td>
                    <td colspan="2">
                     {{parseFloat(this.rows.borrow.verify).toLocaleString()}}
                    </td>
                    <td colspan="2">
                        <el-radio-group v-model="rows.borrow.sendDack" @change="radioChange('sendDack')" :disabled="this.rows.borrow.bor== null || this.rows.borrow.bor == false ">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>应付金额({{this.tableData.length ==0 ? '￥': this.tableData[0].currency.value}})</td>
                    <td colspan="3">
                   {{parseFloat(this.rows.borrow.payAble).toLocaleString()}}
                    </td>
                    <td>应退金额({{this.tableData.length ==0 ? '￥': this.tableData[0].currency.value}})</td>
                    <td colspan="3">
                     {{parseFloat(this.rows.borrow.shouldBack).toLocaleString()}}
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        金额大写
                    </td>
                    <td colspan="6">
                        ({{this.tableData.length ==0 ? '人民币': this.tableData[0].currency.label}}:&nbsp;&nbsp;{{this.rows.borrow.upperSum}})
                    </td>
                </tr>
                <tr v-show="rows.share == true">
                    <td colspan="8" style="font-weight:bold;">
                        分摊明细
                    </td>
                </tr>
                <tr v-show="rows.share == true">
                    <td colspan="2">
                        承担单位
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        承担部门
                    </td>
                    <td>
                        <span style="color:red;">*</span>
                        承担金额({{this.tableData.length ==0 ? '￥': this.tableData[0].currency.value}})
                    </td>
                    <td colspan="3">
                        金额大写【{{this.tableData.length ==0 ? '人民币': this.tableData[0].currency.label}}】
                    </td>
                    <td>
                        分摊比例(%)
                    </td>
                </tr>
                <tr v-for="(item,index) in rows.shares" :key="item.index" @contextmenu.prevent="youjian(index,'fentan')" v-show="rows.share == true">
                    <td colspan="2">
                        <el-input v-model="item.bearUnit"></el-input>
                    </td>
                    <td>
                        <el-select v-model="item.bearDep" placeholder="请选择">
                            <el-option v-for="item in combinedUnit" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="item.bearSum" @input="loseFocus(item,index,'bearSum')"></el-input>
                    </td>
                    <td colspan="3">
                        <el-input v-model="item.upper"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.shareRatio"></el-input>
                    </td>
                </tr>
                <tr v-show="rows.share == true">
                    <td colspan="8">
                        <p @click="insert('fentan')">插入</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="8" style="font-weight:bold;">附件</td>
                </tr>
                <tr>
                    <td>
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <el-button size="small" type="primary" style="align: center ;">点击上传</el-button>
                        </el-upload>
                    </td>
                    <td colspan="7">
                        <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item)">
                            <p :title="item.name">{{item.name}}</p>
                            <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                        </div>
                    </td>
                </tr>
            </table>
        </el-form>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'ExpenseForm',
    data() {
        return {
            tableData: [
                {
                    min: [],
                    depict: '',
                    bigTypeName: '',
                    smallTypeName: '',
                    currency: {
                        value: '￥',
                        label: '人民币'
                    },
                    money: '',
                    id: '',
                    estRate: 1,
                    estSum: this.common.toDecimal2(0),
                    costItem: ''
                }
            ],
            rows: {
                no: '',
                id: '',
                submissionId: '',
                submissionName: '',
                travellerId: '',
                budgetSure: false,
                topPower: '',
                payee: '',
                organ: '',
                type: '',
                expenseId: this.cookie_oid,
                creatorName: this.cookie_uname,
                organName: this.cookie_oname,
                created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                payee: '',
                payeeId: '',
                bank: '',
                cardNo: '',
                clearing: '',
                upper: '',
                expenseDep: this.$store.getters.LoginData.oname,
                repayItems: [],
                share: false,
                total: this.common.toDecimal2(0),
                budget: {
                    estSum: this.common.toDecimal2(0),
                    surplusSum: this.common.toDecimal2(0),
                    fundPlan: this.common.toDecimal2(0),
                    surplusPlan: this.common.toDecimal2(0)
                },
                attachments: [],
                borrow: {
                    bor: false,
                    borrowOdd: '',
                    noVerify: 0,
                    total: 0,
                    borrowId: '',
                    verify: 0,
                    sendDack: true,
                    payAble: this.common.toDecimal2(0),
                    shouldBack: this.common.toDecimal2(0),
                    upperSum: ''
                },
                shares: [
                    {
                        bearUnit: '中关村协同发展',
                        bearDep: '',
                        payProject: '',
                        bearSum: this.common.toDecimal2(0),
                        upper: '',
                        shareRatio: ''
                    }
                ]
            },
            cookie_uname: '',
            cookie_oname: '',
            cookie_oid: this.$store.getters.LoginData.oid,
            cookie_uid: this.$store.getters.LoginData.uid,
            clearing_method: [
                '网银',
                '电汇',
                '现金支票',
                '转账支票',
                '信汇',
                '现金',
                '存单'
            ],
            currency_method: [
                {
                    value: 'C$',
                    label: '加元',
                    disabled: false
                },
                {
                    value: 'SFr',
                    label: '瑞士法郎',
                    disabled: false
                },
                {
                    value: '￥',
                    label: '人民币',
                    disabled: false
                },
                {
                    value: '€',
                    label: '欧元',
                    disabled: false
                },
                {
                    value: '￡',
                    label: '英镑',
                    disabled: false
                },
                {
                    value: 'HK$',
                    label: '港币',
                    disabled: false
                },
                {
                    value: 'JPY￥',
                    label: '日元',
                    disabled: false
                },
                {
                    value: '$',
                    label: '美元',
                    disabled: false
                },
                {
                    value: 'MOP$',
                    label: '澳门币',
                    disabled: false
                },
                {
                    value: 'NT$',
                    label: '新台币',
                    disabled: false
                }
            ],
            estRate_method: [1, 2, 3, 4],
            borrowOddSelections: [],
            showBank: false,
            prop: {
                value: 'code',
                label: 'name',
                id: 'id',
                children: 'children'
            },
            combinedUnit: [],
            borrowPerson: [],
            travelPeople: '',
            hignlearder: '',
            hignLeaderSelections: [
                '员工',
                '部长/副部长',
                '总经理助理/董事会秘书',
                '副总经理',
                '总经理',
                '董事长',
                '总经理和董事长'
            ],
            submission: '',
            travelSelections: [],
            submissionSelections: [],
            changeTotal: 0,
            formLabelWidth: '120px',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            options_spec: [],
            selectOptions: [],
            typeSelectForeign: [
                'domTravels',
                'interTravels',
                'dailyExpenses',
                'donates',
                'enterExpenses',
                'boardFees',
                'awards'
            ],
            typeSelectChinese: [
                '国内差旅报销',
                '国际差旅报销',
                '日常支出(对私)',
                '捐赠',
                '招待费',
                '董事会费',
                '年度绩效及特别奖励'
            ],
            activeName: '',
            travelList: [],
            showType: false,
            type: '',
            currentPayeeId: 8374564
        };
    },
    props: ['formId', 'operationType'],
    watch: {
        formId: function() {
            this.showType = true;
            this.getForm();
        },
        changeTotal: function() {
            this.radioChange('bor');
            if (this.rows.share && this.rows.shares.length > 0) {
                this.shareRadio();
            }
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
            } else {
                this.showType = true;
                this.getForm();
            }
        }
    },
    mounted() {
        if (this.operationType == 'edit') {
            this.showType = true;
            this.getForm();
        }
        const self = this;
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > -1) {
                self.rows.creatorName = decodeURIComponent(item.split('=')[1]);
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > -1) {
                self.rows.organName = decodeURIComponent(item.split('=')[1]);
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oid') > -1) {
                self.cookie_oid = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('uid') > -1) {
                self.cookie_uid = decodeURIComponent(item.split('=')[1]);
            }
        });
    },
    methods: {
        //选择币种的限制（国内的只允许选择人民币，其他类型都可选）
        currencyChange() {
            if (this.type == '0') {
                for (let data of this.currency_method) {
                    if (data.label != '人民币') {
                        data.disabled = true;
                    }
                }
            } else {
                for (let data of this.currency_method) {
                    data.disabled = false;
                }
            }
        },
        //出差审批单改变的时候获取对应信息，把出差人员数组传给singal接口
        travelChange(val) {
            if (val && val != '') {
                this.rows.travellerId = val;
                const self = this;
                axios
                    .get('/api/v1/travel_forms/' + val)
                    .then(res => {
                        self.travelList = res.data.evections;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        //根据uid获取部门呈报件
        getSubmissionlList() {
            const self = this;
            self.submissionSelections = [];
            if (self.cookie_uid != '') {
                axios
                    .post(
                        '/api/v1/submission_forms/queryDone/' + this.cookie_uid
                    )
                    .then(res => {
                        self.submissionSelections = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        //部门呈报件改变
        SubmissionChange() {},
        //查看选择的部门呈报件（点击小眼睛）
        submissionDetail() {
            if (this.submission && this.submission != null) {
                this.common.open('#/apps/submission/' + this.submission);
            }
        },
        //最高职权发生变化
        hignleaderChange() {},
        //费用承担部门发生改变（要把部门id传值给singal接口）
        expenseDepChange(val) {
            this.cookie_oid = val;
            for (let data of this.combinedUnit) {
                if (data.id == val) {
                    this.rows.expenseDep = data.name;
                }
            }
            this.rows.expenseId = val;
        },
        //根据码表获取各个类型的费用类别（大类小类）
        getTypeOpertions() {
            const self = this;
            if (this.type == '0') {
                axios.get('/api/v1/reim/code/021001020').then(res => {
                    self.selectOptions = [];
                    self.selectOptions = res.data;
                    for (let data of this.selectOptions) {
                        data.disabled = false;
                    }
                });
            } else if (this.type == '1') {
                axios.get('/api/v1/reim/code/021001019').then(res => {
                    self.selectOptions = [];
                    self.selectOptions = res.data;
                    for (let data of this.selectOptions) {
                        data.disabled = false;
                    }
                });
            } else if (this.type == '2') {
                self.selectOptions = [];
                axios.get('/api/v1/reim/code/021').then(res => {
                    for (let data of res.data[0].children) {
                        if (data.name == '管理费用') {
                            let ayyay = [];
                            for (let data1 of data.children) {
                                if (
                                    data1.name != '差旅费(国际)' &&
                                    data1.name != '差旅费(国内)'
                                ) {
                                    ayyay.push(data1);
                                }
                            }
                            self.selectOptions.push({
                                id: data.id,
                                name: data.name,
                                code: data.code,
                                children: ayyay
                            });
                        } else {
                            self.selectOptions.push(data);
                        }
                    }
                    axios.get('/api/v1/reim/code/026004').then(res => {
                        self.selectOptions.push(res.data[0]);
                        for (let data of this.selectOptions) {
                            data.disabled = false;
                        }
                    });
                });
            } else if (this.type == '3') {
                self.selectOptions = [];
                axios.get('/api/v1/reim/queryCode').then(res => {
                    for (let data of res.data) {
                        if (data.children != null) {
                            for (let data1 of data.children) {
                                self.selectOptions.push(data1);
                            }
                        } else {
                            self.selectOptions.push(data);
                        }
                    }
                    for (let data of this.selectOptions) {
                        data.disabled = false;
                    }
                });
            } else if (this.type == '4') {
                axios.get('/api/v1/reim/code/021001018').then(res => {
                    self.selectOptions = [];
                    self.selectOptions = res.data;
                    for (let data of this.selectOptions) {
                        data.disabled = false;
                    }
                });
            } else if (this.type == '5') {
                axios.get('/api/v1/reim/code/021001023').then(res => {
                    self.selectOptions = [];
                    self.selectOptions = res.data;
                    for (let data of this.selectOptions) {
                        data.disabled = false;
                    }
                });
            } else if (this.type == '6') {
                axios.get('/api/v1/reim/code/021001001').then(res => {
                    self.selectOptions = [];
                    self.selectOptions.push(res.data[0]);
                    axios.get('/api/v1/reim/code/021001002').then(res => {
                        self.selectOptions.push(res.data[0]);
                        for (let data of this.selectOptions) {
                            data.disabled = false;
                        }
                    });
                });
            }
        },
        //获取收款人列表（需求让新加‘多人’,允许多人选）
        getUsers() {
            axios.get('/api/v1/users').then(res => {
                this.borrowPerson = [];
                for (let data of res.data) {
                    this.borrowPerson.push({
                        id: data.id,
                        name: data.name
                    });
                }
                this.borrowPerson.push({
                    id: '多人',
                    name: '多人'
                });
            });
        },
        //获取各个部门数据
        getOgans() {
            axios.get('/api/v1/users/get/allOrgans').then(res => {
                this.combinedUnit = res.data;
            });
        },
        //新建选择7种类型点击选择的点击事件，根据选择的类型获得该调用的接口数据
        viewDetail() {
            this.type = this.activeName;
            if (this.activeName && this.activeName != '') {
                this.rows.type = this.typeSelectChinese[parseInt(this.type)];
                this.getNo();
                this.getUsers();
                this.getOgans();
                this.getTypeOpertions();
                this.showType = true;
                this.$emit('bottomShow', this.showType);
                this.submission = '';
                this.getSubmissionlList();
                if (this.type == '0') {
                    this.travelPeople = '';
                    this.getTravelList();
                }
            }
        },
        //获取出差审批单的列表（只有国内报销有）
        getTravelList() {
            const self = this;
            if (self.cookie_uid != '') {
                axios
                    .get('/api/v1/travel_forms/findDone/' + this.cookie_uid)
                    .then(res => {
                        self.travelSelections = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        //查看选择的出差审批单详情（点击出差审批单后的小眼睛可见）
        travelDetail() {
            if (this.travelPeople && this.travelPeople != null) {
                this.common.open('#/apps/travel/' + this.travelPeople);
            }
        },
        //获取表单的流水编号
        getNo() {
            const self = this;
            axios
                .get('/api/v1/expense_forms/getNo')
                .then(res => {
                    self.rows.no = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        //选取的收款人发生变化时，调用该人所有关联的借款单子（getBorrowOdd）
        payeeChange(val) {
            //调获取id的接口；
            //获取单号的列表；
            //this.rows.payee = this.rows.payee.name;
            if (val != '多人') {
                this.showBank = false;
                for (let data of this.borrowPerson) {
                    if (data.id == val) {
                        this.rows.payee = data.name;
                    }
                }
                this.rows.payeeId = val;
                this.getBorrowOdd(val);
            } else {
                this.rows.payee = '多人';
                if (this.type != '0' && this.type != '1') {
                    this.showBank = true;
                    this.rows.bank = '无';
                    this.rows.cardNo = '无';
                } else {
                    this.showBank = false;
                }
            }
        },
        //关联借款单号发生变化，调用getBorrow接口获取该条单据的核销金额和未核销金额等数据
        borrowOddChange(val) {
            this.getBorrow(val);
        },
        //查看关联借款单号的详情（点击关联借款单号后面的小眼睛可见）
        borrowOddDetail() {
            if (this.rows.borrow.borrowId && this.rows.borrow.borrowId != '') {
                this.common.open('#/apps/loan/' + this.rows.borrow.borrowId);
            }
        },
        //币种改变后的方法，如果是人民币，则默认为1，然后再计算一遍列表里需要变动的项
        handleChange(item, index, type) {
            for (let data of this.tableData) {
                data.currency = item.currency;
                data.estRate = item.estRate;
            }
            if (type == 'currency') {
                if (item.currency == '人民币') {
                    item.estRate = 1;
                    this.loseFocus(item, index, 'money');
                } else {
                    item.estRate = this.common.toDecimal5(0);
                    item.estSum = this.common.toDecimal2(0);
                    this.loseFocus(item, index, 'money');
                }
            }
        },
        //报销列表预估本币金额和预估汇率的计算，然后再就是金额合计
        loseFocus(item, index, type) {
            if (type == 'money') {
                for (let data of this.tableData) {
                    data.estRate = item.estRate;
                    if (data.money != '' && data.estRate != '') {
                        data.estSum = this.common.toDecimal2(
                            parseFloat(data.estRate) * parseFloat(data.money)
                        );
                    } else {
                        data.estSum = this.common.toDecimal2(0);
                    }
                }
                this.totalSalary();
            }

            if (
                type == 'bearSum' &&
                item.bearSum != null &&
                item.bearSum != '' &&
                parseInt(this.rows.total) > 0
            ) {
                this.shareRadio();
            } else {
                item.shareRatio = this.common.toDecimal2(0);
                item.upper = this.common.DX(this.common.toDecimal2(0));
            }
        },
        //分摊情况下，根据输入的分摊金额计算分摊比例
        shareRadio() {
            if (parseInt(this.rows.total) > 0) {
                for (let data of this.rows.shares) {
                    data.upper = this.common.DX(
                        this.common.toDecimal2(data.bearSum)
                    ); //字符串
                    data.shareRatio = this.common.toDecimal2(
                        parseFloat(data.bearSum) /
                            parseFloat(this.rows.total) *
                            100
                    );
                }
            } else {
                for (let data of this.rows.shares) {
                    data.upper = this.common.DX(
                        this.common.toDecimal2(data.bearSum)
                    ); //字符串
                    data.shareRatio = this.common.toDecimal2(0);
                }
            }
        },
        //计算报销金额合计的方法
        totalSalary() {
            let sum = 0;
            for (let data of this.tableData) {
                if (data.money != '') {
                    sum += parseFloat(data.money);
                }
            }
            this.rows.total = this.common.toDecimal2(sum);
            this.rows.upper = this.common.DX(this.rows.total);
            this.changeTotal = this.common.toDecimal2(sum);
        },
        //分摊按钮和是否借款按钮改变触发的方法
        radioChange(type) {
            if (type == 'bor') {
                if (!this.rows.borrow.bor) {
                    this.rows.borrow.payAble = this.rows.total;
                    this.rows.borrow.borrowOdd = '';
                    this.rows.borrow.borrowId = '';
                    this.rows.borrow.noVerify = 0;
                    this.rows.borrow.verify = 0;
                    this.rows.borrow.sendDack = false;
                    this.rows.borrow.shouldBack = this.common.toDecimal2(0);
                    this.rows.borrow.upperSum = this.common.DX(
                        this.rows.borrow.payAble
                    );
                } else {
                    this.borrowComputed();
                }
            } else if (type == 'sendDack') {
                this.radioChange('bor');
            }
        },
        //有借款单子的情况下计算应付金额和应退金额的值
        borrowComputed() {
            let compare =
                parseFloat(this.rows.total) -
                parseFloat(this.rows.borrow.noVerify);
            if (compare == 0) {
                this.rows.borrow.payAble = this.common.toDecimal2(0);
                this.rows.borrow.shouldBack = this.common.toDecimal2(0);
                this.rows.borrow.upperSum = this.common.DX(
                    this.rows.borrow.payAble
                );
            } else if (compare > 0) {
                this.rows.borrow.payAble = this.common.toDecimal2(compare);
                this.rows.borrow.shouldBack = this.common.toDecimal2(0);
                this.rows.borrow.upperSum = this.common.DX(
                    this.rows.borrow.payAble
                );
            } else if (compare < 0) {
                //if (this.rows.borrow.sendDack) {
                let compareSendBack =
                    parseFloat(this.rows.borrow.noVerify) -
                    parseFloat(this.rows.total);
                this.rows.borrow.payAble = this.common.toDecimal2(0);
                this.rows.borrow.shouldBack = this.common.toDecimal2(
                    compareSendBack
                );
                this.rows.borrow.upperSum = this.common.DX(
                    this.rows.borrow.shouldBack
                );
                //}
                /** 
                else {
                    this.rows.borrow.payAble = this.common.toDecimal2(0);
                    debugger
                    this.rows.borrow.shouldBack = this.common.toDecimal2(
                        compareSendBack
                    );
                    this.rows.borrow.upperSum = this.common.DX(
                        this.rows.borrow.shouldBack
                    );
                }
                */
            }
        },
        //调取关联借款单号的接口
        getBorrowOdd(val) {
            if (val && val != '') {
                const self = this;
                axios
                    .get('/api/v1/expense_forms/queryNumbers/' + val)
                    .then(res => {
                        this.borrowOddSelections = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        //关联的借款单号改变，根据关联单号获取核销金额和未核销金额
        getBorrow(val) {
            const self = this;
            axios
                .get('/api/v1/expense_forms/findBorrow/' + val)
                .then(res => {
                    self.rows.borrow.borrowId = val;
                    self.rows.borrow.verify = res.data.verify;
                    self.rows.borrow.noVerify = res.data.noVerify;
                    self.rows.borrow.total = res.data.total;
                    self.radioChange('bor');
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        //限制一张单子只能选择一种大类的方法
        getSelectOptions() {
            if (
                this.tableData.length > 1 &&
                this.tableData[0].min[0] &&
                this.type != '6'
            ) {
                this.options_spec = this.selectOptions;
                const param = this.tableData[0].min[0];
                for (let data of this.options_spec) {
                    if (data.code != param) {
                        data.disabled = true;
                    }
                }
            } else {
                this.options_spec = [];
                this.getTypeOpertions();
                this.options_spec = this.selectOptions;
            }
        },
        //根据级联控件获取到的费用类型id数组，根据接口获得对应的汉字描述
        selectChangeType(item, index) {
            console.log(item.min);
            item.bigTypeName = '';
            item.smallTypeName = '';
            //调第三方接口
            axios.get('/api/v1/reim/code/' + item.min[0]).then(res => {
                item.bigTypeName = res.data[0].name;
            });
            if (item.min[1]) {
                axios.get('/api/v1/reim/code/' + item.min[1]).then(res => {
                    item.smallTypeName = item.smallTypeName + res.data[0].name;
                    if (item.min[2]) {
                        axios
                            .get('/api/v1/reim/code/' + item.min[2])
                            .then(res => {
                                item.smallTypeName =
                                    item.smallTypeName + '/' + res.data[0].name;
                            });
                    }
                });
            }
        },
        //报销明细和分摊明细鼠标右键删除方法
        youjian(index, type) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                if (
                    type == 'baoxiao' &&
                    this.operationType == 'edit' &&
                    this.tableData[index].id
                ) {
                    //调删除方法
                    axios
                        .delete(
                            '/api/v1/expense_forms/deleteItem/' +
                                this.tableData[index].id
                        )
                        .then(res => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.$emit('deleteItem');
                            this.tableData.splice(index, 1);
                            if (this.tableData.length <= 0) {
                                this.rows.total = this.common.toDecimal2(0);
                                this.rows.upper = this.common.DX('0.00');
                                this.changeTotal = this.rows.total;
                            } else {
                                this.totalSalary();
                            }
                        })
                        .catch(function() {
                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                        });
                } else {
                    this.tableData.splice(index, 1);
                    if (this.tableData.length <= 0) {
                        this.rows.total = this.common.toDecimal2(0);
                        this.rows.upper = this.common.DX('0.00');
                        this.changeTotal = this.rows.total;
                    } else {
                        this.totalSalary();
                    }
                }

                if (
                    type == 'fentan' &&
                    this.operationType == 'edit' &&
                    this.rows.shares[index].id
                ) {
                    axios
                        .delete(
                            '/api/v1/expense_forms/deleteShare/' +
                                this.rows.shares[index].id
                        )
                        .then(res => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.$emit('deleteItem');
                            this.rows.shares.splice(index, 1);
                        })
                        .catch(function() {
                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                        });
                } else {
                    this.rows.shares.splice(index, 1);
                }
            });
        },
        clickRow(row) {
            const self = this;
            self.event.returnValue = false;
        },
        //点击插入新增列表数据的方法
        insert(type) {
            if (type == 'baoDetail') {
                let boolean = true;
                for (let data of this.tableData) {
                    if (
                        !data.min[0] ||
                        data.depict == '' ||
                        data.currency == '' ||
                        data.money == '' ||
                        data.estRate == '' ||
                        data.estSum == ''
                    ) {
                        boolean = false;
                    }
                }
                if (boolean) {
                    this.tableData.push({
                        min: [],
                        depict: '',
                        bigTypeName: '',
                        smallTypeName: '',
                        currency:
                            this.tableData.length == 0
                                ? {
                                      value: '￥',
                                      label: '人民币'
                                  }
                                : this.tableData[0].currency,
                        money: '',
                        id: '',
                        estRate:
                            this.tableData.length == 0
                                ? 1
                                : this.tableData[0].estRate,
                        estSum: this.common.toDecimal2(0),
                        costItem: ''
                    });
                    this.tableData = this.tableData;
                } else {
                    this.$message({
                        message: '请输入报销明细必填项',
                        type: 'error'
                    });
                }
            } else if (type == 'fentan') {
                let boolean = true;
                for (let data of this.rows.shares) {
                    if (data.bearDep == '' || parseInt(data.bearSum) <= 0) {
                        boolean = false;
                    }
                }
                if (boolean) {
                    this.rows.shares.push({
                        bearUnit: '中关村协同发展',
                        bearDep: '',
                        payProject: '',
                        bearSum: this.common.toDecimal2(0),
                        upper: '',
                        shareRatio: ''
                    });
                } else {
                    this.$message({
                        message: '请输入分摊明细选项',
                        type: 'error'
                    });
                }
            }
        },
        //获取表单详情
        getForm() {
            this.showType = true;
            this.submission = '';
            this.travelPeople = '';
            this.getOgans();
            this.getUsers();
            this.getTravelList();
            this.getSubmissionlList();
            this.getClearForm();
            if (this.formId != '') {
                const self = this;
                axios
                    .get('/api/v1/expense_forms/' + this.formId)
                    .then(res => {
                        if (
                            res.data.type != '国内差旅报销' &&
                            res.data.type != '国际差旅报销'
                        ) {
                            if (res.data.payee == '多人') {
                                this.showBank = true;
                            }
                        } else {
                            this.showBank = false;
                        }
                        //费用承担部门显示
                        self.cookie_oid = res.data.expenseId;
                        if (
                            res.data.submissionId &&
                            res.data.submissionId != null
                        ) {
                            this.submission = res.data.submissionId;
                        }
                        if (
                            res.data.travellerId &&
                            res.data.travellerId != null
                        ) {
                            this.travelPeople = res.data.travellerId;
                            this.travelChange(res.data.travellerId);
                        }
                        //获取关联单号，显示关联单号
                        //是否借款赋值判断
                        if (res.data.borrow != null) {
                            self.getBorrowOdd(res.data.payeeId);
                        }
                        if (res.data.borrow == null) {
                            self.rows.borrow.payAble = res.data.total;
                            self.rows.borrow.upperSum = res.data.upper;
                        }
                        res.data.borrow =
                            res.data.borrow == null
                                ? this.rows.borrow
                                : res.data.borrow;
                        //报销明细
                        self.tableData = [];
                        let array = [];
                        if (res.data.repayItems.length > 0) {
                            for (let data of res.data.repayItems) {
                                let select = [];
                                select[0] = data.bigType;
                                if (data.smallType != null) {
                                    let i = 1;
                                    let smallArray = [];
                                    smallArray = data.smallType.split('/');
                                    for (let data of smallArray) {
                                        select[i] = data;
                                        i++;
                                    }
                                }
                                array.push({
                                    min: select,
                                    costItem: data.costItem,
                                    currency: {
                                        value: data.currency.curValue,
                                        label: data.currency.label
                                    },
                                    estRate: data.estRate,
                                    estSum: data.estSum,
                                    bigTypeName: data.bigTypeName,
                                    smallTypeName: data.smallTypeName,
                                    money: data.money,
                                    depict: data.depict,
                                    id: data.id
                                });
                            }
                        }
                        //转换类型
                        for (
                            let i = 0;
                            i < self.typeSelectChinese.length;
                            i++
                        ) {
                            if (self.typeSelectChinese[i] == res.data.type) {
                                res.data.type = self.typeSelectChinese[i];
                                self.type = String(i);
                            }
                        }

                        //重新根据类型获得大类小类
                        self.getTypeOpertions();
                        self.tableData = array;
                        self.rows = res.data;
                        self.radioChange('bor');
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        //附件删除方法
        deleteAttachment(id) {
            const self = this;
            if (this.rows.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        axios
                            .delete('/api/v1/expense_forms/deleteAtt/' + id)
                            .then(res => {
                                self.rows.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.rows.attachments.splice(index, 1);
                                    }
                                });
                            })
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                );
            }
        },
        //验证报销明细列表必输项
        checkTabledata() {
            let boolean = true;
            for (let data of this.tableData) {
                if (
                    !data.min[0] ||
                    data.depict == '' ||
                    data.currency == '' ||
                    data.money == '' ||
                    data.estRate == '' ||
                    data.estSum == ''
                ) {
                    boolean = false;
                }
            }
            return boolean;
        },
        //验证分摊明细必填
        checkSharedata() {
            let booleanshare = true;
            for (let data of this.rows.shares) {
                if (data.bearDep == '' || data.bearSum == '') {
                    booleanshare = false;
                }
            }
            return booleanshare;
        },
        //保存和提交走的验证方法
        typeOne(type) {
            if (
                this.rows.bank != '' &&
                this.rows.cardNo != '' &&
                this.rows.expenseDep != '' &&
                this.rows.clearing != '' &&
                this.rows.payee != '' &&
                this.checkTabledata() == true
            ) {
                if (this.rows.share) {
                    if (
                        this.submission != '' &&
                        this.checkSharedata() &&
                        this.travelPeople != ''
                    ) {
                        this.docheckNeed(type);
                    } else {
                        this.doCheckDialog(type);
                    }
                } else {
                    if (this.submission != '' && this.travelPeople != '') {
                        this.docheckNeed(type);
                    } else {
                        this.doCheckDialog(type);
                    }
                }
            } else {
                this.$message({
                    message: '请输入必填项',
                    type: 'error'
                });
            }
        },
        rulesChecktwo(type) {
            if (this.type == '1') {
                if (
                    this.rows.bank != '' &&
                    this.rows.cardNo != '' &&
                    this.rows.expenseDep != '' &&
                    this.rows.clearing != '' &&
                    this.rows.payee != '' &&
                    this.rows.topPower != '' &&
                    this.checkTabledata() == true
                ) {
                    if (this.rows.share) {
                        if (this.submission != '' && this.checkSharedata()) {
                            this.docheckNeed(type);
                        } else {
                            this.doCheckDialog(type);
                        }
                    } else {
                        if (this.submission != '') {
                            this.docheckNeed(type);
                        } else {
                            this.doCheckDialog(type);
                        }
                    }
                } else {
                    this.$message({
                        message: '请输入必填项',
                        type: 'error'
                    });
                }
            } else if (this.type == '0') {
                this.typeOne(type);
            } else {
                if (
                    this.rows.bank != '' &&
                    this.rows.cardNo != '' &&
                    this.rows.expenseDep != '' &&
                    this.rows.clearing != '' &&
                    this.rows.payee != '' &&
                    this.checkTabledata() == true
                ) {
                    if (this.rows.share) {
                        if (this.submission != '' && this.checkSharedata()) {
                            this.docheckNeed(type);
                        } else {
                            this.doCheckDialog(type);
                        }
                    } else {
                        if (this.submission != '') {
                            this.docheckNeed(type);
                        } else {
                            this.doCheckDialog(type);
                        }
                    }
                } else {
                    this.$message({
                        message: '请输入必填项',
                        type: 'error'
                    });
                }
            }
        },
        //所有必输项都输入了走的方法
        docheckNeed(type) {
            if (type == 'saveform') {
                this.saveFormValidate();
            } else {
                this.submitCheck();
            }
        },
        //带*号必输入的输入，不必须输入的没有都输的情况走的方法
        doCheckDialog(type) {
            this.$confirm('信息不够完善，是否要继续操作', '提示', {
                type: 'warning'
            }).then(() => {
                if (type == 'saveform') {
                    this.saveFormValidate();
                } else {
                    this.submitCheck();
                }
            });
        },
        //如果选择的费用承担部门不是集团领导可以保存，反之不能保存
        saveFormValidate() {
            // this.$refs['formupdate'].validate(valid => {
            //    if (valid) {
            if (this.rows.expenseDep == '集团领导') {
                this.$message({
                    message: '费用承担部门选择错误，请重新选择',
                    type: 'error'
                });
            } else {
                this.saveForm();
                this.$emit('saveStatus', false);
            }
            // }
            // });
        },
        saveForm(action = '') {
            console.log(this.rows.created);
            if (this.tableData.length > 0) {
                console.log(this.tableData);
                this.rows.repayItems = [];
                for (let data of this.tableData) {
                    this.rows.repayItems.push({
                        bigType: data.min[0],
                        bigTypeName: data.bigTypeName,
                        smallTypeName: data.smallTypeName,
                        costItem: data.costItem,
                        currency: {
                            curValue: data.currency.value,
                            label: data.currency.label
                        },
                        id: data.id ? data.id : '',
                        depict: data.depict,
                        estRate: data.estRate,
                        estSum: parseFloat(data.estSum),
                        money: parseFloat(data.money),
                        smallType:
                            data.min[1] && data.min[2]
                                ? data.min[1] + '/' + data.min[2]
                                : data.min[1] ? data.min[1] : ''
                    });
                }
            } else {
                this.rows.repayItems = [];
            }
            for (let data of this.rows.shares) {
                data.bearSum = parseFloat(data.bearSum);
                data.shareRatio = data.shareRatio;
                data.estSum = parseFloat(data.estSum);
            }
            for (let data of this.borrowOddSelections) {
                if (this.rows.borrow.borrowOdd == data.id) {
                    this.rows.borrow.borrowOdd = data.number;
                }
            }
            this.rows.borrow.payAble = parseFloat(this.rows.borrow.payAble);
            this.rows.borrow.shouldBack = parseFloat(
                this.rows.borrow.shouldBack
            );
            this.rows.total = parseFloat(this.rows.total);
            this.rows.type = this.typeSelectChinese[parseInt(this.type)];
            this.rows.expenseId = this.cookie_oid;
            const self = this;
            if (self.rows.created) {
                self.rows.created = moment(self.rows.created).format(
                    'YYYY-MM-DD HH:mm:ss'
                );
            } else {
                self.rows.created = moment(new Date()).format(
                    'YYYY-MM-DD HH:mm:ss'
                );
            }
            if (this.submission != '') {
                this.rows.submissionId = this.submission;
                for (let data of this.submissionSelections) {
                    if (data.id == this.submission) {
                        this.rows.submissionName = data.submissionNo;
                    }
                }
            }
            axios
                .post('/api/v1/expense_forms/save', JSON.stringify(this.rows), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.currentFormId = res.data.id;
                    if (action == 'save') {
                        self.submitForm();
                    } else {
                        self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        self.$emit('refreshData');
                        if (this.operationType == 'edit') {
                            self.$emit('refreshDetail');
                        }
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        //提交验证及走的方法
        submitCheck() {
            //this.$refs['formupdate'].validate(valid => {
            // if (valid) {
            this.$confirm(
                '请确认所有单据齐全，整齐平铺粘贴于A4纸上，并在首张单据右上角空白处注明流水单号后交到资金财务部;是否确认提交？',
                '提示',
                { type: 'warning' }
            ).then(() => {
                if (this.rows.expenseDep == '集团领导') {
                    this.$message({
                        message: '费用承担部门选择错误，请重新选择',
                        type: 'error'
                    });
                } else {
                    if (this.operationType == 'create') {
                        this.saveForm('save');
                        this.$emit('saveStatus', false);
                    } else {
                        this.submitForm();
                        this.$emit('saveStatus', false);
                    }
                }
            });
            // }
            // });
        },
        comment() {
            let self = this;
            axios
                .put(`/api/v1/expense_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    action: 'COMMIT',
                    node: '提交'
                })
                .then(res => {});
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/' +
                        this.typeSelectForeign[parseInt(this.type)] +
                        '/' +
                        this.currentFormId +
                        '/create',
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    if (res.data.id != '') {
                        self.commitForm(res.data.id);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/expense_forms/' +
                        this.currentFormId +
                        '/commit/' +
                        processId,
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.startProcess();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess() {
            const self = this;
            let sum = 0;
            for (let data of this.tableData) {
                sum += parseFloat(data.estSum);
            }
            let inbudget = true;
            if (
                parseFloat(this.rows.budget.surplusPlan) >= parseFloat(sum) &&
                parseFloat(this.rows.budget.surplusSum) >= parseFloat(sum)
            ) {
                inbudget = false;
            }
            let params;
            if (this.type == '0') {
                let array = [];
                if (self.travelList.length > 0) {
                    for (let data of self.travelList) {
                        array.push(data.bid);
                    }
                }
                params = {
                    action: 'COMMIT',
                    inbudget: inbudget,
                    oid: String(this.cookie_oid),
                    money: String(sum),
                    // money: String(this.rows.total),
                    borrowId: this.rows.borrow.borrowId,
                    assignees: array
                };
            } else if (this.type == '1') {
                params = {
                    action: 'COMMIT',
                    inbudget: inbudget,
                    oid: String(this.cookie_oid),
                    // money: String(this.rows.total),
                    money: String(sum),
                    borrowId: this.rows.borrow.borrowId,
                    position: this.rows.topPower
                };
            } else {
                params = {
                    action: 'COMMIT',
                    inbudget: inbudget,
                    oid: String(this.cookie_oid),
                    // money: String(this.rows.total),
                    money: String(sum),
                    borrowId: this.rows.borrow.borrowId
                };
            }
            axios
                .put(
                    '/api/v1/' +
                        this.typeSelectForeign[parseInt(this.type)] +
                        '/' +
                        this.currentFormId +
                        '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
                    if (this.operationType == 'edit') {
                        self.$emit('refreshDetail');
                    }
                    self.comment();
                    self.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    if (this.rows.borrow.borrowId != '') {
                        axios
                            .put(
                                '/api/v1/expense_forms/' +
                                    this.currentFormId +
                                    '/updateBorrow/' +
                                    this.rows.borrow.borrowId,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {})
                            .catch(function() {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                    axios
                        .post(
                            '/api/v1/expense_forms/updateBudgetSure/' +
                                this.currentFormId +
                                '?budgetSure=' +
                                inbudget,
                            '',
                            {
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            }
                        )
                        .then(res => {})
                        .catch(function() {
                            self.$message({
                                message: '预算信息保存失败',
                                type: 'error'
                            });
                        });
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        deleteItem(index) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.tableData.splice(index, 1);
            });
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.attachments.push(item);
                });
            }
            console.log(self.rows.attachments);
            this.$refs.upload.clearFiles();
        },
        downloadFile(item) {
            // window.open(url, '_blank');
            this.common.preview(item);
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {},
        getFormData() {
            return this.rows;
        },
        //获取详情前清空数据方法，要调用，不然有缓存，影响借款相关数据
        getClearForm() {
            this.showBank = false;
            this.rows = {
                no: '',
                id: '',
                type: '',
                travellerId: '',
                budgetSure: false,
                submissionId: '',
                submissionName: '',
                topPower: '',
                creatorName: this.cookie_uname,
                organName: this.cookie_oname,
                created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                payee: '',
                payeeId: '',
                expenseId: '',
                bank: '',
                cardNo: '',
                clearing: '',
                upper: '',
                expenseDep: this.cookie_oname,
                share: false,
                total: this.common.toDecimal2(0),
                budget: {
                    estSum: this.common.toDecimal2(0),
                    surplusSum: this.common.toDecimal2(0),
                    fundPlan: this.common.toDecimal2(0),
                    surplusPlan: this.common.toDecimal2(0)
                },
                attachments: [],
                borrow: {
                    bor: false,
                    borrowOdd: '',
                    noVerify: 0,
                    borrowId: '',
                    total: 0,
                    verify: 0,
                    sendDack: true,
                    payAble: this.common.toDecimal2(0),
                    shouldBack: this.common.toDecimal2(0),
                    upperSum: ''
                },
                shares: [
                    {
                        bearUnit: '中关村协同发展',
                        bearDep: '',
                        payProject: '',
                        bearSum: this.common.toDecimal2(0),
                        upper: '',
                        shareRatio: ''
                    }
                ],
                repayItems: []
            };
        },
        clearForm() {
            this.activeName = '';
            this.showBank = false;
            this.showType = this.operationType == 'edit' ? true : false;
            this.tableData = [
                {
                    min: [],
                    depict: '',
                    bigTypeName: '',
                    smallTypeName: '',
                    currency: {
                        value: '￥',
                        label: '人民币'
                    },
                    money: '',
                    id: '',
                    estRate: 1,
                    estSum: this.common.toDecimal2(0),
                    costItem: ''
                }
            ];
            const self = this;
            const cookieItems = document.cookie.split(';');
            cookieItems.forEach(function(item) {
                if (item.indexOf('oid') > -1) {
                    self.cookie_oid = decodeURIComponent(item.split('=')[1]);
                }
            });
            if (this.operationType == 'create') {
                this.rows = {
                    no: '',
                    id: '',
                    type: '',
                    travellerId: '',
                    budgetSure: false,
                    submissionId: '',
                    submissionName: '',
                    topPower: '',
                    creatorName: this.cookie_uname,
                    organName: this.cookie_oname,
                    created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    payee: '',
                    payeeId: '',
                    expenseId: this.cookie_oid,
                    bank: '',
                    cardNo: '',
                    clearing: '',
                    upper: '',
                    expenseDep: this.$store.getters.LoginData.oname,
                    share: false,
                    total: this.common.toDecimal2(0),
                    budget: {
                        estSum: this.common.toDecimal2(0),
                        surplusSum: this.common.toDecimal2(0),
                        fundPlan: this.common.toDecimal2(0),
                        surplusPlan: this.common.toDecimal2(0)
                    },
                    attachments: [],
                    borrow: {
                        bor: false,
                        borrowOdd: '',
                        noVerify: 0,
                        total: 0,
                        borrowId: '',
                        verify: 0,
                        sendDack: true,
                        payAble: this.common.toDecimal2(0),
                        shouldBack: this.common.toDecimal2(0),
                        upperSum: ''
                    },
                    shares: [
                        {
                            bearUnit: '中关村协同发展',
                            bearDep: '',
                            payProject: '',
                            bearSum: this.common.toDecimal2(0),
                            upper: '',
                            shareRatio: ''
                        }
                    ],
                    leaderadvice: '',
                    repayItems: [],
                    leaderadvice1: ''
                };
            }
        }
    }
};
</script>
<style lang="scss" scoped>
#ExpenseForm {
    table {
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        width: 100%;
    }
    table td,
    table th {
        border: 1px solid #000;
        color: #000;
        height: 30px;
        vertical-align: middle;
    }
    table thead th {
        background-color: #cce8eb;
    }
    table tr:nth-child(odd) {
        background: #fff;
    }
    table tr:nth-child(even) {
        background: #fff;
    }
    .el-table--border td,
    .el-table--border th,
    .el-table__body-wrapper
        .el-table--border.is-scrolling-left
        ~ .el-table__fixed {
        border-right: 1px solid #020819;
    }
    .el-table td,
    .el-table th.is-leaf {
        border-bottom: 1px solid #020819;
    }
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;

        cursor: pointer;

        .el-upload {
            width: 100%;
            height: 100%;

            i {
                font-size: 50px;
                margin-top: 35px;
            }
        }
    }

    .attachments {
        position: relative;
        margin-bottom: 40px;
        margin-right: 10px;
        width: 100px;
        height: 120px;
        display: inline-block;
        cursor: pointer;
        p {
            margin: 0;
            line-height: 20px;
            color: #606266;
            margin-right: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        i {
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px;
            &:hover {
                color: red;
            }
        }
    }
}
</style>