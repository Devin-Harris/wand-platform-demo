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
    this.RIM_IMAGES = await this.fetchRimImages()
    this.CENTER_IMAGES = await this.fetchCenterImages()
  },
  methods: {
    ...mapActions(['loginToEditor', 'fetchRimImages', 'fetchCenterImages']),
    async login() {
      await this.loginToEditor(this.password)
      this.password = ''
      this.incorrectPassword = !this.getIsLoggedIntoEditor
    }
  }
}