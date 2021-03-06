
var json = {
        
    parse: function (str) 
    {
        var result = null;
        try 
        {
            result = JSON.parse(str);
        } 
        catch (e) { }
        
        return result;
    } ,
    
    encode: function (str) 
    {
        return JSON.stringify(str); 
    }       
}       
   


var cookie_storage = {
         
    enabled: 0, 

    init: function () 
    {  

    } ,

    get_cookie: function (name) 
    {       
        var results = document.cookie.match ( '(^|;) ?' + name + '=([^;]*)(;|$)' ); 
        if (results)
          return (unescape(results[2]));
        else
          return null; 
    } ,
     
    del_cookie: function (name) 
    {              
        let expires = new Date(); // получаем текущую дату 
        expires.setTime( expires.getTime() - 1000 ); 
         document.cookie = name + "=; expires=" + expires.toGMTString() +  "; path=/";  
    } ,    
    
    set_cookie: function (name, val, time) 
    {      
        let expires = new Date(); 
        expires.setTime( expires.getTime() + (1000 * 60 * time ) ); // минут
        document.cookie = name + "="+ val +"; expires=" + expires.toGMTString() +  "; path=/";
    } ,  
    
    get_data: function (name) 
    {   
        return json.parse(get_cookie(name));     
    } ,  
    
    set_data: function () 
    {  

    }  
  
  

}



function get_cookie ( cookie_name )
{
  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

  if ( results )
    return ( unescape ( results[2] ) );
  else
    return null;
}

function del_cookie ( name ) {
  let expires = new Date(); // получаем текущую дату
  expires.setTime( expires.getTime() - 1000 );
   document.cookie = name + "=; expires=" + expires.toGMTString() +  "; path=/";
}
function set_cookie ( name, val, time ) {
  let expires = new Date();
  expires.setTime( expires.getTime() + (1000 * 60 * time ) ); // минут
   document.cookie = name + "="+ val +"; expires=" + expires.toGMTString() +  "; path=/";
}



var device = {    
        
    init: function () 
    {   
                                      
    } ,

    width: function () 
    {   
        return $(window).width();                                 
    } ,

    height: function () 
    {   
        return $(window).height();  //document                               
    }  
    
        
}
  


function disabled_with_timeout(elem,time) {  
 elem.prop("disabled",true);
 setTimeout( function (){
  elem.prop("disabled",false);
 },time * 1000); 
}



// -- Получить новый хэш ---
var hash; 
function simple_hash() { 
  var now = new Date(); 
   hash = now.getTime();  
}
     
function disabled_with_timeout(elem,time) {  
 elem.prop("disabled",true);
 setTimeout( function (){
  elem.prop("disabled",false);
 },time * 1000); 
}
     


// -- Хранилище ---
var storage = {

    enable:  0,

    init: function ()
    {
        if (storage.is_enable())
        {
            storage.enable = 1;
        }

    } ,

    is_enable: function ()
    {
        try
        {
            return 'localStorage' in window && window['localStorage'] !== null;
        }
        catch (e)
        {
            return false;
        }
    } ,

    save: function (key,val)
    {
        if (storage.enable)
        {
            localStorage.setItem(key,val);
        }
    } ,

    load: function (key,def)
    {
        var result = def ? def : null;

        if (storage.enable && localStorage.getItem(key))
        {
            result = localStorage.getItem(key);
        }

        return result;
    } ,

    array: {

        load: function (key)
        {
            var result = [];
            var value = null;

            value = storage.load(key);
            value = json.parse(value);
            if (value)
                result = value;

            return result;
        } ,

        save: function (key,val)
        {
            storage.save(key,json.encode(val));
        } ,

        add: function (key,val)
        {

        }
    }
}

storage.init();


const AccountActivity = Vue.component('account-activity', {
    props: ['humanId'],
    data() {
        return {
            loading: false,
        };
    },
    computed: {
        human() {
            return this.$store.state.search.human;
        },
    },
    mounted() {
        this.load();
    },
    methods: {
        close() {
            this.$emit('close');
        },
        loaded() {
            this.loading = false;
                console.log(this.human);
        },
        hope() {
            setTimeout(() => this.loading = false, 4 * 1000);
        },
        load() {
            this.loading = true;
            this.hope();
            store.dispatch('search/HUMAN', this.humanId).then((response) => {
                this.loaded();
            }).catch((error) => {
                console.log(error);
                this.loading = false;
            });
        }
    },
    template: '#account-activity',
});


Vue.component('account-component', {
    props: ['human'],
    data() {
        return {
            loading: false,
        };
    },
    computed: {
        age() {
            return this.human.age ? moment.duration(this.human.age, "years").humanize() : null;
        },
        tags() {
            return ('tags' in this.human) ? this.human.tags : [];
        },
        social() {
            let {em, vk, ok, fb, go} = this.human;
            if (em || vk || ok || fb || go) {
                return {em, vk, ok, fb, go};
            }
            return null;
        },
        interact() {
            let {ph, sk} = this.human;
            if (ph || sk) {
                return {ph, sk};
            }
            return null;
        },
        figure() {
            var figure = this.human.anketa ? this.human.anketa.figure : null;
            var result = figure;
            switch (figure) {
                case 2: result = 'спортивного'; break;
                case 3: result = 'обычного'; break;
                case 5: result = 'полного'; break;
                case 6: result = 'худого'; break;
            }
            return result;
        },
        hold() {
            return this.ignore ? 0 : this.human.hold;
        },
        who() {
            var result = 'Парня или девушку ';
            if (this.human.who) {
                result = this.human.who == 1 ? 'Парня ' : 'Девушку ';
            }
            if (this.human.up || this.human.to) {
                result += ' в возрасте ';
                result += this.human.up ? ' от ' + this.human.up : '';
                result += this.human.to ? ' до ' + this.human.to : '';
                result += ' лет ';
            }
            return result;
        },
        ago() {
            var {last} = this.human;
            var result = 'Онлайн';
            if (last > 2592000) {
                result = null;
            } //else
            if (last > 777) {
                result = moment.duration((0 - last), "seconds").humanize(true);
            }
            return result;
        },
        search() {
            city = this.human.city ? this.human.city + '/' : '';
            if (this.human.who == 1) { who = 'Парни/'; }
             else if (this.human.who == 2) { who = 'Девушки/'; }
              else who = '';
            if (this.human.up && this.human.up == this.human.to) { years = 'возраст/'+this.human.up+'/'; } else
             if (this.human.up && this.human.to ) { years = 'возраст/'+this.human.up+'/'+this.human.to+'/'; } else
              if (this.human.up && !this.human.to) { years = 'возраст/от/'+this.human.up+'/'; } else
               if (!this.human.up && this.human.to) { years = 'возраст/до/'+this.human.to+'/'; }
                else years = '';
            return  '/' + city + who + years;;
        }
    },
    template: '#account-component',
});

const ActivityActions = {
    beforeRouteLeave(to, from, next) {
        console.log('Leave:', [to, from]);
        next();
    },
    methods: {
        close() {
            this.$emit('close');
        },
        back(back) {
            back = (back === undefined) ? this.$route.meta.back : back;
            back = (back === undefined) ? this.$route.query.back : back;
            console.log('back:', back);
            (back === undefined) ? this.$router.push('/') : this.$router.push(back);
        },
    },
}


var ClosedActivity = Vue.component('closed-activity', {
    extends: ActivityActions,
    template: '#closed-activity',
});


var DefaultActivity = Vue.component('default-activity', {
    extends: ActivityActions,
    template: '#default-activity',
});


