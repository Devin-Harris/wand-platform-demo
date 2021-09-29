import { mapActions, mapGetters } from "vuex";

export default {
  name: 'add',
  data() {
    return {
      hasFile: false,
      dataLink: '',
      hyperLink: '',
      iframeLink: '',
      applicationEmbedName: '',
      hyperLink: '',
      res: null,
      name: '',
      action: null
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIntoEditor']),
    canSubmit() {
      return Boolean(this.hasFile && (this.hyperLink || (this.iframeLink || this.applicationEmbedName)))
    }
  },
  async created() {
    if (!this.getIsLoggedIntoEditor) this.$router.push('/editor')
  },
  methods: {
    ...mapActions(['loginToEditor', 'addImage']),
    async add() {
      const res = await this.addImage({
        file: this.$refs.inputFile.files[0],
        hyperLink: this.hyperLink,
        isCenterImage: Boolean(this.$route.query.isCenterImage),
        locations: [],
        name: this.name,
        data2Info: {
          action: this.action,
          hyperLink: this.hyperLink,
          iframeLink: this.iframeLink,
          applicationEmbedName: this.applicationEmbedName,
          file: this.$refs.actionInputFile.files[0] ? this.$refs.actionInputFile.files[0] : null,
        }
      })
      this.res = res
      this.$refs.inputFile.value = null
      this.hyperLink = ''
    },
    setHasFile(e) {
      this.hasFile = Boolean(e.target.value)
    },
    setAction(action) {
      this.hyperLink = ''
      this.iframeLink = ''
      this.applicationEmbedName = ''
      this.action = action
    }
  }
}