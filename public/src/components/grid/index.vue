<template>
  <div class="grid">
    <cell v-for="(cell, index) in rimCells"
      :key="cell.data + index"
      :cell="cell"
      class="outer-cell"
      @cell-clicked="cellClicked(cell, index)"
    ></cell>
    <cell :cell="centerCell" class="main-cell"></cell>
  </div>
</template>

<script src="./grid.js"></script>
<style src="./grid.scss" lang="scss"></style>
