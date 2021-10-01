import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import api from '@/api/api'
const IMAGE_BASE_URL = 'https://wandadvertising.com/ads/'

export default new Vuex.Store({
  state: {
    isLoggedIntoEditor: false,
    platform: null,
  },
  getters: {
    getIsLoggedIntoEditor(state) {
      return state.isLoggedIntoEditor
    },
    getPlatform(state) {
      return state.platform
    }
  },
  mutations: {
    setIsLoggedIntoEditor(state, isLoggedIntoEditor) {
      state.isLoggedIntoEditor = isLoggedIntoEditor
    },
    setPlatform(state, platform) {
      state.platform = platform
    }
  },
  actions: {
    addImage({ dispatch, commit }, { hyperLink, file, isCenterImage, locations, ignoreLocations, name, data2Info, platformInfo }) {
      return new Promise(async (resolve, reject) => {
        try {

          let data2 = null
          if (data2Info.action === 'image') {
            const uploadResponse = await dispatch('uploadImage', data2Info.file)
            const data = IMAGE_BASE_URL + uploadResponse.name
            data2 = data
          } else if (data2Info.action === 'iframe') {
            data2 = { data: data2Info.iframeLink, isWidget: true }
          } else if (data2Info.action === 'application') {
            data2 = { component: data2Info.applicationEmbedName, isEmbed: true }
          }

          // format locations
          const formattedLocations = locations.map(location => {
            return {
              radius: location?.radius,
              radiusUnit: location?.radiusUnit,
              place_id: location?.place_id,
              latitude: location?.geometry?.location?.lat,
              longitude: location?.geometry?.location?.lng,
              name: location?.name,
              formatted_address: location?.formatted_address
            }
          })

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
              isCenterImage,
              ignoreLocations,
              locations: formattedLocations,
              name,
              data2
            })
          })
          const json = await res.json()

          platformInfo.image_id = json.image._id
          const platformRes = await dispatch('updatePlatformInfo', platformInfo)
          if (!platformRes.ok) resolve(platformRes)
          else commit('setPlatform', platformRes.platform)

          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    checkAuthentication({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/auth-check', {
            method: 'GET',
            credentials: 'include'
          })
          const json = await res.json()
          await commit('setIsLoggedIntoEditor', json.ok)
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
    async fetchCenterImages(_, { ignoreLocations = false } = false) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/center-images?ignoreLocations=' + ignoreLocations)
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    async fetchRimImages(_, { ignoreLocations = false } = false) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/rim-images?ignoreLocations=' + ignoreLocations)
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    async fetchPlatform({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/platform')
          const json = await res.json()
          commit('setPlatform', json.platform)
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    async googleMapsSearch(_, query) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + '/google-maps-search/' + encodeURI(query))
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
            credentials: 'include',
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
    updateImageById({ commit, dispatch }, { id, payload }) {
      const { prevDataPath, file, hyperLink, isCenterImage, locations, ignoreLocations, name, data2Info, platformInfo } = payload
      return new Promise(async (resolve, reject) => {
        try {
          let data2 = null
          if (data2Info.action === 'image') {
            const uploadResponse = await dispatch('uploadImage', data2Info.file)
            const data = IMAGE_BASE_URL + uploadResponse.name
            data2 = data
          } else if (data2Info.action === 'iframe') {
            data2 = { data: data2Info.iframeLink, isWidget: true }
          } else if (data2Info.action === 'application') {
            data2 = { component: data2Info.applicationEmbedName, isEmbed: true }
          }
          
          // format locations
          const formattedLocations = locations.map(location => {
            return {
              radius: location?.radius,
              radiusUnit: location?.radiusUnit,
              place_id: location?.place_id,
              latitude: location?.geometry?.location?.lat ? location?.geometry?.location?.lat : location.latitude,
              longitude: location?.geometry?.location?.lng ? location?.geometry?.location?.lng : location.longitude,
              name: location?.name,
              formatted_address: location?.formatted_address
            }
          })

          let body = { hyperLink, isCenterImage, locations: formattedLocations, ignoreLocations, name, data2 }
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
          
          const platformRes = await dispatch('updatePlatformInfo', platformInfo)
          if (!platformRes.ok) resolve(platformRes)
          else commit('setPlatform', platformRes.platform)
          
          const json = await res.json()
          resolve(json)
        } catch (e) {
          reject(e)
        }
      })
    },
    updatePlatformInfo({ }, { domain, isMainImageForDomain, image_id}) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + `/platform`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ domain, image_id, isMainImageForDomain })
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
