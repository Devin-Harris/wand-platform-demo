<template>
  <div class="simple-dropdown">
    <div class="simple-dropdown_label" @click.stop="toggleIsDropdownOpen">
      <p :class="{'placeholder': !selectedItem}">{{selectedItem ? selectedItem : placeholderText }}</p>
      <i class="fas fa-chevron-down" :class="{'rotated-up': isDropdownOpen}"></i>
    </div>

    <div v-if="isDropdownOpen" class="arrow"></div>
    <div v-if="isDropdownOpen" class="simple-dropdown_items" v-click-outside="closeIsDropdownOpen">
      <div v-for="item in items" :key="item" class="simple-dropdown_items_item" :class="{'selected': selectedItem === item }" @click="selectItem(item)">
        <p>{{item}}</p>
        <i class="fas fa-check" :class="{'shown': selectedItem === item}"></i>
      </div>
    </div>
  </div>
</template>

<script src="./simple-dropdown.js"></script>
<style src="./simple-dropdown.scss" lang="scss"></style>
