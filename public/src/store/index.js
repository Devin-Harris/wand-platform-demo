import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import api from "@/api/api";
const IMAGE_BASE_URL = "https://wandadvertising.com/ads/";

export default new Vuex.Store({
  state: {
    isLoggedIntoEditor: false,
    platform: null,
  },
  getters: {
    getIsLoggedIntoEditor(state) {
      return state.isLoggedIntoEditor;
    },
    getPlatform(state) {
      return state.platform;
    },
  },
  mutations: {
    setIsLoggedIntoEditor(state, isLoggedIntoEditor) {
      state.isLoggedIntoEditor = isLoggedIntoEditor;
    },
    setPlatform(state, platform) {
      state.platform = platform;
    },
  },
  actions: {
    addImage(
      { dispatch, commit, getters },
      {
        hyperLink,
        file,
        isCenterImage,
        locations,
        ignoreLocations,
        name,
        data2Info,
        platformInfo,
        isHyperLinkVideo,
        videoHyperLink,
      }
    ) {
      return new Promise(async (resolve, reject) => {
        try {
          let data2 = null;
          if (data2Info.action === "image") {
            const uploadResponse = await dispatch(
              "uploadImage",
              data2Info.file
            );
            const data = IMAGE_BASE_URL + uploadResponse.name;
            data2 = data;
          } else if (data2Info.action === "youtube") {
            data2 = videoHyperLink;
          } else if (data2Info.action === "iframe") {
            data2 = { data: data2Info.iframeLink, isWidget: true };
          } else if (data2Info.action === "application") {
            data2 = {
              component: data2Info.applicationEmbedName,
              isEmbed: true,
            };
          }

          // format locations
          const formattedLocations = locations.map((location) => {
            return {
              radius: location?.radius,
              radiusUnit: location?.radiusUnit,
              place_id: location?.place_id,
              latitude: location?.geometry?.location?.lat,
              longitude: location?.geometry?.location?.lng,
              name: location?.name,
              formatted_address: location?.formatted_address,
            };
          });

          let body = {
            hyperLink,
            isCenterImage,
            locations: formattedLocations,
            ignoreLocations,
            name,
            isHyperLinkVideo,
          };

          if (data2) {
            body.data2 = data2;
          }
          if (file) {
            const uploadResponse = await dispatch("uploadImage", file);
            const data = IMAGE_BASE_URL + uploadResponse.name;
            body.data = data;
          }

          const res = await fetch(
            api +
              "/add?image_collection_name=" +
              (getters.getPlatform?.images_collection?.collection_name ||
                "images"),
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );
          const json = await res.json();

          platformInfo.image_id = json.image._id;
          const platformRes = await dispatch(
            "updatePlatformInfo",
            platformInfo
          );
          if (!platformRes.ok) resolve(platformRes);
          else commit("setPlatform", platformRes.platform);

          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    checkAuthentication({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + "/auth-check", {
            method: "GET",
            credentials: "include",
          });
          const json = await res.json();
          await commit("setIsLoggedIntoEditor", json.ok);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    uploadImage(_, file) {
      return new Promise(async (resolve, reject) => {
        const formData = new FormData();
        formData.append(file.name, file);
        try {
          const res = await fetch(api + "/upload", {
            method: "POST",
            body: formData,
          });
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async fetchImageById({ getters }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
            api +
              "/image/" +
              id +
              "?image_collection_name=" +
              (getters.getPlatform?.images_collection?.collection_name ||
                "images")
          );
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async fetchCenterImages({ getters }, { ignoreLocations = false } = false) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
            api +
              "/center-images?ignoreLocations=" +
              ignoreLocations +
              "&image_collection_name=" +
              (getters.getPlatform?.images_collection?.collection_name ||
                "images")
          );
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async fetchRimImages({ getters }, { ignoreLocations = false } = false) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
            api +
              "/rim-images?ignoreLocations=" +
              ignoreLocations +
              "&image_collection_name=" +
              (getters.getPlatform?.images_collection?.collection_name ||
                "images")
          );
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async incrementOuterImageClickThruCountById({ getters }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
            api +
              "/click-thru/" +
              id +
              "/outer?image_collection_name=" +
              (getters.getPlatform?.images_collection?.collection_name ||
                "images"),
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async incrementCenterImageClickThruCountById({ getters }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
            api +
              "/click-thru/" +
              id +
              "/center?image_collection_name=" +
              (getters.getPlatform?.images_collection?.collection_name ||
                "images"),
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async createPlatform({ commit }, { domain, images_collection_name }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + "/platform", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ domain, images_collection_name }),
          });
          const json = await res.json();
          commit("setPlatform", json.platform);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async fetchPlatform({ commit, dispatch }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + "/platform");
          const json = await res.json();
          if (!json.platform) {
            await dispatch("createPlatform", {
              domain: window.location.origin,
              images_collection_name: "images",
            });
          } else {
            commit("setPlatform", json.platform);
          }
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async fetchCollections({ commit, dispatch }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + "/collections");
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async googleMapsSearch(_, query) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
            api + "/google-maps-search/" + encodeURI(query)
          );
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async loginToEditor({ commit }, password) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + "/editor-login", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: password,
            }),
          });
          const json = await res.json();
          commit("setIsLoggedIntoEditor", json.ok);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    deleteImageById({ getters }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
            api +
              "/delete/" +
              id +
              "?image_collection_name=" +
              (getters.getPlatform?.images_collection?.collection_name ||
                "images"),
            {
              method: "DELETE",
            }
          );
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    deleteImageByPath(_, path) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + "/delete-path", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ path }),
          });
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    updateImageById({ getters, commit, dispatch }, { id, payload }) {
      const {
        prevDataPath,
        file,
        hyperLink,
        isCenterImage,
        locations,
        ignoreLocations,
        name,
        data2Info,
        platformInfo,
        isHyperLinkVideo,
        videoHyperLink,
        hasCoverImage,
      } = payload;
      return new Promise(async (resolve, reject) => {
        try {
          let data2 = null;
          if (data2Info.action === "image") {
            const uploadResponse = await dispatch(
              "uploadImage",
              data2Info.file
            );
            const data = IMAGE_BASE_URL + uploadResponse.name;
            data2 = data;
          } else if (data2Info.action === "youtube") {
            data2 = videoHyperLink;
          } else if (data2Info.action === "iframe") {
            data2 = { data: data2Info.iframeLink, isWidget: true };
          } else if (data2Info.action === "application") {
            data2 = {
              component: data2Info.applicationEmbedName,
              isEmbed: true,
            };
          }

          // format locations
          const formattedLocations = locations.map((location) => {
            return {
              radius: location?.radius,
              radiusUnit: location?.radiusUnit,
              place_id: location?.place_id,
              latitude: location?.geometry?.location?.lat
                ? location?.geometry?.location?.lat
                : location.latitude,
              longitude: location?.geometry?.location?.lng
                ? location?.geometry?.location?.lng
                : location.longitude,
              name: location?.name,
              formatted_address: location?.formatted_address,
            };
          });

          let body = {
            hyperLink,
            isCenterImage,
            locations: formattedLocations,
            ignoreLocations,
            name,
            isHyperLinkVideo,
            hasCoverImage,
          };
          if (data2) {
            body.data2 = data2;
          }
          if (file) {
            const uploadResponse = await dispatch("uploadImage", file);
            const data = IMAGE_BASE_URL + uploadResponse.name;
            body.data = data;
            await dispatch("deleteImageByPath", prevDataPath);
          }

          const res = await fetch(
            api +
              "/edit/" +
              id +
              "?image_collection_name=" +
              (getters.getPlatform?.images_collection?.collection_name ||
                "images"),
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );

          const platformRes = await dispatch(
            "updatePlatformInfo",
            platformInfo
          );
          if (!platformRes.ok) resolve(platformRes);
          else commit("setPlatform", platformRes.platform);

          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    updatePlatformInfo(
      { getters, commit },
      { domain, isMainImageForDomain, image_id, name, images_collection }
    ) {
      let body = {
        domain,
      };
      if (image_id) {
        body = { ...body, image_id, isMainImageForDomain };
      }
      if (name) {
        body = { ...body, name };
      }
      if (images_collection) {
        body = { ...body, images_collection };
      }
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + `/platform`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          const json = await res.json();
          commit("setPlatform", json.platform);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    createCollection(
      { getters, commit },
      { name, duplicate_from_collection, action }
    ) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + `/collections`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, duplicate_from_collection, action }),
          });
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    deleteCollection({ getters, commit }, { collection_name, _id }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + `/collections`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ collection_name, _id }),
          });
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    tranlateText(_, { text, options }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + "/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, options }),
          });
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    getLanguageCodes() {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(api + "/languages", {
            method: "GET",
          });
          const json = await res.json();
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
  },
});
