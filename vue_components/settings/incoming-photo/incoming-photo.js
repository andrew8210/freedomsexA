
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
