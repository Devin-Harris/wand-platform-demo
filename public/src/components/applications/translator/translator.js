import { mapActions } from 'vuex'
import GoogleDropdown from '@/components/dropdowns/google-dropdown'

export default {
  name: 'translator',
  components: {
    GoogleDropdown
  },
  data() {
    return {
      inputLang: { code: '00', name: 'Detect language' },
      isInputLangsOpen: false,
      outputLang: { code: 'fr', name: 'French' },
      isOutputLangsOpen: false,
      inputPhrase: '',
      outputPhrase: 'Translation',
      availableLangs: [],
      detectedLang: null,
      loadingOutput: false,
      characterLimit: 100
    }
  },
  computed: {
    availableLangNames() {
      const names = this.availableLangs.map(({ name }) => name)
      const namesSet = new Set(names)
      return Array.from(namesSet)
    }
  },
  async mounted() {
    this.availableLangs = await this.getLanguageCodes()
    this.availableLangs = [{ code: '00', name: 'Detect language' }, ...this.availableLangs]
  },
  methods: {
    ...mapActions(['tranlateText', 'getLanguageCodes']),
    async translate() {
      this.loadingOutput = false

      if (this.inputPhrase === '') {
        this.outputPhrase = 'Translation'
        return
      }

      let res
      if (this.inputLang.code === '00') {
        res = await this.tranlateText({ text: this.inputPhrase, options: { to: this.outputLang.code } })
      } else {
        res = await this.tranlateText({ text: this.inputPhrase, options: { from: this.inputLang.code, to: this.outputLang.code } })
      }
      this.outputPhrase = res.translation
      if (res.detectedSourceLanguage && res.detectedSourceLanguage !== this.inputLang.code) {
        this.detectedLang = this.availableLangs.find(lang => lang.code === res.detectedSourceLanguage)
      }
    },
    async selectInputLang(itemName) {
      this.detectedLang = null
      this.inputLang = this.availableLangs.find(lang => lang.name === itemName)
      await this.translate()
    },
    async selectOutputLang(itemName) {
      this.outputLang = this.availableLangs.find(lang => lang.name === itemName)
      await this.translate()
    },
    setLoadingOutput() {
      if (this.inputPhrase.length > this.characterLimit) this.inputPhrase = this.inputPhrase.substring(0, this.inputPhrase.length - 1)
      this.loadingOutput = true
    }
  }
}