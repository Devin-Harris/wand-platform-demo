<template>
  <div class="cell" @click="$emit('cell-clicked')" :class="{'canClick': !cell.data.isWidget && !cell.data.isEmbed}">
    <div v-if="!cell.data.isWidget && !cell.data.isEmbed" class="overlay"></div>
    <iframe v-if="cell.data.isWidget" :src="cell.data.data"></iframe>
    <component v-else-if="cell.data.isEmbed" :is="cell.data.component"></component>
    <img v-else :src="cell.data">
  </div>
</template>

<script src="./cell.js"></script>
<style src="./cell.scss" lang="scss"></style>
