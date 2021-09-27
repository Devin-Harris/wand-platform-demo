import { mapActions, mapGetters } from "vuex";

export default {
  name: 'edit',
  data() {
    return {
      dataLink: '',
      hyperLink: '',
      hasFile: false,
      res: null
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
    this.hyperLink = res.hyperLink
  },
  methods: {
    ...mapActions(['loginToEditor', 'fetchImageById', 'updateImageById', 'deleteImageById']),
    async edit() {
      // const formattedGoogleLink = `https://drive.google.com/uc?id=${this.getGoogleLinkId()}`
      const res = await this.updateImageById({
        id: this.$route.params.id,
        payload: {
          file: this.$refs.inputFile.files[0],
          prevDataPath: this.dataLink,
          hyperLink: this.hyperLink,
          isCenterImage: Boolean(this.$route.query.isCenterImage)
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
    getGoogleLinkId() {
      if (!this.googleLink) return null
      return (this.googleLink.includes('/d/') && this.googleLink.includes('/view?usp=sharing'))
        ? this.googleLink.split('/d/')[1].split('/view?usp=sharing')[0]
        : this.googleLink.includes('?id=')
          ? this.googleLink.split('?id=')[1]
          : null
    },
    setHasFile(e) {
      this.hasFile = Boolean(e.target.value)
    }
  }
}