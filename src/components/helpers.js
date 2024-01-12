import { Notify, Loading, QSpinnerFacebook } from "quasar";

export const helpers = {
  computed: {
    mainUrl: {
      get() {
        let storage = JSON.parse(localStorage.getItem("vuexDatabase"));
        if (storage) {
          return process.env.API;
        } else {
          return process.env.API;
        }
      }
    },
    mainUrlStorage: {
      get() {
        let storage = JSON.parse(localStorage.getItem("vuexDatabase"));
        if (storage) {
          return process.env.API_STORAGE;
        } else {
          return process.env.API_STORAGE;
        }
      }
    },
    userData: {
      get() {
        let storage = JSON.parse(localStorage.getItem("vuexDatabase"));
        if (storage) {
          return storage.AuthStore.authDet;
        } else {
          return this.$store.state.AuthStore.authDet;
        }
      }
    },
    formsData: {
      get() {
        let storage = JSON.parse(localStorage.getItem("vuexDatabase"));
        if (storage) {
          return storage.AuthStore.storedList;
        } else {
          return this.$store.state.AuthStore.storedList;
        }
      }
    }
  },
  methods: {
    postData(opt, request = null, wholeReturn = false, useMainURL = true) {
      if (opt.loading) {
        Loading.show({
          spinner: QSpinnerFacebook,
          spinnerSize: 140,
          backgroundColor: "cyan",
          message: "Some important process is in progress. Hang on...",
          messageColor: "black"
        });
      }

      if (request) {
        if (useMainURL) {
          var header = this.$axios[opt.methods](this.mainUrl + opt.url, request);

          if (opt.header) {
            var header = this.$axios[opt.methods](this.mainUrl + opt.url, request, { headers: opt.header });
          }
        } else {
          var header = this.$axios[opt.methods](opt.url, request);

          if (opt.header) {
            var header = this.$axios[opt.methods](opt.url, request, { headers: opt.header });
          }
        }
      } else {
        if (useMainURL) {
          var header = this.$axios[opt.methods](this.mainUrl + opt.url);

          if (opt.header) {
            var header = this.$axios[opt.methods](this.mainUrl + opt.url, { headers: opt.header });
          }
        } else {
          var header = this.$axios[opt.methods](opt.url);

          if (opt.header) {
            var header = this.$axios[opt.methods](opt.url, { headers: opt.header });
          }
        }
      }

      let req = header
        .then(res => {
          if (opt.loading) {
            Loading.hide();
          }

          return wholeReturn ? res : res.data;
        })
        .catch(e => {
          console.log(e)
          if (opt.loading) {
            Loading.hide();
          }

          if (e.response) {
            if (e.response.status == 422) {
              let errors = e.response.data.errors;
              Object.keys(errors).map(val => {
                errors[val].map(val_det => {
                  Notify({
                    color: "negative",
                    message: val_det
                  });
                });
              });
            }

            if (e.response.status == 401) {
              Notify.create({
                color: "negative",
                message: e.response.data.message
              });
            }
          }
        });

      return req;
    },
  },
}
