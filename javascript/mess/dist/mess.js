'use strict';

$(document).ready(function () {
    // Получение GET параметров по имени
    $.urlParam = function (name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    };

    //cont_list.init();

    lock_user.init();
    confirm_block_dn.init();

    moderator.init();

    edit_cont.init();
    added_info.init();
    part_info.init();

    quick_photo.init();
    quick_mess.init();

    mess_sett.init();
    dating_time.init();

    anketa.init();
    add_contact.init();

    if (tid) {
        visited.action.save(tid);
    }
});

// -- Список жалоб на пользователя ---

Vue.http.options.emulateJSON = true;

Vue.component('abuse-form', {
    template: '#abuse-form',
    props: ['show'],
    data: function data() {
        return {
            disabled: false,
            isEditorShow: 0,
            isSuggestShow: 1,
            suggest: ['Предложение оплаты услуг, вирт за деньги, проституция', 'Мошенничество, развод на деньги, шантаж, вымогательство', 'Фото из интернета, вымышленные данные, обман, фейк', 'Оскорбления, хамство, троллинг, грубые сообщения', 'Рассылает интим фото, спамит или провоцирует'],
            text: ''
        };
    },
    created: function created() {
        //console.log("abuse_form Created");
    },
    methods: {
        choiceText: function choiceText(event) {
            this.text = event.target.innerHTML;
            this.isEditorShow = true;
            this.isSuggestShow = false;
        },
        post: function post(event) {
            simple_hash();
            disabled_with_timeout($('.abuse-form__btn'), 10);
            this.$http.post('/abuse/send', {
                id: tid,
                text: this.text,
                captcha: '',
                hash: hash
            }).then(function (data) {
                this.response(data.body);
            });
        },
        cancel: function cancel() {
            this.$emit('cancel');
            this.isSuggestShow = true;
        },
        response: function response(data) {
            console.log(data);
            disabled_with_timeout($('.abuse-form__btn'), 0.1);
            if (!data) return 0;
            var mess = json.parse(data);
            if (mess.saved) {
                this.success(mess.text);
            } else {
                confirm_block_dn.show_confirm(mess.text);
            }
        },
        success: function success(text) {
            console.log('ok');
            confirm_block_dn.show_confirm(text);
            this.cancel();
        }
    }
});

var abuse_list = new Vue({
    el: '#abuse-list-component',
    data: {
        abuseStatus: 0,
        isFormShow: 0,
        isListShow: 0,
        isButtonShow: 0
    },
    mounted: function mounted() {
        //console.log(abuse_form.mess());
    },
    methods: {
        showForm: function showForm(event) {
            if (!this.isFormShow) {
                this.isFormShow = true;
            } else {
                this.hideForm();
            }
            this.isButtonShow = false;
        },
        hideForm: function hideForm(event) {
            this.isFormShow = false;
            this.isButtonShow = false;
            //this.isSuggestShow = true;
        },
        showList: function showList(event) {
            this.isListShow = !this.isListShow;
        },
        showButton: function showButton() {
            if (!this.isFormShow) {
                this.isButtonShow = true;
            }
        }
    }
});

var add_contact = {

    sync_taglist: 0,

    init: function init() {
        $('.add_contact').on('click', add_contact.action.add);
    },
    ajax: {
        add: function add(tag) {
            // alert(tag);        
            $.post('/tag/contact/', { tag: tag });
        }
    },
    action: {
        add: function add() {
            $('.add_contact').removeClass('active');
            $(this).addClass('active');
            add_contact.ajax.add($(this).data('tag'));
        }
    }
};

// -- Подстановка дополнительной информации в отправку сообщения ---
var added_info = {

    init: function init() {
        if (user_sex && (!user_name || !user_age || !user_city)) {
            //TODO: реализовать до информацию 
            //$('#form_post_mess').append('<div id="added_info_block"></div>');//{ hash: 15234 },
            //$('#added_info_block').load('/static/htm/added_info.html #added_load', added_info.onload);
        }
    },

    onload: function onload() {
        var post_form = $('#form_post_mess');
        $('#added_info_btn').click(function () {
            added_info.show();
        });

        added_info.generate();
        added_info.visible();
        name_suggest.init(); // [!!!]
    },

    generate: function generate() {
        var print_age = user_age ? user_age : auto_gen.age(human_age);
        var print_name = user_name ? user_name : auto_gen.name(user_sex);
        var print_city = user_city ? user_city : human_city;

        $('#added_name').val(print_name);
        $('#added_city').val(print_city);
        $('#added_age').val(print_age);
    },

    visible: function visible() {
        added_info.generate();
        $('#added_info_btn').show();
    },

    show: function show() {
        $('#added_info_btn').hide('blind');
        $('#added_info').show('blind');
    }

};

