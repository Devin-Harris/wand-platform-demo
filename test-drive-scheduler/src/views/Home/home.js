import ContactForm from '@/components/contact-form'

export default {
  name: 'home',
  components: {
    ContactForm
  },
  data() {
    return {
      contactFormReady: false,
      showContactForm: false,
      showPulse: false
    }
  },
  computed: {
    showingContactForm() {
      return this.contactFormReady && this.showContactForm
    }
  },
  methods: {
    getVideoBackground() {
      return require('@/assets/budd_baer.mp4')
    }
  }
}