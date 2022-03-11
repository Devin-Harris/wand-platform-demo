<template>
  <div class="image-selection">
    <slot></slot>
    <div class="images-container">
      <div
        v-for="image in images"
        :key="image._id"
        class="image"
        :class="{ selected: imageIsSelected(image) }"
        @click="toggleImageSelection(image)"
      >
        <image-component :image="image"></image-component>
      </div>
    </div>
  </div>
</template>

<script src="./image-selection.js"></script>
<style src="./image-selection.scss" lang="scss"></style>
