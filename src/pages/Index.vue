<template>
  <q-page class="text-center">
    <img
      alt="Quasar logo"
      src="~assets/logo.png"
      style="max-width: 350px; max-height: 350px"
    />

    <div class="row q-pa-md">
      <div class="col">
        <q-input v-model="form.username" label="Username" />
        <q-input v-model="form.password" label="Password" type="password" />
      </div>
    </div>

    <div class="row q-pa-md">
      <div class="col">
        <q-btn-group spread>
          <q-btn color="primary" label="Submit" @click="onSubmit()" />
          <q-btn color="orange" label="Clear" @click="onReset()" />
        </q-btn-group>
      </div>
    </div>
    <div>Or</div>
    <div class="row q-pa-md">
      <div class="col">
        <q-btn-group spread>
          <q-btn
            outline
            icon="ion-logo-google"
            color="red"
            :label="'Google Sign In'"
            @click="loginG()"
            :disable="isGoogleSignIn"
          />
        </q-btn-group>
      </div>
    </div>
    <div class="row q-px-md">
      <div class="col">
        <q-btn-group spread>
          <q-btn
            outline
            icon="ion-logo-windows"
            color="blue"
            :label="'Microsoft Sign In'"
            @click="loginMs()"
            :disable="isGoogleSignIn"
          />
        </q-btn-group>
      </div>
    </div>

    <!-- <div class="row q-pa-md">
      <div class="col">
        <q-btn-group spread>
          <q-btn
            color="cyan"
            icon="settings"
            label="Setup API"
            @click="onSettings()"
          />
        </q-btn-group>
      </div>
    </div> -->
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { helpers } from "../components/helpers";
import { useRouter } from "vue-router";
import { useStore } from "src/store";
import { Dialog, Notify } from "quasar";

import app from "boot/firebase";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { PublicClientApplication } from "@azure/msal-browser";

export default defineComponent({
  name: "PageIndex",
  mixins: [helpers],
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  created() {
    if (Object.keys(this.userData).length > 0) {
      console.log(this.userData);
      this.$router.push("/home/dashboard");
    }

    this.$msalInstance = new PublicClientApplication({
      auth: {
        clientId: process.env.MS_CLIENTID,
        authority: process.env.MS_AUTHORITY,
      },
      cache: {
        cacheLocation: "localStorage",
      },
    });
  },
  methods: {
    loginG() {
      // this.$gapi.login().then(({ currentUser, gapi, hasGrantedScopes }) => {
      //   console.log({ currentUser, gapi, hasGrantedScopes });
      // });

      const provider = new GoogleAuthProvider();

      provider.addScope("https://www.googleapis.com/auth/drive");

      const auth = getAuth(app);

      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("result", result);
          this.$q.notify({ message: "Sign In Success." });
          this.$store.commit("AuthStore/AuthStoreMutation", result);
          this.$router.push("/home/dashboard");
        })
        .catch((error) => console.log("error", error));
    },
    async onSubmit() {
      const submitLogin = await this.postData(
        {
          loading: true,
          methods: "post",
          url: "DCS/login",
        },
        this.form
      );

      if (submitLogin && submitLogin.status) {
        this.$store.commit("AuthStore/AuthStoreMutation", submitLogin.data);
        this.$router.push("/home/dashboard");
      }
    },
    onReset() {
      this.form.username = "";
      this.form.password = "";
    },
    onSettings() {
      Dialog.create({
        title: "Setup API",
        message:
          "Change your API domain node, don't forget add '/' in the end of url.",
        prompt: {
          model: this.$store.state.AuthStore.rootDomain,
          type: "text", // optional
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          this.$store.commit("AuthStore/DomainMutation", data);
          Notify.create({
            color: "positive",
            message: "API Domain successfully updated !",
          });
          // console.log('>>>> OK, received', data)
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    async loginMs() {
      await this.$msalInstance
        .loginPopup({
          scopes: [
            "user.read",
            "mail.send",
            "Files.ReadWrite.All",
            "Sites.Read.All",
          ],
        })
        .then(async (val) => {
          const myAccounts = this.$msalInstance.getAllAccounts();
          const logs = myAccounts[0];
          const tokenRequest = {
            scopes: [
              "user.read",
              "mail.send",
              "Files.ReadWrite.All",
              "Sites.Read.All",
            ],
            account: logs.username,
          };

          const dataToken = await this.$msalInstance.acquireTokenSilent(
            tokenRequest
          );

          if (dataToken) {
            this.$store.commit("AuthStore/AuthStoreMutation", dataToken);
            this.$router.push("/home/dashboard");
          }
        });
    },
  },
});
</script>
