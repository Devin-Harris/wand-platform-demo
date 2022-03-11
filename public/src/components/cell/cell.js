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
  async mounted() {
    await this.setupPlayer()
  },
  methods: {
    isDataVideo,
    async cellClick() {
      if (this.cell.isMainCell != true) {
        this.$emit('cell-clicked')
        return
      }

      if (this.$refs.cellYoutubeEmbed) {
        const playerState = await this.player.getPlayerState()
        if (playerState === 1) {
          // Currently playing video, so pause video
          await this.player.pauseVideo()
        } else if (playerState === 5 || playerState === 2) {
          // Currently pausing video, so play video
          await this.player.playVideo()
        }

        if (this.cell.clickToClickThroughCount < 1 || playerState === 1) this.$emit('cell-clicked')
      } else {
        this.$emit('cell-clicked')
      }
    },
    async setupPlayer() {
      if (this.$refs.cellYoutubeEmbed) {
        this.player = new YouTubePlayer('cellYoutubeEmbed' + this.cell._id)
        let id = ''
        id = this.cell.data2.split('embed/')[1]
        id = id.split('?')[0]
        if (id) {
          this.player.loadVideoById(id);
          this.player.stopVideo()

          this.player.addEventListener('onStateChange', (e) => {
            // Video has ended
            if (e.data === 0) {
              this.$emit('youtube-video-ended')
            }
          })
        }
      }
    }
  },
  watch: {
    async cell(prev, curr) {
      if (prev._id !== curr._id) {
        this.player.pauseVideo()
        setTimeout(async () => {
          await this.setupPlayer()
        }, 100)
      }
    }
  }
}