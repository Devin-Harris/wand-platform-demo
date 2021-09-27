<template>
  <div class="add">
    <h1>Add</h1>
    <p class="res" :class="{'success': res.ok}" v-if="res">{{res.message}}</p>
    <button @click="$router.go(-1)">Back</button>
    <div class="content">
      <div class="google_link">
        <p>Upload the image here</p>
        <input type="file" ref="inputFile" accept="image/*" @change="setHasFile($event)">
      </div>
      <div class="hyper_link">
        <p>Paste the images site hyperlink here</p>
        <input type="text" v-model="hyperLink">
      </div>

      <button :class="{'inactive': !canSubmit}" @click="add">Submit</button>
    </div>
  </div>
</template>

<script src="./add.js"></script>
<style src="./add.scss" lang="scss"></style>