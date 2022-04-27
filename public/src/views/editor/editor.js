import { mapActions, mapGetters } from "vuex";
import SimpleDropdown from "@/components/dropdowns/simple-dropdown";
import COLLECTION_NAMES from "@/utils/collectionNames";
import isDataVideo from "@/utils/isDataVideoLogic.js";

export default {
  name: "editor",
  components: {
    SimpleDropdown,
  },
  data() {
    return {
      RIM_IMAGES: [],
      CENTER_IMAGES: [],
      password: "",
      incorrectPassword: false,
      platformDomain: "",
      platformName: "",
      platformImageCollection: null,
      platformMainImage: "",
      newCollectionInfo: {
        name: null,
        duplicate_from_collection: null,
        action: "create",
      },
      loading: false,
      collections: null,
    };
  },
  computed: {
    ...mapGetters(["getIsLoggedIntoEditor", "getPlatform"]),
  },
  async mounted() {
    await this.fetchPlatform();
    if (this.getPlatform) {
      await this.setupData();
    }
  },
  methods: {
    ...mapActions([
      "loginToEditor",
      "fetchRimImages",
      "fetchCenterImages",
      "checkAuthentication",
      "fetchPlatform",
      "updatePlatformInfo",
      "fetchCollections",
      "createCollection",
      "deleteCollection",
    ]),
    isDataVideo,
    async setupData() {
      this.loading = true;
      this.RIM_IMAGES = await this.fetchRimImages({ ignoreLocations: true });
      this.CENTER_IMAGES = await this.fetchCenterImages({
        ignoreLocations: true,
      });
      const { response: collections } = await this.fetchCollections();
      this.collections = collections.filter(
        (collection) => !collection.is_deleted
      );
      if (this.$route.query.unauthenticated !== "true") {
        await this.checkAuthentication();
      }

      this.platformDomain = this.getPlatform?.domain;
      this.platformName = this.getPlatform?.name;
      this.platformImageCollection = this.getPlatform?.images_collection;
      this.platformMainImage = this.CENTER_IMAGES.find(
        (image) => image._id === this.getPlatform?.image_id
      );

      this.loading = false;
    },
    async login() {
      await this.loginToEditor(this.password);
      this.password = "";
      this.incorrectPassword = !this.getIsLoggedIntoEditor;
    },
    async updatePlatform() {
      await this.updatePlatformInfo({
        domain: this.platformDomain,
        name: this.platformName,
        images_collection: this.platformImageCollection,
      });
    },
    setPlatformCollection(collection) {
      this.platformImageCollection = collection;
    },
    setNewCollectionAction(newCollectionAction) {
      this.newCollectionInfo.action = newCollectionAction;
      if (newCollectionAction === "duplicate" && this.newCollectionInfo) {
        this.newCollectionInfo.duplicate_from_collection = this.collections[0];
      } else {
        this.newCollectionInfo.duplicate_from_collection = null;
      }
    },
    setNewCollectionDuplicateFrom(newCollectionDuplicateFromName) {
      const collectionToDuplicateFrom = this.collections.find(
        (collection) =>
          collection.collection_name === newCollectionDuplicateFromName
      );
      this.newCollectionInfo.duplicate_from_collection = collectionToDuplicateFrom;
    },
    async createNewCollection() {
      await this.createCollection(this.newCollectionInfo);
      const { response: collections } = await this.fetchCollections();
      this.collections = collections.filter(
        (collection) => !collection.is_deleted
      );
      this.newCollectionInfo.name = "";
    },
    async deleteCollectionClick(collection) {
      const response = await this.deleteCollection(collection);
      const { response: collections } = await this.fetchCollections();
      this.collections = collections.filter(
        (collection) => !collection.is_deleted
      );

      if (response.ok) {
        const defaultCollection = this.collections.find(
          (collection) => collection.is_default_collection
        );
        this.setPlatformCollection(defaultCollection);
        await this.updatePlatform();
      }
    },
  },
  watch: {
    async getPlatform() {
      if (this.getPlatform) {
        await this.setupData();
      }
    },
  },
};
