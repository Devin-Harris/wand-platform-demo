import { mapActions } from 'vuex'
import Dropdown from '@/components/dropdown'

export default {
  name: 'weather',
  components: {
    Dropdown
  },
  data() {
    return {
      locationInput: '',
      mutatingLocationInput: '',
      loadedEmbed: 1
    }
  },
  computed: {
    
  },
  mounted() {
    window.addEventListener('resize', this.resizeEmbeds)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEmbeds)
  },
  methods: {
    resizeEmbeds() {
      if (!this.locationInput) return
      const weather = document.querySelector('.weather')
      const weatherBounds = weather?.getBoundingClientRect()
      const buttons = document.querySelector('.buttons')
      const buttonsBounds = buttons?.getBoundingClientRect()
      const embedChooser = document.querySelector('.embed-chooser')
      const embedChooserBounds = embedChooser?.getBoundingClientRect()
      
      
      const info = document.querySelector('.info')
      if (info) {
        info.style.height = window.outerWidth > 768
          ? (weatherBounds?.height - (buttonsBounds?.height + embedChooserBounds?.height)) + 'px'
          : 'auto'
      }
    },
    setLocationInput() {
      this.locationInput = this.mutatingLocationInput
      setTimeout(() => {
        this.resizeEmbeds()
      }, 10)
    },
    setLoadedEmbed(i) {
      this.loadedEmbed = i
      this.resizeEmbeds()
    }
  }
}