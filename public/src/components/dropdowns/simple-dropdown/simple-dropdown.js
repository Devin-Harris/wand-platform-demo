export default {
  name: "simple-dropdown",
  props: ["items", "selectedItem", "placeholderText", "itemDisplayKey"],
  data() {
    return {
      isDropdownOpen: false,
    };
  },
  methods: {
    closeIsDropdownOpen() {
      this.isDropdownOpen = false;
    },
    toggleIsDropdownOpen() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectItem(item) {
      this.$emit("selected-item", item);
      this.closeIsDropdownOpen();
    },
  },
};
