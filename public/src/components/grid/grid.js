import Cell from '@/components/cell'
import Images from '@/utils/images'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'grid',
  components: {
    Cell
  },
  data() {
    return {
      RIM_IMAGES: [],
      CENTER_IMAGES: [],
      centerCell: null,
      clickToClickThroughCount: 0,
      usingLocalData: false,
      rimCells: [],
      rimCellWidth: 0,
      rimCellHeight: 0,
      gridMovingInterval: 1500,
      rimCellPositions: {
        1: { x: 0, y: 0 },
        2: { x: 1, y: 0 },
        3: { x: 2, y: 0 },
        4: { x: 3, y: 0 },
        5: { x: 4, y: 0 },
        6: { x: 4, y: 1 },
        7: { x: 4, y: 2 },
        8: { x: 4, y: 3 },
        9: { x: 4, y: 4 },
        10: { x: 3, y: 4 },
        11: { x: 2, y: 4 },
        12: { x: 1, y: 4 },
        13: { x: 0, y: 4 },
        14: { x: 0, y: 3 },
        15: { x: 0, y: 2 },
        16: { x: 0, y: 1 },
        17: { x: -1, y: 0 }
      },
      rimCount: 16,
      centerCellInterval: null,
      outerCellInterval: null,
      revolutions: 0,
      maxRevolutionCount: 1
    }
  },
  computed: {
    ...mapGetters(['getPlatform']),
    imagesNotInUse() {
      if (!this.rimCells || this.rimCells.length == 0 || this.rimCells.map(c => c.data).filter(c => c !== null).length == 0) return [...this.RIM_IMAGES, ...this.CENTER_IMAGES]
      return [...this.RIM_IMAGES, ...this.CENTER_IMAGES].filter(image => {
        return !this.rimCells.some(cell => cell.data === image.data || cell.data === image.data2) && (this.centerCell.data !== image.data)
      })
    }
  },
  async mounted() {
    this.RIM_IMAGES = await this.fetchRimImages()
    this.CENTER_IMAGES = await this.fetchCenterImages()
    if (!this.RIM_IMAGES || !this.CENTER_IMAGES) return
    this.rimCount = Object.keys(this.rimCellPositions).length
    window.addEventListener('resize', this.resizeGrid)

    this.resizeGrid()
    if (this.usingLocalData || this.getPlatform === null) {
      this.randomizeCenterCell()
    } else {
      if (this.getPlatform !== null) {
        const foundImage = this.CENTER_IMAGES.find(image => image._id === this.getPlatform.image_id)
        if (foundImage) this.centerCell = foundImage
        else this.randomizeCenterCell()
      }
    }
    this.clearRimCells()
    this.randomizeGrid()

    this.startMovingGrid()
    this.startCellInterval()
  },
  destroyed() {
    clearInterval(this.outerCellInterval)
    clearInterval(this.centerCellInterval)
    window.removeEventListener('resize', this.resizeGrid)
  },
  methods: {
    ...mapActions(['fetchRimImages', 'fetchCenterImages']),
    outerCellClicked(cell, index) {
      this.clickToClickThroughCount = 0
      this.centerCell = { ...cell }
      this.stopCellInterval()
      this.startCellInterval()
      const randomImage = this.getRandomNotUsedImage()
      this.rimCells[index].data = randomImage.data
      this.rimCells[index].hyperLink = randomImage.hyperLink
    },
    mainCellClick() {
      if (this.centerCell.data2) {
        if (this.clickToClickThroughCount > 0) {
          if (this.centerCell.data.isEmbed || this.centerCell.data.isWidget) return
          window.open(this.centerCell.hyperLink)
        } else {
          this.centerCell.data = this.centerCell.data2
          if (this.centerCell.data.isEmbed) {
            this.stopCellInterval()
          }
          this.clickToClickThroughCount += 1
        }
      } else if (this.centerCell.hyperLink) {
        window.open(this.centerCell.hyperLink)
      }
    },
    clearRimCells() {
      let arr = []
      for (let i = 0; i < this.rimCount; i++) {
        arr.push({ data: null, position: this.rimCellPositions[i + 1] })
      }
      this.rimCells = [...arr]
    },
    getRandomNotUsedImage() {
      let randomIdx = Math.floor(Math.random() * this.imagesNotInUse.length)
      return this.imagesNotInUse[randomIdx]
    },
    getRandomCenterCellImage() {
      let possibleCenterImages = [...this.CENTER_IMAGES.filter(image => this.rimCells.some(cell => image.data === cell.data))]
      if (!this.rimCells || this.rimCells.length === 0) possibleCenterImages = [...this.CENTER_IMAGES]
      let randomIdx = Math.floor(Math.random() * possibleCenterImages.length)
      return possibleCenterImages[randomIdx]
    },
    getRandomCenterCellWidget() {
      let randomIdx = Math.floor(Math.random() * Images.centerWidgets.length)
      return Images.centerWidgets[randomIdx]
    },
    isCellCorner(cell) {
      const { x, y } = cell.position
      return Boolean(
        (x == 0 && y == 0) ||
        (x == 4 && y == 0) ||
        (x == 4 && y == 4) ||
        (x == 0 && y == 4)
      )
    },
    isPrevCellCorner(cell) {
      const { x, y } = cell.position
      return Boolean(
        (x == 1 && y == 0) ||
        (x == 4 && y == 1) ||
        (x == 3 && y == 4) ||
        (x == 0 && y == 3)
      )
    },
    moveGridClockwise() {
      let clockWiseIndexOrder = [0, 1, 2, 3, 4, 5, 7, 9, 11, 16, 15, 14, 13, 12, 10, 8, 6]

      for (let i = 0; i < this.rimCount; i++) {
        let prevIndex = (i == 0) ? clockWiseIndexOrder[clockWiseIndexOrder.length - 1] : clockWiseIndexOrder[i - 1]
        let currIndex = clockWiseIndexOrder[i]

        if (currIndex == 0 && this.rimCells[prevIndex].startingIndex == 0) this.revolutions++

        const currentPositionIndex = parseInt(Object.keys(this.rimCellPositions).find(key => {
          const currentCellPosition = this.rimCells[currIndex].position
          const keyPosition = this.rimCellPositions[key]
          return (keyPosition.x == currentCellPosition.x &&
            keyPosition.y == currentCellPosition.y)
        }))
        const nextPositionIndex = (currentPositionIndex) == this.rimCount ? 1 : currentPositionIndex + 1
        this.rimCells[currIndex].position = this.rimCellPositions[nextPositionIndex]
        if (nextPositionIndex === 17) {
          const randomImage = this.getRandomNotUsedImage()
          this.rimCells[currIndex].data = randomImage.data
          if (randomImage.data2) this.rimCells[currIndex].data2 = randomImage.data2
          this.rimCells[currIndex].hyperLink = randomImage.hyperLink
          this.rimCells[currIndex].name = randomImage.name
        }
      }
      this.rimCells = [...this.rimCells]
    },
    randomizeGrid() {
      let clockWiseIndexOrder = [0, 1, 2, 3, 4, 5, 7, 9, 11, 16, 15, 14, 13, 12, 10, 8, 6]
      for (let i = 0; i < this.rimCount; i++) {
        let currIndex = clockWiseIndexOrder[i]
        this.rimCells[currIndex] = {
          ...this.getRandomNotUsedImage(),
          startingIndex: currIndex,
          position: this.rimCellPositions[i + 1]
        }
        this.rimCells = [...this.rimCells]
      }
    },
    randomizeCenterCell() {
      this.clickToClickThroughCount = 0
      this.centerCell = this.usingLocalData ? { ...this.getRandomCenterCellWidget(), startingIndex: null } : { ...this.getRandomCenterCellImage(), startingIndex: null }
    },
    resizeGrid() {
      const grid = document.querySelector('.grid')
      const bounds = grid.getBoundingClientRect()
      this.rimCellWidth = bounds.width / 5
      this.rimCellHeight = bounds.height / 5
    },
    startMovingGrid() {
      this.outerCellInterval = setInterval(this.moveGridClockwise, this.gridMovingInterval)
    },
    stopMovingGrid() {
      this.revolutions = 0
      clearInterval(this.outerCellInterval)
      this.clearRimCells()
      this.randomizeGrid()
      // this.startMovingGrid()
    },
    startCellInterval() {
      this.centerCellInterval = setInterval(this.randomizeCenterCell, 15 * this.gridMovingInterval)
    },
    stopCellInterval() {
      clearInterval(this.centerCellInterval)
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
  },
  watch: {
    revolutions() {
      if (this.revolutions === this.maxRevolutionCount) this.stopMovingGrid()
    }
  }
}