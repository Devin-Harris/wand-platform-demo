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
        'z-index': isCellCorner(cell) ? '2' : isPrevCellCorner(cell) ? '1' : '5'
      }"
      class="outer-cell"
      @cell-clicked="outerCellClicked(cell, index)"
    ></cell>
    <cell
      v-if="centerCell"
      class="main-cell"
      :cell="centerCell"
      :style="{
        width: 3 * rimCellWidth - 24 + 'px',
        height: 3 * rimCellHeight - 24 + 'px',
        position: 'absolute',
        top: rimCellHeight + 12 + 'px',
        left: rimCellWidth + 12 + 'px',
      }"
      @cell-clicked="mainCellClick"
    ></cell>
  </div>
</template>

<script src="./grid.js"></script>
<style src="./grid.scss" lang="scss"></style>
