<template>
  <div class="cell" @click="$emit('cell-clicked')">
    <img :src="cell.data">
  </div>
</template>

<script src="./cell.js"></script>
<style src="./cell.scss" lang="scss"></style>
