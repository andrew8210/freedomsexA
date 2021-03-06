
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
