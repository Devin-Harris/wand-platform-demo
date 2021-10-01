import Translator from '@/components/applications/translator'
import Weather from '@/components/applications/weather'

export default {
  name: 'cell',
  props: ['cell'],
  components:  {
    Translator,
    Weather
  }
}