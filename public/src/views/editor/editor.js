import { mapActions, mapGetters } from "vuex";

export default {
  name: 'editor',
  data() {
    return {
      RIM_IMAGES: [],
      CENTER_IMAGES: [],
      password: '',
      incorrectPassword: false
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIntoEditor'])
  },
  async created() {
    this.RIM_IMAGES = await this.fetchRimImages({ ignoreLocations: true })
    this.CENTER_IMAGES = await this.fetchCenterImages({ ignoreLocations: true })
    if (this.$route.query.unauthenticated !== 'true') {
      await this.checkAuthentication()
    }
  },
  methods: {
    ...mapActions(['loginToEditor', 'fetchRimImages', 'fetchCenterImages', 'checkAuthentication']),
    async login() {
      await this.loginToEditor(this.password)
      this.password = ''
      this.incorrectPassword = !this.getIsLoggedIntoEditor
    }
  }
}