// -- Анкетные данные --        
var anketa = {

    init: function init() {
        $('#anketa_collaps_link').on('click', anketa.action.second_info.toggle);
    },

    action: {
        second_info: {
            toggle: function toggle() {
                if ($('#anketa_second_info').is(':visible')) {
                    anketa.action.second_info.hide();
                } else {
                    anketa.action.second_info.show();
                }
            },

            show: function show() {
                $('#anketa_second_info').show('blind');
                anketa.option.collaps.up();
            },

            hide: function hide() {
                $('#anketa_second_info').hide('blind');
                anketa.option.collaps.down();
            }
        }
    },

    option: {
        collaps: {
            up: function up() {
                $('#anketa_collaps_link').text('Свернуть анкету');
            },

            down: function down() {
                $('#anketa_collaps_link').text('Развернуть анкету');
            }
        }
    }

};

// -- Нижний блок Уведомлений ---
var confirm_block_dn = {

    init: function init() {
        $('#confirm_block_dn').click(function () {
            confirm_block_dn.hide_block();
        });
    },

    show_block: function show_block() {
        $('#confirm_block_dn').show('blind');
    },

    hide_block: function hide_block() {
        $('#confirm_block_dn').hide('blind');
    },

    set_text: function set_text(text) {
        $('#confirm_block_dn').html(text);
    },

    show_confirm: function show_confirm(text) {
        confirm_block_dn.set_text(text);
        confirm_block_dn.show_block();
    }

};

