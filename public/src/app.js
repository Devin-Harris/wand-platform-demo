import { mapActions } from "vuex";

export default {
  name: 'app',
  async created() {
    await this.fetchPlatform()
  },
  methods: {
    ...mapActions(['fetchPlatform']),
    toggle() {
      const elem = document.querySelector('body')
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.error(err));
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    }
  }
}