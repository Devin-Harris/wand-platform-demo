<template>
  <div class="simple-dropdown">
    <div class="simple-dropdown_label" @click.stop="toggleIsDropdownOpen">
      <p :class="{ placeholder: !selectedItem }">
        {{
          selectedItem
            ? itemDisplayKey
              ? selectedItem[itemDisplayKey]
              : selectedItem
            : placeholderText
        }}
      </p>
      <i
        class="fas fa-chevron-down"
        :class="{ 'rotated-up': isDropdownOpen }"
      ></i>
    </div>

    <div v-if="isDropdownOpen" class="arrow"></div>
    <div
      v-if="isDropdownOpen"
      class="simple-dropdown_items"
      v-click-outside="closeIsDropdownOpen"
    >
      <div
        v-for="item in items"
        :key="itemDisplayKey ? item[itemDisplayKey] : item"
        class="simple-dropdown_items_item"
        :class="{
          selected: itemDisplayKey
            ? selectedItem[itemDisplayKey] === item[itemDisplayKey]
            : selectedItem === item,
        }"
        @click="selectItem(item)"
      >
        <p>{{ itemDisplayKey ? item[itemDisplayKey] : item }}</p>
        <i
          class="fas fa-check"
          :class="{
            shown: itemDisplayKey
              ? selectedItem[itemDisplayKey] === item[itemDisplayKey]
              : selectedItem === item,
          }"
        ></i>
      </div>
    </div>
  </div>
</template>

<script src="./simple-dropdown.js"></script>
<style src="./simple-dropdown.scss" lang="scss"></style>
