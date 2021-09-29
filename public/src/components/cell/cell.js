import Translator from '@/components/translator'
import Weather from '@/components/weather'

export default {
  name: 'cell',
  props: ['cell'],
  components:  {
    Translator,
    Weather
  }
}