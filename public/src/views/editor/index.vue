<template>
  <div class="editor">
    <div v-if="!getIsLoggedIntoEditor" class="login">
      <p>Please enter the password to continue to the editor</p>
      <input
        type="password"
        :class="{ incorrect: incorrectPassword }"
        v-model="password"
        @keydown.enter.prevent="login"
      />
      <p v-if="incorrectPassword" class="incorrect">
        Incorrect password. Please try again.
      </p>
      <button :class="{ inactive: !password }" @click="login">Login</button>
    </div>
    <div v-else class="images">
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <div v-else class="editor-container">
        <h1>Editor</h1>
        <button @click="$router.push('/')">Back to dashboard</button>
        <div class="content">
          <div class="centerImages">
            <h6>
              Center Images
              <i
                class="fas fa-plus-circle"
                @click="$router.push('/editor/add?isCenterImage=true')"
              ></i>
            </h6>
            <div class="centerImages-container">
              <div
                class="image"
                v-for="image in CENTER_IMAGES"
                :key="image._id"
                @click="
                  $router.push(`/editor/edit/${image._id}?isCenterImage=true`)
                "
              >
                <div v-if="image.isHyperLinkVideo">
                  <embed :src="image.data" height="100%" width="100%" />
                </div>
                <video v-else-if="isDataVideo(image)" :src="image.data" />
                <img v-else :src="image.data" alt="image" />
              </div>
            </div>
            <div v-if="CENTER_IMAGES.length === 0" class="no-images">
              <p>No center images set</p>
            </div>
          </div>
          <div class="rimImages">
            <h6>
              Rim Images
              <i
                class="fas fa-plus-circle"
                @click="$router.push('/editor/add?isCenterImage=false')"
              ></i>
            </h6>
            <div class="rimImages-container">
              <div
                class="image"
                v-for="image in RIM_IMAGES"
                :key="image._id"
                @click="
                  $router.push(`/editor/edit/${image._id}?isCenterImage=false`)
                "
              >
                <video v-if="isDataVideo(image)" :src="image.data" />
                <img v-else :src="image.data" alt="image" />
              </div>
            </div>
            <div v-if="RIM_IMAGES.length === 0" class="no-images">
              <p>No rim images set</p>
            </div>
          </div>
          <div class="platform">
            <h6>Platform info</h6>
            <div class="platform-container">
              <div class="platform-field domain">
                <h4>Domain</h4>
                <input type="text" disabled v-model="platformDomain" />
              </div>
              <div class="platform-field mainImage">
                <h4>Main Image</h4>
                <div
                  class="image-container"
                  @click="
                    $router.push(
                      `/editor/edit/${platformMainImage._id}?isCenterImage=true`
                    )
                  "
                >
                  <img
                    v-if="platformMainImage && platformMainImage.data"
                    :src="platformMainImage.data"
                    alt="platform main image"
                  />
                </div>
                <p v-if="!platformMainImage || !platformMainImage.data">
                  No main image set
                </p>
              </div>
              <div class="platform-field name">
                <h4>Name</h4>
                <input type="text" v-model="platformName" />
              </div>
              <div class="platform-field imageCollection">
                <h4>Image collection name</h4>
                <simple-dropdown
                  :items="collectionNames"
                  :selectedItem="platformImageCollectionName"
                  :placeholderText="'Please select an collection'"
                  @selected-item="platformImageCollectionName = $event"
                />
                <!-- <input type="text" v-model="platformImageCollectionName"> -->
              </div>
            </div>
            <button @click="updatePlatform">Update platform data</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./editor.js"></script>
<style src="./editor.scss" lang="scss"></style>