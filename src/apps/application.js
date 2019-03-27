
export const publicMethods = {
    methods: {
        async saveFormData(url, data) {
            try {
                return await this.$axios.post(url, data);
            } catch (err) {
                return false;
            }
        },
        async getDetails() {
            try {
                return await this.$axios.get(this.url);
            } catch (err) {
                return false;
            }
        },
        async getQueryList() {
            try {
                return await this.$axios.post(this.url, this.params);
            } catch (err) {
                return false;
            }
        },
        async emitMessage() {
            if (this.createForm_status) {
                this.$emit("reloadList", "reload"); //如果是 "新建" 表单刷新 "列表"
            } else {
                this.$emit("reloadList", this.formData); //如果是 "编辑" 表单刷新 "详情页"
            }
        },
        async startSignal(actions) {
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/${this.$store.getters.LoginData.uid}/signal`;
            return await this.$axios.put(url, actions ? actions : this.currentAction);
        },
        async startSignalForSave(type) {
            let actions = await this.getActions();
            this.hasRequired(actions.data.types[0]);
            let complete = await this.startSignal(actions.data.types[0]);
            if (!type) {
                await this.emitMessage(self);
            }
        },
        async startSignalForStart() {
            await this.startSignalForSave("forStart");
            let actions2 = await this.getActions();
            actions2.data.types = actions2.data.types.filter(function (item) {
                return item.action == "COMMIT";
            });
            this.hasRequired(actions2.data.types[0]);
            let complete2 = await this.startSignal(actions2.data.types[0]);
            await this.emitMessage(self);
        },
         hasRequired(data) {
            let $self = this;
            let detailsData = {};
            if (data.required && data.required.length > 0) {
                for (let item of data.required) {
                    let key = item.split(":")[0];
                    detailsData = $self.tableData ? $self.tableData : $self.formData
                    if (detailsData[key]) {
                       data["options"] = [key + "=" + detailsData[key]];
                    } else {
                        if(key == "oid"){
                            data["options"] = [key + "=" + this.$store.getters.LoginData.oid];
                        }else{
                            $self.msgTips('依赖的' + key + '表单中找不到', "warning");
                            return false;
                        }
                       
                    }
                }
            };
        },

        //点击审批动作
        async doAction(action) {
            let $self = this;
            $self.actionsDialogArr = [];
            $self.currentAction = action;
            if (action.addAssigneeList && action.addAssigneeList.length > 0) {
                $self.actionsDialogArr.push({
                    seletList: action.addAssigneeList,
                    label: action.addAssigneeListLabel,
                    multiple: action.addAssigneeListMul == "true" ? true : false,
                    checkedValue: action.addAssigneeListMul == "true" ? [] : "",
                    labelName: "addAssigneeList"
                });
            }

            if (action.assigneeList && action.assigneeList.length > 0) {
                $self.actionsDialogArr.push({
                    seletList: action.assigneeList,
                    label: action.assigneeListLabel,
                    multiple: action.assigneeListMul == "true" ? true : false,
                    checkedValue: action.assigneeListMul == "true" ? [] : "",
                    labelName: "assigneeList"
                });
            }

            if ($self.currentAction.action == 'PULL' || $self.currentAction.action == 'REJECT') {
                await $self.startSignal();
                $self.msgTips($self.currentAction.name +"成功","success");
                $self.getFormDetailsData();
            } else {
                $self.dialogVisible = true;
            }
        },
        //提交表单
        async submitForm() {
            let $self = this;
            $self.currentAction["comment"] = $self.textarea ? $self.currentAction.name : $self.textarea;
            $self.hasRequired($self.currentAction);
            if ($self.actionsDialogArr.length > 0) {
                for (let item of $self.actionsDialogArr) {
                    $self.currentAction[item.labelName] = item.checkedValue;
                }
                await $self.startSignal();
                $self.getFormDetailsData();
            } else {
                await $self.startSignal();
                $self.getFormDetailsData();
            }
            $self.dialogVisible = false;
            $self.msgTips($self.currentAction.name +"成功","success");
        },
 
        

        async getCrumbs() {
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/${this.$store.getters.LoginData.uid}/crumb`;
            return await this.$axios.get(url);
        },
        async getActions() {
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/${this.$store.getters.LoginData.uid}/actions`;
            return await this.$axios.get(url);
        },
        getComments(url) {
            this.$axios.get(url).then(res => {
                // $self.users = res.data;
            });
        },
        getUsers(url) {
            this.$axios.get(url).then(res => {
                // $self.users = res.data;
            });
        },
        deleteCurrentLine(id) {
            let $self = this;
            $self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                $self.$axios.get("/api/v1/" + $self.formName + "/delete/" + id).then(res => {
                    $self.msgTips("删除成功", "success");
                    $self.searchList();
                });
            });
        },
        msgTips(message, type) {
            this.$message({
                message: message,
                type: type
            });
        },

         //金额阿拉伯数字转大写金额
         convertCurrency(money) {  
            //汉字的数字  
            var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');  
            //基本单位  
            var cnIntRadice = new Array('', '拾', '佰', '仟');  
            //对应整数部分扩展单位  
            var cnIntUnits = new Array('', '万', '亿', '兆');  
            //对应小数部分单位  
            var cnDecUnits = new Array('角', '分', '毫', '厘');  
            //整数金额时后面跟的字符  
            var cnInteger = '整';  
            //整型完以后的单位  
            var cnIntLast = '元';  
            //最大处理的数字  
            var maxNum = 999999999999999.9999;  
            //金额整数部分  
            var integerNum;  
            //金额小数部分  
            var decimalNum;  
            //输出的中文金额字符串  
            var chineseStr = '';  
            //分离金额后用的数组，预定义  
            var parts;  
            if (money == '') { return ''; }  
            money = parseFloat(money);  
            if (money >= maxNum) {  
              //超出最大处理数字  
              return '';  
            }  
            if (money == 0) {  
              chineseStr = cnNums[0] + cnIntLast + cnInteger;  
              return chineseStr;  
            }  
            //转换为字符串  
            money = money.toString();  
            if (money.indexOf('.') == -1) {  
              integerNum = money;  
              decimalNum = '';  
            } else {  
              parts = money.split('.');  
              integerNum = parts[0];  
              decimalNum = parts[1].substr(0, 4);  
            }  
            //获取整型部分转换  
            if (parseInt(integerNum, 10) > 0) {  
              var zeroCount = 0;  
              var IntLen = integerNum.length;  
              for (var i = 0; i < IntLen; i++) {  
                var n = integerNum.substr(i, 1);  
                var p = IntLen - i - 1;  
                var q = p / 4;  
                var m = p % 4;  
                if (n == '0') {  
                  zeroCount++;  
                } else {  
                  if (zeroCount > 0) {  
                    chineseStr += cnNums[0];  
                  }  
                  //归零  
                  zeroCount = 0;  
                  chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];  
                }  
                if (m == 0 && zeroCount < 4) {  
                  chineseStr += cnIntUnits[q];  
                }  
              }  
              chineseStr += cnIntLast;  
            }  
            //小数部分  
            if (decimalNum != '') {  
              var decLen = decimalNum.length;  
              for (var i = 0; i < decLen; i++) {  
                var n = decimalNum.substr(i, 1);  
                if (n != '0') {  
                  chineseStr += cnNums[Number(n)] + cnDecUnits[i];  
                }  
              }  
            }  
            if (chineseStr == '') {  
              chineseStr += cnNums[0] + cnIntLast + cnInteger;  
            } else if (decimalNum == '') {  
              chineseStr += cnInteger;  
            }  
            return chineseStr;  
          } 
    },

};