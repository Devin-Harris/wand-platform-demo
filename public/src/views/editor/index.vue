<template>
  <div class="editor">
    <div v-if="!getIsLoggedIntoEditor" class="login">
      <p>Please enter the password to continue to the editor</p>
      <input type="password" :class="{'incorrect': incorrectPassword}" v-model="password" @keydown.enter.prevent="login">
      <p v-if="incorrectPassword" class="incorrect">Incorrect password. Please try again.</p>
      <button :class="{'inactive': !password}" @click="login">Login</button>
    </div>
    <div v-else class="images">
      <h1>Editor</h1>
      <button @click="$router.push('/')">Back to dashboard</button>
      <div class="content">
        <div class="centerImages">
          <h6>Center Images <i class="fas fa-plus-circle" @click="$router.push('/editor/add?isCenterImage=true')"></i></h6>
          <div class="centerImages-container">
            <div class="image" v-for="image in CENTER_IMAGES" :key="image._id"  @click="$router.push(`/editor/edit/${image._id}?isCenterImage=true`)">
              <img :src="image.data" alt="image">
            </div>
          </div>
        </div>
        <div class="rimImages">
          <h6>Rim Images <i class="fas fa-plus-circle" @click="$router.push('/editor/add?isCenterImage=false')"></i></h6>
          <div class="rimImages-container">
            <div class="image" v-for="image in RIM_IMAGES" :key="image._id"  @click="$router.push(`/editor/edit/${image._id}?isCenterImage=false`)">
              <img :src="image.data" alt="image">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./editor.js"></script>
<style src="./editor.scss" lang="scss"></style>