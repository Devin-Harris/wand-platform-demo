<template>
  <div class="dropdown">
    <div class="dropdown-label" @click.stop="toggleIsDropdownOpen">{{selectedItem}} <i class="fas fa-arrow-circle-down"></i></div>

    <div v-if="isDropdownOpen" class="dropdown-popup" :class="{'grid-dropdown': isDropdownGrid}" v-click-outside="closeIsDropdownOpen" >
      <div @click="itemClick(item)" class="item" v-for="item in items" :key="keyBase + item" :class="{'selected': item === selectedItem}">
        <p>{{item}}</p>
        <i v-if="item === selectedItem" class="fas fa-check"></i>
      </div>
    </div>
  </div>
</template>

<script src='./google-dropdown.js'></script>
<style src='./google-dropdown.scss' lang="scss"></style>
