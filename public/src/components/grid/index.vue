<template>
  <div class="grid-container">
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
    <div v-else class="grid" ref="grid">
      <cell
        v-for="(cell, index) in rimCells"
        :key="cell._id + '-' + index"
        :cell="cell"
        :style="{
          width: rimCellWidth + 'px',
          height: rimCellHeight + 'px',
          position: 'absolute',
          top: cell.position.y * rimCellHeight + 'px',
          left: cell.position.x * rimCellWidth + 'px',
          'z-index': isCellCorner(cell)
            ? '2'
            : isPrevCellCorner(cell)
            ? '1'
            : '5',
        }"
        class="outer-cell"
        @cell-clicked="outerCellClicked(cell, index)"
      ></cell>
      <cell
        v-if="centerCell"
        class="main-cell"
        :key="centerCell._id + '-main-cell'"
        :cell="centerCell"
        :style="{
          width: 3 * rimCellWidth - 24 + 'px',
          height: 3 * rimCellHeight - 24 + 'px',
          position: 'absolute',
          top: rimCellHeight + 12 + 'px',
          left: rimCellWidth + 12 + 'px',
        }"
        @cell-clicked="mainCellClick(centerCell)"
        @youtube-video-ended="handleYoutubeVideoEnd()"
      ></cell>
    </div>
    <div class="grid-bottom-right-text">
      <p>patent pending</p>
    </div>
  </div>
</template>

<script src="./grid.js"></script>
<style src="./grid.scss" lang="scss"></style>
