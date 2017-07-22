
var app = new Vue({
    data: {
        alert: '',
        snackbar: {
            text: '',
            callback: null,
            action: ''
        },
    },
    computed: {
        humanId() {
            return Number(this.$route.path.substr(1));
        }
    },
    methods: {
        showSnackbar(text, callback, action, play) {
            this.snackbar.text = text;
            this.snackbar.callback = callback;
            this.snackbar.action = action;
            this.snackbar.play = (play == true);
        },
        showToast(text) {
            this.alert = text;
        },
    },
    el: '#app',
    store,
    router
});


new Vue({
    data: {
        warning: '',
        alert: '',
    },
    methods: {
        snackbar(text) {
            this.warning = text;
        },
        toast(text) {
            this.alert = text;
        },
    },
    el: '#settings',
    store,
    router: settingsRouter
});








$(document).ready(function()
{
    //userinfo.init();
    slider.init();
    //giper_chat.init();
    notepad.init();

    mailsett.init();
    report.init();
    navigate.init();

    name_suggest.init();
    city_suggest.init();

    option_static.init();
    option_sex.init();
    //option_email.init();
    profile_alert.init();
    profile_option.init();

    //user_tag.init();
    //desire_clip.init();

    //result_list.init();
    //visited.init();

});