//
//// -- Список контактов ---
//var cont_list = {
//
//    acttab: 'inline',
//    count: 0,
//    clear: 1,
//    inlist: 0,
//    buffer: [],
//
//    init: function ()
//    {
//        $('#contact_update').on('click',cont_list.action.update);
//        $('#list_load_next').on('click',cont_list.action.next);
//        $('#list_show_optn').on('click',cont_list.option.delets.show);
//
//        $('#list_load_inline').on('click',cont_list.action.tab.inline);
//        $('#list_load_online').on('click',cont_list.action.tab.online);
//        $('#list_load_faline').on('click',cont_list.action.tab.faline);
//        $('#list_load_deline').on('click',cont_list.action.tab.deline);
//
//        cont_list.ajax.load();
//    } ,
//
//    ajax: {
//
//        load: function ()
//        {
//            simple_hash();
//            setTimeout(function() {
//            $.get( '/contact/list/'+ cont_list.acttab +'/', { inlist: cont_list.count, hash: hash }, cont_list.ajax.success)
//             .fail(cont_list.ajax.error); }, 2000);
//        } ,
//
//        success: function (data)
//        {
//            var mess = [];
//            if (data) {
//                mess = JSON.parse(data);
//            }
//
//
//            cont_list.inlist = $('#list_contact_block .message_listbox_link').length;
//
//            if (cont_list.clear)
//                cont_list.action.clear();
//
//            if (cont_list.count) {                              //  alert(cont_list.buffer.length)
//                $.each(cont_list.buffer, cont_list.action.new_line);
//                cont_list.buffer.length = 0;
//                if(mess.length)
//                    $.each(mess, cont_list.action.buff_cont);
//            } else {
//                $.each(mess, cont_list.action.new_line);
//            }
//
//            cont_list.count = $('#list_contact_block .message_listbox_link').length;
//            if (cont_list.count > 2)
//                $('#tip_list_users_block').hide('blind');
//
//            cookie_storage.set_cookie('list_count',cont_list.count,259200);
//            cont_list.action.show();
//            cont_list.clear = 1;
//        } ,
//
//        error: function ()
//        {
//            setTimeout(cont_list.ajax.load,7000);
//        } ,
//
//        del_user: function (id)
//        {
//            $.post("/human/delete/",{ tid: id });
//        } ,
//
//        rec_user: function (id)
//        {
//            $.post( "/human/unlock/", { tid: id } );
//        } ,
//
//        favorite: function (id)
//        {
//            $.post( "/human/favorite/", { tid: id } );
//        } ,
//
//        general: function (id)
//        {
//            $.post( "/human/general/", { tid: id } );
//        }
//
//    } ,
//
//    action: {
//
//        show: function ()
//        {
//            $('#list_contact_block').show('blind');
//        } ,
//
//        favorite: function (id)
//        {
//            if ($('#listbox_line_'+id).data('fav')*1) {
//                cont_list.option.favorite.passive(id);
//                cont_list.ajax.general(id);
//            } else {
//                cont_list.option.favorite.active(id);
//                cont_list.ajax.favorite(id);
//            }
//        } ,
//
//        delete_user: function (id)
//        {
//            $('#listbox_line_'+id +' .message_listbox_link').hide('blind');
//            $('#listbox_line_'+id +' .listbox_recover').show('blind');
//            cont_list.option.updater.show();
//            cont_list.ajax.del_user(id);
//        } ,
//
//        recover_user: function (id)
//        {
//            $('#listbox_line_'+id+' .message_listbox_link').show('blind');
//            $('#listbox_line_'+id+' .listbox_recover').hide('blind');
//            cont_list.ajax.rec_user(id);
//        } ,
//
//        clear: function ()
//        {
//            $('#list_contact_block').empty();
//            cont_list.buffer.length = 0;
//        } ,
//
//        update: function ()
//        {
//            cont_list.count = 0;
//            cont_list.ajax.load();
//            cont_list.option.refresh();
//        } ,
//
//        next: function ()
//        {
//            cont_list.clear = 0;
//            cont_list.ajax.load();
//            cont_list.option.refresh();
//        } ,
//
//        buff_cont: function (i,val)
//        {                                         // alert(val.name);
//            cont_list.buffer.push(val);
//        } ,
//
//        new_line: function (i,val)
//        {
//            if (i >= 5) {
//                cont_list.action.buff_cont(i,val);
//                return 0;
//            }
//
//            var new_block = $('#listbox_line_ex').clone()
//             .attr('id', 'listbox_line_'+val.cont_id)  //.css("display","none")
//             .click( function(){  location.href = '/'+val.cont_id;  } )
//             .data('num', val.cont_id)
//             .data('fav', val.favorite)
//             .appendTo("#list_contact_block")
//                                                        // alert ( val.style );
//            $('.icon_list',new_block).addClass(val.style);
//            $('.user_name',new_block).text(val.name);
//
//                $('.cont_list_fav_user',new_block).click( function(){
//                  cont_list.action.favorite(val.cont_id);  return false; } );
//                $('.cont_list_del_user',new_block).click( function(){
//                  cont_list.action.delete_user(val.cont_id);  return false; } );
//                $('.listbox_recover',new_block).click( function(){
//                  cont_list.action.recover_user(val.cont_id);  return false; } );
//
//            if (cont_list.acttab == 'deline') {
//                $('.cont_list_fav_user',new_block).remove();
//                $('.cont_list_del_user',new_block).remove();
//            }
//
//
//            if (val.favorite*1)
//                cont_list.option.favorite.active(val.cont_id);
//
//            cont_list.option.updater.hide();
//
//            if (val.photo)
//            {
//                //$('img',new_block).get(0).src = val.photo ;
//                //$('img',new_block).show('fade');
//            }
//            if (val.unread*1)
//            {
//                //$('.unread_count',new_block).text('('+val.unread+')') ;
//            }
//        } ,
//
//        tab: {
//
//            show: function (tab) {
//                if (tab != cont_list.acttab) {
//                     cont_list.acttab = tab;
//                     cont_list.count  = 0;
//                     cont_list.ajax.load();
//                }
//                cont_list.option.refresh();
//                cont_list.action.tab.active();
//            } ,
//
//            active: function () {
//                $('.listbox_tab').removeClass('active');
//                $('#list_load_'+ cont_list.acttab).addClass('active');
//            } ,
//
//            inline: function () {
//                cont_list.action.tab.show('inline');
//            } ,
//
//            faline: function () {
//                cont_list.action.tab.show('faline');
//            } ,
//
//            deline: function () {
//                cont_list.action.tab.show('deline');
//            } ,
//
//            addition: function () {
//
//            }
//        }
//
//    } ,
//
//    option: {
//
//        refresh: function () {
//            cont_list.option.updater.hide();
//            cont_list.option.delets.hide();
//            cont_list.option.favorite.show();
//        } ,
//
//        updater: {
//
//            show: function ()
//            {
//                $('#contact_update').show('fade');
//            } ,
//
//            hide: function ()
//            {
//                $('#contact_update').hide('fade');
//            }
//        } ,
//
//        delets: {
//
//            show: function ()
//            {
//                $('.cont_list_del_user').toggle('fade');
//                $('.cont_list_fav_user').toggle('fade');
//            } ,
//
//            hide: function ()
//            {
//                $('.cont_list_del_user.touch_option').hide('fade');
//            }
//        } ,
//
//        favorite: {
//
//            active: function (id)
//            {
//                $('#listbox_line_'+id +' .cont_list_fav_user i').addClass('favorite');
//                $('#listbox_line_'+id).data('fav',1);
//            } ,
//
//            passive: function (id)
//            {
//                $('#listbox_line_'+id +' .cont_list_fav_user i').removeClass('favorite');
//                $('#listbox_line_'+id).data('fav',0);
//            } ,
//
//            show: function ()
//            {
//                $('.cont_list_fav_user').show('fade');
//            } ,
//
//            hide: function ()
//            {
//                $('.cont_list_fav_user').hide('fade');
//            }
//        }
//
//    }
//}
//

