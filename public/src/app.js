import { mapActions } from "vuex";

export default {
  name: 'app',
  async mounted() {
    const {platform} = await this.fetchPlatform()
    console.log(platform)
    if (platform.google_meta_content_id) {
      const meta = document.createElement('meta')
      meta.name = 'google-site-verification'
      meta.content = platform.google_meta_content_id
      document.head.appendChild(meta)
    }
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