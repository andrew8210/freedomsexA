
Vue.component('search-settings', {
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
        this.selectUp = this.up ? this.up : up;
        this.selectTo = this.to ? this.to : to;
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
                this.$store.dispatch('SAVE_SEARCH', data);
            }
        },
        account() {
            this.$emit('account');
        },
        close() {
            this.save();
            this.$emit('close');
        },
    },
    template: '#search-settings',
});
