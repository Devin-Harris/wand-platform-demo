<template>
  <div class="edit">
    <h1>Edit</h1>
    <p class="res" :class="{'success': res.ok}" v-if="res">{{res.message}}</p>
    <button @click="$router.go(-1)">Back</button>
    <div class="content">
      <div class="input-container">
        <img :src="dataLink" alt="Current Image">
        <p>Upload a new image here</p>
        <input type="file" ref="inputFile" accept="image/*" @change="setHasFile($event)">
      </div>
      <div class="input-container name">
        <p>Image name</p>
        <input type="text" v-model="name">
      </div>
      <div class="input-container locations">
        <p>Locations</p>
        <div class="ignoreLocations">
          <input type="checkbox" v-model="ignoreLocations">
          <p @click="ignoreLocations = !ignoreLocations">Ignore all</p>
        </div>
        <div class="search-field" :class="{'ignored': ignoreLocations}" v-click-outside="() => searchResults = []">
          <div class="field">
            <input type="text" v-model="searchText" :placeholder="'Search for a place'" v-debounce:1s="search" :debounce-events="['input']" @input="isSearching = true">
            <i class="fas fa-search"></i>
          </div>
          <div v-if="searchResults.length > 0 || isSearching" class="search-popup">
            <div v-if="isSearching" class="loading-search">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div v-else class="results">
              <div v-for="result in searchResults" :key="result.place_id" class="result" @click="resultClick(result)">
                <div class="icon" :style="{'backgroundColor': result.icon_background_color}">
                  <img :src="result.icon" :alt="result.icon">
                </div>
                <div class="text">
                  <h4>{{result.name}}</h4>
                  <p>{{result.formatted_address}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="choosen-locations" :class="{'ignored': ignoreLocations}">
          <div v-for="location in locations" :key="location.formatted_address" class="location">
            <div class="sides">
              <div class="lhs">
                <h4>{{location.name}}</h4>
                <p>{{location.formatted_address}}</p>
              </div>
              <div class="rhs">
                <i class="fas fa-trash" @click="removeLocation(location)"></i>
              </div>
            </div>
            <div class="radius">
              <p>Radius</p>
              <input type="text" v-model="location.radius">
              <div class="units">
                <p :class="{'selected': location.radiusUnit === 'km'}" @click="setUnitForLocation(location, 'km')">Km</p>
                <p :class="{'selected': location.radiusUnit === 'mi'}" @click="setUnitForLocation(location, 'mi')">Mi</p>
              </div>
            </div>
          </div>
        </div>
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
          <p>Select one of the application embeds here</p>
          <simple-dropdown :items="APPLICATION_NAMES ? APPLICATION_NAMES : []" :selectedItem="applicationEmbedName" :placeholderText="'Please select an application'" @selected-item="applicationEmbedName = $event" />
        </div>
      </div>

      


      <div v-if="isCenterImage" class="platform-info">
        <input type="checkbox" v-model="isMainImageForDomain">
        <p @click="isMainImageForDomain = !isMainImageForDomain">Main image for domain: <span>{{ domain }}</span></p>
      </div>


      <button :class="{'inactive': !canSubmit}" @click="edit">Update this ad</button>
      <button class="delete" @click="deleteImage">Delete Image</button>
    </div>

    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  </div>
</template>

<script src="./edit.js"></script>
<style src="./edit.scss" lang="scss"></style>