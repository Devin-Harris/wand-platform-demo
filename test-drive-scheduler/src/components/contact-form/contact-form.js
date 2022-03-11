import { mapActions } from "vuex";
import ImageSelection from '@/components/image-selection'

export default {
  name: 'contact-form',
  components: {
    ImageSelection
  },
  data() {
    return {
      form: {
        name: { value: '', label: 'Name', type: 'text', required: true },
        email: { value: '', label: 'Email', type: 'email', required: true },
        telephone: { value: '', label: 'Telephone', type: 'telephone', required: false },
        occupation: { value: '', label: 'Occupation', type: 'text', required: true },
        yearsEmployed: { value: null, label: 'Years Employed', type: 'text', required: true },
        annualIncome: { value: '', label: 'Annual Income', type: 'text', required: true },
        additionalIncome: { value: '', label: 'Additional Income', type: 'text', required: false },
        creditScore: {
          value: 'Very Good (725-800)',
          label: 'Credit (FICO) Score',
          type: 'select',
          selections: [
            'Very Good (725-800)',
            'Good (675-724)',
            'Fair (600-674)'
          ],
          required: true
        },
        prequalify: {
          value: 'Yes',
          label: 'Prequalify for an Auto Loan',
          type: 'select',
          selections: [
            'Yes',
            'No',
            'Maybe',
          ],
          required: true
        },
        date: { value: '', label: 'Test Drive Date', type: 'date', required: true },
        time: { value: '', label: 'Test Drive Time', type: 'time', required: true },
      },
      scheduleCheckbox: false,
      termsCheckbox: false,
      images: [],
      selectedImages: [],
      error: '',
      success: ''
    }
  },
  async mounted() {
    await this.fetchPlatform()
    this.images = await this.fetchRimImages();
    setTimeout(() => this.$emit('contact-form-ready'), 500)
  },
  computed: {
    canSubmit() {
      return Boolean(
        this.selectedImages.length === 3 &&
        Object.keys(this.form).filter(k => this.form[k].required && (this.form[k].value === null || this.form[k].value === '')).length === 0 &&
        this.termsCheckbox
      )
    },
    selectedImagesString() {
      return this.selectedImages.map((image, index) => {
        return `${index + 1}) ${image.data}`
      }).join('\n')
    }
  },
  methods: {
    ...mapActions(['fetchRimImages', 'fetchPlatform', 'sendContactForm', 'getRedirectUri']),
    async submitForm() {
      this.success = ''
      this.error = ''

      const formValues = {}
      Object.keys(this.form).forEach(key => {
        formValues[key] = this.form[key].value
      })

      const response = await this.sendContactForm({
        ...formValues,
        termsCheckbox: this.termsCheckbox,
        scheduleCheckbox: this.scheduleCheckbox,
        imageData: this.selectedImages
      })

      if (response.status === 200) {
        this.resetForm()
        this.success = response.message

        // Redirect to redirect_uri
        setTimeout(async () => {
          const redirectUri = await this.getRedirectUri()
          window.open(redirectUri)
        }, 3000)
      } else {
        this.error = response.message
      }

      setTimeout(() => {
        this.resetMessages()
      }, 3000)
    },
    imageIsSelected(image) {
      return this.selectedImages.some(img => img._id === image._id)
    },
    toggleImageSelection(image) {
      if (this.imageIsSelected(image)) {
        this.selectedImages = this.selectedImages.filter(img => img._id !== image._id)
      } else {
        if (this.selectedImages.length < 3) {
          this.selectedImages.push(image)
        }
      }
    },
    resetForm() {
      this.success = ''
      this.error = ''
      this.form.name.value = ''
      this.form.email.value = ''
      this.form.telephone.value = ''
      this.form.occupation.value = ''
      this.form.yearsEmployed.value = null
      this.form.annualIncome.value = ''
      this.form.additionalIncome.value = ''
      this.form.creditScore.value = 'Very Good (725-800)'
      this.form.prequalify.value = 'Prequalify for an Auto Loan'
      this.termsCheckbox = false
      this.cheduleCheckbox = false
      this.selectedImages = []
    },
    resetMessages() {
      this.success = ''
      this.error = ''
    }
  },
}