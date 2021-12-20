<template>
  <div class="jobs">
    <h1>Jobs</h1>
    <div class="inputs">
      <div class="input">
        <div class="input_label">
          <i class="fas fa-search"></i>
          <p>Keywords</p>
        </div>
        <input type="text" v-model="keywordInput" placeholder="Job title, dept., agency, series or occupation">
      </div>
      <div class="input">
        <div class="input_label">
          <i class="fas fa-map-marker-alt"></i>
          <p>Location</p>
        </div>
        <input type="text" v-model="locationInput" placeholder="City, state, zip or country">
      </div>
    </div>
  </div>
</template>

<script src="./jobs.js"></script>
<style src="./jobs.scss" lang="scss"></style>
