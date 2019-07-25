<template>
    <router-view :key="key">
    
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
        ]),
        key() {
            return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
        }
    },
    methods: {
            initIM() {
            let self = this;
            window.JIM = new JMessage();
            axios.get(`/api/v1/portal/im/signature`).then(res => {
                JIM.init({
                    "appkey": res.data.appkey,
                    "random_str": res.data.random_str,
                    "signature": res.data.signature,
                    "timestamp": res.data.timestamp,
                    "flag": 1

                }).onSuccess(function (data) {
                    self.loginIm();
                }).onFail(function (data) {
                    console.log('error:' + JSON.stringify(data))
                });
            });
        },
        loginIm() {
            let self = this;
            JIM.login({
                'username': 'im_' + self.$store.getters.LoginData.username,
                'password': '123456'
            }).onSuccess(function (data) {
                JIM.getConversation().onSuccess(function (data) {
                    self.$store.commit('setUserConversation', data);
                }).onFail(function (data) {
                    console.log('error:' + JSON.stringify(data));
                });


                JIM.onMsgReceive(function (data) {
                    let receiveData = data;
                    let msgList = self.$store.getters.getHistoryMessage;
                    let conversationList = self.$store.getters.getUserConversation;

                    let addNewPersonMsg = true;
                    for (var i = 0; i < msgList.length; i++) { //将新收到的消息放进store
                        if (msgList[i].key == receiveData.messages[0].key) {
                            addNewPersonMsg = false;
                            self.$set(msgList[i].msgs, msgList[i].msgs.length, receiveData.messages[0]);
                        }
                    }

                    if (addNewPersonMsg) {
                        msgList.push({
                            key: receiveData.messages[0].key,
                            msgs: [receiveData.messages[0]]
                        })
                    }

                    let addNewDialog = true;
                    for (var i = 0; i < conversationList.conversations.length; i++) {  //将新消息标识添加到对话列表
                        if (conversationList.conversations[i].key == receiveData.messages[0].key) {
                            addNewDialog = false;
                            // self.$set(conversationList.conversations[i],'unread_msg_count',conversationList.conversations[i].unread_msg_count ++ );
                            // console.log(conversationList.conversations[i].unread_msg_count);
                            conversationList.conversations[i].unread_msg_count = conversationList.conversations[i].unread_msg_count + 1;
                        }
                    }

                    //如果对话列表里没有，将新来的消息添加到回话列表
                    if (addNewDialog) {
                        let obj;
                        if (receiveData.messages[0].content.target_type == 'group') { //组织
                            obj = {
                                gid: receiveData.messages[0].key,
                                key: receiveData.messages[0].key,
                                name: receiveData.messages[0].content.target_name,
                                activeMark: true,
                                unread_msg_count: 1
                            }
                        } else {
                            obj = {
                                key: receiveData.messages[0].key,
                                name: receiveData.messages[0].content.from_id,
                                nickName: receiveData.messages[0].content.from_name,
                                activeMark: true,
                                unread_msg_count: 1
                            }
                        }
                        conversationList.conversations.push(obj);
                    };
                    self.open(receiveData);
                });
                JIM.onSyncConversation(function (data) {
                    self.$store.commit('setHistoryMessage', data);
                });
                JIM.onEventNotification(function (data) {
                    if (data.event_type == 1) {
                        self.$message({
                            message: '您的账号在其他地方登陆，可能影响即时通讯的使用',
                            type: 'warning'
                        });
                    }
                });
                JIM.onDisconnect(function (data) {
                    self.$message({
                        message: '您的账号在其他地方登陆，可能影响即时通讯的使用',
                        type: 'warning'
                    });
                    self.loginIm();
                });
            });
        },
        open(data) {
            const h = this.$createElement;
            let messages;
            if (data.messages[0].content.target_type == 'group') {
                messages = data.messages[0].content.from_name + "发来的(群组)消息";
            } else {
                messages = data.messages[0].content.from_name + "发来的消息";
            }
            this.$notify({
                title: messages,
                type: "success",
                duration: "10000",
                offset: 1,
                dangerouslyUseHTMLString: true,
                message: data.messages[0].content.msg_body.text
            });
        }
    },
     created() {
       // this.subscribe();
        this.initIM();
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
