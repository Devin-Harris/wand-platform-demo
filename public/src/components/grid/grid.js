import Cell from '@/components/cell'
import Images from '@/utils/images'

export default {
  name: 'grid',
  components: {
    Cell
  },
  data() {
    return {
      centerCell: null,
      rimCells: [],
      rimCellWidth: 0,
      rimCellHeight: 0,
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
      },
      rimCount: 16,
      centerCellInterval: null,
      outerCellInterval: null,
      revolutions: 0,
      maxRevolutionCount: 1
    }
  },
  computed: {
    imagesNotInUse() {
      if (!this.rimCells || this.rimCells.length == 0 || this.rimCells.map(c => c.data).filter(c => c !== null).length == 0) return Images
      return Images.filter(image => !this.rimCells.map(cell => cell.data).includes(image.data) && (this.centerCell.data !== image.data))
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeGrid)

    this.resizeGrid()
    this.randomizeCenterCell()
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
    outerCellClicked(cell, index) {
      this.centerCell = { ...cell }
      this.stopCellInterval()
      this.startCellInterval()
      const randomImage = this.getRandomNotUsedImage()
      this.rimCells[index].data = randomImage.data
      this.rimCells[index].hyperLink = randomImage.hyperLink
    },
    mainCellClick() {
      window.open(this.centerCell.hyperLink)
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
    moveGridClockwise() {
      let clockWiseIndexOrder = [0, 1, 2, 3, 4, 6, 8, 10, 15, 14, 13, 12, 11, 9, 7, 5]

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
        if (nextPositionIndex === 1) {
          const randomImage = this.getRandomNotUsedImage()
          this.rimCells[currIndex].data = randomImage.data
          this.rimCells[currIndex].hyperLink = randomImage.hyperLink
        }
        this.rimCells = [...this.rimCells]
      }
    },
    randomizeGrid() {
      let clockWiseIndexOrder = [0, 1, 2, 3, 4, 6, 8, 10, 15, 14, 13, 12, 11, 9, 7, 5]
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
      this.centerCell = { ...this.getRandomNotUsedImage(), startingIndex: null }
    },
    resizeGrid() {
      const grid = document.querySelector('.grid')
      const bounds = grid.getBoundingClientRect()
      this.rimCellWidth = bounds.width / 5
      this.rimCellHeight = bounds.height / 5
    },
    startMovingGrid() {
      this.outerCellInterval = setInterval(this.moveGridClockwise, 1000)
    },
    stopMovingGrid() {
      this.revolutions = 0
      clearInterval(this.outerCellInterval)
      this.clearRimCells()
      this.randomizeGrid()
      // this.startMovingGrid()
    },
    startCellInterval() {
      this.centerCellInterval = setInterval(this.randomizeCenterCell, 15000)
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