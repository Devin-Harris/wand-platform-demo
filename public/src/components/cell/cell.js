import Translator from '@/components/applications/translator'
import Weather from '@/components/applications/weather'
import Jobs from '@/components/applications/jobs'
import isDataVideo from '@/utils/isDataVideoLogic.js'

export default {
  name: 'cell',
  props: ['cell'],
  components: {
    Translator,
    Weather,
    Jobs
  },
  methods: {
    isDataVideo
  }
}