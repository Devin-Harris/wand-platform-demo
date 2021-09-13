export default {
  name: 'app',
  data() {
    return {
      button: null
    }
  },
  mounted() {
    this.createUserGesture()
  },
  destroyed() {
    this.button.removeEventListener('click', this.toggle)
    this.button.remove()
  },
  methods: {
    createUserGesture() {
      this.button = document.createElement('button')
      this.button.addEventListener('click', this.toggle)
      this.button.click()
    },
    toggle() {
      this.$refs['fullscreen'].toggle([true]) // recommended
      // this.fullscreen = !this.fullscreen // deprecated
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen
    }
  }
}