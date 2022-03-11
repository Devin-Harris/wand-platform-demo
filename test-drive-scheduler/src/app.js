import { mapActions } from "vuex";

export default {
  name: 'app',
  async created() {
    await this.fetchPlatform()
  },
  methods: {
    ...mapActions(['fetchPlatform']),
  }
}