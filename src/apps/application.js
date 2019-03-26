
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

        async startSignalForSave(type) {
            let actions = await this.getActions();
            actions.data.types[0]["options"] = ["oid=" + this.$store.getters.LoginData.oid];
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
            let complete2 = await this.startSignal(actions2.data.types[0]);
            await this.emitMessage(self);
        },
        async getActions() {
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/${this.$store.getters.LoginData.uid}/actions`;
            return await this.$axios.get(url);
        },
        async startSignal(actions) {
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/${this.$store.getters.LoginData.uid}/signal`;
            return await this.$axios.put(url, actions ? actions : this.currentAction);
        },
        async emitMessage() {
            if (this.createForm_status) {
                this.$emit("reloadList", "reload"); //如果是 "新建" 表单刷新 "列表"
            } else {
                this.$emit("reloadList", this.formData); //如果是 "编辑" 表单刷新 "详情页"
            }
        },
        getUsers() {
            this.$axios.get("/api/v1/users").then(res => {
                // $self.users = res.data;
            });
        },
        deleteCurrentLine(id) {
            let $self = this;
            $self.$axios.get("/api/v1/" + this.formName + "/delete/" + id).then(res => {
                $self.msgTips("删除成功", "success");
                $self.searchList();
            });
        },
        msgTips(message, type) {
            this.$message({
                message: message,
                type: type
            });
        },
        async getQueryList() {
            try {
                return await this.$axios.post(this.url, this.params);
            } catch (err) {
                return false;
            }
        },


        //点击审批动作
        doAction(action) {
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

            if ($self.currentAction.action == 'PULL') {
                $self.startSignalRefresh();
            } else {
                $self.dialogVisible = true;
            }

        },
        //提交表单
        submitForm() {
            let $self = this;
            if ($self.currentAction.required && $self.currentAction.required.length > 0) {
                $self.dialogVisible = true;
                for (let item of $self.currentAction.required) {
                    let key = item.split(":")[0];
                    if ($self.tableData[key]) {
                        $self.currentAction["options"] = [key + "=" + $self.tableData[key]];
                    } else {
                        $self.message('依赖的' + key + '表单中找不到', "warning");
                        return false;
                    }
                }
            };
            $self.currentAction["comment"] = $self.textarea ? $self.currentAction.name : $self.textarea;
            if ($self.actionsDialogArr.length > 0) {
                for (let item of $self.actionsDialogArr) {
                    $self.currentAction[item.labelName] = item.checkedValue;
                }
                $self.startSignalRefresh();
            } else {
                $self.startSignalRefresh();
            }
        },
        async startSignalRefresh() {
            let $self = this;
            await $self.startSignal();
            $self.getFormDetailsData();
            $self.dialogVisible = false;
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