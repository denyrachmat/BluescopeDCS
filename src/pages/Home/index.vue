<template>
  <div class="q-pa-md">
    <router-view />
    <!-- <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="dashboard">
        <router-view />
      </q-tab-panel>
      <q-tab-panel name="photo">
        <router-view v-slot="{ Component }">
          <component :is="Component" @event-test="$emit('new-test-event')" />
        </router-view>
      </q-tab-panel>
      <q-tab-panel name="settings">
        <router-view />
      </q-tab-panel>
    </q-tab-panels> -->
    <q-separator />
    <q-footer elevated reveal style="z-index: 1">
      <q-tabs v-model="tab" no-caps class="bg-orange text-white shadow-2">
        <q-route-tab
          :to="'/home/dashboard'"
          exact
          replace
          label="Dashboard"
          name="dashboard"
          icon="home"
        />
        <q-route-tab
          :to="'/home/photo'"
          exact
          replace
          label="Photo"
          name="photo"
          icon="camera"
        />
        <q-route-tab
          :to="'/home/settings'"
          exact
          replace
          label="Settings"
          name="settings"
          icon="settings"
        />
      </q-tabs>
    </q-footer>
  </div>
</template>
<script>
import { helpers } from "../../components/helpers";
export default {
  mixins: [helpers],
  data() {
    return {
      tab: "dashboard",
    };
  },
  created() {
    console.log("ini index home");
    console.log(Object.keys(this.userData).length);
    if (Object.keys(this.userData).length === 0) {
      this.$router.push("/");
    }
  },
  methods: {
    navDelay(e, go) {
      e.preventDefault(); // we cancel the default navigation

      // console.log('triggering navigation in 2s')
      setTimeout(() => {
        // console.log('navigating as promised 2s ago')
        go();
      }, 2000);
    },

    navCancel(e) {
      e.preventDefault(); // we cancel the default navigation
    },

    navRedirect(e, go) {
      e.preventDefault(); // we cancel the default navigation
      go("/home/dashboard");
    },

    navPass() {},
  },
};
</script>