//
//var ContactSection = new Vue({
//    methods: {
//        openInit() {
//            store.commit('showInitial', 1);
//        },
//        openIntim() {
//            console.log(111)
//            store.commit('showIntimate', 1);
//        },
//        openSends() {
//            store.commit('showSends', 1);
//        },
//    },
//    store,
//    el: '#contact-section',
//});


// -- Время свиданий ---
var dating_time = {

    init: function init() {
        dating_time.show();
        dating_time.load();
    },

    show: function show() {
        if (online < 777) {
            $('#button_videochat').show();
        } else if (online < 500000 && dating != '00:00') {
            $('#user_dating_time').text(dating);
            $('#user_dating_time_block').show();
        }
    },

    load: function load() {
        if (uid) {
            $('#dating_time_post_button').on('click', dating_time.ajax.save);

            var dating_hour = cookie_storage.get_cookie('dating_hour');
            if (dating_hour) $("#dating_hour :contains('" + dating_hour + "')").attr("selected", "selected");

            var dating_minut = cookie_storage.get_cookie('dating_minut');
            if (dating_minut) $("#dating_minut :contains('" + dating_minut + "')").attr("selected", "selected");
        } else $('#set_dating_time input').prop("disabled", true);
    },

    ajax: {

        save: function save() {
            var time_str = $('#dating_hour').val().trim() + ':' + $('#dating_minut').val().trim();
            $.get('/ajax/post_abuse.php', { dating_time: time_str, hash: hash }, dating_time.ajax.success);
        },

        success: function success(data) {
            cookie_storage.set_cookie('dating_hour', $('#dating_hour').val(), 259200);
            cookie_storage.set_cookie('dating_minut', $('#dating_minut').val(), 259200);
            $('#saved_dating').show('fade');
            $('#saved_dating').delay(2000).hide('fade');
        }
    }
};

// -- Изменение информации о контакте ---
var edit_cont = {

    init: function init() {
        $('#edit_cont_btn').click(function () {
            edit_cont.show();
        });
        $('#edit_human_btn').click(function () {
            edit_cont.save();
        });
    },

    show: function show() {
        var print_name = human_name ? human_name : auto_gen.name(human_sex);

        if ($('#human_print_name').text().search(/(Парень|Девушка)/) < 0) print_name = $('#human_print_name').text();

        $('#edit_human_name').val(print_name);

        if (!$('human_data_block').is('#edit_cont_elem')) $('#human_data_block').append($('#edit_cont_elem'));

        $('#edit_cont_elem').toggle('blind');
        $('#human_data_print').toggle('blind'); //alert (123);
    },

    save: function save() {
        human_name = $('#edit_human_name').val();

        edit_cont.update();
        edit_cont.show();
        edit_cont.send();
    },

    send: function send() {
        $.post('/contact/extra/', { tid: tid, age: '', name: human_name, city: '' });
        //cont_list.option.updater.show();
    },

    update: function update() {
        $('#human_print_name').text(human_name);
    }

};

