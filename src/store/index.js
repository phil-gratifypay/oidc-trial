/**
 * Vuex
 *
 * @library
 *
 * https://vuex.vuejs.org/en/
 */

// Lib imports
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// Create a new store
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  // plugins: [VuexORM.install(database)]
});

export default store;
