import { mapActions, mapGetters } from "vuex";
import SimpleDropdown from '@/components/dropdowns/simple-dropdown'
import COLLECTION_NAMES from '@/utils/collectionNames'
import isDataVideo from '@/utils/isDataVideoLogic.js'

export default {
  name: 'editor',
  components: {
    SimpleDropdown
  },
  data() {
    return {
      RIM_IMAGES: [],
      CENTER_IMAGES: [],
      password: '',
      incorrectPassword: false,
      platformDomain: '',
      platformName: '',
      platformImageCollectionName: '',
      platformMainImage: '',
      loading: false,
      collectionNames: COLLECTION_NAMES
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIntoEditor', 'getPlatform'])
  },
  async mounted() {
    if (this.getPlatform) {
      await this.setupData()
    }
  },
  methods: {
    ...mapActions(['loginToEditor', 'fetchRimImages', 'fetchCenterImages', 'checkAuthentication', 'fetchPlatform', 'updatePlatformInfo']),
    isDataVideo,
    async setupData() {
      this.loading = true
      this.RIM_IMAGES = await this.fetchRimImages({ ignoreLocations: true })
      this.CENTER_IMAGES = await this.fetchCenterImages({ ignoreLocations: true })
      if (this.$route.query.unauthenticated !== 'true') {
        await this.checkAuthentication()
      }

      this.platformDomain = this.getPlatform?.domain
      this.platformName = this.getPlatform?.name
      this.platformImageCollectionName = this.getPlatform?.images_collection_name
      this.platformMainImage = this.CENTER_IMAGES.find(image => image._id === this.getPlatform?.image_id)

      this.loading = false
    },
    async login() {
      await this.loginToEditor(this.password)
      this.password = ''
      this.incorrectPassword = !this.getIsLoggedIntoEditor
    },
    async updatePlatform() {
      await this.updatePlatformInfo({
        domain: this.platformDomain,
        name: this.platformName,
        images_collection_name: this.platformImageCollectionName
      })
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