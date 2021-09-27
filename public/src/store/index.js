import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import api from '@/api/api'
const IMAGE_BASE_URL = 'https://wandadvertising.com/ads/'

export default new Vuex.Store({
  state: {
    isLoggedIntoEditor: false
  },
  getters: {
    getIsLoggedIntoEditor(state) {
      return state.isLoggedIntoEditor
    }
  },
  mutations: {
    setIsLoggedIntoEditor(state, isLoggedIntoEditor) {
      state.isLoggedIntoEditor = isLoggedIntoEditor
    }
  },
  actions: {
    addImage({ dispatch }, { hyperLink, file, isCenterImage }) {
      return new Promise(async (resolve, reject) => {
        try {
          const uploadResponse = await dispatch('uploadImage', file)
          const data = IMAGE_BASE_URL + uploadResponse.name
          const res = await fetch(api + '/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data,
              hyperLink,
              isCenterImage
            })
          })
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    uploadImage(_, file) {
      return new Promise(async (resolve, reject) => {
        const formData = new FormData()
        formData.append(file.name, file)
        try {
          const res = await fetch(api + '/upload', {
            method: 'POST',
            body: formData
          })
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    async fetchImageById(_, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/image/' + id)
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    async fetchCenterImages() {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/center-images')
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    async fetchRimImages() {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/rim-images')
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    async loginToEditor({ commit }, password) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/editor-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "password": password
            })
          })
          const json = await res.json()
          commit('setIsLoggedIntoEditor', json.ok)
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    deleteImageById(_, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/delete/' + id, {
            method: 'DELETE'
          })
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    deleteImageByPath(_, path) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/delete-path', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path })
          })
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    updateImageById({ dispatch }, { id, payload }) {
      const { prevDataPath, file, hyperLink, isCenterImage } = payload
      return new Promise(async (resolve, reject) => {
        try {
          let body = {
            hyperLink,
            isCenterImage
          }
          if (file) {
            const uploadResponse = await dispatch('uploadImage', file)
            const data = IMAGE_BASE_URL + uploadResponse.name
            body.data = data
            await dispatch('deleteImageByPath', prevDataPath)
          }

          const res = await fetch(api + '/edit/' + id, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          })
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    tranlateText(_, { text, options }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, options })
          })
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    getLanguageCodes() {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/languages', {
            method: 'GET'
          })
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
})
