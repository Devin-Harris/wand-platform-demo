<template>
  <div class="home">
    <div class="background-container">
      <video autoplay muted loop :src="getVideoBackground()"></video>
    </div>

    <div v-if="!showContactForm" class="display-contact-form-btn">
      <div v-if="showPulse" class="pulse"></div>
      <div
        class="btn-container"
        @mouseenter="showPulse = true"
        @mouseleave="showPulse = false"
        @click="showContactForm = true"
      >
        <i class="fas fa-eye"></i>
        <p>Schedule a Test Drive</p>
      </div>
    </div>

    <contact-form
      :class="{ shown: showingContactForm }"
      class="contact-form-container"
      @contact-form-ready="contactFormReady = true"
    >
      <h1>Schedule a Test Drive</h1>
    </contact-form>
  </div>
</template>

<script src="./home.js"></script>
<style src="./home.scss" lang="scss" scoped></style>
