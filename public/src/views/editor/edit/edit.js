import { mapActions, mapGetters } from "vuex";

export default {
  name: 'edit',
  data() {
    return {
      dataLink: '',
      hyperLink: '',
      iframeLink: '',
      applicationEmbedName: '',
      name: '',
      hasFile: false,
      res: null,
      action: null
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIntoEditor']),
    canSubmit() {
      return Boolean(this.hyperLink)
    }
  },
  async created() {
    if (!this.getIsLoggedIntoEditor) this.$router.push('/editor')
    const res = await this.fetchImageById(this.$route.params.id)
    this.dataLink = res.data
    this.name = res.name
    this.hyperLink = res.hyperLink
    if (res.hyperLink && !res.data2) {
      this.action = 'hyperLink'
    } else if (res.hyperLink && !res.data2.isWidget && !res.data2.isEmbed) {
      this.action = 'image'
      this.dataLink = res.data2
    } else if (res.data2.isWidget) {
      this.action = 'iframe'
      this.iframeLink = res.data2.data
    } else if (res.data2.isEmbed) {
      this.action = 'application'
      this.applicationEmbedName = res.data2.component
    } else {
      this.action = null
    }
  },
  methods: {
    ...mapActions(['loginToEditor', 'fetchImageById', 'updateImageById', 'deleteImageById']),
    async edit() {
      const res = await this.updateImageById({
        id: this.$route.params.id,
        payload: {
          file: this.$refs.inputFile.files[0],
          prevDataPath: this.dataLink,
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
        }
      })
      this.res = res
      this.dataLink = res.image.data
      this.$refs.inputFile.value = null
      this.hyperLink = res.image.hyperLink
    },
    async deleteImage() {
      const res = await this.deleteImageById(this.$route.params.id)
      this.res = res
    },
    setHasFile(e) {
      this.hasFile = Boolean(e.target.value)
    },
    setAction(action) {
      this.action = action
    }
  }
}