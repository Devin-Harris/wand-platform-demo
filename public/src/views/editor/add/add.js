import { mapActions, mapGetters } from "vuex";

export default {
  name: 'add',
  data() {
    return {
      googleLink: '',
      hasFile: false,
      hyperLink: '',
      res: null
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIntoEditor']),
    canSubmit() {
      return Boolean(this.hasFile && this.hyperLink)
    }
  },
  async created() {
    if (!this.getIsLoggedIntoEditor) this.$router.push('/editor')
  },
  methods: {
    ...mapActions(['loginToEditor', 'addImage']),
    async add() {
      // const formattedGoogleLink = `https://drive.google.com/uc?id=${this.getGoogleLinkId()}`
      const res = await this.addImage({
        file: this.$refs.inputFile.files[0],
        hyperLink: this.hyperLink,
        isCenterImage: Boolean(this.$route.query.isCenterImage)
      })
      this.res = res
      this.$refs.inputFile.value = null
      this.hyperLink = ''
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