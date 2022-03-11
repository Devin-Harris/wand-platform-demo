<template>
  <div
    v-if="image"
    class="image-component"
    @mouseenter="showDetails()"
    @mouseleave="hideDetails()"
  >
    <img class="main-image" :src="image.data" :alt="image.data" />
    <div
      :class="{ shown: showingDetails }"
      class="hover-details"
      ref="details"
      @click.stop
    >
      <div class="arrow"></div>
      <i>More info here...</i>
      <br />
      <br />

      <em>2021 Mazda</em>
      <br />
      <strong>Mazda CX-5 Grand Touring</strong>
      <br />
      <em>$35,320</em>
      <br />
      <br />

      <p>2.5L SKYACTIVÂ®</p>
      <p>4-Cylinder DOHC 16V Engine</p>
      <p>6-Speed Automatic</p>
      <p>24/30 mpg City/Hwy</p>

      <img class="larger-image" :src="image.data" :alt="image.data" />
      <br />
      <br />
      <strong>Dealer and Wand Address:</strong>
      <br>
      <em>Investment Building, 239 Fourth Ave Suite 1414, Pittsburgh, PA 15222</em>
    </div>
  </div>
</template>

<script src="./image-component.js"></script>
<style src="./image-component.scss" lang="scss"></style>