var FormMess = new Vue({
    el: '#message_post_form',
    store: store,
    data: {
        message: '',
        reply: '',
        code: '',
        show: true,
        process: false,
        approve: true,
        dirt: false,
        tid: null
    },
    mounted: function mounted() {
        var _this = this;

        this.tid = tid;

        $('#mess-text-area').on('keypress', function (event, el) {
            if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {
                _this.sendMessage();
            }
        });
    },
    watch: {
        message: function message() {
            this.isDirt();
        }
    },
    computed: Vuex.mapState({
        config: function config(state) {
            return state.formMess;
        },
        photo: function photo(state) {
            return state.formMess.sendPhoto;
        },
        intimate: function intimate(state) {
            return state.formMess.intimate;
        },
        user: function user(state) {
            return state.user;
        }
    }),
    methods: {
        reset: function reset() {
            this.cancelPhoto();
            this.show = true;
            this.process = false;
            this.approve = true;
            this.message = '';
        },

        isDirt: _.debounce(function () {
            var word = /\w{0,5}[хx]([хx\s\!@#\$%\^&*+-\|\/]{0,6})[уy]([уy\s\!@#\$%\^&*+-\|\/]{0,6})[ёiлeеюийя]\w{0,7}|\w{0,6}[пp]([пp\s\!@#\$%\^&*+-\|\/]{0,6})[iие]([iие\s\!@#\$%\^&*+-\|\/]{0,6})[3зс]([3зс\s\!@#\$%\^&*+-\|\/]{0,6})[дd]\w{0,10}|[сcs][уy]([уy\!@#\$%\^&*+-\|\/]{0,6})[4чkк]\w{1,3}|\w{0,4}[bб]([bб\s\!@#\$%\^&*+-\|\/]{0,6})[lл]([lл\s\!@#\$%\^&*+-\|\/]{0,6})[yя]\w{0,10}|\w{0,8}[её][bб][лске@eыиаa][наи@йвл]\w{0,8}|\w{0,4}[еe]([еe\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[uу]([uу\s\!@#\$%\^&*+-\|\/]{0,6})[н4ч]\w{0,4}|\w{0,4}[еeё]([еeё\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[нn]([нn\s\!@#\$%\^&*+-\|\/]{0,6})[уy]\w{0,4}|\w{0,4}[еe]([еe\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[оoаa@]([оoаa@\s\!@#\$%\^&*+-\|\/]{0,6})[тnнt]\w{0,4}|\w{0,10}[ё]([ё\!@#\$%\^&*+-\|\/]{0,6})[б]\w{0,6}|\w{0,4}[pп]([pп\s\!@#\$%\^&*+-\|\/]{0,6})[иeеi]([иeеi\s\!@#\$%\^&*+-\|\/]{0,6})[дd]([дd\s\!@#\$%\^&*+-\|\/]{0,6})[oоаa@еeиi]([oоаa@еeиi\s\!@#\$%\^&*+-\|\/]{0,6})[рr]\w{0,12}/i;
            this.dirt = word.test(this.message) ? true : false;
            return this.dirt;
        }, 700),
        upload: function upload() {
            store.commit('optionDialog', 'upload');
        },
        cancelPhoto: function cancelPhoto() {
            store.commit('sendPhoto', { photo: null, alias: null });
        },
        send: function send() {
            this.photo.alias ? sendPhoto() : sendMessage();
        },
        sendPhoto: function sendPhoto() {
            // TODO: почти готово, ждем сообщений
            //Vue.htt*p.headers.common['Authorization'] = 'Bearer ' + get_cookie('jwt');
            // let data = {
            // 	alias: this.photo.alias
            // };
            // this.$http.post('http://'+api_photo+'/api/v1/users/'+tid+'/sends', data).then(function (response) {
            //     //console.log(response.body);
            // });
            // window.location.reload();
        },
        sendMessage: function sendMessage() {
            var _this2 = this;

            // TODO: убрать из формы старое говно
            var data = {
                id: this.tid,
                captcha_code: this.code
            };
            if (this.photo.alias) {
                data['photo'] = this.photo.alias;
            } else {
                data['mess'] = this.message;
                data['re'] = this.reply;
            }
            api.messages.send(data).then(function (response) {
                _this2.onMessageSend(response.data);
            });
            this.process = true;
        },
        sendSex: function sendSex(sex) {
            var _this3 = this;

            this.$store.dispatch('SAVE_SEX', sex).then(function (response) {
                _this3.sendMessage();
            }).catch(function (error) {
                _this3.onError(error);
            });
            this.process = true;
        },
        onMessageSend: function onMessageSend(response) {
            if (!response.saved && response.error) {
                if (response.error == 'need_captcha') {
                    this.captcha();
                }
                this.onError();
            } else {
                this.sended(response);
            }
            this.process = false;
        },
        sended: function sended(response) {
            //MessList.messages.unshift(response.message);
            MessList.reload();
            // TODO: старая зависимость
            $('#mess_shab_text_block').hide();
            giper_chat.timer_cut();
            this.reset();
        },
        captcha: function captcha() {
            $('.form-message__captcha-img').get(0).src = '/secret_pic.php?hash=' + hash;
            this.approve = false;
        },
        onError: function onError() {
            this.process = false;
        }
    }
});

// -- Форма отправки сообщения ---
var form_mess = {

    show_form: function show_form() {
        $('#message_post_form').show('blind');
    },

    hide_form: function hide_form() {
        $('#message_post_form').hide('blind');
    }

};

var incoming_photo = new Vue({
    el: '#incoming-photo',
    store: store,
    data: {
        photos: [],
        user: 0,
        server: null
    },
    created: function created() {
        this.server = this.$store.state.photoServer;
    },
    methods: {
        loadPhoto: function loadPhoto() {
            var _this4 = this;

            var config = {
                headers: { 'Authorization': 'Bearer ' + this.$store.state.apiToken },
                params: { tid: tid, hash: hash }
            };
            axios.get('http://' + this.server + '/api/v1/users/' + uid + '/sends', config).then(function (response) {
                _this4.photos = response.data.photos;
                //console.log(this.photos);
            }).catch(function (error) {
                console.log(error);
            });
        },

        show: function show(index) {
            var photo = this.photos[index];
            var links = photo._links;
            if (links.origin.href) {
                var data = {
                    thumb: links.thumb.href,
                    photo: links.origin.href,
                    alias: photo.alias,
                    height: photo.height,
                    width: photo.width
                };
                store.commit('viewPhoto', data);
                store.commit('optionDialog', 'photo');
            }
            //console.log(this.photos[index].height);
        }
    }
});

$(document).ready(function () {
    incoming_photo.loadPhoto();
});

// -- Блокировка пользователя ---
var lock_user = {

    init: function init() {
        lock_user.set_lock();
        $('#unlock_inform_block').click(function () {
            $(this).hide('blind');
        });
    },

    set_lock: function set_lock() {
        /* */
        $('#lock_user_link').unbind('click');
        $('#lock_user_link').click(function () {
            lock_user.post_lock();
        });
        lock_user.red_link(0);
        MessList.attention = false;
        lock_user.link_text('Заблокировать');
    },

    set_unlock: function set_unlock() {
        $('#lock_user_link').unbind('click');
        $('#lock_user_link').click(function () {
            lock_user.post_unlock();
        });
        lock_user.red_link(1);
        MessList.attention = true;
        lock_user.link_text('Разблокировать');
    },

    show_link: function show_link() {
        $('#lock_user_link').show('fade');
    },

    hide_link: function hide_link() {
        $('#lock_user_link').hide('fade');
    },

    ajax_send: function ajax_send(lock) {
        simple_hash();

        var action = lock ? 'lock' : 'unlock';

        $.post('/human/' + action + '/', {
            tid: tid,
            hash: hash
        });
    },

    post_lock: function post_lock() {
        lock_user.inform_lock();
        lock_user.set_unlock();
        lock_user.ajax_send(1);
    },

    post_unlock: function post_unlock() {
        lock_user.inform_unlock();
        lock_user.set_lock();
        lock_user.ajax_send(0);
    },

    red_link: function red_link(lock) {
        if (lock) {
            $('#lock_user_link').addClass('red_link');
        } else $('#lock_user_link').removeClass('red_link');
    },

    link_text: function link_text(text) {
        $('#lock_user_link').text(text);
    },

    inform_lock: function inform_lock() {
        $('#unlock_inform_block').hide('blind');
        $('#lock_inform_block').show('blind');
    },

    inform_unlock: function inform_unlock() {
        $('#lock_inform_block').hide('blind');
        $('#unlock_inform_block').show('blind');
    }

};

var MessList = new Vue({
    el: '#user-dialog',
    store: store,
    data: {
        messages: [],
        response: null,
        error: 0,
        next: 0,
        newCount: 0,
        batch: 15,
        received: 0,
        attention: false,
        uid: null,
        tid: null,
        date: null,
        toSlow: false
    },
    mounted: function mounted() {
        this.tid = tid;
        this.load();
    },
    methods: {
        reload: function reload() {
            this.next = 0;
            this.newCount = 0;
            this.messages = [];
            this.load();
            fdate = null;
            prev = null;
            //TODO: переписать глобальную зависимость
        },
        load: function load() {
            var _this5 = this;

            //console.log('load MessList data');
            this.response = 0;
            var config = {
                headers: { 'Authorization': 'Bearer ' + this.$store.state.apiToken },
                params: { id: this.tid, next: this.next, hash: hash }
            };
            axios.get('/ajax/messages_load.php', config).then(function (response) {
                _this5.onLoad(response);
            }).catch(function (error) {
                _this5.error = 10;
                console.log(error);
            });
            setTimeout(function () {
                return _this5.toSlow = true;
            }, 7000);
        },
        onLoad: function onLoad(response) {
            var messages = response.data.messages;
            this.received = messages ? messages.length : 0;
            if (!messages && !this.messages.length) {
                this.noMessages();
            } else {
                if (this.received) {
                    this.messages = _.union(this.messages, messages);
                }
                // TODO: Заменить на компоненты, страрые зависимости
                lock_user.show_link();
                this.next += this.batch;
            }
            this.response = 200;
            this.toSlow = false;
            //console.log(response);
        },
        noMessages: function noMessages() {
            // TODO: Заменить на компоненты, страрые зависимости
            quick_mess.ajax_load();
            notice_post.show();
            store.commit('intimated', false);
        },
        setDate: function setDate(date) {
            //this.date = new Date(this.item.date).getDayMonth();
        },
        remove: function remove(index) {
            console.log('remove(' + index + ')');
            this.messages.splice(index, 1);
        },
        admit: function admit() {
            console.log('itOk false');
            this.attention = false;
        },
        setNew: function setNew() {
            console.log('new');
            this.newCount += 1;
        }
    },
    computed: {
        more: function more() {
            if (this.received && this.received == this.batch) {
                return true;
            }
            return false;
        },

        uid: function uid() {
            return undefined.store.user.uid;
        }
    }
});

// -- Настройки почты, поиска ---  
var mess_sett = {

    init: function init() {
        $('#post_mail_setting').on('click', mess_sett.ajax_post);
        mess_sett.print(cookie_storage.get_data('mail_sett'));

        $('#mail_setting_hide').on('click', mess_sett.hide);
        $('#mail_setting_show').on('click', mess_sett.show);
    },

    print: function print(sett) {
        if (!sett.who) {
            $("#opt_who").val(0);
        } else $("#opt_who").val(sett.who);

        if (sett.town * 1) $("#opt_town").attr("checked", "checked");

        if (sett.virt * 1) $("#opt_virt").attr("checked", "checked");

        if (sett.up > 0) $("#opt_up").val(sett.up);

        if (sett.to > 0) $("#opt_to").val(sett.to);
    },

    /* -- Скрыть/показать настройки --- */
    show: function show() {
        $('#form_mail_setting').show('blind');
        $('#mail_setting_show').hide('fade');
        cookie_storage.del_cookie('hide_mail_setting');
    },

    hide: function hide() {
        $('#form_mail_setting').hide('blind');
        $('#mail_setting_show').show('fade');
        cookie_storage.set_cookie('hide_mail_setting', 1, 259200);
    },

    on_save: function on_save() {
        $('#saved_setting').show('fade');
        $('#saved_setting').delay(2000).hide('fade');
    },

    ajax_post: function ajax_post() {
        var post_data = $('#form_mail_setting').serialize();
        $.post('/msett/save/', post_data);

        mess_sett.on_save();
        return false;
    }

};

// -- Я модератор, кнопка, блок ---
var moderator = {

    init: function init() {
        $('#moder_button').click(function () {
            moderator.ajax_auth();$('#moder_block').show('fade');
        });
        $('#moder_block_close').click(function () {
            moderator.close_block();
        });
    },

    ajax_auth: function ajax_auth() {
        disabled_with_timeout($('.bun_btn_all'), 5);
        $.post('/moder/auth/', moderator.auth_resp);
    },

    ajax_promt: function ajax_promt() {
        disabled_with_timeout($('.bun_btn_all'), 5);
        $.post('/moder/promt/', moderator.auth_resp);
    },

    ajax_press: function ajax_press(id, secure, expire, mark) {
        disabled_with_timeout($('.bun_btn_all'), 5);
        $.post('/moder/press/', { id: id, secure: secure, expire: expire, mark: mark }, moderator.auth_resp);
    },

    auth_resp: function auth_resp(data) {
        if (data) {
            $('#moder_block_inner').empty();
            $('#moder_block_inner').html(data);
            moderator.new_sett();
            disabled_with_timeout($('.bun_btn_all'), 0.1);
        }
    },

    close_block: function close_block() {
        $('#moder_block').hide('fade');
    },

    new_sett: function new_sett(data) {
        $('#moder_agree').click(function () {
            moderator.ajax_promt();
        });
        $('#moder_close').click(function () {
            moderator.close_block();
        });

        var id = $('#bun_mess_id').val();
        var secure = $('#bun_mess_secure').val();
        var expire = $('#bun_mess_expire').val();
        $('#bun_ys').click(function () {
            moderator.ajax_press(id, secure, expire, 1);
        });
        $('#bun_no').click(function () {
            moderator.ajax_press(id, secure, expire, -1);
        });
        $('#bun_ig').click(function () {
            moderator.ajax_press(id, secure, expire, 0);
        });
        $('#bun_next').click(function () {
            moderator.ajax_press(0, secure, expire, 0);
        });
    }

};

// -- Предупреждение ф форме отправки сообщения ---        
var notice_post = {

    show: function show() {
        //if ($.urlParam('notice_alert')) notice_post.alert(); 
        if ($('#notice_post').text().trim().length > 5) $('#notice_post').show('clip');
    },

    alert: function alert() {
        $('#notice_post').toggleClass("notice_post notice_alert");
    }

};

// -- Большие подсказки в анкете ---     
var part_info = {

    init: function init() {
        if ($('#part_tip_block').data('name')) part_info.reset();
    },

    reset: function reset() {
        $('#part_tip_close').click(function () {
            part_info.close();return false;
        });
        $('#part_tip_block form').submit(function () {
            part_info.close();return false;
        });
    },

    close: function close() {
        var post_form = $('#form_post_mess');
        $('#part_tip_block').hide('blind');

        var name = $('#part_tip_block').data('name');
        $.post('/user/closetip/', { tip: name });
    }
};

/* -- Установка динамической отправки формы ---  
if( uid && user_sex ) $('#form_post_mess').bind('submit', function(){
 return post_mess();
});  
   
function post_mess( user,text ) { 
  if( !text ) text = $('#mess_text_val').val();
  if( !user ) user = tid;
   simple_hash();
                    
   
  $.post("/mailer/post/", {mess: text, id: user, hash: hash},  
   onAjaxSuccess );           
  
  function onAjaxSuccess(data) {       //  alert (data)     
   if( !data ) return 0;  
    var mess = JSON.parse( data );  
    if( mess.error == 'captcha' ) { 
     $('#form_post_mess').unbind('submit');
     $('#form_post_mess').submit(); }
    if( mess.saved == '1' ) {  
     load_mess( user,'reload' );
     $('#mess_text_val').val('');
      } 
    if( mess.error == 'reload' ) {     
     ft = 0; //alert ('reload')  
     $('#form_post_mess').unbind('submit');
     $('#form_post_mess').submit();            
    }                      
  }            
   return false;
}             */

// -- Быстрые сообщения, шаблоны ---
var quick_mess = {

    tab: 'public',
    more: 0,

    init: function init() {
        $('.quick_mess_tab').on('click', quick_mess.tabs_link);
        $('#mess_shab_more').on('click', quick_mess.more_link);
    },

    show: function show(num) {
        var elem = num ? $('.message_list_save', '#message_block_' + num) : $('.message_list_save');
        elem.show('fade', 100);
    },

    tabs_link: function tabs_link() {
        quick_mess.more = 0;
        quick_mess.tab = $(this).data('tab');
        quick_mess.ajax_load();
    },

    more_link: function more_link() {
        quick_mess.more++;
        quick_mess.ajax_load();
        if (quick_mess.more >= 2) {
            $('#mess_shab_more').hide();
            return false;
        }
    },

    ajax_load: function ajax_load() {
        $('#mess_shab_more').show('fade');

        var url = '/ajax/html/mess_link_shab_text_' + quick_mess.tab + quick_mess.more + '.htm';

        $.get(url, quick_mess.on_load);
        // , {hash: hash}
    },

    print: function print() {
        var text = $(this).text().trim();
        $('#mess-text-area').val(text);
        FormMess.message = text;
    },

    on_load: function on_load(data) {
        if (!quick_mess.more) $('#mess_shab_wrap').empty();

        $(data).filter('.link_shab_text').on('click', quick_mess.print).appendTo('#mess_shab_wrap');

        $('#mess_shab_text_block').show('fade');

        //mess_list.hide_loader();
    }

};

// -- Быстрые фотографии ---
var quick_photo = {

    init: function init() {
        quick_photo.ajax.load();
    },

    ajax: {

        load: function load() {
            // TODO: запустить быстрые фото. ВЫКЛЮЧЕНО !!!
            //$.get( '/ajax/load_pic.php',quick_photo.ajax.success);
        },

        success: function success(data) {
            if (data.indexOf('div') > 0) {
                $('#micro_images_hint').html(data);
                $('.img_list_micro').click(function () {
                    location.href = '/mail.php?photo=' + $(this).attr('alt') + '&id=' + tid;
                });
                $('#send_photo_link').mouseover(function () {
                    $('#micro_images_block').show('fade');
                });

                $(document).mouseup(function (e) {
                    var container = $('#micro_images_block');
                    if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                        {
                            container.hide('fade');
                        }
                });
            }
        }

    }
};
