import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import VuexPersist from 'vuex-persist'

// import example from './module-example'

import AuthStore from './AuthStore'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const vuexPersist = new VuexPersist({
    key: 'vuexDatabase',
    storage: window.localStorage
  })

  const Store = createStore({
    modules: {
      AuthStore
      // example
    },
    plugins: [vuexPersist.plugin],

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
