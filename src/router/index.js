import { createApp } from 'vue'
import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

// const app = createApp({})

// app.use(VueGapi, {
//   apiKey: 'AIzaSyBTK-MYxSDDxpabGO5dkr8gsNNp6TBb498',
//   clientId: '319839061159-2j6ej0tnutagpqg14jpughh4ku10tf22.apps.googleusercontent.com',
//   discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
//   scope: 'https://www.googleapis.com/auth/drive',
//   refreshToken: true,
// })
// app.config.globalProperties.$ggl = app.config.globalProperties.$gapi
// console.log(app.config.globalProperties)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach(async (to, from, next) => {
    const auth = to.meta.requiresAuth
    if (auth && !await firebase.getCurrentUser()) {
      next('/');
    } else {
      next();
    }
  })

  return Router;
});
