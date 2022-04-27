import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import api from "@/api/api";

export default new Vuex.Store({
  state: {
    platform: null,
  },
  getters: {
    getPlatform(state) {
      return state.platform;
    },
  },
  mutations: {
    setPlatform(state, platform) {
      state.platform = platform;
    },
  },
  actions: {
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
    async fetchPlatform({ commit, dispatch }) {
      return new Promise(async (resolve, reject) => {
        try {
          const origin_override = encodeURI(await dispatch("getRedirectUri"));
          const res = await fetch(
            api + "/platform?origin_override=" + origin_override
          );
          const json = await res.json();
          commit("setPlatform", json.platform);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    },
    async getRedirectUri({ dispatch }) {
      const params = await dispatch("getUrlQueryParams");
      return params && params.redirect_uri
        ? params.redirect_uri
        : "https://cochran.wandadvertising.net";
    },
    getUrlQueryParams() {
      const urlSearchParams = new URLSearchParams(window.location.search);
      return Object.fromEntries(urlSearchParams.entries());
    },
    async sendContactForm({ commit, dispatch }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const {
            name,
            email,
            telephone,
            occupation,
            yearsEmployed,
            annualIncome,
            additionalIncome,
            creditScore,
            prequalify,
            termsCheckbox,
            scheduleCheckbox,
            imageData,
            date,
            time,
          } = payload;

          const redirectUri = await dispatch("getRedirectUri");

          const res = await fetch(api + "/form-submission", {
            method: "POST",
            body: JSON.stringify({
              name,
              email,
              telephone,
              occupation,
              yearsEmployed,
              annualIncome,
              additionalIncome,
              creditScore,
              prequalify,
              termsCheckbox,
              scheduleCheckbox,
              imageData,
              redirectUri,
              date,
              time,
            }),
            headers: {
              "Content-Type": "application/json",
            },
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
