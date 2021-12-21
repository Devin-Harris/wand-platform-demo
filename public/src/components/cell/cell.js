import Translator from '@/components/applications/translator'
import Weather from '@/components/applications/weather'
import Jobs from '@/components/applications/jobs'
import isDataVideo from '@/utils/isDataVideoLogic.js'
import YouTubePlayer from 'youtube-player';

export default {
  name: 'cell',
  props: ['cell'],
  components: {
    Translator,
    Weather,
    Jobs
  },
  data() {
    return {
      player: null
    }
  },
  mounted() {
    if (this.$refs.cellYoutubeEmbed) {
      this.player = YouTubePlayer('cellYoutubeEmbed')
      let id = ''
      id = this.cell.data.split('embed/')[1]
      id = id.split('?')[0]
      this.player.loadVideoById(id);
      this.player.stopVideo()
    }
  },
  methods: {
    isDataVideo,
    async cellClick() {
      const playerState = await this.player.getPlayerState()

      if (playerState === 1) {
        // Currently playing video, so pause video
        this.player.stopVideo()
      } else if (playerState !== 1 || playerState === 2) {
        // Currently pausing video, so play video
        this.player.playVideo()
      }

      if (playerState === 1 || playerState === 2) this.$emit('cell-clicked')
    }
  }
}