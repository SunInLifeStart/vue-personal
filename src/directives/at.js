export default {
  bind (el, binding, vnode) {
    let $inputor = $(el).atwho({
      at: "@", 
      data: "/api/v1/users",
      displayTpl: "<li> ${name} </li>",
      insertTpl: "<span class='at-id' at-id='${id}'>${atwho-at}${name}</span>",
      limit: 7
    });
    $(el).on("matched.atwho", function(event, flag, query) {
      console.log(event, "matched " + flag + " and the result is " + query);
    });
  },
  update () {

  },
  unbind (el, binding) {
      
  }
};