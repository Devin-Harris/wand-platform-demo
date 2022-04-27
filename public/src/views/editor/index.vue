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
                <video v-if="isDataVideo(image)" :src="image.data" />
                <img
                  v-else
                  :src="image.data"
                  :alt="'unable to load image at ' + image.data + ' address'"
                />
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
                <img
                  v-else
                  :src="image.data"
                  :alt="'unable to load image at ' + image.data + ' address'"
                />
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
                <h4>Image collection</h4>
                <simple-dropdown
                  v-if="collections && platformImageCollection"
                  :itemDisplayKey="'display_name'"
                  :items="collections"
                  :selectedItem="platformImageCollection"
                  :placeholderText="'Please select a collection'"
                  @selected-item="setPlatformCollection($event)"
                />
              </div>
            </div>
            <button @click="updatePlatform">Update platform data</button>
          </div>
          <div class="collections">
            <h6>Collection info</h6>
            <div class="collections-container">
              <div class="collection-field">
                <h4>Collections</h4>
                <div class="collection-info">
                  <div
                    class="collection"
                    v-for="collection in collections"
                    :key="collection._id"
                  >
                    <p>
                      {{
                        collection.display_name
                          ? collection.display_name
                          : collection.collection_name
                      }}
                      <span v-if="collection.is_default_collection">
                        *Default collection
                      </span>
                    </p>
                    <i
                      v-if="!collection.is_default_collection"
                      class="fas fa-trash"
                      @click="deleteCollectionClick(collection)"
                    ></i>
                  </div>
                </div>
              </div>

              <div class="collection-field newCollection">
                <h4>New collection</h4>

                <div class="creation-type">
                  <div
                    class="radio-button"
                    @click.stop="setNewCollectionAction('create')"
                  >
                    <div
                      class="radio-button_circle"
                      :class="{
                        selected: newCollectionInfo.action === 'create',
                      }"
                    ></div>
                    <div class="radio-button_text">Create</div>
                  </div>
                  <div
                    class="radio-button"
                    @click.stop="setNewCollectionAction('duplicate')"
                  >
                    <div
                      class="radio-button_circle"
                      :class="{
                        selected: newCollectionInfo.action === 'duplicate',
                      }"
                    ></div>
                    <div class="radio-button_text">Duplicate</div>
                  </div>
                </div>

                <simple-dropdown
                  v-if="
                    collections &&
                      newCollectionInfo &&
                      newCollectionInfo.duplicate_from_collection &&
                      newCollectionInfo.action === 'duplicate'
                  "
                  :items="collections.map((c) => c.collection_name)"
                  :selectedItem="
                    newCollectionInfo.duplicate_from_collection.collection_name
                  "
                  :placeholderText="'Please select a collection'"
                  @selected-item="setNewCollectionDuplicateFrom($event)"
                />
                <div v-if class="new-collection">
                  <input type="text" v-model="newCollectionInfo.name" />
                  <div class="collection-creation-container">
                    <button @click="createNewCollection()">
                      {{
                        newCollectionInfo.action === "duplicate"
                          ? "Duplicate"
                          : "Create"
                      }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./editor.js"></script>
<style src="./editor.scss" lang="scss"></style>
