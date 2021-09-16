export default {
  name: 'app',
  mounted() {
  },
  methods: {
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