<template>
  <div class="add">
    <h1>Add</h1>
    <p class="res" :class="{'success': res.ok}" v-if="res">{{res.message}}</p>
    <button @click="$router.go(-1)">Back</button>
    <div class="content">
      <div class="input-container google_link">
        <p>Upload the image here</p>
        <input type="file" ref="inputFile" accept="image/*" @change="setHasFile($event)">
      </div>
      <div class="input-container name">
        <p>Image name</p>
        <input type="text" v-model="name">
      </div>

      <p class="action-label">On click action</p>
      <div class="action-selection">
        <div class="radio-button" @click.stop="setAction('hyperLink')">
          <div class="radio-button_circle" :class="{'selected': action === 'hyperLink'}"></div>
          <div class="radio-button_text">HyperLink</div>
        </div>
        <div class="radio-button" @click.stop="setAction('image')">
          <div class="radio-button_circle" :class="{'selected': action === 'image'}"></div>
          <div class="radio-button_text">Image</div>
        </div>
        <div class="radio-button" @click.stop="setAction('iframe')">
          <div class="radio-button_circle" :class="{'selected': action === 'iframe'}"></div>
          <div class="radio-button_text">Iframe</div>
        </div>
        <div class="radio-button" @click.stop="setAction('application')">
          <div class="radio-button_circle" :class="{'selected': action === 'application'}"></div>
          <div class="radio-button_text">Application</div>
        </div>
      </div>
      <div class="actions">
        <div v-if="action === 'image'" class="input-container image">
          <p>Upload a new image here</p>
          <input type="file" ref="actionInputFile" accept="image/*">
        </div>
        <div v-if="action === 'hyperLink' || action === 'image'" class="input-container hyper_link">
          <p>Paste the images site hyperlink here</p>
          <input type="text" v-model="hyperLink">
        </div>
        <div v-if="action === 'iframe'" class="input-container iframe">
          <p>Paste the iframe site hyperlink here</p>
          <input type="text" v-model="iframeLink">
        </div>
        <div v-if="action === 'application'" class="input-container application">
          <p>Type the name of the application embed here</p>
          <input type="text" v-model="applicationEmbedName">
        </div>
      </div>

      <button :class="{'inactive': !canSubmit}" @click="add">Submit</button>
    </div>
  </div>
</template>

<script src="./add.js"></script>
<style src="./add.scss" lang="scss"></style>