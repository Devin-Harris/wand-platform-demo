import { mapActions, mapGetters } from "vuex";
import SimpleDropdown from '@/components/dropdowns/simple-dropdown'
import APPLICATION_NAMES from '@/utils/applicationNames.js'

export default {
  name: 'add',
  components: {
    SimpleDropdown
  },
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
      action: 'hyperLink',
      isMainImageForDomain: false,
      APPLICATION_NAMES: APPLICATION_NAMES,
      isLoading: false,
      locations: [],
      ignoreLocations: false,
      searchText: '',
      searchResults: [],
      isSearching: false,
      isHyperLinkVideo: false,
      videoHyperLink: ''
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIntoEditor']),
    canSubmit() {
      return Boolean(
        (this.hasFile || (this.isHyperLinkVideo && this.videoHyperLink)) &&
        (this.hyperLink || (this.iframeLink || this.applicationEmbedName))
      )
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
  },
  methods: {
    ...mapActions(['loginToEditor', 'addImage', 'googleMapsSearch']),
    mapYoutubeUrl(url) {
      const splits = url.split('v=')
      const id = splits[splits.length - 1]

      return 'https://www.youtube.com/embed/' + id
    },
    async add() {
      this.isLoading = true

      if (this.isHyperLinkVideo) {
        this.videoHyperLink = this.mapYoutubeUrl(this.videoHyperLink)
      }

      const res = await this.addImage({
        file: this.$refs.inputFile && this.$refs.inputFile.files[0] ? this.$refs.inputFile.files[0] : null,
        hyperLink: this.hyperLink,
        isHyperLinkVideo: this.isHyperLinkVideo,
        videoHyperLink: this.videoHyperLink,
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
          isMainImageForDomain: this.isMainImageForDomain
        }
      })
      this.res = res
      if (this.$refs.inputFile) this.$refs.inputFile.value = null
      this.hyperLink = ''
      this.isLoading = false
    },
    setHasFile(e) {
      this.hasFile = Boolean(e.target.value)
    },
    setAction(action) {
      this.hyperLink = ''
      this.iframeLink = ''
      this.applicationEmbedName = ''
      this.action = action
    },
    async search() {
      this.isSearching = true
      const { results } = await this.googleMapsSearch(this.searchText)
      this.searchResults = results
      this.isSearching = false
      this.searchText = ''
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
    }
  }
}