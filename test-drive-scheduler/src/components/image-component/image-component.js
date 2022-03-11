export default {
  name: 'image-component',
  props: {
    image: null
  },
  data() {
    return {
      showingDetails: false
    }
  },
  methods: {
    showDetails() {
      this.showingDetails = true
      this.smartPositionDetails()
    },
    hideDetails() {
      this.showingDetails = false
      this.$refs.details.classList.remove('top-details')
    },
    smartPositionDetails() {
      this.$nextTick(() => {
        const detailsBounds = this.$refs.details.getBoundingClientRect()
        const isDetailsOffBottomOfScreen = detailsBounds.bottom + 16 > window.innerHeight - window.scrollY
        const isDetailsOffTopOfScreen = detailsBounds.top - 32 < window.scrollY

        if (isDetailsOffBottomOfScreen && !isDetailsOffTopOfScreen) {
          this.$refs.details.classList.add('top-details')
          this.$nextTick(() => {
            const newDetailsBounds = this.$refs.details.getBoundingClientRect()
            const newIsDetailsOffTopOfScreen = newDetailsBounds.top - 32 < window.scrollY
            if (newIsDetailsOffTopOfScreen) this.$refs.details.classList.remove('top-details')
          })
        } else {
          this.$refs.details.classList.remove('top-details')
        }
      })
    }
  }
}