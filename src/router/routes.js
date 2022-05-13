const routes = [
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "", component: () => import("pages/Home/index.vue"),
        children: [
          { path: "dashboard", component: () => import("pages/Home/dashboard.vue") },
          { path: "photo", component: () => import("pages/Home/photo.vue") },
          { path: "settings", component: () => import("pages/Home/settings.vue") }
        ]
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
