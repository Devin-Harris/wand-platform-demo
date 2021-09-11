<template>
  <div class="grid">
    <div v-for="cell in rimCells" :key="cell" class="outer-cell"></div>
    <div class="main-cell"></div>
  </div>
</template>

<script src="./grid.js"></script>
<style src="./grid.scss" lang="scss"></style>
