<template>
  <div class="contact-form">
    <div class="title">
      <slot></slot>
    </div>
    <p class="message error-message" v-if="error">{{ error }}</p>
    <p class="message success-message" v-else-if="success">
      {{ success }}
    </p>
    <div class="contact-form-container">
      <div
        v-if="images && images.length >= 3"
        class="image-selection-container"
      >
        <image-selection
          :images="images"
          :selectedImages="selectedImages"
          @toggle-image="toggleImageSelection($event)"
        >
          <span class="image-selection-title"
            ><span class="required">*</span> Select 3 items</span
          >
        </image-selection>
      </div>
      <div class="form-container">
        <div v-for="key in Object.keys(form)" :key="key" class="form-group">
          <label :for="key"
            ><span v-if="form[key].required" class="required">*</span>
            {{ form[key].label }}</label
          >
          <input
            v-if="
              form[key].type === 'text' ||
              form[key].type === 'email' ||
              form[key].type === 'telephone' ||
              form[key].type === 'time' ||
              form[key].type === 'date'
            "
            :name="key"
            :type="form[key].type"
            v-model="form[key].value"
            @change="resetMessages()"
          />
          <textarea
            v-else-if="form[key].type === 'textbox'"
            :name="key"
            v-model="form[key].value"
            @change="resetMessages()"
          />
          <select
            v-else-if="form[key].type === 'select'"
            :name="key"
            v-model="form[key].value"
            @change="resetMessages()"
          >
            <option
              v-for="option in form[key].selections"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <div class="preferences form-group">
          <label for="preferences">Test Drive Vehicle Preferences</label>
          <textarea name="preferences" :value="selectedImagesString" readonly />
        </div>

        <div class="schedule-check-box">
          <label for="terms" @click="scheduleCheckbox = !scheduleCheckbox">
            <input
              type="checkbox"
              name="schedule"
              v-model="scheduleCheckbox"
              @change="resetMessages()"
            />
            I want to schedule a Test Drive
          </label>
        </div>
        <div class="terms-check-box">
          <label for="terms" @click="termsCheckbox = !termsCheckbox">
            <input
              type="checkbox"
              name="terms"
              v-model="termsCheckbox"
              @change="resetMessages()"
            />
            I agree to the Terms and Conditions
          </label>
        </div>

        <button :class="{ disabled: !canSubmit }" @click="submitForm">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script src="./contact-form.js"></script>
<style src="./contact-form.scss" lang="scss"></style>
