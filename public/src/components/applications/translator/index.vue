<template>
  <div class="translator">
    <div class="translation-boxs">
      <div class="input">
        <google-dropdown :selectedItem="detectedLang ? detectedLang.name : inputLang.name" :items="availableLangNames" @item-selected="selectInputLang($event)" :isDropdownGrid="true" :keyBase="'input'" />
        <textarea name="inputPhrase" id="inputPhrase" v-model="inputPhrase" cols="30" rows="10" v-debounce:1s="translate" :debounce-events="['input']" @input="setLoadingOutput"></textarea>
        <div class="character-count">
          <p>{{inputPhrase.length}} / {{characterLimit}}</p>
        </div>
      </div>
      <div class="output">
        <google-dropdown :selectedItem="outputLang.name" :items="availableLangNames"  @item-selected="selectOutputLang($event)" :isDropdownGrid="true" :keyBase="'output'" />
        <div disabled name="outputPhrase" id="outputPhrase" cols="30" rows="10">
          <div v-if="loadingOutput" class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading</p>
          </div>
          <div v-else class="text" >{{outputPhrase}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./translator.js"></script>
<style src="./translator.scss" lang="scss"></style>
