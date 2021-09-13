<template>
  <div id="app">
    <fullscreen ref="fullscreen" @change="fullscreenChange">
      <button @click="toggle">Clikc</button>
      <router-view />
    </fullscreen>
  </div>
</template>

<style src="./app.scss" lang="scss"></style>
<script src="./app.js"></script>

