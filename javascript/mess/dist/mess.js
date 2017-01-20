   
$( document ).ready(function() 
{    
    // Получение GET параметров по имени
    $.urlParam = function(name){
      var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results[1] || 0;
    }  
                       
    cont_list.init();       
    mess_list.init();           
  
    lock_user.init();             
    confirm_block_dn.init();
    form_public.init();
    abuse_list.init(); 
                             
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



var abuse_list_component = new Vue({
    el: '#abuse-list-component',
    data: {
        abuseStatus:   0,
        isFormShow:    1,
        isEditorShow:  0,
        isSuggestShow: 1,
        isListShow:    0,
        isButtonShow:  0,
    },
    methods: {
        showForm: function (event) {
            this.isFormShow = !this.isFormShow;
        },
        hideForm: function (event) {
            this.isFormShow = false;
            this.isButtonShow = false;
        },
        showList: function (event) {
            this.isListShow = !this.isListShow;
        },
        showButton: function (event) {
            if (!this.isFormShow) {
                this.isButtonShow = !this.isButtonShow;
            } else {
                this.hideForm();
            }
        },
        choiceText: function (event) {
            this.isEditorShow = true;
            this.isSuggestShow = false;
        },
    }
});

// -- Список жалоб на пользователя ---
var abuse_list = {     
 
    is_load: null,  // abuse_is_load
    
    init: function () 
    {          
       //$('#abuse_button_show_link span').click( function (){ form_public.show_form(); });
       //$('#abuse_list_show_link').click( function (){ abuse_list.show_list();  }); 
                                        
       $('#abuse_button_post').click( function (){ form_public.abuse_post(); });
       $('#abuse_captcha_post').click( function (){ form_public.abuse_post(); });
       
       abuse_list.ajax_load();
                             
    },             
 
    ajax_load: function () 
    {      
        $.get( '/ajax/post_abuse.php',{ id: tid }, abuse_list.on_load); 
    } , 
     
    on_load: function (data) 
    {     
         abuse_list.is_load = 1;  // cache/public/user_abuse/abuse_'+tid+'.html   
         abuse_list.set_count();
           
         if( data.indexOf('div') > 0 )
         {  
             $('#abuse_list').html( data );                            
             $('.abuse_list_line').click( function ()
             {
                 $('i',this).show('fade') ;   
                 $.post( '/ajax/post_abuse.php',{ id: tid, agree: $(this).data('number') } ); 
                 $(this).unbind('click'); 
             });
                  
             abuse_list.set_count(); 
         }    
         
    } ,
 
    red_link: function (lock) 
    {   
        if (lock) 
        {
            $('#abuse_list_show_link').addClass('red_link');
        }
        else
            $('#abuse_list_show_link').removeClass('red_link');   
    },
 
    get_count: function () 
    {   
        return $('.abuse_list_line').length ;   
    },
 
    set_count: function (count) 
    {   
        if (abuse_list.get_count()) 
        {    
            $('#abuse_list_show_link').text('Есть замечания ('+ abuse_list.get_count() +')'); 
            abuse_list.red_link(1);
        }
        else
        {   
            $('#abuse_list_show_link').text('Замечаний нет'); 
            abuse_list.red_link(0);
         
        }    
    },
 
    show_list: function () 
    {   
        if (!$('#abuse_list').is(':visible')) 
        {                                
            $('#abuse_list').show('blind'); 
            form_public.public_button(1);   
        } 
        else 
        {                                
            $('#abuse_list').hide('blind');
            form_public.public_button(0); 
            form_public.hide_form(); 
        } 
    },    
 
    status_link: function (show) 
    {             
        if (show) 
        {        
            $('#abuse_list_show_link').show('blind'); 
        } 
        else
        {      
            $('#abuse_list_show_link').hide('blind'); 
        }         
    }    
    
        
     
}



var add_contact = { 
 
    sync_taglist: 0,
  
    init: function () {              
        $('.add_contact').on('click',add_contact.action.add);                           
    },    
    ajax: {   
        add: function (tag) {                     // alert(tag);        
            $.post('/tag/contact/', { tag: tag });                   
        }           
    },        
    action: {  
        add: function () {                                
            $('.add_contact').removeClass('active');   
            $(this).addClass('active');            
            add_contact.ajax.add($(this).data('tag'));  
        }                                       
    }     
}          


        
// -- Подстановка дополнительной информации в отправку сообщения ---
var added_info = {    
        
    init: function () 
    {     
        if (user_sex && (!user_name || !user_age || !user_city))
        {   
            $('#form_post_mess').append('<div id="added_info_block"></div>');//{ hash: 15234 }, 
            $('#added_info_block').load('/static/htm/added_info.html #added_load', added_info.onload); 
        } 
                                             
    } , 
    
    onload: function () 
    {              
        var post_form = $('#form_post_mess');                  
        $('#added_info_btn').click( function (){ added_info.show(); }); 
        
        added_info.generate(); 
        added_info.visible(); 
        name_suggest.init();   // [!!!]
    } ,  
    
    generate: function () 
    {                                
        var print_age  = user_age  ? user_age  : auto_gen.age(human_age);
        var print_name = user_name ? user_name : auto_gen.name(user_sex);
        var print_city = user_city ? user_city : human_city;   
                          
        $('#added_name').val(print_name);
        $('#added_city').val(print_city);
        $('#added_age').val(print_age);  
    } ,  
    
    visible: function () 
    {                                                  
        added_info.generate();  
        $('#added_info_btn').show();
    } ,
     
    show: function () 
    {                                                      
        $('#added_info_btn').hide('blind');                  
        $('#added_info').show('blind'); 
        
    }  

}


 
// -- Анкетные данные --        
var anketa = {
    
    init: function () 
    {       
        $('#anketa_collaps_link').on('click', anketa.action.second_info.toggle); 
    },
    
    action: 
    {                               
        second_info: 
        {   
            toggle: function () 
            {                                          
                if ($('#anketa_second_info').is(':visible')) {
                    anketa.action.second_info.hide()
                } else {
                    anketa.action.second_info.show()
                }    
            },
            
            show: function () 
            {                                          
                $('#anketa_second_info').show('blind');  
                anketa.option.collaps.up();    
            },
            
            hide: function () 
            {                                      
                $('#anketa_second_info').hide('blind');      
                anketa.option.collaps.down();
            }  
        }    
    } ,
    
    option: 
    {                               
        collaps: 
        {
            up: function () 
            {      
                $('#anketa_collaps_link').text('Свернуть анкету');   
            },
            
            down: function () 
            {                                               
                $('#anketa_collaps_link').text('Развернуть анкету'); 
            }  
        } 
    } 
    
}



// -- Нижний блок Уведомлений ---
var confirm_block_dn = {

    init: function () 
    {     
        $('#confirm_block_dn').click( function () 
        {
            confirm_block_dn.hide_block(); 
        }); 
    },
  
    show_block: function () 
    {     
        $('#confirm_block_dn').show('blind'); 
    }, 
 
    hide_block: function () 
    {     
        $('#confirm_block_dn').hide('blind'); 
    },

    set_text: function (text) 
    {      
        $('#confirm_block_dn').html(text); 
    },  

    show_confirm: function (text) 
    {  
        confirm_block_dn.set_text(text);
        confirm_block_dn.show_block(); 
    } 
   
   
}   



// -- Список контактов ---
var cont_list = {
                   
    acttab: 'inline', 
    count: 0,    
    clear: 1,     
    inlist: 0,    
    buffer: [],
    
    init: function () 
    {         
        $('#contact_update').on('click',cont_list.action.update);
        $('#list_load_next').on('click',cont_list.action.next);
        $('#list_show_optn').on('click',cont_list.option.delets.show);
                                                                   
        $('#list_load_inline').on('click',cont_list.action.tab.inline);
        $('#list_load_online').on('click',cont_list.action.tab.online);
        $('#list_load_faline').on('click',cont_list.action.tab.faline);
        $('#list_load_deline').on('click',cont_list.action.tab.deline);
         
        cont_list.ajax.load(); 
    } , 
    
    ajax: {   
    
        load: function () 
        {                           
            $.get( '/contact/list/'+ cont_list.acttab +'/', { inlist: cont_list.count }, cont_list.ajax.success) 
             .fail(cont_list.ajax.error); 
        } ,  
    
        success: function (data) 
        {    
            var mess = [];          
            if (data) {
                mess = JSON.parse(data); 
            }
                 
               
            cont_list.inlist = $('#list_contact_block .message_listbox_link').length;
             
            if (cont_list.clear)                             
                cont_list.action.clear(); 
                                                            
            if (cont_list.count) {                              //  alert(cont_list.buffer.length)           
                $.each(cont_list.buffer, cont_list.action.new_line);
                cont_list.buffer.length = 0;
                if(mess.length)       
                    $.each(mess, cont_list.action.buff_cont);
            } else {
                $.each(mess, cont_list.action.new_line);
            }
                  
            cont_list.count = $('#list_contact_block .message_listbox_link').length;                                    
            if (cont_list.count > 2) 
                $('#tip_list_users_block').hide('blind');
                                                          
            cookie_storage.set_cookie('list_count',cont_list.count,259200);      
            cont_list.action.show();
            cont_list.clear = 1;   
        } , 
    
        error: function () 
        {  
            setTimeout(cont_list.ajax.load,7000);  
        } , 
    
        del_user: function (id) 
        {                                           
            $.post("/human/delete/",{ tid: id });  
        } , 
    
        rec_user: function (id) 
        {  
            $.post( "/human/unlock/", { tid: id } );  
        } , 
    
        favorite: function (id) 
        {  
            $.post( "/human/favorite/", { tid: id } );  
        } , 
    
        general: function (id) 
        {  
            $.post( "/human/general/", { tid: id } );  
        }      
          
    } ,
 
    action: {
    
        show: function () 
        {          
            $('#list_contact_block').show('blind');       
        } ,
    
        favorite: function (id) 
        {                                            
            if ($('#listbox_line_'+id).data('fav')*1) {    
                cont_list.option.favorite.passive(id);   
                cont_list.ajax.general(id); 
            } else {                                     
                cont_list.option.favorite.active(id);
                cont_list.ajax.favorite(id);
            } 
        } ,
    
        delete_user: function (id) 
        {                                              
            $('#listbox_line_'+id +' .message_listbox_link').hide('blind');   
            $('#listbox_line_'+id +' .listbox_recover').show('blind'); 
            cont_list.option.updater.show();  
            cont_list.ajax.del_user(id); 
        } ,
    
        recover_user: function (id) 
        {                                               
            $('#listbox_line_'+id+' .message_listbox_link').show('blind');   
            $('#listbox_line_'+id+' .listbox_recover').hide('blind'); 
            cont_list.ajax.rec_user(id); 
        } ,
        
        clear: function () 
        {          
            $('#list_contact_block').empty(); 
            cont_list.buffer.length = 0;  
        } ,
        
        update: function () 
        {                    
            cont_list.count = 0;    
            cont_list.ajax.load(); 
            cont_list.option.refresh();        
        } ,
        
        next: function () 
        {                         
            cont_list.clear = 0;  
            cont_list.ajax.load();
            cont_list.option.refresh();        
        } ,
          
        buff_cont: function (i,val) 
        {                                         // alert(val.name); 
            cont_list.buffer.push(val);  
        } ,
        
        new_line: function (i,val) 
        {                                                
            if (i >= 5) {     
                cont_list.action.buff_cont(i,val);
                return 0;
            }
          
            var new_block = $('#listbox_line_ex').clone()
             .attr('id', 'listbox_line_'+val.cont_id)  //.css("display","none") 
             .click( function(){  location.href = '/'+val.cont_id;  } )   
             .data('num', val.cont_id)    
             .data('fav', val.favorite)         
             .appendTo("#list_contact_block")           
                                                        // alert ( val.style );  
            $('.icon_list',new_block).addClass(val.style);
            $('.user_name',new_block).text(val.name); 
             
                $('.cont_list_fav_user',new_block).click( function(){   
                  cont_list.action.favorite(val.cont_id);  return false; } ); 
                $('.cont_list_del_user',new_block).click( function(){ 
                  cont_list.action.delete_user(val.cont_id);  return false; } ); 
                $('.listbox_recover',new_block).click( function(){ 
                  cont_list.action.recover_user(val.cont_id);  return false; } );   
            
            if (cont_list.acttab == 'deline') {
                $('.cont_list_fav_user',new_block).remove();
                $('.cont_list_del_user',new_block).remove();
            }
            
            
            if (val.favorite*1)  
                cont_list.option.favorite.active(val.cont_id); 
            
            cont_list.option.updater.hide();  
              
            if (val.photo) 
            { 
                $('img',new_block).get(0).src = val.photo ;    
                $('img',new_block).show('fade');   
            } 
            if (val.unread*1) 
            { 
                $('.unread_count',new_block).text('('+val.unread+')') ;    
            }           
        } ,
        
        tab: {    
         
            show: function (tab) {    
                if (tab != cont_list.acttab) {
                     cont_list.acttab = tab;    
                     cont_list.count  = 0;    
                     cont_list.ajax.load();  
                }                       
                cont_list.option.refresh(); 
                cont_list.action.tab.active();   
            } , 
         
            active: function () {           
                $('.listbox_tab').removeClass('active');
                $('#list_load_'+ cont_list.acttab).addClass('active');  
            } ,   
         
            inline: function () { 
                cont_list.action.tab.show('inline');  
            } ,  
         
            faline: function () {    
                cont_list.action.tab.show('faline');   
            } , 
         
            deline: function () {           
                cont_list.action.tab.show('deline');  
            } , 
         
            addition: function () {           
                  
            }  
        }    
        
    } ,
 
    option: {  
         
        refresh: function () {     
            cont_list.option.updater.hide();
            cont_list.option.delets.hide();   
            cont_list.option.favorite.show();
        } ,
         
        updater: {  
            
            show: function () 
            {          
                $('#contact_update').show('fade');       
            } , 
            
            hide: function () 
            {          
                $('#contact_update').hide('fade');       
            }   
        } ,
         
        delets: {  
            
            show: function () 
            {                  
                $('.cont_list_del_user').toggle('fade'); 
                $('.cont_list_fav_user').toggle('fade');       
            } , 
            
            hide: function () 
            {          
                $('.cont_list_del_user.touch_option').hide('fade');       
            }   
        } ,
         
        favorite: {  
            
            active: function (id) 
            {         
                $('#listbox_line_'+id +' .cont_list_fav_user i').addClass('favorite');
                $('#listbox_line_'+id).data('fav',1);       
            } , 
            
            passive: function (id) 
            {         
                $('#listbox_line_'+id +' .cont_list_fav_user i').removeClass('favorite'); 
                $('#listbox_line_'+id).data('fav',0);      
            } ,
            
            show: function () 
            {         
                $('.cont_list_fav_user').show('fade');       
            } , 
            
            hide: function () 
            {       
                $('.cont_list_fav_user').hide('fade');       
            }   
        } 
     
    } 
} 


 
// -- Время свиданий ---
var dating_time = {
     
    init: function () 
    {                            
        dating_time.show();
        dating_time.load();
    } ,
    
    show: function () 
    {                        
        if (online < 777) 
        {           
            $('#button_videochat').show();
        } 
        else 
        if (online < 500000 && dating != '00:00') 
        {    
            $('#user_dating_time').text(dating);
            $('#user_dating_time_block').show();
        }  
    } ,  
    
    load: function () 
    {    
        if( uid ) 
        {    
            $('#dating_time_post_button').on('click',dating_time.ajax.save);
         
            var dating_hour = cookie_storage.get_cookie('dating_hour');    
            if (dating_hour)     
                $("#dating_hour :contains('"+dating_hour+"')").attr("selected", "selected");
                
            var dating_minut = cookie_storage.get_cookie('dating_minut') ;  
            if (dating_minut)
                $("#dating_minut :contains('"+dating_minut+"')").attr("selected", "selected"); 
        }  
        else
            $('#set_dating_time input').prop("disabled",true);  
    
    } , 
    
    ajax: { 
    
        save: function () 
        {      
            var time_str = $('#dating_hour').val().trim() + ':' +  $('#dating_minut').val().trim() ; 
            $.get('/ajax/post_abuse.php',{dating_time: time_str, hash: hash},dating_time.ajax.success); 
        } ,    
    
        success: function (data) 
        {   
            cookie_storage.set_cookie('dating_hour', $('#dating_hour').val(), 259200);
            cookie_storage.set_cookie('dating_minut',$('#dating_minut').val(),259200); 
            $('#saved_dating').show('fade');
            $('#saved_dating').delay(2000).hide('fade'); 
        } 
    }  
}      


       
// -- Изменение информации о контакте ---        
var edit_cont = {
      
    init: function () 
    {       
        $('#edit_cont_btn').click( function (){ edit_cont.show(); }); 
        $('#edit_human_btn').click( function (){ edit_cont.save(); }); 
                                             
    } , 
    
    show: function () 
    {                                                       
        var print_name = human_name ? human_name : auto_gen.name(human_sex);
        
        if ($('#human_print_name').text().search(/(Парень|Девушка)/) < 0)
            print_name = $('#human_print_name').text(); 
                          
        $('#edit_human_name').val(print_name); 
           
        if (!$('human_data_block').is('#edit_cont_elem'))
            $('#human_data_block').append($('#edit_cont_elem'));
            
        $('#edit_cont_elem').toggle('blind');
        $('#human_data_print').toggle('blind');      //alert (123);
    } , 
    
    save: function () 
    {                     
        human_name = $('#edit_human_name').val(); 
          
        edit_cont.update();
        edit_cont.show();
        edit_cont.send(); 
              
    } ,  
    
    send: function () 
    {   
        $.post( '/contact/extra/', { tid: tid, age: '', name: human_name, city: '' } );  
        cont_list.option.updater.show();     
    } ,
    
    update: function () 
    {                           
        $('#human_print_name').text(human_name); 
    }  
      
} 



// -- Форма отправки сообщения ---
var form_mess = {
 
    show_form: function () {     
        $('#message_post_form').show('blind'); 
    }, 
 
    hide_form: function () {     
        $('#message_post_form').hide('blind'); 
    }    
 
}


             
// -- Замечания, форма публикации ---
var form_public = { 

    init: function () 
    {      
        $('#link_lock_abuse').click( function (){  
            form_public.show_form(); 
            form_mess.hide_form();
        });
 
        $('#link_abuse_cancel').click( function (){   
            form_public.hide_form(); 
            form_mess.show_form();
            confirm_block_dn.hide_block();
            form_public.red_button(0); 
        });
    } ,
     
    show_form: function () 
    {     
        $('#mail_abuse_public_block').show('blind');  
        mess_list.option.bunn_all(1);
    } , 
 
    hide_form: function () 
    {     
        $('#mail_abuse_public_block').hide('blind');  
        mess_list.option.bunn_all(0);
    },
    
    ajax_send: function () 
    {     
        simple_hash(); 
      
        $.post
        (
            "/ajax/post_abuse.php",
             
            {
                abuse: form_public.get_text(), 
                id: tid, 
                captcha: form_public.captcha_text, 
                hash: hash
            },  
 
            form_public.ajax_resp   
        ); 
    }, 
    
    abuse_post: function () 
    {   
        if (!form_public.get_text())             
          return 0; 
                     
        form_public.ajax_send();                
        disabled_with_timeout( $('#abuse_button_post'), 10);  
      
    },
       
    ajax_resp: function (data) 
    {                        
        confirm_block_dn.hide_block(); 
 
        if( !data ) return 0;  
        
        var mess = JSON.parse( data ); 
        
        if( mess.error == 'captcha' ) { 
            form_public.captcha_show();
        }   
        if( mess.saved == '1' ) { 
            form_public.clear_text(); 
            $('#link_abuse_cancel').click(); /* [!!!] [!!!] [!!!] */
            confirm_block_dn.show_confirm(mess.text); 
        }  
        if( mess.error == 'message' ) { 
            confirm_block_dn.show_confirm(mess.text); 
        }   
         
        disabled_with_timeout( $('#abuse_button_post'), 0.1); 
    },
    
    captcha_show: function () 
    {              
        $('#strong_captcha_block_abuse').show('blind');   
        $('#strong_captcha_block_abuse img').attr('src', '/img/kcaptcha/index.php?'+hash); 
        
    }, 
    
    captcha_text: function () 
    {              
        return $('#abuse_code_val').val(); 
    },
    
    clear_text: function () 
    {             
        $('#abuse_text_val').val('');  
    },
    
    get_text: function () 
    {             
        return $('#abuse_text_val').val();  
    },    
 
    public_button: function (show) 
    {             
        if (show) 
        {      
            $('#abuse_button_show_link').show('blind');    
        } 
        else
        { 
            $('#abuse_button_show_link').hide('blind'); 
        }         
    },    
 
    red_button: function (show) 
    {             
        if (show) 
        {     
            abuse_list.status_link(0);
            form_public.public_button(1);
            $('#abuse_button_show_link span').addClass('red_link');   
        } 
        else
        {
            abuse_list.status_link(1);     
            form_public.public_button(0);
            $('#abuse_button_show_link span').removeClass('red_link'); 
        }         
    }      
 
}


 
// -- Блокировка пользователя ---  
var lock_user = {

    init: function () 
    { 
        lock_user.set_lock();  
        $('#unlock_inform_block').click( function () { $(this).hide('blind'); } ); 
    },

    
    set_lock: function () 
    {                                            /* */
        $('#lock_user_link').unbind('click');     
        $('#lock_user_link').click( function ()
        {   
            lock_user.post_lock();
        });                          
        lock_user.red_link(0); 
        mess_list.option.bunn_all(0);      
        lock_user.link_text('Заблокировать');    
    },

    
    set_unlock: function () 
    {    
        $('#lock_user_link').unbind('click');
        $('#lock_user_link').click( function ()
        {   
            lock_user.post_unlock();
        });                     
        lock_user.red_link(1);
        mess_list.option.bunn_all(1);      
        lock_user.link_text('Разблокировать');               
    },
  
    show_link: function () 
    {     
        $('#lock_user_link').show('fade');  
    }, 
 
    hide_link: function () 
    {     
        $('#lock_user_link').hide('fade');   
    },
    
    ajax_send: function (lock) 
    {     
        simple_hash(); 
        
        var action = lock ? 'lock' : 'unlock';
      
        $.post
        (
            '/human/' + action + '/',
             
            {  
                tid: tid,  
                hash: hash
            }   
        ); 
    },
 
    post_lock: function () 
    {                              
        lock_user.inform_lock();
        lock_user.set_unlock();
        lock_user.ajax_send(1);   
    },
 
    post_unlock: function () 
    {                                   
        lock_user.inform_unlock();
        lock_user.set_lock();
        lock_user.ajax_send(0);   
    },
 
    red_link: function (lock) 
    {   
        if (lock) 
        {
            $('#lock_user_link').addClass('red_link');
        }
        else
            $('#lock_user_link').removeClass('red_link');   
    },
 
    link_text: function (text) 
    {     
        $('#lock_user_link').text(text);   
    },
  
    inform_lock: function () 
    {                                
        $('#unlock_inform_block').hide('blind');
        $('#lock_inform_block').show('blind');  
    },
  
    inform_unlock: function () 
    {                               
        $('#lock_inform_block').hide('blind');
        $('#unlock_inform_block').show('blind');  
    }  

}


  
// -- Список сообщений ---
var mess_list = {   
    
    mess_is_load: 0, 

     
    mail_pages: 0,  
    view_confirm: 0,
   
    init: function () 
    {                        
        mess_list.ajax_load(tid);  
        $('#mail_pages_next').click( function (){ mess_list.ajax_load(tid); } );
    } ,                          
    
    list_init: function () 
    {          
        $('.message_list_block').hover(
            function () {
              mess_list.option.show($('.bunned_mess',this).data('number')) ;
              mess_list.option.enable = false;
            },
            function () {  
              if (mess_list.option.frize)
                  return false;
                
              mess_list.option.hide($('.bunned_mess',this).data('number')) ;
              mess_list.option.enable = true;
            }   
        );
         
        $('.message_list_block').click(function() { 
            if (mess_list.option.enable && !mess_list.option.frize) 
                mess_list.option.togg($('.bunned_mess',this).data('number')) ;
            
        });

        mess_list.option.pages_show();
        $('.message_list_save.red_link').show(); // Показать опции первого сообщения                            //////////////////////////////////
    
        
    } ,
              
    ajax_load: function (user) 
    {                        
        $.get
        (
            '/ajax/messages_load.php', 
            { 
                id: user, 
                next: mess_list.mail_pages, 
                confirm_view: mess_list.view_confirm 
            } , 
            mess_list.on_load
        )
        .fail(mess_list.on_error);
    
    } , 
             
      
    on_load: function (data) 
    {                      
        mess_list.view_confirm = 0;
        mess_list.mess_is_load = 1;
        mess_list.mail_pages  += 15; 
                                            
        //if( reload ) 
        //   mess_list.mail_pages = 0;
    
        mess_list.hide_loader(); 
                                   
        if (data.indexOf('div') > 0) 
        {  
            //if( reload ) 
            //    $('#mail_messages_block').empty();
                    
            lock_user.show_link();  
            $('#mail_messages_block').append( data );  
                       
            mess_list.list_init(); 
            
            mess_list.option.pages_show();  
                        
            $('#mail_messages_block').show('blind');     
            
            var first_mess =  $('.message_list_save:first').data('number');
            var mess_id = $(this).data('number');    
                                            
            $('.bunned_mess').on('click',function() { mess_list.action.bun_mess($(this).data('number')); }); 
            $('.remove_mess').on('click',function (){ mess_list.action.remove_mess($(this).data('number')); });
            $('.img_reload').on('click',function () { mess_list.action.image_reload($(this).data('number')); }); 
             
            return 0; 
        }
 
        if( !data ) 
        {                          // alert ( $('.message_list_block').length );
            if (!$('.message_list_block').length) 
            {      
                quick_mess.ajax_load(); 
                notice_post.show(); 
            }
            $('#mail_pages_next').hide('blind');  
            return 0;
        }
        
        if( data.indexOf('error') > 0 ) 
        {  
            var mess = JSON.parse( data );    
            if( mess.error == 'hold' ) 
            {                                                    
                mess_list.action.show_bad_alert( mess.text ); 
                return 0; 
            } 
        }       
       
    } ,                            
    
    on_error: function () 
    {           
        setTimeout( function (){ mess_list.ajax_load(tid); },7000 );    
        mess_list.show_loader(1);                              //////////////////////////////////
    } ,
    
       
    show_loader: function (img) 
    {           
       $('#mess_loader').show('blind');   
       if (img)
           $('#mess_loader img').show('fade'); 
    } ,
    
    hide_loader: function () 
    {                              
       $('#mess_loader').hide();    
    } ,
 
    action: {
     
        badshow: function () 
        {                             // alert(1);
            mess_list.view_confirm = 1; 
            mess_list.mail_pages = 0; 
            
            mess_list.ajax_load(tid);     
            
            mess_list.show_loader(1); 
            mess_list.action.badalert_hide(); 
        } , 
                                      
     
        show_bad_alert: function (text) 
        {       
            mess_list.hide_loader();       
            $('#mail_bad_text_alert input').on('click',mess_list.action.badshow);
            $('#mail_bad_text_alert .link_underline').hide(); //on('click',function(){cont_list.action.delete_user(tid);});  
            $('#mail_bad_text_alert span.text').text( text );    
            $('#mail_bad_text_alert').show('fade');  
        } ,   
          
        
        image_reload: function (id)  
        {       
            var url = $( '#img_'+ id ).get(0).src.replace("/protect/","/origin/") ;  
            $( '#img_'+ id ).get(0).src = url ; 
        } ,   
         
        ajax_recove: function (mess_id) 
        {                   
            $.post("/mess/recover/", { tid: tid, id: mess_id }); 
        } , 
         
        ajax_remove: function (mess_id) 
        {                   
            $.post("/mess/delete/", { tid: tid, id: mess_id }); 
        } , 
         
        ajax_bun: function (mess_id) 
        {             
            $.post("/mess/bun/", { tid: tid, id: mess_id } );  
        } , 
         
        badalert_hide: function () 
        {    
            $('#mail_bad_text_alert').hide('blind');
        } , 
         
        mess_hide: function (mess_id) 
        {    
            $('#message_block_'+mess_id).hide('blind');
        } , 
         
        mess_show: function (mess_id) 
        {    
            $('#message_block_'+mess_id).show('blind');
        } , 
         
        remove_mess: function (mess_id) 
        {                      
            mess_list.action.ajax_remove(mess_id); 
            mess_list.action.removed_show(mess_id); 
            mess_list.action.mess_hide(mess_id);
        } ,
         
        bun_mess: function (mess_id) 
        {    
            mess_list.action.ajax_bun(mess_id); 
            mess_list.action.removed_show(mess_id);  
            mess_list.action.mess_hide(mess_id);  
            form_public.red_button(1); 
        } ,
         
        recove_mess: function (mess_id) 
        {    
            mess_list.action.ajax_recove(mess_id);     
            mess_list.action.removed_hide(mess_id); 
            mess_list.action.mess_show(mess_id);    
        } , 
         
        removed_hide: function (mess_id) 
        { 
            $('#remove_message_'+mess_id).hide('blind');
        } , 
         
        removed_show: function (mess_id) 
        {    
            if (!$('div').is('#remove_message_'+mess_id))
            {    
                var new_remove = $('#recover_mess_block_ex').clone()
                 .attr( 'id', 'remove_message_'+mess_id ).css("display","none")  
                 .insertBefore($('#message_block_'+mess_id));     
                $('span',new_remove).on('click',function () { mess_list.action.recove_mess(mess_id); }); 
            }    
              
            $('#remove_message_'+mess_id).show('blind');   
        } 
     
    } ,   
     
    option:  {   
       
        enable: true,
        frize: false,  
    
        pages_show: function () 
        { 
             if ($('.message_list_block').length > 14)
             {
                 $('#mail_pages').show('blind');
                 mess_list.option.hint(0); 
             }
             else
                 mess_list.option.hint(1);                
        } ,
   
        hint: function (show) 
        {  
            if (show) 
            { 
                $('#mess_option_hint').show(); 
            }
            else
                $('#mess_option_hint').hide(); 
        } ,
   
        bunn_all: function (lock) 
        { 
            if (lock) 
            {     
                mess_list.option.red_link(lock,0); 
                mess_list.option.frize = true;
                mess_list.option.show(); 
            }
            else
            { 
                mess_list.option.red_link(lock,0);
                mess_list.option.frize = false;
                mess_list.option.hide();
            } 
        } ,
 
        red_link: function (lock,num) 
        {   
            var elem = num ? $('.bunned_mess','#message_block_'+num) : $('.bunned_mess');
            
            if (lock) 
            {
                elem.addClass('red_link');
            }
            else
                elem.removeClass('red_link');   
        } ,
   
        togg: function (num) 
        {     
            $('.message_list_save','#message_block_'+num).toggle('fade') ; 
        } ,
   
        hide: function (num) 
        {  
            var elem = num ? $('.message_list_save','#message_block_'+num) : $('.message_list_save');
            elem.hide(); 
        } ,
     
        show: function (num) 
        { 
            var elem = num ? $('.message_list_save','#message_block_'+num) : $('.message_list_save');
            elem.show('fade',100);  
        }
    } 
    
}    



// -- Настройки почты, поиска ---  
var mess_sett = {
       
    init: function () 
    {       
        $('#post_mail_setting').on('click',mess_sett.ajax_post); 
        mess_sett.print(cookie_storage.get_data('mail_sett'));
                                         
        $('#mail_setting_hide').on('click',mess_sett.hide);  
        $('#mail_setting_show').on('click',mess_sett.show);
           
    } , 
    
    print: function (sett) 
    {                          
        if (!sett.who)
        {
            $("#opt_who").val(0)
        }
        else
            $("#opt_who").val(sett.who)
        
        if (sett.town*1)
            $("#opt_town").attr("checked","checked");
            
        if (sett.virt*1)   
            $("#opt_virt").attr("checked","checked");
 
        if (sett.up > 0) 
            $("#opt_up").val(sett.up);

        if (sett.to > 0)
            $("#opt_to").val(sett.to);  
                              
    } ,                                     
                                                
    /* -- Скрыть/показать настройки --- */  
    show: function () 
    {                   
      $('#form_mail_setting').show('blind'); 
      $('#mail_setting_show').hide('fade');   
       cookie_storage.del_cookie('hide_mail_setting');
         
    } , 
    
    hide: function () 
    {                    
        $('#form_mail_setting').hide('blind');
        $('#mail_setting_show').show('fade');
        cookie_storage.set_cookie('hide_mail_setting', 1, 259200);  
    } , 
    
    on_save: function () 
    {           
        $('#saved_setting').show('fade');
        $('#saved_setting').delay(2000).hide('fade');
    } , 
    
    ajax_post: function () 
    {        
        var post_data = $('#form_mail_setting').serialize();
        $.post('/msett/save/', post_data);
         
        mess_sett.on_save(); 
        return false;
    } ,    
   
    
 
 
}
  


// -- Я модератор, кнопка, блок ---      
var moderator = {
         
    init: function () 
    {                                            
       $('#moder_button').click( function (){ moderator.ajax_auth();  $('#moder_block').show('fade'); }); 
       $('#moder_block_close').click( function (){ moderator.close_block();  });  
          
    },    
    
    ajax_auth: function () 
    {                                               
        disabled_with_timeout( $('.bun_btn_all'), 5);
        $.post('/moder/auth/',moderator.auth_resp); 
    },    
    
    ajax_promt: function () 
    {           
        disabled_with_timeout( $('.bun_btn_all'), 5);
        $.post('/moder/promt/',moderator.auth_resp); 
    },     
    
    ajax_press: function (id,mark) 
    {                                                                         
        disabled_with_timeout( $('.bun_btn_all'), 5); 
        $.post('/moder/press/', { id: id, mark: mark }, moderator.auth_resp); 
    },
    
    auth_resp: function (data) 
    {      
        if (data) 
        {                                    
            $('#moder_block_inner').empty();
            $('#moder_block_inner').html(data); 
            moderator.new_sett();  
            disabled_with_timeout( $('.bun_btn_all'), 0.1);  
        }
         
    },
    
    close_block: function () 
    {       
        $('#moder_block').hide('fade');
         
    },
    
    new_sett: function (data) 
    {                               
        $('#moder_agree').click( function (){ moderator.ajax_promt(); });
        $('#moder_close').click( function (){ moderator.close_block(); });
         
        var mess_id = $('#bun_mess_id').val();   
        $('#bun_ys').click( function (){
          moderator.ajax_press(mess_id,1); 
        });
        $('#bun_no').click( function (){
          moderator.ajax_press(mess_id,-1);  
        });
        $('#bun_ig').click( function (){
          moderator.ajax_press(mess_id,0);  
        });
        $('#bun_next').click( function (){
          moderator.ajax_press(0,0);  
        }); 



  
       
       
       
    }
 
 
              

}       


          
// -- Предупреждение ф форме отправки сообщения ---        
var notice_post = {
      
    show: function () 
    {       
        //if ($.urlParam('notice_alert')) notice_post.alert(); 
        if ($('#notice_post').text().trim().length > 5) 
            $('#notice_post').show('clip'); 
    }, 
    
    alert: function () 
    {       
        $('#notice_post').toggleClass("notice_post notice_alert"); 
    } 
      
} 



// -- Большие подсказки в анкете ---     
var part_info = {    
        
    init: function () 
    {   
        if ($('#part_tip_block').data('name')) 
            part_info.reset();                                 
    } , 
    
    reset: function () 
    {                              
        $('#part_tip_close').click( function (){ part_info.close(); return false; }); 
        $('#part_tip_block form').submit( function (){ part_info.close(); return false; });  
    } , 
    
    close: function () 
    {                                            
        var post_form = $('#form_post_mess');                  
        $('#part_tip_block').hide('blind'); 
        
        var name = $('#part_tip_block').data('name');  
        $.post( '/user/closetip/', { tip: name }); 
    } 
}


   
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
   
    init: function () {  
        $('.quick_mess_tab').on('click',quick_mess.tabs_link); 
        $('#mess_shab_more').on('click',quick_mess.more_link);
    } ,

    show: function (num) 
    { 
        var elem = num ? $('.message_list_save','#message_block_'+num) : $('.message_list_save');
        elem.show('fade',100);  
    } ,

    tabs_link: function () 
    {         
        quick_mess.more = 0; 
        quick_mess.tab = $(this).data('tab');
        quick_mess.ajax_load();      
    } ,

    more_link: function () 
    {         
        quick_mess.more++;
        quick_mess.ajax_load();                     
        if (quick_mess.more >= 2) 
        { 
            $('#mess_shab_more').hide();
            return false; 
        }   
    } ,

    ajax_load: function () 
    {         
        $('#mess_shab_more').show('fade'); 
                             
        var url = '/ajax/html/mess_link_shab_text_'+quick_mess.tab+quick_mess.more+'.htm';
                               
        $.get(url, quick_mess.on_load);
                        // , {hash: hash}
    } ,
          
    print: function () 
    {         
        $('#mess_text_val').val( $(this).text().trim() );
    } ,
    
    on_load:  function (data)
    {                 
        if (!quick_mess.more) 
            $('#mess_shab_wrap').empty(); 

        $(data).filter('.link_shab_text') 
            .on('click',quick_mess.print)   
            .appendTo('#mess_shab_wrap');  
            
        $('#mess_shab_text_block').show('fade');
                                            
        mess_list.hide_loader(); 
                              
    }
   

}


                       
// -- Быстрые фотографии ---
var quick_photo = {
     
    init: function () 
    {         
        quick_photo.ajax.load();
    } , 
    
    ajax: {   
    
        load: function () 
        {      
            $.get( '/ajax/load_pic.php',quick_photo.ajax.success);
        } ,  
    
        success: function (data) 
        {   
            if (data.indexOf('div') > 0) 
            { 
                $('#micro_images_hint').html( data ) ; 
                $( '.img_list_micro' ).click( function () { 
                 location.href = '/mail.php?photo='+$(this).attr('alt')+'&id='+tid; 
                });                                          
                $('#send_photo_link').mouseover( function () { 
                 $('#micro_images_block').show('fade'); 
                });
                
                $(document).mouseup(function (e)
                {
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
}    

