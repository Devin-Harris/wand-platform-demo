<template>
  <div
    v-if="cell && cell.data"
    class="cell"
    @click="$emit('cell-clicked')"
    :class="{ canClick: !cell.data.isWidget && !cell.data.isEmbed }"
  >
    <div v-if="!cell.data.isWidget && !cell.data.isEmbed" class="overlay">
      <p>{{ cell.name }}</p>
    </div>
    <iframe v-if="cell.data.isWidget" :src="cell.data.data"></iframe>
    <component
      v-else-if="cell.data.isEmbed"
      :is="cell.data.component"
    ></component>
    <div
      v-else-if="cell.isHyperLinkVideo"
      :style="{ height: '100%', width: '100%' }"
    >
      <embed
        :src="cell.data"
        height="100%"
        width="100%"
        @click="console.log('hi')"
      />
    </div>
    <video v-else-if="isDataVideo(cell.data)" controls autoplay muted>
      <source :src="cell.data" />
      Your browser does not support the video tag.
    </video>
    <img v-else :src="cell.data" alt="image" />
  </div>
</template>

<script src="./cell.js"></script>
<style src="./cell.scss" lang="scss"></style>
