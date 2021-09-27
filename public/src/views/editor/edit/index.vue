<template>
  <div class="edit">
    <h1>Edit</h1>
    <p class="res" :class="{'success': res.ok}" v-if="res">{{res.message}}</p>
    <button @click="$router.go(-1)">Back</button>
    <div class="content">
      <div class="google_link">
        <img :src="dataLink" alt="Current Image">
        <p>Upload a new image here</p>
        <input type="file" ref="inputFile" accept="image/*" @change="setHasFile($event)">
      </div>
      <div class="hyper_link">
        <p>Paste the images site hyperlink here</p>
        <input type="text" v-model="hyperLink">
      </div>

      <button :class="{'inactive': !canSubmit}" @click="edit">Update this ad</button>
      <button class="delete" @click="deleteImage">Delete Image</button>
    </div>
  </div>
</template>

<script src="./edit.js"></script>
<style src="./edit.scss" lang="scss"></style>