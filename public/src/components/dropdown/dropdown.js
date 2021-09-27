export default {
  name: 'dropdown',
  props: ['selectedItem', 'items', 'isDropdownGrid', 'keyBase'],
  data() {
    return {
      isDropdownOpen: false
    }
  },
  methods: {
    itemClick(item) {
      this.$emit('item-selected', item)
      this.closeIsDropdownOpen()
    },
    closeIsDropdownOpen() {
      this.isDropdownOpen = false
    },
    toggleIsDropdownOpen() {
      this.isDropdownOpen = !this.isDropdownOpen
    }
  }
}