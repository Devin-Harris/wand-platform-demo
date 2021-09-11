<template>
  <div class="grid">
    <cell
      v-for="(cell, index) in rimCells"
      :key="cell.data + index"
      :cell="cell"
      :style="{
        width: rimCellWidth + 'px',
        height: rimCellHeight + 'px',
        position: 'absolute',
        top: cell.position.y * rimCellHeight + 'px',
        left: cell.position.x * rimCellWidth + 'px',
        zIndex: index === 0 ? '-1' : '1'
      }"
      class="outer-cell"
      @cell-clicked="outerCellClicked(cell, index)"
    ></cell>
    <cell
      class="main-cell"
      :cell="centerCell"
      :style="{
        width: 2.75 * rimCellWidth + 'px',
        height: 2.75 * rimCellHeight + 'px',
        position: 'absolute',
        top: 1.125 * rimCellHeight + 'px',
        left: 1.125 * rimCellWidth + 'px',
      }"
      @cell-clicked="mainCellClick"
    ></cell>
  </div>
</template>

<script src="./grid.js"></script>
<style src="./grid.scss" lang="scss"></style>
