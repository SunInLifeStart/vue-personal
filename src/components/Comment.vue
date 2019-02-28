<template>
    <div class="textarea" contenteditable="true">
    
    </div>
</template>

<script>
export default {
    data() {
        return {
            comment: ""
        }
    },
    methods: {
        getIds() {
            let atIds = [];
            $(this.$el).find(".at-id").each(function() {
                atIds.push(parseInt($(this).attr("at-id")));
            });
            return atIds;
        },
        getComment() {
            return this.$el.innerText;
        },
        isEmpty() {
            return this.$el.innerText.trim().length == 0;
        },
        clearComment(){
          this.$el.innerHTML = "";
        }
    },
    mounted() {
        $(this.$el).atwho({
            at: "@",
            data: "/api/v1/users",
            displayTpl: "<li> ${name} </li>",
            insertTpl: "<span class='at-id' at-id='${id}'>${atwho-at}${name}</span>",
            limit: 7
        });
    }


}
</script>

<style lang="scss" scoped>
.textarea {
    border: 1px solid #ccc;
    height: 60px;
    outline: 0px;
    -webkit-user-select: text;
    user-select: text;
    padding: 3px;
    border-radius: 3px;
}
</style>