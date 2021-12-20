import { mapActions, mapGetters } from "vuex"
import SimpleDropdown from '@/components/dropdowns/simple-dropdown'
import APPLICATION_NAMES from '@/utils/applicationNames.js'
import isDataVideo from '@/utils/isDataVideoLogic.js'

export default {
  name: 'edit',
  components: {
    SimpleDropdown
  },
  data() {
    return {
      dataLink: '',
      hyperLink: '',
      iframeLink: '',
      applicationEmbedName: '',
      name: '',
      hasFile: false,
      res: null,
      action: null,
      isMainImageForDomain: false,
      APPLICATION_NAMES: APPLICATION_NAMES,
      isLoading: false,
      locations: [],
      ignoreLocations: false,
      searchText: '',
      searchResults: [],
      isSearching: false,
      outerClickThruCount: 0,
      centerClickThruCount: 0,
      isHyperLinkVideo: false,
      videoHyperLink: ''
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIntoEditor', 'getPlatform']),
    canSubmit() {
      return Boolean(this.hyperLink || this.applicationEmbedName || this.iframeLink)
    },
    domain() {
      return window.location.origin
    },
    isCenterImage() {
      return this.$route.query.isCenterImage === 'true'
    }
  },
  async created() {
    if (!this.getIsLoggedIntoEditor) this.$router.push('/editor')
    await this.setupData()
  },
  methods: {
    ...mapActions(['loginToEditor', 'fetchImageById', 'updateImageById', 'deleteImageById', 'googleMapsSearch']),
    isDataVideo,
    mapYoutubeUrl(url) {
      const splits = url.split('v=')
      const id = splits[splits.length - 1]

      return 'https://www.youtube.com/embed/' + id
    },
    async edit() {
      this.isLoading = true

      if (this.isHyperLinkVideo) {
        this.videoHyperLink = this.mapYoutubeUrl(this.videoHyperLink)
      }

      const res = await this.updateImageById({
        id: this.$route.params.id,
        payload: {
          file: this.$refs.inputFile && this.$refs.inputFile.files[0] ? this.$refs.inputFile.files[0] : null,
          isHyperLinkVideo: this.isHyperLinkVideo,
          videoHyperLink: this.videoHyperLink,
          prevDataPath: this.dataLink,
          hyperLink: this.hyperLink,
          isCenterImage: this.isCenterImage,
          ignoreLocations: this.ignoreLocations,
          locations: this.locations,
          name: this.name,
          data2Info: {
            action: this.action,
            hyperLink: this.hyperLink,
            iframeLink: this.iframeLink,
            applicationEmbedName: this.applicationEmbedName,
            file: this.$refs.actionInputFile && this.$refs.actionInputFile.files[0] ? this.$refs.actionInputFile.files[0] : null,
          },
          platformInfo: {
            domain: this.domain,
            isMainImageForDomain: this.isMainImageForDomain,
            image_id: this.$route.params.id
          }
        }
      })
      this.res = res.image
      if (this.isHyperLinkVideo) {
        this.dataLink = res.data
      } else {
        this.dataLink = res.data
        if (this.$refs.inputFile) this.$refs.inputFile.value = null
      }
      this.hyperLink = res.hyperLink
      this.isLoading = false
    },
    async deleteImage() {
      this.isLoading = true
      const res = await this.deleteImageById(this.$route.params.id)
      this.res = res
      this.isLoading = false
    },
    setHasFile(e) {
      this.hasFile = Boolean(e.target.value)
    },
    setAction(action) {
      this.action = action
    },
    async search() {
      this.isSearching = true
      const { results } = await this.googleMapsSearch(this.searchText)
      this.searchResults = results
      this.isSearching = false
    },
    resultClick(result) {
      result.radius = 10 // Default of 10000 meters
      result.radiusUnit = 'km' // Default of km
      this.locations.push(result)
      this.searchResults = []
      this.isSearching = false
      this.searchText = ''
    },
    removeLocation(location) {
      this.locations = this.locations.filter(l => l.place_id !== location.place_id)
    },
    setUnitForLocation(location, unit) {
      if (unit === location.radiusUnit) return
      if (unit === 'mi') {
        location.radius = location.radius * 1000 / 1609.34 // convert km to meters then meters to mi
      } else if (unit === 'km') {
        location.radius = location.radius * 1609.34 / 1000 // convert mi to meters then meters to km
      }
      location.radiusUnit = unit
    },
    async setupData() {
      const res = await this.fetchImageById(this.$route.params.id)
      if (!res) return
      this.res = res
      this.dataLink = res.data
      this.isHyperLinkVideo = res.isHyperLinkVideo
      if (this.isHyperLinkVideo) this.videoHyperLink = this.dataLink
      this.name = res.name
      this.hyperLink = res.hyperLink
      this.locations = res.locations
      this.ignoreLocations = res.ignoreLocations
      this.outerClickThruCount = res.outerClickThruCount ?? 0
      this.centerClickThruCount = res.centerClickThruCount ?? 0
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

      this.isMainImageForDomain = (this.getPlatform && this.getPlatform.image_id === this.$route.params.id)
    }
  },
  watch: {
    async getPlatform() {
      if (this.getPlatform) {
        await this.setupData()
      }
    }
  }
}