const MessagesActivity = Vue.component('messages-activity', {
    extends: DefaultActivity,
    props: ['humanId', 'title'],
    data() {
        return {
            message: '',
            caption: '',
        reply:  '',
        code:  '',
        show: true,
        process: false,
        approve: true,
        dirt: false,
        alert: false,
            captcha: false,
            preview: false,
            photo: false,
        }
    },
    // beforeRouteUpdate(to, from, next) {
    //     this.photo = this.preview;
    //     console.log('MessagesActivity', this.photo);
    //     next();
    // },
    mounted: function () {
        if (this.title) {
            this.caption = this.title;
        }
    },
    methods: {
        reset() {
            //this.cancelPhoto();
            this.show = true;
            this.process = false;
            this.approve = true;
            this.message = '';
            this.photo = null;
        },
        isDirt: _.debounce(function() {
            let word = /\w{0,5}[хx]([хx\s\!@#\$%\^&*+-\|\/]{0,6})[уy]([уy\s\!@#\$%\^&*+-\|\/]{0,6})[ёiлeеюийя]\w{0,7}|\w{0,6}[пp]([пp\s\!@#\$%\^&*+-\|\/]{0,6})[iие]([iие\s\!@#\$%\^&*+-\|\/]{0,6})[3зс]([3зс\s\!@#\$%\^&*+-\|\/]{0,6})[дd]\w{0,10}|[сcs][уy]([уy\!@#\$%\^&*+-\|\/]{0,6})[4чkк]\w{1,3}|\w{0,4}[bб]([bб\s\!@#\$%\^&*+-\|\/]{0,6})[lл]([lл\s\!@#\$%\^&*+-\|\/]{0,6})[yя]\w{0,10}|\w{0,8}[её][bб][лске@eыиаa][наи@йвл]\w{0,8}|\w{0,4}[еe]([еe\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[uу]([uу\s\!@#\$%\^&*+-\|\/]{0,6})[н4ч]\w{0,4}|\w{0,4}[еeё]([еeё\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[нn]([нn\s\!@#\$%\^&*+-\|\/]{0,6})[уy]\w{0,4}|\w{0,4}[еe]([еe\s\!@#\$%\^&*+-\|\/]{0,6})[бb]([бb\s\!@#\$%\^&*+-\|\/]{0,6})[оoаa@]([оoаa@\s\!@#\$%\^&*+-\|\/]{0,6})[тnнt]\w{0,4}|\w{0,10}[ё]([ё\!@#\$%\^&*+-\|\/]{0,6})[б]\w{0,6}|\w{0,4}[pп]([pп\s\!@#\$%\^&*+-\|\/]{0,6})[иeеi]([иeеi\s\!@#\$%\^&*+-\|\/]{0,6})[дd]([дd\s\!@#\$%\^&*+-\|\/]{0,6})[oоаa@еeиi]([oоаa@еeиi\s\!@#\$%\^&*+-\|\/]{0,6})[рr]\w{0,12}/i;
            this.dirt = word.test(this.message) ? true : false;
            return this.dirt;
        }, 700),

        close() {
            //this.$emit('close');
            this.back();
        },
        cancel() {
            this.captcha = false;
            this.confirm = false;
            this.ignore = true;
            console.log('cancel');
        },
        select(data) {
            this.photo = data;
            this.preview = data;
        },
        sendMessage() {
            console.log(data);
            let data = {
                id: this.humanId,
                captcha_code: this.code
            };
            if (this.photo && this.photo.alias) {
                data['photo'] = this.photo.alias;
            } else
            if (true) {
                data['mess'] = this.message;
                data['re'] = this.reply;
            }
            this.$store.commit('intimate/notifi', false);
            api.messages.send(data).then(({data}) => {
                this.onMessageSend(data);
            }).catch(() => {
                this.onError();
            });
            this.preview = null;
            this.process = true;
        },
        setCode(code) {
            this.code = code;
            this.sendMessage();
        },
        onMessageSend(data) {
            if (!data.saved && data.error) {
                if (data.error == 'need_captcha') {
                    this.captcha = true;
                }
                this.onError();
            } else {
                this.sended();
            }
            this.process = false;
        },
        sended() {
            //MessList.messages.unshift(data.message);
            this.$refs.messages.reload();
            this.reset();
        },
        onError() {
            this.process = false;
        },
        account() {
            this.$router.push(this.humanId + '/detail')
        },
        uploads() {
            this.$router.push(this.humanId + '/uploads')
        },
        incoming() {
            this.$router.push(this.humanId + '/incoming')
        },
        // preview() {
        //     this.$router.push(this.humanId + '/preview')
        // },
        videochat() {
            window.open('/videochat.php?to='+this.humanId, 'videochat', 'width=432, height=280, resizable=yes, scrollbars=yes');
        }
    },
    template: '#messages-activity',
});


const ModeratorActivity = Vue.component('moderator-activity', {
    data() {
        return {
            process: false,
            promt: true,
            error: null,
            count: null,
            message: {
                id: null,
                text: ''
            },
            secure: null,
            expire: null
        };
    },
    mounted() {
        this.load();
    },
    computed: {
        human() {
            return this.$store.state.search.human;
        },
        accept() {
            return this.$store.state.accepts.moderator;
        }
    },
    methods: {
        approve() {
            this.process = true;
            api.moderator.promt().then(() => {
                this.load();
            }).catch(() => {
                this.needPromt();
                this.process = false;
            });
            this.$store.commit('accepts/moderator', 1);
        },
        load() {
            this.process = true;
            api.moderator.load().then(({data}) => {
                this.error = data.error;
                if (this.error == 'promt') {
                    this.needPromt();
                } else
                if (this.error == 'count') {

                } else
                if (this.error == 'other') {

                } else
                if (!this.error && data.message) {
                    this.loaded(data);
                }
                this.process = false;
            });
        },
        loaded(data) {
            let {count, message, expire, secure} = data;
            this.count = count;
            this.message = message;
            this.expire = expire;
            this.secure = secure;
        },
        needPromt() {
            this.$store.commit('accepts/moderator', 0);
            this.promt = false;
        },
        action(mark) {
            let data = {
                id: this.message.id,
                secure: this.secure,
                expire: this.expire,
                mark,
            };
            this.process = true;
            api.moderator.press(data).then(() => {
                this.load();
            });
        },
        close() {
            this.$emit('close');
        },
    },
    template: '#moderator-activity',
});


const SearchActivity = Vue.component('search-activity', {
    extends: DefaultActivity,
    data() {
        return {

        };
    },
    beforeRouteUpdate(to, from, next) {
        if (to.fullPath == '/search' && from.fullPath == '/search/settings/search') {
            this.$refs.results.reload();
        }
        next();
    },
    computed: {

    },
    methods: {
        close() {
            this.back();
        },
    },
    template: '#search-activity',
});


const AdTop = Vue.component('ad-top', {
    data() {
        return {
            width: 0
        }
    },
    mounted() {
        this.width = this.$el.offsetWidth;
        console.log('cc', [this.desktop, this.width]);
    },
    methods: {
        random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    },
    computed: {
        desktop() {
            return this.width >= 700
        },
        source() {
            return '/static/img/ad/ad-hm-' + this.random(0, 2) + '.gif'
        }
    },
    template: '#ad-top',
});
Vue.component('api-key-update', {
    props: [
      'item',
    ],
    data() {
        return {
            attempt: 0,
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        tick(delay) {
            setTimeout(() => {
                this.load();
            }, 1000 * delay);
        },
        reload() {
            let delay = 1;
            if (this.attempt >= 10) {
                delay = 300;
            } else
            if (this.attempt >= 5) {
                delay = 5;
            } else
            if (this.attempt >= 2) {
                delay = 3;
            }
            this.attempt++;
            this.tick(delay);
        },
        load() {
            this.$store.dispatch('auth/UPDATE_KEY').then(({data}) => {
                if (data.uid) {
                    this.upKey(data);
                } else
                if (data.reg) {
                    this.noReg(data);
                } else {
                    this.reload();
                }
            });
        },
        noReg(data) {
            // зарегистрирован / не авторизован
            this.upKey(data);
        },
        upKey(data) {
            this.$store.dispatch('LOAD_API_TOKEN');
            this.upUser(data);
            this.upSettings(data);
            this.attempt = 0;
            this.tick(600);
        },
        upUser(data) {
            let {uid, city, sex, age, name, contacts, apromt: promt} = data;
            //console.log('upUser', data);
            this.$store.commit('resetUser', {uid, city, sex, age, name, contacts, promt});
            //store.commit('loadUser', data.contacts);
        },
        upSettings(data) {
            let {who, years_up: up, years_to: to, close: town, virt} = data;
            this.$store.commit('search/settings', {who, up, to, virt, town});
        }
    },
    template: '#api-key-update'
});


Vue.component('attention-wall', {
    props: ['show', 'text'],
    data() {
        return {
            content: {
                1: {
                    caption: 'Предупреждение',
                    text: `На сообщения от этого пользователя поступают жалобы. Возможно его сообщения имеют грубый тон,
                    могут оскорбить, содержат интим фотографии, бессмысленные или резкие предложения.`
                },
                8: {
                    caption: 'Внимание',
                    text: `Действия пользователя нарушают правила. Сообщения пользователя намеренно оскорбительны,
                    имеют противоправное содержание, обман или предложение оплаты услуг.`
                }
            }
        }
    },
    computed: {
        caption() {
            return this.content[this.show].caption;
        },
        text() {
            return this.content[this.show].text;
        },
    },
    methods: {
        close() {
            this.$emit('close');
        },
        promt() {
            this.$emit('promt');
        },
    },
    template: '#attention-wall',
});



Vue.component('auth-board', {
    data() {
        return {
            confirmSend: false,
            hint: 'Введите ваш емаил.',
            process: false,
            email: ''
        }
    },
    mounted() {
        _.delay(() => {
            this.$store.dispatch('auth/SYNC').then(() => {
                this.email = this.$store.state.auth.email;
            });
        }, 2500);
    },
    computed: {
        login() {
            return this.$store.state.auth.login;
        },
        password() {
            return this.$store.state.auth.pass;
        },
        loaded() {
            return this.login && this.password;
        },
    },
    methods: {
        send() {
            if (!this.email) {
                return;
            }
            this.process = true;
            this.hint = 'Отправляю...';
            this.$store.dispatch('auth/SAVE_EMAIL', this.email).then((response) => {
                this.hint = response.data.say;
                this.error = response.data.err;
                this.sended();
            });
        },
        sended() {
            this.process = false;
            if (!this.error) {
                this.emit('close');
            }
        },
    },
    template: '#auth-board'
});

Vue.component('captcha-dialog', {
    data() {
        return {
            code: '',
            inc: 0
        }
    },
    computed: {
        src() {
            return '/secret_pic.php?inc=' + this.inc;
        }
    },
    methods: {
        close() {
            this.$emit('cancel');
        },
        send() {
            this.$emit('send', this.code);
            this.update();
            this.close();
        },
        update() {
            this.inc++;
        },
    },
    template: '#captcha-dialog',
});

Vue.component('city-suggest', {
    props: ['city'],
    data() {
        return {
            query: '',
            cities: [],
            enable: true
        };
    },
    mounted() {
        if (!this.query && this.city && this.city.length > 2) {
            this.query = this.city;
        }
    },
    computed: {
        suggested() {
            return this.cities.length;
        }
    },
    methods: {
        load() {
            if (!this.query.length) {
                return this.reset();
            }
            api.user.get({q: this.query, hash}, 'town/suggest').then((response) => {
                this.loaded(response.data.cities);
            });
        },
        reset() {
            this.cities = [];
        },
        select(item) {
            this.query = item;
            this.$emit('select', item);
            this.reset();
        },
        loaded(data) {
            if (data && data.length) {
                this.cities = data;
            } else {
                this.reset();
            }
        },
    },
    template: '#city-suggest',
});


var ContactDialog = {
    extends: DefaultActivity,
    props: [
      'quick',
    ],
    data() {
        return {
            response: false,
            slow: false,
            error: false,
            amount: 0,
            offset: 0,
            batch: 10,
            max: 100,
            dialog: false,
        }
    },
    computed: {
        showLoader() {
            return this.slow && !this.response;
        },
        showAlert() {
            return this.error && this.response;
        },
        showHint() {
            return this.count < 1;
        },
        count() {
            let result = this.contacts ? this.contacts.length : 0;
            return result;
        },
        more() {
            let max = this.offset <= this.max - this.batch;
            let min = this.amount >= this.batch;
            return (min && max);
        }
    },
    methods: {
        close() {
            //this.$emit('close');
            this.back();
        },
        reset() {
            this.response = false;
            this.error  = false;
            this.slow = false;
        },
        hope() {
            let sec = 2;
            setTimeout(() => this.slow = true,  sec * 1000);
            this.reset();
        },
        loaded(result) {
            //this.received = result ? result.length : 0;
            // if (this.received) {
            //     this.contacts = _.union(this.contacts, result);
            // }
            this.offset += this.batch;
            this.amount = this.count;
            this.response = true;
            this.slow = false;
        },
        bun(index) {
            let item = this.contacts[index];
            console.log('bun', item);
            this.remove(index);
            api.bun.send({
                id: item.message.mess_id,
                tid: item.human_id,
                //text: this.item.message,
                //token: 'super secret token'
            });
        },
        splice(index) {
            this.$store.commit('delete', index);
        },
        error(error) {
            this.response = true;
            this.error = true;
            console.log(error);
        },
        dialogOpen(data) {
            this.dialog = data.id;
            this.title = data.title;
        }
    },
    mounted() {
        this.load();
    }
};


const InitialDialog = Vue.component('initial-dialog', {
    extends: ContactDialog,
    mounted() {
        this.$store.dispatch('initial/CHECK');
    },
    computed: {
        initial: () => true,
        simple:  () => true,
        contacts() {
            //console.log(this.$store);
            return this.$store.state.contacts.initial.list;
        }
    },
    methods: {
        load() {
            this.$store.dispatch('initial/LOAD').then((response) => {
                this.loaded();
            });
            this.amount = this.count;
            this.hope();
        },
        next() {
            this.$store.dispatch('initial/NEXT', this.offset).then((response) => {
                this.loaded();
            });
            this.reset();
        },
        remove(index) {
            this.$store.dispatch('initial/DELETE', index);
        },
        read(index) {
            console.log('initial=read', index);
            this.$store.dispatch('initial/READ', index);
        },
        splice(index) {
            //console.log(this.$store); return;
            this.$store.commit('initial/delete', index);
        },
    },
    template: '#initial-dialog'
});

const IntimateDialog = Vue.component('intimate-dialog', {
    extends: ContactDialog,
    data() {
        return {
            max: 100
        }
    },
    mounted() {
        this.$store.dispatch('intimate/CHECK');
    },
    computed: {
        initial: () => true,
        simple:  () => false,
        contacts() {
            return this.$store.state.contacts.intimate.list;
        }
    },
    methods: {
        load() {
            this.$store.dispatch('intimate/LOAD', this.next).then((response) => {
                this.loaded();
            }).catch((error) => this.error = error);
            this.amount = this.count;
            this.hope();
        },
        next() {
            this.$store.dispatch('intimate/NEXT', this.offset).then((response) => {
                this.loaded();
            });
            this.hope();
        },
        remove(index) {
            console.log('imm=remove', index);
            this.$store.dispatch('intimate/DELETE', index);
        },
        read(index) {
            console.log('intimate=read', index);
            this.$store.dispatch('intimate/READ', index);
        },
        splice(index) {
            this.$store.commit('intimate/delete', index);
        },
    },
    template: '#intimate-dialog'
});

const SendsDialog = Vue.component('sends-dialog', {
    extends: ContactDialog,
    computed: {
        initial: () => false,
        simple:  () => false,
        contacts() {
            return this.$store.state.contacts.sends.list;
        }
    },
    methods: {
        load() {
            this.$store.dispatch('sends/LOAD', this.next).then((response) => {
                this.loaded();
            });
            this.amount = this.count;
            this.hope();
        },
        next() {
            this.$store.dispatch('sends/NEXT', this.offset).then((response) => {
                this.loaded();
            });
            this.reset();
        },
        remove(index) {
            this.$store.dispatch('sends/DELETE', index);
        },
        splice(index) {
            this.$store.commit('sends/delete', index);
        },
    },
    template: '#initial-dialog'
});



Vue.component('contact-item', {
    props: [
      'item',
      'index',
      'quick',
    ],
    data() {
        return {
            account: false,
            detail:  false,
            confirm: false
        }
    },
    computed: {
        name() {
            var result = 'Парень или девушка';
            if (this.item.user) {
                result = this.item.user.sex == 2 ? 'Девушка' : 'Парень';
                if (this.item.user.name) {
                    result = this.item.user.name;
                }
            }
            return result;
        },
        age() {
            return this.item.user && this.item.user.age ? this.item.user.age : '';
        },
        city() {
            return this.item.user && this.item.user.city ? this.item.user.city : '';
        },
        title() {
            return this.name + ' ' + this.age + ' ' + this.city;
        },
        message() {
            return this.item.message ? this.item.message.text : '';
        },
        unread() {
            return this.item.message ? this.item.message.unread : 0;
        },
        sent() {
            return this.item.message ? (this.item.message.sender == this.$store.state.user.uid) : 0;
        },
        humanId() {
            return this.item.human_id;
        },
    },
    methods: {
        show() {
            //this.$emit('show');
            if (this.quick) {
                this.reply();
            } else {
                //this.anketa();
                this.dialog();
            }
        },
        reply() {
            this.$emit('read', this.index);
            this.$router.push({ name: 'quickReply', params: {
                humanId: this.humanId,
                message: this.message,
                index: this.index
            } });
        },
        dialog() {
            this.$emit('read', this.index);
            //this.$emit('dialog', {id: this.humanId, title: this.title});
            this.$router.push({ name: 'dialog', params: {humanId: this.humanId, title: this.title} });
        },
        confirmBun() {
            this.confirm = 'doit';
            console.log('confirmBun');
        },
        confirmRemove() {
            //this.$emit('remove');
            //console.log('initial-item REMOVE');
            this.confirm = !this.quick ? 'some' : 'must';
        },
        close() {
            this.detail = false;
            console.log('close');
        },
        bun() {
            console.log('bun1', this.index);
            this.$emit('bun', this.index);
        },
        remove() {
            console.log('remove=remove', this.index);
            this.$emit('remove', this.index);
        },
        cancel() {
            this.confirm = false;
            console.log('cancel');
        },
        sended() {
            this.$emit('sended', this.index);
            this.close();
        }
    },
    template: '#contact-item'
});


Vue.component('desire-tag-item', {
    props: ['id', 'tag', 'added'],
    data() {
        return {
            active: false,
            error: false,
        }
    },
    methods: {
        activate() {
            this.active = true;
            _.delay(() => this.active = false, 3000);
        },
        select() {
            this.activate();
            this.$emit('select', this.tag);
        }
    },
    template: '#desire-tag-item'
});
Vue.component('desire-list', {
    props: ['tags'],
    computed: {
        desires() {
            return this.$store.getters['desires/tags'];
        },
    },
    methods: {
        add(tag) {
            if (!this.added(tag)) {
                this.$store.dispatch('desires/ADD', tag).then((response) => {});
            }
        },
        added(tag) {
            return _.contains(this.desires, tag);
        },
    },
    template: '#desire-list'
});
Vue.component('desires-widget', {
    props: ['tags'],
    data() {
        return {
            batch: 50,
            position: 0,
            list: []
        }
    },
    mounted() {
        this.reload();
    },
    updated() {
        this.reload();
    },
    computed: {
        avaible() {
            let result = this.tags.length - this.position;
            return (result > 0) ? result : 0;
        },
        more() {
            return this.tags ? this.avaible : false;
        },
        offset() {
            let result = this.batch;
            if (this.list.length && this.list.length < this.batch) {
                result = this.batch - this.list.length;
            }
            return result;
        },
        next() {
            let result = this.tags.slice(this.position, this.position + this.offset);
            return _.shuffle(result);
        },
    },
    methods: {
        load() {
            if (this.more) {
                this.list = _.union(this.list, this.next);
                this.position = this.list.length;
            }
        },
        reload() {
            if (!this.position || this.offset != this.batch) {
                this.load();
            }
        }
    },
    template: '#desires-widget'
});
Vue.component('email-sended', {
    template: '#email-sended'
});

Vue.component('inform-dialog', {
    props: [
      'loader',
      'alert',
      'hint',
    ],
    computed: {
        hasContext() {
            return !!this.$slots.context;
        },
        hasHint() {
            return !!this.$slots.hint;
        },
    },
    methods: {
        close() {
            this.$emit('close');
        },
    },
    template: '#inform-dialog'
});


Vue.component('intro-info', {
    data() {
        return {
            slide: 1
        }
    }
});

Vue.component('loading-cover', {
    props: ['show', 'text'],
    computed: {
        loader() {
            return this.text ? this.text : 'Отправляю';
        }
    },
    template: '#loading-cover',
});




Vue.component('loading-wall', {
    props: ['show', 'text'],
    data() {
        return {
            hope: false
        }
    },
    computed: {
        loader() {
            return this.text ? this.text : 'Загружаем';
        }
    },
    mounted() {
        this.hope = false;
        setTimeout(() => this.hope = true, 3000);
    },
    template: '#loading-wall',
});




const MenuUser = Vue.component('menu-user', {
    data() {
        return {
            attempt: 0
        }
    },
    mounted() {
        this.loadStatus();
    },
    computed: {
        authorized() {
            let uid = this.$store.state.user.uid;
            let reg = this.$store.getters.registered;
            return (uid > 0) ? 1 : 0;
        },
        newMessage() {
            let {status} = this.$store.state.contacts.intimate;
            return (status == false) || status < 8;
        },
        newContact() {
            let {status} = this.$store.state.contacts.initial;
            return (status == false) || status < 8;
        },
        signature() {
            var results = 'Кто вы?';
            let {name, city, age, sex} = this.$store.state.user;
            if (sex) {
                results = sex == 1 ? 'Парень' : 'Девушка';
                results = name ? name : results;
                return results + ' ' + (age ? age : '') + ' ' + (city ? city : '');
            }
            return results;
        }
    },
    methods: {
        search() {
            this.$store.commit('simple', true);
            this.$root.reload();
            this.$router.push('/');
        },
        initial() {
            this.$router.push({ name: 'initial' });
        },
        intimate() {
            this.$router.push({ name: 'intimate' });
        },
        check() {
            axios.get('/mailer/status').then(({data}) => {
                this.onIntimate(data.message);
                this.onInitial(data.contact);
                this.attempt = 0;
            }).catch(() => {
                this.attempt++;
            });
        },
        loadStatus() {
            let {uid} = this.$store.state.user;
            let delay = !uid ? 2 : 15;
            if (uid) {
                this.check();
            }
            if (this.attempt > 10) {
                delay = 20;
            } else
            if (this.attempt > 4) {
                delay = 5;
            } else
            if (this.attempt > 2) {
                delay = 3;
            }
            setTimeout(() => {
                this.loadStatus();
            }, delay * 1000);
        },
        onLoad() {

        },
        onIntimate(status) {
            let {notified, status: current} = this.$store.state.contacts.intimate;
            this.$store.commit('intimate/status', status);

            notified = (!notified || status != current) ? false : true;
            if (status == 1 && !notified && this.newMessage) {
                let callback = () => this.$router.push({ name: 'intimate' });
                this.$store.commit('intimate/notifi', true);
                this.$emit('snackbar', 'Новое сообщение', callback, 'Смотреть', true);
            }
        },
        onInitial(status) {
            let {notified, status: current} = this.$store.state.contacts.initial;
            this.$store.commit('initial/status', status);

            notified = (!notified || status != current) ? false : true;
            if (status == 1 && !notified && this.newContact && !this.newMessage) {
                let callback = () => this.$router.push({ name: 'initial' });
                this.$store.commit('initial/notifi', true);
                this.$emit('snackbar', 'Новое знакомство', callback, 'Смотреть', true);
            }
        },

        regmy() {
            window.location = '/user/regnow';
        },
    },
});


Vue.component('list-date', {
    props: ['list','index'],
    computed: {
        count() {
            return this.list.length;
        },
        item() {
            return this.list[this.index];
        },
        currDate() {
            return moment(this.item.date).date();
        },
        prevDate() {
            if (this.index && this.index < this.count) {
                return moment(this.list[this.index-1].date).date();
            }
        },
        month() {
            return moment(this.item.date).format('MMMM').substring(0,3);
        },
        formatted() {
            var result = this.currDate + ' ' + this.month;
            let today = moment().date();
            let yestd = moment().subtract(1, 'day').date();
            result = (this.currDate === today) ? 'Сегодня' : result;
            result = (this.currDate === yestd) ? 'Вчера' : result;
            return result;
        },
        date() {
            if (this.prevDate != this.currDate) {
                return this.formatted;
            } else {
                return null;
            }
        },
    },
    template: '#list-date',
});

var prev  = null;

Vue.component('message-item', {
    props: [
      'item',
      'index',
      'count',
      'alert'
    ],
    template: '#messages-item',
    data() {
        return {
            showOption:  false,
            fixOption:   false,
            alertOption: false,
            showDialog: false,
            photo: false,
        }
    },
    methods: {
        fix() {
            this.showOption = true;
            this.alertOption = false;
            if (!this.alert) {
                this.fixOption = this.alert ? false : !this.fixOption;
            } else {
                this.$emit('admit');
            }
        },
        bun() {
            let config = {
                headers: {'Authorization': 'Bearer ' + this.$store.state.apiToken}
            };
            let data = {
                id:  this.item.id,
                tid: this.item.from
            };
            axios.post('/mess/bun/', data, config).then((response) => {
                this.$emit('remove', this.index);
            }).catch((error) => {
                console.log('error');
            });
        },
        cancel() {
            this.showDialog = false;
            console.log('cancel');
        },
        remove() {
            let config = {
                headers: {'Authorization': 'Bearer ' + this.$store.state.apiToken}
            };
            let data = {
                id:  this.item.id
            };
            axios.post('/mess/delete/', data, config).then((response) => {
                //this.$emit('remove', this.index);
            }).catch((error) => {
                console.log(error);
            });
            this.$emit('remove', this.index);
        },
        play() {
            let config = {
                headers: {'Authorization': 'Bearer ' + this.$store.state.apiToken},
                params: { tid: this.item.from }
            };
            let server = this.$store.state.photoServer;
            let url = `http://${server}/api/v1/users/${this.uid}/sends/${this.alias}.jpg`;
            axios.get(url, config).then((response) => {
                this.preview(response.data.photo)
            }).catch((error) => {
                console.log(error);
            });
        },
        preview(photo) {
            let links = photo._links;
            if (links.origin.href) {
                this.photo = {
                    thumb: links.thumb.href,
                    photo: links.origin.href,
                    alias:  photo.alias,
                    height: photo.height,
                    width:  photo.width,
                }
            }
        },
        pathName(name) {
            if (!name || name.length < 10) {
                return null;
            }
            let path = [
                name.substr(0, 2),
                name.substr(2, 2),
                name.substr(4, 3),
            ];
            return path.join('/')+'/'+name;
        },
    },
    mounted() {
        if (!this.sent && !this.index && this.count < 5) {
            this.fix();
            this.alertOption = true;
        }
        if (!this.sent && !this.read) {
            this.$emit('set-new');
        }
        //console.log('item', this.index +'+'+ this.date);
    },
    updated() {
        //console.log('item', this.index +'+'+ this.date);
    },
    computed: {
        uid() {
            return this.$store.state.user.uid;
        },
        attention() {
            return (this.alert || this.alertOption) ? 1 : 0;
        },
        option() {
            if (!this.index && this.alert) {
                return true;
            }
            return (this.showOption || this.fixOption) ? 1 : 0;
        },
        sent() {
            return (!this.uid || this.uid == this.item.from) ? 1 : 0;
        },
        read() {
            return (this.item.read == 0) ? false : true;
        },
        time() {
            return moment(this.item.date).format('HH:mm');
        },
        alias() {
            let result = false;
            let text = this.item.mess;
            let old = /.+images.intim?.(.{32})\.(jpg)/i;
            let now = /\[\[IMG:(.{32})\]\]/i;
            result = old.test(text) ? old.exec(text) : false;
            result = (!result && now.test(text)) ? now.exec(text) : result;
            if (result) {
                result = result[1];
            }
            return result;
        },
        image() {
            let server = this.$store.state.photoServer;
            let image = this.pathName(this.alias);
            return image ? `http://${server}/res/photo/preview/${image}.png` : false;
        },
        previous() {
            let p = prev;
            prev = this.item.from;
            return (!p || p == prev) ? true : false;
        }
    }
});


Vue.component('message-list', {
    props: ['humanId'],
    data() {
        return {
            messages: [],
            response: null,
            error: 0,
            next: 0,
            newCount: 0,
            batch: 15,
            received: 0,
            attention: false,
            date: null,
            toSlow: false,
            skipScroll: false,
        }
    },
    mounted: function () {
        this.load();
    },
    methods: {
        reload() {
            this.next = 0;
            this.newCount = 0;
            this.messages = [];
            this.load();
            fdate = null;
            prev  = null;
            //TODO: переписать глобальную зависимость
        },
        load() {
            //console.log('load MessList data');
            this.response = 0;
            let config = {
                headers: {'Authorization': 'Bearer ' + this.$store.state.apiToken},
                params: {id: this.humanId, next: this.next, hash}
            };
            axios.get('/ajax/messages_load.php', config).then((response) => {
                this.onLoad(response);
            }).catch((error) => {
                this.error = 10;
                console.log(error);
            });
            setTimeout(() => this.toSlow = true, 7000);
        },
        loadNext() {
            this.skipScroll = true;
            this.load();
        },
        onLoad(response) {
            let messages = response.data.messages;
            this.received = messages ? messages.length : 0;
            if (!messages && !this.messages.length) {
                this.noMessages();
            } else {
                if (this.received) {
                    this.messages = _.union(messages.reverse(), this.messages);
                }
                this.next += this.batch;
                this.scammer();
            }
            this.response = 200;
            this.toSlow = false;
            this.$nextTick(() => {
                //this.scroll();
            });
        },
        scroll() {
            if (this.skipScroll) {
                return this.skipScroll = false;
            }
            var objDiv = document.getElementById("dialog-history");
            console.log('scroll', objDiv.scrollTop);
            objDiv.scrollTop = objDiv.scrollHeight+30;
            console.log('scroll', objDiv.scrollTop);
        },
        noMessages() {
            // TODO: Заменить на компоненты, страрые зависимости
            //quick_mess.ajax_load();
            //notice_post.show();
            //store.commit('intimate/CHECK', false);
        },
        scammer() {
            if (this.replyCount < 3) {
                this.$emit('attention');
            }
        },
        setDate(date) {
            //this.date = new Date(this.item.date).getDayMonth();
        },
        remove(index) {
            this.messages.splice(index, 1);
        },
        admit() {
            this.attention = false;
        },
        setNew() {
            this.newCount += 1;
        }
    },
    computed: {
        // items() {
        //     //let arr = this.messages.slice();
        //     return this.messages.slice().reverse();
        // },
        count() {
            return this.messages.length;
        },
        replyCount() {
            return _.where(this.messages, {from: this.userId+''}).length;
        },
        more() {
            if (this.received && this.received == this.batch) {
                return true;
            }
            return false;
        },
        userId() {
            return this.$store.state.user.uid;
        }
    },
    template: '#message-list'
});

const ModalDialog = Vue.component('modal-dialog', {
    extends: ActivityActions,
    mounted() {
        // Close the modal when the escape key is pressed.
        var self = this;
        document.addEventListener('keydown', function() {
            if (self.show && event.keyCode === 27) {
                self.close();
            }
        });
    },
    template: '#modal-dialog',
});

Vue.component('modal-super', {
    template: '#modal-super',
});

///
// Модальное окно настроек OptionDialog - контейнер
///
Vue.component('option-dialog', {
    template: '#option-static__dialog-window',
    methods: {
        close() {
            this.$emit('close');
        }
    },
    created: function() {
        // Close the modal when the `escape` key is pressed.
        var self = this;
        document.addEventListener('keydown', function() {
            if (self.show && event.keyCode === 27) {
                self.close();
            }
        });
    },
    updated() {
        if (this.show) {
            $("html, body").animate({ scrollTop: 0 }, "slow");
        }
    }
});

const PhotoViewer = Vue.component('photo-send', {
    props: ['photo', 'options'],
    data() {
        return {
            remove: false
        }
    },
    methods: {
        close() {
            this.$emit('close');
        }
    },
    template: '#photo-send',
});


Vue.component('photo-view', {
    extends: ModalDialog,
    props: [
        'photo',
        'thumb',
        'maxWidth',
        'bypass'
    ],
    methods: {
        approve() {
            this.$store.commit('accepts/photo');
        },
        close() {
            this.back();
        }
    },
    computed: {
        accept() {
            return (this.$store.state.accepts.photo || this.bypass) ? true : false;
        }
    },
    template: '#photo-view'
});

Vue.directive('resized', {
  bind(el) {
    $(el).on('change', () => {
        el.style.height = '1px';
        el.style.height = (el.scrollHeight) + 'px';
    });
  },
  componentUpdated(el) {
      $(el).change();
  }
});

const QuickDialog = {
    extends: ModalDialog,
    props: ['humanId', 'message', 'index'],
    data() {
        return {
            text: '',
            captcha: false,
            process: false,
            loading: false,
            confirm: false,
            ignore: false,
            addition: false,
            code: null
        }
    },
    // beforeRouteLeave(to, from, next) {

    // },
    mounted() {
        this.reload();
        console.log('reply', this.reply);
    },
    computed: {
        caption() {
            return this.reply ? 'Быстрый ответ' : 'Написать сообщение';
        },
        human() {
            return this.$store.state.search.human;
        },
        user() {
            return this.$store.state.user;
        },
        tags() {
            return ('tags' in this.human) ? this.human.tags : [];
        },
        hold() {
            return this.ignore ? 0 : this.human.hold;
        },
        added() {
            return (this.user.city && this.user.age && this.user.name) ? false : true;
        },
    },
    methods: {
        reload() {
            this.loading = true;
            setTimeout(() => this.loading = false, 4 * 1000);
            store.dispatch('search/HUMAN', this.humanId).then((response) => {
                this.loaded();
            }).catch((error) => {
                this.loading = false;
            });
        },
        loaded() {
            this.loading = false;
            this.visited();
            //console.log('hold:', this.human.hold);
            //console.log('tags:', this.human);
            //this.process = false;
        },
        remove() {
            console.log('::remove:: (!)');
            this.$emit('remove');
        },
        cancel() {
            this.captcha = false;
            this.confirm = false;
            this.ignore = true;
            console.log('cancel');
        },
        inProcess(sec) {
            this.process = true;
            setTimeout(() => this.process = false, sec*1000);
        },
        send() {
            let data = {
                id: this.humanId,
                mess: this.text,
                captcha_code: this.code
            };
            api.messages.send(data).then((response) => {
                this.onMessageSend(response.data);
            }).catch((error) => {
                this.onError(error);
            });
            //  this.sended();
            this.inProcess(5);
        },
        setCode(code) {
            this.code = code;
            this.send();
        },
        onMessageSend(response) {
            if (!response.saved && response.error) {
                if (response.error == 'need_captcha') {
                    this.captcha = true;
                }
                this.onError();
            } else {
                this.sended();
            }
            this.process = false;
        },
        sended() {
            this.$emit('sended');
            this.close();
        },
        account() {
            this.$router.push(this.humanId + '/detail')
        },
        onError() {
            this.process = false;
        },
        visited() {
            this.$store.dispatch('visited/ADD', this.humanId);
        },
        close() {
            this.back();
            //this.$emit('close');
        },
    },
    template: '#quick-message',
};

const QuickMessage = Vue.component('quick-message', {
    extends: QuickDialog,
    computed: {
        reply: () => false,
        information() {
            var result = '';
            var who = {1: 'парни', 2: 'девушки'};
            if (this.human.close && this.user.city && this.user.city != this.human.city) {
                result = 'Мне интересно общение только в моём городе';
            }
            if (this.human.who && this.human.who != this.user.sex) {
                result = 'Мне интересны только ' + who[this.human.who];
            } else
            if (this.human.who) {
                var age = this.user.age;
                if (this.human.up && age && this.human.up > age) {
                    result = 'Мне интересны ' + who[this.human.who] + ' в возрасте от ' + this.human.up + ' лет ';
                }
                if (this.human.to && age && this.human.to < age) {
                    result = 'Мне интересны ' + who[this.human.who] + ' в возрасте до ' + this.human.to + ' лет ';
                }
            }
            if (!this.user.age) {
                result = 'Укажите ваш возраст в анкете, для меня это важно';
            }
            if (!this.user.city) {
                result = 'Укажите ваш город в анкете, для меня это важно';
            }
            return result;
        }
    },
    methods: {
        action() {
            if (!this.user.city) {
                this.$router.push('wizard/city');
            } else
            if (!this.user.age) {
                this.$router.push('settings/account')
            }
        },
    },
});

const QuickReply = Vue.component('quick-reply', {
    extends: QuickDialog,
    computed: {
        reply: () => true,
        information() {
            return this.message;
        }
    },
    methods: {
        sended() {
            this.$emit('sended', this.index);
            this.close();
        },
        action() {

        },
    },
});

Vue.component('quick-write', {
    // extends: QuickMessage,
    props: ['humanId'],
    data() {
        return {
            account: false,
            open: false,
            sended: false
        }
    },
    methods: {
        write() {
            this.$router.push('write/' + this.humanId);
        },
    },
    template: '#quick-write',
});

Vue.component('remind-login', {
    data() {
        return {
            email: '',
            hint: 'Введите ваш емайл',
            confirm: false
        }
    },
    computed: {

    },
    methods: {
        close() {
            this.$emit('close');
        },
        send() {
            if (!this.email) {
                return;
            }
            this.hint = 'Отправляю...';
            api.user.post({email: this.email}, null, 'sync/remind').then((response) => {
                this.hint = response.data.say;
                this.error = response.data.err;
                this.sended();
            });
        },
        sended() {
            if (!this.error) {
                this.hint = 'Успешно. Подождите.';
                this.confirm = true;
            }
        },
    },
    template: '#remind-login'
});

var RemoveConfirm = Vue.component('remove-confirm', {
    props: ['show', 'item'],
    data() {
        return {
            content: {
                doit: {
                    caption: 'Наказывайте как следует',
                    text: `За резкие слова, за оскорбления или хамство,
                    за фотографии не в тему или бессмысленные сообщения, наказывайте всех, кого
                    считаете нужным. Наказание действует сразу.`,
                    action: 'Удалить и наказать'
                },
                must: {
                    caption: 'Может стоит наказать?',
                    text: `Нажмите "Дизлайк" у сообщения или контакта, которое вызвало негативные эмоции.
                    Наказание действует сразу же. Мы никогда не узнаем о нарушениях, если удалить без наказания.`,
                    action: 'Удалить и забыть'
                },
                some: {
                    caption: 'Удалить навсегда',
                    text: `Ваше сообщение будет удалено отовсюду, без возможности восстановить. Сообщение
                    пропадет как из вашей истории переписки, так и из переписки вашего собеседника.`,
                    action: 'Удалить навсегда'
                }
            }
        }
    },
    computed: {
        variant() {
            return this.show ? this.show : 'some';
        },
        caption() {
            return this.content[this.variant].caption;
        },
        text() {
            return this.content[this.variant].text;
        },
        action() {
            return this.content[this.variant].action;
        },
    },
    methods: {
        close() {
            this.$emit('close');
        },
        bun() {
            console.log('bun0');
            this.$emit('bun');
            this.close();
        },
        remove() {
            this.$emit('remove');
            this.close();
        },
    },
    template: '#remove-confirm',
});



Vue.component('remove-contact', {
    extends: RemoveConfirm,
    data() {
        return {
            content: {
                some: {
                    caption: 'Удалить навсегда',
                    text: `Контакт будет удален без возможности восстановить. Дальнейшее общение с собеседником станет невозможно.
                    Обменивайтесь реальными контактами с теми кто вам интересен всегда.`,
                    action: 'Удалить навсегда'
                }
            }
        }
    },
    methods: {
        remove() {
            this.$emit('remove');
            this.close();
        },
    },
    template: '#remove-confirm',
});

Vue.component('search-item', {
    props: ['human', 'visited', 'gold', 'compact'],
    data() {
        return {
            first:  null,
            second: null,
            third:  null,
            social: {
                first:  ['em','ok','vk','fb','go','sk','ph'],
                second: ['vk','ok','fb','go','sk','ph'],
                third:  ['sk','ph','em','ok','vk','fb','go'],
            },
        };
    },
    mounted() {
        _.find(_.pick(this.human, this.social.first), (value, key) => {
            return value ? (this.first = key) : false;
        });
        _.find(_.pick(this.human, this.social.second), (value, key) => {
            value = this.first == key ? false : value;
            return value ? (this.second = key) : false;
        });
        _.find(_.pick(this.human, this.social.second), (value, key) => {
            value = this.first == key ? false : value;
            value = this.second == key ? false : value;
            return value ? (this.third = key) : false;
        });
        // console.log('item',this.human);
    },
    computed: {
        search() {
            var result = 'парня или девушку ';
            if (this.human.who) {
                result = this.human.who == 1 ? 'парня ' : 'девушку ';
            }
            result = 'Ищет ' + result;
            if (this.human.up || this.human.to) {
                //result += ' в возрасте ';
                result += this.human.up ? ' от ' + this.human.up : '';
                result += this.human.to ? ' до ' + this.human.to : '';
                result += ' лет ';
            }
            return result;
        },
        name() {
            let sex = this.human.sex == 1 ? 'Парень' : 'Девушка';
            return this.human.name ? this.human.name : sex;
        },
        tags() {
            return this.human.tags.length;
        },
        online() {
            return (this.human.last < 777) ? true : false;
        },
        differ() {
            result = false;
            let sex = this.$store.state.user.sex;
            if (sex && this.human.who && this.human.who != sex) {
                result = true;
            }
            return result;
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        quick() {
            this.$router.push({
                name: 'quickWrite',
                params: {humanId: this.human.id}
            });
        },
        load() {
            api.search.load(null).then((response) => {
                this.users = response.data.users;
            });
        }
    },
    template: '#search-item',
});


Vue.component('search-list', {
    data() {
        return {
            loading: false,
            users: [],
            response: true,
            error: 0,
            newCount: 0,
            attention: false,
            toSlow: false,
            humanId: null,
            account: null,
            sended: false,
            ignore: false,
        };
    },
    mounted() {
        if (this.virgin && this.defaults) {
            this.preload()
        } else {
            this.load();
        }
        this.visitedSync();
        this.$store.dispatch('desires/PICK');
    },
    computed: {
        items() {
            return this.$store.state.search.list;
        },
        more() {
            return this.$store.getters['search/more'];
        },
        compact() {
            let {city, any} = this.$store.state.search.settings;
            return city && !any;
        },
        visited() {
            return this.$store.state.visited.list;
        },
        accept() {
            let {next, batch} = this.$store.state.search;
            let accept = this.$store.state.accepts.search;
            return !this.ignore && !accept && (next > batch);
        },
        defaults() {
            var result = defaultResults ? json.parse(defaultResults) : null;
            return (result && _.isObject(result) && _.has(result, 'users') && result.users.length) ? result : [];
        },
        virgin() {
            return this.$store.getters['search/virgin'];
        },
        desires() {
            return _.pluck(this.$store.state.desires.list, 'tag');
        },
        loader() {
            return this.$store.state.ready && (!this.response || !this.items.length);
        },
        city() {
            return this.$store.state.user.city;
        },
        age() {
            return this.$store.state.user.age;
        },
    },
    methods: {
        preload() {
            this.compact = false;
            this.$store.commit('search/results', this.defaults);
            console.log('defaults', this.defaults);
            this.onLoad();
        },
        reload() {
            this.$store.commit('ready', false);
            this.$store.commit('search/reset', false);
            this.load();
        },
        visitedSync() {
            this.$store.dispatch('visited/SYNC');
        },
        load() {
            this.response = 0;
            this.$store.dispatch('search/LOAD').then((response) => {
                this.onLoad();
            }).catch((error) => {
                this.response = 200;
                this.toSlow = false;
            });
        },
        loadNext() {
            //this.skipScroll = true;
            this.load();
        },
        onLoad() {
            this.$store.commit('ready', true);
            this.response = 200;
            this.toSlow = false;
        },
        openMessage(id) {
            this.humanId = id;
        },
        noResult() {

        },
        old(id) {
            return _.contains(this.visited, id);
        },
        gold(tags) {
            let result = _.intersection(this.desires, tags);
            return result.length ? true : false;
        },
        approve() {
            this.$store.commit('accepts/search');
        }
    },
    template: '#search-list',
});


Vue.component('search-wizard', {
    data() {
        return {

        };
    },
    store,
    computed: Vuex.mapState({
        range(state) {
            var settings = state.search.settings;
            var range = '';
            if (settings.up && settings.to) {
                range = settings.up + ' - ' + settings.to;
            } else
            if (settings.up && !settings.to) {
                range = ' от ' + settings.up;
            } else
            if (!settings.up && settings.to) {
                range = ' до ' + settings.to;
            }
            return range ? ' в возрасте ' + range + ' лет ' : '';
        },
        who(state) {
            var settings = state.search.settings;
            var who = ' знакомства с кем угодно ';
            if (settings.who) {
                who = settings.who == 1 ? ' знакомства с парнем ' : ' знакомства с девушкой ';
            }
            return who;
        },
        say(state) {
            var where = state.user.city ? '' : ', из любого города ';
            return this.who + this.range + where;
        },
        desires() {
            let count = this.$store.state.desires.list.length;
            return count ? count : 0;
        }
    }),
    mounted() {

    },
});

const AboutSettings = Vue.component('about-settings', {
    props: [],
    data() {
        return {
            inputGrowth: '',
            inputWeight: '',
            selectFigure: null,
            process: false,
            virgin: true
        }
    },
    computed: Vuex.mapState({
        growth(state) {
            return state.about.growth;
        },
        weight(state) {
            return state.about.weight;
        },
        figure(state) {
            return state.about.figure;
        }
    }),
    mounted() {
        this.$store.dispatch('about/SYNC').then(() => {
            this.init();
            this.process = false;
        }).catch(() => {
            this.process = false;
        });
        this.process = true;
        this.init();
    },
    methods: {
        init() {
            this.inputGrowth = this.growth ? this.growth : '';
            this.inputWeight = this.weight ? this.weight : '';
            this.selectFigure = this.figure;
        },
        deflower() {
            this.virgin = false;
        },
        close() {
            this.save();
            this.$emit('close');
        },
        save() {
            if (!this.virgin) {
                this.$store.dispatch('about/SAVE', {
                    growth: this.inputGrowth,
                    weight: this.inputWeight,
                    figure: this.selectFigure
                });
            }
        },
    },
    template: '#about-settings',
});


const AccountSettings = Vue.component('account-settings', {
    extends: ClosedActivity,
    props: ['root'],
    data() {
        return {
             selectCity: '',
             selectSex: 0,
             selectAge: 0,
             selectName: ''
        }
    },
    computed: Vuex.mapState({
        sex(state) {
            var sex = Number(state.user.sex);
            if (sex) {
                return (sex == 1) ? 1 : 2;
            }
            return 0;
        },
        city(state) {
            return state.user.city;
        },
        age(state) {
            return state.user.age;
        },
        name(state) {
            var variant = [];
            variant[1] = ['Саша','Дима','Сергей','Иван','Максим','Валера','Николай'];
            variant[2] = ['Оля','Юля','Настя','Алена','Катя','Маргарита','Татьяна'];
            let x = Math.floor( Math.random() * 7);
            let name = state.user.name;
            let auto = this.sex ? variant[this.sex][x] : '';
            return name ? name : auto;
        },
    }),
    created() {
        let {city, age} = defaultSettings; // GLOBAL
        this.selectCity = this.city ? this.city : city;
        this.selectAge = this.age ? this.age : age;
        this.selectSex = this.sex;
        this.selectName = this.name;
    },
    methods: {
        saveSex() {
            this.$store.dispatch('SAVE_SEX',  this.selectSex);
            this.resetName();
        },
        saveCity(city) {
            if (city) {
                this.selectCity = city;
            }
            if (this.selectCity != this.city) {
                this.$store.dispatch('SAVE_CITY', this.selectCity);
            }
        },
        saveAge() {
            if (this.selectAge != this.age) {
                this.$store.dispatch('SAVE_AGE',  this.selectAge);
            }
        },
        saveName() {
            this.$store.dispatch('SAVE_NAME', this.selectName);
        },
        resetName() {
            this.selectName = this.name;
        },
        randomAge() {
            this.selectAge = _.random(19, 30);
            this.saveAge();
        },
        save() {
            this.saveCity();
            this.saveAge();
            this.saveName();
        },
        close() {
            this.save();
            this.back();
        },
    },
    template: '#account-settings',
});


const CityWizard = Vue.component('city-wizard', {
    extends: AccountSettings,
    data() {
        return {
            cities: [
                'Москва','Санкт-Петербург','Минск','Алматы','Краснодар','Екатеринбург','Новосибирск','Киев','Омск',
                'Воронеж','Нижний Новгород','Бишкек','Челябинск','Самара','Красноярск','Уфа','Казань','Иркутск','Волгоград',
                'Харьков','Саратов','Ростов-на-Дону','Одесса','Барнаул','Пермь','Тюмень','Ташкент','Гомель','Томск',
                'Хабаровск','Тольятти','Астана','Ставрополь','Тула','Астрахань','Гродно','Пенза','Оренбург','Владивосток',
                'Чита','Рязань','Караганда','Тверь','Ульяновск','Кемерово','Сургут','Ярославль','Улан-Удэ','Брянск',
                'Шымкент','Витебск','Симферополь','Калининград','Сочи','Липецк','Ижевск','Курск','Белгород','Павлодар',
                'Брест','Могилев','Запорожье','Киров','Новокузнецк','Кривой Рог','Калуга','Усть-Каменогорск','Севастополь',
                'Тамбов','Днепропетровск','Чебоксары','Иваново','Смоленск','Донецк','Душанбе','Владимир','Орел','Магнитогорск',
                'Кострома','Нижневартовск'
            ]
        };
    },
    methods: {
        select(city) {
            this.saveCity(city);
            this.back();
        },
        close() {
            this.saveCity();
            this.back();
        },
    },
    template: '#city-wizard',
});


const ContactWizard = Vue.component('contact-wizard', {
    extends: AccountSettings,
    props: ['humanCity', 'humanAge'],
    created() {
        if (!this.selectCity && this.humanCity) {
            this.selectCity = this.humanCity;
        }
        if (!this.selectAge && this.humanAge) {
            this.selectAge = this.humanAge;
        }
    },
    methods: {
        approve() {
            this.save();
            this.$emit('approve');
            this.$emit('close');
        },
        close() {
            this.$emit('close');
        }
    },
    template: '#contact-wizard',
});


const DesiresSettings = Vue.component('desires-settings', {
    props: [],
    data() {
        return {
            process: false,
            desire: '',
            confirmRemove: null
        }
    },
    computed: Vuex.mapState({
        tags(state) {
            return state.desires.list;
        }
    }),
    mounted() {
        this.process = true;
        this.$store.dispatch('desires/SYNC').then((response) => {
            this.process = false;
        });
    },
    methods: {
        close() {
            this.$emit('close');
        },
        add(tag) {
            this.process = true;
            this.$store.dispatch('desires/ADD', tag).then((response) => {
                this.process = false;
            });
        },
        remove() {
            this.$store.dispatch('desires/DELETE', this.confirmRemove);
            this.confirmRemove = null;
        }
    },
    template: '#desires-settings',
});


const IncomingPhoto = Vue.component('incoming-photo', {
    extends: ClosedActivity,
    props: ['humanId'],
    data() {
        return {
            photos: [],
            user:   0,
            server: null,
            preview: null
        }
    },
    created: function () {
        this.server = this.$store.state.photoServer;
    },
    mounted() {
        this.loadPhoto();
    },
    computed: {
        uid() {
            return this.$store.state.user.uid;
        }
    },
    methods: {
        loadPhoto() {
            let config = {
                headers: {'Authorization': 'Bearer ' + this.$store.state.apiToken},
                params: { tid: this.humanId, hash }
            };
            axios.get(`http://${this.server}/api/v1/users/${this.uid}/sends`, config).then((response) => {
                this.photos = response.data.photos;
                //console.log(this.photos);
            }).catch((error) => {
                console.log(error);
            });
        },
        show(index) {
            let photo = this.photos[index];
            let links = photo._links;
            if (links.origin.href) {
                let data = {
                    thumb: links.thumb.href,
                    photo: links.origin.href,
                    alias:  photo.alias,
                    height: photo.height,
                    width:  photo.width,
                }
                this.preview = data;
            }
        },
        close() {
            this.back();
            //this.$emit('close');
        },
    },
    template: '#incoming-photo',
});


const LoginAccount = Vue.component('login-account', {
    props: [],
    data() {
        return {
            login: '',
            password: '',
            captcha: false,
            code: '',
            error: false,
            remind: false,
            hint: 'Введите данные',
        }
    },
    computed: Vuex.mapState({
        city(state) {
            return state.user.city;
        },
    }),
    mounted() {
    },
    methods: {
        close() {
            this.$emit('close');
        },
        send() {
            let data = {
                login: this.login,
                pass: this.password,
                captcha: this.code
            };
            api.user.post(data, null, 'sync/login').then((response) => {
                this.hint = response.data.say;
                this.error = response.data.err;
                this.captcha = response.data.captcha;
                this.onLogin();
            });
        },
        onLogin() {
            this.$refs.captcha.update();
            if (!this.error) {
                this.hint = 'Успешно. Подождите.';
                location.href = '/';
            }
        },
        setCode(code) {
            this.code = code;
        }
    },
    template: '#login-account',
});


const OtherSettings = Vue.component('other-settings', {
    props: [],
    data() {
        return {

        }
    },
    computed: Vuex.mapState({
        uid() {
            return this.$store.state.user.uid;
        }
    }),
    methods: {
        close() {
            this.$emit('close');
        },
        logout() {
            window.location = '/logout.php';
        }
    },
    template: '#other-settings',
});


const PhotoSettings = Vue.component('photo-settings', {
    extends: ClosedActivity,
    props: ['humanId'],
    data() {
        return {
            photos: [],
        }
    },
    computed: Vuex.mapState({

    }),
    mounted() {
        console.log('fileupload');
        var self = this;
        $('#fileupload').fileupload({
            dataType: 'json',
            add(e, data) {
                let server = self.$store.state.photoServer;
                let uid = self.$store.state.user.uid;
                data.url = `http://${server}/api/v1/users/${uid}/photos?jwt=` + self.$store.state.apiToken;
                data.submit();
            },
            done(e, data) {
                self.preview(data.result.photo);
            }
        });
        this.loadPhoto();
    },
    methods: {
        close() {
            this.back();
        },
        loadPhoto() {
            let server = this.$store.state.photoServer;
            let uid = this.$store.state.user.uid;
            let config = {
                headers: {'Authorization': 'Bearer ' + this.$store.state.apiToken},
                params: {hash}
            };
            axios.get(`http://${server}/api/v1/users/${uid}/photos`, config).then((response) => {
                let result = response.data.photos;
                if (result && result.length) {
                    this.photos = response.data.photos;
                }
                console.log(this.photos);
            }).catch((error) => {
                console.log(error);
            });
        },
        upload(e) {
            $('#fileupload').click();
        },
        show: function (index) {
            this.preview(this.photos[index]);
        },
        preview(photo) {
            let links = photo._links;
            if (links.origin.href) {
                let data = {
                    photo: links.origin.href,
                    thumb: links.thumb.href,
                    alias:  photo.alias,
                    height: photo.height,
                    width:  photo.width,
                }
                //this.$router.push({ name: 'preview', params: {humanId: this.humanId, photo: data, options: true} });
                this.$emit('select', data);
                this.close();
                //this.$store.commit('sendPhoto', data);
                //console.log('sendPhoto');
                //console.log(data);
            } else {
                this.close();
            }
        }
    },
    template: '#photo-settings',
});


const SearchSettings = Vue.component('search-settings', {
    extends: ClosedActivity,
    props: ['root'],
    data() {
        return {
             ageRange: [0,16,17,18,20,23,25,27,30,35,40,45,50,60,80],
             selectWho: 0,
             selectUp: 0,
             selectTo: 0,
             selectCity: '',
             checkedTown: 0,
             checkedVirt: 0,
             checkedAnyCity: 0,
        }
    },
    // beforeRouteEnter(to, from, next) {,
    //     beforeEnter: (to, from, next) => {
    //         console.log(store.state.user.sex);
    //         if (!store.state.user.sex) {
    //             console.log('settings-search', store.state.user.sex );
    //             next('/confirm-sex/search');
    //         } else {
    //             console.log('next', to );
    //             next();
    //         }
    //     }

    // },
    computed: Vuex.mapState({
        who(state) {
            var who = Number(state.search.settings.who);
            if (who) {
                return (who == 1) ? 1 : 2;
            }
            return 0;
        },
        city(state) {
            let {city} = defaultSettings; // GLOBAL
            return state.user.city ? state.user.city : city; // [~!!!~] READ_ONLY
        },
        up(state) {
            return this.age(state.search.settings.up);
        },
        to(state) {
            return this.age(state.search.settings.to);
        },
        town(state) {
            return state.search.settings.town == true;
        },
        virt(state) {
            return state.search.settings.virt == true;
        },
        any(state) {
            return state.search.settings.any == true;
        },
        virgin(state) {
            // Хак для пустых настроек
            if (state.search.settings.city != this.city) {
                return false;
            }
            // Хак для старых настроек NOT Range
            if (state.search.settings.up != this.up) {
                return false;
            }
            if (state.search.settings.to != this.to) {
                return false;
            }
            return (
                this.selectCity == this.city &&
                this.selectWho == this.who &&
                this.selectUp == this.up &&
                this.selectTo == this.to &&
                this.checkedTown == this.town &&
                this.checkedVirt == this.virt &&
                this.checkedAnyCity == this.any
            );
        }
    }),
    created() {
        let {city, who, up, to} = defaultSettings; // GLOBAL
        this.selectCity = this.city ? this.city : city;
        this.selectWho = this.who ? this.who : who;
        this.selectUp = this.up ? this.up : this.age(up);
        this.selectTo = this.to ? this.to : this.age(to);
        this.checkedTown = this.town;
        this.checkedVirt = this.virt;
        this.checkedAnyCity = this.any;
    },
    methods: {
        age(value) {
            value = Number(value);
            if (!value) { return 0; }
            var min = _.min(this.ageRange);
            var max = _.max(this.ageRange);
            if (value <= min) { return min; }
            if (value >= max) { return max; }
            return _.find(this.ageRange, (item, index, list) => {
                if (index && index < list.length) {
                    if (value > list[index-1] && value < list[index+1]) {
                        return true;
                    }
                }
            });
        },
        // setWho(value) {
        //     this.$store.commit('settings', {who: value});
        // },
        // setUp() {
        //     this.$store.commit('settings', {up: this.selectUp});
        // },
        // setTo() {
        //     this.$store.commit('settings', {to: this.selectTo});
        // },
        save() {
            var data = {
                who:  this.selectWho,
                city: this.city,
                up:   this.selectUp,
                to:   this.selectTo,
                town: this.checkedTown,
                virt: this.checkedVirt,
                any: this.checkedAnyCity,
            };
            console.log(data);
            if (!this.virgin) {
                this.$store.dispatch('search/SAVE_SEARCH', data);
            }
        },
        // account() {
        //     if (this.root) {
        //         this.$router.push({ name: 'account-settings', params: {root: true} })
        //     } else {
        //         this.$router.push({ name: 'account-settings'})
        //     }
        // },
        close() {
            this.save();
            this.back();
            this.$root.reload();
        },
    },
    template: '#search-settings',
});


const SecuritySettings = Vue.component('security-settings', {
    props: [],
    data() {
        return {
            inputLogin: '',
            inputPasswd: '',
            inputEmail: '',
            checkSubscribe: 0,
            process: false,
            processLogin: false,
            processPasswd: false,
            processEmail: false,
            confirmRemove: false,
            virgin: true
        }
    },
    computed: Vuex.mapState({
        login(state) {
            return state.auth.login;
        },
        passwd(state) {
            return state.auth.pass;
        },
        email(state) {
            return state.auth.email;
        },
        promt(state) {
            return state.auth.promt;
        },
        subscr(state) {
            return state.auth.subscr;
        },
    }),
    mounted() {
            console.log('auth/SYNC');
        this.$store.dispatch('auth/SYNC').then(() => {
            this.init();
            this.process = false;
        }).catch(() => {
            this.process = false;
        });
        this.process = true;
        this.init();
    },
    methods: {
        init() {
            this.inputLogin = this.login;
            this.inputPasswd = this.passwd;
            this.inputEmail = this.email;
            this.checkSubscribe = this.subscr;
        },
        deflower() {
            this.virgin = false;
        },
        saveLogin() {
            this.processLogin = true;
            this.$store.dispatch('auth/SAVE_LOGIN', this.inputLogin).then((response) => {
                var data = response.data;
                if (data.err) {
                    this.$emit('warning', data.say);
                }
                this.processLogin = false;
            }).catch(() => {
                this.processLogin = false;
            });
        },
        savePasswd() {
            this.processPasswd = true;
            this.$store.dispatch('auth/SAVE_PASSWD', this.inputPasswd).then((response) => {
                var data = response.data;
                if (data.err) {
                    this.$emit('warning', data.say);
                }
                this.processPasswd = false;
            }).catch(() => {
                this.processPasswd = false;
            });
        },
        saveEmail() {
            this.processEmail = true;
            this.$store.dispatch('auth/SAVE_EMAIL', this.inputEmail).then((response) => {
                var data = response.data;
                if (data.err) {
                    this.$emit('warning', data.say);
                }
                this.processEmail = false;
            }).catch(() => {
                this.processEmail = false;
            });
        },
        removeEmail() {
            this.confirmRemove = false;
            this.processEmail = true;
            this.$store.dispatch('auth/REMOVE_EMAIL').then((response) => {
                var data = response.data;
                if (data.err) {
                    this.$emit('warning', data.say);
                }
                this.processEmail = false;
            }).catch(() => {
                this.processEmail = false;
            });
        },
        saveSubscribe() {
            this.$store.dispatch('auth/SAVE_SUSCRIBE');
        },
        close() {
            if (!this.processLogin && !this.processPasswd && !this.processEmail) {
                this.$emit('close');
            } else {
                this.$emit('alert', 'Подождите, сохраняю.');
            }
        },
    },
    template: '#security-settings',
});


const SocialSettings = Vue.component('social-settings', {
    props: [],
    data() {
        return {
            checkedContact: {
                em: 0,
                vk: 0,
                ok: 0,
                fb: 0,
                go: 0,
                sk: 0,
                ph: 0,
            },
            virgin: true
        }
    },
    computed: Vuex.mapState({
        contacts(state) {
            return state.user.contacts;
        }
    }),
    mounted() {
        console.log('user', this.contacts);
        this.checkedContact = this.contacts;
    },
    methods: {
        close() {
            this.save();
            this.$emit('close');
        },
        deflower() {
            this.virgin = false;
        },
        save() {
            if (!this.virgin) {
                this.$store.dispatch('SAVE_CONTACTS', this.checkedContact);
            }
        }
    },
    template: '#social-settings',
});

const SexConfirm = Vue.component('sex-confirm', {
    extends: ModalDialog,
    props: ['show'],
    computed: {
        variant() {
            return this.show ? this.show : 'message';
        },
        caption() {
            return this.content[this.variant].caption ;
        },
        text() {
            return this.content[this.variant].text;
        }
    },
    // beforeRouteLeave(to, from, next) {
    //     if (this.$store.state.user.sex) {
    //         if (this.index('search')) {
    //             console.log('leave-search', [this.$store.state.user.sex, store.state.user.sex, to]);
    //             next({name: 'search-settings'});
    //         }
    //         if (this.index('contacts')) {
    //             console.log('leave', 'contacts');
    //             next({name: 'search-settings'});
    //         }
    //         if (this.index('account')) {
    //             console.log('leave', 'account');
    //             next({name: 'search-settings'});
    //         }
    //         if (this.index('message')) {
    //             console.log('leave', 'message');
    //             next({name: 'search-settings'});
    //         }
    //     }
    //     console.log('leave', 'close');
    //     next();
    // },
    // mounted() {
    //     console.log('confirm', this.variant);
    // },
    methods: {
        close() {
            this.back();
        },
        index(val) {
            return val == this.variant;
        },
        save(sex) {
            this.$store.dispatch('SAVE_SEX', sex);
            this.$emit('select', this.show);
            this.redirect();
        },
        login() {
            this.$emit('login');
            this.$emit('close');
        },
        redirect() {
            if (this.index('search')) {
                this.$router.replace('/search');
            } else
            // if (this.index('contacts')) {
            //     console.log('leave', 'contacts');
            //     next({name: 'search-settings'});
            // }
            if (this.index('account')) {
                this.$router.replace('/settings/account');
            } else
            if (this.index('message')) {
                this.$router.replace('/');
            } else
            if (this.index('city')) {
                this.$router.replace('/wizard/city');
            } else {
                this.$router.replace('/');
            }
        }
    },
    data() {
        let content = {
            search: {
                caption: 'Легко начать',
                text: 'Для правильного отображения результатов поиска необходимо указать пол. Вы парень или девушка?'
            },
            contacts: {
                caption: 'Вы девушка?',
                text: 'Начало быстрого общения в один клик. Хотите получать сообщения и новые знакомства? Достаточно подтвердить, парень вы или девушка.'
            },
            message: {
                caption: 'Общение в один клик',
                text: 'Начать общение просто. Хотите получать сообщения и новые знакомства? Достаточно подтвердить, парень вы или девушка.'
                //text: 'Все пользователи желают знать с кем будут общаться. Чтобы продолжить укажите, парень вы или девушка.'
            },
            account: {
                caption: 'Кто вы?',
                text: 'Приватная анкета в один клик. Самое быстрое общение. Достаточно указать кто вы, парень или девушка. И начинайте общаться.'
            }
        };
        content.city = content.contacts;
        return {content};
    },
    template: '#sex-confirm'
});

Vue.component('simple-captcha', {
    props: [],
    data() {
        return {
            code: '',
            inc: 0
        }
    },
    computed: {
        src() {
            return '/capcha_pic.php?inc=' + this.inc;
        }
    },
    mounted() {

    },
    methods: {
        close() {
            this.$emit('close');
        },
        update() {
            this.inc++;
        },
        input() {
            this.$emit('input', this.code);
        },
    },
    template: '#simple-captcha',
});


Vue.component('slider-vertical', {
    data() {
        return {
            slide: 1
        }
    }
});
Vue.component('snackbar', {
    props: ['callback', 'action', 'play'],
    computed: {
        time() {
            return this.callback ? 5000 : 3000;
        },
        title() {
            return this.action ? this.action : 'Ok';
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        approve() {
            this.callback();
        },
        autoplay(event) {
            if (this.play) {
                this.$refs.autoplay.play();
            }
        }
    },
    mounted() {
        _.delay(this.close, this.time);
        this.autoplay();
    },
    template: '#snackbar',
});

Vue.component('suggest-input', {
    props: ['url', 'disabled'],
    data() {
        return {
            query: '',
            items: [],
            enable: true
        };
    },
    computed: {
        suggested() {
            return this.items.length;
        }
    },
    methods: {
        load() {
            api.user.get({q: this.query}, 'tag/suggest').then((response) => {
                this.loaded(response.data);
            });
        },
        reset() {
            this.query = '';
            this.items = [];
        },
        select(item) {
            this.query = item;
            this.$emit('select', item);
            this.reset();
        },
        loaded(data) {
            if (data && data.length) {
                this.items = data;
                console.log('loaded', data)
            } else {
                this.reset();
            }
        },
    },
    template: '#suggest-input',
});

Vue.component('toast', {
    methods: {
        close() {
            this.$emit('close');
        },
    },
    mounted() {
        _.delay(this.close, 2000);
    },
    template: '#toast',
});


Vue.component('upload-dialog', {
    template: '#upload-dialog',
    data() {
        return {
            photos: [],
            server: null,
        }
    },
    created: function () {
        this.server = this.$store.state.photoServer;
    },
    methods: {
        show: function (index) {
            this.preview(this.photos[index]);
        },
        preview(photo) {
            let links = photo._links;
            if (links.origin.href) {
                let data = {
                    photo: links.origin.href,
                    thumb: links.thumb.href,
                    alias:  photo.alias,
                    height: photo.height,
                    width:  photo.width,
                }
                this.$store.commit('sendPhoto', data);
                //console.log('sendPhoto');
                //console.log(data);
            }
            this.close();
        }
    }
})



Vue.component('alert-widget', {
    data() {
        return {
            compact: false
        }
    },
    mounted() {
        this.compact = true;
    }
});

Vue.component('photo-dialog', {
    methods: {
        close() {
            this.$emit('close');
            store.commit('viewPhoto', { photo: null });
        }
    },
    computed: Vuex.mapState({
        config: state => state.photoView
    }),
    template: '#photo-dialog'
})


// -- Хранилище ---
var storage = {
    enable:  0,
    init() {
        if (storage.is_enable()) {
            storage.enable = 1;
        }
    },
    is_enable() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        }
        catch(e) {
            return false;
        }
    },
    save(key,val) {
        if (storage.enable) {
            localStorage.setItem(key,val);
        }
    },
    load(key,def) {
        var result = def ? def : null;
        if (storage.enable && localStorage.getItem(key)) {
            result = localStorage.getItem(key);
        }
        return result;
    },
    set(key,val) {
        storage.save(key,val);
    },
    get(key,def) {
        storage.load(key,def);
    },
    array: {
        load(key) {
            var result = [];
            var value = null;
            value = storage.load(key);
            value = json.parse(value);
            if (value)
                result = value;
            return result;
        } ,
        save(key,val) {
            storage.save(key,json.encode(val));
        } ,
        add(key,val) {

        }
    }
}
storage.init();


const about = {
    namespaced: true,
    state: {
        growth: 0,
        weight: 0,
        figure: 0
    },
    actions: {
        SYNC({rootState, commit, getters}) {
            return api.user.syncAbout().then((response) => {
                commit('update', response.data);
            });
        },
        SAVE({state, commit}, data) {
            api.user.saveAbout({anketa: data}).then((response) => {
                commit('update', data);
            });
        }
    },
    mutations: {
        update(state, data) {
            if (data) {
                _.assign(state, data);
            }
        },
    }
};


const accepts = {
    namespaced: true,
    state: {
        photo: false,
        search: false,
        moderator: false,
    },
    actions: {
        LOAD({state}) {
            let data = ls.get('accepts');
            if (data) {
                _.assign(state, data);
            }
        },
    },
    mutations: {
        photo(state) {
            state.photo = true;
            ls.set('accepts', state);
        },
        search(state) {
            state.search = true;
            ls.set('accepts', state);
        },
        moderator(state, value) {
            state.moderator = (value == true);
            ls.set('accepts', state);
        },
    }
};


const auth = {
    namespaced: true,
    state: {
        iss: '',
        exp: '',
        iat: '',
        sid: '',
        uid: '',
        auth: '',
        ip:  '',
            login: '',
            pass:  '',
            email: '',
            promt: '',
            subscr: false,
        last:  '',
        error: ''
    },
    actions: {
        SYNC({commit}) {
            return api.user.syncAuth().then((response) => {
                commit('update', response.data);
            });
        },
        SAVE_LOGIN({commit}, data) {
            return api.user.saveLogin(data);
        },
        SAVE_PASSWD({commit}, data) {
            return api.user.savePasswd(data);
        },
        SAVE_EMAIL({commit}, data) {
            return api.user.saveEmail(data);
        },
        REMOVE_EMAIL({commit}) {
            return api.user.removeEmail();
        },
        SAVE_SUSCRIBE({store, commit}, data) {
            commit('subscr');
            return api.user.saveSubscribe();
        },
        UPDATE_KEY({store, commit}) {
            return axios.get('/sync/sess/');
        }
    },
    mutations: {
        update(state, data) {
            if (data) {
                _.assign(state, data);
            }
        },
        subscr(state) {
            state.subscr = state.subscr ? false : true;
        }
    }
};


const mutations = {
    load(state, data) {
        if (data && data instanceof Array && data.length > 0) {
            state.list = data;
        }
    },
    add(state, data) {
        if (data && data instanceof Array && data.length > 0) {
            state.list = _.union(state.list, data);
        }
    },
    status(state, status) {
        state.status = status;
    },
    notifi(state, status) {
        state.notified = status == true;
    }
}
// // //

const initial = _.extend({
    namespaced: true,
    state: {
        status: 8,
        notified: false,
        list: []
    },
    actions: {
        LOAD({ state, commit, rootState }) {
            commit('load', ls.get('initial-contacts'));
            return api.contacts.initial.cget({
                uid: rootState.user.uid,
                offset: 0
            }).then((response) => {
                commit('load', response.data);
                ls.set('initial-contacts', state.list);
            });
        },
        NEXT({ state, commit, rootState }, offset) {
            return api.contacts.initial.cget({
                uid: rootState.user.uid,
                offset
            }).then((response) => {
                commit('add', response.data);
            });
        },
        DELETE({ state, commit, rootState }, index) {
            let result = api.contacts.initial.delete({
                uid: rootState.user.uid,
                resource_id: state.list[index].id
            });
            commit('delete', index);
            return result;
        },
        READ({ state, commit, rootState }, index) {
            let result = api.contacts.initial.put(null, {
                uid: rootState.user.uid,
                resource_id: state.list[index].id
            });
            commit('read', index);
            return result;
        },
        CHECK({commit}) {
            axios.get('/mailer/check_contact').then(() => {
                commit('status', 8);
                commit('notifi', false);
            });
        }
    },
    mutations: _.extend({
        delete(state, index) {
            state.list.splice(index, 1);
            ls.set('initial-contacts', state.list);
        },
        read(state, index) {
            state.list[index].message.unread = 0;
            ls.set('initial-contacts', state.list);
        }
    }, mutations)
});

const intimate = _.extend({
    namespaced: true,
    state: {
        status: 8,
        notified: false,
        list: []
    },
    actions: {
        LOAD({ state, commit, rootState }) {
            commit('load', ls.get('intimate-contacts'));
            return api.contacts.intimate.cget({
                uid: rootState.user.uid,
                offset: 0
            }).then((response) => {
                commit('load', response.data);
                ls.set('intimate-contacts', state.list);
            });
        },
        NEXT({ state, commit, rootState }, offset) {
            return api.contacts.intimate.cget({
                uid: rootState.user.uid,
                offset
            }).then((response) => {
                commit('add', response.data);
            });
        },
        DELETE({ state, commit, rootState }, index) {
            let result = api.contacts.intimate.delete({
                uid: rootState.user.uid,
                resource_id: state.list[index].id
            });
            commit('delete', index);
            return result;
        },
        READ({ state, commit, rootState }, index) {
            let result = api.contacts.intimate.put(null, {
                uid: rootState.user.uid,
                resource_id: state.list[index].id
            });
            commit('read', index);
            return result;
        },
        CHECK({commit}) {
            axios.get('/mailer/check_message').then(() => {
                commit('status', 8);
                commit('notifi', false);
            });
        }
    },
    mutations: _.extend({
        delete(state, index) {
            state.list.splice(index, 1);
            ls.set('intimate-contacts', state.list);
        },
        read(state, index) {
            state.list[index].message.unread = 0;
            ls.set('intimate-contacts', state.list);
        }
    }, mutations)
});

const sends = _.extend({
    namespaced: true,
    state: {
        list: []
    },
    actions: {
        LOAD({ state, commit, rootState }) {
            commit('load', ls.get('sends-contacts'));
            return api.contacts.sends.cget({
                uid: rootState.user.uid,
                offset: 0
            }).then((response) => {
                commit('load', response.data);
                ls.set('sends-contacts', state.list);
            });
        },
        NEXT({ state, commit, rootState }, offset) {
            return api.contacts.sends.cget({
                uid: rootState.user.uid,
                offset
            }).then((response) => {
                commit('add', response.data);
            });
        },
        DELETE({ state, commit, rootState }, index) {
            let result = api.contacts.sends.delete({
                uid: rootState.user.uid,
                resource_id: state.list[index].id
            });
            commit('delete', index);
            return result;
        },
    },
    mutations: _.extend({
        delete(state, index) {
            state.list.splice(index, 1);
            ls.set('sends-contacts', state.list);
        }
    }, mutations)
});


const contacts = {
    modules: {
        initial,
        intimate,
        sends
    }
}


const credits = {
    state: {
        count: 0,
        info: ''
    },
    actions: {

    },
    mutations: {

    }
};


const desires = {
    namespaced: true,
    state: {
        list: [],
        limit: 20,
    },
    actions: {
        PICK({commit}) {
            commit('update', ls.get('desires'));
        },
        SYNC({state, commit}) {
            commit('update', ls.get('desires'));
            return api.user.desireList().then((response) => {
                commit('update', response.data);
                ls.set('desires', state.list);
            });
        },
        ADD({state, commit}, tag) {
            //commit('add', tag);
            return api.user.desireAdd(tag).then((response) => {
                let id = response.data.id;
                commit('add', {id, tag});
            });
        },
        DELETE({state, commit}, index) {
            let result = api.user.desireDelete(state.list[index].id);
            commit('delete', index);
            return result;
        }
    },
    mutations: {
        update(state, data) {
            if (data && data.length) {
                state.list = data.slice();
            }
        },
        add(state, data) {
            state.list.unshift(data);
            state.list = state.list.slice(0, state.limit);
            ls.set('desires', state.list);
        },
        delete(state, index) {
            state.list.splice(index, 1);
            ls.set('desires', state.list);
        },
    },
    getters: {
        tags(state) {
            return _.pluck(state.list, 'tag');
        }
    }
};

const modals = {
    state: {
        initial: false,
        intimate: false,
        sends: false,
    },
    mutations: {
        showInitial(state, data) {
            store.commit('closeAll');
            state.initial = data == true;
        },
        showIntimate(state, data) {
            store.commit('closeAll');
            state.intimate = data == true;
        },
        showSends(state, data) {
            store.commit('closeAll');
            state.sends = data == true;
        },
        closeAll(state) {
            state.initial  = false;
            state.intimate = false;
            state.sends    = false;
        }
    }
}

const moderator = {
    state: {
        promt: 0,
        rank:  0,
        resident: 0,
        action: 0,
        effect: 0,
        bunn: 0,
        rang: ''
    },
    actions: {

    },
    mutations: {

    }
};


var search = {
    namespaced: true,
    state: {
        list: [],
        last: [],
        received: 0,
        next: null,
        batch: 15,
        url: '',
        human: {
            name: '',
            age: 0,
            city: '',
        },
        settings: {
            who: 0,
            city: '',
            up: null,
            to: null,
            town: false,
            virt: false,
            any: false,
        }
    },
    actions: {
        HUMAN({ commit }, tid) {
            let index = 'human.data.'+tid;
            commit('resetHuman', tid);
            commit('setHuman', ls.get(index));
                console.log('HUMAN', tid);
            return api.search.get({tid}).then((response) => {
                commit('setHuman', response.data);
                ls.set(index, response.data, 1500);
            });
        },
        LOAD({state, rootState, commit}) {
            let {who, city, up, to, any} = state.settings;
            let sex = rootState.user.sex;
            up = up ? up : 0;
            to = to ? to : 0;
            if (!city || any) {
                city = null;
            }
            return api.search.load({sex, who, city, up, to, next: state.next}).then(({data}) => {
                commit('results', data);
                commit('last', data);
                commit('next');
            });
        },
        RESET_SEARCH() {

        },
        SETTINGS({ commit }) {
            commit('settingsCookies');
            commit('settings', ls.get('search.settings'));
            //let index = 'search.settings';
        },
        SAVE_SEARCH({state, commit}, data) {
            commit('settings', data);
            ls.set('search.settings', data);
            return api.user.saveSearch(data).then((response) => { });
        },
    },
    mutations: {
        reset(state) {
            state.next = 0;
            state.list = [];
            state.received = 0;
        },
        // Сбросить предыдущие данные, если там что-то не то
        resetHuman(state, tid) {
            if (state.human && state.human.id != tid) {
                state.human = {};
            }
        },
        setHuman(state, data) {
            if (data) {
                state.human = data;
            }
        },
        results(state, {users}) {
            state.received = users ? users.length : 0;
            if (users && state.received) {
                state.list = _.union(state.list, users);
            }
            state.next += state.batch;
        },
        last(state, {users}) {
            if (users && !state.last) {
                state.last = users;
                ls.set('last-search', users, 31*24*60*60);
            }
        },
        settings(state, data) {
            if (data) {
                //console.log('settings:', data);
                _.assign(state.settings, data);
            }
        },
        next(state, reset) {
            if (reset) {
                state.next = 0;
            } else {
                state.next += state.batch;
            }
        },
        settingsCookies(state) {
            var data = get_cookie('mail_sett');
            if (data) {
                try {
                  data = JSON.parse(data);
                }
                catch(e) { }
                state.settings.city = data.city;
                state.settings.who = Number(data.who);
                state.settings.up = Number(data.up);
                state.settings.to = Number(data.to);
                state.settings.town = Boolean(data.town);
                state.settings.virt = Boolean(data.virt);
                //console.log('dataCookies:', data);
            }
        }
    },
    getters: {
        virgin(state, getters, rootState) {
            let {who, up, to} = state.settings;
            return (!who && !rootState.user.city && !up && !to);
        },
        more(state) {
            return (state.received && state.received == state.batch) ? true : false;
        },
        tags(state) {
            return _.compact(_.union(_.flatten(_.pluck(state.list, 'tags'))));
        }
    }
};

const user = {
    state: {
        uid: 0,
        sex: 0,
        age: 0,
        name: '',
        city: '',
        contacts: {
            em: 0,
            vk: 0,
            ok: 0,
            fb: 0,
            go: 0,
            sk: 0,
            ph: 0,
        },
        tags: {
            str: ''
        },
        status: 0,
        promt: null,
        last: ''
    },
    actions: {
        LOAD_USER({ commit }) {
            // if (uid) {
            //     commit('loadUser', {uid});
            // }
            commit('loadUser', ls.get('user.data'));
        },
        SAVE_SEX({ state, commit }, sex) {
            commit('loadUser', { sex, name: '' });
            if (sex) {
                api.user.saveSex(sex).then((response) => { });
                commit('loadUser', { sex });
            }
        },
        SAVE_AGE({ state, commit }, age) {
            if (age && state.age != age) {
                api.user.saveAge(age).then((response) => { });
                commit('loadUser', {age});
            }
        },
        SAVE_NAME({ state, commit }, name) {
            if (name && state.name != name) {
                api.user.saveName(name).then((response) => { });
                commit('loadUser', {name});
            }
        },
        SAVE_CITY({ state, commit }, city) {
            if (city && state.city != city) {
                api.user.saveCity(city).then((response) => { });
                commit('loadUser', {city});
            }
        },
        SAVE_CONTACTS({ state, commit }, contacts) {
            api.user.saveContacts(contacts).then((response) => { });
            commit('loadUser', {contacts});
        },
    },
    mutations: {
        loadUser(state, data) {
            _.assign(state, data);
            ls.set('user.data', state, 23456);
        },
        resetUser(state, data) {
            _.assign(state, data);
            ls.set('user.data', data, 23456);
        },
    }
}


const visited = {
    namespaced: true,
    state: {
        list: [],
    },
    actions: {
        SYNC({rootState, state, commit}) {
            let index = 'visited-' + rootState.user.uid;
            commit('update', ls.get(index));
            return api.user.visitedList().then((response) => {
                let {data} = response;
                commit('update', data);
                ls.set(index, state.list, 31*24*60*60);
            });
        },
        ADD({rootState, state, commit}, tid) {
            let uid = rootState.user.uid;
            let index = 'visited-' + uid;
            commit('add', tid);
            ls.set(index, state.list, 31*24*60*60);
            return api.user.visitedAdd(uid, tid).then((response) => {

            });
        }
    },
    mutations: {
        update(state, data) {
            if (data && data.length) {
                state.list = _.union(state.list, data);
            }
        },
        add(state, data) {
            state.list.unshift(data);
        },
    }
};


moment.locale('ru');

var ls = lscache;

const store = new Vuex.Store({
    modules: {
        user,
        auth,
        about,
        search,
        contacts,
        desires,
        visited,
        accepts,
        modals
    },
    state: {
        ready: false,
        apiToken: '',
        photoServer: '@@API-PHOTO',
        simple: false
    },
    actions: {
        LOAD_API_TOKEN({ commit }) {
            commit('setApiToken', { apiToken: get_cookie('jwt') });
        },
    },
    mutations: {
        setApiToken (state, data) {
            if (data) {
                _.assign(state, data);
            }
            //console.log(state)
        },
        simple(state, data) {
            state.simple = (data == true);
        },
        ready(state, data) {
            state.ready = (data == true);
        },
    },
    getters: {
        registered(state) {
            return state.apiToken ? true : false;
        }
    }
});

store.dispatch('LOAD_API_TOKEN');
store.dispatch('accepts/LOAD');
store.dispatch('LOAD_USER');
store.dispatch('search/SETTINGS');


class Api {
    constructor(host, key, version, routing) {
        // Delay requests sec
        this.setDelay('@@NET-DELAY');
        // [!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!]
        this.setRoot(host, version);
        this.setConfig(this.root, key);
        this.setRouting(routing);
    }

    setDelay(sec) {
        this.wait = sec * 1000; //
    }
    setRouting(routing) {
        this.routing = {
            route: '',
            load: '',
            get: '{resource_id}',
            cget: '',
            send: '',
            post: '',
            save: '',
            remove: '',
            delete: '{resource_id}',
            put: '{resource_id}',
            patch: '{resource_id}',
            option: '{resource_id}'
        };
        _.extend(this.routing, routing);
    }
    setRoot(host, version) {
        let ver = version ? 'v' + version + '/' : '';
        this.root = host + ver;
    }

    setConfig(url, key) {
        this.config = {
            baseURL: url,
            headers: {
                'Authorization': 'Bearer ' + key
            }
        };
    }

    setBaseURL(url) {
        _.extend(this.config, {
            baseURL: url
        });
    }

    setAuthKey(key) {
        _.extend(this.config.headers, {
            'Authorization': 'Bearer ' + key
        });
        this.key = key;
    }

    setParams(params, url) {
        let result = url.replace(/\{(.*?)\}/ig, (match, token) => {
            let slug = params[token];
            delete params[token];
            return slug;
        });
        //console.log('url: ', [this.root, result, params]);
        this.config.params = params ? params : {};
        return result;
    }
    setUrl(method, params, url) {
        this.refresh();
        let route = this.routing.route;
        if (url) {
            result = url;
        } else {
            let action = this.routing[method];
            result = route ? route : '';
            if (result && action) {
                result = result + '/' + action;
            } else if(action) {
                result = action;
            }
        }
        result = this.setParams(params, result);
        return this.root + result;
    }

    get(params, url) {
        return this.delay(axios.get(this.setUrl('get', params, url), this.config), 0);
    }
    load(params, url) {
        return this.delay(axios.get(this.setUrl('load', params, url), this.config), 0);
    }
    cget(params, url) {
        return this.delay(axios.get(this.setUrl('cget', params, url), this.config), 0);
    }
    send(params, url) {
        return this.delay(axios.get(this.setUrl('send', params, url), this.config), 0);
    }
    post(data, params, url) {
        return this.delay(axios.post(this.setUrl('post', params, url), data, this.config), 0);
    }
    save(data, params, url) {
        return this.delay(axios.post(this.setUrl('save', params, url), data, this.config), 0);
    }
    remove(data, params, url) {
        return this.delay(axios.post(this.setUrl('remove', params, url), data, this.config), 0);
    }
    delete(params, url) {
        return this.delay(axios.delete(this.setUrl('delete', params, url), this.config), 0);
    }
    put(data, params, url) {
        return this.delay(axios.put(this.setUrl('put', params, url), data, this.config), 0);
    }
    patch(data, params, url) {
        return this.delay(axios.patch(this.setUrl('patch', params, url), data, this.config), 0);
    }
    request(method, action, data, params, url) {
        // this.config.method = method;
        // this.config.url = this.setUrl(action, url);
        // this.config.data = data;
        // this.config.params = params;
        // return this.delay(axios.request(this.config), 0);
        if (data) {
            return this.delay(axios[method](this.setUrl(action, params, url), data, this.config), 0);
        } else {
            return this.delay(axios[method](this.setUrl(action, params, url), this.config), 0);
        }
    }
    option() {}

    delay(result, wait) {
        let msec = wait ? wait : this.wait;
        if (msec < this.wait) {
            msec = this.wait;
        }
        if(msec == 0 || typeof Promise == "undefined") {
            return result;
        }
        return new Promise((resolve, reject) => {
            _.delay(resolve, msec, result);
        });
    }

    refresh() {
        store.dispatch('LOAD_API_TOKEN');
    }
}

class ApiBun extends Api {
    constructor() {
        let key = '1234';
        let host = '/';
        super(host, key);
    }
    send(data) {

        return axios.post('mess/bun/', data, this.config);
        console.log('ApiBun Bun-Bun');
    }
}


class ApiMessages extends Api {
    constructor() {
        let key = '1234';
        let host = '/';
        super(host, key);
    }
    send(data) {
        return this.post(data, null, 'mailer/post/');
    }
}

class ApiModerator extends Api {
    constructor() {
        let key = '1234';
        let host = '/';
        super(host, key);
    }
    promt() {
        return this.post(null, null, 'moder/promt');
    }
    load() {
        return this.post(null, null, 'moder/auth');
    }
    press(data) {
        return this.post(data, null, 'moder/press');
    }
}

class ApiUser extends Api {
    constructor() {
        let key = '1234';
        let host = '/';
        super(host, key, null, null);
    }
    saveSex(sex) {
        return this.save({sex}, null, 'option/sex');
    }
    saveAge(age) {
        return super.save({age}, null, 'option/age');
    }
    saveName(name) {
        return super.save({name}, null, 'option/name');
    }
    saveCity(city) {
        return super.save({city}, null, 'option/city');
    }
    saveContacts(data) {
        return super.save({contact: data}, null, 'option/contact');
    }

    saveSearch(data) {
        data = {
            search_sex: data.who,
            years_up: data.up,
            years_to: data.to,
            option_mess_town: data.town,
            option_virt_accept: data.virt,
        };
        return super.save(data, null, 'msett/save');
    }

    syncAbout() {
        return super.load(null, 'sync/anketa');
    }
    saveAbout(data) {
        return super.save(data, null, 'option/anketa');
    }

    syncAuth() {
        return super.load(null, 'sync/authdata');
    }
    saveLogin(login) {
        return super.save({login}, null, 'option/login');
    }
    savePasswd(pass) {
        return super.save({pass}, null, 'option/passwd');
    }
    saveEmail(email) {
        return super.save({email}, null, 'option/email');
    }
    removeEmail() {
        return super.remove(null, null, 'option/demail');
    }
    saveSubscribe() {
        return super.save(null, null, 'option/subscr');
    }


    desireList() {
        return super.load(null, 'tag/user');
    }
    desireAdd(tag) {
        return super.save({tag}, null, 'tag/add');
    }
    desireDelete(id) {
        return super.remove({id}, null, 'tag/del');
    }

    visitedList() {
        return super.load(null, 'contact/visited');
    }
    visitedAdd(uid, tid) {
        return super.send({tid,uid}, 'contact/addvisit/{uid}');
    }

}

class ApiSearch extends Api {
    constructor() {
        let key = '1234';
        let host = 'http://@@API-SEARCH/';
        let routing = {
            route: 'users',
            get: '{tid}',
        };
        super(host, key, null, routing);
    }
}




class ApiContact extends Api {
    constructor(routing) {
        let key = store.state.apiToken;
        let host = 'http://@@API-CONTACT/';
        super(host, key, null, routing);
    }

    refresh() {
        store.dispatch('LOAD_API_TOKEN');
        this.setAuthKey(store.state.apiToken);
    }
}

class ApiInitial extends ApiContact {
    constructor() {
        let routing = {
            route:  'users/{uid}/initials',
        };
        super(routing);
    }
}

class ApiIntimate extends ApiContact {
    constructor() {
        let routing = {
            route: 'users/{uid}/intimates',
        };
        super(routing);
    }
}

class ApiSends extends ApiContact {
    constructor() {
        let routing = {
            route: 'users/{uid}/sends',
        };
        super(routing);
    }
}



var api = {
    user: new ApiUser(),
    search: new ApiSearch(),
    bun: new ApiBun(),
    contacts: {
        initial: new ApiInitial(),
        intimate: new ApiIntimate(),
        sends: new ApiSends(),
    },
    messages: new ApiMessages(),
    moderator: new ApiModerator(),
};



//ApiMessages.send();


// window.onbeforeunload = function(e) {
//   var dialogText = 'Вы действительно хотите покинуть приложение?';
//   e.returnValue = dialogText;
//   return dialogText;
// };

////
// РОУТЕР ==========================================================
////

// const routes = [
//     { path: '/sends-contacts', name: 'sends', component: SendsDialog, props: { quick: false } },
//     { path: '/initial-contacts', name: 'initial', component: InitialDialog, props: { quick: true } },
//     { path: '/intimate-contacts',  name: 'intimate', component: IntimateDialog, props: { quick: false },
//         // children: [
//         //     {
//         //         path: 'quick-reply',
//         //         component: HumanDialog,
//         //         props: {
//         //             show : true
//         //         }
//         //     },
//         // ]
//     }
// ];

var routes = [
    { path: '/write/:humanId(\\d+)/(.*)?', name: 'quickWrite', component: QuickMessage, props: true,
            beforeEnter: (to, from, next) => store.state.user.sex ? next() : next('/confirm-sex/message')
    },
    // { path: '/', name: 'search', component: SearchActivity,
    //     beforeEnter: (to, from, next) => store.state.user.sex ? next() : next('/confirm-sex/search'),
    //     children: [
    //         { path: ':humanId(\\d+)/(.*)?', name: 'quickMessage', meta: {back: '/search'}, component: QuickMessage, props: true },
    //     ]
    // },
    { path: '/initial/(.*)?', name: 'initial', component: InitialDialog, props: {reply: true},
        //beforeEnter: (to, from, next) => store.state.user.sex ? next() : next('/confirm-sex/messages'),
        children: [
            { path: ':humanId(\\d+)/(.*)?', name: 'quickReply', meta: {back: '/initial'}, component: QuickReply, props: true },
        ]
    },
    { path: '/intimate/(.*)?', name: 'intimate', component: IntimateDialog, props: true,
        //beforeEnter: (to, from, next) => store.state.user.sex ? next() : next('/confirm-sex/messages'),
        children: [
            { path: ':humanId(\\d+)/(.*)?', name: 'dialog', meta: {back: '/intimate'}, component: MessagesActivity, props: true,
                children: [
                    { path: 'uploads', name: 'uploads', meta: {back: '.'}, component: PhotoSettings, props: true },
                    { path: 'incoming', name: 'incoming', meta: {back: '.'}, component: IncomingPhoto, props: true },
                    // { path: 'preview', name: 'preview', component: PhotoViewer, props: true },
                ]
            },
        ]
    },
    { path: '/confirm-sex/:show?', component: SexConfirm, props: true },
    { path: '/protect', component: ModeratorActivity },

    { path: '(.*)?/settings/search', meta: {back: '/'}, component: SearchSettings,
        beforeEnter: (to, from, next) => store.state.user.sex ? next() : next('/confirm-sex/search')
    },
    { path: '(.*)?/settings/account', component: AccountSettings,
        beforeEnter: (to, from, next) => store.state.user.sex ? next() : next('/confirm-sex/account')
    },
    { path: '(.*)?/settings/other', component: OtherSettings },
    { path: '(.*)?/settings/about', meta: {back: 'other'}, component: AboutSettings },
    { path: '(.*)?/settings/social', meta: {back: 'other'}, component: SocialSettings },
    { path: '(.*)?/settings/desires', meta: {back: 'other'}, component: DesiresSettings ,
            beforeEnter: (to, from, next) => store.state.user.sex ? next() : next('/confirm-sex/search')
    },
    { path: '(.*)?/settings/security', meta: {back: 'other'}, component: SecuritySettings },
    { path: '(.*)?/wizard/city', meta: {back: '/settings/account'}, component: CityWizard,
        beforeEnter: (to, from, next) => store.state.user.sex ? next() : next('/confirm-sex/city')
    },

];

var router = new VueRouter({
  //mode: 'history',
  routes
});

// router.beforeEach((to, from, next) => {
//     console.log('router:', [to, from]);
//     next();
// });

// =================================================================
//
// =================================================================

var settingsRouter = new VueRouter({
    //mode: 'history',
    routes: [
        { path: '/search/settings/account', meta: {back: 'search'}, component: AccountSettings },

        { path: '(.*)?/:humanId(\\d+)/detail', component: AccountActivity, props: true },
        // { path: '(.*)?/uploads', component: PhotoSettings },
        // { path: '(.*)?/preview', name: 'preview', component: PhotoViewer, props: true },

        { path: '/login', name: 'login', component: LoginAccount },
    ]
});

settingsRouter.beforeEach((to, from, next) => {
    // console.log('sRouter:', [to, from]);
    if (!to.meta.back) {
        to.meta.back = from.fullPath;
    }
    next();
});

var app = new Vue({
    data: {
        alert: '',
        snackbar: {
            text: '',
            callback: null,
            action: ''
        },
    },
    mounted() {

    },
    computed: {
        humanId() {
            return humanId ? humanId : null;
        },
        simple() {
            return this.$store.state.simple;
        },
        ready() {
            return this.$store.state.ready;
        },
        promt() {
            let {promt} = this.$store.state.user;
            return !promt || promt == 'no';
        },
        tags() {
            return this.$store.getters['search/tags'];
        },
        human() {
            var result = humanData ? json.parse(humanData) : null;
            return (result && _.isObject(result) && _.has(result, 'id')) ? result : [];
        },
    },
    methods: {
        showSnackbar(text, callback, action, play) {
            console.log('snackbar', text);
            this.snackbar.text = text;
            this.snackbar.callback = callback;
            this.snackbar.action = action;
            this.snackbar.play = (play == true);
        },
        toast(text) {
            this.alert = text;
        },
        reload() {
            let home = this.$refs.results;
            home ? home.reload() : this.redirectHome();
            // Hard reload mail page to home
        },
        redirectHome() {
            console.log('Hard reload mail page to home');
            window.location = '/';
        }
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

 
$(document).ready(function() { 
    navigate.init();
});



// -- Получить новый хэш ---
var hash; 
function simple_hash() { 
  var now = new Date(); 
   hash = now.getTime();  
}



// Навигация с помошью клавиатуры
var navigate = {

    enable:  0,

    init: function ()
    {
        $(document).on('keydown', function() {
            navigate.through(event);
        });

    } ,

    // Отправка сообщения по CTRL + Enter
    post_form: function (event, formElem)
    {
        if((event.ctrlKey) && ((event.keyCode == 10)||(event.keyCode == 13))) {
            formElem.submit();
        }
    } ,

    // Навигация с помошью стрелок + CTRL
    through: function (event)
    {
        if (window.event)
            event = window.event;

        if (event.ctrlKey)
        {
            var link = null;
            var href = null;
            switch (event.keyCode ? event.keyCode : event.which ? event.which : null)
            {
                case 0x25:
                    link = '#previous_page';
                    break;
                case 0x27:
                    link = '#next_page';
                    break;
                case 0x26:
                    link = '#up_page';
                    break;
                case 0x28:
                    link = '#down_page';
                    break;
                case 0x24:
                    link = '#home_page';
                    break;
            }
            if($('a').is(link))  // alert($(link).attr('href')); return false;
                document.location = $(link).attr('href');
        }
    }

}



// -- Блокнот ---
var notepad = {

    note_block: null,
    last_click: null,
    disibled:   0,
    create:     0,

    init: function ()
    {
        if (device.width() < 1000)
        {
            notepad.disibled = 1;
        }

        notepad.disibled = get_cookie ('note_vis')*1 ? 1 : 0;   //////////////////////////

        active_textarea = $('#mess_text_val');
        notepad.note_block = $('.notepad');


        $('textarea').click( function ()
        {
            active_textarea = this;
            notepad.show();
        });

        $('#notepad_on').click( function (){ notepad.toggle_disable('on'); notepad.show('force'); });

        $('.close',notepad.note_block).click( function (){ notepad.hide(); });
        $('.post',notepad.note_block).click( function (){ notepad.toggle_disable('off'); notepad.hide(); });
        $('.bunn',notepad.note_block).click( function (){ notepad.toggle_disable('off'); notepad.hide(); });

    } ,

    hide: function ()
    {
        notepad.note_block.hide('fade');
    } ,

    show: function (force)
    {
        if (!notepad.disibled)
        if (force || (active_textarea && notepad.last_click != active_textarea))
        {
            if (notepad.create)
            {
                notepad.note_block.show('fade');
                notepad.last_click = active_textarea;        /////////////////////////////
            }
            else
                notepad.ajax_load();
        }
    } ,

    toggle_disable: function (vset)
    {
        if (vset == 'off') notepad.disibled = 1;
        if (vset == 'on' ) notepad.disibled = 0;

        if (vset)
        {
            set_cookie ('note_vis', notepad.disibled, 259200);   /////////////////////////
        }
    } ,

    ajax_load: function ()
    {
         simple_hash();
         $.get( '/ajax/load_notepad.php', { hash: hash }, notepad.on_load);
    } ,

    remind: function ()
    {
        var top  = storage.load('notepad_top');
        var left = storage.load('notepad_left');

        if (top  && top  < 40) top  = 50;
        if (left && left < 10) left = 10;
        if (top  > (device.height()-300)) top  = 0;
        if (left > (device.width()-300))  left = 0;

        if (top)  notepad.note_block.css("top",top+'px');
        if (left) notepad.note_block.css("left",left+'px');

    } ,

    on_load: function (data)
    {
           if( data.indexOf('div') > 0 )
           {
               notepad.create = 1;
               $('.notes',notepad.note_block).html( data );
               $('.note_line',notepad.note_block).click(
                   function ()
                   {
                        let text = $(this).text();
                        $(active_textarea).val(text).focus();
                        if ($(active_textarea).attr('id') == 'mess-text-area') {
                            FormMess.message = text;
                        } // TODO: жэсточайшы костыль для блокнота

//                        // Trigger a DOM 'input' event
//                        var evt = document.createEvent('HTMLEvents');
//                        evt.initEvent('input', false, true);
//                        elt.dispatchEvent(evt);
                   }
               );

               notepad.remind();

               notepad.note_block.draggable
               (
                   {
                       handle:'.title',
                       stop: function(event, ui)
                       {
                           var topOff = $(this).offset().top - $(window).scrollTop();
                           notepad.note_block.css("top",topOff);
                           storage.save('notepad_top',topOff);
                           storage.save('notepad_left',$(this).offset().left);
                       }
                   }
               );

               notepad.show();
           }

    }






}


    
// -- Обратная связь ---
var report = {    
         
    is_report:  0,   
        
    init: function () 
    {     
        $('#send_question').click( function () { report.show_quest() });
        $('#send_report').click( function () { report.show_report() }); 
        $('#send_reset').click( function () { report.hide() });      
        $('#report_text').unbind('click');      
                                        
        $('#hint_close').click( function () { report.hint_hide() }); 
    } ,

    show: function () 
    {                                 
        $('#report_send').off('click'); 
        $('#report_block').show('blind');                           
    } ,

    hide: function () 
    {             
        $('#report_block').hide('blind');                            
    } ,

    show_quest: function () 
    {                
        report.show();                   
        $('#report_send').val('Отправить вопрос'); 
        $('#report_send').on('click',report.post_quest);                                      
    } ,

    show_report: function () 
    {                                 
        report.show();     
        $('#report_send').val('Отправить отзыв');  
        $('#report_send').on('click',report.post_report);                                         
    } ,

    hint_show: function () 
    {               
        $("#hint_block").show('blind');                                           
    } ,

    hint_hide: function () 
    {                      
        $("#hint_block").hide('fade');                                       
    } ,
     
    post_quest: function ()
    {        
        report.hide();
        var text = $('#report_text').val();

        $.post
        (
            "/mailer/post/", 
            {
                mess: text, 
                id:   10336,   
                hash: hash
             },  
             report.on_post
         );  
        
         report.hint_show(); 
        
    } ,
     
    post_report: function ()
    {        
        report.hide();
        var text = $('#report_text').val();

        $.post
        (
            "/details.php?reviews", 
            {
                text_reviews: text, 
                hash: hash
             } 
        );  
       
        report.hint_show();
        $('#report_text').val(''); 
        
    } ,
     
    on_post: function (data)
    {                                // alert (data) 
        if( !data ) return 0;  
        var mess = JSON.parse( data );  
        
        if( mess.error == 'reload' ) 
        {  
            location.href = '/10336?text=' + encodeURIComponent($('#report_text').val());
        }
        $('#report_text').val(''); 
        
    }   

} 
 
