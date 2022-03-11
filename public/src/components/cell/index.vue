<template>
  <div
    v-if="cell && (cell.data || cell.videoHyperLink)"
    class="cell"
    @click="cellClick()"
    :class="{
      canClick: !cell.data || (!cell.data.isWidget && !cell.data.isEmbed),
    }"
  >
    <div
      v-if="!cell.data || (!cell.data.isWidget && !cell.data.isEmbed)"
      class="overlay"
    >
      <p>{{ cell.name }}</p>
    </div>
    <iframe
      v-if="cell.data && cell.data.isWidget"
      :src="cell.data.data"
    ></iframe>
    <component
      v-else-if="cell.data && cell.data.isEmbed"
      :is="cell.data.component"
    ></component>
    <div
      v-else-if="
        cell.isHyperLinkVideo &&
        cell.isMainCell &&
        cell.clickToClickThroughCount <= 1
      "
      :style="{ height: 'calc(100% - 1px)', width: 'calc(100% - 1px)' }"
    >
      <div
        ref="cellYoutubeEmbed"
        :id="'cellYoutubeEmbed' + cell._id"
        height="100%"
        width="100%"
      />
    </div>
    <video v-else-if="isDataVideo(cell.data)" controls autoplay muted>
      <source :src="cell.data" />
      Your browser does not support the video tag.
    </video>
    <img
      v-else
      :src="cell.data"
      :alt="'unable to load image at ' + cell.data + ' address'"
    />
  </div>
</template>

<script src="./cell.js"></script>
<style src="./cell.scss" lang="scss"></style>
