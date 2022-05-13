<template>
  <div>
    Settings
    <q-separator />

    <div class="q-py-md">
      <q-btn-group spread>
        <q-btn
          label="Logout"
          color="red"
          icon="logout"
          @click="onLogout"
        ></q-btn>
        <!-- <q-btn label="Exit" color="orange" icon="close" @click="onExit"></q-btn> -->
      </q-btn-group>
    </div>
  </div>
</template>
<script>
import { helpers } from "../../components/helpers";
import { Dialog } from "quasar";
import { App } from "@capacitor/app";

export default {
  mixins: [helpers],
  created() {
    console.log("test masuk settings");
  },
  methods: {
    onLogout() {
      Dialog.create({
        title: "Alert",
        message: "Are you sure want to logout from this app ?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          this.$store.commit("AuthStore/AuthStoreMutation", []);
          this.$router.push("/");
        })
        .onCancel(() => {
          // console.log('Cancel')
        });
    },
    onExit() {
      Dialog.create({
        title: "Alert",
        message: "Are you sure want to exit from this app ?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          App.exitApp();
        })
        .onCancel(() => {
          // console.log('Cancel')
        });
    },
  },
};
</script>