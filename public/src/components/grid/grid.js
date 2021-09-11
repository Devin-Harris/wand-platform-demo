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
      rimCount: 16,
      centerCellInterval: null,
      outerCellInterval: null,
      revolutions: 0,
      maxRevolutionCount: 1,
      revolutionCellTrackerIndex: null
    }
  },
  computed: {
    imagesNotInUse() {
      if (!this.rimCells || this.rimCells.length == 0 || this.rimCells.map(c => c.data).filter(c => c !== null).length == 0) return Images
      return Images.filter(image => !this.rimCells.map(cell => cell.data).includes(image) && (this.centerCell.data !== image))
    }
  },
  created() {
    this.randomizeCenterCell()
    this.startMovingGrid()
    this.centerCellInterval = setInterval(this.randomizeCenterCell, 15000)
  },
  destroyed() {
    clearInterval(this.outerCellInterval)
    clearInterval(this.centerCellInterval)
  },
  async mounted() {
    this.clearRimCells()
    this.randomizeGrid()
  },
  methods: {  
    cellClicked(cell, index) {
      this.centerCell = cell
      this.rimCells[index].data = this.getRandomNotUsedImage()
    },
    clearRimCells() {
      let arr = []
      for (let i = 0; i < this.rimCount; i++) {
        arr.push({ data: null })
      }
      this.rimCells = [...arr]
    },
    getRandomNotUsedImage() {
      let randomIdx = Math.floor(Math.random() * this.imagesNotInUse.length)
      return this.imagesNotInUse[randomIdx]
    },
    moveGridClockwise() {
      let originalCells = [...this.rimCells]
      let clockWiseIndexOrder = [0, 1, 2, 3, 4, 6, 8, 10, 15, 14, 13, 12, 11, 9, 7, 5]
      for (let i = 0; i < this.rimCount; i++) {
        let prevIndex = i == 0 ? clockWiseIndexOrder[clockWiseIndexOrder.length - 1] : clockWiseIndexOrder[i - 1]
        let currIndex = clockWiseIndexOrder[i]
        let nextIndex = i == clockWiseIndexOrder.length - 1 ? clockWiseIndexOrder[0] : clockWiseIndexOrder[i + 1]

        if (currIndex == 0 && this.rimCells[prevIndex].startingIndex == 0) this.revolutions++
        
        this.rimCells[currIndex] = originalCells[prevIndex]
        this.rimCells[nextIndex] = originalCells[currIndex]
        this.rimCells = [...this.rimCells]
      }
    },
    randomizeGrid() {
      let clockWiseIndexOrder = [0, 1, 2, 3, 4, 6, 8, 10, 15, 14, 13, 12, 11, 9, 7, 5]
      for (let i = 0; i < this.rimCount; i++) {
        let currIndex = clockWiseIndexOrder[i]
        this.rimCells[currIndex] = { data: this.getRandomNotUsedImage(), startingIndex: currIndex }
        this.rimCells = [...this.rimCells]
      }
    },
    randomizeCenterCell() {
      this.centerCell = { data: this.getRandomNotUsedImage(), startingIndex: null }
    },
    startMovingGrid() {
      this.outerCellInterval = setInterval(this.moveGridClockwise, 1000)
    },
    stopMovingGrid() {
      this.revolutions = 0
      clearInterval(this.outerCellInterval)
      this.clearRimCells()
      this.randomizeGrid()
      this.startMovingGrid()
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